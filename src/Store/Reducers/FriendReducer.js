const initState = {};

const FriendReducer = (state = initState, action) => {
  // Depends on the type of the dispatch
  switch (action.type) {
    case "CREATE_FRIEND_REQUEST":
      console.log(
        "Created friend request from",
        action.friendRequestDetails.from,
        "to",
        action.friendRequestDetails.to
      );
      return state;
    case "CREATE_FRIEND_REQUEST_ERROR":
      console.log(
        "Error when creating friend requestion from",
        action.friendRequestDetails.from,
        "to",
        action.friendRequestDetails.to,
        " ",
        action.err
      );
      return state;
    case "DELETE_FRIEND_REQUEST":
      console.log(
        "Successfully deleted friendRequest's Document id:",
        action.deletedDocumentID
      );
      return state;
    case "DELETE_FRIEND_REQUEST_ERROR":
      console.log(
        "Failed to delete friendRequest's Document id:",
        action.deletedDocumentID
      );
      return state;
    case "UPDATED_USER_FRIENDS_LIST":
      console.log(
        "updated " +
          action.acceptedFriendRequestDetails.edited +
          "with" +
          action.acceptedFriendRequestDetails.with
      );
      return state;
    case "ERROR_ACCEPT_FRIEND_REQUEST_UPDATE_USERS":
      console.log("error updating friendList after accept" + action.err);
      return state;
    default:
      return state;
  }
};

export default FriendReducer;
