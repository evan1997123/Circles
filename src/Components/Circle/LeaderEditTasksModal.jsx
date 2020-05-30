import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Task from "./Task";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

class LeaderEditTasksModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAssignedByMe: true,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log("click");
    e.preventDefault();
    console.log(e.target.name);
    if (e.target.name === "me") {
      this.setState({
        displayAssignedByMe: true,
      });
    } else if (e.target.name === "otherLeaders") {
      this.setState({
        displayAssignedByMe: false,
      });
    }
  }

  render() {
    console.log("render");
    if (!this.props.tasksAssignedByMe) {
      return null;
    }
    var displayTheseTasks;
    if (!this.props.isLeader) {
      // Members should be able to see all tasks assigned by them
      displayTheseTasks = this.props.tasksAssignedByMe.map((task, index) => (
        <Task
          key={index}
          task={task}
          buttonText={"Edit"}
          forLeaderEdits={true}
          handleEditTask={this.props.handleEditTask}
          deleteTask={this.props.deleteTask}
          assignedByMe={true} // I need to pass this in as a prop because 
        ></Task>
      ));
    } else if (this.state.displayAssignedByMe && this.props.tasksAssignedByMe) {
      displayTheseTasks = this.props.tasksAssignedByMe.map((task, index) => (
        <Task
          key={index}
          task={task}
          buttonText={"Edit"}
          forLeaderEdits={true}
          handleEditTask={this.props.handleEditTask}
          deleteTask={this.props.deleteTask}
        ></Task>
      ));
    } else {
      displayTheseTasks = this.props.allTasks.filter((task) => {
        if (
          task.assignedByID !== this.props.userID &&
          task.taskStage === "pending"
        ) {
          return true;
        } else {
          return false;
        }
      });
      displayTheseTasks = displayTheseTasks.map((task, index) => (
        <Task
          key={index}
          task={task}
          buttonText={"Edit"}
          forLeaderEdits={true}
          handleEditTask={this.props.handleEditTask}
          deleteTask={this.props.deleteTask}
        ></Task>
      ));
    }
    console.log("edit tasks");
    return (
      <Modal
        show={this.props.showLeaderEditTasksModal}
        onHide={this.props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Assigned Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.isLeader && (
            <DropdownButton
              id="dropdown-basic-button"
              title="View Tasks Assigned By "
              variant="outline-primary"
            >
              <Dropdown.Item
                name="me"
                onClick={this.handleClick}
                href="#/action-1"
              >
                You
              </Dropdown.Item>
              <Dropdown.Item
                name="otherLeaders"
                onClick={this.handleClick}
                href="#/action-2"
              >
                Other Leaders
              </Dropdown.Item>
            </DropdownButton>
          )}
          {displayTheseTasks.length > 0 && displayTheseTasks}
          {displayTheseTasks.length === 0 && this.state.displayAssignedByMe && (
            <p>
              You haven't assigned any tasks yet, try assigning a task to the
              members of this Circle and come back here to view it 🤗
            </p>
          )}
          {displayTheseTasks.length === 0 &&
            !this.state.displayAssignedByMe && (
              <p>
                The other leaders of this Circle haven't assigned any tasks yet,
                try asking them to assign a task to the members of this Circle
                and come back here to view it 🤗
              </p>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={this.props.handleClose}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default LeaderEditTasksModal;
