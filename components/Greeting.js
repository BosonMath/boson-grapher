import React from 'react';
import { Jumbotron, Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link'
const Greeting = () => (
  <div>
    <Jumbotron fluid>
      <Container fluid>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <h1 className="display-3">Boson Grapher</h1>
            <p className="lead">An advanced Open-Source graphing tool.</p>
            <Link href="/calculator"><Button color="success" size="lg">Start Graphing!</Button></Link>
          </Col>
        </Row>

      </Container>
    </Jumbotron>
  </div>
);

export default Greeting;