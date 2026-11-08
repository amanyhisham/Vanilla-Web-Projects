// ===== Site settings (easy to edit) =====
const SITE_CONFIG = {
  brand: 'STRATA',
  whatsappNumber: '201557397435',   // international format, digits only
  phone: '+20 155 739 7435',
  email: 'tahae04860@gmail.com',    // change to the owner's real email if needed
  deliveryFee: 50,
  currency: 'EGP',
  instagram: 'https://www.instagram.com/emy_khaled2003?vrfl=ZTJ6ajdlNzNidGpp',
  facebook: 'https://www.facebook.com/share/1DrEXRKWVL/',
  address: 'Al Abageyah, Manshiyat Naser, Cairo Governorate, Egypt',
  addressNote: 'Ask for the STRATA brand.',
  mapQuery: 'Al Abageyah, Manshiyat Naser, Cairo Governorate',
  mapLink: 'https://maps.app.goo.gl/iqALJU6p5AHMUSWo8',
  formEndpoint: 'https://formspree.io/f/YOUR_FORM_ID', // paste your Formspree link here
  credit: 'STRATA designed by Amany Hesham 2026',
};
// Safety: keep digits only, so spaces or "+" can never break the WhatsApp link
SITE_CONFIG.whatsappNumber = SITE_CONFIG.whatsappNumber.replace(/\D/g, '');

// ===== Catalog (the ONLY place you edit products) =====
// Each line = one product = one image in /images.
// "image" is the file name without extension (example: glass2 -> images/glass2.jpeg).
// To add a product: put the image in /images, then add one line at the end of that category.
const CATALOG = {
  glass: {
    material: 'Recycled glass',
    items: [
      { image: 'glass2',  name: 'Mosaic Glass Planter',   price: 450, description: 'A round planter covered in reclaimed mirror and glass pieces.' },
      { image: 'glass3',  name: 'Mosaic Glass Set',       price: 600, description: 'Colorful mosaic vases and dishes from broken glass.' },
      { image: 'glass4',  name: 'Painted Glass Bottle',   price: 180, description: 'A hand-painted bottle with a leaf pattern.' },
      { image: 'glass5',  name: 'Pastel Glass Vases',     price: 220, description: 'A soft set of reused glass bottles and vases.' },
      { image: 'glass6',  name: 'Amber Bottle Vases',     price: 200, description: 'Old amber bottles turned into rustic flower vases.' },
      { image: 'glass7',  name: 'Lace Bottle Vase',       price: 160, description: 'A bottle wrapped in natural burlap and lace.' },
      { image: 'glass8',  name: 'Colored Glass Vases',    price: 240, description: 'Small colored bottles for dried flowers.' },
      { image: 'glass9',  name: 'Glass Storage Jars',     price: 210, description: 'Reused glass jars for storage and decor.' },
      { image: 'glass10', name: 'Green Glass Vase',       price: 280, description: 'A large green glass vase from a reclaimed bottle.' },
      { image: 'glass11', name: 'Bottle Table Lamp',      price: 420, description: 'A table lamp built from a glass bottle.' },
      { image: 'glass12', name: 'Blue Glass Bottle Vase', price: 230, description: 'A tall blue-green bottle vase.' },
      { image: 'glass13', name: 'Lace Bottle Lamp',       price: 450, description: 'A lamp made from a green bottle with a lace shade.' },
      { image: 'glass14', name: 'Wrapped Candle Jars',    price: 190, description: 'Glass jars with wire details, made for candles.' },
    ],
  },
  fabric: {
    material: 'Textile leftovers',
    items: [
      { image: 'fabric1', name: 'Patchwork Tote Bag',    price: 350, description: 'A colorful tote stitched from fabric leftovers.' },
      { image: 'fabric2', name: 'Patchwork Rug',         price: 400, description: 'A bright quilted rug made from recycled fabric.' },
      { image: 'fabric3', name: 'Patchwork Handbag',     price: 380, description: 'A handbag stitched from fabric squares.' },
      { image: 'fabric5', name: 'Denim Cushion',         price: 280, description: 'A cushion made from old jeans.' },
      { image: 'fabric6', name: 'Woven Fabric Clutch',   price: 150, description: 'A small woven bag from fabric strips.' },
      { image: 'fabric7', name: 'Denim Pocket Cushion',  price: 300, description: 'A cushion decorated with recycled denim pieces.' },
      { image: 'fabric8', name: 'Patchwork Canvas Tote', price: 260, description: 'A canvas tote with a patchwork front.' },
    ],
  },
  plastic: {
    material: 'Recycled plastic',
    items: [
      { image: 'plastic1', name: 'Bottle Cap Lamp',      price: 500, description: 'A table lamp made from colorful bottle caps.' },
      { image: 'plastic2', name: 'Crochet Plastic Bag',  price: 280, description: 'A bag made from plastic bottles and crochet.' },
      { image: 'plastic3', name: 'Painted Black Bottles', price: 200, description: 'Reused bottles painted with a golden leaf pattern.' },
      { image: 'plastic4', name: 'Painted Decor Set',    price: 320, description: 'Decor pieces made from reused plastic.' },
      { image: 'plastic5', name: 'Blue Planter Set',     price: 350, description: 'Stackable sculpted planters from recycled plastic.' },
      { image: 'plastic6', name: 'Painted Bottle Vases', price: 180, description: 'Bottles decorated with colorful hand-painted shapes.' },
    ],
  },
  metal: {
    material: 'Recycled metal',
    items: [
      { image: 'metal1',  name: 'Soda Can Lamp',          price: 550, description: 'A lamp made from soda cans and aluminum pull-tabs.' },
      { image: 'metal2',  name: 'Pull-Tab Boxes',         price: 220, description: 'Small lidded boxes made from aluminum pull-tabs.' },
      { image: 'metal3',  name: 'Can-Ring Basket',        price: 260, description: 'A hanging basket made from can rings.' },
      { image: 'metal4',  name: 'Pull-Tab Handbag',       price: 480, description: 'A handbag woven from aluminum pull-tabs.' },
      { image: 'metal5',  name: 'Painted Tin Lamp',       price: 420, description: 'A decorated tin can turned into a lamp.' },
      { image: 'metal6',  name: 'Tin Can Planters',       price: 150, description: 'Tin cans reused as small plant pots.' },
      { image: 'metal7',  name: 'Scrap Metal Robot',      price: 650, description: 'A small robot sculpture from scrap metal parts.' },
      { image: 'metal8',  name: 'Metal Turtle Sculpture', price: 700, description: 'A turtle sculpture from reclaimed metal.' },
      { image: 'metal9',  name: 'Pull-Tab Sheep',         price: 600, description: 'A sheep sculpture made from pull-tabs.' },
      { image: 'metal10', name: 'Chain Owl Sculpture',    price: 450, description: 'An owl sculpture from chain and scrap metal.' },
      { image: 'metal11', name: 'Painted Tin Planters',   price: 240, description: 'Hand-painted tin cans used as planters.' },
      { image: 'metal12', name: 'Aluminum Can Lamp',      price: 550, description: 'A lamp from aluminum cans and pull-tabs.' },
    ],
  },
};

// ===== Builds the PRODUCTS list from CATALOG (no need to edit) =====
// Categories are mixed in turns, so the home page shows a nice variety.
const PRODUCTS = [];
(function buildProducts() {
  const cats = Object.keys(CATALOG);
  const longest = Math.max(...cats.map((c) => CATALOG[c].items.length));
  let n = 0;
  for (let i = 0; i < longest; i++) {
    cats.forEach((cat) => {
      const it = CATALOG[cat].items[i];
      if (!it) return;
      n++;
      PRODUCTS.push({
        id: `${cat}${i + 1}`,
        name: it.name,
        category: cat,
        price: it.price,
        image: it.image || `${cat}${i + 1}`,
        material: it.material || CATALOG[cat].material,
        stock: it.stock ?? 10,
        description: it.description || '',
        createdAt: new Date(2026, 0, n).toISOString().slice(0, 10),
      });
    });
  }
})();

// Category cards on the home page.
// Images: Glass.jpeg, Fabric.jpeg, Plastic.jpeg, Metal.jpeg in /images
// (if one is missing, the page automatically uses the first product image of that category)
const CATEGORIES = [
  { id: 'glass',   name: 'Glass Creations',   tagline: 'From glass waste to timeless beauty.', image: 'glass|glass1' },
  { id: 'fabric',  name: 'Fabric Creations',  tagline: 'From old clothes to new treasures.',   image: 'fabric|fabric1' },
  { id: 'plastic', name: 'Plastic Creations', tagline: 'From plastic waste to fresh ideas.',   image: 'plastic|plastic1' },
  { id: 'metal',   name: 'Metal Creations',   tagline: 'From scrap metal to artistic pieces.', image: 'metal|metal1' },
];