import React from 'react';
import { Jumbotron, Container ,Row,Col,Button,ListGroup, ListGroupItem,Badge,InputGroup,InputGroupAddon,InputGroupText,Input,ButtonToolbar,ButtonGroup} from 'reactstrap';
import Link from 'next/link'
import { FaPlus } from "react-icons/fa";
import math from "mathjs";
import { isFunction } from 'util';

export default class EquationEntry extends React.Component {
  constructor(props) {
    super(props);
    this.changeListener=props.changeListener;
    this.changeListener=this.changeListener.bind(this);
    this.handleThing=this.handleThing.bind(this);
    this.handleRemove=(function(){props.handleRemove(this)}).bind(this);
    this.handleLeftChange=this.handleLeftChange.bind(this);
    this.handleCenterChange=this.handleCenterChange.bind(this);
    this.handleRightChange=this.handleRightChange.bind(this);
    this.toggleEnabled = this.toggleEnabled.bind(this);
    this.state = {
      parser:props.parser,
      type:props.type,
      enabled:true,
      left:props.leftSide,
      right:props.rightSide,
      equation:props.content,
      value:"1==1",
      badge:"primary"
    };
    this.handleThing(this.state);
  }
  handleThing(state){
      if(this.state.type=="implicit"){
      var res="false";
      var badg="danger";
      try{
        var lefteq=state.left;
      var righteq=state.right;
      var lV=math.eval(lefteq);//,{x:1,y:1});
      var rV=math.eval(righteq);//,{x:1,y:1});
        var same=math.equal(lV,rV);
        if(same){
          res=lV+"=="+rV;
          badg="primary";
        }else{
          res=lV+"!="+rV;
          badg="warning";
        }
      }catch(e){
        //console.log(e);
        res="error:"+e;
      }
      this.state.value= res;
      this.state.badge=badg;
      this.setState({value: res,badge:badg});
      
    }else{
      var res="false";
      var badg="danger";
      try{
        var alleq=state.equation;
        var allNodes=math.parse(alleq);
        if(allNodes.isOperatorNode && allNodes.op=="=="){
      var lV=this.state.parser.eval(allNodes.args[0].toString());//,{x:1,y:1});
      var rV=this.state.parser.eval(allNodes.args[1].toString());//,{x:1,y:1});
        var same=math.equal(lV,rV);
        if(same){
          res=lV+"=="+rV;
          badg="primary";
        }else{
          res=lV+"!="+rV;
          badg="warning";
        }
      }else{
        res=this.state.parser.eval(allNodes.toString());
        if(typeof res =="function"){
          res=res.syntax;
        }else{
          res=res.toString();
        }
        badg="primary";
      }
      }catch(e){
        //console.log(e);
        res=""+e;
      }
      if(res===undefined){
        res="undefined";
      }
      this.state.value= res.toString();
      this.state.badge=badg;
      this.setState({value: res,badge:badg});
      
     /* var node21 = math.parse('x==y+1')
var transformed1 = node21.transform(function (node, path, parent) {
console.log(node);
  if (node.isOperatorNode && node.fn === 'equal') {
    return new math.expression.node.OperatorNode("-","subtract",node.args)
  } else {
    return node
  }
})
console.log(transformed1.toString())*/
    }
  }
  handleCenterChange(event){
    this.setState({equation: event.target.value});
    this.state.equation=event.target.value;
    this.changeListener(this.state);
    this.handleThing(this.state);
  }
  handleLeftChange(event){
    this.setState({left: event.target.value});
    this.state.left=event.target.value;
    this.changeListener(this.state);
    this.handleThing(this.state);
  }
  handleRightChange(event){
    this.setState({right: event.target.value});
    this.state.right=event.target.value;
    this.changeListener(this.state);
    this.handleThing(this.state);
  }
  toggleEnabled() {
    this.setState({
      enabled: !this.state.enabled
    });
    this.state.enabled=!this.state.enabled;
    this.changeListener(this.state);
    this.handleThing(this.state);
  }
  
  
  render() {
    if(this.state.type=="implicit"){
    return (
<div>
      <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <Input addon type="checkbox" aria-label="Checkbox for following text input" onChange={this.toggleEnabled} checked={this.state.enabled}/>
        </InputGroupText>
      </InputGroupAddon>
      <Input value={this.state.left} onChange={this.handleLeftChange}/>
      <InputGroupAddon addonType="append" className="input-group-prepend">
        <InputGroupText>==</InputGroupText>
      </InputGroupAddon>
      <Input value={this.state.right} onChange={this.handleRightChange}/>
      <InputGroupAddon addonType="append"><Button color="danger" style={{width:"38px"}}>-</Button>{' '}</InputGroupAddon>
    </InputGroup>
    <Badge color={this.state.badge} pill style={{maxWidth:"100%",textOverflow:"ellipsis",overflow:"hidden",marginTop:"1rem"}}>{this.state.value}</Badge>
    </div>
)
  }else if(this.state.type=="all"){
    return (
<div>
      <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <Input addon type="checkbox" aria-label="Checkbox for following text input" onChange={this.toggleEnabled} checked={this.state.enabled}/>
        </InputGroupText>
      </InputGroupAddon>
      <Input value={this.state.equation} onChange={this.handleCenterChange}/>
      <InputGroupAddon addonType="append"><Button color="danger" style={{width:"38px"}} onClick={this.handleRemove}>-</Button>{' '}</InputGroupAddon>
    </InputGroup>
    {(this.state.equation=="" || !this.state.enabled)?<span></span>:<Badge color={this.state.badge} pill style={{maxWidth:"100%",textOverflow:"ellipsis",overflow:"hidden",marginTop:"1rem"}}>{this.state.value}</Badge>}
    </div>
)
  }
}
}