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

    const uuidv4 = require("uuid/v4");
    const uuid = uuidv4();

    var newCircleDetails = {
      ...circleDetails,
      circleID: uuid,
      createdAt: new Date(),
      creator: fullName,
      creatorID: assignedByID,
      circleID: uuid
    };

<<<<<<< HEAD
    var grabMembersID = [];
    var grabLeadersID = [];

    if (newCircleDetails.memberList) {
      newCircleDetails.memberList.map(idAndName =>
        grabMembersID.push(Object.keys(idAndName)[0])
      );
    }
    if (newCircleDetails.leaderList) {
      newCircleDetails.leaderList.map(idAndName =>
        grabLeadersID.push(Object.keys(idAndName)[0])
      );
    }
    var updateUsersCircleList = grabLeadersID.concat(grabMembersID);

    // TODO: want to make this atomic somehow
    updateUsersCircleList.map(userID => {
      var circleList;
=======
    var allUsersToUpdate = [];
    newCircleDetails.memberList.map(member => {
      allUsersToUpdate.push(Object.keys(member)[0]);
    });

    newCircleDetails.leaderList.map(leader => {
      allUsersToUpdate.push(Object.keys(leader)[0]);
    });

    console.log("creating user");
    console.log(allUsersToUpdate);

    allUsersToUpdate.map(userID => {
>>>>>>> groupCircle
      firestore
        .collection("users")
        .doc(userID)
        .get()
<<<<<<< HEAD
        .then(ref => {
          circleList = ref.data().circleList;
=======
        .then(doc => {
          var updatingUser = doc.data();
          console.log(updatingUser);

          var updatedCircleList = updatingUser.circleList;

          updatedCircleList.push({ [uuid]: newCircleDetails.circleName });
>>>>>>> groupCircle
          firestore
            .collection("users")
            .doc(userID)
            .update({
<<<<<<< HEAD
              circleList: [
                ...circleList,
                { [uuid]: newCircleDetails.circleName }
              ]
            })
            .then(() => {
              dispatch({
                type: "UPDATE_USER_WHILE_CREATING_CIRCLE",
                circle: newCircleDetails,
                userID: userID
              });
            })
            .catch(err => {
              dispatch({
                type: "UPDATE_USER_WHILE_CREATING_CIRCLE_ERROR",
                err: err
              });
            });
=======
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
>>>>>>> groupCircle
        });
    });

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
