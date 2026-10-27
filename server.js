require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");

app.use(express.json({ limit: "30kb" }));
app.use(express.static(publicDir));

const products = [
  { id: "pc-001", nameAr: "كمبيوتر قيمنق RGB", nameEn: "RGB Gaming PC", category: "pc", price: 3999, stock: 4, emoji: "🖥️", descriptionAr: "كمبيوتر تجريبي للألعاب والأداء العالي.", descriptionEn: "Demo gaming desktop for high-performance play." },
  { id: "pc-002", nameAr: "بطاقة رسومات قيمنق", nameEn: "Gaming Graphics Card", category: "pc", price: 2299, stock: 5, emoji: "🎮", descriptionAr: "بطاقة رسومات لتجميعة قيمنق.", descriptionEn: "Graphics card for a gaming build." },
  { id: "pc-003", nameAr: "ذاكرة RAM للألعاب", nameEn: "Gaming RAM Memory", category: "pc", price: 349, stock: 14, emoji: "💾", descriptionAr: "ذاكرة سريعة لتجميعة الكمبيوتر.", descriptionEn: "Fast memory for a gaming PC." },
  { id: "pc-004", nameAr: "قرص SSD NVMe", nameEn: "NVMe SSD Storage", category: "pc", price: 299, stock: 20, emoji: "⚡", descriptionAr: "تخزين سريع للألعاب والملفات.", descriptionEn: "Fast storage for games and files." },
  { id: "kb-001", nameAr: "كيبورد ميكانيكي RGB", nameEn: "RGB Mechanical Keyboard", category: "accessories", price: 249, stock: 12, emoji: "⌨️", descriptionAr: "كيبورد بإضاءة RGB مناسب للألعاب.", descriptionEn: "RGB keyboard made for gaming." },
  { id: "ms-001", nameAr: "ماوس قيمنق احترافي", nameEn: "Pro Gaming Mouse", category: "accessories", price: 139, stock: 18, emoji: "🖱️", descriptionAr: "ماوس خفيف ودقيق لجلسات اللعب.", descriptionEn: "Lightweight, precise mouse for gaming." },
  { id: "hs-001", nameAr: "سماعة قيمنق محيطية", nameEn: "Surround Gaming Headset", category: "accessories", price: 199, stock: 9, emoji: "🎧", descriptionAr: "سماعة مريحة للصوت والتواصل.", descriptionEn: "Comfortable headset for audio and chat." },
  { id: "mt-001", nameAr: "ماوس باد كبيرة RGB", nameEn: "Large RGB Gaming Mouse Pad", category: "accessories", price: 79, stock: 25, emoji: "🟪", descriptionAr: "سطح واسع لحركة ماوس سلسة.", descriptionEn: "Large surface for smooth mouse movement." },
  { id: "pd-001", nameAr: "يد تحكم لاسلكية", nameEn: "Wireless Controller", category: "consoles", price: 229, stock: 7, emoji: "🎮", descriptionAr: "يد تحكم لاسلكية للألعاب المتوافقة.", descriptionEn: "Wireless controller for compatible games." },
  { id: "ps-001", nameAr: "قاعدة شحن أيدي التحكم", nameEn: "Controller Charging Dock", category: "consoles", price: 119, stock: 8, emoji: "🔋", descriptionAr: "قاعدة لشحن أيدي التحكم المتوافقة.", descriptionEn: "Charging dock for compatible controllers." },
  { id: "cn-001", nameAr: "حامل جهاز ألعاب", nameEn: "Console Stand", category: "consoles", price: 99, stock: 10, emoji: "🕹️", descriptionAr: "حامل عملي لجهاز الألعاب.", descriptionEn: "Practical stand for a gaming console." },
  { id: "dg-001", nameAr: "بطاقة هدايا رقمية تجريبية", nameEn: "Demo Digital Gift Card", category: "digital", price: 50, stock: 30, emoji: "🎟️", descriptionAr: "عنصر تجريبي للواجهة فقط؛ ليس كودًا صالحًا.", descriptionEn: "UI demo item only; no valid code is included." },
  { id: "dg-002", nameAr: "اشتراك رقمي تجريبي", nameEn: "Demo Digital Subscription", category: "digital", price: 75, stock: 20, emoji: "💳", descriptionAr: "عرض تجريبي؛ لا يتم تسليم اشتراك حقيقي.", descriptionEn: "Demo listing; no real subscription is delivered." },
  { id: "ch-001", nameAr: "كرسي قيمنق مريح", nameEn: "Comfort Gaming Chair", category: "chairs", price: 799, stock: 6, emoji: "🪑", descriptionAr: "كرسي تجريبي لجلسات اللعب الطويلة.", descriptionEn: "Demo chair for long gaming sessions." },
  { id: "ch-002", nameAr: "مكتب قيمنق RGB", nameEn: "RGB Gaming Desk", category: "chairs", price: 649, stock: 5, emoji: "🛋️", descriptionAr: "مكتب واسع لإعداد القيمنق.", descriptionEn: "Spacious desk for a gaming setup." },
  { id: "nw-001", nameAr: "راوتر ألعاب سريع", nameEn: "Gaming Router", category: "network", price: 499, stock: 7, emoji: "📡", descriptionAr: "راوتر تجريبي لشبكة اللعب.", descriptionEn: "Demo router for gaming networks." },
  { id: "nw-002", nameAr: "محول شبكة USB", nameEn: "USB Network Adapter", category: "network", price: 89, stock: 15, emoji: "🌐", descriptionAr: "محول شبكة لأجهزة متوافقة.", descriptionEn: "Network adapter for compatible devices." },
  { id: "st-001", nameAr: "مايكروفون بث USB", nameEn: "USB Streaming Microphone", category: "streaming", price: 279, stock: 8, emoji: "🎙️", descriptionAr: "مايكروفون للبث والمحادثات.", descriptionEn: "Microphone for streaming and voice chat." },
  { id: "st-002", nameAr: "كاميرا بث HD", nameEn: "HD Streaming Webcam", category: "streaming", price: 229, stock: 9, emoji: "📷", descriptionAr: "كاميرا تجريبية للبث والاجتماعات.", descriptionEn: "Demo webcam for streaming and calls." },
  { id: "st-003", nameAr: "إضاءة بث دائرية", nameEn: "Streaming Ring Light", category: "streaming", price: 99, stock: 12, emoji: "💡", descriptionAr: "إضاءة لتحسين مظهر البث.", descriptionEn: "Light to improve your stream setup." },
  { id: "bd-001", nameAr: "باقة بداية القيمنق", nameEn: "Gaming Starter Bundle", category: "bundles", price: 329, stock: 5, emoji: "🧩", descriptionAr: "باقة تجريبية من ملحقات القيمنق.", descriptionEn: "Demo bundle of gaming accessories." }
];

app.get("/api/health", (_req, res) => res.json({ ok: true, store: "Al Awali Store" }));
app.get("/api/products", (_req, res) => res.json(products));

app.post("/api/orders", (req, res) => {
  const { customer, items, language } = req.body || {};
  if (!customer || typeof customer.name !== "string" || customer.name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter your name / يرجى إدخال الاسم" });
  }
  if (typeof customer.phone !== "string" || customer.phone.trim().length < 8) {
    return res.status(400).json({ error: "Please enter a valid phone number / يرجى إدخال رقم جوال صحيح" });
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
    return res.status(400).json({ error: "Your cart is empty or invalid / السلة فارغة أو غير صحيحة" });
  }
  const orderItems = [];
  let total = 0;
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: "An item or quantity is invalid / يوجد منتج أو كمية غير صحيحة" });
    }
    if (quantity > product.stock) {
      return res.status(400).json({ error: `Not enough stock for ${product.nameEn} / الكمية غير متوفرة` });
    }
    orderItems.push({ id: product.id, nameAr: product.nameAr, nameEn: product.nameEn, price: product.price, quantity });
    total += product.price * quantity;
  }

  // Demo order only: no money is collected and no payment is confirmed.
  const order = {
    id: "AW-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    language: language === "en" ? "en" : "ar",
    customer: { name: customer.name.trim().slice(0, 100), phone: customer.phone.trim().slice(0, 30), email: String(customer.email || "").trim().slice(0, 120) },
    items: orderItems,
    total,
    currency: "SAR",
    status: "awaiting_payment_setup"
  };
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    const orders = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile, "utf8")) : [];
    orders.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.status(201).json({ ok: true, order: { id: order.id, total: order.total, currency: order.currency, status: order.status } });
  } catch (error) {
    console.error("Could not save order:", error.message);
    res.status(500).json({ error: "Could not save the order / تعذر حفظ الطلب" });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Al Awali Store is running at http://localhost:${PORT}`);
  console.log("Demo mode: checkout records orders only; no payment is collected.");
});
