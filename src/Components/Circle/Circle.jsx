import React from "react";
import "./Circle.css";
import TaskForm from "./TaskForm";
import CircleColumns from "./CircleColumns";
import ApproveTasksModal from "./ApproveTasksModal";
import InviteMembersModal from "./InviteMembersModal";
import PromoteDemoteModal from "./PromoteDemoteModal";
import CreateRewardsModal from "./CreateRewardsModal";
import { connect } from "react-redux";
import {
  createTask,
  moveTask,
  deleteTask,
  disapproveTask
} from "../../Store/Actions/TaskActions";
import {
  updateCircleMembers,
  updateCirclePromoteDemote,
  leaveCircle
} from "../../Store/Actions/CircleActions";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import {
  createReward,
  claimReward,
  deleteReward
} from "../../Store/Actions/RewardActions";

class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circleID: this.props.match.params.id,
      taskName: "",
      assignedForID: "",
      taskDescription: "",
      completeBy: "",
      reward: "",
      showCreateTaskModal: false,
      showInviteMembersModal: false,
      showPromoteDemoteModal: false,
      showApproveTasksModal: false,
      showCreateRewardsModal: false,
      showLeaveCircleModal: false,
      rewardTitle: "",
      rewardDescription: "",
      rewardPoints: "",
      leftCircle: false
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

    this.handleCreateRewards = this.handleCreateRewards.bind(this);
    this.handleClaimRewards = this.handleClaimRewards.bind(this);
    this.handleDeleteRewards = this.handleDeleteRewards.bind(this);
    this.handleLeaveCircle = this.handleLeaveCircle.bind(this);
    this.handleDisapproveTask = this.handleDisapproveTask.bind(this);
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
    // Saves current form inputs in state
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

    // After creating the task, also create the notification
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
      case "createRewardsButton":
        this.setState({
          showCreateRewardsModal: true
        });
        return;
      case "leaveCircleButton":
        this.setState({
          showLeaveCircleModal: true
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
      showApproveTasksModal: false,
      showCreateRewardsModal: false,
      showLeaveCircleModal: false,
      rewardTitle: "",
      rewardDescription: "",
      rewardPoints: ""
    });
  };

  // For creating rewards
  handleCreateRewards(event) {
    event.preventDefault();
    // Make sure user fills out each field
    if (
      this.state.rewardTitle === "" ||
      this.state.rewardDescription === "" ||
      this.state.rewardPoints === ""
    ) {
      alert("All fields are required");
      return;
    }
    // Dispatch creation of rewards data object
    var rewardDetails = {
      circleID: this.state.circleID,
      rewardTitle: this.state.rewardTitle,
      rewardDescription: this.state.rewardDescription,
      rewardPoints: this.state.rewardPoints
    };
    // Create and call the dispatchCreateReward function?
    this.props.dispatchCreateReward(rewardDetails);
    // Clear form and state
    var form = document.getElementsByName("createRewardForm")[0];
    form.reset();
    this.setState({
      rewardTitle: "",
      rewardDescription: "",
      rewardPoints: 0,
      showCreateRewardsModal: false
    });
  }

  handleClaimRewards(rewardID, circleID) {
    // Check if the user has enough points
    var currentCircle;
    if (this.props.firestoreCircleRedux) {
      currentCircle = this.props.firestoreCircleRedux[0];
    }
    var points = currentCircle.points;
    var userID = this.props.firebaseAuthRedux.uid;
    var currentUserPoints = points[userID];
    // Figure out reward points
    var rewards = currentCircle.rewardsList;
    var currentRewardPoints = rewards[rewardID].rewardPoints;
    if (currentUserPoints < currentRewardPoints) {
      alert(
        "You don't have enough points to claim this reward. Try completing some tasks to earn some more points!"
      );
    } else {
      console.log("claimed reward", rewards[rewardID].rewardTitle);
      var userID = this.props.firebaseAuthRedux.uid;
      this.props.dispatchClaimReward(rewardID, userID, circleID);
    }
  }

  handleDeleteRewards(rewardID, circleID) {
    this.props.dispatchDeleteReward(rewardID);
  }

  handleLeaveCircle() {
    var currentCircle = this.props.firestoreCircleRedux[0];
    var auth = this.props.firebaseAuthRedux;
    var currentUserID = auth.uid;
    this.props.dispatchLeaveCircle(currentCircle.circleID, currentUserID);
    this.setState({
      leftCircle: true
    });
  }

  handleDisapproveTask(taskID) {
    console.log("disapproved task");
    this.props.dispatchDisapproveTask(taskID);
  }

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

    if (this.state.leftCircle) {
      return <Redirect to="/dashboard" />;
    }

    //IDEALLY allTasks should get all the tasks from a particular circle, without having to fetch all the tasks and filter out via circle ID
    //similarily, allUsers should only be all the users in this circle
    //isn't that bad security design?
    var allTasks = this.props.firestoreTasksRedux;
    var allUsers = this.props.firestoreUsersRedux;

    if (currentCircle && currentCircle.points) {
      // all users in current circle
      // all users, where their circleList include this circle
      // allUsers.map(user => {
      //   console.log(user.username);
      //   console.log(Object.keys(user.circleList).includes(currentCircle.id));
      // });
      var allUsersCurrentCircle = allUsers.filter(user => {
        return Object.keys(user.circleList).includes(currentCircle.id);
      });
      var allUsersCurrentCircleMap = {};
      allUsersCurrentCircle.map(
        user => (allUsersCurrentCircleMap[user.id] = user)
      );
      return (
        <div className="overallContainer">
          <div className="text-center">
            <div className="circle-name">{currentCircle.circleName}</div>
            <br />
            <div className="circle-info">
              Number of People: {currentCircle.numberOfPeople}
              <br />
              Current Points: {currentCircle.points[userID]}
            </div>
          </div>
          <div className="topButtons">
            <Button
              name="createTaskButton"
              onClick={this.handleClick}
              style={{ margin: "7.5px" }}
              size="lg"
              variant="outline-primary"
            >
              Create Task
            </Button>{" "}
            &nbsp;
            {isLeader ? (
              <div>
                <Button
                  name="inviteMembersButton"
                  onClick={this.handleClick}
                  style={{ margin: "7.5px" }}
                  size="lg"
                  variant="outline-primary"
                >
                  Invite Members
                </Button>
                &nbsp;
                <Button
                  name="promoteDemoteButton"
                  onClick={this.handleClick}
                  style={{ margin: "7.5px" }}
                  size="lg"
                  variant="outline-primary"
                >
                  Promote/Demote
                </Button>
                &nbsp;
                <Button
                  name="approveTasksButton"
                  onClick={this.handleClick}
                  style={{ margin: "7.5px" }}
                  size="lg"
                  variant="outline-primary"
                >
                  Approve Tasks
                </Button>
                &nbsp;
                <Button
                  name="createRewardsButton"
                  onClick={this.handleClick}
                  style={{ margin: "7.5px" }}
                  size="lg"
                  variant="outline-primary"
                >
                  Create Rewards
                </Button>
              </div>
            ) : (
              ""
            )}
            {!isLeader && (
              <Button
                variant="outline-danger"
                size="lg"
                style={{ margin: "7.5px" }}
                onClick={this.handleClick}
                name="leaveCircleButton"
              >
                Leave Circle
              </Button>
            )}
          </div>

          <CreateRewardsModal
            showCreateRewardsModal={this.state.showCreateRewardsModal}
            handleClose={this.handleClose}
            handleCreateRewards={this.handleCreateRewards}
            rewardsFormData={this.state}
            handleChangeInput={this.handleChangeInput}
          ></CreateRewardsModal>
          <ApproveTasksModal
            showApproveTasksModal={this.state.showApproveTasksModal}
            handleClose={this.handleClose}
            allTasks={allTasks}
            handleMoveTasks={this.handleMoveTasks}
            userID={userID}
            handleDisapproveTask={this.handleDisapproveTask}
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
            allUsersCurrentCircleMap={allUsersCurrentCircleMap}
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

          <Modal
            show={this.state.showLeaveCircleModal}
            onHide={this.handleClose}
          >
            <Modal.Header>
              <Modal.Title>Leave Circle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                You are about to leave this Circle. Are you sure you want to
                leave it?
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  style={{ margin: "10px 10px" }}
                  variant="outline-danger"
                  onClick={this.handleLeaveCircle}
                >
                  Yes, I would like to leave this Circle
                </Button>
                <Button
                  style={{ margin: "10px 10px" }}
                  variant="outline-success"
                  onClick={this.handleClose}
                >
                  No, I want to stay
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>

          <div className="centered">
            <CircleColumns
              allTasks={allTasks}
              handleMoveTasks={this.handleMoveTasks}
              userID={userID}
              deleteTask={this.deleteTask}
              allRewards={currentCircle.rewardsList}
              handleClaimRewards={this.handleClaimRewards}
              handleDeleteRewards={this.handleDeleteRewards}
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
      dispatch(updateCirclePromoteDemote(newCircleDetails)),
    dispatchCreateReward: reward => dispatch(createReward(reward)),
    dispatchClaimReward: (rewardID, userID, circleID) =>
      dispatch(claimReward(rewardID, userID, circleID)),
    dispatchDeleteReward: rewardID => dispatch(deleteReward(rewardID)),
    dispatchLeaveCircle: (circleID, userID) =>
      dispatch(leaveCircle(circleID, userID)),
    dispatchDisapproveTask: taskID => dispatch(disapproveTask(taskID))
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
    console.log(props);
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
