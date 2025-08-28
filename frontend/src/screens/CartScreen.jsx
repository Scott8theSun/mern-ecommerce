import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartScreen = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQty, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add some products to your cart to get started!</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm">${(item.priceCents / 100).toFixed(2)} each</p>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    value={item.qty}
                    onChange={(e) => updateQty(item._id, Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-lg font-semibold text-gray-800">
                    ${((item.priceCents * item.qty) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
                <span>${(getCartTotal() / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${((getCartTotal() * 0.1) / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${((getCartTotal() * 1.1) / 100).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
