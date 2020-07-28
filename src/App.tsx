import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBoxes from "./components/infoBox/InfoBoxes";
import Map from "./components/map/Map";
import Table from "./components/table/Table";
import { sortData, prettyProntStat } from "./util";
import LineGraph from "./components/lineGraph/LineGraph";
import "leaflet/dist/leaflet.css";

const App = () => {
  type mapcenter = {
    lat: number;
    lng: number;
    long?: number;
    data?: {
      countryInfo: {
        lat: number;
        long: number;
      };
    };
  };

  type country = {
    country: string;
  };

  type countries = any[]
  
  type countryinfo = {
    todayRecovered: number;
    recovered: number;
    deaths: number;
    todayDeaths: number;
    todayCases: number;
    countryInfo: object;
    cases: any;
  };

  type mapCountries= any[]

  const [countries, setCountries] = useState<countries>([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState<Partial<countryinfo>>({});
  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState<mapcenter>({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map(
            (country: { country: object; countryInfo: { iso2: object } }) => ({
              name: country.country, // United States , United Knigdom , ...
              value: country.countryInfo.iso2, // US , UK , FR , ...
            })
          );
          const sortedData: any = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event: { target: { value: any } }) => {
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
        setMapCenter((prevState)=>({...prevState,lat: data.countryInfo.lat, long:data.countryInfo.long}));
        setMapZoom(4);
      });
  };

  console.log("country info:", countryInfo);
  console.log(tableData);

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
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries?.map(
                (country: {
                  value: string | number | readonly string[] | undefined;
                  name: React.ReactNode;
                }) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBoxes
            isRed
            active={casesType === "cases"}
            onClick={() =>
              setCasesType("cases")
            }
            title="Coronavirus cases"
            cases={prettyProntStat(countryInfo.todayCases)}
            total={prettyProntStat(countryInfo.cases)}
          />
          <InfoBoxes
            active={casesType === "recovered"}
            onClick={() => setCasesType("recovered")}
            title="Recovered"
            cases={prettyProntStat(countryInfo.todayRecovered)}
            total={prettyProntStat(countryInfo.recovered)}
          />
          <InfoBoxes
            isRed
            active={casesType === "deaths"}
            onClick={() =>
              setCasesType("deaths")
            }
            title="Deaths"
            cases={prettyProntStat(countryInfo.todayDeaths)}
            total={prettyProntStat(countryInfo.deaths)}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={[mapCenter.lat,mapCenter.lng]}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Wordwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
