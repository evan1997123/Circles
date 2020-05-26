import React, { Component, useState } from "react";
import { Modal, Button, Form, Col, Dropdown } from "react-bootstrap";

class PromoteDemoteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      membersToPromote: [],
      leadersToDemote: [],
      currentForm: "promote"
    };
    this.swapForms = this.swapForms.bind(this);
    this.handleAddingToList = this.handleAddingToList.bind(this);
    this.handleRemovingFromList = this.handleRemovingFromList.bind(this);
    this.handlePromoteDemote = this.handlePromoteDemote.bind(this);
    this.filterAlreadySelected = this.filterAlreadySelected.bind(this);
  }

  swapForms() {
    if (this.state.currentForm === "promote") {
      this.setState({
        membersToPromote: [],
        leadersToDemote: [],
        currentForm: "demote"
      });
    } else {
      this.setState({
        membersToPromote: [],
        leadersToDemote: [],
        currentForm: "promote"
      });
    }
  }
  handleAddingToList(eventKey, e) {
    const userID = eventKey;
    const name = e.target.textContent;
    const promoteOrDemote = e.target.name;
    var checkPromoteList;
    var checkDemoteList;
    var copyList;

    if (promoteOrDemote === "promoteMembers") {
      checkPromoteList = this.state.membersToPromote.filter(
        member => member.userID === userID
      );
      // this means that we already have this person in this.state.membersToPromote
      if (checkPromoteList.length !== 0) {
        return;
      }

      copyList = [
        ...this.state.membersToPromote,
        { userID: userID, name: name }
      ];

      this.setState({
        membersToPromote: copyList
      });
    } else if (promoteOrDemote === "demoteLeaders") {
      checkDemoteList = this.state.leadersToDemote.filter(
        member => member.userID === userID
      );
      // this means that we already have this person in this.state.leadersToDemote
      if (checkDemoteList.length !== 0) {
        return;
      }

      copyList = [
        ...this.state.leadersToDemote,
        { userID: userID, name: name }
      ];

      this.setState({
        leadersToDemote: copyList
      });
    }
  }

  handleRemovingFromList(e) {
    e.preventDefault();
    const idToDelete = e.target.value;
    const deleteFromAddingOrRemoving = e.target.name;
    var copyList;
    if (deleteFromAddingOrRemoving === "removeFromMembersToPromote") {
      copyList = this.state.membersToPromote.filter(
        nameAndID => nameAndID.userID !== idToDelete
      );
      this.setState({
        membersToPromote: copyList
      });
    } else if (deleteFromAddingOrRemoving === "removeFromLeadersToDemote") {
      copyList = this.state.leadersToDemote.filter(
        nameAndID => nameAndID.userID !== idToDelete
      );
      this.setState({
        leadersToDemote: copyList
      });
    }
  }

  handlePromoteDemote(e) {
    e.preventDefault();
    if (
      this.state.membersToPromote.length === 0 &&
      this.state.leadersToDemote.length === 0
    ) {
      return;
    }
    //update the state lists to not include usernames
    this.state.membersToPromote.map((member, index) => {
      var leftBracket = member.name.indexOf("[");
      var slicedName = member.name.slice(
        leftBracket + 1,
        member.name.length - 1
      );
      this.state.membersToPromote[index] = {
        userID: member.userID,
        name: slicedName
      };
    });
    this.state.leadersToDemote.map((leader, index) => {
      var leftBracket = leader.name.indexOf("[");
      var slicedName = leader.name.slice(
        leftBracket + 1,
        leader.name.length - 1
      );
      this.state.leadersToDemote[index] = {
        userID: leader.userID,
        name: slicedName
      };
    });

    var newMemberList = { ...this.props.currentCircle.memberList };
    var newLeaderList = { ...this.props.currentCircle.leaderList };

    this.state.membersToPromote.map(nameAndID => {
      //check it's a member first
      if (
        Object.keys(this.props.currentCircle.memberList).includes(
          nameAndID.userID
        )
      ) {
        //delete it from memberList
        delete newMemberList[nameAndID.userID];

        //add it to the newLeaderList
        newLeaderList[nameAndID.userID] = nameAndID.name;
      }
    });
    this.state.leadersToDemote.map(nameAndID => {
      //check it's a leader first
      if (
        Object.keys(this.props.currentCircle.leaderList).includes(
          nameAndID.userID
        )
      ) {
        //delete it from leaderList
        delete newLeaderList[nameAndID.userID];

        //add it to the newLeaderList
        newMemberList[nameAndID.userID] = nameAndID.name;
      }
    });

    //must have atleast 1 leader left over
    if (Object.keys(newLeaderList).length <= 0) {
      return;
    }

    var newCircleDetails = {
      circleID: this.props.currentCircle.circleID,
      memberList: newMemberList,
      leaderList: newLeaderList
    };

    this.props.handlePromoteDemote(newCircleDetails);

    //find form
    var frm = document.getElementsByName("PromoteDemoteForm")[0];
    frm.reset();
    this.setState({
      membersToPromote: [],
      leadersToDemote: [],
      currentForm: "promote"
    });
  }

  filterAlreadySelected(currentUser) {
    for (var i = 0; i < this.state.membersToPromote.length; i++) {
      if (this.state.membersToPromote[i].userID === currentUser.id) {
        return false;
      }
    }
    // If already leader, don't display
    for (var i = 0; i < this.state.leadersToDemote.length; i++) {
      if (this.state.leadersToDemote[i].userID === currentUser.id) {
        return false;
      }
    }
    //if undefined or null
    if (!currentUser){
      return false;
    }
    // Neither leader nor member
    return true;
  }

  render() {
    let { currentCircle, allUsersCurrentCircleMap } = this.props;
    //currentCircle is object from firestore
    var dropDownMembersUsers;
    var dropDownLeadersUsers;
    if (currentCircle) {
      // get all members ID's
      var allMemberIDs = Object.keys(currentCircle.memberList);

      var allMemberUsers = [];
      allMemberIDs.map(userID =>
        allMemberUsers.push(allUsersCurrentCircleMap[userID])
      );

      // listOfUsersToPromote = [
      //   allMemberIDs.map((userID, index) => (
      //     <Dropdown.Item
      //       user={userID}
      //       eventKey={userID}
      //       key={index}
      //       name="promoteMembers"
      //     >
      //       {currentCircle.memberList[userID]}
      //     </Dropdown.Item>
      //   ))
      // ];

      var allMemberUsersFiltered = allMemberUsers.filter(
        this.filterAlreadySelected
      );

      var dropDownMembersUsers;

      if(allMemberUsersFiltered.length>0){
          dropDownMembersUsers = allMemberUsersFiltered.map((user, index) => (
          <Dropdown.Item
            user={user.id}
            eventKey={user.id}
            key={index}
            name="promoteMembers"
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
            
          ));
      }

      //get All leaders ID's
      var allLeaderIDs = Object.keys(currentCircle.leaderList);

      var allLeaderUsers = [];
      allLeaderIDs.map(userID =>
        allLeaderUsers.push(allUsersCurrentCircleMap[userID])
      );

      var allLeaderUsersFiltered = allLeaderUsers.filter(
        this.filterAlreadySelected
      );

      var dropDownLeadersUsers = allLeaderUsersFiltered.map((user, index) => (
        <Dropdown.Item
          user={user.id}
          eventKey={user.id}
          key={index}
          name="demoteLeaders"
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
      ));
    }

    var currentlySelectedMembersToPromote = this.state.membersToPromote.map(
      (member, index) => (
        <Button
          value={member.userID}
          key={index}
          name="removeFromMembersToPromote"
          onClick={this.handleRemovingFromList}
          style={{ margin: "5px" }}
        >
          {member.name}
        </Button>
      )
    );
    var currentlySelectedLeadersToDemote = this.state.leadersToDemote.map(
      (leader, index) => (
        <Button
          value={leader.userID}
          key={index}
          name="removeFromLeadersToDemote"
          onClick={this.handleRemovingFromList}
          style={{ margin: "5px" }}
        >
          {leader.name}
        </Button>
      )
    );

    return (
      <div>
        <Modal
          show={this.props.showPromoteDemoteModal}
          onHide={this.props.handleClose}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px"
            }}
          ></div>
          {this.state.currentForm === "promote" ? (
            <Form name="PromoteDemoteForm">
              <Modal.Header>
                <Modal.Title>Promote Members</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Label>
                  You may only either promote or demote with one click
                  <br />
                  There must always be at least one leader
                </Form.Label>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Promote Members</Form.Label>
                  </Form.Group>
                  {/* <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select Members
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{dropDownMembersUsers}</Dropdown.Menu>
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
                        Select Members
                      </Dropdown.Toggle>

                      <Dropdown.Menu as={CustomMenu}>
                        {dropDownMembersUsers}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Form.Row>
                <Form.Group>
                  <Form.Label>{currentlySelectedMembersToPromote}</Form.Label>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                {this.state.currentForm === "promote" ? (
                  <Button onClick={this.swapForms}>Swap to Demote</Button>
                ) : (
                  <Button onClick={this.swapForms}>Swap to Promote</Button>
                )}
                <Button onClick={this.props.handleClose}> Close </Button>
                <Button onClick={this.handlePromoteDemote}>Submit</Button>
              </Modal.Footer>
            </Form>
          ) : (
            <Form name="PromoteDemoteForm">
              <Modal.Header>
                <Modal.Title>Demote Leaders</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Label>
                  You may only either promote or demote with one click
                  <br />
                  There must always be at least one leader
                </Form.Label>
                <Form.Row>
                  <Form.Group as={Col}>Demote Leaders</Form.Group>
                  <Form.Group as={Col}>
                    {/* <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select Leaders
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{listOfUsersToDemote}</Dropdown.Menu>
                      </Dropdown> */}
                    <Dropdown
                      onSelect={this.handleAddingToList}
                      style={{ minWidth: "70%" }}
                      drop="down"
                    >
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                      >
                        Select Leaders
                      </Dropdown.Toggle>

                      <Dropdown.Menu as={CustomMenu}>
                        {dropDownLeadersUsers}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Form.Row>
                <Form.Group>{currentlySelectedLeadersToDemote}</Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.handleClose}> Close </Button>
                <Button onClick={this.handlePromoteDemote}>Submit</Button>
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

    var allShow = React.Children.toArray(children).filter(
      child =>
        !value ||
        child.props.children
          .toString()
          .toLowerCase()
          .startsWith(value, 1)
    );

    allShow.sort(function(user1, user2) {
      var user1Name = user1.props.children;
      var user2Name = user2.props.children;
      return user1Name.localeCompare(user2Name);
    });

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
        style={{ maxHeight: "1000%", overflowY: "auto", width: "auto" }}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Enter username"
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">{allShow}</ul>
      </div>
    );
  }
);

export default PromoteDemoteModal;
