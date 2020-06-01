import React, { Component } from "react";
import "./NavigationBar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import defaultPic from "../Profile/pic.png";
import { Image } from "react-bootstrap";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: defaultPic
    };

    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    this.handleUpdateProfile();

    this.props.updateMyAppStateToIncludeYourNavBarUpdateProfile(
      this.handleUpdateProfile
    );
  }
  //profile refers to the current user's profile. every profile should point to a different path
  handleUpdateProfile() {
    let storageRef = this.props.firebase
      .storage()
      .ref(this.props.isAuthed + "/" + "profilepic");
    storageRef.getDownloadURL().then(url => this.setState({ source: url }));
  }

  render() {
    let homePage = this.props.isAuthed ? "/dashboard" : "/";
    var authID = this.props.isAuthed;
    var friendRequestClassName = null;
    if (this.props.friendRequests && authID) {
      var friendRequestToMe = this.props.friendRequests.filter(
        friendRequest => friendRequest.to === authID
      );
      // I have a friendRequest for me to respond to
      if (friendRequestToMe.length > 0) {
        friendRequestClassName = "haveFriendRequest";
      }
    }
    const profileCircle = (
      <Nav.Link href="/profile" className={"blueTextAndBigger"}>
        {/* {this.props.profile.initials &&
          this.props.profile.initials.toUpperCase()} */}
        &nbsp;
        <Image
          src={this.state.source}
          alt="loading from firebase"
          className={friendRequestClassName + " smallImage"}
          // style={{ border: "1px solid #ddd" }}
        ></Image>
      </Nav.Link>
    );
    let profilePage =
      this.props.isAuthed &&
      this.props.profile.initials &&
      this.props.friendRequests
        ? profileCircle
        : null;

    return (
      <Navbar id="navbar" bg="light" expand="lg">
        <Navbar.Brand href={homePage} className={"blueText"}>
          Circles
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href={homePage}>Dashboard</Nav.Link>
          {/* <Nav.Link href={"/circle/7f73db03-520c-4bc8-a8cf-c7957d2c94a2?"}>
            Walking
          </Nav.Link> */}
        </Nav>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/*<Nav.Link href="/circle">Circle Example Broken</Nav.Link>*/}
            {profilePage}
            {this.props.signInUpOrOut}
          </Nav>
          {/* <Navbar.Brand>{profilePage}</Navbar.Brand>  */}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    firebase: state.firebase
  };
};

export default compose(
  connect(mapStateToProps),
  firebaseConnect()
)(NavigationBar);
