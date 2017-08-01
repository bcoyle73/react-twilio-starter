import React, { PropTypes } from 'react'
import SimpleAgentStatusControlsContainer from '../taskrouter/SimpleAgentStatusControlsContainer';
//import MessengerContainer from '../messages/MessengerContainer';
import PhoneContainer from '../phone/PhoneContainer'
import QueueStats from '../taskrouter/QueueStats';
//import VideoDisplay from '../video/Video'
//import VideoPlayer from '../video/VideoPlayer'

const AgentWorkSpace = ({channels = [], currInteraction, participant = {} }) => {
  let component = null
  console.log(currInteraction)

  switch (currInteraction) {
    case 'video':
    console.log(participant, "in top compp")
      component = <VideoPlayer key={1} participant={participant} />
      break;
    case 'voice':
      component = <PhoneContainer key={1} />
    default:
      component = <PhoneContainer key={1} />
  }
  return (
    <div id="softphone" className="softphone">
      <SimpleAgentStatusControlsContainer />
      <div className="divider"> </div>
      {component}
      <QueueStats />
    </div>
  )
}

AgentWorkSpace.propTypes = {
  channel: PropTypes.array.isRequired
}

export default AgentWorkSpace
