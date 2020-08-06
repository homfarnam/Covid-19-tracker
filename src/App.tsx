import React, { useState, useEffect } from 'react'
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core'
import './App.css'
import InfoBoxes from './components/infoBox/InfoBoxes'
import Map from './components/map/Map'
import Table from './components/table/Table'
import { sortData, prettyProntStat } from './components/map/marker/Util'
import LineGraph from './components/lineGraph/LineGraph'
import 'leaflet/dist/leaflet.css'
import Footer from './components/footer/Footer'
import {
  CountryCode,
  Mapcenter,
  DiseaseInfo,
  CaseTypes,
  CountryCasesInfo,
} from './@types/types'

interface AppProps {}

interface GeneralInfoState {
  countriesCases: CountryCasesInfo[]
  diseaseData: DiseaseInfo[]
  countryCodes: CountryCode[]
}

const App: React.FC<AppProps> = () => {
  const [diseaseInfo, setDiseaseInfo] = useState<Partial<DiseaseInfo>>({})
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoState>()

  const [country, setCountry] = useState('Worldwide')
  const [mapCenter, setMapCenter] = useState<Mapcenter>({
    lat: 34.80746,
    lng: -40.4796,
  })
  const [mapZoom, setMapZoom] = useState(3)
  const [casesType, setCasesType] = useState('cases')

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
    const countryCode = event.target.value
    setCountry(countryCode)

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode)
        setDiseaseInfo(data)
        setMapCenter((prevState) => ({
          ...prevState,
          lat: data.countryInfo.lat,
          lng: data.countryInfo.long,
        }))
        setMapZoom(3)
      })
      .catch((err) => console.log(err))
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
              value={country}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
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
            active={casesType === 'cases'}
            onClick={() => setCasesType('cases')}
            title="Coronavirus cases"
            cases={prettyProntStat(diseaseInfo.todayCases)}
            total={prettyProntStat(diseaseInfo.cases)}
          />
          <InfoBoxes
            active={casesType === 'recovered'}
            onClick={() => setCasesType('recovered')}
            title="Recovered"
            cases={prettyProntStat(diseaseInfo.todayRecovered)}
            total={prettyProntStat(diseaseInfo.recovered)}
          />
          <InfoBoxes
            isRed
            active={casesType === 'deaths'}
            onClick={() => setCasesType('deaths')}
            title="Deaths"
            cases={prettyProntStat(diseaseInfo.todayDeaths)}
            total={prettyProntStat(diseaseInfo.deaths)}
          />
        </div>

        <Map
          casesType={casesType as CaseTypes}
          diseaseData={generalInfo?.diseaseData}
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countriesData={generalInfo?.countriesCases} />
          <h3 className="app__graphTitle">Wordwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>

      <div className="footer__section">
        <Footer />
      </div>
    </div>
  )
}

export default App
