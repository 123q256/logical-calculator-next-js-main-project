import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const gcd = (a, b) => {
  while (b) [a, b] = [b, a % b];
  return a;
};

const lcm = (arr) => {
  const lcm_two = (a, b) => (!a || !b) ? 0 : Math.abs(a * b) / gcd(a, b);
  return arr.reduce((a, b) => lcm_two(a, b));
};

const FourMulSubAdd = ({ formData, lang, result }) => {
  let {
    tech_N1: N1,
    tech_D1: D1,
    tech_N2: rawN2,
    tech_D2: rawD2,
    tech_N3: N3,
    tech_D3: D3,
    tech_N4: N4,
    tech_D4: D4,
    tech_action: rawAction,
    tech_action1: action1,
    tech_action2: action2,
  } = formData;

  let N2 = rawN2;
  let D2 = rawD2;
  let act = rawAction;
  let oaction = rawAction;
  let n2 = rawN2;
  let d2 = rawD2;
  let action = rawAction;
  let steps = [];
  let stepCount = 0; // Key के लिए unique identifier

  if (rawAction === '÷') {
    [N2, D2] = [rawD2, rawN2];
    n2 = N2;
    d2 = D2;
    act = rawAction;
    oaction = rawAction;
    action = '×';
    steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[26]}.</p>);
    steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[27]}.</p>);
    steps.push(
      <p className="text-center mt-2" key={`step-${stepCount++}`}>
        <BlockMath math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} = ?`} />
      </p>
    );
  }

  let up = N1 * N2;
  let btm = D1 * D2;
  let gcdVal = gcd(up, btm);
  let simplifiedUp = up;
  let simplifiedBtm = btm;

  if (gcdVal !== 1) {
    simplifiedUp = up / gcdVal;
    simplifiedBtm = btm / gcdVal;
  }

  steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[28]}.</p>);
  steps.push(
    <div className="text-center mt-2" key={`step-${stepCount++}`}>
      <BlockMath math={`\\dfrac{${N1}\\times${N2}}{${D1}\\times${D2}} = \\dfrac{${up}}{${btm}}`} />
    </div>
  );

  if (gcdVal !== 1) {
    steps.push(
      <React.Fragment key={`step-${stepCount++}`}>
        <p className="mt-2">{lang[18]} {up} {lang[12]} {btm} {lang[19]}</p>
        <p className="mt-2">
          <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">GCF({up}, {btm}) = {gcdVal}</a>
        </p>
        <div className="text-center mt-2">
          <BlockMath math={`\\dfrac{${up} \\div ${gcdVal}}{${btm} \\div ${gcdVal}} = ${simplifiedBtm !== 1 && simplifiedUp !== 0 ? `\\dfrac{${simplifiedUp}}{${simplifiedBtm}}` : `${simplifiedUp}`}`} />
        </div>
      </React.Fragment>
    );
  }

  steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[23]}:</p>);
  steps.push(
    <div className="text-center mt-2" key={`step-${stepCount++}`}>
      <BlockMath math={`\\dfrac{${formData.tech_N1}}{${formData.tech_D1}} ${act} \\dfrac{${n2}}{${d2}} = ${simplifiedBtm !== 1 && simplifiedUp !== 0 ? `\\dfrac{${simplifiedUp}}{${simplifiedBtm}}` : `${simplifiedUp}`}`} />
    </div>
  );

  steps.push(
    <p className="mt-2" key={`step-${stepCount++}`}>
      {lang[29]} {action1} and {action2} {lang[25]}
    </p>
  );

  N1 = simplifiedUp;
  D1 = simplifiedBtm;
  N2 = N3;
  D2 = D3;
  action = action1;

  steps.push(
    <div className="text-center mt-2" key={`step-${stepCount++}`}>
      <BlockMath math={`\\dfrac{${N1}}{${D1}} ${action1} \\dfrac{${N2}}{${D2}} ${action2} \\dfrac{${N4}}{${D4}} = ?`} />
    </div>
  );

  if (D1 !== D2 || D1 !== D4) {
    const mul_lcm = lcm([D1, D2, D4]);
    const mul1 = mul_lcm / D1;
    const mul2 = mul_lcm / D2;
    const mul4 = mul_lcm / D4;

    const val1 = N1 * mul1;
    const val2 = N2 * mul2;
    const val4 = N4 * mul4;

    let plus = action1 === '+' ? val1 + val2 : val1 - val2;
    plus = action2 === '+' ? plus + val4 : plus - val4;

    steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[14]}.</p>);
    steps.push(
      <p className="mt-2" key={`step-${stepCount++}`}>
        <a href={`lcd-calculator/?res_link=0&x=${encodeURIComponent(`${N1}/${D1},${N2}/${D2},${N4}/${D4}`)}`} className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
          LCD({`${N1}/${D1},${N2}/${D2},${N4}/${D4}`}) = {mul_lcm}
        </a>
      </p>
    );
    steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[15]}</p>);
    steps.push(
      <div className="text-center mt-2" key={`step-${stepCount++}`}>
        <BlockMath math={`= \\left(\\dfrac{${N1}}{${D1}} \\times \\dfrac{${mul1}}{${mul1}}\\right) ${action1} \\left(\\dfrac{${N2}}{${D2}} \\times \\dfrac{${mul2}}{${mul2}}\\right) ${action2} \\left(\\dfrac{${N4}}{${D4}} \\times \\dfrac{${mul4}}{${mul4}}\\right)`} />
      </div>
    );

    steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[16]}</p>);
    steps.push(
      <div className="text-center mt-2" key={`step-${stepCount++}`}>
        <BlockMath math={`=\\dfrac{${val1} ${action1} ${val2} ${action2} ${val4}}{${mul_lcm}}`} />
      </div>
    );
    steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[17]}</p>);
    steps.push(
      <div className="text-center mt-2" key={`step-${stepCount++}`}>
        <BlockMath math={`= \\dfrac{${plus}}{${mul_lcm}}`} />
      </div>
    );
  } else {
    let plus = action1 === '+' ? N1 + N2 : N1 - N2;
    plus = action2 === '+' ? plus + N4 : plus - N4;

    steps.push(<p className="mt-2" key={`step-${stepCount++}`}>{lang[17]}</p>);
    steps.push(
      <div className="text-center mt-2" key={`step-${stepCount++}`}>
        <BlockMath math={`= \\dfrac{${N1} ${action1} ${N2} ${action2} ${N4}}{${D1}}`} />
      </div>
    );
    steps.push(
      <div className="text-center mt-2" key={`step-${stepCount++}`}>
        <BlockMath math={`= \\dfrac{${plus}}{${D1}}`} />
      </div>
    );
  }

  // Destructure numerator and denominator from result safely:
  const tech_upr = result?.data?.tech_upr ?? 0;
  const tech_btm = result?.data?.tech_btm ?? 1;

  // Calculate mixed fraction parts:
  const isImproperFraction = tech_upr > tech_btm;
  const remainder = tech_upr % tech_btm;
  const wholePart = Math.floor(tech_upr / tech_btm);

  return (
    <>
      <div className='col-span-12'>
        <p className="mt-2" key={`step-${stepCount++}`}>
          So we are having three different operations in the problem given. But first, we will work on × operation
        </p>
        {steps}

        {/* GCF Section */}
        {gcdVal !== 1 && (
          <React.Fragment key={`step-${stepCount++}`}>
            <p className="mt-2">
              {lang[18]} {tech_upr} {lang[12]} {tech_btm} {lang[19]}
            </p>
            <p className="mt-2">
              <a href="gcf-calculator/" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
                GCF({tech_upr}, {tech_btm}) = {gcdVal}
              </a>
            </p>
            <div className="text-center mt-2">
              <BlockMath
                math={`\\dfrac{${tech_upr} \\div ${gcdVal}}{${tech_btm} \\div ${gcdVal}} = ${
                  tech_btm / gcdVal !== 1 && tech_upr / gcdVal !== 0
                    ? `\\dfrac{${tech_upr / gcdVal}}{${tech_btm / gcdVal}}`
                    : `${tech_upr / gcdVal}`
                }`}
              />
            </div>
          </React.Fragment>
        )}

        {/* Improper Fraction / Mixed Fraction Section */}
        {tech_btm !== 1 && tech_upr !== 0 && isImproperFraction ? (
          <React.Fragment key={`step-${stepCount++}`}>
            <p className="mt-2">{lang[20]}</p>
            <div className="text-center mt-2">
              <BlockMath math={`\\dfrac{${tech_upr}}{${tech_btm}}`} />
            </div>
            <p className="mt-2">{lang[21]}</p>
            <div className="text-center mt-2">
              <BlockMath math={`${tech_upr} \\div ${tech_btm}`} />
            </div>

            {remainder !== 0 && (
              <React.Fragment key={`step-${stepCount++}`}>
                <p className="mt-2">{lang[22]}:</p>
                <div className="text-center mt-2">
                  <BlockMath
                    math={`\\dfrac{${tech_upr}}{${tech_btm}} = ${wholePart} \\dfrac{${remainder}}{${tech_btm}}`}
                  />
                </div>
                <p className="mt-2">{lang[23]}:</p>
                <div className="text-center mt-2">
                  <BlockMath
                    math={`\\dfrac{${formData?.tech_N1}}{${formData?.tech_D1}} ${act} \\dfrac{${formData?.tech_N2}}{${formData?.tech_D2}} ${action1} \\dfrac{${formData?.tech_N3}}{${formData?.tech_D3}} ${action2} \\dfrac{${formData?.tech_N4}}{${formData?.tech_D4}} = ${wholePart} \\dfrac{${remainder}}{${tech_btm}}`}
                  />
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment key={`step-${stepCount++}`}>
            <p className="mt-2">{lang[23]}:</p>
            <div className="text-center mt-2">
              <BlockMath
                math={`\\dfrac{${N1}}{${D1}} ${act} \\dfrac{${N2}}{${D2}} ${action1} \\dfrac{${N3}}{${D3}} ${action2} \\dfrac{${N4}}{${D4}} = ${
                  tech_btm !== 1 && tech_upr !== 0 ? `\\dfrac{${tech_upr}}{${tech_btm}}` : `${tech_upr}`
                }`}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </>
  );
};

export default FourMulSubAdd;