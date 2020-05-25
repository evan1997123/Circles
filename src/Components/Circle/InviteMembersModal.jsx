import React, { Component, useState } from "react";
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
    this.filterAlreadySelected = this.filterAlreadySelected.bind(this);
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
    // console.log(e.target);

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

    //update the state lists to not include usernames
    this.state.membersToAdd.map((member, index) => {
      var leftBracket = member.name.indexOf("[");
      var slicedName = member.name.slice(
        leftBracket + 1,
        member.name.length - 1
      );

      var newMembersToAdd = this.state.membersToAdd;
      newMembersToAdd[index] = {
        userID: member.userID,
        name: slicedName
      };

      this.setState({ membersToAdd: newMembersToAdd });
      return null;
    });
    this.state.membersToRemove.map((member, index) => {
      var leftBracket = member.name.indexOf("[");
      var slicedName = member.name.slice(
        leftBracket + 1,
        member.name.length - 1
      );
      var newMembersToRemove = this.state.membersToRemove;
      this.state.membersToRemove[index] = {
        userID: member.userID,
        name: slicedName
      };
      this.setState({ membersToRemove: newMembersToRemove });
      return null;
    });

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

  filterAlreadySelected(currentUser) {
    for (var i = 0; i < this.state.membersToAdd.length; i++) {
      if (this.state.membersToAdd[i].userID === currentUser.id) {
        return false;
      }
    }
    // If already leader, don't display
    for (i = 0; i < this.state.membersToRemove.length; i++) {
      if (this.state.membersToRemove[i].userID === currentUser.id) {
        return false;
      }
    }
    // Neither leader nor member
    return true;
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

      //filter allUsers to only have those NOT in the given circle and not already selected
      var allUsersFiltered = allUsers
        .filter(user => !allIdInCircle.includes(user.id))
        .filter(this.filterAlreadySelected);

      listOfUsersForAdding = [
        allUsersFiltered.map((user, index) => (
          // <Dropdown.Item
          //   user={user.id}
          //   eventKey={user.id}
          //   key={index}
          //   name="addMembers"
          // >
          //   {user.firstName} {user.lastName}
          // </Dropdown.Item>
          <Dropdown.Item
            user={user.id}
            eventKey={user.id}
            key={index}
            name="addMembers"
          >
            {/* {user.firstName} {user.lastName} */}
            {"@" +
              user.username +
              " [" +
              user.firstName +
              " " +
              user.lastName +
              "]"}
          </Dropdown.Item>
        ))
      ];

      //get All leaders ID's
      var allLeadersID = Object.keys(this.props.currentCircle.leaderList);

      //filter allUsers to only have those in the given circle, and not leaders, and not myself and not already selected
      allUsersFiltered = allUsers
        .filter(user => allIdInCircle.includes(user.id))
        .filter(user => !allLeadersID.includes(user.id))
        .filter(user => user.id !== this.props.currentUserID)
        .filter(this.filterAlreadySelected);

      listOfUsersForRemoving = [
        allUsersFiltered.map((user, index) => (
          // <Dropdown.Item
          //   user={user.id}
          //   eventKey={user.id}
          //   key={index}
          //   name="removeMembers"
          // >
          //   {user.firstName} {user.lastName}
          // </Dropdown.Item>
          <Dropdown.Item
            user={user.id}
            eventKey={user.id}
            key={index}
            name="removeMembers"
          >
            {/* {user.firstName} {user.lastName} */}
            {"@" +
              user.username +
              " [" +
              user.firstName +
              " " +
              user.lastName +
              "]"}
          </Dropdown.Item>
        ))
      ];
    }
    var currentlySelectedMembersToAdd = this.state.membersToAdd.map(
      (member, index) => (
        <Button
          value={member.userID}
          key={index}
          name="removeFromMembersToAdd"
          onClick={this.handleRemovingFromList}
          style={{ margin: "5px" }}
        >
          {member.name}
        </Button>
      )
    );
    var currentlySelectedMembersToRemove = this.state.membersToRemove.map(
      (member, index) => (
        <Button
          value={member.userID}
          key={index}
          name="removeFromMembersToRemove"
          onClick={this.handleRemovingFromList}
          style={{ margin: "5px" }}
        >
          {member.name}
        </Button>
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
          ></div>
          {this.state.currentForm === "adding" ? (
            <Form name="InviteMembersForm" onSubmit={this.handleUpdate}>
              <Modal.Header>
                <Modal.Title>Invite Members</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Label style={{ color: "red" }}>
                  Note: you may only either add or remove at one click
                </Form.Label>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Add Members</Form.Label>
                    {/* <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select new members
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{listOfUsersForAdding}</Dropdown.Menu>
                      </Dropdown> */}
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Dropdown
                      onSelect={this.handleAddingToList}
                      style={{ minWidth: "70%" }}
                      drop="down"
                    >
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      >
                        Select new members
                      </Dropdown.Toggle>

                      <Dropdown.Menu as={CustomMenu}>
                        {listOfUsersForAdding}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Form.Row>
                <Form.Group>{currentlySelectedMembersToAdd}</Form.Group>
              </Modal.Body>
              <Modal.Footer>
                {this.state.currentForm === "adding" ? (
                  <Button onClick={this.swapForms}>Swap to Removing</Button>
                ) : (
                  <Button onClick={this.swapForms}>Swap to Adding</Button>
                )}
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
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Remove Members</Form.Label>
                  </Form.Group>
                  {/* <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select members
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{listOfUsersForRemoving}</Dropdown.Menu>
                      </Dropdown> */}
                  <Form.Group as={Col}>
                    <Dropdown
                      onSelect={this.handleAddingToList}
                      style={{ minWidth: "70%" }}
                      drop="down"
                    >
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      >
                        Select members
                      </Dropdown.Toggle>

                      <Dropdown.Menu as={CustomMenu}>
                        {listOfUsersForRemoving}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Form.Row>
                <Form.Group>{currentlySelectedMembersToRemove}</Form.Group>
              </Modal.Body>
              <Modal.Footer>
                {this.state.currentForm === "removing" ? (
                  <Button onClick={this.swapForms}>Swap to Adding</Button>
                ) : (
                  <Button onClick={this.swapForms}>Swap to Adding</Button>
                )}
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

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
    variant="success"
    style={{ minWidth: "80%" }}
  >
    {children}
    &#x25bc;
  </Button>
));

// for Dropdown
// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
        style={{ maxHeight: "1000%", overflowY: "auto" }}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Enter username"
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            child =>
              !value ||
              child.props.children
                .toString()
                .toLowerCase()
                .startsWith(value, 1)
          )}
        </ul>
      </div>
    );
  }
);

export default InviteMembersModal;
