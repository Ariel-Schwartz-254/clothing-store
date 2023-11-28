import { createContext, useReducer } from "react";

import { createAction } from "../utils/reducer/reducer.utils";

const addCartItem = (cartItems, productToAdd) => {
  const existingItem = cartItems.find(
    cartItem => cartItem.id === productToAdd.id
  );
  
  if (existingItem) {
    return cartItems.map(cartItem => 
      cartItem.id === productToAdd.id 
        ? {...cartItem, quantity: cartItem.quantity + 1}
        : cartItem
    );
  } else {
    return [...cartItems, {...productToAdd, quantity: 1}]
  }
}

const removeCartItem = (cartItems, productToRemove) => {
  if (productToRemove.quantity > 1) {
    return cartItems.map(cartItem =>
      cartItem.id === productToRemove.id 
      ? {...cartItem, quantity: cartItem.quantity - 1}
      : cartItem
    );
  } else {
    return cartItems.filter(cartItem => cartItem.id !== productToRemove.id);
  }
}

const clearCartItem = (cartItems, productToClear) => {
  return cartItems.filter(cartItem => cartItem.id !== productToClear.id);
}

export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartItems: [],
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
    cartCount: 0,
    cartTotal: 0
  });

export const CART_ACTION_TYPES = {
  SET_IS_CART_OPEN: 'SET_IS_CART_OPEN',
  SET_CART_ITEM: 'SET_CAERT_ITEM'
}

const cartReducer = (state, action) => {
  const { type, payload } = action;
  
  switch(type) {
    case CART_ACTION_TYPES.SET_CART_ITEM:
      return {
        ...state,
        ...payload
      }
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return {
        ...state,
        isCartOpen: payload
      }
    default:
      throw new Error(`Unhandled type: ${type}`);
  }
}

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0
};


export const CartProvider = ({children}) => {

    const [{cartItems, isCartOpen, cartCount, cartTotal}, dispatch] = useReducer(cartReducer, INITIAL_STATE);

    const updateCartItemsReducer = (newCartItems) => {
      const newCartCount = newCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
      const newCartTotal = newCartItems.reduce((totalCost, cartItem) => totalCost + cartItem.quantity * cartItem.price, 0);
      dispatch(
        createAction(CART_ACTION_TYPES.SET_CART_ITEM, {
          cartItems: newCartItems, 
          cartCount: newCartCount,          
          cartTotal: newCartTotal
        })
      );
    }

    const addItemToCart = (productToAdd) => {
        const newCartItems = addCartItem(cartItems, productToAdd);
        updateCartItemsReducer(newCartItems);
    }

    const removeItemFromCart = (cartItemToRemove) => {
        const newCartItems = removeCartItem(cartItems, cartItemToRemove);
        updateCartItemsReducer(newCartItems);
    }

    const clearItemFromCart = (cartItemToClear) => {
      const newCartItems = clearCartItem(cartItems, cartItemToClear);
      updateCartItemsReducer(newCartItems);
    }
    
    const setIsCartOpen = (bool) => {
      dispatch(createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool))
    }

    const value = { isCartOpen, setIsCartOpen, addItemToCart, removeItemFromCart, clearItemFromCart, cartItems, cartCount, cartTotal};

    return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
    )   
}