import React, { Component } from "react";
import "./Profile.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
//
import Picture from "./Picture";
import ProfileStatus from "./ProfileStatus";
import AccountSettings from "./AccountSettings";

class Profile extends Component {
  render() {
    if (!this.props.isAuthed) {
      return <Redirect to="/" />;
    } else {
      const profileData = this.props.firebaseProfileRedux;
      return (
        <div className="panelContainer">
          <div className="settings">
            <AccountSettings />
          </div>
          <div className="panelItem">
            <Picture auth={this.props.firebaseAuthRedux} />
            <ProfileStatus profileData={profileData} />
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    firebaseAuthRedux: state.firebase.auth,
    firebaseProfileRedux: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    { collection: "circles" },
    { collection: "users" }
  ])
)(Profile);
