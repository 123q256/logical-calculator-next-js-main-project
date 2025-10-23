import React from 'react';

const PressureConverter = ({ lang }) => {
  const keys = lang['3']?.split('@') || [];
  const keys_ = lang['4']?.split('@') || [];

  return (
    <>
      <option value="1.0E+18">{keys[0]} (Pa)</option>
      <option value="1.0E+15">{keys[1]} (kPa)</option>
      <option value="10000000000000">{keys[2]}</option>
      <option value="1.4503773773E+14">{keys[3]} (psi)</option>
      <option value="145037737730">{keys[4]} (ksi)</option>
      <option value="9869232667160.1">{keys[5]} (atm)</option>
      <option value="1">{keys[6]} (EPa)</option>
      <option value="1000">{keys[7]} (PPa)</option>
      <option value="1000000">{keys[8]} (TPa)</option>
      <option value="1000000000">{keys[9]} (GPa)</option>
      <option value="1000000000000">{keys[10]} (MPa)</option>
      <option value="1.0E+16">{keys[11]} (hPa)</option>
      <option value="1.0E+17">{keys[12]} (daPa)</option>
      <option value="1.0E+19">{keys[13]} (dPa)</option>
      <option value="1.0E+20">{keys[14]} (cPa)</option>
      <option value="1.0E+21">{keys[15]} (mPa)</option>
      <option value="1.0E+24">{keys[16]} (µPa)</option>
      <option value="1.0E+27">{keys[17]} (nPa)</option>
      <option value="1.0E+30">{keys[18]} (pPa)</option>
      <option value="1.0E+33">{keys[19]} (fPa)</option>
      <option value="1.0E+36">{keys[20]} (aPa)</option>
      <option value="1.0E+18">{keys[21]}</option>
      <option value="1.0E+14">{keys[22]}</option>
      <option value="1000000000000">{keys[23]}</option>
      <option value="1.0E+15">{keys[24]}</option>
      <option value="1.0E+16">{keys[25]} (mbar)</option>
      <option value="1.0E+19">{keys_[0]} (µbar)</option>
      <option value="1.0E+19">{keys_[1]}</option>
      <option value="1.0197162129779E+17">{keys_[2]}</option>
      <option value="10197162129779">{keys_[3]}</option>
      <option value="101971621297.79">{keys_[4]}</option>
      <option value="1.0197162129779E+16">{keys_[5]}</option>
      <option value="10442717116574">{keys_[6]}</option>
      <option value="72518868865.1">{keys_[7]}</option>
      <option value="9323854568370.6">{keys_[8]}</option>
      <option value="64748990058.129">{keys_[9]}</option>
      <option value="145037737730">{keys_[10]}</option>
      <option value="2.088543423312E+16">{keys_[11]}</option>
      <option value="1.4503773773E+14">{keys_[12]}</option>
      <option value="6.7196897513951E+17">{keys_[13]}</option>
      <option value="7.50061682704E+15">{keys_[14]} (Torr)</option>
      <option value="7.5006375541921E+14">{keys_[15]} (0°C)</option>
      <option value="7.5006375541921E+15">{keys_[16]} (0°C)</option>
      <option value="2.9530058646696E+14">{keys_[17]} (32°F) (inHg)</option>
      <option value="2.9613397100848E+14">{keys_[17]} (60°F) (inHg)</option>
      <option value="1.0197442889221E+16">{keys_[18]} (4°C)</option>
      <option value="1.0197442889221E+17">{keys_[19]} (4°C)</option>
      <option value="4.0147421331128E+15">{keys_[20]} (4°C) (inAq)</option>
      <option value="3.3456229215318E+14">{keys_[21]} (4°C) (ftAq)</option>
      <option value="4.0185980718766E+15">{keys_[20]} (60°F) (inAq)</option>
      <option value="3.3488317265639E+14">{keys_[21]} (60°F) (ftAq)</option>
      <option value="10197162129779">{keys_[22]} (at)</option>
    </>
  );
};

export default PressureConverter;
