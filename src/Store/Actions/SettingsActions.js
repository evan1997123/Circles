export const setFirstName = (firstname, uid) => {
    return (dispatch, getState, {
        getFirebase,
        getFirestore
    }) => {
        const firestore = getFirestore();
        firestore
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    // Do something
                } else {
                    // Get the task and update it
                    firestore
                        .collection("users")
                        .doc(uid)
                        .update({
                            firstName: firstname
                        })
                        .then(() => {
                            dispatch({
                                type: "SET_FIRSTNAME"
                            })
                        })
                        .catch(err => {
                            dispatch({
                                type: "SET_ERROR",
                                err: err
                            })
                        })
                }
            })
            .catch(err => {
                dispatch({
                    type: "SET_ERROR",
                    err: err
                })
            })
    }
}



export const setLastName = (lastname, uid) => {
    return (dispatch, getState, {
        getFirebase,
        getFirestore
    }) => {
        const firestore = getFirestore();
        firestore
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    // Do something
                } else {
                    // Get the task and update it
                    firestore
                        .collection("users")
                        .doc(uid)
                        .update({
                            lastName: lastname
                        })
                        .then(() => {
                            dispatch({
                                type: "SET_LASTNAME"
                            })
                        })
                        .catch(err => {
                            dispatch({
                                type: "SET_ERROR",
                                err: err
                            })
                        })
                }
            })
            .catch(err => {
                dispatch({
                    type: "SET_ERROR",
                    err: err
                })
            })
    }
}


export const setUsername = (username, uid) => {
    return (dispatch, getState, {
        getFirebase,
        getFirestore
    }) => {
        const firestore = getFirestore();
        firestore
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    // Do something
                } else {
                    // Get the task and update it
                    firestore
                        .collection("users")
                        .doc(uid)
                        .update({
                            username: username
                        })
                        .then(() => {
                            dispatch({
                                type: "SET_USERNAME"
                            })
                        })
                        .catch(err => {
                            dispatch({
                                type: "SET_ERROR",
                                err: err
                            })
                        })
                }
            })
            .catch(err => {
                dispatch({
                    type: "SET_ERROR",
                    err: err
                })
            })
    }
}