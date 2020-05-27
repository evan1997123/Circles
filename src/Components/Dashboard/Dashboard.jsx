import React from "react";
// import Notification from "../Notification";
import Notification from "./Notification";
import CircleContainer from "./CircleContainer";
import "./Dashboard.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { dismissTask } from "../../Store/Actions/NotificationActions";
import { removeOverdueTasks } from "../../Store/Actions/TaskActions";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleRemoveOverdueTasks = this.handleRemoveOverdueTasks.bind(this);
  }

  // Dismiss button removes the notification from the toDoTasks list
  handleDismiss(task) {
    console.log("dismiss");
    this.props.dispatchDismissTask(task);
  }

  handleRemoveOverdueTasks() {
    var allTasks = this.props.firestoreTasksRedux;
    var userID = this.props.firebaseAuthRedux.uid;
    var circleID;
    if (this.props.firestoreCircleRedux) {
      circleID = this.props.firestoreCircleRedux[0].circleID;
    }
    if (allTasks) {
      var tasksToDelete = [];
      for (var i = 0; i < allTasks.length; i++) {
        var task = allTasks[i];
        // console.log(task);
        // Compare current date with the task's completeBy date
        var currentDate = new Date();
        var taskDueDate = task.completeBy;
        var dueDateYear = taskDueDate.slice(0, taskDueDate.indexOf("-"));
        taskDueDate = taskDueDate.slice(
          taskDueDate.indexOf("-") + 1,
          taskDueDate.length
        );
        var dueDateMonth = taskDueDate.slice(0, taskDueDate.indexOf("-"));
        taskDueDate = taskDueDate.slice(
          taskDueDate.indexOf("-") + 1,
          taskDueDate.length
        );
        var dueDateDay = taskDueDate;
        dueDateYear = parseInt(dueDateYear);
        dueDateMonth = parseInt(dueDateMonth);
        dueDateDay = parseInt(dueDateDay);
        taskDueDate = new Date(dueDateYear, dueDateMonth - 1, dueDateDay);
        console.log(taskDueDate);
        if (taskDueDate.getTime() - currentDate.getTime() < 0) {
          tasksToDelete.push(task);
        }
      }
      console.log(tasksToDelete);
      for (var i = 0; i < tasksToDelete.length; i++) {
        this.props.dispatchRemoveOverdueTasks(
          tasksToDelete[i].taskID,
          userID,
          circleID
        );
      }
    }
  }

  render() {
    if (!this.props.isAuthed) {
      return <Redirect to="/" />;
    }
    // Figure out which tasks are still to be complete and haven't been dismissed yet
    var allTasks = this.props.firestoreTasksRedux;
    var toDoTasksNotDismissed = [];
    var toDoTasks = [];
    var auth = this.props.firebaseAuthRedux;
    var userID = auth.uid;
    if (allTasks) {
      allTasks.filter((task) => {
        if (task.taskStage === "toDo" && task.assignedForID === userID) {
          if (task.dismissed == false) {
            toDoTasksNotDismissed.push(task);
          }
          toDoTasks.push(task);
        }
      });
    }
    // Get the Circle names
    var allCircles = this.props.firestoreCircleRedux;
    console.log(allCircles);
    var mapCircleIDToNames = {};
    if (allCircles) {
      for (var i = 0; i < allCircles.length; i++) {
        var circle = allCircles[i];
        mapCircleIDToNames[circle.circleID] = circle.circleName;
      }
    }

    return (
      <div className="dashboard">
        <div className="panelContainer" style={{ padding: "0 10%" }}>
          <div className="panelItem" style={{ flex: "6", padding: "1.5% 1%" }}>
            <CircleContainer
              friendsList={this.props.firebaseProfileRedux.friendsList}
              toDoTasks={toDoTasks}
            />
          </div>
          <div className="panelItem" style={{ flex: "3", padding: " 1.5% 1%" }}>
            <Notification
              notifications={toDoTasksNotDismissed}
              circleNames={mapCircleIDToNames}
              handleDismiss={this.handleDismiss}
              handleRemoveOverdueTasks={this.handleRemoveOverdueTasks}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    firestoreTasksRedux: state.firestore.ordered.tasks,
    firebaseAuthRedux: state.firebase.auth,
    firestoreCircleRedux: state.firestore.ordered.circles,
    firebaseProfileRedux: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchDismissTask: (task) => dispatch(dismissTask(task)),
    dispatchRemoveOverdueTasks: (deleteThisTaskID, userID, circleID) =>
      dispatch(removeOverdueTasks(deleteThisTaskID, userID, circleID)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => {
    return [
      {
        collection: "tasks",
      },
    ];
  })
)(Dashboard);
