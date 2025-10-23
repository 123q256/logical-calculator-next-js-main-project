"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useRotationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RotationCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean); // remove empty strings

  let url = "";

  if (parts.length === 1) {
    // sirf ek part
    url = parts[0]; // "age-calculator"
  } else {
    // do ya zyada parts
    url = parts[0] + "/" + parts[1]; // "de/age-calculator"
  }
  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const handleFetchDetails = async () => {
    try {
      // Call the mutation with the `tech_calculator_link`
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_point_rotate_one: 1,
    tech_point_rotate_two: 2,
    tech_angle: 45,
    tech_unit: "radians", // radians degrees
    tech_point_around_one: 56,
    tech_point_around_two: 90,
    tech_direction: "anticlockwise", // anticlockwise  clockwise
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRotationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_point_rotate_one || !formData.tech_point_rotate_two) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_point_rotate_one: formData.tech_point_rotate_one,
        tech_point_rotate_two: formData.tech_point_rotate_two,
        tech_angle: formData.tech_angle,
        tech_unit: formData.tech_unit,
        tech_point_around_one: formData.tech_point_around_one,
        tech_point_around_two: formData.tech_point_around_two,
        tech_direction: formData.tech_direction,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_point_rotate_one: 1,
      tech_point_rotate_two: 2,
      tech_angle: 45,
      tech_unit: "radians", // radians degrees
      tech_point_around_one: 56,
      tech_point_around_two: 90,
      tech_direction: "anticlockwise", // anticlockwise  clockwise
    });
    setResult(null);
    setFormError(null);
  };
  // currency code
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    };

    fetchCurrency();
  }, []);
  // currency code

  // Place this inside your React component, before returning JSX

  let find_value = 0;
  let find_value2 = 0;
  let find_point_one = 0;
  let find_point_two = 0;

  if (
    (result?.tech_direction === "anticlockwise" ||
      result?.tech_direction === "clockwise") &&
    (result?.tech_unit === "radians" || result?.tech_unit === "degrees")
  ) {
    const angleInRadians = result?.tech_angle * -1;

    find_value = Math.round(Math.sin(angleInRadians) * 100000) / 100000;
    find_value2 = Math.round(Math.cos(angleInRadians) * 100000) / 100000;

    find_point_one =
      result?.tech_point_around_one -
      result?.tech_point_around_one * find_value2 -
      result?.tech_point_around_two * find_value;

    find_point_two =
      result?.tech_point_around_two -
      result?.tech_point_around_two * find_value2 +
      result?.tech_point_around_one * find_value;
  }

  return (
    <Calculator
      isLoading={isLoading}
      data={data}
      links={[
        { name: "Home", path: "/" },
        {
          name: data?.payload?.tech_cal_cat,
          path: "/" + data?.payload?.tech_cal_cat,
        },
        {
          name: data?.payload?.tech_calculator_title,
          path: pathname, // This will use the current path dynamically
        },
      ]}
    >
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[50%] md:w-[85%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_point_rotate_one" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_point_rotate_one"
                    id="tech_point_rotate_one"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point_rotate_one}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_point_rotate_two" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_point_rotate_two"
                    id="tech_point_rotate_two"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point_rotate_two}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_angle" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_angle"
                    id="tech_angle"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_angle}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_unit" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_unit"
                    id="tech_unit"
                    value={formData.tech_unit}
                    onChange={handleChange}
                  >
                    <option value="radians">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="degrees">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_point_around_one" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_point_around_one"
                    id="tech_point_around_one"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point_around_one}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_point_around_two" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_point_around_two"
                    id="tech_point_around_two"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_point_around_two}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_direction" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_direction"
                    id="tech_direction"
                    value={formData.tech_direction}
                    onChange={handleChange}
                  >
                    <option value="anticlockwise">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="clockwise">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full overflow-auto">
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-3 text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys["10"]}</strong>
                        </p>
                        <p className="mt-3">
                          ({Number(result?.tech_formula_one).toFixed(3)},
                          {Number(result?.tech_formula_two).toFixed(3)})
                        </p>

                        {(result?.tech_direction == "anticlockwise" ||
                          result?.tech_direction == "clockwise") &&
                          (result?.tech_unit == "radians" ||
                            result?.tech_unit == "degrees") && (
                            <>
                              <div className="mt-3 text-[18px] font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </div>
                              <BlockMath
                                math={`=\\begin{bmatrix} ${find_value2} & ${find_value} \\\\ ${-find_value} & ${find_value2} \\end{bmatrix}`}
                              />

                              <div className="mt-3 text-[18px] font-bold">
                                {data?.payload?.tech_lang_keys["26"]}:
                              </div>
                              <BlockMath
                                math={`(x,y) \\dashrightarrow (${find_value2}x + ${find_value}y + ${find_point_one}, ${find_value}x + ${find_value2}y + ${find_point_two})`}
                              />

                              <div className="mt-3 text-[18px] font-bold">
                                {data?.payload?.tech_lang_keys["12"]}:
                              </div>
                              <BlockMath
                                math={`\\begin{bmatrix} x \\\\ y \\end{bmatrix} \\dashrightarrow \\begin{bmatrix} ${find_point_one} \\\\ ${find_point_two} \\end{bmatrix} + \\begin{bmatrix} ${find_value2} & ${find_value} \\\\ ${-find_value} & ${find_value2} \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix}`}
                              />

                              <div className="mt-3 text-[18px] font-bold">
                                {data?.payload?.tech_lang_keys["13"]}
                              </div>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["25"]}
                              </p>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["27"]} (
                                {result?.tech_point_rotate_one},{" "}
                                {result?.tech_point_rotate_two}){" "}
                                {data?.payload?.tech_lang_keys["28"]}{" "}
                                {result?.tech_angle}° {result?.tech_direction}{" "}
                                {data?.payload?.tech_lang_keys["29"]} (
                                {result?.tech_point_around_one},{" "}
                                {result?.tech_point_around_two}).
                              </p>

                              <div className="mt-3 text-[18px] font-bold">
                                Transformed Point
                              </div>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["14"]} (
                                {result?.tech_point_rotate_one},{" "}
                                {result?.tech_point_rotate_two}){" "}
                                {data?.payload?.tech_lang_keys["15"]} (
                                {result?.tech_point_rotate_one} -{" "}
                                {result?.tech_point_around_one},{" "}
                                {result?.tech_point_rotate_two} -{" "}
                                {result?.tech_point_around_two}) = (
                                {result?.tech_point_rotate_one -
                                  result?.tech_point_around_one}
                                ,{" "}
                                {result?.tech_point_rotate_two -
                                  result?.tech_point_around_two}
                                ) ({result?.tech_point_rotate_one},{" "}
                                {result?.tech_point_rotate_two}){" "}
                                {data?.payload?.tech_lang_keys["15"]} (
                                {result?.tech_point_around_one} -{" "}
                                {result?.tech_point_around_one},{" "}
                                {result?.tech_point_around_two} -{" "}
                                {result?.tech_point_around_two}) = ( 0, 0)
                              </p>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                <InlineMath math="(x,y)" />{" "}
                                {data?.payload?.tech_lang_keys["17"]}{" "}
                                <InlineMath math="(θ)" />{" "}
                                {data?.payload?.tech_lang_keys["18"]}{" "}
                                <InlineMath math="(xcos(θ)−ysin(θ),xsin(θ)+ycos(θ))" />
                                .
                              </p>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["19"]} x ={" "}
                                {result?.tech_point_rotate_one -
                                  result?.tech_point_around_one}
                                , y ={" "}
                                {result?.tech_point_rotate_two -
                                  result?.tech_point_around_two}{" "}
                                {data?.payload?.tech_lang_keys["20"]}{" "}
                                <InlineMath
                                  math={`θ = ${result?.tech_angle}^\\circ`}
                                />
                              </p>

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["21"]}
                              </p>
                              <BlockMath
                                math={`=(${
                                  result?.tech_point_rotate_one -
                                  result?.tech_point_around_one
                                } \\cos(${result?.tech_angle}^\\circ) - (${
                                  result?.tech_point_rotate_two -
                                  result?.tech_point_around_two
                                }) \\sin(${result?.tech_angle}^\\circ), ${
                                  result?.tech_point_rotate_one -
                                  result?.tech_point_around_one
                                } \\sin(${result?.tech_angle}^\\circ) + ${
                                  result?.tech_point_rotate_two -
                                  result?.tech_point_around_two
                                } \\cos(${result?.tech_angle}^\\circ))`}
                              />

                              <BlockMath
                                math={`=(${
                                  result?.tech_point_rotate_one -
                                  result?.tech_point_around_one
                                } (${Number(
                                  Math.cos(result?.tech_angle)
                                ).toFixed(3)}) - (${
                                  result?.tech_point_rotate_two -
                                  result?.tech_point_around_two
                                } (${Number(
                                  Math.sin(result?.tech_angle)
                                ).toFixed(3)})), ${
                                  result?.tech_point_rotate_one -
                                  result?.tech_point_around_one
                                } (${Number(
                                  Math.sin(result?.tech_angle)
                                ).toFixed(3)}) + ${
                                  result?.tech_point_rotate_two -
                                  result?.tech_point_around_two
                                } (${Number(
                                  Math.cos(result?.tech_angle)
                                ).toFixed(3)}))`}
                              />

                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["22"]}
                              </p>
                              <BlockMath
                                math={`(${result?.tech_point_rotate_one}, ${
                                  result?.tech_point_rotate_two
                                }) \\dashrightarrow (${
                                  result?.tech_point_rotate_one -
                                  result?.tech_point_around_one
                                } (${Number(
                                  Math.cos(result?.tech_angle)
                                ).toFixed(3)}) - (${
                                  result?.tech_point_rotate_two -
                                  result?.tech_point_around_two
                                } (${Number(
                                  Math.sin(result?.tech_angle)
                                ).toFixed(3)})) + ${
                                  result?.tech_point_around_one
                                }, ${
                                  result?.tech_point_rotate_one -
                                  result?.tech_point_around_one
                                } (${Number(
                                  Math.sin(result?.tech_angle)
                                ).toFixed(3)}) + ${
                                  result?.tech_point_rotate_two -
                                  result?.tech_point_around_two
                                } (${Number(
                                  Math.cos(result?.tech_angle)
                                ).toFixed(3)}) + ${
                                  result?.tech_point_around_two
                                })`}
                              />

                              <BlockMath
                                math={`=(${result?.tech_formula_one}, ${result?.tech_formula_two})`}
                              />

                              {result?.tech_angle > 0 ? (
                                <>
                                  <p className="mt-3 text-[18px] font-bold">
                                    {data?.payload?.tech_lang_keys["11"]}
                                  </p>
                                  <BlockMath
                                    math={`\\begin{bmatrix} cos(θ) & -sin(θ) \\\\ sin(θ) & cos(θ) \\end{bmatrix}`}
                                  />
                                  <BlockMath
                                    math={`=\\begin{bmatrix} cos(${result?.tech_angle}) & -sin(${result?.tech_angle}) \\\\ sin(${result?.tech_angle}) & cos(${result?.tech_angle}) \\end{bmatrix}`}
                                  />
                                  <BlockMath
                                    math={`=\\begin{bmatrix} ${find_value2} & ${find_value} \\\\ ${-find_value} & ${find_value2} \\end{bmatrix}`}
                                  />

                                  <p className="mt-3 text-[18px] font-bold">
                                    {data?.payload?.tech_lang_keys["26"]}
                                  </p>
                                  <BlockMath
                                    math={`(x,y) \\dashrightarrow (cos(${result?.tech_angle})x - ysin(${result?.tech_angle}) + ${result?.tech_point_around_two}sin(${result?.tech_angle}) - ${result?.tech_point_around_two}cos(${result?.tech_angle}) + ${result?.tech_point_around_two})`}
                                  />
                                  <BlockMath
                                    math={`(x,y) \\dashrightarrow (${find_value2}x + ${find_value}y + ${find_point_one}, ${find_value}x + ${find_value2}y + ${find_point_two})`}
                                  />

                                  <p className="mt-3 text-[18px] font-bold">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>
                                  <BlockMath
                                    math={`\\begin{bmatrix} x \\\\ y \\end{bmatrix} \\dashrightarrow \\begin{bmatrix} ${find_point_one} \\\\ ${find_point_two} \\end{bmatrix} + \\begin{bmatrix} ${find_value2} & ${find_value} \\\\ ${-find_value} & ${find_value2} \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix}`}
                                  />
                                </>
                              ) : result?.tech_angle < 0 ? (
                                <>
                                  <p className="mt-3 text-[18px] font-bold">
                                    {data?.payload?.tech_lang_keys["11"]}
                                  </p>
                                  <BlockMath
                                    math={`\\begin{bmatrix} cos(θ) & sin(θ) \\\\ -sin(θ) & cos(θ) \\end{bmatrix}`}
                                  />
                                  <BlockMath
                                    math={`=\\begin{bmatrix} cos(${Math.abs(
                                      result?.tech_angle
                                    )}) & sin(${Math.abs(
                                      result?.tech_angle
                                    )}) \\\\ -sin(${Math.abs(
                                      result?.tech_angle
                                    )}) & cos(${Math.abs(
                                      result?.tech_angle
                                    )}) \\end{bmatrix}`}
                                  />
                                  <BlockMath
                                    math={`=\\begin{bmatrix} ${find_value2} & ${find_value} \\\\ ${-find_value} & ${find_value2} \\end{bmatrix}`}
                                  />

                                  <p className="mt-3 text-[18px] font-bold">
                                    {data?.payload?.tech_lang_keys["26"]}
                                  </p>
                                  <BlockMath
                                    math={`(x,y) \\dashrightarrow (cos(${Math.abs(
                                      result?.tech_angle
                                    )})x + ysin(${Math.abs(
                                      result?.tech_angle
                                    )}) - ${
                                      result?.tech_point_around_two
                                    }sin(${Math.abs(result?.tech_angle)}) - ${
                                      result?.tech_point_around_one
                                    }cos(${Math.abs(result?.tech_angle)}) + ${
                                      result?.tech_point_around_one
                                    }, -sin(${Math.abs(
                                      result?.tech_angle
                                    )})x + ${
                                      result?.tech_point_around_one
                                    }sin(${Math.abs(
                                      result?.tech_angle
                                    )}) + ycos(${Math.abs(
                                      result?.tech_angle
                                    )}) - ${
                                      result?.tech_point_around_two
                                    }cos(${Math.abs(result?.tech_angle)}) + ${
                                      result?.tech_point_around_two
                                    })`}
                                  />
                                  <BlockMath
                                    math={`(x,y) \\dashrightarrow (${find_value2}x + ${find_value}y + ${find_point_one}, ${find_value}x + ${find_value2}y + ${find_point_two})`}
                                  />

                                  <p className="mt-3 text-[18px] font-bold">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>
                                  <BlockMath
                                    math={`\\begin{bmatrix} x \\\\ y \\end{bmatrix} \\dashrightarrow \\begin{bmatrix} ${find_point_one} \\\\ ${find_point_two} \\end{bmatrix} + \\begin{bmatrix} ${find_value2} & ${find_value} \\\\ ${-find_value} & ${find_value2} \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix}`}
                                  />
                                </>
                              ) : null}
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </form>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default RotationCalculator;
