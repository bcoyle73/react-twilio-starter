import React, { PropTypes } from 'react';

import StatBox from './StatBox';

const QueueStats = ({}) => (
  <div id="team-status">
    <StatBox statName="Agents" />
    <StatBox statName="Queues" />
  </div>
)

QueueStats.PropTypes = {

}

export default QueueStats;
