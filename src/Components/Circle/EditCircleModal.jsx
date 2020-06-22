import React, { Component, useState } from "react";
import { Modal, Button, Form, Col, Dropdown } from "react-bootstrap";

class EditCircleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newCircleName: "",
      newCircleDescription: "",
      newCircleColor: "",
      newCircleHighlight: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateCircle = this.updateCircle.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.currentCircle && prevProps !== this.props) {
      this.setState({
        newCircleName: this.props.currentCircle.circleName,
        newCircleDescription: this.props.currentCircle.circleDescription,
        newCircleColor: this.props.currentCircle.circleColor,
        newCircleHighlight: this.props.currentCircle.circleHighlight,
      });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  updateCircle(e) {
    var currentCircle = this.props.currentCircle;
    if (
      this.state.newCircleName === currentCircle.circleName &&
      this.state.newCircleDescription === currentCircle.circleDescription &&
      this.state.newCircleColor === currentCircle.circleColor &&
      this.state.newCircleHighlight === currentCircle.circleHighlight
    ) {
      alert("There are no changes in the circle details");
      return;
    }

    var newCircleDetails = { ...this.state };
    this.props.handleEditCircle(newCircleDetails);
  }

  render() {
    var circleColorTextColor;
    var circleHighlightTextColor;
    var forHex = /^#[0-9a-fA-F]{6}$/;
    // var forHex = /#[0-9a-fA-f]{6}/;

    console.log(this.state.newCircleColor);
    console.log(new RegExp(forHex).test(this.state.newCircleColor));
    if (
      this.state.newCircleColor.length === 7 &&
      new RegExp(forHex).test(this.state.newCircleColor)
    ) {
      console.log("valid circle color");
      circleColorTextColor = this.state.newCircleColor;
    } else if (this.state.newCircleColor.length === 0) {
      circleColorTextColor = "#007bff"; //blue
    } else {
      circleColorTextColor = "#212529"; //black
    }

    if (
      this.state.newCircleHighlight.length === 7 &&
      new RegExp(forHex).test(this.state.newCircleHighlight)
    ) {
      console.log("valid circle color");
      circleHighlightTextColor = this.state.newCircleHighlight;
    } else if (this.state.newCircleHighlight.length === 0) {
      circleHighlightTextColor = "#ff495c"; //red
    } else {
      circleHighlightTextColor = "#212529"; //black
    }
    console.log(this.state);
    return (
      <div style={{ marginTop: 25 }}>
        <Modal show={this.props.showModal} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Circle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <p style={{ color: "red" }}>
              Note: you must include a name, description, at least one leader,
              and you must be a part of the circle. You may only include your{" "}
              <strong>friends</strong>. Add friends{" "}
              <a
                href="/profile"
                style={{ color: "red", textDecoration: "underline" }}
              >
                here
              </a>
              .
            </p> */}
            <Form name="newCircleForm">
              <Form.Group>
                <Form.Row>
                  <Col id="myFlexColSmall">
                    <Form.Label>Circle Name</Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Form.Control
                      type="text"
                      name="newCircleName"
                      onChange={this.handleChange}
                      placeholder="Circle name"
                      required={true}
                      value={this.state.newCircleName}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col id="flexColSmall">
                    <Form.Label>Circle Description</Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Form.Control
                      type="text"
                      name="newCircleDescription"
                      onChange={this.handleChange}
                      placeholder="Circle Description"
                      value={this.state.newCircleDescription}
                      required={true}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col id="flexColSmall">
                    <Form.Label style={{ color: circleColorTextColor }}>
                      Circle Color
                    </Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Form.Control
                      type="text"
                      name="newCircleColor"
                      placeholder="Default: #007bff"
                      onChange={this.handleChange}
                      value={this.state.newCircleColor}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col id="flexColSmall">
                    <Form.Label
                      style={{
                        color: circleHighlightTextColor,
                      }}
                    >
                      Circle Highlight
                    </Form.Label>
                  </Col>
                  <Col id="myFlexColBig">
                    <Form.Control
                      type="text"
                      name="newCircleHighlight"
                      placeholder="Default #ff495c"
                      onChange={this.handleChange}
                      value={this.state.newCircleHighlight}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="outline-primary"
              onClick={this.updateCircle}
            >
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default EditCircleModal;
