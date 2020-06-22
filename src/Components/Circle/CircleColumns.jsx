import React, { Component } from "react";
import CircleColumn from "./CircleColumn";

class CircleColumns extends Component {
  //this.props passes handleMoveTasks and allTasks
  //allTasks should be relevant to THIS CIRCLE ONLY

  constructor(props) {
    super(props);
    // console.log(props.allTasks);
  }

  render() {
    let {
      handleMoveTasks,
      allTasks,
      userID,
      deleteTask,
      handleEditTask
    } = this.props;
    if (allTasks) {
      //all tasks that the current user has to do
      var tTasks = allTasks.filter(
        task => task.taskStage === "toDo" && task.assignedForID === userID
      );

      var sortedTTasks = Array.from(Object.entries(tTasks));
      sortedTTasks = sortedTTasks.sort((a, b) => {
        // a's date
        var taskDueDateA = a[1].completeBy;
        var dueDateYear = taskDueDateA.slice(0, taskDueDateA.indexOf("-"));
        taskDueDateA = taskDueDateA.slice(
          taskDueDateA.indexOf("-") + 1,
          taskDueDateA.length
        );
        var dueDateMonth = taskDueDateA.slice(0, taskDueDateA.indexOf("-"));
        taskDueDateA = taskDueDateA.slice(
          taskDueDateA.indexOf("-") + 1,
          taskDueDateA.length
        );
        var dueDateDay = taskDueDateA;
        dueDateYear = parseInt(dueDateYear);
        dueDateMonth = parseInt(dueDateMonth);
        dueDateDay = parseInt(dueDateDay);

        taskDueDateA = new Date(dueDateYear, dueDateMonth - 1, dueDateDay);

        // b's date
        var taskDueDateB = b[1].completeBy;
        dueDateYear = taskDueDateB.slice(0, taskDueDateB.indexOf("-"));
        taskDueDateB = taskDueDateB.slice(
          taskDueDateB.indexOf("-") + 1,
          taskDueDateB.length
        );
        dueDateMonth = taskDueDateB.slice(0, taskDueDateB.indexOf("-"));
        taskDueDateB = taskDueDateB.slice(
          taskDueDateB.indexOf("-") + 1,
          taskDueDateB.length
        );
        dueDateDay = taskDueDateB;
        dueDateYear = parseInt(dueDateYear);
        dueDateMonth = parseInt(dueDateMonth);
        dueDateDay = parseInt(dueDateDay);

        taskDueDateB = new Date(dueDateYear, dueDateMonth - 1, dueDateDay);

        return taskDueDateA.getTime() - taskDueDateB.getTime() >= 0 ? 1 : -1;
      });
      tTasks = sortedTTasks.map(indexAndElem => indexAndElem[1]);

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
    }

    return (
      <React.Fragment>
        <CircleColumn
          title="Tasks To Do"
          color="outline-success"
          buttonText="Complete"
          tasks={tTasks}
          handleMoveTasks={handleMoveTasks}
          userID={userID}
          deleteTask={deleteTask}
          forRewards={false}
          isLeader={this.props.isLeader}
          handleEditTask={handleEditTask}
        ></CircleColumn>
        <CircleColumn
          title="Pending Tasks"
          color="outline-dark"
          buttonText="Requesting Approval"
          tasks={pTasks}
          userID={userID}
          forRewards={false}
          isLeader={this.props.isLeader}
          handleEditTask={handleEditTask}
        ></CircleColumn>
        <CircleColumn
          title="Completed Tasks"
          color="outline-info"
          buttonText="Receive Points"
          tasks={cTasks}
          handleMoveTasks={handleMoveTasks}
          userID={userID}
          forRewards={false}
          isLeader={this.props.isLeader}
          handleEditTask={handleEditTask}
        ></CircleColumn>
        <CircleColumn
          title="Rewards"
          buttonText="Claim"
          forRewards={true}
          allRewards={this.props.allRewards}
          handleClaimRewards={this.props.handleClaimRewards}
          handleDeleteRewards={this.props.handleDeleteRewards}
          isLeader={this.props.isLeader}
          handleEditTask={handleEditTask}
        ></CircleColumn>
      </React.Fragment>
    );
  }
}

export default CircleColumns;
