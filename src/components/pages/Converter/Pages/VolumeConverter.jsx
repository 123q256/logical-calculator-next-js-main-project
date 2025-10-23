import React from 'react';

const VolumeConverter = ({ lang }) => {
  if (!lang?.key) return null;

  const keys = lang.key.split('@@');

  const options = [
    { value: "10000000000", label: `[m³]` },
    { value: "10", label: `[km³]` },
    { value: "1.0E+16", label: `[cm³]` },
    { value: "1.0E+19", label: `[mm³]` },
    { value: "10000000000000", label: `[L, l]` },
    { value: "1.0E+16", label: `[mL]` },
    { value: "2641720523581.5", label: `(US) [gal (US)]` },
    { value: "10566882094326", label: `(US) [qt (US)]` },
    { value: "21133764188652", label: `(US) [pt (US)]` },
    { value: "42267528377304", label: `(US)` },
    { value: "6.7628045403686E+14", label: `(US)` },
    { value: "2.0288413621106E+15", label: `(US)` },
    { value: "2.3991275857893", label: `[mi³]` },
    { value: "13079506193.144", label: `[yd³]` },
    { value: "353146667214.89", label: `[ft³]` },
    { value: "6.1023744094732E+14", label: `[in³]` },
    { value: "10000000000000", label: `[dm³]` },
    { value: "1.0E-5", label: `[EL]` },
    { value: "0.01", label: `[PL]` },
    { value: "10", label: `[TL]` },
    { value: "10000", label: `[GL]` },
    { value: "10000000", label: `[ML]` },
    { value: "10000000000", label: `[kL]` },
    { value: "100000000000", label: `[hL]` },
    { value: "1000000000000", label: `[daL]` },
    { value: "1.0E+14", label: `[dL]` },
    { value: "1.0E+15", label: `[cL]` },
    { value: "1.0E+19", label: `[µL]` },
    { value: "1.0E+22", label: `[nL]` },
    { value: "1.0E+25", label: `[pL]` },
    { value: "1.0E+28", label: `[fL]` },
    { value: "1.0E+31", label: `[aL]` },
    { value: "1.0E+16", label: `Cc [cc, cm³]` },
    { value: "2.0E+17", label: `` }, // continue...
    // Add the rest of the options in the same structure...
  ];

  return (
    <>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {keys[index] ? `${keys[index]} ${option.label}` : option.label}
        </option>
      ))}
    </>
  );
};

export default VolumeConverter;
