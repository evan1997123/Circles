const initState = {};

const TaskReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_TASK":
      console.log("created task", action.task);
      return state;
    case "CREATE_TASK_ERROR":
      console.log("create task error:", action.err);
      return state;
    case "MOVE_TASK_TODO2PENDING":
      console.log("moved task from toDo to pending", action.task);
      return state;
    case "MOVE_TASK_PENDING2COMPLETED":
      console.log("moved task from pending to completed", action.task);
      return state;
    case "MOVE_TASK_COMPLETED2DISMISSED":
      console.log("moved task from completed to dismissed", action.task);
      return state;
    case "MOVE_TASK_ERROR":
      console.log("move task error:", action.err);
      return state;
    case "DELETE_TASK":
      console.log("DELETE_TASK completed!");
      return state;
    case "DELETE_TASK_ERROR":
      console.log("DELETE_TASK ERROR", action.err);
      return state;
    default:
      return state;
  }
};

export default TaskReducer;
