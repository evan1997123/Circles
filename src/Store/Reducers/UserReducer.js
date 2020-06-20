const initState = {};

const UserReducer = (state = initState, action) => {
  // Depends on the type of the dispatch
  switch (action.type) {
    case "DELETE_USER_INFO_IN_CIRCLE":
      console.log("delete user info in circle");
      return state;
    case "DELETE_USER_FRIEND_REQUEST":
      console.log("delete user friend request");
      return state;
    case "DELETE_USER_TASK":
      console.log("delete user task");
      return state;
    case "DELETE_USER_FROM_FRIEND_FRIEND_LIST":
      console.log("delete user from friend friend list");
      return state;
    case "DELETE_CIRCLE_NO_PEOPLE":
      console.log("delete circle:" + action.circleID);
      return state;
    case "DELETE_USER":
      console.log("delete user");
      return state;
    case "DELETE_USER_ERROR":
      console.log(action.err);
      return state;
    default:
      return state;
  }
};

export default UserReducer;
