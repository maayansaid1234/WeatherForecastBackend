// import axios from 'axios';


// async function getForecast(req,res) {
//   const {city}=req.params;
//   const apiKey = process.env.WEATHER_API_SECRET_KEY;

//   const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;

//   try {
//     const response = await axios.get(url);
//     const data = response.data;
//     console.log(data)
//     const date=new Date(data.location.localtime);

//     // Get current hour
//     const currentHour = date.getHours();
    

//     // Generate array of 5 hours (3 before, current, 1 after)
//     const hoursToShow = Array.from({length: 5}, (_, i) => (currentHour - 3 + i + 24) % 24);

//      date.setMinutes(0);

//     const weatherInfo = {
//       city: data.location.name,
//       country: data.location.country,
//       date:date ,
//       latitude:data.location.lat,
//       longitude:data.location.lon,
//       temperature: Math.round(data.current.temp_c),
//       condition: data.current.condition.text.toLowerCase(),
//       precipitation: data.current.precip_mm,
//       humidity: data.current.humidity,
//       wind: Math.round(data.current.wind_kph),
//       hourlyForecast: data.forecast.forecastday[0].hour
//         .filter(hour => hoursToShow.includes(new Date(hour.time).getHours()))
//         .map(hour => ({
//           time: new Date(hour.time).getHours().toString().padStart(2, '0') + ':00',
//           temp: Math.round(hour.temp_c)
//         }))

//          .sort((a, b) => {parseInt(a.time) - parseInt(b.time)})
//     };

//     res.status(200).json(weatherInfo);
//   } 
//   catch (error) {
//     if (error.response) {
//       if (error.response.status === 400 || error.response.status === 404) {
//         // The city is missing or incorrectly entered
//         res.status(400).json('Error: The city is missing or incorrectly entered.');
//       } else {
//         // Issue with the external API (WeatherAPI.com)
//         res.status(500).json('Error: There was an issue with the request on the external API.');
//       }
//     } else if (error.request) {
//       // Issue on our server (e.g., network issues)
//       res.status(503).json('Error: There was a server-side issue on our end.');
//     } else {
//       // Other server-side errors
//       res.status(500).json('Error: Internal Server Error.');
//     }
//   }

 
    
  
// }

// export {getForecast};


// import axios from 'axios';

// async function getForecast(req, res) {
//   const { city } = req.params;
//   const apiKey = process.env.WEATHER_API_SECRET_KEY;

//   const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&aqi=no&alerts=no`;

//   try {
//     const response = await axios.get(url);
//     const data = response.data;
//     const date = new Date(data.location.localtime);

//     // Get current hour
//     const currentHour = date.getHours();
 
//     const currentDate = date.getDate();
   
//     // Generate array of 5 hours (3 before, current, 1 after)
//     const hoursToShow = Array.from({ length: 5 }, (_, i) => (currentHour - 3 + i + 24) % 24);

//     // Combine hourly data for today and tomorrow
//     const hourlyData = [
//       ...data.forecast.forecastday[0].hour,
//       ...data.forecast.forecastday[1].hour
//     ];

//     // Calculate the date for the next day
//     const nextDate = new Date(date);
//     nextDate.setDate(currentDate + 1);

//     const weatherInfo = {
//       city: data.location.name,
//       country: data.location.country,
//       date: date,
//       latitude: data.location.lat,
//       longitude: data.location.lon,
//       temperature: Math.round(data.current.temp_c),
//       condition: data.current.condition.text.toLowerCase(),
//       precipitation: data.current.precip_mm,
//       humidity: data.current.humidity,
//       wind: Math.round(data.current.wind_kph),
//       hourlyForecast: hourlyData
//         .filter(hour => {
//           const hourTime = new Date(hour.time).getHours();
//           const hourDate = new Date(hour.time).getDate();
//           const isCurrentDay = hourDate === currentDate;
//           const isNextDay = hourDate === nextDate.getDate();

//           return hoursToShow.includes(hourTime) && (isCurrentDay || isNextDay);
//         })
//         .map(hour => ({
//           time: new Date(hour.time).getHours().toString().padStart(2, '0') + ':00',
//           temp: Math.round(hour.temp_c),
//           dateTime: new Date(hour.time)
//         }))
//         .sort((a, b) => a.dateTime - b.dateTime) // Sort by full DateTime
//     };

//     // If there are still more than 5 results, limit to the first 5
//     if (weatherInfo.hourlyForecast.length > 5) {
//       weatherInfo.hourlyForecast = weatherInfo.hourlyForecast.slice(0, 5);
//     }

//     res.status(200).json(weatherInfo);
//   } catch (error) {
//     if (error.response) {
//       if (error.response.status === 400 || error.response.status === 404) {
//         // The city is missing or incorrectly entered
//         res.status(400).json('Error: The city is missing or incorrectly entered.');
//       } else {
//         // Issue with the external API (WeatherAPI.com)
//         res.status(500).json('Error: There was an issue with the request on the external API.');
//       }
//     } else if (error.request) {
//       // Issue on our server (e.g., network issues)
//       res.status(503).json('Error: There was a server-side issue on our end.');
//     } else {
//       // Other server-side errors
//       res.status(500).json('Error: Internal Server Error.');
//     }
//     console.log(error)
//   }
// }

// export { getForecast };



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