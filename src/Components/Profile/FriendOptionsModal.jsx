import React, { Component, useState } from "react";
import { Modal, Button, Form, Col, Dropdown, Card } from "react-bootstrap";

class InviteMembersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFriendList: [],
      currentForm: "adding"
    };

    this.swapForms = this.swapForms.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.filterAddFriend = this.filterAddFriend.bind(this);
    this.handleAddingToList = this.handleAddingToList.bind(this);
    this.handleRemovingFromList = this.handleRemovingFromList.bind(this);
    this.handleAddingFriend = this.handleAddingFriend.bind(this);
    this.handleCancelFriendRequest = this.handleCancelFriendRequest.bind(this);
    this.handleAcceptFriendRequest = this.handleAcceptFriendRequest.bind(this);
  }

  swapForms(e) {
    switch (e.target.name) {
      case "addingButton":
        this.setState({
          currentForm: "adding"
        });
        return;
      case "pendingButton":
        this.setState({
          currentForm: "pending"
        });
        return;
      case "requestingButton":
        this.setState({
          currentForm: "requesting"
        });
        return;
      default:
        return;
    }
  }

  handleForm() {
    console.log("submit");
  }

  filterAddFriend(user) {
    var id = user.id;
    // if current user
    if (id === this.props.userID) {
      return false;
    }

    const profileData = this.props.profileData;
    var myCurrentFriendList = profileData.friendsList;
    // if already a friend
    var myCurrentFriendListIDs = Object.keys(myCurrentFriendList);
    if (myCurrentFriendListIDs.includes(id)) {
      return false;
    }

    //if already in addFriendList
    for (var i = 0; i < this.state.addFriendList.length; i++) {
      if (this.state.addFriendList[i].userID === id) {
        return false;
      }
    }

    //if already sent a friend Request
    for (var i = 0; i < this.props.myFriendRequests.length; i++) {
      if (this.props.myFriendRequests[i].to === id) {
        return false;
      }
    }

    //if you haven't accepted/declined an incoming friend request
    for (var i = 0; i < this.props.myIncomingFriendRequests.length; i++) {
      if (this.props.myIncomingFriendRequests[i].from === id) {
        return false;
      }
    }

    // if you have an incoming friendRequest

    return true;
  }

  handleAddingToList(eventKey, e) {
    const userID = eventKey;
    const name = e.target.textContent;
    const addingOrRequestingOrPending = e.target.name;
    var copyList;

    if (addingOrRequestingOrPending === "adding") {
      copyList = [...this.state.addFriendList, { userID: userID, name: name }];

      this.setState({
        addFriendList: copyList
      });
    }
  }

  handleRemovingFromList(e) {
    e.preventDefault();
    const idToDelete = e.target.value;
    const deleteFromAddingRequestingPending = e.target.name;
    var copyList;
    if (deleteFromAddingRequestingPending === "removeFromAddFriendList") {
      copyList = this.state.addFriendList.filter(
        nameAndID => nameAndID.userID !== idToDelete
      );
      this.setState({
        addFriendList: copyList
      });
    }
  }

  handleAddingFriend(e) {
    e.preventDefault();
    if (this.state.addFriendList.length === 0) {
      return;
    }

    const profileData = this.props.profileData;
    const userID = this.props.userID;

    var newFriendList = {};
    this.state.addFriendList.map((friend, index) => {
      var leftBracket = friend.name.indexOf("[");
      var slicedName = friend.name.slice(
        leftBracket + 1,
        friend.name.length - 1
      );
      this.state.addFriendList[index] = {
        userID: friend.userID,
        name: slicedName
      };
    });

    this.state.addFriendList.map(userIDAndName => {
      newFriendList[userIDAndName.userID] = userIDAndName.name;
    });
    var friendInfo = {
      from: userID,
      fromName: profileData.firstName + " " + profileData.lastName,
      toList: newFriendList
    };
    console.log(friendInfo);

    this.props.handleAddingFriend(friendInfo);

    //find form
    var frm = document.getElementsByName("addingForm")[0];
    frm.reset();
    this.setState({
      addFriendList: [],
      currentForm: "adding"
    });
  }

  handleCancelFriendRequest(e) {
    e.preventDefault();

    var friendRequestDocumentID = e.target.value;
    this.props.handleCancelFriendRequest(friendRequestDocumentID);
  }

  handleAcceptFriendRequest(request) {
    // e.preventDefault();

    // var friendRequest = e.target.value;
    // console.log(request);

    this.props.handleAcceptFriendRequest(request);
  }

  render() {
    const allUsers = this.props.allUsers;
    const profileData = this.props.profileData;

    console.log(this.state.currentForm);
    // var myCurrentFriendList = profileData.friendsList;
    // console.log(myCurrentFriendList);

    var allUsersNotFriendsNotMe;

    if (
      allUsers &&
      this.props.myFriendRequests &&
      this.props.myIncomingFriendRequests
    ) {
      allUsersNotFriendsNotMe = allUsers.filter(this.filterAddFriend);

      // allUsersNotFriendsNotMe = allUsersNotFriendsNotMe.slice(0, 5);

      var dropDownNotFriendsNotMe = allUsersNotFriendsNotMe.map(
        (user, index) => {
          return (
            <Dropdown.Item
              user={user.id}
              eventKey={user.id}
              key={index}
              name="adding"
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
          );
        }
      );

      var myFriendRequestsSent;
      // console.log(this.props.myFriendRequests);
      myFriendRequestsSent = this.props.myFriendRequests.map(
        (request, index) => (
          <Card
            id="task-card"
            style={{
              width: "100%!important",
              margin: "auto",
              marginBottom: "10px"
            }}
            className="card flex-row"
            key={index}
          >
            <Card.Body
              className="flex-row"
              style={{
                width: 450,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Card.Title
                style={{
                  margin: 0
                }}
              >
                {request.toName}
              </Card.Title>
              <div>
                {
                  <Button
                    value={request.id}
                    onClick={this.handleCancelFriendRequest}
                    style={{ margin: "5px" }}
                  >
                    Cancel
                  </Button>
                }
              </div>
            </Card.Body>
          </Card>
        )
      );

      var myIncomingFriendRequests;
      // console.log(this.props.myIncomingFriendRequests);
      myIncomingFriendRequests = this.props.myIncomingFriendRequests.map(
        (request, index) => (
          <Card
            id="task-card"
            style={{
              width: "100%!important",
              margin: "auto",
              marginBottom: "10px"
            }}
            className="card flex-row"
            key={index}
          >
            <Card.Body
              className="flex-row"
              style={{
                width: 450,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Card.Title
                style={{
                  margin: 0
                }}
              >
                {request.fromName}
              </Card.Title>
              <div>
                <Button
                  value={request}
                  onClick={() => this.handleAcceptFriendRequest(request)}
                  style={{ margin: "5px" }}
                >
                  Accept
                </Button>
                <Button
                  value={request.id}
                  onClick={this.handleCancelFriendRequest}
                  style={{ margin: "5px" }}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        )
      );
    }

    var currentlySelectedAddingFriend = this.state.addFriendList.map(
      (member, index) => (
        <Button
          value={member.userID}
          key={index}
          name="removeFromAddFriendList"
          onClick={this.handleRemovingFromList}
          style={{ margin: "5px" }}
        >
          {member.name}
        </Button>
      )
    );

    return (
      <div>
        <Modal
          show={this.props.showFriendOptionsModal}
          onHide={this.props.handleClose}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px"
            }}
          >
            {this.state.currentForm !== "adding" ? (
              <Button
                name="addingButton"
                style={{ margin: "5px" }}
                onClick={this.swapForms}
              >
                Add Friend
              </Button>
            ) : null}
            {this.state.currentForm !== "requesting" ? (
              <Button
                name="requestingButton"
                style={{ margin: "5px" }}
                onClick={this.swapForms}
              >
                Incoming Requests
              </Button>
            ) : null}
            {this.state.currentForm !== "pending" ? (
              <Button
                name="pendingButton"
                style={{ margin: "5px" }}
                onClick={this.swapForms}
              >
                Your Requests
              </Button>
            ) : null}
          </div>
          {this.state.currentForm === "adding" ? (
            <Form name="addingForm" onSubmit={this.handleAddingFriend}>
              <Modal.Header>
                <Modal.Title>Add Friends</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Label>
                  Note: you may only either send a friend request or accept a
                  friend request with one click.
                </Form.Label>
                <Form.Group>
                  <Form.Row id="flexRow">
                    <Col id="myFlexColSmall">
                      <Form.Label>Add Friend</Form.Label>
                    </Col>
                    <Col id="myFlexColBig">
                      {/* <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select new members
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{listOfUsersForAdding}</Dropdown.Menu>
                      </Dropdown> */}
                      <Dropdown
                        onSelect={this.handleAddingToList}
                        style={{ minWidth: "70%" }}
                        drop="down"
                      >
                        <Dropdown.Toggle
                          as={CustomToggle}
                          id="dropdown-custom-components"
                        >
                          Select new friends
                        </Dropdown.Toggle>

                        <Dropdown.Menu as={CustomMenu}>
                          {dropDownNotFriendsNotMe}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <Form.Group>{currentlySelectedAddingFriend}</Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.handleClose}> Close </Button>
                <Button onClick={this.handleAddingFriend}>Submit</Button>
              </Modal.Footer>
            </Form>
          ) : null}

          {this.state.currentForm === "requesting" ? (
            <Form name="addingForm">
              <Modal.Header>
                <Modal.Title>Incoming Requests</Modal.Title>
              </Modal.Header>

              <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                {myIncomingFriendRequests && myIncomingFriendRequests.length > 0
                  ? myIncomingFriendRequests
                  : "You have no incoming requests."}
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.handleClose}>Close</Button>
              </Modal.Footer>
            </Form>
          ) : null}

          {this.state.currentForm === "pending" ? (
            <Form>
              <Modal.Header>
                <Modal.Title>Your Requests</Modal.Title>
              </Modal.Header>

              <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                {myFriendRequestsSent && myFriendRequestsSent.length > 0
                  ? myFriendRequestsSent
                  : "You have no pending requests."}
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.handleClose}>Close</Button>
              </Modal.Footer>
            </Form>
          ) : null}
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

    var allShow = React.Children.toArray(children).filter(
      child =>
        !value ||
        child.props.children
          .toString()
          .toLowerCase()
          .startsWith(value, 1)
    );
    var toShow = allShow;
    if (allShow.length > 10) {
      toShow = allShow.slice(0, 10);
    }

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
        <ul className="list-unstyled">{toShow}</ul>
      </div>
    );
  }
);

export default InviteMembersModal;
