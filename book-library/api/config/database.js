const mysql = require("mysql2/promise");
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "book_library",
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Create books table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ISBN VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        category_id INT,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Create book_favourites table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS book_favourites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `);

    // Create book_ratings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS book_ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `);

    // Insert default categories if they don't exist
    await connection.execute(`
      INSERT IGNORE INTO categories (id, name) VALUES
      (1, 'Fantasy'),
      (2, 'Adventure'),
      (3, 'Mystery'),
      (4, 'Romance'),
      (5, 'Science Fiction')
    `);

    // Insert sample books if they don't exist
    const sampleBooks = [
      {
        ISBN: "978-0-7475-3269-9",
        title: "Harry Potter and the Philosopher's Stone",
        category_id: 1,
      },
      {
        ISBN: "978-0-7475-3849-3",
        title: "Harry Potter and the Chamber of Secrets",
        category_id: 1,
      },
      {
        ISBN: "978-0-7475-4624-5",
        title: "Harry Potter and the Prisoner of Azkaban",
        category_id: 1,
      },
      {
        ISBN: "978-0-7475-5100-3",
        title: "Harry Potter and the Goblet of Fire",
        category_id: 1,
      },
      {
        ISBN: "978-0-7475-8108-6",
        title: "Harry Potter and the Order of the Phoenix",
        category_id: 1,
      },
      {
        ISBN: "978-0-7475-8109-3",
        title: "Harry Potter and the Half-Blood Prince",
        category_id: 1,
      },
      {
        ISBN: "978-0-7475-8110-9",
        title: "Harry Potter and the Deathly Hallows",
        category_id: 1,
      },
      {
        ISBN: "978-0-7475-3269-9",
        title: "The Lord of the Rings: The Fellowship of the Ring",
        category_id: 2,
      },
      {
        ISBN: "978-0-7475-3269-9",
        title: "The Lord of the Rings: The Two Towers",
        category_id: 2,
      },
      {
        ISBN: "978-0-7475-3269-9",
        title: "The Lord of the Rings: The Return of the King",
        category_id: 2,
      },
    ];

    for (const book of sampleBooks) {
      await connection.execute(
        `
        INSERT IGNORE INTO books (ISBN, title, category_id) VALUES (?, ?, ?)
      `,
        [book.ISBN, book.title, book.category_id]
      );
    }

    connection.release();
    console.log("✅ Database tables initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
};
