const initState = {
  circles: [
    {
      id: "1",
      name: "Gym",
      numberOfPeople: "10",
      toDoTasks: [
        "Do your homework",
        "Wash the dishes",
        "Give your girlfriend attention"
      ],
      pendingTasks: [
        "Do your homework",
        "Wash the dishes",
        "Give your girlfriend attention",
        "Buy boba"
      ]
    },
    {
      id: "2",
      name: "Homework",
      numberOfPeople: "10",
      toDoTasks: [
        "Reducer: Do your homework",
        "Reducer: Wash the dishes",
        "Reducer: Give your girlfriend attention"
      ],
      pendingTasks: [
        "Reducer: Do your homework",
        "Reducer: Wash the dishes",
        "Reducer: Give your girlfriend attention",
        "Reducer: Buy boba"
      ]
    },
    { id: "3", name: "House", numberOfPeople: "10" }
  ]
};

const CircleReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_CIRCLE":
      console.log("created the circle", action.circle);
      return state;
    case "CREATE_CIRCLE_ERROR":
      console.log("error creating circle", action.err);
      return state;
    case "UPDATED_USER_CIRCLELIST":
      console.log(
        "updated user " +
          action.userID +
          "to have circleList include " +
          action.circle.circleID
      );
      return state;
    case "UPDATE_CIRCLE_MEMBER_SUCCESS":
      console.log(
        "updated circle:" +
          action.update.circleID +
          "to have memberList of" +
          action.update.memberList +
          " and " +
          action.update.numberOfPeople +
          " number of people"
      );
      return state;
    case "UPDATE_CIRCLE_MEMBER_ERROR":
      console.log("Error updating circle members " + action.err);
      return state;
    case "INVITED_MEMBER_UPDATE_CIRCLELIST":
      console.log(
        "updated user " +
          action.userID +
          "to have circleList " +
          action.updatedCircleList
      );
      return state;
    case "ERROR_INVITED_MEMBER_UPDATE_CIRCLELIST":
      console.log("error updating circle members " + action.err);
      return state;

    case "UPDATE_CIRCLE_PROMOTE_DEMOTE_SUCCESS":
      console.log(
        "updated circle: " +
          action.update.circleID +
          "to have new member and leader lists" +
          action.update.leaderList +
          action.update.memberList
      );
      return state;

    case "UPDATE_CIRCLE_PROMOTE_DEMOTE_ERROR":
      console.log("error promoting or demoting: " + action.err);
      return state;
    default:
      return state;
  }
};

export default CircleReducer;
