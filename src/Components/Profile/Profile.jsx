import React, { Component } from "react";
import "./Profile.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  deleteFriends
} from "../../Store/Actions/FriendActions";
//
import Picture from "./Picture";
import ProfileStatus from "./ProfileStatus";
import FriendOptionsModal from "./FriendOptionsModal";
import AccountSettings from "./AccountSettings";
import { Button, Card } from "react-bootstrap";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { showFriendOptionsModal: false };

    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // this.handleFriendOptions = this.handleFriendOptions.bind(this);
    this.handleAddingFriend = this.handleAddingFriend.bind(this);
    this.handleCancelFriendRequest = this.handleCancelFriendRequest.bind(this);
    this.handleAcceptFriendRequest = this.handleAcceptFriendRequest.bind(this);
    this.handleDeleteFriends = this.handleDeleteFriends.bind(this);
  }

  // For showing modal (creating new task)
  handleClick(e) {
    switch (e.target.name) {
      case "friendOptionsButton":
        this.setState({
          showFriendOptionsModal: true
        });
        return;
      default:
        return;
    }
  }
  handleClose() {
    this.setState({
      showFriendOptionsModal: false
    });
  }

  // handleFriendOptions(newFriendOptions) {
  //   console.log("newFriendOptions");
  // }

  handleAddingFriend(friendInfo) {
    console.log("create Friend Request");
    this.props.dispatchSendFriendRequest(friendInfo);
  }

  handleCancelFriendRequest(friedRequestDocumentID) {
    console.log("inside Profile: delete friend request");
    this.props.dispatchCancelFriendRequest(friedRequestDocumentID);
  }

  handleAcceptFriendRequest(friendRequest) {
    console.log("inside Profile: accept friend request");
    this.props.dispatchAcceptFriendRequest(friendRequest);
  }

  handleDeleteFriends(deleteInfo) {
    console.log("deleting friends");
    this.props.dispatchDeleteFriends(deleteInfo);
  }

  render() {
    if (!this.props.isAuthed) {
      return <Redirect to="/" />;
    } else {
      const profileData = this.props.firebaseProfileRedux;
      const allUsers = this.props.firestoreUsersRedux;
      var userID = this.props.firebaseAuthRedux.uid;
      var allLoaded = false;
      var myFriendRequests;
      var incomingFriendRequests;
      if (this.props.firestoreFriendRequestsRedux) {
        myFriendRequests = this.props.firestoreFriendRequestsRedux.filter(
          friendRequest => friendRequest.from === userID
        );
        incomingFriendRequests = this.props.firestoreFriendRequestsRedux.filter(
          friendRequest => friendRequest.to === userID
        );
        allLoaded = true;
      }
      var myFriends;
      if (profileData && profileData.friendsList) {
        myFriends = Object.entries(profileData.friendsList).map(
          (friendIDAndName, index) => {
            return (
              <Card
                id="task-card"
                style={{
                  width: "100%!important",
                  margin: "auto",
                  marginBottom: "10px"
                }}
                key={index}
                className="card flex-row"
                // key={index}
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
                    {friendIDAndName[1]}
                  </Card.Title>
                  {/* <div>
                    <Button
                      // value={request}
                      // onClick={() => this.handleAcceptFriendRequest(request)}
                      style={{ margin: "5px" }}
                    >
                      Accept
                    </Button>
                  </div> */}
                </Card.Body>
              </Card>
            );
          }
        );
      }

      var friendRequestClassName = null;
      var authID = this.props.firebaseAuthRedux.uid;
      if (this.props.firestoreFriendRequestsRedux && authID) {
        var friendRequestToMe = this.props.friendRequests.filter(
          friendRequest => friendRequest.to === authID
        );
        // I have a friendRequest for me to respond to
        if (friendRequestToMe.length > 0) {
          friendRequestClassName = "outline-danger";
        }
      }

      return (
        <div style={{ padding: "1%" }}>
          <div className="settings">
            <AccountSettings />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              padding: "5%"
            }}
          >
            <div className="panelContainer" style={{ width: "30%" }}>
              <div className="panelItem" style={{ width: "100%" }}>
                <Picture
                  auth={this.props.firebaseAuthRedux}
                  handleNavBarUpdateProfile={
                    this.props.handleNavBarUpdateProfile
                  }
                />
                {/* <ProfileStatus profileData={profileData} /> */}
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <h2 style={{ textAlign: "center" }}>Friends List</h2>
              {allLoaded ? (
                <div style={{ textAlign: "center", padding: "1%" }}>
                  <Button
                    name="friendOptionsButton"
                    onClick={this.handleClick}
                    style={{ margin: "7.5px 7.5px 15.5px 7.5px" }}
                    size="lg"
                    variant={
                      friendRequestClassName
                        ? friendRequestClassName
                        : "outline-primary"
                    }
                  >
                    Manage Friends
                  </Button>
                </div>
              ) : null}
              {myFriends ? myFriends : null}
              <FriendOptionsModal
                showFriendOptionsModal={this.state.showFriendOptionsModal}
                handleClose={this.handleClose}
                handleAddingFriend={this.handleAddingFriend}
                profileData={profileData}
                allUsers={allUsers}
                userID={userID}
                myFriendRequests={myFriendRequests}
                myIncomingFriendRequests={incomingFriendRequests}
                handleCancelFriendRequest={this.handleCancelFriendRequest}
                handleAcceptFriendRequest={this.handleAcceptFriendRequest}
                handleDeleteFriends={this.handleDeleteFriends}
                firebase={this.props.firebase}
                friendRequestClassName={friendRequestClassName}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    firebaseAuthRedux: state.firebase.auth,
    firebaseProfileRedux: state.firebase.profile,
    firestoreUsersRedux: state.firestore.ordered.users,
    firestoreFriendRequestsRedux: state.firestore.ordered.friendRequests,
    firebase: state.firebase
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchSendFriendRequest: friendInfo =>
      dispatch(sendFriendRequest(friendInfo)),
    dispatchCancelFriendRequest: friendRequestDocumentID =>
      dispatch(cancelFriendRequest(friendRequestDocumentID)),
    dispatchAcceptFriendRequest: friendRequest =>
      dispatch(acceptFriendRequest(friendRequest)),
    dispatchDeleteFriends: deleteInfo => dispatch(deleteFriends(deleteInfo))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    if (props.firebaseAuthRedux.uid) {
      return [
        { collection: "circles" },
        { collection: "users" },
        {
          collection: "friendRequests",
          where: [
            ["allUsersRelated", "array-contains", props.firebaseAuthRedux.uid]
          ]
        }
      ];
    } else {
      return [
        { collection: "circles" },
        { collection: "users" },
        {
          collection: "friendRequests"
        }
      ];
    }
  })
)(Profile);
