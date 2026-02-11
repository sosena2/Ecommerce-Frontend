import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockProducts } from '../data/products';

const Home = () => {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-blue-600 from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Products
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Shop quality products at affordable prices. Simple, fast, and reliable shopping experience.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100"
          >
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-primary-600 font-semibold hover:text-primary-700"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h3 className="font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-primary-600 font-bold">
                  ${product.price}
                </p>
                <Link
                  to={`/products/${product.id}`}
                  className="inline-block mt-3 text-sm text-primary-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
