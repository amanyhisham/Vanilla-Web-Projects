const getCart     = () => JSON.parse(localStorage.getItem('cartItems'))     || [];
const getWishlist = () => JSON.parse(localStorage.getItem('wishlistItems')) || [];
const saveCart     = c  => localStorage.setItem('cartItems',     JSON.stringify(c));
const saveWishlist = w  => localStorage.setItem('wishlistItems', JSON.stringify(w));

function syncBadges() {
  const ct = getCart().reduce((s, i) => s + (i.qty || 1), 0);
  const wt = getWishlist().length;
  document.querySelectorAll('#cartBadge').forEach(el => el.textContent = ct);
  document.querySelectorAll('#wishBadge').forEach(el => el.textContent = wt);
}

// ── Login Check ──────────────────────────────────────────────
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

// ── Add to Cart ──────────────────────────────────────────────
function addToCart(product) {
  if (!requireLogin()) return;   // ← لو مش logged in يوقف هنا

  const cart = getCart();
  const idx  = cart.findIndex(i => i.id === product.id);
  if (idx > -1) { cart[idx].qty += 1; }
  else { cart.push({ id: product.id, title: product.title, price: product.price, img: product.thumbnail, category: product.category, qty: 1 }); }
  saveCart(cart);
  syncBadges();
  Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added to cart!', text: product.title, showConfirmButton: false, timer: 2000, timerProgressBar: true, iconColor: '#d4847a' });
}

// ── Add to Wishlist ──────────────────────────────────────────
function addToWishlist(product) {
  if (!requireLogin()) return;   // ← لو مش logged in يوقف هنا

  const wishlist = getWishlist();
  if (wishlist.find(i => i.id === product.id)) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'Already in wishlist!', showConfirmButton: false, timer: 1800, iconColor: '#d4847a' });
    return;
  }
  wishlist.push({ id: product.id, title: product.title, price: product.price, img: product.thumbnail, category: product.category, discount: Math.round(product.discountPercentage || 0), rating: product.rating || 0, reviews: product.reviews?.length ?? 0 });
  saveWishlist(wishlist);
  syncBadges();
  Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Added to wishlist!', text: product.title, showConfirmButton: false, timer: 2000, timerProgressBar: true, iconColor: '#d4847a' });
}

function buildStars(rating) {
  const r = Math.round(rating || 0);
  return Array.from({ length: 5 }, (_, i) => `<svg class="w-3 h-3 ${i < r ? 'text-[#d4847a]' : 'text-neutral-200'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('');
}

function buildCard(product) {
  const discount = Math.round(product.discountPercentage || 0);
  const oldPrice = (product.price / (1 - discount / 100)).toFixed(0);
  const savings  = (oldPrice - product.price).toFixed(0);
  const card = document.createElement('div');
  card.className = "group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#f0e6e0]";
  card.innerHTML = `
    <div class="relative overflow-hidden aspect-[3/4] bg-[#f5efed]">
      <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/400x530/f5efed/d4847a?text=Brand'" />
      <span class="absolute top-3 left-3 bg-red-500 text-white text-[0.65rem] font-sans font-bold px-2.5 py-0.5 rounded-full tracking-wide">-${discount}%</span>
      <div class="absolute bottom-12 left-0 bg-[#d4847a] text-white text-[0.6rem] font-sans font-semibold px-3 py-1 tracking-wide">Save $${savings}</div>
      <button class="wish-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-400 hover:text-[#d4847a] transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <div class="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <button class="cart-btn w-full bg-[#1a1a1a]/90 hover:bg-[#d4847a] text-white text-xs font-sans font-medium py-2.5 tracking-wide transition-colors duration-200">+ Add to Cart</button>
      </div>
    </div>
    <div class="p-3.5">
      <p class="text-[0.7rem] text-neutral-400 font-sans uppercase tracking-widest mb-0.5">${product.category}</p>
      <h3 class="font-brand text-[1.05rem] text-neutral-800 leading-snug mb-1 truncate">${product.title}</h3>
      <div class="flex items-center gap-1 mb-2"><div class="flex gap-0.5">${buildStars(product.rating)}</div><span class="text-[0.65rem] text-neutral-400 font-sans">(${product.reviews?.length ?? 0})</span></div>
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="font-brand text-[1.1rem] font-semibold text-[#d4847a]">$${product.price}</span>
        <span class="text-xs text-neutral-400 line-through font-sans">$${oldPrice}</span>
      </div>
    </div>`;
  card.querySelector('.cart-btn').addEventListener('click', () => addToCart(product));
  card.querySelector('.wish-btn').addEventListener('click', () => addToWishlist(product));
  return card;
}

const STEP = 8;
let saleProducts = [], shown = 0;
const grid        = document.getElementById('saleGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const countEl     = document.getElementById('saleCount');

function showSkeleton() {
  grid.innerHTML = Array(8).fill(`<div class="bg-white rounded-xl border border-[#f0e6e0] overflow-hidden animate-pulse"><div class="aspect-[3/4] bg-[#f0e6e0]"></div><div class="p-3.5 flex flex-col gap-2"><div class="h-3 bg-[#f0e6e0] rounded w-1/3"></div><div class="h-4 bg-[#f0e6e0] rounded w-3/4"></div><div class="h-3 bg-[#f0e6e0] rounded w-1/2"></div></div></div>`).join('');
}

function renderMore() {
  saleProducts.slice(shown, shown + STEP).forEach(p => grid.appendChild(buildCard(p)));
  shown += Math.min(STEP, saleProducts.length - shown);
  loadMoreBtn.style.display = shown >= saleProducts.length ? 'none' : 'inline-block';
  countEl.textContent = `Showing ${shown} of ${saleProducts.length} sale items`;
}

function sortAndRender() {
  const val = document.getElementById('sortSelect').value;
  if      (val === 'discount')   saleProducts.sort((a, b) => b.discountPercentage - a.discountPercentage);
  else if (val === 'price-asc')  saleProducts.sort((a, b) => a.price - b.price);
  else if (val === 'price-desc') saleProducts.sort((a, b) => b.price - a.price);
  else if (val === 'rating')     saleProducts.sort((a, b) => b.rating - a.rating);
  grid.innerHTML = ''; shown = 0; renderMore();
}

async function fetchSaleProducts() {
  showSkeleton();
  try {
    const urls = [
      'https://dummyjson.com/products/category/womens-dresses?limit=100',
      'https://dummyjson.com/products/category/womens-shoes?limit=100',
      'https://dummyjson.com/products/category/womens-bags?limit=100',
      'https://dummyjson.com/products/category/womens-jewellery?limit=100',
      'https://dummyjson.com/products/category/tops?limit=100',
    ];
    const results = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));
    let all = [];
    results.forEach(d => { all = all.concat(d.products || []); });
    saleProducts = all.filter(p => p.discountPercentage && p.discountPercentage > 0);
    if (saleProducts.length === 0) { grid.innerHTML = `<div class="col-span-4 text-center py-20 font-brand text-2xl text-neutral-400">No sale items found.</div>`; return; }
    sortAndRender();
  } catch (err) {
    grid.innerHTML = `<div class="col-span-4 text-center py-20 font-brand text-xl text-neutral-400">Something went wrong. Please refresh.</div>`;
  }
}

document.getElementById('sortSelect').addEventListener('change', sortAndRender);
loadMoreBtn.addEventListener('click', renderMore);

function startCountdown() {
  const key = 'saleEnd';
  let end = localStorage.getItem(key);
  if (!end || Date.now() > parseInt(end)) { end = Date.now() + 24 * 60 * 60 * 1000; localStorage.setItem(key, end); }
  function tick() {
    const diff = parseInt(end) - Date.now();
    if (diff <= 0) { localStorage.removeItem(key); startCountdown(); return; }
    document.getElementById('cH').textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
    document.getElementById('cM').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cS').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  tick(); setInterval(tick, 1000);
}

document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('navbar-default').classList.toggle('hidden');
});

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
  } else { window.location.href = '../Authentication/login.html'; }
});

syncBadges();
startCountdown();
fetchSaleProducts();