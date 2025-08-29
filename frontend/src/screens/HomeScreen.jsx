import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const seedProducts = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/products/seed`);
      toast.success('Sample products added!');
      // Refresh products
      const { data } = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(data);
    } catch (error) {
      console.error('Error seeding products:', error);
      toast.error('Failed to seed products');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Latest Products</h1>
        {products.length === 0 && (
          <button
            onClick={seedProducts}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Sample Products
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No products available</p>
          <p className="text-gray-500">Click the button above to add sample products</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    ${(product.priceCents / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
