// Delete task action for Redux to dispatch to reducer
export const deleteTask = id => {
  return {
    type: "DELETE_TASK",
    id
  };
};
