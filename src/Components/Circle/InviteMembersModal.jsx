import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class InviteMembersModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.showInviteMembersModal}
          onHide={this.props.handleClose}
        >
          <Modal.Header>
            <Modal.Title>Invite Members</Modal.Title>
          </Modal.Header>

          <Modal.Body>Hello</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.handleClose}> Close </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default InviteMembersModal;
