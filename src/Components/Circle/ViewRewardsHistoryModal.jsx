import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Reward from "./Reward";
import "./ViewRewardsHistoryModal.css";
import { DropdownButton, Dropdown } from "react-bootstrap";

class ViewRewardsHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTheseRewards: [],
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
    var displayTheseRewards = this.props.rewardsHistory[userID];
    if (!displayTheseRewards) {
      this.setState({
        displayTheseRewards: [],
      });
    } else {
      displayTheseRewards = Object.keys(displayTheseRewards).map(
        (rewardID, index) => {
          return (
            <Reward
              reward={displayTheseRewards[rewardID]}
              key={index}
              forViewingHistory={true}
              claimedDate={displayTheseRewards[rewardID].claimedDate}
            ></Reward>
          );
        }
      );
      this.setState({
        displayTheseRewards: displayTheseRewards,
      });
    }
  }

  handleClose(e) {
    this.setState({
      displayTheseRewards: [],
      noUserSelected: true,
      selectedName: "",
    });
    this.props.handleClose();
  }

  render() {
    console.log(this.state);
    var dropdownLeaders = Object.keys(this.props.leaders).map((leaderID) => (
      <Dropdown.Item onClick={this.handleClick} name={leaderID}>
        {this.props.leaders[leaderID]}
      </Dropdown.Item>
    ));
    var dropdownMembers = Object.keys(this.props.members).map((memberID) => (
      <Dropdown.Item onClick={this.handleClick} name={memberID}>
        {this.props.members[memberID]}
      </Dropdown.Item>
    ));
    if (this.props.isLeader) {
      // If you are the leader, you can view everyone's rewards history!
      // Display rewards in carousel format
      var listOfCarouselItems = [];
      var displayTheseRewards =
        this.state && this.state.displayTheseRewards
          ? this.state.displayTheseRewards
          : [];
      console.log(displayTheseRewards[Object.keys(displayTheseRewards)[0]]);
      for (var i = 0; i < Object.keys(displayTheseRewards).length; i++) {
        var carouselItem = (
          <Carousel.Item>
            <div
              style={{
                display: "flex",
                padding: "0 5% 2.5%",
                margin: "2.5% 0%",
              }}
            >
              {i < displayTheseRewards.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseRewards[Object.keys(displayTheseRewards)[i]]}
                </div>
              ) : (
                <div style={{ flex: "1" }}></div>
              )}
              {i + 1 < displayTheseRewards.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseRewards[Object.keys(displayTheseRewards)[i + 1]]}
                </div>
              ) : (
                <div style={{ flex: "1" }}></div>
              )}
              {i + 2 < displayTheseRewards.length ? (
                <div style={{ flex: "1" }}>
                  {displayTheseRewards[Object.keys(displayTheseRewards)[i + 2]]}
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
      return (
        <Modal
          show={this.props.showViewRewardsHistoryModal}
          dialogClassName="modal-80w"
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Rewards History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DropdownButton
              variant="outline-primary"
              title="Select to View User Rewards History"
              id="dropdown"
            >
              {dropdownLeaders}
              {dropdownMembers}
            </DropdownButton>
            {this.state.noUserSelected && (
              <p>
                Select a user from the dropdown above to view their rewards
                history 😊
              </p>
            )}
            {!this.state.noUserSelected &&
              Object.keys(listOfCarouselItems).length === 0 && (
                <p>
                  Uh oh, looks like this user hasn't claimed any rewards yet 🤧
                </p>
              )}
            {Object.keys(listOfCarouselItems).length > 0 && (
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
          show={this.props.showViewRewardsHistoryModal}
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
                      textAlign: "center",
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
