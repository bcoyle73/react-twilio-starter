import React, { PropTypes } from 'react';
import Button from '../common/Button';

const SimpleAgentStatusControls = ({ available, status, onRequestChange, warning }) => (
  <div className="clearfix" >
    <div className="clearfix"> { status } </div>
    <div className="clearfix"> { warning } </div>
   <Button onClick={() => onRequestChange("Idle")} classes={["agent-status", "ready"]} buttonText="Ready" disabled={available}/>
   <Button onClick={() => onRequestChange("Offline")} classes={["agent-status", "not-ready"]} buttonText="Not Ready" disabled={!available}/>
  </div>
)

SimpleAgentStatusControls.propTypes = {
  available: PropTypes.bool.isRequired,
  status: PropTypes.string,
  onRequestChange: PropTypes.func.isRequired
}

SimpleAgentStatusControls.defaultProps = {
  available: false,
}


export default SimpleAgentStatusControls;
