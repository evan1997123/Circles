import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class Reward extends Component {
  render() {
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
            <Button
              style={{ marginRight: "10px" }}
              onClick={() =>
                this.props.handleClaimRewards(
                  this.props.reward.rewardID,
                  this.props.reward.circleID
                )
              }
              variant="outline-success"
            >
              Claim
            </Button>
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
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Reward;
