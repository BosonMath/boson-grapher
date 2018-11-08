import React from 'react';
import { Jumbotron, Container, Row, Col, Button, ListGroup, ListGroupItem, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, Input, ButtonToolbar, ButtonGroup } from 'reactstrap';
import Link from 'next/link'
import { FaPlus } from "react-icons/fa";
import math from "mathjs";
import EquationEntry from "../components/EquationEntry.js";
export default class EquationPane extends React.Component {
    constructor(props) {
        super(props);
        this.parent = props.parent;
        this.addEq = this.addEq.bind(this);
        this.addEquation = this.addEquation.bind(this);
        this.eqEntry = this.eqEntry.bind(this);
        this.changey = this.changey.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        var entries = [
            // { name: 0, content: "m(n,Z)=n<1?Z:c(((m(n-1,Z))^2+Z),20)" ,graphed:false},
            // { name: 1, content: "e^re(log(m(7,x+y*i)))==2" ,graphed:false},
            // { name: 2, content: "c(z,M)=e^re(log(z))>M?M+1:z" ,graphed:false},
            // { name: 3, content: "((x-0.25)^2+y^2)^0.5==sin(atan2(-x+0.25,y))/2+1/2" ,graphed:false},
            // { name: 4, content: "(x+1)^2+y^2==0.25^2" ,graphed:false},
            // {name:0,content:"cos(pi/2*x/(x^2+y^2))*cos(pi/2*y/(x^2+y^2))==0",graphed:false},
            // {name:1,content:"(mod(x/(x^2+y^2+0.001),2)-1)^2+(mod(y/(x^2+y^2+0.001),2)-1)^2==1",graphed:false},
            {name:0,content:"1/sqrt(2)-cos(10x/(x^2+y^2))^2>cos(10y/(x^2+y^2))^2",graphed:false},
            {name:1,content:"1/sqrt(2)-sin(10x/(x^2+y^2))^2>sin(10y/(x^2+y^2))^2",graphed:false},
            
            
            // { name: 0, content: "h=o" ,graphed:false},
            // { name: 1, content: "o=2" ,graphed:false},
            //  { name: 0, content: "f(z,n)=n<1?z:c(z*sin(f(z,n-1)),200)" ,graphed:false},
            // { name: 1, content: "re(log(f(x+y*i,7)))==log(2)",graphed:false },
            // {name:2, content:"c(z,M)=e^re(log(z))>M?M+1:z",graphed:false},

        ];
        this.state = {
            entries: entries,
            addSt: entries.length,
            parser: new math.parser()
        };
    }
    componentDidMount() {
        var goes = this.state.entries.length;
        var ok = [];
        for (var i = 0; i < goes; i++) {
            this.state.entries[i].el.handleDependencies(this.state.entries[i].el.state);

        }
    }
    changey() {
        this.state.parser.clear();
        var goes = this.state.entries.length;
        var ok = [];
        for (var i = 0; i < goes; i++) {
            if(this.state.entries[i].el){
                this.state.entries[i].el.handleDependencies(this.state.entries[i].el.state);
                if (this.state.entries[i].el.state.enabled) {
                    ok.push([i, this.state.entries[i].el.state.requires, this.state.entries[i].el.state.provides, true]);
                }
            }
        }
        for (var j = 0; j < goes + 1; j++) {
            ok = ok.map(function (x) {
                var newDep = [];
                for (var i = 0; i < x[1].length; i++) {
                    var depo = ok.filter(y => y[2].includes(x[1][i]));
                    if (depo.length < 1) {
                        x[3] = false;
                        return x;
                    }
                    var addD = depo[0][1];
                    for (var k = 0; k < addD.length; k++) {
                        if (!newDep.includes(addD[k])) {
                            newDep.push(addD[k]);
                        }
                    }
                }
                x[1] = newDep;
                return x;
            }
            ).filter(x => x[3]);
        }

        var evaled = [];
        for (var j = 0; j < ok.length; j++) {
            evaled[j] = false;
            ok[j][1] = this.state.entries[ok[j][0]].el.state.requires;
        }
        //console.log("ok", ok);
        for (var j = 0; j < ok.length; j++) {
            var toEval = [j];
            var l = 0;
            while (toEval.length > 0 && l < ok.length * ok.length) {
                var tt = toEval[toEval.length - 1];
                if (!evaled[tt]) {
                    var i = ok[tt][0];
                    var reqs = this.state.entries[i].el.state.requires.map(depo => ok.findIndex(y => y[2].includes(depo)));
                    //console.log(tt,"sps",reqs);
                    var ind = reqs.find(p => !evaled[p] && (p !== tt));
                    if (!(ind >= 0)) {
                        
                        if (this.state.entries[i].el.state.enabled) {
                            this.state.entries[i].el.handleThing(this.state.entries[i].el.state);
                        }
                        evaled[tt] = true;
                        toEval.pop();
                        //console.log(tt,"sp",toEval);
                    } else {
                        toEval.push(ind);
                    }
                } else {
                    toEval.pop();
                }
                l++;
            }

        }
        //console.log(evaled);
        // for (var i = 0; i < goes; i++) {
        //     for (var j = 0; j < this.state.entries.length; j++) {
        //         var m=j;
        //         if(!this.state.entries[m].el.state.requiresCoords){
        //         this.state.entries[m].el.handleThing(this.state.entries[m].el.state);
        //         }
        //     }
        // }
        //this.parent.state.graphPane.clear();
        for (var i = 0; i < goes; i++) {
            if(this.state.entries[i].el){
                if (this.state.entries[i].el.state.enabled) {
                    var hue=Math.floor(360*Math.random());
                    this.parent.state.graphPane.graph(this.state.entries[i].el.state.equation, this.state.parser,this.state.entries[i].name,"hsl("+hue+",100%,80%)","hsl("+hue+",100%,40%)");
                }else{
                    this.parent.state.graphPane.clearId(this.state.entries[i].name);
                }
            }
        }
    }
    handleRemove(v) {
        var removing=this.state.entries.filter(x => (x.el === v));
        this.state.entries = this.state.entries.filter(x => (x.el !== v));
        if(removing.length>0){
            this.parent.state.graphPane.clearId(removing[0].name);
        }
        this.setState({ entries: this.state.entries });
    }
    addEq() {
        this.state.entries.push({ name: this.state.addSt++, content: "0" ,graphed:false});
        this.setState({ entries: this.state.entries });
        this.changey();
    }
    addEquation(text) {
        this.state.entries.push({ name: this.state.addSt++, content: text ,graphed:false});
        this.setState({ entries: this.state.entries });
        this.changey();
    }
    eqEntry(eq) {
        var toRet =
            <ListGroupItem tag="div" key={eq.name} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <EquationEntry ref={(child) => { eq.el = child }} handleRemove={this.handleRemove} type="all" parser={this.state.parser} changeListener={this.changey} content={eq.content}></EquationEntry>
            </ListGroupItem>;
        return toRet;
    }
    render() {
        return (
            <div>
                <p>
                    <Button color="info" outline style={{ width: "38px" }} onClick={this.addEq}>+</Button>{' '}
                </p>
                <ListGroup flush>
                    {this.state.entries.map(this.eqEntry)}
                </ListGroup>
            </div>
        )
    }
}