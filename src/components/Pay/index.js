import React, { Component } from 'react';
import {StripeProvider} from 'react-stripe-elements';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import {Elements} from 'react-stripe-elements';
import InjectedCheckoutForm from '../CheckoutForm';
import { withAuthorization } from '../Session';

class Pay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
          <Elements>
            <InjectedCheckoutForm data={this.props} />
          </Elements>
        </StripeProvider>
      );
    }
}


const condition = authUser => !!authUser;

const exPay = compose(
  withAuthorization(condition),
  withRouter,
  withFirebase,
)(Pay);

export default exPay;