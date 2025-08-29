# HIMYM API

A RESTful API for accessing quotes, characters, and episodes from the TV show "How I Met Your Mother". This API provides both public read-only endpoints and private endpoints for adding new content with authentication.

## Features

- **Public Endpoints**: Access quotes, characters, and episodes without authentication
- **Private Endpoints**: Add new quotes and characters with API key authentication
- **Pagination**: All list endpoints support pagination
- **Filtering**: Filter quotes by character and season
- **Random Quotes**: Get random quotes from the entire collection or filtered by character/season
- **MongoDB Integration**: Uses MongoDB for data storage with Mongoose ODM

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **dotenv** - Environment variables management
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd himym
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/himym
API_KEY=your-secret-api-key-here
```

5. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get API Documentation
**GET** `/himym/doc`

Returns a JSON response with a message containing GitHub documentation link.

#### Get All Quotes
**GET** `/himym/quotes`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response:**
```json
{
  "quotes": [
    {
      "id": 1,
      "quote": "Whatever you do in this life, it's not legendary unless your friends are there to see it.",
      "character": {
        "id": 1,
        "name": "Barney Stinson",
        "actor": "Neil Patrick Harris"
      },
      "episode": {
        "season": 4,
        "episode": 8,
        "title": "Woooo!"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false,
    "next": "/himym/quotes?page=2&limit=10",
    "prev": null
  }
}
```

#### Get Random Quote
**GET** `/himym/quotes/random`

**Response:**
```json
{
  "id": 42,
  "quote": "Challenge accepted!",
  "character": {
    "id": 1,
    "name": "Barney Stinson",
    "actor": "Neil Patrick Harris"
  },
  "episode": {
    "season": 5,
    "episode": 3,
    "title": "Robin 101"
  }
}
```

#### Get Quote by ID
**GET** `/himym/quotes/:id`

**Response:**
```json
{
  "id": 1,
  "quote": "Whatever you do in this life, it's not legendary unless your friends are there to see it.",
  "character": {
    "id": 1,
    "name": "Barney Stinson",
    "actor": "Neil Patrick Harris"
  },
  "episode": {
    "season": 4,
    "episode": 8,
    "title": "Woooo!"
  }
}
```

#### Get Quotes by Character
**GET** `/himym/quotes/character/:id`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response:** Same structure as "Get All Quotes" but filtered by character

#### Get Random Quote by Character
**GET** `/himym/quotes/character/:id/random`

**Response:** Single quote object for the specified character

#### Get Quotes by Season
**GET** `/himym/quotes/season/:id`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response:** Same structure as "Get All Quotes" but filtered by season

#### Get Random Quote by Season
**GET** `/himym/quotes/season/:id/random`

**Response:** Single quote object for the specified season

#### Get All Characters
**GET** `/himym/characters`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response:**
```json
{
  "characters": [
    {
      "id": 1,
      "name": "Barney Stinson",
      "actor": "Neil Patrick Harris"
    },
    {
      "id": 2,
      "name": "Ted Mosby",
      "actor": "Josh Radnor"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false,
    "next": null,
    "prev": null
  }
}
```

### Private Endpoints (Require Authentication)

All private endpoints require Bearer token authentication in the Authorization header:
```
Authorization: Bearer your-api-key
```

#### Add New Quote
**POST** `/himym/quotes`

**Headers:**
```
Authorization: Bearer your-api-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "quote": "New quote text here",
  "character": 1,
  "episode": {
    "season": 1,
    "episode": 1,
    "title": "Pilot"
  }
}
```

**Response:**
```json
{
  "id": 101,
  "quote": "New quote text here",
  "character": {
    "id": 1,
    "name": "Barney Stinson",
    "actor": "Neil Patrick Harris"
  },
  "episode": {
    "season": 1,
    "episode": 1,
    "title": "Pilot"
  }
}
```

#### Add New Character
**POST** `/himym/characters`

**Headers:**
```
Authorization: Bearer your-api-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Character Name",
  "actor": "Actor Name"
}
```

**Response:**
```json
{
  "id": 6,
  "name": "Character Name",
  "actor": "Actor Name"
}
```

## Data Models

### Quote Schema
```javascript
{
  id: Number,          // Auto-incremented unique ID
  quote: String,       // The quote text
  character: ObjectId, // Reference to Character
  episode: {           // Embedded episode document
    season: Number,    // Season number (0-9)
    episode: Number,   // Episode number
    title: String      // Episode title
  }
}
```

### Character Schema
```javascript
{
  id: Number,          // Auto-incremented unique ID
  name: String,        // Character name
  actor: String        // Actor name
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid API key)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Validation Rules

### Quote Validation
- Quote text must be a non-empty string
- Character ID must be a valid numeric ID (0-19)
- Episode must have valid season (0-9) and episode numbers
- Episode title must be a non-empty string

### Character Validation
- Character name must be a non-empty string
- Actor name must be a non-empty string

## Usage Examples

### JavaScript Fetch Example
```javascript
// Get random quote
fetch('http://localhost:3000/himym/quotes/random')
  .then(response => response.json())
  .then(data => console.log(data));

// Get quotes by character (Barney Stinson - ID 1)
fetch('http://localhost:3000/himym/quotes/character/1?limit=5')
  .then(response => response.json())
  .then(data => console.log(data));

// Add new quote (requires authentication)
fetch('http://localhost:3000/himym/quotes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quote: "New awesome quote",
    character: 1,
    episode: {
      season: 1,
      episode: 1,
      title: "Pilot"
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Development

The project uses ES6 modules and modern JavaScript features. Key files:

- `index.js` - Main server entry point
- `db/database.js` - MongoDB connection setup
- `himym/models/models.js` - Mongoose schemas and models
- `himym/quotes/public/publicroutes.js` - Public API endpoints
- `himym/quotes/private/privateroutes.js` - Private API endpoints
- `himym/quotes/public/helper.js` - Utility functions
- `himym/quotes/private/validator.js` - Input validation
- `himym/quotes/private/authMiddleware.js` - Authentication middleware

