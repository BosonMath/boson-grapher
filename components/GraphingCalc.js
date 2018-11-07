import React from 'react';
import { Jumbotron, Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link'
import EquationPane from "../components/EquationPane.js";
import GraphPane from "../components/GraphPane.js";
export default class GraphingCalc extends React.Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      equationPane: null,
      graphPane: null
    }
  }
  updateDimensions() {
    console.log("resss");
    //this.state.graphPane.width=this.state.graphPane.ELEMENT_NODE.parent.width;
    //this.state.graphPane.setState({width:500,height:500});
    //this.state.equationPane.changey();
  }
  componentDidMount() {
    this.state.equationPane.changey();
    window.addEventListener("resize", this.updateDimensions);
  }
  render() {
    return (
      <div>
        <Container style={{ height: "calc( 100vh - 56px)" }} fluid>
          <Row style={{ height: "100%" }}>
            <Col sm="12" md={{ size: 4, offset: 0 }} style={{ height: "100%", borderRight: "1px solid #343a40", padding: "15px" }}>
              <EquationPane ref={(child) => { this.state.equationPane = child }} parent={this}></EquationPane>
            </Col>
            <Col sm="12" md={{ size: 8 }} style={{ height: "100%", padding: "0px" }}>
              <GraphPane ref={(child) => { this.state.graphPane = child }} width={700} height={700}></GraphPane>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}