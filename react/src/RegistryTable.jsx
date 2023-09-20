import React from 'react'
import jsonData from "./data/data.json";


function RegistryTable() {

  const populationData = jsonData.populationData;

  const top10Data = populationData
  .map(countryData => ({
    country: countryData.country,
    latestValue: countryData.values.find(value => value.value !== null)?.value || 0,
  }))
  .sort((a, b) => b.latestValue - a.latestValue)
  .slice(0, 10);


  return (
    <div>
    <h1>Top 10 Países</h1>
    <table>
      <thead>
        <tr>
          <th>País</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        {top10Data.map((item, index) => (
          <tr key={index}>
            <td>{item.country}</td>
            <td>{item.latestValue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default RegistryTable
