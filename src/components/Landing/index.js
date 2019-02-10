import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import {StripeProvider} from 'react-stripe-elements';
import {Elements} from 'react-stripe-elements';
import InjectedLanding from './InjectedLanding.js';
import { withAuthorization } from '../Session';

const Landing = () => (
  <div>
    <Link to={ROUTES.SIGN_IN}>
      <div className="ui animated fade button right floated teal" tabIndex="0">
        <div className="visible content">Already customer?</div>
        <div className="hidden content">
          Sign in <i className="sign in alternate icon"></i>
        </div>
      </div>
    </Link>
    <LandingSignUpForm />
  </div>
);

class LandingSignUpFormBase extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
        <Elements>
          <InjectedLanding data={this.props} />
        </Elements>
      </StripeProvider>
    );
  }
}

// const LandingSignUpForm = compose(
//   withRouter,
//   withFirebase,
// )(LandingSignUpFormBase);

// export default Landing;


const condition = authUser => !authUser

const LandingSignUpForm = compose(
  withAuthorization(condition),
  withFirebase,
)(LandingSignUpFormBase);

export default Landing;