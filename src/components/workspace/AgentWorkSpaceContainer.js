import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { requestWorker } from '../../actions'
import { initializeWorkers } from '../../actions'
import { requestSyncClient } from '../../actions'
import { initializeSyncMap } from '../../actions'

import AgentWorkSpace from './AgentWorkSpace'


class AgentWorkSpaceContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // When this top level component loads get the worker sid from the URL
    const { dispatch } = this.props
    var url = new URL(window.location.href)
    dispatch(requestWorker(url.searchParams.get("worker")))
    dispatch(initializeWorkers(url.searchParams.get("worker")))
  }

  componentWillUnmount() {
    console.log("UNMOUNTING")
  }


  render() {
    const { channels, workers, workersAvailable, participant, error, errorMessage } = this.props
    let current = "default"

    return (
    	<AgentWorkSpace channels={channels} workers={workers} workersAvailable={workersAvailable} currInteraction={current} participant={participant} error={error} errorMessage={errorMessage}/>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('state.sync.workers =>', state.sync.workers.filter(worker => worker.available).length.toString())
  return {
    channels: state.taskrouter.channels,
    participant: state.chat.videoParticipant,
    error: state.taskrouter.error,
    errorMessage: state.taskrouter.errorMessage,
    workers: state.sync.workers,
    workersAvailable: state.sync.workers.filter(worker => worker.available).length.toString()
  }
}


export default connect(mapStateToProps)(AgentWorkSpaceContainer)
