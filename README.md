# Weather Forecast Application - Server Side

This is the server-side component of a weather forecast application using Node.js and Express. The application communicates with WeatherAPI to fetch current weather data.

## Prerequisites

- Node.js 
- npm (Node.js package manager)
- API key from [WeatherAPI](https://www.weatherapi.com/)

## Installation

1. Clone the repository:
   git clone https://github.com/maayansaid1234/WeatherForecastBackend
   

2. Install dependencies:
   npm install

3. Create a `.env` file in the project directory and add your API key:
   WEATHER_API_SECRET_KEY=your_api_key_here
   PORT=3500

## Running the Application

To start the server, run the following command:

node index.js

The server will start running at `http://localhost:3500`.

## Endpoints

- `GET /api/weatherforecast/:city` - Get weather data for a specific city
  - Parameter: `city` (name of the city)
  - Response: JSON with weather data

## Technologies

- Node.js
- Express
- Axios (for making HTTP requests to WeatherAPI)
- dotenv (for managing environment variables)

## Notes

- Ensure you have a valid API key from WeatherAPI before running the application.


