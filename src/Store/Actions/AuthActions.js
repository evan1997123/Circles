export const signIn = credentials => {
  return (dispatch, getState, {
    getFirebase
  }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({
          type: "LOGIN_SUCCESS"
        });
      })
      .catch(err => {
        dispatch({
          type: "LOGIN_ERROR",
          err: err
        });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, {
    getFirebase
  }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({
          type: "SIGN_OUT_SUCCESS"
        });
      });
  };
};

export const signUp = newUser => {
  return (dispatch, getState, {
    getFirebase,
    getFirestore
  }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    //check all fields have been filled out
    console.log(newUser);
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.username ||
      !newUser.password ||
      !newUser.email ||
      !newUser.passwordConfirmation
    ) {
      dispatch({
        type: "SIGN_UP_ERROR",
        err: {
          message: "Please fill out all fields"
        }
      });
      return;
    }

    //check password and passwordConfirmation are the same
    if (newUser.passwordConfirmation !== newUser.password) {
      dispatch({
        type: "SIGN_UP_ERROR",
        err: {
          message: "Passwords do not match"
        }
      });
      return;
    }

    //check unique username
    const temp = firestore
      .collection("users")
      .where("username", "==", newUser.username)
      .get()
      .then(snapshot => {
        console.log("the snapshot");
        console.log(snapshot);
        if (snapshot.empty == false) {
          dispatch({
            type: "SIGN_UP_ERROR",
            err: {
              message: "That username has already been taken."
            }
          });
        } else {
          firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(resp => {
              //.doc allows us to find the id record with a certain id (such as the random ID from createUser )
              console.log("hello");
              console.log(resp);
              return firestore
                .collection("users")
                .doc(resp.user.uid)
                .set({
                  firstName: newUser.firstName,
                  lastName: newUser.lastName,
                  username: newUser.username,
                  createdAt: new Date(),
                  initials: (
                    newUser.firstName[0] + newUser.lastName[0]
                  ).toUpperCase(),
                  circleList: {},
                  friendsList: {},
                  claimedRewardsByCircle: {}
                });
            })
            .then(() => {
              dispatch({
                type: "SIGN_UP_SUCCESS"
              });
            })
            .catch(err => {
              dispatch({
                type: "SIGN_UP_ERROR",
                err: err
              });
            });
        }
      });
  };
};