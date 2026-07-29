// ============================================
// Product Data
// ============================================
const products = [
  { id: 1, name: "Rose Bouquet", category: "flower Bouquet", price: 250, rating: 5, img: "images/1_bouquet.jpg", badge: "sale", stock: "In Stock" },
  { id: 2, name: "Gift Box Set", category: "flower Bouquet", price: 200, rating: 4, img: "images/2_bouquet.jpg", badge: "new", stock: "In Stock" },
  { id: 3, name: "Beaded Bracelet", category: "flower Bouquet", price: 250, rating: 5, img: "images/3_bouquet.jpg", badge: "", stock: "5 left" },
  { id: 4, name: "Custom Mug", category: "flower Bouquet", price: 280, rating: 4, img: "images/4_bouquet.jpg", badge: "best", stock: "In Stock" },
  { id: 5, name: "Keychain Souvenir", category: "flower Bouquet", price: 280, rating: 4, img: "images/5_bouquet.png", badge: "", stock: "In Stock" },
  { id: 6, name: "Sunflower Wrap", category: "flower Bouquet", price: 150, rating: 5, img: "images/6_bouquet.png", badge: "sale", stock: "3 left" },
  { id: 7, name: "Sunflower Wrap", category: "flower Bouquet", price: 150, rating: 5, img: "images/7_bouquet.png", badge: "sale", stock: "3 left" },
  { id: 8, name: "Sunflower Wrap", category: "flower Bouquet", price: 600, rating: 5, img: "images/8_bouquet.png", badge: "sale", stock: "3 left" },
  { id: 9, name: "Sunflower Wrap", category: "flower Bouquet", price: 280, rating: 5, img: "images/9_bouquet.png", badge: "sale", stock: "3 left" },
  { id: 10, name: "Sunflower Wrap", category: "flower Bouquet", price: 150, rating: 5, img: "images/10_bouquet.png", badge: "sale", stock: "3 left" },
  { id: 11, name: "Sunflower Wrap", category: "flower Bouquet", price: 85, rating: 5, img: "images/11_bouquet.png", badge: "sale", stock: "3 left" },
  { id: 12, name: "Sunflower Wrap", category: "flower Bouquet", price: 85, rating: 5, img: "images/12_bouquet.png", badge: "sale", stock: "3 left" }
];

// ============================================
// Categories Data
// ============================================
const categories = [
  { name: "Flower Bouquets", icon: "fa-flower", value: "flower Bouquet" },
  { name: "Gifts", icon: "fa-gift", value: "gifts" },
  { name: "Accessories", icon: "fa-gem", value: "accessories" },
  { name: "Customized", icon: "fa-paint-brush", value: "customized" },
  { name: "Souvenirs", icon: "fa-heart", value: "souvenirs" }
];

// ============================================
// Reviews Data
// ============================================
const reviews = [
  { name: "Maria S.", rating: 5, text: "Ang ganda ng bouquet! Highly recommended!", avatar: "👩" },
  { name: "Juan D.", rating: 5, text: "Superb quality and fast delivery. Will order again!", avatar: "👨" },
  { name: "Ana L.", rating: 4, text: "Very nice products. Sulit ang bayad.", avatar: "👩" },
  { name: "Pedro M.", rating: 5, text: "Perfect gift para kay girlfriend. She loved it!", avatar: "👨" }
];

// ============================================
// Cart State
// ============================================
let cart = JSON.parse(localStorage.getItem('artisanCart')) || [];

// ============================================
// DOM Elements
// ============================================
const productContainer = document.getElementById('productContainer');
const categoryCards = document.getElementById('categoryCards');
const reviewContainer = document.getElementById('reviewContainer');
const cartCountSpan = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItemsDiv = document.getElementById('cartItems');
const subtotalSpan = document.getElementById('subtotal');
const grandTotalSpan = document.getElementById('grandTotal');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const loader = document.getElementById('loader');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const mobileCartCount = document.getElementById('mobileCartCount');

// ============================================
// Render Products
// ============================================
function renderProducts(filteredProducts = products) {
  productContainer.innerHTML = filteredProducts.map(product => `
    <div class="product-card fade-up">
      ${product.badge ? `<span class="badge">${product.badge.toUpperCase()}</span>` : ''}
      <img src="${product.img}" alt="${product.name}" class="product-img" onclick="openLightbox('${product.img}')" loading="lazy">
      <h3>${product.name}</h3>
      ${product.stock ? `<p style="font-size:0.85rem;color:var(--text-light);">${product.stock}</p>` : ''}
      ${product.rating ? `<div class="rating">${Array(product.rating).fill('<i class="fas fa-star"></i>').join('')}${product.rating < 5 ? Array(5 - product.rating).fill('<i class="far fa-star"></i>').join('') : ''}</div>` : ''}
      <p class="price">₱${product.price.toLocaleString()}</p>
      <button class="add-to-cart-btn" data-id="${product.id}">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    </div>
  `).join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', addToCart);
  });
}

// ============================================
// Filter Products
// ============================================
function filterProducts() {
  let filtered = [...products];
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const priceSort = priceFilter.value;

  if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm));
  if (category !== 'all') filtered = filtered.filter(p => p.category === category);
  if (priceSort === 'low') filtered.sort((a, b) => a.price - b.price);
  if (priceSort === 'high') filtered.sort((a, b) => b.price - a.price);

  renderProducts(filtered);
}

searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
priceFilter.addEventListener('change', filterProducts);

// ============================================
// Render Categories
// ============================================
function renderCategories() {
  categoryCards.innerHTML = categories.map(cat => `
    <div class="category-card" onclick="filterByCategory('${cat.value}')">
      <i class="fas ${cat.icon}"></i>
      <h3>${cat.name}</h3>
    </div>
  `).join('');
}

window.filterByCategory = function(categoryValue) {
  categoryFilter.value = categoryValue;
  filterProducts();
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

// ============================================
// Render Reviews
// ============================================
function renderReviews() {
  reviewContainer.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-avatar">${review.avatar}</div>
      <h3>${review.name}</h3>
      <div class="rating">${Array(review.rating).fill('<i class="fas fa-star"></i>').join('')}</div>
      <p>"${review.text}"</p>
    </div>
  `).join('');
}

// ============================================
// Cart Functions
// ============================================
function addToCart(event) {
  const productId = parseInt(event.currentTarget.dataset.id);
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) { existingItem.qty += 1; }
  else { cart.push({ ...product, qty: 1 }); }
  
  updateCart();
  showToast(`${product.name} added to cart!`);
  
  const btn = event.currentTarget;
  btn.classList.add('added');
  setTimeout(() => btn.classList.remove('added'), 400);
}

function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeItem(productId);
  }
  updateCart();
}

function updateCart() {
  localStorage.setItem('artisanCart', JSON.stringify(cart));
  
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountSpan.textContent = totalItems;
  if (mobileCartCount) {
    mobileCartCount.textContent = totalItems;
    mobileCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
  
  renderCartItems();
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p style="text-align:center;padding:2rem;">Your cart is empty</p>';
  } else {
    cartItemsDiv.innerHTML = cart.map(item => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.8rem 0;border-bottom:1px solid var(--glass-border);">
        <div style="flex:1;">
          <strong>${item.name}</strong>
          <p style="font-size:0.85rem;color:var(--text-light);">₱${item.price} x ${item.qty}</p>
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn" style="padding:0.3rem 0.6rem;" onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="btn" style="padding:0.3rem 0.6rem;" onclick="changeQuantity(${item.id}, 1)">+</button>
          <button class="btn" style="padding:0.3rem 0.6rem;color:red;" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = cart.length > 0 ? 50 : 0;
  subtotalSpan.textContent = subtotal.toLocaleString();
  grandTotalSpan.textContent = (subtotal + shipping).toLocaleString();
}

window.changeQuantity = changeQuantity;
window.removeItem = removeItem;

// ============================================
// Checkout via Messenger
// ============================================
function checkoutViaMessenger() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }
  
  let message = "Hello po! Order ko po:\n\n";
  cart.forEach(item => { message += `✅ ${item.name} x${item.qty} - ₱${(item.price * item.qty).toLocaleString()}\n`; });
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + 50;
  
  message += `\n📦 Subtotal: ₱${subtotal.toLocaleString()}\n`;
  message += `🚚 Shipping: ₱50\n`;
  message += `💰 Total: ₱${total.toLocaleString()}\n\n`;
  message += "Name:\nAddress:\nContact Number:\n\nSalamat po! 🙏";
  
  const encodedMessage = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isMobile) {
    alert("📋 PLEASE COPY YOUR ORDER:\n\n" + message + "\n\nIdikit ito sa Messenger chat.");
    navigator.clipboard.writeText(message).catch(() => {});
    window.open('https://m.me/jerose.empuerto', '_blank');
  } else {
    window.open(`https://www.facebook.com/messages/t/jerose.empuerto?text=${encodedMessage}`, '_blank');
  }
}

// ============================================
// Cart Drawer Toggle
// ============================================
function openCart() { cartDrawer.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
function closeCart() { cartDrawer.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; }

document.getElementById('cartIcon').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.getElementById('checkoutBtn').addEventListener('click', checkoutViaMessenger);
document.getElementById('clearCart').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear your cart?')) { cart = []; updateCart(); showToast('Cart cleared!'); }
});

const mobileCartBtn = document.getElementById('mobileCartBtn');
if (mobileCartBtn) { mobileCartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); }); }

// ============================================
// Lightbox
// ============================================
let currentImageIndex = 0;
const productImages = products.map(p => p.img);

window.openLightbox = function(imgSrc) {
  lightboxImg.src = imgSrc;
  lightbox.classList.add('show');
  currentImageIndex = productImages.indexOf(imgSrc);
  document.body.style.overflow = 'hidden';
};

function closeLightbox() { lightbox.classList.remove('show'); document.body.style.overflow = ''; }
function nextImage() { currentImageIndex = (currentImageIndex + 1) % productImages.length; lightboxImg.src = productImages[currentImageIndex]; }
function prevImage() { currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length; lightboxImg.src = productImages[currentImageIndex]; }

document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
document.getElementById('nextImage').addEventListener('click', nextImage);
document.getElementById('prevImage').addEventListener('click', prevImage);

document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('show')) {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
  }
});

// ============================================
// Toast
// ============================================
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================================
// Theme Toggle
// ============================================
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

themeToggle.addEventListener('click', toggleTheme);

// ============================================
// Mobile Menu
// ============================================
mobileMenuBtn.addEventListener('click', () => { navLinks.classList.toggle('active'); });
document.querySelectorAll('.nav-link').forEach(link => { link.addEventListener('click', () => { navLinks.classList.remove('active'); }); });

// ============================================
// Mobile Filter Chips
// ============================================
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', function() {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    const category = this.dataset.category;
    if (category === 'all') { renderProducts(products); }
    else { renderProducts(products.filter(p => p.category === category)); }
  });
});

// ============================================
// Mobile Search
// ============================================
const searchToggle = document.getElementById('searchToggle');
const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
const closeMobileSearch = document.getElementById('closeMobileSearch');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchResults = document.getElementById('mobileSearchResults');

searchToggle.addEventListener('click', () => {
  if (window.innerWidth <= 768) { mobileSearchOverlay.classList.add('show'); mobileSearchInput.focus(); }
  else { searchInput.focus(); document.getElementById('products').scrollIntoView({ behavior: 'smooth' }); }
});

if (closeMobileSearch) { closeMobileSearch.addEventListener('click', () => { mobileSearchOverlay.classList.remove('show'); }); }

if (mobileSearchInput) {
  mobileSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    if (searchTerm === '') { mobileSearchResults.innerHTML = ''; return; }
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm));
    mobileSearchResults.innerHTML = filtered.map(p => `
      <div class="product-card" style="margin-bottom:1rem;">
        <img src="${p.img}" alt="${p.name}" class="product-img" style="height:150px;">
        <h3>${p.name}</h3>
        <p class="price">₱${p.price.toLocaleString()}</p>
        <button class="add-to-cart-btn" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Add to Cart</button>
      </div>
    `).join('');
    document.querySelectorAll('#mobileSearchResults .add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const productId = parseInt(this.dataset.id);
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) { existingItem.qty += 1; } else { cart.push({ ...product, qty: 1 }); }
        updateCart();
        showToast(`${product.name} added to cart!`);
        mobileSearchOverlay.classList.remove('show');
      });
    });
  });
}

// ============================================
// Mobile Bottom Nav Active State
// ============================================
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
window.addEventListener('scroll', () => {
  const sections = ['home', 'products', 'contact'];
  let current = '';
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) { const rect = element.getBoundingClientRect(); if (rect.top <= 100) { current = section; } }
  });
  mobileNavItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + current) { item.classList.add('active'); }
  });
});

// ============================================
// Swipe for Reviews
// ============================================
if (reviewContainer) {
  let isDown = false, startX, scrollLeft;
  reviewContainer.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - reviewContainer.offsetLeft; scrollLeft = reviewContainer.scrollLeft; });
  reviewContainer.addEventListener('mouseleave', () => { isDown = false; });
  reviewContainer.addEventListener('mouseup', () => { isDown = false; });
  reviewContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - reviewContainer.offsetLeft;
    const walk = (x - startX) * 2;
    reviewContainer.scrollLeft = scrollLeft - walk;
  });
}

// ============================================
// Scroll Progress Bar
// ============================================
window.addEventListener('scroll', () => {
  const scrollProgress = document.getElementById('scroll-progress');
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgress.style.width = scrolled + '%';
});

// ============================================
// Back to Top
// ============================================
document.getElementById('backToTop').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// Initialize
// ============================================
function init() {
  loadTheme();
  renderProducts();
  renderCategories();
  renderReviews();
  updateCart();
  setTimeout(() => { loader.classList.add('loader-hidden'); }, 600);
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileSearchOverlay) { mobileSearchOverlay.classList.remove('show'); }
});

console.log('🛍️ JeroseHandCraft Premium E-Commerce Ready!');
console.log('✨ Designed with 20 years of experience!');
