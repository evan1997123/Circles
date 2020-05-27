import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Task from "./Task";

class LeaderEditTasksModal extends Component {
  render() {
    if (! this.props.tasksAssignedByMe) {
      return null;
    }
    // console.log(this.props.tasksAssignedByMe);
    var tasksAssignedByMe = this.props.tasksAssignedByMe.map((task, index) => (
      <Task
        key={index}
        task={task}
        buttonText={"Edit"}
        forLeaderEdits={true}
        handleEditTask={this.props.handleEditTask}
        deleteTask={this.props.deleteTask}
      ></Task>
    ));
    return (
      <Modal
        show={this.props.showLeaderEditTasksModal}
        onHide={this.props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Assigned Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tasksAssignedByMe.length > 0 ? (
            tasksAssignedByMe
          ) : (
            <p>
              You haven't assigned any tasks yet, try assigning a task to the
              members of this Circle and come back here to view it 🤗
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
