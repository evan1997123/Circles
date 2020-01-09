import React from "react";
import "./CircleColumn.css";
import Task from "../Task";
import Button from "react-bootstrap/Button";

class CircleColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      tasks: []
    };
    this.change = this.change.bind(this);
    this.resetTasks = this.resetTasks.bind(this);
  }

  componentDidMount() {
    this.setState({
      title: this.props.title
    });
  }

  componentDidUpdate(prevState) {
    if (this.state.tasks !== this.props.tasks) {
      this.setState({
        tasks: this.props.tasks
      });
    }
  }

  change(task) {
    let copyList = [...this.state.tasks];
    copyList = copyList.filter(item => item !== task);

    if (this.state.title === "Tasks To Do") {
      this.props.addToPendingTasks(task);
      this.props.removedFromToDo(copyList);
    }

    if (this.state.title === "Tasks Completed") {
      this.props.removedFromTasksCompleted(copyList);
    }
  }

  resetTasks() {
    if (this.state.title === "Tasks To Do") {
      this.props.removedFromToDo([
        {
          taskName: "Reducer: Do your homework 0",
          assignedBy: "Christine",
          taskDescription: "Do your homework 0"
        },
        {
          taskName: "Reducer: Wash the dishes",
          assignedBy: "Christine",
          taskDescription: "Wash the left dishes"
        },
        {
          taskName: "Reducer: Give your girlfriend attention",
          assignedBy: "Christine",
          taskDescription: "Cuddles <3"
        }
      ]);
    }
    if (this.state.title === "Tasks Completed") {
      this.props.removedFromTasksCompleted([
        {
          taskName: "Reducer: Do your homework 0",
          assignedBy: "Christine",
          taskDescription: "Do your homework 0"
        },
        {
          taskName: "Reducer: Wash the dishes",
          assignedBy: "Christine",
          taskDescription: "Wash the left dishes"
        },
        {
          taskName: "Reducer: Give your girlfriend attention",
          assignedBy: "Christine",
          taskDescription: "Cuddles <3"
        },
        {
          taskName: "Reducer: By Boba",
          assignedBy: "Evan",
          taskDescription: "Caramelized Boba"
        }
      ]);
    }
  }

  render() {
    if (this.state.title === "Tasks Completed") {
      // console.log(this.state.tasks);
    }
    var tasks;
    if (typeof this.state.tasks !== "undefined") {
      tasks = this.state.tasks.map((task, index) => (
        <Task
          color={this.props.color}
          task={task}
          change={this.change}
          button={this.props.button}
          column={this.state.title}
          key={index}
        ></Task>
      ));
    }
    if (tasks) {
      return (
        <div className="columns">
          <h4>{this.state.title}</h4>
          {tasks && tasks}
          <Button onClick={this.resetTasks}>Reset tasks</Button>
        </div>
      );
    } else {
      return (
        <div className="columns">
          <h4>{this.state.title}</h4>
          Loading Tasks.....
          <Button onClick={this.resetTasks}>Reset tasks</Button>
        </div>
      );
    }
  }
}

export default CircleColumn;
