export const createCircle = circleDetails => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const assignedByID = getState().firebase.auth.uid;
    const fullName = profile.firstName + " " + profile.lastName;
    const uuidv4 = require("uuid/v4");
    const uuid = uuidv4();

    var newCircleDetails = {
      ...circleDetails,
      circleID: uuid,
      createdAt: new Date(),
      creator: fullName,
      creatorID: assignedByID
    };

    var allUsersToUpdate = [];
    newCircleDetails.memberList.map(member =>
      allUsersToUpdate.push(Object.keys(member)[0])
    );

    newCircleDetails.leaderList.map(leader =>
      allUsersToUpdate.push(Object.keys(leader)[0])
    );

    allUsersToUpdate.map(userID =>
      firestore
        .collection("users")
        .doc(userID)
        .get()
        .then(doc => {
          var updatingUser = doc.data();

          var updatedCircleList = updatingUser.circleList;

          updatedCircleList.push({ [uuid]: newCircleDetails.circleName });
          firestore
            .collection("users")
            .doc(userID)
            .update({
              circleList: updatedCircleList
            })
            .then(() => {
              console.log("updated");
              dispatch({
                type: "UPDATED_USER_CIRCLELIST",
                circle: newCircleDetails,
                userID: userID
              });
            });
        })
        .catch(err => {
          dispatch({
            type: "ERROR_UPDATING_USER_CIRCLELIST",
            err: err
          });
        })
    );

    firestore
      .collection("circles")
      .doc(uuid)
      .set(newCircleDetails)
      .then(() => {
        dispatch({
          type: "CREATE_CIRCLE",
          circle: newCircleDetails
        });
      })
      .catch(err => {
        dispatch({
          type: "CREATE_CIRCLE_ERROR",
          err: err
        });
      });
  };
};
