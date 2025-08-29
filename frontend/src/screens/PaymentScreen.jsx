import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

// Load Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PaymentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create order first
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          qty: item.qty,
          priceCents: item.priceCents,
        })),
        shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')),
        paymentMethod: 'stripe',
        itemsPriceCents: getCartTotal(),
        shippingPriceCents: 0, // Free shipping
        taxPriceCents: Math.round(getCartTotal() * 0.1), // 10% tax
        totalPriceCents: Math.round(getCartTotal() * 1.1),
      };

      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });

      const order = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(order.message || 'Failed to create order');
      }

      // Create payment intent
      const paymentResponse = await fetch(`${API_BASE_URL}/api/orders/${order._id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { clientSecret } = await paymentResponse.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Update order to paid
        await fetch(`${API_BASE_URL}/api/orders/${order._id}/pay`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        clearCart();
        localStorage.removeItem('shippingAddress');
        toast.success('Payment successful!');
        navigate(`/order/${order._id}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
        <div className="border border-gray-300 rounded p-4">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
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
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span>${((getCartTotal() * 1.1) / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate('/shipping')}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Back to Shipping
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`px-6 py-2 rounded font-semibold ${
            !stripe || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

const PaymentScreen = () => {
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
    }
  }, [user, cartItems, navigate]);

  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Method</h1>
      
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default PaymentScreen;
