import React from "react";
// import NotificationContainer from "../Components/Dashboard/NotificationContainer";
import TaskList from "./Tasklist";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./CircleHome.css";

class CircleHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: "",
      currentUserEmail: "",
      currentCircleName: "",
      toDoTasks: [
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
      ],
      pendingTasks: [
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
      ],
      completedTasks: [
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
      ],
      numberOfUnapprovedTasks: 4,
      show: false,
      isAuthed: this.props.isAuthed,
      currentUser: this.props.currentUser
    };
    this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
    this.getCurrentCircleName = this.getCurrentCircleName.bind(this);
    this.addToPendingTasks = this.addToPendingTasks.bind(this);
    this.removedFromToDo = this.removedFromToDo.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.removedFromTasksCompleted = this.removedFromTasksCompleted.bind(this);
  }

  componentDidMount() {
    this.getCurrentCircleName();
    this.getCurrentUserInfo();
    // this.setState({
    //   pendingTasks: [
    //     "Do your homework",
    //     "Wash the dishes",
    //     "Give your girlfriend attention",
    //     "Buy boba"
    //   ]
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isAuthed !== prevProps.isAuthed) {
      this.setState({
        isAuthed: this.props.isAuthed
      });
      this.getCurrentUserInfo();
    }
  }

  getCurrentUserInfo() {
    if (this.props.isAuthed === true) {
      this.setState({
        currentUser: this.props.currentUser.displayName,
        currentUserEmail: "evan@gmail.com"
      });
    } else {
      this.setState({
        currentUser: "Not Logged In",
        currentUserEmail: "NAN@gmail.com"
      });
    }
  }

  getCurrentCircleName() {
    this.setState({
      currentCircleName: "Pokemon Gym"
    });
  }

  addToPendingTasks(task) {
    let copyList = [...this.state.pendingTasks];
    copyList.push(task);
    this.setState({
      pendingTasks: copyList
    });
  }

  removedFromToDo(tasks) {
    this.setState({
      toDoTasks: tasks
    });
  }

  handleClose() {
    this.setState({
      show: false
    });
  }

  handleOpen() {
    this.setState({
      show: true
    });
  }

  removedFromTasksCompleted(tasks) {
    this.setState({
      completedTasks: tasks
    });
  }

  render() {
    let toDo = (
      <CircleColumn
        title="Tasks To Do"
        color="primary"
        button="Complete"
        tasks={this.state.toDoTasks}
        addToPendingTasks={this.addToPendingTasks}
        removedFromToDo={this.removedFromToDo}
      ></CircleColumn>
    );

    let pending = (
      <CircleColumn
        title="Pending Tasks"
        color="secondary"
        button="Request Approval"
        tasks={this.state.pendingTasks}
      ></CircleColumn>
    );

    let completed = (
      <CircleColumn
        title="Tasks Completed"
        color="success"
        button="Dismiss"
        tasks={this.state.completedTasks}
        removedFromTasksCompleted={this.removedFromTasksCompleted}
      ></CircleColumn>
    );

    return (
      <div className="overallContainer">
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Approve These Tasks</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="circleHomeTop">
          <div className="title">{this.state.currentCircleName}</div>

          <div className="subtitle">Total Members: </div>
          {this.state.currentUser}
          <Button id="topButton" onClick={this.handleOpen}>
            Unapproved Tasks: {this.state.numberOfUnapprovedTasks}
          </Button>
        </div>
        <div className="poop">
          {/* <CircleColumn
            title="Tasks To Do"
            color="primary"
            button="Complete"
            tasks={this.state.toDoTasks}
            addToPendingTasks={this.addToPendingTasks}
          ></CircleColumn>
          <CircleColumn
            title="Pending Tasks"
            color="secondary"
            button="Approve"
            tasks={this.state.pendingTasks}
          ></CircleColumn>
          <CircleColumn
            title="Tasks Completed"
            color="success"
            button="Dismiss"
            tasks={this.state.completedTasks}
          ></CircleColumn> */}
          {toDo}
          {pending}
          {completed}

          {/* <CircleColumn title="Pending Tasks"></CircleColumn>
          <CircleColumn title="Completed Tasks"></CircleColumn> */}
        </div>
        {/* {this.props.currentUserName} */}

        {/* {this.props.isAuthed
            ? this.props.currentUser
              ? this.props.currentUser.displayName
              : "Loading"
            : "Please log in"} */}
      </div>
    );
  }
}

export default CircleHome;
