import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import slugify from "slugify";
import webpush from 'web-push';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import micrositeRoute from "./routes/microsite.js";

dotenv.config();




// Fix __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const JWT_SECRET = 'fortune-realestate-secret-key';

// Middleware
app.use(
  cors({
    origin: [
      "https://fortunefloors.com",
      "https://www.fortunefloors.com",
      "http://localhost:5173",
      "http://localhost:5000"

    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());
app.use("/api", micrositeRoute);
app.use(
  "/microsites",
  express.static(path.join(__dirname, "microsites"))
);
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});


app.get('/api/test', (req, res) => {
  res.json({ message: "API working fine!" });
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

const safeText = (v) => {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object") {
    return v.value || v.label || null;
  }
  return String(v);
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  }, 
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + 4 + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
// 🔥 Article Upload Multer (10MB for image or video)
const BlogsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  }
});

const BlogsUpload = multer({
  storage: BlogsStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image or video allowed!"), false);
    }
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
// ================= INTERIOR UPLOAD =================
const uploadInterior = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});



// VAPID setup
webpush.setVapidDetails(
  'mailto:nikhil.fortunefloors@gmail.com',  // Replace with your email
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);



const authenticateOptional = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  });
};


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
  db.run(`
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,

  title TEXT NOT NULL,
  description TEXT,

  property_type TEXT,
  transaction_type TEXT,
  listing_sub_type TEXT,
  category TEXT,
  pgCategory TEXT,

  price REAL NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pincode TEXT,
  locality TEXT,

  area REAL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  furnishing TEXT,

  ready_to_move INTEGER DEFAULT 0,
  direct_from_owner INTEGER DEFAULT 0,
  bachelor_friendly INTEGER DEFAULT 0,

  single_owner TEXT,
  owner_name TEXT,
  linked_docx TEXT,

  floor_number INTEGER,
  total_floors INTEGER,
  age_of_construction TEXT,
  facing TEXT,

  photos TEXT,
  slug TEXT,

  status TEXT DEFAULT 'pending',
  rejection_message TEXT,
  is_deleted INTEGER DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)
)`, (err) => {
    if (err) console.log("Users table error:", err);
  });
  db.run(`ALTER TABLE users ADD COLUMN otp TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN otp_expiry INTEGER`, () => {});
  db.run(`ALTER TABLE interiors ADD COLUMN photos TEXT`, () => {});
    cleanupInvalidAddressData();


  // ===== PROPERTY ADDRESS NORMALIZATION =====
  db.run(`ALTER TABLE properties ADD COLUMN city TEXT`, () => {});
  db.run(`ALTER TABLE properties ADD COLUMN state TEXT`, () => {});
  db.run(`ALTER TABLE properties ADD COLUMN pincode TEXT`, () => {});
  db.run(`ALTER TABLE properties ADD COLUMN rejection_message TEXT`, () => {});
  
  db.all("PRAGMA table_info(blogs)", (err, columns) => {
  if (err) return;

  const hasCategory = columns.some(col => col.name === "category");

  if (!hasCategory) {
    db.run("ALTER TABLE blogs ADD COLUMN category TEXT");
  }
  // ================= LEADS TABLE =================
db.run(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    owner_id INTEGER NOT NULL,
    lead_user_id INTEGER,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties (id),
    FOREIGN KEY (owner_id) REFERENCES users (id),
    FOREIGN KEY (lead_user_id) REFERENCES users (id)
  )
`, (err) => {
  if (err) {
    console.error("", err);
  } else {
    console.log("");
  }
});

});



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
  // ================= INTERIORS TABLE =================
db.run(`
  CREATE TABLE IF NOT EXISTS interiors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,

    title TEXT NOT NULL,
    experience INTEGER,
    starting_price INTEGER,
    service_area TEXT,

    profession TEXT,        -- JSON
    property_served TEXT,   -- JSON
    project_type TEXT,      -- JSON
    

    photos TEXT,            -- JSON
    status TEXT DEFAULT 'pending',
    rejection_message TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

  // ✅ AUTO-CREATE society_reviews TABLE (SAFE)
    db.run(`
      CREATE TABLE IF NOT EXISTS society_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_slug TEXT NOT NULL,
        rating INTEGER DEFAULT 0,
        review TEXT,
        reviewer_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error("", err);
      } else {
        console.log("");
      }
    });


  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    `INSERT OR IGNORE INTO users (username, email, password, role, full_name) 
     VALUES ('admin', 'admin@fortune.com', ?, 'admin', 'Fortune Admin')`,
    [adminPassword]
  );
  let subscriptions = []; // Replace with your DB later
  // Add this INSIDE initializeDatabase() function
db.run(`CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

  // Create Blogs table
db.run(`CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT,
  content TEXT,
  image TEXT,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

function ensureColumn(columnName, type = "TEXT") {
  db.all("PRAGMA table_info(properties)", [], (err, columns) => {
    if (err) return console.error(err);

    const exists = columns.some(col => col.name === columnName);

    if (!exists) {
      db.run(
        `ALTER TABLE properties ADD COLUMN ${columnName} ${type}`,
        [],
        (err) => {
          if (err) {
            console.error(`❌ Failed to add column ${columnName}`, err);
          } else {
            console.log(`✅ Column added: ${columnName}`);
          }
        }
      );
    }
  });
}

}
function addColumnIfNotExists(column, definition) {
  db.all("PRAGMA table_info(properties)", [], (err, columns) => {
    if (err) return console.error(err);

    const exists = columns.some((c) => c.name === column);
    if (!exists) {
      db.run(`ALTER TABLE properties ADD COLUMN ${column} ${definition}`);
    }
  });
}
function cleanupInvalidAddressData() {
  const queries = [
    `UPDATE properties SET city = NULL WHERE city = '[object Object]'`,
    `UPDATE properties SET state = NULL WHERE state = '[object Object]'`,
    `UPDATE properties SET locality = NULL WHERE locality = '[object Object]'`,
    `UPDATE properties SET pincode = NULL WHERE pincode = '[object Object]'`
  ];

  queries.forEach((q) => {
    db.run(q, function (err) {
      if (err) {
        console.error("❌ Cleanup error:", err.message);
      } else if (this.changes > 0) {
        console.log(`🧹 Cleaned ${this.changes} rows`);
      }
    });
  });
}


// Call once on server start
addColumnIfNotExists("listing_sub_type", "TEXT");
addColumnIfNotExists("category", "TEXT");
addColumnIfNotExists("furnishing", "TEXT");
addColumnIfNotExists("ready_to_move", "INTEGER DEFAULT 0");
addColumnIfNotExists("direct_from_owner", "INTEGER DEFAULT 0");
addColumnIfNotExists("bachelor_friendly", "INTEGER DEFAULT 0");
addColumnIfNotExists("city", "TEXT");
addColumnIfNotExists("state", "TEXT");
addColumnIfNotExists("pincode", "TEXT");
addColumnIfNotExists("locality", "TEXT");
addColumnIfNotExists("slug", "TEXT");
addColumnIfNotExists("pgCategory", "TEXT");

db.all(
  "SELECT id, title, location FROM properties WHERE slug IS NULL OR slug = ''",
  [],
  (err, rows) => {
    if (err) return console.error(err);

    rows.forEach((p) => {
      const baseSlug = slugify(`${p.title}-${p.location}`, {
        lower: true,
        strict: true,
      });

      const uniqueSlug = `${baseSlug}-${p.id}`;

      db.run(
        "UPDATE properties SET slug = ? WHERE id = ?",
        [uniqueSlug, p.id]
      );
    });
  }
);



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





// Add new property
// ================= ADD NEW PROPERTY (FIXED WITH SLUG) =================
app.post(
  "/api/properties",
  authenticateToken,
  upload.array("photos", 10),
  (req, res) => {
    try {
      const {
        title,
        description,
        propertyType,
        transactionType,
        listingSubType,
        category,
        price,
        pgCategory,
        location,
        city,
        state,
        pincode,
        locality,
        area,
        bedrooms,
        bathrooms,
        furnishing,
        readyToMove,
        directFromOwner,
        bachelorFriendly,
        singleOwner,
        ownerName,
        linkedDocx,
        floorNumber,
        totalFloors,
        ageOfConstruction,
        facing
      } = req.body;

      if (!title || !price || !location) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const photos = req.files ? req.files.map((f) => f.filename) : [];

      // ✅ CREATE SLUG ONCE (SOURCE OF TRUTH)
      const slug = slugify(`${title}-${location}`, {
        lower: true,
        strict: true,
      });

      const values = [
        title,
        description,
        propertyType,
        transactionType,
        listingSubType,
        category,
        price,
        pgCategory,
        location,
        city,
        state,
        pincode,
        locality,
        area,
        bedrooms,
        bathrooms,
        furnishing,
        readyToMove === "true" || readyToMove === true ? 1 : 0,
        directFromOwner === "true" || directFromOwner === true ? 1 : 0,
        bachelorFriendly === "true" || bachelorFriendly === true ? 1 : 0,
        JSON.stringify(photos),
        req.user.id,
        singleOwner,
        ownerName,
        linkedDocx,
        floorNumber,
        totalFloors,
        ageOfConstruction,
        facing,
        slug // ✅ IMPORTANT
      ];

      db.run(
        `INSERT INTO properties (
          title,
          description,
          property_type,
          transaction_type,
          listing_sub_type,
          category,
          price,
          pgCategory,
          location,
          city,
          state,
          pincode,
          locality,
          area,
          bedrooms,
          bathrooms,
          furnishing,
          ready_to_move,
          direct_from_owner,
          bachelor_friendly,
          photos,
          user_id,
          single_owner,
          owner_name,
          linked_docx,
          floor_number,
          total_floors,
          age_of_construction,
          facing,
          slug
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
        values,
        function (err) {
          if (err) {
            console.error("❌ INSERT ERROR:", err);
            return res.status(500).json({ error: "Failed to create property" });
          }

          // 🔔 Notify Admins
          db.run(
            `INSERT INTO notifications (user_id, property_id, message, type)
             SELECT id, ?, ?, ? FROM users WHERE role = 'admin'`,
            [
              this.lastID,
              `New property "${title}" submitted for approval`,
              "property_submission",
            ]
          );

          res.json({
            id: this.lastID,
            slug,
            message: "Property submitted successfully. Waiting for admin approval.",
          });
        }
      );
    } catch (error) {
      console.error("❌ Server Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);
app.get("/api/properties", (req, res) => {
  try {
    const {
      type,
      category,
      subType,
      furnishing,
      readyToMove,
      directFromOwner,
      bachelorFriendly,
      location,
      minPrice,
      maxPrice,
      floorNumber,
      totalFloors,
      ageOfConstruction,
      facing,
      status,
      propertyType,
      pgCategory
    } = req.query;

    let query = `
      SELECT 
        p.*, 
        u.username,
        u.full_name,
        u.profile_photo,
        u.rating,
        u.phone
      FROM properties p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    /* ================= STATUS ================= */
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    // 🔥 NO DEFAULT STATUS FILTER

    /* ================= TRANSACTION ================= */
    if (type && type !== "all") {
      const t = type.toLowerCase();
      if (t === "rent") {
        query += ` AND p.transaction_type = 'rent'`;
      }
      if (["buy", "sale", "sell"].includes(t)) {
        query += ` AND p.transaction_type = 'sale'`;
      }
    }

    /* ================= PROPERTY TYPE ================= */

    // ✅ PG
    if (propertyType === "pg") {
      query += ` AND LOWER(p.property_type) LIKE '%pg%'`;

      if (pgCategory) {
        const cat = pgCategory.toLowerCase();
        if (cat === "men" || cat === "male") {
          query += ` AND LOWER(p.property_type) LIKE '%male%'`;
        } else if (cat === "girls" || cat === "female") {
          query += ` AND LOWER(p.property_type) LIKE '%female%'`;
        } else if (cat === "coliving") {
          query += ` AND LOWER(p.property_type) LIKE '%co-living%'`;
        }
      }
    }

    // ✅ PLOTS (FIXED)
    else if (propertyType === "plot") {
      query += `
        AND (
          LOWER(p.property_type) LIKE '%plot%'
          OR LOWER(p.property_type) LIKE '%land%'
        )
      `;
    }

    // ✅ OTHER PROPERTY TYPES
    else if (propertyType && propertyType !== "all") {
      query += ` AND LOWER(p.property_type) LIKE ?`;
      params.push(`%${propertyType.toLowerCase()}%`);
    }

    /* ================= CATEGORY ================= */
    if (category) {
      query += ` AND LOWER(p.category) LIKE ?`;
      params.push(`%${category.toLowerCase()}%`);
    }

    /* ================= SUB TYPE ================= */
    if (subType) {
      query += ` AND LOWER(p.listing_sub_type) LIKE ?`;
      params.push(`%${subType.toLowerCase()}%`);
    }

    /* ================= FURNISHING ================= */
    if (furnishing) {
      query += ` AND LOWER(p.furnishing) LIKE ?`;
      params.push(`%${furnishing.toLowerCase()}%`);
    }

    /* ================= FLAGS ================= */
    if (readyToMove === "true") query += ` AND p.ready_to_move = 1`;
    if (directFromOwner === "true") query += ` AND p.direct_from_owner = 1`;
    if (bachelorFriendly === "true") query += ` AND p.bachelor_friendly = 1`;

    /* ================= LOCATION ================= */
    if (location) {
      const key = `%${location.toLowerCase()}%`;
      query += `
        AND (
          LOWER(p.location) LIKE ?
          OR LOWER(p.city) LIKE ?
          OR LOWER(p.locality) LIKE ?
          OR LOWER(p.state) LIKE ?
          OR p.pincode LIKE ?
        )
      `;
      params.push(key, key, key, key, key);
    }

    /* ================= PRICE ================= */
    if (minPrice) {
      query += ` AND p.price >= ?`;
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(Number(maxPrice));
    }

    /* ================= FLOOR / FACING ================= */
    if (facing) {
      query += ` AND LOWER(p.facing) LIKE ?`;
      params.push(`%${facing.toLowerCase()}%`);
    }
    if (floorNumber) {
      query += ` AND p.floor_number = ?`;
      params.push(Number(floorNumber));
    }
    if (totalFloors) {
      query += ` AND p.total_floors = ?`;
      params.push(Number(totalFloors));
    }
    if (ageOfConstruction) {
      query += ` AND LOWER(p.age_of_construction) LIKE ?`;
      params.push(`%${ageOfConstruction.toLowerCase()}%`);
    }

    query += ` ORDER BY p.created_at DESC`;

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json(
        rows.map(p => ({
          ...p,
          photos: p.photos ? JSON.parse(p.photos) : []
        }))
      );
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// ================= GET SINGLE PROPERTY BY SLUG =================
app.get("/api/properties/slug/:slug", (req, res) => {
  const { slug } = req.params;

  db.get(
    `
    SELECT 
      p.*, 
      u.username,+
      u.full_name,
      u.profile_photo,
      u.rating,
      u.phone
    FROM properties p
    JOIN users u ON p.user_id = u.id
    WHERE p.slug = ? AND p.status = 'approved'
    `,
    [slug],
    (err, property) => {
      if (err) {
        console.error("❌ DB ERROR:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      property.photos = property.photos ? JSON.parse(property.photos) : [];
      res.json(property);
    }
  );
});
// Get builder properties specifically
app.get("/api/builder-properties", (req, res) => {
 
  try {
    const query = `
      SELECT 
        p.*, 
        u.username,
        u.full_name,
        u.profile_photo,
        u.rating,
        u.phone,
        u.role
      FROM properties p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'approved' AND u.role = 'builder'
      ORDER BY p.created_at DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const properties = rows.map((p) => ({
        ...p,
        photos: p.photos ? JSON.parse(p.photos) : [],
      }));

      res.json(properties);
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= POST INTERIOR SERVICE =================
app.post(
  "/api/interiors",
  authenticateToken,
  uploadInterior.array("photos", 10),
  (req, res) => {
    try {
      const {
        title,
        experience,
        startingPrice,
        serviceArea,
        profession,
        propertyServed,
        projectType
      } = req.body;

// 🔥 SAFE FIELD NORMALIZATION
const property_served = propertyServed || "[]";
const project_type = projectType || "[]";
const profession_safe = profession || "[]";


      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const photos = req.files ? req.files.map(f => f.filename) : [];

      db.run(
        `INSERT INTO interiors (
          user_id,
          title,
          experience,
          starting_price,
          service_area,
          profession,
          property_served,
          project_type,
          photos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          title,
          experience || null,
          startingPrice || null,
          serviceArea || "",
          profession_safe,
          property_served,
          project_type,
          JSON.stringify(photos)
        ],
        function (err) {
          if (err) {
            console.error("❌ Interior insert error:", err);
            return res.status(500).json({ error: err.message });
          }

          res.json({
            success: true,
            message: "Interior service submitted for review",
            id: this.lastID
          });
        }
      );

    } catch (err) {
      console.error("❌ Interior server error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);
// ================= GET ALL INTERIORS =================
app.get("/api/interiors", (req, res) => {
  db.all(
    `
    SELECT 
      i.*,
      u.full_name,
      u.phone,
      u.profile_photo,
      u.rating
    FROM interiors i
    JOIN users u ON i.user_id = u.id
    WHERE i.status = 'approved'
    ORDER BY i.created_at DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "DB error" });
      }

      res.json(
        rows.map(i => ({
          ...i,
          profession: JSON.parse(i.profession || "[]"),
          property_served: JSON.parse(i.property_served || "[]"),
          project_type: JSON.parse(i.project_type || "[]"),
          photos: JSON.parse(i.photos || "[]")
        }))
      );
    }
  );
});
// ================= USER INTERIORS =================
app.get("/api/user/interiors", authenticateToken, (req, res) => {
  db.all(
    `SELECT * FROM interiors WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json(
        rows.map(i => ({
          ...i,
          profession: JSON.parse(i.profession || "[]"),
          property_served: JSON.parse(i.property_served || "[]"),
          project_type: JSON.parse(i.project_type || "[]"),
          photos: JSON.parse(i.photos || "[]")
        }))
      );
    }
  );
});
// ================= ADMIN INTERIORS =================
app.get("/api/admin/interiors", authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `
    SELECT i.*, u.full_name, u.phone
    FROM interiors i
    JOIN users u ON i.user_id = u.id
    ORDER BY i.created_at DESC
    `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(rows);
    }
  );
});

app.patch(
  "/api/admin/interiors/:id/status",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const { status } = req.body;

    db.run(
      `UPDATE interiors SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: "Update failed" });

        res.json({ success: true });
      }
    );
  }
);
// ================= INTERIOR DASHBOARD COUNTS =================
app.get("/api/dashboard/interiors", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected
    FROM interiors
    WHERE user_id = ?
  `;

  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error("❌ Dashboard interiors error:", err);
      return res.status(500).json({ error: "DB error" });
    }

    res.json({
      total: row?.total || 0,
      approved: row?.approved || 0,
      pending: row?.pending || 0,
      rejected: row?.rejected || 0,
    });
  });
});






app.get('/api/locations', (req, res) => {
  db.all('SELECT DISTINCT location FROM properties WHERE location IS NOT NULL', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch locations' });
    const locations = rows.map(r => r.location);
    res.json(locations);
  });
});

app.get("/api/debug/properties", (req, res) => {
  db.all(
    "SELECT id, title, status, ready_to_move, direct_from_owner, furnishing FROM properties",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(rows);
    }
  );
});



// ----------------- ADMIN POST BLOG (with file upload) -----------------
// -------- GET BLOG BY ID (for editing) --------
app.get("/api/admin/blog/:id", authenticateToken, requireAdmin, (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM blogs WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!row) return res.status(404).json({ error: "Blog not found" });

    res.json(row);
  });
});


app.post(
  "/api/admin/blog",
  authenticateToken,
  requireAdmin,
  BlogsUpload.single("media"), 
  (req, res) => {
    try {
      const { title, content, category } = req.body;


      if (!title || !content) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, () => {});
        }
        return res.status(400).json({ error: "Title and content are required" });
      }

      const image = req.file ? req.file.filename : null;

      const slugBase = slugify(title, { lower: true, strict: true });
      let slug = slugBase;

      db.get("SELECT COUNT(*) as cnt FROM blogs WHERE slug = ?", [slug], (err, row) => {
        if (err) {
          console.error("DB error checking slug:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const tryInsert = (finalSlug) => {
          db.run(
             `INSERT INTO blogs (category, title, slug, content, image, user_id)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [category, title, finalSlug, content, image, req.user.id],
            function (err) {
              if (err) {
                console.error("DB insert error:", err);
                if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
                return res.status(500).json({ error: "Failed to create blog" });
              }

              res.json({
                success: true,
                message: "Blog posted successfully",
                id: this.lastID,
                slug: finalSlug,
                image,
              });
            }
          );
        };

        if (row && row.cnt > 0) {
          slug = `${slugBase}-${Date.now()}`;
        }
        tryInsert(slug);
      });
    } catch (err) {
      console.error("Server error posting blog:", err);
      if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
      res.status(500).json({ error: "Server error" });
    }
  }
);


app.delete("/api/admin/blog/:id", authenticateToken, requireAdmin, (req, res) => {
  const id = req.params.id;

  db.get(`SELECT image FROM blogs WHERE id = ?`, [id], (err, blog) => {
    if (blog && blog.image) {
      const filePath = path.join(__dirname, "uploads", blog.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    db.run(`DELETE FROM blogs WHERE id = ?`, [id], function (err) {
      if (err) return res.status(500).json({ error: "Delete failed" });

      res.json({ success: true, message: "Blog deleted" });
    });
  });
});

// ----------------- GET ALL BLOGS -----------------
app.get("/api/blog", (req, res) => {
  db.all(`SELECT * FROM blogs ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch blogs" });
    res.json(rows);
  });
});
// ----------------- GET SINGLE BLOG BY SLUG -----------------
app.get("/api/blog/:slug", (req, res) => {
  const slug = req.params.slug;

  db.get(`SELECT * FROM blogs WHERE slug = ?`, [slug], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!row) return res.status(404).json({ error: "Blog not found" });

    res.json(row);
  });
});
// -------- UPDATE BLOG --------
app.put(
  "/api/admin/blog/:id",
  authenticateToken,
  requireAdmin,
  BlogsUpload.single("media"),
  (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    const newImage = req.file ? req.file.filename : null;

    db.get("SELECT * FROM blogs WHERE id = ?", [id], (err, existing) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!existing) return res.status(404).json({ error: "Blog not found" });

      const finalImage = newImage ? newImage : existing.image;

      if (newImage && existing.image) {
        const oldPath = `uploads/${existing.image}`;
        if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => {});
      }

      db.run(
        `UPDATE blogs 
         SET title = ?, content = ?, image = ?
         WHERE id = ?`,
        [title, content, finalImage, id],
        function (err) {
          if (err) return res.status(500).json({ error: "Update failed" });

          res.json({
            success: true,
            message: "Blog updated successfully",
            image: finalImage,
          });
        }
      );
    });
  }
);
// ================= CREATE LEAD =================
app.post("/api/leads", authenticateToken, (req, res) => {
  const { propertyId, ownerId } = req.body;
  const leadUserId = req.user.id;

  if (!propertyId || !ownerId) {
    return res.status(400).json({ error: "Missing propertyId or ownerId" });
  }

  db.get(
    `SELECT full_name, phone, email FROM users WHERE id = ?`,
    [leadUserId],
    (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: "User not found" });
      }

      db.run(
        `INSERT INTO leads
         (property_id, owner_id, lead_user_id, name, phone, email)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          propertyId,
          ownerId,
          leadUserId,
          user.full_name,
          user.phone,
          user.email
        ],
        () => res.json({ success: true })
      );
    }
  );
});

app.get(
  "/api/admin/leads/users",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    db.all(
      `
      SELECT
        u.id AS user_id,
        u.full_name,
        u.email,
        u.phone,
        COUNT(l.id) AS total_leads
      FROM leads l
      JOIN users u ON u.id = l.lead_user_id
      GROUP BY u.id
      ORDER BY total_leads DESC
      `,
      [],
      (err, rows) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(rows);
      }
    );
  }
);



// ================= ADMIN ALL LEADS =================
// ================= ADMIN LEADS DETAILS =================
app.get(
  "/api/admin/leads",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const sql = `
      SELECT
        l.id,
        l.created_at,

        COALESCE(leadUser.full_name, l.name, 'NA') AS lead_name,
        COALESCE(leadUser.phone, l.phone, 'NA') AS lead_phone,
        COALESCE(leadUser.email, l.email, '-') AS lead_email,

        p.title AS property_title,
        p.location,

        COALESCE(owner.full_name, 'NA') AS owner_name,
        COALESCE(owner.phone, 'NA') AS owner_phone,
        COALESCE(owner.email, '-') AS owner_email

      FROM leads l
      LEFT JOIN users leadUser ON leadUser.id = l.lead_user_id
      LEFT JOIN properties p ON p.id = l.property_id
      LEFT JOIN users owner ON owner.id = p.user_id
      ORDER BY l.created_at DESC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("❌ Admin leads error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json(rows);
    });
  }
);





// ================= ADMIN LEADS SUMMARY =================
app.get(
  "/api/admin/leads/summary",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    db.all(
      `
      SELECT 
        u.id,
        u.full_name,
        u.email,
        COUNT(l.id) AS total_leads
      FROM leads l
      LEFT JOIN users u ON u.id = l.lead_user_id
      GROUP BY u.id
      ORDER BY total_leads DESC
      `,
      [],
      (err, rows) => {
        if (err) {
          console.error("❌ Lead summary error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
      }
    );
  }
);


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
        photos: p.photos ? JSON.parse(p.photos) : [],
        // ✅ Ensure rejection_message is always included
        rejection_message: p.rejection_message || ''
      }));

      res.json(processed);
    }
  );
});

// Update property details
app.put('/api/admin/properties/:id', authenticateToken, requireAdmin, (req, res) => {
  const propertyId = req.params.id;
  const updates = req.body;
  
  console.log('📝 UPDATE DEBUG - Updating property:', propertyId, updates);

  // Build dynamic update query
  const allowedFields = ['title', 'description', 'price', 'location', 'transaction_type', 'property_type', 'area', 'bedrooms', 'bathrooms', 'rejection_message', 'status'];
  const updateFields = [];
  const updateValues = [];

  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key) && updates[key] !== undefined) {
      updateFields.push(`${key} = ?`);
      updateValues.push(updates[key]);
    }
  });

  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  updateValues.push(propertyId);

  const updateQuery = `UPDATE properties SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  db.run(updateQuery, updateValues, function(err) {
    if (err) {
      console.error('❌ UPDATE DEBUG - Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('✅ UPDATE DEBUG - Property updated successfully:', this.changes);
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ 
      success: true, 
      message: 'Property updated successfully',
      changes: this.changes
    });
  });
});

app.patch('/api/admin/properties/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status, reason, title, price, location, transaction_type } = req.body;
  const propertyId = req.params.id;

  console.log('🔄 STATUS DEBUG - Updating property:', propertyId, 'payload:', req.body);

  // Build dynamic update query based on what's provided
  let updateQuery = 'UPDATE properties SET updated_at = CURRENT_TIMESTAMP';
  let updateValues = [];

  // Always include status if provided
  if (status) {
    updateQuery += ', status = ?';
    updateValues.push(status);
  }

  // ✅ CRITICAL: Always save rejection_message when provided
  if (reason !== undefined) {
    updateQuery += ', rejection_message = ?';
    updateValues.push(reason);
  }

  // Include other fields if provided
  if (title) {
    updateQuery += ', title = ?';
    updateValues.push(title);
  }
  if (price) {
    updateQuery += ', price = ?';
    updateValues.push(price);
  }
  if (location) {
    updateQuery += ', location = ?';
    updateValues.push(location);
  }
  if (transaction_type) {
    updateQuery += ', transaction_type = ?';
    updateValues.push(transaction_type);
  }

  updateQuery += ' WHERE id = ?';
  updateValues.push(propertyId);

  console.log('🔄 STATUS DEBUG - Final query:', updateQuery);
  console.log('🔄 STATUS DEBUG - Values:', updateValues);

  db.run(updateQuery, updateValues, function (err) {
    if (err) {
      console.error('❌ STATUS DEBUG - Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('✅ STATUS DEBUG - Property updated successfully:', this.changes);

    // Send notification to property owner
    db.get('SELECT title, user_id FROM properties WHERE id = ?', [propertyId], (err, property) => {
      if (!property) return;

      const message =
        status === 'approved'
          ? `Your property "${property.title}" has been approved and is now live`
          : status === 'rejected'
          ? `Your property "${property.title}" has been rejected. Reason: ${reason || 'No reason provided'}`
          : `Your property "${property.title}" has been updated`;

      // 🔔 Save notification in DB
      db.run(
        'INSERT INTO notifications (user_id, property_id, message, type) VALUES (?, ?, ?, ?)',
        [property.user_id, propertyId, message, 'property_status']
      );

      // 🔔 PUSH NOTIFICATION (CORRECT PLACE)
      if (status === 'approved') {
        db.all(
          'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?',
          [property.user_id],
          async (err, subs) => {
            if (err || !subs) return;

            for (const s of subs) {
              const subscription = {
                endpoint: s.endpoint,
                keys: {
                  p256dh: s.p256dh,
                  auth: s.auth
                }
              };

              try {
                await webpush.sendNotification(
                  subscription,
                  JSON.stringify({
                    title: 'Property Approved 🎉',
                    body: `Your property "${property.title}" is now live`,
                    url: `/property/${propertyId}`
                  })
                );
              } catch (e) {
                console.error('❌ Push failed:', e);
              }
            }
          }
        );
      }
    });

    res.json({ message: `Property updated successfully` });
  });
});

// Update user role
app.patch('/api/admin/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  
  console.log('🔑 ROLE DEBUG - Updating user role:', userId, 'to:', role);

  // Validate role
  const validRoles = ['normal', 'premium', 'agent', 'builder', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  db.run(
    'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [role, userId],
    function(err) {
      if (err) {
        console.error('❌ ROLE DEBUG - Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      console.log('✅ ROLE DEBUG - User role updated successfully:', this.changes);
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ 
        success: true, 
        message: `User role updated to ${role} successfully`,
        changes: this.changes
      });
    }
  );
});
// 🔥 PERMANENT DELETE PROPERTY
app.delete(
  "/api/admin/properties/:id",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    const propertyId = req.params.id;

    // Delete wishlists
    db.run("DELETE FROM wishlists WHERE property_id = ?", [propertyId]);

    // Delete leads
    db.run("DELETE FROM leads WHERE property_id = ?", [propertyId]);

    // Delete property
    db.run(
      "DELETE FROM properties WHERE id = ?",
      [propertyId],
      function (err) {
        if (err) {
          console.error("❌ Delete failed:", err);
          return res.status(500).json({ error: "Delete failed" });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: "Property not found" });
        }

        res.json({
          success: true,
          message: "Property permanently deleted"
        });
      }
    );
  }
);



// ADD THESE ROUTES to your existing app
app.post('/api/subscribe', authenticateToken, (req, res) => {  // ← Add auth
  const { endpoint, keys } = req.body;
  
  db.run(
    `INSERT OR REPLACE INTO push_subscriptions (user_id, endpoint, p256dh, auth)
     VALUES (?, ?, ?, ?)`,
    [req.user.id, endpoint, keys.p256dh, keys.auth],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save subscription' });
      console.log('✅ Subscription saved for user:', req.user.id);
      res.json({ success: true });
    }
  );
});



app.post('/api/send-test-push', authenticateToken, (req, res) => {
  const payload = JSON.stringify({
    title: '🧪 Test Push!',
    body: 'Property notification system working!',
    url: '/properties'
  });

  db.all(
    'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?',
    [req.user.id],
    async (err, subs) => {
      if (err) return res.status(500).json({ error: 'DB error' });

      for (const s of subs) {
        const subscription = {
          endpoint: s.endpoint,
          keys: {
            p256dh: s.p256dh,
            auth: s.auth
          }
        };

        try {
          await webpush.sendNotification(subscription, payload);
        } catch (e) {
          console.error('Push failed:', e);
        }
      }

      res.json({ success: true });
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

// ----------------- UPDATE USER PROFILE -----------------
app.put('/api/user/profile', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, username, phone } = req.body;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, existing) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!existing) return res.status(404).json({ error: 'User not found' });

      let newProfilePhoto = existing.profile_photo;

      // If a new file was uploaded, replace old file
      if (req.file) {
        try {
          if (existing.profile_photo) {
            const oldPath = path.join(__dirname, 'uploads', existing.profile_photo);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
        } catch (e) {
          console.warn('Failed to remove old profile photo', e);
        }
        newProfilePhoto = req.file.filename;
      }

      const finalFullName = full_name !== undefined ? full_name : existing.full_name;
      const finalUsername = username !== undefined ? username : existing.username;
      const finalPhone = phone !== undefined ? phone : existing.phone;

      db.run(
        `UPDATE users SET full_name = ?, username = ?, phone = ?, profile_photo = ? WHERE id = ?`,
        [finalFullName, finalUsername, finalPhone, newProfilePhoto, userId],
        function (updateErr) {
          if (updateErr) {
            if (updateErr.message && updateErr.message.includes('UNIQUE constraint failed')) {
              return res.status(400).json({ error: 'Username or email already exists' });
            }
            console.error('User update error:', updateErr);
            return res.status(500).json({ error: 'Update failed' });
          }

          db.get(
            `SELECT id, username, email, role, full_name, phone, profile_photo, rating FROM users WHERE id = ?`,
            [userId],
            (getErr, userRow) => {
              if (getErr) return res.status(500).json({ error: 'Database error' });

              const respUser = {
                ...userRow,
                // provide both formats for frontend compatibility
                profilePhoto: userRow.profile_photo,
                profile_photo: userRow.profile_photo,
              };

              res.json({ user: respUser });
            }
          );
        }
      );
    });
  } catch (e) {
    console.error('Profile update exception:', e);
    res.status(500).json({ error: 'Server error' });
  }
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

app.get("/api/society-reviews/:slug", (req, res) => {
  const { slug } = req.params;

  db.all(
    "SELECT * FROM society_reviews WHERE property_slug = ?",
    [slug],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.json([]);
      }
      res.json(rows || []);
    }
  );
});

app.post("/api/society-reviews", (req, res) => {
  const { property_slug, rating, review, reviewer_name } = req.body;

  db.run(
    `INSERT INTO society_reviews (property_slug, rating, review, reviewer_name)
     VALUES (?, ?, ?, ?)`,
    [property_slug, rating, review, reviewer_name],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});
app.get("/api/locality-reviews/:slug", (req, res) => {
  const { slug } = req.params;

  // TEMP dummy response (you can replace with DB later)
  res.json({
    locality: slug,
    averageRating: 4.2,
    totalReviews: 18,
    pros: [
      "Good connectivity",
      "Near IT parks",
      "Schools and hospitals nearby",
    ],
    cons: [
      "Traffic during peak hours",
      "Limited parking in some areas",
    ],
    reviews: [
      {
        user: "Ramesh",
        rating: 4,
        comment: "Nice area, peaceful and well connected",
      },
      {
        user: "Suman",
        rating: 5,
        comment: "Best place to live near Gachibowli",
      },
    ],
  });
});


// EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Password Reset OTP",
          text: `Your OTP is ${otp}. It will expire in 5 minutes.`
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

// robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`
User-agent: *
Allow: /

Disallow: /admin
Disallow: /dashboard
Disallow: /login
Disallow: /register
Disallow: /wishlist

Sitemap: https://www.fortunefloors.com/sitemap.xml
  `);
});



// =====================
// DYNAMIC SITEMAP.XML (FINAL)
// =====================
app.get("/sitemap.xml", (req, res) => {
  const BASE_URL = "https://www.fortunefloors.com";

  const staticPages = [
    "/",
    "/buy",
    "/rent",
    "/sell",
    "/commercial",
    "/pg",
    "/plots",
    "/properties",
    "/all-properties",
    "/blogs",
    "/property-expo",
    "/about",
    "/services",
    "/contact",
    "/faq",
    "/pricing-guide",
    "/documents-needed",
    "/testimonials",
    "/partners",
    "/how-it-works"
  ];

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 🔹 Static pages
  staticPages.forEach((path) => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
  });

  // 🔹 Properties
  db.all(
    `SELECT title, location, updated_at FROM properties WHERE status = 'approved'`,
    [],
    (err, properties) => {
      if (!err) {
        properties.forEach((p) => {
          const slug = slugify(`${p.title}-${p.location}`, {
            lower: true,
            strict: true,
          });

          sitemap += `
  <url>
    <loc>${BASE_URL}/property/${slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
        });
      }

      // 🔹 Blogs
      db.all(`SELECT slug, created_at FROM blogs`, [], (err, blogs) => {
        if (!err) {
          blogs.forEach((b) => {
            sitemap += `
  <url>
    <loc>${BASE_URL}/blog/${b.slug}</loc>
    <lastmod>${new Date(b.created_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
          });
        }

        sitemap += `\n</urlset>`;
        res.send(sitemap);
      });
    }
  );
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(5000, () => {
  console.log("Server running on port 5000");
});