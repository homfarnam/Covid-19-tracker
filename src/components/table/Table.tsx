import React from 'react'
import './Table.css'
import numeral from 'numeral'
import { CountryCasesInfo } from '../../@types/types'

interface TableProps {
  countriesData?: CountryCasesInfo[]
}

const Table: React.FC<TableProps> = ({ countriesData }) => {
  if (!countriesData) {
    return <div className="table"></div>
  }

  return (
    <div className="table">
      {countriesData.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>{numeral(country.cases).format('0.0a')}</strong>
          </td>
        </tr>
      ))}
    </div>
  )
}

export default Table
