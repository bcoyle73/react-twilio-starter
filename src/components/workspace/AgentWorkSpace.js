import React, { PropTypes } from 'react'
import SimpleAgentStatusControlsContainer from '../taskrouter/SimpleAgentStatusControlsContainer';
import MessengerContainer from '../messages/MessengerContainer';
import PhoneContainer from '../phone/PhoneContainer'
import QueueStats from '../taskrouter/QueueStats';
//import VideoDisplay from '../video/Video'
//import VideoPlayer from '../video/VideoPlayer'

const AgentWorkSpace = ({channels = [], workers = [], workersAvailable, currInteraction, participant = {}, error, errorMessage }) => {
  let component = null

  switch (currInteraction) {
    case 'video':
      component = <VideoPlayer key={1} participant={participant} />
      break;
    case 'voice':
      component = <PhoneContainer key={1} />
      break
    case 'chat':
      component = <MessengerContainer key={1} />
      break
    default:
      component = <PhoneContainer key={1} />
  }
  if (error) {
    return <h1>Something went wrong. {errorMessage}.</h1>
  }
  return (
    <div id="softphone" className="softphone">
      <SimpleAgentStatusControlsContainer />
      <div className="divider"> </div>
      {component}
      <QueueStats workersAvailable={workersAvailable}/>
    </div>
  )
}

AgentWorkSpace.propTypes = {

}

export default AgentWorkSpace
