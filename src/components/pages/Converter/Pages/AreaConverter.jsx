import React from 'react';

const AreaConverter = ({ lang }) => {
  const keys = lang['3'] ? lang['3'].split('@') : [];
  const keys_ = lang['4'] ? lang['4'].split('@') : [];

  return (
    <>
      <option value="1.0E+15">{keys[0]} (m²)</option>
      <option value="1000000000">{keys[1]} (km²)</option>
      <option value="1.0E+19">{keys[2]} (cm²)</option>
      <option value="1.0E+21">{keys[3]} (mm²)</option>
      <option value="1.0E+27">{keys[4]} (µm²)</option>
      <option value="100000000000">{keys[5]} (ha)</option>
      <option value="247105381467.17">{keys[6]} (ac)</option>
      <option value="386102158.54245">{keys[7]} (mi²)</option>
      <option value="1.1959900463011E+15">{keys[8]} (yd²)</option>
      <option value="1.076391041671E+16">{keys[9]} (ft²)</option>
      <option value="1.5500031000062E+18">{keys[10]} (in²)</option>
      <option value="100000000000">{keys[11]} (hm²)</option>
      <option value="10000000000000">{keys[12]} (dam²)</option>
      <option value="1.0E+17">{keys[13]} (dm²)</option>
      <option value="1.0E+33">{keys[14]} (nm²)</option>

      <option value="10000000000000">{keys_[0]} (a)</option>
      <option value="1.0E+43">{keys_[1]} (b)</option>
      <option value="386100614.13536">{keys_[2]}</option>
      <option value="1.0763867361111E+16">{keys_[3]}</option>
      <option value="1.97352524139E+18">{keys_[4]}</option>
      <option value="10725059.959512">{keys_[5]}</option>
      <option value="386102158.54245">{keys_[6]}</option>
      <option value="247104393046.63">{keys_[7]} (ac)</option>
      <option value="988421525868.66">{keys_[8]}</option>
      <option value="2471053814671.6">{keys_[9]} (ch²)</option>
      <option value="39536861034746">{keys_[10]}</option>
      <option value="39536702887460">{keys_[11]}</option>
      <option value="39536861034746">{keys_[12]}</option>
      <option value="39536861034746">{keys_[13]}</option>
      <option value="1.5500031000062E+24">{keys_[14]} (mil²)</option>
      <option value="1.97352524139E+24">{keys_[15]}</option>
      <option value="1544408634.1698">{keys_[16]}</option>
      <option value="1.076391041671E+16">{keys_[17]}</option>
      <option value="247446216476.09">{keys_[18]}</option>
      <option value="254427313535.39">{keys_[19]}</option>
      <option value="156250000000">{keys_[20]}</option>
      <option value="1.4311536386366E+15">{keys_[21]}</option>
      <option value="1.5901707095962E+14">{keys_[22]}</option>
      <option value="1.5032029647492E+43">{keys_[23]}</option>
    </>
  );
};

export default AreaConverter;
