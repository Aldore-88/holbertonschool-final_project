import React from 'react';
import { useProductsWithFilters } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import './ProductsPage.css';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  // Use the custom hook with limit of 3 products for landing page
  const { products, isLoading } = useProductsWithFilters({
    limit: 3,
    enablePagination: false,
    enableFilters: false,
  });


  return (
    <div className="landing-page-wrapper">
      {/* Subscription Info - First on Desktop */}
      <div className="details-container">
        <div id="flower" className="details-card">
          <div className="details-icon">
            <img src="/assets/flower-icon.svg" alt="Flower icon"></img>
          </div>
          <div className="details-text">
            <h4>Spontatous Subscription</h4>
            <p>Give a gift of surprise to your loved ones. Weekly, Fortnightly, Monthly and Yearly Subscriptions available.</p>
          </div>
        </div>

        <div id="calendar" className="details-card">
          <div className="details-icon">
            <img src="/assets/calendar-icon.svg" alt="Calendar icon"></img>
          </div>
          <div className="details-text">
            <h4>Reoccurring Subscription</h4>
            <p>Set up a gift on repeat! With our subscription, you can send a gift for any occasion.</p>
          </div>
        </div>

        <div id="colour" className="details-card">
          <div className="details-icon">
            <img src="/assets/colour-icon.svg" alt="Colour palette icon"></img>
          </div>
          <div className="details-text">
            <h4>Mood Picker</h4>
            <p>Pick a colour based on your mood and let our florists put together a bouquet of flowers.</p>
          </div>
        </div>

        <div id="details" className="details-card">
          <div className="details-icon">
            <img src="/assets/delivery-icon.svg" alt="Delivery icon"></img>
          </div>
          <div className="details-text">
            <h4>Same Day Delivery</h4>
            <p>Based in Melbourne, send out a gift to your loved ones on the same day of purchase.</p>
          </div>
        </div>
      </div>

      {/* White flowers image */}
      <div className="picture-container">
        <div className="image-container">
          <img src="/assets/baby-breath.png" alt="Flora flowers"></img>
        </div>
      </div>

      {/* Category Cards */}
      <div className="shop-by-container">
        <div className="shop-by-card">
          <a href="/products">
            <div className="shop-by-image">
              <img src="/assets/Filler1.jpg" alt="Shop all products"></img>
            </div>
            <div className="shop-by-text">
                <p>Shop By All</p>
            </div>
          </a>
        </div>

        <div className="shop-by-card">
          <a href="/products?filter=colour">
          <div className="shop-by-image">
            <img src="/assets/Filler2.jpg" alt="Shop by colour"></img>
          </div>
          <div className="shop-by-text">
              <p>Shop By Colour</p>
          </div>
          </a>
        </div>

        <div className="shop-by-card">
          <a href="/products?filter=occasion">
          <div className="shop-by-image">
            <img src="/assets/Filler3.jpg" alt="Shop by occasion"></img>
          </div>
          <div className="shop-by-text">
              <p>Shop By Occasion</p>
          </div>
          </a>
        </div>

        <div className="shop-by-card">
          <a href="/products">
          <div className="shop-by-image">
            <img src="/assets/Filler4.jpg" alt="Bundle and save"></img>
          </div>
          <div className="shop-by-text">
              <p>Bundle Up and Save</p>
          </div>
          </a>
        </div>
      </div>

      {/* Product Samples */}
      <div className="card-container">
        <div className="product-card-grid-container">
          <ProductGrid
            products={products}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
