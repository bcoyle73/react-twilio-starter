import React, { PropTypes } from 'react';

const NumberEntry = ({entry}) => (
  <div id="number-entry">
    <input placeholder="+1 (555) 555-5555" onChange={e => entry(e.target.value)}></input>
  </div>
)

NumberEntry.propTypes = {
  entry: React.PropTypes.func.isRequired
}

export default NumberEntry;
