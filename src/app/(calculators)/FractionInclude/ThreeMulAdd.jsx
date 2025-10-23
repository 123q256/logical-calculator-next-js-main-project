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

const ThreeMulAdd = ({ formData, lang, result }) => {
  // Destructure inputs from formData
  let { 
    tech_N1: N1, tech_D1: D1, 
    tech_N2: N2, tech_D2: D2,
    tech_N3: N3, tech_D3: D3,
    tech_action: action,
    tech_action1: action1
  } = formData;

  // Convert all to numbers just in case
  N1 = Number(N1);
  D1 = Number(D1);
  N2 = Number(N2);
  D2 = Number(D2);
  N3 = Number(N3);
  D3 = Number(D3);

  let n2, d2, act, oaction;
  let up, btm, gcdVal;

  // Copy originals for later
  let ON2 = N2;
  let OD2 = D2;

  if (action === "÷") {
    // Reciprocal for division
    n2 = D2;
    d2 = N2;
    act = action;
    oaction = action;
    action = "×";
  } else {
    n2 = N2;
    d2 = D2;
    act = action;
    oaction = action;
  }

  if (action === "of") {
    oaction = action;
    action = "×";
  }

  up = N1 * n2;
  btm = D1 * d2;

  // Simplify fraction up/btm if gcd != 1
  gcdVal = gcd(up, btm);
  let simplifiedUp = up;
  let simplifiedBtm = btm;
  if (gcdVal !== 1) {
    simplifiedUp = up / gcdVal;
    simplifiedBtm = btm / gcdVal;
  }

  // Now, prepare for the second operation:
  // Use result data if available
  let plus = null;
  let mul1 = 1,
    mul2 = 1;
  let N1_after = simplifiedUp;
  let D1_after = simplifiedBtm;
  let N2_after = N3;
  let D2_after = D3;
  let action_after = action1;

  // Calculate LCD if denominators differ
  let lcd = null;
  if (D1_after !== D2_after) {
    // Try to get LCD from result object if present, else calculate
    lcd = result?.data?.tech_lcd ?? (D1_after * D2_after / gcd(D1_after, D2_after));
    mul1 = lcd / D1_after;
    mul2 = lcd / D2_after;

    if (action_after === "+") {
      plus = N1_after * mul1 + N2_after * mul2;
    } else if (action_after === "-") {
      plus = N1_after * mul1 - N2_after * mul2;
    }
  } else {
    mul1 = 1;
    mul2 = 1;
    if (action_after === "+") {
      plus = N1_after + N2_after;
    } else if (action_after === "-") {
      plus = N1_after - N2_after;
    }
    lcd = D1_after; // same denominator
  }

  // Simplify the final fraction if possible
  let finalGcd = gcd(plus, lcd);
  let finalUp = plus;
  let finalBtm = lcd;
  if (finalGcd !== 1) {
    finalUp = plus / finalGcd;
    finalBtm = lcd / finalGcd;
  }

  // Handle mixed fraction if numerator > denominator
  let mixedWhole = null;
  let mixedNumerator = null;
  if (finalUp > finalBtm) {
    mixedWhole = Math.floor(finalUp / finalBtm);
    mixedNumerator = finalUp % finalBtm;
  }

  return (
    <div className="col-span-12">
      <p className="mt-2">
        <b>
          {lang[24]} {oaction} {lang[25]}
        </b>
      </p>

      {action === "×" && oaction === "÷" && (
        <>
          <p className="mt-2">{lang[26]}.</p>
          <p className="mt-2">{lang[27]}.</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${N1}}{${D1}} \\times \\dfrac{${n2}}{${d2}} = ?`} />
          </div>
        </>
      )}

      <p className="mt-2">{lang[28]}.</p>

      <div className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${N1} \\times ${n2}}{${D1} \\times ${d2}} = \\dfrac{${up}}{${btm}}`}
        />
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
                simplifiedBtm !== 1 ? `\\dfrac{${simplifiedUp}}{${simplifiedBtm}}` : simplifiedUp
              }`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[23]}:</p>
      <div className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${N1}}{${D1}} ${act} \\dfrac{${n2}}{${d2}} = ${
            simplifiedBtm !== 1 ? `\\dfrac{${simplifiedUp}}{${simplifiedBtm}}` : simplifiedUp
          }`}
        />
      </div>

      <p className="mt-2">
        <b>
          {lang[29]} {action1} {lang[25]}
        </b>
      </p>

      <div className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${simplifiedUp}}{${simplifiedBtm}} ${action1} \\dfrac{${N3}}{${D3}} = ?`}
        />
      </div>

      {D1_after !== D2_after ? (
        <>
          <p className="mt-2">{lang[30]}.</p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              LCD({`${N1_after}/${D1_after}, ${N2_after}/${D2_after}`}) = {lcd}
            </a>
          </p>
          <p className="mt-2">{lang[31]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\left(\\dfrac{${N1_after}}{${D1_after}} \\times \\dfrac{${mul1}}{${mul1}} \\right) ${action1} \\left(\\dfrac{${N2_after}}{${D2_after}} \\times \\dfrac{${mul2}}{${mul2}} \\right) = ?`}
            />
          </div>
          <p className="mt-2">{lang[32]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\left(\\dfrac{${N1_after * mul1}}{${D1_after * mul1}} \\right) ${action1} \\left(\\dfrac{${N2_after * mul2}}{${D2_after * mul2}} \\right) = ?`}
            />
          </div>
          <p className="mt-2">
            {lang[33]} {action1 === "+" ? "+" : "-"} {lang[34]}. <br /> {lang[35]}:
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${N1_after * mul1} ${action1} ${N2_after * mul2}}{${D1_after * mul1}} = \\dfrac{${plus}}{${D1_after * mul1}}`}
            />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2">{lang[17]}. <br /> {lang[35]}:</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${N1_after} ${action1} ${N2_after}}{${D1_after}} = \\dfrac{${plus}}{${D1_after}}`}
            />
          </div>
        </>
      )}

      {finalGcd !== 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {plus} {lang[12]} {lcd} {lang[19]}
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              GCF({plus}, {lcd}) = {finalGcd}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${plus} \\div ${finalGcd}}{${lcd} \\div ${finalGcd}} = ${
                finalBtm !== 1 ? `\\dfrac{${finalUp}}{${finalBtm}}` : finalUp
              }`}
            />
          </div>
        </>
      )}

      {finalBtm !== 1 && finalUp !== 0 && finalUp > finalBtm ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${finalUp}}{${finalBtm}}`} />
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`${finalUp} \\div ${finalBtm}`} />
          </div>
          {mixedNumerator !== 0 && (
            <>
              <p className="mt-2">{lang[22]}:</p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${finalUp}}{${finalBtm}} = ${mixedWhole} \\dfrac{${mixedNumerator}}{${finalBtm}}`}
                />
              </div>
              <p className="mt-2">{lang[23]}:</p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${N1}}{${D1}} ${act} \\dfrac{${n2}}{${d2}} ${action1} \\dfrac{${N3}}{${D3}} = ${mixedWhole} \\dfrac{${mixedNumerator}}{${finalBtm}}`}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <p className="mt-2">{lang[23]}:</p>
      )}

      {!(
        finalBtm !== 1 &&
        finalUp !== 0 &&
        finalUp > finalBtm &&
        mixedNumerator !== 0
      ) && (
        <div className="text-center mt-2">
          <BlockMath
            math={`\\dfrac{${N1}}{${D1}} ${act} \\dfrac{${n2}}{${d2}} ${action1} \\dfrac{${N3}}{${D3}} = ${
              finalBtm !== 1 ? `\\dfrac{${finalUp}}{${finalBtm}}` : finalUp
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ThreeMulAdd;
