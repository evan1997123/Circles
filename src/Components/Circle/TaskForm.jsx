import React, { Component } from "react";
class TaskForm extends Component {
  render() {
    //this.props passes handleCreateTask, handleChangeInput, formData
    let {
      handleCreateTask,
      handleChangeInput,
      formData,
      allUsers,
      userID
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
        <form name="TaskForm" onSubmit={handleCreateTask}>
          <label>Task Name</label>
          <input
            type="text"
            name="taskName"
            placeholder="Finish Homework 0"
            onChange={handleChangeInput}
            value={formData.taskName}
          />
          <br />

          <label>Assigned For</label>
          <select
            name="assignedForID"
            onChange={handleChangeInput}
            value={formData.assignedForID}
          >
            {listOfUsers}
          </select>
          <br />

          <label>Complete By</label>
          <input
            type="date"
            name="completeBy"
            placeholder="2020-01-01"
            onChange={handleChangeInput}
            value={formData.completeBy}
          />
          <br />

          <label>Reward</label>
          <input
            type="number"
            name="reward"
            placeholder="10"
            onChange={handleChangeInput}
            value={formData.reward}
          />
          <br />

          <label>Task Description</label>
          <input
            type="text"
            name="taskDescription"
            placeholder="Task Description"
            onChange={handleChangeInput}
            style={{
              width: 500
            }}
            value={formData.taskDescription}
          />
          <br />

          <button type="submit">Submit</button>
        </form>
      </React.Fragment>
    );
  }
}

export default TaskForm;
