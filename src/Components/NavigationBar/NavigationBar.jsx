import React, { Component } from "react";
import "./NavigationBar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import defaultPic from "../Profile/pic.png";
import { Image } from "react-bootstrap";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import { autofill } from "redux-form";
import "../../../node_modules/@fortawesome/fontawesome-free/js/all";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: defaultPic,
    };

    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    this.handleUpdateProfile();

    this.props.updateMyAppStateToIncludeYourNavBarUpdateProfile(
      this.handleUpdateProfile
    );
    this.changeVisibility = this.changeVisibility.bind(this);
  }
  //profile refers to the current user's profile. every profile should point to a different path
  handleUpdateProfile() {
    let storageRef = this.props.firebase
      .storage()
      .ref(this.props.isAuthed + "/" + "profilepic");
    storageRef.getDownloadURL().then((url) => this.setState({ source: url }));
  }

  changeVisibility(showHover) {
    console.log("change visibility");
    var element = document.getElementById("info");
    console.log(element);
    if (element && element.style) {
      if (showHover) {
        element.style.visibility = "visible";
      } else {
        element.style.visibility = "hidden";
      }
    }
  }

  render() {
    let homePage = this.props.isAuthed ? "/dashboard" : "/";
    var authID = this.props.isAuthed;
    var friendRequestClassName = null;
    if (this.props.friendRequests && authID) {
      var friendRequestToMe = this.props.friendRequests.filter(
        (friendRequest) => friendRequest.to === authID
      );
      // I have a friendRequest for me to respond to
      if (friendRequestToMe.length > 0) {
        friendRequestClassName = "haveFriendRequest";
      }
    }
    const profileCircle = (
      <Nav.Link
        href="/profile"
        className={"blueTextAndBigger"}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* {this.props.profile.initials &&
          this.props.profile.initials.toUpperCase()} */}
        {/* &nbsp; */}
        {/* <Image
          src={this.state.source}
          alt="loading from firebase"
          className={friendRequestClassName + " smallImage"}
          // style={{ border: "1px solid #ddd" }}
        ></Image> */}
        <i class="fas fa-user-circle fa-3x" style={{ color: "#007bff" }}></i>
        &nbsp;
        <div
          className={"text-center " + friendRequestClassName}
          style={{ color: "#007bff" }}
        >
          {this.props.profile.firstName}
        </div>
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
            <Nav.Link>
              {/* <div
                style={{
                  // border: "2px solid pink",
                  width: "50px",
                  height: "50px",
                  borderRadius: "100%",
                  backgroundColor: "pink",
                }}
              >
                I
              </div> */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={(e) => this.changeVisibility(true)}
                onMouseLeave={(e) => this.changeVisibility(false)}
              >
                <i
                  class="fas fa-info-circle fa-3x"
                  style={{ color: "#007bff" }}
                ></i>
                <span
                  style={{
                    backgroundColor: "#4ca2ff",
                    color: "white",
                    width: "300px",
                    textAlign: "left",
                    padding: "10px",
                    borderRadius: "6px",
                    position: "absolute",
                    visibility: "hidden",
                    top: "120%",
                    left: "50%",
                    marginLeft: "-200px",
                    zIndex: "1",
                  }}
                  id="info"
                >
                  Here are the latest updates ✨
                  <ul>
                    <li>You can now change your Circle color!</li>
                    <li>You can now view the latest updates</li>
                    <li>
                      You can now delete your account if you would like to
                    </li>
                  </ul>
                </span>
              </div>
            </Nav.Link>
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
    firebase: state.firebase,
  };
};

export default compose(
  connect(mapStateToProps),
  firebaseConnect()
)(NavigationBar);
