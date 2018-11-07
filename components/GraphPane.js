import React from 'react';
import { Jumbotron, Container, Row, Col, Button, ListGroup, ListGroupItem, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, Input, ButtonToolbar, ButtonGroup } from 'reactstrap';
import Link from 'next/link'
import { FaPlus } from "react-icons/fa";
import math from "mathjs";
var d3 = Object.assign({}, require("d3"), require("d3-contour"));
export default class GraphPane extends React.Component {
    constructor(props) {
        super(props);
        this.graph = this.graph.bind(this);
        this.clear = this.clear.bind(this);
        this.state = {
            canvas: null,
            svg: null,
            width: props.width,
            height: props.height
        }
    }
    clear(){
        this.state.svg.selectAll("path").remove();
    }
    graph(equation, parser,color) {
        var alleq = equation;
        try {
            var allNodes = math.parse(alleq);
            if (allNodes.isOperatorNode && allNodes.op == "==") {
                var lV = math.compile(allNodes.args[0].toString());
                var rV = math.compile(allNodes.args[1].toString());

                var width = this.state.svg.attr("width");
                var height = this.state.svg.attr("height");
                var reso = 200;
                var n = reso, m = Math.floor(reso / width * height), values = new Array(n * m);
                var center = { x: 0, y: 0 };
                var viewSize = 5;
                for (var j = 0, k = 0; j < m; ++j) {
                    for (var i = 0; i < n; ++i, ++k) {
                        var x = ((i - 1 - (n - 2) / 2) / (n - 2)) * viewSize + center.x;
                        var y = - ((j - 1) - (m - 2) / 2) / (n - 2) * viewSize + center.y;
                        parser.set("x", x);
                        parser.set("y", y);
                        values[k] = math.re(math.subtract(lV.eval(parser.scope), rV.eval(parser.scope)));
                    }
                }


                // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
                var contours = d3.contours()
                    .size([n, m])
                    .thresholds([0])
                    (values);
                //console.log(this.state.svg);
                
                this.state.svg.selectAll("svg")
                    .data(contours)
                    .enter().append("path")
                    .attr("d", d3.geoPath(d3.geoIdentity().scale((parseFloat(width)) / (n - 1)).translate([-parseFloat(width) / (n), -parseFloat(width) / (n)])))
                    .attr("fill", function (d) { return "none"; }).attr("stroke", function (d) { return color; }).attr("stroke-width", function (d) { return "2px"; });
                //console.log(contours);

            }
        } catch (e) {
        }
    }
    render() {
        return (
            <div>
                <svg ref={(child) => { this.state.canvas = child; this.state.svg = d3.select("svg") }} width={this.state.width} height={this.state.height} style={{ borderRight: "1px solid red", borderBottom: "1px solid red" }}></svg>
            </div>
        );
    }
}

