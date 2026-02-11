import ProductGrid from '../components/products/ProductGrid';
import products from '../data/products';

const Products = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-950">All Products</h1>

      <ProductGrid products={products} columns={4} />
    </div>
  );
};

export default Products;
