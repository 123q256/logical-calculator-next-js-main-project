"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useProportionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ProportionCalculator = () => {
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
    tech_a: "5",
    tech_b: "8",
    tech_c: "x",
    tech_d: "24",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useProportionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_a || !formData.tech_b) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_d: formData.tech_d,
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
      tech_a: "5",
      tech_b: "8",
      tech_c: "x",
      tech_d: "24",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12 label">
                <strong>{data?.payload?.tech_lang_keys["13"]}</strong>{" "}
                {data?.payload?.tech_lang_keys["14"]}
              </p>
              <div className="col-span-12 flex items-center">
                <div>
                  <input
                    type="text"
                    step="any"
                    name="tech_a"
                    id="tech_a"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_a}
                    onChange={handleChange}
                  />
                  <hr />
                  <input
                    type="text"
                    step="any"
                    name="tech_b"
                    id="tech_b"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_b}
                    onChange={handleChange}
                  />
                </div>
                <div className="mx-3 font-s-32">
                  <strong>=</strong>
                </div>
                <div>
                  <input
                    type="text"
                    step="any"
                    name="tech_c"
                    id="tech_c"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_c}
                    onChange={handleChange}
                  />
                  <hr />
                  <input
                    type="text"
                    step="any"
                    name="tech_d"
                    id="tech_d"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_d}
                    onChange={handleChange}
                  />
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
                    <div className="w-full mt-3">
                      <div className="row">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {result?.tech_a_val ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>{formData?.tech_a}</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_a_val}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_b_val ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>{formData?.tech_b}</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_b_val}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_c_val ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>{formData?.tech_c}</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_c_val}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_d_val ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>{formData?.tech_d}</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_d_val}
                                    </td>
                                  </tr>
                                </>
                              ) : null}
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["5"]}:
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["6"]}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["7"]}
                          </p>
                          {result?.tech_a_val ? (
                            <>
                              <BlockMath
                                math={`\\frac{${formData?.tech_a}}{${formData?.tech_b}} = \\frac{${formData?.tech_c}}{${formData?.tech_d}}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}
                              </p>

                              <BlockMath
                                math={`${formData?.tech_a} \\times ${formData?.tech_d} = ${formData?.tech_b} \\times ${formData?.tech_c}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["9"]}{" "}
                                {formData?.tech_a}
                              </p>

                              <BlockMath
                                math={`${formData?.tech_a} = \\frac{${formData?.tech_b} \\times ${formData?.tech_c}}{${formData?.tech_d}}`}
                              />
                              <BlockMath
                                math={`${formData?.tech_a} = ${result?.tech_a_val}`}
                              />

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>

                              {formData?.tech_b > formData?.tech_d ? (
                                <>
                                  <p className="mt-2">
                                    if
                                    <br />
                                    {formData?.tech_b} ÷ {formData?.tech_d} ={" "}
                                    {Number(
                                      formData?.tech_b / formData?.tech_d
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                    <br />
                                    {formData?.tech_a} ÷ {formData?.tech_c} ={" "}
                                    {Number(
                                      formData?.tech_b / formData?.tech_d
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {formData?.tech_a}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_a} = {formData?.tech_c} ×{" "}
                                    {Number(
                                      formData?.tech_b / formData?.tech_d
                                    ).toFixed(3)}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="mt-2">
                                    if
                                    <br />
                                    {formData?.tech_d} ÷ {formData?.tech_b} ={" "}
                                    {Number(
                                      formData?.tech_d / formData?.tech_b
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                    <br />
                                    {formData?.tech_c} ÷ {formData?.tech_a} ={" "}
                                    {Number(
                                      formData?.tech_d / formData?.tech_b
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {formData?.tech_a}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_a} = {formData?.tech_c} ÷{" "}
                                    {Number(
                                      formData?.tech_d / formData?.tech_b
                                    ).toFixed(3)}
                                  </p>
                                </>
                              )}

                              <p className="mt-2">
                                {formData?.tech_a} = {result?.tech_a_val}
                              </p>
                            </>
                          ) : result?.tech_b_val ? (
                            <>
                              <BlockMath
                                math={`\\frac{${formData?.tech_a}}{${formData?.tech_b}} = \\frac{${formData?.tech_c}}{${formData?.tech_d}}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}
                              </p>

                              <BlockMath
                                math={`${formData?.tech_a} \\times ${formData?.tech_d} = ${formData?.tech_b} \\times ${formData?.tech_c}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["9"]}{" "}
                                {formData?.tech_b}
                              </p>

                              <BlockMath
                                math={`${formData?.tech_b} = \\frac{${formData?.tech_a} \\times ${formData?.tech_d}}{${formData?.tech_c}}`}
                              />
                              <BlockMath
                                math={`${formData?.tech_b} = ${result?.tech_b_val}`}
                              />

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>

                              {formData?.tech_a > formData?.tech_c ? (
                                <>
                                  <p className="mt-2">if</p>
                                  <p className="mt-2">
                                    {formData?.tech_a} ÷ {formData?.tech_c} ={" "}
                                    {Number(
                                      formData?.tech_a / formData?.tech_c
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_b} ÷ {formData?.tech_d} ={" "}
                                    {Number(
                                      formData?.tech_a / formData?.tech_c
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {formData?.tech_b}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_b} = {formData?.tech_d} ×{" "}
                                    {Number(
                                      formData?.tech_a / formData?.tech_c
                                    ).toFixed(3)}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="mt-2">if</p>
                                  <p className="mt-2">
                                    {formData?.tech_c} ÷ {formData?.tech_a} ={" "}
                                    {Number(
                                      formData?.tech_c / formData?.tech_a
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_d} ÷ {formData?.tech_b} ={" "}
                                    {Number(
                                      formData?.tech_c / formData?.tech_a
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {formData?.tech_b}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_b} = {formData?.tech_d} ÷{" "}
                                    {Number(
                                      formData?.tech_c / formData?.tech_a
                                    ).toFixed(3)}
                                  </p>
                                </>
                              )}

                              <p className="mt-2">
                                {formData?.tech_b} = {result?.tech_b_val}
                              </p>
                            </>
                          ) : result?.tech_c_val ? (
                            <>
                              <BlockMath
                                math={`\\frac{${formData?.tech_a}}{${formData?.tech_b}} = \\frac{${formData?.tech_c}}{${formData?.tech_d}}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}
                              </p>

                              <BlockMath
                                math={`${formData?.tech_a} \\times ${formData?.tech_d} = ${formData?.tech_b} \\times ${formData?.tech_c}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["9"]}{" "}
                                {formData?.tech_c}
                              </p>

                              <BlockMath
                                math={`${formData?.tech_c} = \\frac{${formData?.tech_a} \\times ${formData?.tech_d}}{${formData?.tech_b}}`}
                              />
                              <BlockMath
                                math={`${formData?.tech_c} = ${result?.tech_c_val}`}
                              />

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>

                              {formData?.tech_d > formData?.tech_b ? (
                                <>
                                  <p className="mt-2">if</p>
                                  <p className="mt-2">
                                    {formData?.tech_d} ÷ {formData?.tech_b} ={" "}
                                    {Number(
                                      formData?.tech_d / formData?.tech_b
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_c} ÷ {formData?.tech_a} ={" "}
                                    {Number(
                                      formData?.tech_d / formData?.tech_b
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {formData?.tech_c}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_c} = {formData?.tech_a} ×{" "}
                                    {Number(
                                      formData?.tech_d / formData?.tech_b
                                    ).toFixed(3)}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="mt-2">if</p>
                                  <p className="mt-2">
                                    {formData?.tech_b} ÷ {formData?.tech_d} ={" "}
                                    {Number(
                                      formData?.tech_b / formData?.tech_d
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_a} ÷ {formData?.tech_c} ={" "}
                                    {Number(
                                      formData?.tech_b / formData?.tech_d
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {formData?.tech_c}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_c} = {formData?.tech_a} ÷{" "}
                                    {Number(
                                      formData?.tech_b / formData?.tech_d
                                    ).toFixed(3)}
                                  </p>
                                </>
                              )}

                              <p className="mt-2">
                                {formData?.tech_c} = {result?.tech_c_val}
                              </p>
                            </>
                          ) : result?.tech_d_val ? (
                            <>
                              <BlockMath
                                math={`\\frac{${formData?.tech_a}}{${formData?.tech_b}} = \\frac{${formData?.tech_c}}{${formData?.tech_d}}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]}
                              </p>

                              <BlockMath
                                math={`${formData?.tech_a} \\times ${formData?.tech_d} = ${formData?.tech_b} \\times ${formData?.tech_c}`}
                              />
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["9"]}{" "}
                                {formData?.tech_c}
                              </p>

                              <BlockMath
                                math={`${formData?.tech_d} = \\frac{${formData?.tech_b} \\times ${formData?.tech_c}}{${formData?.tech_a}}`}
                              />
                              <BlockMath
                                math={`${formData?.tech_d} = ${result?.tech_d_val}`}
                              />

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>

                              {formData?.tech_c > formData?.tech_a ? (
                                <>
                                  <p className="mt-2">if</p>
                                  <p className="mt-2">
                                    {formData?.tech_c} ÷ {formData?.tech_a} ={" "}
                                    {Number(
                                      formData?.tech_c / formData?.tech_a
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_d} ÷ {formData?.tech_b} ={" "}
                                    {Number(
                                      formData?.tech_c / formData?.tech_a
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {formData?.tech_c}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_d} = {formData?.tech_b} ×{" "}
                                    {Number(
                                      formData?.tech_c / formData?.tech_a
                                    ).toFixed(3)}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="mt-2">if</p>
                                  <p className="mt-2">
                                    {formData?.tech_a} ÷ {formData?.tech_c} ={" "}
                                    {Number(
                                      formData?.tech_a / formData?.tech_c
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_b} ÷ {formData?.tech_d} ={" "}
                                    {Number(
                                      formData?.tech_a / formData?.tech_c
                                    ).toFixed(3)}
                                  </p>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys["9"]}{" "}
                                    {formData?.tech_c}
                                  </p>
                                  <p className="mt-2">
                                    {formData?.tech_d} = {formData?.tech_b} ÷{" "}
                                    {Number(
                                      formData?.tech_a / formData?.tech_c
                                    ).toFixed(3)}
                                  </p>
                                </>
                              )}

                              <p className="mt-2">
                                {formData?.tech_d} = {result?.tech_d_val}
                              </p>
                            </>
                          ) : null}
                        </div>
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

export default ProportionCalculator;
