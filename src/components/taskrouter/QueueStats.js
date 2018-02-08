import React, { PropTypes } from 'react';

import StatBox from './StatBox';

const QueueStats = ({workersAvailable}) => (
  <div id="team-status">
    <StatBox statName="Agents" statValue={workersAvailable} />
    <StatBox statName="Queues" statValue="0" />
  </div>
)

QueueStats.PropTypes = {

}

export default QueueStats;
