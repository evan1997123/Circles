import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class CreateRewardsModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.showCreateRewardsModal}
        onHide={this.props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a Reward</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form name="createRewardForm">
            <Form.Label>Please enter a value for all fields</Form.Label>
            <Form.Group controlId="formTitle">
              <Form.Label>Reward Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="rewardTitle"
                value={this.props.rewardsFormData.rewardTitle}
                onChange={this.props.handleChangeInput}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                name="rewardDescription"
                value={this.props.rewardsFormData.rewardDescription}
                onChange={this.props.handleChangeInput}
              />
            </Form.Group>
            <Form.Group controlId="formPoints">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter points"
                name="rewardPoints"
                value={this.props.rewardsFormData.rewardPoints}
                onChange={this.props.handleChangeInput}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.handleClose}>Close</Button>
          <Button
            variant="primary"
            type="submit"
            onClick={this.props.handleCreateRewards}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CreateRewardsModal;
