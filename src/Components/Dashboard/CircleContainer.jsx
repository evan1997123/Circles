import React from "react";
import CircleStatus from "./CircleStatus";
import ActiveCircles from "./DashboardActiveCircles";
import "./CircleContainer.css";

class CircleContainer extends React.Component {
  render() {
    let allCircles = [
      { circle: "Workout", numberTasks: 2 },
      { circle: "Study Buddies", numberTasks: 3 }
    ];

    //let createCircle = { circle: "Create New Circle" };

    return (
      <div className="column">
        <div className="circle">
          <CircleStatus
            currentCircle={"Housemates"}
            numberTasksRemaining={1}
            allCircles={allCircles}
          />
        </div>
        <div className="circle">
          <ActiveCircles />
        </div>
      </div>
    );
  }
}

export default CircleContainer;
