import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./Task.css";

class Task extends React.Component {
  render() {
    let { task, color, userID, handleMoveTasks, buttonText } = this.props;
    var ifExists = handleMoveTasks
      ? () => handleMoveTasks(task, userID)
      : () => "do nothing";

    return (
      <div className="task">
        <Card style={{ width: "18rem" }} className="card">
          <Card.Body style={{ width: 450 }}>
            <Card.Title>{task.taskName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {task.assignedBy}
            </Card.Subtitle>
            <Card.Text>{task.taskDescription}</Card.Text>
            <Button variant={color} onClick={ifExists}>
              {buttonText}
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Task;
