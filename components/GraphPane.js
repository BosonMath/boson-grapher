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
        this.clearId = this.clearId.bind(this);
        this.graphList=[];
        this.state = {
            canvas: null,
            svg: null,
            width: props.width,
            height: props.height
        }
    }
    clear(){
        this.state.svg.selectAll("path").remove();
        this.graphList=[];
    }
    clearId(id){
        var m=this.graphList.filter(x=>(x.name===id));
        this.graphList=this.graphList.filter(x=>(x.name!==id));
        for(var i=0;i<m.length;i++){
            m[i].path.remove();
        }
    }
    componentDidMount() {
        var svg=this.state.svg;
        var center = { x: 0, y: 0 };
        var viewSize = 5;
        var width = this.state.svg.attr("width");
        var height = this.state.svg.attr("height");
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
        x.domain([-viewSize/2,viewSize/2]);
        y.domain([-viewSize/2*height/width,viewSize/2*height/width]);
        // gridlines in x axis function
function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}
// add the X gridlines
svg.append("g")			
.attr("class", "grid")
.attr("transform", "translate(0," + height + ")")
.call(make_x_gridlines()
    .tickSize(-height)
    .tickFormat("")
)

// add the Y gridlines
svg.append("g")			
.attr("class", "grid")
.call(make_y_gridlines()
    .tickSize(-width)
    .tickFormat("")
)


// add the X Axis
svg.append("g")
.attr("transform", "translate(0," + height/2 + ")")
.call(d3.axisBottom(x));

// add the Y Axis
svg.append("g").attr("transform", "translate(" + (width/2) + "," + 0 + ")")
.call(d3.axisRight(y));

    }
    graph(equation, parser,name,colorFill,colorStroke) {
        var alleq = equation;
        var reso = 300;
        var center = { x: 0, y: 0 };
                var viewSize = 5;
        try {
            var allNodes = math.parse(alleq);
            var fmtTxt=allNodes.toString();
            // if(this.graphList.filter(x=>(x.str==fmtTxt&&x.name===name)).length>0){
            //     return;
            // }
            this.clearId(name);
            if (allNodes.isOperatorNode && allNodes.op == "==") {
                allNodes.op = "-";
                allNodes.fn="subtract";
                var aS=math.compile(allNodes.toString());
                // var lV = math.compile(allNodes.args[0].toString());
                // var rV = math.compile(allNodes.args[1].toString());

                var width = this.state.svg.attr("width");
                var height = this.state.svg.attr("height");
                
                var n = reso, m = Math.floor(reso / width * height);
                var ns2=n-2;
                var ms2=m-2;
                var values = new Array(n * m);
                
                var st=new Date().getTime();
                var nm=n*m;
                var x=0;
                var y=0;
                // for (var k=0;k<nm;k++) {
                //     // x = ((i - 1) / ns2-1/2) * viewSize + center.x;
                //     // y = - ((j - 1) - ms2 / 2) / ns2 * viewSize + center.y;
                //     parser.scope.x=((k%n-1) / ns2-1/2) * viewSize + center.x;
                //     parser.scope.y=- ((Math.floor(k/n)-1) - ms2 / 2) / ns2 * viewSize + center.y;
                //     values[k] = math.re(aS.eval(parser.scope));//math.re(math.subtract(lV.eval(parser.scope), rV.eval(parser.scope)));
                // }
                for (var j = 0, k = 0; j < m; ++j) {
                    for (var i = 0; i < n; ++i, ++k) {
                        x = ((i - 1) / ns2-1/2) * viewSize + center.x;
                        y = - ((j - 1) - ms2 / 2) / ns2 * viewSize + center.y;
                        parser.scope.x=x;
                        parser.scope.y=y;
                        values[k] = math.re(aS.eval(parser.scope));//math.re(math.subtract(lV.eval(parser.scope), rV.eval(parser.scope)));
                    }
                }
                var st2=new Date().getTime();

                // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
                var contours = d3.contours()
                    .size([n, m])
                    .thresholds([0])
                    (values);
                //console.log(this.state.svg);
                
                var newThing=this.state.svg.selectAll("svg")
                    .data(contours)
                    .enter().append("path")
                    .attr("d", d3.geoPath(d3.geoIdentity().scale((parseFloat(width)) / (n - 1)).translate([-parseFloat(width) / (n), -parseFloat(width) / (n)])))
                    .attr("fill", function (d) { return "none"; }).attr("stroke", function (d) { return colorStroke; }).attr("stroke-width", function (d) { return "1px"; });
                var en=new Date().getTime();
                console.log(st2-st,en-st2);
                this.graphList.push({str:fmtTxt,path:newThing,name:name});
                //console.log(contours);

            }
            if (allNodes.isOperatorNode && allNodes.op == ">") {
                allNodes.op = "-";
                allNodes.fn="subtract";
                var aS=math.compile(allNodes.toString());
                // var lV = math.compile(allNodes.args[0].toString());
                // var rV = math.compile(allNodes.args[1].toString());

                var width = this.state.svg.attr("width");
                var height = this.state.svg.attr("height");
  
                var n = reso, m = Math.floor(reso / width * height);
                var ns2=n-2;
                var ms2=m-2;
                var values = new Array(n * m);
                
                var st=new Date().getTime();
                var nm=n*m;
                var x=0;
                var y=0;
                // for (var k=0;k<nm;k++) {
                //     // x = ((i - 1) / ns2-1/2) * viewSize + center.x;
                //     // y = - ((j - 1) - ms2 / 2) / ns2 * viewSize + center.y;
                //     parser.scope.x=((k%n-1) / ns2-1/2) * viewSize + center.x;
                //     parser.scope.y=- ((Math.floor(k/n)-1) - ms2 / 2) / ns2 * viewSize + center.y;
                //     values[k] = math.re(aS.eval(parser.scope));//math.re(math.subtract(lV.eval(parser.scope), rV.eval(parser.scope)));
                // }
                for (var j = 0, k = 0; j < m; ++j) {
                    for (var i = 0; i < n; ++i, ++k) {
                        x = ((i - 1) / ns2-1/2) * viewSize + center.x;
                        y = - ((j - 1) - ms2 / 2) / ns2 * viewSize + center.y;
                        parser.scope.x=x;
                        parser.scope.y=y;
                        values[k] = math.re(aS.eval(parser.scope));//math.re(math.subtract(lV.eval(parser.scope), rV.eval(parser.scope)));
                    }
                }
                var st2=new Date().getTime();

                // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
                var contours = d3.contours()
                    .size([n, m])
                    .thresholds([0])
                    (values);
                //console.log(this.state.svg);
                
                var newThing=this.state.svg.selectAll("svg")
                    .data(contours)
                    .enter().append("path")
                    .attr("d", d3.geoPath(d3.geoIdentity().scale((parseFloat(width)) / (n - 1)).translate([-parseFloat(width) / (n), -parseFloat(width) / (n)])))
                    .attr("fill", function (d) { return "none"; }).attr("stroke", function (d) { return colorStroke; }).attr("fill", function (d) { return colorFill; }).attr("stroke-width", function (d) { return "1px"; });
                var en=new Date().getTime();
                console.log(st2-st,en-st2);
                this.graphList.push({str:fmtTxt,path:newThing,name:name});
                //console.log(contours);

            }
            if (allNodes.isOperatorNode && allNodes.op == "<") {
                allNodes.op = "-";
                allNodes.fn="subtract";
                allNodes.args=[allNodes.args[1],allNodes.args[0]];
                var aS=math.compile(allNodes.toString());
                // var lV = math.compile(allNodes.args[0].toString());
                // var rV = math.compile(allNodes.args[1].toString());

                var width = this.state.svg.attr("width");
                var height = this.state.svg.attr("height");
                var n = reso, m = Math.floor(reso / width * height);
                var ns2=n-2;
                var ms2=m-2;
                var values = new Array(n * m);
           
                var st=new Date().getTime();
                var nm=n*m;
                var x=0;
                var y=0;
                // for (var k=0;k<nm;k++) {
                //     // x = ((i - 1) / ns2-1/2) * viewSize + center.x;
                //     // y = - ((j - 1) - ms2 / 2) / ns2 * viewSize + center.y;
                //     parser.scope.x=((k%n-1) / ns2-1/2) * viewSize + center.x;
                //     parser.scope.y=- ((Math.floor(k/n)-1) - ms2 / 2) / ns2 * viewSize + center.y;
                //     values[k] = math.re(aS.eval(parser.scope));//math.re(math.subtract(lV.eval(parser.scope), rV.eval(parser.scope)));
                // }
                for (var j = 0, k = 0; j < m; ++j) {
                    for (var i = 0; i < n; ++i, ++k) {
                        x = ((i - 1) / ns2-1/2) * viewSize + center.x;
                        y = - ((j - 1) - ms2 / 2) / ns2 * viewSize + center.y;
                        parser.scope.x=x;
                        parser.scope.y=y;
                        values[k] = math.re(aS.eval(parser.scope));//math.re(math.subtract(lV.eval(parser.scope), rV.eval(parser.scope)));
                    }
                }
                var st2=new Date().getTime();

                // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
                var contours = d3.contours()
                    .size([n, m])
                    .thresholds([0])
                    (values);
                //console.log(this.state.svg);
                
                var newThing=this.state.svg.selectAll("svg")
                    .data(contours)
                    .enter().append("path")
                    .attr("d", d3.geoPath(d3.geoIdentity().scale((parseFloat(width)) / (n - 1)).translate([-parseFloat(width) / (n), -parseFloat(width) / (n)])))
                    .attr("fill", function (d) { return "none"; }).attr("stroke", function (d) { return colorStroke; }).attr("fill", function (d) { return colorFill; }).attr("stroke-width", function (d) { return "1px"; });
                var en=new Date().getTime();
                console.log(st2-st,en-st2);
                this.graphList.push({str:fmtTxt,path:newThing,name:name});
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

