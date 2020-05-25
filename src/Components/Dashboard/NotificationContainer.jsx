import React from "react";
import Notification from "./Notification";
import CircleContainer from "./CircleContainer";
import "./NotificationContainer.css";

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // let panels = this.props.notifications.map(notification => (
    //   <Panel notification={notification} />
    // ));
    return (
      <div className="panelContainer">
        <div className="panelItem">
          <CircleContainer data={this.props.data} />
        </div>
        <div className="panelItem">
          <Notification notifications={this.props.data} />
        </div>
      </div>
    );
  }
}

export default NotificationContainer;
