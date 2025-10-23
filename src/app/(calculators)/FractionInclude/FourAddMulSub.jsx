import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function lcmOfThree(a, b, c) {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const lcm = (x, y) => (x * y) / gcd(x, y);
  return lcm(a, lcm(b, c));
}

function gcdCalc(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

function calculateFinal(up, n1, N4, action, action2) {
  let result = 0;
  if (action === "+") result = n1 + up;
  else if (action === "-") result = n1 - up;

  if (action2 === "+") result += N4;
  else if (action2 === "-") result -= N4;

  return result;
}

const FourAddMulSub = ({ formData, result, lang }) => {
  const steps = [];

  // Destructure inputs
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

  // Keep originals for final display
  const ON1 = N1, OD1 = D1;
  const ON2 = N2, OD2 = D2;
  const ON3 = N3, OD3 = D3;
  const ON4 = N4, OD4 = D4;
  const oaction = action, oaction1 = action1, oaction2 = action2;

  // If second operation is division, invert fraction and convert to multiplication
  if (action1 === "÷") {
    [N3, D3] = [D3, N3]; // invert fraction
    action1 = "×";
    steps.push(<p className="mt-2" key="step-26">{lang[26]}.</p>);
    steps.push(<p className="mt-2" key="step-27">{lang[27]}.</p>);
  }

  // Calculate multiplication numerator and denominator (N2/N3 * N3/D3)
  let up = N2 * N3;
  let btm = D2 * D3;

  steps.push(<p className="mt-2" key="step-28">{lang[28]}.</p>);
  steps.push(
    <p className="text-center mt-2" key="step-mul-result">
      <BlockMath math={`\\dfrac{${N2} \\times ${N3}}{${D2} \\times ${D3}} = \\dfrac{${up}}{${btm}}`} />
    </p>
  );

  // Simplify fraction by GCF
  let gcf = gcdCalc(up, btm);
  if (gcf != 1) {
    steps.push(
      <React.Fragment key="step-gcf">
        <p className="mt-2">{lang[18]} {up} {lang[12]} {btm} {lang[19]}</p>
        <p className="mt-2">
          <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
            GCF({up},{btm}) = {gcf}
          </a>
        </p>
        <div className="text-center mt-2">
          <BlockMath math={`\\dfrac{${up} \\div ${gcf}}{${btm} \\div ${gcf}} = \\dfrac{${up / gcf}}{${btm / gcf}}`} />
        </div>
      </React.Fragment>
    );
    up = up / gcf;
    btm = btm / gcf;
  }

  steps.push(
    <p className="mt-2" key="step-lang-23">
      {lang[23]}:
    </p>
  );
  steps.push(
    <div className="text-center mt-2" key="step-23-fraction">
      <BlockMath math={`\\dfrac{${N2}}{${D2}} ${action1} \\dfrac{${N3}}{${D3}} = \\dfrac{${up}}{${btm}}`} />
    </div>
  );

  // Check if LCD is needed for final addition/subtraction with N1/D1 and N4/D4
  const isLcdRequired = D1 != btm || D1 != D4;

  let plus, mul1, mul2, mul4, lcd;

  if (isLcdRequired) {
    lcd = lcmOfThree(D1, btm, D4);
    mul1 = lcd / D1;
    mul2 = lcd / btm;
    mul4 = lcd / D4;

    steps.push(
      <React.Fragment key="lcd-steps">
        <p className="mt-2">{lang[14]}.</p>
        <p className="mt-2">
          <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
            LCD({N1}/{D1}, {up}/{btm}, {N4}/{D4}) = {lcd}
          </a>
        </p>
        <p className="mt-2">{lang[15]}.</p>
        <div className="text-center mt-2">
          <BlockMath
            math={`= \\left(\\dfrac{${N1}}{${D1}} \\times \\dfrac{${mul1}}{${mul1}}\\right) ${action} \\left(\\dfrac{${up}}{${btm}} \\times \\dfrac{${mul2}}{${mul2}}\\right) ${action2} \\left(\\dfrac{${N4}}{${D4}} \\times \\dfrac{${mul4}}{${mul4}}\\right)`}
          />
        </div>
        <p className="mt-2">{lang[16]}.</p>
        <div className="text-center mt-2">
          <BlockMath
            math={`= \\dfrac{${N1 * mul1} ${action} ${up * mul2} ${action2} ${N4 * mul4}}{${lcd}}`}
          />
        </div>
      </React.Fragment>
    );

    // Calculate final numerator `plus`
    if (action === "+") plus = N1 * mul1 + up * mul2;
    else if (action === "-") plus = N1 * mul1 - up * mul2;

    if (action2 === "+") plus += N4 * mul4;
    else if (action2 === "-") plus -= N4 * mul4;

    steps.push(
      <p className="mt-2" key="step-final-plus">
        {lang[17]}.
      </p>
    );
    steps.push(
      <div className="text-center mt-2" key="step-final-fraction">
        <BlockMath math={`= \\dfrac{${plus}}{${lcd}}`} />
      </div>
    );

  } else {
    // No LCD needed
    mul1 = 1;
    plus = calculateFinal(up, N1, N4, action, action2);

    steps.push(
      <p className="mt-2" key="step-final-plus">
        {lang[17]}.
      </p>
    );
    steps.push(
      <div className="text-center mt-2" key="step-final-fraction">
        <BlockMath math={`= \\dfrac{${plus}}{${D1}}`} />
      </div>
    );
  }

  // Display GCF simplification for final fraction if applicable
  let finalDenominator = isLcdRequired ? lcd : D1;
  let finalGcf = gcdCalc(plus, finalDenominator);

  return (
    <>
      <div className="col-span-12">
        <p className="mt-2">
          So we are having three different operations in the problem given. But first, we will work on × operation
        </p>
        {steps}
      </div>

      {/* Show GCF simplification if needed */}
      {finalGcf != 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {plus} {lang[12]} {finalDenominator} {lang[19]}
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              GCF({plus}, {finalDenominator}) = {finalGcf}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${plus} \\div ${finalGcf}}{${finalDenominator} \\div ${finalGcf}} = ${
                result?.data?.tech_btm != 1 && result?.data?.tech_upr != 0
                  ? `\\dfrac{${result.data.tech_upr}}{${result.data.tech_btm}}`
                  : `${result?.data?.tech_upr}`
              }`}
            />
          </div>
        </>
      )}

      {/* Display improper fraction as mixed fraction */}
      {result?.data?.tech_btm != 1 &&
       result?.data?.tech_upr != 0 &&
       result?.data?.tech_upr > result?.data?.tech_btm ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${result.data.tech_upr}}{${result.data.tech_btm}}`} />
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`${result.data.tech_upr} \\div ${result.data.tech_btm}`} />
          </div>
          {result.data.tech_upr % result.data.tech_btm != 0 && (
            <>
              <p className="mt-2">{lang[22]}:</p>
              {(() => {
                const bta = Math.abs(result.data.tech_upr % result.data.tech_btm);
                const shi = Math.floor(result.data.tech_upr / result.data.tech_btm);
                return (
                  <>
                    <div className="text-center mt-2">
                      <BlockMath
                        math={`\\dfrac{${result.data.tech_upr}}{${result.data.tech_btm}} = ${shi} \\dfrac{${bta}}{${result.data.tech_btm}}`}
                      />
                    </div>
                    <p className="mt-2">{lang[23]}:</p>
                    <div className="text-center mt-2">
                      <BlockMath
                        math={`\\dfrac{${N1}}{${D1}} ${oaction} \\dfrac{${N2}}{${D2}} ${oaction1} \\dfrac{${ON3}}{${OD3}} ${oaction2} \\dfrac{${ON4}}{${OD4}} = ${shi} \\dfrac{${bta}}{${result.data.tech_btm}}`}
                      />
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </>
      ) : (
        <>
          <p className="mt-2 w-full col-span-12">{lang[23]}:</p>
          <div className="text-center mt-2 col-span-12">
            <BlockMath
              math={`\\dfrac{${N1}}{${D1}} ${oaction} \\dfrac{${N2}}{${D2}} ${oaction1} \\dfrac{${ON3}}{${OD3}} ${oaction2} \\dfrac{${ON4}}{${OD4}} = ${
                result?.data?.tech_btm != 1 && result?.data?.tech_upr != 0
                  ? `\\dfrac{${result.data.tech_upr}}{${result.data.tech_btm}}`
                  : `${result?.data?.tech_upr}`
              }`}
            />
          </div>
        </>
      )}
    </>
  );
};

export default FourAddMulSub;
