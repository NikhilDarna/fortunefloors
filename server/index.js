import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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
  )`);

  // Create properties table
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

  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    `INSERT OR IGNORE INTO users (username, email, password, role, full_name) 
     VALUES ('admin', 'admin@fortune.com', ?, 'admin', 'Fortune Admin')`,
    [adminPassword]
  );
}

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
      bathrooms
    } = req.body;

    const photos = req.files ? req.files.map((f) => f.filename) : [];

    db.run(
      `INSERT INTO properties 
       (title, description, property_type, transaction_type, price, location, area, bedrooms, bathrooms, photos, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        req.user.id
      ],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to create property' });

        // Notify admin
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});