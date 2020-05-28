//action creators that return an inner function that will be passed to the outer dispatch
//once the outer dispatch is called these will run

//action creator for creating a task and storing it in firestore database
//input: task data object
export const createTask = task => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
    //this is asynchronous and returns a Promise. This promise we can use then, which only fires when promise is returned
    // if an error, then it will catch and dispatch an error
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const assignedByID = getState().firebase.auth.uid;
    const fullName = profile.firstName + " " + profile.lastName;
    var assignedFor = "temp";
    firestore
      .collection("users")
      .doc(task.assignedForID)
      .get()
      .then(doc => {
        if (!doc.exists) {
          dispatch({
            type: "CREATE_TASK_ERROR",
            err: "couldn't find User corresponding to Task (i.e. assignedFor)"
          });
        } else {
          assignedFor = doc.data().firstName + " " + doc.data().lastName;
          const uuidv4 = require("uuid/v4");
          const uuid = uuidv4();
          var newTask = {
            ...task,
            createdDate: new Date(),
            assignedBy: fullName,
            assignedByID: assignedByID,
            assignedFor: assignedFor,
            taskStage: "toDo",
            taskID: uuid,
            dismissed: false
          };
          //add task to firestore, then
          //dispatch action again so be handled by TaskReducer.js

          firestore
            .collection("tasks")
            .doc(uuid)
            .set(newTask)
            .then(() => {
              dispatch({
                type: "CREATE_TASK",
                task: newTask
              });
            })
            .catch(err => {
              dispatch({
                type: "CREATE_TASK_ERROR",
                err: err
              });
            });
        }
      });
  };
};

//action creator for moving a task, i.e. modifying it's taskStage property in firestore database
//input: task data object
export const moveTask = (task, userID) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //console.log(task);
    //console.log(userID);

    const firestore = getFirestore();

    //delete bad tasks, display error
    if (typeof task.taskID === "undefined") {
      dispatch({
        type: "MOVE_TASK_ERROR",
        err: "taskID is undefined"
      });
    } else {
      if (task.taskStage === "toDo") {
        firestore
          .collection("tasks")
          .doc(task.taskID)
          .update({
            taskStage: "pending"
          })
          .then(() => {
            dispatch({
              type: "MOVE_TASK_TODO2PENDING",
              task: {
                ...task,
                taskStage: "pending"
              }
            });
          })
          .catch(err => {
            dispatch({
              type: "MOVE_TASK_ERROR",
              err: err
            });
          });
      } else if (task.taskStage === "pending") {
        //if the current logged in user is the one with accountability over this task
        if (userID === undefined) {
          dispatch({
            type: "MOVE_TASK_ERROR",
            err: "userID missing"
          });
        } else {
          // if (userID === task.assignedByID) {
          firestore
            .collection("tasks")
            .doc(task.taskID)
            .update({
              taskStage: "completed"
            })
            .then(() => {
              // // After moving the task to the completed stage I want to also give the user the points
              // var circleID = task.circleID;
              // var assignedForID = task.assignedForID;
              // firestore
              //   .collection("circles")
              //   .doc(circleID)
              //   .get()
              //   .then(doc => {
              //     // Update the points
              //     var circle = doc.data();
              //     var points = circle.points;
              //     var oldPoints = points[assignedForID];
              //     var newPoints = parseInt(oldPoints) + parseInt(task.reward);
              //     var updatedPoints = {
              //       ...points,
              //       [userID]: newPoints
              //     }
              //     firestore
              //       .collection("circles")
              //       .doc(circleID)
              //       .update({
              //         points: updatedPoints
              //       })
              //       .then(
              //         dispatch({
              //           type: "MOVE_TASK_PENDING2COMPLETED",
              //           task: {
              //             ...task,
              //             taskStage: "completed"
              //           }
              //         })
              //       )
              //   })
              dispatch({
                type: "MOVE_TASK_PENDING2COMPLETED",
                task: {
                  ...task,
                  taskStage: "completed"
                }
              });
            })
            .catch(err => {
              dispatch({
                type: "MOVE_TASK_ERROR",
                err: err
              });
            });

          // } else {
          //   console.log("sanity check");
          // }
        }
      } else if (task.taskStage === "completed") {
        firestore
          .collection("tasks")
          .doc(task.taskID)
          .update({
            taskStage: "dismissed"
          })
          .then(() => {
            // After moving the task to the completed stage I want to also give the user the points
            var circleID = task.circleID;
            var assignedForID = task.assignedForID;
            firestore
              .collection("circles")
              .doc(circleID)
              .get()
              .then(doc => {
                // Update the points
                var circle = doc.data();
                var points = circle.points;
                var oldPoints = points[assignedForID];
                var newPoints = oldPoints + task.reward;
                var updatedPoints = {
                  ...points,
                  [userID]: newPoints
                };
                firestore
                  .collection("circles")
                  .doc(circleID)
                  .update({
                    points: updatedPoints
                  })
                  .then(
                    dispatch({
                      type: "MOVE_TASK_COMPLETED2DISMISSED",
                      task: {
                        ...task,
                        taskStage: "dismissed"
                      }
                    })
                  );
              });
          })
          .catch(err => {
            dispatch({
              type: "MOVE_TASK_ERROR",
              err: err
            });
          });
      } else {
        dispatch({
          type: "MOVE_TASK_ERROR",
          err: "taskStage corrupted: " + task.taskStage
        });
      }
    }
  };
};

// Action creator for deleting a task
export const deleteTask = taskId => {
  // Pause dispatch
  // Make asynchronous call to firebase
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // Reference to firestore database
    const firestore = getFirestore();
    firestore
      .collection("tasks")
      .doc(taskId)
      .delete()
      .then(() => {
        // Resume dispatch
        dispatch({
          type: "DELETE_TASK"
        });
      })
      // Catch promise error
      .catch(err => {
        dispatch({
          type: "DELETE_TASK_ERROR",
          err
        });
      });
  };
};

export const disapproveTask = taskID => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("tasks")
      .doc(taskID)
      .update({
        taskStage: "toDo"
      })
      .then(() => {
        dispatch({
          type: "DISAPPROVE_TASK"
        });
      })
      .catch(err => {
        dispatch({
          type: "DISAPPROVE_TASK_ERROR",
          err
        });
      });
  };
};

export const editTask = newTaskDetails => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log(newTaskDetails);
    const firestore = getFirestore();
    firestore
      .collection("tasks")
      .doc(newTaskDetails.taskID)
      .update({
        circleID: newTaskDetails.circleID,
        taskName: newTaskDetails.taskName,
        assignedForID: newTaskDetails.assignedForID,
        taskDescription: newTaskDetails.taskDescription,
        reward: newTaskDetails.reward,
        completeBy: newTaskDetails.completeBy
      })
      .then(() => {
        dispatch({
          type: "EDIT_TASK"
        });
      })
      .catch(err => {
        dispatch({
          type: "EDIT_TASK_ERROR",
          err
        });
      });
  };
};

export const removeOverdueTasks = (deleteThisTaskID, userID, circleID) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    // Before removing the task, decrease the user's points
    firestore
      .collection("tasks")
      .doc(deleteThisTaskID)
      .get()
      .then(doc => {
        // Get the penalty associated with this task
        var taskDetails = doc.data();
        var penalty = taskDetails.penalty;
        // Update user's points in the Circle
        firestore
          .collection("circles")
          .doc(circleID)
          .get()
          .then(doc => {
            // Update user's points
            var circleDetails = doc.data();
            var oldPoints = circleDetails.points;
            var newPoints = {
              ...oldPoints,
              [userID]:
                oldPoints[userID] - penalty >= 0
                  ? oldPoints[userID] - penalty
                  : 0
            };
            // Update the Circle
            firestore
              .collection("circles")
              .doc(circleID)
              .update({
                points: newPoints
              })
              .then(() => {
                // Remove task
                firestore
                  .collection("tasks")
                  .doc(deleteThisTaskID)
                  .delete()
                  .then(() => {
                    dispatch({
                      type: "REMOVE_OVERDUE_TASKS"
                    });
                  })
                  .catch(err => {
                    dispatch({
                      type: "REMOVE_OVERDUE_TASKS_ERROR",
                      err
                    });
                  });
              })
              .catch(err => {
                dispatch({
                  type: "REMOVE_OVERDUE_TASKS_ERROR",
                  err
                });
              });
          })
          .catch(err => {
            dispatch({
              type: "REMOVE_OVERDUE_TASKS_ERROR",
              err
            });
          });
      })
      .catch(err => {
        dispatch({
          type: "REMOVE_OVERDUE_TASKS_ERROR",
          err
        });
      });
  };
};
