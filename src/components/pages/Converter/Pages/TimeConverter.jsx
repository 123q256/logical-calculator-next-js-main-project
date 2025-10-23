import React from 'react';

const TimeConverter = ({ lang }) => {
  const keys = lang['3'].split('@');

  return (
    <>
      <option value="3.1536E+18">{keys[0]} (s)</option>
      <option value="3.1536E+21">{keys[1]} (ms)</option>
      <option value="5.256E+16">{keys[2]} (min)</option>
      <option value="8.76E+14">{keys[3]} (h)</option>
      <option value="36500000000000">{keys[4]} (d)</option>
      <option value="5214285714285.7">{keys[5]}</option>
      <option value="1200000000000">{keys[6]}</option>
      <option value="100000000000">{keys[7]} (y)</option>
      <option value="10000000000">{keys[8]}</option>
      <option value="1000000000">{keys[9]}</option>
      <option value="100000000">{keys[10]}</option>
      <option value="3.1536E+24">{keys[11]} (µs)</option>
      <option value="3.1536E+27">{keys[12]} (ns)</option>
      <option value="3.1536E+30">{keys[13]} (ps)</option>
      <option value="3.1536E+33">{keys[14]} (fs)</option>
      <option value="3.1536E+36">{keys[15]} (as)</option>
      <option value="3.1536E+26">{keys[16]}</option>
      <option value="1236006041191.2">{keys[6]} ({keys[25]})</option>
      <option value="99931553730.322">{keys[7]} ({keys[26]})</option>
      <option value="99726775956.284">{keys[7]} ({keys[27]})</option>
      <option value="99933675424.067">{keys[7]} ({keys[28]})</option>
      <option value="99929813565.361">{keys[7]} ({keys[29]})</option>
      <option value="36599933916786">{keys[4]} ({keys[29]})</option>
      <option value="8.7839841400286E+14">{keys[3]} ({keys[29]})</option>
      <option value="5.2703904840172E+16">{keys[17]} ({keys[29]})</option>
      <option value="3.1622342904103E+18">{keys[0]} ({keys[29]})</option>
      <option value="2607142857142.9">{keys[18]}</option>
      <option value="14285714285.714">{keys[19]}</option>
      <option value="12500000000">{keys[20]}</option>
      <option value="11111111111.111">{keys[21]}</option>
      <option value="6666666666.6667">{keys[22]}</option>
      <option value="20000000000">{keys[23]}</option>
      <option value="5.8502270636075E+61">{keys[24]}</option>
    </>
  );
};

export default TimeConverter;
