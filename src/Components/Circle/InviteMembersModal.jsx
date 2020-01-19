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
    this.handleUpdate = this.handleUpdate.bind(this);
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

  handleUpdate(e) {
    //event handler for updating the circle in this.props.currentCircle
    e.preventDefault();
    if (
      this.state.membersToAdd.length === 0 &&
      this.state.membersToRemove.length === 0
    ) {
      return;
    }

    // dispatch update to circle
    // just all the members

    var newMembersList = { ...this.props.currentCircle.memberList };

    //removeing anyone that is in our membersToRemove with Map.delete()
    this.state.membersToRemove.map(nameAndUser => {
      delete newMembersList[nameAndUser.userID];
    });

    // add users specified in membersToAdd
    this.state.membersToAdd.map(
      nameAndID => (newMembersList[nameAndID.userID] = nameAndID.name)
    );

    // update total number of people in the circle
    var newNumberOfPeople =
      Object.keys(this.props.currentCircle.leaderList).length +
      Object.keys(newMembersList).length;

    var newCircleDetails = {
      memberList: newMembersList,
      numberOfPeople: newNumberOfPeople,
      circleID: this.props.currentCircle.circleID,
      circleName: this.props.currentCircle.circleName,
      membersToRemove: this.state.membersToRemove,
      membersToAdd: this.state.membersToAdd
    };

    this.props.handleUpdateCircleMembers(newCircleDetails);

    //find form
    var frm = document.getElementsByName("InviteMembersForm")[0];
    frm.reset();
    this.setState({
      membersToAdd: [],
      membersToRemove: [],
      currentForm: "adding"
    });
  }
  render() {
    let { allUsers, currentCircle } = this.props;
    //currentCircle is object from firestore
    var listOfUsersForAdding;
    var listOfUsersForRemoving;
    if (allUsers && currentCircle) {
      // get For membersToAdd List
      //get all member and leader ID's
      var allIdInCircle = Object.keys(currentCircle.leaderList).concat(
        Object.keys(currentCircle.memberList)
      );

      //filter allUsers to only have those NOT in the given circle
      var allUsersFiltered = allUsers.filter(
        user => !allIdInCircle.includes(user.id)
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

      //get All leaders ID's
      var allLeadersID = Object.keys(this.props.currentCircle.leaderList);

      //filter allUsers to only have those in the given circle, and not leaders, and not myself
      var allUsersFiltered = allUsers
        .filter(user => allIdInCircle.includes(user.id))
        .filter(user => !allLeadersID.includes(user.id))
        .filter(user => user.id !== this.props.currentUserID);

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
          You may only either Add or Remove at one click.
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
            <Form name="InviteMembersForm" onSubmit={this.handleUpdate}>
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
                <Button onClick={this.handleUpdate}>Submit</Button>
              </Modal.Footer>
            </Form>
          ) : (
            <Form name="InviteMembersForm" onSubmit={this.handleUpdate}>
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
                          Select members
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
                <Button onClick={this.handleUpdate}>Submit</Button>
              </Modal.Footer>
            </Form>
          )}
        </Modal>
      </div>
    );
  }
}

export default InviteMembersModal;
