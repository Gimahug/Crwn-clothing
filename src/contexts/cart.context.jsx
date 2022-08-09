import { createContext, useReducer } from "react";
import { createAction } from "../utils/reducer/reducer.utils";

const addCartItem = (cartItems, productToAdd) => {
  //检查要增加的商品是否已经在购物车里
  const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToAdd.id);

  //如果有，修改商品数量
  if (existingCartItem) {
    return cartItems.map((cartItem) => cartItem.id === productToAdd.id 
      ? { ...cartItem, quantity: cartItem.quantity + 1 }
      : cartItem
    );
  }
  //如果没有，新增商品
  return [ ...cartItems, { ...productToAdd, quantity: 1 }];
}

const removeCarItem = (cartItems, cartItemToRemove) => {
  //找到要减少的商品
  const existingCartItem = cartItems.find((cartItem) => cartItem.id === cartItemToRemove.id);

  //如果数量为1，从购物车中删除该商品
  if (existingCartItem.quantity === 1) {
    console.log("count 1")
    return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id);
  }
  //否则数量减1
  return cartItems.map((cartItem) => 
    cartItem.id === cartItemToRemove.id 
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
}

const clearCarItem = (cartItems, cartItemToClear) => {

  return cartItems.filter(cartItem => cartItem.id !== cartItemToClear.id);
  

}

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  removeItemToCart: ()=> {},
  clearItemFromCart: () => {},
  cartCount: 0,
  cartTotal: 0
});

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0
}

const CART_ACTION_TYPES = {
  SET_CART_ITEMS: 'SET_CART_ITEMS',
  SET_IS_CART_OPEN: 'SET_IS_CART_OPEN'
};

//reducer应该关心的只是（用payload）更新状态，而不是考虑更新的细节（怎样更新）
export const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch(type) {
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return {
        ...state,
        ...payload
      };
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return {
        ...state,
        isCartOpen: payload
      }
    default:
      throw new Error(`unhandled type of ${type} in cartReducer`);
  }
}

export const CartProvider = ({children}) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);
  const { cartItems, cartCount, cartTotal, isCartOpen } = state;

  const updateCartItemsReducer = (newCartItems) => {
    const newCartCount = newCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    const newCartTotal = newCartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);
    dispatch(createAction(CART_ACTION_TYPES.SET_CART_ITEMS, {
      cartItems: newCartItems,
      cartCount: newCartCount,
      cartTotal: newCartTotal
    }));
  }

  const addItemToCart = (productToAdd) => {
    const newCartItems = addCartItem(cartItems, productToAdd);
    updateCartItemsReducer(newCartItems)
  }

  const removeItemToCart = (cartItemToRemove) => {
    const newCartItems = removeCarItem(cartItems, cartItemToRemove);
    updateCartItemsReducer(newCartItems)

  }
  const clearItemFromCart = (cartItemToClear) => {
    const newCartItems = clearCarItem(cartItems, cartItemToClear);
    updateCartItemsReducer(newCartItems)
  }

  const setIsCartOpen = (bool) => {
    dispatch(createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool));
  }

  const value = { isCartOpen, setIsCartOpen, cartItems, addItemToCart, cartCount, removeItemToCart, clearItemFromCart, cartTotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}