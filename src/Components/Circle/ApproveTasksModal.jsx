import React, { Component } from "react";
import { Modal, Button, DropdownButton, Dropdown } from "react-bootstrap";
import CircleColumn from "./CircleColumn";

class ApproveTasksModal extends Component {
  render() {
    var rTasks;
    if (this.props.allTasks) {
      rTasks = this.props.allTasks.filter(
        (task) => task.taskStage === "pending"
      );
    }

    return (
      <div>
        <Modal
          show={this.props.showApproveTasksModal}
          onHide={this.props.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Approve Tasks</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {rTasks && rTasks.length > 0 ? (
              <CircleColumn
                title="Requests"
                color="outline-success"
                buttonText="Approve"
                tasks={rTasks}
                handleMoveTasks={this.props.handleMoveTasks}
                userID={this.props.userID}
                handleDisapproveTask={this.props.handleDisapproveTask}
              ></CircleColumn>
            ) : (
              <p>
                You don't have any requests yet, maybe try assigning more tasks?
              </p>
            )}
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ApproveTasksModal;
