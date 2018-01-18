import React, { PropTypes } from 'react';

const ReservationControls = ({ onRequestAccept, onRequestDecline}) => (
  <div className="clearfix" >
   <Button onClick={() => onRequestAccept()} classes={["agent-status", "ready"]} buttonText="Accept" disabled={available}/>
   <Button onClick={() => onRequestDecline()} classes={["agent-status", "not-ready"]} buttonText="Reject" disabled={!available}/>
  </div>
)

ReservationControls.propTypes = {

}


export default ReservationControls;
