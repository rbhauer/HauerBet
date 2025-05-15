import React from 'react';
import { Form, Button, Container, Modal, Col, Card, Row } from 'react-bootstrap';
import './FixtureBox.css';
import { useState, useEffect } from 'react';
import { displayDate, RESULT } from './FixtureUtility';
import { fetchActiveUser, fetchActiveBalance } from './UserUtility';


function FixtureBox({ key, homeTeam, homeLine, awayTeam, awayLine, homeVig, awayVig, fixtureID, inDate, setCurrentBalanceBox}) {
    const hostname = 'http://127.0.0.1:5298';

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loginShow, setLoginShow] = useState(false);
    const handleCloseLoginError = () => setLoginShow(false);
    const handleShowLoginError = () => setLoginShow(true);


    const [betTeam, setBetTeam] = useState("");
    const [betLine, setBetLine] = useState(0);
    const [betVig, setBetVig] = useState("");

    const [wagerAmount, setWagerAmount] = useState('');
    const [potentialWinnings, setPotentialWinnings] = useState(null);
    

    // Function to calculate potential winnings
    const calculatePotentialWinnings = (bet) => {
        if (!bet || isNaN(bet)) return;
        const betValue = parseFloat(bet);
        const winnings = (betValue /  (betVig * -1.0)) * 100;  
        setPotentialWinnings(winnings.toFixed(2));
    };

    const handleWagerAmountChange = (e) => {
        setWagerAmount(e.target.value);
        calculatePotentialWinnings(e.target.value);
    };


    const loadBetModal = (team, line, vig) => {
        setBetTeam(team);
        setBetLine(line);
        setBetVig(vig);
        handleShow();
    }

    async function newWagerCheck()
    {
        const user = await fetchActiveUser();
        const check = user.localeCompare("Please Login");
        if (user.localeCompare("Please Login") === 0)
        {
            handleClose();
            handleShowLoginError();
        }
        else
        {
            newWager();
        }
    }

    async function newBalanceCheck()
    {
        const currentBalanceBox = await fetchActiveBalance();
        setCurrentBalanceBox(currentBalanceBox);
    }


    const newWager = () => {

        

        const newWager = {
          Id: -1,
          Wager_Id: -1,
          FixtureID: fixtureID,
          Team: betTeam,
          WagerAmount: wagerAmount,
          Payout: potentialWinnings,
          UserId: "",
          Spread: betLine,
          Vig: betVig, 
          WagerDate: inDate,
          Status: RESULT.PENDING
        };

        console.log(newWager);

        fetch(hostname + '/addWager',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newWager)})
          
          fetch(hostname + '/updateActiveBalance_wager',{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newWager)
        })
          newBalanceCheck();
          handleClose();
      };


    return (
        <div>
                <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={loginShow} onHide={handleCloseLoginError} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Login Error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Please login to place bet!</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLoginError}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>


            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal show={show} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Wager</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Card className="mt-3">
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <Card.Title>Team</Card.Title>
                                        <p>{betTeam}</p>
                                    </Col>
                                    <Col md={4}>
                                        <Card.Title>Betting Line</Card.Title>
                                        <p>{(betLine > 0 ? "+" + betLine.toFixed(1) : betLine.toFixed(1))} ({betVig })</p>
                                    </Col>
                                </Row>
                                <Form>
                                    <Form.Group as={Col} controlId="formWagerAmount">
                                        <Form.Label>Wager Amount ($)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={wagerAmount}
                                            onChange={handleWagerAmountChange}
                                            placeholder="Enter wager amount"
                                        />
                                    </Form.Group>

                                    {potentialWinnings !== null && (
                                        <div>
                                            <h5>Payout: ${potentialWinnings}</h5>
                                        </div>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="success" onClick={()=> newWagerCheck()}>Place Bet </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Container className="fixture-container">

                <Form className="fixture-form">
                    <div className="fixture-time">
                        {displayDate(inDate)}
                    </div>
                    <Form.Group className="mb-3" controlId="homeTeam">
                        <div className="team-container">
                            <div className="team-name">{homeTeam}</div>
                            <Button className="btn btn-secondary" onClick={() => loadBetModal(homeTeam, homeLine, homeVig)} >
                                {(homeLine > 0 ? "+" + homeLine.toFixed(1) : homeLine.toFixed(1))} ({homeVig})</Button>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="awayTeam">
                        <div className="team-container">
                            <div className="team-name">{awayTeam}</div>
                            <Button className="btn btn-secondary" onClick={() => loadBetModal(awayTeam, awayLine, awayVig)}>
                                {(awayLine > 0 ? "+" + awayLine.toFixed(1) : awayLine.toFixed(1))} ({awayVig})</Button>
                        </div>
                    </Form.Group>
                </Form>
            </Container>
        </div>

    );
}

export default FixtureBox;







