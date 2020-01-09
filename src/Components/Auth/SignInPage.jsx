import React, { Component } from "react";
import { connect } from "react-redux";
import { signIn } from "../../Store/Actions/AuthActions";
import { Redirect } from "react-router-dom";

import "./SignInPage.css";
class SignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.signInRedux(this.state);
  };
  render() {
    const authError = this.props.authError;
    const auth = this.props.firebaseAuthRedux;

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
            <button className="">Login</button>
          </div>
          <div>{authError ? <p>{authError}</p> : null}</div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError,
    firebaseAuthRedux: state.firebase.auth
  };
};

//this gives us the action signIn from "../../Store/Actions/AuthActions"
const mapDispatchToProps = dispatch => {
  return {
    signInRedux: credentials => dispatch(signIn(credentials))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
