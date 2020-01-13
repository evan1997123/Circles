import React from "react";
import CircleStatus from "./CircleStatus";
<<<<<<< HEAD
import DashboardActiveCircles from "./DashboardActiveCircles";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
=======
import ActiveCircles from "./DashboardActiveCircles";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
>>>>>>> groupCircle
import { compose } from "redux";
import "./CircleContainer.css";

class CircleContainer extends React.Component {
<<<<<<< HEAD
  render() {
    // let allCircles = [
    //   { circle: "Workout", numberTasks: 2 },
    //   { circle: "Study Buddies", numberTasks: 3 }
    // ];

    //let createCircle = { circle: "Create New Circle" };
=======
  constructor(props) {
    super(props);
  }
>>>>>>> groupCircle

  render() {
    var circles = this.props.allCirclesRedux;
    return (
      <div className="column">
        <div className="circle">
<<<<<<< HEAD
          <CircleStatus numberTasksRemaining={1} />
        </div>
        <div className="circle">
          <DashboardActiveCircles />
=======
          <CircleStatus myCircles={circles} />
        </div>
        <div className="circle">
          <ActiveCircles myCircles={circles} />
>>>>>>> groupCircle
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
<<<<<<< HEAD
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
=======
  function getMyCircleIds() {
    var firebaseProfile = state.firebase.profile;
    console.log(firebaseProfile);
    var myCirclesIDs = [];
    if (firebaseProfile.circleList) {
      firebaseProfile.circleList.map(idAndName =>
        myCirclesIDs.push(Object.keys(idAndName)[0])
      );
    }
    console.log(myCirclesIDs);
    return myCirclesIDs;
  }
  var myCirclesID = getMyCircleIds();
  console.log(myCirclesID);
  if (state.firestore.ordered.circles) {
    return {
      allCirclesRedux: state.firestore.ordered.circles.filter(circle =>
        myCirclesID.includes(circle.id)
      ),
      firebaseAuthRedux: state.firebase.auth,
      firebaseProfileRedux: state.firebase.profile
    };
  } else {
    return {};
  }

  // return {
  //   allCirclesRedux: state.firestore.ordered.circles,
  //   firebaseAuthRedux: state.firebase.auth,
  //   firebaseProfileRedux: state.firebase.profile
  // };
};
export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "circles" }])
>>>>>>> groupCircle
)(CircleContainer);
