import React, { Component } from "react";
import "./NavigationBar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class NavigationBar extends Component {
  render() {
    console.log(this.props.isAuthed);
    let homePage = this.props.isAuthed ? "/dashboard" : "/getstarted";

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href={homePage}>Circles</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/circle">Circle Example</Nav.Link>
            {this.props.signInUpOrOut}
          </Nav>
          <Navbar.Brand>
            {this.props.profile.initials &&
              this.props.profile.initials.toUpperCase()}
          </Navbar.Brand>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;
