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
  disapproveTask,
  editTask,
  removeOverdueTasks
} from "../../Store/Actions/TaskActions";
import {
  updateCircleMembers,
  updateCirclePromoteDemote,
  leaveCircle,
  deleteCircle
} from "../../Store/Actions/CircleActions";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { Button, Modal, Dropdown } from "react-bootstrap";
import {
  createReward,
  claimReward,
  deleteReward
} from "../../Store/Actions/RewardActions";
import ViewMembersModal from "./ViewMembersModal";
import LeaderEditTasksModal from "./LeaderEditTasksModal";
import ViewRewardsHistoryModal from "./ViewRewardsHistoryModal";

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
      showViewMembersModal: false,
      showEditTaskModal: false,
      showLeaderEditTasksModal: false,
      showDeleteCircleModal: false,
      rewardTitle: "",
      rewardDescription: "",
      rewardPoints: "",
      leftCircle: false,
      recurringReward: "Yes", // All rewards are recurring by default
      editingTaskID: "",
      penalty: "", // For overdue tasks
      handledOverdue: false
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
    this.handleEditTask = this.handleEditTask.bind(this);
    this.handleSubmitEditedTask = this.handleSubmitEditedTask.bind(this);
    this.handleRemoveOverdueTasks = this.handleRemoveOverdueTasks.bind(this);
    this.handleDeleteCircle = this.handleDeleteCircle.bind(this);
  }

  componentDidUpdate() {
    var allTasks = this.props.firestoreTasksRedux;
    // console.log(allTasks);
    // console.log("handledOverdue");
    // console.log(this.state.handledOverdue);
    if (this.state.handledOverdue === false) {
      this.handleRemoveOverdueTasks();
    }
  }

  handleRemoveOverdueTasks() {
    // console.log("handle remove overdue tasks");
    // console.log("changing state");
    var allTasks = this.props.firestoreTasksRedux;
    var userID = this.props.firebaseAuthRedux.uid;
    var circleID;
    if (this.props.firestoreCircleRedux && this.props.firestoreCircleRedux[0]) {
      circleID = this.props.firestoreCircleRedux[0].circleID;
    }
    if (allTasks) {
      var tasksToDelete = [];
      for (var i = 0; i < allTasks.length; i++) {
        var task = allTasks[i];
        // console.log(task);
        // Compare current date with the task's completeBy date
        var currentDate = new Date();
        var taskDueDate = task.completeBy;
        var dueDateYear = taskDueDate.slice(0, taskDueDate.indexOf("-"));
        taskDueDate = taskDueDate.slice(
          taskDueDate.indexOf("-") + 1,
          taskDueDate.length
        );
        var dueDateMonth = taskDueDate.slice(0, taskDueDate.indexOf("-"));
        taskDueDate = taskDueDate.slice(
          taskDueDate.indexOf("-") + 1,
          taskDueDate.length
        );
        var dueDateDay = taskDueDate;
        dueDateYear = parseInt(dueDateYear);
        dueDateMonth = parseInt(dueDateMonth);
        dueDateDay = parseInt(dueDateDay);
        taskDueDate = new Date(
          dueDateYear,
          dueDateMonth - 1,
          dueDateDay,
          23,
          59,
          59
        );
        // console.log(taskDueDate);
        if (taskDueDate.getTime() - currentDate.getTime() < 0) {
          tasksToDelete.push(task);
        }
      }
      // console.log(tasksToDelete);
      for (var i = 0; i < tasksToDelete.length; i++) {
        // console.log("deleting this task");
        // console.log(tasksToDelete[i]);
        this.props.dispatchRemoveOverdueTasks(
          tasksToDelete[i].taskID,
          userID,
          circleID
        );
        this.setState({
          handledOverdue: true
        });
      }
    }
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
    // console.log(e.target.value);
  }

  //event handler for creating a task
  handleCreateTask(e) {
    e.preventDefault();
    if (
      this.state.taskName === "" ||
      this.state.assignedForID === "" ||
      this.state.taskDescription === "" ||
      this.state.completeBy === "" ||
      this.state.reward === "" ||
      this.state.penalty === ""
    ) {
      alert("All fields are required");
      return;
    } else if (this.state.reward < 0 || this.state.penalty < 0) {
      alert(
        "No negative values. Reward is how many points you will increase by. Penalty is how many points you will decrease by."
      );
      return;
    }
    //dispatch creation of task data object
    var taskDetails = {
      circleID: this.state.circleID,
      taskName: this.state.taskName,
      assignedForID: this.state.assignedForID,
      taskDescription: this.state.taskDescription,
      completeBy: this.state.completeBy,
      reward: this.state.reward === "" ? 0 : this.state.reward,
      penalty: this.state.penalty === "" ? 0 : this.state.penalty
    };
    this.props.dispatchCreateTask(taskDetails);

    var frm = document.getElementsByName("TaskForm")[0];
    frm.reset();
    this.setState({
      taskName: "",
      assignedForID: "",
      taskDescription: "",
      completeBy: "",
      reward: 0,
      penalty: 0,
      showCreateTaskModal: false,
      showInviteMembersModal: false,
      showPromoteDemoteModal: false,
      showApproveTasksModal: false,
      showViewMembersModal: false,
      showEditTaskModal: false
    });

    // After creating the task, also create the notification
  }

  //event handler for moving tasks to a different stage
  handleMoveTasks(task, userID) {
    //this.props.dispatchMoveTask();
    this.props.dispatchMoveTask(task, userID);
  }

  handleUpdateCircleMembers(newCircleDetails) {
    // console.log("updating circle");
    this.props.dispatchUpdateCircleMembers(newCircleDetails);
  }

  handlePromoteDemote(newCircleDetails) {
    console.log("promoting and demoting");
    this.props.dispatchUpdateCirclePromoteDemote(newCircleDetails);
  }

  // For showing modal (creating new task)
  handleClick = e => {
    console.log(e.target.name);
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
      case "viewMembersButton":
        this.setState({
          showViewMembersModal: true
        });
        return;
      case "editTasksButton":
        this.setState({
          showLeaderEditTasksModal: true
        });
        console.log("here");
        return;
      case "viewRewardsHistory":
        this.setState({
          showViewRewardsHistoryModal: true
        });
        return;
      case "deleteCircleButton":
        this.setState({
          showDeleteCircleModal: true
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
      showViewMembersModal: false,
      showEditTaskModal: false,
      showLeaderEditTasksModal: false,
      showViewRewardsHistoryModal: false,
      showDeleteCircleModal: false,
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
      rewardPoints: this.state.rewardPoints,
      recurringReward: this.state.recurringReward
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
      showCreateRewardsModal: false,
      recurringReward: "Yes"
    });
  }

  handleClaimRewards(rewardID, circleID, recurringReward) {
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
    // console.log(rewards);
    var currentRewardPoints = rewards[rewardID].rewardPoints;
    if (currentUserPoints < currentRewardPoints) {
      alert(
        "You don't have enough points to claim this reward. Try completing some tasks to earn some more points!"
      );
    } else {
      alert("You have claimed a reward!");
      var userID = this.props.firebaseAuthRedux.uid;
      this.props.dispatchClaimReward(rewardID, userID, circleID);
      // After the user claims the reward, if the reward is not a recurring reward, delete it
      if (recurringReward === "No") {
        this.props.dispatchDeleteReward(rewardID, circleID);
      }
    }
  }

  handleDeleteRewards(rewardID, circleID) {
    alert("You have deleted a reward!");
    this.props.dispatchDeleteReward(rewardID, circleID);
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

  handleDeleteCircle() {
    var currentCircle = this.props.firestoreCircleRedux[0];
    var allUsersCurrentCircle = this.props.firestoreUsersRedux.filter(user => {
      if (!user) {
        return false;
      }
      return Object.keys(user.circleList).includes(currentCircle.id);
    });
    var allUsersCurrentCircleMap = {};
    allUsersCurrentCircle.map(
      user => (allUsersCurrentCircleMap[user.id] = user)
    );
    var allTasksCurrentCircle = this.props.firestoreTasksRedux;
    // console.log("deleting circle");
    this.props.dispatchDeleteCircle(
      currentCircle.id,
      allUsersCurrentCircleMap,
      allTasksCurrentCircle
    );
  }

  handleDisapproveTask(taskID) {
    // console.log("disapproved task");
    this.props.dispatchDisapproveTask(taskID);
  }

  // When click on the edit button inside the task
  // Using this function to set the state so that the form autofills the information from before
  handleEditTask(taskID) {
    // console.log("edit task");
    // Edit the state of the Circle component to the current task info
    var allTasks = this.props.firestoreTasksRedux;
    const profileData = this.props.firebaseProfileRedux;
    var editTask;
    // Find the current task in the list of all tasks
    for (var i = 0; i < allTasks.length; i++) {
      var currentTask = allTasks[i];
      if (currentTask.taskID === taskID) {
        editTask = currentTask;
      }
    }
    // console.log(editTask);
    this.setState({
      taskName: editTask.taskName,
      taskDescription: editTask.taskDescription,
      assignedForID: editTask.assignedForID,
      reward: editTask.reward,
      showEditTaskModal: true,
      completeBy: editTask.completeBy,
      editingTaskID: editTask.taskID,
      penalty: editTask.penalty,
    });
  }

  // When submit the new edit
  handleSubmitEditedTask(e) {
    e.preventDefault();
    console.log("submit edited task");
    // Make sure all fields are filled out
    if (
      this.state.taskName === "" ||
      this.state.assignedForID === "" ||
      this.state.taskDescription === "" ||
      this.state.completeBy === "" ||
      this.state.reward === "" ||
      this.state.completeBy === ""
    ) {
      alert("All fields are required");
      return;
    }
    var newTaskDetails = {
      circleID: this.state.circleID,
      taskName: this.state.taskName,
      assignedForID: this.state.assignedForID,
      taskDescription: this.state.taskDescription,
      reward: this.state.reward === "" ? 0 : this.state.reward,
      taskID: this.state.editingTaskID,
      completeBy: this.state.completeBy
    };
    this.props.dispatchEditTask(newTaskDetails);
    // Find the form and reset form inputs
    var frm = document.getElementsByName("TaskForm")[0];
    frm.reset();
    this.setState({
      taskName: "",
      assignedForID: "",
      taskDescription: "",
      completeBy: "",
      reward: 0,
      editingTaskID: "",
      showCreateTaskModal: false,
      showInviteMembersModal: false,
      showPromoteDemoteModal: false,
      showApproveTasksModal: false,
      showViewMembersModal: false,
      showEditTaskModal: false
    });
  }

  render() {
    const auth = this.props.firebaseAuthRedux;
    const profileData = this.props.firebaseProfileRedux;
    const userID = auth.uid;
    var currentCircle;
    var isLeader = false;
    if (
      this.props.firestoreCircleRedux &&
      this.props.firestoreCircleRedux.length === 1 &&
      this.props.firestoreCircleRedux[0].circleID === this.props.match.params.id
    ) {
      currentCircle = this.props.firestoreCircleRedux[0];
      isLeader = Object.keys(currentCircle.leaderList).includes(userID)
        ? true
        : false;
    }

    //if not logged in, then redirect to signin page
    if (!userID) {
      return <Redirect to="/" />;
    }

    if (this.state.leftCircle) {
      console.log("left circle");
      return <Redirect to="/dashboard" />;
    }

    if (
      this.props.firestoreCircleRedux &&
      this.props.firestoreCircleRedux.length === 0
    ) {
      return <Redirect to="/error/invalidCircle" />;
    }
    //IDEALLY allTasks should get all the tasks from a particular circle, without having to fetch all the tasks and filter out via circle ID
    //similarily, allUsers should only be all the users in this circle
    //isn't that bad security design?
    var allTasks = this.props.firestoreTasksRedux;
    var allUsers = this.props.firestoreUsersRedux;

    // Find current user information
    if (allUsers) {
      // console.log(allUsers);
      var currentUser;
      for (var i = 0; i < allUsers.length; i++) {
        if (allUsers[i].id === userID) {
          currentUser = allUsers[i];
        }
      }
      // console.log(currentUser);
    }

    if (currentCircle && currentCircle.points && allUsers && allTasks) {
      // all users in current circle
      // all users, where their circleList include this circle
      // allUsers.map(user => {
      //   console.log(user.username);
      //   console.log(Object.keys(user.circleList).includes(currentCircle.id));
      // });
      var allUsersCurrentCircle = allUsers.filter(user => {
        if (!user) {
          return false;
        }
        return Object.keys(user.circleList).includes(currentCircle.id);
      });
      var allUsersCurrentCircleMap = {};
      allUsersCurrentCircle.map(
        user => (allUsersCurrentCircleMap[user.id] = user)
      );

      if (!Object.keys(allUsersCurrentCircleMap).includes(userID)) {
        return <Redirect to="/dashboard" />;
      }
      // Figure out which tasks were assigned by you (either leader or member)
      var needApproval = 0;
      var tasksAssignedByMe = allTasks.filter(task => {
        if (task.taskStage !== "toDo") {
          return false;
        } else if (task.assignedByID !== userID) {
          return false;
        } else {
          return true;
        }
      });
      needApproval = allTasks.filter(task => task.taskStage === "pending")
        .length;
    }

    // console.log(currentCircle.rewardsList);
    if (currentCircle) {
      return (
        <div className="overallContainer">
          <div className="text-center">
            <div className="circle-name">{currentCircle.circleName}</div>
            <br />
            <div className="circle-info">
              Number of People: {currentCircle.numberOfPeople} <br />
              Current Points: {currentCircle.points[userID]} <br />
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
            </Button>
            &nbsp;
            <Dropdown>
              <Dropdown.Toggle
                style={{ margin: "7.5px", height: "100%" }}
                size="lg"
                variant="success"
                id="dropdown-basic"
                variant={needApproval ? "outline-danger" : "outline-primary"}
              >
                Manage Tasks
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: "100%" }}>
                {isLeader ? (
                  <Button
                    name="approveTasksButton"
                    onClick={this.handleClick}
                    style={{ width: "100%", borderColor: "white" }}
                    size="lg"
                    variant={
                      needApproval ? "outline-danger" : "outline-primary"
                    }
                  >
                    Approve Tasks
                  </Button>
                ) : null}
                <Button
                  name="editTasksButton"
                  onClick={this.handleClick}
                  style={{ width: "100%", borderColor: "white" }}
                  size="lg"
                  variant="outline-primary"
                >
                  Edit Tasks
                </Button>
                <Button
                  style={{ width: "100%", borderColor: "white" }}
                  size="lg"
                  variant="outline-primary"
                >
                  Tasks History
                </Button>
              </Dropdown.Menu>
            </Dropdown>
            &nbsp;
            {isLeader ? (
              <Dropdown>
                <Dropdown.Toggle
                  style={{ margin: "7.5px", height: "100%" }}
                  size="lg"
                  variant="success"
                  id="dropdown-basic"
                  variant="outline-primary"
                >
                  Manage Users
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: "100%" }}>
                  <Button
                    variant="outline-primary"
                    style={{ width: "100%", borderColor: "white" }}
                    onClick={this.handleClick}
                    name="viewMembersButton"
                    size="lg"
                  >
                    View Users
                  </Button>
                  <Button
                    name="inviteMembersButton"
                    onClick={this.handleClick}
                    style={{ width: "100%", borderColor: "white" }}
                    size="lg"
                    variant="outline-primary"
                  >
                    Invite Members
                  </Button>
                  <Button
                    name="promoteDemoteButton"
                    onClick={this.handleClick}
                    style={{ width: "100%", borderColor: "white" }}
                    size="lg"
                    variant="outline-primary"
                  >
                    Promote/Demote
                  </Button>
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
            &nbsp;
            <Dropdown>
              <Dropdown.Toggle
                style={{ margin: "7.5px", height: "100%" }}
                size="lg"
                variant="success"
                id="dropdown-basic"
                variant="outline-primary"
              >
                Manage Rewards
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: "100%" }}>
                <Button
                  variant="outline-primary"
                  style={{ width: "100%", borderColor: "white" }}
                  size="lg"
                  name="viewRewardsHistory"
                  onClick={this.handleClick}
                >
                  Rewards History
                </Button>
                {isLeader ? (
                  <Button
                    name="createRewardsButton"
                    onClick={this.handleClick}
                    style={{ width: "100%", borderColor: "white" }}
                    size="lg"
                    variant="outline-primary"
                  >
                    Create Rewards
                  </Button>
                ) : null}
              </Dropdown.Menu>
            </Dropdown>
            {!isLeader ? (
              <Button
                variant="outline-danger"
                size="lg"
                style={{ margin: "7.5px" }}
                onClick={this.handleClick}
                name="leaveCircleButton"
              >
                Leave Circle
              </Button>
            ) : (
              <Button
                variant="outline-danger"
                size="lg"
                style={{ margin: "7.5px" }}
                onClick={this.handleClick}
                name="deleteCircleButton"
              >
                Delete Circle
              </Button>
            )}
          </div>
          <ViewRewardsHistoryModal
            showViewRewardsHistoryModal={this.state.showViewRewardsHistoryModal}
            handleClose={this.handleClose}
            rewardsHistory={
              currentCircle.rewardsHistoryForUsers
                ? currentCircle.rewardsHistoryForUsers[userID]
                : null
            }
            allRewards={currentCircle.rewardsList}
          ></ViewRewardsHistoryModal>
          <LeaderEditTasksModal
            showLeaderEditTasksModal={this.state.showLeaderEditTasksModal}
            handleClose={this.handleClose}
            tasksAssignedByMe={tasksAssignedByMe}
            allTasks={allTasks}
            handleEditTask={this.handleEditTask}
            deleteTask={this.deleteTask}
            userID={userID}
            isLeader={isLeader}
          ></LeaderEditTasksModal>
          <ViewMembersModal
            showViewMembersModal={this.state.showViewMembersModal}
            leaders={currentCircle.leaderList}
            members={currentCircle.memberList}
            handleClose={this.handleClose}
          ></ViewMembersModal>
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
            profileData={profileData}
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
          <Modal show={this.state.showEditTaskModal} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>Edit a Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TaskForm
                handleCreateTask={this.handleCreateTask}
                handleChangeInput={this.handleChangeInput}
                formData={this.state}
                allUsers={allUsers}
                userID={userID}
                currentCircle={currentCircle}
                editingTask={true}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose} variant="outline-danger">
                Cancel
              </Button>
              <Button
                onClick={this.handleSubmitEditedTask}
                variant="outline-primary"
              >
                Submit Edits
              </Button>
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
          <Modal
            show={this.state.showDeleteCircleModal}
            onHide={this.handleClose}
          >
            <Modal.Header>
              <Modal.Title>DELETE Circle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                You are about to DELETE this Circle. Are you sure you want to
                DELETE it?
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  style={{ margin: "10px 10px" }}
                  variant="outline-danger"
                  onClick={this.handleDeleteCircle}
                >
                  Yes, I would like to DELETE this
                </Button>
                <Button
                  style={{ margin: "10px 10px" }}
                  variant="outline-success"
                  onClick={this.handleClose}
                >
                  No, I want it
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
              isLeader={isLeader}
              handleEditTask={this.handleEditTask}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          Loading...{" "}
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      );
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
    firebaseAuthRedux: state.firebase.auth,
    firebaseProfileRedux: state.firebase.profile
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
    dispatchClaimReward: (rewardID, userID, circleID, recurringReward) =>
      dispatch(claimReward(rewardID, userID, circleID, recurringReward)),
    dispatchDeleteReward: (rewardID, circleID) =>
      dispatch(deleteReward(rewardID, circleID)),
    dispatchLeaveCircle: (circleID, userID) =>
      dispatch(leaveCircle(circleID, userID)),
    dispatchDisapproveTask: taskID => dispatch(disapproveTask(taskID)),
    dispatchEditTask: newTaskDetails => dispatch(editTask(newTaskDetails)),
    dispatchRemoveOverdueTasks: (deleteThisTaskID, userID, circleID) =>
      dispatch(removeOverdueTasks(deleteThisTaskID, userID, circleID)),
    dispatchDeleteCircle: (
      circleID,
      allUsersCurrentCircleMap,
      allTasksCurrentCircle
    ) =>
      dispatch(
        deleteCircle(circleID, allUsersCurrentCircleMap, allTasksCurrentCircle)
      )
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
    // console.log(props);
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
