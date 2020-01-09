import React from "react";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import "./Notification.css";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfNotifications: [
        { id: 1, value: "Task 1 added" },
        { id: 2, value: "Task 2 added" },
        { id: 3, value: "Task 3 added" },
        { id: 4, value: "Task 4 added" },
        { id: 5, value: "Task 5 added" }
      ]
    };
    this.removeFromList = this.removeFromList.bind(this);
    this.restoreNotifications = this.restoreNotifications.bind(this);
  }

  removeFromList(id) {
    let copyList = [...this.state.listOfNotifications];
    copyList = copyList.filter(item => item.id !== id);
    this.setState({ listOfNotifications: copyList }, () => {
      // console.log(this.state.listOfNotifications);
    });
  }

  restoreNotifications() {
    let restore = [
      { id: 1, value: "Task 1 added" },
      { id: 2, value: "Task 2 added" },
      { id: 3, value: "Task 3 added" },
      { id: 4, value: "Task 4 added" },
      { id: 5, value: "Task 5 added" }
    ];
    this.setState({ listOfNotifications: restore });
  }

  render() {
    let notifications = this.state.listOfNotifications.map(notification => (
      <Toast
        key={notification.id}
        onClose={() => this.removeFromList(notification.id)}
      >
        <Toast.Header>
          {/* <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" /> */}
          <strong className="mr-auto">{notification.value}</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>
          A task was added, please click on the close button to make it
          disappear!
        </Toast.Body>
      </Toast>
    ));
    return (
      <div className="centerColumn">
        <h4>Notifications</h4>
        {notifications}
        <Button onClick={this.restoreNotifications}>Reset notifications</Button>
      </div>
    );
  }
}

export default Notification;
