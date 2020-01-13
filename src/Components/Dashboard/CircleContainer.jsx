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
  }

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
)(CircleContainer);
