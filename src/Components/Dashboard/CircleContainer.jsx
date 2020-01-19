import React from "react";
import CircleStatus from "./CircleStatus";
import ActiveCircles from "./DashboardActiveCircles";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import "./CircleContainer.css";

class CircleContainer extends React.Component {
  render() {
    var circles = this.props.allCirclesRedux;
    return (
      <div className="column">
        <div className="circle">
          <CircleStatus myCircles={circles} />
        </div>
        <div className="circle">
          <ActiveCircles myCircles={circles} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  function getMyCircleIds() {
    var firebaseProfile = state.firebase.profile;
    var myCirclesIDs = [];
    if (firebaseProfile.circleList) {
      myCirclesIDs = Object.keys(firebaseProfile.circleList);
    }
    return myCirclesIDs;
  }

  function circleNameSort(circleA, circleB) {
    return circleA.circleName.localeCompare(circleB.circleName);
  }

  var myCirclesID = getMyCircleIds();
  if (state.firestore.ordered.circles) {
    return {
      allCirclesRedux: state.firestore.ordered.circles
        .filter(circle => myCirclesID.includes(circle.id))
        .sort(circleNameSort),
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
)(CircleContainer);
