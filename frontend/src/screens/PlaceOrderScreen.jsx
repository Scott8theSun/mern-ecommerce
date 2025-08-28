import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems } = useCart();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=payment');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    } else if (!localStorage.getItem('shippingAddress')) {
      navigate('/shipping');
    } else {
      navigate('/payment');
    }
  }, [user, cartItems, navigate]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl">Redirecting...</div>
    </div>
  );
};

export default PlaceOrderScreen;
