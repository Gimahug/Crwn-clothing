import {initializeApp} from 'firebase/app';
import {
  getAuth, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdFYNqWbG2CbIYB1pbOKMcsUuEl6idjeM",
  authDomain: "crwn-database-cb27b.firebaseapp.com",
  projectId: "crwn-database-cb27b",
  storageBucket: "crwn-database-cb27b.appspot.com",
  messagingSenderId: "384681990876",
  appId: "1:384681990876:web:9709f618597e1bebf97219"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//使用google身份验证
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

//导出验证身份
export const auth = getAuth(); 

//auth是唯一的，它贯穿整个身份证验流程；provider（提供商）可以有很多，比如Google，Facebook

//1、google弹窗
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
//2、google重定向
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

//导出数据库
export const db = getFirestore();

//为数据库创建collection
export const addCollectionAndDocuments = async (
  collectionKey, 
  objectsToAdd,
  field
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');

}

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
}

/**
 * 此方法通过传入验证过的身份来创建用户数据库
 * 
 * 当使用第三方provider验证登录时，userAuth中已经带有displayName，
 * 而使用邮箱密码注册时返回的userAuth不带有dislayName，
 * 所以需要另外增加参数additionalInformation传入dislayName
 * @param {*} additionalInformation 
 * 
 */
export const createUserDocumentFromAuth = async (
  userAuth, 
  additionalInformation = {}
) => {
  if(!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  //用户快照，我们可以用它来获取数据库的信息
  const userSnapshot = await getDoc(userDocRef);

  //如果用户快照指向的数据库不存在doc,那么设置doc
  if(!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createAt,
        ...additionalInformation
      });
    } catch (error) {
      console.log('error creating the user', error.message);
      
    }
  }

  return userDocRef;

};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  //代码保护，如果没有提供email或password就不提供方法，稍后typescript有更好的保护机制
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password)
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

/**
 * 本文件导出的方法其实是对firebase server提供的方法进行了一层包装
 * 这样做的好处是，我们只需在这一个文件中维护我们需要的方法，在其他任何地方都可以随时调用
 * 如果firebase server进行升级修改了一些方法，那么我们只需在本文件进行修改即可
 * 这样做在前端代码和第三方服务器的库之间提供了一层隔离，便于维护和保护我们的代码
 */