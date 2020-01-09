import React from "react";
import "./Circle.css";
import CircleColumn from "./CircleColumn";
import { connect } from "react-redux";
import { createTask } from "../../Store/Actions/TaskActions";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import { Redirect } from "react-router-dom";

class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: "",
      assignedForID: "",
      taskDescription: "",
      completeBy: "",
      reward: 0
    };
    this.addToPendingTasks = this.addToPendingTasks.bind(this);
    this.removedFromToDo = this.removedFromToDo.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.createTask = this.createTask.bind(this);
  }

  componentDidMount() {}
  addToPendingTasks(task) {
    console.log("addToPendingTasks");
  }
  removedFromToDo(tasks) {
    // this.setState({
    //   toDoTasks: tasks
    // });
  }

  updateInput(e) {
    this.setState({
      [e.target.name]:
        e.target.type === "number" ? parseInt(e.target.value) : e.target.value
    });
  }

  createTask(e) {
    e.preventDefault();
    // this function is at the bottom,
    this.props.createTaskComponent(this.state);
    // var newTask = {
    //   taskName: this.state.taskName,
    //   taskDescription: this.state.taskDescription,
    //   completeBy: this.state.completeBy,
    //   reward: this.state.reward
    // };
    // this.setState({
    //   toDoTasks: [...this.state.toDoTasks, newTask]
    // });
    // console.log(this.state.taskName);
    // console.log(this.state.assignedBy);
    // console.log(this.state.taskDescription);
    var frm = document.getElementsByName("newTaskForm")[0];
    frm.reset();
    this.setState({
      taskName: "",
      assignedForID: "",
      taskDescription: "",
      completeBy: "",
      reward: ""
    });
  }
  render() {
    var longInput = {
      width: 500
    };

    const auth = this.props.firebaseAuthRedux;
    //if not logged in, then redirect to signin page
    if (!auth.uid) {
      return <Redirect to="/signin" />;
    }
    var dynamicTasks = this.props.allTasksRedux;
    var allUsers = this.props.allUsersRedux;
    // console.log(allUsers);
    console.log(this.state);
    if (allUsers) {
      var listOfUsers = [
        allUsers.map((user, index) => (
          <option value={user.id} key={index}>
            {user.firstName} {user.lastName}
          </option>
        ))
      ];
      listOfUsers.unshift(
        <option
          disabled
          hidden
          style={{ display: "none" }}
          value=""
          key={-1}
        ></option>
      );
    }

    // if (dynamicTasks !== this.state.toDoTasks) {
    //   this.setState({
    //     toDoTasks: dynamicTasks
    //   });
    // }
    console.log(this.props);
    return (
      <div className="overallContainer">
        TaskForm
        <div>
          <form name="newTaskForm" onSubmit={this.createTask}>
            <label>Task Name</label>
            <input
              type="text"
              name="taskName"
              placeholder="Finish Homework 0"
              onChange={this.updateInput}
              value={this.state.taskName}
            />
            <br />
            {/* unneccessary becuase whoever is logged in is the creator*/}
            {/* <label>Assigned By</label>
            <input
              type="text"
              name="assignedBy"
              placeholder="Christine"
              onChange={this.updateInput}
              alue={this.state.assignedBy}
            />
            <br /> */}
            <label>
              Assigned For
              <select
                name="assignedForID"
                onChange={this.updateInput}
                value={this.state.assignedForID}
              >
                {listOfUsers}
              </select>
            </label>
            <br />
            <label>Complete By</label>
            <input
              type="date"
              name="completeBy"
              placeholder="01/10/2020"
              onChange={this.updateInput}
              alue={this.state.completeBy}
            />
            <br />
            <label>Reward</label>
            <input
              type="number"
              name="reward"
              placeholder="10"
              onChange={this.updateInput}
              alue={this.state.reward}
            />
            <br />
            <label>Task Description</label>
            <input
              type="text"
              name="taskDescription"
              placeholder="Task Description"
              onChange={this.updateInput}
              style={longInput}
              alue={this.state.taskDescription}
            />
            <br />

            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="centered">
          <CircleColumn
            title="Tasks To Do"
            color="primary"
            button="Complete"
            tasks={dynamicTasks}
            addToPendingTasks={this.addToPendingTasks}
            removedFromToDo={this.removedFromToDo}
          ></CircleColumn>
          <CircleColumn
            title="Pending"
            color="secondary"
            button="Request Approval"
            tasks={this.state.pendingTasks}
          ></CircleColumn>
          <CircleColumn
            title="Tasks Completed"
            color="success"
            button="Dismiss"
            tasks={this.state.completedTasks}
            removedFromTasksCompleted={this.removedFromTasksCompleted}
          ></CircleColumn>
        </div>
      </div>
    );
  }
}

// ownProps allows us to pass in props to this, incase we want something from props
const mapStateToProps = (state, ownProps) => {
  console.log(state); // this console.log, go to the webpage and inspect. then check object>firestore>ordered or data C:
  // this for dummy data
  // return {
  //   allTasksRedux: state.task.tasks
  // };

  //if we had a parameter that was passed in from the props such as a taskID or something we could do
  /*
  const id = ownProps.match.params.taskID
  const tasks = state.firestore.data.task
  const task = tasks ? tasks[id] : null
  return  {
    allTasksRedux: task
  }

  the return calue would now be a single task that would be stored in this.props.reduxStoreTask
   */

  //this for firestore data
  return {
    allTasksRedux: state.firestore.ordered.tasks,
    allUsersRedux: state.firestore.ordered.users,
    firebaseAuthRedux: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //this takes in a task ( which we pass in above) and calls dispatch which just calls a function on createTask
    // creatTask is created from above import, and that  takes us to TaskActions.js
    createTaskComponent: task => dispatch(createTask(task))
  };
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  //firestoreConnect takes in an array of of objects that say which collection you want to connect to
  //whenever database for this collection is changed, it will induce the firestoreReducer, which will sync store state
  // and then this component will "hear" that because we connected that. Then state will change for the store
  firestoreConnect([{ collection: "tasks" }, { collection: "users" }])
)(Circle);
