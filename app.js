const $ = (selector) => document.querySelector(selector);
const state = { lang: "ar", products: [], cart: readCart() };
const translations = {
  ar: {
    shop:"المتجر",about:"عن المتجر",cart:"السلة",eyebrow:"جهّز نفسك للفوز",heroTitle:"ارفع مستوى<br><span>تجربة القيمنق</span>",heroText:"إكسسوارات، ملحقات، وباقات للاعبين — كل تجهيزاتك في مكان واحد.",browse:"تصفح المنتجات",productsLabel:"منتجات للبدء",onlineLabel:"تسوق أونلاين",curated:"اختيارات اللاعبين",featured:"منتجات مميزة",search:"ابحث عن منتج...",all:"كل المنتجات",pc:"الكمبيوتر وقطعه",chairs:"الكراسي والمكاتب",network:"الشبكات والإنترنت",streaming:"البث وصناعة المحتوى",accessories:"الإكسسوارات",consoles:"الأجهزة والملحقات",digital:"رقمي",bundles:"الباقات",built:"صُنع للاعبين",bannerTitle:"معداتك. لعبتك. مستواك.",bannerText:"متجر تجريبي قابل للتطوير وإضافة بوابة دفع وشحن حقيقيين لاحقًا.",footer:"متجر القيمنق الخاص بك — نسخة تجريبية أولية.",yourCart:"سلة مشترياتك",total:"الإجمالي",checkout:"إتمام الطلب التجريبي",name:"الاسم",phone:"رقم الجوال",email:"البريد الإلكتروني (اختياري)",placeOrder:"إرسال الطلب التجريبي",paymentNote:"تنبيه: هذا نموذج تجريبي؛ لن يتم خصم أي مبلغ. الدفع الإلكتروني غير مربوط بعد.",add:"أضف للسلة",emptyCart:"سلتك فارغة. أضف بعض المنتجات أولًا.",emptyProducts:"لا توجد منتجات مطابقة للبحث.",added:"تمت إضافة المنتج إلى السلة.",orderSuccess:"تم تسجيل الطلب التجريبي برقم",orderNoPayment:"لم يتم خصم أي مبلغ. يلزم ربط بوابة دفع قبل البيع الفعلي.",stock:"المخزون",categories:{pc:"كمبيوتر وقطع",accessories:"إكسسوارات",consoles:"منصات وملحقات",digital:"منتجات رقمية",chairs:"كراسي ومكاتب",network:"شبكات",streaming:"بث وصناعة محتوى",bundles:"باقات"},networkError:"تعذر الاتصال بالخادم. تأكد أن المتجر يعمل.",orderError:"تعذر إنشاء الطلب. حاول مرة أخرى."
  },
  en: {
    shop:"Shop",about:"About",cart:"Cart",eyebrow:"GEAR UP TO WIN",heroTitle:"LEVEL UP YOUR<br><span>GAMING EXPERIENCE</span>",heroText:"Accessories, gear, and bundles for players — everything in one place.",browse:"Browse products",productsLabel:"starter products",onlineLabel:"shop online",curated:"PLAYER PICKS",featured:"Featured products",search:"Search products...",all:"All products",pc:"PC & Components",chairs:"Chairs & Desks",network:"Networking",streaming:"Streaming & Content",accessories:"Accessories",consoles:"Devices & gear",digital:"Digital",bundles:"Bundles",built:"BUILT FOR PLAYERS",bannerTitle:"Your gear. Your game. Your level.",bannerText:"A demo store that can be extended with real payment and shipping later.",footer:"Your gaming store — early demo version.",yourCart:"Your cart",total:"Total",checkout:"Demo checkout",name:"Name",phone:"Phone number",email:"Email (optional)",placeOrder:"Submit demo order",paymentNote:"Note: This is a demo; no money will be charged. Online payment is not connected yet.",add:"Add to cart",emptyCart:"Your cart is empty. Add some products first.",emptyProducts:"No matching products found.",added:"Product added to cart.",orderSuccess:"Demo order recorded. Order ID:",orderNoPayment:"No payment was taken. Connect a payment provider before selling.",stock:"Stock",categories:{pc:"PC & Components",accessories:"Accessories",consoles:"Consoles & Gear",digital:"Digital Products",chairs:"Chairs & Desks",network:"Networking",streaming:"Streaming",bundles:"Bundles"},networkError:"Could not reach the server. Make sure the store is running.",orderError:"Could not create the order. Please try again."
  }
};
function t(key) { return translations[state.lang][key] || key; }
function readCart() { try { return JSON.parse(localStorage.getItem("aw-cart") || "{}"); } catch { return {}; } }
function saveCart() { localStorage.setItem("aw-cart", JSON.stringify(state.cart)); }
function money(amount) { return new Intl.NumberFormat(state.lang === "ar" ? "ar-SA" : "en-US", { style:"currency", currency:"SAR", maximumFractionDigits:2 }).format(amount); }
function safeText(value) { return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch])); }

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  document.body.dir = document.documentElement.dir;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[state.lang][key]) el.innerHTML = translations[state.lang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
  $("#languageBtn").textContent = state.lang === "ar" ? "English" : "العربية";
  renderProducts(); renderCart();
}
function productName(p) { return state.lang === "ar" ? p.nameAr : p.nameEn; }
function productDescription(p) { return state.lang === "ar" ? p.descriptionAr : p.descriptionEn; }
function renderProducts() {
  const query = $("#searchInput").value.trim().toLocaleLowerCase();
  const category = $("#categorySelect").value;
  const found = state.products.filter(p => (category === "all" || p.category === category) && `${p.nameAr} ${p.nameEn} ${p.descriptionAr} ${p.descriptionEn}`.toLocaleLowerCase().includes(query));
  $("#productGrid").innerHTML = found.length ? found.map(p => `
    <article class="product-card">
      <div class="product-visual"><span>${p.emoji}</span></div>
      <div class="product-info">
        <span class="category-label">${safeText(t("categories")[p.category] || p.category)}</span>
        <h3>${safeText(productName(p))}</h3>
        <p>${safeText(productDescription(p))}</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${safeText(p.id)}">＋ ${safeText(t("add"))}</button></div>
      </div>
    </article>`).join("") : `<div class="empty-state">${safeText(t("emptyProducts"))}</div>`;
}
function cartEntries() { return Object.entries(state.cart).map(([id, quantity]) => ({ product: state.products.find(p => p.id === id), quantity })).filter(x => x.product && x.quantity > 0); }
function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((sum, x) => sum + x.quantity, 0);
  const total = entries.reduce((sum, x) => sum + x.product.price * x.quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#cartItems").innerHTML = entries.length ? entries.map(({product:p,quantity:q}) => `
    <div class="cart-line"><span class="cart-emoji">${p.emoji}</span><div class="cart-line-main"><strong>${safeText(productName(p))}</strong><small>${money(p.price)} × ${q}</small><div class="quantity-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease">−</button><span>${q}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase">+</button><button class="remove-button" data-remove="${p.id}">${state.lang === "ar" ? "حذف" : "Remove"}</button></div></div></div>`).join("") : `<div class="empty-state">${safeText(t("emptyCart"))}</div>`;
}
function addToCart(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  if ((state.cart[id] || 0) >= Math.min(10, p.stock)) { showMessage(state.lang === "ar" ? "وصلت للحد المتاح من هذا المنتج." : "Maximum available quantity reached.", true); return; }
  state.cart[id] = (state.cart[id] || 0) + 1; saveCart(); renderCart(); showMessage(t("added"));
}
function showMessage(message, error=false) { const el = $("#checkoutMessage"); el.textContent = message; el.className = "message " + (error ? "toast-error" : "toast-success"); }
function openCart() { $("#cartOverlay").hidden = false; document.body.style.overflow = "hidden"; }
function closeCart() { $("#cartOverlay").hidden = true; document.body.style.overflow = ""; }

$("#productGrid").addEventListener("click", e => { const btn = e.target.closest("[data-add]"); if (btn) addToCart(btn.dataset.add); });
$("#cartItems").addEventListener("click", e => {
  const qty = e.target.closest("[data-qty]"); const remove = e.target.closest("[data-remove]");
  if (remove) delete state.cart[remove.dataset.remove];
  if (qty) { const id = qty.dataset.qty; state.cart[id] = (state.cart[id] || 0) + Number(qty.dataset.delta); if (state.cart[id] <= 0) delete state.cart[id]; }
  saveCart(); renderCart();
});
$("#languageBtn").addEventListener("click", () => { state.lang = state.lang === "ar" ? "en" : "ar"; applyLanguage(); });
$("#searchInput").addEventListener("input", renderProducts);
$("#categorySelect").addEventListener("change", renderProducts);
$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#closeCartScrim").addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });
$("#checkoutForm").addEventListener("submit", async e => {
  e.preventDefault();
  const entries = cartEntries();
  if (!entries.length) { showMessage(t("emptyCart"), true); return; }
  const form = new FormData(e.currentTarget);
  const button = e.currentTarget.querySelector("button[type=submit]");
  button.disabled = true; button.textContent = state.lang === "ar" ? "جارٍ إرسال الطلب..." : "Submitting...";
  try {
    const response = await fetch("/api/orders", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({
      language:state.lang, customer:{name:form.get("name"),phone:form.get("phone"),email:form.get("email")},
      items:entries.map(x => ({id:x.product.id,quantity:x.quantity}))
    })});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || t("orderError"));
    state.cart = {}; saveCart(); renderCart(); e.currentTarget.reset();
    showMessage(`${t("orderSuccess")} ${result.order.id}. ${t("orderNoPayment")}`);
  } catch (err) { showMessage(err.message || t("orderError"), true); }
  finally { button.disabled = false; button.textContent = t("placeOrder"); }
});

async function init() {
  $("#year").textContent = new Date().getFullYear();
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Products request failed");
    state.products = await response.json();
    applyLanguage();
  } catch {
    $("#productGrid").innerHTML = `<div class="empty-state">${safeText(t("networkError"))}</div>`;
  }
}
init();
