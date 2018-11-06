import React from 'react';
import { Jumbotron, Container ,Row,Col,Button} from 'reactstrap';
import Link from 'next/link'
import EquationPane from "../components/EquationPane.js";
import GraphPane from "../components/GraphPane.js";
const GraphingCalc = () => (
<div>
    <Container style={{height:"calc( 100vh - 56px)"}} fluid>
    <Row style={{height:"100%"}}>
          <Col sm="12" md={{ size: 4, offset: 0 }} style={{height:"100%",borderRight:"1px solid #343a40",padding:"15px"}}>
            <EquationPane></EquationPane>
          </Col>
          <Col sm="12" md={{ size: 8 }} style={{height:"100%",padding:"0px"}}>
            <GraphPane></GraphPane>
          </Col>
        </Row>
        
    </Container>
</div>
);

export default GraphingCalc;