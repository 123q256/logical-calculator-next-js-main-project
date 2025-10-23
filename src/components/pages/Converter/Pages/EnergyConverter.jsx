import React from 'react';

const EnergyConverter = ({ lang }) => {
  const keys = lang['keys'].split('@@');

  return (
    <>
      <option value="1.0E+26">{keys[0]} [J]</option>
      <option value="1.0E+23">{keys[1]} [kJ]</option>
      <option value="2.7777777777778E+19">{keys[2]} [kW*h]</option>
      <option value="2.7777777777778E+22">{keys[3]} [W*h]</option>
      <option value="2.388458966275E+22">{keys[4]}</option>
      <option value="3.7767267147331E+19">{keys[5]}</option>
      <option value="9.4781712031332E+22">Btu (IT) [Btu (IT), Btu]</option>
      <option value="9.484516527E+22">Btu (th) [Btu (th)]</option>
      <option value="1.0E+17">{keys[6]} [GJ]</option>
      <option value="1.0E+20">{keys[7]} [MJ]</option>
      <option value="1.0E+29">{keys[8]} [mJ]</option>
      <option value="1.0E+32">{keys[9]} [µJ]</option>
      <option value="1.0E+35">{keys[10]} [nJ]</option>
      <option value="1.0E+44">{keys[11]} [aJ]</option>
      <option value="6.241506363094E+38">{keys[12]} [MeV]</option>
      <option value="6.241506363094E+41">{keys[13]} [keV]</option>
      <option value="6.241506363094E+44">{keys[14]} [eV]</option>
      <option value="1.0E+33">erg</option>
      <option value="27777777777778">{keys[15]} [GW*h]</option>
      <option value="2.7777777777778E+16">{keys[16]} [MW*h]</option>
      <option value="1.0E+23">{keys[17]} [kW*s]</option>
      <option value="1.0E+26">{keys[18]} [W*s]</option>
      <option value="1.0E+26">{keys[19]} [N*m]</option>
      <option value="3.725061361111E+19">{keys[20]} [hp*h]</option>
      <option value="2.388458966275E+22">{keys[21]} (IT) [kcal (IT)]</option>
      <option value="2.3900573613767E+22">{keys[21]} (th) [kcal (th)]</option>
      <option value="2.388458966275E+25">{keys[22]} (IT) [cal (IT), cal]</option>
      <option value="2.3900573613767E+25">{keys[22]} (th) [cal (th)]</option>
      <option value="9.4781712031332E+16">{keys[23]} (IT) [MBtu (IT)]</option>
      <option value="7.898476002611E+18">{keys[24]}</option>
      <option value="2.4877089772003E+15">{keys[25]}</option>
      <option value="1.5666398682865E+16">{keys[26]} (US)</option>
      <option value="23900573.613767">{keys[27]} [Gton]</option>
      <option value="23900573613.767">{keys[28]} [Mton]</option>
      <option value="23900573613767">{keys[29]} [kton]</option>
      <option value="2.3900573613767E+16">{keys[30]}</option>
      <option value="1.0E+33">{keys[31]} [dyn*cm]</option>
      <option value="1.0197162130094E+28">{keys[32]} [gf*m]</option>
      <option value="1.0197162130094E+30">{keys[33]}</option>
      <option value="1.0197162130094E+27">{keys[34]}</option>
      <option value="1.0197162130094E+25">{keys[35]}</option>
      <option value="1.0197162130094E+25">{keys[36]} [kp*m]</option>
      <option value="7.375621493E+25">{keys[37]} [lbf*ft]</option>
      <option value="8.8507457916E+26">{keys[38]} [lbf*in]</option>
      <option value="1.416119326656E+28">{keys[39]} [ozf*in]</option>
      <option value="7.375621493E+25">{keys[40]} [ft*lbf]</option>
      <option value="8.8507457916E+26">{keys[41]} [in*lbf]</option>
      <option value="1.416119326656E+28">{keys[42]} [in*ozf]</option>
      <option value="2.37303604571E+27">{keys[43]} [pdl*ft]</option>
      <option value="9.4781698791344E+17">{keys[44]}</option>
      <option value="9.4781698791344E+17">{keys[44]} (EC)</option>
      <option value="9.4804342797336E+17">{keys[44]} (US)</option>
      <option value="2.2937104486906E+43">{keys[45]}</option>
      <option value="4.5874208973812E+43">{keys[46]}</option>
    </>
  );
};

export default EnergyConverter;
