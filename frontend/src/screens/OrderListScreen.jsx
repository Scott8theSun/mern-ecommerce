import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderListScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet</p>
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order._id}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.isPaid ? 'Paid' : 'Pending Payment'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Shipping Address</h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Order Items</h4>
                  <p className="text-sm text-gray-600">
                    {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Total</h4>
                  <p className="text-lg font-semibold text-gray-800">
                    ${(order.totalPriceCents / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <img
                      key={index}
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{order.orderItems.length - 3}</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/order/${order._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;
