// ============================================================
// 1. ELEMENTS
// ============================================================
const productGrid = document.getElementById('productGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');
const countEl     = document.querySelector('.text-xs.text-neutral-400.font-sans.mt-3');

// ============================================================
// 2. STATE
// ============================================================
const STEP = 8;
let allProducts      = [];
let filteredProducts = [];
let currentCount     = STEP;

// ============================================================
// 3. CART & WISHLIST — localStorage helpers
// ============================================================
function getCart()      { return JSON.parse(localStorage.getItem('cartItems'))     || []; }
function getWishlist()  { return JSON.parse(localStorage.getItem('wishlistItems')) || []; }
function saveCart(c)    { localStorage.setItem('cartItems',     JSON.stringify(c)); }
function saveWishlist(w){ localStorage.setItem('wishlistItems', JSON.stringify(w)); }

// ============================================================
// 4. BADGE SYNC
// ============================================================
function updateBadges() {
  const cartTotal = getCart().reduce((s, i) => s + i.qty, 0);
  const wishTotal = getWishlist().length;
  const cartBadge = document.getElementById('cartBadge');
  const wishBadge = document.getElementById('wishBadge');
  if (cartBadge) cartBadge.textContent = cartTotal;
  if (wishBadge) wishBadge.textContent = wishTotal;
}

// ============================================================
// 5. LOGIN CHECK
// ============================================================
function requireLogin() {
  if (JSON.parse(localStorage.getItem('currentUser'))) return true;
  Swal.fire({
    icon: 'warning',
    title: 'Sign in required',
    text: 'Please sign in first to continue.',
    confirmButtonColor: '#d4847a',
    confirmButtonText: 'Sign In',
    showCancelButton: true,
    cancelButtonColor: '#aaa',
    cancelButtonText: 'Cancel'
  }).then(r => { if (r.isConfirmed) window.location.href = '../Authentication/login.html'; });
  return false;
}

// ============================================================
// 6. ADD TO CART
// ============================================================
function addToCart(product) {
  if (!requireLogin()) return;   // ← لو مش logged in يوقف هنا

  const cart  = getCart();
  const index = cart.findIndex(i => i.id === product.id);
  if (index > -1) { cart[index].qty += 1; }
  else { cart.push({ id: product.id, title: product.title, price: product.price, img: product.thumbnail, category: product.category, qty: 1 }); }
  saveCart(cart);
  updateBadges();
  Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added to cart!', text: product.title, showConfirmButton: false, timer: 2000, timerProgressBar: true, iconColor: '#d4847a', customClass: { popup: 'font-sans text-sm' } });
}

// ============================================================
// 7. ADD TO WISHLIST
// ============================================================
function addToWishlist(product) {
  if (!requireLogin()) return;   // ← لو مش logged in يوقف هنا

  const wishlist = getWishlist();
  if (wishlist.find(i => i.id === product.id)) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'Already in wishlist!', text: product.title, showConfirmButton: false, timer: 1800, timerProgressBar: true, iconColor: '#d4847a' });
    return;
  }
  wishlist.push({ id: product.id, title: product.title, price: product.price, img: product.thumbnail, category: product.category, discount: product.discountPercentage ? Math.round(product.discountPercentage) : 0, rating: product.rating || 0, reviews: product.reviews?.length ?? 0 });
  saveWishlist(wishlist);
  updateBadges();
  Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added to wishlist!', text: product.title, showConfirmButton: false, timer: 2000, timerProgressBar: true, iconColor: '#d4847a' });
}

// ============================================================
// 8. API URLs
// ============================================================
const apiUrls = [
  "https://dummyjson.com/products/category/womens-dresses?limit=100",
  "https://dummyjson.com/products/category/womens-shoes?limit=100",
  "https://dummyjson.com/products/category/womens-bags?limit=100",
  "https://dummyjson.com/products/category/womens-jewellery?limit=100",
  "https://dummyjson.com/products/category/tops?limit=100",
];

// ============================================================
// 9. FETCH
// ============================================================
async function fetchProducts() {
  productGrid.innerHTML = Array(8).fill(`
    <div class="bg-white rounded-xl border border-[#f0e6e0] overflow-hidden animate-pulse">
      <div class="aspect-[3/4] bg-[#f0e6e0]"></div>
      <div class="p-3.5 flex flex-col gap-2">
        <div class="h-3 bg-[#f0e6e0] rounded w-1/3"></div>
        <div class="h-4 bg-[#f0e6e0] rounded w-3/4"></div>
        <div class="h-3 bg-[#f0e6e0] rounded w-1/2"></div>
      </div>
    </div>`).join('');

  const results = await Promise.all(apiUrls.map(u => fetch(u).then(r => r.json())));
  results.forEach(data => { allProducts = allProducts.concat(data.products || []); });
  allProducts.sort(() => Math.random() - 0.5);
  filteredProducts = [...allProducts];
  productGrid.innerHTML = '';
  renderCards(0, currentCount);
  updateCount();
  updateLoadMoreBtn();
  updateBadges();
}

// ============================================================
// 10. BUILD STARS
// ============================================================
function buildStars(rating) {
  const r = Math.round(rating || 0);
  return Array.from({ length: 5 }, (_, i) => `
    <svg class="w-3 h-3 ${i < r ? 'text-[#d4847a]' : 'text-neutral-200'}" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>`).join('');
}

// ============================================================
// 11. BUILD CARD
// ============================================================
function buildCard(product) {
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
  const badge = discount > 20
    ? `<span class="absolute top-3 left-3 bg-neutral-800 text-white text-[0.65rem] font-sans font-semibold px-2.5 py-0.5 rounded-full tracking-wide">Sale</span>`
    : `<span class="absolute top-3 left-3 bg-[#d4847a] text-white text-[0.65rem] font-sans font-semibold px-2.5 py-0.5 rounded-full tracking-wide">New</span>`;
  const oldPrice = discount
    ? `<span class="text-xs text-neutral-400 line-through font-sans">$${(product.price / (1 - discount / 100)).toFixed(0)}</span>
       <span class="text-[0.65rem] text-[#d4847a] font-sans font-semibold bg-[#fdf0ed] px-2 py-0.5 rounded-full">-${discount}%</span>`
    : '';

  const card = document.createElement('div');
  card.className = "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#f0e6e0]";
  card.innerHTML = `
    <div class="relative overflow-hidden aspect-[3/4] bg-[#f5efed]">
      <img src="${product.thumbnail}" alt="${product.title}"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onerror="this.src='https://placehold.co/400x530/f5efed/d4847a?text=Brand'" />
      ${badge}
      <button class="wish-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-400 hover:text-[#d4847a] transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <button class="cart-btn w-full bg-[#1a1a1a]/90 hover:bg-[#d4847a] text-white text-xs font-sans font-medium py-2.5 tracking-wide transition-colors duration-200">
          + Add to Cart
        </button>
      </div>
    </div>
    <div class="p-3.5">
      <p class="text-[0.7rem] text-neutral-400 font-sans uppercase tracking-widest mb-0.5">${product.category}</p>
      <h3 class="font-brand text-[1.05rem] text-neutral-800 leading-snug mb-1 truncate">${product.title}</h3>
      <div class="flex items-center gap-1 mb-2">
        <div class="flex gap-0.5">${buildStars(product.rating)}</div>
        <span class="text-[0.65rem] text-neutral-400 font-sans">(${product.reviews?.length ?? 0})</span>
      </div>
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="font-brand text-[1.1rem] font-semibold text-neutral-800">$${product.price}</span>
        ${oldPrice}
      </div>
    </div>`;

  card.querySelector('.cart-btn').addEventListener('click', () => addToCart(product));
  card.querySelector('.wish-btn').addEventListener('click', () => addToWishlist(product));
  return card;
}

// ============================================================
// 12. RENDER
// ============================================================
function renderCards(from, to) {
  filteredProducts.slice(from, to).forEach(p => productGrid.appendChild(buildCard(p)));
}

function updateCount() {
  if (!countEl) return;
  const shown = Math.min(currentCount, filteredProducts.length);
  countEl.innerHTML = `Showing <span class="text-neutral-600 font-medium">${shown}</span> of <span class="text-neutral-600 font-medium">${filteredProducts.length}</span> results`;
}

function updateLoadMoreBtn() {
  if (!loadMoreBtn) return;
  loadMoreBtn.style.display = currentCount >= filteredProducts.length ? 'none' : 'inline-block';
}

// ============================================================
// 13. LOAD MORE
// ============================================================
loadMoreBtn.addEventListener('click', () => {
  const from = currentCount;
  const to   = Math.min(currentCount + STEP, filteredProducts.length);
  renderCards(from, to);
  currentCount = to;
  updateCount();
  updateLoadMoreBtn();
});

// ============================================================
// 14. SEARCH & FILTERS
// ============================================================
function applyFilters() {
  const query     = searchInput.value.trim().toLowerCase();
  const maxPrice  = parseInt(document.getElementById('priceRange')?.value || 500);
  const minRating = parseInt(document.querySelector('input[name="rating"]:checked')?.value || 0);
  const activeTypeBtn = document.querySelector('.filter-tag.bg-\\[\\#d4847a\\]');
  const activeType    = activeTypeBtn ? activeTypeBtn.textContent.trim().toLowerCase() : 'all';

  filteredProducts = allProducts.filter(p => {
    const matchSearch = !query || p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
    const matchType   = activeType === 'all' || p.category.toLowerCase().includes(activeType);
    const matchPrice  = p.price <= maxPrice;
    const matchRating = Math.round(p.rating || 0) >= minRating;
    return matchSearch && matchType && matchPrice && matchRating;
  });

  currentCount = STEP;
  productGrid.innerHTML = '';

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `<div class="col-span-4 text-center py-20 font-brand text-2xl text-neutral-400">No results found for "<span class="text-[#d4847a]">${searchInput.value || 'these filters'}</span>"</div>`;
    loadMoreBtn.style.display = 'none';
    if (countEl) countEl.innerHTML = `Showing <span class="text-neutral-600 font-medium">0</span> results`;
    return;
  }

  renderCards(0, currentCount);
  updateCount();
  updateLoadMoreBtn();
}

searchBtn.addEventListener('click', applyFilters);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilters(); });
searchInput.addEventListener('input',   () => { if (searchInput.value === '') applyFilters(); });

// ============================================================
// 15. MOBILE MENU
// ============================================================
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('navbar-default').classList.toggle('hidden');
});

// ============================================================
// 16. AUTH
// ============================================================
const authBtn     = document.getElementById('authBtn');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser) authBtn.textContent = currentUser.name.split(' ')[0];

authBtn.addEventListener('click', () => {
  if (JSON.parse(localStorage.getItem('currentUser'))) {
    Swal.fire({ title: 'Log out?', icon: 'question', showCancelButton: true, confirmButtonColor: '#d4847a', cancelButtonColor: '#aaa', confirmButtonText: 'Yes, Logout' })
    .then(r => {
      if (r.isConfirmed) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartCount');
        localStorage.removeItem('wishlistItems');
        localStorage.removeItem('wishlistCount');
        location.reload();
      }
    });
  } else {
    window.location.href = '../Authentication/login.html';
  }
});

// ============================================================
// 17. NAVBAR ICON LINKS
// ============================================================
const navCartIcon = document.querySelector('[onclick="addToCart()"]');
if (navCartIcon) {
  navCartIcon.removeAttribute('onclick');
  navCartIcon.style.cursor = 'pointer';
  navCartIcon.addEventListener('click', () => { window.location.href = 'cart.html'; });
}
const navWishIcon = document.querySelector('[onclick="addToWishlist()"]');
if (navWishIcon) {
  navWishIcon.removeAttribute('onclick');
  navWishIcon.style.cursor = 'pointer';
  navWishIcon.addEventListener('click', () => { window.location.href = 'wishlist.html'; });
}

fetchProducts();