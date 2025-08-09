import React, { useState } from 'react';
import { Form, Button, Card, Container, Modal, NavLink } from 'react-bootstrap';
import { fetchActiveBalance } from './UserUtility';
import { Navigate, useNavigate } from 'react-router-dom';

function LoginPage({currentBalance_Login}) 
{
  const hostname = 'http://127.0.0.1:5298';
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showLoginModal_success, setShowLoginModal_success] = useState(false);
  const [showLoginModal_failure, setShowLoginModal_failure] = useState(false);  

  const navigate = useNavigate();

  // Handle login form submission
  function Authenticate(e)
  {
    e.preventDefault();
      console.log("Authenticate" + username);
      fetch(hostname+'/login',
          {
              method: "POST",
              headers: 
              {
                  "Content-type" : "application/json",
                  "Authorization": "Basic " + btoa(username + ":" + password)
  
              },
              body: JSON.stringify(
                  {
                      userName: username,
                      password: password
                  }
              )
          }
      )
      .then(response => {
          
              if (response.ok) { // Check if response went through
                setActiveUser();
                //currentBalance_Login(fetchActiveBalance());
                setShowLoginModal_success(true);
                setPassword("");
                  return response.text();
              } else {
                console.log("BAD");
                setShowLoginModal_failure(true);
                  throw new Error('Network response was not ok.');
              }
          })
      .then(data => { 
          
              console.log(data);
              let dataObj = JSON.parse(data);
              console.log(dataObj)
              //Cookies.set('auth', data, { expires: 7 }); // The cookie will expire after 7 days
              //Cookies.set('base64', btoa(dataObj.username+":"+dataObj.password), { expires: 7 });
          })
      .catch(error => {
          console.log('There has been a problem with your fetch operation: ', error.message);
          })
  }

  function setActiveUser()
  {
    console.log("POSTING USERNAME " + username);
    fetch(hostname+'/setActiveUser',{
      method: "POST",
      headers: {
          "Content-type" : "application/json",

      },
      body: JSON.stringify(
          {
              username: username,
              password: password,
          }
      )
    })
    newBalanceCheck();
  }

      async function newBalanceCheck()
      {
          const currentBalanceBox = await fetchActiveBalance();
          currentBalance_Login(currentBalanceBox);
      }
  

  
  function NewUser(e){
    //e.preventDefault();

    if (!newUsername || !newPassword) {
        alert('Username and password are required');
        return;
      }
  
      console.log("CHECK");

    fetch(hostname+'/newUser',{
            method: "POST",
            headers: {
                "Content-type" : "application/json",

            },
            body: JSON.stringify(
                {
                    username: newUsername,
                    password: newPassword,
                }
            )
        })
        
  
    setNewUsername("");
    setNewPassword("");
    setShowModal(false); 
}

function successModalHandler()
{
  setShowLoginModal_success(false);
  navigate('/account ');
}



  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={Authenticate}>
            {/* Email input */}
            <Form.Group controlId="formUserName" name="userInput">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>

          
            <Form.Group controlId="formPassword" name="passwordInput">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

           
            <Button className="mt-3" variant="secondary" type="submit" block style={{ width: '100%' }}>
              Login
            </Button>

            
            <div className="text-center mt-3">
              <NavLink
                href="#!"
                onClick={() => setShowModal(true)}
              >
                Create a new HauerBet account
              </NavLink>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create a New HauerBet Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={NewUser}>
           
            <Form.Group controlId="formNewUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formNewPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="mt-2">
            <Button  variant="primary" type="submit" block>
              Create Account
            </Button>
            </div>
           
          </Form>
        </Modal.Body>
      </Modal>

  
      <Modal show={showLoginModal_success} onHide={() => setShowLoginModal_success(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Login Successful!</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You are logged in as {username}. Good luck!</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={()=>successModalHandler()}>Close</Button>
        </Modal.Footer>
      </Modal>
   
      <Modal show={showLoginModal_failure} onHide={() => setShowLoginModal_failure(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Login Failed</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Please try again.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowLoginModal_failure(false)}  >Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoginPage;