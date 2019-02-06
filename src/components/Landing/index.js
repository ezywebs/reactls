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
    <h1>Landing</h1>
    <LandingSignUpForm />
  </div>
);

// const INITIAL_STATE = {
//   email: '',
//   passwordOne: '',
//   passwordTwo: '',
//   error: null,
// };

class LandingSignUpFormBase extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    // this.state = { ...INITIAL_STATE };
  }

  // onSubmit = event => {
  //   const { email, passwordOne } = this.state;

  //   this.props.firebase
  //     .doCreateUserWithEmailAndPassword(email, passwordOne)
  //     .then(authUser => {
  //       return this.props.firebase
  //         .user(authUser.user.uid)
  //         .set({
  //           email,
  //         });
  //     })
  //     .then(() => {
  //       this.setState({ ...INITIAL_STATE });
  //       this.props.history.push(ROUTES.HOME);
  //     })
  //     .catch(error => {
  //       this.setState({ error });
  //     });

  //   event.preventDefault();
  // }

  // onChange = event => {
  //   this.setState({ [event.target.name]: event.target.value });
  // };

  render() {
    // const {
    //   email,
    //   passwordOne,
    //   passwordTwo,
    //   error,
    // } = this.state;
    
    // const isInvalid =
    //   passwordOne !== passwordTwo ||
    //   passwordOne === '' ||
    //   email === '';

    return (
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
        <Elements>
          <InjectedLanding data={this.props} />
        </Elements>
      </StripeProvider>
    );
  }
}

const LandingSignUpForm = compose(
  withRouter,
  withFirebase,
)(LandingSignUpFormBase);

export default Landing;

// export { xLanding };



      // <form onSubmit={this.onSubmit} className="ui form">
      //   <div className="field">
      //     <label>Email</label>
      //     <input
      //       name="email"
      //       value={email}
      //       onChange={this.onChange}
      //       type="text"
      //       placeholder="Email Address"
      //     />
      //   </div>
      //   <div className="field">
      //     <label>Password</label>
      //     <input
      //       name="passwordOne"
      //       value={passwordOne}
      //       onChange={this.onChange}
      //       type="password"
      //       placeholder="Password"
      //     />
      //   </div>
      //   <div className="field">
      //     <label>Confirm Password</label>
      //     <input
      //       name="passwordTwo"
      //       value={passwordTwo}
      //       onChange={this.onChange}
      //       type="password"
      //       placeholder="Confirm Password"
      //     />
      //   </div>
      //   <button disabled={isInvalid} type="submit" className="ui button">
      //     Sign Up
      //   </button>
      //   {error && <p>{error.message}</p>}
      // </form>