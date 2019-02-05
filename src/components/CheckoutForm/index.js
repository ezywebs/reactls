import React from 'react';
import Loading from '../Loading';
import {injectStripe} from 'react-stripe-elements';
import './index.css';
import CardSection from '../CardSection';
import * as ROUTES from '../../constants/routes';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      plan: "2",
      fail: false
    }
    this.selectCard = this.selectCard.bind(this);
  }
  
  handleSubmit = (ev) => {
    this.setState({fail: false});
    const {firebase, history} = this.props.data;
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();
    this.setState({loading: true});
    let amount = "0";
    let description = "";
    switch(this.state.plan) {
    case "1":
      amount="100000";description="SEO Silver Plan";break;
    case "2":
      amount="250000";description="SEO Gold Plan";break;
    case "3":
      amount="500000";description="SEO Platinum Plan";
    }
    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({email: firebase.auth.currentUser.email}).then(({token}) => {
      console.log('Received Stripe token:', token);
      this.setState({loading: false});
      const uid = firebase.auth.currentUser.uid;
      firebase.payment(uid).push({token, amount, description})
                          .then((snap) => {
                              const key = snap.key;
                              firebase.payment(`${uid}/${key}/charge/captured`).on('value', snap => {
                                  if (snap.val()) {
                                      this.setState({
                                          stripeLoading: false,
                                          loading: false
                                      });
                                      history.push(ROUTES.HISTORY);
                                  }
                              });
                          });
    })
    .catch(err => {
      this.setState({fail: true});
    });
  };
  
  selectCard = (e) => {
    this.setState({plan: e.currentTarget.dataset.id});
  }

  render() {
    const btnClass = "ui primary button " + (this.state.loading ? "loading" : "");
    return (
      <div>
        {this.state.fail ? error : ""}
        <form onSubmit={this.handleSubmit} className={this.state.loading ? "ui form loading" : "ui form fluid segment"}>
          <h2 className="ui header center aligned">Place Order</h2>
          <h4 className="ui horizontal divider header">
            <i className="tasks icon"></i>
            Select Your Plan
          </h4>
          <div className="ui three cards">
            <div className={this.state.plan === "1" ? "ui card selected" : "ui card"} onClick={this.selectCard} name="silver" data-id="1">
              <div className="content">
                <div className="center aligned description">
                  <img src={require('../../assets/silver.png')} />
                </div>
              </div>
              <div className="extra content">
                <div className="center aligned author">
                  Silver Plan<br/>
                  <span>
                    <i className="dollar icon"></i>1000
                  </span>
                </div>
              </div>
            </div>
            <div className={this.state.plan === "2" ? "ui card selected" : "ui card"} onClick={this.selectCard} name="gold" data-id="2">
              <div className="content">
                <div className="center aligned description">
                  <img src={require('../../assets/gold.png')} />
                </div>
              </div>
              <div className="extra content">
                <div className="center aligned author">
                  Gold Plan<br/>
                  <span>
                    <i className="dollar icon"></i>2500
                  </span>
                </div>
              </div>
            </div>
            <div className={this.state.plan === "3" ? "ui card selected" : "ui card"} onClick={this.selectCard} name="platinum" data-id="3">
              <div className="content">
                <div className="center aligned description">
                  <img src={require('../../assets/platinum.png')} />
                </div>
              </div>
              <div className="extra content">
                <div className="center aligned author">
                  Platinum Plan<br/>
                  <span>
                    <i className="dollar icon"></i>5000
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h4 className="ui horizontal divider header">
            <i className="credit card outline icon"></i>
            Enter Card Details
          </h4>
          <div className="field">
            <CardSection />
          </div>
          <button className={btnClass}>Pay</button>
        </form>
      </div>
    );
  }
}

const error = (
  <div class="ui negative message">
    <div class="header">
      Error processing payment!
    </div>
    <p>Please verify card info and try again</p>
  </div>
);


export default injectStripe(CheckoutForm);