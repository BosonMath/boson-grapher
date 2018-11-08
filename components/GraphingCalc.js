import React from 'react';
import { Jumbotron, Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link'
import EquationPane from "../components/EquationPane.js";
import GraphPane from "../components/GraphPane.js";
import math from "mathjs";
export default class GraphingCalc extends React.Component {
  constructor(props) {
    super(props);
    this.addListener = this.addListener.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.graphListener = this.graphListener.bind(this);
    this.doTasks = this.doTasks.bind(this);
    this.state = {
      taskQueue: [],//[{ requirements: [], instruction: { type: "addEq", data: "y^2==1-x^2" } }],
      listeners: [],
      equationPane: null,
      graphPane: null,
      listenerCounter: 0
    }
    this.addListener("addEq", this.graphListener);
  }
  addListener(type, fn) {
    this.state.listeners.push({ id:this.state.listenerCounter,type: type, fn: fn });
    return this.state.listenerCounter++;
  }
  graphListener(event) {
    console.log("graph listener", event)
  }
  pAndR(allEq) {
    var res = { provides: [], requires: [], requiresCoords: false };
    try {

      var allNodes = math.parse(alleq);
      if (allNodes.isAssignmentNode) {
        var symbols = allNodes.value.filter(function (node) {
          return node.isSymbolNode && !math.hasOwnProperty(node.name)
        });
        var functions = allNodes.value.filter(function (node) {
          return node.isFunctionNode && node.fn.isSymbolNode && !math.hasOwnProperty(node.fn.name)
        });
        //console.log(allNodes.object.name);
        res.provides = [allNodes.object.name];
        //console.log("requires:");
        var syms = symbols.map(node => node.name).concat(functions.map(node => node.fn.name));
        var sym2 = [];
        for (var m of syms) {
          if (!sym2.includes(m)) {
            sym2.push(m);
          }
        }
        //console.log(symbols.map(node=>node.name));
        //console.log(functions.map(node=>node.fn.name));
        res.requires = sym2;
        //console.log(this.state.requires);
      } else if (allNodes.isFunctionAssignmentNode) {
        var symbols = allNodes.expr.filter(function (node) {
          return node.isSymbolNode && !math.hasOwnProperty(node.name) && (allNodes.params.indexOf(node.name) < 0)
        });
        var functions = allNodes.expr.filter(function (node) {
          return node.isFunctionNode && node.fn.isSymbolNode && !math.hasOwnProperty(node.fn.name) && (allNodes.params.indexOf(node.fn.name) < 0)
        });
        //console.log(allNodes.name);
        res.provides = [allNodes.name];
        //console.log("requires:");
        var syms = symbols.map(node => node.name).concat(functions.map(node => node.fn.name));
        var sym2 = [];
        for (var m of syms) {
          if (!sym2.includes(m)) {
            sym2.push(m);
          }
        }
        //console.log(symbols.map(node=>node.name));
        //console.log(functions.map(node=>node.fn.name));
        res.requires = sym2;
        //console.log(this.state.requires);
      } else {
        var symbols = allNodes.filter(function (node) {
          return node.isSymbolNode && !math.hasOwnProperty(node.name)
        });
        var functions = allNodes.filter(function (node) {
          return node.isFunctionNode && node.fn.isSymbolNode && !math.hasOwnProperty(node.fn.name)
        });
        res.provides = [];
        //console.log("requires:");
        var syms = symbols.map(node => node.name).concat(functions.map(node => node.fn.name));
        var sym2 = [];
        for (var m of syms) {
          if (!sym2.includes(m)) {
            sym2.push(m);
          }
        }
        //console.log(symbols.map(node=>node.name));
        //console.log(functions.map(node=>node.fn.name));
        res.requires = sym2;
        //console.log(this.state.requires);
      }
      res.requiresCoords = res.requires.includes("x") || res.requires.includes("y");
      res.requires = res.requires.filter(x => x != "x" && x != "y");

    } catch{

      res.requiresCoords = true;
    }
    return res;
  }
  taskReady(task) {
    return true;
  }
  doTasks() {
    var readyTasks = this.state.taskQueue.filter(this.taskReady);
    if (readyTasks.length > 0) {
      var task = readyTasks[0];
      this.state.taskQueue = this.state.taskQueue.filter(x => x !== task);
      var instruction = task.instruction;
      if (instruction.type == "addEq") {
        this.state.equationPane.addEquation(instruction.data);
      }
      for (var i = 0; i < this.state.listeners.length; i++) {
        if (this.state.listeners[i].type == instruction.type) {
          this.state.listeners[i].fn(instruction);
        }
      }
    }
  }
  updateDimensions() {
    //console.log("resss");
    //this.state.graphPane.width=this.state.graphPane.ELEMENT_NODE.parent.width;
    //this.state.graphPane.setState({width:500,height:500});
    //this.state.equationPane.changey();
  }
  componentDidMount() {
    this.state.equationPane.changey();
    window.addEventListener("resize", this.updateDimensions);
    window.setInterval(this.doTasks, 10);
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