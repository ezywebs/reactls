import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <div className="ui large menu">
    <Link to={ROUTES.SIGN_IN} className="active item">Home</Link>
    <Link to={ROUTES.LANDING} className="item">Landing</Link>
    <Link to={ROUTES.HOME} className="item">Home</Link>
    <Link to={ROUTES.ACCOUNT} className="item">Account</Link>
    <Link to={ROUTES.ADMIN} className="item">Admin</Link>
    <div className="right menu">
        <Link to={ROUTES.SIGN_UP} className="item">Sign Up</Link>
    </div>
  </div>
);

export default Navigation;