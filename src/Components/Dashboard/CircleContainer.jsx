import React from "react";
import CircleStatus from "./CircleStatus";
import ActiveCircles from "./DashboardActiveCircles";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import "./CircleContainer.css";

class CircleContainer extends React.Component {
  constructor(props) {
    super(props);
    this.filterMyCircles = this.filterMyCircles.bind(this);
  }

  getMyCircleIds() {
    var firebaseAuth = this.props.firebaseAuthRedux;
    var firebaseProfile = this.props.firebaseProfileRedux;
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
  filterMyCircles(circle) {
    var firebaseAuth = this.props.firebaseAuthRedux;
    var memberList = circle.memberList;
    for (var i = 0; i < memberList.lenth; i++) {
      var memberListKey = Object.keys(memberList[i])[0];
      if (memberListKey === firebaseAuth.uid) {
        return true;
      }
    }

    var leaderList = circle.leaderList;
    for (var i = 0; i < leaderList.length; i++) {
      var leaderListKey = Object.keys(leaderList[i])[0];
      if (leaderListKey === firebaseAuth.uid) {
        return true;
      }
    }
    return false;
  }

  render() {
    var circles;
    var allCircles = this.props.allCirclesRedux;
    if (allCircles) {
      var myCirclesID = this.getMyCircleIds();
      circles = allCircles.filter(circle => myCirclesID.includes(circle.id));
      console.log(circles);
    }
    return (
      <div className="column">
        <div className="circle">
          <CircleStatus numberTasksRemaining={1} myCircles={circles} />
        </div>
        <div className="circle">
          <ActiveCircles myCircles={circles} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allCirclesRedux: state.firestore.ordered.circles,
    firebaseAuthRedux: state.firebase.auth,
    firebaseProfileRedux: state.firebase.profile
  };
};
export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "circles" }])
)(CircleContainer);
