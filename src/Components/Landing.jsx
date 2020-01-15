import React from "react";
import { connect } from "react-redux";
import { signIn } from "../Store/Actions/AuthActions";
import { signUp } from "../Store/Actions/AuthActions";
import { Redirect } from "react-router-dom";
import "./Landing.css";
import { throwStatement } from "@babel/types";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      form: "signUp",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      authError: ""
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.changeForm = this.changeForm.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  componentDidUpdate(prevProp, prevState) {
    console.log("Component update");
    if (
      prevProp.authError !== this.props.authError &&
      prevState.form === this.state.form
    ) {
      console.log("Update authError on state");
      this.setState({
        authError: this.props.authError
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      "resize",
      this.updateWindowDimensions.bind(this)
    );
  }

  updateWindowDimensions() {
    var nav = document.getElementById("navbar");
    var navHeight = nav.offsetHeight;

    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - navHeight //to account for navHeight
    });
  }

  changeForm() {
    this.setState(prevState => {
      return {
        form: prevState.form === "signUp" ? "login" : "signUp",
        authError: null
      };
    });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (e.target.name === "signUp") {
      const newUser = {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      };
      this.props.signUpRedux(newUser);
    } else if (e.target.name === "login") {
      const credentials = {
        email: this.state.email,
        password: this.state.password
      };
      this.props.signInRedux(credentials);
    } else {
      console.log("Error in form name");
    }
  };

  render() {
    return (
      <div
        className="myContainer"
        style={{ height: this.state.height, width: this.state.width }}
      >
        <div className="leftContainer"></div>
        <div className="rightContainer">
          {this.state.form === "signUp" ? (
            <form
              name="signUp"
              className="formContainer"
              onSubmit={this.handleSubmit}
            >
              <div className="titleContainer">
                <div className="titleText">Sign Up</div>
              </div>
              <div className="inputContainer">
                <div class="firstLastRowContainer">
                  <div className="firstLastInputContainer">
                    <label htmlFor="firstName" className="forLabel">
                      First Name
                    </label>
                    <br />
                    <input
                      className="forInputFirstLast"
                      type="text"
                      id="firstName"
                      placeholder="Jane"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="firstLastInputContainer">
                    <label htmlFor="lastName" className="forLabel">
                      Last Name
                    </label>
                    <br />
                    <input
                      className="forInputFirstLast"
                      type="text"
                      id="lastName"
                      placeholder="Doe"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="emailPasswordInputContainer">
                  <label htmlFor="email" className="forLabel">
                    Email
                  </label>{" "}
                  <br />
                  <input
                    className="forInput"
                    type="email"
                    id="email"
                    placeholder="jane.doe@gmail.com"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="emailPasswordInputContainer">
                  <label htmlFor="password" className="forLabel">
                    Password
                  </label>
                  <br />
                  <input
                    className="forInput password"
                    type="password"
                    id="password"
                    // placeholder="••••••"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="emailPasswordInputContainer">
                  <label htmlFor="password">Confirm Password</label>
                  <br />
                  <input
                    className="forInput password"
                    type="password"
                    id="password"
                    // onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="buttonContainer">
                <div className="forButton">
                  <button className="buttonText">Sign Up</button>
                </div>
              </div>
              <div className="authErrorContainer">
                {this.state.authError ? <p>{this.state.authError}</p> : null}
              </div>
              <div className="orLogIn ">
                <div>Have an account?&nbsp;</div>
                <div className="orLogInText" onClick={this.changeForm}>
                  Log in
                </div>
              </div>
            </form>
          ) : (
            <form
              name="login"
              className="formContainer"
              onSubmit={this.handleSubmit}
            >
              <div className="titleContainerLogin">
                <div className="titleText">Login</div>
              </div>
              <div className="inputContainerLogin">
                <div className="emailPasswordInputContainer">
                  <label htmlFor="email" className="forLabel">
                    Email
                  </label>
                  <br />
                  <input
                    className="forInput"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="emailPasswordInputContainer">
                  <label htmlFor="password" className="forLabel">
                    Password
                  </label>
                  <br />
                  <input
                    className="forInput"
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="buttonContainerLogin">
                <div className="forButtonLogin">
                  <button className="buttonText">Sign Up</button>
                </div>
              </div>
              <div className="authErrorContainer">
                {this.state.authError ? <p>{this.state.authError}</p> : null}
              </div>
              <div className="orLogIn">
                <div> Don't have an account?&nbsp;</div>
                <div className="orLogInText" onClick={this.changeForm}>
                  Sign Up!
                </div>
              </div>
            </form>
          )}
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
    signInRedux: credentials => dispatch(signIn(credentials)),
    signUpRedux: newUser => dispatch(signUp(newUser))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
