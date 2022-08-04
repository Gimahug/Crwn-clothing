import { useState, createContext, useEffect } from "react";
import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";

/**
 * context包括两个部分：
 * 实际存储的值(其他组件实际要访问的东西)
 * provider组件
 */

//actual value you want to access
export const userContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

//provider组件
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  //context的value属性包括两个部分，state值以及set state方法
  const value = { currentUser, setCurrentUser};

  useEffect(() => {
    //firebase给我们提供了用户状态监听器，只需在这里统一管理状态。
    // 这个方法返回的是注销监听方法，当UserProvider卸载时注销即可
    const unsubscribe = onAuthStateChangedListener((user) => {
      if(user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    })
    return unsubscribe;
  }, [])

  //被context.provider组件包裹的所有组件都可以访问context的值，即可以get value或set value
  return <userContext.Provider value={value}>{children}</userContext.Provider>

}