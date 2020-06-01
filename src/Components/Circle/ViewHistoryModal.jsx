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
      selectedName: ""
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
      selectedName: name
    });
    var dropdown = document.getElementById("dropdown");
    dropdown.innerHTML = name;

    var displayTheseItems;
    if (this.props.forRewards) {
      displayTheseItems = this.props.rewardsHistory[userID];
    } else {
      displayTheseItems = this.props.tasksHistory[userID];
    }

    console.log(displayTheseItems);

    if (!displayTheseItems) {
      this.setState({
        displayTheseItems: []
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
      displayTheseItems: displayTheseItems
    });
  }

  handleClose(e) {
    this.setState({
      displayTheseItems: [],
      noUserSelected: true,
      selectedName: ""
    });
    this.props.handleClose();
  }

  render() {
    console.log(this.state);
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
      console.log(displayTheseItems[Object.keys(displayTheseItems)[0]]);
      for (var i = 0; i < Object.keys(displayTheseItems).length; i += 3) {
        var carouselItem = (
          <Carousel.Item>
            <div
              style={{
                display: "flex",
                padding: "0 5% 2.5%",
                margin: "2.5% 0%"
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
      console.log(listOfCarouselItems);
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
      var memberRewardsHistory = this.props.rewardsHistory[this.props.userID];
      var displayRewards;
      var listOfCarouselItems = [];
      if (memberRewardsHistory) {
        var sortedRewardsHistory = Object.keys(memberRewardsHistory).sort(
          (rewardOne, rewardTwo) => {
            if (
              memberRewardsHistory[rewardOne].claimedDate &&
              memberRewardsHistory[rewardTwo].claimedDate
            ) {
              return (
                memberRewardsHistory[rewardTwo].claimedDate.toDate().getTime() -
                memberRewardsHistory[rewardOne].claimedDate.toDate().getTime()
              );
            }
          }
        );
        // console.log(sortedRewardsHistory);
        var displayRewards;
        displayRewards = sortedRewardsHistory.map((rewardID, index) => (
          <div style={{ flex: "1" }}>
            <Reward
              reward={memberRewardsHistory[rewardID]}
              key={index}
              forViewingHistory={true}
              claimedDate={memberRewardsHistory[rewardID].claimedDate}
            ></Reward>
          </div>
        ));
        for (var i = 0; i < displayRewards.length; i += 3) {
          var carouselItem = (
            <Carousel.Item>
              <div
                style={{ display: "flex", padding: "0% 5%", margin: "5% 0%" }}
              >
                {i < displayRewards.length ? (
                  displayRewards[i]
                ) : (
                  <div style={{ flex: "1" }}></div>
                )}
                {i + 1 < displayRewards.length ? (
                  displayRewards[i + 1]
                ) : (
                  <div style={{ flex: "1" }}></div>
                )}
                {i + 2 < displayRewards.length ? (
                  displayRewards[i + 2]
                ) : (
                  <div style={{ flex: "1" }}></div>
                )}
              </div>
            </Carousel.Item>
          );
          listOfCarouselItems.push(carouselItem);
        }
      }

      return (
        <Modal
          show={this.props.showViewHistoryModal}
          onHide={this.props.handleClose}
          dialogClassName="modal-80w"
        >
          <Modal.Header closeButton>
            <Modal.Title>View Your Rewards History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
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
                {listOfCarouselItems.length > 0 ? (
                  listOfCarouselItems
                ) : (
                  <div
                    style={{
                      padding: "5%",
                      margin: "5% 0%",
                      textAlign: "center"
                    }}
                  >
                    <p>
                      You haven't claimed any rewards yet, try claiming one or
                      two once you earn enough points!
                    </p>
                  </div>
                )}
              </Carousel>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
}

export default ViewRewardsHistoryModal;
