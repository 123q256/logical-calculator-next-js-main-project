import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

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

const TwoAddSub = ({ formData, lang, result }) => {
  const N1 = formData?.tech_N1 ?? 0;
  const D1 = formData?.tech_D1 ?? 1;
  const N2 = formData?.tech_N2 ?? 0;
  const D2 = formData?.tech_D2 ?? 1;
  const action = formData?.tech_action ?? '+';

  const lcd = result?.data?.tech_lcd ?? 1;
  const tech_btm = result?.data?.tech_btm ?? 1;
  const tech_upr = result?.data?.tech_upr ?? 0;

  const mul1 = D1 !== D2 ? lcd / D1 : 1;
  const mul2 = D1 !== D2 ? lcd / D2 : 1;

  let plus;
  if (D1 !== D2) {
    plus = action === '+' ? N1 * mul1 + N2 * mul2 : N1 * mul1 - N2 * mul2;
  } else {
    plus = action === '+' ? N1 + N2 : N1 - N2;
  }

  const gcdValue = gcd(plus, D1 * mul1);

  const bta = Math.abs(tech_upr % tech_btm);
  const shi = Math.floor(tech_upr / tech_btm);

  const uper = action === '+' ? N1 * D2 + N2 * D1 : N1 * D2 - N2 * D1;
  const btm = D1 * D2;
  const gcdFormula = gcd(uper, btm);

  return (
    <div className="col-span-12">
      {D1 !== D2 ? (
        <>
          <p className="mt-2">{lang[30]}.</p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none mt-2" target="_blank" rel="noreferrer">
              LCD({`${N1}/${D1},${N2}/${D2}`}) = {lcd}
            </a>
          </p>
          <p className="mt-2">{lang[31]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\left(\\dfrac{${N1}}{${D1}} \\times \\dfrac{${lcd / D1}}{${lcd / D1}}\\right) ${action} \\left(\\dfrac{${N2}}{${D2}} \\times \\dfrac{${lcd / D2}}{${lcd / D2}}\\right) = ?`}
            />
          </div>
          <p className="mt-2">{lang[32]}.</p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\left(\\dfrac{${N1 * mul1}}{${D1 * mul1}}\\right) ${action} \\left(\\dfrac{${N2 * mul2}}{${D2 * mul2}}\\right) = ?`}
            />
          </div>
          <p className="mt-2">
            {lang[33]} {action === '+' ? '+' : '-'} {lang[34]}. <br /> {lang[35]}:
          </p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${N1 * mul1} ${action} ${N2 * mul2}}{${D1 * mul1}} = \\dfrac{${plus}}{${D1 * mul1}}`} />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2">
            {lang[17]}.<br /> {lang[35]}:
          </p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${N1} ${action} ${N2}}{${D1}} = \\dfrac{${plus}}{${D1}}`} />
          </div>
        </>
      )}

      {gcdValue !== 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {plus} {lang[12]} {D1 * mul1} {lang[19]}
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
              GCF({plus},{D1 * mul1}) = {gcdValue}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\dfrac{${plus} \\div ${gcdValue}}{${D1 * mul1} \\div ${gcdValue}} = ${
                tech_btm !== 1 && tech_upr !== 0 ? `\\dfrac{${tech_upr}}{${tech_btm}}` : tech_upr
              }`}
            />
          </div>
        </>
      )}

      {tech_btm !== 1 && tech_upr !== 0 && tech_upr > tech_btm ? (
        <>
          <p className="mt-2">{lang[20]}</p>
          <div className="mt-2 text-center">
            <BlockMath math={`\\dfrac{${tech_upr}}{${tech_btm}}`} />
          </div>
          <p className="mt-2">{lang[21]}</p>
          <div className="mt-2 text-center">
            <BlockMath math={`${tech_upr} \\div ${tech_btm}`} />
          </div>

          {tech_upr % tech_btm !== 0 && (
            <>
              <p className="mt-2">{lang[22]}:</p>
              <div className="mt-2 text-center">
                <BlockMath math={`\\dfrac{${tech_upr}}{${tech_btm}} = ${shi} \\dfrac{${bta}}{${tech_btm}}`} />
              </div>
              <p className="mt-2">{lang[23]}:</p>
              <div className="mt-2 text-center">
                <BlockMath math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} = ${shi} \\dfrac{${bta}}{${tech_btm}}`} />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p className="mt-2">{lang[23]}:</p>
          <div className="mt-2 text-center">
            <BlockMath
              math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} = ${
                tech_btm !== 1 && tech_upr !== 0 ? `\\dfrac{${tech_upr}}{${tech_btm}}` : tech_upr
              }`}
            />
          </div>
        </>
      )}

      <p className="font-s-20 mt-2">
        <strong>{lang[36]}:</strong>
      </p>

      {(action === '+' || action === '-') && (
        <>
          <p className="mt-2">
            {lang[37]} {action === '+' ? '+' : '-'}, to
          </p>
          <div className="text-center mt-2">
            <BlockMath math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}}`} />
          </div>
          <p className="mt-2">{lang[38]}</p>
          <div className="text-center mt-2">
            <BlockMath math={`=\\dfrac{(${N1} \\times ${D2}) ${action} (${N2} \\times ${D1})}{(${D1} \\times ${D2})}`} />
          </div>
          <div className="text-center mt-2">
            <BlockMath math={`=\\dfrac{${N1 * D2} ${action} ${N2 * D1}}{${D1 * D2}}`} />
          </div>

          <div className="text-center mt-2">
            <BlockMath math={`=\\dfrac{${uper}}{${btm}}`} />
          </div>

          {gcdFormula !== 1 && (
            <>
              <p className="mt-2">{lang[39]}</p>
              <p className="mt-2">
                <a href="#" className="text-blue text-decoration-none" target="_blank" rel="noreferrer">
                  GCF({uper},{btm}) = {gcdFormula}
                </a>
              </p>
              <div className="text-center mt-2">
                <BlockMath
                  math={`\\dfrac{${uper} \\div ${gcdFormula}}{${btm} \\div ${gcdFormula}} = ${
                    tech_btm !== 1 && tech_upr !== 0 ? `\\dfrac{${tech_upr}}{${tech_btm}}` : tech_upr
                  }`}
                />
              </div>
            </>
          )}

          {tech_btm !== 1 && tech_upr !== 0 && tech_upr % tech_btm !== 0 && tech_upr > tech_btm ? (
            <>
              <p className="mt-2">{lang[22]}:</p>
              <div className="mt-2 text-center">
                <BlockMath math={`\\dfrac{${tech_upr}}{${tech_btm}} = ${shi} \\dfrac{${bta}}{${tech_btm}}`} />
              </div>
              <p className="mt-2">{lang[23]}:</p>
              <div className="mt-2 text-center">
                <BlockMath math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} = ${shi} \\dfrac{${bta}}{${tech_btm}}`} />
              </div>
            </>
          ) : (
            <>
              <p className="mt-2">{lang[23]}:</p>
              <div className="mt-2 text-center">
                <BlockMath
                  math={`\\dfrac{${N1}}{${D1}} ${action} \\dfrac{${N2}}{${D2}} = ${
                    tech_btm !== 1 && tech_upr !== 0 ? `\\dfrac{${tech_upr}}{${tech_btm}}` : tech_upr
                  }`}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TwoAddSub;
