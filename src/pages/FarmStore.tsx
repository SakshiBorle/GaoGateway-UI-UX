import { useState } from 'react'
import type { Page, BookingState, CartItem, AccessibilityConfig } from '../types'

interface Props {
  navigate: (page: Page, data?: any) => void
  goBack: () => void
  pageData: Record<string, any>
  booking: BookingState
  setBooking: (b: BookingState) => void
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
  a11y: AccessibilityConfig
}

const VEG_IMG = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop&auto=format'
const HONEY_IMG = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=450&fit=crop&auto=format'
const RICE_IMG = 'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef57?w=600&h=450&fit=crop&auto=format'
const SPICE_IMG = 'https://images.unsplash.com/photo-1506089258044-b3af3e2d8b00?w=600&h=450&fit=crop&auto=format'
const PICKLE_IMG = 'https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=600&h=450&fit=crop&auto=format'
const GHEE_IMG = 'https://images.unsplash.com/photo-1550353185-761a5da3ee96?w=600&h=450&fit=crop&auto=format'
const MANGO_IMG = 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=450&fit=crop&auto=format'
const MASALA_IMG = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=450&fit=crop&auto=format'

const products = [
  { id: 'p1', name: 'Organic Honey', price: 320, img: HONEY_IMG, unit: '250g jar', cat: 'Homemade Products', tag: 'Bestseller', desc: 'Pure wildflower honey harvested from our farm beehives. No additives, no preservatives. Rich golden colour with a complex, floral flavour.', inStock: true, weight: '250g' },
  { id: 'p2', name: 'Heritage Rice', price: 180, img: RICE_IMG, unit: '1 kg bag', cat: 'Fresh Farm Produce', tag: 'Organic', desc: 'Traditional Kolam rice grown without pesticides on our paddy fields. Stone-milled to preserve nutrition. Aromatic and flavourful.', inStock: true, weight: '1 kg' },
  { id: 'p3', name: 'Farm Fresh Vegetables', price: 120, img: VEG_IMG, unit: 'Seasonal basket', cat: 'Fresh Farm Produce', tag: 'Daily Harvest', desc: 'A handpicked selection of whatever is freshest from the farm that day — tomatoes, leafy greens, gourds, and more.', inStock: true, weight: 'Approx. 1.5 kg' },
  { id: 'p4', name: 'Traditional Pickle Mix', price: 250, img: PICKLE_IMG, unit: '500g jar', cat: 'Homemade Products', tag: 'Traditional', desc: 'Home-prepared mixed pickle made with mango, lemon, and chilli in traditional Maharashtra style. No artificial preservatives.', inStock: true, weight: '500g' },
  { id: 'p5', name: 'Pure Desi Ghee', price: 650, img: GHEE_IMG, unit: '500ml jar', cat: 'Farm Goods', tag: 'Pure', desc: 'Slowly churned, pure cow ghee from our farm cows. Made using traditional methods — rich, fragrant, and nutritious.', inStock: true, weight: '500ml' },
  { id: 'p6', name: 'Masala Chai Blend', price: 280, img: MASALA_IMG, unit: '100g pack', cat: 'Local Products', tag: 'New', desc: 'A hand-blended masala chai mix with farm-grown ginger, cardamom, cinnamon, and black pepper. Authentic and warming.', inStock: true, weight: '100g' },
  { id: 'p7', name: 'Organic Spice Mix', price: 190, img: SPICE_IMG, unit: '150g tin', cat: 'Local Products', tag: 'Organic', desc: 'A special blend of organic spices from our kitchen garden — turmeric, coriander, cumin, and more. Freshly ground.', inStock: true, weight: '150g' },
  { id: 'p8', name: 'Alphonso Mango Pulp', price: 380, img: MANGO_IMG, unit: '500g pack', cat: 'Seasonal', tag: 'Seasonal', desc: 'Pure Alphonso mango pulp from our orchard. Sweetened naturally, no preservatives. Perfect for desserts and drinks.', inStock: false, weight: '500g' },
]

type StoreView = 'listing' | 'product' | 'cart' | 'checkout' | 'confirmation'
const categories = ['All', 'Fresh Farm Produce', 'Local Products', 'Homemade Products', 'Farm Goods']

export default function FarmStore({ navigate, goBack, pageData, cart, setCart }: Props) {
  const [view, setView] = useState<StoreView>(pageData?.view === 'cart' ? 'cart' : 'listing')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [addedItem, setAddedItem] = useState<string | null>(null)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [orderId] = useState(`FO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)

  const addToCart = (product: typeof products[0]) => {
    const existing = cart.find(i => i.id === product.id)
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.img, unit: product.unit }])
    }
    setAddedItem(product.id)
    setTimeout(() => setAddedItem(null), 1500)
  }

  const updateQty = (id: string, delta: number) => {
    const updated = cart.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0)
    setCart(updated)
  }

  const cartTotal = cart.reduce((a, b) => a + b.price * b.quantity, 0)
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0)

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.cat === activeCategory)

  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Please enter a valid email address.'
    if (!form.address.trim()) errs.address = 'Please enter a delivery address.'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePlaceOrder = () => {
    if (!validateForm()) return
    setOrderConfirmed(true)
    setView('confirmation')
    setCart([])
  }

  if (view === 'confirmation') {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #C8902A, #E8C070)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(200,144,42,0.3)' }}>✓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#2B5219', marginBottom: '12px' }}>Order Confirmed! 🛒</h1>
          <p style={{ color: '#6A5840', marginBottom: '24px' }}>Your farm products are on their way!</p>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8DCC8', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#8A7860', fontSize: '0.9rem' }}>Order ID</span>
              <span style={{ fontWeight: 700, color: '#2B5219' }}>{orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#8A7860', fontSize: '0.9rem' }}>Delivery to</span>
              <span style={{ fontWeight: 600, color: '#2A2015', textAlign: 'right', maxWidth: '200px' }}>{form.address || 'As provided'}</span>
            </div>
            <div style={{ padding: '12px', background: '#F5EFE0', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#8A7860' }}>Estimated delivery</div>
              <div style={{ fontWeight: 700, color: '#2B5219' }}>2–4 business days</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => { setView('listing'); setOrderConfirmed(false) }}
              style={{ padding: '12px 24px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
              🛒 Shop More
            </button>
            <button onClick={() => navigate('home')}
              style={{ padding: '12px 24px', background: 'transparent', color: '#2B5219', border: '2px solid #2B5219', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              ← Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'checkout') {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '40px' }}>
        <div style={{ background: '#7A4828', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setView('cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.2rem' }}>←</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white' }}>Checkout</h1>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* Form */}
            <div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8DCC8', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#2A2015', marginBottom: '20px' }}>Delivery Details</h2>
                {[
                  { id: 'name', label: 'Full Name*', type: 'text', placeholder: 'Your name' },
                  { id: 'email', label: 'Email Address*', type: 'email', placeholder: 'email@example.com' },
                  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 xxxxx xxxxx' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id} style={{ marginBottom: '16px' }}>
                    <label htmlFor={`checkout-${id}`} style={{ display: 'block', fontWeight: 600, color: '#2A2015', marginBottom: '6px', fontSize: '0.9rem' }}>{label}</label>
                    <input id={`checkout-${id}`} type={type} placeholder={placeholder} value={form[id as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))} className="rural-input" />
                    {formErrors[id] && <p role="alert" style={{ color: '#8B1A1A', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {formErrors[id]}</p>}
                  </div>
                ))}
                <div>
                  <label htmlFor="checkout-address" style={{ display: 'block', fontWeight: 600, color: '#2A2015', marginBottom: '6px', fontSize: '0.9rem' }}>Delivery Address*</label>
                  <textarea id="checkout-address" rows={3} placeholder="Full delivery address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="rural-input" style={{ resize: 'vertical' }} />
                  {formErrors.address && <p role="alert" style={{ color: '#8B1A1A', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {formErrors.address}</p>}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8DCC8', position: 'sticky', top: '100px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#2A2015', marginBottom: '16px' }}>Order Summary</h2>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0E8D8', fontSize: '0.88rem' }}>
                    <span style={{ color: '#2A2015' }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600, color: '#2B5219' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ padding: '12px 0', borderTop: '2px solid #E8DCC8', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#6A5840' }}>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#6A5840' }}>Delivery</span>
                    <span style={{ color: '#2B5219', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#2B5219', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E8DCC8' }}>
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={handlePlaceOrder}
                  style={{ width: '100%', marginTop: '16px', padding: '14px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700 }}>
                  🛒 Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'cart') {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '40px' }}>
        <div style={{ background: '#7A4828', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setView('listing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.2rem' }}>←</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white' }}>Your Cart ({cartCount} items)</h1>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#2B5219', marginBottom: '12px' }}>Your cart is empty</h2>
              <p style={{ color: '#6A5840', marginBottom: '24px' }}>Discover our fresh farm products!</p>
              <button onClick={() => setView('listing')} style={{ padding: '12px 28px', background: '#2B5219', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                Browse Farm Store
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8DCC8', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#C8DEB0' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#2A2015', marginBottom: '2px' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#8A7860' }}>{item.unit}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => updateQty(item.id, -1)} aria-label={`Remove one ${item.name}`}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #D4C4A0', background: 'white', cursor: 'pointer', fontWeight: 700, color: '#2B5219', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        −
                      </button>
                      <span style={{ fontWeight: 700, color: '#2B5219', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} aria-label={`Add one more ${item.name}`}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#2B5219', cursor: 'pointer', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        +
                      </button>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#2B5219', minWidth: '60px', textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8DCC8', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ color: '#6A5840' }}>Subtotal ({cartCount} items)</span>
                  <span style={{ fontWeight: 600 }}>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem' }}>
                  <span style={{ color: '#6A5840' }}>Delivery</span>
                  <span style={{ color: '#2B6A1A', fontWeight: 700 }}>FREE on orders above ₹500</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#2B5219', paddingTop: '12px', borderTop: '2px solid #E8DCC8' }}>
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={() => setView('checkout')}
                style={{ width: '100%', padding: '16px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 700 }}>
                Proceed to Checkout →
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (view === 'product' && selectedProduct) {
    const inCart = cart.find(i => i.id === selectedProduct.id)
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EE', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
          <button onClick={() => setView('listing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A4828', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
            ← Back to Store
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            <div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '1/1', background: '#E8DCC8', marginBottom: '16px' }}>
                <img src={selectedProduct.img} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div>
              <span style={{ background: '#F5EFE0', color: '#7A4828', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-block', marginBottom: '12px' }}>{selectedProduct.cat}</span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#2A2015', marginBottom: '8px' }}>{selectedProduct.name}</h1>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#7A4828' }}>₹{selectedProduct.price}</span>
                <span style={{ fontSize: '0.9rem', color: '#8A7860' }}>/ {selectedProduct.unit}</span>
              </div>
              <p style={{ color: '#4A3A28', lineHeight: 1.8, marginBottom: '20px' }}>{selectedProduct.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#F5EFE0', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#6A5840' }}>Weight</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2A2015' }}>{selectedProduct.weight}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#F5EFE0', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#6A5840' }}>Availability</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedProduct.inStock ? '#2B6A1A' : '#8B1A1A' }}>{selectedProduct.inStock ? '✓ In Stock' : '× Out of Stock'}</span>
                </div>
              </div>
              {selectedProduct.inStock ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { addToCart(selectedProduct); setView('listing') }}
                    style={{ flex: 1, padding: '14px', background: '#7A4828', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                    🛒 Add to Cart
                  </button>
                  {inCart && (
                    <button onClick={() => setView('cart')}
                      style={{ padding: '14px 20px', background: '#C8902A', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                      View Cart ({inCart.quantity})
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ padding: '16px', background: '#FFEAEA', borderRadius: '10px', border: '1px solid #F0A0A0', color: '#8B1A1A', fontWeight: 600, textAlign: 'center' }}>
                  × Currently Out of Stock
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Listing view
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EE' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7A4828, #C8902A)', padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', marginBottom: '16px' }}>🛒 Farm Store</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem' }}>Fresh, organic, and local — straight from our farm to your home.</p>
        {cartCount > 0 && (
          <button onClick={() => setView('cart')}
            style={{ marginTop: '20px', padding: '12px 24px', background: 'white', color: '#7A4828', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            🛒 View Cart ({cartCount} items)
          </button>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px', justifyContent: 'center' }} role="group" aria-label="Filter by category">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} aria-pressed={activeCategory === cat}
              style={{ padding: '9px 20px', borderRadius: '30px', border: `2px solid ${activeCategory === cat ? '#7A4828' : '#D4C4A0'}`, background: activeCategory === cat ? '#7A4828' : 'white', color: activeCategory === cat ? 'white' : '#4A3A28', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.15s ease' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          {filtered.map(product => (
            <div key={product.id} className="card-hover"
              style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(212,196,160,0.4)', boxShadow: '0 4px 16px rgba(122,72,40,0.06)', opacity: product.inStock ? 1 : 0.7, display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => { setSelectedProduct(product); setView('product') }} style={{ border: 'none', padding: 0, cursor: 'pointer', background: 'none' }}>
                <div style={{ aspectRatio: '1/1', background: '#E8DCC8', position: 'relative' }}>
                  <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  {product.tag && <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#7A4828', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>{product.tag}</span>}
                  {!product.inStock && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ background: '#8B1A1A', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>× Out of Stock</span>
                  </div>}
                </div>
              </button>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: '#7A4828', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.cat}</span>
                <button onClick={() => { setSelectedProduct(product); setView('product') }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#2A2015', margin: '6px 0 4px', lineHeight: 1.2 }}>{product.name}</h3>
                </button>
                <p style={{ fontSize: '0.8rem', color: '#8A7860', marginBottom: '12px' }}>{product.unit}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#7A4828' }}>₹{product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    aria-label={`Add ${product.name} to cart`}
                    aria-live="polite"
                    style={{ padding: '8px 16px', background: addedItem === product.id ? '#5A7A3A' : product.inStock ? '#7A4828' : '#C8C0B0', color: 'white', border: 'none', borderRadius: '6px', cursor: product.inStock ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s ease' }}>
                    {addedItem === product.id ? '✓ Added!' : '+ Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Farm info banner */}
        <div style={{ background: '#F0F7E8', border: '1px solid #C8DEB0', borderRadius: '12px', padding: '20px 24px', marginTop: '48px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '2rem' }}>🌱</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#2B5219', marginBottom: '4px' }}>100% Farm Direct</h3>
            <p style={{ fontSize: '0.88rem', color: '#4A3A28', lineHeight: 1.6 }}>
              All products are grown, harvested, or prepared at GaonGetaway. No middlemen, no preservatives. Free delivery on orders above ₹500.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
