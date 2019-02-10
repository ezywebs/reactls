import React from 'react';
import Loading from '../Loading';
import {injectStripe} from 'react-stripe-elements';
import './InjectedLanding.css';
import CardSection from '../CardSection';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  loading: false,
  plan: '2',
  isAdmin: false,
  fail: false,
};

class InjectedLanding extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.selectCard = this.selectCard.bind(this);
  }
  
  onSubmit = event => {
    event.preventDefault();
    this.setState({loading: true});
    const { email, passwordOne, isAdmin } = this.state;
    const roles = [];
    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }
    const {firebase, history} = this.props.data;
    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        firebase
          .user(authUser.user.uid)
          .set({
            email,
            roles,
          });
          this.setState({fail: false});
          
          let amount = '0';
          let description = "";
          switch(this.state.plan) {
            case "1":
              amount="100000";description="SEO Silver Plan";break;
            case "2":
              amount="250000";description="SEO Gold Plan";break;
            case "3":
              amount="500000";description="SEO Platinum Plan";
          }

          this.props.stripe.createToken({email: this.state.email}).then(({token}) => {
            const uid = authUser.user.uid;
            console.log('UID:', uid);
            firebase.payment(uid).push({token, amount, description})
                                .then((snap) => {
                                    const key = snap.key;
                                    firebase.payment(`${uid}/${key}/charge/captured`).on('value', snap => {
                                        if (snap.val()) {
                                          history.push(ROUTES.HISTORY);
                                        }
                                    });
                                });
          })
          .catch(err => {
            this.setState({
              fail: true, 
              loading: false,
            });
            history.push(ROUTES.PAY);
          });
      })
      .catch(error => {
        this.setState({
          fail: true, 
          loading: false,
          email: '',
          passwordOne: '',
          passwordTwo: ''
        });
      });
  }
  
  selectCard = (e) => {
    this.setState({plan: e.currentTarget.dataset.id});
  }
  
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  
  // componentDidMount = () => {
  //   console.log("auth" + this.props.data.firebase.auth);
  //   console.log("cUser" + this.props.data.firebase.auth.currentUser);
  //   if (this.props.data.firebase.auth && this.props.data.firebase.auth.currentUser) {
  //     console.log("redirect to pay");
  //     this.props.history.push(ROUTES.PAY);
  //   }
  // }

  render() {
    const {
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state;
    const notEqualPasswords =  passwordOne !== passwordTwo && passwordOne !== '' && passwordTwo !== '';
    const invalidEmail = testEmail(email) && email !== '';
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' || invalidEmail;
    const btnClass = "ui primary button " + (this.state.loading ? "loading" : "");
    return (
      <div>
        {this.state.fail ? error : ""}
        <form onSubmit={this.onSubmit} className={this.state.loading ? "ui form loading" : "ui form fluid attached segment"}>
          <h4 className="ui horizontal divider header" style={{marginTop: '25px'}}>
            <i className="user plus icon"></i>
            Step 1: Create account
          </h4>
          <div className={invalidEmail ? "field error" : "field"}>
            <label>Email</label>
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
          </div>
          <div className={notEqualPasswords ? "field error" : "field"}>
            <label>Password</label>
            <input
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className={notEqualPasswords ? "field error" : "field"}>
            <label>Confirm Password</label>
            <input
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <h4 className="ui horizontal divider header">
            <i className="tasks icon"></i>
            Step 2: Select Your Plan
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
            Step 3: Enter Card Details
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

const testEmail = (str) => {
  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return !re.test(str) ;
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