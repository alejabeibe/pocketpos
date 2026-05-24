import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  Package,
  ShoppingCart,
  Receipt,
  BarChart3,
  Plus,
  Trash2,
} from "lucide-react";
import "./style.css";

const TAX_RATE = 0.115;

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [tab, setTab] = useState("sale");
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("products") || "[]");
  });
  const [sales, setSales] = useState(() => {
    return JSON.parse(localStorage.getItem("sales") || "[]");
  });
  const [cart, setCart] = useState([]);
  const [businessName, setBusinessName] = useState(
    localStorage.getItem("businessName") || "Mi Negocio"
  );

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("businessName", businessName);
  }, [businessName]);

  const todaySales = useMemo(() => {
    return sales
      .filter((sale) => sale.dateKey === todayKey())
      .reduce((sum, sale) => sum + sale.total, 0);
  }, [sales]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  function addProduct(product) {
    setProducts([...products, product]);
  }

  function deleteProduct(id) {
    setProducts(products.filter((p) => p.id !== id));
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function completeSale(paymentMethod) {
    if (cart.length === 0) return alert("Agrega productos primero.");

    const sale = {
      id: crypto.randomUUID(),
      receiptNumber: `R-${Date.now()}`,
      createdAt: new Date().toISOString(),
      dateKey: todayKey(),
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod,
    };

    setSales([sale, ...sales]);
    setCart([]);
    setTab("receipts");
  }

  return (
    <div className="app">
      <header>
        <h1>{businessName}</h1>
        <p>PocketPOS</p>
      </header>

      {tab === "home" && (
        <Dashboard sales={sales} todaySales={todaySales} />
      )}

      {tab === "products" && (
        <Products
          products={products}
          addProduct={addProduct}
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
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          completeSale={completeSale}
        />
      )}

      {tab === "receipts" && <Receipts sales={sales} businessName={businessName} />}

      {tab === "reports" && <Reports sales={sales} />}

      {tab === "settings" && (
        <Settings
          businessName={businessName}
          setBusinessName={setBusinessName}
        />
      )}

      <nav>
        <button onClick={() => setTab("home")}><Home size={20} />Inicio</button>
        <button onClick={() => setTab("products")}><Package size={20} />Items</button>
        <button onClick={() => setTab("sale")}><ShoppingCart size={20} />Venta</button>
        <button onClick={() => setTab("receipts")}><Receipt size={20} />Recibos</button>
        <button onClick={() => setTab("reports")}><BarChart3 size={20} />Reporte</button>
      </nav>
    </div>
  );
}

function Dashboard({ sales, todaySales }) {
  return (
    <main>
      <div className="card hero">
        <p>Ventas de hoy</p>
        <h2>{money(todaySales)}</h2>
      </div>

      <div className="card">
        <h3>Transacciones</h3>
        <p>{sales.filter((s) => s.dateKey === todayKey()).length} ventas hoy</p>
      </div>
    </main>
  );
}

function Products({ products, addProduct, deleteProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  function save() {
    if (!name || !price) return alert("Nombre y precio son requeridos.");

    addProduct({
      id: crypto.randomUUID(),
      name,
      price: Number(price),
    });

    setName("");
    setPrice("");
  }

  return (
    <main>
      <div className="card">
        <h2>Nuevo Producto</h2>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button className="primary" onClick={save}><Plus size={18} />Guardar Producto</button>
      </div>

      <div className="grid">
        {products.map((p) => (
          <div className="card product" key={p.id}>
            <h3>{p.name}</h3>
            <p>{money(p.price)}</p>
            <button className="danger" onClick={() => deleteProduct(p.id)}>
              <Trash2 size={16} />Borrar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function NewSale({ products, cart, subtotal, tax, total, addToCart, removeFromCart, completeSale }) {
  return (
    <main>
      <h2>Nueva Venta</h2>

      <div className="grid">
        {products.length === 0 && (
          <div className="card">
            <p>No tienes productos todavía. Ve a Items y crea uno.</p>
          </div>
        )}

        {products.map((p) => (
          <button className="card productButton" key={p.id} onClick={() => addToCart(p)}>
            <strong>{p.name}</strong>
            <span>{money(p.price)}</span>
          </button>
        ))}
      </div>

      <div className="card cart">
        <h2>Carrito</h2>

        {cart.map((item) => (
          <div className="row" key={item.id}>
            <span>{item.name} x{item.qty}</span>
            <strong>{money(item.price * item.qty)}</strong>
            <button onClick={() => removeFromCart(item.id)}>X</button>
          </div>
        ))}

        <hr />
        <div className="row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
        <div className="row"><span>IVU 11.5%</span><strong>{money(tax)}</strong></div>
        <div className="row total"><span>Total</span><strong>{money(total)}</strong></div>

        <button className="primary" onClick={() => completeSale("Efectivo")}>Cobrar Efectivo</button>
        <button className="primary" onClick={() => completeSale("ATH Móvil")}>Cobrar ATH Móvil</button>
        <button className="primary" onClick={() => completeSale("Tarjeta")}>Cobrar Tarjeta</button>
      </div>
    </main>
  );
}

function Receipts({ sales, businessName }) {
  function shareReceipt(sale) {
    const text = `${businessName}
Recibo: ${sale.receiptNumber}
Fecha: ${new Date(sale.createdAt).toLocaleString()}

${sale.items.map((i) => `${i.name} x${i.qty} - ${money(i.price * i.qty)}`).join("\n")}

Subtotal: ${money(sale.subtotal)}
IVU: ${money(sale.tax)}
Total: ${money(sale.total)}
Pago: ${sale.paymentMethod}`;

    if (navigator.share) {
      navigator.share({ title: "Recibo PocketPOS", text });
    } else {
      alert(text);
    }
  }

  return (
    <main>
      <h2>Recibos</h2>

      {sales.map((sale) => (
        <div className="card" key={sale.id}>
          <h3>{sale.receiptNumber}</h3>
          <p>{new Date(sale.createdAt).toLocaleString()}</p>
          <p><strong>{money(sale.total)}</strong> — {sale.paymentMethod}</p>
          <button className="primary" onClick={() => shareReceipt(sale)}>Compartir Recibo</button>
        </div>
      ))}
    </main>
  );
}

function Reports({ sales }) {
  const total = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <main>
      <div className="card hero">
        <p>Total histórico</p>
        <h2>{money(total)}</h2>
      </div>

      <div className="card">
        <h3>Total de ventas</h3>
        <p>{sales.length}</p>
      </div>
    </main>
  );
}

function Settings({ businessName, setBusinessName }) {
  return (
    <main>
      <div className="card">
        <h2>Configuración</h2>
        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Nombre del negocio"
        />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
