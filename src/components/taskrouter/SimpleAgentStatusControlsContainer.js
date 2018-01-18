import { connect } from 'react-redux'
import {requestStateChange, requestTaskComplete} from '../../actions'
import SimpleAgentStatusControls from './SimpleAgentStatusControls'


const mapStateToProps = (state) => {
  const { taskrouter, phone } = state
  return {
    available: taskrouter.worker.available,
    status: taskrouter.worker.activityName,
    tasks: taskrouter.tasks,
    warning: phone.warning
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRequestChange: (newStateName) => {
      dispatch(requestStateChange(newStateName))
    },
    onRequestComplete: (task) => {
      dispatch(requestTaskComplete(task))
    }

  }
}


const SimpleAgentStatusControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleAgentStatusControls)

export default SimpleAgentStatusControlsContainer
