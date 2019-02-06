import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';


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
  //   this.props.firebase.payments().off();
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
  <table className="ui small striped table">
    <thead>
      <tr>
        <th>Payment ID</th>
        <th>Amount</th>
        <th>Description</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
    {payments.map(payment => (
      <tr key={payment.uid}>
        <td>{payment.uid}</td>
        <td>{payment.amount}</td>
        <td>{payment.description ? payment.description : "N/A"}</td>
        <td>{payment.charge ? formatDate(payment.charge.created*1000).toString() : "N/A"}</td>
      </tr>
      ))}
    </tbody>
  </table>
);

const formatDate = (date) => {
  var options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  var d  = new Date(date);
  return d.toLocaleDateString(("en-US"), options);
}

const condition = authUser => !!authUser;

const exH = compose(
  withAuthorization(condition),
  withRouter,
  withFirebase,
)(History);

export default exH;