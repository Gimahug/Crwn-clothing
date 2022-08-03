import {initializeApp} from 'firebase/app';
import {
  getAuth, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider,
  ProviderId
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
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
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

//导出验证身份
export const auth = getAuth(); 
//导出登录弹窗，需要auth和provider两个参数。（auth是唯一的，provider可以有很多
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);


//导出数据库
export const db = getFirestore();


//创建user doc reference
export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, 'users', userAuth.uid);

  //用户快照，我们可以用它来获取数据库的信息
  const userSnapshot = await getDoc(userDocRef);

  //如果用户快照指向的数据库不存在doc,那么设置doc
  if(!userSnapshot.exists()) {
    const {displayName, email} = userAuth;
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createAt
      });
    } catch (error) {
      console.log('error creating the user', error.message);
      
    }
  }

  return userDocRef;

}