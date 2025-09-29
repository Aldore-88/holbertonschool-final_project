import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import ProductsPage from './pages/ProductsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';

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
          </Routes>
        </main>

        <footer className="footer">
          <p>
            &copy; 2025 Flora - Holberton Demo Project by Anthony, Bevan,
            Xiaoling, and Lily
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
