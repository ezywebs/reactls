import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';


const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? ( 
          <NavigationAuth authUser={authUser} /> 
        ) : ( 
          <NavigationNonAuth /> 
        )
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = ({ authUser }) => (
  <div className="ui large menu">
    <Link to={ROUTES.HOME} className="item">Home</Link>
    <Link to={ROUTES.ACCOUNT} className="item">Account</Link>
    <Link to={ROUTES.PAY} className="item">Place Order</Link>
    <Link to={ROUTES.HISTORY} className="item">History</Link>
    {authUser.roles.includes(ROLES.ADMIN) && (
      <Link to={ROUTES.ADMIN} className="item">Admin</Link>
    )}
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