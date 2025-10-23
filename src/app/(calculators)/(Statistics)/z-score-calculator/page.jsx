"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useZScoreCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ZscoreCalculator = () => {
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
    tech_to_calculate: "ds", // sm  dp  ds  p
    tech_pvalue: "0.13",
    tech_x: "2, 4, 6, 8, 10, 12",
    tech_smvalue: "6",
    tech_snvalue: "12",
    tech_dsvalue: "5",
    tech_pmvalue: "3",
    tech_psdvalue: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useZScoreCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_to_calculate) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_to_calculate: formData.tech_to_calculate,
        tech_pvalue: formData.tech_pvalue,
        tech_x: formData.tech_x,
        tech_smvalue: formData.tech_smvalue,
        tech_snvalue: formData.tech_snvalue,
        tech_dsvalue: formData.tech_dsvalue,
        tech_pmvalue: formData.tech_pmvalue,
        tech_psdvalue: formData.tech_psdvalue,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_to_calculate: "ds", // sm  dp  ds  p
      tech_pvalue: "0.13",
      tech_x: "2, 4, 6, 8, 10, 12",
      tech_smvalue: "6",
      tech_snvalue: "12",
      tech_dsvalue: "5",
      tech_pmvalue: "3",
      tech_psdvalue: "2",
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

  const [z1, setZ1] = useState("");
  const [z2, setZ2] = useState("");

  useEffect(() => {
    if (result?.tech_pva) {
      const val1 = zpcalc1(result?.tech_pva);
      const val2 = zcpcalc1(result?.tech_pva);
      setZ1(val1);
      setZ2(val2);
    }
  }, [result?.tech_pva]);

  // === Z calc functions ===
  function clczzv1(r) {
    let t,
      a = -7,
      n = 7,
      e = 0;
    if (r < 0 || r > 0.9999999) return -1;
    while (n - a > 1e-7) {
      t = clcpv1(e);
      if (t > r) n = e;
      else a = e;
      e = 0.5 * (n + a);
    }
    return e;
  }

  function clcpv1(r) {
    let t, a, n;
    if (r === 0) {
      a = 0;
    } else {
      t = 0.5 * Math.abs(r);
      if (t > 3.5) {
        a = 1;
      } else if (t < 1) {
        n = t * t;
        a =
          ((((((((0.000124818987 * n - 0.001075204047) * n + 0.005198775019) *
            n -
            0.019198292004) *
            n +
            0.059054035642) *
            n -
            0.151968751364) *
            n +
            0.319152932694) *
            n -
            0.5319230073) *
            n +
            0.797884560593) *
          t *
          2;
      } else {
        t -= 2;
        a =
          (((((((((((((-4.5255659e-8 * t + 0.00015252929) * t - 1.9538132e-8) *
            t -
            0.000676904986) *
            t +
            0.001390604284) *
            t -
            0.00079462082) *
            t -
            0.002034254874) *
            t +
            0.006549791214) *
            t -
            0.010557625006) *
            t +
            0.011630447319) *
            t -
            0.009279453341) *
            t +
            0.005353579108) *
            t -
            0.002141268741) *
            t +
            0.000535310849) *
            t +
          0.999936657524;
      }
    }
    return r > 0 ? 0.5 * (a + 1) : 0.5 * (1 - a);
  }

  function sceround1(r, t) {
    r = r.toString();
    let a = r.indexOf(".");
    if (a !== -1) {
      let n = r.substring(0, a + 1);
      a++;
      for (let e = 0; e < t && a < r.length; e++, a++) {
        n += r.charAt(a);
      }
      if (a < r.length && parseInt(r.charAt(a)) >= 5) {
        let c = 0.1;
        for (let l = 1; l < t; l++) c *= 0.1;
        c += parseFloat(n);
        r = c.toFixed(t);
      } else {
        r = n;
      }
      r = r.replace(/0+$/, "");
    }
    return r;
  }

  function zpcalc1(a) {
    const r = Math.abs(clczzv1(a));
    return sceround1(r, 7);
  }

  function zcpcalc1(a) {
    const r = 1 - (1 - 1 * Math.abs(clczzv1(0.5 * a)));
    return sceround1(r, 7);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12 ">
                <label htmlFor="tech_to_calculate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_to_calculate"
                    id="tech_to_calculate"
                    value={formData.tech_to_calculate}
                    onChange={handleChange}
                  >
                    <option value="dp">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="sm">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="ds">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="p">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_to_calculate == "dp" && (
                <>
                  <p className="col-span-12 text-center my-1" id="eq">
                    Z = (X − μ) / σ
                  </p>
                </>
              )}
              {formData.tech_to_calculate == "sm" && (
                <>
                  <p className="col-span-12 text-center my-1" id="eq">
                    Z = (x̄ - μ) / σ / √n
                  </p>
                </>
              )}
              {formData.tech_to_calculate == "ds" && (
                <>
                  <p className="col-span-12 text-center my-1" id="eq">
                    Z = (x̄ - μ) / σ / √n
                  </p>
                </>
              )}

              {formData.tech_to_calculate == "p" && (
                <>
                  <div className="col-span-12  pv ">
                    <label htmlFor="tech_pvalue" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (0 - 1):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_pvalue"
                        id="tech_pvalue"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_pvalue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_to_calculate == "ds" && (
                <>
                  <div className="col-span-12  vc4 ">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["7"]} : (
                      {data?.payload?.tech_lang_keys["8"]}):
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_x"
                        id="tech_x"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                        value={formData.tech_x || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_to_calculate == "sm" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 vc3 ">
                    <label htmlFor="tech_smvalue" className="label">
                      {data?.payload?.tech_lang_keys["9"]}: x̄
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_smvalue"
                        id="tech_smvalue"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_smvalue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_to_calculate == "sm" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 vc3b ">
                    <label htmlFor="tech_snvalue" className="label">
                      {data?.payload?.tech_lang_keys["9"]}: x̄
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_snvalue"
                        id="tech_snvalue"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_snvalue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_to_calculate == "dp" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 vc2">
                    <label htmlFor="tech_dsvalue" className="label">
                      {data?.payload?.tech_lang_keys["2"]}: x
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_dsvalue"
                        id="tech_dsvalue"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_dsvalue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_to_calculate == "dp" ||
                formData.tech_to_calculate == "sm" ||
                formData.tech_to_calculate == "ds") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 vc1">
                    <label htmlFor="tech_pmvalue" className="label">
                      {data?.payload?.tech_lang_keys["11"]}: μ
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_pmvalue"
                        id="tech_pmvalue"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_pmvalue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_to_calculate == "dp" ||
                formData.tech_to_calculate == "sm" ||
                formData.tech_to_calculate == "ds") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 vc">
                    <label htmlFor="tech_psdvalue" className="label">
                      {data?.payload?.tech_lang_keys["12"]}: σ
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_psdvalue"
                        id="tech_psdvalue"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_psdvalue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
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
                      <div className="w-full">
                        {formData?.tech_to_calculate == "dp" ? (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]} (x ={" "}
                                  {formData?.tech_dsvalue} , μ ={" "}
                                  {formData?.tech_pmvalue}, σ ={" "}
                                  {formData?.tech_psdvalue})
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    Z = {result?.tech_rz}
                                  </strong>
                                </p>
                              </div>
                            </div>
                            <div className="text-center w-full flex justify-centre">
                              <div className="flex justify-center">
                                <img
                                  src={`/images/z_score/${result.tech_z_url}.png`}
                                  alt="Z-Score Graph"
                                  width="50%"
                                />
                              </div>
                            </div>
                            <p className="w-full text-center mt-2">
                              <strong>
                                Z-score graph refers to the left-tailed p-value
                                in blue
                              </strong>
                            </p>
                            <div className="col-lg-10 mt-2 overflow-auto">
                              <table className="w-full text-[18px]">
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    Left tailed p value
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_ltpv}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    Right tailed p value
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_rtpv}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    Two tailed p value
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_ttpv}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-blue py-2 border-b">
                                    Two tailed confidence level
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_ttcl}
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <p className="w-full mt-3 text-blue text-[20px]">
                              {" "}
                              <b>{data?.payload?.tech_lang_keys["14"]}:</b>
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["15"]}:{" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              x = {formData?.tech_dsvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              μ = {formData?.tech_pmvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              σ = {formData?.tech_psdvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["16"]} Z :{" "}
                            </p>
                            <p className="w-full mt-2"> Z = (X − μ) / σ </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]}{" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = ({formData?.tech_dsvalue} -{" "}
                              {formData?.tech_pmvalue}) /{" "}
                              {formData?.tech_psdvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = {result?.tech_ms} / {formData?.tech_psdvalue}
                            </p>
                            <p className="w-full mt-2 text-blue">
                              {" "}
                              <strong>Z = {result?.tech_rz} </strong>
                            </p>
                          </>
                        ) : null}

                        {formData?.tech_to_calculate == "sm" ? (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]} (x̄ ={" "}
                                  {formData?.tech_smvalue} , n ={" "}
                                  {formData?.tech_snvalue} , μ ={" "}
                                  {formData?.tech_pmvalue}, σ ={" "}
                                  {formData?.tech_psdvalue})
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    Z = {result?.tech_rz}
                                  </strong>
                                </p>
                              </div>
                            </div>
                            <p className="w-full mt-3 text-blue text-[20px]">
                              {" "}
                              <b>{data?.payload?.tech_lang_keys["14"]}:</b>
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["15"]}:{" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              x̄ = {formData?.tech_smvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              n = {formData?.tech_snvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              μ = {formData?.tech_pmvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              σ = {formData?.tech_psdvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["16"]} Z :{" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = (x̄ - μ) / (σ / √n){" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]}{" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = ({formData?.tech_smvalue} -{" "}
                              {formData?.tech_pmvalue}) / (
                              {formData?.tech_psdvalue} / √
                              {formData?.tech_snvalue})
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = ({result?.tech_ms}) / (
                              {formData?.tech_psdvalue} / {result?.tech_sq})
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = ({result?.tech_ms}) / ({result?.tech_mv})
                            </p>
                            <p className="w-full mt-2 text-blue">
                              {" "}
                              <strong>Z = {result?.tech_rz} </strong>
                            </p>
                          </>
                        ) : null}

                        {formData?.tech_to_calculate == "ds" ? (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]} (x ={" "}
                                  {formData?.tech_x}, μ ={" "}
                                  {formData?.tech_pmvalue}, σ ={" "}
                                  {formData?.tech_psdvalue})
                                </strong>
                              </p>
                              <div className="w-full text-center">
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className="text-blue">
                                      Z = {result?.tech_rz}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <div className="w-full text-center">
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className="text-blue">
                                      x̄ = {result?.tech_avg}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <div className="w-full text-center">
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className="text-blue">
                                      n = {result?.tech_n}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="w-full mt-3 text-blue text-[20px]">
                              {" "}
                              <b>{data?.payload?.tech_lang_keys["14"]}:</b>
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["15"]}:{" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              x = {formData?.tech_x}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              n = {data?.payload?.tech_lang_keys["18"]} ={" "}
                              {result?.tech_n}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              μ = {formData?.tech_pmvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              σ = {formData?.tech_psdvalue}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["16"]} Z :{" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = (x̄ - μ) / (σ / √n){" "}
                            </p>
                            <p className="w-full mt-2">
                              x̄ = {data?.payload?.tech_lang_keys["19"]}
                            </p>
                            <p className="w-full mt-2">
                              x̄ = {result?.tech_a} / {result?.tech_n}
                            </p>
                            <p className="w-full mt-2">
                              x̄ = {result?.tech_sum} / {result?.tech_n}
                            </p>
                            <p className="w-full mt-2">
                              x̄ = {result?.tech_avg}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]}{" "}
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = ({result?.tech_avg} - {formData?.tech_pmvalue}
                              ) / ({formData?.tech_psdvalue} / √{result?.tech_n}
                              )
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = ({result?.tech_sm}) / (
                              {formData?.tech_psdvalue} / {result?.tech_sq})
                            </p>
                            <p className="w-full mt-2">
                              {" "}
                              Z = ({result?.tech_sm}) / ({result?.tech_dv})
                            </p>
                            <p className="w-full mt-2 text-blue">
                              {" "}
                              <strong>Z = {result?.tech_rz} </strong>
                            </p>
                          </>
                        ) : null}
                        {formData?.tech_to_calculate == "p" ? (
                          <>
                            <div className="text-center">
                              <p className="text-[20px] font-bold">
                                <p className="text-[20px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]} (P =
                                    &lt; {formData?.tech_pvalue})
                                  </strong>
                                </p>
                              </p>
                              <div className="w-full text-center">
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className="text-blue">
                                      Z = {z1}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <div className="w-full text-center">
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className="text-blue">
                                      Z = {z2}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
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

export default ZscoreCalculator;
