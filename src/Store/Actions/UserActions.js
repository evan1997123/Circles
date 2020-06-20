export const deleteUser = userID => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    var circleList = [];
    var friendsList = [];
    firestore
      .collection("users")
      .doc(userID)
      .get()
      .then(doc => {
        var userDetails = doc.data();
        console.log(userDetails);
        circleList = Object.keys(userDetails.circleList);
        friendsList = Object.keys(userDetails.friendsList);
        // Delete all user info in the Circles they are a part of
        circleList.forEach(circleID => {
          firestore
            .collection("circles")
            .doc(circleID)
            .get()
            .then(doc => {
              var circleDetails = doc.data();
              var leaderList = {
                ...circleDetails.leaderList
              };
              var memberList = {
                ...circleDetails.memberList
              };
              // var numberOfPeople = circleDetails.numberOfPeople;
              var points = {
                ...circleDetails.points
              };
              var rewardsHistoryForUsers = {
                ...circleDetails.rewardsHistoryForUsers
              };
              var newLeaderList = leaderList;
              var newMemberList = memberList;
              var newNumberOfPeople =
                Object.keys(newLeaderList).length +
                Object.keys(newMemberList).length -
                1;
              var newPoints = points;
              var newRewardsHistoryForUsers = rewardsHistoryForUsers;
              console.log(newLeaderList);
              if (newNumberOfPeople === 0) {
                firestore
                  .collection("circles")
                  .doc(circleID)
                  .delete()
                  .then(() => {
                    dispatch({
                      type: "DELETE_CIRCLE_NO_PEOPLE",
                      circleID: circleID
                    });
                  })
                  .catch(err => {
                    dispatch({
                      type: "DELETE_USER_ERROR",
                      err
                    });
                  });
              }
              if (Object.keys(leaderList).includes(userID)) {
                // newLeaderList.delete(userID);
                console.log("removing from leader list");
                newLeaderList = Object.keys(newLeaderList).filter(keyUserID => {
                  if (keyUserID === userID) {
                    return false;
                  } else {
                    return true;
                  }
                });
              } else if (Object.keys(memberList).includes(userID)) {
                // newMemberList.delete(userID);
                newMemberList = Object.keys(newMemberList).filter(keyUserID => {
                  if (keyUserID === userID) {
                    return false;
                  } else {
                    return true;
                  }
                });
              }
              console.log(newLeaderList);
              // newPoints.delete(userID);
              newPoints = Object.keys(newPoints).filter(keyUserID => {
                if (keyUserID === userID) {
                  return false;
                } else {
                  return true;
                }
              });
              // newRewardsHistoryForUsers.delete(userID);
              newRewardsHistoryForUsers = Object.keys(
                newRewardsHistoryForUsers
              ).filter(keyUserID => {
                if (keyUserID === userID) {
                  return false;
                } else {
                  return true;
                }
              });
              firestore
                .collection("circles")
                .doc(circleID)
                .update({
                  leaderList: newLeaderList,
                  memberList: newMemberList,
                  numberOfPeople: newNumberOfPeople,
                  points: newPoints,
                  rewardsHistoryForUsers: newRewardsHistoryForUsers
                })
                .then(() => {
                  dispatch({
                    type: "DELETE_USER_INFO_IN_CIRCLE"
                  });
                })
                .catch(err => {
                  dispatch({
                    type: "DELETE_USER_ERROR",
                    err
                  });
                });
            })
            .catch(err => {
              dispatch({
                type: "DELETE_USER_ERROR",
                err
              });
            });
        });
        // Delete user from other users' friends list
        Object.keys(friendsList).forEach(friendID => {
          firestore
            .collection("users")
            .doc(friendID)
            .get()
            .then(doc => {
              var friendDetails = doc.data();
              while (!friendDetails) {
                // Do something
              }
              var newFriendsList = friendDetails.friendsList;
              // newFriendsList.delete(userID);
              newFriendsList = Object.keys(newFriendsList).filter(keyUserID => {
                if (keyUserID === userID) {
                  return false;
                } else {
                  return true;
                }
              });
              firestore
                .collection("users")
                .doc(friendID)
                .update({
                  friendsList: newFriendsList
                })
                .then(() => {
                  dispatch({
                    type: "DELETE_USER_FROM_FRIEND_FRIEND_LIST"
                  });
                })
                .catch(err => {
                  dispatch({
                    type: "DELETE_USER_ERROR",
                    err
                  });
                });
            })
            .catch(err => {
              dispatch({
                type: "DELETE_USER_ERROR",
                err
              });
            });
        });
      })
      .catch(err => {
        dispatch({
          type: "DELETE_USER_ERROR",
          err
        });
      });
    // Delete all friend requests sent by or to this user
    firestore
      .collection("friendRequests")
      .get()
      .then(docs => {
        docs.forEach(doc => {
          var friendRequestDetails = doc.data();
          if (friendRequestDetails.allUsersRelated.includes(userID)) {
            firestore
              .collection("friendRequests")
              .doc(friendRequestDetails.friendRequestID)
              .delete()
              .then(() => {
                dispatch({
                  type: "DELETE_USER_FRIEND_REQUEST"
                });
              })
              .catch(err => {
                dispatch({
                  type: "DELETE_USER_ERROR",
                  err
                });
              });
          }
        });
      })
      .catch(err => {
        dispatch({
          type: "DELETE_USER_ERROR",
          err
        });
      });
    // Delete all the tasks assigned TO this user
    firestore
      .collection("tasks")
      .get()
      .then(docs => {
        docs.forEach(doc => {
          var taskDetails = doc.data();
          console.log(taskDetails);
          if (taskDetails.assignedForID === userID) {
            firestore
              .collection("tasks")
              .doc(taskDetails.taskID)
              .delete()
              .then(() => {
                dispatch({
                  type: "DELETE_USER_TASK"
                });
              })
              .catch(err => {
                dispatch({
                  type: "DELETE_USER_ERROR",
                  err
                });
              });
          }
        });
      })
      .catch(err => {
        dispatch({
          type: "DELETE_USER_ERROR",
          err
        });
      });
    // Lastly, delete yourself
    firestore
      .collection("users")
      .doc(userID)
      .delete()
      .then(() => {
        dispatch({
          type: "DELETE_USER"
        });
      })
      .catch(err => {
        dispatch({
          type: "DELETE_USER_ERROR",
          err
        });
      });
    var user = firebase.auth().currentUser;
    user
      .delete()
      .then(function() {
        // Do something
      })
      .catch(function(error) {
        // Do something
      });

    //delete storage folder
    function deleteFolderContents(path) {
      const ref = firebase.storage().ref(path);
      ref
        .listAll()
        .then(dir => {
          dir.items.forEach(fileRef => {
            deleteFile(ref.fullPath, fileRef.name);
          });
          dir.prefixes.forEach(folderRef => {
            deleteFolderContents(folderRef.fullPath);
          });
        })
        .catch(error => {
          console.log(error);
        });
    }

    function deleteFile(pathToFile, fileName) {
      const ref = firebase.storage().ref(pathToFile);
      const childRef = ref.child(fileName);
      childRef.delete();
    }
    let storageRef = firebase.storage().ref(userID);
    var userIDString = userID + "/";
    deleteFolderContents(userIDString);
  };
};
