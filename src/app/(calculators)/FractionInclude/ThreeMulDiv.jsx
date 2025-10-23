import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

const ThreeMulDiv = ({ formData, lang, result }) => {
  // Destructure inputs from formData
  let {
    tech_N1: N1,
    tech_D1: D1,
    tech_N2: N2,
    tech_D2: D2,
    tech_N3: N3,
    tech_D3: D3,
    tech_action: action,
    tech_action1: action1,
  } = formData;

  N1 = Number(N1);
  D1 = Number(D1);
  N2 = Number(N2);
  D2 = Number(D2);
  N3 = Number(N3);
  D3 = Number(D3);

  let oaction = null;

  // Handle division by flipping fractions and converting '÷' to '×'
  if (action === "÷") {
    [N2, D2] = [D2, N2];
    oaction = action;
    action = "×";
  }
  if (action1 === "÷") {
    [N3, D3] = [D3, N3];
    oaction = action1;
    action1 = "×";
  }

  // Calculate numerator and denominator of product
  const up = N1 * N2 * N3;
  const btm = D1 * D2 * D3;

  // Simplify fraction if gcd != 1
  const gcdVal = gcd(up, btm);
  const simplifiedUp = gcdVal !== 1 ? up / gcdVal : up;
  const simplifiedBtm = gcdVal !== 1 ? btm / gcdVal : btm;

  // Prepare for mixed fraction display if applicable
  let mixedWhole = null;
  let mixedNumerator = null;
  if (
    result?.data?.tech_upr &&
    result?.data?.tech_btm &&
    result?.data?.tech_upr > result?.data?.tech_btm &&
    result?.data?.tech_upr % result?.data?.tech_btm !== 0
  ) {
    mixedWhole = Math.floor(result?.data?.tech_upr / result?.data?.tech_btm);
    mixedNumerator = Math.abs(result?.data?.tech_upr % result?.data?.tech_btm);
  }

  return (
    <div className="col-span-12">
      {(action === "×" || action1 === "×") && oaction && (
        <>
          <p className="mt-2">{lang[26]}.</p>
          <p className="mt-2">{lang[27]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} ${action1} \\dfrac{${N3}}{${D3}} = ?`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[28]}.</p>
      <div className="text-center mt-2">
        <BlockMath
          math={`= \\dfrac{(${N1}) \\times (${N2}) \\times (${N3})}{${D1} \\times ${D2} \\times ${D3}}`}
        />
      </div>
      <div className="text-center mt-2">
        <BlockMath math={`= \\dfrac{${up}}{${btm}}`} />
      </div>

      {gcdVal !== 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {up} {lang[12]} {btm} {lang[19]}
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              GCF({up}, {btm}) = {gcdVal}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${up} \\div ${gcdVal}}{${btm} \\div ${gcdVal}} = ${
                result?.data?.tech_btm !== 1 && result?.data?.tech_upr !== 0
                  ? `\\dfrac{${result?.data?.tech_upr}}{${result?.data?.tech_btm}}`
                  : result?.data?.tech_upr ?? simplifiedUp
              }`}
            />
          </div>
        </>
      )}

      {result?.data?.tech_btm !== 1 && result?.data?.tech_upr !== 0 && result?.data?.tech_upr > result?.data?.tech_btm ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${result?.data?.tech_upr}}{${result?.data?.tech_btm}}`} />
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`${result?.data?.tech_upr} \\div ${result?.data?.tech_btm}`} />
          </div>
          {mixedNumerator !== 0 && (
            <>
              <p className="mt-2">{lang[22]}:</p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${result?.data?.tech_upr}}{${result?.data?.tech_btm}} = ${mixedWhole} \\dfrac{${mixedNumerator}}{${result?.data?.tech_btm}}`}
                />
              </div>
              <p className="mt-2">{lang[23]}:</p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} ${action1} \\dfrac{${N3}}{${D3}} = ${mixedWhole} \\dfrac{${mixedNumerator}}{${result?.data?.tech_btm}}`}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <p className="mt-2">{lang[23]}:</p>
      )}

      {(!result?.data?.tech_upr || !result?.data?.tech_btm || result?.data?.tech_upr <= result?.data?.tech_btm) && (
        <div className="text-center mt-2">
          <BlockMath
            math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} ${action1} \\dfrac{${N3}}{${D3}} = ${
              result?.data?.tech_btm !== 1 && result?.data?.tech_upr !== 0
                ? `\\dfrac{${result?.data?.tech_upr}}{${result?.data?.tech_btm}}`
                : result?.data?.tech_upr ?? simplifiedUp
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ThreeMulDiv;
