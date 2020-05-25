import React, { Component } from "react";
class ProfileStatus extends Component {
  render() {
    let { profileData } = this.props;
    //console.log(profileData);
    let fName = profileData && profileData.firstName;
    let lName = profileData && profileData.lastName;
    var name = fName && lName && fName + " " + lName;

    //number of circles displayed
    let cNum = 3;
    let circlesToDisplay = [];

    //get the

    if (profileData) {
      if (profileData.circleList !== undefined) {
        circlesToDisplay = profileData.circleList.sort().slice(0, cNum);
      }
    }

    //once we get a "visual circle" component, i.e. like the circles we click on in the dashboard, we can replace h2 with that component
    let circlesDisplayed = circlesToDisplay.map(circle => (
      <li key={Object.keys(circle)[0]}>{Object.values(circle)[0]}</li>
    ));

    return (
      <React.Fragment>
        <h1>{name}</h1>
        <ul>{circlesDisplayed}</ul>
      </React.Fragment>
    );
  }
}

export default ProfileStatus;
