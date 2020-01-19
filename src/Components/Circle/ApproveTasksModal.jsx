import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import CircleColumn from "./CircleColumn";

class ApproveTasksModal extends Component {
  render() {
    var rTasks;
    if (this.props.allTasks) {
      rTasks = this.props.allTasks.filter(
        task =>
          task.taskStage === "pending" &&
          task.assignedByID === this.props.userID
      );
    }

    return (
      <div>
        <Modal
          show={this.props.showApproveTasksModal}
          onHide={this.props.handleClose}
        >
          <Modal.Header>
            <Modal.Title>Approve Tasks</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <CircleColumn
              title="Requests"
              color="secondary"
              buttonText="Approve"
              tasks={rTasks}
              handleMoveTasks={this.props.handleMoveTasks}
              userID={this.props.userID}
            ></CircleColumn>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ApproveTasksModal;
