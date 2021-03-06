import React, { useState } from "react";
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
      currentLeadersOfNewCircle: [],
      filterState: "",
      circleColor: "#007bff",
      circleHighlight: "#ff495c"
    };

    this.createNewCircle = this.createNewCircle.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleAdding = this.handleAdding.bind(this);
    this.handleRemoving = this.handleRemoving.bind(this);
    this.createCircle = this.createCircle.bind(this);
    this.filterAllUsers = this.filterAllUsers.bind(this);
    // this.filterMembers = this.filterMembers.bind(this);
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

    // Clear filter state
    this.setState({
      filterState: ""
    });
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
    var auth = this.props.firebaseAuthRedux;
    var yourID = auth.uid;

    var allCurrentUsersSelectedID = [];
    this.state.currentMembersOfNewCircle.forEach(member => {
      allCurrentUsersSelectedID.push(member.userID);
    });
    this.state.currentLeadersOfNewCircle.forEach(leader => {
      allCurrentUsersSelectedID.push(leader.userID);
    });

    var forHex = /^#[0-9a-fA-F]{6}$/;
    //check for empty things and I must be a leader/member and there must be a leader
    if (
      this.state.newCircleName === "" ||
      this.state.newCircleDescription === "" ||
      this.state.currentLeadersOfNewCircle.length === 0 ||
      !allCurrentUsersSelectedID.includes(yourID)
    ) {
      console.log("invalid paramaters");
      alert(
        "Circle Name, Circle Description, atleast 1 leader must be selected, and you must be a part of the circle."
      );
      return;
    } else if (
      !new RegExp(forHex).test(this.state.circleColor) &&
      this.state.circleColor.length !== 0
    ) {
      console.log("Invalid Circle Color,", this.state.circleColor);
      alert("Invalid Circle Color");
      return;
    } else if (
      !new RegExp(forHex).test(this.state.circleHighlight) &&
      this.state.circleColor.length !== 0
    ) {
      console.log("Invalid Circle Highlight");
      alert("Invalid Circle Highlight");
      return;
    }

    console.log("creating");
    var newMemberList = {};
    var newLeaderList = {};

    this.state.currentMembersOfNewCircle.map(member => {
      var leftBracket = member.name.indexOf("[");
      var slicedName = member.name.slice(
        leftBracket + 1,
        member.name.length - 1
      );
      newMemberList[member.userID] = slicedName;
    });

    this.state.currentLeadersOfNewCircle.map(leader => {
      var leftBracket = leader.name.indexOf("[");
      var slicedName = leader.name.slice(
        leftBracket + 1,
        leader.name.length - 1
      );
      newLeaderList[leader.userID] = slicedName;
    });

    // Populate points list, set everyone's points to zero in the beginning
    var everyone = this.state.currentLeadersOfNewCircle.concat(
      this.state.currentMembersOfNewCircle
    );

    var currentPoints = {};
    everyone.map(person => {
      currentPoints[person.userID] = 0;
    });

    var circleDetails = {
      circleName: this.state.newCircleName,
      circleDescription: this.state.newCircleDescription,
      memberList: newMemberList,
      leaderList: newLeaderList,
      numberOfPeople:
        Object.keys(newMemberList).length + Object.keys(newLeaderList).length,
      points: currentPoints,
      circleColor:
        this.state.circleColor.length === 0
          ? "#007bff"
          : this.state.circleColor,
      circleHighlight:
        this.state.circleHighlight.length === 0
          ? "#ff495c"
          : this.state.circleHighlight
    };

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

  // Filter out all users (leaders and members)
  filterAllUsers(currentUser) {
    var auth = this.props.firebaseAuthRedux;
    var yourID = auth.uid;
    var friendsListID = Object.keys(this.props.friendsList);
    var isFriend = false;

    if (!currentUser) {
      return false;
    }
    for (var i = 0; i < friendsListID.length; i++) {
      if (friendsListID[i] === currentUser.id) {
        isFriend = true;
      }
    }
    // You are your own friend!
    if (currentUser.id === yourID) {
      isFriend = true;
    }
    // If not a friend, don't display
    if (isFriend === false) {
      return false;
    }
    // If already leader, don't display
    for (var i = 0; i < this.state.currentLeadersOfNewCircle.length; i++) {
      if (this.state.currentLeadersOfNewCircle[i].userID === currentUser.id) {
        return false;
      }
    }
    // If already member, don't display
    for (var i = 0; i < this.state.currentMembersOfNewCircle.length; i++) {
      if (this.state.currentMembersOfNewCircle[i].userID === currentUser.id) {
        return false;
      }
    }
    // If yourself, display
    return true;
  }

  // filterMembers(currentUser) {
  //   // If already member, don't display
  //   for (var i = 0; i < this.state.currentMembersOfNewCircle.length; i++) {
  //     if (this.state.currentMembersOfNewCircle[i].userID === currentUser.id) {
  //       return false;
  //     }
  //   }
  //   // If already leader, don't display
  //   for (var i = 0; i < this.state.currentLeadersOfNewCircle.length; i++) {
  //     if (this.state.currentLeadersOfNewCircle[i].userID === currentUser.id) {
  //       return false;
  //     }
  //   }

  //   // Neither leader nor member
  //   return true;
  // }

  render() {
    var currentMembers = this.state.currentMembersOfNewCircle.map(
      (member, index) => (
        <Button
          value={member.userID}
          key={index}
          name="deleteMember"
          onClick={this.handleRemoving}
          style={{ margin: "5px" }}
        >
          {member.name}
        </Button>
      )
    );

    var currentLeaders = this.state.currentLeadersOfNewCircle.map(
      (leader, index) => (
        <Button
          value={leader.userID}
          key={index}
          name="deleteLeader"
          onClick={this.handleRemoving}
          style={{ margin: "5px" }}
        >
          {leader.name}
        </Button>
      )
    );

    var allUsers = this.props.allUsersRedux;

    if (allUsers && this.props.friendsList) {
      var filteredMembers = allUsers.filter(this.filterAllUsers);
      // filteredMembers = filteredMembers.slice(0, 10);
      var dropDownMembersUsers = filteredMembers.map((user, index) => (
        <Dropdown.Item
          user={user.id}
          eventKey={user.id}
          key={index}
          name="newMember"
        >
          {/* {user.firstName} {user.lastName} */}
          {"@" +
            user.username +
            " [" +
            user.firstName +
            " " +
            user.lastName +
            "]"}
        </Dropdown.Item>
      ));
      var emptyMemberDropDown = false;
      if (dropDownMembersUsers.length === 0) {
        emptyMemberDropDown = true;
      }

      // Filter users out based on filter state and whether they're already a leader
      var filteredUsers = allUsers.filter(this.filterAllUsers);
      var dropDownLeaderUsers = filteredUsers.map((user, index) => (
        <Dropdown.Item
          user={user.id}
          eventKey={user.id}
          key={index}
          name="newLeader"
        >
          {/* {user.firstName} {user.lastName} */}
          {"@" +
            user.username +
            " [" +
            user.firstName +
            " " +
            user.lastName +
            "]"}
        </Dropdown.Item>
      ));
      // console.log(dropDownLeaderUsers);
      var emptyLeaderDropDown = false;
      if (dropDownLeaderUsers.length === 0) {
        emptyLeaderDropDown = true;
      }
    }

    console.log(this.state);

    var circleColorTextColor;
    var circleHighlightTextColor;
    var forHex = /^#[0-9a-fA-F]{6}$/;
    // var forHex = /#[0-9a-fA-f]{6}/;

    console.log(this.state.circleColor);
    console.log(new RegExp(forHex).test(this.state.circleColor));
    if (
      this.state.circleColor.length === 7 &&
      new RegExp(forHex).test(this.state.circleColor)
    ) {
      console.log("valid circle color");
      circleColorTextColor = this.state.circleColor;
    } else if (this.state.circleColor.length === 0) {
      circleColorTextColor = "#007bff"; //blue
    } else {
      circleColorTextColor = "#212529"; //black
    }

    if (
      this.state.circleHighlight.length === 7 &&
      new RegExp(forHex).test(this.state.circleHighlight)
    ) {
      console.log("valid circle color");
      circleHighlightTextColor = this.state.circleHighlight;
    } else if (this.state.circleHighlight.length === 0) {
      circleHighlightTextColor = "#ff495c"; //red
    } else {
      circleHighlightTextColor = "#212529"; //black
    }
    return (
      <div style={{ marginTop: 25 }}>
        <Modal show={this.props.show} onHide={this.props.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create a New Circle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ color: "red" }}>
              Note: you must include a name, description, at least one leader,
              and you must be a part of the circle. You may only include your{" "}
              <strong>friends</strong>. Add friends{" "}
              <a
                href="/profile"
                style={{ color: "red", textDecoration: "underline" }}
              >
                here
              </a>
              .
            </p>
            <Form name="newCircleForm">
              <Form.Group>
                <Form.Row>
                  <Col id="myFlexColSmall">
                    <Form.Label>Circle Name</Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Form.Control
                      type="text"
                      name="newCircleName"
                      placeholder="Circle name"
                      onChange={this.handleChanges}
                      required={true}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col id="flexColSmall">
                    <Form.Label>Circle Description</Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Form.Control
                      type="text"
                      name="newCircleDescription"
                      placeholder="Circle Description"
                      onChange={this.handleChanges}
                      required={true}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col id="flexColSmall">
                    <Form.Label style={{ color: circleColorTextColor }}>
                      Circle Color
                    </Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Form.Control
                      type="text"
                      name="circleColor"
                      placeholder="Default: #007bff"
                      onChange={this.handleChanges}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col id="flexColSmall">
                    <Form.Label
                      style={{
                        color: circleHighlightTextColor
                      }}
                    >
                      Circle Highlight
                    </Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Form.Control
                      type="text"
                      name="circleHighlight"
                      placeholder="Default #ff495c"
                      onChange={this.handleChanges}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row id="flexRow">
                  <Col id="myFlexColSmall">
                    <Form.Label>Leaders</Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Dropdown
                      onSelect={this.handleAdding}
                      style={{ minWidth: "70%" }}
                      drop="down"
                    >
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      >
                        Select Leaders{" "}
                      </Dropdown.Toggle>

                      <Dropdown.Menu as={CustomMenu}>
                        {dropDownLeaderUsers}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>{currentLeaders}</Form.Group>

              <Form.Group>
                <Form.Row id="flexRow">
                  <Col id="myFlexColSmall">
                    <Form.Label>Members</Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Dropdown
                      onSelect={this.handleAdding}
                      style={{ minWidth: "70%" }}
                      drop="down"
                    >
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      >
                        Select Members{" "}
                      </Dropdown.Toggle>

                      <Dropdown.Menu as={CustomMenu}>
                        {dropDownMembersUsers}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>{currentMembers}</Form.Group>
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

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
    variant="outline-primary"
    style={{ minWidth: "80%" }}
  >
    {children}
    &#x25bc;
  </Button>
));

// for Dropdown
// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    var allShow = React.Children.toArray(children).filter(child => {
      var checkBasic = !value;
      var usernameAndFullName = child.props.children;
      var checkUsername = usernameAndFullName
        .toString()
        .toLowerCase()
        .startsWith(value.toLowerCase(), 1);
      var leftBracket = usernameAndFullName.indexOf("[");
      var slicedName = usernameAndFullName.slice(
        leftBracket + 1,
        usernameAndFullName.length - 1
      );
      var fullName = slicedName;

      var checkFullName = fullName
        .toString()
        .toLowerCase()
        .startsWith(value.toLowerCase(), 0);
      return checkBasic || checkUsername || checkFullName;
    });

    allShow.sort(function(user1, user2) {
      var user1Name = user1.props.children;
      var user2Name = user2.props.children;
      return user1Name.localeCompare(user2Name);
    });

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
        style={{ maxHeight: "1000%", overflowY: "auto", width: "auto" }}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Enter username"
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">{allShow}</ul>
      </div>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    allUsersRedux: state.firestore.ordered.users,
    firebaseAuthRedux: state.firebase.auth
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
