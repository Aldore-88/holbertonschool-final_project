import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '../services/api';
import type { Product, FilterOptions, ProductResponse } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        setProducts(response.products);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      setProducts(response.products);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch };
};

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await apiService.getProduct(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useProductsByCategory = (categoryId: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiUrl}/categories/${categoryId}/products`);
        const data = await response.json();
        setProducts(data.products || data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
};

/**
 * Advanced hook for products with filtering, pagination, and URL parameter support
 * Used by LandingPage and ProductsPage
 */
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

interface UseProductsWithFiltersOptions {
  limit?: number;
  enablePagination?: boolean;
  enableFilters?: boolean;
}

export const useProductsWithFilters = (options: UseProductsWithFiltersOptions = {}) => {
  const {
    limit = 12,
    enablePagination = false,
    enableFilters = false,
  } = options;

  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ProductFilters>({
    page: 1,
    limit,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    occasions: [],
    seasons: [],
    moods: [],
    colors: [],
    types: [],
    priceRanges: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Category mapping for URL parameters
  const categoryMapping: Record<string, Partial<ProductFilters>> = {
    romantic: { mood: 'ROMANTIC' },
    cheerful: { mood: 'CHEERFUL' },
    elegant: { mood: 'ELEGANT' },
    seasonal: {},
    special: {},
  };

  /**
   * Parse URL parameters and set filters
   */
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');

    const filters = urlCategory ? categoryMapping[urlCategory.toLowerCase()] || {} : {};

    setSelectedFilters({
      page: 1,
      limit,
      ...filters,
      ...(urlSearch && { search: urlSearch }),
    });

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams, limit]);

  /**
   * Fetch products from API
   */
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams: Record<string, string> = {};

      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          queryParams[key] = value.toString();
        }
      });

      const response: ProductResponse = await apiService.getProducts(queryParams);

      setProducts(response.products);

      if (enablePagination) {
        setPagination(response.pagination);
      }

      if (enableFilters) {
        setFilterOptions(response.filters);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFilters, enablePagination, enableFilters]);

  /**
   * Fetch products when filters change
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filterType: keyof ProductFilters, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
      page: 1,
    }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSelectedFilters({
      page: 1,
      limit,
    });
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setSelectedFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Get count of active filters
   */
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (selectedFilters.occasion) count++;
    if (selectedFilters.season) count++;
    if (selectedFilters.mood) count++;
    if (selectedFilters.color) count++;
    if (selectedFilters.type) count++;
    if (selectedFilters.priceRange) count++;
    if (selectedFilters.search) count++;
    if (selectedFilters.inStock !== undefined) count++;
    return count;
  };

  return {
    products,
    isLoading,
    error,
    selectedFilters,
    setSelectedFilters,
    pagination,
    filterOptions,
    handleFilterChange,
    clearFilters,
    handlePageChange,
    getActiveFilterCount,
    refetch: fetchProducts,
  };
};
