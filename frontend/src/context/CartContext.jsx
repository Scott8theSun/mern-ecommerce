import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, qty = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        return [...prevItems, { ...product, qty }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // Update item quantity
  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === productId ? { ...item, qty } : item
        )
      );
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart totals
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.priceCents * item.qty), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.qty, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
