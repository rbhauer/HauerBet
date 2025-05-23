import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from 'react-router-dom';

import { useState, useEffect } from 'react';



function NavHeader({currentBalance}) {



    return (
        <>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="#home">HauerBet</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link eventKey="/" as={Link} to="/">Sportsbook</Nav.Link>
                <Nav.Link eventKey="account" as={Link} to="/account">Account</Nav.Link>
                <Nav.Link eventKey="login" as={Link} to="/login">Login</Nav.Link>
              </Nav>
              <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Current Balance: <a href="account">{currentBalance}</a>  
          </Navbar.Text>
        </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
      );
}

export default NavHeader;