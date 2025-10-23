import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { evaluate } from 'mathjs';

const gcd = (a, b) => {
  while (b) [a, b] = [b, a % b];
  return Math.abs(a);
};

const FourAddSubAdd = ({ formData, lang, result }) => {
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
    tech_action2: action2
  } = formData;

  const lcd = result?.data?.tech_lcd;
  const techUpr = result?.data?.tech_upr;
  const techBtm = result?.data?.tech_btm;

  let explanation = [];
  let stepCount = 0; // Key के लिए unique identifier

  // Step 1: Handle negatives
  if (N2 < 0 || N3 < 0 || N4 < 0) {
    explanation.push(<p key={`step-${stepCount++}`} className="mt-2">{lang[5]}:</p>);
    if (N2 < 0) {
      N2 = Math.abs(N2);
      action = action === '+' ? '-' : '+';
    }
    if (N3 < 0) {
      N3 = Math.abs(N3);
      action1 = action1 === '+' ? '-' : '+';
    }
    if (N4 < 0) {
      N4 = Math.abs(N4);
      action2 = action2 === '+' ? '-' : '+';
    }

    explanation.push(
      <div key={`step-${stepCount++}`} className="text-center mt-2">
        <BlockMath
          math={`=\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} ${action1} \\dfrac{${N3}}{${D3}} ${action2} \\dfrac{${N4}}{${D4}}`}
        />
      </div>
    );
  }

  let mul1 = 1,
    mul2 = 1,
    mul3 = 1,
    mul4 = 1;

  if (D1 !== D2 || D1 !== D3 || D1 !== D4) {
    explanation.push(<p key={`step-${stepCount++}`} className="mt-2">{lang[14]}.</p>);
    explanation.push(
      <p key={`step-${stepCount++}`} className="mt-2">
        <a href="#" className="text-blue text-decoration-none">
          LCD({`${N1}/${D1},${N2}/${D2},${N3}/${D3},${N4}/${D4}`}) = {lcd}
        </a>
      </p>
    );
    explanation.push(<p key={`step-${stepCount++}`} className="mt-2">{lang[15]}.</p>);

    mul1 = lcd / D1;
    mul2 = lcd / D2;
    mul3 = lcd / D3;
    mul4 = lcd / D4;

    explanation.push(
      <div key={`step-${stepCount++}`} className="text-center mt-2">
        <BlockMath
          math={`= \\left(\\dfrac{${N1}}{${D1}} \\times \\dfrac{${mul1}}{${mul1}}\\right) ${action}
           \\left(\\dfrac{${N2}}{${D2}} \\times \\dfrac{${mul2}}{${mul2}}\\right) ${action1}
           \\left(\\dfrac{${N3}}{${D3}} \\times \\dfrac{${mul3}}{${mul3}}\\right) ${action2}
           \\left(\\dfrac{${N4}}{${D4}} \\times \\dfrac{${mul4}}{${mul4}}\\right)`}
        />
      </div>
    );
  }

  explanation.push(<p key={`step-${stepCount++}`} className="mt-2">{lang[17]}.</p>);

  const newN1 = N1 * mul1;
  const newN2 = N2 * mul2;
  const newN3 = N3 * mul3;
  const newN4 = N4 * mul4;
  const newD = D1 * mul1;

  explanation.push(
    <div key={`step-${stepCount++}`} className="text-center mt-2">
      <BlockMath
        math={`= \\dfrac{${newN1}}{${newD}} ${action} \\dfrac{${newN2}}{${newD}} ${action1} \\dfrac{${newN3}}{${newD}} ${action2} \\dfrac{${newN4}}{${newD}}`}
      />
    </div>
  );

  let expression = `${action === '+' ? newN1 + newN2 : newN1 - newN2} ${action1} ${newN3} ${action2} ${newN4}`;
  let plus = evaluate(expression);

  explanation.push(
    <div key={`step-${stepCount++}`} className="text-center mt-2">
      <BlockMath math={`= \\dfrac{${plus}}{${newD}}`} />
    </div>
  );

  // Simplify using GCF
  const GCF = gcd(plus, newD);
  if (GCF !== 1) {
    explanation.push(
      <p key={`step-${stepCount++}`} className="mt-2">
        {lang[18]} {plus} {lang[12]} {newD} {lang[19]}
      </p>
    );
    explanation.push(
      <p key={`step-${stepCount++}`} className="mt-2">
        <a href="#" className="text-blue text-decoration-none">
          GCF({plus}, {newD}) = {GCF}
        </a>
      </p>
    );

    explanation.push(
      <div key={`step-${stepCount++}`} className="text-center mt-2">
        <BlockMath math={`\\dfrac{${plus}\\div${GCF}}{${newD}\\div${GCF}}`} />
      </div>
    );

    if (techBtm !== 1 && techUpr !== 0) {
      explanation.push(
        <div key={`step-${stepCount++}`} className="text-center mt-2">
          <BlockMath math={`= \\dfrac{${techUpr}}{${techBtm}}`} />
        </div>
      );
    } else {
      explanation.push(
        <div key={`step-${stepCount++}`} className="text-center mt-2">
          <BlockMath math={`= ${techUpr}`} />
        </div>
      );
    }
  }

  // Mixed fraction if needed
  if (techBtm !== 1 && techUpr > techBtm) {
    const whole = Math.floor(techUpr / techBtm);
    const rem = techUpr % techBtm;

    explanation.push(<p key={`step-${stepCount++}`} className="mt-2">{lang[22]}:</p>);
    explanation.push(
      <div key={`step-${stepCount++}`} className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${techUpr}}{${techBtm}} = ${whole}\\dfrac{${rem}}{${techBtm}}`}
        />
      </div>
    );
    explanation.push(<p key={`step-${stepCount++}`} className="mt-2">{lang[23]}:</p>);
    explanation.push(
      <div key={`step-${stepCount++}`} className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} ${action1} \\dfrac{${N3}}{${D3}} ${action2} \\dfrac{${N4}}{${D4}} = ${whole}\\dfrac{${rem}}{${techBtm}}`}
        />
      </div>
    );
  } else {
    explanation.push(<p key={`step-${stepCount++}`} className="mt-2">{lang[23]}:</p>);
    explanation.push(
      <div key={`step-${stepCount++}`} className="text-center mt-2">
        <BlockMath
          math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} ${action1} \\dfrac{${N3}}{${D3}} ${action2} \\dfrac{${N4}}{${D4}} = \\dfrac{${techUpr}}{${techBtm}}`}
        />
      </div>
    );
  }

  return <div className="col-span-12">{explanation}</div>;
};

export default FourAddSubAdd;