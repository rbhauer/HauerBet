import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import NavHeader from './NavHeader';
import FixtureHandler from './FixtureHandler';
import LoginPage from './LoginPage';
import AccountPage from './AccountPage';
import { fetchActiveBalance } from './UserUtility';
import { useState,useEffect } from 'react';

function App() {

  const [currentBalanceMain, setCurrentBalanceMain] = useState(' N/A');

  useEffect(() => {
       getNavBalance()
   },[currentBalanceMain]);

 async function getNavBalance()
 {
       const currentBalanceData = await fetchActiveBalance();
       if (currentBalanceData >= 0)
         {
           setCurrentBalanceMain("$" + currentBalanceData.toFixed(2));
         }
         else
         {
           setCurrentBalanceMain('N/A');
         }
 }

  return (
    <Router>
      <NavHeader currentBalance = {currentBalanceMain}/>
        <Routes>
          <Route exact path="/" element={<FixtureHandler setCurrentBalanceHandler={setCurrentBalanceMain} league={"NFL"} />}></Route>
          <Route path="/account" element={<AccountPage />}></Route>
          <Route path="/login" element={<LoginPage currentBalance_Login={setCurrentBalanceMain}/>}></Route>
          <Route exact path="/NBA" element={<FixtureHandler setCurrentBalanceHandler={setCurrentBalanceMain} league={"NBA"} />}></Route>
          <Route exact path="/NFL" element={<FixtureHandler setCurrentBalanceHandler={setCurrentBalanceMain} league={"NFL"} />}></Route>
        </Routes>
    </Router>
  );
}

export default App;

