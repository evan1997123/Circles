export const dismissTask = task => {
    return (dispatch, getState, {
        getFirebase,
        getFirestore
    }) => {
        const firestore = getFirestore();
        firestore
            .collection("tasks")
            .doc(task.taskID)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    // Do something
                } else {
                    // Get the task and update it
                    firestore
                        .collection("tasks")
                        .doc(task.taskID)
                        .update({
                            dismissed: true
                        })
                        .then(() => {
                            dispatch({
                                type: "DISMISS_TASK"
                            })
                        })
                        .catch(err => {
                            dispatch({
                                type: "DISMISS_TASK_ERROR",
                                err: err
                            })
                        })
                }
            })
            .catch(err => {
                dispatch({
                    type: "DISMISS_TASK_ERROR",
                    err: err
                })
            })
    }
}