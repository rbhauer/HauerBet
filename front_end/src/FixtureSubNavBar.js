import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from 'react-router-dom';
import nbaLogo from './nba-logo.png';
import nflLogo from './nfl-logo.png';



function FixtureSubNavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link eventKey="nfl" as={Link} to="/NFL"><img
          src={nflLogo}
          alt="NFL-logo"
          width="96"
          height="48"
        /></Nav.Link>
            <Nav.Link eventKey="nba" as={Link} to="/NBA"> <img
          src={nbaLogo}
          alt="NBA-logo"
          width="48"
          height="48"
        />
        </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default FixtureSubNavBar;