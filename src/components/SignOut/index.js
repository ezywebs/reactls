import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <div className="right menu" onClick={firebase.doSignOut}>
    <a className="item">Sign Out</a>
  </div>
);

export default withFirebase(SignOutButton);