import React from "react";
import "./CircleColumn.css";
import Task from "./Task";
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
      deleteTask
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
        ></Task>
      ));
      //console.log(tasks);
    }

    if (!(typeof tasksList === "undefined")) {
      return (
        <div className="columns">
          <h4>{title}</h4>
          {tasksList && tasksList}
        </div>
      );
    } else {
      return (
        <div className="columns">
          <h4>{title}</h4>
          Loading Tasks.....
        </div>
      );
    }
  }
}

export default CircleColumn;
