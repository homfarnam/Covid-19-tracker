import React from "react";
import './Table.css'
import numeral from 'numeral'

interface table {
    country: string,
    cases: string
}

const Table =({ countries }:any) =>{
  return (
    <div className="table">
      {countries.map((country: {country:string , cases:string}) => (
        <tr>
          <td>{country.country}</td>
          <td><strong>{numeral(country.cases).format('0.0a') }</strong></td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
