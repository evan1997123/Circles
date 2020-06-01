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

    this.props.handleNavBarUpdateProfile();
    // console.log(window.location.hostname);
  }

  // Dismiss button removes the notification from the toDoTasks list
  handleDismiss(task) {
    this.props.dispatchDismissTask(task);
  }

  handleRemoveOverdueTasks() {
    var allTasks = this.props.firestoreTasksRedux;
    var userID = this.props.firebaseAuthRedux.uid;
    var circleID;
    if (this.props.firestoreCircleRedux && this.props.firestoreCircleRedux[0]) {
      circleID = this.props.firestoreCircleRedux[0].circleID;
    }
    if (allTasks && circleID) {
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
        taskDueDate = new Date(
          dueDateYear,
          dueDateMonth - 1,
          dueDateDay,
          23,
          59,
          59
        );
        if (taskDueDate.getTime() - currentDate.getTime() < 0) {
          tasksToDelete.push(task);
        }
      }
      for (var i = 0; i < tasksToDelete.length; i++) {
        this.props.dispatchRemoveOverdueTasks(
          tasksToDelete[i].taskID,
          userID,
          circleID
        );
      }
      if (tasksToDelete.length > 0) {
        return true;
      }
    }
    return false;
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
      allTasks.filter(task => {
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
    var mapCircleIDToNames = {};
    if (allCircles) {
      for (var i = 0; i < allCircles.length; i++) {
        var circle = allCircles[i];
        mapCircleIDToNames[circle.circleID] = circle.circleName;
      }
    }
    // Tasks that are still to be done and are assigned to me
    allTasks = this.props.firestoreTasksRedux;
    if (allTasks) {
      allTasks = allTasks.filter(task => {
        if (task.assignedForID === userID && task.taskStage === "toDo") {
          return true;
        }
        return false;
      });
      // Figure out the number of tasks remaining for each Circle (for you specifically)
      var circleIDToTasksMap = {};
      if (allCircles) {
        for (var i = 0; i < allCircles.length; i++) {
          // For each Circle, find the number of tasks that are still left to do
          var myCircle = allCircles[i];
          var myCircleID = myCircle.circleID;
          circleIDToTasksMap[myCircleID] = allTasks.filter(task => {
            return task.circleID === myCircleID;
          });
        }
      }
      var circleIDToNumTasksLeftMap = {};
      if (allCircles) {
        for (var i = 0; i < allCircles.length; i++) {
          var myCircle = allCircles[i];
          var numTasksLeft = circleIDToTasksMap[myCircle.circleID].length;
          circleIDToNumTasksLeftMap[myCircle.circleID] = numTasksLeft;
        }
      }
    }
    // Figure out list of Circles that this user is a leader of
    var userInfo = this.props.firebaseAuthRedux;
    var userID = userInfo.uid;
    var leaderInTheseCircles = [];
    if (allCircles) {
      for (var i = 0; i < allCircles.length; i++) {
        var circleInfo = allCircles[i];
        var leaders = circleInfo.leaderList;
        if (leaders[userID]) {
          leaderInTheseCircles.push(circleInfo.circleID);
        }
      }
    }
    // For each Circle that you're a leader of, figure out number of
    // tasks that still need to be approved
    var circleIDToNumPendingTasks = {};
    allTasks = this.props.firestoreTasksRedux;
    if (allTasks) {
      for (var i = 0; i < leaderInTheseCircles.length; i++) {
        var circleID = leaderInTheseCircles[i];
        circleIDToNumPendingTasks[circleID] = allTasks.filter(task => {
          return task.circleID === circleID && task.taskStage === "pending";
        }).length;
      }
    }
    return (
      <div className="dashboard">
        <div className="panelContainer" style={{ padding: "0 10%" }}>
          <div className="panelItem" style={{ flex: "6", padding: "1.5% 1%" }}>
            <CircleContainer
              friendsList={this.props.firebaseProfileRedux.friendsList}
              toDoTasks={toDoTasks}
              circleIDToNumTasksLeftMap={circleIDToNumTasksLeftMap}
              circleIDToNumPendingTasks={circleIDToNumPendingTasks}
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
    firebaseProfileRedux: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchDismissTask: task => dispatch(dismissTask(task)),
    dispatchRemoveOverdueTasks: (deleteThisTaskID, userID, circleID) =>
      dispatch(removeOverdueTasks(deleteThisTaskID, userID, circleID))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    return [
      {
        collection: "tasks"
      }
    ];
  })
)(Dashboard);
