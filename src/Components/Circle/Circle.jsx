import React from "react";
import "./Circle.css";
import TaskForm from "./TaskForm";
import CircleColumns from "./CircleColumns";
import ApproveTasksModal from "./ApproveTasksModal";
import InviteMembersModal from "./InviteMembersModal";
import PromoteDemoteModal from "./PromoteDemoteModal";
import { connect } from "react-redux";
import {
  createTask,
  moveTask,
  deleteTask
} from "../../Store/Actions/TaskActions";
import {
  updateCircleMembers,
  updateCirclePromoteDemote
} from "../../Store/Actions/CircleActions";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

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
      showCreateTaskModal: false,
      showInviteMembersModal: false,
      showPromoteDemoteModal: false,
      showApproveTasksModal: false
    };

    //input form local state
    this.handleChangeInput = this.handleChangeInput.bind(this);
    //creating a task from the form
    this.handleCreateTask = this.handleCreateTask.bind(this);

    //methods for moving tasks from toDo => pending => completed
    this.handleMoveTasks = this.handleMoveTasks.bind(this);

    //methods for updating the circle with members or leaders from the modals
    this.handleUpdateCircleMembers = this.handleUpdateCircleMembers.bind(this);

    //methods for updating the circle by promotion or demotion from the modals
    this.handlePromoteDemote = this.handlePromoteDemote.bind(this);
  }

  deleteTask = taskId => {
    // Delete task
    this.props.dispatchDeleteTask(taskId);
  };

  //event handler for change in input form local state
  handleChangeInput(e) {
    if (e.target.type === "number") {
      var value = parseInt(e.target.value);
      var newValue = isNaN(value) ? "" : value;
      this.setState({
        [e.target.name]: newValue
      });
      return;
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  //event handler for creating a task
  handleCreateTask(e) {
    e.preventDefault();
    if (
      this.state.taskName === "" ||
      this.state.assignedForID === "" ||
      this.state.taskDescription === "" ||
      this.state.completeBy === "" ||
      this.state.reward === ""
    ) {
      alert("All fields are required");
      return;
    }
    //dispatch creation of task data object
    var taskDetails = {
      circleID: this.state.circleID,
      taskName: this.state.taskName,
      assignedForID: this.state.assignedForID,
      taskDescription: this.state.taskDescription,
      completeBy: this.state.completeBy,
      reward: this.state.reward === "" ? 0 : this.state.reward
    };
    this.props.dispatchCreateTask(taskDetails);

    //find form
    var frm = document.getElementsByName("TaskForm")[0];
    frm.reset();
    this.setState({
      taskName: "",
      assignedForID: "",
      taskDescription: "",
      completeBy: "",
      reward: 0,
      showCreateTaskModal: false,
      showInviteMembersModal: false,
      showPromoteDemoteModal: false,
      showApproveTasksModal: false
    });
  }

  //event handler for moving tasks to a different stage
  handleMoveTasks(task, userID) {
    //this.props.dispatchMoveTask();
    this.props.dispatchMoveTask(task, userID);
  }

  handleUpdateCircleMembers(newCircleDetails) {
    console.log("updating circle");
    this.props.dispatchUpdateCircleMembers(newCircleDetails);
  }

  handlePromoteDemote(newCircleDetails) {
    console.log("promoting and demoting");
    this.props.dispatchUpdateCirclePromoteDemote(newCircleDetails);
  }

  // For showing modal (creating new task)
  handleClick = e => {
    switch (e.target.name) {
      case "createTaskButton":
        this.setState({
          showCreateTaskModal: true
        });
        return;
      case "inviteMembersButton":
        this.setState({
          showInviteMembersModal: true
        });
        return;
      case "promoteDemoteButton":
        this.setState({
          showPromoteDemoteModal: true
        });
        return;
      case "approveTasksButton":
        this.setState({
          showApproveTasksModal: true
        });
        return;
      default:
        return;
    }
  };

  handleClose = () => {
    this.setState({
      showCreateTaskModal: false,
      showInviteMembersModal: false,
      showPromoteDemoteModal: false,
      showApproveTasksModal: false
    });
  };

  render() {
    const auth = this.props.firebaseAuthRedux;
    const userID = auth.uid;
    var currentCircle;
    var isLeader = false;
    if (this.props.firestoreCircleRedux) {
      currentCircle = this.props.firestoreCircleRedux[0];
      isLeader = Object.keys(currentCircle.leaderList).includes(userID)
        ? true
        : false;
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

    if (currentCircle) {
      return (
        <div className="overallContainer">
          <div className="title text-center">
            {currentCircle.circleName}
            <br />
            Number of people: &nbsp;{currentCircle.numberOfPeople}
            <br />
          </div>
          <div className="topButtons">
            <Button name="createTaskButton" onClick={this.handleClick}>
              Create Task
            </Button>{" "}
            &nbsp;
            {isLeader ? (
              <div>
                <Button name="inviteMembersButton" onClick={this.handleClick}>
                  Invite Members
                </Button>
                &nbsp;
                <Button name="promoteDemoteButton" onClick={this.handleClick}>
                  Promote/Demote
                </Button>
                &nbsp;
                <Button name="approveTasksButton" onClick={this.handleClick}>
                  Approve Tasks
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>

          <ApproveTasksModal
            showApproveTasksModal={this.state.showApproveTasksModal}
            handleClose={this.handleClose}
            allTasks={allTasks}
            handleMoveTasks={this.handleMoveTasks}
            userID={userID}
          ></ApproveTasksModal>
          <InviteMembersModal
            showInviteMembersModal={this.state.showInviteMembersModal}
            handleClose={this.handleClose}
            allUsers={allUsers}
            currentUserID={userID}
            currentCircle={currentCircle}
            handleUpdateCircleMembers={this.handleUpdateCircleMembers}
          ></InviteMembersModal>
          <PromoteDemoteModal
            showPromoteDemoteModal={this.state.showPromoteDemoteModal}
            handleClose={this.handleClose}
            currentUserID={userID}
            currentCircle={currentCircle}
            handlePromoteDemote={this.handlePromoteDemote}
          ></PromoteDemoteModal>
          <Modal
            show={this.state.showCreateTaskModal}
            onHide={this.handleClose}
          >
            <Modal.Header>
              <Modal.Title>Create a New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h3>All inputs are required</h3>
              <TaskForm
                handleCreateTask={this.handleCreateTask}
                handleChangeInput={this.handleChangeInput}
                formData={this.state}
                allUsers={allUsers}
                userID={userID}
                currentCircle={currentCircle}
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
    dispatchDeleteTask: taskId => dispatch(deleteTask(taskId)),
    dispatchUpdateCircleMembers: newCircleDetails =>
      dispatch(updateCircleMembers(newCircleDetails)),
    dispatchUpdateCirclePromoteDemote: newCircleDetails =>
      dispatch(updateCirclePromoteDemote(newCircleDetails))
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
