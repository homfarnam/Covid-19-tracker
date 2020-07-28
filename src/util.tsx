import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const casesTypeColors = {
  cases: {
    hex: "#cc1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#afb4443",
    multiplier: 2000,
  },
};

export const sortData = (data: any) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const prettyProntStat = (stat: any) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

type CaseTypes = 'cases' | 'recovered' | 'deaths'

type showDataOnMap = {
  casesType: CaseTypes;
};

type casesColors = {
  [key in CaseTypes]: {
    hex: string;
    multiplier: number;
  };
};

// draw circles on the map with interactive tooltip
export const showDataOnMap = (data: any, casesType = "cases"): showDataOnMap =>
  data.map(
    (country: {
      cases: number;
      recovered: number;
      deaths: number;
      country: string;
      countryInfo: { lat: number; long: number; flag: string };
    }) => (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
      >
        <Popup>
          <div className="info-container">
            <div
              className="info-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            />
            <div className="info-name">{country.country}</div>
            <div className="info-confirmed">
              Cases: {numeral(country.cases).format("0,0")}
            </div>
            <div className="info-recovered">
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>
            <div className="info-deaths">
              Deaths: {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    )
  );
