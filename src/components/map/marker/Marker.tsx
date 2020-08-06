import React from 'react'
import { Circle, Popup } from 'react-leaflet'
import numeral from 'numeral'
import { DiseaseInfo, CaseTypes } from '../../../@types/types'

type showDataOnMap = {
  casesType: CaseTypes
}

type casesColors = {
  [key in CaseTypes]: {
    hex: string
    multiplier: number
  }
}
const casesTypeColors: casesColors = {
  cases: {
    hex: '#cc1034',
    multiplier: 800,
  },
  recovered: {
    hex: '#7dd71d',
    multiplier: 1200,
  },
  deaths: {
    hex: '#afb4443',
    multiplier: 2000,
  },
}

interface MarkerProps {
  diseaseInfo: DiseaseInfo
  casesType?: CaseTypes
}

export const Marker: React.FC<MarkerProps> = ({
  diseaseInfo,
  casesType = 'cases',
}) => (
  <Circle
    center={[diseaseInfo.countryInfo.lat, diseaseInfo.countryInfo.long]}
    fillOpacity={0.4}
    color={casesTypeColors[casesType].hex}
    fillColor={casesTypeColors[casesType].hex}
    radius={
      Math.sqrt(diseaseInfo[casesType]) * casesTypeColors[casesType].multiplier
    }
  >
    <Popup>
      <div className="info-container">
        <div
          className="info-flag"
          style={{ backgroundImage: `url(${diseaseInfo.countryInfo.flag})` }}
        />
        <div className="info-name">{diseaseInfo.country}</div>
        <div className="info-confirmed">
          Cases: {numeral(diseaseInfo.cases).format('0,0')}
        </div>
        <div className="info-recovered">
          Recovered: {numeral(diseaseInfo.recovered).format('0,0')}
        </div>
        <div className="info-deaths">
          Deaths: {numeral(diseaseInfo.deaths).format('0,0')}
        </div>
      </div>
    </Popup>
  </Circle>
)
