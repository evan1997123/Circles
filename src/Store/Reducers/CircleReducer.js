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
      console.log("created the task", action.circle);
      return state;
    case "CREATE_CIRCLE_ERROR":
      console.log("error creating circle", action.err);
      return state;
    default:
      return state;
  }
};

export default CircleReducer;
