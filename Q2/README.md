# Average Calculator HTTP Microservice

A simple microservice that calculates averages of numbers based on different categories (prime, fibonacci, even, and random) using a sliding window approach.

## Features

- REST API endpoint for different number types
- Sliding window implementation with configurable size
- Automatic fetching from third-party server
- Duplicate number handling
- Timeout handling (500ms)
- Average calculation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will start on port 3000 by default.

## API Usage

### Endpoint
```
GET /numbers/{numberId}
```

### Valid numberId values:
- `p`: Prime numbers
- `f`: Fibonacci numbers
- `e`: Even numbers
- `r`: Random numbers

### Response Format
```json
{
    "windowPrevState": [], // Previous state of the window
    "windowCurrState": [], // Current state of the window
    "numbers": [], // Numbers received from the third-party server
    "avg": "0.00" // Average of current window numbers
}
```

## Example Request
```bash
curl http://localhost:3000/numbers/p
``` 