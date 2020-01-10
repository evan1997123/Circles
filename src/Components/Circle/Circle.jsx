import React from "react";
import "./Circle.css";
import TaskForm from "./TaskForm";
import CircleColumns from "./CircleColumns";
import { connect } from "react-redux";
import { createTask, moveTask } from "../../Store/Actions/TaskActions";
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

    //input form local state
    this.handleChangeInput = this.handleChangeInput.bind(this);
    //creating a task from the form
    this.handleCreateTask = this.handleCreateTask.bind(this);

    //methods for moving tasks from toDo => pending => completed
    this.handleMoveTasks = this.handleMoveTasks.bind(this);
  }

  //event handler for change in input form local state
  handleChangeInput(e) {
    this.setState({
      [e.target.name]:
        e.target.type === "number" ? parseInt(e.target.value) : e.target.value
    });
  }

  //event handler for creating a task
  handleCreateTask(e) {
    e.preventDefault();

    //dispatch creation of task data object
    this.props.dispatchCreateTask(this.state);

    //find form
    var frm = document.getElementsByName("TaskForm")[0];
    frm.reset();
    this.setState({
      taskName: "",
      assignedForID: "",
      taskDescription: "",
      completeBy: "",
      reward: ""
    });
  }

  //event handler for moving tasks to a different stage
  handleMoveTasks(task, userID) {
    //this.props.dispatchMoveTask();
    this.props.dispatchMoveTask(task, userID);
  }

  render() {
    //console.log(this.state);
    const auth = this.props.firebaseAuth;
    const userID = auth.uid;

    //if not logged in, then redirect to signin page
    if (!userID) {
      return <Redirect to="/signin" />;
    }

    //IDEALLY allTasks should get all the tasks from a particular circle, without having to fetch all the tasks and filter out via circle ID
    //similarily, allUsers should only be all the users in this circle
    //isn't that bad security design?
    var allTasks = this.props.firestoreTasks;
    var allUsers = this.props.firestoreUsers;
    //console.log(allTasks);

    return (
      <div className="overallContainer">
        TaskForm
        <TaskForm
          handleCreateTask={this.handleCreateTask}
          handleChangeInput={this.handleChangeInput}
          formData={this.state}
          allUsers={allUsers}
          userID={userID}
        />
        <div className="centered">
          <CircleColumns
            allTasks={allTasks}
            handleMoveTasks={this.handleMoveTasks}
            userID={userID}
          />
        </div>
      </div>
    );
  }
}

//if we had a parameter that was passed in from the props such as a taskID or something we could do
/*
const id = ownProps.match.params.taskID
const tasks = state.firestore.data.task
const task = tasks ? tasks[id] : null
return  {
  firestoreTask: task
}

the return value would now be a single task that would be stored in this.props.firestoreTask
*/

// state is the REDUX STORE
// ownProps allows us to pass in this.props to this, incase we want something from props
const mapStateToProps = (state, ownProps) => {
  //this shows the current state of the Redux store
  //console.log(state);

  //this for firestore data
  return {
    firestoreTasks: state.firestore.ordered.tasks,
    firestoreUsers: state.firestore.ordered.users,
    firebaseAuth: state.firebase.auth
  };
};

//dispatchCreateTask is a method to dispatch the create task event upon submitting the form
//createTask is a functional action creator from TaskActions
const mapDispatchToProps = dispatch => {
  return {
    dispatchCreateTask: task => dispatch(createTask(task)),
    dispatchMoveTask: (task, userID) => dispatch(moveTask(task, userID))
  };
};

//firestoreConnect takes in an array of of objects that say which collection you want to connect to
//whenever database for this collection is changed, it will induce the firestoreReducer, which will sync firestore/redux store state
//and then this component will "hear" it.
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "tasks" }, { collection: "users" }])
)(Circle);
