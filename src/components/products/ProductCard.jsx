import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id ?? product.id}`}
      className="block group"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg   transition duration-300 h-full">

        {/* Image */}
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={product.image || product.imageUrl}
            alt={product.name || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-full">
          <span className="text-xs font-medium text-primary-600 mb-2">
            {product.category}
          </span>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center mb-3">
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

          <div className="mt-auto">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
