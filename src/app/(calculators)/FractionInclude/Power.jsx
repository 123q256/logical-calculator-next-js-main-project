import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

const Power = ({ formData, lang, result }) => {
  const { tech_N1: N1, tech_D1: D1, tech_N2: N2, tech_D2: D2 } = formData;

  const exponent = N2 / D2;
  const numPower = Math.pow(N1, exponent);
  const denomPower = Math.pow(D1, exponent);
  const hasGCD = gcd(numPower, denomPower) !== 1;
  const reducedNumer = result?.data?.tech_upr;
  const reducedDenom = result?.data?.tech_btm;

  return (
    <div className="col-span-12">
      <p className="mt-2">{lang[8]}:</p>
      <div className="text-center mt-2">
        <BlockMath
          math={`= \\left(\\frac{${N1}^{\\frac{${N2}}{${D2}}}}{${D1}^{\\frac{${N2}}{${D2}}}}\\right)`}
        />
      </div>

      <div className="mt-2">
        {lang[9]} <BlockMath math={`\\frac{${N2}}{${D2}}`} inline /> {lang[10]}:
      </div>
      <div className="text-center mt-2">
        <BlockMath
          math={`= \\left(\\frac{${N1}^{${exponent}}}{${D1}^{${exponent}}}\\right)`}
        />
      </div>

      <div className="text-center mt-2">
        <BlockMath math={`= \\frac{${numPower}}{${denomPower}}`} />
      </div>

      {hasGCD && (
        <>
          <p className="mt-2">
            {lang[11]} {numPower} {lang[12]} {denomPower} {lang[13]} (GCF({numPower}, {denomPower}) ={' '}
            {gcd(numPower, denomPower)})
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\frac{${numPower} \\div ${gcd(numPower, denomPower)}}{${denomPower} \\div ${gcd(numPower, denomPower)}} = ${
                reducedDenom !== 1 && reducedNumer !== 0
                  ? `\\frac{${reducedNumer}}{${reducedDenom}}`
                  : `${reducedNumer}`
              }`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Power;
