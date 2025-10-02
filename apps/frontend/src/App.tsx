import { useState, useEffect } from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Simple inline types for now
interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number; // Changed from price to priceCents
  priceRange: string;
  imageUrl?: string;
  inStock: boolean;
  stockCount: number; // Added stockCount
  occasions: string[];
  seasons: string[];
  moods: string[];
  colors: string[];
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Dummy data for development
const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Red Rose Bouquet',
    description: 'Classic red roses perfect for romantic occasions',
    priceCents: 4599,
    priceRange: 'RANGE_25_50',
    imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400',
    inStock: true,
    stockCount: 25,
    occasions: ['VALENTINES_DAY', 'ANNIVERSARY'],
    seasons: ['ALL_SEASON'],
    moods: ['ROMANTIC'],
    colors: ['RED'],
    type: 'BOUQUET',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Spring Tulip Arrangement',
    description: 'Beautiful mixed tulips in a ceramic vase',
    priceCents: 3250,
    priceRange: 'RANGE_25_50',
    imageUrl:
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400',
    inStock: true,
    stockCount: 18,
    occasions: ['MOTHERS_DAY', 'BIRTHDAY', 'JUST_BECAUSE'],
    seasons: ['SPRING'],
    moods: ['CHEERFUL', 'VIBRANT'],
    colors: ['MIXED', 'PASTEL'],
    type: 'TULIP',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'White Orchid Plant',
    description: 'Elegant white orchid in decorative pot',
    priceCents: 6800,
    priceRange: 'RANGE_50_75',
    imageUrl:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    inStock: true,
    stockCount: 12,
    occasions: ['CONGRATULATIONS', 'JUST_BECAUSE'],
    seasons: ['ALL_SEASON'],
    moods: ['ELEGANT', 'SOPHISTICATED'],
    colors: ['WHITE'],
    type: 'ORCHID',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Sunflower Happiness Bouquet',
    description: 'Bright sunflowers to bring joy and warmth',
    priceCents: 3875,
    priceRange: 'RANGE_25_50',
    imageUrl:
      'https://images.unsplash.com/photo-1597848212624-e8717d946f37?w=400',
    inStock: true,
    stockCount: 22,
    occasions: ['GET_WELL_SOON', 'CONGRATULATIONS', 'BIRTHDAY'],
    seasons: ['SUMMER', 'FALL'],
    moods: ['CHEERFUL', 'VIBRANT'],
    colors: ['YELLOW'],
    type: 'SUNFLOWER',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Succulent Garden',
    description: 'Mix of beautiful succulents in a modern planter',
    priceCents: 2399,
    priceRange: 'UNDER_25',
    imageUrl:
      'https://images.unsplash.com/photo-1519336056116-bc0f1771dec8?w=400',
    inStock: true,
    stockCount: 30,
    occasions: ['JUST_BECAUSE'],
    seasons: ['ALL_SEASON'],
    moods: ['PEACEFUL', 'SOPHISTICATED'],
    colors: ['GREEN'],
    type: 'SUCCULENT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Pink Lily Arrangement',
    description: 'Graceful pink lilies in an elegant vase',
    priceCents: 5500,
    priceRange: 'RANGE_50_75',
    imageUrl:
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400',
    inStock: false,
    stockCount: 0,
    occasions: ['MOTHERS_DAY', 'SYMPATHY', 'ANNIVERSARY'],
    seasons: ['SPRING', 'SUMMER'],
    moods: ['ELEGANT', 'PEACEFUL'],
    colors: ['PINK'],
    type: 'LILY',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useAPI, setUseAPI] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    // Try to fetch from API first
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl =
        import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      console.log('🔍 Trying API:', `${apiUrl}/products`);

      const response = await fetch(`${apiUrl}/products`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductResponse = await response.json();
      console.log('✅ API Data received:', data);

      if (data.products && data.products.length > 0) {
        setProducts(data.products);
        setUseAPI(true);
        setError(null);
      } else {
        // No products in API, fall back to dummy data
        console.log('ℹ️ No products in API, using dummy data');
        setProducts(dummyProducts);
        setUseAPI(false);
        setError(null);
      }
    } catch (err) {
      console.log('ℹ️ API not available, using dummy data:', err);
      setProducts(dummyProducts);
      setUseAPI(false);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceCents: number) =>
    `$${(priceCents / 100).toFixed(2)}`;

  const formatEnumValue = (value: string) => {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">🌸 Loading Flora marketplace...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>🌸 Flora</h1>
            <p>Flowers & Plants Marketplace</p>
          </div>

          {/* <BrowserRouter>
            <nav>
              <Link to="/">Home</Link> |{" "}
              <Link to="/pages/Checkout.tsx">About</Link> |{" "}
              <Link to="/pages/HomePage.tsx">Contact</Link>
            </nav>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </BrowserRouter> */}
          
          <div className="auth-section">
            {authLoading ? (
              <div>Loading...</div>
            ) : user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>Welcome, {user.email}</span>
                <button 
                  onClick={() => signOut()}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
        
        {!useAPI && (
          <div className="demo-badge">🚧 Demo Mode - Using Sample Data</div>
        )}
      </header>

      <main className="main">
        <section className="hero">
          <h2>Welcome to Flora</h2>
          <p>Discover beautiful flowers and plants for every occasion</p>
        </section>

        <section className="products">
          <h3>Our Products ({products.length})</h3>

          {products.length === 0 ? (
            <div className="no-products">
              <p>No products found. Make sure to seed the database!</p>
              <p>
                Run: <code>pnpm db:seed</code>
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  )}
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="description">{product.description}</p>
                    <div className="price">
                      {formatPrice(product.priceCents)}
                    </div>
                    <div className="product-meta">
                      <span className="type">
                        {formatEnumValue(product.type)}
                      </span>
                      {!product.inStock && (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>
                    <div className="tags">
                      {product.occasions.slice(0, 2).map((occasion) => (
                        <span
                          key={occasion}
                          className="tag occasion"
                        >
                          {formatEnumValue(occasion)}
                        </span>
                      ))}
                      {product.colors.slice(0, 2).map((color) => (
                        <span
                          key={color}
                          className="tag color"
                        >
                          {formatEnumValue(color)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 1001
              }}
            >
              ×
            </button>
            <LoginForm 
              onSuccess={() => setShowLoginModal(false)}
            />
          </div>
        </div>
      )}

      <footer className="footer">
        <p>
          &copy; 2024 Flora - Holberton Demo Project by Anthony, Bevan,
          Xiaoling, and Lily
        </p>
      </footer>
    </div>
  );
}

export default App;
