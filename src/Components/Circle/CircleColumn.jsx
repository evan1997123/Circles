import React from "react";
import "./CircleColumn.css";
import Task from "./Task";
import Reward from "./Reward";
//props should have something like:

//title="Tasks To Do"
//color="primary"
//buttonText="Complete"
//tasks={tTasks}

//props.tasks
//essentially the list of tasks to be displayed. ASSUME that these tasks are of the proper type,

class CircleColumn extends React.Component {
  render() {
    //if there are tasks
    let {
      tasks,
      userID,
      color,
      buttonText,
      handleMoveTasks,
      title,
      deleteTask,
      forRewards,
      handleDisapproveTask
    } = this.props;

    if (!(typeof tasks === "undefined")) {
      //tasks is all the task components to be rendered
      var tasksList = tasks.map((task, index) => (
        <Task
          color={color}
          task={task}
          buttonText={buttonText}
          handleMoveTasks={handleMoveTasks}
          key={index}
          userID={userID}
          deleteTask={deleteTask}
          forNotification={false}
          handleDisapproveTask={handleDisapproveTask}
        ></Task>
      ));
    }

    if (!(typeof tasksList === "undefined")) {
      return (
        <div className="columns">
          <h4>{title}</h4>
          {tasksList && tasksList}
        </div>
      );
    } else {
      // Rewards column
      if (forRewards) {
        var rewardsMap = this.props.allRewards;
        var mapKeys = Object.keys(this.props.allRewards);
        var rewardsList = [];
        for (var i = 0; i < mapKeys.length; i++) {
          rewardsList[i] = rewardsMap[mapKeys[i]];
        }
        rewardsList = rewardsList.map((reward, index) => (
          <Reward
            reward={reward}
            key={index}
            handleClaimRewards={this.props.handleClaimRewards}
            handleDeleteRewards={this.props.handleDeleteRewards}
          ></Reward>
        ));
        return (
          <div className="columns">
            <h4>{title}</h4>
            {rewardsList}
          </div>
        );
      } else {
        // No tasks
        return (
          <div className="columns">
            <h4>{title}</h4>
            Loading Tasks...
          </div>
        );
      }
    }
  }
}

export default CircleColumn;
