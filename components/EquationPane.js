import React from 'react';
import { Jumbotron, Container ,Row,Col,Button,ListGroup, ListGroupItem,Nav,NavItem,NavLink,InputGroup,InputGroupAddon,InputGroupText,Input,ButtonToolbar,ButtonGroup} from 'reactstrap';
import Link from 'next/link'
import { FaPlus } from "react-icons/fa";
import math from "mathjs";
import EquationEntry from "../components/EquationEntry.js";
export default class EquationPane extends React.Component {
    constructor(props) {
      super(props);
      this.addEq=this.addEq.bind(this);
      this.eqEntry=this.eqEntry.bind(this);
      this.changey=this.changey.bind(this);
      this.handleRemove=this.handleRemove.bind(this);
      this.state={
          entries:[
              {name:0,content:"log(-1)==i*pi"},
              {name:1,content:"sqrt(5)/2+1/2==phi"}
          ],
          addSt:2,
          parser:new math.parser()
      };
    }
    changey(v){
        //console.log("chdsffd",v);
        this.state.parser.clear();
        var goes=this.state.entries.length;
        for(var j=0;j<goes;j++){
            for(var i=0;i<this.state.entries.length;i++){
                if(this.state.entries[i].el.state.enabled){
                    this.state.entries[i].el.handleThing(this.state.entries[i].el.state);
                }
            }
        }
    }
    handleRemove(v){
        this.state.entries=this.state.entries.filter(x=>(x.el!==v));
        //console.log(v);
        this.setState({entries:this.state.entries});
    }
    addEq(){
        this.state.entries.push({name:this.state.addSt++,content:"1==1"});
        this.setState({entries:this.state.entries});
    }
    eqEntry(eq){
        var toRet=<ListGroupItem tag="div" key={eq.name}>
        <EquationEntry ref={(child) => { eq.el=child }} handleRemove={this.handleRemove} type="all" parser={this.state.parser} changeListener={this.changey} leftSide="det([[1,0],[0,1]])" rightSide="-i*log(-1)/pi" content={eq.content}></EquationEntry>
      
      
        </ListGroupItem>;
        return toRet;
    }
    render(){
        return (
            <div>
{/* <Nav>
          <NavItem>
            <NavLink href="#">Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Another Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#">Disabled Link</NavLink>
          </NavItem>
        </Nav> */}
            <p>
         <Button color="info" outline style={{width:"38px"}} onClick={this.addEq}>+</Button>{' '}
         </p>
    <ListGroup flush>
        {this.state.entries.map(this.eqEntry)}
      </ListGroup>
</div>
        )
    }
}