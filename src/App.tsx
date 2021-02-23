import React, { useState, useEffect } from 'react'
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core'
import InfoBoxes from './components/infoBox/InfoBoxes'
import Map from './components/map/Map'
import Table from './components/table/Table'
import { sortData, prettyProntStat } from './components/map/marker/Util'
import LineGraph from './components/lineGraph/LineGraph'
import Footer from './components/footer/Footer'
import {
  CountryCode,
  Mapcenter,
  DiseaseInfo,
  CaseTypes,
  CountryCasesInfo,
} from './@types/types'
import './App.css'
import 'leaflet/dist/leaflet.css'

interface AppProps {}

interface GeneralInfoState {
  countriesCases: CountryCasesInfo[]
  diseaseData: DiseaseInfo[]
  countryCodes: CountryCode[]
}

interface MapInfoState {
  country: string
  mapCenter: Mapcenter
  mapZoom: number
  casesType: CaseTypes
}

const App: React.FC<AppProps> = () => {
  const [diseaseInfo, setDiseaseInfo] = useState<Partial<DiseaseInfo>>({})
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoState>()
  const [mapInfo, setMapInfo] = useState<MapInfoState>({
    country: 'Worldwide',
    mapCenter: {
      lat: 34.80746,
      lng: -40.4796,
    },
    mapZoom: 3,
    casesType: 'cases',
  })

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((res) => res.json())
      .then((data) => {
        setDiseaseInfo(data)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((diseaseData) => {
          const countryCodes = diseaseData.map(
            (country: { country: string; countryInfo: { iso2: string } }) => ({
              name: country.country, // United States , United Knigdom , ...
              value: country.countryInfo.iso2, // US , UK , FR , ...
            }),
          )
          const countriesCases = sortData(diseaseData)

          setGeneralInfo({
            countriesCases,
            countryCodes,
            diseaseData,
          })
        })
        .catch((err) => console.log(err))
    }
    getCountriesData()
  }, [])

  const onCountryChange = async (event: { target: { value: any } }) => {
    const countryCode = event.target.value as string
    setMapInfo((prev) => ({ ...prev, countryCode }))

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDiseaseInfo(data)

        const mapCenter =
          countryCode === 'worldwide'
            ? { lat: 34.80746, lng: -40.4796 }
            : { lat: data.countryInfo.lat, lng: data.countryInfo.long }

        setMapInfo({
          country: countryCode,
          mapCenter,
          mapZoom: 3,
          casesType: 'cases',
        })
      })
      .catch((err) => console.log(err))
  }

  const changeCaseType = (casesType: CaseTypes) => {
    setMapInfo((prev) => ({ ...prev, casesType }))
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>

          <FormControl className="app__dropdown">
            <Select
              onChange={onCountryChange}
              variant="outlined"
              value={mapInfo.country}
            >
              {/* <MenuItem value="Worldwide">Worldwide</MenuItem> */}
              {generalInfo?.countryCodes.map((countryCode) => (
                <MenuItem value={countryCode.value}>
                  {countryCode.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBoxes
            isRed
            active={mapInfo.casesType === 'cases'}
            onClick={() => changeCaseType('cases')}
            title="Coronavirus cases"
            cases={prettyProntStat(diseaseInfo.todayCases)}
            total={prettyProntStat(diseaseInfo.cases)}
          />
          <InfoBoxes
            active={mapInfo.casesType === 'recovered'}
            onClick={() => changeCaseType('recovered')}
            title="Recovered"
            cases={prettyProntStat(diseaseInfo.todayRecovered)}
            total={prettyProntStat(diseaseInfo.recovered)}
          />
          <InfoBoxes
            isRed
            active={mapInfo.casesType === 'deaths'}
            onClick={() => changeCaseType('deaths')}
            title="Deaths"
            cases={prettyProntStat(diseaseInfo.todayDeaths)}
            total={prettyProntStat(diseaseInfo.deaths)}
          />
        </div>

        <Map
          casesType={mapInfo.casesType}
          diseaseData={generalInfo?.diseaseData}
          center={[mapInfo.mapCenter.lat, mapInfo.mapCenter.lng]}
          zoom={mapInfo.mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countriesData={generalInfo?.countriesCases} />
          <h3 className="app__graphTitle">Wordwide new {mapInfo.casesType}</h3>
          <LineGraph className="app__graph" casesType={mapInfo.casesType} />
        </CardContent>
      </Card>

      <div className="footer__section">
        <Footer />
      </div>
    </div>
  )
}

export default App
