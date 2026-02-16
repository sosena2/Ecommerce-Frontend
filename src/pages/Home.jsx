import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, RefreshCw, TrendingUp, Award } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import { getProducts } from '../services/productService';
import Loader from '../components/ui/Loader';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured products
        const featuredResponse = await getProducts({ limit: 4 });
        const featuredData = featuredResponse?.data ?? featuredResponse ?? [];
        setFeaturedProducts(featuredData);
        
        // Fetch trending products
        const trendingResponse = await getProducts({ category: 'electronics', limit: 4 });
        const trendingData = trendingResponse?.data ?? trendingResponse ?? [];
        setTrendingProducts(trendingData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-bold mb-6 text-5xl ">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Shop the latest trends with free shipping and easy returns. Quality products at affordable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-10 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-transparent border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose E-Shop
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">On all orders over $50</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <RefreshCw className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Quality</h3>
              <p className="text-gray-600">Quality guaranteed products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link
              to="/products"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <ProductGrid products={featuredProducts} columns={4} />
          )}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <TrendingUp className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
          </div>

          {loading ? (
            <div className="py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <ProductGrid products={trendingProducts} columns={4} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who shop with us. Create an account today and enjoy exclusive benefits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-white text-gray-900 rounded-lg shadow-md hover:bg-gray-900 hover:text-white transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold border-2 border-white/70 text-white rounded-lg hover:border-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;