const initState = {
  tasks: [
    {
      toDoTasks: [
        {
          taskName: "Reducer: Do your homework 0",
          assignedBy: "Christine",
          taskDescription: "Do your homework 0"
        },
        {
          taskName: "Reducer: Wash the dishes",
          assignedBy: "Christine",
          taskDescription: "Wash the left dishes"
        },
        {
          taskName: "Reducer: Give your girlfriend attention",
          assignedBy: "Christine",
          taskDescription: "Cuddles <3"
        }
      ],
      pendingTasks: [
        {
          taskName: "Reducer: Do your homework 0",
          assignedBy: "Christine",
          taskDescription: "Do your homework 0"
        },
        {
          taskName: "Reducer: Wash the dishes",
          assignedBy: "Christine",
          taskDescription: "Wash the left dishes"
        },
        {
          taskName: "Reducer: Give your girlfriend attention",
          assignedBy: "Christine",
          taskDescription: "Cuddles <3"
        },
        {
          taskName: "Reducer: By Boba",
          assignedBy: "Evan",
          taskDescription: "Caramelized Boba"
        }
      ]
    },
    {
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
    }
  ]
};

const TaskReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_TASK":
      console.log("created task", action.task);
      return state;
    case "CREATE_TASK_ERROR":
      console.log("create task error:", action.err);
      return state;
    default:
      return state;
  }
};

export default TaskReducer;
