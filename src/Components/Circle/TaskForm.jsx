import React, { Component } from "react";
import { Form } from "react-bootstrap";

class TaskForm extends Component {
  render() {
    //this.props passes handleCreateTask, handleChangeInput, formData
    let {
      handleCreateTask,
      handleChangeInput,
      formData,
      allUsers,
      currentCircle
    } = this.props;

    if (allUsers && currentCircle) {
      //get all member and leader objects
      var allIDInCircle = Object.keys(currentCircle.leaderList).concat(
        Object.keys(currentCircle.memberList)
      );

      //filter allUsers to only have those in the given circle
      var allUsersFiltered = allUsers.filter(user =>
        allIDInCircle.includes(user.id)
      );

      var listOfUsers = [
        allUsersFiltered.map((user, index) => (
          <option value={user.id} key={index}>
            {user.firstName} {user.lastName}
          </option>
        ))
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

    return (
      <React.Fragment>
        <Form name="TaskForm" onSubmit={handleCreateTask}>
          <Form.Group>
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              required={true}
              type="text"
              name="taskName"
              placeholder="Finish Homework 0"
              onChange={handleChangeInput}
              value={formData.taskName}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Assigned For</Form.Label>
            <Form.Control
              required={true}
              as="select"
              name="assignedForID"
              onChange={handleChangeInput}
              value={formData.assignedForID}
            >
              {listOfUsers}
            </Form.Control>
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
              placeholder="10"
              onChange={handleChangeInput}
              value={formData.reward}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              required
              type="text"
              name="taskDescription"
              placeholder="Task Description"
              onChange={handleChangeInput}
              // style={{
              //   width: 500
              // }}
              value={formData.taskDescription}
            />
          </Form.Group>
        </Form>
      </React.Fragment>
    );
  }
}

export default TaskForm;
