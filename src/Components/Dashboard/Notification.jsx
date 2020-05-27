import React from "react";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import "./Notification.css";
import Task from "../Circle/Task";

class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    // Check for overdue tasks here
    var handleRemoveOverdueTasks = this.props.handleRemoveOverdueTasks;
    handleRemoveOverdueTasks();
  }

  render() {
    let { notifications, circleNames, handleDismiss } = this.props;
    // Only display the top four notifications
    var display = notifications.slice(0, 4);
    // Sort display by due date
    display.sort((task1, task2) => {
      var task1Date = task1.completeBy;
      var task2Date = task2.completeBy;
      // Convert to Date objects
      var task1Year = task1Date.slice(0, task1Date.indexOf("-"));
      var task2Year = task2Date.slice(0, task2Date.indexOf("-"));
      task1Year = parseInt(task1Year);
      task2Year = parseInt(task2Year);
      task1Date = task1Date.slice(task1Date.indexOf("-") + 1, task1Date.length);
      task2Date = task2Date.slice(task2Date.indexOf("-") + 1, task2Date.length);
      var task1Month = task1Date.slice(0, task1Date.indexOf("-"));
      var task2Month = task2Date.slice(0, task2Date.indexOf("-"));
      task1Month = parseInt(task1Month);
      task2Month = parseInt(task2Month);
      task1Date = task1Date.slice(task1Date.indexOf("-") + 1, task1Date.length);
      task2Date = task2Date.slice(task2Date.indexOf("-") + 1, task2Date.length);
      var task1Day = task1Date;
      var task2Day = task2Date;
      task1Day = parseInt(task1Day);
      task2Day = parseInt(task2Day);
      task1Date = new Date(task1Year, task1Month, task1Day);
      task2Date = new Date(task2Year, task2Month, task2Day);
      return task1Date.getTime() - task2Date.getTime();
    });
    display = display.map((task, index) => (
      <Task
        task={task}
        key={index}
        circleName={circleNames[task.circleID]}
        forNotification={true}
        handleDismiss={handleDismiss}
      ></Task>
    ));

    return (
      <div className="centerColumn">
        <h4>Notifications</h4>
        {display}
        {/* {notifications}
        <Button onClick={this.restoreNotifications}>Reset notifications</Button> */}
      </div>
    );
  }
}

export default Notification;
