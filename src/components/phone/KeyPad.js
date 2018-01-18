import React, { PropTypes } from 'react';

const KeyPad = ({buttonPress}) => {
  let numbers = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        '*', '0', '#']

  return (
    <div className="dialer-container">
      <div className="numpad-container">
        {numbers.map(function(item, i) {
        return (
          <div className="number" onClick={e => buttonPress(item)} key={i} value={item}> {item} </div>
          );
      })}
      </div>
    </div>
  )
}

KeyPad.propTypes = {
  buttonPress: React.PropTypes.func.isRequired
}

export default KeyPad
