import axios from 'axios';

async function getForecast(req, res) {
  const { city } = req.params;
  const apiKey = process.env.WEATHER_API_SECRET_KEY;
  const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&aqi=no&alerts=no`;

  try {
    // Fetch forecast data
    let response = await axios.get(forecastUrl);
    const data = response.data;

    // Get the local time of the city
    const localTime = new Date(data.location.localtime);
    const currentHour = localTime.getHours();
    let previousDayData = null;

    // Check if we need previous day's data
    if (currentHour <= 2) {
      const previousDayStr =`${localTime.getFullYear()}-${localTime.getMonth()}-${localTime.getDate()-1}`;
      const historyUrl = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${previousDayStr}`;
      const previousResponse = await axios.get(historyUrl);
      previousDayData = previousResponse.data;
    }

    // Function to get the correct hour, considering day changes
    const getHourData = (date, hourOffset) => {
      let targetDate = new Date(date);
      targetDate.setHours(date.getHours() + hourOffset, 0, 0, 0);

      let dayData = data.forecast.forecastday[0]; // Default to today's data
      if (targetDate.getDate() === date.getDate() - 1) {
        // Previous day data
        if (previousDayData) {
          console.log("previous")
          dayData = previousDayData.forecast.forecastday[0];
        }
      } else if (targetDate.getDate() === date.getDate() + 1) {
        // Next day data (tomorrow)
        console.log("tomorrow")
        dayData = data.forecast.forecastday[1];
      }

      const hourData = dayData.hour[targetDate.getHours()];

      return {
        time: targetDate.getHours().toString().padStart(2, '0') + ':00',
        temp: Math.round(hourData.temp_c),
       
      };
    };

    // Prepare the hourly forecast, considering past, current, and future hours
    const hourlyForecast = [
      getHourData(localTime, -3),
      getHourData(localTime, -2),
      getHourData(localTime, -1),
      getHourData(localTime, 0),
      getHourData(localTime, 1)
    ];

    // Compile weather info
    const weatherInfo = {
      city: data.location.name,
      country: data.location.country,
      date: localTime,
      latitude: data.location.lat,
      longitude: data.location.lon,
      temperature: Math.round(data.current.temp_c),
      condition: data.current.condition.text.toLowerCase(),
      precipitation: data.current.precip_mm,
      humidity: data.current.humidity,
      wind: Math.round(data.current.wind_kph),
      hourlyForecast: hourlyForecast
    };

    res.status(200).json(weatherInfo);
  } catch (error) {
    console.error('Error in getForecast:', error);
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 404) {
        res.status(400).json('Error: The city is missing or incorrectly entered.');
      } else {
        res.status(500).json('Error: There was an issue with the request on the external API.');
      }
    } else if (error.request) {
      res.status(503).json('Error: There was a server-side issue on our end.');
    } else {
      res.status(500).json('Error: Internal Server Error.');
    }
  }
}

export { getForecast };
