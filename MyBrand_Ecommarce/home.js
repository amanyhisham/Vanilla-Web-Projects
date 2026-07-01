// ── Sync badges ──
function syncBadges() {
  const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
  const ct = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const wt = wishlist.length;
  document
    .querySelectorAll("#cartBadge")
    .forEach((el) => (el.textContent = ct));
  document
    .querySelectorAll("#wishBadge")
    .forEach((el) => (el.textContent = wt));
}
// ── Mobile menu ──
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("navbar-default").classList.toggle("hidden");
});
// ── Auth ──
const authBtn = document.getElementById("authBtn");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) authBtn.textContent = currentUser.name.split(" ")[0];
authBtn.addEventListener("click", () => {
  if (JSON.parse(localStorage.getItem("currentUser"))) {
    Swal.fire({
      title: "Log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d4847a",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Logout",
    }).then((r) => {
      if (r.isConfirmed) {
        // مسح كل حاجة
        localStorage.removeItem("currentUser");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartCount");
        localStorage.removeItem("wishlistItems");
        localStorage.removeItem("wishlistCount");
        location.reload();
      }
    });
  } else {
    window.location.href = "Authentication/login.html";
  }
});
syncBadges();
