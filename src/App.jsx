import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  Receipt,
  BarChart3,
  Settings,
  Plus,
  AlertTriangle,
  TrendingUp,
  Search,
  Copy,
  Share2,
  XCircle,
  CheckCircle,
  DollarSign,
  Image,
  Minus,
  X,
  Lock,
  Eye,
  EyeOff,
  Gem,
  CreditCard,
  Smartphone,
  Banknote,
  MoreHorizontal,
  Upload,
  ChevronRight,
  Printer,
  Mail,
  MessageCircle,
  SkipForward,
  Download,
  Phone,
} from "lucide-react";
import { generateReceiptPDF, downloadPDF, printPDF } from "./pdfReceipt.js";

const TAX_RATE = 0.115;
const LOW_STOCK = 3;

function money(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function formatDate(iso) {
  return new Date(iso).toLocaleString("es-PR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function load(key, fb) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
}

/* ── Modal ── */
function Modal({ title, message, confirmLabel, onConfirm, onCancel, danger }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title">{title}</p>
        <p className="modal-msg">{message}</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className={`modal-confirm${danger ? " danger-btn" : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LOGIN SCREEN
   ══════════════════════════════════════════════ */
function LoginScreen({ logoUrl, businessName, correctPin, onUnlock }) {
  const [entry, setEntry] = useState("");
  const [shake, setShake] = useState(false);

  function tap(digit) {
    if (entry.length >= 4) return;
    const next = entry + digit;
    setEntry(next);
    if (next.length === 4) {
      if (next === correctPin) {
        setTimeout(() => onUnlock(), 180);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setEntry("");
        }, 600);
      }
    }
  }

  function del() {
    setEntry((prev) => prev.slice(0, -1));
  }

  const G = {
    bg: "linear-gradient(180deg, #fffdf9 0%, #f8f4ec 100%)",
    glass: "rgba(255,255,255,0.8)",
    border: "rgba(201,168,118,0.22)",
    borderStrong: "rgba(201,168,118,0.45)",
    gem: "#c9a876",
    gemGlow: "rgba(201,168,118,0.18)",
    text: "#2b2b2b",
    muted: "rgba(43,43,43,0.5)",
  };

  const dots = Array.from({ length: 4 }, (_, i) => i < entry.length);

  return (
    <div
      style={{
        background: G.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        padding: "24px 32px",
      }}
    >
      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <div
          style={{
            width: 86,
            height: 86,
            borderRadius: 24,
            overflow: "hidden",
            background: "#ffffff",
            border: `1.5px solid ${G.borderStrong}`,
            boxShadow: `0 12px 35px ${G.gemGlow}`,
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Gem size={36} color={G.gem} />
          )}
        </div>

        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: G.text,
            letterSpacing: -0.4,
            marginBottom: 6,
          }}
        >
          {businessName}
        </div>

        <div
          style={{
            fontSize: 12,
            color: G.muted,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Welcome back
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 40,
          animation: shake ? "shake 0.5s ease" : "none",
        }}
      >
        {dots.map((filled, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: filled ? G.gem : "#ffffff",
              border: `2px solid ${filled ? G.gem : G.border}`,
              boxShadow: filled ? `0 0 10px ${G.gemGlow}` : "none",
              transition: "all 0.15s",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          width: "100%",
          maxWidth: 280,
        }}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map(
          (key, i) => {
            if (key === "") return <div key={i} />;

            return (
              <button
                key={i}
                onClick={() => (key === "⌫" ? del() : tap(key))}
                style={{
                  height: 68,
                  borderRadius: 18,
                  background: key === "⌫" ? "transparent" : "#ffffff",
                  border: `1.5px solid ${key === "⌫" ? "transparent" : G.border}`,
                  color: key === "⌫" ? G.muted : G.text,
                  fontSize: key === "⌫" ? 22 : 24,
                  fontWeight: key === "⌫" ? 500 : 800,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow:
                    key !== "⌫" ? "0 8px 22px rgba(43,43,43,0.08)" : "none",
                  transition: "all 0.12s",
                }}
              >
                {key}
              </button>
            );
          },
        )}
      </div>

      <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
        `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROOT APP
   ══════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState("home");
  const [products, setProducts] = useState(() => load("devi_products", []));
  const [sales, setSales] = useState(() => load("devi_sales", []));
  const [cart, setCart] = useState([]);
  const [applyTax, setApplyTax] = useState(true);
  const [businessName, setBusinessName] = useState(
    () => localStorage.getItem("devi_businessName") || "Devi Mode",
  );
  const [logoUrl, setLogoUrl] = useState(
    () => localStorage.getItem("devi_logoUrl") || null,
  );
  const [pin, setPin] = useState(() => localStorage.getItem("devi_pin") || "");
  const [isLocked, setIsLocked] = useState(
    () => !!localStorage.getItem("devi_pin"),
  );
  const [contactPhone, setContactPhone] = useState(
    () => localStorage.getItem("devi_contactPhone") || "",
  );
  const [contactEmail, setContactEmail] = useState(
    () => localStorage.getItem("devi_contactEmail") || "",
  );
  const [contactAddress, setContactAddress] = useState(
    () => localStorage.getItem("devi_contactAddress") || "",
  );
  const [pendingReceipt, setPendingReceipt] = useState(null);

  useEffect(() => {
    localStorage.setItem("devi_products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("devi_sales", JSON.stringify(sales));
  }, [sales]);
  useEffect(() => {
    localStorage.setItem("devi_businessName", businessName);
  }, [businessName]);
  useEffect(() => {
    if (logoUrl) localStorage.setItem("devi_logoUrl", logoUrl);
    else localStorage.removeItem("devi_logoUrl");
  }, [logoUrl]);
  useEffect(() => {
    if (pin) localStorage.setItem("devi_pin", pin);
    else localStorage.removeItem("devi_pin");
  }, [pin]);
  useEffect(() => {
    localStorage.setItem("devi_contactPhone", contactPhone);
  }, [contactPhone]);
  useEffect(() => {
    localStorage.setItem("devi_contactEmail", contactEmail);
  }, [contactEmail]);
  useEffect(() => {
    localStorage.setItem("devi_contactAddress", contactAddress);
  }, [contactAddress]);

  const activeSales = useMemo(() => sales.filter((s) => !s.voided), [sales]);
  const todaySales = useMemo(
    () =>
      activeSales
        .filter((s) => s.dateKey === todayKey())
        .reduce((sum, s) => sum + s.total, 0),
    [activeSales],
  );
  const todayCount = useMemo(
    () => activeSales.filter((s) => s.dateKey === todayKey()).length,
    [activeSales],
  );
  const todayProfit = useMemo(
    () =>
      activeSales
        .filter((s) => s.dateKey === todayKey())
        .reduce((sum, s) => sum + (s.profit || 0), 0),
    [activeSales],
  );
  const lowStock = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK),
    [products],
  );

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = applyTax ? subtotal * TAX_RATE : 0;
  const total = subtotal + tax;
  const cartProfit = cart.reduce(
    (sum, i) => sum + (i.price - (i.cost || 0)) * i.qty,
    0,
  );

  function addProduct(p) {
    setProducts((prev) => [...prev, p]);
  }
  function updateProduct(p) {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  }
  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function addToCart(product) {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) {
        return ex.qty >= product.stock
          ? prev
          : prev.map((i) =>
              i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
            );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function decrementCart(id) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function completeSale(paymentMethod) {
    if (cart.length === 0) return;
    const saleNum = activeSales.length + 1;
    const sale = {
      id: crypto.randomUUID(),
      receiptNumber: `DV-${String(saleNum).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
      dateKey: todayKey(),
      items: cart,
      subtotal,
      tax,
      total,
      profit: cartProfit,
      paymentMethod,
      taxApplied: applyTax,
      voided: false,
    };
    setSales((prev) => [sale, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        const ci = cart.find((c) => c.id === p.id);
        return ci ? { ...p, stock: Math.max(0, p.stock - ci.qty) } : p;
      }),
    );
    setCart([]);
    setApplyTax(true);
    setPendingReceipt(sale);
  }

  const contact = {
    phone: contactPhone,
    email: contactEmail,
    address: contactAddress,
  };

  function voidSale(id) {
    const sale = sales.find((s) => s.id === id);
    if (!sale) return;
    setSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, voided: true } : s)),
    );
    setProducts((prev) =>
      prev.map((p) => {
        const item = sale.items.find((i) => i.id === p.id);
        return item ? { ...p, stock: p.stock + item.qty } : p;
      }),
    );
  }

  if (isLocked && pin) {
    return (
      <LoginScreen
        logoUrl={logoUrl}
        businessName={businessName}
        correctPin={pin}
        onUnlock={() => setIsLocked(false)}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-logo-box">
          {logoUrl ? (
            <img src={logoUrl} alt="logo" />
          ) : (
            <img
              src="/logo.jpg"
              alt="logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
        </div>
        <span className="header-brand">{businessName}</span>
      </header>

      {tab === "home" && (
        <Dashboard
          activeSales={activeSales}
          todaySales={todaySales}
          todayCount={todayCount}
          todayProfit={todayProfit}
          lowStock={lowStock}
          products={products}
          setTab={setTab}
        />
      )}
      {tab === "products" && (
        <Products
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
        />
      )}
      {tab === "sale" && (
        <NewSale
          products={products}
          cart={cart}
          subtotal={subtotal}
          tax={tax}
          total={total}
          cartProfit={cartProfit}
          applyTax={applyTax}
          setApplyTax={setApplyTax}
          addToCart={addToCart}
          decrementCart={decrementCart}
          removeFromCart={removeFromCart}
          completeSale={completeSale}
          logoUrl={logoUrl}
          businessName={businessName}
        />
      )}
      {tab === "receipts" && (
        <Receipts
          sales={sales}
          businessName={businessName}
          voidSale={voidSale}
          logoUrl={logoUrl}
          contact={contact}
        />
      )}
      {tab === "reports" && <Reports activeSales={activeSales} />}
      {tab === "settings" && (
        <SettingsPage
          businessName={businessName}
          setBusinessName={setBusinessName}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          pin={pin}
          setPin={setPin}
          setIsLocked={setIsLocked}
          contactPhone={contactPhone}
          setContactPhone={setContactPhone}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          contactAddress={contactAddress}
          setContactAddress={setContactAddress}
        />
      )}

      {pendingReceipt && (
        <ReceiptDelivery
          sale={pendingReceipt}
          businessName={businessName}
          logoUrl={logoUrl}
          contact={contact}
          onClose={() => {
            setPendingReceipt(null);
            setTab("receipts");
          }}
        />
      )}

      <nav>
        <button
          className={tab === "home" ? "active" : ""}
          onClick={() => setTab("home")}
        >
          <Home size={22} />
          Home
        </button>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          <Package size={22} />
          Products
        </button>
        <button
          className={tab === "sale" ? "active" : ""}
          onClick={() => setTab("sale")}
        >
          <ShoppingCart size={22} />
          Sale
        </button>
        <button
          className={tab === "receipts" ? "active" : ""}
          onClick={() => setTab("receipts")}
        >
          <Receipt size={22} />
          Receipts
        </button>
        <button
          className={tab === "reports" ? "active" : ""}
          onClick={() => setTab("reports")}
        >
          <BarChart3 size={22} />
          Reports
        </button>
        <button
          className={tab === "settings" ? "active" : ""}
          onClick={() => setTab("settings")}
        >
          <Settings size={22} />
          Settings
        </button>
      </nav>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DASHBOARD
   ══════════════════════════════════════════════ */
function Dashboard({
  activeSales,
  todaySales,
  todayCount,
  todayProfit,
  lowStock,
  products,
  setTab,
}) {
  const todayReceipts = activeSales.filter((s) => s.dateKey === todayKey());
  const avgOrder = todayCount > 0 ? todaySales / todayCount : 0;

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 20 }}>
        Dashboard
      </h1>

      <div className="stat-grid">
        <div className="stat-card gold">
          <div className="stat-icon">
            <DollarSign size={20} />
          </div>
          <div className="stat-label">Today's Sales</div>
          <div className="stat-value">{money(todaySales)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>
          <div className="stat-label">Transactions</div>
          <div className="stat-value">{todayCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={20} />
          </div>
          <div className="stat-label">Products</div>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Receipt size={20} />
          </div>
          <div className="stat-label">All Time</div>
          <div className="stat-value">{activeSales.length}</div>
        </div>
      </div>

      {/* Profit + Avg row */}
      {(todayProfit > 0 || avgOrder > 0) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            className="info-card"
            style={{ margin: 0, padding: "14px 16px" }}
          >
            <div className="stat-label" style={{ marginBottom: 4 }}>
              Today's Profit
            </div>
            <div
              style={{ fontSize: 20, fontWeight: 700, color: "var(--gold)" }}
            >
              {money(todayProfit)}
            </div>
          </div>
          <div
            className="info-card"
            style={{ margin: 0, padding: "14px 16px" }}
          >
            <div className="stat-label" style={{ marginBottom: 4 }}>
              Avg. Order
            </div>
            <div
              style={{ fontSize: 20, fontWeight: 700, color: "var(--dark)" }}
            >
              {money(avgOrder)}
            </div>
          </div>
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="warn-banner">
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            <strong>Low stock:</strong>{" "}
            {lowStock.map((p) => `${p.name} (${p.stock})`).join(", ")}
          </span>
        </div>
      )}

      <button className="cta-btn" onClick={() => setTab("sale")}>
        <Plus size={20} /> Start New Sale
      </button>

      <span className="section-label">Recent Transactions</span>

      {todayReceipts.length === 0 ? (
        <div className="empty-state" style={{ padding: "20px 0" }}>
          <p>No sales today yet.</p>
        </div>
      ) : (
        todayReceipts.slice(0, 5).map((s) => (
          <div className="tx-card" key={s.id}>
            <div>
              <div className="tx-number">{s.receiptNumber}</div>
              <div className="tx-date">{formatDate(s.createdAt)}</div>
            </div>
            <div className="tx-right">
              <span className="tx-method">{s.paymentMethod}</span>
              <span className="tx-amount">{money(s.total)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PRODUCTS
   ══════════════════════════════════════════════ */
function Products({ products, addProduct, updateProduct, deleteProduct }) {
  const [showSheet, setShowSheet] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef();

  function openAdd() {
    setEditing(null);
    setName("");
    setCategory("");
    setPrice("");
    setCost("");
    setStock("");
    setPhoto(null);
    setShowSheet(true);
  }

  function openEdit(p) {
    setEditing(p);
    setName(p.name);
    setCategory(p.category || "");
    setPrice(p.price);
    setCost(p.cost || "");
    setStock(p.stock);
    setPhoto(p.photo || null);
    setShowSheet(true);
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 480;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas
          .getContext("2d")
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function save() {
    if (!name.trim() || !price) return;
    const data = {
      id: editing ? editing.id : crypto.randomUUID(),
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      cost: Number(cost) || 0,
      stock: Number(stock) || 0,
      photo: photo || null,
    };
    editing ? updateProduct(data) : addProduct(data);
    setShowSheet(false);
  }

  return (
    <div className="page">
      {confirmDelete && (
        <Modal
          title="Delete Product"
          message={`Delete "${confirmDelete.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteProduct(confirmDelete.id);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {showSheet && (
        <div className="sheet-overlay" onClick={() => setShowSheet(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <p className="sheet-title">
              {editing ? "Edit Product" : "New Product"}
            </p>

            <div
              className="photo-upload"
              onClick={() => fileRef.current.click()}
            >
              {photo ? (
                <img src={photo} alt="product preview" />
              ) : (
                <>
                  <Image size={34} color="#c4a882" />
                  <span className="photo-upload-label">Tap to add photo</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              style={{ display: "none" }}
              onChange={handlePhoto}
            />

            <div className="form-group">
              <label className="form-label">Product name *</label>
              <input
                className="form-input"
                placeholder="e.g. Floral Blouse"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                className="form-input"
                placeholder="e.g. Apparel, Accessories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price ($) *</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cost ($)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Stock quantity</label>
              <input
                className="form-input"
                type="number"
                min="0"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            {price && cost && Number(price) > 0 && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  marginBottom: 14,
                }}
              >
                Margin:{" "}
                <strong style={{ color: "var(--gold)" }}>
                  {money(Number(price) - Number(cost))}
                </strong>{" "}
                (
                {Number(price) > 0
                  ? Math.round(
                      ((Number(price) - Number(cost)) / Number(price)) * 100,
                    )
                  : 0}
                %)
              </p>
            )}
            <button
              className="btn-primary"
              onClick={save}
              disabled={!name.trim() || !price}
            >
              {editing ? "Save Changes" : "Add Product"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowSheet(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <button className="add-btn" onClick={openAdd}>
          <Plus size={20} />
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <Package size={52} />
          <p>
            No products yet.
            <br />
            Tap + to add your first one!
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-img">
                {p.photo ? (
                  <img src={p.photo} alt={p.name} />
                ) : (
                  <Image size={38} color="#c4a882" />
                )}
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                {p.category && <div className="product-cat">{p.category}</div>}
                <div className="product-price">{money(p.price)}</div>
                {p.cost > 0 && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      marginBottom: 4,
                    }}
                  >
                    Margin:{" "}
                    <strong style={{ color: "var(--gold)" }}>
                      {Math.round(((p.price - p.cost) / p.price) * 100)}%
                    </strong>
                  </div>
                )}
                <div style={{ marginBottom: 8 }}>
                  {p.stock <= 0 ? (
                    <span className="badge badge-red">Out of stock</span>
                  ) : p.stock <= LOW_STOCK ? (
                    <span className="badge badge-gold">⚠ {p.stock} left</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      {p.stock} in stock
                    </span>
                  )}
                </div>
                <div className="product-actions">
                  <button className="btn-edit" onClick={() => openEdit(p)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => setConfirmDelete(p)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEW SALE — CART FIRST (light cream/gold theme)
   ══════════════════════════════════════════════ */
function NewSale({
  products,
  cart,
  subtotal,
  tax,
  total,
  cartProfit,
  applyTax,
  setApplyTax,
  addToCart,
  decrementCart,
  removeFromCart,
  completeSale,
}) {
  const [search, setSearch] = useState("");
  const [paid, setPaid] = useState(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase()),
  );

  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      {/* ── TOTAL PANEL ── */}
      <div
        style={{
          background: "var(--white)",
          borderRadius: "0 0 var(--radius) var(--radius)",
          padding: "18px 18px 20px",
          marginBottom: 16,
          boxShadow: "var(--shadow-lg)",
          borderBottom: "1.5px solid var(--border)",
        }}
      >
        {/* Total */}
        <div style={{ marginBottom: 14 }}>
          <div className="section-label" style={{ marginBottom: 4 }}>
            Current Total
          </div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: -1.5,
              color: "var(--dark)",
              lineHeight: 1,
            }}
          >
            {money(total)}
          </div>
        </div>

        {/* Sub strip */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div
            style={{
              flex: 1,
              background: "var(--bg)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px",
              border: "1.5px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              Subtotal
            </div>
            <div
              style={{ fontSize: 16, fontWeight: 700, color: "var(--dark)" }}
            >
              {money(subtotal)}
            </div>
          </div>
          <button
            onClick={() => setApplyTax(!applyTax)}
            style={{
              flex: 1,
              padding: "10px 14px",
              background: applyTax ? "#fff7e6" : "var(--bg)",
              border: `1.5px solid ${applyTax ? "#fcd34d" : "var(--border)"}`,
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: applyTax ? "#92400e" : "var(--muted)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              IVU {applyTax ? "✓" : "✗"}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: applyTax ? "var(--dark)" : "var(--muted)",
              }}
            >
              {money(tax)}
            </div>
          </button>
        </div>

        {/* Cart list */}
        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 14 }}>
          {cart.length === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 12px",
                background: "var(--bg)",
                border: "1.5px dashed var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <ShoppingCart size={18} color="var(--muted)" />
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                Tap a product below to add it
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 10px",
                    background: "var(--bg)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      flexShrink: 0,
                      overflow: "hidden",
                      background: "var(--white)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Package size={16} color="var(--muted)" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--dark)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      {money(item.price)} c/u
                    </div>
                  </div>
                  {/* +/− controls */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={() => decrementCart(item.id)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: "var(--white)",
                        border: "1.5px solid var(--border)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text)",
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--gold-bg)",
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: "#fef9f0",
                        border: "1.5px solid var(--gold)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--gold)",
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div
                    style={{ flexShrink: 0, textAlign: "right", minWidth: 54 }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--dark)",
                      }}
                    >
                      {money(item.price * item.qty)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "block",
                        marginLeft: "auto",
                        marginTop: 2,
                      }}
                    >
                      <X size={11} color="var(--danger)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grand total row */}
        {cart.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 12,
              borderTop: "1.5px solid var(--border)",
              marginBottom: 14,
            }}
          >
            <span
              style={{ fontSize: 16, fontWeight: 700, color: "var(--dark)" }}
            >
              Total
            </span>
            <span
              style={{ fontSize: 22, fontWeight: 700, color: "var(--dark)" }}
            >
              {money(total)}
            </span>
          </div>
        )}

        {cartProfit > 0 && (
          <p
            style={{
              fontSize: 11,
              color: "var(--muted)",
              textAlign: "right",
              marginBottom: 12,
            }}
          >
            Est. profit:{" "}
            <strong style={{ color: "var(--gold)" }}>
              {money(cartProfit)}
            </strong>
          </p>
        )}

        {/* Payment buttons */}
        <div className="section-label" style={{ marginBottom: 10 }}>
          Payment Method
        </div>
        <div className="payment-grid">
          {[
            { label: "💵 Efectivo", key: "Efectivo" },
            { label: "💳 Tarjeta", key: "Tarjeta" },
            { label: "📱 ATH Móvil", key: "ATH Móvil" },
            { label: "💸 Otro", key: "Otro" },
          ].map(({ label, key }) => (
            <button
              key={key}
              className="pay-btn"
              onClick={() => cart.length > 0 && setPaid(key)}
              disabled={cart.length === 0}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="search-wrap">
        <Search size={16} className="search-icon" />
        <input
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="section-label" style={{ marginBottom: 10 }}>
        Products {filtered.length > 0 && `(${filtered.length})`}
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>Go to Products to add items first.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: "20px 0" }}>
          <p>No products match "{search}"</p>
        </div>
      ) : (
        <div
          className="sale-grid"
          style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          {filtered.map((p) => {
            const ci = cart.find((i) => i.id === p.id);
            const isOut = p.stock <= 0;
            return (
              <button
                key={p.id}
                className="sale-item-btn"
                onClick={() => addToCart(p)}
                disabled={isOut}
                style={{
                  border: ci ? "1.5px solid var(--gold)" : undefined,
                  background: ci ? "#fef9f0" : undefined,
                  position: "relative",
                }}
              >
                {ci && (
                  <div
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      zIndex: 2,
                      background: "var(--gold-bg)",
                      borderRadius: 20,
                      width: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {ci.qty}
                  </div>
                )}
                <div className="sale-item-img">
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} />
                  ) : (
                    <Image size={24} color="#c4a882" />
                  )}
                </div>
                <div className="sale-item-info">
                  <div className="sale-item-name">{p.name}</div>
                  <div className="sale-item-price">{money(p.price)}</div>
                  {isOut ? (
                    <div className="sale-item-out">Out of stock</div>
                  ) : (
                    <div className="sale-item-stock">{p.stock} left</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── CONFIRM MODAL ── */}
      {paid && (
        <Modal
          title="Confirm Sale"
          message={`Total: ${money(total)} · Payment: ${paid}. Complete this sale?`}
          confirmLabel="Complete Sale"
          onConfirm={() => {
            completeSale(paid);
            setPaid(null);
          }}
          onCancel={() => setPaid(null)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   RECEIPT DELIVERY MODAL
   ══════════════════════════════════════════════ */
function ReceiptDelivery({ sale, businessName, logoUrl, contact, onClose }) {
  const [step, setStep] = useState("choose");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function getPDF() {
    return generateReceiptPDF({ sale, businessName, logoUrl, contact });
  }

  async function handlePrint() {
    setLoading(true);
    const doc = await getPDF();
    printPDF(doc);
    setLoading(false);
    onClose();
  }

  async function handleDownload() {
    setLoading(true);
    const doc = await getPDF();
    downloadPDF(doc, `${sale.receiptNumber}.pdf`);
    setLoading(false);
  }

  async function handleWhatsApp() {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setPhoneErr("Enter a valid phone number (min 10 digits).");
      return;
    }
    setPhoneErr("");
    setLoading(true);
    const doc = await getPDF();
    downloadPDF(doc, `${sale.receiptNumber}.pdf`);
    const text = encodeURIComponent(
      `Hola! Aquí está su recibo ${sale.receiptNumber} de ${businessName}.\nTotal: $${sale.total.toFixed(2)}\nMétodo: ${sale.paymentMethod}\n\nEl PDF fue descargado automáticamente.`,
    );
    window.open(`https://wa.me/${cleaned}?text=${text}`, "_blank");
    setLoading(false);
    onClose();
  }

  async function handleEmail() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setEmailErr("Enter a valid email address.");
      return;
    }
    setEmailErr("");
    setLoading(true);
    const doc = await getPDF();
    downloadPDF(doc, `${sale.receiptNumber}.pdf`);
    const subject = encodeURIComponent(
      `Recibo ${sale.receiptNumber} - ${businessName}`,
    );
    const items = sale.items
      .map((i) => `  ${i.name} ×${i.qty}  $${(i.price * i.qty).toFixed(2)}`)
      .join("\n");
    const body = encodeURIComponent(
      `Hola,\n\nAdjunto encontrará su recibo ${sale.receiptNumber} de ${businessName}.\n\n` +
        `Fecha: ${new Date(sale.createdAt).toLocaleString("es-PR")}\n\nProductos:\n${items}\n\n` +
        `Subtotal: $${sale.subtotal.toFixed(2)}\nIVU: $${sale.tax.toFixed(2)}\nTotal: $${sale.total.toFixed(2)}\n` +
        `Método: ${sale.paymentMethod}\n\n¡Gracias por su compra!\n${businessName}`,
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
    setLoading(false);
    onClose();
  }

  const overlay = {
    position: "fixed",
    inset: 0,
    zIndex: 300,
    background: "rgba(26,15,8,0.72)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  };

  const sheet = {
    background: "var(--white)",
    borderRadius: "24px 24px 0 0",
    padding: "8px 20px 36px",
    width: "100%",
    maxWidth: 430,
    boxShadow: "0 -8px 40px rgba(0,0,0,0.22)",
  };

  const optBtn = (icon, label, sub, onClick, color = "var(--dark)") => (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        background: "var(--bg)",
        border: "1.5px solid var(--border)",
        borderRadius: 16,
        padding: "14px 16px",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        marginBottom: 10,
        transition: "border-color 0.15s",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          flexShrink: 0,
          background: "var(--white)",
          border: "1.5px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--dark)",
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>
      </div>
    </button>
  );

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div
          style={{
            width: 40,
            height: 4,
            background: "var(--border)",
            borderRadius: 2,
            margin: "0 auto 20px",
          }}
        />

        {step === "choose" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {sale.receiptNumber} · {money(sale.total)}
              </div>
              <h2
                style={{ fontSize: 20, fontWeight: 700, color: "var(--dark)" }}
              >
                ¿Cómo desea su recibo?
              </h2>
            </div>

            {optBtn(
              <Printer size={22} />,
              "Imprimir",
              "Abre el PDF listo para imprimir",
              handlePrint,
              "var(--gold)",
            )}
            {optBtn(
              <MessageCircle size={22} />,
              "WhatsApp",
              "Enviar por número de celular",
              () => setStep("whatsapp"),
              "#25D366",
            )}
            {optBtn(
              <Mail size={22} />,
              "Email",
              "Enviar por correo electrónico",
              () => setStep("email"),
              "#4285F4",
            )}

            <button
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                background: "transparent",
                border: "1.5px dashed var(--border)",
                borderRadius: 16,
                padding: "14px 16px",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--bg)",
                  border: "1.5px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--muted)",
                  flexShrink: 0,
                }}
              >
                <SkipForward size={22} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--muted)",
                  }}
                >
                  Sin recibo
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  Solo guardar la transacción
                </div>
              </div>
            </button>
          </>
        )}

        {step === "whatsapp" && (
          <>
            <button
              onClick={() => setStep("choose")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--gold)",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                padding: 0,
                marginBottom: 16,
              }}
            >
              ← Atrás
            </button>
            <div style={{ marginBottom: 18 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--dark)",
                  marginBottom: 4,
                }}
              >
                Enviar por WhatsApp
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                El PDF se descarga y WhatsApp Web se abre con el mensaje listo.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">
                <Phone
                  size={13}
                  style={{
                    display: "inline",
                    marginRight: 6,
                    verticalAlign: "middle",
                  }}
                />
                Número de celular
              </label>
              <input
                className="form-input"
                type="tel"
                placeholder="+1 (787) 000-0000"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneErr("");
                }}
              />
              {phoneErr && (
                <p
                  style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}
                >
                  {phoneErr}
                </p>
              )}
            </div>
            <button
              className="btn-primary"
              onClick={handleWhatsApp}
              disabled={loading}
              style={{ background: "#25D366", borderColor: "#25D366" }}
            >
              <MessageCircle size={16} style={{ marginRight: 8 }} />
              {loading ? "Generando PDF..." : "Enviar por WhatsApp"}
            </button>
          </>
        )}

        {step === "email" && (
          <>
            <button
              onClick={() => setStep("choose")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--gold)",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                padding: 0,
                marginBottom: 16,
              }}
            >
              ← Atrás
            </button>
            <div style={{ marginBottom: 18 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--dark)",
                  marginBottom: 4,
                }}
              >
                Enviar por Email
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                El PDF se descarga y se abre su cliente de correo con el mensaje
                listo.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">
                <Mail
                  size={13}
                  style={{
                    display: "inline",
                    marginRight: 6,
                    verticalAlign: "middle",
                  }}
                />
                Correo electrónico
              </label>
              <input
                className="form-input"
                type="email"
                placeholder="cliente@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailErr("");
                }}
              />
              {emailErr && (
                <p
                  style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}
                >
                  {emailErr}
                </p>
              )}
            </div>
            <button
              className="btn-primary"
              onClick={handleEmail}
              disabled={loading}
            >
              <Mail size={16} style={{ marginRight: 8 }} />
              {loading ? "Generando PDF..." : "Enviar por Email"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   RECEIPTS
   ══════════════════════════════════════════════ */
function Receipts({ sales, businessName, voidSale, logoUrl, contact }) {
  const [confirmVoid, setConfirmVoid] = useState(null);
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pdfLoading, setPdfLoading] = useState(null);

  function receiptText(sale) {
    return `${businessName}
${sale.receiptNumber} · ${new Date(sale.createdAt).toLocaleString("es-PR")}
${"─".repeat(30)}
${sale.items.map((i) => `${i.name} ×${i.qty}  ${money(i.price * i.qty)}`).join("\n")}
${"─".repeat(30)}
Subtotal:  ${money(sale.subtotal)}
IVU:       ${money(sale.tax)}
TOTAL:     ${money(sale.total)}
Payment:   ${sale.paymentMethod}${sale.voided ? "\n\n*** VOIDED ***" : ""}`;
  }

  function copyReceipt(sale) {
    navigator.clipboard?.writeText(receiptText(sale)).then(() => {
      setCopied(sale.id);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function shareReceipt(sale) {
    if (navigator.share) {
      navigator.share({
        title: `Receipt ${sale.receiptNumber}`,
        text: receiptText(sale),
      });
    } else {
      copyReceipt(sale);
    }
  }

  async function handleDownloadPDF(sale) {
    setPdfLoading(sale.id);
    const doc = await generateReceiptPDF({
      sale,
      businessName,
      logoUrl,
      contact,
    });
    downloadPDF(doc, `${sale.receiptNumber}.pdf`);
    setPdfLoading(null);
  }

  async function handlePrintPDF(sale) {
    setPdfLoading(sale.id + "-print");
    const doc = await generateReceiptPDF({
      sale,
      businessName,
      logoUrl,
      contact,
    });
    printPDF(doc);
    setPdfLoading(null);
  }

  const filtered =
    filter === "voided"
      ? sales.filter((s) => s.voided)
      : filter === "active"
        ? sales.filter((s) => !s.voided)
        : sales;

  return (
    <div className="page">
      {confirmVoid && (
        <Modal
          title="Void Receipt"
          message={`Void ${confirmVoid.receiptNumber}? Stock will be restored.`}
          confirmLabel="Void"
          danger
          onConfirm={() => {
            voidSale(confirmVoid.id);
            setConfirmVoid(null);
          }}
          onCancel={() => setConfirmVoid(null)}
        />
      )}

      <h1 className="page-title" style={{ marginBottom: 16 }}>
        Receipts
      </h1>

      <div className="filter-tabs">
        {[
          ["all", "All"],
          ["active", "Active"],
          ["voided", "Voided"],
        ].map(([val, label]) => (
          <button
            key={val}
            className={`filter-tab${filter === val ? " active" : ""}`}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Receipt size={48} />
          <p>No receipts found.</p>
        </div>
      ) : (
        filtered.map((sale) => (
          <div
            key={sale.id}
            className={`receipt-card${sale.voided ? " voided" : ""}`}
          >
            <div className="receipt-header">
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <span className="receipt-num">{sale.receiptNumber}</span>
                  {sale.voided && (
                    <span className="badge badge-red">Voided</span>
                  )}
                  <span className="badge badge-gold">{sale.paymentMethod}</span>
                </div>
                <div className="receipt-date">{formatDate(sale.createdAt)}</div>
                <div className="receipt-total">{money(sale.total)}</div>
              </div>
              <div className="receipt-actions">
                <button
                  className="icon-btn"
                  title="Download PDF"
                  onClick={() => handleDownloadPDF(sale)}
                  disabled={pdfLoading === sale.id}
                >
                  {pdfLoading === sale.id ? (
                    <CheckCircle size={16} color="var(--gold)" />
                  ) : (
                    <Download size={16} />
                  )}
                </button>
                <button
                  className="icon-btn"
                  title="Print PDF"
                  onClick={() => handlePrintPDF(sale)}
                  disabled={pdfLoading === sale.id + "-print"}
                >
                  <Printer size={16} />
                </button>
                <button className="icon-btn" onClick={() => copyReceipt(sale)}>
                  {copied === sale.id ? (
                    <CheckCircle size={16} color="var(--gold)" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <button className="icon-btn" onClick={() => shareReceipt(sale)}>
                  <Share2 size={16} />
                </button>
                {!sale.voided && (
                  <button
                    className="icon-btn red"
                    onClick={() => setConfirmVoid(sale)}
                  >
                    <XCircle size={16} />
                  </button>
                )}
              </div>
            </div>
            <hr className="divider" />
            {sale.items.map((item, i) => (
              <div key={i} className="line-item">
                <span>
                  {item.name} ×{item.qty}
                </span>
                <span>{money(item.price * item.qty)}</span>
              </div>
            ))}
            <hr className="divider" />
            <div className="line-item">
              <span>Subtotal</span>
              <span>{money(sale.subtotal)}</span>
            </div>
            <div className="line-item">
              <span>IVU{sale.taxApplied ? " 11.5%" : " (none)"}</span>
              <span>{money(sale.tax)}</span>
            </div>
            <div
              className="line-item"
              style={{
                fontWeight: 700,
                color: "var(--dark)",
                fontSize: 15,
                marginTop: 4,
              }}
            >
              <span>Total</span>
              <span>{money(sale.total)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   REPORTS
   ══════════════════════════════════════════════ */
function Reports({ activeSales }) {
  const totalRevenue = activeSales.reduce((s, x) => s + x.total, 0);
  const totalProfit = activeSales.reduce((s, x) => s + (x.profit || 0), 0);
  const totalTax = activeSales.reduce((s, x) => s + x.tax, 0);
  const avgOrder =
    activeSales.length > 0 ? totalRevenue / activeSales.length : 0;

  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("es-PR", {
        weekday: "short",
        day: "numeric",
      });
      const daySales = activeSales.filter((s) => s.dateKey === key);
      days.push({
        key,
        label,
        amount: daySales.reduce((sum, s) => sum + s.total, 0),
        count: daySales.length,
      });
    }
    return days;
  }, [activeSales]);

  const maxAmount = Math.max(...last7.map((d) => d.amount), 1);

  const byMethod = useMemo(() => {
    const map = {};
    activeSales.forEach((s) => {
      map[s.paymentMethod] = (map[s.paymentMethod] || 0) + s.total;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [activeSales]);

  const bestSellers = useMemo(() => {
    const map = {};
    activeSales.forEach((s) => {
      s.items.forEach((item) => {
        if (!map[item.id])
          map[item.id] = { name: item.name, qty: 0, revenue: 0 };
        map[item.id].qty += item.qty;
        map[item.id].revenue += item.price * item.qty;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [activeSales]);

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>
        Reports
      </h1>

      <div className="stat-grid">
        <div className="stat-card gold">
          <div className="stat-icon">
            <DollarSign size={18} />
          </div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value" style={{ fontSize: 20 }}>
            {money(totalRevenue)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={18} />
          </div>
          <div className="stat-label">Total Profit</div>
          <div className="stat-value" style={{ fontSize: 20 }}>
            {money(totalProfit)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Receipt size={18} />
          </div>
          <div className="stat-label">Total Sales</div>
          <div className="stat-value">{activeSales.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={18} />
          </div>
          <div className="stat-label">Avg. Order</div>
          <div className="stat-value" style={{ fontSize: 20 }}>
            {money(avgOrder)}
          </div>
        </div>
      </div>

      <div className="info-card">
        <p className="info-card-title">IVU Collected</p>
        <div style={{ fontSize: 26, fontWeight: 700, color: "var(--dark)" }}>
          {money(totalTax)}
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          Puerto Rico IVU 11.5% across all active sales
        </p>
      </div>

      <div className="info-card">
        <p className="info-card-title">Last 7 Days</p>
        {last7.map((day) => (
          <div className="bar-wrap" key={day.key}>
            <div className="bar-label">
              <span>
                {day.label}{" "}
                {day.count > 0 && (
                  <span style={{ opacity: 0.6 }}>({day.count})</span>
                )}
              </span>
              <span>{money(day.amount)}</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(day.amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {bestSellers.length > 0 && (
        <div className="info-card">
          <p className="info-card-title">Best Sellers</p>
          {bestSellers.map((item, i) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom:
                  i < bestSellers.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                fontSize: 14,
              }}
            >
              <span>
                <span
                  style={{
                    color: "var(--gold)",
                    fontWeight: 700,
                    marginRight: 8,
                  }}
                >
                  #{i + 1}
                </span>
                {item.name}
              </span>
              <span
                style={{ color: "var(--muted)", marginRight: 12, fontSize: 12 }}
              >
                {item.qty} units
              </span>
              <strong>{money(item.revenue)}</strong>
            </div>
          ))}
        </div>
      )}

      {byMethod.length > 0 && (
        <div className="info-card">
          <p className="info-card-title">By Payment Method</p>
          {byMethod.map(([method, amount], i) => (
            <div
              key={method}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                fontSize: 14,
                borderBottom:
                  i < byMethod.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span>{method}</span>
              <span
                style={{ color: "var(--muted)", marginRight: 12, fontSize: 12 }}
              >
                {totalRevenue > 0
                  ? Math.round((amount / totalRevenue) * 100)
                  : 0}
                %
              </span>
              <strong>{money(amount)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SETTINGS
   ══════════════════════════════════════════════ */
function SettingsPage({
  businessName,
  setBusinessName,
  logoUrl,
  setLogoUrl,
  pin,
  setPin,
  setIsLocked,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
  contactAddress,
  setContactAddress,
}) {
  const [name, setName] = useState(businessName);
  const [saved, setSaved] = useState(false);
  const [cPhone, setCPhone] = useState(contactPhone);
  const [cEmail, setCEmail] = useState(contactEmail);
  const [cAddress, setCAddress] = useState(contactAddress);
  const [contactSaved, setContactSaved] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [pinMsg, setPinMsg] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const logoFileRef = useRef();

  function saveName() {
    setBusinessName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const SIZE = 300;
        const side = Math.min(img.width, img.height);
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
        setLogoUrl(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function savePin() {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMsg({ type: "error", text: "PIN must be exactly 4 digits." });
      return;
    }
    if (newPin !== confirmPinInput) {
      setPinMsg({ type: "error", text: "PINs do not match." });
      return;
    }
    setPin(newPin);
    setNewPin("");
    setConfirmPinInput("");
    setPinMsg({
      type: "ok",
      text: "PIN saved! You'll need it next time you open the app.",
    });
    setTimeout(() => setPinMsg(null), 4000);
  }

  function removePin() {
    setPin("");
    setPinMsg({
      type: "ok",
      text: "PIN removed. App will open without a lock screen.",
    });
    setTimeout(() => setPinMsg(null), 3000);
  }

  function saveContact() {
    setContactPhone(cPhone);
    setContactEmail(cEmail);
    setContactAddress(cAddress);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 2000);
  }

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 16 }}>
        Settings
      </h1>

      {/* Logo */}
      <div className="info-card">
        <p className="info-card-title">Brand Logo</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              overflow: "hidden",
              background: "var(--bg)",
              border: "1.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Image size={30} color="var(--muted)" />
            )}
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text)",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {logoUrl ? "Logo uploaded" : "No logo set"}
            </div>
            <div
              style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}
            >
              Shown in the header and login screen.
              <br />
              Square images work best.
            </div>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={logoFileRef}
          style={{ display: "none" }}
          onChange={handleLogoUpload}
        />
        <button
          className="btn-primary"
          onClick={() => logoFileRef.current.click()}
        >
          <Upload size={16} style={{ marginRight: 6 }} />
          {logoUrl ? "Change Logo" : "Upload Logo"}
        </button>
        {logoUrl && (
          <button
            className="btn-secondary"
            onClick={() => setLogoUrl(null)}
            style={{ marginTop: 8 }}
          >
            Remove Logo
          </button>
        )}
      </div>

      {/* Business name */}
      <div className="info-card">
        <p className="info-card-title">Business Info</p>
        <div className="form-group">
          <label className="form-label">Business Name</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Business name"
          />
        </div>
        <button className="btn-primary" onClick={saveName}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* PIN Lock */}
      <div className="info-card">
        <p className="info-card-title">
          <Lock
            size={16}
            style={{
              display: "inline",
              marginRight: 8,
              verticalAlign: "middle",
            }}
          />
          PIN Lock
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.6,
            marginBottom: 14,
          }}
        >
          {pin
            ? "App is protected. A PIN is required on every launch."
            : "No PIN set. Set one to protect access to the app."}
        </p>
        <div className="form-group">
          <label className="form-label">New PIN (4 digits)</label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              type={showPin ? "text" : "password"}
              maxLength={4}
              placeholder="••••"
              value={newPin}
              onChange={(e) =>
                setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              style={{ paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPin(!showPin)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                padding: 4,
              }}
            >
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Confirm PIN</label>
          <input
            className="form-input"
            type="password"
            maxLength={4}
            placeholder="••••"
            value={confirmPinInput}
            onChange={(e) =>
              setConfirmPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
        </div>
        {pinMsg && (
          <p
            style={{
              fontSize: 13,
              marginBottom: 12,
              color: pinMsg.type === "ok" ? "var(--gold)" : "var(--danger)",
              fontWeight: 600,
            }}
          >
            {pinMsg.text}
          </p>
        )}
        <button
          className="btn-primary"
          onClick={savePin}
          disabled={newPin.length !== 4 || confirmPinInput.length !== 4}
        >
          Set PIN
        </button>
        {pin && (
          <button
            className="btn-secondary"
            onClick={removePin}
            style={{ marginTop: 8 }}
          >
            Remove PIN
          </button>
        )}
      </div>

      {/* Contact Info */}
      <div className="info-card">
        <p className="info-card-title">
          <Phone
            size={15}
            style={{
              display: "inline",
              marginRight: 8,
              verticalAlign: "middle",
            }}
          />
          Información de Contacto
        </p>
        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            marginBottom: 14,
            lineHeight: 1.5,
          }}
        >
          Aparece en el pie de página de todos los recibos PDF.
        </p>
        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input
            className="form-input"
            value={cPhone}
            onChange={(e) => setCPhone(e.target.value)}
            placeholder="+1 (787) 000-0000"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input
            className="form-input"
            type="email"
            value={cEmail}
            onChange={(e) => setCEmail(e.target.value)}
            placeholder="info@tunegocio.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Dirección</label>
          <input
            className="form-input"
            value={cAddress}
            onChange={(e) => setCAddress(e.target.value)}
            placeholder="Calle, Ciudad, PR 00000"
          />
        </div>
        <button className="btn-primary" onClick={saveContact}>
          {contactSaved ? "✓ Guardado!" : "Guardar Contacto"}
        </button>
      </div>

      {/* Tax info */}
      <div className="info-card">
        <p className="info-card-title">Tax</p>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
          Puerto Rico IVU: <strong>11.5%</strong>
          <br />
          Toggle IVU on or off per sale using the IVU button in the Sale screen.
        </p>
      </div>

      {/* Data */}
      <div className="info-card">
        <p className="info-card-title">Data & Storage</p>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
          All products, receipts, and settings are saved locally on this device
          using browser storage. No cloud sync.
        </p>
      </div>
    </div>
  );
}
