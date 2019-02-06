import React from 'react';
import { Jumbotron, Container, Row, Col, Button, ListGroup, ListGroupItem, Badge, InputGroup, InputGroupAddon, InputGroupText, Input, ButtonToolbar, ButtonGroup } from 'reactstrap';
import Link from 'next/link'
import { FaPlus } from "react-icons/fa";
import math from "mathjs";
import { isFunction } from 'util';

export default class EquationEntrySlider extends React.Component {
  constructor(props) {
    super(props);
    this.changeListener = props.changeListener.bind(this);
    this.handleDependencies = this.handleDependencies.bind(this);
    this.handleThing = this.handleThing.bind(this);
    this.handleRemove = (function () { props.handleRemove(this) }).bind(this);
    this.handleCenterChange = this.handleCenterChange.bind(this);
    this.toggleEnabled = this.toggleEnabled.bind(this);
    this.state = {
      parser: props.parser,
      enabled: true,
      left: props.leftSide,
      right: props.rightSide,
      equation: props.content,
      value: "1==1",
      badge: "primary",
      requires: [],
      requiresCoords: false,
      provides: [],
      errored: false
    };
    this.handleDependencies(this.state);
    this.handleThing(this.state);
  }
  handleDependencies(state) {
    try {
      var alleq = state.equation;
      var allNodes = math.parse(alleq);
      if (allNodes.isAssignmentNode) {
        var symbols = allNodes.value.filter(function (node) {
          return node.isSymbolNode && !math.hasOwnProperty(node.name)
        });
        var functions = allNodes.value.filter(function (node) {
          return node.isFunctionNode && node.fn.isSymbolNode && !math.hasOwnProperty(node.fn.name)
        });
        //console.log(allNodes.object.name);
        this.state.provides = [allNodes.object.name];
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
        this.state.requires = sym2;
        //console.log(this.state.requires);
      } else if (allNodes.isFunctionAssignmentNode) {
        var symbols = allNodes.expr.filter(function (node) {
          return node.isSymbolNode && !math.hasOwnProperty(node.name) && (allNodes.params.indexOf(node.name) < 0)
        });
        var functions = allNodes.expr.filter(function (node) {
          return node.isFunctionNode && node.fn.isSymbolNode && !math.hasOwnProperty(node.fn.name) && (allNodes.params.indexOf(node.fn.name) < 0)
        });
        //console.log(allNodes.name);
        this.state.provides = [allNodes.name];
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
        this.state.requires = sym2;
        //console.log(this.state.requires);
      } else {
        var symbols = allNodes.filter(function (node) {
          return node.isSymbolNode && !math.hasOwnProperty(node.name)
        });
        var functions = allNodes.filter(function (node) {
          return node.isFunctionNode && node.fn.isSymbolNode && !math.hasOwnProperty(node.fn.name)
        });
        this.state.provides = [];
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
        this.state.requires = sym2;
        //console.log(this.state.requires);
      }
      this.state.requiresCoords = this.state.requires.includes("x") || this.state.requires.includes("y");
      this.state.requires = this.state.requires.filter(x => x != "x" && x != "y");
      this.state.errored = false;
    } catch{
      this.state.errored = true;
      this.state.requiresCoords = true;
    }
  }
  handleThing(state) {
    var res = "false";
    var badg = "danger";
    try {
      this.handleDependencies(state);
      var alleq = state.equation;
      var allNodes = math.parse(alleq);
      if (!this.state.requiresCoords) {
        if (allNodes.isOperatorNode && allNodes.op == "==") {
          var lV = this.state.parser.eval(allNodes.args[0].toString());
          var rV = this.state.parser.eval(allNodes.args[1].toString());
          var same = math.equal(lV, rV);
          if (same) {
            res = lV + "==" + rV;
            badg = "primary";
          } else {
            res = lV + "!=" + rV;
            badg = "warning";
          }
        } else if (allNodes.isOperatorNode && allNodes.op == "!=") {
          var lV = this.state.parser.eval(allNodes.args[0].toString());
          var rV = this.state.parser.eval(allNodes.args[1].toString());
          var same = math.equal(lV, rV);
          if (!same) {
            res = lV + "!=" + rV;
            badg = "primary";
          } else {
            res = lV + "==" + rV;
            badg = "warning";
          }
        } else {
          res = this.state.parser.eval(allNodes.toString());
          if (typeof res == "function") {
            res = res.syntax;
          } else {
            res = res.toString();
          }
          badg = "primary";
        }
      }
    } catch (e) {
      res = "" + e;
    }
    if (res === undefined) {
      res = "undefined";
    }
    this.state.value = res.toString();
    this.state.badge = badg;
    this.setState({ value: res, badge: badg });
  }
  handleCenterChange(event) {
    this.setState({ equation: event.target.value });
    this.state.equation = event.target.value;
    this.changeListener(this.state);
    this.handleThing(this.state);
  }
  toggleEnabled() {
    this.setState({
      enabled: !this.state.enabled
    });
    this.state.enabled = !this.state.enabled;
    this.changeListener(this.state);
    this.handleThing(this.state);
  }

  render() {
    return (
      <div>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <Input addon type="checkbox" aria-label="Checkbox for following text input" onChange={this.toggleEnabled} checked={this.state.enabled} />
            </InputGroupText>
          </InputGroupAddon>
          <Input value={this.state.equation} onChange={this.handleCenterChange} />
          <InputGroupAddon addonType="append"><Button color="danger" style={{ width: "38px" }} onClick={this.handleRemove}>-</Button>{' '}</InputGroupAddon>
        </InputGroup>
        {(this.state.equation == "" || !this.state.enabled || this.state.requiresCoords) ? <div style={{ marginTop: "0.75rem", height: "1.5rem", padding: "3px" }}></div> : <Badge color={this.state.badge} pill style={{ maxWidth: "100%", textOverflow: "ellipsis", overflow: "hidden", marginTop: "0.75rem" }}>{this.state.value}</Badge>}
      </div>
    )
  }
}