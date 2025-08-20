// Main JavaScript file for the book library application
// This file handles the main page functionality

document.addEventListener("DOMContentLoaded", function () {
  console.log("Book Library Application loaded successfully!");

  // Add smooth scrolling for anchor links
  const Booklinks = document.querySelectorAll('a[href^="#"]');
  Booklinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add animation to feature cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe feature cards
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // Add hover effects to tech items
  const techItems = document.querySelectorAll(".tech-item");
  techItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "transform 0.3s ease";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  // Add click effect to buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS for ripple effect
  const style = document.createElement("style");
  style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Add loading animation for page transitions
  window.addEventListener("beforeunload", function () {
    document.body.style.opacity = "0.8";
    document.body.style.transition = "opacity 0.3s ease";
  });

  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    // Escape key to close any open modals
    if (e.key === "Escape") {
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        if (modal.style.display === "flex") {
          modal.style.display = "none";
        }
      });
    }

    // Enter key to activate focused buttons
    if (e.key === "Enter" && document.activeElement.classList.contains("btn")) {
      document.activeElement.click();
    }
  });

  // Add accessibility improvements
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (!img.alt) {
      img.alt = "Image";
    }
  });

  // Add focus indicators for better accessibility
  const focusableElements = document.querySelectorAll("a, button, input, textarea, select");
  focusableElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.outline = "2px solid #667eea";
      this.style.outlineOffset = "2px";
    });

    element.addEventListener("blur", function () {
      this.style.outline = "none";
    });
  });

  // Add performance monitoring
  if ("performance" in window) {
    window.addEventListener("load", function () {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    });
  }

  // Add error handling for broken links
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("http")) {
        // External link - could add analytics here
        console.log("External link clicked:", href);
      }
    });
  });

  // Add responsive menu toggle for mobile (if needed)
  const nav = document.querySelector(".nav");
  if (nav && window.innerWidth <= 768) {
    const menuToggle = document.createElement("button");
    menuToggle.innerHTML = "☰";
    menuToggle.className = "menu-toggle";
    menuToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        `;

    nav.parentNode.insertBefore(menuToggle, nav);

    menuToggle.addEventListener("click", function () {
      nav.style.display = nav.style.display === "none" ? "flex" : "none";
    });

    // Show menu toggle on mobile
    if (window.innerWidth <= 768) {
      menuToggle.style.display = "block";
      nav.style.display = "none";
    }

    // Handle window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth <= 768) {
        menuToggle.style.display = "block";
        nav.style.display = "none";
      } else {
        menuToggle.style.display = "none";
        nav.style.display = "flex";
      }
    });
  }
});
