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
            .update({
              rewardsList: updatedRewardsList
            })
            .then(() => {
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
  };
};

export const claimReward = (rewardID, userID, circleID) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    // First, find the reward in the rewards collection

    firestore
      .collection("circles")
      .doc(circleID)
      .get()
      .then(doc => {
        var reward = doc.data().rewardsList[rewardID];

        firestore
          .collection("circles")
          .doc(circleID)
          .get()
          .then(doc => {
            if (!doc.exists) {
              // Do something
            } else {
              // Update the user's number of points
              var circleInfo = doc.data();
              var newPointsMap = {
                ...circleInfo.points,
                [userID]: circleInfo.points[userID] - reward.rewardPoints
              };
              var rewardsHistoryForUsers = circleInfo.rewardsHistoryForUsers;
              var rewardHistoryForCurrentUser = rewardsHistoryForUsers[userID];
              var rewardsInCircle = circleInfo.rewardsList;
              var ourReward = rewardsInCircle[rewardID];
              var uuidv4 = require("uuid/v4");
              var uuid = uuidv4();
              var newRewardHistory = {
                ...ourReward,
                claimedDate: new Date()
              };
              var newRewardHistoryForCurrentUser = {
                ...rewardHistoryForCurrentUser,
                [uuid]: newRewardHistory
              };
              var newRewardsHistoryForUsers = {
                ...rewardsHistoryForUsers,
                [userID]: newRewardHistoryForCurrentUser
              };
              firestore
                .collection("circles")
                .doc(circleID)
                .update({
                  points: newPointsMap,
                  rewardsHistoryForUsers: newRewardsHistoryForUsers
                })
                .then(() => {
                  dispatch({
                    type: "CLAIM_POINTS"
                  });
                })
                .catch(err => {
                  dispatch({
                    type: "CLAIM_POINTS_ERROR",
                    err
                  });
                });
            }
          })
          .catch(err => {
            dispatch({
              type: "CLAIM_POINTS_ERROR",
              err: err
            });
          });
      })
      .catch(err => {
        dispatch({
          type: "CLAIM_POINTS_ERROR",
          err: err
        });
      });
  };
};

export const deleteReward = (rewardID, circleID) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    // Delete from the Circle's rewards list
    firestore
      .collection("circles")
      .doc(circleID)
      .get()
      .then(doc => {
        var listOfRewards = doc.data().rewardsList;
        var newRewardsList = {};
        var mapKeys = Object.keys(listOfRewards);

        for (var i = 0; i < mapKeys.length; i++) {
          var currentReward = listOfRewards[mapKeys[i]];

          if (currentReward.rewardID !== rewardID) {
            newRewardsList[currentReward.rewardID] = currentReward;
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
  };
};
