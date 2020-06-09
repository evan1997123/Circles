import React, { Component } from "react";

// import { connect } from "react-redux";
// import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
// import { compose } from "redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Modal, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "./AccountSettings.css";

// import {
//   setUsername,
//   setFirstName,
//   setLastName,
//   setEmail,
//   setPassword
// } from "../../Store/Actions/SettingsActions";

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      // firstName: "",
      // lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      updateSettingsError: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.accountSettingsHandleClose = this.accountSettingsHandleClose.bind(
      this
    );
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  accountSettingsHandleClose() {
    this.setState({
      username: "",
      // firstName: "",
      // lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      updateSettingsError: "",
    });
    this.props.handleClose();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.updateSettingsError !== this.props.updateSettingsError &&
      prevProps.show === this.props.show
    ) {
      this.setState({
        updateSettingsError: this.props.updateSettingsError,
      });
      return;
    }
    if (
      this.props.profileData &&
      this.props.firebaseAuthRedux &&
      prevProps !== this.props &&
      prevProps.show !== this.props.show
    ) {
      this.setState({
        username: this.props.profileData.username,
        // firstName: this.props.profileData.firstName,
        // lastName: this.props.profileData.lastName,
        email: this.props.firebaseAuthRedux.email,
      });
    }
  }

  handleSubmit(e) {
    var newSettings;
    var oldSettings;

    if (this.state.confirmPassword !== this.state.password) {
      alert("Password and Confirm Password do not match");
      return;
    }
    console.log(this.state.email, this.props.firebaseAuthRedux.email);
    if (
      this.state.password !== "" &&
      this.state.email !== this.props.firebaseAuthRedux.email
    ) {
      alert("You may only change your email OR your password in one update.");
      return;
    }
    newSettings = {
      // firstName: this.state.firstName,
      username: this.state.username,
      // lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };
    var profileData = this.props.profileData;
    var firebaseAuthRedux = this.props.firebaseAuthRedux;

    oldSettings = {
      // firstName: profileData.firstName,
      username: profileData.username,
      // lastName: profileData.lastName,
      email: firebaseAuthRedux.email,
    };
    this.props.handleUpdateSettings(newSettings, oldSettings);
  }

  // handleSetUsername = e => {
  //   e.preventDefault();
  //   this.props.dispatchSetUsername(
  //     this.state.username,
  //     this.props.firebaseAuthRedux.uid
  //   );
  // };

  // handleSetFirstName = e => {
  //   e.preventDefault();
  //   this.props.dispatchSetFirstName(
  //     this.state.firstName,
  //     this.props.firebaseAuthRedux.uid
  //   );
  // };

  // handleSetLastName = e => {
  //   e.preventDefault();
  //   this.props.dispatchSetLastName(
  //     this.state.lastName,
  //     this.props.firebaseAuthRedux.uid
  //   );
  // };

  // handleSetEmail = e => {
  //   e.preventDefault();
  //   this.props.dispatchSetEmail(
  //     this.state.email,
  //     this.props.firebaseAuthRedux.uid
  //   );
  // };

  // handleSetPassword = e => {
  //   e.preventDefault();
  //   this.props.dispatchSetPassword(
  //     this.state.password,
  //     this.props.firebaseAuthRedux.uid
  //   );
  // };

  render() {
    if (!this.props.profileData || !this.props.firebaseAuthRedux) {
      return null;
    }
    if (this.props.firebaseAuthRedux && !this.props.firebaseAuthRedux.uid) {
      return <Redirect to="/" />;
    }

    // var userID = this.props.firebaseAuthRedux.uid;
    // var u = this.props.profileData;
    var changed;
    var profileData = this.props.profileData;
    if (
      profileData.username === this.state.username &&
      // profileData.firstName === this.state.firstName &&
      // profileData.lastName === this.state.lastName &&
      this.props.firebaseAuthRedux.email === this.state.email &&
      !this.state.confirmPassword &&
      !this.state.password
    ) {
      changed = false;
    } else {
      changed = true;
    }

    // if (this.props.updateSettingsError) {
    //   console.log(this.props.updateSettingsError);
    // }
    // console.log(this.props.profileData);
    return (
      <Modal show={this.props.show} onHide={this.accountSettingsHandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Account Settings</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p style={{ color: "red" }}>
            Note: you may only change your email OR your password in one update.
          </p>
          <Form>
            {/* <div>
            <h6>
              {u ? "Username: " + u.username : ""}
              <br />
              {u ? "First Name: " + u.firstName : ""}
              <br />
              {u ? "Last Name: " + u.lastName : ""}
            </h6>
          </div> */}

            <Form.Group>
              <Form.Row>
                <Col id="myFlexColSmall">
                  <Form.Label>Username:</Form.Label>
                </Col>
                <Col id="myFlexColBig">
                  <Form.Control
                    type="text"
                    id="username"
                    onChange={this.handleChange}
                    value={this.state.username}
                  />
                </Col>
              </Form.Row>
            </Form.Group>

            {/* <Form.Group>
              <Form.Row>
                <Col id="myFlexColSmall">
                  <label>First Name:</label>
                </Col>
                <Col id="myFlexColBig">
                  <Form.Control
                    type="text"
                    id="firstName"
                    onChange={this.handleChange}
                    value={this.state.firstName}
                  />
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Row>
                <Col id="myFlexColSmall">
                  <label>Last Name:</label>
                </Col>
                <Col id="myFlexColBig">
                  <Form.Control
                    type="text"
                    id="lastName"
                    onChange={this.handleChange}
                    value={this.state.lastName}
                  />
                </Col>
              </Form.Row>
            </Form.Group> */}

            <Form.Group>
              <Form.Row>
                <Col id="myFlexColSmall">
                  <label>Email:</label>
                </Col>
                <Col id="myFlexColBig">
                  <Form.Control
                    type="email"
                    id="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Row>
                <Col id="myFlexColSmall">
                  <label>Password:</label>
                </Col>
                <Col id="myFlexColBig">
                  <Form.Control
                    type="password"
                    id="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                  />
                </Col>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Row>
                <Col id="myFlexColSmall">
                  <label>Confirm Password:</label>
                </Col>
                <Col id="myFlexColBig">
                  <Form.Control
                    type="password"
                    id="confirmPassword"
                    onChange={this.handleChange}
                    value={this.state.confirmPassword}
                  />
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>

          {this.state.updateSettingsError ? (
            <p style={{ color: "red" }}>{this.state.updateSettingsError}</p>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            type="submit"
            onClick={this.handleSubmit}
            disabled={!changed}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

// const mapStateToProps = (state, ownProps) => {
//   return {
//     firebaseAuthRedux: state.firebase.auth,
//     firestoreUsersRedux: state.firestore.ordered.users
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     dispatchSetUsername: (username, uid) =>
//       dispatch(setUsername(username, uid)),
//     dispatchSetFirstName: (firstname, uid) =>
//       dispatch(setFirstName(firstname, uid)),
//     dispatchSetLastName: (lastname, uid) =>
//       dispatch(setLastName(lastname, uid)),
//     dispatchSetEmail: (email, uid) => dispatch(setEmail(email, uid)),
//     dispatchSetPassword: (password, uid) => dispatch(setPassword(password, uid))
//   };
// };

export default AccountSettings;
