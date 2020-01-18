import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class PromoteDemoteModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("hello from PromoteDemote");
    return (
      <div>
        <Modal
          show={this.props.showPromoteDemoteModal}
          onHide={this.props.handleClose}
        >
          <Modal.Header>
            <Modal.Title>Promote Demote</Modal.Title>
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

export default PromoteDemoteModal;
