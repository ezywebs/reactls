import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div className="ui large menu">
    <Link to={ROUTES.HOME} className="item">Home</Link>
    <Link to={ROUTES.LANDING} className="item">Landing</Link>
    <Link to={ROUTES.ACCOUNT} className="item">Account</Link>
    <Link to={ROUTES.ADMIN} className="item">Admin</Link>
    <Link to={ROUTES.PAY} className="item">Pay</Link>
    <Link to={ROUTES.HISTORY} className="item">History</Link>
    <SignOutButton />
  </div>
);

const NavigationNonAuth = () => (
  <div className="ui large menu">
    <Link to={ROUTES.SIGN_IN} className="active item">Sign In</Link>
    <div className="right menu">
        <Link to={ROUTES.SIGN_UP} className="item">Sign Up</Link>
    </div>
  </div>
);

export default Navigation;