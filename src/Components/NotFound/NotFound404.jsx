import React from "react";
import { Redirect } from "react-router-dom";
import { Image, Button } from "react-bootstrap";

import Christine from "../../Assets/Images/Christine.jpg";
import Emanuel from "../../Assets/Images/Emanuel.jpg";
import Evan from "../../Assets/Images/Evan.jpg";
import Ronaldo from "../../Assets/Images/Ronaldo.png";

import "./NotFound404.css";

class NotFound404 extends React.Component {
  handleClick = e => {
    alert("You're mean!");
    this.props.history.push("/");
    // return <Redirect to="/" />;
  };
  render() {
    return (
      <div className="container">
        <div className="title">
          <h1>404 Not Found</h1>
        </div>
        <div className="explanation">
          <h4>One of our team members messed up and they must be punished!</h4>
        </div>
        <div className="explanation">
          <h5>Pick who to fire!</h5>
        </div>
        <div className="imageContainer">
          <div className="eachImage">
            <Image
              src={Christine}
              style={{ width: "95%", height: "90%" }}
            ></Image>
            <br />
            <br />
            <Button variant="danger" onClick={this.handleClick}>
              Christine
            </Button>
          </div>
          <div className="eachImage">
            <Image
              src={Emanuel}
              style={{ width: "95%", height: "90%" }}
            ></Image>
            <br />
            <br />
            <Button variant="danger" onClick={this.handleClick}>
              Emanuel
            </Button>
          </div>
          <div className="eachImage">
            <Image src={Evan} style={{ width: "95%", height: "90%" }}></Image>
            <br />
            <br />
            <Button variant="danger" onClick={this.handleClick}>
              Evan
            </Button>
          </div>
          <div className="eachImage">
            <Image
              src={Ronaldo}
              style={{ width: "95%", height: "90%" }}
            ></Image>
            <br />
            <br />
            <Button variant="danger" onClick={this.handleClick}>
              Ronaldo
            </Button>
          </div>
        </div>
        <br />

        <h4>Don't wanna fire anyone?</h4>
        <h5>
          Click here to back to the <a href="/">home page</a>
        </h5>
      </div>
    );
  }
}

export default NotFound404;
