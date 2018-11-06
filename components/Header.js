import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container ,Row,Col } from 'reactstrap';
import Link from 'next/link'

const Header = () => (
    <div>
        <Navbar color="dark" dark expand="md">
         
          <NavbarBrand href="/">Boson</NavbarBrand>
         
            <Nav className="ml-auto" navbar >
              <NavItem>
              <Link href="/"><NavLink>Home</NavLink></Link>
    
              </NavItem>
              <NavItem>
              <Link href="/about"><NavLink>About</NavLink></Link>
              </NavItem>
            </Nav>
        </Navbar>
    </div>
)

export default Header