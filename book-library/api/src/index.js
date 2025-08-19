const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  pool,
  testConnection,
  initializeDatabase,
} = require("../config/database");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT b.*, c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.title
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM categories ORDER BY name");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get book favourites
app.get("/api/favourites", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM book_favourites ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Toggle book favourite
app.post("/api/favourites/:bookId", async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);

    // Check if book exists
    const [bookRows] = await pool.execute("SELECT id FROM books WHERE id = ?", [
      bookId,
    ]);
    if (bookRows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if favourite exists
    const [favouriteRows] = await pool.execute(
      "SELECT id FROM book_favourites WHERE book_id = ?",
      [bookId]
    );

    if (favouriteRows.length > 0) {
      // Remove from favourites
      await pool.execute("DELETE FROM book_favourites WHERE book_id = ?", [
        bookId,
      ]);
      res.json({ message: "Book removed from favourites", isFavourite: false });
    } else {
      // Add to favourites
      await pool.execute("INSERT INTO book_favourites (book_id) VALUES (?)", [
        bookId,
      ]);
      res.json({ message: "Book added to favourites", isFavourite: true });
    }
  } catch (error) {
    console.error("Error toggling favourite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get book ratings
app.get("/api/ratings", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM book_ratings ORDER BY book_id"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add book rating
app.post("/api/ratings/:bookId", async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if book exists
    const [bookRows] = await pool.execute("SELECT id FROM books WHERE id = ?", [
      bookId,
    ]);
    if (bookRows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if rating exists
    const [ratingRows] = await pool.execute(
      "SELECT id FROM book_ratings WHERE book_id = ?",
      [bookId]
    );

    if (ratingRows.length > 0) {
      // Update existing rating
      await pool.execute(
        "UPDATE book_ratings SET rating = ? WHERE book_id = ?",
        [rating, bookId]
      );
    } else {
      // Create new rating
      await pool.execute(
        "INSERT INTO book_ratings (book_id, rating) VALUES (?, ?)",
        [bookId, rating]
      );
    }

    res.json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get books with favourites and ratings
app.get("/api/books/with-details", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        b.*,
        c.name as category_name,
        CASE WHEN bf.id IS NOT NULL THEN 1 ELSE 0 END as isFavourite,
        br.rating
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN book_favourites bf ON b.id = bf.book_id
      LEFT JOIN book_ratings br ON b.id = br.book_id
      ORDER BY b.title
    `);

    // Convert isFavourite to boolean
    const booksWithDetails = rows.map((book) => ({
      ...book,
      isFavourite: Boolean(book.isFavourite),
    }));

    res.json(booksWithDetails);
  } catch (error) {
    console.error("Error fetching books with details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      status: "ok",
      database: isConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("❌ Cannot start server without database connection");
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api`);
      console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
