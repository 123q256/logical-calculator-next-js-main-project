import React from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

// Helper functions: gcd and lcm
function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    [a, b] = [b, a % b]
  }
  return a
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b)
}

function lcmofn(arr) {
  return arr.reduce((acc, val) => lcm(acc, val), 1)
}

const FourMulAddDiv = ({ formData, lang, result }) => {
  // Destructure formData for clarity
  let {
    tech_N1: ON1,
    tech_D1: OD1,
    tech_N2: ON2,
    tech_D2: OD2,
    tech_N3: ON3,
    tech_D3: OD3,
    tech_N4: ON4,
    tech_D4: OD4,
    tech_action: action,
    tech_action1: action1,
    tech_action2: action2,
  } = formData || {}

  // Default to multiplication for the second action if it was division (based on original logic)
  let oaction = action
  let oaction1 = action1
  let oaction2 = action2

  // If action2 is division, invert fraction 4 and change action2 to multiplication
  if (action2 === '÷') {
    // Swap numerator and denominator for fraction 4
    [ON4, OD4] = [OD4, ON4]
    action2 = '×'
  }

  // Calculate numerator and denominator multiplication for the last fraction multiplication step
  const N3 = ON3
  const D3 = OD3
  const N4 = ON4
  const D4 = OD4

  let up = N3 * N4
  let btm = D3 * D4

  // Simplify fraction up/btm
  const gcdUpBtm = gcd(up, btm)
  if (gcdUpBtm !== 1) {
    up = up / gcdUpBtm
    btm = btm / gcdUpBtm
  }

  // For further addition/subtraction with fractions ON1/OD1 and ON2/OD2 and the above result
  // Find lcm of denominators
  const denominators = [OD1, OD2, btm].map(Number)
  const mul_lcm = lcmofn(denominators)

  const mul1 = mul_lcm / OD1
  const mul2 = mul_lcm / OD2
  const mul3 = mul_lcm / btm

  // Calculate numerator sum depending on actions
  let plus = 0

  // Helper to apply actions for two numbers
  function applyAction(a, op, b) {
    if (op === '+') return a + b
    else if (op === '-') return a - b
    else return 0
  }

  plus = applyAction(ON1 * mul1, action, ON2 * mul2)
  plus = applyAction(plus, action1, up * mul3)

  // Simplify final fraction plus/(OD1 * mul1)
  const gcdPlusDenom = gcd(plus, OD1 * mul1)
  let simplifiedPlus = plus
  let simplifiedDenom = OD1 * mul1

  if (gcdPlusDenom !== 1) {
    simplifiedPlus = plus / gcdPlusDenom
    simplifiedDenom = simplifiedDenom / gcdPlusDenom
  }

  // Prepare mixed fraction if improper
  let mixedWhole = 0
  let mixedNumerator = simplifiedPlus
  if (simplifiedPlus > simplifiedDenom && simplifiedDenom !== 0) {
    mixedWhole = Math.floor(simplifiedPlus / simplifiedDenom)
    mixedNumerator = simplifiedPlus % simplifiedDenom
  }

  // Render the component
  return (
    <div className="col-span-12">
      <p className="mt-2">
        {action2 === '×'
          ? `So we are having three different operations in the problem given. But first, we will work on ${action2} operation`
          : ''}
      </p>

      <p className="mt-2">{lang[26]}.</p>
      <p className="mt-2">{lang[27]}.</p>

      <div className="text-center mt-2">
        <BlockMath math={`\\frac{${N3}}{${D3}} ${action2} \\frac{${N4}}{${D4}} = ?`} />
      </div>

      <p className="mt-2">{lang[28]}.</p>

      <div className="text-center mt-2">
        <BlockMath math={`\\frac{${N3} \\times ${N4}}{${D3} \\times ${D4}} = \\frac{${N3 * N4}}{${D3 * D4}}`} />
      </div>

      {gcdUpBtm !== 1 && (
        <>
          <p className="mt-2">
            {lang[18]} {N3 * N4} {lang[12]} {D3 * D4} {lang[19]}
          </p>
          <p className="mt-2">
            <a href="#" className="text-blue underline" target="_blank" rel="noreferrer">
              GCF({N3 * N4},{D3 * D4}) = {gcdUpBtm}
            </a>
          </p>
          <div className="text-center mt-2">
            <BlockMath
              math={`\\frac{${N3 * N4} \\div ${gcdUpBtm}}{${D3 * D4} \\div ${gcdUpBtm}} = ${
                btm !== 1 && up !== 0 ? `\\frac{${up}}{${btm}}` : up
              }`}
            />
          </div>
        </>
      )}

      <p className="mt-2">{lang[23]}:</p>
      <div className="text-center mt-2">
        <BlockMath math={`\\frac{${N3}}{${D3}} ${action2} \\frac{${N4}}{${D4}} = ${
          btm !== 1 && up !== 0 ? `\\frac{${up}}{${btm}}` : up
        }`} />
      </div>

      <p className="mt-2">
        {lang[29]} {action} and {action1} {lang[25]}
      </p>

      <div className="text-center mt-2">
        <BlockMath
          math={`\\frac{${ON1}}{${OD1}} ${action} \\frac{${ON2}}{${OD2}} ${action1} \\frac{${up}}{${btm}} = ?`}
        />
      </div>

      {OD1 !== OD2 || OD1 !== btm ? (
        <>
          <p className="mt-2">{lang[14]}.</p>
          <p className="mt-2">
            <a href="#" className="text-blue underline" target="_blank" rel="noreferrer">
              LCD({`${ON1}/${OD1},${ON2}/${OD2},${up}/${btm}`}) = {mul_lcm}
            </a>
          </p>
          <p className="mt-2">{lang[15]}.</p>

          <div className="text-center mt-2">
            <BlockMath
              math={`= \\left( \\frac{${ON1}}{${OD1}} \\times \\frac{${mul1}}{${mul1}} \\right) ${action} \\left( \\frac{${ON2}}{${OD2}} \\times \\frac{${mul2}}{${mul2}} \\right) ${action1} \\left( \\frac{${up}}{${btm}} \\times \\frac{${mul3}}{${mul3}} \\right)`}
            />
          </div>
          <p className="mt-2">{lang[16]}.</p>

          <div className="text-center mt-2">
            <BlockMath
              math={`= \\left( \\frac{${ON1 * mul1}}{${OD1 * mul1}} \\right) ${action} \\left( \\frac{${ON2 * mul2}}{${OD2 * mul2}} \\right) ${action1} \\left( \\frac{${up * mul3}}{${btm * mul3}} \\right)`}
            />
          </div>
          <p className="mt-2">{lang[17]}.</p>

          <div className="text-center mt-2">
            <BlockMath
              math={`= \\frac{${ON1 * mul1} ${action} ${ON2 * mul2} ${action1} ${up * mul3}}{${OD1 * mul1}} = \\frac{${plus}}{${OD1 * mul1}}`}
            />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2">{lang[17]}.</p>
          <div className="text-center mt-2">
            <BlockMath math={`= \\frac{${ON1} ${action} ${ON2} ${action1} ${up}}{${OD1}} = \\frac{${plus}}{${OD1}}`} />
          </div>
        </>
      )}
{gcdPlusDenom !== 1 && (
  <>
    {/* GCD step explanation */}
    <p className="mt-2">
      {lang[18]} {plus} {lang[12]} {OD1 * mul1} {lang[19]}
    </p>
    <p className="mt-2">
      <a href="#" className="text-blue underline" target="_blank" rel="noreferrer">
        GCF({plus}, {OD1 * mul1}) = {gcdPlusDenom}
      </a>
    </p>

    {/* Fraction after simplification */}
    <div className="text-center mt-2">
      <BlockMath
        math={`\\frac{${plus} \\div ${gcdPlusDenom}}{${OD1 * mul1} \\div ${gcdPlusDenom}} = ${
          simplifiedDenom !== 1 && simplifiedPlus !== 0
            ? `\\frac{${simplifiedPlus}}{${simplifiedDenom}}`
            : simplifiedPlus
        }`}
      />
    </div>
  </>
)}

{/* Mixed Fraction Display */}
{simplifiedDenom !== 1 && simplifiedPlus > simplifiedDenom ? (
  <>
    <p className="mt-2">{lang[20]}</p>
    <div className="text-center mt-2">
      <BlockMath math={`\\frac{${simplifiedPlus}}{${simplifiedDenom}}`} />
    </div>

    <p className="mt-2">{lang[21]}</p>
    <div className="text-center mt-2">
      <BlockMath math={`${simplifiedPlus} \\div ${simplifiedDenom}`} />
    </div>

    <p className="mt-2">{lang[22]}:</p>
    <div className="text-center mt-2">
      <BlockMath
        math={`\\frac{${simplifiedPlus}}{${simplifiedDenom}} = ${mixedWhole} \\dfrac{${mixedNumerator}}{${simplifiedDenom}}`}
      />
    </div>

    <p className="mt-2">{lang[23]}:</p>
    <div className="text-center mt-2">
      <BlockMath
        math={`\\frac{${ON1}}{${OD1}} ${oaction} \\frac{${ON2}}{${OD2}} ${oaction1} \\frac{${ON3}}{${OD3}} ${oaction2} \\frac{${ON4}}{${OD4}} = ${mixedWhole} \\dfrac{${mixedNumerator}}{${simplifiedDenom}}`}
      />
    </div>
  </>
) : (
  <>
    <p className="mt-2">{lang[23]}:</p>
    <div className="text-center mt-2">

           <BlockMath
        math={`\\dfrac{${formData?.tech_N1}}{${formData?.tech_D1}} ${formData?.tech_action} \\dfrac{${formData?.tech_N2}}{${formData?.tech_D2}} ${formData?.tech_action1} \\dfrac{${formData?.tech_N3}}{${formData?.tech_D3}} ${formData?.tech_action2} \\dfrac{${formData?.tech_N4}}{${formData?.tech_D4}} = ${
        result?.data?.tech_btm !== 1 && result?.data?.tech_upr !== 0
            ? `\\dfrac{${result?.data?.tech_upr}}{${result?.data?.tech_btm}}`
            : `${result?.data?.tech_upr}`
        }`}
    />
    
      {/* <BlockMath
        math={`\\frac{${ON1}}{${OD1}} ${oaction} \\frac{${ON2}}{${OD2}} ${oaction1} \\frac{${ON3}}{${OD3}} ${oaction2} \\frac{${ON4}}{${OD4}} = ${
          simplifiedDenom !== 1 && simplifiedPlus !== 0
            ? `\\frac{${simplifiedPlus}}{${simplifiedDenom}}`
            : simplifiedPlus
        }`}
      /> */}
    </div>
  </>
)}




    </div>
  )
}

export default FourMulAddDiv
