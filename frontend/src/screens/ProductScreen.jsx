import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product.countInStock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    addToCart(product, qty);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-800">
              ${(product.priceCents / 100).toFixed(2)}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">
              Status:{' '}
              <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
              </span>
            </p>
          </div>

          {product.countInStock > 0 && (
            <div className="mb-6">
              <label htmlFor="qty" className="block text-gray-700 mb-2">
                Quantity:
              </label>
              <select
                id="qty"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2 w-20"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`w-full py-3 px-6 rounded-lg font-semibold ${
              product.countInStock > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
