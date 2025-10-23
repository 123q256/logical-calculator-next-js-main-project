import React from 'react'

const TemperatureConverter = ({ lang }) => {
  return (
    <>
    <option value="1" >{lang['1']} [°C]</option>
    <option value="2" >{lang['2']} [K]</option>
    <option value="3">{lang['3']} [°F]</option>
    <option value="4">{lang['4']} [°R]</option>
    <option value="5">{lang['5']} [°r]</option>
    <option value="6">{lang['6']}</option>
</>
  )
}

export default TemperatureConverter