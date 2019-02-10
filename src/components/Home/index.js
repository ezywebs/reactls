import React from 'react';

import { withAuthorization } from '../Session';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>
  </div>
);

const condition = authUser => !!authUser;

// const condition = authUser =>
//   authUser && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(condition)(HomePage);