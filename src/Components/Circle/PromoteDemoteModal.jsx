import React, { Component } from "react";
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

  render() {
    let { currentCircle } = this.props;
    //currentCircle is object from firestore
    var listOfUsersToPromote;
    var listOfUsersToDemote;
    if (currentCircle) {
      // get all members ID's
      var allMemberIDs = Object.keys(currentCircle.memberList);

      listOfUsersToPromote = [
        allMemberIDs.map((userID, index) => (
          <Dropdown.Item
            user={userID}
            eventKey={userID}
            key={index}
            name="promoteMembers"
          >
            {currentCircle.memberList[userID]}
          </Dropdown.Item>
        ))
      ];

      //get All leaders ID's
      var allLeaderIDs = Object.keys(currentCircle.leaderList);

      listOfUsersToDemote = [
        allLeaderIDs.map((userID, index) => (
          <Dropdown.Item
            user={userID}
            eventKey={userID}
            key={index}
            name="demoteLeaders"
          >
            {currentCircle.leaderList[userID]}
          </Dropdown.Item>
        ))
      ];
    }

    var currentlySelectedMembersToPromote = this.state.membersToPromote.map(
      (member, index) => (
        <button
          value={member.userID}
          key={index}
          name="removeFromMembersToPromote"
          onClick={this.handleRemovingFromList}
        >
          {member.name}
        </button>
      )
    );
    var currentlySelectedLeadersToDemote = this.state.leadersToDemote.map(
      (leader, index) => (
        <button
          value={leader.userID}
          key={index}
          name="removeFromLeadersToDemote"
          onClick={this.handleRemovingFromList}
        >
          {leader.name}
        </button>
      )
    );

    return (
      <div>
        <Modal
          show={this.props.showPromoteDemoteModal}
          onHide={this.props.handleClose}
        >
          You may only either Promote or Demote at one click.
          <br />
          There must always be atleast leader.
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px"
            }}
          >
            {this.state.currentForm === "promote" ? (
              <Button onClick={this.swapForms}>Swap to Demote</Button>
            ) : (
              <Button onClick={this.swapForms}>Swap to Promote</Button>
            )}
          </div>
          {this.state.currentForm === "promote" ? (
            <Form name="PromoteDemoteForm">
              <Modal.Header>
                <Modal.Title>Promote Members</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Row id="flexRow">
                    <Col id="flexColSmall">
                      <Form.Label>Promote Members</Form.Label>
                    </Col>
                    <Col id="flexColBig">
                      <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select Members
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{listOfUsersToPromote}</Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>{currentlySelectedMembersToPromote}</Form.Label>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
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
                <Form.Group>
                  <Form.Row id="flexRow">
                    <Col id="flexColSmall">
                      <Form.Label>Demote Leaders</Form.Label>
                    </Col>
                    <Col id="flexColBig">
                      <Dropdown onSelect={this.handleAddingToList}>
                        <Dropdown.Toggle variant="success">
                          Select Leaders
                        </Dropdown.Toggle>

                        <Dropdown.Menu>{listOfUsersToDemote}</Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>{currentlySelectedLeadersToDemote}</Form.Label>
                </Form.Group>
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

export default PromoteDemoteModal;
