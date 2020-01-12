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
      firestore
        .collection("users")
        .doc(userID)
        .get()
        .then(ref => {
          circleList = ref.data().circleList;
          firestore
            .collection("users")
            .doc(userID)
            .update({
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
