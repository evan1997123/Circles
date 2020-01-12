import React from "react";
import "./Landing.css";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      form: "login",
      email: "",
      password: "",
      firstName: "",
      lastName: ""
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.changeform = this.changeform.bind(this);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
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

  changeform() {
    this.setState(prevState => {
      return { form: prevState.form === "signUp" ? "login" : "signUp" };
    });
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    console.log("hi");
    console.log(e.target.name);
    // this.props.signUp(this.state);
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
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="buttonContainer">
                <div className="forButton">
                  <button className="buttonText">Sign Up</button>
                </div>
              </div>
              <div className="orLogIn ">
                <div> Have an account?&nbsp;</div>
                <div className="orLogInText" onClick={this.changeform}>
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
              <div className="orLogIn">
                <div> Don't have an account?&nbsp;</div>
                <div className="orLogInText" onClick={this.changeform}>
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

export default Landing;
