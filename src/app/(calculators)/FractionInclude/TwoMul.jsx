import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

const TwoMul = ({ formData, lang, result }) => {
  let { tech_N1: N1, tech_D1: D1, tech_N2: N2, tech_D2: D2, tech_action: action } = formData;
  const oaction = action;
  let ON2 = N2;
  let OD2 = D2;

  if (action === '÷') {
    [N2, D2] = [D2, N2]; // flip the second fraction
    action = '×';
  } else if (action === 'of') {
    action = '×';
  }

  const up = N1 * N2;
  const btm = D1 * D2;
  const hasGCD = gcd(up, btm) !== 1;
  const reducedNumer = result?.data?.tech_upr;
  const reducedDenom = result?.data?.tech_btm;

  let shi = 0;
  let bta = 0;
  if (reducedDenom && reducedNumer && reducedDenom !== 1 && reducedNumer > reducedDenom && reducedNumer % reducedDenom !== 0) {
    bta = Math.abs(reducedNumer % reducedDenom);
    shi = Math.floor(reducedNumer / reducedDenom);
  }

  return (
    <div className="col-span-12">
      {oaction === '÷' && (
        <>
          <p className="mt-2">{lang[26]}</p>
          <p className="mt-2">{lang[27]}</p>
          <BlockMath math={`\\frac{${N1}}{${D1}} ${action} \\frac{${N2}}{${D2}} = ?`} />
        </>
      )}

      <p className="mt-2">{lang[28]}</p>
      <BlockMath math={`\\frac{${N1} \\times ${N2}}{${D1} \\times ${D2}} = \\frac{${up}}{${btm}}`} />

      {hasGCD && (
        <>
          <p className="mt-2">
            {lang[18]} {up} {lang[12]} {btm} {lang[19]}
          </p>
          <p className="mt-2">
            <a className="text-blue text-decoration-none mt-2" target="_blank">
              GCF({up}, {btm}) = {gcd(up, btm)}
            </a>
          </p>
          <BlockMath
            math={`\\frac{${up} \\div ${gcd(up, btm)}}{${btm} \\div ${gcd(up, btm)}} = ${
              reducedDenom !== 1 && reducedNumer !== 0
                ? `\\frac{${reducedNumer}}{${reducedDenom}}`
                : `${reducedNumer}`
            }`}
          />
        </>
      )}

      {reducedDenom !== 1 && reducedNumer !== 0 ? (
        reducedNumer % reducedDenom !== 0 && reducedNumer > reducedDenom ? (
          <>
            <p className="mt-2">{lang[20]}</p>
            <BlockMath math={`\\frac{${reducedNumer}}{${reducedDenom}}`} />
            <p className="mt-2">{lang[21]}</p>
            <BlockMath math={`${reducedNumer} \\div ${reducedDenom}`} />
            <p className="mt-2">{lang[22]}:</p>
            <BlockMath math={`\\frac{${reducedNumer}}{${reducedDenom}} = ${shi} \\dfrac{${bta}}{${reducedDenom}}`} />
            <p className="mt-2">{lang[23]}:</p>
            <BlockMath math={`\\frac{${N1}}{${D1}} ${oaction} \\frac{${ON2}}{${OD2}} = ${shi} \\dfrac{${bta}}{${reducedDenom}}`} />
          </>
        ) : (
          <>
            <p className="mt-2">{lang[23]}:</p>
            <BlockMath math={`\\frac{${N1}}{${D1}} ${oaction} \\frac{${ON2}}{${OD2}} = \\frac{${reducedNumer}}{${reducedDenom}}`} />
          </>
        )
      ) : (
        <>
          <p className="mt-2">{lang[23]}:</p>
          <BlockMath math={`\\frac{${N1}}{${D1}} ${oaction} \\frac{${ON2}}{${OD2}} = ${reducedNumer}`} />
        </>
      )}

      {/* Formula Explanation */}
      <p className="font-s-25 mt-2">{lang[36]}:</p>
      {(oaction === '×' || oaction === 'of' || oaction === '÷') && (
        <>
          <p className="mt-2">
            {lang[37]} {(formData.tech_action === '÷' ? '÷' : '×')}, {lang[40]}
          </p>
          <BlockMath math={`\\frac{${N1}}{${D1}} ${oaction} \\frac{${ON2}}{${OD2}}`} />
          <p className="mt-2">{lang[38]}</p>
          <BlockMath math={`\\frac{${N1}${action}${N2}}{${D1}${action}${D2}}`} />
          <BlockMath math={`= \\frac{${up}}{${btm}}`} />

          {hasGCD && (
            <>
              <p className="mt-2">{lang[39]}</p>
              <p className="mt-2">
                <a className="text-blue text-decoration-none mt-2" target="_blank">
                  GCF({up}, {btm}) = {gcd(up, btm)}
                </a>
              </p>
              <BlockMath
                math={`\\frac{${up} \\div ${gcd(up, btm)}}{${btm} \\div ${gcd(up, btm)}} = ${
                  reducedDenom !== 1 && reducedNumer !== 0
                    ? `\\frac{${reducedNumer}}{${reducedDenom}}`
                    : `${reducedNumer}`
                }`}
              />
            </>
          )}

          {reducedNumer > reducedDenom && reducedNumer % reducedDenom !== 0 ? (
            <>
              <p className="mt-2">{lang[22]}:</p>
              <BlockMath math={`\\frac{${reducedNumer}}{${reducedDenom}} = ${shi} \\dfrac{${bta}}{${reducedDenom}}`} />
              <p className="mt-2">{lang[23]}:</p>
              <BlockMath math={`\\frac{${N1}}{${D1}} ${oaction} \\frac{${ON2}}{${OD2}} = ${shi} \\dfrac{${bta}}{${reducedDenom}}`} />
            </>
          ) : (
            <>
              <p className="mt-2">{lang[23]}:</p>
              <BlockMath
                math={`\\frac{${N1}}{${D1}} ${oaction} \\frac{${ON2}}{${OD2}} = ${
                  reducedDenom !== 1 && reducedNumer !== 0
                    ? `\\frac{${reducedNumer}}{${reducedDenom}}`
                    : `${reducedNumer}`
                }`}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TwoMul;
