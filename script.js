const STORAGE_KEYS = {
  settings: "aurevoMarketSettings",
  products: "aurevoMarketProducts",
  cart: "aurevoMarketCart",
};

const defaultSettings = {
  shopName: "Aurevo Market",
  phone: "+8801700000000",
  email: "hello@aurevomarket.com",
  whatsapp: "8801700000000",
  address: "Dhaka, Bangladesh",
};

const defaultProducts = [
  {
    id: 1,
    name: "Luna Smart Bottle",
    category: "Lifestyle",
    price: 1490,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description: "Insulated bottle for work, travel, workouts, and daily hydration.",
  },
  {
    id: 2,
    name: "Aster Glow Serum",
    category: "Beauty",
    price: 1990,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
    description: "Hydrating face serum designed to brighten and nourish your skin.",
  },
  {
    id: 3,
    name: "Nova Desk Lamp",
    category: "Home",
    price: 2390,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Minimal desk lamp with warm light for cozy work and reading spaces.",
  },
  {
    id: 4,
    name: "Orbit Travel Tote",
    category: "Accessories",
    price: 2650,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    description: "Spacious canvas tote built for workdays, travel, and everyday carry.",
  },
  {
    id: 5,
    name: "Cedar Aroma Candle",
    category: "Home",
    price: 990,
    image:
      "https://images.unsplash.com/photo-1602872029708-84d970d3386b?auto=format&fit=crop&w=900&q=80",
    description: "Warm cedar fragrance that transforms your room into a premium retreat.",
  },
  {
    id: 6,
    name: "Velora Wireless Earbuds",
    category: "Electronics",
    price: 3490,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description: "Compact earbuds with deep sound, touch control, and long battery life.",
  },
];

const state = {
  search: "",
  category: "All",
  cart: loadCart(),
};

const elements = {
  shopName: document.querySelector("#shopName"),
  productGrid: document.querySelector("#productGrid"),
  categoryNav: document.querySelector("#categoryNav"),
  searchInput: document.querySelector("#searchInput"),
  adminBtn: document.querySelector("#adminBtn"),
  adminModal: document.querySelector("#adminModal"),
  cartItems: document.querySelector("#cartItems"),
  cartBadge: document.querySelector("#cartBadge"),
  subtotalValue: document.querySelector("#subtotalValue"),
  shippingValue: document.querySelector("#shippingValue"),
  totalValue: document.querySelector("#totalValue"),
  checkoutBtn: document.querySelector("#checkoutBtn"),
  productCount: document.querySelector("#productCount"),
  shopSettingsForm: document.querySelector("#shopSettingsForm"),
  productForm: document.querySelector("#productForm"),
  featuredBtn: document.querySelector("#featuredBtn"),
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadSettings() {
  return readStorage(STORAGE_KEYS.settings, defaultSettings);
}

function saveSettings(settings) {
  writeStorage(STORAGE_KEYS.settings, settings);
}

function loadProducts() {
  return readStorage(STORAGE_KEYS.products, defaultProducts);
}

function saveProducts(products) {
  writeStorage(STORAGE_KEYS.products, products);
}

function loadCart() {
  return readStorage(STORAGE_KEYS.cart, []);
}

function saveCart(cart) {
  writeStorage(STORAGE_KEYS.cart, cart);
}

function syncShopInfo() {
  const settings = loadSettings();
  elements.shopName.textContent = settings.shopName || defaultSettings.shopName;

  document.querySelector("#shopNameInput").value = settings.shopName || "";
  document.querySelector("#phoneInput").value = settings.phone || "";
  document.querySelector("#emailInput").value = settings.email || "";
  document.querySelector("#whatsappInput").value = settings.whatsapp || "";
  document.querySelector("#addressInput").value = settings.address || "";
}

function getCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  return ["All", ...categories];
}

function renderCategoryNav() {
  const products = loadProducts();
  const categories = getCategories(products);

  elements.categoryNav.innerHTML = categories
    .map(
      (category) => `
        <button class="category-pill ${category === state.category ? "active" : ""}" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".category-pill").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      renderCategoryNav();
      renderProducts();
    });
  });
}

function getFilteredProducts() {
  const products = loadProducts();
  return products.filter((product) => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    const matchesSearch = haystack.includes(state.search.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function formatCurrency(value) {
  return `৳${Number(value).toLocaleString("en-BD")}`;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  elements.productCount.textContent = filteredProducts.length;

  if (!filteredProducts.length) {
    elements.productGrid.innerHTML = `
      <div class="empty-state">
        No products match your search. Try another keyword or category.
      </div>
    `;
    return;
  }

  elements.productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="card-body">
            <div class="card-top">
              <h4>${product.name}</h4>
              <span class="badge">${product.category}</span>
            </div>
            <p>${product.description}</p>
            <div class="card-meta">
              <span class="price">${formatCurrency(product.price)}</span>
              <button class="add-btn" data-add="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.add));
    });
  });
}

function addToCart(productId) {
  const product = loadProducts().find((item) => item.id === productId);
  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  saveCart(state.cart);
  renderCart();
}

function updateCartItem(productId, delta) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  saveCart(state.cart);
  renderCart();
}

function removeCartItem(productId) {
  state.cart = state.cart.filter((entry) => entry.id !== productId);
  saveCart(state.cart);
  renderCart();
}

function renderCart() {
  const products = loadProducts();
  const cartItems = state.cart
    .map((entry) => {
      const product = products.find((item) => item.id === entry.id);
      if (!product) return null;
      return {
        ...product,
        quantity: entry.quantity,
        lineTotal: product.price * entry.quantity,
      };
    })
    .filter(Boolean);

  if (!cartItems.length) {
    elements.cartItems.innerHTML = `
      <div class="empty-state">
        Your cart is empty. Add a few favorites to get started.
      </div>
    `;
  } else {
    elements.cartItems.innerHTML = cartItems
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" />
            <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-controls">
                <button class="qty-btn" data-delta="-1" data-product-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-delta="1" data-product-id="${item.id}">+</button>
              </div>
            </div>
            <div class="item-total">
              <strong>${formatCurrency(item.lineTotal)}</strong>
              <button class="remove-btn" data-remove="${item.id}">Remove</button>
            </div>
          </div>
        `
      )
      .join("");

    document.querySelectorAll("[data-delta]").forEach((button) => {
      button.addEventListener("click", () => {
        updateCartItem(Number(button.dataset.productId), Number(button.dataset.delta));
      });
    });

    document.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        removeCartItem(Number(button.dataset.remove));
      });
    });
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  elements.cartBadge.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  elements.subtotalValue.textContent = formatCurrency(subtotal);
  elements.shippingValue.textContent = formatCurrency(shipping);
  elements.totalValue.textContent = formatCurrency(total);
}

function openAdminModal() {
  syncShopInfo();
  elements.adminModal.classList.remove("hidden");
  elements.adminModal.setAttribute("aria-hidden", "false");
}

function closeAdminModal() {
  elements.adminModal.classList.add("hidden");
  elements.adminModal.setAttribute("aria-hidden", "true");
}

function handleShopSettingsSubmit(event) {
  event.preventDefault();

  const settings = {
    shopName: document.querySelector("#shopNameInput").value.trim() || defaultSettings.shopName,
    phone: document.querySelector("#phoneInput").value.trim() || defaultSettings.phone,
    email: document.querySelector("#emailInput").value.trim() || defaultSettings.email,
    whatsapp: document.querySelector("#whatsappInput").value.trim() || defaultSettings.whatsapp,
    address: document.querySelector("#addressInput").value.trim() || defaultSettings.address,
  };

  saveSettings(settings);
  syncShopInfo();
  closeAdminModal();
  alert("Shop settings saved successfully.");
}

function handleProductSubmit(event) {
  event.preventDefault();

  const products = loadProducts();
  const newProduct = {
    id: Date.now(),
    name: document.querySelector("#productNameInput").value.trim(),
    category: document.querySelector("#productCategoryInput").value.trim() || "General",
    price: Number(document.querySelector("#productPriceInput").value),
    image: document.querySelector("#productImageInput").value.trim(),
    description: document.querySelector("#productDescriptionInput").value.trim(),
  };

  if (!newProduct.name || !newProduct.image || !newProduct.description || !newProduct.price) {
    alert("Please fill in all product fields correctly.");
    return;
  }

  products.unshift(newProduct);
  saveProducts(products);
  renderCategoryNav();
  renderProducts();
  document.querySelector("#productForm").reset();
  alert("Demo product added successfully.");
}

function checkoutOnWhatsApp() {
  const settings = loadSettings();
  const products = loadProducts();

  if (!state.cart.length) {
    alert("Your cart is empty. Add products before checking out.");
    return;
  }

  const cartItems = state.cart
    .map((entry) => {
      const product = products.find((item) => item.id === entry.id);
      return product ? `${product.name} x${entry.quantity}` : "";
    })
    .filter(Boolean)
    .join(", ");

  const subtotal = state.cart.reduce((sum, entry) => {
    const product = products.find((item) => item.id === entry.id);
    return product ? sum + product.price * entry.quantity : sum;
  }, 0);

  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;
  const message = `Hello ${settings.shopName}, I want to place an order.\n\nItems: ${cartItems}\nSubtotal: ${formatCurrency(subtotal)}\nDelivery: ${formatCurrency(shipping)}\nTotal: ${formatCurrency(total)}\n\nCustomer details:\nName: Customer\nPhone: ${settings.phone}\nAddress: ${settings.address}`;

  const whatsappNumber = settings.whatsapp.replace(/\D/g, "");

  if (!whatsappNumber) {
    alert("Please save a valid WhatsApp number in the Admin panel.");
    openAdminModal();
    return;
  }

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProducts();
  });

  elements.adminBtn.addEventListener("click", openAdminModal);
  elements.featuredBtn.addEventListener("click", () => {
    state.category = "All";
    renderCategoryNav();
    renderProducts();
    document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelectorAll("[data-close]").forEach((element) => {
    element.addEventListener("click", closeAdminModal);
  });

  elements.shopSettingsForm.addEventListener("submit", handleShopSettingsSubmit);
  elements.productForm.addEventListener("submit", handleProductSubmit);
  elements.checkoutBtn.addEventListener("click", checkoutOnWhatsApp);
}

function init() {
  syncShopInfo();
  renderCategoryNav();
  renderProducts();
  renderCart();
  bindEvents();
}

init();









































