import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// GCD helper function
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

const ThreeAddSub = ({ formData, lang, result }) => {
  // Destructure and convert values from formData
  let { 
    tech_N1: N1, tech_D1: D1, 
    tech_N2: N2, tech_D2: D2, 
    tech_N3: N3, tech_D3: D3, 
    tech_action: action, 
    tech_action1: action1 
  } = formData;

  N1 = Number(N1);
  D1 = Number(D1);
  N2 = Number(N2);
  D2 = Number(D2);
  N3 = Number(N3);
  D3 = Number(D3);

  // Handle negative numerators by flipping action signs
  if (N2 < 0) {
    N2 = Math.abs(N2);
    action = action === '+' ? '-' : '+';
  }
  if (N3 < 0) {
    N3 = Math.abs(N3);
    action1 = action1 === '+' ? '-' : '+';
  }

  // Least common denominator (lcd)
  const lcd = result?.tech_lcd || 1;

  // Multipliers to convert fractions to have same denominator
  const mul1 = lcd / D1;
  const mul2 = lcd / D2;
  const mul3 = lcd / D3;

  // Calculate combined numerator after applying operations
  let combinedNumerator = action === '+' ? N1 * mul1 + N2 * mul2 : N1 * mul1 - N2 * mul2;
  combinedNumerator = action1 === '+' ? combinedNumerator + N3 * mul3 : combinedNumerator - N3 * mul3;

  // Denominator after conversion
  const combinedDenominator = D1 * mul1;

  // Calculate gcd for simplification
  const gcdVal = gcd(combinedNumerator, combinedDenominator);

  // Final numerator and denominator, fallback if result is missing
  const finalNumerator = result?.tech_upr ?? combinedNumerator;
  const finalDenominator = result?.tech_btm ?? combinedDenominator;

  // Mixed fraction parts
  const wholePart = Math.floor(finalNumerator / finalDenominator);
  const remainder = finalNumerator % finalDenominator;

  return (
    <div className="col-span-12">
      {/* Show original fraction if any numerator was negative */}
      {(N2 < 0 || N3 < 0) && (
        <>
          <p className="mt-2">{lang[5]}:</p>
          <div className="text-center mt-2">
            <BlockMath math={`= \\frac{${N1}}{${D1}} ${action} \\frac{${N2}}{${D2}} ${action1} \\frac{${N3}}{${D3}}`} />
          </div>
        </>
      )}

      {/* When denominators are not equal, show detailed calculation steps */}
      {(D1 !== D2 || D1 !== D3) ? (
        <>
          <p className="mt-2">{lang[14]}.</p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              LCD({`${N1}/${D1},${N2}/${D2},${N3}/${D3}`}) = {lcd}
            </a>
          </p>

          <p className="mt-2">{lang[15]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`= \\left( \\frac{${N1}}{${D1}} \\times \\frac{${mul1}}{${mul1}} \\right) ${action} \\left( \\frac{${N2}}{${D2}} \\times \\frac{${mul2}}{${mul2}} \\right) ${action1} \\left( \\frac{${N3}}{${D3}} \\times \\frac{${mul3}}{${mul3}} \\right)`}
            />
          </div>

          <p className="mt-2">{lang[16]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`= \\left( \\frac{${N1 * mul1}}{${D1 * mul1}} \\right) ${action} \\left( \\frac{${N2 * mul2}}{${D2 * mul2}} \\right) ${action1} \\left( \\frac{${N3 * mul3}}{${D3 * mul3}} \\right)`}
            />
          </div>

          <p className="mt-2">{lang[17]}.</p>
          <div className="text-center mt-2">
            <BlockMath math={`= \\frac{${combinedNumerator}}{${combinedDenominator}}`} />
          </div>
        </>
      ) : (
        // When denominators are the same, simpler expression
        <>
          <p className="mt-2">{lang[17]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`= \\frac{${N1} ${action} ${N2} ${action1} ${N3}}{${D1}}`}
            />
          </div>
          <div className="text-center mt-2">
            <BlockMath math={`= \\frac{${combinedNumerator}}{${D1}}`} />
          </div>
        </>
      )}

      {/* Simplification step */}
      {gcdVal !== 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {combinedNumerator} {lang[12]} {combinedDenominator} {lang[19]}
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              GCF({combinedNumerator}, {combinedDenominator}) = {gcdVal}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\frac{${finalNumerator}}{${finalDenominator}} = ${
                finalDenominator !== 1 ? `\\frac{${finalNumerator}}{${finalDenominator}}` : finalNumerator
              }`}
            />
          </div>
        </>
      )}

      {/* Show mixed number if numerator > denominator */}
      {(finalDenominator !== 1 && finalNumerator !== 0 && finalNumerator > finalDenominator) ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`\\frac{${finalNumerator}}{${finalDenominator}}`} />
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`${finalNumerator} \\div ${finalDenominator}`} />
          </div>

          {remainder !== 0 && (
            <>
              <p className="mt-2">{lang[22]}:</p>
              <div className="text-center mt-2">
                <BlockMath math={`\\frac{${finalNumerator}}{${finalDenominator}} = ${wholePart} \\dfrac{${remainder}}{${finalDenominator}}`} />
              </div>
              <p className="mt-2">{lang[23]}:</p>
              <div className="text-center mt-2">
                <BlockMath math={`\\frac{${N1}}{${D1}} ${action} \\frac{${N2}}{${D2}} ${action1} \\frac{${N3}}{${D3}} = ${wholePart} \\dfrac{${remainder}}{${finalDenominator}}`} />
              </div>
            </>
          )}
        </>
      ) : (
        <p className="mt-2">{lang[23]}.</p>
      )}

      {/* Show final simplified fraction or integer if not mixed */}
      {(finalDenominator === 1 || finalNumerator === 0 || finalNumerator <= finalDenominator) && (
        <div className="mt-2 text-center">
          <BlockMath
            math={`\\frac{${N1}}{${D1}} ${action} \\frac{${N2}}{${D2}} ${action1} \\frac{${N3}}{${D3}} = ${
              finalDenominator !== 1 && finalNumerator !== 0
                ? `\\frac{${finalNumerator}}{${finalDenominator}}`
                : finalNumerator
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ThreeAddSub;
