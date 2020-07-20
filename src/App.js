import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import axios from "axios";
import "./App.css";
import InfoBoxes from "./components/infoBox/InfoBoxes";
import Map from "./components/map/Map";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States , United Knigdom , ...
            value: country.countryInfo.iso2, // US , UK , FR , ...
          }));

          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  };

  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 Tracker</h1>

        <FormControl className="app__dropdown">
          <Select onChange={onCountryChange} variant="outlined" value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        <InfoBoxes title='Coronavirus cases' cases={1500} total={2000} />
        <InfoBoxes title='Recovered' cases={1500} total={4000}/>
        <InfoBoxes title='Deaths' cases={1500} total={3000}/>

      </div>

      {/* table */}
      {/* Graph */}

      {/* map */}
      <Map />
    </div>
  );
}

export default App;
