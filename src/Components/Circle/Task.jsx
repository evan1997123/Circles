import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./Task.css";

class Task extends React.Component {
  render() {
    let {
      task,
      color,
      userID,
      handleMoveTasks,
      buttonText,
      deleteTask,
      forNotification,
      circleName,
      handleDismiss,
      handleDisapproveTask,
      isLeader,
      handleEditTask,
      forLeaderEdits,
    } = this.props;
    var ifExists = handleMoveTasks
      ? () => handleMoveTasks(task, userID)
      : () => "do nothing";
    const deleteButton =
      task.taskStage === "toDo" ? (
        <Button
          // className="deleteButton"
          onClick={() => deleteTask(task.id)}
          variant="outline-danger"
          style={{ marginRight: "10px" }}
        >
          Delete
        </Button>
      ) : null;
    // How many days left before this task is due?
    var completeBy = task.completeBy;
    var completeByYear = completeBy.slice(0, completeBy.indexOf("-"));
    completeBy = completeBy.slice(
      completeBy.indexOf("-") + 1,
      completeBy.length
    );
    var completeByMonth = completeBy.slice(0, completeBy.indexOf("-"));
    completeBy = completeBy.slice(
      completeBy.indexOf("-") + 1,
      completeBy.length
    );
    var completeByDay = completeBy;
    var currentDate = new Date();
    var numDaysLeft;
    completeByYear = parseInt(completeByYear);
    completeByMonth = parseInt(completeByMonth);
    completeByDay = parseInt(completeByDay);
    var completeByDate = new Date(
      completeByYear,
      completeByMonth - 1,
      completeByDay
    );
    var difference = completeByDate.getTime() - currentDate.getTime();
    numDaysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));
    // Display the Circle name if for notification purposes
    // Use different styling if this task is for notifications
    var displayCircleName;
    var classForTask = "task";
    if (forNotification) {
      displayCircleName = <Card.Text>Circle: {circleName}</Card.Text>;
      classForTask = "notification-task";
    }
    // Check if this task is assigned by yourself
    var assignedByMe = task.assignedByID === userID;

    return (
      <div className={classForTask} style={{ width: "100%" }}>
        <Card id="task-card">
          {/* <Card.Header as="h5">Task</Card.Header> */}
          <Card.Body style={{ width: "100%" }}>
            <Card.Title>{task.taskName}</Card.Title>
            {!forNotification && (
              <Card.Subtitle className="mb-2 text-muted">
                Assigned By: {task.assignedBy}
              </Card.Subtitle>
            )}
            {((task.taskStage === "pending" && buttonText === "Approve") ||
              forLeaderEdits) && (
              <Card.Subtitle className="mb-2 text-muted">
                Assigned For: {task.assignedFor}
              </Card.Subtitle>
            )}
            {forNotification && displayCircleName}
            {!forNotification && (
              <Card.Text>
                <strong>Task Description</strong>: {task.taskDescription}
              </Card.Text>
            )}
            <Card.Text>
              <strong>Complete By</strong>: {completeByDate.toDateString()}
            </Card.Text>
            <Card.Text>
              <strong>Points</strong>: {task.reward}
            </Card.Text>
            <Card.Text>
              <strong>Penalty</strong>: {task.penalty}
            </Card.Text>

            {!forNotification && !forLeaderEdits && (
              <Button
                variant={"outline-primary"}
                onClick={ifExists}
                style={{ marginRight: "10px" }}
              >
                {buttonText}
              </Button>
            )}
            {task.taskStage === "pending" && buttonText === "Approve" && (
              <Button
                variant="outline-danger"
                onClick={() => handleDisapproveTask(task.taskID)}
                style={{ marginRight: "10px" }}
              >
                Disapprove
              </Button>
            )}
            {!forNotification && (isLeader || assignedByMe) && deleteButton}
            {!forNotification &&
              (assignedByMe || forLeaderEdits) &&
              task.taskStage === "toDo" && (
                <Button
                  variant="outline-info"
                  onClick={() => handleEditTask(task.taskID)}
                >
                  Edit Task
                </Button>
              )}
            {forNotification && (
              <Button
                variant="outline-warning"
                onClick={() => handleDismiss(task)}
              >
                Dismiss
              </Button>
            )}
          </Card.Body>
          {task.taskStage === "toDo" && (
            <Card.Footer>
              <Card.Text style={{ color: "red" }}>
                Days Left: {numDaysLeft}
              </Card.Text>
            </Card.Footer>
          )}
        </Card>
      </div>
    );
  }
}

export default Task;
