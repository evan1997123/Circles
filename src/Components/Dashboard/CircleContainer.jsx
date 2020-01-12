import React from "react";
import CircleStatus from "./CircleStatus";
import DashboardActiveCircles from "./DashboardActiveCircles";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import "./CircleContainer.css";

class CircleContainer extends React.Component {
  render() {
    // let allCircles = [
    //   { circle: "Workout", numberTasks: 2 },
    //   { circle: "Study Buddies", numberTasks: 3 }
    // ];

    //let createCircle = { circle: "Create New Circle" };

    return (
      <div className="column">
        <div className="circle">
          <CircleStatus numberTasksRemaining={1} />
        </div>
        <div className="circle">
          <DashboardActiveCircles />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allCirclesRedux: state.firestore.ordered.circles,
    allUsersRedux: state.firestore.ordered.users,
    firebaseAuthRedux: state.firebase.auth
    // firebaseProfileRedux: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  //firestoreConnect takes in an array of of objects that say which collection you want to connect to
  //whenever database for this collection is changed, it will induce the firestoreReducer, which will sync store state
  // and then this component will "hear" that because we connected that. Then state will change for the store
  firestoreConnect(props => [
    {
      collection: "circles",
      orderBy: ["circleName"]
    }
  ])
)(CircleContainer);
