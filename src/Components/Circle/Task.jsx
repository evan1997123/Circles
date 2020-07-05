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
      assignedByMe,
    } = this.props;
    var ifExists = handleMoveTasks
      ? () => handleMoveTasks(task, userID)
      : () => "do nothing";
    const deleteButton = (
      <Button
        // className="deleteButton"
        onClick={() => deleteTask(task.id)}
        variant="outline-danger"
        style={{ margin: "5px 10px 5px 0" }}
      >
        Delete
      </Button>
    );
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
    // var assignedByMe = task.assignedByID === userID;

    console.log(this.props);

    return (
      <div className={classForTask} style={{ width: "100%" }}>
        <Card id="task-card">
          {/* <Card.Header as="h5">Task</Card.Header> */}
          <Card.Body style={{ width: "100%" }}>
            <Card.Title>{task.emoji + " " + task.taskName}</Card.Title>
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
            {task.taskStage === "toDo" && (
              <Card.Text style={{ color: "red" }}>
                <strong>Days Left</strong>: {numDaysLeft}
              </Card.Text>
            )}

            {!forNotification &&
              !forLeaderEdits &&
              buttonText &&
              buttonText !== "Requesting Approval" && (
                <Button
                  variant={"outline-primary"}
                  onClick={ifExists}
                  style={{ margin: "5px 10px 5px 0" }}
                >
                  {buttonText}
                </Button>
              )}

            {!forNotification &&
              !forLeaderEdits &&
              buttonText === "Requesting Approval" && (
                <Button
                  variant={"outline-primary"}
                  onClick={ifExists}
                  style={{ margin: "5px 10px 5px 0" }}
                  disabled
                >
                  {buttonText}
                </Button>
              )}

            {task.taskStage === "pending" && buttonText === "Approve" && (
              <Button
                variant="outline-danger"
                onClick={() => handleDisapproveTask(task.taskID)}
                style={{ margin: "5px 10px 5px 0" }}
              >
                Disapprove
              </Button>
            )}
            {!forNotification &&
              (isLeader || assignedByMe) &&
              task.taskStage === "toDo" &&
              forLeaderEdits &&
              task.recurring === "Yes" && (
                <Button
                  variant="outline-danger"
                  style={{ margin: "5px 10px 5px 0" }}
                  onClick={() =>
                    this.props.handleDeleteRecurringTasks(
                      task.recurringTaskNodeID
                    )
                  }
                >
                  Delete All Recurring
                </Button>
              )}
            {!forNotification &&
              (isLeader || assignedByMe) &&
              task.taskStage === "toDo" &&
              forLeaderEdits &&
              deleteButton}
            {!forNotification && forLeaderEdits && (
              <Button
                variant="outline-primary"
                onClick={() => handleEditTask(task.taskID)}
                style={{ margin: "5px 10px 5px 0" }}
              >
                Edit Task
              </Button>
            )}
            {forNotification && (
              <Button
                variant="outline-primary"
                onClick={() => handleDismiss(task)}
              >
                Dismiss
              </Button>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Task;
