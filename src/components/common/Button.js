'use strict';

import React from 'react';

class Button extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick();
  }


  render() {
  	var classes = this.props.classes.join(" ");
    return (
    	 <button onClick={this.onClick.bind(this)} disabled={this.props.disabled} className={classes}>{this.props.buttonText}</button>
    );
  }
}

Button.propTypes = {
  buttonText: React.PropTypes.string.isRequired,
  classes: React.PropTypes.array,
  disabled: React.PropTypes.bool
}
Button.defaultProps = {
  disabled: false
}

export default Button;
