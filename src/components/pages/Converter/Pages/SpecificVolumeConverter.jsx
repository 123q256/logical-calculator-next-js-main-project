import React from 'react'

const SpecificVolumeConverter = () => {
  return (
   <>
    <option value="1" >Cubic meter/kilogram</option>
    <option value="1000">Cubic centimeter/gram</option>
    <option value="1000">Liter/kilogram [L/kg]</option>
    <option value="1">Liter/gram [L/g]</option>
    <option value="35.31466672">Cubic foot/kilogram [ft^3/kg]</option>
    <option value="16.01846353">Cubic foot/pound [ft^3/lb]</option>
    <option value="119.82643593497">Gallon (US)/pound</option>
    <option value="99.77637365">Gallon (UK)/pound</option>
</>
  )
}

export default SpecificVolumeConverter