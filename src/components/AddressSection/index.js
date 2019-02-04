// CardSection.js
import React from 'react';
import {AddressElement} from 'react-stripe-elements';

class AddressSection extends React.Component {
  render() {
    return (
      <label>
        Card details
        <AddressElement style={{base: {fontSize: '18px'}}} />
      </label>
    );
  }
}

export default AddressSection;