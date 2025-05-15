import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import App from './App';


function MasterMain() {
    return (
      <Container>
        <Row>
          <Col><App/></Col>
        </Row>
      </Container>
    );
  }
  
  export default MasterMain;