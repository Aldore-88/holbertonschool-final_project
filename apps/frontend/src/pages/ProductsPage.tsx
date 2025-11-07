import React, { useState } from 'react';
import { useProductsWithFilters } from '../hooks/useProducts';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  // State for mobile filter menu
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Use the custom hook with full features for products page
  const {
    products,
    isLoading,
    error,
    selectedFilters,
    pagination,
    filterOptions,
    handleFilterChange: hookHandleFilterChange,
    clearFilters,
    handlePageChange,
    getActiveFilterCount,
  } = useProductsWithFilters({
    limit: 12,
    enablePagination: true,
    enableFilters: true,
  });

  /**
   * Wrapper to handle filter change and close mobile menu
   */
  const handleFilterChange = (filterType: any, value: string) => {
    hookHandleFilterChange(filterType, value);
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="products-page">
      {/* Main Content Area */}
      <main className="page-content">
        <div className="products-container">
          <div className="content-wrapper">
            {/* Mobile Filter Toggle Button */}
            <button
              className="mobile-filter-toggle"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              aria-label="Toggle filters menu"
              aria-expanded={isMobileFilterOpen}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="filter-badge">{getActiveFilterCount()}</span>
              )}
            </button>

            {/* Mobile Filter Overlay */}
            {isMobileFilterOpen && (
              <div
                className="mobile-filter-overlay"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Left Sidebar - Filters */}
            <aside
              className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}
              role="complementary"
              aria-label="Product filters"
            >
              {/* Close button for mobile */}
              <button
                className="mobile-filter-close"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <FilterSidebar
                filterOptions={filterOptions}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </aside>

            {/* Right Side - Products Grid */}
            <section
              className="products-main"
              aria-label="Product results"
            >
              {/* Screen Reader Announcements */}
              <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {isLoading
                  ? 'Loading products...'
                  : `Showing ${products.length} of ${
                      pagination.total
                    } products${
                      getActiveFilterCount() > 0
                        ? ` with ${getActiveFilterCount()} filters applied`
                        : ''
                    }`}
              </div>

              {/* Results Header */}
              <div className="results-header">
                <div className="results-info">
                  {isLoading ? (
                    <span>Loading products...</span>
                  ) : (
                    <span>
                      Showing {products.length} of {pagination.total} products
                      {getActiveFilterCount() > 0 && (
                        <span className="filter-count">
                          ({getActiveFilterCount()} filter
                          {getActiveFilterCount() > 1 ? 's' : ''} applied)
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Clear Filters Button (only show if filters are applied) */}
                {getActiveFilterCount() > 0 && (
                  <button
                    className="clear-filters-btn"
                    onClick={clearFilters}
                    aria-label={`Clear all ${getActiveFilterCount()} active filters`}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && <div className="error-message">{error}</div>}

              {/* Products Grid */}
              <ProductGrid
                products={products}
                isLoading={isLoading}
              />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="products-pagination">
                  <div className="pagination-controls">
                    {/* Previous Page Button */}
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="pagination-btn"
                      aria-label="Go to previous page"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`pagination-btn ${
                          pageNum === pagination.page ? 'active' : ''
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={
                          pageNum === pagination.page ? 'page' : undefined
                        }
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Page Button */}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="pagination-btn"
                      aria-label="Go to next page"
                    >
                      Next
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="pagination-info">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
