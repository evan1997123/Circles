import { all } from "q";

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

    var allUsersToUpdate = Object.keys(newCircleDetails.memberList).concat(
      Object.keys(newCircleDetails.leaderList)
    );
    // newCircleDetails.memberList.map(member =>
    //   allUsersToUpdate.push(Object.keys(member)[0])
    // );

    // newCircleDetails.leaderList.map(leader =>
    //   allUsersToUpdate.push(Object.keys(leader)[0])
    // );
    console.log(allUsersToUpdate);

    allUsersToUpdate.map(userID =>
      firestore
        .collection("users")
        .doc(userID)
        .get()
        .then(doc => {
          var updatingUser = doc.data();

          var updatedCircleList = updatingUser.circleList;

          updatedCircleList[uuid] = newCircleDetails.circleName;
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

export const updateCircleMembers = newCircleDetails => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
    const firestore = getFirestore();
    const membersToAdd = newCircleDetails.membersToAdd;
    const membersToRemove = newCircleDetails.membersToRemove;
    delete newCircleDetails.membersToAdd;
    delete newCircleDetails.membersToRemove;

    var allUsersToAdd = [];
    var allUsersToRemove = [];
    membersToAdd.map(nameAndID => allUsersToAdd.push(nameAndID.userID));
    membersToRemove.map(nameAndID => allUsersToRemove.push(nameAndID.userID));
    console.log("in updateCircle");

    console.log(membersToAdd);
    console.log(membersToRemove);
    console.log(newCircleDetails);

    allUsersToAdd.map(userID =>
      firestore
        .collection("users")
        .doc(userID)
        .get()
        .then(doc => {
          var updatingUser = doc.data();

          //get the circleList and add the new circleID
          var updatedCircleList = {
            ...updatingUser.circleList,
            [newCircleDetails.circleID]: newCircleDetails.circleName
          };

          firestore
            .collection("users")
            .doc(userID)
            .update({
              circleList: updatedCircleList
            })
            .then(() => {
              console.log("updated");
              dispatch({
                type: "INVITED_MEMBER_UPDATE_CIRCLELIST",
                updatedCircleList: updatedCircleList,
                userID: userID
              });
            });
        })
        .catch(err => {
          dispatch({
            type: "ERROR_INVITED_MEMBER_UPDATE_CIRCLELIST",
            err: err
          });
        })
    );

    allUsersToRemove.map(userID =>
      firestore
        .collection("users")
        .doc(userID)
        .get()
        .then(doc => {
          var updatingUser = doc.data();

          //get the circleList
          var updatedCircleList = {
            ...updatingUser.circleList
          };

          //delete the current circleID
          delete updatedCircleList[newCircleDetails.circleID];
          firestore
            .collection("users")
            .doc(userID)
            .update({
              circleList: updatedCircleList
            })
            .then(() => {
              console.log("updated");
              dispatch({
                type: "INVITED_MEMBER_UPDATE_CIRCLELIST",
                updatedCircleList: updatedCircleList,
                userID: userID
              });
            });
        })
        .catch(err => {
          dispatch({
            type: "ERROR_INVITED_MEMBER_UPDATE_CIRCLELIST",
            err: err
          });
        })
    );
    firestore
      .collection("circles")
      .doc(newCircleDetails.circleID)
      .update(newCircleDetails)
      .then(() => {
        dispatch({
          type: "UPDATE_CIRCLE_MEMBER_SUCCESS",
          update: newCircleDetails
        });
      })
      .catch(err => {
        dispatch({
          type: "UPDATE_CIRCLE_MEMBER_ERROR",
          err: err
        });
      });
  };
};

export const updateCirclePromoteDemote = newCircleDetails => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
    const firestore = getFirestore();

    console.log(newCircleDetails);
    firestore
      .collection("circles")
      .doc(newCircleDetails.circleID)
      .update(newCircleDetails)
      .then(() => {
        dispatch({
          type: "UPDATE_CIRCLE_PROMOTE_DEMOTE_SUCCESS",
          update: newCircleDetails
        });
      })
      .catch(err => {
        dispatch({
          type: "UPDATE_CIRCLE_PROMOTE_DEMOTE_ERROR",
          err: err
        });
      });
  };
};
