import React, { Component } from "react";
import "./NavigationBar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class NavigationBar extends Component {
  render() {
    let homePage = this.props.isAuthed ? "/dashboard" : "/";
    var authID = this.props.isAuthed;
    var friendRequestClassName= null;
    if(this.props.friendRequests && authID) {
      var friendRequestToMe = this.props.friendRequests.filter((friendRequest) => friendRequest.to === authID);
      // I have a friendRequest for me to respond to
      if (friendRequestToMe.length > 0) {
        friendRequestClassName = "haveFriendRequest";
      }
    }
    const profileCircle = (
      <Nav.Link href="/profile" className={friendRequestClassName}>
        {this.props.profile.initials &&
          this.props.profile.initials.toUpperCase()}
      </Nav.Link>
    );
    let profilePage = (this.props.isAuthed && this.props.profile.initials && this.props.friendRequests) ? profileCircle : null;

    return (
      <Navbar id="navbar" bg="light" expand="lg" style={{ marginBottom: "1%" }}>
        <Navbar.Brand href={homePage}>Circles</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/*<Nav.Link href="/circle">Circle Example Broken</Nav.Link>*/}
            {this.props.signInUpOrOut}
          </Nav>
          <Navbar.Brand>{profilePage}</Navbar.Brand>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;
