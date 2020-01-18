import React from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Circle from "./Components/Circle/Circle";
import CircleColumn from "./Components/Circle/CircleColumn";
import Profile from "./Components/Profile/Profile";

import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavigationBar from "./Components/NavigationBar/NavigationBar";
import Landing from "./Components/Landing";
import firebase from "./config/firebase.js";
// import withFirebaseAuth from "react-with-firebase-auth";
import { connect } from "react-redux";
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
      currentUser: null
    };
    //Users have https://firebase.google.com/docs/auth/web/start
    this.updateAuth = this.updateAuth.bind(this);
    if (this.props.user) {
      this.setState({
        isAuthed: true
      });
    }
  }

  updateAuth(authenticated) {
    this.setState({
      isAuthed: authenticated
    });
  }

  componentDidUpdate() {}

  render() {
    var user;
    const auth = this.props.firebaseAuthRedux;
    const profile = this.props.firebaseProfileRedux;

    const signInUpOrOut = auth.uid ? (
      <Nav.Link onClick={this.props.signOutRedux}>Log Out</Nav.Link>
    ) : (
      [
        <Nav.Link href="/signin" key={1}>
          Sign In
        </Nav.Link>,
        <Nav.Link href="/signup" key={2}>
          Sign Up
        </Nav.Link>
      ]
    );
    return (
      <BrowserRouter basename="/">
        <div>
          <NavigationBar
            profile={profile}
            signInUpOrOut={signInUpOrOut}
            isAuthed={auth.uid}
          />
          <Route
            path="/dashboard"
            component={() => <Dashboard isAuthed={auth.uid} />}
          />
          <Route
            path="/profile"
            component={() => <Profile isAuthed={auth.uid} />}
          />

          {/* <Route path="/circle" component={Circle} /> */}
          <Route path="/circle/:id" component={Circle} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />

          {/*<Route path="/testing" component={CircleColumn} >*/}
          {/* <Route path="/circle/:id" component={Circle} /> */}

          <Route
            exact
            path="/"
            component={() =>
              auth.uid ? <Redirect to="/dashboard" /> : <Landing />
            }
          />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    firebaseAuthRedux: state.firebase.auth,
    firebaseProfileRedux: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOutRedux: () => dispatch(signOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
