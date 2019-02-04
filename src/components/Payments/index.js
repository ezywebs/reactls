import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class Payments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stripeLoading: true,
        };
        this.onStripeUpdate = this.onStripeUpdate.bind(this);
        this.loadStripe = this.loadStripe.bind(this);
    }

    loadStripe(onload) {
        if(! window.StripeCheckout) {
            const script = document.createElement('script');
            script.onload = function () {
                onload();
            };
            script.src = 'https://checkout.stripe.com/checkout.js';
            document.head.appendChild(script);
        } else {
            onload();
        }
    }

    componentDidMount() {
        this.loadStripe(() => {
            
            this.stripehandler = window.StripeCheckout.configure({
                key: process.env.REACT_APP_STRIPE_KEY,
                image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                locale: 'auto',
                token: token => {
                    this.setState({ loading: true });
                    const uid = this.props.firebase.auth.currentUser.uid;
                    // return this.props.firebase.payment(this.props.firebase.auth.currentUser.uid).push({token, amount: 500});
                    let pmnt = this.props.firebase.payment(uid).push({token, amount: 500})
                                                                .then((snap) => {
                                                                    const key = snap.key;
                                                                    console.log(key);
                                                                    this.props.firebase.payment(`${uid}/${key}/charge/captured`).on('value', snap => {
                                                                        console.log("captred");
                                                                        console.log(snap.val());
                                                                        if (snap.val()) {
                                                                            console.log("updating states");
                                                                            this.setState({
                                                                                stripeLoading: false,
                                                                                loading: false
                                                                            });
                                                                        }
                                                                    });
                                                                });
                }
            });
            this.setState({
                stripeLoading: false,
                loading: false
            });
        });
    }

    componentWillUnmount() {
        if(this.stripehandler) {
            this.stripehandler.close();
        }
    }

    onStripeUpdate(e) {
        this.stripehandler.open({
            name: 'test',
            description: 'widget',
            panelLabel: 'Update Credit Card',
            allowRememberMe: false,
        });
        e.preventDefault();
    }

    render() {
        const { stripeLoading, loading } = this.state;
        return (
            <div>
                {(loading || stripeLoading)
                    ? <p>loading...</p>
                    : <button onClick={this.onStripeUpdate}>Add CC</button>
                }
            </div>
        );
    }
}



const exPayments = compose(
  withRouter,
  withFirebase,
)(Payments);

export default exPayments;