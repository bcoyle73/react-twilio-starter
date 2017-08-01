import { connect } from 'react-redux'
import {requestStateChange} from '../../actions'
import SimpleAgentStatusControls from './SimpleAgentStatusControls'


const mapStateToProps = (state) => {
  const { taskrouter } = state
  return {
    available: taskrouter.worker.available,
    status: taskrouter.worker.activityName,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRequestAccept: (reservation) => {
      dispatch(requestAcceptReservation(reservation))
    },
    onRequestDecline: (reservation) => {
      dispatch(requestDeclineReservation(reservation))
    }
  }
}


const SimpleAgentStatusControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleAgentStatusControls)

export default SimpleAgentStatusControlsContainer
