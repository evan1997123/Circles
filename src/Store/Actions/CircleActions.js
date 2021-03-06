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
      creatorID: assignedByID,
      rewardsList: {},
      rewardsHistoryForUsers: {}
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

    console.log("creating circle");
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
    // console.log("in updateCircle");

    // console.log(membersToAdd);
    // console.log(membersToRemove);
    // console.log(newCircleDetails);

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

export const leaveCircle = (circleID, userID) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("circles")
      .doc(circleID)
      .get()
      .then(doc => {
        var circleDetails = doc.data();
        var oldMembers = circleDetails.memberList;
        var newMembers = {};
        for (var i = 0; i < Object.keys(oldMembers).length; i++) {
          var memberID = Object.keys(oldMembers)[i];
          if (memberID !== userID) {
            newMembers[memberID] = oldMembers[memberID];
          }
        }
        firestore
          .collection("circles")
          .doc(circleID)
          .update({
            memberList: newMembers
          })
          .then(() => {
            firestore
              .collection("users")
              .doc(userID)
              .get()
              .then(doc => {
                var userDetails = doc.data();
                var oldCircleList = userDetails.circleList;
                var newCircleList = {};

                for (var i = 0; i < Object.keys(oldCircleList).length; i++) {
                  var currentCircleID = Object.keys(oldCircleList)[i];
                  if (currentCircleID !== circleID) {
                    newCircleList[currentCircleID] =
                      oldCircleList[currentCircleID];
                  }
                }

                firestore
                  .collection("users")
                  .doc(userID)
                  .update({
                    circleList: newCircleList
                  })
                  .then(() => {
                    dispatch({
                      type: "LEAVE_CIRCLE_SUCCESS"
                    });
                  })
                  .catch(err => {
                    dispatch({
                      type: "LEAVE_CIRCLE_ERROR"
                    });
                  });
              });
          })
          .catch(err => {
            dispatch({
              type: "LEAVE_CIRCLE_ERROR",
              err: err
            });
          });
      })
      .catch(err => {
        dispatch({
          type: "LEAVE_CIRCLE_ERROR",
          err: err
        });
      });
  };
};
export const deleteCircle = (
  circleID,
  allUsersCurrentCircleMap,
  allTasksCurrentCircle
) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // allUsersCurrentCircleMap.map();
    //delete the circle from the user's circleList

    Object.keys(allUsersCurrentCircleMap).map(userID => {
      var currentUserCircleList = allUsersCurrentCircleMap[userID].circleList;
      // console.log(currentUserCircleList);

      var updatedUserCircleList = { ...currentUserCircleList };
      console.log(updatedUserCircleList);
      delete updatedUserCircleList[circleID];
      console.log(updatedUserCircleList);
      // console.log(updatedUserCircleList);

      firestore
        .collection("users")
        .doc(userID)
        .update({
          circleList: updatedUserCircleList
        })
        .then(() => {
          dispatch({
            type: "DELETE_CIRCLE_SUCCESS",
            who: userID,
            what: "from circleList"
          });
        })
        .catch(err => {
          dispatch({
            type: "LEAVE_CIRCLE_ERROR",
            who: userID,
            what: "from circleList",
            err: err
          });
        });
    });

    //delete the tasks within this circle
    allTasksCurrentCircle.map(task => {
      var taskID = task.taskID;
      if (task.circleID === circleID) {
        firestore
          .collection("tasks")
          .doc(taskID)
          .delete()
          .then(() => {
            dispatch({
              type: "DELETE_CIRCLE_SUCCESS",
              who: taskID,
              what: "from tasks"
            });
          })
          .catch(err => {
            dispatch({
              type: "DELETE_CIRCLE_ERROR",
              who: taskID,
              what: "from tasks",
              err: err
            });
          });
      }

      // taskID;
    });

    //delete the circle
    firestore
      .collection("circles")
      .doc(circleID)
      .delete()
      .then(() => {
        dispatch({
          type: "DELETE_CIRCLE_SUCCESS",
          who: circleID,
          what: "from circles"
        });
      })
      .catch(err => {
        dispatch({
          type: "DELETE_CIRCLE_ERROR",
          who: circleID,
          what: "from circles",
          err: err
        });
      });
  };
};

export const editCircleDetails = (newCircleDetails, circleID) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    console.log(newCircleDetails);
    console.log(circleID);
    firestore
      .collection("circles")
      .doc(circleID)
      .update({
        circleName: newCircleDetails.newCircleName,
        circleDescription: newCircleDetails.newCircleDescription,
        circleColor: newCircleDetails.newCircleColor,
        circleHighlight: newCircleDetails.newCircleHighlight
      })
      .then(() => {
        dispatch({
          type: "UPDATE_CIRCLE_DETAILS_SUCCESS",
          circle: circleID,
          newCircleDetails: newCircleDetails
        });
      })
      .catch(err => {
        dispatch({
          type: "UPDATE_CIRCLE_DETAILS_ERROR",
          circle: circleID,
          newCircleDetails: newCircleDetails,
          err: err
        });
      });
  };
};
