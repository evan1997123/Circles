import React, { Component } from "react";


import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {setUsername, setFirstName, setLastName,setEmail, setPassword} from "../../Store/Actions/SettingsActions";

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  
  handleSetUsername = (e) => {
    e.preventDefault();
    this.props.dispatchSetUsername(this.state.username, this.props.firebaseAuthRedux.uid);
  }


  handleSetFirstName = (e) => {
    e.preventDefault();
    this.props.dispatchSetFirstName(this.state.firstname, this.props.firebaseAuthRedux.uid);
  }


  handleSetLastName = (e) => {
    e.preventDefault();
    this.props.dispatchSetLastName(this.state.lastname, this.props.firebaseAuthRedux.uid);
  }


  handleSetEmail = (e) => {
    e.preventDefault();
    this.props.dispatchSetEmail(this.state.email, this.props.firebaseAuthRedux.uid);
  }


  handleSetPassword = (e) => {
    e.preventDefault();
    this.props.dispatchSetPassword(this.state.password, this.props.firebaseAuthRedux.uid);
  }

  getYourSettings(users, yourUID){
    var user = users.filter(user => (user.id == yourUID)? true: false);
    if (user.length != 1){
      console.log("user not authorized")
    } else {
      return user[0];
    }
  }

  render() {
    var userID = this.props.firebaseAuthRedux.uid;
    var u = (this.props.firestoreUsersRedux)? this.getYourSettings(this.props.firestoreUsersRedux, userID) : console.log("empty");
    return <div>
      <h6>Account Settings</h6>

      <div>
        <h7>
          {u ? "Username: " + u.username : ""}
          <br/>
          {u ? "First Name: " + u.firstName : ""}
          <br/>
          {u ? "Last Name: " + u.lastName : ""}
        </h7>
      </div>

      <Form onSubmit={this.handleSetUsername}>
          <label>Set Username:</label>
          <input
            type="text" id="username" onChange={this.handleChange}
          />
          <Button type="submit">Submit</Button>
      </Form>
      <br/>

      <Form onSubmit={this.handleSetFirstName}>
          <label>Set First:</label>
          <input
            type="text" id="firstname" onChange={this.handleChange}
          />
          <Button type="submit">Submit</Button>
      </Form>
      <br/>
      
      <Form onSubmit={this.handleSetLastName}>
          <label>Set Last:</label>
          <input
            type="text" id="lastname" onChange={this.handleChange}
          />
          <Button type="submit">Submit</Button>
      </Form>
      <br/>

      <Form onSubmit={this.handleSetEmail}>
          <label>Set Email:</label>
          <input
            type="text" id="email" onChange={this.handleChange}
          />
          <Button type="submit">Submit</Button>
      </Form>
      <br/>

      <Form onSubmit={this.handleSetPassword}>
          <label>Set Password:</label>
          <input
            type="text" id="password" onChange={this.handleChange}
          />
          <Button type="submit">Submit</Button>
      </Form>
      <br/>



    </div>;
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    firebaseAuthRedux: state.firebase.auth,
    firestoreUsersRedux: state.firestore.ordered.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSetUsername: (username, uid) => dispatch(setUsername(username, uid)),
    dispatchSetFirstName: (firstname, uid) => dispatch(setFirstName(firstname, uid)),
    dispatchSetLastName: (lastname, uid) => dispatch(setLastName(lastname, uid)),
    dispatchSetEmail: (email, uid) => dispatch(setEmail(email, uid)),
    dispatchSetPassword: (password, uid) => dispatch(setPassword(password, uid))
  };
};


export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect()
)(AccountSettings);