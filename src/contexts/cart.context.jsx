import { createContext, useEffect, useState } from "react";

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

export const CartProvider = ({children}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);


  useEffect(() => {
    const newCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0)
    setCartCount(newCartCount);
  }, [cartItems])

  useEffect(() => {
    const newCartTotal = cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0)
    setCartTotal(newCartTotal);
  }, [cartItems])

  const addItemToCart = (productToAdd) => {
    setCartItems(addCartItem(cartItems, productToAdd));
  }

  const removeItemToCart = (cartItemToRemove) => {
    setCartItems(removeCarItem(cartItems, cartItemToRemove));
  }
  const clearItemFromCart = (cartItemToClear) => {
    setCartItems(clearCarItem(cartItems, cartItemToClear));
  }

  const value = { isCartOpen, setIsCartOpen, cartItems, addItemToCart, cartCount, removeItemToCart, clearItemFromCart, cartTotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}