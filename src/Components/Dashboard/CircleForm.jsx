import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import "./CircleForm.css";

import { connect } from "react-redux";
import { createCircle } from "../../Store/Actions/CircleActions";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";

class CircleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMembersOfNewCircle: [],
      newCircleDescription: "",
      newCircleName: "",
      currentLeadersOfNewCircle: []
    };

    this.createNewCircle = this.createNewCircle.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleAdding = this.handleAdding.bind(this);
    this.handleRemoving = this.handleRemoving.bind(this);
    this.createCircle = this.createCircle.bind(this);
  }
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
  handleAdding(eventKey, e) {
    const userID = eventKey;
    const name = e.target.textContent;
    const newMemberOrLeader = e.target.name;
    var checkMembersList;
    var checkLeadersList;
    var copyList;

    if (newMemberOrLeader === "newMember") {
      checkMembersList = this.state.currentMembersOfNewCircle.filter(
        member => member.userID === userID
      );
      checkLeadersList = this.state.currentLeadersOfNewCircle.filter(
        leader => leader.userID === userID
      );
      if (checkMembersList.length !== 0 || checkLeadersList.length !== 0) {
        return;
      }
      copyList = [
        ...this.state.currentMembersOfNewCircle,
        { userID: userID, name: name }
      ];

      this.setState({
        currentMembersOfNewCircle: copyList
      });
    } else if (newMemberOrLeader === "newLeader") {
      checkMembersList = this.state.currentMembersOfNewCircle.filter(
        member => member.userID === userID
      );
      checkLeadersList = this.state.currentLeadersOfNewCircle.filter(
        leader => leader.userID === userID
      );
      if (checkMembersList.length !== 0 || checkLeadersList.length !== 0) {
        return;
      }
      copyList = [
        ...this.state.currentLeadersOfNewCircle,
        { userID: userID, name: name }
      ];
      this.setState({
        currentLeadersOfNewCircle: copyList
      });
    }
  }

  handleRemoving(e) {
    e.preventDefault();
    const idToDelete = e.target.value;
    const newMemberOrLeader = e.target.name;
    var copyList;
    if (e.target.name === "deleteMember") {
      copyList = this.state.currentMembersOfNewCircle.filter(
        nameAndID => nameAndID.userID !== idToDelete
      );
      this.setState({
        currentMembersOfNewCircle: copyList
      });
    } else if (newMemberOrLeader === "deleteLeader") {
      copyList = this.state.currentLeadersOfNewCircle.filter(
        nameAndID => nameAndID.userID !== idToDelete
      );
      this.setState({
        currentLeadersOfNewCircle: copyList
      });
    }
  }
  createCircle(e) {
    e.preventDefault();
    console.log("creating");
    var newMemberList = {};
    var newLeaderList = {};

    this.state.currentMembersOfNewCircle.map(
      member => (newMemberList[member.userID] = member.name)
    );
    this.state.currentLeadersOfNewCircle.map(
      leader => (newLeaderList[leader.userID] = leader.name)
    );

    console.log(Object.keys(newLeaderList));

    var circleDetails = {
      circleName: this.state.newCircleName,
      circleDescription: this.state.newCircleDescription,
      memberList: newMemberList,
      leaderList: newLeaderList,
      numberOfPeople:
        Object.keys(newMemberList).length + Object.keys(newLeaderList).length
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
  render() {
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

    return (
      <div style={{ marginTop: 25 }}>
        <Modal show={this.props.show} onHide={this.props.hideModal}>
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
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allUsersRedux: state.firestore.ordered.users
    // firebaseAuthRedux: state.firebase.auth
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
  firestoreConnect([{ collection: "users" }])
)(CircleForm);
