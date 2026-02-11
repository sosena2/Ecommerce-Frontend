import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../data/products';
import ProductDetails from '../components/products/ProductDetails';
import Card from '../components/ui/Card';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const product = mockProducts.find((p) => String(p.id) === id);

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
        <Card className="rounded-2xl p-6" padding={false}>
          <img
            src={product.image}
            alt={product.name}
            className="h-[420px] w-full rounded-xl object-contain"
          />
        </Card>

        {/* Details Component */}
        <ProductDetails product={product} />

      </div>
    </div>
  );
};

export default ProductDetailsPage;
