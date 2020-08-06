import React from 'react'
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { Marker } from './marker/Marker'
import { CaseTypes, DiseaseInfo } from '../../@types/types'
import './Map.css'

interface MapProps {
  casesType: CaseTypes
  center: [number, number]
  zoom: number
  diseaseData?: DiseaseInfo[]
}

const Map: React.FC<MapProps> = ({ diseaseData, casesType, center, zoom }) => (
  <div className="map">
    <LeafletMap center={center} zoom={zoom}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=" &copy <a href='http://osm.org/copyright'> Openstreet Map </a> contributors"
      />
      {diseaseData?.map((diseaseInfo) => (
        <Marker
          key={diseaseInfo.country}
          diseaseInfo={diseaseInfo}
          casesType={casesType}
        />
      ))}
    </LeafletMap>
  </div>
)

export default Map
