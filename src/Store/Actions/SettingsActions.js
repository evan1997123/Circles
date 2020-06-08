export const setUsername = (username, uid) => {
    return (dispatch, getState, {
        getFirebase,
        getFirestore
    }) => {
        if (!username) {
            dispatch({
              type: "SET_ERROR",
              err: {
                message: "Please fill out field"
              }
            });
            return;
        }

        const firestore = getFirestore();


        const temp = firestore
        .collection("users")
        .where("username", "==", username)
        .get()
        .then(snapshot => {
          if (snapshot.empty == false) {
            dispatch({
              type: "SET_ERROR",
              err: { message: "That username has already been taken." }
            });
          } else {
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
            });
          }
        });

    }
}

export const setFirstName = (firstname, uid) => {
    return (dispatch, getState, {
        getFirebase,
        getFirestore
    }) => {


        if (!firstname) {
            dispatch({
              type: "SET_ERROR",
              err: {
                message: "Please fill out field"
              }
            });
            return;
        }


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
        
        if (!lastname) {
            dispatch({
              type: "SET_ERROR",
              err: {
                message: "Please fill out field"
              }
            });
            return;
        } 
        
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


export const setEmail = (email, uid) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        
        if (!email) {
            dispatch({
              type: "SET_ERROR",
              err: {
                message: "Please fill out field"
              }
            });
            return;
        } 
        firebase
            .auth()
            .currentUser
            .updateEmail(email)
            .then(() => {
            dispatch({ type: "SET_EMAIL" });
            })
            .catch(err => {
            dispatch({ type: "SET_ERROR", err: err });
            });
    }
}


export const setPassword = (password, uid) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        
        if (!password) {
            dispatch({
              type: "SET_ERROR",
              err: {
                message: "Please fill out field"
              }
            });
            return;
        } 
        firebase
            .auth()
            .currentUser
            .updatePassword(password)
            .then(() => {
            dispatch({ type: "SET_PASSWORD" });
            })
            .catch(err => {
            dispatch({ type: "SET_ERROR", err: err });
            });
    }
}