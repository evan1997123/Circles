// Action creators return a function that will be passed to the dispatch function
export const createReward = reward => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const circleID = reward.circleID;
    firestore
      .collection("circles")
      .doc(circleID)
      .get()
      .then(doc => {
        // Check if the document for that circle exists
        if (!doc.exists) {
          // Do something
        } else {
          // Create unique ID for the reward
          const uuidv4 = require("uuid/v4");
          const uuid = uuidv4();
          var newReward = {
            ...reward,
            rewardID: uuid
          };
          // Add to the circle
          // Get the circle information
          var circleInfo = doc.data();
          // Get the rewards list and add the new reward
          var updatedRewardsList = {
            ...circleInfo.rewardsList,
            [newReward.rewardID]: newReward
          };
          firestore
            .collection("circles")
            .doc(circleID)
            .get()
            .then(doc => {
              // Check if the document for that circle exists
              if (!doc.exists) {
                // Do something
              } else {
                // Create unique ID for the reward
                const uuidv4 = require("uuid/v4");
                const uuid = uuidv4();
                var newReward = {
                  ...reward,
                  rewardID: uuid
                };
                // Add to the circle
                // Get the circle information
                var circleInfo = doc.data();
                // Get the rewards list and add the new reward
                var updatedRewardsList = {
                  ...circleInfo.rewardsList,
                  [newReward.rewardID]: newReward
                };
                firestore
                  .collection("circles")
                  .doc(circleID)
                  .update({
                    rewardsList: updatedRewardsList
                  })
                  .then(() => {
                    // Also add reward to firestore?
                    // firestore
                    //     .collection("rewards")
                    //     .doc(uuid)
                    //     .set(newReward)
                    //     .then(() => {
                    //         dispatch({
                    //             type: "CREATE_REWARD",
                    //             reward: newReward
                    //         });
                    //     })
                    //     .catch(err => {
                    //         // Dispatch handled by the reducer
                    //         dispatch({
                    //             type: "CREATE_REWARD_ERROR",
                    //             err: err
                    //         })
                    //     });
                    dispatch({
                      type: "CREATE_REWARD",
                      reward: newReward
                    });
                  })
                  .catch(err => {
                    dispatch({
                      type: "CREATE_REWARD_ERROR",
                      err: err
                    });
                  });
              }
            });
        }
      });
  };
};

export const claimReward = (rewardID, userID, circleID) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    // First, find the reward in the rewards collection
    console.log(rewardID);
    firestore
      .collection("circles")
      .doc(circleID)
      .get()
      .then(doc => {
        var reward = doc.data().rewardsList[rewardID];
        console.log(reward);
        console.log(doc);
        firestore
          .collection("circles")
          .doc(circleID)
          .get()
          .then(doc => {
            if (!doc.exists) {
              // Do something
            } else {
              var circleInfo = doc.data();
              var newPointsMap = {
                ...circleInfo.points,
                [userID]: circleInfo.points[userID] - reward.rewardPoints
              };
              // Get the points list and update everyone's poinst
              // var pointsMapKeys = Object.keys(circleInfo.points);
              // for (var i = 0; i < pointsMapKeys.length; i++) {
              //     var oldPoints = circleInfo.points[pointsMapKeys[i]];
              //     var newPoints = oldPoints - reward.rewardPoints;
              //     newPointsMap[pointsMapKeys[i]] = newPoints;
              // }
              console.log(newPointsMap);
              firestore
                .collection("circles")
                .doc(circleID)
                .update({
                  points: newPointsMap
                })
                .then(() => {
                  dispatch({
                    type: "CLAIM_POINTS"
                  });
                })
                .catch(err => {
                  dispatch({
                    type: "CLAIM_POINTS_ERROR",
                    err: err
                  });
                });
            }
          });
      });
  };
};

export const deleteReward = rewardID => {
  console.log(rewardID);
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("rewards")
      .doc(rewardID)
      .get()
      .then(doc => {
        // Delete and then delete from the circle's rewards list
        var rewardInfo = doc.data();
        console.log(doc);
        var circleID = rewardInfo.circleID;
        firestore
          .collection("rewards")
          .doc(rewardID)
          .delete()
          .then(() => {
            // Delete from circle's rewards list
            firestore
              .collection("circles")
              .doc(circleID)
              .get()
              .then(doc => {
                var listOfRewards = doc.data().rewardsList;
                var newRewardsList = [];
                var mapKeys = Object.keys(listOfRewards);
                console.log(rewardID);
                for (var i = 0; i < mapKeys.length; i++) {
                  var currentReward = listOfRewards[mapKeys[i]];
                  console.log("current reward", currentReward);
                  if (currentReward.rewardID !== rewardID) {
                    newRewardsList.push(currentReward);
                  }
                }
                firestore
                  .collection("circles")
                  .doc(circleID)
                  .update({
                    rewardsList: newRewardsList
                  })
                  .then(() => {
                    dispatch({
                      type: "DELETE_REWARD"
                    });
                  })
                  .catch(err => {
                    dispatch({
                      type: "DELETE_REWARD_ERROR",
                      err
                    });
                  });
              });
          });
      });
  };
};
