import React from 'react';

const VolumeDryConverter = ({ lang }) => {
const keys = (lang?.["3"] || "").split("@");

  return (
    <>
      <option value="1156271236039.4">{keys[0]} (L,l)</option>
      <option value="10000000000" >{keys[1]} (US) (bbl dry (US))</option>
      <option value="2099980469131.6">{keys[2]} (US) (pt dry (US))</option>
      <option value="1049990234565.8">{keys[3]} (US) (qt dry (US))</option>
      <option value="131248779320.73">{keys[4]} (US) (pk (US))</option>
      <option value="127172057310.72">{keys[4]} (UK) (pk (UK))</option>
      <option value="32812194830.182">{keys[5]} (US) (bu (US))</option>
      <option value="31793014327.68">{keys[5]} (UK) (bu (UK))</option>
      <option value="5255778601.452">{keys[6]}</option>
      <option value="5255778601.452">{keys[7]}</option>
      <option value="52557786014.52">{keys[8]}</option>
      <option value="157673358043.56">{keys[9]}</option>
      <option value="525577860145.2">{keys[10]}</option>
      <option value="946040148261.35">{keys[11]}</option>
      <option value="3784160593045.4">{keys[12]}</option>
    </>
  );
};

export default VolumeDryConverter;
