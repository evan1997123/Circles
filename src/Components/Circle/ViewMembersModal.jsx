import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";

class ViewMembersModal extends Component {
  render() {
    var leaders = this.props.leaders;
    var members = this.props.members;
    var displayLeaders = Object.keys(leaders).map((leaderID) => (
      <ListGroup.Item>{leaders[leaderID]}</ListGroup.Item>
    ));
    var displayMembers = Object.keys(members).map((memberID) => (
      <ListGroup.Item>{members[memberID]}</ListGroup.Item>
    ));
    return (
      <Modal
        show={this.props.showViewMembersModal}
        onHide={this.props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>View Leaders & Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1 style={{ fontSize: "1.5rem" }}>Leaders</h1>
          <ListGroup style={{ marginTop: "5%", marginBottom: "5%" }}>
            {displayLeaders.length > 0 ? (
              displayLeaders
            ) : (
              <p>No leaders to display</p>
            )}
          </ListGroup>
          <h1 style={{ fontSize: "1.5rem" }}>Members</h1>
          <ListGroup style={{ marginTop: "5%", marginBottom: "5%" }}>
            {displayMembers.length > 0 ? (
              displayMembers
            ) : (
              <p>
                No members to display. Maybe try adding a member to this Circle?
              </p>
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }
}

export default ViewMembersModal;
