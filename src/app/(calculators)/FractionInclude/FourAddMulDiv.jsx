import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

const FourAddMulDiv = ({ formData = {}, lang = [], result = {} }) => {
  let {
    tech_N1, tech_D1,
    tech_N2, tech_D2,
    tech_N3, tech_D3,
    tech_N4, tech_D4,
    tech_action, tech_action1, tech_action2,
  } = formData;

  // Default values if any are missing
  tech_N1 = tech_N1 ?? 0;
  tech_D1 = tech_D1 ?? 1;
  tech_N2 = tech_N2 ?? 0;
  tech_D2 = tech_D2 ?? 1;
  tech_N3 = tech_N3 ?? 0;
  tech_D3 = tech_D3 ?? 1;
  tech_N4 = tech_N4 ?? 0;
  tech_D4 = tech_D4 ?? 1;

  let action = tech_action;
  let action1 = tech_action1;
  let action2 = tech_action2;

  const originalAction1 = action1;
  const originalAction2 = action2;

  // Convert division into multiplication by reciprocal
  if (action1 === "÷") {
    [tech_N3, tech_D3] = [tech_D3, tech_N3];
    action1 = "×";
  }

  if (action2 === "÷") {
    [tech_N4, tech_D4] = [tech_D4, tech_N4];
    action2 = "×";
  }

  // Multiply fractions for the RHS group
  const multNum = tech_N2 * tech_N3 * tech_N4;
  const multDen = tech_D2 * tech_D3 * tech_D4;

  tech_N2 = multNum;
  tech_D2 = multDen;

  const lcd = result.tech_lcd ?? tech_D1 * tech_D2;
  const showLCD = tech_D1 !== tech_D2;

  const mul1 = showLCD ? lcd / tech_D1 : 1;
  const mul2 = showLCD ? lcd / tech_D2 : 1;

  let resultNumerator = 0;
  if (action === "+") {
    resultNumerator = showLCD
      ? tech_N1 * mul1 + tech_N2 * mul2
      : tech_N1 + tech_N2;
  } else if (action === "-") {
    resultNumerator = showLCD
      ? tech_N1 * mul1 - tech_N2 * mul2
      : tech_N1 - tech_N2;
  }

  const finalDenominator = tech_D1 * mul1;
  const commonFactor = gcd(resultNumerator, finalDenominator);

  const finalNumerator = resultNumerator / commonFactor;
  const finalDen = finalDenominator / commonFactor;

  const upr = result?.tech_upr ?? finalNumerator;
  const btm = result?.tech_btm ?? finalDen;

  const isImproper = btm !== 1 && upr > btm;
  const remainder = upr % btm;
  const whole = Math.floor(upr / btm);

  return (
    <div className="col-span-12">
      {(originalAction1 === "÷" || originalAction2 === "÷") && (
        <>
          <p className="mt-2">
            So we are having three different operations. First, we will solve the{" "}
            {originalAction1 === "÷" ? "first division" : "second division"} operation.
          </p>
          <p className="mt-2">{lang[26]}</p>
          <p className="mt-2">{lang[27]}</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${tech_N1}}{${tech_D1}} ${action} \\dfrac{${formData.tech_N2}}{${formData.tech_D2}} ${action1} \\dfrac{${tech_N3}}{${tech_D3}} ${action2} \\dfrac{${tech_N4}}{${tech_D4}} = ?`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[28]}</p>
      <div className="text-center mt-2">
        <BlockMath
          math={`= \\dfrac{(${formData.tech_N2})\\times(${tech_N3})\\times(${tech_N4})}{(${formData.tech_D2})\\times(${tech_D3})\\times(${tech_D4})}`}
        />
      </div>
      <div className="text-center mt-2">
        <BlockMath math={`= \\dfrac{${tech_N2}}{${tech_D2}}`} />
      </div>

      <p className="mt-2">Now,</p>
      <div className="text-center mt-2">
        <BlockMath math={`\\dfrac{${tech_N1}}{${tech_D1}} ${action} \\dfrac{${tech_N2}}{${tech_D2}} = ?`} />
      </div>

      {showLCD && (
        <>
          <p className="mt-2">{lang[30]}</p>
          <p className="mt-2 text-blue">
            LCD({tech_N1}/{tech_D1}, {tech_N2}/{tech_D2}) = {lcd}
          </p>
          <p className="mt-2">{lang[31]}</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\left(\\dfrac{${tech_N1}}{${tech_D1}} \\times \\dfrac{${mul1}}{${mul1}}\\right) ${action} \\left(\\dfrac{${tech_N2}}{${tech_D2}} \\times \\dfrac{${mul2}}{${mul2}}\\right)`}
            />
          </div>
          <p className="mt-2">{lang[32]}</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\left(\\dfrac{${tech_N1 * mul1}}{${tech_D1 * mul1}}\\right) ${action} \\left(\\dfrac{${tech_N2 * mul2}}{${tech_D2 * mul2}}\\right)`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[35]}</p>
      <div className="text-center mt-2">
        <BlockMath math={`\\dfrac{${resultNumerator}}{${finalDenominator}}`} />
      </div>

      {commonFactor !== 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {resultNumerator} {lang[12]} {finalDenominator} {lang[19]}
          </p>
          <p className="text-blue mt-2">GCF({resultNumerator}, {finalDenominator}) = {commonFactor}</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${resultNumerator} \\div ${commonFactor}}{${finalDenominator} \\div ${commonFactor}} = ${
                btm !== 1 ? `\\dfrac{${upr}}{${btm}}` : upr
              }`}
            />
          </div>
        </>
      )}

      {isImproper && remainder !== 0 ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${upr}}{${btm}}`} />
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`${upr} \\div ${btm}`} />
          </div>
          <p className="mt-2">{lang[22]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${upr}}{${btm}} = ${whole} \\dfrac{${remainder}}{${btm}}`} />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2">{lang[23]}</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${tech_N1}}{${tech_D1}} ${action} \\dfrac{${tech_N2}}{${tech_D2}} = ${
                btm !== 1 ? `\\dfrac{${upr}}{${btm}}` : upr
              }`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FourAddMulDiv;
