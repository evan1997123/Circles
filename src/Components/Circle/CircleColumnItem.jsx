import React from "react";
import Card from "react-bootstrap/Card";

/*


UNUSED
UNUSED
UNUSED
UNUSED
UNUSED
UNUSED
UNUSED
UNUSED

*/

class CircleColumnItem extends React.Component {
  render() {
    // console.log(this.props.task);
    return (
      <div>
        <Card style={{ width: "100%" }}>
          <Card.Body>
            <Card.Title>{this.props.task}</Card.Title>
            <Card.Text>This is a task this is a task this is a task</Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default CircleColumnItem;
