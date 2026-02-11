import { Star, Check, ShoppingCart } from 'lucide-react';
import Button from '../ui/Button';

const ProductDetails = ({ product }) => {
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating || 0)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));

  const defaultFeatures = [
    'Active noise cancellation',
    '30-hour battery life',
    'Bluetooth 5.0',
    'Premium sound quality',
    'Comfortable over-ear design',
  ];

  const features = product.features?.length
    ? product.features
    : defaultFeatures;

  return (
    <div className="space-y-7 bg-white">
      {/* Category */}
      <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
        {product.category}
      </span>

      {/* Title */}
      <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="font-medium text-slate-900">
            {product.rating || 0}
          </span>
        </div>
        <span>({product.numReviews || 0} reviews)</span>
      </div>

      {/* Description */}
      <p className="text-base leading-relaxed text-slate-600">
        {product.description}
      </p>

      {/* Key Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Key Features
        </h3>
        <ul className="space-y-3 text-slate-700">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="mt-0.5 h-5 w-5 text-emerald-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200" />

      {/* Price */}
      <div className="text-4xl font-semibold text-slate-900 sm:text-5xl">
        ${product.price}
      </div>

      {/* Static Button (no logic yet) */}
      <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <Button
          className="gap-2 rounded-xl px-6 py-3 text-sm"
          variant="primary"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
        <Button
          className="rounded-xl px-6 py-3 text-sm"
          variant="outline"
        >
          View Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
