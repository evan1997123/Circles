import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class Reward extends Component {
  render() {
    if (this.props.claimedDate) {
      // console.log(this.props.claimedDate.toDate().toDateString());
    }
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Card>
          <Card.Body>
            <Card.Title>{this.props.reward.rewardTitle}</Card.Title>
            <Card.Text>
              <strong>Reward</strong>: {this.props.reward.rewardDescription}
            </Card.Text>
            <Card.Text>
              <strong>Cost</strong>: {this.props.reward.rewardPoints}{" "}
            </Card.Text>
            <Card.Text>
              <strong>Recurring</strong>: {this.props.reward.recurringReward}
            </Card.Text>
            {this.props.forViewingHistory && this.props.claimedDate && (
              <Card.Text>
                <strong>Claimed Date</strong>:{" "}
                {this.props.claimedDate.toDate().toDateString()}
              </Card.Text>
            )}
            {!this.props.forViewingHistory && (
              <Button
                style={{ marginRight: "10px" }}
                onClick={() =>
                  this.props.handleClaimRewards(
                    this.props.reward.rewardID,
                    this.props.reward.circleID,
                    this.props.reward.recurringReward
                  )
                }
                variant="outline-success"
              >
                Claim
              </Button>
            )}
            {this.props.isLeader && (
              <Button
                style={{ marginRight: "10px" }}
                onClick={() =>
                  this.props.handleDeleteRewards(
                    this.props.reward.rewardID,
                    this.props.reward.circleID
                  )
                }
                variant="outline-danger"
              >
                Delete
              </Button>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Reward;
