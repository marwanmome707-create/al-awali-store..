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
  { id: "kb-001", nameAr: "كيبورد ميكانيكي RGB", nameEn: "RGB Mechanical Keyboard", category: "accessories", price: 249, stock: 12, emoji: "⌨️", descriptionAr: "كيبورد بإضاءة RGB مناسب للألعاب.", descriptionEn: "RGB keyboard made for gaming." },
  { id: "ms-001", nameAr: "ماوس قيمنق احترافي", nameEn: "Pro Gaming Mouse", category: "accessories", price: 139, stock: 18, emoji: "🖱️", descriptionAr: "ماوس خفيف ودقيق لجلسات اللعب.", descriptionEn: "Lightweight, precise mouse for gaming." },
  { id: "hs-001", nameAr: "سماعة قيمنق محيطية", nameEn: "Surround Gaming Headset", category: "accessories", price: 199, stock: 9, emoji: "🎧", descriptionAr: "سماعة مريحة للصوت والتواصل.", descriptionEn: "Comfortable headset for audio and chat." },
  { id: "pd-001", nameAr: "يد تحكم لاسلكية", nameEn: "Wireless Controller", category: "consoles", price: 229, stock: 7, emoji: "🎮", descriptionAr: "يد تحكم لاسلكية للألعاب المتوافقة.", descriptionEn: "Wireless controller for compatible games." },
  { id: "mt-001", nameAr: "ماوس باد كبيرة", nameEn: "Large Gaming Mouse Pad", category: "accessories", price: 79, stock: 25, emoji: "🟪", descriptionAr: "سطح واسع لحركة ماوس سلسة.", descriptionEn: "Large surface for smooth mouse movement." },
  { id: "gc-001", nameAr: "بطاقة هدايا رقمية تجريبية", nameEn: "Demo Digital Gift Card", category: "digital", price: 50, stock: 30, emoji: "🎟️", descriptionAr: "عنصر تجريبي للواجهة فقط؛ ليس كودًا صالحًا.", descriptionEn: "UI demo item only; no valid code is included." },
  { id: "st-001", nameAr: "حامل سماعة RGB", nameEn: "RGB Headset Stand", category: "accessories", price: 89, stock: 10, emoji: "💡", descriptionAr: "حامل مكتبي بتصميم قيمنق.", descriptionEn: "Gaming-style desktop headset stand." },
  { id: "pc-001", nameAr: "حزمة ملحقات الكمبيوتر", nameEn: "PC Gaming Accessory Bundle", category: "bundles", price: 329, stock: 5, emoji: "🧩", descriptionAr: "حزمة تجريبية من ملحقات القيمنق.", descriptionEn: "Demo bundle of gaming accessories." }
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

app.listen(PORT, () => {
  console.log(`Al Awali Store is running at http://localhost:${PORT}`);
  console.log("Demo mode: checkout records orders only; no payment is collected.");
});
