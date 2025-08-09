import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import NavHeader from './NavHeader';
import FixtureBox from './FixtureBox';
import { useState, useEffect } from 'react';
import App from './App';
import axios from 'axios';
import FixtureSubNavBar from './FixtureSubNavBar';



function FixtureHandler({setCurrentBalanceHandler, league}) {

  const [fixtures, setFixtures] = useState([]);
  const hostname = 'http://127.0.0.1:5298';
  const inData = [];

  

  

  async function fetchFixturesDB() {
    try {
      
      const response = await fetch(hostname + '/getFixtures');
      const data = await response.json();
      setFixtures(data);
      //console.log(data);
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    }
  }

  async function resetFixtures() {
    try {
      const response = await fetch(hostname + '/ResetFixtureInfo');
      const data = await response.json();
      setFixtures(data);
    } catch (error) {
      console.error('Error reseting fixtures:', error);
    }
  }

  function fetchFixturesTheOddsAPI()
  {
    let leagueString = '';

    switch (league) {

      case "NBA":
        leagueString = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds';
        break;  
      case "NFL":
        leagueString = 'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds';
        break;
        default:
        console.error("Sport not supported");
    }
  console.log(process.env.REACT_APP_ODDS_API_KEY);
axios.get(leagueString, {
      params: {
        apiKey:  process.env.REACT_APP_ODDS_API_KEY,  //environment variable for secrecy
        regions: 'us',
        markets: 'spreads',
        oddsFormat: 'american'
      }
  })
  .then(response => {
      processData(response.data);
      console.log(response.headers);
  })
  .catch(error => {
      console.log('Error status', error.response.status)
      console.log(error.response.data)
  })
  }



/*   function getSports()
  {
    axios.get('https://api.the-odds-api.com/v4/sports', {
      params: {
          apiKey
      }
  })
  .then(response => {
      console.log(response.data)
  })
  .catch(error => {
      console.log('Error status', error.response.status)
      console.log(error.response.data)
  })
  } */

  function processData(data)
  {

    resetFixtures();

    data.forEach(game => {
      const fixture = {};
      const dk_check = game.bookmakers.filter(book => book.key === 'draftkings');
      if (dk_check.length > 0)
      {
      fixture.Id = -1;
      fixture.fixtureID = game.id;
      fixture.homeTeam = game.home_team;
      fixture.awayTeam = game.away_team;
    
      const homeArray = dk_check[0].markets[0].outcomes.filter(side => side.name === game.home_team);
      const awayArray = dk_check[0].markets[0].outcomes.filter(side => side.name === game.away_team);
      fixture.homeLine = homeArray[0].point;
      fixture.awayLine = awayArray[0].point;
      fixture.homeVig = homeArray[0].price;
      fixture.awayVig = awayArray[0].price;

      fixture.fixtureDate = game.commence_time;

      fixture.league = league; // Set the league based on the passed prop

      inData.push(fixture);
      
      fetch(hostname + '/addFixtures',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fixture)})
      }
      
    })
    setFixtures(inData); 
  }

  // Fetch fixtures from the server when the component mounts
  useEffect(() => {
      fetchFixturesDB();
    
  }, []);


  return (
    <Container>
      <Row>
        <FixtureSubNavBar></FixtureSubNavBar>
      </Row>

      <Row>
        <Col >
        
        </Col>
        <Col md="auto">
          {fixtures.filter((item) => item.league === league).length === 0 ? 
          <Container className="border rounded p-4 text-center mt-4" style={{ borderColor: '#d3d3d3' }}>
      <h5 className="text-muted">There are no {league} games scheduled</h5>
    </Container>
          :
           fixtures.filter((item) => item.league === league).sort((a,b) => (a.fixtureDate - b.fixtureDate)).map((item, i) => (
            <FixtureBox 
              key = {i}
              homeTeam={item.homeTeam}
              awayTeam={item.awayTeam}
              homeVig={item.homeVig}
              awayVig={item.awayVig}
              homeLine={item.homeLine}
              awayLine={item.awayLine}
              fixtureID={item.fixtureID}
              inDate={item.fixtureDate} 
              setCurrentBalanceBox={setCurrentBalanceHandler}
              league = {item.league}
              />
          ))}
        </Col>
        <Col>
        <div className="text-center"> 
        <Button className="btn btn-secondary mt-4" onClick={() => fetchFixturesTheOddsAPI()}  >
                                Refresh Games</Button>
                                </div>
        </Col>
      </Row>
    </Container>
  );
}

export default FixtureHandler;