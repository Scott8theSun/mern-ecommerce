import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ShippingScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems } = useCart();
  
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('shippingAddress', JSON.stringify(formData));
    navigate('/payment');
  };

  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shipping Address</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="block text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="street" className="block text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your street address"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-gray-700 mb-2">
              State/Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your state"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-gray-700 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your postal code"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-gray-700 mb-2">
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your country"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingScreen;
