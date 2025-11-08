import React, { createContext, useReducer, useEffect, useCallback } from 'react';

// Initial state
const initialState = {
  cart: [],
  shippingAddress: {},
  paymentMethod: '',
  loading: false,
  error: null,
};

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const SAVE_SHIPPING_ADDRESS = 'SAVE_SHIPPING_ADDRESS';
const SAVE_PAYMENT_METHOD = 'SAVE_PAYMENT_METHOD';
const LOAD_CART = 'LOAD_CART';
const CART_LOADING = 'CART_LOADING';
const CART_ERROR = 'CART_ERROR';
const CLEAR_CART_ERROR = 'CLEAR_CART_ERROR';

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const existItem = state.cart.find((x) => x._id === item._id);

      if (existItem) {
        return {
          ...state,
          cart: state.cart.map((x) =>
            x._id === existItem._id
              ? { ...item, quantity: x.quantity + item.quantity }
              : x
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, item],
        };
      }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((x) => x._id !== action.payload),
      };

    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((x) =>
          x._id === action.payload.id
            ? { ...x, quantity: action.payload.quantity }
            : x
        ),
      };

    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    case SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case LOAD_CART:
      return {
        ...state,
        cart: action.payload,
      };

    case CART_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case CART_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case CLEAR_CART_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
export const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Add to cart action
  const addToCart = (item) => {
    try {
      dispatch({ type: ADD_TO_CART, payload: item });
      // Show success message could be added here
    } catch (error) {
      dispatch({ type: CART_ERROR, payload: 'Failed to add item to cart' });
    }
  };

  // Remove from cart action
  const removeFromCart = (id) => {
    try {
      dispatch({ type: REMOVE_FROM_CART, payload: id });
      // Show success message could be added here
    } catch (error) {
      dispatch({ type: CART_ERROR, payload: 'Failed to remove item from cart' });
    }
  };

  // Update cart quantity action
  const updateCartQuantity = (id, quantity) => {
    try {
      if (quantity <= 0) {
        removeFromCart(id);
      } else {
        dispatch({ type: UPDATE_CART_QUANTITY, payload: { id, quantity } });
      }
    } catch (error) {
      dispatch({ type: CART_ERROR, payload: 'Failed to update cart quantity' });
    }
  };

  // Clear cart action
  const clearCart = () => {
    try {
      dispatch({ type: CLEAR_CART });
    } catch (error) {
      dispatch({ type: CART_ERROR, payload: 'Failed to clear cart' });
    }
  };

  // Clear cart error
  const clearCartError = useCallback(() => {
    dispatch({ type: CLEAR_CART_ERROR });
  }, []);

  // Clear localStorage and reset cart (for debugging)
  const resetCart = useCallback(() => {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    dispatch({ type: CLEAR_CART });
    dispatch({ type: SAVE_SHIPPING_ADDRESS, payload: {} });
    dispatch({ type: SAVE_PAYMENT_METHOD, payload: '' });
  }, []);

  // Save shipping address action
  const saveShippingAddress = (address) => {
    dispatch({ type: SAVE_SHIPPING_ADDRESS, payload: address });
  };

  // Save payment method action
  const savePaymentMethod = (method) => {
    dispatch({ type: SAVE_PAYMENT_METHOD, payload: method });
  };

  // Calculate totals
  const itemsPrice = state.cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartItems = localStorage.getItem('cartItems');
    const shippingAddress = localStorage.getItem('shippingAddress');
    const paymentMethod = localStorage.getItem('paymentMethod');

    if (cartItems) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(cartItems) });
    }
    if (shippingAddress) {
      dispatch({ type: SAVE_SHIPPING_ADDRESS, payload: JSON.parse(shippingAddress) });
    }
    if (paymentMethod) {
      dispatch({ type: SAVE_PAYMENT_METHOD, payload: paymentMethod });
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cart));
  }, [state.cart]);

  // Save shipping address to localStorage
  useEffect(() => {
    if (Object.keys(state.shippingAddress).length > 0) {
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    }
  }, [state.shippingAddress]);

  // Save payment method to localStorage
  useEffect(() => {
    if (state.paymentMethod) {
      localStorage.setItem('paymentMethod', state.paymentMethod);
    }
  }, [state.paymentMethod]);

  const value = {
    cart: state.cart,
    shippingAddress: state.shippingAddress,
    paymentMethod: state.paymentMethod,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    clearCartError,
    resetCart,
    saveShippingAddress,
    savePaymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};