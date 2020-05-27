import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Reward from "./Reward";
import "./ViewRewardsHistoryModal.css";

class ViewRewardsHistoryModal extends Component {
  render() {
    var displayRewards;
    var listOfCarouselItems = [];
    if (this.props.rewardsHistory) {
      var sortedRewardsHistory = Object.keys(this.props.rewardsHistory).sort(
        (rewardOne, rewardTwo) => {
          if (
            this.props.rewardsHistory[rewardOne].claimedDate &&
            this.props.rewardsHistory[rewardTwo].claimedDate
          ) {
            return (
              this.props.rewardsHistory[rewardTwo].claimedDate
                .toDate()
                .getTime() -
              this.props.rewardsHistory[rewardOne].claimedDate
                .toDate()
                .getTime()
            );
          }
        }
      );
      console.log(sortedRewardsHistory);
      var displayRewards;
      displayRewards = sortedRewardsHistory.map((rewardID, index) => (
        <div style={{ flex: "1" }}>
          <Reward
            reward={this.props.rewardsHistory[rewardID]}
            key={index}
            forViewingHistory={true}
            claimedDate={this.props.rewardsHistory[rewardID].claimedDate}
          ></Reward>
        </div>
      ));
      for (var i = 0; i < displayRewards.length; i += 3) {
        var carouselItem = (
          <Carousel.Item>
            <div style={{ display: "flex", padding: "0% 5%", margin: "5% 0%" }}>
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
        dialogClassName="modal-60w"
      >
        <Modal.Header closeButton>
          <Modal.Title>View Your Rewards History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel
            interval={null}
            indicators={true}
            nextIcon={
              <span aria-hidden="true" className="carousel-control-next-icon" />
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
                  You haven't claimed any rewards yet, try claiming one or two
                  once you earn enough points!
                </p>
              </div>
            )}
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ViewRewardsHistoryModal;
