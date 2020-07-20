import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import axios from "axios";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country , setCountry] = useState('Worldwide')

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

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value
    console.log(countryCode);
    setCountry(countryCode)
  }

  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 Tracker</h1>

        <FormControl className="app__dropdown">
          <Select onChange={onCountryChange} variant="outlined" value={country}>
            <MenuItem value='worldwide'>Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* header */}

      {/*  Title + select input dropdown field */}

      {/* Info Boxes  */}
      {/* Info Boxes  */}
      {/* Info Boxes  */}

      {/* table */}
      {/* Graph */}

      {/* map */}
    </div>
  );
}

export default App;
