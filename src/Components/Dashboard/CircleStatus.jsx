import React from "react";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import "./CircleStatus.css";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";

class CircleStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCircle: null
    };
    this.changeCircle = this.changeCircle.bind(this);
  }

  componentDidMount() {}

  changeCircle(newCircle) {
    this.setState({
      currentCircle: newCircle.circleName
    });
  }

  render() {
    var dropdownOptions;
    var selected = this.state.currentCircle;
    if (this.props.myCircles) {
      if (this.state.currentCircle === null) {
        if (this.props.myCircles[0]) {
          selected = this.props.myCircles[0].circleName;
        } else {
          selected = "Create a circle!";
        }
      }
      var listWithout = this.props.myCircles.filter(
        circle => circle.circleName !== this.state.currentCircle
      );
      dropdownOptions = listWithout.map((circle, index) => (
        <Dropdown.Item key={index} onClick={() => this.changeCircle(circle)}>
          {circle.circleName}
        </Dropdown.Item>
      ));
    }

    return (
      <div>
        <h4>Circle Status</h4>
        <Card style={{ width: "100%" }}>
          {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
          <Card.Body>
            <Dropdown className="dropdown">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selected}
              </Dropdown.Toggle>
              {dropdownOptions && dropdownOptions.length > 0 ? (
                <Dropdown.Menu>{dropdownOptions}</Dropdown.Menu>
              ) : null}
            </Dropdown>
            {/* <Card.Title>Card title</Card.Title> */}
            <Card.Text>
              This is where we'll put the number of tasks remained and the
              number of points earned. The number of tasks remaining is: blank
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allCirclesRedux: state.firestore.ordered.circles
    // firebaseProfileRedux: state.firebase.profile
  };
};
export default compose(
  connect(mapStateToProps),
  //firestoreConnect takes in an array of of objects that say which collection you want to connect to
  //whenever database for this collection is changed, it will induce the firestoreReducer, which will sync store state
  // and then this component will "hear" that because we connected that. Then state will change for the store
  firestoreConnect([{ collection: "circles" }])
)(CircleStatus);
