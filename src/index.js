import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware, compose } from "redux"; // compose allows use to combine multisple middleWares
import RootReducer from "./Store/Reducers/RootReducer";
import { Provider } from "react-redux";
import thunk from "redux-thunk"; //allows us to return a function in our redux actions.
import { reduxFirestore, getFirestore } from "redux-firestore"; //reduxFirestore is a store enhancer
import { reactReduxFirebase, getFirebase } from "react-redux-firebase"; //reactReduxFirebase is a store enhancer
import fbConfig from "./config/firebase.js"; // need to pass in fbConfig to reduxFirestore and reactReduxFirebase so that getFirestore and getFirebase know what to connect to

const store = createStore(
  RootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    // redux bindings for firestore
    reduxFirestore(fbConfig),
    // redux binding for firebase
    // userFirestoreForProfile allows the this.state.firebase.profile to contain the doc with the ID of the current user UID, with a specific collection name of userProfile
    // attachAuthIsReady makes it so we don't display unless we have the user loaded in IF we need to load them in
    reactReduxFirebase(fbConfig, {
      useFirestoreForProfile: true,
      userProfile: "users",
      attachAuthIsReady: true
    })
  )
);

store.firebaseAuthIsReady.then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
