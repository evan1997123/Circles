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
      lastName: "",
      top: 0
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

  componentDidMount() {
    this.setState({
      top: document.getElementById("navbar").clientHeight
    });
  }

  render() {
    const auth = this.props.firebaseAuthRedux;
    const authError = this.props.authError;
    //if logged in, then redirect to dashboard
    if (auth.uid) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="signUpPageContainer" style={{ top: this.state.top }}>
        <div className="signUpWhiteBackground">
          <form className="" onSubmit={this.handleSubmit}>
            <div className="titleContainer">
              <h5 className="title">Sign In</h5>
            </div>
            <div className="christineInputContainer">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" onChange={this.handleChange} />
            </div>
            <div className="christineInputContainer">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={this.handleChange}
              />
            </div>
            <div className="christineInputContainer">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" onChange={this.handleChange} />
            </div>
            <div className="christineInputContainer">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" onChange={this.handleChange} />
            </div>
            <div className="christineButtonContainer">
              <button className="signUpButton">Sign Up</button>
            </div>
            {authError ? <p>{authError}</p> : null}
          </form>
        </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPage);
