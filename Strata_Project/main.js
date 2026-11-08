// ================= Storage helpers =================
const CART_KEY = 'strata_cart';
const WISH_KEY = 'strata_wishlist';

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
};
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
const formatPrice = (n) => `${SITE_CONFIG.currency} ${n.toLocaleString('en-US')}`;

// ================= Images =================
// imgTag('glass2.jpeg', 'alt', 'classes') -> loads the exact asset first.
// You can give several names separated by "|", the first one found is used:
//   imgTag('question.jpg|faq.jpg', ...)
// If nothing is found, a placeholder is shown.
const FALLBACK_IMG = 'https://placehold.co/600x450/F1E2CF/3E4A2A?text=STRATA';
const IMG_EXTS = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'jfif'];

function imgCandidates(spec) {
  const names = [];
  spec.split('|').forEach((n) => {
    const cap = n.charAt(0).toUpperCase() + n.slice(1);
    [n, cap, n.toLowerCase()].forEach((v) => { if (!names.includes(v)) names.push(v); });
  });
  const list = [];
  names.forEach((n) => {
    const hasExtension = /\.(jpeg|jpg|png|webp|avif|jfif)$/i.test(n);
    if (hasExtension) list.push(`images/${encodeURIComponent(n)}`);
    const base = hasExtension ? n.replace(/\.[^.]+$/, '') : n;
    IMG_EXTS.forEach((e) => list.push(`images/${encodeURIComponent(base)}.${e}`));
  });
  return [...new Set(list)];
}

const imgTag = (spec, alt, cls = '') =>
  `<img src="${imgCandidates(spec)[0]}" data-base="${spec}" data-try="0" alt="${alt}" loading="lazy" class="${cls}">`;

document.addEventListener('error', (e) => {
  const t = e.target;
  if (!t || t.tagName !== 'IMG' || t.dataset.fb) return;

  const base = t.dataset.base;
  if (base) {
    const list = imgCandidates(base);
    const next = t.dataset.try === undefined ? 0 : Number(t.dataset.try) + 1;
    if (next < list.length) {
      t.dataset.try = next;
      t.src = list[next];
      return;
    }
  }

  // Logo not found: hide it and show the text version next to it
  if (t.dataset.logo !== undefined) {
    t.style.display = 'none';
    if (t.nextElementSibling) t.nextElementSibling.style.display = 'flex';
    return;
  }

  t.dataset.fb = '1';
  t.src = FALLBACK_IMG;
}, true);

// ================= Cart =================
const getCart = () => read(CART_KEY);
const saveCart = (cart) => {
  write(CART_KEY, cart);
  updateBadges();
  document.dispatchEvent(new Event('cart:changed'));
};

function addToCart(id, qty = 1) {
  const p = getProduct(id);
  if (!p || p.stock <= 0) return toast('Sorry, this item is out of stock', 'error');
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  const newQty = (item ? item.qty : 0) + qty;
  if (newQty > p.stock) return toast(`Only ${p.stock} available`, 'error');
  if (item) item.qty = newQty; else cart.push({ id, qty });
  saveCart(cart);
  toast(`${p.name} added to cart`);
}

function updateQty(id, qty) {
  const p = getProduct(id);
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item || !p) return;
  item.qty = Math.max(1, Math.min(qty, p.stock));
  saveCart(cart);
}

const removeFromCart = (id) => saveCart(getCart().filter((i) => i.id !== id));
const clearCart = () => saveCart([]);
const cartCount = () => getCart().reduce((sum, i) => sum + i.qty, 0);
const cartSubtotal = () =>
  getCart().reduce((sum, i) => sum + (getProduct(i.id)?.price || 0) * i.qty, 0);

// ================= Wishlist =================
const getWishlist = () => read(WISH_KEY);
const isFav = (id) => getWishlist().includes(id);

function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter((x) => x !== id);
    toast('Removed from wishlist');
  } else {
    list.push(id);
    toast('Added to wishlist');
  }
  write(WISH_KEY, list);
  updateBadges();
  document.querySelectorAll(`[data-fav="${id}"]`).forEach((b) => b.classList.toggle('is-fav', list.includes(id)));
  document.dispatchEvent(new Event('wishlist:changed'));
}

// ================= Badges =================
function updateBadges() {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    const n = cartCount();
    el.textContent = n;
    el.classList.toggle('hidden', n === 0);
  });
  document.querySelectorAll('[data-wish-count]').forEach((el) => {
    const n = getWishlist().length;
    el.textContent = n;
    el.classList.toggle('hidden', n === 0);
  });
}

// ================= Toast =================
function toast(message, type = 'success') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = `px-5 py-3 rounded-full text-sm shadow-lg text-white ${type === 'error' ? 'bg-red-700' : 'bg-forest'}`;
  void el.offsetWidth; // restart animation
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

// ================= Product Card (reusable) =================
function productCard(p) {
  const out = p.stock <= 0;
  return `
  <article class="card overflow-hidden flex flex-col h-full">
    <div class="img-box aspect-square">
      ${imgTag(p.image, p.name, 'img-cover ' + (out ? 'opacity-60' : ''))}
      <button data-fav="${p.id}" aria-label="Add ${p.name} to wishlist"
              class="fav-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow ${isFav(p.id) ? 'is-fav' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-forest" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      ${out ? '<span class="absolute top-3 left-3 bg-red-700 text-white text-xs px-3 py-1 rounded-full">Out of stock</span>' : ''}
    </div>
    <div class="p-4 flex flex-col gap-1 flex-1">
      <h3 class="font-semibold text-forest">${p.name}</h3>
      <p class="text-sm text-brown capitalize">${p.category}</p>
      <div class="mt-auto pt-3 flex items-center justify-between gap-2">
        <span class="font-bold text-forest">${formatPrice(p.price)}</span>
        <button data-add="${p.id}" ${out ? 'disabled' : ''}
                class="bg-forest text-white text-sm px-4 py-2 rounded-full hover:bg-olive transition disabled:bg-gray-400 disabled:cursor-not-allowed">
          Add to Cart
        </button>
      </div>
    </div>
  </article>`;
}

// Any button with data-add or data-fav works automatically on every page
document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if (add) addToCart(add.dataset.add);
  const fav = e.target.closest('[data-fav]');
  if (fav) toggleWishlist(fav.dataset.fav);
});

// ================= Logo =================
// Original colors. The white background is removed by CSS (.logo-img).
const logoImg = (cls) =>
  `<img src="${imgCandidates('logo')[0]}" data-base="logo" data-try="0" data-logo alt="STRATA logo" class="logo-img ${cls}">`;

// ================= Navbar =================
function renderNavbar() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const links = [
    ['Home', 'index.html'],
    ['Shop', 'shop.html'],
    ['Contact Us', 'contact.html'],
  ];
  const linkHTML = (cls) => links.map(([name, href]) =>
    `<a href="${href}" class="${cls} ${page === href ? 'text-forest font-semibold border-b-2 border-olive' : 'text-forest/80 hover:text-forest'}">${name}</a>`
  ).join('');

  const badge = (attr) => `<span ${attr} class="hidden absolute -top-2 -right-2 bg-olive text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">0</span>`;

  document.getElementById('navbar').innerHTML = `
  <header class="sticky top-0 z-50 bg-cream border-b border-beige">
    <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
      <a href="index.html" class="flex items-center" aria-label="STRATA home">
        ${logoImg('h-16 w-auto')}
        <span style="display:none" class="items-center font-serif text-2xl tracking-[0.2em] text-brown">STRATA</span>
      </a>

      <nav class="hidden md:flex items-center gap-8 text-sm">${linkHTML('pb-1')}</nav>

      <div class="flex items-center gap-5">
        <a href="cart.html" aria-label="Cart" class="relative text-forest">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
          ${badge('data-cart-count')}
        </a>
        <a href="wishlist.html" aria-label="Wishlist" class="relative text-forest">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>
          ${badge('data-wish-count')}
        </a>
        <button id="menu-btn" aria-label="Menu" class="md:hidden text-forest">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
    </div>
    <nav id="mobile-menu" class="hidden md:hidden flex-col gap-4 px-4 pb-4 text-sm">${linkHTML('py-1')}</nav>
  </header>`;

  document.getElementById('menu-btn').addEventListener('click', () => {
    const m = document.getElementById('mobile-menu');
    m.classList.toggle('hidden');
    m.classList.toggle('flex');
  });
}

// ================= Footer =================
function renderFooter() {
  const c = SITE_CONFIG;
  document.getElementById('footer').innerHTML = `
  <footer class="bg-forest text-cream mt-16">
    <div class="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
      <div>
        <div class="inline-flex items-center bg-cream rounded-2xl px-3 py-2">
          ${logoImg('h-14 w-auto')}
          <span style="display:none" class="font-serif text-xl tracking-[0.2em] text-brown">STRATA</span>
        </div>
        <ul class="mt-3 space-y-1 text-sm text-cream/80">
          <li>Recycle</li>
          <li>Reimagine</li>
          <li>Live Greener</li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-3">Quick Links</h4>
        <ul class="space-y-1 text-sm text-cream/80">
          <li><a href="index.html" class="hover:text-white">Home</a></li>
          <li><a href="shop.html" class="hover:text-white">Shop</a></li>
          <li><a href="shop.html?category=glass" class="hover:text-white">Glass</a></li>
          <li><a href="shop.html?category=plastic" class="hover:text-white">Plastic</a></li>
          <li><a href="shop.html?category=metal" class="hover:text-white">Metal</a></li>
          <li><a href="shop.html?category=fabric" class="hover:text-white">Fabric</a></li>
          <li><a href="wishlist.html" class="hover:text-white">Wishlist</a></li>
          <li><a href="contact.html" class="hover:text-white">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-3">Follow Us</h4>
        <ul class="space-y-1 text-sm text-cream/80">
          <li><a href="${c.instagram}" target="_blank" rel="noopener" class="hover:text-white">Instagram</a></li>
          <li><a href="${c.facebook}" target="_blank" rel="noopener" class="hover:text-white">Facebook</a></li>
          <li><a href="https://wa.me/${c.whatsappNumber}" target="_blank" rel="noopener" class="hover:text-white">WhatsApp</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-3">Contact Information</h4>
        <ul class="space-y-1 text-sm text-cream/80">
          <li><a href="mailto:${c.email}" class="hover:text-white">${c.email}</a></li>
          <li><a href="tel:+${c.whatsappNumber}" class="hover:text-white">${c.phone}</a></li>
          <li>${c.address}</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-cream/10 py-5 px-4 text-xs text-cream/60 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4">
      <p>© ${new Date().getFullYear()} STRATA. All Rights Reserved.</p>
      <span class="hidden sm:inline">•</span>
      <p>${c.credit}</p>
    </div>
  </footer>`;
}

// ================= Init =================
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  updateBadges();
});