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

const ThreeDivSub = ({ formData, lang, result }) => {
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

  // Convert all to numbers
  N1 = Number(N1);
  D1 = Number(D1);
  N2 = Number(N2);
  D2 = Number(D2);
  N3 = Number(N3);
  D3 = Number(D3);

  let n3 = N3,
    d3 = D3,
    act1 = action1,
    oaction1 = null;

  // Handle division: flip numerator & denominator if action1 is divide
  if (action1 === "÷") {
    [n3, d3] = [d3, n3];
    oaction1 = action1;
    act1 = "×";
  }

  // Calculate numerator and denominator after multiplication
  let up = N2 * n3;
  let btm = D2 * d3;

  // Simplify fraction
  const gcdVal = gcd(up, btm);
  const simpUp = gcdVal !== 1 ? up / gcdVal : up;
  const simpBtm = gcdVal !== 1 ? btm / gcdVal : btm;

  // Variables for later addition/subtraction step
  let n2 = N2,
    d2 = D2,
    n1 = N1,
    d1 = D1,
    act = action;

  // If you want to adjust result or do mixed fractions, you can do similarly as before
  const plus =
    action === "+"
      ? (n1 * (result?.data?.tech_lcd / d1 || 1)) +
        (simpUp * (result?.data?.tech_lcd / simpBtm || 1))
      : action === "-"
      ? (n1 * (result?.data?.tech_lcd / d1 || 1)) -
        (simpUp * (result?.data?.tech_lcd / simpBtm || 1))
      : null;

  // Handle simplified plus and denominator if result provided:
  const gcdPlus = gcd(plus || 0, (result?.data?.tech_lcd || d1) || 1);

  return (
    <div className="col-span-12 space-y-4 text-center">
      <p className="mt-2">
        <b>
          {lang[24]} {act1} {lang[25]}
        </b>
      </p>

      {action1 === "÷" && (
        <>
          <p className="mt-2">{lang[26]}.</p>
          <p className="mt-2">{lang[27]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${N2}}{${D2}} ${act1} \\dfrac{${n3}}{${d3}} = ?`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[28]}.</p>

      <div className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${N2} \\times ${n3}}{${D2} \\times ${d3}} = \\dfrac{${up}}{${btm}}`}
        />
      </div>

      {gcdVal !== 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {up} and {btm} {lang[19]}
          </p>
          <p className="mt-2">
            <a
              href="#"
              className="text-blue text-decoration-none"
              target="_blank"
              rel="noreferrer"
            >
              GCF({up}, {btm}) = {gcdVal}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${up} \\div ${gcdVal}}{${btm} \\div ${gcdVal}} = ${
                simpBtm !== 1 ? `\\dfrac{${simpUp}}{${simpBtm}}` : simpUp
              }`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[23]}:</p>
      <div className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${N2}}{${D2}} ${act1} \\dfrac{${n3}}{${d3}} = ${
            simpBtm !== 1 ? `\\dfrac{${simpUp}}{${simpBtm}}` : simpUp
          }`}
        />
      </div>

      <p className="mt-2">
        <b>
          {lang[29]} {act} {lang[25]}
        </b>
      </p>

      <div className="text-center mt-2">
        <BlockMath math={`\\dfrac{${N1}}{${D1}} ${act} \\dfrac{${simpUp}}{${simpBtm}} = ?`} />
      </div>

      {D1 !== simpBtm && (
        <>
          <p className="mt-2">{lang[30]}.</p>
          <p className="mt-2">
            <a
              href="#"
              className="text-blue text-decoration-none"
              target="_blank"
              rel="noreferrer"
            >
              LCD({`${N1}/${D1},${simpUp}/${simpBtm}`}) = {result?.data?.tech_lcd}
            </a>
          </p>
          <p className="mt-2">{lang[31]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\left( \\dfrac{${N1}}{${D1}} \\times \\dfrac{${result?.data?.tech_lcd / D1}}{${result?.data?.tech_lcd / D1}} \\right) ${act} \\left( \\dfrac{${simpUp}}{${simpBtm}} \\times \\dfrac{${result?.data?.tech_lcd / simpBtm}}{${result?.data?.tech_lcd / simpBtm}} \\right) = ?`}
            />
          </div>
          <p className="mt-2">{lang[32]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\left( \\dfrac{${N1 * (result?.data?.tech_lcd / D1)}}{${D1 * (result?.data?.tech_lcd / D1)}} \\right) ${act} \\left( \\dfrac{${simpUp * (result?.data?.tech_lcd / simpBtm)}}{${simpBtm * (result?.data?.tech_lcd / simpBtm)}} \\right) = ?`}
            />
          </div>
          <p className="mt-2">
            {lang[33]} {act === "+" ? "+" : "-"} {lang[34]}. <br /> {lang[35]}:
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${N1 * (result?.data?.tech_lcd / D1)} ${act} ${
                simpUp * (result?.data?.tech_lcd / simpBtm)
              }}{${D1 * (result?.data?.tech_lcd / D1)}} = \\dfrac{${plus}}{${
                D1 * (result?.data?.tech_lcd / D1)
              }}`}
            />
          </div>
        </>
      )}

      {D1 === simpBtm && (
        <>
          <p className="mt-2">{lang[17]}. <br /> {lang[35]}:</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${N1} ${act} ${simpUp}}{${D1}} = \\dfrac{${plus}}{${D1}}`}
            />
          </div>
        </>
      )}

      {/* For GCF of addition/subtraction result */}
      {gcdPlus !== 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {plus} {lang[12]} {D1 * (result?.data?.tech_lcd || 1)} {lang[19]}
          </p>
          <p className="mt-2">
            <a
              href="#"
              className="text-blue text-decoration-none"
              target="_blank"
              rel="noreferrer"
            >
              GCF({plus}, {D1 * (result?.data?.tech_lcd || 1)}) = {gcdPlus}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${plus} \\div ${gcdPlus}}{${D1 * (result?.data?.tech_lcd || 1)} \\div ${gcdPlus}} = ${
                result?.data?.tech_btm !== 1 && result?.data?.tech_upr !== 0
                  ? `\\dfrac{${result.data.tech_upr}}{${result.data.tech_btm}}`
                  : result?.data?.tech_upr ?? plus / gcdPlus
              }`}
            />
          </div>
        </>
      )}

      {/* If improper fraction > 1 */}
      {result?.data?.tech_btm !== 1 &&
      result?.data?.tech_upr !== 0 &&
      result?.data?.tech_upr > result?.data?.tech_btm ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${result.data.tech_upr}}{${result.data.tech_btm}}`}
            />
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`${result.data.tech_upr} \\div ${result.data.tech_btm}`} />
          </div>
          {result.data.tech_upr % result.data.tech_btm !== 0 && (
            <>
              <p className="mt-2">{lang[22]}:</p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${result.data.tech_upr}}{${result.data.tech_btm}} = ${
                    Math.floor(result.data.tech_upr / result.data.tech_btm)
                  } \\dfrac{${Math.abs(
                    result.data.tech_upr % result.data.tech_btm
                  )}}{${result.data.tech_btm}}`}
                />
              </div>
              <p className="mt-2">{lang[23]}:</p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${n1}}{${d1}} ${act} \\dfrac{${n2}}{${d2}} ${act1} \\dfrac{${d3}}{${n3}} = ${
                    Math.floor(result.data.tech_upr / result.data.tech_btm)
                  } \\dfrac{${Math.abs(result.data.tech_upr % result.data.tech_btm)}}{${result.data.tech_btm}}`}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <p className="mt-2">{lang[23]}:</p>
      )}

      {/* Default simplified fraction display */}
      {(!result?.data?.tech_upr ||
        !result?.data?.tech_btm ||
        result.data.tech_upr <= result.data.tech_btm) && (
        <div className="text-center mt-2">
          <BlockMath
            math={`\\dfrac{${n1}}{${d1}} ${act} \\dfrac{${n2}}{${d2}} ${act1} \\dfrac{${d3}}{${n3}} = ${
              result?.data?.tech_btm !== 1 && result?.data?.tech_upr !== 0
                ? `\\dfrac{${result.data.tech_upr}}{${result.data.tech_btm}}`
                : result?.data?.tech_upr ?? plus
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ThreeDivSub;
