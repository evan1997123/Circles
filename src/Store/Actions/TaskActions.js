export const createTask = task => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
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
            err: "couldn't find assignedFor User"
          });
        } else {
          assignedFor = doc.data().firstName + " " + doc.data().lastName;
          var newTask = {
            ...task,
            createdAt: new Date(),
            assignedBy: fullName,
            assignedByID: assignedByID,
            assignedFor: assignedFor,
            taskStage: "toDo"
          };
          //this is asynchronous and returns a Promise. This promise we can use .then, which only fires when promise is returned
          // if an error, then it will catch and dispatch an error
          firestore
            .collection("tasks")
            .add(newTask)
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
          //dispatch action again and it goes to TaskReducer.js
        }
      });
    // var newTask = {
    //   ...task,
    //   createdAt: new Date(),
    //   assignedBy: fullName,
    //   assignedByID: assignedByID,
    //   assignedFor: assignedFor
    // };
    // //this is asynchronous and returns a Promise. This promise we can use .then, which only fires when promise is returned
    // // if an error, then it will catch and dispatch an error
    // firestore
    //   .collection("tasks")
    //   .add(newTask)
    //   .then(() => {
    //     dispatch({
    //       type: "CREATE_TASK",
    //       task: newTask
    //     });
    //   })
    //   .catch(err => {
    //     dispatch({
    //       type: "CREATE_TASK_ERROR",
    //       err: err
    //     });
    //   });
    // //dispatch action again and it goes to TaskReducer.js
  };
};
