import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "../../util";

type MapProps = {
    casesType:string,
    center:undefined,
    zoom:number,
    countries:object
};

const Map = ({ countries, casesType, center, zoom }:MapProps) => {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=" &copy <a href='http://osm.org/copyright'> Openstreet Map </a> contributors"
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
};

export default Map;
