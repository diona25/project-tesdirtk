document.addEventListener("DOMContentLoaded", () => {
  var filterButtons = document.querySelectorAll(".filter-buttons  a");
  var filterableCards = document.querySelectorAll(".cards .card");
  var filterableCat = document.querySelectorAll(".dropdown-menu a");
  console.log(filterButtons, filterableCards, filterableCat);

  const filterCards = (e) => {
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    filterableCards.forEach((card) => {
      card.classList.add("hide");
      if (card.dataset.name === e.target.dataset.name || e.target.dataset.name === "all") {
        card.classList.remove("hide");
      }
    });
  };
  filterButtons.forEach((a) => a.addEventListener("click", filterCards));
  filterableCat.forEach((a) => a.addEventListener("click", filterCards));
  var filterButtons = document.querySelectorAll(".filter-buttons a");
  var filterableCards = document.querySelectorAll(".cards .card");
  var filterableCat = document.querySelectorAll(".dropdown-menu a");

  function applyFilters() {
    const activeCategory = document.querySelector(".filter-buttons a.active").dataset.name;
    const selectedPrice = parseFloat(document.getElementById("priceRange").value);

    document.querySelectorAll(".card").forEach((card) => {
      const cardPrice = parseFloat(card.dataset.price);
      const cardCategory = card.dataset.name;

      const priceMatch = cardPrice <= selectedPrice;
      const categoryMatch = activeCategory === "all" || cardCategory === activeCategory;

      card.style.display = priceMatch && categoryMatch ? "block" : "none";
    });
  }

  // Price filter
  document.getElementById("priceRange").addEventListener("input", applyFilters);
  // Get the range input and value display elements
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");

  // Update the displayed value when the slider moves
  priceRange.addEventListener("input", function () {
    priceValue.textContent = this.value;

    // If you want to add currency formatting (e.g., د.إ100)
    // priceValue.textContent = د.إ${this.value};
  });

  // Initialize the display with the default value
  priceValue.textContent = priceRange.value;
  // Category filters
  const handleCategoryFilter = (e) => {
    e.preventDefault();
    document.querySelector(".filter-buttons .active").classList.remove("active");
    e.target.classList.add("active");
    applyFilters();
  };

  filterButtons.forEach((a) => a.addEventListener("click", handleCategoryFilter));
  filterableCat.forEach((a) => a.addEventListener("click", handleCategoryFilter));
  
  // Star rating script (keep your existing code here)
  document.querySelectorAll(".stars").forEach((starContainer) => {
    const stars = starContainer.querySelectorAll("i");
    // ... your existing star rating code ...
  });
  document.querySelectorAll(".stars").forEach((starContainer) => {
    const stars = starContainer.querySelectorAll("i");
    stars.forEach((star) => {
      star.addEventListener("click", function () {
        const selectedRating = this.getAttribute("data-value");
        stars.forEach((s) => s.classList.remove("active"));
        this.classList.add("active");
        let previousSibling = this.previousElementSibling;
        while (previousSibling) {
          previousSibling.classList.add("active");
          previousSibling = previousSibling.previousElementSibling;
        }
      });
    });
  });

  const cartSidebar = document.querySelector(".cart-sidebar");
  const cartOverlay = document.querySelector(".cart-overlay");
  const closeCart = document.querySelector(".close-cart");
  const addToCartBtns = document.querySelectorAll(".add-to-cart");

  // Open cart
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
    });
  });

  // Close cart
  closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
  });

  // Close on overlay click
  cartOverlay.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Cart Class Definition
  class Cart {
    constructor() {
      this.items = JSON.parse(localStorage.getItem("cart")) || [];
      this.total = 0;
    }

    addItem(product) {
      const existingItem = this.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveToLocalStorage();
      this.updateCartDisplay();
    }

    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      this.saveToLocalStorage();
      this.updateCartDisplay();
    }

    calculateTotal() {
      this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    saveToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    }

    updateCartDisplay() {
      this.calculateTotal();
      const container = document.querySelector(".cart-items-container");
      const totalElement = document.getElementById("total-price");

      container.innerHTML = this.items
        .map(
          (item) => `
          <div class="cart-item d-flex align-items-center p-2 border-bottom">
              <img src="${item.image}" alt="${item.name}" width="50">
              <div class="item-info ms-3">
                  <h6 class="mb-0">${item.name}</h6>
                  <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                          <input type="number" 
                                 class="form-control quantity-input" 
                                 value="${item.quantity}"
                                 min="1"
                                 style="width: 60px; margin-right: 10px">
                          <span class="text-muted">$${item.price} each</span>
                      </div>
                      <button class="btn btn-link text-danger remove-item" data-id="${item.id}">
                          &times;
                      </button>
                  </div>
              </div>
          </div>
      `
        )
        .join("");

      // Update total
      this.calculateTotal();
      totalElement.textContent = this.total.toFixed(2);

      // Add input change handlers
      document.querySelectorAll(".quantity-input").forEach((input) => {
        input.addEventListener("change", (e) => {
          const newQuantity = parseInt(e.target.value);
          const itemId = e.target.closest(".cart-item").querySelector(".remove-item").dataset.id;
          if (!isNaN(newQuantity) && newQuantity > 0) {
            this.adjustQuantity(itemId, newQuantity);
          }
        });
      });

      // Keep original remove button handlers
      document.querySelectorAll(".remove-item").forEach((btn) => {
        btn.addEventListener("click", () => this.removeItem(btn.dataset.id));
      });
    }

    adjustQuantity(id, newQuantity) {
      const item = this.items.find((item) => item.id === id);
      if (item) {
        item.quantity = newQuantity;
        this.saveToLocalStorage();
        this.calculateTotal();
        this.updateCartDisplay();
      }
    }
  }

  // Initialize Cart
  const cart = new Cart();
  cart.updateCartDisplay(); // Initial display

  // Cart DOM Elements
  const cartSidebar = document.querySelector(".cart-sidebar");
  const cartOverlay = document.querySelector(".cart-overlay");
  const closeCart = document.querySelector(".close-cart");
  const addToCartBtns = document.querySelectorAll(".add-to-cart");
  const cartIcon = document.getElementById("cart-icon");
  const cartMob = document.getElementById("cart-mobile");

  // Add to Cart Functionality
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".card");
      const product = {
        id: card.dataset.id,
        name: card.querySelector(".card-title").textContent,
        price: parseFloat(card.querySelector(".price").textContent.replace("$", "")),
        image: card.querySelector("img").src,
      };
      cart.addItem(product);
    });
  });

  // Cart Visibility Controls
  const openCart = () => {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
  };

  const closeCartHandler = () => {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
  };

  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    openCart();
  });
  cartMob.addEventListener("click", (e) => {
    e.preventDefault();
    openCart();
  });

  closeCart.addEventListener("click", closeCartHandler);
  cartOverlay.addEventListener("click", closeCartHandler);
});
