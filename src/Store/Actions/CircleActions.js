export const createCircle = circleDetails => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const assignedByID = getState().firebase.auth.uid;
    const fullName = profile.firstName + " " + profile.lastName;

    var newCircleDetails = {
      ...circleDetails,
      createdAt: new Date(),
      creator: fullName,
      creatorID: assignedByID
    };

    firestore
      .collection("circles")
      .add(newCircleDetails)
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
