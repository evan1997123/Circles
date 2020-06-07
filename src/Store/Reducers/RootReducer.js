import AuthReducer from "./AuthReducer";
import CircleReducer from "./CircleReducer";
import TaskReducer from "./TaskReducer";
import RewardReducer from "./RewardReducer";
import FriendReducer from "./FriendReducer";
import UserReducer from "./UserReducer";
import {
  combineReducers
} from "redux";
import {
  firestoreReducer
} from "redux-firestore"; // syncs firestore
import {
  firebaseReducer
} from "react-redux-firebase"; // syncs Auth firebase status

const rootReducer = combineReducers({
  auth: AuthReducer,
  circle: CircleReducer,
  task: TaskReducer,
  reward: RewardReducer,
  friend: FriendReducer,
  user: UserReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;