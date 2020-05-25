//handles loading picture/uploading picture to server
import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase"; // so this allows us to connect this component to a firebase collection
import { compose } from "redux";
import "firebase/storage";
//default pic while loading
import defaultPic from "./pic.png";
import "./Picture.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

class Picture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: defaultPic,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    this.fileInput = React.createRef();

    //get the image from the server if it exists
    this.handleUpdateProfile();
  }

  handleSubmit(e) {
    e.preventDefault();
    //profile pic ref
    let storageRef = this.props.firebase
      .storage()
      .ref(this.props.auth.uid + "/" + "profilepic");

    let file = this.fileInput.current.files[0];

    if (!file) {
      alert("File not selected");
    } else if (this.isFileImage(file)) {
      storageRef.put(file).then(() => this.handleUpdateProfile());
    } else {
      alert("File is not an image");
    }
  }

  isFileImage(file) {
    const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
    return file && acceptedImageTypes.includes(file["type"]);
  }

  //profile refers to the current user's profile. every profile should point to a different path
  handleUpdateProfile() {
    let storageRef = this.props.firebase
      .storage()
      .ref(this.props.auth.uid + "/" + "profilepic");
    storageRef.getDownloadURL().then((url) => this.setState({ source: url }));
  }

  render() {
    console.log();
    let buttonText =
      this.state.source === defaultPic
        ? "Add Profile Picture"
        : "Change Profile Picture";

    return (
      <div
        style={{
          border: "1px solid #ddd",
          padding: "5%",
          borderRadius: "4px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Image
            src={this.state.source}
            alt="loading from firebase"
            className="image"
            // style={{ border: "1px solid #ddd" }}
          ></Image>
        </div>
        <br />
        <Form onSubmit={this.handleSubmit}>
          <label>Upload File:</label>
          <input
            type="file"
            className="form-control-file"
            ref={this.fileInput}
          />
          <br />
          <Button type="submit" onClick={this.handleUpload}>
            {buttonText}
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    firebase: state.firebase,
  };
};

export default compose(connect(mapStateToProps), firebaseConnect())(Picture);
