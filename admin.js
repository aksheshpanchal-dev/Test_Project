// ===== CONSTANTS =====
const ADMIN_CREDENTIALS = { email: 'admin@shopease.com', password: 'admin123' };
const ORDERS_KEY = 'shopease_orders';
const AUTH_KEY   = 'shopease_admin_auth';
const STATUSES   = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// ===== MOCK SEED ORDERS =====
const MOCK_ORDERS = [
  {
    id: 'SE-MOCK01',
    customer: { name: 'Alice Johnson', email: 'alice@example.com' },
    shipping: { address: '12 Oak Avenue', city: 'Austin', zip: '78701', country: 'United States' },
    items: [
      { id: 1, name: 'Premium Wireless Headphones', emoji: '🎧', price: 89.99, qty: 1 },
      { id: 3, name: 'Running Sneakers', emoji: '👟', price: 74.50, qty: 1 },
    ],
    total: 164.49, paymentMethod: 'card', paymentDetail: '•••• 4242',
    status: 'Delivered', date: '2026-03-25'
  },
  {
    id: 'SE-MOCK02',
    customer: { name: 'Bob Martinez', email: 'bob.m@example.com' },
    shipping: { address: '88 Elm Street', city: 'Chicago', zip: '60601', country: 'United States' },
    items: [
      { id: 2, name: 'Minimalist Watch', emoji: '⌚', price: 149.00, qty: 1 },
    ],
    total: 149.00, paymentMethod: 'cod', paymentDetail: 'Cash on Delivery',
    status: 'Shipped', date: '2026-03-29'
  },
  {
    id: 'SE-MOCK03',
    customer: { name: 'Clara Lee', email: 'clara.lee@example.com' },
    shipping: { address: '7 Maple Road', city: 'Seattle', zip: '98101', country: 'United States' },
    items: [
      { id: 4, name: 'Leather Backpack', emoji: '🎒', price: 119.00, qty: 1 },
      { id: 7, name: 'Stainless Water Bottle', emoji: '🧴', price: 29.99, qty: 2 },
    ],
    total: 178.98, paymentMethod: 'card', paymentDetail: '•••• 7891',
    status: 'Processing', date: '2026-04-01'
  },
  {
    id: 'SE-MOCK04',
    customer: { name: 'David Kim', email: 'david.k@example.com' },
    shipping: { address: '203 Pine Street', city: 'Boston', zip: '02101', country: 'United States' },
    items: [
      { id: 8, name: 'Mechanical Keyboard', emoji: '⌨️', price: 129.00, qty: 1 },
    ],
    total: 129.00, paymentMethod: 'cod', paymentDetail: 'Cash on Delivery',
    status: 'Pending', date: '2026-04-03'
  },
  {
    id: 'SE-MOCK05',
    customer: { name: 'Eva Patel', email: 'eva.p@example.com' },
    shipping: { address: '56 Birch Lane', city: 'Miami', zip: '33101', country: 'United States' },
    items: [
      { id: 5, name: 'Scented Candle Set', emoji: '🕯️', price: 34.99, qty: 3 },
    ],
    total: 104.97, paymentMethod: 'card', paymentDetail: '•••• 3310',
    status: 'Pending', date: '2026-04-04'
  },
  {
    id: 'SE-MOCK06',
    customer: { name: 'Frank Torres', email: 'frank.t@example.com' },
    shipping: { address: '19 Cedar Blvd', city: 'Denver', zip: '80201', country: 'United States' },
    items: [
      { id: 6, name: 'Polarized Sunglasses', emoji: '🕶️', price: 59.00, qty: 2 },
      { id: 3, name: 'Running Sneakers', emoji: '👟', price: 74.50, qty: 1 },
    ],
    total: 192.50, paymentMethod: 'card', paymentDetail: '•••• 5599',
    status: 'Cancelled', date: '2026-03-20'
  },
  {
    id: 'SE-MOCK07',
    customer: { name: 'Grace Wu', email: 'grace.wu@example.com' },
    shipping: { address: '31 Walnut Drive', city: 'Portland', zip: '97201', country: 'United States' },
    items: [
      { id: 1, name: 'Premium Wireless Headphones', emoji: '🎧', price: 89.99, qty: 2 },
    ],
    total: 179.98, paymentMethod: 'cod', paymentDetail: 'Cash on Delivery',
    status: 'Delivered', date: '2026-03-18'
  },
  {
    id: 'SE-MOCK08',
    customer: { name: 'Henry Zhao', email: 'henry.z@example.com' },
    shipping: { address: '5 Spruce Court', city: 'Phoenix', zip: '85001', country: 'United States' },
    items: [
      { id: 2, name: 'Minimalist Watch', emoji: '⌚', price: 149.00, qty: 1 },
      { id: 4, name: 'Leather Backpack', emoji: '🎒', price: 119.00, qty: 1 },
    ],
    total: 268.00, paymentMethod: 'card', paymentDetail: '•••• 0011',
    status: 'Shipped', date: '2026-04-02'
  },
];

// ===== HELPERS =====
const $ = id => document.getElementById(id);

function safeLocalStorage(fn) {
  try { return fn(); } catch { return null; }
}

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== AUTH MODULE =====
function isAuthenticated() {
  return safeLocalStorage(() => localStorage.getItem(AUTH_KEY) === '1') === true;
}

function login(email, password) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    safeLocalStorage(() => localStorage.setItem(AUTH_KEY, '1'));
    return true;
  }
  return false;
}

function logout() {
  safeLocalStorage(() => localStorage.removeItem(AUTH_KEY));
  $('adminShell').hidden = true;
  $('loginScreen').style.display = 'flex';
}

function initAuthGate() {
  if (isAuthenticated()) {
    showAdminShell();
  } else {
    $('loginScreen').style.display = 'flex';
    $('adminShell').hidden = true;
  }
}

function showAdminShell() {
  $('loginScreen').style.display = 'none';
  $('adminShell').hidden = false;
  $('sidebarUser').textContent = ADMIN_CREDENTIALS.email;
  $('pageDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  renderDashboard();
  switchView('dashboard');
}

// ===== DATA MODULE =====
function loadOrders() {
  const stored = safeLocalStorage(() => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')) || [];
  // Merge mock orders with real orders; deduplicate by id, real orders take priority
  const realIds = new Set(stored.map(o => o.id));
  const seeded = MOCK_ORDERS.filter(o => !realIds.has(o.id));
  const merged = [...stored, ...seeded].sort((a, b) => new Date(b.date) - new Date(a.date));
  saveOrders(merged);
  return merged;
}

function saveOrders(orders) {
  safeLocalStorage(() => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)));
}

function updateOrderStatus(id, newStatus) {
  const orders = loadOrders();
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = newStatus;
    saveOrders(orders);
  }
  return orders;
}

// ===== DASHBOARD MODULE =====
function renderDashboard() {
  const orders = loadOrders();
  const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const pending   = orders.filter(o => o.status === 'Pending').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  $('statTotal').textContent     = orders.length;
  $('statRevenue').textContent   = '$' + revenue.toFixed(2);
  $('statPending').textContent   = pending;
  $('statDelivered').textContent = delivered;

  // Recent orders (last 5)
  const recent = orders.slice(0, 5);
  $('recentTableBody').innerHTML = recent.map(o => `
    <tr data-id="${o.id}" class="clickable-row">
      <td><span class="order-id-cell">${o.id}</span></td>
      <td><div class="customer-name">${o.customer.name}</div></td>
      <td><strong>$${o.total.toFixed(2)}</strong></td>
      <td>${paymentBadge(o.paymentMethod)}</td>
      <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
      <td>${o.date}</td>
    </tr>
  `).join('');

  $('recentTableBody').querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => {
      const order = orders.find(o => o.id === row.dataset.id);
      if (order) openOrderModal(order);
    });
  });
}

// ===== ORDERS MODULE =====
let currentFilter = 'All';
let searchQuery   = '';

function applyFilter() {
  const orders = loadOrders();
  let filtered = orders;
  if (currentFilter !== 'All') {
    filtered = filtered.filter(o => o.status === currentFilter);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q)
    );
  }
  renderOrdersTable(filtered, orders);
}

function renderOrdersTable(filtered, allOrders) {
  const tbody = $('ordersTableBody');
  const empty = $('tableEmpty');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(o => `
    <tr data-id="${o.id}">
      <td><span class="order-id-cell">${o.id}</span></td>
      <td>
        <div class="customer-name">${o.customer.name}</div>
        <div class="customer-email">${o.customer.email}</div>
      </td>
      <td>${o.items.length} item${o.items.length > 1 ? 's' : ''}</td>
      <td><strong>$${o.total.toFixed(2)}</strong></td>
      <td>${paymentBadge(o.paymentMethod)}</td>
      <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
      <td>${o.date}</td>
      <td>
        <select class="status-select" data-id="${o.id}">
          ${STATUSES.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>
  `).join('');

  // Event delegation on tbody
  tbody.addEventListener('click', e => {
    // Status select change — don't open modal
    if (e.target.matches('.status-select')) return;
    const row = e.target.closest('tr[data-id]');
    if (!row) return;
    const order = allOrders.find(o => o.id === row.dataset.id);
    if (order) openOrderModal(order);
  }, { once: true }); // Re-attached on each render

  // Re-attach (once won't re-fire after re-render)
  tbody.removeEventListener('click', tbody._clickHandler);
  tbody._clickHandler = e => {
    if (e.target.matches('.status-select')) return;
    const row = e.target.closest('tr[data-id]');
    if (!row) return;
    const order = allOrders.find(o => o.id === row.dataset.id);
    if (order) openOrderModal(order);
  };
  tbody.addEventListener('click', tbody._clickHandler);

  tbody.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', e => {
      e.stopPropagation();
      const updated = updateOrderStatus(select.dataset.id, select.value);
      renderDashboard();
      applyFilter();
      showToast(`Order ${select.dataset.id} → ${select.value}`);
    });
  });
}

// ===== PAYMENT BADGE HELPER =====
function paymentBadge(method) {
  return method === 'cod'
    ? `<span class="pay-method-badge pay-cod">&#128181; COD</span>`
    : `<span class="pay-method-badge pay-card">&#128179; Card</span>`;
}

// ===== ORDER MODAL =====
function openOrderModal(order) {
  $('modalOrderId').textContent = `Order ${order.id}`;
  $('modalStatus').textContent  = order.status;
  $('modalStatus').className    = `status-badge status-${order.status.toLowerCase()}`;

  const s = order.shipping;
  $('modalAddress').innerHTML = `
    <strong>${order.customer.name}</strong><br>
    ${s.address}<br>${s.city}, ${s.zip}<br>${s.country}
  `;

  $('modalPayment').innerHTML = order.paymentMethod === 'cod'
    ? `<span class="pay-method-badge pay-cod">&#128181; Cash on Delivery</span>`
    : `<span class="pay-method-badge pay-card">&#128179; Card ${order.paymentDetail}</span>`;

  $('modalItems').innerHTML = order.items.map(item => `
    <div class="modal-item">
      <div class="modal-item-left">
        <span class="modal-item-emoji">${item.emoji}</span>
        <div>
          <div class="modal-item-name">${item.name}</div>
          <div class="modal-item-qty">Qty: ${item.qty}</div>
        </div>
      </div>
      <span class="modal-item-price">$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');

  $('modalTotal').innerHTML = `<span>Order Total</span><span>$${order.total.toFixed(2)}</span>`;

  $('orderModal').classList.add('open');
}

function closeOrderModal() {
  $('orderModal').classList.remove('open');
}

// ===== NAV / VIEW ROUTER =====
function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => { v.hidden = true; });
  $(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`).hidden = false;

  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.view === viewName);
  });

  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'orders')    applyFilter();
}

// ===== INIT =====
function init() {
  // Auth gate
  initAuthGate();

  // Login form
  $('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('adminEmail').value.trim();
    const pass  = $('adminPassword').value;
    if (login(email, pass)) {
      $('loginError').textContent = '';
      showAdminShell();
    } else {
      $('loginError').textContent = 'Invalid email or password.';
    }
  });

  // Logout
  $('logoutBtn').addEventListener('click', () => {
    logout();
    showToast('Signed out successfully.');
  });

  // Sidebar nav
  document.querySelectorAll('.nav-link[data-view]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchView(link.dataset.view);
    });
  });

  // "View All" button on dashboard
  document.querySelectorAll('[data-view="orders"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      switchView('orders');
    });
  });

  // Filter tabs
  $('filterTabs').addEventListener('click', e => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.status;
    applyFilter();
  });

  // Search
  $('orderSearch').addEventListener('input', e => {
    searchQuery = e.target.value;
    applyFilter();
  });

  // Modal close
  $('closeModal').addEventListener('click', closeOrderModal);
  $('orderModal').addEventListener('click', e => {
    if (e.target === $('orderModal')) closeOrderModal();
  });
}

init();
