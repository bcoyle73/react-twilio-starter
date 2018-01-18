import React, { PropTypes } from 'react';

const TaskControls = ({task, onRequestComplete}) => (
  <div className="task">
    <span className="task-instnace"> { task.taskChannelUniqueName } </span>
    <span className="task-instnace"> { task.assignmentStatus } </span>
    <a href="#" onClick={() => onRequestComplete(task)}>Complete</a>
  </div>
)

TaskControls.propTypes = {

}


export default TaskControls;
