import { useState, useEffect, useRef } from 'react'
import {
  Home,
  ShoppingBag,
  Receipt,
  BarChart3,
  Settings,
  Plus,
  Minus,
  Trash2,
  X,
  Share2,
  Copy,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  MoreHorizontal,
  ChevronRight,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  Camera,
  Image as ImageIcon
} from 'lucide-react'

// Default products
const defaultProducts = [
  { id: 1, name: 'Classic T-Shirt', price: 29.99, category: 'Apparel', image: null },
  { id: 2, name: 'Premium Hoodie', price: 59.99, category: 'Apparel', image: null },
  { id: 3, name: 'Designer Cap', price: 24.99, category: 'Accessories', image: null },
  { id: 4, name: 'Canvas Tote', price: 34.99, category: 'Accessories', image: null },
  { id: 5, name: 'Leather Wallet', price: 49.99, category: 'Accessories', image: null },
  { id: 6, name: 'Silver Necklace', price: 79.99, category: 'Jewelry', image: null },
  { id: 7, name: 'Denim Jacket', price: 89.99, category: 'Apparel', image: null },
  { id: 8, name: 'Silk Scarf', price: 44.99, category: 'Accessories', image: null },
]

const TAX_RATE = 0.115 // 11.5%

// Storage helpers
const storage = {
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error('Failed to save to localStorage')
    }
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState(() => storage.get('products', defaultProducts))
  const [cart, setCart] = useState([])
  const [receipts, setReceipts] = useState(() => storage.get('receipts', []))
  const [receiptCounter, setReceiptCounter] = useState(() => storage.get('receiptCounter', 1))
  const [showReceipt, setShowReceipt] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [businessSettings, setBusinessSettings] = useState(() => 
    storage.get('businessSettings', {
      name: 'Devi Mode',
      address: '',
      phone: '',
      email: ''
    })
  )

  // Save to localStorage
  useEffect(() => {
    storage.set('products', products)
  }, [products])

  useEffect(() => {
    storage.set('receipts', receipts)
  }, [receipts])

  useEffect(() => {
    storage.set('businessSettings', businessSettings)
  }, [businessSettings])

  useEffect(() => {
    storage.set('receiptCounter', receiptCounter)
  }, [receiptCounter])

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => setCart([])

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  // Process payment
  const processPayment = (method) => {
    const receiptNumber = `DV-${String(receiptCounter).padStart(4, '0')}`
    const newReceipt = {
      id: Date.now(),
      receiptNumber,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod: method
    }
    setReceipts(prev => [newReceipt, ...prev])
    setReceiptCounter(prev => prev + 1)
    setShowPaymentModal(false)
    setShowReceipt(newReceipt)
    clearCart()
  }

  // Get today's stats
  const todayReceipts = receipts.filter(r => {
    const receiptDate = new Date(r.date).toDateString()
    const today = new Date().toDateString()
    return receiptDate === today
  })
  const todaySales = todayReceipts.reduce((sum, r) => sum + r.total, 0)
  const todayTransactions = todayReceipts.length

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <img src="/logo.jpg" alt="Devi Mode" className="logo" onError={(e) => {
            e.target.style.display = 'none'
          }} />
          <h1 className="brand-name">{businessSettings.name}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            todaySales={todaySales}
            todayTransactions={todayTransactions}
            receipts={receipts}
            products={products}
            onStartSale={() => setActiveTab('sale')}
          />
        )}

        {activeTab === 'products' && (
          <Products
            products={products}
            setProducts={setProducts}
          />
        )}

        {activeTab === 'sale' && (
          <Sale
            products={products}
            cart={cart}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onCheckout={() => setShowPaymentModal(true)}
          />
        )}

        {activeTab === 'receipts' && (
          <Receipts
            receipts={receipts}
            onViewReceipt={setShowReceipt}
          />
        )}

        {activeTab === 'reports' && (
          <Reports receipts={receipts} />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={businessSettings}
            setSettings={setBusinessSettings}
            receipts={receipts}
            setReceipts={setReceipts}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavItem icon={Home} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon={Package} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <NavItem icon={ShoppingBag} label="Sale" active={activeTab === 'sale'} onClick={() => setActiveTab('sale')} badge={cart.length || null} />
        <NavItem icon={Receipt} label="Receipts" active={activeTab === 'receipts'} onClick={() => setActiveTab('receipts')} />
        <NavItem icon={BarChart3} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
        <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          total={total}
          onClose={() => setShowPaymentModal(false)}
          onPayment={processPayment}
        />
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          receipt={showReceipt}
          businessName={businessSettings.name}
          onClose={() => setShowReceipt(null)}
        />
      )}
    </div>
  )
}

// Navigation Item
function NavItem({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="nav-icon-wrapper">
        <Icon size={22} />
        {badge && <span className="nav-badge">{badge}</span>}
      </div>
      <span className="nav-label">{label}</span>
    </button>
  )
}

// Dashboard Screen
function Dashboard({ todaySales, todayTransactions, receipts, products, onStartSale }) {
  const recentReceipts = receipts.slice(0, 3)
  
  return (
    <div className="screen dashboard">
      <h2 className="screen-title">Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Today&apos;s Sales</span>
            <span className="stat-value">${todaySales.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Transactions</span>
            <span className="stat-value">{todayTransactions}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Products</span>
            <span className="stat-value">{products.length}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Receipt size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">All Time</span>
            <span className="stat-value">{receipts.length}</span>
          </div>
        </div>
      </div>

      <button className="primary-button large" onClick={onStartSale}>
        <Plus size={20} />
        Start New Sale
      </button>

      {recentReceipts.length > 0 && (
        <div className="section">
          <h3 className="section-title">Recent Transactions</h3>
          <div className="receipt-list">
            {recentReceipts.map(receipt => (
              <div key={receipt.id} className="receipt-item">
                <div className="receipt-info">
                  <span className="receipt-number">{receipt.receiptNumber}</span>
                  <span className="receipt-date">
                    {new Date(receipt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="receipt-amount">
                  <span className="receipt-method">{receipt.paymentMethod}</span>
                  <span className="receipt-total">${receipt.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Products Screen
function Products({ products, setProducts }) {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: null })
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return

    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: formData.name, price: parseFloat(formData.price), category: formData.category, image: formData.image }
          : p
      ))
    } else {
      setProducts(prev => [...prev, {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image
      }])
    }
    
    setFormData({ name: '', price: '', category: '', image: null })
    setShowForm(false)
    setEditingProduct(null)
  }

  const startEdit = (product) => {
    setEditingProduct(product)
    setFormData({ name: product.name, price: product.price.toString(), category: product.category || '', image: product.image || null })
    setShowForm(true)
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="screen products">
      <div className="screen-header">
        <h2 className="screen-title">Products</h2>
        <button className="icon-button" onClick={() => {
          setEditingProduct(null)
          setFormData({ name: '', price: '', category: '', image: null })
          setShowForm(true)
        }}>
          <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal product-form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button className="close-button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Image</label>
                <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
                  {formData.image ? (
                    <img src={formData.image} alt="Product preview" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">
                      <Camera size={24} />
                      <span>Tap to add photo</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                {formData.image && (
                  <button type="button" className="remove-image-btn" onClick={() => setFormData(prev => ({ ...prev, image: null }))}>
                    Remove image
                  </button>
                )}
              </div>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card manage">
            {product.image ? (
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
            ) : (
              <div className="product-image-placeholder">
                <ImageIcon size={24} />
              </div>
            )}
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              {product.category && <span className="product-category">{product.category}</span>}
              <span className="product-price">${product.price.toFixed(2)}</span>
            </div>
            <div className="product-actions">
              <button className="action-btn edit" onClick={() => startEdit(product)}>Edit</button>
              <button className="action-btn delete" onClick={() => deleteProduct(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Sale Screen
function Sale({ products, cart, addToCart, updateQuantity, removeFromCart, subtotal, tax, total, onCheckout }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="screen sale">
      <h2 className="screen-title">New Sale</h2>
      
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="products-grid sale-grid">
        {filteredProducts.map(product => (
          <button
            key={product.id}
            className="product-card sale"
            onClick={() => addToCart(product)}
          >
            {product.image ? (
              <div className="product-image-container sale">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
            ) : (
              <div className="product-image-placeholder sale">
                <Package size={20} />
              </div>
            )}
            <span className="product-name">{product.name}</span>
            <span className="product-price">${product.price.toFixed(2)}</span>
          </button>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-section">
          <div className="cart-header">
            <h3>Cart ({cart.length})</h3>
          </div>
          
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={16} />
                  </button>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax (11.5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-row grand">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="primary-button large checkout-btn" onClick={onCheckout}>
            Charge ${total.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  )
}

// Receipts Screen
function Receipts({ receipts, onViewReceipt }) {
  const groupedReceipts = receipts.reduce((groups, receipt) => {
    const date = new Date(receipt.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(receipt)
    return groups
  }, {})

  return (
    <div className="screen receipts">
      <h2 className="screen-title">Receipts</h2>
      
      {receipts.length === 0 ? (
        <div className="empty-state">
          <Receipt size={48} className="empty-icon" />
          <p>No receipts yet</p>
          <span>Complete a sale to see receipts here</span>
        </div>
      ) : (
        Object.entries(groupedReceipts).map(([date, dayReceipts]) => (
          <div key={date} className="receipt-group">
            <h3 className="receipt-date-header">{date}</h3>
            <div className="receipt-list">
              {dayReceipts.map(receipt => (
                <button
                  key={receipt.id}
                  className="receipt-item clickable"
                  onClick={() => onViewReceipt(receipt)}
                >
                  <div className="receipt-info">
                    <span className="receipt-number">{receipt.receiptNumber}</span>
                    <span className="receipt-time">
                      {new Date(receipt.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="receipt-amount">
                    <span className="receipt-method">{receipt.paymentMethod}</span>
                    <span className="receipt-total">${receipt.total.toFixed(2)}</span>
                    <ChevronRight size={16} className="chevron" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// Reports Screen
function Reports({ receipts }) {
  const today = new Date()
  
  // Calculate daily sales for last 7 days
  const dailySales = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toDateString()
    const dayReceipts = receipts.filter(r => new Date(r.date).toDateString() === dateStr)
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      sales: dayReceipts.reduce((sum, r) => sum + r.total, 0),
      count: dayReceipts.length
    }
  })

  const totalSales = receipts.reduce((sum, r) => sum + r.total, 0)
  const totalTransactions = receipts.length
  const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0

  // Payment method breakdown
  const paymentMethods = receipts.reduce((acc, r) => {
    acc[r.paymentMethod] = (acc[r.paymentMethod] || 0) + r.total
    return acc
  }, {})

  return (
    <div className="screen reports">
      <h2 className="screen-title">Reports</h2>

      <div className="report-stats">
        <div className="report-stat">
          <span className="report-stat-label">Total Revenue</span>
          <span className="report-stat-value">${totalSales.toFixed(2)}</span>
        </div>
        <div className="report-stat">
          <span className="report-stat-label">Total Transactions</span>
          <span className="report-stat-value">{totalTransactions}</span>
        </div>
        <div className="report-stat">
          <span className="report-stat-label">Avg. Transaction</span>
          <span className="report-stat-value">${avgTransaction.toFixed(2)}</span>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Last 7 Days</h3>
        <div className="sales-chart">
          {dailySales.map((day, index) => {
            const maxSales = Math.max(...dailySales.map(d => d.sales), 1)
            const height = (day.sales / maxSales) * 100
            return (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar" style={{ height: `${height}%` }}>
                  <span className="chart-value">${day.sales.toFixed(0)}</span>
                </div>
                <span className="chart-label">{day.date.split(' ')[0]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {Object.keys(paymentMethods).length > 0 && (
        <div className="section">
          <h3 className="section-title">Payment Methods</h3>
          <div className="payment-breakdown">
            {Object.entries(paymentMethods).map(([method, amount]) => (
              <div key={method} className="payment-method-row">
                <span className="payment-method-name">{method}</span>
                <span className="payment-method-amount">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Settings Screen
function SettingsScreen({ settings, setSettings, receipts, setReceipts }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearData = () => {
    setReceipts([])
    localStorage.clear()
    setShowClearConfirm(false)
  }

  return (
    <div className="screen settings">
      <h2 className="screen-title">Settings</h2>

      <div className="settings-section">
        <h3 className="settings-section-title">Business Information</h3>
        
        <div className="form-group">
          <label>Business Name</label>
          <input
            type="text"
            value={settings.name}
            onChange={e => setSettings(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your business name"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={e => setSettings(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Business address"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={settings.phone}
            onChange={e => setSettings(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone number"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={settings.email}
            onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email address"
          />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Data Management</h3>
        
        <div className="settings-info">
          <span>Total Receipts: {receipts.length}</span>
        </div>

        <button 
          className="danger-button"
          onClick={() => setShowClearConfirm(true)}
        >
          Clear All Data
        </button>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">About</h3>
        <div className="about-info">
          <p>Devi Mode POS v1.0.0</p>
          <p className="muted">Premium Point of Sale System</p>
        </div>
      </div>

      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Clear All Data?</h3>
            <p>This will permanently delete all receipts and reset settings. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setShowClearConfirm(false)}>Cancel</button>
              <button className="danger-button" onClick={handleClearData}>Clear Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Payment Modal
function PaymentModal({ total, onClose, onPayment }) {
  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: Banknote },
    { id: 'ath', name: 'ATH Móvil', icon: Smartphone },
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'other', name: 'Other', icon: MoreHorizontal },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Payment Method</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="payment-total">
          <span className="payment-total-label">Total Due</span>
          <span className="payment-total-amount">${total.toFixed(2)}</span>
        </div>

        <div className="payment-methods">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              className="payment-method-btn"
              onClick={() => onPayment(method.name)}
            >
              <method.icon size={24} />
              <span>{method.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Receipt Modal
function ReceiptModal({ receipt, businessName, onClose }) {
  const [copied, setCopied] = useState(false)

  const generateReceiptText = () => {
    const lines = [
      '═'.repeat(32),
      businessName.toUpperCase().padStart(16 + businessName.length / 2),
      '═'.repeat(32),
      '',
      `Receipt: ${receipt.receiptNumber}`,
      `Date: ${new Date(receipt.date).toLocaleString()}`,
      `Payment: ${receipt.paymentMethod}`,
      '',
      '─'.repeat(32),
      'ITEMS',
      '─'.repeat(32),
      ...receipt.items.map(item => 
        `${item.quantity}x ${item.name}\n   $${item.price.toFixed(2)} each = $${(item.price * item.quantity).toFixed(2)}`
      ),
      '',
      '─'.repeat(32),
      `Subtotal: $${receipt.subtotal.toFixed(2)}`,
      `Tax (11.5%): $${receipt.tax.toFixed(2)}`,
      `TOTAL: $${receipt.total.toFixed(2)}`,
      '═'.repeat(32),
      '',
      'Thank you for your purchase!',
      '',
      'Powered by Devi Mode POS'
    ]
    return lines.join('\n')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateReceiptText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy')
    }
  }

  const handleShare = async () => {
    const text = generateReceiptText()
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${receipt.receiptNumber}`,
          text: text
        })
      } catch {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal receipt-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button floating" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="receipt-slip">
          <div className="receipt-header">
            <div className="receipt-logo-area">
              <img src="/logo.jpg" alt="" className="receipt-logo" onError={(e) => {
                e.target.style.display = 'none'
              }} />
            </div>
            <h2 className="receipt-business-name">{businessName}</h2>
          </div>

          <div className="receipt-meta">
            <div className="receipt-meta-row">
              <span>Receipt #</span>
              <span>{receipt.receiptNumber}</span>
            </div>
            <div className="receipt-meta-row">
              <span>Date</span>
              <span>{new Date(receipt.date).toLocaleDateString()}</span>
            </div>
            <div className="receipt-meta-row">
              <span>Time</span>
              <span>{new Date(receipt.date).toLocaleTimeString()}</span>
            </div>
            <div className="receipt-meta-row">
              <span>Payment</span>
              <span>{receipt.paymentMethod}</span>
            </div>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-items-list">
            {receipt.items.map((item, index) => (
              <div key={index} className="receipt-item-row">
                <div className="receipt-item-details">
                  <span className="receipt-item-name">{item.name}</span>
                  <span className="receipt-item-qty">{item.quantity} × ${item.price.toFixed(2)}</span>
                </div>
                <span className="receipt-item-total">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-totals-section">
            <div className="receipt-total-row">
              <span>Subtotal</span>
              <span>${receipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="receipt-total-row">
              <span>Tax (11.5%)</span>
              <span>${receipt.tax.toFixed(2)}</span>
            </div>
            <div className="receipt-total-row grand">
              <span>Total</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-footer">
            <p className="thank-you">Thank you for your purchase!</p>
            <p className="powered-by">Powered by Devi Mode POS</p>
          </div>
        </div>

        <div className="receipt-actions">
          <button className="secondary-button" onClick={handleCopy}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button className="primary-button" onClick={handleShare}>
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
