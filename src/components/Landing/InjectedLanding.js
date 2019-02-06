import React from 'react';
import Loading from '../Loading';
import {injectStripe} from 'react-stripe-elements';
// import './index.css';
import CardSection from '../CardSection';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  loading: false,
  plan: "2",
  fail: false
};

class InjectedLanding extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.selectCard = this.selectCard.bind(this);
    console.log(props);
  }
  
  onSubmit = event => {
    event.preventDefault();
    this.setState({loading: true});
    const { email, passwordOne } = this.state;
    const {firebase, history} = this.props.data;
    console.log("in submit");
    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        firebase
          .user(authUser.user.uid)
          .set({
            email,
          });
          this.setState({fail: false});
          
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

          console.log("bafore stripe");
          this.props.stripe.createToken({email: this.state.email}).then(({token}) => {
            console.log('Received Stripe token:', token);
            // this.setState({loading: false});
            const uid = authUser.user.uid;
            console.log('UID:', uid);
            firebase.payment(uid).push({token, amount, description})
                                .then((snap) => {
                                    const key = snap.key;
                                    console.log("key="+key);
                                    firebase.payment(`${uid}/${key}/charge/captured`).on('value', snap => {
                                        if (snap.val()) {
                                            history.push(ROUTES.HISTORY);
                                            // this.setState({
                                            //     // stripeLoading: false,
                                            //     loading: false,
                                            //     ...INITIAL_STATE,
                                            // });
                                        }
                                    });
                                });
          })
          .catch(err => {
            this.setState({
              fail: true, 
              loading: false,
            });
          });
      })
      // .then(() => {
      //   console.log("mid step");
      // })
      // .then(() => {
      //   console.log("after user created:" + this.props);
          
      //   this.setState({ ...INITIAL_STATE });
      //   this.props.history.push(ROUTES.HOME);
      // })
      .catch(error => {
        console.log("error creating user:"+error)
        this.setState({
          fail: true, 
          loading: false,
          // error: error,
          email: '',
          passwordOne: '',
          passwordTwo: ''
        });
      });
  }
  
  // handleSubmit = (ev) => {
  //   this.setState({fail: false});
  //   const {firebase, history} = this.props.data;
  //   // We don't want to let default form submission happen here, which would refresh the page.
  //   ev.preventDefault();
  //   this.setState({loading: true});
  //   let amount = "0";
  //   let description = "";
  //   switch(this.state.plan) {
  //   case "1":
  //     amount="100000";description="SEO Silver Plan";break;
  //   case "2":
  //     amount="250000";description="SEO Gold Plan";break;
  //   case "3":
  //     amount="500000";description="SEO Platinum Plan";
  //   }
  //   // Within the context of `Elements`, this call to createToken knows which Element to
  //   // tokenize, since there's only one in this group.
  //   this.props.stripe.createToken({email: firebase.auth.currentUser.email}).then(({token}) => {
  //     console.log('Received Stripe token:', token);
  //     this.setState({loading: false});
  //     const uid = firebase.auth.currentUser.uid;
  //     firebase.payment(uid).push({token, amount, description})
  //                         .then((snap) => {
  //                             const key = snap.key;
  //                             firebase.payment(`${uid}/${key}/charge/captured`).on('value', snap => {
  //                                 if (snap.val()) {
  //                                     this.setState({
  //                                         stripeLoading: false,
  //                                         loading: false
  //                                     });
  //                                     history.push(ROUTES.HISTORY);
  //                                 }
  //                             });
  //                         });
  //   })
  //   .catch(err => {
  //     this.setState({fail: true});
  //   });
  // };
  
  selectCard = (e) => {
    this.setState({plan: e.currentTarget.dataset.id});
  }
  
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '';
    const btnClass = "ui primary button " + (this.state.loading ? "loading" : "");
    return (
      <div>
        {this.state.fail ? error : ""}
        <form onSubmit={this.onSubmit} className={this.state.loading ? "ui form loading" : "ui form fluid segment"}>
          <div className="field">
            <label>Email</label>
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <h2 className="ui header center aligned">Place Order</h2>
          <h4 className="ui horizontal divider header">
            <i className="tasks icon"></i>
            Select Your Plan
          </h4>
          <div className="ui three cards">
            <div className={this.state.plan === "1" ? "ui card selected" : "ui card"} onClick={this.selectCard} name="silver" data-id="1">
              <div className="content">
                <div className="center aligned description">
                  <img src={require('../../assets/img.png')} />
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
                  <img src={require('../../assets/img.png')} />
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
                  <img src={require('../../assets/img.png')} />
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
          <button className={btnClass} disabled={isInvalid}>Complete Registration & Pay</button>
          {error && <p>{error.message}</p>}
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


export default injectStripe(InjectedLanding);