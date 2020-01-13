import React from "react";
import "./Circle.css";
import TaskForm from "./TaskForm";
import CircleColumns from "./CircleColumns";
import { connect } from "react-redux";
import {
  createTask,
  moveTask,
  deleteTask
} from "../../Store/Actions/TaskActions";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { Button, Modal, ModalFooter } from "react-bootstrap";

class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circleID: this.props.match.params.id,
      taskName: "",
      assignedForID: "",
      taskDescription: "",
      completeBy: "",
      reward: 0,
      show: false
    };

    //input form local state
    this.handleChangeInput = this.handleChangeInput.bind(this);
    //creating a task from the form
    this.handleCreateTask = this.handleCreateTask.bind(this);

    //methods for moving tasks from toDo => pending => completed
    this.handleMoveTasks = this.handleMoveTasks.bind(this);
  }

  deleteTask = taskId => {
    // Delete task
    this.props.dispatchDeleteTask(taskId);
  };

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
      reward: "",
      show: false
    });
  }

  //event handler for moving tasks to a different stage
  handleMoveTasks(task, userID) {
    //this.props.dispatchMoveTask();
    this.props.dispatchMoveTask(task, userID);
  }

  // For showing modal (creating new task)
  handleClick = () => {
    this.setState({
      show: true
    });
  };

  handleClose = () => {
    this.setState({
      show: false
    });
  };

  render() {
    // console.log(this.props);

    const auth = this.props.firebaseAuthRedux;
    const userID = auth.uid;
    var currentCircle;
    if (this.props.firestoreCircleRedux) {
      currentCircle = this.props.firestoreCircleRedux[0];
    }

    //if not logged in, then redirect to signin page
    if (!userID) {
      return <Redirect to="/signin" />;
    }

    //IDEALLY allTasks should get all the tasks from a particular circle, without having to fetch all the tasks and filter out via circle ID
    //similarily, allUsers should only be all the users in this circle
    //isn't that bad security design?
    var allTasks = this.props.firestoreTasksRedux;
    var allUsers = this.props.firestoreUsersRedux;
    //console.log(allTasks);

    if (currentCircle) {
      return (
        <div className="overallContainer">
          <div className="title text-center">
            {currentCircle.circleName}
            <br />
            Number of people: &nbsp;{currentCircle.numberOfPeople}
            <br />
          </div>
          <div className="createTaskButton">
            <Button onClick={this.handleClick}>Create Task</Button>
          </div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>Create a New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TaskForm
                handleCreateTask={this.handleCreateTask}
                handleChangeInput={this.handleChangeInput}
                formData={this.state}
                allUsers={allUsers}
                userID={userID}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
              <Button onClick={this.handleCreateTask}>Submit</Button>
            </Modal.Footer>
          </Modal>

          <div className="centered">
            <CircleColumns
              allTasks={allTasks}
              handleMoveTasks={this.handleMoveTasks}
              userID={userID}
              deleteTask={this.deleteTask}
            />
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
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
    firestoreTasksRedux: state.firestore.ordered.tasks,
    firestoreUsersRedux: state.firestore.ordered.users,
    firestoreCircleRedux: state.firestore.ordered.circles,
    firebaseAuthRedux: state.firebase.auth
  };
};

//dispatchCreateTask is a method to dispatch the create task event upon submitting the form
//createTask is a functional action creator from TaskActions
const mapDispatchToProps = dispatch => {
  return {
    dispatchCreateTask: task => dispatch(createTask(task)),
    dispatchMoveTask: (task, userID) => dispatch(moveTask(task, userID)),
    dispatchDeleteTask: taskId => dispatch(deleteTask(taskId))
  };
};

//firestoreConnect takes in an array of of objects that say which collection you want to connect to
//whenever database for this collection is changed, it will induce the firestoreReducer, which will sync firestore/redux store state
//and then this component will "hear" it.
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  //firestoreConnect takes in an array of of objects that say which collection you want to connect to
  //whenever database for this collection is changed, it will induce the firestoreReducer, which will sync store state
  // and then this component will "hear" that because we connected that. Then state will change for the store
  firestoreConnect(props => {
    return [
      {
        collection: "tasks",
        where: ["circleID", "==", props.match.params.id]
      },
      { collection: "users" },
      { collection: "circles", doc: props.match.params.id }
    ];
  })
)(Circle);
