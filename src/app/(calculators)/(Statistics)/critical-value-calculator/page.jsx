"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { jStat } from "jstat";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCriticalValueCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CriticalValueCalculator = () => {
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
    tech_calculator_name: "t_val", // t_val  z_val  f_val  chi_val   r_val
    tech_first: "0.3",
    tech_second: "7",
    tech_third: "45",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCriticalValueCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculator_name) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculator_name: formData.tech_calculator_name,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
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
      tech_calculator_name: "t_val", // t_val  z_val  f_val  chi_val   r_val
      tech_first: "0.3",
      tech_second: "7",
      tech_third: "45",
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

  const isTVal = result?.tech_submit === "t_val";
  const isZVal = result?.tech_submit === "z_val";

  const isChiVal = result?.tech_submit === "chi_val";
  const isFVal = result?.tech_submit === "f_val";
  const isRVal = result?.tech_submit === "r_val";

  useEffect(() => {
    if (!result || !result?.tech_submit) return;

    const submitType = result.tech_submit;

    if (submitType === "chi_val") {
      const alpha = parseFloat(result?.tech_value);
      const df = parseInt(result?.tech_degree);
      const right = jStat.chisquare.inv(1 - alpha, df);
      const left = jStat.chisquare.inv(alpha, df);
      const twoLeft = jStat.chisquare.inv(alpha / 2, df);
      const twoRight = jStat.chisquare.inv(1 - alpha / 2, df);
      document.getElementById("chi__right").textContent = right.toFixed(4);
      document.getElementById("chi__left").textContent = left.toFixed(4);
      document.getElementById("chi__two").textContent = `${twoLeft.toFixed(
        4
      )} & ${twoRight.toFixed(4)}`;
    }

    if (submitType === "f_val") {
      const alpha = parseFloat(result?.tech_first);
      const df1 = parseInt(result?.tech_second);
      const df2 = parseInt(result?.tech_third);
      const right = jStat.centralF.inv(1 - alpha, df1, df2);
      const left = jStat.centralF.inv(alpha, df1, df2);
      const twoLeft = jStat.centralF.inv(alpha / 2, df1, df2);
      const twoRight = jStat.centralF.inv(1 - alpha / 2, df1, df2);
      document.getElementById("f__right").textContent = right.toFixed(4);
      document.getElementById("f__left").textContent = left.toFixed(4);
      document.getElementById("f__two").textContent = `${twoLeft.toFixed(
        4
      )} & ${twoRight.toFixed(4)}`;
    }

    if (submitType === "r_val") {
      const alpha = parseFloat(result?.tech_value);
      const df = parseInt(result?.tech_degree);
      const t = jStat.studentt.inv(1 - alpha, df);
      const _2t = jStat.studentt.inv(1 - alpha / 2, df);
      const oneTailed = t / Math.sqrt(t * t + df);
      const twoTailed = _2t / Math.sqrt(_2t * _2t + df);
      document.getElementById("r__right").textContent = oneTailed.toFixed(4);
      document.getElementById("r__left").textContent = `-${oneTailed.toFixed(
        4
      )}`;
      document.getElementById("r__two").textContent = twoTailed.toFixed(4);
    }
  }, [result, result]);

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

          <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[100%] w-full">
            <div className="col-lg-2 py-2 font-s-14">
              {data?.payload?.tech_lang_keys["to_calc"]}:
            </div>
            <input
              type="hidden"
              name="tech_calculator_name"
              id="calculator_time"
              value={formData.tech_calculator_name}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              <div className="lg:w-1/5 w-full px-1 py-1 t_val">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                    formData.tech_calculator_name === "t_val" ? "tagsUnit" : ""
                  }`}
                  id="t_val"
                  onClick={() => {
                    setFormData({ ...formData, tech_calculator_name: "t_val" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  T Value
                </div>
              </div>
              <div className="lg:w-1/5 w-full px-2 py-1 z_val">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_calculator_name === "z_val" ? "tagsUnit" : ""
                  }`}
                  id="z_val"
                  onClick={() => {
                    setFormData({ ...formData, tech_calculator_name: "z_val" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  Z Value
                </div>
              </div>
              <div className="lg:w-1/5 w-full px-2 py-1 f_val">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_calculator_name === "f_val" ? "tagsUnit" : ""
                  }`}
                  id="f_val"
                  onClick={() => {
                    setFormData({ ...formData, tech_calculator_name: "f_val" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  F Value
                </div>
              </div>
              <div className="lg:w-1/5 w-full px-2 py-1 chi_val">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_calculator_name === "chi_val"
                      ? "tagsUnit"
                      : ""
                  }`}
                  id="chi_val"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      tech_calculator_name: "chi_val",
                    });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  Chi-Square Value
                </div>
              </div>
              <div className="lg:w-1/5 w-full px-2 py-1 r_val">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_calculator_name === "r_val" ? "tagsUnit" : ""
                  }`}
                  id="r_val"
                  onClick={() => {
                    setFormData({ ...formData, tech_calculator_name: "r_val" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  R Value
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[90%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-5">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <div className="grid grid-cols-12 mt-3 ">
                  {(formData.tech_calculator_name == "t_val" ||
                    formData.tech_calculator_name == "z_val" ||
                    formData.tech_calculator_name == "f_val" ||
                    formData.tech_calculator_name == "chi_val" ||
                    formData.tech_calculator_name == "r_val") && (
                    <>
                      <div className="col-span-12 f_input">
                        {formData.tech_calculator_name == "z_val" ? (
                          <>
                            <label htmlFor="tech_first" className="label">
                              Significance Level α: (0 to 1)
                            </label>
                          </>
                        ) : (
                          <>
                            <label htmlFor="tech_first" className="label">
                              Significance Level α: (0 to 0.5)
                            </label>
                          </>
                        )}

                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_first"
                            id="tech_first"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            min="0"
                            max="0.5"
                            value={formData.tech_first}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_calculator_name == "f_val" ||
                    formData.tech_calculator_name == "f_val") && (
                    <>
                      <div className="col-span-12 s_input">
                        <label htmlFor="tech_second" className="label">
                          Degrees of Freedom Numerator
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_second"
                            id="tech_second"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_second}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_calculator_name == "t_val" ||
                    formData.tech_calculator_name == "f_val" ||
                    formData.tech_calculator_name == "chi_val" ||
                    formData.tech_calculator_name == "r_val") && (
                    <>
                      <div className="col-span-12 t_input">
                        <label htmlFor="tech_third" className="label">
                          {" "}
                          {data?.payload?.tech_lang_keys["d_f"]}
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_third"
                            id="tech_third"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_third}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {formData.tech_calculator_name == "t_val" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <p className="col-12 text-[18px] mt-4">
                      <strong id="main_text" className="text-blue">
                        How Does T Critical Value Calculator Work?
                      </strong>
                    </p>
                    <ul className="col-12 mt-2 ms-1">
                      <li className="my-2 ms-3" id="f_li">
                        Enter <strong>Significance Level(&alpha;)</strong> In
                        The Input Box.
                      </li>
                      <li className="my-2 ms-3" id="s_li">
                        Put the <strong>Degrees Of Freedom</strong> In The Input
                        Box.
                      </li>
                      <li className="my-2 ms-3 d-none" id="extra_li">
                        Hit The <strong>Calculate</strong> Button To Find{" "}
                        <strong>T</strong> Critical Value.
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {formData.tech_calculator_name == "z_val" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <p className="col-12 text-[18px] mt-4">
                      <strong id="main_text" className="text-blue">
                        How Does Z Critical Value Calculator Work?
                      </strong>
                    </p>
                    <ul className="col-12 mt-2 ms-1">
                      <li className="my-2 ms-3" id="f_li">
                        Enter The <strong>Significance Level(&alpha;)</strong>{" "}
                        In The Input Box.
                      </li>
                      <li className="my-2 ms-3" id="s_li">
                        Use The <strong>Calculate</strong> Button To Get The{" "}
                        <strong>Z</strong> Critical Value.
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {formData.tech_calculator_name == "chi_val" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <p className="col-12 text-[18px] mt-4">
                      <strong id="main_text" className="text-blue">
                        How Does This Calculator Work?
                      </strong>
                    </p>
                    <ul className="col-12 mt-2 ms-1">
                      <li className="my-2 ms-3" id="f_li">
                        Enter <strong>Significance Level(&alpha;)</strong> In
                        Required Input Box.
                      </li>
                      <li className="my-2 ms-3" id="s_li">
                        Enter <strong>Degree of freedom</strong> In Required
                        Input Box.
                      </li>
                      <li className="my-2 ms-3 d-none" id="extra_li">
                        Click The <strong>Calculate</strong> Button.
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {formData.tech_calculator_name == "f_val" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <p className="col-12 text-[18px] mt-4">
                      <strong id="main_text" className="text-blue">
                        How Does F Critical Value Calculator Work?
                      </strong>
                    </p>
                    <ul className="col-12 mt-2 ms-1">
                      <li className="my-2 ms-3" id="f_li">
                        Enter <strong>Significance Level(&alpha;)</strong>
                      </li>
                      <li className="my-2 ms-3" id="s_li">
                        Enter <strong>Degree of freedom</strong> of numerator in
                        required input box.
                      </li>
                      <li className="my-2 ms-3 d-none" id="extra_li">
                        Click The <strong>Calculate</strong> Button.
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {formData.tech_calculator_name == "r_val" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <p className="col-12 text-[18px] mt-4">
                      <strong id="main_text" className="text-blue">
                        How Does R Critical Value Calculator Work?
                      </strong>
                    </p>
                    <ul className="col-12 mt-2 ms-1">
                      <li className="my-2 ms-3" id="f_li">
                        Enter <strong>Significance Level(&alpha;)</strong> In
                        Required Input Box.
                      </li>
                      <li className="my-2 ms-3" id="s_li">
                        Enter <strong>Degree of freedom</strong> In Required
                        Input Box.
                      </li>
                      <li className="my-2 ms-3 d-none" id="extra_li">
                        Click The <strong>Calculate</strong> Button.
                      </li>
                    </ul>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {isTVal && (
                          <>
                            <div className="w-full md:w-[90%] lg:w-[70%] mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">
                                      T Value for Right Tailed Probability
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_t_jawab[0]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      T Value for Left Tailed Probability
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_t_jawab[1]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      T Value for Two Tailed Probability
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="text-blue">
                                        {result?.tech_t_jawab[2]}
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_t_jawab[3],
                              }}
                            />
                            <div
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_t_jawab[4],
                              }}
                            />
                          </>
                        )}

                        {isZVal && (
                          <div className="w-full md:w-[90%] lg:w-[70%] mt-2 overflow-auto">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b">Z Value</td>
                                  <td className="py-2 border-b">
                                    <strong className="text-blue">
                                      {Number(result?.tech_z_jawab[2]).toFixed(
                                        6
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    Z Value for Right Tailed Probability
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong className="text-blue">
                                      {Number(result?.tech_z_jawab[1]).toFixed(
                                        6
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    Z Value for Left Tailed Probability
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong className="text-blue">
                                      {Number(result?.tech_z_jawab[0]).toFixed(
                                        6
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    Z Value for Two Tailed Probability
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong className="text-blue">
                                      {result?.tech_z_jawab[3]}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {(isChiVal || isFVal || isRVal) && (
                          <div className="w-full md:w-[90%] lg:w-[70%] mt-2 overflow-auto">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b">
                                    Right Tailed
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong
                                      className="text-blue"
                                      id={`${
                                        result.tech_submit.split("_")[0]
                                      }__right`}
                                    ></strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">Left Tailed</td>
                                  <td className="py-2 border-b">
                                    <strong
                                      className="text-blue"
                                      id={`${
                                        result.tech_submit.split("_")[0]
                                      }__left`}
                                    ></strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">Two Tailed</td>
                                  <td className="py-2 border-b">
                                    <strong
                                      className="text-blue"
                                      id={`${
                                        result.tech_submit.split("_")[0]
                                      }__two`}
                                    ></strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
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

export default CriticalValueCalculator;
