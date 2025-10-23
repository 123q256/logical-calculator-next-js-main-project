"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePercentileCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PercentileCalculator = () => {
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
    seprateby: "space", //  user  ,
    seprate: " ",
    x: "12,32,12,33,4,21",
    p: "16",
    advancedcheck: true, // false  true
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePercentileCalculatorMutation();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResult(null);
    setFormError(null);

    // Handle checkbox first and return
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? "true" : "false",
      }));
      return; // <-- stop here for checkbox
    }

    // Separator dropdown change
    if (name === "seprateby") {
      let sep = "";
      let updatedTechX = formData.x;

      if (value === "space") {
        sep = " ";
        updatedTechX = formData.x.replaceAll(",", " ");
      } else if (value === ",") {
        sep = ",";
        updatedTechX = formData.x.replaceAll(" ", ",");
      } else if (value === "user") {
        sep = "";
      }

      setFormData((prev) => ({
        ...prev,
        seprateby: value,
        seprate: sep,
        x: updatedTechX,
      }));
      return; // <-- stop here for seprateby change
    }

    if (name === "x") {
      let updatedValue = value;

      if (formData.seprateby === "space") {
        updatedValue = value.replaceAll(",", " ");
      } else if (formData.seprateby === ",") {
        updatedValue = value.replaceAll(" ", ",");
      } else if (formData.seprateby === "user") {
        const sep = formData.seprate;
        const parts = value
          .split(sep)
          .map((val) => val.trim())
          .filter((val) => val !== "");

        updatedValue = parts.join(" ");
      }

      setFormData((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
      return; // <-- stop here for x change
    }

    // Default case for other inputs (e.g., seprate)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.seprateby ||
      !formData.seprate ||
      !formData.x ||
      !formData.p
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        seprateby: formData.seprateby,
        seprate: formData.seprate,
        x: formData.x,
        p: formData.p,
        advancedcheck: formData.advancedcheck,
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
      seprateby: "space", //  user  ,
      seprate: "",
      x: "12,32,12,33,4,21",
      p: "16",
      advancedcheck: true, // false  true
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
            <div className="grid grid-cols-12  gap-1  md:gap-3">
              <div className="col-span-12 md:col-span-6 relative">
                <label htmlFor="seprateby" className="label">
                  {data?.payload?.tech_lang_keys["no"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="seprateby"
                    id="seprateby"
                    value={formData.seprateby}
                    onChange={handleChange}
                  >
                    <option value="space">
                      {data?.payload?.tech_lang_keys["Space"]}
                    </option>
                    <option value=",">
                      {data?.payload?.tech_lang_keys["comma"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="seprate" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    name="seprate"
                    id="seprate"
                    className="input my-2"
                    aria-label="input"
                    readOnly
                    value={formData.seprate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-1  md:gap-2">
              <div className="col-span-12">
                <label htmlFor="x" className="label">
                  {data?.payload?.tech_lang_keys["enter"]} :
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="x"
                    id="x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 55 62 35 32 50 57 54"
                    value={formData.x || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-1  md: gap24">
              <div className="col-span-12 md:col-span-6 ">
                <label htmlFor="p" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="p"
                    id="p"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.p}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="col-span-12 relative flex items-center">
                <span className="font-s-14">&nbsp;</span>
                <div className="w-full  d-flex align-items-center ">
                  <label className="pe-2" htmlFor="true">
                    <input
                      type="checkbox"
                      name="conversionType"
                      value="true"
                      id="true"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.conversionType === "true"}
                    />
                    <span>{data?.payload?.tech_lang_keys["2"]} 5%</span>
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
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-12 md:col-span-10 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="text-[#2845F5] py-2 border-b">
                                  {data?.payload?.tech_lang_keys["3"]} 1:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[4]}{" "}
                                    {result?.tech_p}th{" "}
                                    {data?.payload?.tech_lang_keys[5]}{" "}
                                    <span className="text-[#2845F5]">
                                      {result?.tech_final_ans1}
                                    </span>
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-[#2845F5] py-2 border-b">
                                  {data?.payload?.tech_lang_keys["3"]} 2:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[4]}{" "}
                                    {result?.tech_p}th{" "}
                                    {data?.payload?.tech_lang_keys[5]}{" "}
                                    <span className="text-[#2845F5]">
                                      {result?.tech_final_ans2}
                                    </span>
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-[#2845F5] py-2 border-b">
                                  {data?.payload?.tech_lang_keys["3"]} 3:
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[4]}{" "}
                                    {result?.tech_p}th{" "}
                                    {data?.payload?.tech_lang_keys[5]}{" "}
                                    <span className="text-[#2845F5]">
                                      {Number(result?.tech_final_ans).toFixed(
                                        2
                                      )}
                                    </span>
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <p className="col-span-12  mt-3 font-s-20">
                          <b className="text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[6]} :
                          </b>
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>{data?.payload?.tech_lang_keys[7]} </strong>=
                          ({formData?.x})
                        </p>

                        <p className="col-span-12  mt-2 text-[18px]">
                          <b>
                            {data?.payload?.tech_lang_keys[8]} 1{" "}
                            {data?.payload?.tech_lang_keys[9]} :
                          </b>
                        </p>

                        <p className="col-span-12  mt-3 text-[18px]">
                          <strong className="text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[10]} 1:{" "}
                          </strong>
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys[11]} ={" "}
                          </strong>
                          (
                          {result?.tech_numbers &&
                          result.tech_numbers.length > 0
                            ? result.tech_numbers.map((num, idx) => (
                                <span key={idx}>
                                  {num}
                                  {idx < result.tech_numbers.length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))
                            : "No numbers available"}
                          )
                        </p>

                        <p className="col-span-12  mt-3 font-s-20">
                          <strong className="text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[10]} 2:{" "}
                          </strong>
                        </p>

                        <p className="col-span-12  mt-2">
                          {data?.payload?.tech_lang_keys[12]} (
                          {data?.payload?.tech_lang_keys[13]} i):
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= (p/100)n,{" "}
                          {data?.payload?.tech_lang_keys[14]} <strong>p</strong>{" "}
                          = {/* replace with p value */}{" "}
                          {data?.payload?.tech_lang_keys[15]} <strong>n</strong>{" "}
                          = {result?.tech_n}
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= ({result?.tech_p}/100) *{" "}
                          {result?.tech_n} = {result?.tech_p_per} *{" "}
                          {result?.tech_n} =&gt; {result?.tech_ab}
                        </p>

                        <p className="col-span-12  mt-2">
                          {data?.payload?.tech_lang_keys[16]} i ={" "}
                          {result?.tech_final_ans11}:
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= {result?.tech_final_ans1}
                        </p>

                        <p className="col-span-12  mt-2 text-[18px]">
                          <b>
                            {data?.payload?.tech_lang_keys[8]} 2{" "}
                            {data?.payload?.tech_lang_keys[9]} :
                          </b>
                        </p>

                        <p className="col-span-12  mt-3 font-s-20">
                          <strong className="text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[10]} 1:{" "}
                          </strong>
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys[11]} ={" "}
                          </strong>
                          (
                          {result?.tech_numbers &&
                          result.tech_numbers.length > 0
                            ? result.tech_numbers.map((num, idx) => (
                                <span className="font_size18" key={idx}>
                                  {num}
                                  {idx < result.tech_numbers.length - 1
                                    ? ","
                                    : ""}
                                </span>
                              ))
                            : "No numbers available"}
                          )
                        </p>

                        <p className="col-span-12  mt-3 font-s-20">
                          <strong className="text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[10]} 2:{" "}
                          </strong>
                        </p>

                        <p className="col-span-12  mt-2">
                          {data?.payload?.tech_lang_keys[12]} (
                          {data?.payload?.tech_lang_keys[13]} i):
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= (p/100)(n-1) + 1,{" "}
                          {data?.payload?.tech_lang_keys[14]} <strong>p</strong>{" "}
                          = {/* p value here */} and <strong>n</strong> ={" "}
                          {result?.tech_n}
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= ({result?.tech_p}/100)(
                          {result?.tech_n} - 1) + 1 = {result?.tech_p_per} *{" "}
                          {result?.tech_n_sum_method2} + 1 =&gt;{" "}
                          {result?.tech_ans_method2}
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= {result?.tech_b} + (
                          {result?.tech_ans2_method2}) * {result?.tech_diff}{" "}
                          =&gt; {result?.tech_b} + {result?.tech_ans_diff2}
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= {result?.tech_final_ans2}
                        </p>

                        <p className="col-span-12  mt-2 text-[18px]">
                          <b>
                            {data?.payload?.tech_lang_keys[8]} 3{" "}
                            {data?.payload?.tech_lang_keys[9]} :
                          </b>
                        </p>

                        <p className="col-span-12  mt-3 font-s-20">
                          <strong className="text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[10]} 1:{" "}
                          </strong>
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys[11]} ={" "}
                          </strong>
                          (
                          {result?.tech_numbers &&
                          result.tech_numbers.length > 0
                            ? result.tech_numbers.map((num, idx) => (
                                <span className="font_size18" key={idx}>
                                  {num}
                                  {idx < result.tech_numbers.length - 1
                                    ? ","
                                    : ""}
                                </span>
                              ))
                            : "No numbers available"}
                          )
                        </p>

                        <p className="col-span-12  mt-3 font-s-20">
                          <strong className="text-[#2845F5]">
                            {data?.payload?.tech_lang_keys[10]} 2:{" "}
                          </strong>
                        </p>

                        <p className="col-span-12  mt-2">
                          {data?.payload?.tech_lang_keys[12]} (
                          {data?.payload?.tech_lang_keys[13]} i):
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= (n+1) * (p/100),{" "}
                          {data?.payload?.tech_lang_keys[14]} <strong>p</strong>{" "}
                          = {/* p value here */} and <strong>n</strong> ={" "}
                          {result?.tech_n}
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= ({result?.tech_n} + 1) * (
                          {result?.tech_p}/100) = {result?.tech_n_sum} *{" "}
                          {result?.tech_p_per} =&gt; {result?.tech_ans}
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= {result?.tech_b} + (
                          {result?.tech_ans2}) * {result?.tech_diff} =&gt;{" "}
                          {result?.tech_b} + {result?.tech_ans_diff}
                        </p>

                        <p className="col-span-12  mt-2">
                          <strong>i </strong>= {result?.tech_final_ans}
                        </p>

                        {result?.tech_final_ans3 && (
                          <div className="col-span-12 md:col-span-8 overflow-auto">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" colSpan="2">
                                    {data?.payload?.tech_lang_keys[17]}
                                  </td>
                                </tr>
                                {result.tech_final_ans3.map((value, index) => (
                                  <tr key={index}>
                                    <td className="py-2 border-b">
                                      {index * 5}th
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{value}</strong>
                                    </td>
                                  </tr>
                                ))}
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

export default PercentileCalculator;
