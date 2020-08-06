interface Position {
  lat: number
  long?: number
}

export interface Mapcenter extends Position {
  lng: number
  data?: {
    countryInfo: Position
  }
}

export type CountryCode = {
  name: string
  value: string
}

export interface CountryCasesInfo {
  country: string
  cases: string
}

export interface CountryInfo {
  lat: number
  long: number
  flag: string
}

export interface DiseaseInfo {
  country: string
  todayRecovered: number
  recovered: number
  deaths: number
  todayDeaths: number
  todayCases: number
  countryInfo: CountryInfo
  cases: number
}

export type CaseTypes = 'cases' | 'recovered' | 'deaths'
