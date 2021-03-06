import React from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Circle from "./Components/Circle/Circle";
import Profile from "./Components/Profile/Profile";
import NotFound404 from "./Components/NotFound/NotFound404";

import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavigationBar from "./Components/NavigationBar/NavigationBar";
import Landing from "./Components/Landing";
import firebase from "./config/firebase.js";
// import withFirebaseAuth from "react-with-firebase-auth";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import { signOut } from "./Store/Actions/AuthActions";

import SignInPage from "./Components/Auth/SignInPage";
import SignUpPage from "./Components/Auth/SignUpPage";
import "firebase/auth";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    this.state = {
      names: [],
      currentName: "",
      currentEmail: "",
      isAuthed: false,
      currentUser: null,
      functionToPassToProfile: () => console.log("this shouldn't be here")
    };
    //Users have https://firebase.google.com/docs/auth/web/start
    this.updateAuth = this.updateAuth.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.updateMyAppStateToIncludeYourNavBarUpdateProfile = this.updateMyAppStateToIncludeYourNavBarUpdateProfile.bind(
      this
    );
    if (this.props.user) {
      this.setState({
        isAuthed: true
      });
    }
  }
  updateMyAppStateToIncludeYourNavBarUpdateProfile(functionINeed) {
    this.setState({
      functionToPassToProfile: functionINeed
    });
  }

  updateAuth(authenticated) {
    this.setState({
      isAuthed: authenticated
    });
  }

  handleLogOut(e) {
    this.props.signOutRedux();
    return <Redirect to="/" />;
  }

  render() {
    var user;
    const auth = this.props.firebaseAuthRedux;
    const profile = this.props.firebaseProfileRedux;
    var friendRequests = this.props.firestoreFriendRequestsRedux;

    const signInUpOrOut = auth.uid ? (
      <Nav.Link onClick={this.handleLogOut} className={"marginAuto"}>
        Log Out
      </Nav.Link>
    ) : null;
    return (
      <BrowserRouter basename="/">
        <NavigationBar
          profile={profile}
          signInUpOrOut={signInUpOrOut}
          isAuthed={auth.uid}
          friendRequests={friendRequests}
          updateMyAppStateToIncludeYourNavBarUpdateProfile={
            this.updateMyAppStateToIncludeYourNavBarUpdateProfile
          }
        />
        <Switch>
          <Route
            path="/dashboard"
            component={() => (
              <Dashboard
                isAuthed={auth.uid}
                handleNavBarUpdateProfile={this.state.functionToPassToProfile}
              />
            )}
          />
          <Route
            path="/profile"
            component={() => (
              <Profile
                isAuthed={auth.uid}
                friendRequests={friendRequests}
                handleNavBarUpdateProfile={this.state.functionToPassToProfile}
              />
            )}
          />
          <Route path="/circle/:id" component={Circle} />
          <Route
            exact
            path="/"
            component={() =>
              auth.uid ? <Redirect to="/dashboard" /> : <Landing />
            }
          />
          <Route component={NotFound404}></Route>
          {/* <Route path="/circle" component={Circle} /> */}
          {/* <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} /> */}

          {/*<Route path="/testing" component={CircleColumn} >*/}
          {/* <Route path="/circle/:id" component={Circle} /> */}

          {/*  if you want to go back to dashboard/landing
          <Route render={() => <Redirect to={{ pathname: "/" }} />} /> */}
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    firebaseAuthRedux: state.firebase.auth,
    firebaseProfileRedux: state.firebase.profile,
    firestoreFriendRequestsRedux: state.firestore.ordered.friendRequests
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOutRedux: () => dispatch(signOut())
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    if (props.firebaseAuthRedux.uid) {
      return [
        {
          collection: "friendRequests",
          where: [
            ["allUsersRelated", "array-contains", props.firebaseAuthRedux.uid]
          ]
        }
      ];
    } else {
      return [
        {
          collection: "friendRequests"
        }
      ];
    }
  })
)(App);
