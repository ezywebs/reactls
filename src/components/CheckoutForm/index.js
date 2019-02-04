// CheckoutForm.js
import React from 'react';
import Loading from '../Loading';
import {injectStripe} from 'react-stripe-elements';
import './index.css';


import CardSection from '../CardSection';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      plan: "2",
    }
    this.selectCard = this.selectCard.bind(this);
  }
  
  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();
    this.setState({loading: true});
    let amount = "0";
    switch(this.state.plan) {
    case "1":
      amount="100000";break;
    case "2":
      amount="250000";break;
    case "3":
      amount="500000";
    }
    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({email: this.props.firebase.auth.currentUser.email}).then(({token}) => {
      console.log('Received Stripe token:', token);
      this.setState({loading: false});
      const uid = this.props.firebase.auth.currentUser.uid;
      this.props.firebase.payment(uid).push({token, amount})
                                      .then((snap) => {
                                          const key = snap.key;
                                          this.props.firebase.payment(`${uid}/${key}/charge/captured`).on('value', snap => {
                                              if (snap.val()) {
                                                  this.setState({
                                                      stripeLoading: false,
                                                      loading: false
                                                  });
                                              }
                                          });
                                      });
    });

    // However, this line of code will do the same thing:
    //
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // this.props.stripe.createSource({type: 'card', owner: {
    //   name: 'Jenny Rosen'
    // }});
  };
  
  selectCard = (e) => {
    this.setState({plan: e.currentTarget.dataset.id});
  }

  render() {
    const btnClass = "ui primary button " + (this.state.loading ? "loading" : "");
    return (
      <form onSubmit={this.handleSubmit} className={this.state.loading ? "ui form loading" : "ui form"}>
        <br/>
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
    );
  }
}

export default injectStripe(CheckoutForm);