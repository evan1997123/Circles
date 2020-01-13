import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

class TaskForm extends Component {
  render() {
    //this.props passes handleCreateTask, handleChangeInput, formData
    let {
      handleCreateTask,
      handleChangeInput,
      formData,
      allUsers
    } = this.props;

    if (allUsers) {
      var listOfUsers = [
        allUsers.map((user, index) => (
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
          {/* <Button type="submit">Submit</Button> */}
        </Form>
      </React.Fragment>
    );
  }
}

export default TaskForm;
