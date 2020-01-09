import AuthReducer from "./AuthReducer";
import CircleReducer from "./CircleReducer";
import TaskReducer from "./TaskReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore"; // syncs firestore
import { firebaseReducer } from "react-redux-firebase"; // syncs Auth firebase status

const rootReducer = combineReducers({
  auth: AuthReducer,
  circle: CircleReducer,
  task: TaskReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
