const hostname = 'http://127.0.0.1:5298';

export async function fetchActiveUser() {
    try {
      const response = await fetch(hostname + '/getActiveUsername');
      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  }

  export async function fetchActiveBalance() {
    try {
      const response = await fetch(hostname + '/getActiveBalance');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  export async function updateActiveBalance(balAdjustment)
  {
    const newBalance =
    {
      realBalance: balAdjustment
    };
    fetch(hostname + '/depositFunds', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBalance)
    })
  }

   
