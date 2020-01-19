import React, { Component } from "react";
import { Modal, Button, Form, Col, Dropdown } from "react-bootstrap";

class InviteMembersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      membersToAdd: [],
      membersToRemove: [],
      currentForm: "adding"
    };
    this.handleAddingToList = this.handleAddingToList.bind(this);
    this.handleRemovingFromList = this.handleRemovingFromList.bind(this);
    this.swapForms = this.swapForms.bind(this);
  }

  swapForms() {
    if (this.state.currentForm === "adding") {
      this.setState({
        membersToAdd: [],
        membersToRemove: [],
        currentForm: "removing"
      });
    } else {
      this.setState({
        membersToAdd: [],
        membersToRemove: [],
        currentForm: "adding"
      });
    }
  }
  handleAddingToList(eventKey, e) {
    const userID = eventKey;
    const name = e.target.textContent;
    const addOrRemove = e.target.name;
    var checkAddList;
    var checkRemoveList;
    var copyList;

    if (addOrRemove === "addMembers") {
      checkAddList = this.state.membersToAdd.filter(
        member => member.userID === userID
      );
      // this means that we already have this person in this.state.membersToAdd
      if (checkAddList.length !== 0) {
        return;
      }

      copyList = [...this.state.membersToAdd, { userID: userID, name: name }];

      this.setState({
        membersToAdd: copyList
      });
    } else if (addOrRemove === "removeMembers") {
      checkRemoveList = this.state.membersToRemove.filter(
        member => member.userID === userID
      );
      // this means that we already have this person in this.state.membersToAdd
      if (checkRemoveList.length !== 0) {
        return;
      }

      copyList = [
        ...this.state.membersToRemove,
        { userID: userID, name: name }
      ];

      this.setState({
        membersToRemove: copyList
      });
    }
  }

  handleRemovingFromList(e) {
    e.preventDefault();
    const idToDelete = e.target.value;
    const deleteFromAddingOrRemoving = e.target.name;
    var copyList;
    if (deleteFromAddingOrRemoving === "removeFromMembersToAdd") {
      copyList = this.state.membersToAdd.filter(
        nameAndID => nameAndID.userID !== idToDelete
      );
      this.setState({
        membersToAdd: copyList
      });
    } else if (deleteFromAddingOrRemoving === "removeFromMembersToRemove") {
      copyList = this.state.membersToRemove.filter(
        nameAndID => nameAndID.userID !== idToDelete
      );
      this.setState({
        membersToRemove: copyList
      });
    }
  }

  render() {
    let { allUsers, currentCircle } = this.props;
    var listOfUsersForAdding;
    var listOfUsersForRemoving;
    if (allUsers && currentCircle) {
      // get For membersToAdd List
      //get all member and leader objects
      var allPeopleInCircle = currentCircle.leaderList.concat(
        currentCircle.memberList
      );

      // get just their id's
      var allIDInCircle = allPeopleInCircle.map(
        idAndName => Object.keys(idAndName)[0]
      );

      //filter allUsers to only have those NOT in the given circle
      var allUsersFiltered = allUsers.filter(
        user => !allIDInCircle.includes(user.id)
      );

      listOfUsersForAdding = [
        allUsersFiltered.map((user, index) => (
          <Dropdown.Item
            user={user.id}
            eventKey={user.id}
            key={index}
            name="addMembers"
          >
            {user.firstName} {user.lastName}
          </Dropdown.Item>
        ))
      ];

      // get list for membersToRemove
      var allPeopleInCircle = currentCircle.leaderList.concat(
        currentCircle.memberList
      );

      // get just their id's
      var allIDInCircle = allPeopleInCircle.map(
        idAndName => Object.keys(idAndName)[0]
      );

      //filter allUsers to only have those NOT in the given circle
      var allUsersFiltered = allUsers.filter(user =>
        allIDInCircle.includes(user.id)
      );

      listOfUsersForRemoving = [
        allUsersFiltered.map((user, index) => (
          <Dropdown.Item
            user={user.id}
            eventKey={user.id}
            key={index}
            name="removeMembers"
          >
            {user.firstName} {user.lastName}
          </Dropdown.Item>
        ))
      ];
    }
    console.log(this.state);
    var currentlySelectedMembersToAdd = this.state.membersToAdd.map(
      (member, index) => (
        <button
          value={member.userID}
          key={index}
          name="removeFromMembersToAdd"
          onClick={this.handleRemovingFromList}
        >
          {member.name}
        </button>
      )
    );
    var currentlySelectedMembersToRemove = this.state.membersToRemove.map(
      (member, index) => (
        <button
          value={member.userID}
          key={index}
          name="removeFromMembersToRemove"
          onClick={this.handleRemovingFromList}
        >
          {member.name}
        </button>
      )
    );

    return (
      <div>
        <Modal
          show={this.props.showInviteMembersModal}
          onHide={this.props.handleClose}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px"
            }}
          >
            {this.state.currentForm === "adding" ? (
              <Button onClick={this.swapForms}>Swap to Removing</Button>
            ) : (
              <Button onClick={this.swapForms}>Swap to Adding</Button>
            )}
          </div>
          {this.state.currentForm === "adding" ? (
            <Form>
              <Modal.Header>
                <Modal.Title>Invite Members</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form.Group>
                  <Form.Row id="flexRow">
                    <Col id="flexColSmall">
                      <Form.Label>Add Members</Form.Label>
                    </Col>
                    <Col id="flexColBig">
                      <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select new members
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{listOfUsersForAdding}</Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>{currentlySelectedMembersToAdd}</Form.Label>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.handleClose}> Close </Button>
              </Modal.Footer>
            </Form>
          ) : (
            <Form>
              <Modal.Header>
                <Modal.Title>Remove Members</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form.Group>
                  <Form.Row id="flexRow">
                    <Col id="flexColSmall">
                      <Form.Label>Remove Members</Form.Label>
                    </Col>
                    <Col id="flexColBig">
                      <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select new members
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{listOfUsersForRemoving}</Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>{currentlySelectedMembersToRemove}</Form.Label>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.handleClose}> Close </Button>
              </Modal.Footer>
            </Form>
          )}
        </Modal>
      </div>
    );
  }
}

export default InviteMembersModal;
