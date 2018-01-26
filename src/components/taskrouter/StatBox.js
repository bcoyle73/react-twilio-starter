import React, { PropTypes } from 'react';

const StatBox = ({statName, statValue}) => {
  let lowerCaseStat = statName.toLowerCase()
  let statusClass =  lowerCaseStat + '-status'
  let numClass = lowerCaseStat + '-num'

  return (
    <div className={statusClass}>
      <div className={numClass}>{statValue}</div>
      {statName}
    </div>
  )
}

StatBox.propTypes = {
  statName: PropTypes.string.isRequired,
  statValue: PropTypes.string
}

StatBox.defaultProps = {
  statName: "Agents",
  statValue: "Queues"
}

export default StatBox;
