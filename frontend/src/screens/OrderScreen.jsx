import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const OrderScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Order not found');
        navigate('/myorders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Order #{order._id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                order.isPaid ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {order.isPaid ? 'Paid' : 'Pending Payment'}
              </span>
            </div>
            {order.isPaid && (
              <div className="flex justify-between">
                <span className="text-gray-600">Paid At:</span>
                <span className="font-medium">
                  {new Date(order.paidAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
          
          <div className="space-y-2">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && (
              <p>Phone: {order.shippingAddress.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
        
        <div className="space-y-4">
          {order.orderItems.map((item, index) => (
            <div key={index} className="flex items-center border-b border-gray-200 pb-4 last:border-b-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">Qty: {item.qty}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  ${((item.priceCents * item.qty) / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  ${(item.priceCents / 100).toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>${(order.itemsPriceCents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${(order.shippingPriceCents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${(order.taxPriceCents / 100).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${(order.totalPriceCents / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/myorders')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Back to My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderScreen;
