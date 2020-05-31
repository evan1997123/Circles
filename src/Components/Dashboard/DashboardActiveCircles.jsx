import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";
import CircleForm from "./CircleForm";
import "./DashboardActiveCircles.css";

class ActiveCircles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.changeVisibility = this.changeVisibility.bind(this);
  }

  showModal() {
    this.setState({
      show: true
    });
  }

  hideModal() {
    this.setState({
      show: false
    });
  }

  changeVisibility(circleID, showHover) {
    var element = document.getElementById(circleID);
    if (element && element.style) {
      if (showHover) {
        element.style.visibility = "visible";
      } else {
        element.style.visibility = "hidden";
      }
    }
  }

  render() {
    var circles;
    if (this.props.myCircles && this.props.toDoTasks) {
      circles = this.props.myCircles.map((circle, index) => {
        var needsAttention;
        var className;

        this.props.toDoTasks.forEach(toDoTask => {
          if (toDoTask.circleID === circle.circleID) {
            needsAttention = true;
          }
        });

        // Figure out number of tasks left for this circle
        var numTasksLeft = 0;
        if (this.props.circleIDToNumTasksLeftMap) {
          numTasksLeft = this.props.circleIDToNumTasksLeftMap[circle.circleID];
        }

        var numPendingTasks = 0;
        if (
          this.props.circleIDToNumPendingTasks &&
          this.props.circleIDToNumPendingTasks[circle.circleID]
        ) {
          numPendingTasks = this.props.circleIDToNumPendingTasks[
            circle.circleID
          ];
        }

        if (needsAttention || numPendingTasks > 0) {
          className = "needsAttention";
        }

        return (
          <div className="activeCircle" key={index}>
            <div>
              {/* <form action={"/circle/" + circle.id}>
                <button
                  type="submit"
                  className={"myButton btn btn-primary " + className}
                ></button>
              </form> */}
              <form action={"/circle/" + circle.id}>
                <button
                  type="submit"
                  className={"myButton btn btn-primary " + className}
                  // onClick={() => this.setRedirect(circle.id)}
                  // onClick={() =>
                  //   this.props.history.push("/circle/" + circle.id)
                  // }
                  onMouseEnter={e =>
                    this.changeVisibility(circle.circleID, true)
                  }
                  onMouseLeave={e =>
                    this.changeVisibility(circle.circleID, false)
                  }
                  // name={circle.circleID}
                >
                  <div style={{ position: "relative", display: "inlineBlock" }}>
                    <span
                      style={{
                        visibility: "hidden",
                        width: "180px",
                        backgroundColor: "grey",
                        color: "#fff",
                        textAlign: "left",
                        padding: "15px",
                        borderRadius: "6px",
                        position: "absolute",
                        zIndex: "1",
                        top: "75px",
                        // left: "50%",
                        marginLeft: "-90px"
                      }}
                      id={circle.circleID}
                    >
                      <div>
                        {numTasksLeft !== 0 && (
                          <div>
                            <div>
                              <strong>Remaining Tasks</strong>: {numTasksLeft}
                            </div>
                            <div>
                              Let's go complete some tasks and earn points! 💪
                            </div>
                          </div>
                        )}

                        {numTasksLeft !== 0 && numPendingTasks !== 0 && (
                          <hr style={{ backgroundColor: "white" }}></hr>
                        )}

                        {numPendingTasks !== 0 ? (
                          <div>
                            <div style={{ fontSize: "0.75rem" }}>
                              (For Leaders)
                            </div>
                            <div>
                              <strong>Pending Tasks</strong>: {numPendingTasks}
                            </div>
                            <div>Let's go approve some tasks ✅</div>
                          </div>
                        ) : null}
                      </div>
                      {numTasksLeft === 0 && numPendingTasks === 0 && (
                        <div>
                          You've completed all of your assigned tasks in this
                          Circle! 🤗 Let's go add some more tasks!
                        </div>
                      )}
                    </span>
                  </div>
                </button>
              </form>
            </div>
            <h6>{circle.circleName}</h6>
          </div>
        );
      });
    }

    return (
      <div>
        <h4>Active Circles</h4>
        <Card style={{ width: "100%" }}>
          <CircleForm
            show={this.state.show}
            hideModal={this.hideModal}
            friendsList={this.props.friendsList}
          ></CircleForm>
          <div className="rowButtons">{circles}</div>
          <div className="rowButtons">
            <div className="activeCircle">
              <Button
                className="myButton"
                onClick={this.showModal}
                variant="outline-primary"
              ></Button>
              <h6>Add a New Circle</h6>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default withRouter(ActiveCircles);

// export default ActiveCircles;
// THESE TAKE TIME TO SHOW UP!
// const mapStateToProps = (state, ownProps) => {
//   return {
//     // allUsersRedux: state.firestore.ordered.users,
//     // firebaseAuthRedux: state.firebase.auth
//     // firebaseProfileRedux: state.firebase.profile
//   };
// };

// export default compose(
//   connect(mapStateToProps),
//   //firestoreConnect takes in an array of of objects that say which collection you want to connect to
//   //whenever database for this collection is changed, it will induce the firestoreReducer, which will sync store state
//   // and then this component will "hear" that because we connected that. Then state will change for the store
//   firestoreConnect([])
// )(withRouter(ActiveCircles));
