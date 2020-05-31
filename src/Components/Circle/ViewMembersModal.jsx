import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import { Button } from "react-bootstrap";

class ViewMembersModal extends Component {
  constructor(props) {
    super(props);

    this.handleSendFriendRequest = this.handleSendFriendRequest.bind(this);
  }
  handleSendFriendRequest(selectedID, selectedName) {
    var profileData = this.props.profileData;
    var userID = this.props.userID;
    var userName = profileData.firstName + " " + profileData.lastName;
    var toList = { [selectedID]: selectedName };
    var friendInfo = {
      toList: toList,
      from: userID,
      fromName: userName
    };
    this.props.dispatchSendFriendRequest(friendInfo);
  }
  render() {
    var leaders = this.props.leaders;
    var members = this.props.members;
    var profileData = this.props.profileData;
    var friendRequests = this.props.friendRequests;

    if (!leaders || !members || !profileData || !friendRequests) {
      return null;
    }
    var displayLeaders = Object.keys(leaders).map((leaderID, index) => {
      var canSendFriendRequest = true;

      if (Object.keys(profileData.friendsList).includes(leaderID)) {
        canSendFriendRequest = false;
      }

      friendRequests.forEach(friendRequest => {
        // this person sent you a friend request already
        if (friendRequest.from === leaderID) {
          canSendFriendRequest = false;
        }
        // you have a friend request to this person already
        if (friendRequest.to === leaderID) {
          canSendFriendRequest = false;
        }
      });

      //this is me! can't send friend request...
      if (this.props.userID === leaderID) {
        canSendFriendRequest = false;
      }

      if (canSendFriendRequest) {
        return (
          <ListGroup.Item key={index}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              {leaders[leaderID]}
              <Button
                onClick={() =>
                  this.handleSendFriendRequest(leaderID, leaders[leaderID])
                }
                value={leaderID}
              >
                Add Friend
              </Button>
            </div>
          </ListGroup.Item>
        );
      } else {
        return <ListGroup.Item key={index}>{leaders[leaderID]}</ListGroup.Item>;
      }
    });

    var displayMembers = Object.keys(members).map((memberID, index) => {
      var canSendFriendRequest = true;
      if (Object.keys(profileData.friendsList).includes(memberID)) {
        canSendFriendRequest = false;
      }
      friendRequests.forEach(friendRequest => {
        // this person sent you a friend request already
        if (friendRequest.from === memberID) {
          canSendFriendRequest = false;
        }
        // you have a friend request to this person already
        if (friendRequest.to === memberID) {
          canSendFriendRequest = false;
        }
      });
      //this is me! can't send friend request...
      if (this.props.userID === memberID) {
        canSendFriendRequest = false;
      }

      if (canSendFriendRequest) {
        return (
          <ListGroup.Item key={index}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              {members[memberID]}
              <Button
                onClick={() =>
                  this.handleSendFriendRequest(memberID, members[memberID])
                }
                value={memberID}
              >
                Add Friend
              </Button>
            </div>
          </ListGroup.Item>
        );
      } else {
        return <ListGroup.Item key={index}>{members[memberID]}</ListGroup.Item>;
      }
    });
    return (
      <Modal
        show={this.props.showViewMembersModal}
        onHide={this.props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>View Leaders & Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1 style={{ fontSize: "1.5rem" }}>Leaders</h1>
          <ListGroup style={{ marginTop: "5%", marginBottom: "5%" }}>
            {displayLeaders.length > 0 ? (
              displayLeaders
            ) : (
              <p>No leaders to display</p>
            )}
          </ListGroup>
          <h1 style={{ fontSize: "1.5rem" }}>Members</h1>
          <ListGroup style={{ marginTop: "5%", marginBottom: "5%" }}>
            {displayMembers.length > 0 ? (
              displayMembers
            ) : (
              <p>
                No members to display. Maybe try adding a member to this Circle?
              </p>
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }
}

export default ViewMembersModal;
