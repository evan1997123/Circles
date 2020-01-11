import React from "react";
import "./Landing.css";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      email: "",
      password: "",
      firstName: "",
      lastName: ""
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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
    return (
      // <div className="parent">
      //   <div className="child1">
      //     <div className="taskTitle">
      //       <h4>{this.props.title}Stop drinking boba</h4>
      //     </div>
      //     <div className="taskInfo">
      //       <h4>{this.props.details}Information</h4>
      //     </div>
      //   </div>
      // </div>
      <div
        className="myContainer"
        style={{ height: this.state.height, width: this.state.width }}
      >
        <div className="leftContainer">Hello from top</div>
        <div className="rightContainer">
          <form className="formContainer" onSubmit={this.handleSubmit}>
            <h5 className="">Sign In</h5>
            <div className="">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" onChange={this.handleChange} />
            </div>
            <div className="">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={this.handleChange}
              />
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
          </form>
        </div>
      </div>
    );
  }
}

export default Landing;
