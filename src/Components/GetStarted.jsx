import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class GetStarted extends React.Component {
  render() {
    if (this.props.isAuthed) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div>
        <h1>GET STARTED PAGE</h1>
      </div>
    );
  }
}

export default GetStarted;
