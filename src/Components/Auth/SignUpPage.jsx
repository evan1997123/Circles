import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../Store/Actions/AuthActions";

import "./SignUpPage.css";
class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: ""
    };
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.signUp(this.state);
  };
  render() {
    const auth = this.props.firebaseAuthRedux;
    const authError = this.props.authError;
    //if logged in, then redirect to dashboard
    if (auth.uid) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="">
        <form className="" onSubmit={this.handleSubmit}>
          <h5 className="">Sign In</h5>
          <div className="">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={this.handleChange} />
          </div>
          <div className="">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={this.handleChange} />
          </div>
          <div className="">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" onChange={this.handleChange} />
          </div>
          <div className="">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" onChange={this.handleChange} />
          </div>
          <div className="">
            <button className="">Sign Up</button>
          </div>
          {authError ? <p>{authError}</p> : null}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    firebaseAuthRedux: state.firebase.auth,
    authError: state.auth.authError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: newUser => dispatch(signUp(newUser))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
