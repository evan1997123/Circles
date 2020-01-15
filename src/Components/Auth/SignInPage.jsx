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
      password: "",
      top: 0
    };
  }

  componentDidMount() {
    this.setState({
      top: document.getElementById("navbar").clientHeight
    });
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
      <div className="signInPageContainer" style={{ top: this.state.top }}>
        <div className="whiteBackground">
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
            <div className="christineButtonContainer">
              <button className="logInButton">Login</button>
            </div>
            <div>{authError ? <p>{authError}</p> : null}</div>
          </form>
        </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInPage);
