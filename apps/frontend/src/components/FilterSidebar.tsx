import React from 'react';
import type { FilterOptions } from '../types';
import { formatFilterValue } from '../utils/filterFormatting';

/**
 * FilterSidebar Component
 *
 * This component renders all the filter options in a sidebar format.
 * It provides dropdown filters for different product attributes like
 * price, color, mood, season, occasion, etc.
 *
 * The component receives available filter options from the backend
 * and current selections from the parent component.
 */

// Interface for the filters that user has selected
interface ProductFilters {
  occasion?: string;
  season?: string;
  mood?: string;
  color?: string;
  type?: string;
  priceRange?: string;
  inStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

interface FilterSidebarProps {
  // Available filter options from the backend (what can be selected)
  filterOptions: FilterOptions;

  // Currently selected filters
  selectedFilters: ProductFilters;

  // Function to call when user changes a filter
  onFilterChange: (filterType: keyof ProductFilters, value: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterOptions,
  selectedFilters,
  onFilterChange,
}) => {
  /**
   * Handle filter change and ensure we pass empty string for "All" option
   */
  const handleFilterChange = (
    filterType: keyof ProductFilters,
    value: string
  ) => {
    // If user selects "All" option, pass empty string to clear the filter
    const filterValue = value === 'all' ? '' : value;
    onFilterChange(filterType, filterValue);
  };

  return (
    <div className="filter-sidebar-content">
      {/* Filter Options */}
      <div className="filter-options">
        {/* Price Range Filter */}
        <div className="filter-group">
          <select
            id="price-filter"
            value={selectedFilters.priceRange || ''}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="filter-select"
            aria-label="Filter by price range"
          >
            <option value="" className="filter-select-menu">All Prices</option>
            {filterOptions.priceRanges.map((priceRange) => (
              <option
                key={priceRange}
                value={priceRange}
                className="filter-select-menu"
              >
                {formatFilterValue('priceRange', priceRange)}
              </option>
            ))}
          </select>
        </div>

        {/* Color Filter */}
        <div className="filter-group">
          <select
            id="color-filter"
            value={selectedFilters.color || ''}
            onChange={(e) => handleFilterChange('color', e.target.value)}
            className="filter-select"
          >
            <option value="" className="filter-select-menu">All Colors</option>
            {filterOptions.colors.map((color) => (
              <option
                key={color}
                value={color}
                className="filter-select-menu"
              >
                {formatFilterValue('color', color)}
              </option>
            ))}
          </select>
        </div>

        {/* Mood Filter */}
        <div className="filter-group">
          <select
            id="mood-filter"
            value={selectedFilters.mood || ''}
            onChange={(e) => handleFilterChange('mood', e.target.value)}
            className="filter-select"
          >
            <option value="" className="filter-select-menu">All Moods</option>
            {filterOptions.moods.map((mood) => (
              <option
                key={mood}
                value={mood}
                className="filter-select-menu"
              >
                {formatFilterValue('mood', mood)}
              </option>
            ))}
          </select>
        </div>

        {/* Season Filter */}
        <div className="filter-group">
          <select
            id="season-filter"
            value={selectedFilters.season || ''}
            onChange={(e) => handleFilterChange('season', e.target.value)}
            className="filter-select"
          >
            <option value="" className="filter-select-menu">All Seasons</option>
            {filterOptions.seasons.map((season) => (
              <option
                key={season}
                value={season}
                className="filter-select-menu"
              >
                {formatFilterValue('season', season)}
              </option>
            ))}
          </select>
        </div>

        {/* Occasion Filter */}
        <div className="filter-group">
          <select
            id="occasion-filter"
            value={selectedFilters.occasion || ''}
            onChange={(e) => handleFilterChange('occasion', e.target.value)}
            className="filter-select"
          >
            <option value="" className="filter-select-menu">All Occasions</option>
            {filterOptions.occasions.map((occasion) => (
              <option
                key={occasion}
                value={occasion}
                className="filter-select-menu"
              >
                {formatFilterValue('occasion', occasion)}
              </option>
            ))}
          </select>
        </div>

        {/* Product Type Filter */}
        <div className="filter-group">
          <select
            id="type-filter"
            value={selectedFilters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="filter-select"
          >
            <option className="filter-select-menu" value="">All Types</option>
            {filterOptions.types.map((type) => (
              <option
                key={type}
                value={type}
                className="filter-select-menu"
              >
                {formatFilterValue('type', type)}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div className="filter-group">
          <select
            id="stock-filter"
            value={
              selectedFilters.inStock === undefined
                ? ''
                : selectedFilters.inStock.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                onFilterChange('inStock', ''); // Clear filter
              } else {
                onFilterChange('inStock', value);
              }
            }}
            className="filter-select"
          >
            <option value="" className="filter-select-menu">All Products</option>
            <option value="true" className="filter-select-menu">In Stock Only</option>
            <option value="false" className="filter-select-menu">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
