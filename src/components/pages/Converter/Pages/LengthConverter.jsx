'use client';

import React, { useState, useEffect } from 'react';


const LengthConverter = ({lang}) => {
  return (
   <>
   
   <option value="1.0E+31"  >{lang['1']} [m]</option>
    <option value="1.0E+28" >{lang['2']} [km]</option>
    <option value="1.0E+32" >{lang['3']} [dm]</option>
    <option value="1.0E+33">{lang['4']} [cm]</option>
    <option value="1.0E+34">{lang['5']} [mm]</option>
    <option value="1.0E+37">{lang['6']} [µm]</option>
    <option value="1.0E+40">{lang['7']} [nm]</option>
    <option value="6.2137119223733E+27">{lang['8']} [mi, mi(Int)]</option>
    <option value="1.0936132983377E+31">{lang['9']} [yd]</option>
    <option value="3.2808398950131E+31">{lang['10']} [ft]</option>
    <option value="3.9370078740157E+32">{lang['11']} [in]</option>
    <option value="1.0570008340247E+15">{lang['12']} [ly]</option>
    <option value="10000000000000">{lang['13']} [Em]</option>
    <option value="1.0E+16">{lang['14']} [Pm]</option>
    <option value="1.0E+19">{lang['15']} [Tm]</option>
    <option value="1.0E+22">{lang['16']} [Gm]</option>
    <option value="1.0E+25">{lang['17']} [Mm]</option>
    <option value="1.0E+29">{lang['18']} [hm]</option>
    <option value="1.0E+30">{lang['19']} [dam]</option>
    <option value="1.0E+37">{lang['20']} [µ]</option>
    <option value="1.0E+43">{lang['21']} [pm]</option>
    <option value="1.0E+46">{lang['22']} [fm]</option>
    <option value="1.0E+49">{lang['23']} [am]</option>
    <option value="324077928.96664">{lang['24']} [Mpc]</option>
    <option value="324077928966.64">{lang['25']} [kpc]</option>
    <option value="3.2407792896664E+14">{lang['26']} [pc]</option>
    <option value="6.6845871226706E+19">{lang['27']} [AU, UA]</option>
    <option value="2.0712373074578E+27">{lang['28']} [lea]</option>
    <option value="1.7987060827923E+27">{lang['29']} (UK)</option>
    <option value="1.7998560115191E+27">{lang['29']} (int.)</option>
    <option value="2.0712331649832E+27">{lang['30']}</option>
    <option value="5.3961182483768E+27">{lang['31']} (UK) [NM (UK)]</option>
    <option value="5.3995680345572E+27">{lang['31']} ({lang['32']})</option>
    <option value="6.2136994949495E+27">{lang['8']} ({lang['33']}) [mi, mi (US)]</option>
    <option value="6.2136994949495E+27">{lang['8']} ({lang['34']}) [mi]</option>
    <option value="6.7576516890075E+27">{lang['8']} (Roman)</option>
    <option value="1.0936132983377E+28">{lang['35']} [kyd]</option>
    <option value="4.9709695378987E+28">{lang['36']} [fur]</option>
    <option value="4.9709595959596E+28">{lang['36']} ({lang['34']}) [fur]</option>
    <option value="4.9709695378987E+29">{lang['37']} [ch]</option>
    <option value="4.9709595959596E+29">{lang['37']} ({lang['34']}) [ch]</option>
    <option value="1.6404199475066E+30">{lang['38']}</option>
    <option value="1.9883878151595E+30">{lang['39']} [rd]</option>
    <option value="1.9883838383838E+30">{lang['39']} ({lang['34']}) [rd]</option>
    <option value="1.9883878151595E+30">{lang['40']}</option>
    <option value="1.9883878151595E+30">{lang['41']}</option>
    <option value="5.4680664916885E+30">{lang['42']} [fath]</option>
    <option value="5.4680555555556E+30">{lang['42']} ({lang['34']}) [fath]</option>
    <option value="8.7489063867017E+30">{lang['43']}</option>
    <option value="3.2808333333333E+31">{lang['10']} ({lang['34']}) [ft]</option>
    <option value="4.9709695378987E+31">{lang['44']} [li]</option>
    <option value="4.9709595959596E+31">{lang['44']} ({lang['34']}) [li]</option>
    <option value="2.1872265966754E+31">{lang['45']} (UK)</option>
    <option value="9.8425196850394E+31">{lang['46']}</option>
    <option value="4.3744531933508E+31">{lang['47']} (cloth)</option>
    <option value="8.7489063867017E+31">{lang['48']} (cloth)</option>
    <option value="1.7497812773403E+32">{lang['49']} (cloth)</option>
    <option value="3.937E+32">{lang['11']} ({lang['34']}) [in]</option>
    <option value="1.1811023622047E+33">{lang['50']}</option>
    <option value="3.9370078740158E+35">{lang['51']} [mil, thou]</option>
    <option value="3.9370078740157E+38">{lang['52']}</option>
    <option value="1.0E+41">{lang['53']} [A]</option>
    <option value="1.8897259885789E+41">A.u. {lang['54']} [a.u., b]</option>
    <option value="9.9792431741977E+43">{lang['55']} [X]</option>
    <option value="1.0E+46">{lang['56']} [F, f]</option>
    <option value="1.7087707786527E+29">{lang['57']}</option>
    <option value="2.3622047244095E+33">{lang['58']}</option>
    <option value="2.8346456692913E+34">{lang['59']}</option>
    <option value="5.6692913385827E+35">{lang['60']}</option>
    <option value="1.684131736527E+31">{lang['61']}</option>
    <option value="5.6137724550898E+30">{lang['62']}</option>
    <option value="3.9370078740158E+34">{lang['63']} [cl]</option>
    <option value="3.9370078740158E+34">{lang['64']} [cin]</option>
    <option value="4.7206329424649E+30">{lang['65']}</option>
    <option value="1.4060742407199E+31">{lang['66']}</option>
    <option value="2.8185909750972E+29">{lang['67']}</option>
    <option value="3.9912894099916E+30">{lang['68']}</option>
    <option value="3.9912894099916E+30">{lang['69']}</option>
    <option value="1.1973868229975E+31">{lang['70']}</option>
    <option value="2.1608166158155E+31">{lang['45']} (Greek)</option>
    <option value="3.124609423822E+30">{lang['71']}</option>
    <option value="3.6453776611257E+30">{lang['72']}</option>
    <option value="1.8747656542932E+31">{lang['73']}</option>
    <option value="1.3123359580052E+32">{lang['74']}</option>
    <option value="5.249343832021E+32">{lang['75']}</option>
    <option value="6.1879273537329E+65">{lang['76']}</option>
    <option value="3.5486904388329E+45">{lang['77']} (classical)</option>
    <option value="1.8897259885789E+41">{lang['78']} [b, a.u.]</option>
    <option value="1.5678502891116E+24">{lang['79']}</option>
    <option value="1.5731242420491E+24">{lang['80']}</option>
    <option value="6.6844919786096E+19">{lang['81']}</option>
    <option value="1.4367816091954E+22">{lang['82']}</option>

</>
  )
}

export default LengthConverter