import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
 
} from "@material-ui/core";
import axios from "axios";
import "./App.css";
import InfoBoxes from "./components/infoBox/InfoBoxes";
import Map from "./components/map/Map";
import Table from './components/table/Table'
import { sortData } from "./util";
import LineGraph from "./components/lineGraph/LineGraph";
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([])
  const [mapCenter,setMapCenter] = useState({
    lat: 34.80746 , lng: -40.4796
  })
  const [mapZoom,setMapZoom] = useState(3)

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
      .then(res=> res.json())
      .then(data=>{
        setCountryInfo(data)
      })
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States , United Knigdom , ...
            value: country.countryInfo.iso2, // US , UK , FR , ...
          }));
          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);



  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  // console.log("country info:", countryInfo);
  // console.log(tableData);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>

          <FormControl className="app__dropdown">
            <Select
              onChange={onCountryChange}
              variant="outlined"
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBoxes
            title="Coronavirus cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBoxes
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBoxes
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map  center={mapCenter} zoom={mapZoom}/>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>Wordwide new cases</h3>
          <LineGraph />
        </CardContent>
        {/* table */}
        {/* Graph */}
      </Card>
    </div>
  );
}

export default App;
