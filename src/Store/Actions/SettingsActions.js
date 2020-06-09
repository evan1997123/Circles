export const setUsername = (username, uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
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
                    });
                  })
                  .catch(err => {
                    dispatch({
                      type: "SET_ERROR",
                      err: err
                    });
                  });
              }
            })
            .catch(err => {
              dispatch({
                type: "SET_ERROR",
                err: err
              });
            });
        }
      });
  };
};

export const setFirstName = (firstname, uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
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
              });
            })
            .catch(err => {
              dispatch({
                type: "SET_ERROR",
                err: err
              });
            });
        }
      })
      .catch(err => {
        dispatch({
          type: "SET_ERROR",
          err: err
        });
      });
  };
};

export const setLastName = (lastname, uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
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
              });
            })
            .catch(err => {
              dispatch({
                type: "SET_ERROR",
                err: err
              });
            });
        }
      })
      .catch(err => {
        dispatch({
          type: "SET_ERROR",
          err: err
        });
      });
  };
};

export const setEmail = (email, uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
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
      .currentUser.updateEmail(email)
      .then(() => {
        dispatch({ type: "SET_EMAIL" });
      })
      .catch(err => {
        dispatch({ type: "SET_ERROR", err: err });
      });
  };
};

export const setPassword = (password, uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
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
      .currentUser.updatePassword(password)
      .then(() => {
        dispatch({ type: "SET_PASSWORD" });
      })
      .catch(err => {
        dispatch({ type: "SET_ERROR", err: err });
      });
  };
};

export const updateSettings = (newSettings, oldSettings, uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    var letters = /^[a-zA-Z0-9]+$/;
    //check password and passwordConfirmation are the same
    var error = false;
    if (newSettings.confirmPassword !== newSettings.password) {
      dispatch({
        type: "UPDATE_SETTINGS_ERROR",
        err: {
          message: "Passwords do not match"
        }
      });
      return;
    }
    if (!newSettings.username || !newSettings.email) {
      dispatch({
        type: "UPDATE_SETTINGS_ERROR",
        err: {
          message: "No empty fields unless you're not changing your password."
        }
      });
      return;
    }
    if (newSettings.username.length < 6 || newSettings.username.length > 24) {
      error = true;
      dispatch({
        type: "UPDATE_SETTINGS_ERROR",
        err: {
          message:
            "Username must be atleast 6 character and less than 24 character"
        }
      });
      return;
    } else if (newSettings.username.includes(" ")) {
      error = true;
      dispatch({
        type: "UPDATE_SETTINGS_ERROR",
        err: { message: "Username must not include any spaces" }
      });
      return;
    } else if (!newSettings.username.match(letters)) {
      error = true;
      dispatch({
        type: "UPDATE_SETTINGS_ERROR",
        err: { message: "Username can only include letters and numbers" }
      });
      return;
    }

    if (newSettings.password !== "") {
      console.log(newSettings.password);
      firebase
        .auth()
        .currentUser.updatePassword(newSettings.password)
        .then(() => {
          dispatch({ type: "SET_PASSWORD" });
          if (!error) {
            dispatch({
              type: "UPDATED_USER_SETTINGS_SUCCESS"
            });
          }
        })
        .catch(err => {
          error = true;
          dispatch({ type: "UPDATE_SETTINGS_ERROR", err: err });
        });
    } else {
      if (!error) {
        dispatch({
          type: "UPDATED_USER_SETTINGS_SUCCESS"
        });
      }
    }

    if (oldSettings.email !== newSettings.email) {
      firebase
        .auth()
        .currentUser.updateEmail(newSettings.email)
        .then(() => {
          dispatch({ type: "SET_EMAIL" });
          if (!error) {
            dispatch({
              type: "UPDATED_USER_SETTINGS_SUCCESS"
            });
          }
        })
        .catch(err => {
          error = true;
          dispatch({ type: "UPDATE_SETTINGS_ERROR", err: err });
        });
    } else {
      if (!error) {
        dispatch({
          type: "UPDATED_USER_SETTINGS_SUCCESS"
        });
      }
    }

    if (oldSettings.username !== newSettings.username) {
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
                username: newSettings.username
              })
              .then(() => {
                if (!error) {
                  dispatch({
                    type: "UPDATED_USER_SETTINGS_SUCCESS"
                  });
                }
              })
              .catch(err => {
                error = true;
                dispatch({
                  type: "UPDATE_SETTINGS_ERROR",
                  err: err
                });
              });
          }
        })
        .catch(err => {
          error = true;
          dispatch({
            type: "UPDATE_SETTINGS_ERROR",
            err: err
          });
        });
    } else {
      if (!error) {
        dispatch({
          type: "UPDATED_USER_SETTINGS_SUCCESS"
        });
      }
    }
  };
};
