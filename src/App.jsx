import { useState, useEffect } from "react";
import contries from "./constants/contries";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const [countries, setCountries] = useState(contries);

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
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterCountries = () => {
      if (city.trim() === "") {
        setCountries(contries); // Reset to original list if input is empty
      } else {
        const filteredCountries = contries.filter(country =>
          country.value.toLowerCase().includes(city.toLowerCase())
        );
        setCountries(filteredCountries);
      }
    };
    filterCountries();
  }, [city]);

  return (
    <>
      <div className="container">
        <div className="ipContainer" style={{ position: "relative" }}>
          <input
            type="text"
            className="ip"
            placeholder="Enter city"
            value={city}
            onClick={() => setShowCountries(true)}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="bt" onClick={()=>{
            searchWeather()
            setShowCountries(false)
          }}>
            Search
          </button>
          {showCountries && (
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "97.8%",
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                borderCollapse: "collapse",
                color: "black",
                maxHeight: "120px",
                height: "auto",
                overflowY: "scroll",
                top: 75,
                right: 0
              }}
            >
              {countries.length > 0 ? (
                countries.map((country, index) => (
                  <p
                    key={index}
                    style={{
                      margin: 0,
                      padding: "5px 0px",
                      borderBottom: "1px solid gray",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "gray";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "white";
                    }}
                    onClick={() => {
                      setShowCountries(false);
                      setCity(country.value);
                    }}
                  >
                    {country.value}
                  </p>
                ))
              ) : (
                <p style={{textAlign:'center'}}>No matching countries Please enter city manually </p>
              )}
            </div>
          )}
        </div>
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          {invalid}
        </p>
        <div>
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : (
            invalid.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  border: "1px solid white",
                  marginTop: "15px"
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
