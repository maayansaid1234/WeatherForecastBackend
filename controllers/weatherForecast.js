import axios from 'axios';

async function getForecast(req, res) {
  const { city } = req.params;
  const apiKey = process.env.WEATHER_API_SECRET_KEY;

  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&aqi=no&alerts=no`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    
    // Get the local time of the city
    const localTime = new Date(data.location.localtime);
    const currentHour = localTime.getHours();

    // Function to get the correct hour, considering day changes
    const getHourData = (hourOffset) => {
      let targetDate = new Date(localTime);
      targetDate.setHours(currentHour + hourOffset, 0, 0, 0);

      const dayIndex = targetDate.getDate() === localTime.getDate() ? 0 : 1;
      const hourData = data.forecast.forecastday[dayIndex].hour[targetDate.getHours()];

      return {
        time: targetDate.getHours().toString().padStart(2, '0') + ':00',
        temp: Math.round(hourData.temp_c),
        dateTime: targetDate.toISOString()
      };
    };

    const hourlyForecast = [
      getHourData(-3),
      getHourData(-2),
      getHourData(-1),
      getHourData(0),
      getHourData(1)
    ];

    localTime.setMinutes(0);
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