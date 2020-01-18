import React, { Component } from "react";
import CircleColumn from "./CircleColumn";

class CircleColumns extends Component {
  //this.props passes handleMoveTasks and allTasks
  //allTasks should be relevant to THIS CIRCLE ONLY
  render() {
    let { handleMoveTasks, allTasks, userID, deleteTask } = this.props;
    if (allTasks) {
      //all tasks that the current user has to do
      var tTasks = allTasks.filter(
        task => task.taskStage === "toDo" && task.assignedForID === userID
      );
      //all tasks that the current user has pending to be checked off by someone else
      var pTasks = allTasks.filter(
        task => task.taskStage === "pending" && task.assignedForID === userID
      );

      //all (requested) tasks that the current user can check off for someone else
      // var rTasks = allTasks.filter(
      //   task => task.taskStage === "pending" && task.assignedByID === userID
      // );

      //all tasks that the current user has completed
      var cTasks = allTasks.filter(
        task => task.taskStage === "completed" && task.assignedForID === userID
      );
      //console.log(tTasks);
      //console.log(pTasks);
      //console.log(cTasks);
    }

    return (
      <React.Fragment>
        <CircleColumn
          title="Tasks To Do"
          color="primary"
          buttonText="Complete"
          tasks={tTasks}
          handleMoveTasks={handleMoveTasks}
          userID={userID}
          deleteTask={deleteTask}
        ></CircleColumn>
        <CircleColumn
          title="Pending Tasks"
          color="secondary"
          buttonText="Requesting Approval"
          tasks={pTasks}
          userID={userID}
        ></CircleColumn>
        {/* <CircleColumn
          title="Requests"
          color="secondary"
          buttonText="Approve"
          tasks={rTasks}
          handleMoveTasks={handleMoveTasks}
          userID={userID}
        ></CircleColumn> */}
        <CircleColumn
          title="Completed Tasks"
          color="success"
          buttonText="Dismiss"
          tasks={cTasks}
          handleMoveTasks={handleMoveTasks}
          userID={userID}
        ></CircleColumn>
      </React.Fragment>
    );
  }
}

export default CircleColumns;
