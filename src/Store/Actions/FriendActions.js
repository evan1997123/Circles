export const sendFriendRequest = friendInfo => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const assignedByID = getState().firebase.auth.uid;
    // const fullName = profile.firstName + " " + profile.lastName;
    // const uuidv4 = require("uuid/v4");
    // const uuid = uuidv4();

    // var newCircleDetails = {
    //   ...circleDetails,
    //   circleID: uuid,
    //   createdAt: new Date(),
    //   creator: fullName,
    //   creatorID: assignedByID,
    //   rewardsList: []
    // };

    // var friendRequestsToCreate = Object.keys(friendInfo.toList);
    // newCircleDetails.memberList.map(member =>
    //   allUsersToUpdate.push(Object.keys(member)[0])
    // );

    // newCircleDetails.leaderList.map(leader =>
    //   allUsersToUpdate.push(Object.keys(leader)[0])
    // );
    console.log(Object.entries(friendInfo.toList));
    var keyValueIDName = Object.entries(friendInfo.toList);

    console.log("creating friend Requests");

    keyValueIDName.map(toIDAndName => {
      firestore
        .collection("friendRequests")
        .add({
          from: friendInfo.from,
          fromName: friendInfo.fromName,
          to: toIDAndName[0],
          toName: toIDAndName[1],
          allUsersRelated: [friendInfo.from, toIDAndName[0]],
          createdAt: new Date()
          // status: "requesting"
        })
        .then(() => {
          dispatch({
            type: "CREATE_FRIEND_REQUEST",
            friendRequestDetails: {
              from: friendInfo.fromName,
              to: toIDAndName[1]
            }
          });
        })
        .catch(err => {
          dispatch({
            type: "CREATE_FRIEND_REQUEST_ERROR",
            friendRequestDetails: {
              from: friendInfo.fromName,
              to: toIDAndName[1]
            },
            err: err
          });
        });
    });
  };
};

export const cancelFriendRequest = friendRequestDocumentID => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const assignedByID = getState().firebase.auth.uid;

    firestore
      .collection("friendRequests")
      .doc(friendRequestDocumentID)
      .delete()
      .then(() => {
        dispatch({
          type: "DELETE_FRIEND_REQUEST",
          deletedDocumentID: friendRequestDocumentID
        });
      })
      .catch(err => {
        dispatch({
          type: "DELETE_FRIEND_REQUEST_ERROR",
          deletedDocumentID: friendRequestDocumentID,
          err: err
        });
      });
  };
};

export const acceptFriendRequest = friendRequest => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //pause dispatch
    //do async calls to Database
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const assignedByID = getState().firebase.auth.uid;

    var friendRequestDocumentID = friendRequest.id;

    var toID = friendRequest.to;
    var toName = friendRequest.toName;
    var fromID = friendRequest.from;
    var fromName = friendRequest.fromName;

    //update from person
    firestore
      .collection("users")
      .doc(fromID)
      .get()
      .then(doc => {
        var updatingUser = doc.data();

        //get the circleList and add the new circleID
        var updatedFriendsList = {
          ...updatingUser.friendsList,
          [toID]: toName
        };
        firestore
          .collection("users")
          .doc(fromID)
          .update({
            friendsList: updatedFriendsList
          })
          .then(() => {
            console.log("updated 'from' user");
            dispatch({
              type: "UPDATED_USER_FRIENDS_LIST",
              acceptedFriendRequestDetails: {
                edited: fromName,
                with: toName
              }
            });
          })
          .catch(err => {
            dispatch({
              type: "ERROR_ACCEPT_FRIEND_REQUEST_UPDATE_USERS",
              err: err
            });
          });
      })
      .catch(err => {
        dispatch({
          type: "ERROR_ACCEPT_FRIEND_REQUEST_UPDATE_USERS",
          err: err
        });
      });

    //update to person
    firestore
      .collection("users")
      .doc(toID)
      .get()
      .then(doc => {
        var updatingUser = doc.data();

        //get the circleList and add the new circleID
        var updatedFriendsList = {
          ...updatingUser.friendsList,
          [fromID]: fromName
        };
        firestore
          .collection("users")
          .doc(toID)
          .update({
            friendsList: updatedFriendsList
          })
          .then(() => {
            console.log("updated 'to' user");
            dispatch({
              type: "UPDATED_USER_FRIENDS_LIST",
              acceptedFriendRequestDetails: {
                edited: toName,
                with: fromName
              }
            });
          })
          .catch(err => {
            dispatch({
              type: "ERROR_ACCEPT_FRIEND_REQUEST_UPDATE_USERS",
              err: err
            });
          });
      })
      .catch(err => {
        dispatch({
          type: "ERROR_ACCEPT_FRIEND_REQUEST_UPDATE_USERS",
          err: err
        });
      });

    //delete friendRequest
    firestore
      .collection("friendRequests")
      .doc(friendRequestDocumentID)
      .delete()
      .then(() => {
        dispatch({
          type: "DELETE_FRIEND_REQUEST",
          deletedDocumentID: friendRequestDocumentID
        });
      })
      .catch(err => {
        dispatch({
          type: "DELETE_FRIEND_REQUEST_ERROR",
          deletedDocumentID: friendRequestDocumentID,
          err: err
        });
      });
  };
};
