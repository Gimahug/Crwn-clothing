import { createContext, useEffect, useReducer } from "react";
import { createAction } from "../utils/reducer/reducer.utils";
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

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER'
}

//每次userReducer运行是因为调用了dispatch
const userReducer = (state, action) => {
  const { type, payload } = action;

  switch(type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
    return {
      ...state,
      currentUser: payload   //payload就是要更新的对象
    }
    default:
      throw new Error(`unhandled type ${type} in userReducer`);
  }
}

const INITIAL_STATE = {
  currentUser: null
}

//provider组件
export const UserProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(userReducer, INITIAL_STATE);
  const { currentUser } = state;

  const setCurrentUser = (user) => {
    //每次调用dispatch函数，我们传入一个action，然后更新reducer
    dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));  
  }

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