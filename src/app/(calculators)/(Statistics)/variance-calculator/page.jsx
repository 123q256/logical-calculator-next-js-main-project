"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useVarianceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VarianceCalculator = () => {
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
    tech_cal_meth: "population", //  population  sample
    tech_set: "10, 12, 23, 23, 16, 23, 21, 16",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVarianceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal_meth || !formData.tech_set) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal_meth: formData.tech_cal_meth,
        tech_set: formData.tech_set,
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
      tech_cal_meth: "population", //  population  sample
      tech_set: "10, 12, 23, 23, 16, 23, 21, 16",
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

  // resilt
  const cal_meth = result?.tech_cal_meth;
  const sdSym = cal_meth === "population" ? "σ" : "s";
  const mSym = cal_meth === "population" ? "μ" : "x̄";

  const tech_var = result?.tech_var;
  const tech_mean = result?.tech_mean;
  const tech_s_d = result?.tech_s_d;
  const tech_c_v = result?.tech_c_v;
  const tech_t_n = result?.tech_t_n;
  const tech_sum = result?.tech_sum;
  const tech_ss = result?.tech_ss;
  const table = result?.tech_table;
  const tech_stdDev = result?.tech_stdDev;

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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_set" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (,):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_set"
                    id="tech_set"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12, 23, 45, 33, 65, 54, OR e.g. 54 55 99 85 5 6"
                    value={
                      formData.tech_set ||
                      "12, 23, 45, 33, 65, 54, 54 55 99 85 5 6"
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 text-center flex items-center justify-between">
                <div className="d-flex align-items-center">
                  <label className="pe-2" htmlFor="sample">
                    <input
                      type="radio"
                      name="tech_cal_meth"
                      value="sample"
                      id="sample"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_cal_meth === "sample"}
                    />
                    <span>{data?.payload?.tech_lang_keys["2"]}</span>
                  </label>
                  <label className="pe-2" htmlFor="population">
                    <input
                      type="radio"
                      name="tech_cal_meth"
                      value="population"
                      id="population"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_cal_meth === "population"}
                    />
                    <span>{data?.payload?.tech_lang_keys["3"]}</span>
                  </label>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div>
                          <div className="text-center">
                            <p className="text-[20px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["4"]} ({sdSym}²)
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {tech_var}
                                </strong>
                              </p>
                            </div>
                          </div>
                          <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["5"]} (
                                      {sdSym})
                                    </p>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{tech_s_d}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["6"]} (n)
                                    </p>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{tech_t_n}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["7"]} (Σx)
                                    </p>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{tech_sum}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["8"]} (
                                      {mSym})
                                    </p>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{tech_mean}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>{data?.payload?.tech_lang_keys["9"]}</p>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{tech_c_v}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    <p>
                                      {data?.payload?.tech_lang_keys["10"]} (SS)
                                    </p>
                                  </td>
                                  <td className="p-2 border-b">
                                    <b>{tech_ss}</b>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <p className="w-full mt-3 font-s-20">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys["11"]}:
                          </strong>
                        </p>

                        <p className="w-full mt-2 font-s-18">
                          <strong>
                            {data?.payload?.tech_lang_keys["12"]} (
                            <InlineMath math={`${sdSym}^2`} />)
                          </strong>
                        </p>

                        <p className="w-full mt-2">
                          {cal_meth === "population" ? (
                            <InlineMath
                              math={`${sdSym}^2 = \\dfrac{\\sum_{i=1}^{n}(x_i - \\mu)^2}{n}`}
                            />
                          ) : (
                            <InlineMath
                              math={`${sdSym}^2 = \\dfrac{\\sum_{i=1}^{n}(x_i - \\bar{X})^2}{n - 1}`}
                            />
                          )}
                        </p>

                        <p className="w-full mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["13"]} (
                            <InlineMath math={`${sdSym}^2`} />){" "}
                            {data?.payload?.tech_lang_keys["14"]} (
                            <InlineMath math={`\\sum x`} />){" "}
                            {data?.payload?.tech_lang_keys["15"]} (SS)
                          </strong>
                        </p>

                        <div className="w-full mt-2 overflow-auto">
                          <div dangerouslySetInnerHTML={{ __html: table }} />
                        </div>
                        <div className="w-full mt-2">
                          {cal_meth === "population" ? (
                            <>
                              <BlockMath math={`${sdSym}^2 = \\dfrac{SS}{n}`} />
                              <BlockMath
                                math={`${sdSym}^2 = \\dfrac{${tech_ss}}{${tech_t_n}}`}
                              />
                              <BlockMath
                                math={`${sdSym}^2 = ${tech_ss} / ${tech_t_n}`}
                              />
                            </>
                          ) : (
                            <>
                              <BlockMath
                                math={`${sdSym}^2 = \\dfrac{SS}{n - 1}`}
                              />
                              <BlockMath
                                math={`${sdSym}^2 = \\dfrac{${tech_ss}}{${tech_t_n} - 1}`}
                              />
                              <BlockMath
                                math={`${sdSym}^2 = ${tech_ss} / (${tech_t_n} - 1)`}
                              />
                            </>
                          )}
                        </div>

                        <p className="w-full mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["16"]} ({sdSym})
                          </strong>
                        </p>

                        <p className="w-full mt-2">
                          {cal_meth === "population" ? (
                            <>
                              <BlockMath
                                math={`${sdSym} = \\sqrt{${sdSym}^2}`}
                              />
                              <BlockMath
                                math={`${sdSym} = \\sqrt{${tech_ss} / ${tech_t_n}}`}
                              />
                              <BlockMath
                                math={`${sdSym} = ${Math.sqrt(
                                  tech_ss / tech_t_n
                                ).toFixed(4)}`}
                              />
                            </>
                          ) : (
                            <>
                              <BlockMath
                                math={`${sdSym} = \\sqrt{${sdSym}^2}`}
                              />
                              <BlockMath
                                math={`${sdSym} = \\sqrt{${tech_ss} / (${tech_t_n} - 1)}`}
                              />
                              <BlockMath
                                math={`${sdSym} = ${Math.sqrt(
                                  tech_ss / (tech_t_n - 1)
                                ).toFixed(4)}`}
                              />
                            </>
                          )}
                        </p>

                        <p className="w-full mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["17"]} (c)
                          </strong>
                        </p>

                        <p className="w-full mt-2">
                          {cal_meth === "population" ? (
                            <>
                              <BlockMath
                                math={`c = \\dfrac{${sdSym}}{${tech_mean}}`}
                              />
                              <BlockMath
                                math={`c = \\dfrac{${tech_s_d}}{${tech_mean}}`}
                              />
                              <BlockMath math={`c = ${tech_c_v}`} />
                            </>
                          ) : (
                            <>
                              <BlockMath
                                math={`c = \\dfrac{${sdSym}}{\\overline{x}}`}
                              />
                              <BlockMath
                                math={`c = \\dfrac{${tech_s_d}}{${tech_mean}}`}
                              />
                              <BlockMath math={`c = ${tech_c_v}`} />
                            </>
                          )}
                        </p>
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

export default VarianceCalculator;
