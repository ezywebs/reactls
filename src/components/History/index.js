import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';


class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      payments: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.payment(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      const paymentsObject = snapshot.val();

      const paymentsList = Object.keys(paymentsObject).map(key => ({
        ...paymentsObject[key],
        uid: key,
      }));

      this.setState({
        payments: paymentsList,
        loading: false,
      });
    });
  }
  
  // componentWillUnmount() {
  //   this.props.firebase.users().off();
  // }

  render() {
    const { payments, loading } = this.state;
    return (
      <div>
        <h1>History</h1>
        {loading && <div>Loading ...</div>}
        <PaymentsList payments={payments} />
      </div>
    );
  }
}

const PaymentsList = ({ payments }) => (
  <ul>
    {payments.map(payment => (
      <li key={payment.uid}>
        <span>
          <strong>Payment ID:</strong> {payment.uid}
        </span>
        <span>
          <strong>Amount:</strong> {payment.amount}
        </span>
        <span>
          <strong>Description:</strong> {payment.description ? payment.description : "N/A"}
        </span>
        <span>
           <strong>Date Created:</strong> {payment.charge ? payment.charge.created : "N/A"}
        </span>
      </li>
    ))}
  </ul>
);

export default withFirebase(History);

// const exH = compose(
//   withRouter,
//   withFirebase,
// )(History);

// export default exH;


        // <span>
        //   <strong>Date Created:</strong> {payment.charge ? new Date(payment.charge.created*1000) : "N/A"}
        // </span>
