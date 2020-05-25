import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
// import "firebase/firebase";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCCub5zaPXASrQOyDo3zFKFeb40mqnzGgs",
  authDomain: "calhacks2019-eabc9.firebaseapp.com",
  databaseURL: "https://calhacks2019-eabc9.firebaseio.com",
  projectId: "calhacks2019-eabc9",
  storageBucket: "calhacks2019-eabc9.appspot.com",
  messagingSenderId: "91668355544",
  appId: "1:91668355544:web:4a65f42d242c6c49d5faad",
  measurementId: "G-GV6LDMD1GB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase.firestore().settings({ timestampsInSnapshots: true });
//export var storage = firebase.storage();
export default firebase;
