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
      currentCircle: ""
    };
    this.changeCircle = this.changeCircle.bind(this);
    this.filterMyCircles = this.filterMyCircles.bind(this);
  }

  componentDidMount() {}

  changeCircle(newCircle) {
    // let copyList = [...this.state.allCircles];
    // copyList = copyList.filter(
    //   circle => circle.circleName !== newCircle.circleName
    // );
    // let insert = { circle: prevCircle };
    // // console.log(insert);
    // copyList.push(insert);
    // this.setState({
    //   currentCircle: newCircle.circle,
    //   numberTasksRemaining: newCircle.numberTasks,
    //   allCircles: copyList
    // });
    this.setState({
      currentCircle: newCircle.circleName
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.allCirclesRedux[0]
      // nextProps.allCirclesRedux !== this.props.allCirclesRedux
    ) {
      console.log(
        "updating it to be " + nextProps.allCirclesRedux[0].circleName
      );
      var newName = nextProps.allCirclesRedux[0].circleName;
      this.setState(
        {
          currentCircle: newName
        },
        () => {
          console.log(this.state);
        }
      );
    }
  }
  filterMyCircles(circle) {
    // const firebaseAuth = this.props.firebaseAuthRedux;
    //check memberList
    var memberList = circle.memberList;
    for (var i = 0; i < memberList.length; i++) {
      var memberListKey = Object.keys(circle.memberList[i])[0];
      // if (memberListKey === firebaseAuth.uid) {
      //   return true;
      // }
    }

    var leaderList = circle.leaderList;
    //check leaderList
    for (var i = 0; i < leaderList.length; i++) {
      var leaderListKey = Object.keys(circle.leaderList[i])[0];
      // if (leaderListKey === firebaseAuth.uid) {
      //   return true;
      // }
    }

    return false;
  }

  render() {
    var dropdownOptions;
    var allCircles = this.props.allCirclesRedux;
    if (allCircles) {
      var allMyCircles = allCircles.filter(this.filterMyCircles);
      var listWithout = allMyCircles.filter(
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
                {this.state.currentCircle}
              </Dropdown.Toggle>
              <Dropdown.Menu>{dropdownOptions}</Dropdown.Menu>
            </Dropdown>
            {/* <Card.Title>Card title</Card.Title> */}
            <Card.Text>
              This is where we'll put the number of tasks remained and the
              number of points earned. The number of tasks remaining is: blank
            </Card.Text>
            {/* <Button variant="primary">Go to circle</Button> */}
            {/* <Figure>
              <Figure.Image
                width={171}
                height={180}
                alt="171x180"
                src="holder.js/171x180"
              />
              <Figure.Caption>
                Nulla vitae elit libero, a pharetra augue mollis interdum.
              </Figure.Caption>
            </Figure> */}
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
