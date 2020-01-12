import React from "react";
// import Notification from "../Notification";
import Notification from "./Notification";
import CircleContainer from "./CircleContainer";
import "./Dashboard.css";
import { Redirect } from "react-router-dom";

class Dashboard extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    if (!this.props.isAuthed) {
      return <Redirect to="/" />;
    }

    // let notifications1 = ["Task added", "Circles created"];
    let data = "task added";
    // let notifications2 = ["More updates", "Even more updates"];
    return (
      <div className="dashboard">
        <div className="panelContainer">
          <div className="panelItem">
            <CircleContainer data={data} />
          </div>
          <div className="panelItem">
            <Notification notifications={data} />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
