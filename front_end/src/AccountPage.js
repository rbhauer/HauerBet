import React from 'react';
import { Card, Col, Row, Container, Table, Button, Modal, Form, NavLink } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { fetchActiveUser, fetchActiveBalance, updateActiveBalance } from './UserUtility';
import { displayDate, abbreviatedTeamNameNBA, RESULT } from './FixtureUtility';
import { BalldontlieAPI } from "@balldontlie/sdk";

function AccountPage() {
  const hostname = 'http://127.0.0.1:5298';
  const [activeUser, setActiveUser] = useState('');
  const [currentBalance, setCurrentBalance] = useState(' N/A');
  const [activeWagers, setActiveWagers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [DespoitAmount, setDepositAmount] = useState(0);

  useEffect(() => {
    //only execute if no active user
    if (activeUser.localeCompare('') === 0) {
      getUserandBalance();
    }
    fetchActiveWagers();
  });

  async function getUserandBalance() {
    //get active user
    const activeUserData = await fetchActiveUser();
    setActiveUser(activeUserData);

    //get current balance
    const currentBalanceData = await fetchActiveBalance();
    if (currentBalanceData >= 0) {
      setCurrentBalance(currentBalanceData.toFixed(2));
    }
    else {
      setCurrentBalance(' N/A');
    }
  }

  async function fetchActiveWagers() {
    try {
      const response = await fetch(hostname + '/getActiveWagers');
      const data = await response.json();
      setActiveWagers(data);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    }
  }

  const newDeposit = () => {
    const newBalance =
    {
      realBalance: DespoitAmount
    };
    fetch(hostname + '/depositFunds', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBalance)
    })
    window.location.reload();
  }

  /* async function fetchGameResultsTest(inDate)
      {
        const api = new BalldontlieAPI({ apiKey: "21b46c54-cc3a-48ea-b238-61a350e41ba7" });
        const games = await api.nba.getGames({dates: [inDate]});     
        console.log(games);
        return games;
      } */

  async function fetchGame(inDate, checkTeam, league) {
    const testDate = new Date(inDate);

    const year = testDate.getFullYear();
    var month = testDate.getMonth() + 1;

    if (month < 10) {
      month = "0" + month.toString();
    }

    var day = testDate.getDate();

    if (day < 10) {
      day = "0" + day.toString();
    }
    const checkDate = (year + "-" + month + "-" + day);
    const api = new BalldontlieAPI({ apiKey: process.env.REACT_APP_BALL_DONT_LIE_KEY });
    let games = [];

    if (league.localeCompare("NFL") === 0)
    {
        games = await api.nfl.getGames({ dates: [checkDate] });
    }
    else if (league.localeCompare("NBA") === 0)
    {
        games = await api.nba.getGames({ dates: [checkDate] });
    }
    
    const foundGame = games.data.filter(game => ((game.home_team.full_name.localeCompare(checkTeam) === 0) || game.visitor_team.full_name.localeCompare(checkTeam) === 0));
    return foundGame
  }

  function checkWinLoss(checkGame, targetTeam, spread) {

    if (checkGame.home_team.full_name.localeCompare(targetTeam) === 0) //if home team
    {
      if (checkGame.home_team_score + spread > checkGame.visitor_team_score) {
        return RESULT.WIN;
      }
      else if (checkGame.home_team_score + spread === checkGame.visitor_team_score) {
        return RESULT.PUSH;
      }
      else {
        return RESULT.LOSS;
      }
    }
    else {
      if (checkGame.visitor_team_score + spread > checkGame.home_team_score) {
        return RESULT.WIN;
      }
      else if (checkGame.visitor_team_score + spread === checkGame.home_team_score) {
        return RESULT.PUSH;
      }
      else {
        return RESULT.LOSS;
      }
    }
  }

  async function getResult(inWager) {
    const targetGame = await fetchGame(inWager.wagerDate, abbreviatedTeamNameNBA(inWager.team), inWager.league);
    const checker = checkWinLoss(targetGame[0], inWager.team, inWager.spread);
    return checker;
  }

  async function updateWager(inWager)
  {
    fetch(hostname + '/updateWagerStatus',{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inWager)
  })
  }

  function tester(wager) {
    const today = new Date();
    if (wager.status === RESULT.WIN)
    {
      return "Win";
    }
    else if (wager.status === RESULT.LOSS)
    {
      return "Loss";
    }
    else if (wager.status === RESULT.PUSH)
    {
      return "Push";
    }
    else if (wager.status === RESULT.PENDING && today < wager.wagerDate)
    {
      getResult(wager).then((result) => { 
        if (result === RESULT.WIN)
        {
          wager.status = RESULT.WIN;
          updateWager(wager);
          updateActiveBalance(wager.wagerAmount + wager.payout);
        }
        else if (result === RESULT.LOSS)
        {
          wager.status = RESULT.LOSS;
          updateWager(wager);
          updateActiveBalance(wager.wagerAmount + wager.payout);
        }
        else if (result === RESULT.PUSH)
        {
          wager.status = RESULT.PUSH;
          updateActiveBalance(wager.wagerAmount);
        }
      }).catch((error) => console.log(error));
    }
    else
    {
      return "Pending";  
    }
  }






  return (
    <div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deposit Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={newDeposit}>

            <Form.Group controlId="FormDepositAmount">
              <Form.Label>Deposit Amount ($)</Form.Label>
              <Form.Control
                type="text"
                placeholder="DepositAmount"
                value={DespoitAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
              />
            </Form.Group>
            <div className="mt-2">
              <Button variant="secondary" type="submit" block style={{ width: '100%' }}  >
                Deposit
              </Button>
            </div>

          </Form>
        </Modal.Body>
      </Modal>
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Card style={{ width: '100%', maxWidth: '500px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Account Information</h2>

            <Row>
              <Col xs={12}>
                <Card.Title>Username</Card.Title>
                <p>{activeUser}</p>
              </Col>
              <Col xs={12}>
                <Card.Title>Account Balance</Card.Title>
                <p>${currentBalance}</p>
                <Button className="mb-2" variant="secondary" type="submit" block style={{ width: '100%' }} onClick={() => setShowModal(true)}>
                  Deposit Funds
                </Button>
                <Button variant="secondary" type="submit" block style={{ width: '100%' }}>
                  Logout
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      <Container className="mt-4">
        <Card>
          <Card.Body>
            <h4 className="text-center mb-4">Wagers</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Game Time</th>
                  <th>Team</th>
                  <th>Spread</th>
                  <th>Wager</th>
                  <th>Payout</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {activeWagers.map((wager, index) => {
                  return (
                    <tr >
                      <td>{displayDate(wager.wagerDate)}</td>
                      <td>{wager.team}</td>
                      <td>{(wager.spread > 0 ? "+" + wager.spread : wager.spread)}</td>
                      <td>${wager.wagerAmount.toFixed(2)}</td>
                      <td>${wager.payout.toFixed(2)}</td>
                      <td>
                        {tester(wager)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

    </div>

  );
};

export default AccountPage;
