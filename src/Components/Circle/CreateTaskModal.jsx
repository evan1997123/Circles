import React, { Component } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "./CreateTaskModal.css";
import Picker from "emoji-picker-react";

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: [],
      selectedDays: [],
      currentDay: new Date(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(selectedOption) {
    selectedOption = JSON.parse(JSON.stringify(selectedOption));
    this.setState({
      selectedOption: selectedOption,
    });
    console.log("Option selected: " + JSON.stringify(selectedOption));
  }

  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays });
  }

  handleSubmit(e) {
    this.props.handleCreateTask(
      e,
      this.state.selectedOption,
      this.state.selectedDays
    );
    this.setState({
      selectedDays: [],
    });
  }

  handleClose() {
    this.props.handleClose();
    this.setState({
      selectedDays: [],
    });
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

    console.log(this.props);

    var isRecurring = formData.recurring;

    if (allUsers && currentCircle) {
      var allIDInCircle = Object.keys(currentCircle.leaderList).concat(
        Object.keys(currentCircle.memberList)
      );

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
    const animatedComponents = makeAnimated();

    var month = new Date(
      this.state.currentDay.getFullYear(),
      this.state.currentDay.getMonth()
    );
    var fromMonth = month;
    var disabledDays = [
      {
        before: this.state.currentDay,
      },
    ];
    if (this.state.selectedDays.length > 0) {
      var firstSelectedDay = this.state.selectedDays[0];
      var twoWeeksAfterDay = new Date();
      twoWeeksAfterDay.setDate(firstSelectedDay.getDate() + 14);
      var toMonth = new Date(
        firstSelectedDay.getFullYear(),
        firstSelectedDay.getMonth() + 1
      );
      disabledDays = [
        {
          before: firstSelectedDay,
          after: twoWeeksAfterDay,
        },
      ];
      console.log(twoWeeksAfterDay);
    }

    var showEmojiPickerDisplay = !this.props.showEmojiPicker
      ? { display: "none" }
      : {};

    return (
      <div>
        <Modal
          show={this.props.showModal}
          onHide={this.handleClose}
          dialogClassName="modal-width"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.editingTask ? "Edit Task" : "Create a New Task 🌟"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="TaskForm">
              <Form.Label style={{ color: "red", fontWeight: "bold" }}>
                Note: all inputs are required.
              </Form.Label>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>
                    <strong>Task Name 💭</strong>
                  </Form.Label>
                  <Form.Control
                    required={true}
                    type="text"
                    name="taskName"
                    placeholder="e.g. Finish part of homework 0"
                    onChange={handleChangeInput}
                    value={formData.taskName}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>
                    <strong>Assigned For 🤗</strong>
                  </Form.Label>
                  <Select
                    options={options}
                    isMulti={true}
                    components={animatedComponents}
                    onChange={this.handleChange}
                    // name="assignedForIDs"
                    // value={this.state.selectedOption}
                    isDisabled={this.props.editingTask ? true : false}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Form.Label>
                  <strong>Task Description 📝</strong>
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="taskDescription"
                  placeholder="e.g. Finish question 1-4"
                  onChange={handleChangeInput}
                  value={formData.taskDescription}
                />
              </Form.Group>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>
                    <strong>Reward 💵</strong>
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="reward"
                    placeholder="e.g. 10"
                    onChange={handleChangeInput}
                    value={formData.reward}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>
                    <strong>Penalty (For Overdue Tasks) 😢</strong>
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="e.g. 10"
                    name="penalty"
                    onChange={handleChangeInput}
                    value={formData.penalty}
                  ></Form.Control>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>
                    <strong>
                      Would you like to make this a recurring task? Once you
                      select a date, you will be limited to dates within a{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        two-week period
                      </span>{" "}
                      starting from the first day selected 🙃
                    </strong>
                  </Form.Label>
                  {this.props.editingTask && !formData.recurring && (
                    <Form.Control
                      as="select"
                      onChange={handleChangeInput}
                      name="recurring"
                      disabled
                    >
                      <option selected>No</option>
                      <option>Yes</option>
                    </Form.Control>
                  )}
                  {this.props.editingTask && formData.recurring && (
                    <Form.Control
                      as="select"
                      onChange={handleChangeInput}
                      name="recurring"
                      disabled
                    >
                      <option>No</option>
                      <option selected>Yes</option>
                    </Form.Control>
                  )}
                  {!this.props.editingTask && (
                    <Form.Control
                      as="select"
                      onChange={handleChangeInput}
                      name="recurring"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </Form.Control>
                  )}
                  {!this.props.editingTask && formData.recurring === "Yes" && (
                    <div>
                      <br></br>
                      <Form.Label>
                        <strong>
                          Please select your desired due dates for this
                          recurring task on the calendar on the left 🗓
                        </strong>
                      </Form.Label>
                    </div>
                  )}
                </Form.Group>
                <Form.Group as={Col}>
                  {((!this.props.editingTask && formData.recurring === "No") ||
                    (this.props.editingTask &&
                      !formData.recurring === "Yes")) && (
                    <div>
                      <Form.Label>
                        <strong>Complete By ⏰</strong>
                      </Form.Label>
                      <Form.Control
                        required={true}
                        type="date"
                        name="completeBy"
                        placeholder="2020-01-01"
                        onChange={handleChangeInput}
                        value={formData.completeBy}
                        style={{ fontFamily: "Montserrat" }}
                      ></Form.Control>
                    </div>
                  )}
                  {((!this.props.editingTask && formData.recurring === "Yes") ||
                    (this.props.editingTask &&
                      formData.recurring === "Yes")) && (
                    <div
                      style={{ textAlign: "center", fontFamily: "Montserrat" }}
                    >
                      <DayPicker
                        selectedDays={this.state.selectedDays}
                        onDayClick={this.handleDayClick}
                        month={month}
                        fromMonth={fromMonth}
                        toMonth={toMonth}
                        fixedWeeks
                        disabledDays={disabledDays}
                      />
                    </div>
                  )}
                </Form.Group>
              </Form.Row>
            </Form>
            {!this.props.showEmojiPicker && (
              <Button
                variant="outline-primary"
                onClick={this.props.handleClick}
                style={{ marginBottom: "10px" }}
                name="showEmojiPicker"
              >
                Optional: select an emoji for this task 🥳
              </Button>
            )}
            {this.props.showEmojiPicker && (
              <Button
                variant="outline-primary"
                onClick={this.props.handleClick}
                style={{ marginBottom: "10px" }}
                name="showEmojiPicker"
              >
                Nah, I don't want an emoji for this task 👻
              </Button>
            )}
            <Form.Row style={showEmojiPickerDisplay}>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>
                    Select an emoji for the task on the left 👉 Your selected
                    emoji is displayed below ⤵️
                  </strong>
                </Form.Label>
                <div
                  style={{
                    height: "100%",
                    textAlign: "center",
                    fontSize: "8rem",
                    marign: "auto",
                  }}
                >
                  {formData.selectedEmoji}
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Picker
                  preload={false}
                  onEmojiClick={this.props.handleSelectedEmoji}
                  style={{ width: "100% !important" }}
                />
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            {/* <Picker
                    onEmojiClick={(event, emojiObject) =>
                      console.log(emojiObject)
                    }
                    preload={false}
                  /> */}
            {isRecurring && this.props.editingTask && (
              <Button
                variant="outline-primary"
                onClick={this.props.handleSubmitEditedTaskForAllRecurring}
              >
                Submit For All Recurring
              </Button>
            )}
            <Button
              variant="outline-primary"
              onClick={
                this.props.editingTask
                  ? this.props.handleSubmitEditedTask
                  : (e) => this.handleSubmit(e)
              }
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default TaskForm;
