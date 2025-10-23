import React from "react";
import { BlockMath } from "react-katex";

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcmOfArray(arr) {
  const gcdTwo = (a, b) => (!b ? a : gcdTwo(b, a % b));
  const lcmTwo = (a, b) => (a * b) / gcdTwo(a, b);

  return arr.reduce((acc, val) => lcmTwo(acc, val));
}

const FourAddSubMul = ({ formData, lang, result }) => {
  // Destructure
  let {
    tech_N1: N1,
    tech_D1: D1,
    tech_N2: N2,
    tech_D2: D2,
    tech_N3: N3,
    tech_D3: D3,
    tech_N4: N4,
    tech_D4: D4,
    tech_action: action,
    tech_action1: action1,
    tech_action2: action2,
  } = formData;

  // Store original fractions and actions for final output
  const ON1 = N1,
    OD1 = D1,
    ON2 = N2,
    OD2 = D2,
    ON3 = N3,
    OD3 = D3,
    ON4 = N4,
    OD4 = D4;
  const oaction = action,
    oaction1 = action1,
    oaction2 = action2;

  // If action2 is division, invert fraction N4/D4 and change action2 to multiplication
  if (action2 == "÷") {
    [N4, D4] = [D4, N4];
    action2 = "×";
  }

  // Calculate multiplication numerator and denominator for N3/D3 × N4/D4
  let up = N3 * N4;
  let btm = D3 * D4;

  // Simplify fraction up/btm by gcd if possible
  const g = gcd(up, btm);
  if (g != 1) {
    up = up / g;
    btm = btm / g;
  }

  // Now prepare to calculate addition/subtraction with N1/D1 and N2/D2 and product up/btm
  // Find if LCD required for denominators D1, D2, and btm
  const denominators = [D1, D2, btm];
  const lcd = lcmOfArray(denominators);

  // Calculate multipliers for each fraction
  const mul1 = lcd / D1;
  const mul2 = lcd / D2;
  const mul3 = lcd / btm;

  // Calculate the numerator for final addition/subtraction
  let plus;
  // first apply action with N1 and N2
  if (action == "+") plus = N1 * mul1 + N2 * mul2;
  else if (action == "-") plus = N1 * mul1 - N2 * mul2;
  // then apply action1 with product fraction
  if (action1 == "+") plus = plus + up * mul3;
  else if (action1 == "-") plus = plus - up * mul3;

  // Calculate gcd of final numerator and denominator to simplify final result
  const finalGcd = gcd(plus, lcd);

  // Simplify numerator and denominator by gcd
  const simpNum = plus / finalGcd;
  const simpDen = lcd / finalGcd;

  // Function to display fraction nicely using BlockMath
  const renderFraction = (num, den) =>
    den == 1 ? (
      <BlockMath math={`${num}`} />
    ) : (
      <BlockMath math={`\\dfrac{${num}}{${den}}`} />
    );

  // Check if result is improper fraction and can be mixed fraction
  const isImproper = simpNum > simpDen;

  // Calculate mixed fraction parts if improper
  const wholePart = Math.floor(simpNum / simpDen);
  const remainder = simpNum % simpDen;

  return (
    <div className="col-span-12">
      <p className="mt-2">
        So we are having three different operations in the problem given. But
        first, we will work on × operation
      </p>

      <p className="mt-2">
        {action2 == "÷"
          ? lang[26] + ". " + lang[27] + "."
          : null}
      </p>

      <div className="text-center mt-2">
        <BlockMath math={`\\dfrac{${N3}}{${D3}} \\times \\dfrac{${N4}}{${D4}} = \\dfrac{${N3 * N4}}{${D3 * D4}}`} />
      </div>

      {g != 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {up * g} {lang[12]} {btm * g} {lang[19]}
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              GCF({up * g},{btm * g}) = {g}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${up * g} \\div ${g}}{${btm * g} \\div ${g}} = \\dfrac{${up}}{${btm}}`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[23]}:</p>
      <div className="text-center mt-2">
        <BlockMath math={`\\dfrac{${N3}}{${D3}} ${action2} \\dfrac{${N4}}{${D4}} = \\dfrac{${up}}{${btm}}`} />
      </div>

      <p className="mt-2">
        {lang[29]} {action} and {action1} {lang[25]}
      </p>

      <div className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${ON1}}{${OD1}} ${action} \\dfrac{${ON2}}{${OD2}} ${action1} \\dfrac{${up}}{${btm}} = ?`}
        />
      </div>

      {D1 != D2 || D1 != btm ? (
        <>
          <p className="mt-2">{lang[14]}.</p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              LCD({ON1}/{OD1}, {ON2}/{OD2}, {up}/{btm}) = {lcd}
            </a>
          </p>
          <p className="mt-2">{lang[15]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`= \\left(\\dfrac{${ON1}}{${OD1}} \\times \\dfrac{${mul1}}{${mul1}}\\right) ${action} \\left(\\dfrac{${ON2}}{${OD2}} \\times \\dfrac{${mul2}}{${mul2}}\\right) ${action1} \\left(\\dfrac{${up}}{${btm}} \\times \\dfrac{${mul3}}{${mul3}}\\right)`}
            />
          </div>
          <p className="mt-2">{lang[16]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`= \\dfrac{${ON1 * mul1} ${action} ${ON2 * mul2} ${action1} ${up * mul3}}{${lcd}}`}
            />
          </div>
          <p className="mt-2">{lang[17]}.</p>
          <div className="text-center mt-2">
            <BlockMath math={`= \\dfrac{${plus}}{${lcd}}`} />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2">{lang[17]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`= \\dfrac{${plus}}{${D1}}`}
            />
          </div>
        </>
      )}

      {/* Final simplification */}
      {finalGcd != 1 && (
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
            {renderFraction(simpNum, simpDen)}
          </div>
        </>
      )}

      {/* Show mixed fraction if improper */}
      {isImproper ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="text-center mt-2">
            {renderFraction(simpNum, simpDen)}
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`${simpNum} \\div ${simpDen}`} />
          </div>
          {remainder != 0 && (
            <>
              <p className="mt-2">{lang[22]}:</p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${simpNum}}{${simpDen}} = ${wholePart} \\dfrac{${remainder}}{${simpDen}}`}
                />
              </div>
              <p className="mt-2">{lang[23]}:</p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${ON1}}{${OD1}} ${oaction} \\dfrac{${ON2}}{${OD2}} ${oaction1} \\dfrac{${ON3}}{${OD3}} ${oaction2} \\dfrac{${ON4}}{${OD4}} = ${wholePart} \\dfrac{${remainder}}{${simpDen}}`}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <div className="mt-2">
          {lang[23]}:
          <br />
          <BlockMath
            math={`\\dfrac{${ON1}}{${OD1}} ${oaction} \\dfrac{${ON2}}{${OD2}} ${oaction1} \\dfrac{${ON3}}{${OD3}} ${oaction2} \\dfrac{${ON4}}{${OD4}} = ${
              simpDen != 1 ? `\\dfrac{${simpNum}}{${simpDen}}` : simpNum
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default FourAddSubMul;
