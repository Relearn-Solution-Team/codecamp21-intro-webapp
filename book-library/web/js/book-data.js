// API Configuration
const API_BASE_URL = "http://localhost:3001/api";

// Global variables
let currentBooks = [];
let currentView = "card"; // 'card' or 'table'
let currentRatingBookId = null;
let currentRating = 0;

// API Functions
async function fetchBooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/books/with-details`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const books = await response.json();
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

async function toggleFavourite(bookId) {
  try {
    const response = await fetch(`${API_BASE_URL}/favourites/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error toggling favourite:", error);
    throw error;
  }
}

async function submitBookRating(bookId, rating) {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error submitting rating:", error);
    throw error;
  }
}

// Utility Functions
function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("error").style.display = "none";
  document.getElementById("cardView").style.display = "none";
  document.getElementById("tableView").style.display = "none";
}

function showError() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("error").style.display = "block";
  document.getElementById("cardView").style.display = "none";
  document.getElementById("tableView").style.display = "none";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += "⭐";
  }

  if (hasHalfStar) {
    stars += "⭐";
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += "☆";
  }

  return stars;
}

function getFavouriteButtonText(isFavourite) {
  return isFavourite ? "❤️ ลบจากโปรด" : "🤍 เพิ่มโปรด";
}

function getFavouriteButtonClass(isFavourite) {
  return isFavourite ? "btn-danger" : "btn-success";
}

// Event Handlers
async function handleFavouriteToggle(bookId) {
  try {
    await toggleFavourite(bookId);
    await loadBooks(); // Reload books to update UI
  } catch (error) {
    alert("เกิดข้อผิดพลาดในการอัปเดตรายการโปรด");
  }
}

function handleRatingClick(bookId, bookTitle) {
  currentRatingBookId = bookId;
  document.getElementById("ratingBookTitle").textContent = bookTitle;
  document.getElementById("ratingModal").style.display = "flex";

  // Reset stars
  currentRating = 0;
  document.querySelectorAll(".star").forEach((star) => {
    star.classList.remove("active");
  });
}

async function handleRatingSubmit() {
  if (currentRating === 0) {
    alert("กรุณาเลือกคะแนน");
    return;
  }

  try {
    await submitBookRating(currentRatingBookId, currentRating);
    closeRatingModal();
    await loadBooks(); // Reload books to update UI
  } catch (error) {
    alert("เกิดข้อผิดพลาดในการบันทึกคะแนน");
  }
}

function closeRatingModal() {
  document.getElementById("ratingModal").style.display = "none";
  currentRatingBookId = null;
  currentRating = 0;
}

function handleStarClick(rating) {
  currentRating = rating;

  // Update star display
  document.querySelectorAll(".star").forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function switchView(view) {
  currentView = view;

  if (view === "card") {
    document.getElementById("cardView").style.display = "grid";
    document.getElementById("tableView").style.display = "none";
    document.getElementById("cardViewBtn").classList.add("btn-primary");
    document.getElementById("cardViewBtn").classList.remove("btn-secondary");
    document.getElementById("tableViewBtn").classList.add("btn-secondary");
    document.getElementById("tableViewBtn").classList.remove("btn-primary");
  } else {
    document.getElementById("cardView").style.display = "none";
    document.getElementById("tableView").style.display = "block";
    document.getElementById("tableViewBtn").classList.add("btn-primary");
    document.getElementById("tableViewBtn").classList.remove("btn-secondary");
    document.getElementById("cardViewBtn").classList.add("btn-secondary");
    document.getElementById("cardViewBtn").classList.remove("btn-primary");
  }

  renderBooks();
}

// Render Functions
function renderBookCard(book) {
  return `
        <div class="book-card">
            <div class="book-title">${book.title}</div>
            <div class="book-isbn">ISBN: ${book.ISBN}</div>
            <div class="book-category">${book.category_name}</div>
            <div class="book-rating">
                <div class="stars">${renderStars(book.rating || 0)}</div>
                <small>${
                  book.rating ? `${book.rating}/5` : "ยังไม่มีคะแนน"
                }</small>
            </div>
            <div class="book-actions">
                <button class="btn ${getFavouriteButtonClass(book.isFavourite)}"
                        onclick="handleFavouriteToggle(${book.id})">
                    ${getFavouriteButtonText(book.isFavourite)}
                </button>
                <button class="btn btn-primary"
                        onclick="handleRatingClick(${book.id}, '${
    book.title
  }')">
                    ⭐ ให้คะแนน
                </button>
            </div>
        </div>
    `;
}

function renderBookTableRow(book) {
  return `
        <tr>
            <td>${book.title}</td>
            <td>${book.ISBN}</td>
            <td>${book.category_name}</td>
            <td>${book.rating ? `${book.rating}/5` : "ยังไม่มีคะแนน"}</td>
            <td>${book.isFavourite ? "❤️" : "🤍"}</td>
            <td>
                <div class="table-actions">
                    <button class="btn ${getFavouriteButtonClass(
                      book.isFavourite
                    )}"
                            onclick="handleFavouriteToggle(${book.id})">
                        ${book.isFavourite ? "ลบโปรด" : "เพิ่มโปรด"}
                    </button>
                    <button class="btn btn-primary"
                            onclick="handleRatingClick(${book.id}, '${
    book.title
  }')">
                        ให้คะแนน
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function renderBooks() {
  if (currentView === "card") {
    const cardView = document.getElementById("cardView");
    cardView.innerHTML = currentBooks.map(renderBookCard).join("");
  } else {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = currentBooks.map(renderBookTableRow).join("");
  }
}

// Main load function
async function loadBooks() {
  showLoading();

  try {
    currentBooks = await fetchBooks();
    hideLoading();
    renderBooks();
  } catch (error) {
    showError();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Set up event listeners
  document
    .getElementById("cardViewBtn")
    .addEventListener("click", () => switchView("card"));
  document
    .getElementById("tableViewBtn")
    .addEventListener("click", () => switchView("table"));

  // Set up star rating event listeners
  document.querySelectorAll(".star").forEach((star) => {
    star.addEventListener("click", () => {
      const rating = parseInt(star.dataset.rating);
      handleStarClick(rating);
    });
  });

  // Set up modal close event
  document.getElementById("ratingModal").addEventListener("click", (e) => {
    if (e.target.id === "ratingModal") {
      closeRatingModal();
    }
  });

  // Load books initially
  loadBooks();

  // Set default view
  switchView("card");
});

// Global functions for HTML onclick
window.handleFavouriteToggle = handleFavouriteToggle;
window.handleRatingClick = handleRatingClick;
window.handleRatingSubmit = handleRatingSubmit;
window.closeRatingModal = closeRatingModal;
window.loadBooks = loadBooks;
