import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./Task.css";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(task) {
    this.props.change(task);
  }

  render() {
    var cardWidth = {
      width: 450
    };
    return (
      // <div className="parent">
      //   <div className="child1">
      //     <div className="taskTitle">
      //       <h4>{this.props.title}Stop drinking boba</h4>
      //     </div>
      //     <div className="taskInfo">
      //       <h4>{this.props.details}Information</h4>
      //     </div>
      //   </div>
      // </div>
      <div className="task">
        <Card style={{ width: "18rem" }} className="card">
          <Card.Body style={cardWidth}>
            <Card.Title>{this.props.task.taskName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {/* Assigned by: Christine */}
              {this.props.task.assignedBy}
            </Card.Subtitle>
            <Card.Text>
              {/* Some quick example text to build on the card title and make up the
              bulk of the card's content. */}
              {this.props.task.taskDescription}
            </Card.Text>
            <Button
              variant={this.props.color}
              onClick={() => this.handleChange(this.props.task)}
            >
              {this.props.button}
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Task;
