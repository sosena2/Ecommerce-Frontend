// Products.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search,Grid, List, ChevronDown, Sliders, X, Star } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alerts';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getProducts } from '../services/productService';

const ProductsPage = () => {
  const normalizeCategory = (value) => {
    if (!value) return '';
    if (Array.isArray(value)) {
      return value.map(normalizeCategory).filter(Boolean);
    }
    if (typeof value === 'object') {
      const raw = value.slug || value.name || value.title || value.category || value._id || value.id || '';
      return String(raw).trim().toLowerCase();
    }
    return String(value).trim().toLowerCase();
  };

  const getCategoryValue = (value) => {
    if (!value) return '';
    if (typeof value === 'object') {
      return value.slug || value.name || value.title || value.category || value._id || value.id || '';
    }
    return value;
  };

  const getCategoryLabel = (value) => {
    if (!value) return '';
    if (typeof value === 'object') {
      return value.name || value.title || value.slug || value.category || value._id || value.id || '';
    }
    return value;
  };

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Data for filters
  const [categories, setCategories] = useState([]);
  const [availableFilters, setAvailableFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, itemsPerPage]);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, priceRange, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        category: selectedCategory || undefined,
      };
      
      if (sortBy) {
        switch (sortBy) {
          case 'price-low':
            params.sort = 'price';
            params.order = 'asc';
            break;
          case 'price-high':
            params.sort = 'price';
            params.order = 'desc';
            break;
          case 'newest':
            params.sort = 'createdAt';
            params.order = 'desc';
            break;
          case 'rating':
            params.sort = 'rating';
            params.order = 'desc';
            break;
          default:
            params.sort = 'createdAt';
            params.order = 'desc';
        }
      }
      
      const response = await getProducts(params);
      const productsData = response.data || response;
      setProducts(productsData);
      setTotalProducts(response.total || productsData.length || 0);
      
      // Calculate price range from products
      if (productsData.length > 0) {
        const prices = productsData.map(p => p.price);
        setAvailableFilters({
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
        });
      }

      const uniqueLabels = new Set();
      productsData.forEach((product) => {
        const label = getCategoryLabel(product.category);
        if (label) {
          uniqueLabels.add(String(label));
        }
      });
      const derivedCategories = ['All Categories', ...Array.from(uniqueLabels)];
      setCategories(derivedCategories);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory) {
      const selectedLower = normalizeCategory(selectedCategory);
      filtered = filtered.filter(product => {
        const productCategory = normalizeCategory(product.category);
        if (Array.isArray(productCategory)) {
          return productCategory.includes(selectedLower);
        }
        return productCategory === selectedLower;
      });
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply price range filter
    if (priceRange.min || priceRange.max) {
      const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      
      filtered = filtered.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    const value = getCategoryValue(category);
    setSelectedCategory(value === 'All Categories' ? '' : value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const selectedCategoryLabel = (() => {
    if (!selectedCategory) return '';
    const selectedLower = normalizeCategory(selectedCategory);
    const match = categories.find((category) => {
      const value = getCategoryValue(category);
      const label = getCategoryLabel(category);
      if (label === 'All Categories' || value === 'All Categories') return false;
      return normalizeCategory(value) === selectedLower || normalizeCategory(label) === selectedLower;
    });
    return match ? getCategoryLabel(match) : selectedCategory;
  })();

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-6"
            onClose={() => setError('')}
          />
        )}

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <Sliders className="h-4 w-4 mr-2" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className={`lg:w-80 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Search</h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="pl-10"
                    />
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => {
                    const value = getCategoryValue(category);
                    const label = getCategoryLabel(category);
                    const isAll = label === 'All Categories' || value === 'All Categories';
                    const isSelected = isAll
                      ? !selectedCategory
                      : normalizeCategory(value) === normalizeCategory(selectedCategory);

                    return (
                      <button
                        key={value || label}
                        onClick={() => handleCategorySelect(category)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-primary-50 text-primary-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      min={availableFilters.minPrice}
                      max={availableFilters.maxPrice}
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      min={availableFilters.minPrice}
                      max={availableFilters.maxPrice}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Range: ${availableFilters.minPrice} - ${availableFilters.maxPrice}
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {/* Implement rating filter */}}
                      className="flex items-center text-gray-600 hover:text-gray-900 w-full px-3 py-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">& up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Close Mobile Filters Button */}
              <div className="lg:hidden">
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full"
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Results Count */}
                <div>
                  <p className="text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalProducts}</span> products
                  </p>
                </div>

                {/* View Controls */}
                <div className="flex items-center space-x-4">
                  {/* Items per Page */}
                  <div className="hidden md:block">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                      <option value="12">12 per page</option>
                      <option value="24">24 per page</option>
                      <option value="48">48 per page</option>
                      <option value="96">96 per page</option>
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-primary-100 text-primary-600'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-primary-100 text-primary-600'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      title="List View"
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Sort By */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory || priceRange.min || priceRange.max || searchTerm) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700">
                        Category: {selectedCategoryLabel}
                        <button
                          onClick={() => setSelectedCategory('')}
                          className="ml-2 text-primary-500 hover:text-primary-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                        Price: ${priceRange.min || '0'} - ${priceRange.max || '∞'}
                        <button
                          onClick={() => setPriceRange({ min: '', max: '' })}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
                        Search: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm('')}
                          className="ml-2 text-green-500 hover:text-green-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-8">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <ProductGrid 
                products={paginatedProducts} 
                columns={4} 
              />
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((product) => (
                  <Link
                    key={product._id || product.id}
                    to={`/products/${product._id || product.id}`}
                    className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {product.name}
                            </h3>
                            <span className="inline-block px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full mb-2">
                              {product.category}
                            </span>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-2xl font-bold text-gray-900">
                              ${product.price}
                            </span>
                            {product.stock < 10 && product.stock > 0 && (
                              <p className="text-xs text-amber-600 mt-1">
                                Only {product.stock} left!
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center">
                            <div className="flex items-center mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({product.numReviews || 0} reviews)
                            </span>
                          </div>
                          <span className={`text-sm font-medium ${
                            product.stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {endIndex} of {filteredProducts.length} products
                </div>
                
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg border ${
                            currentPage === pageNum
                              ? 'border-primary-600 bg-primary-50 text-primary-600 font-medium'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;