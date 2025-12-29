// ================== TANTU TALES - MAIN SCRIPT ==================

// ================== INITIALIZATION ==================
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  setupLogoIntro();
  setupReturnPolicyModal();
});

// ================== APP INITIALIZATION ==================
function initializeApp() {
  const products = document.querySelectorAll(".product");
  const cartBtn = document.getElementById("cart-btn");
  const cartContainer = document.getElementById("cart");
  const overlay = document.getElementById("overlay");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutForm = document.getElementById("checkout-form");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ================== CART FUNCTIONS ==================
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = "<li style='text-align:center;color:#999'>No items in cart</li>";
      checkoutBtn.style.display = "none";
      cartCount.textContent = "0";
    } else {
      checkoutBtn.style.display = "block";
      cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name} - ₹${item.price} × ${item.quantity}</span>
        <div>
          <button class="minus-btn" aria-label="Decrease quantity">-</button>
          <button class="plus-btn" aria-label="Increase quantity">+</button>
          <button class="remove-btn" aria-label="Remove item">Remove</button>
        </div>
      `;
      cartItems.appendChild(li);

      li.querySelector(".plus-btn").addEventListener("click", () => {
        item.quantity++;
        renderCart();
        saveCart();
      });

      li.querySelector(".minus-btn").addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(index, 1);
        }
        renderCart();
        saveCart();
        updateProductButtons();
      });

      li.querySelector(".remove-btn").addEventListener("click", () => {
        cart.splice(index, 1);
        renderCart();
        saveCart();
        updateProductButtons();
      });
    });

    cartTotal.textContent = total;
    checkoutBtn.textContent = `Proceed to Checkout (₹${total})`;
  }

  function updateProductButtons() {
    products.forEach((product) => {
      const name = product.querySelector("h3").textContent;
      const btn = product.querySelector(".add-to-cart");
      const inCart = cart.find((item) => item.name === name);

      if (inCart) {
        btn.disabled = true;
        btn.textContent = "Added ✅";
      } else {
        btn.disabled = false;
        btn.textContent = "Add to Cart";
      }
    });
  }

  // ================== CART TOGGLE ==================
  cartBtn.addEventListener("click", () => {
    cartContainer.classList.toggle("show");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    cartContainer.classList.remove("show");
    overlay.classList.remove("active");
    closeAllModals();
  });

  // ================== ADD TO CART ==================
  products.forEach((product) => {
    const addBtn = product.querySelector(".add-to-cart");
    const viewBtn = product.querySelector(".view-details");

    addBtn.addEventListener("click", () => {
      const name = product.querySelector("h3").textContent;
      const price = parseInt(product.querySelector(".product-price").getAttribute("data-price"));
      const existing = cart.find((i) => i.name === name);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      renderCart();
      saveCart();
      addBtn.disabled = true;
      addBtn.textContent = "Added ✅";

      cartContainer.classList.add("show");
      overlay.classList.add("active");
      setTimeout(() => {
        cartContainer.classList.remove("show");
        overlay.classList.remove("active");
      }, 2000);
    });

    viewBtn.addEventListener("click", () => {
      openProductModal(product);
    });
  });

  // ================== PRODUCT MODAL ==================
  function openProductModal(product) {
    const modal = document.getElementById("product-modal");
    const modalImg = document.getElementById("modal-product-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-description");
    const modalPrice = document.getElementById("modal-price");
    const modalAddBtn = document.getElementById("modal-add-to-cart");
    const colorSelector = document.getElementById("color-selector");
    const colorButtons = document.getElementById("color-buttons");

    const name = product.querySelector("h3").textContent;
    const description = product.querySelector(".product-description").textContent;
    const price = parseInt(product.querySelector(".product-price").getAttribute("data-price"));
    const imgSrc = product.querySelector("img").src;
    const baseImage = product.getAttribute("data-base-image");
    const availableColors = product.getAttribute("data-colors")?.split(",") || [];
    const unavailableColors = product.getAttribute("data-unavailable")?.split(",").filter(c => c) || [];

    modalImg.src = imgSrc;
    modalImg.alt = name;
    modalTitle.textContent = name;
    modalDesc.textContent = description;
    modalPrice.textContent = price;

    // Color variants
    if (availableColors.length > 0) {
      colorSelector.style.display = "block";
      colorButtons.innerHTML = "";

      const currentImgName = imgSrc.split('/').pop();
      const currentColor = currentImgName.replace(`${baseImage}-`, '').replace('.jpg', '').replace('.png', '');

      availableColors.forEach(color => {
        const btn = document.createElement("button");
        btn.className = "color-btn";
        btn.setAttribute("data-color", color.trim());
        btn.setAttribute("aria-label", `Select ${color} color`);

        if (color.trim() === currentColor) {
          btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
          const newImgSrc = `images/${baseImage}-${color.trim()}.jpg`;
          modalImg.src = newImgSrc;
          colorButtons.querySelectorAll(".color-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        });

        colorButtons.appendChild(btn);
      });

      unavailableColors.forEach(color => {
        if (color) {
          const btn = document.createElement("button");
          btn.className = "color-btn unavailable";
          btn.setAttribute("data-color", color.trim());
          btn.setAttribute("aria-label", `${color} color unavailable`);
          btn.disabled = true;
          colorButtons.appendChild(btn);
        }
      });
    } else {
      colorSelector.style.display = "none";
    }

    const inCart = cart.find((item) => item.name === name);
    if (inCart) {
      modalAddBtn.disabled = true;
      modalAddBtn.textContent = "Already in Cart ✓";
    } else {
      modalAddBtn.disabled = false;
      modalAddBtn.textContent = "Add to Cart";
    }

    modalAddBtn.onclick = () => {
      const existing = cart.find((i) => i.name === name);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      renderCart();
      saveCart();
      updateProductButtons();
      modalAddBtn.disabled = true;
      modalAddBtn.textContent = "Added ✅";
      closeModal("product-modal");

      cartContainer.classList.add("show");
      overlay.classList.add("active");
    };

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  // ================== CHECKOUT MODAL ==================
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    openCheckoutModal();
  });

  function openCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    const checkoutItems = document.getElementById("checkout-items");
    const checkoutTotal = document.getElementById("checkout-total");

    checkoutItems.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.textContent = `${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`;
      checkoutItems.appendChild(div);
    });

    checkoutTotal.textContent = total;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    cartContainer.classList.remove("show");
  }

  // ================== PAYMENT PROCESSING ==================
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const termsCheckbox = document.getElementById("terms-checkbox");
    const termsGroup = document.querySelector(".terms-group");

    if (!termsCheckbox.checked) {
      termsGroup.classList.add("error");
      alert("⚠️ Please accept the terms and conditions to proceed.");
      setTimeout(() => termsGroup.classList.remove("error"), 2000);
      return;
    }

    const returnPolicyCheckbox = document.getElementById("return-policy-checkbox");
    const returnPolicyGroup = document.querySelector(".return-policy-group");

    if (!returnPolicyCheckbox.checked) {
      returnPolicyGroup.classList.add("error");
      alert("⚠️ Please read and accept the Return & Exchange Policy to proceed.");
      setTimeout(() => returnPolicyGroup.classList.remove("error"), 2000);
      return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const customerData = {
      name: document.getElementById("customer-name").value.trim(),
      email: document.getElementById("customer-email").value.trim(),
      phone: document.getElementById("customer-phone").value.trim(),
      address: document.getElementById("customer-address").value.trim(),
      pincode: document.getElementById("customer-pincode").value.trim()
    };

    if (customerData.phone.length !== 10 || isNaN(customerData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (customerData.pincode.length !== 6 || isNaN(customerData.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ================== CASH ON DELIVERY ==================
    if (paymentMethod === "cod") {
      fetch('http://localhost:3000/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerData,
          items: cart,
          totalAmount: totalAmount,
          paymentMethod: 'cod'
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('✅ Order Saved to Database!\n\nOrder #: ' + data.orderNumber);

            cart = [];
            localStorage.removeItem('cart');
            renderCart();
            updateProductButtons();
            checkoutForm.reset();
            closeAllModals();

            const message = `🎨 New Order - Tantu Tales ✨\n\nOrder #: ${data.orderNumber}\n\n👤 Name: ${customerData.name}\n📞 Phone: ${customerData.phone}\n📍 Address: ${customerData.address}\n\n💰 Total: ₹${totalAmount}\n\n✅ Order saved to database!`;
            window.open(`https://wa.me/918420069397?text=${encodeURIComponent(message)}`, '_blank');
          } else {
            alert('❌ Error: ' + data.error);
          }
        })
        .catch(err => alert('❌ Error: ' + err.message));

      return;
    }

    if (paymentMethod === "online") {
      alert("💳 Online payment is coming soon!\n\nFor now, please use:\n✅ Cash on Delivery\n💬 Or contact us on WhatsApp: +91 84200 69397");
      return;
    }
  });

  // ================== SEARCH FUNCTIONALITY ==================
  const searchBar = document.getElementById("search-bar");
  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    products.forEach((product) => {
      const name = product.querySelector(".product-name").textContent.toLowerCase();
      const description = product.querySelector(".product-description").textContent.toLowerCase();

      if (name.includes(query) || description.includes(query)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });

    const visibleProducts = Array.from(products).filter(p => p.style.display !== "none");
    const productGrid = document.querySelector(".product-grid");

    let noResultsMsg = document.getElementById("no-results-message");
    if (visibleProducts.length === 0 && query.length > 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement("p");
        noResultsMsg.id = "no-results-message";
        noResultsMsg.style.gridColumn = "1 / -1";
        noResultsMsg.style.textAlign = "center";
        noResultsMsg.style.color = "#999";
        noResultsMsg.style.fontSize = "1.2rem";
        noResultsMsg.textContent = `No products found for "${query}"`;
        productGrid.appendChild(noResultsMsg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  });

  // ================== NEWSLETTER FORM ==================
  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const message = `📧 New Newsletter Subscriber!\n\nEmail: ${email}\n\nDate: ${new Date().toLocaleDateString('en-IN')}`;
    const whatsappURL = `https://wa.me/918420069397?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
    alert("✅ Thanks for subscribing! You'll receive updates about new collections and exclusive offers.");
    newsletterForm.reset();
  });

  // ================== MODAL CONTROLS ==================
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  function closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    });
  }

  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
      cartContainer.classList.remove("show");
      overlay.classList.remove("active");
    }
  });

  // ================== PRODUCT ANIMATION ==================
  products.forEach((product, i) => {
    setTimeout(() => {
      product.style.opacity = "0";
      product.style.transform = "translateY(30px)";
      product.style.transition = "all 0.5s ease";

      setTimeout(() => {
        product.style.opacity = "1";
        product.style.transform = "translateY(0)";
      }, 50);
    }, i * 100);
  });

  renderCart();
  updateProductButtons();
}

// ================== LOGO INTRO ==================
function setupLogoIntro() {
  const logoIntro = document.getElementById("logo-intro");
  const logoFixed = document.getElementById("logo-fixed");

  setTimeout(() => {
    logoIntro.style.display = "none";
    setTimeout(() => {
      logoFixed.classList.add("visible");
    }, 500);
  }, 5000);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      logoFixed.classList.add("visible");
    } else {
      logoFixed.classList.remove("visible");
    }
  });
}

// ================== RETURN POLICY MODAL ==================
function setupReturnPolicyModal() {
  const returnPolicyModal = document.getElementById("return-policy-modal");

  if (!returnPolicyModal) {
    console.error("Return policy modal not found!");
    return;
  }

  returnPolicyModal.addEventListener("click", (e) => {
    if (e.target === returnPolicyModal) {
      returnPolicyModal.classList.remove("active");
      returnPolicyModal.setAttribute("aria-hidden", "true");
    }
  });

  const closeBtn = returnPolicyModal.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      returnPolicyModal.classList.remove("active");
      returnPolicyModal.setAttribute("aria-hidden", "true");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && returnPolicyModal.classList.contains("active")) {
      returnPolicyModal.classList.remove("active");
      returnPolicyModal.setAttribute("aria-hidden", "true");
    }
  });
}

// ================== SMOOTH SCROLL ==================
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ================== BACK TO TOP BUTTON ==================
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ================== CONSOLE MESSAGE ==================
console.log("%c🎨 Tantu Tales - Handmade Jewelry", "font-size: 20px; color: #4b2e2e; font-weight: bold;");
console.log("%cBuilt with ❤️ by a loving son", "font-size: 14px; color: #666;");

// ================== REVIEW FUNCTIONALITY ==================

// Add this AFTER the initializeApp() function in script.js

function setupReviewSystem() {
  const writeReviewBtn = document.getElementById("write-review-btn");
  const reviewForm = document.getElementById("review-form");
  const cancelReviewBtn = document.getElementById("cancel-review-btn");
  const starRatingInput = document.getElementById("star-rating-input");
  const ratingValue = document.getElementById("rating-value");
  const reviewText = document.getElementById("review-text");
  const charCount = document.getElementById("char-count");

  // ================== TOGGLE REVIEW FORM ==================
  writeReviewBtn.addEventListener("click", () => {
    reviewForm.classList.toggle("hidden");
    if (!reviewForm.classList.contains("hidden")) {
      reviewForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  cancelReviewBtn.addEventListener("click", () => {
    reviewForm.classList.add("hidden");
    reviewForm.reset();
    ratingValue.value = 0;
    document.querySelectorAll(".star-rating-input .star").forEach(star => {
      star.classList.remove("active");
      star.textContent = "☆";
    });
  });

  // ================== STAR RATING SYSTEM ==================
  const stars = document.querySelectorAll(".star-rating-input .star");

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const rating = star.getAttribute("data-rating");
      ratingValue.value = rating;

      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add("active");
          s.textContent = "★";
        } else {
          s.classList.remove("active");
          s.textContent = "☆";
        }
      });
    });

    // Hover effect
    star.addEventListener("mouseover", () => {
      const hoverRating = star.getAttribute("data-rating");
      stars.forEach((s, index) => {
        if (index < hoverRating) {
          s.style.color = "#ffc107";
        } else {
          s.style.color = "#ddd";
        }
      });
    });
  });

  document.querySelector(".star-rating-input").addEventListener("mouseleave", () => {
    const currentRating = ratingValue.value;
    stars.forEach((s, index) => {
      if (index < currentRating) {
        s.style.color = "#ffc107";
      } else {
        s.style.color = "#ddd";
      }
    });
  });

  // ================== CHARACTER COUNT ==================
  reviewText.addEventListener("input", () => {
    const count = reviewText.value.length;
    charCount.textContent = `${count}/500`;
  });

  // ================== SUBMIT REVIEW ==================
  document.getElementById("review-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const rating = ratingValue.value;
    if (!rating || rating < 1) {
      alert("⭐ Please select a rating!");
      return;
    }

    const reviewerName = document.getElementById("reviewer-name").value.trim();
    const reviewerEmail = document.getElementById("reviewer-email").value.trim();
    const reviewTextValue = reviewText.value.trim();

    if (!reviewerName || !reviewerEmail || !reviewTextValue) {
      alert("❌ Please fill all fields!");
      return;
    }

    // Get current product ID from modal
    const modalTitle = document.getElementById("modal-title").textContent;
    const productId = modalTitle.toLowerCase().replace(/\s+/g, "-");

    try {
      const response = await fetch('http://localhost:3000/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          rating: parseInt(rating),
          reviewerName: reviewerName,
          reviewerEmail: reviewerEmail,
          reviewText: reviewTextValue
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Review submitted! It will appear after moderation.");
        reviewForm.classList.add("hidden");
        reviewForm.reset();
        ratingValue.value = 0;
        document.querySelectorAll(".star-rating-input .star").forEach(star => {
          star.classList.remove("active");
          star.textContent = "☆";
        });
        charCount.textContent = "0/500";

        // Reload reviews
        loadProductReviews(productId);
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      alert("❌ Error submitting review: " + error.message);
    }
  });
}

// ================== LOAD REVIEWS FROM BACKEND ==================
// ================== LOAD REVIEWS FROM BACKEND ==================
async function loadProductReviews(productId) {
  const reviewsList = document.getElementById("reviews-list");
  const noReviews = document.getElementById("no-reviews");
  const ratingDisplay = document.getElementById("modal-star-display");
  const ratingScore = document.getElementById("modal-rating-score");
  const ratingCount = document.getElementById("modal-rating-count");

  try {
    const response = await fetch(`http://localhost:3000/api/reviews/product/${productId}`);
    const data = await response.json();

    if (data.success && data.reviews.length > 0) {
      // Has reviews - show average
      if (noReviews) noReviews.style.display = "none";

      const avgRating = data.averageRating || 5.0;
      const stars = "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating));

      ratingDisplay.textContent = stars;
      ratingScore.textContent = avgRating.toFixed(1);
      ratingCount.textContent = `(${data.reviews.length} reviews)`;

      // Display reviews
      reviewsList.innerHTML = "";
      data.reviews.forEach(review => {
        const reviewDiv = document.createElement("div");
        reviewDiv.className = "review-item";
        reviewDiv.innerHTML = `
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">${review.reviewerName.charAt(0).toUpperCase()}</div>
              <div class="reviewer-details">
                <div class="reviewer-name">${review.reviewerName}</div>
                <div class="review-date">${new Date(review.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
            <div class="review-stars">
              ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
            </div>
          </div>
          <div class="review-text">${review.reviewText}</div>
        `;
        reviewsList.appendChild(reviewDiv);
      });
    } else {
      // No reviews - show 0 stars
      if (noReviews) noReviews.style.display = "block";

      ratingDisplay.textContent = "☆☆☆☆☆";
      ratingScore.textContent = "0.0";
      ratingCount.textContent = "(0 reviews)";

      reviewsList.innerHTML = "";
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
    if (noReviews) noReviews.style.display = "block";
  }
}

// ================== ADMIN FUNCTIONALITY ==================
function setupAdminMode() {
  const adminModal = document.getElementById("adminModal");
  const adminPasswordInput = document.getElementById("adminPasswordInput");
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const adminCancelBtn = document.getElementById("adminCancelBtn");
  const toggleAdminEye = document.getElementById("toggleAdminEye");

  // Open admin modal with Ctrl+Shift+A
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      adminModal.style.display = "flex";
      adminPasswordInput.focus();
    }
  });

  // Toggle password visibility
  toggleAdminEye.addEventListener("click", () => {
    if (adminPasswordInput.type === "password") {
      adminPasswordInput.type = "text";
      toggleAdminEye.textContent = "🙈";
    } else {
      adminPasswordInput.type = "password";
      toggleAdminEye.textContent = "👁️";
    }
  });

  // Admin login
  adminLoginBtn.addEventListener("click", async () => {
    const password = adminPasswordInput.value;

    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Admin mode activated!");
        adminModal.style.display = "none";
        adminPasswordInput.value = "";

        // Add admin indicator
        const indicator = document.createElement("div");
        indicator.id = "admin-indicator";
        indicator.textContent = "🔐 ADMIN MODE";
        document.body.appendChild(indicator);
        document.body.classList.add("admin-mode");
      } else {
        alert("❌ Wrong password!");
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  });

  adminCancelBtn.addEventListener("click", () => {
    adminModal.style.display = "none";
    adminPasswordInput.value = "";
  });

  // Close modal with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && adminModal.style.display === "flex") {
      adminModal.style.display = "none";
      adminPasswordInput.value = "";
    }
  });
}

// ================== INITIALIZE REVIEW SYSTEM ==================
document.addEventListener("DOMContentLoaded", () => {
  setupReviewSystem();
  setupAdminMode();
});