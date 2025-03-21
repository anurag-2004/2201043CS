# Average Calculator Microservice

A REST API microservice that calculates the average of qualified numbers retrieved from a third-party server.

## Features

- Exposes a REST API endpoint `/numbers/{numberid}` to fetch and calculate averages
- Supports qualified number IDs:
  - `p` for prime numbers
  - `f` for Fibonacci numbers
  - `e` for even numbers
  - `r` for random numbers
- Maintains a configurable window size (default: 10)
- Ensures each response is delivered within 500ms
- Handles errors and timeouts gracefully
- Stores unique numbers and calculates their average

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

Set the following environment variables for API authentication:

```bash
COMPANY_NAME=
CLIENT_ID=
CLIENT_SECRET=
OWNER_NAME=
OWNER_EMAIL=
ROLL_NO=
```

Additional configuration options can be modified in `config/config.js`.

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Get Numbers

```
GET /numbers/{numberid}
```

Where `numberid` can be:
- `p` for prime numbers
- `f` for Fibonacci numbers
- `e` for even numbers
- `r` for random numbers

#### Response Format

```json
{
  "windowPrevState": [2, 4, 6, 8],
  "windowCurrState": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  "numbers": [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  "avg": 11.00
}
```

### Health Check

```
GET /health
```

## Project Structure

```
/
├── app.js                  # Application entry point
├── package.json            # Project dependencies
├── controllers/             
│   └── numberController.js # Request handlers
├── services/
│   └── numberService.js    # Business logic
└── config/
    └── config.js           # Configuration settings
```

## How It Works

1. The service fetches numbers from a third-party API based on the specified type
2. It stores unique numbers in a window (max size: 10)
3. When the window size is exceeded, the oldest number is replaced with the newest one
4. For each request, it returns:
   - Previous window state
   - Current window state
   - Numbers received from the third-party server
   - Average of numbers in the current window

## Error Handling

- Requests to the third-party API that exceed 500ms are terminated
- API errors are handled gracefully without affecting the service
- Invalid number types return appropriate error messages

## Performance

- Optimized for quick responses (under 500ms)
- Efficient window management with O(1) lookup for duplicates
- Token caching to minimize authentication requests
