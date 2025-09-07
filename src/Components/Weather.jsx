import React from "react";
import "./Weather.css";

const Weather = ({ weather }) => {
  if (!weather) {
    return (
      <div className="weather">
        <p>No data yet. Click a location.</p>
      </div>
    );
  }

  const iconCode = weather.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;

  return (
    <div className="weather">
      <div className="weather_header">
        <h2 className="weather_city">{weather.name}</h2>
        <img
          className="weather_icon"
          src={iconUrl}
          alt={weather.weather[0].description}
        />
      </div>

      <div className="weather_main">
        <p className="weather_temp">{Math.round(weather.main.temp)}°C</p>
        <p className="weather_desc">{weather.weather[0].description}</p>
        <p className="weather_feels">
          Feels like {Math.round(weather.main.feels_like)}°C
        </p>
      </div>

      <div className="weather_details">
        <p>Min: {Math.round(weather.main.temp_min)}°C</p>
        <p>Max: {Math.round(weather.main.temp_max)}°C</p>
        <p>Pressure: {weather.main.pressure} hPa</p>
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind: {weather.wind.speed} m/s, {weather.wind.deg}°</p>
      </div>
    </div>
  );
};

export default Weather;
