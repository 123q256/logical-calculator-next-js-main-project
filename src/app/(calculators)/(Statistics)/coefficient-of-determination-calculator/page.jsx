"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useCoefficientOfDeterminationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CoefficientOfDeterminationCalculator = () => {
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
    tech_x: "12, 13, 23, 44, 55",
    tech_y: "17, 10, 20, 14, 35",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCoefficientOfDeterminationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_y) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
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
      tech_x: "12, 13, 23, 44, 55",
      tech_y: "17, 10, 20, 14, 35",
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
  const [values, setValues] = useState({
    r: null,
    r2: null,
    n: null,
    sumx: null,
    sumy: null,
    sumxi: null,
    sumyi: null,
    sumxy: null,
    sumx2: null,
    sumy2: null,
    ssxx: null,
    ssyy: null,
    ssxy: null,
    s_d: null,
    s_d1: null,
    s1: null,
    s2: null,
    s3: null,
    s11: null,
    meanx: null,
    meany: null,
    table: null,
    sst: null,
    ssr: null,
    sse: null,
    a: null,
    b: null,
    sst_table: null,
    ssr_table: null,
    sse_table: null,
  });

  useEffect(() => {
    if (result) {
      setValues({
        r: result?.tech_r,
        r2: result?.tech_r2,
        n: result?.tech_n,
        sumx: result?.tech_sumx,
        sumy: result?.tech_sumy,
        sumxi: result?.tech_sumxi,
        sumyi: result?.tech_sumyi,
        sumxy: result?.tech_sumxy,
        sumx2: result?.tech_sumx2,
        sumy2: result?.tech_sumy2,
        ssxx: result?.tech_ssxx,
        ssyy: result?.tech_ssyy,
        ssxy: result?.tech_ssxy,
        s_d: result?.tech_s_d,
        s_d1: result?.tech_s_d1,
        s1: result?.tech_s1,
        s2: result?.tech_s2,
        s3: result?.tech_s3,
        s11: result?.tech_s11,
        meanx: result?.tech_meanx,
        meany: result?.tech_meany,
        table: result?.tech_table,
        sst: result?.tech_sst,
        ssr: result?.tech_ssr,
        sse: result?.tech_sse,
        a: result?.tech_a,
        b: result?.tech_b,
        sst_table: result?.tech_sst_table,
        ssr_table: result?.tech_ssr_table,
        sse_table: result?.tech_sse_table,
      });
    }
  }, [result]);
  // Helper function to round numbers to 4 decimals
  const round = (num) => Number(num).toFixed(4);

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (,):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12, 23, 45, 33, 65, 54, 54"
                    value={formData.tech_x || "e.g. 12, 23, 45, 33, 65, 54, 54"}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (,):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_y"
                    id="tech_y"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 17, 10, 20, 14, 35"
                    value={formData.tech_y || "e.g. 17, 10, 20, 14, 35"}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full  mt-2 overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-[#2845F5]">
                                    {data?.payload?.tech_lang_keys["5"]}{" "}
                                    <i className="text-[#2845F5]">
                                      (R<sup className="text-[#2845F5]">2</sup>)
                                    </i>
                                  </strong>
                                </td>
                                <td className="p-2 border-b">
                                  <b>{values.r2}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-[#2845F5]">
                                    {data?.payload?.tech_lang_keys["4"]}{" "}
                                    <i className="text-[#2845F5]">(r)</i>
                                  </strong>
                                </td>
                                <td className="p-2 border-b">
                                  <b>{values.r}</b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <p className="w-full mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["6"]},{" "}
                              <span className="text-[#2845F5]">
                                {values.r2 * 100}%
                              </span>{" "}
                              {data?.payload?.tech_lang_keys["7"]} y{" "}
                              {data?.payload?.tech_lang_keys["8"]} x.
                            </strong>
                          </p>
                          <p className="w-full font-s-20 mt-3">
                            <strong className="text-[#2845F5]">
                              {data?.payload?.tech_lang_keys["9"]}:
                            </strong>
                          </p>
                          <p className="w-full font-s-18 mt-2">
                            <strong className="text-[#2845F5]">Method 1</strong>
                          </p>
                          <div
                            className="w-full mt-2 overflow-auto"
                            dangerouslySetInnerHTML={{ __html: values.table }}
                          />
                        </div>

                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["9"]} (n) ={" "}
                          <InlineMath math={`n = ${values.n}`} />
                        </p>

                        <p className="w-full mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                          <InlineMath math={`SS_{xx}`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`SS_{xx} = \\sum_{i=1}^{n} X_{i}^2 - \\frac{1}{n} \\left( \\sum_{i=1}^{n} X_{i} \\right)^2`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`SS_{xx} = ${values.sumxi} - \\frac{1}{${values.n}} * ${values.sumx2}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath math={`SS_{xx} = ${values.ssxx}`} />
                        </p>

                        <p className="w-full mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                          <InlineMath math={`SS_{yy}`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`SS_{yy} = \\sum_{i=1}^{n} Y_{i}^2 - \\frac{1}{n} \\left( \\sum_{i=1}^{n} Y_{i} \\right)^2`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`SS_{yy} = ${values.sumyi} - \\frac{1}{${values.n}} * ${values.sumy2}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath math={`SS_{yy} = ${values.ssyy}`} />
                        </p>

                        <p className="w-full mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                          <InlineMath math={`SS_{xy}`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`SS_{xy} = \\sum X_i Y_i - \\frac{1}{n} \\sum X_i \\sum Y_i`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`SS_{xy} = ${values.sumxy} - \\frac{1}{${
                              values.n
                            }} * ${values.sumx * values.sumy}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath math={`SS_{xy} = ${values.ssxy}`} />
                        </p>

                        <p className="w-full mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                          <InlineMath math={`(r)`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`r = \\frac{SS_{xy}}{\\sqrt{SS_{xx} * SS_{yy}}}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`r = \\frac{${values.ssxy}}{\\sqrt{${values.ssxx} * ${values.ssyy}}}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath math={`r = ${values.r}`} />
                        </p>

                        <p className="w-full mt-3 font-bold">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                          <InlineMath math={`(R^2)`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath math={`R^2 = (${values.r})^2`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath math={`R^2 = ${values.r2}`} />
                        </p>

                        <p className="w-full font-s-18 mt-2">
                          <strong className="text-[#2845F5]">Method 2</strong>
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          {data?.payload?.tech_lang_keys["9"]} (n) ={" "}
                          <InlineMath math={`n = ${values.n}`} />
                        </p>

                        <p className="w-full overflow-auto mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["5"]}{" "}
                            {data?.payload?.tech_lang_keys["4"]}{" "}
                            <InlineMath math="(r)" />
                          </strong>
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          <InlineMath
                            math={`r = \\dfrac{\\displaystyle \\sum_{i=1}^n (x - \\bar x)(y - \\bar y)}{(n - 1) \\left(s \\displaystyle \\sum_{i=1}^n X_i \\right) \\left(s \\displaystyle \\sum_{i=1}^n Y_i \\right)}`}
                          />
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          <InlineMath
                            math={`r = \\dfrac{${values.s1}}{(${values.n} - 1) * ${values.s_d} * ${values.s_d1}}`}
                          />
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          <InlineMath
                            math={`r = \\dfrac{${values.s2}}{(${values.n} - 1) * ${values.s_d} * ${values.s_d1}}`}
                          />
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          <InlineMath
                            math={`r = \\dfrac{${values.s3}}{${values.s11}}`}
                          />
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          <InlineMath
                            math={`r = \\dfrac{${values.ssxy}}{${values.s11}}`}
                          />
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          <InlineMath math={`r = ${values.r}`} />
                        </p>

                        <p className="w-full overflow-auto mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["5"]}{" "}
                            {data?.payload?.tech_lang_keys["3"]}{" "}
                            <InlineMath math="(R^2)" />
                          </strong>
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          <InlineMath math={`R^2 = (${values.r})^2`} />
                        </p>

                        <p className="w-full overflow-auto mt-2">
                          <InlineMath math={`R^2 = ${values.r2}`} />
                        </p>

                        <p className="w-full font-s-18 mt-2">
                          <strong className="text-[#2845F5]">Method 3</strong>
                        </p>

                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["9"]} (n) ={" "}
                          <InlineMath math={`${values.n}`} />
                        </p>

                        <p className="w-full mt-2">
                          ȳ = <InlineMath math={`${values.meany}`} />
                        </p>

                        <p className="w-full mt-2">
                          {data?.payload?.tech_lang_keys["11"]} ={" "}
                          <InlineMath math={`${values.a}x + ${values.b}`} />
                        </p>

                        <p className="w-full mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["5"]}{" "}
                            {data?.payload?.tech_lang_keys["12"]} (SST)
                          </strong>
                        </p>

                        <div
                          className="w-full mt-2 overflow-auto"
                          dangerouslySetInnerHTML={{ __html: values.sst_table }}
                        />

                        <p className="w-full mt-2">
                          <strong>
                            SST = <InlineMath math={`${values.sst}`} />
                          </strong>
                        </p>

                        <p className="w-full mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["5"]}{" "}
                            {data?.payload?.tech_lang_keys["13"]} (SSR)
                          </strong>
                        </p>
                        <div
                          className="w-full mt-2 overflow-auto"
                          dangerouslySetInnerHTML={{ __html: values.ssr_table }}
                        />

                        <p className="w-full mt-2">
                          <strong>
                            SSR = <InlineMath math={`${values.ssr}`} />
                          </strong>
                        </p>

                        <p className="w-full mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["5"]}{" "}
                            {data?.payload?.tech_lang_keys["14"]} (SSE)
                          </strong>
                        </p>

                        <div
                          className="w-full mt-2 overflow-auto"
                          dangerouslySetInnerHTML={{ __html: values.sse_table }}
                        />

                        <p className="w-full mt-2">
                          <strong>
                            SSE = <InlineMath math={`${values.sse}`} />
                          </strong>
                        </p>

                        <p className="w-full mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["5"]}{" "}
                            {data?.payload?.tech_lang_keys["3"]}{" "}
                            <InlineMath math="(R^2)" />
                          </strong>
                        </p>

                        {/* R² = SSR/SST */}
                        <p className="w-full mt-2">
                          <InlineMath math={`R^2 = \\dfrac{SSR}{SST}`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`R^2 = \\dfrac{${values.ssr}}{${values.sst}}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`R^2 = ${round(values.ssr / values.sst)}`}
                          />
                        </p>

                        <p className="w-full mt-2">
                          <strong>OR</strong>
                        </p>

                        {/* R² = 1 - SSE/SST */}
                        <p className="w-full mt-2">
                          <InlineMath math={`R^2 = 1 - \\dfrac{SSE}{SST}`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`R^2 = 1 - ${round(values.sse / values.sst)}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`R^2 = ${round(1 - values.sse / values.sst)}`}
                          />
                        </p>

                        <p className="w-full mt-2">
                          <strong>OR</strong>
                        </p>

                        {/* R² = SSR / (SSR + SSE) */}
                        <p className="w-full mt-2">
                          <InlineMath math={`R^2 = \\dfrac{SSR}{SSR + SSE}`} />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`R^2 = \\dfrac{${values.ssr}}{${values.ssr} + ${values.sse}}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`R^2 = \\dfrac{${values.ssr}}{${
                              values.ssr + values.sse
                            }}`}
                          />
                        </p>
                        <p className="w-full mt-2">
                          <InlineMath
                            math={`R^2 = \\frac{${values.ssr}}{${values.ssr} + ${values.sse}} = ${values.r2}`}
                          />
                          {/* <InlineMath math={`R^2 = \\frac{${values.ssr}}{${values.ssr} + ${values.sse}} = ${round(values.ssr / (values.ssr + values.sse), 4)}`} /> */}
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

export default CoefficientOfDeterminationCalculator;
