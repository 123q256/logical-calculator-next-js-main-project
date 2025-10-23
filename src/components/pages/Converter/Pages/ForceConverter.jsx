import React from 'react';

const ForceConverter = ({ lang }) => {
  const keys = lang.keys.split('@@');

  return (
    <>
      <option value="1.0E+18">{keys[0]} [N]</option>
      <option value="1.0E+15">{keys[1]} [kN]</option>
      <option value="1.0197162129779E+20">{keys[2]} [gf]</option>
      <option value="1.0197162129779E+17">{keys[3]} [kgf]</option>
      <option value="1.0197162129779E+14">{keys[4]} [tf]</option>
      <option value="1">{keys[5]} [EN]</option>
      <option value="1000">{keys[6]} [PT]</option>
      <option value="1000000">{keys[7]} [TN]</option>
      <option value="1000000000">{keys[8]} [GN]</option>
      <option value="1000000000000">{keys[9]} [MN]</option>
      <option value="1.0E+16">{keys[10]} [hN]</option>
      <option value="1.0E+17">{keys[11]} [daN]</option>
      <option value="1.0E+19">{keys[12]} [dN]</option>
      <option value="1.0E+20">{keys[13]} [cN]</option>
      <option value="1.0E+21">{keys[14]} [mN]</option>
      <option value="1.0E+24">{keys[15]} [µN]</option>
      <option value="1.0E+27">{keys[16]} [nN]</option>
      <option value="1.0E+30">{keys[17]} [pN]</option>
      <option value="1.0E+33">{keys[18]} [fN]</option>
      <option value="1.0E+36">{keys[19]} [aN]</option>
      <option value="1.0E+23">{keys[20]} [dyn]</option>
      <option value="1.0E+18">{keys[21]} [J/m]</option>
      <option value="1.0E+20">{keys[22]} [J/cm]</option>
      <option value="1.1240447154986E+14">{keys[23]}</option>
      <option value="1.003611353125E+14">{keys[24]} [tonf (UK)]</option>
      <option value="2.248089431E+14">{keys[25]} [kipf]</option>
      <option value="2.248089431E+14">{keys[26]} [kipf]</option>
      <option value="2.248089431E+17">{keys[27]} [lbf]</option>
      <option value="3.5969430896E+18">{keys[28]} [ozf]</option>
      <option value="7.2330138512099E+18">{keys[29]} [pdl]</option>
      <option value="7.2330138512099E+18">{keys[30]}</option>
      <option value="1.0197162129779E+20">{keys[31]} [p]</option>
      <option value="1.0197162129779E+17">{keys[32]} [kp]</option>
    </>
  );
};

export default ForceConverter;
