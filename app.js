// ===== PRODUCT DATA =====
const PRODUCTS = [
  {
    id: 1, name: "Premium Wireless Headphones", category: "Electronics",
    price: 89.99, emoji: "🎧",
    desc: "Immersive sound with active noise cancellation and 30-hour battery life."
  },
  {
    id: 2, name: "Minimalist Watch", category: "Accessories",
    price: 149.00, emoji: "⌚",
    desc: "Elegant design with sapphire glass and Swiss movement. Water resistant."
  },
  {
    id: 3, name: "Running Sneakers", category: "Footwear",
    price: 74.50, emoji: "👟",
    desc: "Lightweight foam cushioning for maximum comfort on every run."
  },
  {
    id: 4, name: "Leather Backpack", category: "Bags",
    price: 119.00, emoji: "🎒",
    desc: "Full-grain leather with padded laptop compartment. Fits 15\" laptops."
  },
  {
    id: 5, name: "Scented Candle Set", category: "Home",
    price: 34.99, emoji: "🕯️",
    desc: "Hand-poured soy wax candles in 4 seasonal fragrances. 40-hour burn."
  },
  {
    id: 6, name: "Polarized Sunglasses", category: "Accessories",
    price: 59.00, emoji: "🕶️",
    desc: "UV400 protection with lightweight titanium frames in 6 color options."
  },
  {
    id: 7, name: "Stainless Water Bottle", category: "Sports",
    price: 29.99, emoji: "🧴",
    desc: "Triple-wall insulation keeps drinks cold 24h and hot 12h. BPA-free."
  },
  {
    id: 8, name: "Mechanical Keyboard", category: "Electronics",
    price: 129.00, emoji: "⌨️",
    desc: "Tactile cherry MX switches with per-key RGB lighting. Tenkeyless layout."
  },
];

// ===== STATE =====
const state = {
  cart: [],
  user: null,
  shipping: null,
  payment: null,
};

// ===== DOM REFERENCES =====
const $ = id => document.getElementById(id);

// ===== RENDER PRODUCTS =====
function renderProducts() {
  const grid = $('productsGrid');
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">${p.emoji}</div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    addToCart(+btn.dataset.id);
  });
}

// ===== CART =====
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.emoji} "${product.name}" added to cart`);
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function getCartTotal() {
  return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartCount() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  $('cartCount').textContent = count;

  const itemsEl = $('cartItems');
  const emptyEl = $('cartEmpty');
  const footerEl = $('cartFooter');

  if (state.cart.length === 0) {
    itemsEl.innerHTML = '';
    itemsEl.appendChild(emptyEl);
    emptyEl.style.display = 'flex';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';

  itemsEl.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
      </div>
    </div>
  `).join('');

  $('cartTotal').textContent = `$${getCartTotal().toFixed(2)}`;

  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => changeQty(+btn.dataset.id, +btn.dataset.delta));
  });
}

// ===== CART DRAWER =====
function openCart() {
  $('cartDrawer').classList.add('open');
  $('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  $('cartDrawer').classList.remove('open');
  $('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

$('cartBtn').addEventListener('click', openCart);
$('closeCart').addEventListener('click', closeCart);
$('cartOverlay').addEventListener('click', closeCart);

// ===== LOGIN MODAL =====
function openLogin() {
  $('loginModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLogin() {
  $('loginModal').classList.remove('open');
  document.body.style.overflow = '';
}

$('loginBtn').addEventListener('click', openLogin);
$('closeLogin').addEventListener('click', closeLogin);
$('loginModal').addEventListener('click', e => { if (e.target === $('loginModal')) closeLogin(); });

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.tab-content[data-tab="${tab}"]`).classList.add('active');
  });
});

// Sign In
$('signinForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('signinEmail').value.trim();
  const pass = $('signinPassword').value;
  if (pass.length < 6) {
    $('signinError').textContent = 'Password must be at least 6 characters.';
    return;
  }
  $('signinError').textContent = '';
  state.user = { email, name: email.split('@')[0] };
  closeLogin();
  updateAuthUI();
  showToast(`Welcome back, ${state.user.name}!`);
});

// Sign Up
$('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('signupName').value.trim();
  const email = $('signupEmail').value.trim();
  const pass = $('signupPassword').value;
  if (pass.length < 6) {
    $('signupError').textContent = 'Password must be at least 6 characters.';
    return;
  }
  $('signupError').textContent = '';
  state.user = { email, name };
  closeLogin();
  updateAuthUI();
  showToast(`Account created! Welcome, ${name}!`);
});

function updateAuthUI() {
  const btn = $('loginBtn');
  if (state.user) {
    btn.textContent = state.user.name;
    btn.onclick = () => {
      state.user = null;
      btn.textContent = 'Login';
      btn.onclick = openLogin;
      showToast('Signed out successfully.');
    };
  }
}

// ===== CHECKOUT =====
function openCheckout() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  closeCart();
  $('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  goToStep(1);
}
function closeCheckout() {
  $('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

$('checkoutBtn').addEventListener('click', openCheckout);
$('closeCheckout').addEventListener('click', closeCheckout);
$('checkoutModal').addEventListener('click', e => { if (e.target === $('checkoutModal')) closeCheckout(); });

function goToStep(n) {
  [1, 2, 3].forEach(i => {
    $(`checkoutStep${i}`).classList.toggle('active', i === n);
    const ind = $(`step${i}indicator`);
    ind.classList.remove('active', 'done');
    if (i === n) ind.classList.add('active');
    else if (i < n) ind.classList.add('done');
  });
}

// Step 1: Shipping
$('shippingForm').addEventListener('submit', e => {
  e.preventDefault();
  state.shipping = {
    firstName: $('firstName').value,
    lastName: $('lastName').value,
    email: $('shippingEmail').value,
    address: $('address').value,
    city: $('city').value,
    zip: $('zip').value,
    country: $('country').value,
  };
  goToStep(2);
});

// Card number formatting
$('cardNumber').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
});

$('cardExpiry').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
  e.target.value = v;
});

// Step 2: Payment
$('paymentForm').addEventListener('submit', e => {
  e.preventDefault();
  const num = $('cardNumber').value.replace(/\s/g, '');
  if (num.length < 15) {
    $('paymentError').textContent = 'Please enter a valid card number.';
    return;
  }
  $('paymentError').textContent = '';
  state.payment = {
    name: $('cardName').value,
    last4: num.slice(-4),
    expiry: $('cardExpiry').value,
  };
  buildReview();
  goToStep(3);
});

$('backToShipping').addEventListener('click', () => goToStep(1));
$('backToPayment').addEventListener('click', () => goToStep(2));

function buildReview() {
  const s = state.shipping;
  $('reviewAddress').textContent = `${s.firstName} ${s.lastName}, ${s.address}, ${s.city} ${s.zip}, ${s.country}`;
  $('reviewCard').textContent = `•••• •••• •••• ${state.payment.last4} (${state.payment.expiry})`;

  $('reviewItems').innerHTML = state.cart.map(item => `
    <div class="review-item">
      <span>${item.emoji} ${item.name} × ${item.qty}</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');

  $('reviewTotal').textContent = `$${getCartTotal().toFixed(2)}`;
}

// Place Order
$('placeOrderBtn').addEventListener('click', () => {
  closeCheckout();
  const orderId = 'SE-' + Math.random().toString(36).substring(2,8).toUpperCase();
  $('orderId').textContent = `Order #${orderId}`;
  $('successModal').classList.add('open');
  state.cart = [];
  updateCartUI();
});

$('closeSuccess').addEventListener('click', () => {
  $('successModal').classList.remove('open');
  document.body.style.overflow = '';
});
$('successModal').addEventListener('click', e => {
  if (e.target === $('successModal')) {
    $('successModal').classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== INIT =====
renderProducts();
updateCartUI();
