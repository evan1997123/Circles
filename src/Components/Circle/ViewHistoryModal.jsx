import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Reward from "./Reward";
import "./ViewHistoryModal.css";
import { DropdownButton, Dropdown } from "react-bootstrap";

class ViewRewardsHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTheseItems: [],
      noUserSelected: true,
      selectedName: "",
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(e) {
    var userID = e.target.name;
    var name;
    if (this.props.leaders[userID]) {
      name = this.props.leaders[userID];
    } else {
      name = this.props.members[userID];
    }
    this.setState({
      noUserSelected: false,
      selectedName: name,
    });
    var dropdown = document.getElementById("dropdown");
    dropdown.innerHTML = name;

    var displayTheseItems;
    if (this.props.forRewards) {
      displayTheseItems = this.props.rewardsHistory[userID];
    } else {
      displayTheseItems = this.props.tasksHistory[userID];
    }

    if (!displayTheseItems) {
      this.setState({
        displayTheseItems: [],
      });
    } else if (this.props.forRewards) {
      displayTheseItems = Object.keys(displayTheseItems).map(
        (rewardID, index) => {
          return (
            <Reward
              reward={displayTheseItems[rewardID]}
              key={index}
              forViewingHistory={true}
              claimedDate={displayTheseItems[rewardID].claimedDate}
            ></Reward>
          );
        }
      );
    }
    this.setState({
      displayTheseItems: displayTheseItems,
    });
  }

  handleClose(e) {
    this.setState({
      displayTheseItems: [],
      noUserSelected: true,
      selectedName: "",
    });
    this.props.handleClose();
  }

  render() {
    var dropdownLeaders = Object.keys(this.props.leaders).map(
      (leaderID, index) => (
        <Dropdown.Item onClick={this.handleClick} name={leaderID} key={index}>
          {this.props.leaders[leaderID]}
        </Dropdown.Item>
      )
    );
    var dropdownMembers = Object.keys(this.props.members).map(
      (memberID, index) => (
        <Dropdown.Item onClick={this.handleClick} name={memberID} key={index}>
          {this.props.members[memberID]}
        </Dropdown.Item>
      )
    );
    if (this.props.isLeader) {
      var listOfCarouselItems = [];
      var displayTheseItems =
        this.state && this.state.displayTheseItems
          ? this.state.displayTheseItems
          : [];
      for (var i = 0; i < Object.keys(displayTheseItems).length; i += 3) {
        var carouselItem = (
          <Carousel.Item>
            <div
              style={{
                display: "flex",
                padding: "0 5% 2.5%",
                margin: "2.5% 0%",
              }}
            >
              {i < displayTheseItems.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseItems[Object.keys(displayTheseItems)[i]]}
                </div>
              ) : (
                <div style={{ flex: "1" }}></div>
              )}
              {i + 1 < displayTheseItems.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseItems[Object.keys(displayTheseItems)[i + 1]]}
                </div>
              ) : (
                <div style={{ flex: "1" }}></div>
              )}
              {i + 2 < displayTheseItems.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseItems[Object.keys(displayTheseItems)[i + 2]]}
                </div>
              ) : (
                <div style={{ flex: "1" }}></div>
              )}
            </div>
          </Carousel.Item>
        );
        listOfCarouselItems.push(carouselItem);
      }
      var title = this.props.forRewards ? "Rewards" : "Tasks";
      return (
        <Modal
          show={this.props.showViewHistoryModal}
          dialogClassName="modal-80w"
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title} History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DropdownButton
              variant="outline-primary"
              title={"Select to View User " + title + " History"}
              id="dropdown"
            >
              {dropdownLeaders}
              {dropdownMembers}
            </DropdownButton>
            {this.state.noUserSelected && this.props.forRewards && (
              <p>
                Select a user from the dropdown above to view their rewards
                history 😊
              </p>
            )}
            {this.state.noUserSelected && !this.props.forRewards && (
              <p>
                Select a user from the dropdown above to view their tasks
                history 😊
              </p>
            )}
            {!this.state.noUserSelected &&
              Object.keys(listOfCarouselItems).length === 0 &&
              this.props.forRewards && (
                <p>
                  Uh oh, looks like this user hasn't claimed any rewards yet 🤧
                </p>
              )}
            {!this.state.noUserSelected &&
              Object.keys(listOfCarouselItems).length === 0 &&
              !this.props.forRewards && (
                <p>
                  Uh oh, looks like this user hasn't completed any tasks yet 🤧
                </p>
              )}
            {Object.keys(listOfCarouselItems).length > 0 &&
              this.props.forRewards && (
                <div>
                  <p>Here is {this.state.selectedName}'s rewards history 🌟</p>
                  <Carousel
                    interval={null}
                    indicators={true}
                    nextIcon={
                      <span
                        aria-hidden="true"
                        className="carousel-control-next-icon"
                      />
                    }
                    style={{ padding: "0% 5%" }}
                  >
                    {listOfCarouselItems}
                  </Carousel>
                </div>
              )}
            {Object.keys(listOfCarouselItems).length > 0 &&
              !this.props.forRewards && (
                <div>
                  <p>Here is {this.state.selectedName}'s tasks history 🌟</p>
                  <Carousel
                    interval={null}
                    indicators={true}
                    nextIcon={
                      <span
                        aria-hidden="true"
                        className="carousel-control-next-icon"
                      />
                    }
                    style={{ padding: "0% 5%" }}
                  >
                    {listOfCarouselItems}
                  </Carousel>
                </div>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      var listOfCarouselItems = [];
      var displayTheseItems;
      if (this.props.forRewards === true) {
        displayTheseItems = this.props.rewardsHistory[this.props.userID];
        if (Object.keys(displayTheseItems).length > 0) {
          displayTheseItems = Object.keys(displayTheseItems).map(
            (rewardID, index) => {
              return (
                <Reward
                  reward={displayTheseItems[rewardID]}
                  key={index}
                  forViewingHistory={true}
                  claimedDate={displayTheseItems[rewardID].claimedDate}
                ></Reward>
              );
            }
          );
        }
      } else {
        displayTheseItems = this.props.tasksHistory[this.props.userID];
        // (Sorry for the horrible design, did not think this through) Tasks are turned into Task components
        // one-level up in the Circle.jsx file, which is why I don't have to map them into Task components here!
      }
      // Check for null case
      if (!displayTheseItems) {
        displayTheseItems = [];
      }

      // Store Tasks/Rewards components in carousel items
      for (var i = 0; i < Object.keys(displayTheseItems).length; i += 3) {
        var carouselItem = (
          <Carousel.Item>
            <div
              style={{
                display: "flex",
                padding: "0 5% 2.5%",
                margin: "2.5% 0%",
              }}
            >
              {i < displayTheseItems.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseItems[Object.keys(displayTheseItems)[i]]}
                </div>
              ) : (
                <div style={{ flex: "1" }}></div>
              )}
              {i + 1 < displayTheseItems.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseItems[Object.keys(displayTheseItems)[i + 1]]}
                </div>
              ) : (
                <div style={{ flex: "1" }}></div>
              )}
              {i + 2 < displayTheseItems.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseItems[Object.keys(displayTheseItems)[i + 2]]}
                </div>
              ) : (
                <div style={{ flex: "1" }}></div>
              )}
            </div>
          </Carousel.Item>
        );
        listOfCarouselItems.push(carouselItem);
      }
      var title = this.props.forRewards ? "Rewards" : "Tasks";
      // Return the modal
      return (
        <Modal
          show={this.props.showViewHistoryModal}
          dialogClassName="modal-80w"
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title} History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Object.keys(listOfCarouselItems).length === 0 &&
              this.props.forRewards && (
                <p>
                  Uh oh, looks like this user hasn't claimed any rewards yet 🤧
                </p>
              )}
            {Object.keys(listOfCarouselItems).length === 0 &&
              !this.props.forRewards && (
                <p>
                  Uh oh, looks like this user hasn't completed any tasks yet 🤧
                </p>
              )}
            {Object.keys(listOfCarouselItems).length > 0 &&
              this.props.forRewards && (
                <div>
                  <p>Here is your rewards history 🌟</p>
                  <Carousel
                    interval={null}
                    indicators={true}
                    nextIcon={
                      <span
                        aria-hidden="true"
                        className="carousel-control-next-icon"
                      />
                    }
                    style={{ padding: "0% 5%" }}
                  >
                    {listOfCarouselItems}
                  </Carousel>
                </div>
              )}
            {Object.keys(listOfCarouselItems).length > 0 &&
              !this.props.forRewards && (
                <div>
                  <p>Here is your tasks history 🌟</p>
                  <Carousel
                    interval={null}
                    indicators={true}
                    nextIcon={
                      <span
                        aria-hidden="true"
                        className="carousel-control-next-icon"
                      />
                    }
                    style={{ padding: "0% 5%" }}
                  >
                    {listOfCarouselItems}
                  </Carousel>
                </div>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
}

export default ViewRewardsHistoryModal;
