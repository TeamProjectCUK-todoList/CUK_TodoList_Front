import React, { useEffect, useState } from 'react';
import './Weather.css';
import ClearIcon from '../images/clear.png';
import CloudsIcon from '../images/clouds.png';
import DrizzleIcon from '../images/drizzle.png';
import RainIcon from '../images/rain.png';
import SnowIcon from '../images/snow.png';
import MistIcon from '../images/mist.png';

const API_KEY = "00e402a729853e0147ec626cf3f2a7ed";

const Weather = () => {
  const [weatherData, setWeatherData] = useState({ weather: "", temp: "", city: "" });
  const [error, setError] = useState(null);
  const [backgroundStyle, setBackgroundStyle] = useState({});

  useEffect(() => {
    const onGeoOk = (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const weather = data.weather[0].main;
          setWeatherData({
            weather: weather,
            temp: data.main.temp,
            city: data.name
          });
          setBackgroundStyle(getBackgroundStyle(weather));
        })
        .catch(err => {
          console.error("Error fetching weather data: ", err);
          setError("Error fetching weather data");
        });
    };

    const onGeoError = () => {
      setError("Can't find you. No weather for you..ㅠ");
    };

    navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
  }, []);

  const getWeatherIcon = (weather) => {
    switch(weather) {
      case 'Clear':
        return ClearIcon;
      case 'Clouds':
        return CloudsIcon;
      case 'Drizzle':
        return DrizzleIcon;
      case 'Rain':
      case 'Thunderstorm':
        return RainIcon;
      case 'Snow':
        return SnowIcon;
      case 'Atmosphere':
      default:
        return MistIcon;
    }
  };

  const getBackgroundStyle = (weather) => {
    switch(weather) {
      case 'Clear':
      case 'Clouds':
      case 'Atmosphere':
        return { background: 'linear-gradient(to right, #99CCE4, #6699CC)' };
      case 'Drizzle':
      case 'Rain':
      case 'Thunderstorm':
      case 'Snow':
        return { background: 'linear-gradient(to right, #AEBBC7, #6E7F8D)' };
      default:
        return { background: 'linear-gradient(to right, #99CCE4, #6699CC)' };
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="weather-container" style={backgroundStyle}>
      <img src={getWeatherIcon(weatherData.weather)} alt={weatherData.weather} className="weather-icon" />
      <span className="temp">{weatherData.temp}°C</span>
      <span className="city">{weatherData.city}</span>
    </div>
  );
};

export default Weather;