"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useErrorPropagationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ErrorPropagationCalculator = () => {
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
    tech_x: "850",
    tech_y: "400",
    tech_delta_x: "600",
    tech_delta_y: "900",
    tech_optionSelect: "division", //  multiplication addition  subtraction  division
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useErrorPropagationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_x ||
      !formData.tech_y ||
      !formData.tech_delta_x ||
      !formData.tech_delta_y ||
      !formData.tech_optionSelect
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_delta_x: formData.tech_delta_x,
        tech_delta_y: formData.tech_delta_y,
        tech_optionSelect: formData.tech_optionSelect,
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
      tech_x: "850",
      tech_y: "400",
      tech_delta_x: "600",
      tech_delta_y: "900",
      tech_optionSelect: "division", //  multiplication addition  subtraction  division
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

  // result
  const round = (num, decimals) => {
    return Number(Math.round(num + "e" + decimals) + "e-" + decimals);
  };

  const { tech_x, tech_y, tech_delta_x, tech_delta_y, tech_optionSelect } =
    formData || {};

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12 px-2 ">
                <label htmlFor="tech_optionSelect" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_optionSelect"
                    id="tech_optionSelect"
                    value={formData.tech_optionSelect}
                    onChange={handleChange}
                  >
                    <option value="addition">Addition</option>
                    <option value="subtraction">Subtraction</option>
                    <option value="multiplication">Multiplication</option>
                    <option value="division">Division</option>
                  </select>
                </div>
              </div>
              {formData.tech_optionSelect === "addition" && (
                <div className="col-span-12 text-center" id="addition">
                  <p className="w-full mt-2">
                    <InlineMath math="Z = X + Y" />
                  </p>
                  <p className="w-full my-3">
                    <InlineMath math="ΔZ = \sqrt{(ΔX)^2 + (ΔY)^2}" />
                  </p>
                </div>
              )}

              {formData.tech_optionSelect === "subtraction" && (
                <div className="col-span-12 text-center" id="subtraction">
                  <p className="w-full mt-2">
                    <InlineMath math="Z = X - Y" />
                  </p>
                  <p className="w-full my-3">
                    <InlineMath math="ΔZ = \sqrt{(ΔX)^2 + (ΔY)^2}" />
                  </p>
                </div>
              )}

              {formData.tech_optionSelect === "multiplication" && (
                <div className="col-span-12 text-center" id="multiplication">
                  <p className="w-full mt-2">
                    <InlineMath math="Z = X \cdot Y" />
                  </p>
                  <p className="w-full my-3">
                    <InlineMath math="ΔZ = Z \cdot \sqrt{\left(\frac{ΔX}{X}\right)^2 + \left(\frac{ΔY}{Y}\right)^2}" />
                  </p>
                </div>
              )}

              {formData.tech_optionSelect === "division" && (
                <div className="col-span-12 text-center" id="division">
                  <p className="w-full mt-2">
                    <InlineMath math="Z = \frac{X}{Y}" />
                  </p>
                  <p className="w-full my-3">
                    <InlineMath math="ΔZ = Z \cdot \sqrt{\left(\frac{ΔX}{X}\right)^2 + \left(\frac{ΔY}{Y}\right)^2}" />
                  </p>
                </div>
              )}

              <div className="col-span-6">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x"
                    id="tech_x"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_delta_x" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_delta_x"
                    id="tech_delta_x"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_delta_x}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_y"
                    id="tech_y"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_y}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_delta_y" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_delta_y"
                    id="tech_delta_y"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_delta_y}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full ms:w-[70%] lg:w-[70%] overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="p-2 border-b">
                                {data?.payload?.tech_lang_keys["6"]}
                              </td>
                              <td className="p-2 border-b">
                                <strong className="text-blue">
                                  {result?.tech_z}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b">
                                {data?.payload?.tech_lang_keys["7"]}
                              </td>
                              <td className="p-2 border-b">
                                <strong className="text-blue">
                                  {round(result?.tech_delta_z, 2)}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full overflow-auto">
                        <p className="w-full mt-3 text-[20px]">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys["8"]}
                          </strong>
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["2"]} : {tech_x}
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["3"]} : {tech_delta_x}
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["4"]} : {tech_y}
                        </p>
                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["5"]} : {tech_delta_y}
                        </p>

                        <p className="w-full mt-3 text-[20px]">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys["9"]}
                          </strong>
                        </p>

                        {tech_optionSelect === "addition" && (
                          <>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["10"]}
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math="Z = X + Y" />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math={`Z = ${tech_x} + ${tech_y}`} />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math={`Z = ${result?.tech_z}`} />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = \\sqrt{(ΔX)^2 + (ΔY)^2}`}
                              />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = \\sqrt{(${tech_delta_x})^2 + (${tech_delta_y})^2}`}
                              />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = ${round(result?.tech_delta_z, 2)}`}
                              />
                            </p>
                          </>
                        )}

                        {tech_optionSelect === "subtraction" && (
                          <>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["11"]}
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math="Z = X - Y" />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math={`Z = ${tech_x} - ${tech_y}`} />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math={`Z = ${result?.tech_z}`} />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math="ΔZ = \sqrt{(ΔX)^2 + (ΔY)^2}" />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = \\sqrt{(${tech_delta_x})^2 + (${tech_delta_y})^2}`}
                              />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = ${round(result?.tech_delta_z, 2)}`}
                              />
                            </p>
                          </>
                        )}

                        {tech_optionSelect === "multiplication" && (
                          <>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["12"]}
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math="Z = X \\cdot Y" />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`Z = ${tech_x} \\cdot ${tech_y}`}
                              />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math={`Z = ${result?.tech_z}`} />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math="ΔZ = Z \cdot \sqrt{(\frac{ΔX}{X})^2 + (\frac{ΔY}{Y})^2}" />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = ${result?.tech_z} \\cdot \\sqrt{\\left(\\frac{${tech_delta_x}}{${tech_x}}\\right)^2 + \\left(\\frac{${tech_delta_y}}{${tech_y}}\\right)^2}`}
                              />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = ${round(result?.tech_delta_z, 2)}`}
                              />
                            </p>
                          </>
                        )}

                        {tech_optionSelect === "division" && (
                          <>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["13"]}
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math="Z = \\frac{X}{Y}" />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`Z = \\frac{${tech_x}}{${tech_y}}`}
                              />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math={`Z = ${result?.tech_z}`} />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath math="ΔZ = Z \cdot \sqrt{(\frac{ΔX}{X})^2 + (\frac{ΔY}{Y})^2}" />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = ${result?.tech_z} \\cdot \\sqrt{\\left(\\frac{${tech_delta_x}}{${tech_x}}\\right)^2 + \\left(\\frac{${tech_delta_y}}{${tech_y}}\\right)^2}`}
                              />
                            </p>
                            <p className="w-full mt-3">
                              <InlineMath
                                math={`ΔZ = ${round(result?.tech_delta_z, 2)}`}
                              />
                            </p>
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

export default ErrorPropagationCalculator;
