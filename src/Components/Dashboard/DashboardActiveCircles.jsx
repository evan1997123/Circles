import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";
import CircleForm from "./CircleForm";
import "./DashboardActiveCircles.css";

// import { connect } from "react-redux";
// import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
// import { compose } from "redux";

class ActiveCircles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {}

  showModal() {
    this.setState({
      show: true
    });
  }

  hideModal() {
    this.setState({
      show: false
    });
  }
  render() {
    var circles;
    if (this.props.myCircles) {
      circles = this.props.myCircles.map((circle, index) => (
        <div className="activeCircle" key={index}>
          <div>
            <Button
              variant="primary"
              className="myButton"
              // onClick={() => this.setRedirect(circle.id)}
              onClick={() => this.props.history.push("/circle/" + circle.id)}
            ></Button>
          </div>
          <h6>{circle.circleName}</h6>
        </div>
      ));
    }
    return (
      <div>
        <h4>Active Circles</h4>
        <Card style={{ width: "100%" }}>
          <CircleForm
            show={this.state.show}
            hideModal={this.hideModal}
          ></CircleForm>
          <div className="rowButtons">{circles}</div>
          <div className="rowButtons">
            <div className="activeCircle">
              <Button className="myButton" onClick={this.showModal}></Button>
              <h6>Add New Circle</h6>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default withRouter(ActiveCircles);

// export default ActiveCircles;
// THESE TAKE TIME TO SHOW UP!
// const mapStateToProps = (state, ownProps) => {
//   return {
//     // allUsersRedux: state.firestore.ordered.users,
//     // firebaseAuthRedux: state.firebase.auth
//     // firebaseProfileRedux: state.firebase.profile
//   };
// };

// export default compose(
//   connect(mapStateToProps),
//   //firestoreConnect takes in an array of of objects that say which collection you want to connect to
//   //whenever database for this collection is changed, it will induce the firestoreReducer, which will sync store state
//   // and then this component will "hear" that because we connected that. Then state will change for the store
//   firestoreConnect([])
// )(withRouter(ActiveCircles));
