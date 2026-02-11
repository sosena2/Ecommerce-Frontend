import { useParams, Link } from 'react-router-dom';
import {mockProducts} from '../data/products';
import ProductDetails from '../components/products/ProductDetails';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Product not found.</p>
        <Link to="/products" className="text-blue-600 underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Image */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <img
            src={mockProducts.image}
            alt={mockProducts.name}
            className="h-[420px] w-full rounded-xl object-contain"
          />
        </div>

        {/* Details Component */}
        <ProductDetails product={product} />

      </div>
    </div>
  );
};

export default ProductDetailsPage;
