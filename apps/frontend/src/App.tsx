import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './contexts/AuthContext';
<<<<<<< HEAD
import { LoginForm } from './components/auth/LoginForm';
import { Routes } from 'react-router-dom';
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
=======
import { useAuth0 } from '@auth0/auth0-react';
import { useCart } from './contexts/CartContext';
import ProductsPage from './pages/ProductsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/Checkout';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
>>>>>>> ceb94a311086e5af89eeb9de8bc85c30707a3fba

function App() {
  const [loading, setLoading] = useState(true);
  const [useAPI, setUseAPI] = useState(false);
  const {
    user,
    login,
    logout,
    loading: authLoading,
    getAccessToken,
  } = useAuth();
  const { getItemCount } = useCart();

  useEffect(() => {
    // Check if API is available
    checkAPIStatus();
  }, []);

  useEffect(() => {
    if (user) {
      getAccessToken().then((token) => {
        if (token) {
          console.log('Auth0 token: ', token);
        } else {
          console.log('No Auth0 token found');
        }
      });
    }
  }, [user, getAccessToken]);

  const checkAPIStatus = async () => {
    try {
      setLoading(true);
      const apiUrl =
        import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      console.log('🔍 Checking API status:', `${apiUrl}/health`);

      const response = await fetch(`${apiUrl}/health`);

      if (response.ok) {
        console.log('✅ API is available');
        setUseAPI(true);
      } else {
        console.log('ℹ️ API not responding properly');
        setUseAPI(false);
      }
    } catch (err) {
      console.log('ℹ️ API not available:', err);
      setUseAPI(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">🌸 Loading Flora marketplace...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent
        loading={loading}
        useAPI={useAPI}
        user={user}
        authLoading={authLoading}
        login={login}
        logout={logout}
        getItemCount={getItemCount}
      />
    </BrowserRouter>
  );
}

function AppContent({ loading, useAPI, user, authLoading, login, logout, getItemCount }: any) {
  const navigate = useNavigate();
  const { isLoading: auth0Loading, isAuthenticated } = useAuth0();

  useEffect(() => {
    // Handle Auth0 redirect callback - wait until Auth0 finishes processing
    if (!auth0Loading && isAuthenticated) {
      const returnTo = sessionStorage.getItem('auth_return_to');

      if (returnTo) {
        console.log('📍 Navigating to saved location:', returnTo);
        sessionStorage.removeItem('auth_return_to');

        // Small delay to ensure Auth0 has fully processed
        setTimeout(() => {
          navigate(returnTo, { replace: true });
        }, 100);
      }
    }
  }, [auth0Loading, isAuthenticated, navigate]);

  return (
<<<<<<< HEAD
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
=======
      <div className="app">
        <header className="header">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Link
                to="/"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h1>🌸 Flora</h1>
                <p>Flowers & Plants Marketplace</p>
              </Link>
            </div>

            <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link
                to="/products"
>>>>>>> ceb94a311086e5af89eeb9de8bc85c30707a3fba
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                }}
              >
                Browse Products
              </Link>

              <Link
                to="/cart"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#7a2e4a',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🛒 Cart
                {getItemCount() > 0 && (
                  <span style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}>
                    {getItemCount()}
                  </span>
                )}
              </Link>

              <div className="auth-section">
                {/* Show loading spinner while Auth0 is loading */}
                {authLoading ? (
                  <div>Loading...</div>
                ) : user ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    {/* Show user's email from Auth0 profile */}
                    <span>Welcome, {user.email}</span>
                    <button
                      onClick={logout}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </nav>
          </div>

          {!useAPI && (
            <div className="demo-badge">🚧 Demo Mode - API Not Available</div>
          )}
        </header>

        <main className="main">
          {/* Define app routes. AuthCallback is not needed with Auth0 React SDK */}
          <Routes>
            <Route
              path="/"
              element={<ProductsPage />}
            />
            <Route
              path="/products"
              element={<ProductsPage />}
            />
            <Route
              path="/subscriptions"
              element={<SubscriptionsPage />}
            />
            <Route
              path="/cart"
              element={<CartPage />}
            />
            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmationPage />}
            />
          </Routes>
        </main>

        <footer className="footer">
          <p>
            &copy; 2025 Flora - Holberton Demo Project by Anthony, Bevan,
            Xiaoling, and Lily
          </p>
        </footer>
      </div>
  );
}

export default App;
