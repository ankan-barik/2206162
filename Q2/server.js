const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const WINDOW_SIZE = 10;

// Store numbers for each type
const numberStore = {
    p: [], // prime
    f: [], // fibonacci
    e: [], // even
    r: []  // random
};

// API endpoint mapping
const API_ENDPOINTS = {
    p: 'http://20.244.56.144/evaluation-service/primes',
    f: 'http://20.244.56.144/evaluation-service/fibo',
    e: 'http://20.244.56.144/evaluation-service/even',
    r: 'http://20.244.56.144/evaluation-service/rand'
};

// Bearer token for authentication
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAyMzE0LCJpYXQiOjE3NDM2MDIwMTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM0YTgwYTNjLWJjYjktNDA4Zi1hYzc5LWNiNTMzMTg0NGU2MiIsInN1YiI6IjIyMDYxNjJAa2lpdC5hYy5pbiJ9LCJlbWFpbCI6IjIyMDYxNjJAa2lpdC5hYy5pbiIsIm5hbWUiOiJhbmthbiBiYXJpayIsInJvbGxObyI6IjIyMDYxNjIiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiJjNGE4MGEzYy1iY2I5LTQwOGYtYWM3OS1jYjUzMzE4NDRlNjIiLCJjbGllbnRTZWNyZXQiOiJaR0hxcnpEWEZmRXZWTlh1In0.SPDLTHKmEMeBoewk23GCe3ZepVQQ0hBG7r_6EfBRDYU";

app.use(cors());
app.use(express.json());

// Helper function to calculate average
const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return (sum / numbers.length).toFixed(2);
};

// Helper function to fetch numbers from third-party server
const fetchNumbers = async (numberId) => {
    try {
        console.log(`Fetching from: ${API_ENDPOINTS[numberId]}`);
        const response = await axios({
            method: 'get',
            url: API_ENDPOINTS[numberId],
            timeout: 500,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${BEARER_TOKEN}`
            }
        });
        
        if (response.data && Array.isArray(response.data.numbers)) {
            return response.data.numbers;
        } else {
            console.error(`Invalid response format for ${numberId}:`, response.data);
            return [];
        }
    } catch (error) {
        if (error.response) {
            console.error(`Error response from server for ${numberId}:`, {
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            console.error(`No response received for ${numberId}:`, error.request);
        } else {
            console.error(`Error setting up request for ${numberId}:`, error.message);
        }
        return [];
    }
};

// Main endpoint
app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;
    
    // Validate numberId
    if (!['p', 'f', 'e', 'r'].includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    // Store previous state
    const windowPrevState = [...numberStore[numberId]];

    // Fetch new numbers
    const newNumbers = await fetchNumbers(numberId);
    
    // Add new numbers to store, maintaining uniqueness and window size
    for (const num of newNumbers) {
        if (!numberStore[numberId].includes(num)) {
            numberStore[numberId].push(num);
            if (numberStore[numberId].length > WINDOW_SIZE) {
                numberStore[numberId].shift(); // Remove oldest number
            }
        }
    }

    // Prepare response
    const response = {
        windowPrevState,
        windowCurrState: numberStore[numberId],
        numbers: newNumbers,
        avg: calculateAverage(numberStore[numberId])
    };

    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 