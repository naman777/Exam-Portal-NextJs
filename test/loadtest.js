const axios = require('axios');

// Replace with your target URL
const targetUrl = 'http://examportal.acmtiet.com/leaderboard';

const sendRequest = async () => {
    try {
        const response = await axios.get(targetUrl);
        console.log(`Response status: ${response.status}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

// Function to send 200 requests per second
const loadTest = () => {
    const requestsPerSecond = 100;
    const interval = 1000; // 1000 ms = 1 second

    // Set interval to send requests
    setInterval(() => {
        for (let i = 0; i < requestsPerSecond; i++) {
            sendRequest();
        }
    }, interval);
};

// Start the load test
loadTest();
