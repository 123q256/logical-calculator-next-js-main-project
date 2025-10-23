import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// GCD helper function
const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

const FourMulDivMul = ({ formData, lang, result }) => {
  // Extract inputs
  let {
    tech_N1: N1, tech_D1: D1,
    tech_N2: N2, tech_D2: D2,
    tech_N3: N3, tech_D3: D3,
    tech_N4: N4, tech_D4: D4,
    tech_action: action,
    tech_action1: action1,
    tech_action2: action2,
  } = formData;

  // Backup original actions
  const oaction = action;
  const oaction1 = action1;
  const oaction2 = action2;

  // Handle ÷ operations by inverting the fractions
  if (action === '÷') {
    [N2, D2] = [D2, N2];
    action = '×';
  }
  if (action1 === '÷') {
    [N3, D3] = [D3, N3];
    action1 = '×';
  }
  if (action2 === '÷') {
    [N4, D4] = [D4, N4];
    action2 = '×';
  }

  const up = N1 * N2 * N3 * N4;
  const btm = D1 * D2 * D3 * D4;
  const gcf = gcd(up, btm);
  const reducedUp = up / gcf;
  const reducedBtm = btm / gcf;

  const finalUpr = result?.data?.tech_upr ?? reducedUp;
  const finalBtm = result?.data?.tech_btm ?? reducedBtm;

  const isImproper = finalBtm !== 1 && finalUpr > finalBtm;
  const remainder = finalUpr % finalBtm;
  const whole = Math.floor(finalUpr / finalBtm);

  return (
    <div className='col-span-12'>

      {(oaction === '÷' || oaction1 === '÷' || oaction2 === '÷') && (
        <>
          <p className="mt-2">{lang[26]}.</p>
          <p className="mt-2">{lang[27]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${formData.tech_N1}}{${formData.tech_D1}} ${oaction} \\dfrac{${formData.tech_N2}}{${formData.tech_D2}} ${oaction1} \\dfrac{${formData.tech_N3}}{${formData.tech_D3}} ${oaction2} \\dfrac{${formData.tech_N4}}{${formData.tech_D4}} = ?`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[28]}</p>
      <div className="text-center mt-2">
        <BlockMath
          math={`= \\dfrac{(${N1})\\times(${N2})\\times(${N3})\\times(${N4})}{${D1}\\times${D2}\\times${D3}\\times${D4}}`}
        />
      </div>

      <div className="text-center mt-2">
        <BlockMath math={`= \\dfrac{${up}}{${btm}}`} />
      </div>

      {gcf !== 1 && (
        <>
          <p className="mt-2">{lang[18]} {up} {lang[12]} {btm} {lang[19]}</p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank">
              GCF({up},{btm}) = {gcf}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${up} \\div ${gcf}}{${btm} \\div ${gcf}} = ${
                finalBtm !== 1 ? `\\dfrac{${finalUpr}}{${finalBtm}}` : finalUpr
              }`}
            />
          </div>
        </>
      )}

      {isImproper && remainder !== 0 ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${finalUpr}}{${finalBtm}}`} />
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`${finalUpr} \\div ${finalBtm}`} />
          </div>
          <p className="mt-2">{lang[22]}:</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${finalUpr}}{${finalBtm}} = ${whole} \\dfrac{${remainder}}{${finalBtm}}`} />
          </div>
          <p className="mt-2">{lang[23]}:</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${formData.tech_N1}}{${formData.tech_D1}} ${oaction} \\dfrac{${formData.tech_N2}}{${formData.tech_D2}} ${oaction1} \\dfrac{${formData.tech_N3}}{${formData.tech_D3}} ${oaction2} \\dfrac{${formData.tech_N4}}{${formData.tech_D4}} = ${whole} \\dfrac{${remainder}}{${finalBtm}}`}
            />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2">{lang[23]}:</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${formData.tech_N1}}{${formData.tech_D1}} ${oaction} \\dfrac{${formData.tech_N2}}{${formData.tech_D2}} ${oaction1} \\dfrac{${formData.tech_N3}}{${formData.tech_D3}} ${oaction2} \\dfrac{${formData.tech_N4}}{${formData.tech_D4}} = ${
                finalBtm !== 1 ? `\\dfrac{${finalUpr}}{${finalBtm}}` : finalUpr
              }`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FourMulDivMul;
