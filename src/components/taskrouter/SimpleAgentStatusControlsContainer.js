import { connect } from 'react-redux'
import {requestStateChange} from '../../actions'
import SimpleAgentStatusControls from './SimpleAgentStatusControls'


const mapStateToProps = (state) => {
  const { taskrouter, phone } = state
  return {
    available: taskrouter.worker.available,
    status: taskrouter.worker.activityName,
    warning: phone.warning
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRequestChange: (newStateName) => {
      dispatch(requestStateChange(newStateName))
    }
  }
}


const SimpleAgentStatusControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleAgentStatusControls)

export default SimpleAgentStatusControlsContainer
