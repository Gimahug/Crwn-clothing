import { Link, Outlet } from "react-router-dom";
import { Fragment, useContext } from "react";
import { ReactComponent as CrwnLogo } from "../../assets/crown.svg";
import { userContext } from "../../contexts/user.context";
import './navigation.styles.scss';
import { signOutUser } from "../../utils/firebase/firebase.utils";

const Navigation = () => {
  const { currentUser } = useContext(userContext);

  const signOutHandler = async () => {
    console.log("click sign out")
    await signOutUser();
  }

  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo-container" to='/'>
          <CrwnLogo className="logo" />
        </Link>
        <div className="nav-links-container">
          <Link className="nav-link" to='/shop'>
            SHOP
          </Link>
          {
            currentUser ? (
              <span className="nav-link" onClick={signOutHandler}>SIGN OUT</span>
            )
            : (
              <Link className="nav-link" to='/auth'>
                SIGN IN
              </Link>
            )
          }
        </div>
      </div>
      <Outlet />
    </Fragment>
  )
}

export default Navigation;