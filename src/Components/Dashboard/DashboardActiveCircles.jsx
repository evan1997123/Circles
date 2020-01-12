import React from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { Redirect } from "react-router-dom";
// import { Link } from "react-router-dom";
import "./DashboardActiveCircles.css";
import firebase from "../../config/firebase.js";

import { connect } from "react-redux";
import { createCircle } from "../../Store/Actions/CircleActions";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";

class ActiveCircles extends React.Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    this.state = {
      show: false,
      currentMembersOfNewCircle: [],
      newCircleDescription: "",
      newCircleName: "",
      currentLeadersOfNewCircle: [],
      redirect: false,
      redirectPath: ""
    };
    this.createNewCircle = this.createNewCircle.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.handleChanges = this.handleChanges.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
    this.createCircle = this.createCircle.bind(this);
  }

  componentDidMount() {}

  createNewCircle() {
    this.setState({
      show: true
    });
  }

  hideModal() {
    this.setState({
      show: false
    });
  }

  handleChanges(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  createCircle(e) {
    e.preventDefault();
    console.log("creating");
    var newMemberList = [];
    var newLeaderList = [];

    this.state.currentMembersOfNewCircle.map(member =>
      newMemberList.push({ [member.userID]: member.name })
    );
    this.state.currentLeadersOfNewCircle.map(leader =>
      newLeaderList.push({ [leader.userID]: leader.name })
    );
    var circleDetails = {
      circleName: this.state.newCircleName,
      circleDescription: this.state.newCircleDescription,
      memberList: newMemberList,
      leaderList: newLeaderList,
      numberOfPeople: newMemberList.length + newLeaderList.length
    };
    console.log(circleDetails);
    this.props.createCircleDispatch(circleDetails);

    var frm = document.getElementsByName("newCircleForm")[0];
    frm.reset();
    this.setState({
      currentMembersOfNewCircle: [],
      newCircleDescription: "",
      newCircleName: "",
      currentLeadersOfNewCircle: [],
      show: false
    });
  }

  setRedirect(circleName) {
    this.setState({
      redirect: true,
      redirectPath:
        "/" +
        circleName
          .toString()
          .toLowerCase()
          .split(" ")
          .join("")
    });
  }

  routeChange(circleName) {
    let path = circleName.toLowerCase();
    this.props.history.push(path);
  }

  render() {
    // console.log(this.state);
    var circles;
    if (this.props.myCircles) {
      circles = this.props.myCircles.map((circle, index) => (
        <div className="activeCircle" key={index}>
          <div>
            <Button
              variant="primary"
              className="myButton"
              // onClick={() => this.setRedirect(circle.circle)}
            ></Button>
          </div>
          <h6>{circle.circleName}</h6>
        </div>
      ));
    }

    var currentMembers = this.state.currentMembersOfNewCircle.map(
      (member, index) => (
        <button
          value={member.userID}
          key={index}
          name="deleteMember"
          onClick={this.handleRemoving}
        >
          {member.name}
        </button>
      )
    );

    var currentLeaders = this.state.currentLeadersOfNewCircle.map(
      (leader, index) => (
        <button
          value={leader.userID}
          key={index}
          name="deleteLeader"
          onClick={this.handleRemoving}
        >
          {leader.name}
        </button>
      )
    );

    var allUsers = this.props.allUsersRedux;
    if (allUsers) {
      var dropDownMembersUsers = allUsers.map((user, index) => (
        <Dropdown.Item
          user={user.id}
          eventKey={user.id}
          key={index}
          name="newMember"
        >
          {user.firstName} {user.lastName}
        </Dropdown.Item>
      ));
      var dropDownLeaderUsers = allUsers.map((user, index) => (
        <Dropdown.Item
          user={user.id}
          eventKey={user.id}
          key={index}
          name="newLeader"
        >
          {user.firstName} {user.lastName}
        </Dropdown.Item>
      ));
    }

    if (this.state.redirect) {
      return <Redirect to={this.state.redirectPath} />;
    }
    return (
      <div>
        <h4>Active Circles</h4>
        <Card style={{ width: "100%" }}>
          <Card.Body>
            {/* <Card.Title>Active Circles</Card.Title> */}
            {/* <Card.Text>
              This is where we'll put all the active circles for this user.
            </Card.Text> */}
          </Card.Body>
          <Modal show={this.state.show} onHide={this.hideModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create a New Circle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form name="newCircleForm">
                <Form.Group>
                  <Form.Row>
                    <Col id="flexColSmall">
                      <Form.Label>Circle Name</Form.Label>
                    </Col>
                    <Col id="flexColBig">
                      <Form.Control
                        type="text"
                        name="newCircleName"
                        placeholder="Circle name"
                        onChange={this.handleChanges}
                      ></Form.Control>
                    </Col>
                  </Form.Row>
                </Form.Group>

                <Form.Group>
                  <Form.Row>
                    <Col id="flexColSmall">
                      <Form.Label>Circle Description</Form.Label>
                    </Col>
                    <Col id="flexColBig">
                      <Form.Control
                        type="text"
                        name="newCircleDescription"
                        placeholder="Circle Description"
                        onChange={this.handleChanges}
                      ></Form.Control>
                    </Col>
                  </Form.Row>
                </Form.Group>

                <Form.Group>
                  <Form.Row id="flexRow">
                    <Col id="flexColSmall">
                      <Form.Label>Leader</Form.Label>
                    </Col>
                    <Col id="flexColBig">
                      <Dropdown onSelect={this.handleAdding}>
                        <Dropdown.Toggle variant="success">
                          Select new leaders
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{dropDownLeaderUsers}</Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>{currentLeaders}</Form.Label>
                </Form.Group>

                <Form.Group>
                  <Form.Row id="flexRow">
                    <Col id="flexColSmall">
                      <Form.Label>Members</Form.Label>
                    </Col>
                    <Col id="flexColBig">
                      <Dropdown onSelect={this.handleAdding}>
                        <Dropdown.Toggle variant="success">
                          Select new members
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{dropDownMembersUsers}</Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>{currentMembers}</Form.Label>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={this.createCircle}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="rowButtons">{circles}</div>
          <div className="rowButtons">
            <div className="activeCircle">
              <Button
                className="myButton"
                onClick={this.createNewCircle}
              ></Button>
              <h6>Add New Circle</h6>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

// export default withRouter(ActiveCircles);
// export default ActiveCircles;
// THESE TAKE TIME TO SHOW UP!
const mapStateToProps = (state, ownProps) => {
  return {
    allCirclesRedux: state.firestore.ordered.circles,
    allUsersRedux: state.firestore.ordered.users,
    firebaseAuthRedux: state.firebase.auth
    // firebaseProfileRedux: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //this takes in a task ( which we pass in above) and calls dispatch which just calls a function on createTask
    // creatTask is created from above import, and that  takes us to TaskActions.js
    createCircleDispatch: circle => dispatch(createCircle(circle))
  };
};
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  //firestoreConnect takes in an array of of objects that say which collection you want to connect to
  //whenever database for this collection is changed, it will induce the firestoreReducer, which will sync store state
  // and then this component will "hear" that because we connected that. Then state will change for the store
  firestoreConnect([{ collection: "circles" }, { collection: "users" }])
)(ActiveCircles);
