import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState("");

  const searchWeather = async () => {
    try {
      setLoading(true);
      setInvalid("");
      const resp = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${
          import.meta.env.VITE_API_KEY
        }&q=${city || "islamabad"}&aqi=no`
      );
      if (!resp.ok) {
        setInvalid("Invalid city");
        return;
      }
      const data = await resp.json();
      setWeatherData(data);
      console.log(weatherData);
      console.log(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  useEffect(() => {
    searchWeather();
  }, []);

  getLocation();
  return (
    <>
    <div className="container">
      <div className="ipContainer">
        <input
          type="text"
          className="ip"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="bt" onClick={searchWeather}>
          Search
        </button>
      </div>
      <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          {invalid}
        </p>
      <div>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          invalid.length == 0 && (
            <div
              style={{
                textAlign: "center",
                border: "1px solid white",
                marginTop: "15px",
              }}
            >
              <p>City Name : {weatherData?.location?.name}</p>
              <p>Region : {weatherData?.location?.region}</p>
              <p>Temperature : {weatherData?.current?.temp_c} C</p>
              <p>Weather : {weatherData?.current?.condition.text}</p>
              <p>Wind : {weatherData?.current?.wind_kph} kph</p>
            </div>
          )
        )}
      </div>
    </div>
    </>
  );
}

export default App;
