import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import slugify from "slugify";
import fs from 'fs';
import { fileURLToPath } from 'url';
import "./config/passport.js";
import GoogleStrategy from "passport-google-oauth20";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

// Fix __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const JWT_SECRET = 'fortune-realestate-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Article uploader: allow image and video files up to 10MB
const articleMediaFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image or video files are allowed for article media"), false);
  }
};

// Create uploads directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);

  // Get title name safely
  let title = req.body.title || "property";

  // clean: replace spaces → underscores, remove special chars
  title = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

  const unique = Date.now();

  cb(null, `${title}_${unique}${ext}`);
}

});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Database initialization
const db = new sqlite3.Database('fortune_realestate.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'normal',
    full_name TEXT,
    phone TEXT,
    profile_photo TEXT,
    rating REAL DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
  )`, (err) => {
    if (err) console.log("Users table error:", err);
  });
  db.run(`ALTER TABLE users ADD COLUMN otp TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN otp_expiry INTEGER`, () => {});


  // ✅ Fixed properties table (added missing columns)
  db.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    price REAL NOT NULL,
    location TEXT NOT NULL,
    area REAL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    photos TEXT,
    single_owner TEXT,   -- ✅ Added
    owner_name TEXT,     -- ✅ Added
    linked_docx TEXT,    -- ✅ Added
    user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Create notifications table
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (property_id) REFERENCES properties (id)
  )`);
  // Create wishlist table
  db.run(`CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (property_id) REFERENCES properties (id)
  )`);
  // Create articles table
  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);


  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    `INSERT OR IGNORE INTO users (username, email, password, role, full_name) 
     VALUES ('admin', 'admin@fortune.com', ?, 'admin', 'Fortune Admin')`,
    [adminPassword]
  );
  
}
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());



app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // must be false for localhost
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);


app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// FINAL CALLBACK (ONLY ONE)
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    // create JWT and redirect to frontend
    const token = jwt.sign(
      {
        name: req.user.displayName,
        email: req.user.emails[0].value,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.redirect(
      `http://localhost:5173/social-login-success?token=${token}`
    );
  }
);

// check user session
app.get("/auth/user", (req, res) => {
  if (req.user) return res.json({ loggedIn: true, user: req.user });
  res.json({ loggedIn: false });
});

// logout
app.post("/auth/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });
});


// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};


// ----------------- Routes -----------------

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role = 'normal', fullName, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password, role, full_name, phone) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, role, fullName, phone],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        const token = jwt.sign(
          { id: this.lastID, username, role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          token,
          user: { id: this.lastID, username, email, role, fullName, phone }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, username],
    async (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.is_active) {
        return res.status(401).json({ error: 'Account is deactivated' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
          phone: user.phone,
          profilePhoto: user.profile_photo,
          rating: user.rating
        }
      });
    }
  );
});
// Properties (public & user)
app.get('/api/properties', (req, res) => {
  const { type, location, minPrice, maxPrice, status = 'approved' } = req.query;

  let query = `
    SELECT p.*, u.username, u.full_name, u.profile_photo, u.rating, u.phone
    FROM properties p
    JOIN users u ON p.user_id = u.id
    WHERE p.status = ?
  `;
  const params = [status];

  if (type && type !== 'all') {
    query += ' AND p.transaction_type = ?';
    params.push(type);
  }

  if (location) {
    query += ' AND p.location LIKE ?';
    params.push(`%${location}%`);
  }

  if (minPrice) {
    query += ' AND p.price >= ?';
    params.push(minPrice);
  }

  if (maxPrice) {
    query += ' AND p.price <= ?';
    params.push(maxPrice);
  }

  query += ' ORDER BY p.created_at DESC';

  db.all(query, params, (err, properties) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const processedProperties = properties.map((p) => ({
      ...p,
      photos: p.photos ? JSON.parse(p.photos) : []
    }));

    res.json(processedProperties);
  });
});

// Add new property
app.post('/api/properties', authenticateToken, upload.array('photos', 10), (req, res) => {
  try {
   const {
  title,
  description,
  propertyType,
  transactionType,
  price,
  location,
  area,
  bedrooms,
  bathrooms,
  singleOwner,
  ownerName,
  linkedDocx
} = req.body;

const photos = req.files ? req.files.map((f) => f.filename) : [];

db.run(
  `INSERT INTO properties 
   (title, description, property_type, transaction_type, price, location, area, bedrooms, bathrooms, photos, user_id, single_owner, owner_name, linked_docx)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    title,
    description,
    propertyType,
    transactionType,
    price,
    location,
    area,
    bedrooms,
    bathrooms,
    JSON.stringify(photos),
    req.user.id,
    singleOwner,
    ownerName,
    linkedDocx
  ],
  function (err) {
    if (err) return res.status(500).json({ error: 'Failed to create property' });

    db.run(
      'INSERT INTO notifications (user_id, property_id, message, type) SELECT id, ?, ?, ? FROM users WHERE role = "admin"',
      [this.lastID, `New property "${title}" submitted for approval`, 'property_submission']
    );

    res.json({
      id: this.lastID,
      message: 'Property submitted successfully. Waiting for admin approval.'
    });
  }
);

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/api/properties', (req, res) => {
  try {
    const { type, location, minPrice, maxPrice } = req.query;

    let query = `
      SELECT * FROM properties
      WHERE 1=1
    `;
    const params = [];

    if (type && type !== 'all') {
      // Normalize case
      const normalized = type.toLowerCase();

      // ✅ Match transaction_type OR category OR property_type
      query += `
        AND (
          LOWER(transaction_type) = ?
          OR LOWER(category) = ?
          OR LOWER(property_type) LIKE ?
        )
      `;
      params.push(normalized, normalized, `%${normalized}%`);
    }

    if (location) {
      query += ` AND LOWER(location) LIKE LOWER(?)`;
      params.push(`%${location}%`);
    }

    if (minPrice) {
      query += ` AND price >= ?`;
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ` AND price <= ?`;
      params.push(maxPrice);
    }

    query += ` ORDER BY id DESC`;

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('❌ DB Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/api/locations', (req, res) => {
  db.all('SELECT DISTINCT location FROM properties WHERE location IS NOT NULL', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch locations' });
    const locations = rows.map(r => r.location);
    res.json(locations);
  });
});


// ---------------- Admin Routes ----------------
// (unchanged logic, just modernized imports)

// Get all properties
app.get('/api/admin/properties', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `
    SELECT p.*, u.username, u.full_name, u.email, u.phone
    FROM properties p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `,
    (err, properties) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const processed = properties.map((p) => ({
        ...p,
        photos: p.photos ? JSON.parse(p.photos) : []
      }));

      res.json(processed);
    }
  );
});

// Update property status
app.patch('/api/admin/properties/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  const propertyId = req.params.id;

  db.run(
    'UPDATE properties SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, propertyId],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });

      db.get(
        'SELECT title, user_id FROM properties WHERE id = ?',
        [propertyId],
        (err, property) => {
          if (property) {
            const message =
              status === 'approved'
                ? `Your property "${property.title}" has been approved and is now live`
                : `Your property "${property.title}" has been rejected`;

            db.run(
              'INSERT INTO notifications (user_id, property_id, message, type) VALUES (?, ?, ?, ?)',
              [property.user_id, propertyId, message, 'property_status']
            );
          }
        }
      );

      res.json({ message: `Property ${status} successfully` });
    }
  );
});

// Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `
    SELECT u.*, 
           COUNT(p.id) as total_properties,
           COUNT(CASE WHEN p.status = 'approved' THEN 1 END) as approved_properties
    FROM users u
    LEFT JOIN properties p ON u.id = p.user_id
    WHERE u.role != 'admin'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `,
    (err, users) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(users);
    }
  );
});
const articleUpload = multer({
  storage: storage, // reuse same storage config (uploads folder)
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: articleMediaFilter,
});

// ----------------- ADMIN POST ARTICLE (with file upload) -----------------
// -------- GET ARTICLE BY ID (for editing) --------
app.get("/api/admin/article/:id", authenticateToken, requireAdmin, (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM articles WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!row) return res.status(404).json({ error: "Article not found" });

    res.json(row);
  });
});



app.post(
  "/api/admin/article",
  authenticateToken,
  requireAdmin,
  articleUpload.single("media"), // expecting field name "media"
  (req, res) => {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        // if a file was uploaded but body invalid, remove file to avoid orphan files
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, () => {});
        }
        return res.status(400).json({ error: "Title and content are required" });
      }

      // file saved by multer, filename accessible at req.file.filename (or undefined)
      const image = req.file ? req.file.filename : null;

      // create unique SEO slug
      const slugBase = slugify(title, { lower: true, strict: true });
      let slug = slugBase;
      // ensure uniqueness: append number if same slug exists
      db.get("SELECT COUNT(*) as cnt FROM articles WHERE slug = ?", [slug], (err, row) => {
        if (err) {
          console.error("DB error checking slug:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const tryInsert = (finalSlug) => {
          db.run(
            `INSERT INTO articles (title, slug, content, image)
              VALUES (?, ?, ?, ?)`,
            [title, finalSlug, content, image],
            function (err) {
              if (err) {
                console.error("DB insert error:", err);
                // cleanup uploaded file on failure
                if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
                return res.status(500).json({ error: "Failed to create article" });
              }

              res.json({
                success: true,
                message: "Article posted successfully",
                id: this.lastID,
                slug: finalSlug,
                image,
              });
            }
          );
        };

        if (row && row.cnt > 0) {
          // slug exists — append timestamp
          slug = `${slugBase}-${Date.now()}`;
        }
        tryInsert(slug);
      });
    } catch (err) {
      console.error("Server error posting article:", err);
      if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
      res.status(500).json({ error: "Server error" });
    }
  }
);
app.delete("/api/admin/article/:id", authenticateToken, requireAdmin, (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM articles WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: "Delete failed" });

    res.json({ success: true, message: "Article deleted" });
  });
});


// ----------------- GET ALL ARTICLES -----------------
app.get("/api/articles", (req, res) => {
  db.all(`SELECT * FROM articles ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch articles" });
    res.json(rows);
  });
});
// ----------------- GET SINGLE ARTICLE BY SLUG -----------------
app.get("/api/article/:slug", (req, res) => {
  const slug = req.params.slug;

  db.get(`SELECT * FROM articles WHERE slug = ?`, [slug], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!row) return res.status(404).json({ error: "Article not found" });

    res.json(row);
  });
});
// -------- UPDATE ARTICLE --------
app.put(
  "/api/admin/article/:id",
  authenticateToken,
  requireAdmin,
  articleUpload.single("media"), // optional new image
  (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    const newImage = req.file ? req.file.filename : null;

    // Get existing article
    db.get("SELECT * FROM articles WHERE id = ?", [id], (err, existing) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!existing) return res.status(404).json({ error: "Article not found" });

      const finalImage = newImage ? newImage : existing.image;

      // If new image uploaded → remove old image
      if (newImage && existing.image) {
        const oldPath = `uploads/${existing.image}`;
        if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => {});
      }

      db.run(
        `UPDATE articles 
         SET title = ?, content = ?, image = ?
         WHERE id = ?`,
        [title, content, finalImage, id],
        function (err) {
          if (err) return res.status(500).json({ error: "Update failed" });

          res.json({
            success: true,
            message: "Article updated successfully",
            image: finalImage,
          });
        }
      );
    });
  }
);


// ---------------- User Dashboard ----------------

// User properties
app.get('/api/user/properties', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM properties WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, properties) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const processed = properties.map((p) => ({
        ...p,
        photos: p.photos ? JSON.parse(p.photos) : []
      }));

      res.json(processed);
    }
  );
});

// Notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [req.user.id],
    (err, notifications) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(notifications);
    }
  );
});

app.patch('/api/notifications/:id/read', authenticateToken, (req, res) => {
  db.run(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Notification marked as read' });
    }
  );
});








// ---------------- Wishlist Routes ----------------

// Get all wishlist properties for the logged-in user
app.get('/api/wishlist', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    `
    SELECT p.*, u.username, u.full_name, u.profile_photo, u.phone, u.rating
    FROM wishlists w
    JOIN properties p ON w.property_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows.map((p) => ({ ...p, photos: p.photos ? JSON.parse(p.photos) : [] })));
    }
  );
});

// Add property to wishlist
app.post('/api/wishlist/:propertyId', authenticateToken, (req, res) => {
  db.run(
    `INSERT OR IGNORE INTO wishlists (user_id, property_id) VALUES (?, ?)`,
    [req.user.id, req.params.propertyId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Added to wishlist' });
    }
  );
});

// Remove property from wishlist
app.delete('/api/wishlist/:propertyId', authenticateToken, (req, res) => {
  db.run(
    `DELETE FROM wishlists WHERE user_id = ? AND property_id = ?`,
    [req.user.id, req.params.propertyId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Removed from wishlist' });
    }
  );
});
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,      // e.g. "nikhil.fortunefloors@gmail.com"
    pass: process.env.MAIL_PASSWORD,  // Gmail App Password
  },
});
// -----------------------------
// LOGIN OTP – Send OTP
// -----------------------------
app.post("/api/send-otp", (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false });

  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save to session
  req.session.loginOtp = otp;
  req.session.loginPhone = phone;

  console.log("OTP for login:", otp);

  return res.json({ success: true, message: "OTP sent!" });
});


// -----------------------------
// LOGIN OTP – Verify OTP
// -----------------------------
app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  console.log("VERIFY OTP BODY:", req.body);
  console.log("SESSION OTP:", req.session.loginOtp);
  console.log("SESSION PHONE:", req.session.loginPhone);

  if (!req.session.loginOtp || !req.session.loginPhone) {
    return res.status(400).json({ success: false, error: "Session expired" });
  }

  if (req.session.loginPhone !== phone) {
    return res.status(400).json({ success: false, error: "Phone mismatch" });
  }

  if (String(req.session.loginOtp) !== String(otp)) {
    return res.status(400).json({ success: false, error: "Invalid OTP" });
  }

  // OTP matched → Clear Session
  req.session.loginOtp = null;
  req.session.loginPhone = null;

  return res.json({
    success: true,
    message: "OTP verified",
    token: "dummy-jwt-here"
  });
});



// ---------------- FORGOT PASSWORD ----------------
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user) {
      return res.status(400).json({ error: "Email not registered" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Save OTP
    db.run(
      `UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?`,
      [otp, expiry, email],
      (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        // Send OTP Email
        transporter.sendMail({
          from: "nikhil.fortunefloors@gmail.com",
          to: email,
          subject: "Your Password Reset OTP",
          text: `Subject: Fortune Floors – Password Reset OTP

 Dear User,
Welcome to Fortune Floors.
  
You requested to reset your password, and we are here to assist you.Please use the One-Time Password (OTP) provided below:
Your OTP: ${otp}
This OTP is valid for the next 5 minutes.
If you did not request a password reset, please ignore this email.

Thank you,
Fortune Floors Support Team`
        });

        res.json({ message: "OTP sent to email" });
      }
    );
  });
});
// ---------------- RESET PASSWORD ----------------
app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > user.otp_expiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    db.run(
      `UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?`,
      [hashed, email],
      (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ message: "Password updated successfully" });
      }
    );
  });
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`
User-agent: *
Allow: /

Sitemap: https://fortunefloors.com/sitemap.xml
  `);
});

// ---------- DYNAMIC SITEMAP ---------- //
app.get("/sitemap.xml", (req, res) => {
  try {
    db.all("SELECT title, location FROM properties WHERE status = 'approved'", [], (err, rows) => {
      if (err) {
        console.error("Sitemap DB error:", err);
        return res.status(500).send("Error generating sitemap");
      }

      const createSlug = (title, location) =>
        `${title}-${location}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      const urls = rows
        .map(
          (p) => `
        <url>
          <loc>https://fortunefloors.com/property/${createSlug(
            p.title,
            p.location
          )}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>`
        )
        .join("");

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://fortunefloors.com/</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>https://fortunefloors.com/all-properties</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
       

        
        ${urls}
      </urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Sitemap generation error");
  }
});

// session setup
app.get("/auth/google/callback", (req, res, next) => {
  console.log("🔥 CALLBACK HIT!");
  next();
});
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);



// ---- Serve React Build ----
const reactBuildPath = path.join(__dirname, "../frontend/build");

if (fs.existsSync(reactBuildPath)) {
  app.use(express.static(reactBuildPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"));
  });
} else {
  console.log("⚠️ React build folder not found locally. Skipping static serve.");
}



app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
