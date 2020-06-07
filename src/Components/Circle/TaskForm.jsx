import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption) {
    selectedOption = JSON.parse(JSON.stringify(selectedOption));
    this.setState({
      selectedOption: selectedOption,
    });
    console.log("Option selected: " + JSON.stringify(selectedOption));
  }

  render() {
    let {
      handleCreateTask,
      handleChangeInput,
      formData,
      allUsers,
      currentCircle,
      editingTask,
    } = this.props;

    if (allUsers && currentCircle) {
      //get all member and leader objects
      var allIDInCircle = Object.keys(currentCircle.leaderList).concat(
        Object.keys(currentCircle.memberList)
      );

      //filter allUsers to only have those in the given circle
      var allUsersFiltered = allUsers.filter((user) =>
        allIDInCircle.includes(user.id)
      );

      var listOfUsers = [
        allUsersFiltered.map((user, index) => (
          <option value={user.id} key={index}>
            {user.firstName} {user.lastName}
          </option>
        )),
      ];
      listOfUsers.unshift(
        <option
          disabled
          hidden
          style={{ display: "none" }}
          value=""
          key={-1}
        ></option>
      );
    }
    var options = allUsersFiltered.map((userDetails) => {
      return {
        label: userDetails.firstName + " " + userDetails.lastName,
        value: userDetails.id,
      };
    });
    // const options = [
    //   { value: "chocolate", label: "Chocolate" },
    //   { value: "strawberry", label: "Strawberry" },
    //   { value: "vanilla", label: "Vanilla" },
    // ];
    const animatedComponents = makeAnimated();

    return (
      <Modal
        show={this.props.showCreateTaskModal}
        onHide={this.props.handleClose}
      >
        <Modal.Header>
          <Modal.Title>Create a New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form name="TaskForm">
            <Form.Label style={{ color: "red" }}>
              Note: all inputs are required.
            </Form.Label>
            <Form.Group>
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                required={true}
                type="text"
                name="taskName"
                placeholder="e.g. Finish part of homework 0"
                onChange={handleChangeInput}
                value={formData.taskName}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                required
                type="text"
                name="taskDescription"
                placeholder="e.g. Finish question 1-4"
                onChange={handleChangeInput}
                value={formData.taskDescription}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Assigned For</Form.Label>
              <Select
                options={options}
                isMulti={true}
                components={animatedComponents}
                onChange={this.handleChange}
                // name="assignedForIDs"
                // value={this.state.selectedOption}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Complete By</Form.Label>
              <Form.Control
                required={true}
                type="date"
                name="completeBy"
                placeholder="2020-01-01"
                onChange={handleChangeInput}
                value={formData.completeBy}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Reward</Form.Label>
              <Form.Control
                required
                type="number"
                name="reward"
                placeholder="e.g. 10"
                onChange={handleChangeInput}
                value={formData.reward}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Penalty (For Overdue Tasks)</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="e.g. 10"
                name="penalty"
                onChange={handleChangeInput}
                value={formData.penalty}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleClose}>Close</Button>
          <Button
            onClick={(e) =>
              this.props.handleCreateTask(e, this.state.selectedOption)
            }
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default TaskForm;
