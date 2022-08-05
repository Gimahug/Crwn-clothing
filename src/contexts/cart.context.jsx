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

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  //我们不想直接提供set方法改变cartItems，而是另外提供一个方法
  addItemToCart: () => {},
  cartCount: 0
});

export const CartProvider = ({children}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const newCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0)
    setCartCount(newCartCount);
  }, [cartItems])

  const addItemToCart = (productToAdd) => {
    setCartItems(addCartItem(cartItems, productToAdd));
  }

  const value = { isCartOpen, setIsCartOpen, cartItems, addItemToCart, cartCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}