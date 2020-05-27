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
      currentUser: null
    };
    //Users have https://firebase.google.com/docs/auth/web/start
    this.updateAuth = this.updateAuth.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
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
      <Nav.Link onClick={this.handleLogOut}>Log Out</Nav.Link>
    ) : null;
    return (
      <BrowserRouter basename="/">
        <div>
          <NavigationBar
            profile={profile}
            signInUpOrOut={signInUpOrOut}
            isAuthed={auth.uid}
            friendRequests = {friendRequests}
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
          {/* <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} /> */}

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
        { collection: "circles" },
        { collection: "users" },
        {
          collection: "friendRequests",
          where: [
            ["allUsersRelated", "array-contains", props.firebaseAuthRedux.uid]
          ]
        }
      ];
    } else {
      return [
        { collection: "circles" },
        { collection: "users" },
        {
          collection: "friendRequests"
        }
      ];
    }
  })
)(App);
