"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useProbabilityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ProbabilityCalculator = () => {
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
    tech_for: "1", // 1 2 3 4 5
    tech_nbr1: "6",
    tech_event: "10",
    tech_nbr2: "12",
    tech_event_a: "16",
    tech_event_b: "18",
    tech_format: "2",
    tech_pro_a: "1",
    tech_pro_b: "1",
    tech_eve_a: "0.0632",
    tech_rep_a: "6",
    tech_eve_b: "0.0341",
    tech_rep_b: "4",
    tech_andb: "48",
    tech_prob_b: "38",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useProbabilityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_for) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_for: formData.tech_for,
        tech_nbr1: formData.tech_nbr1,
        tech_event: formData.tech_event,
        tech_nbr2: formData.tech_nbr2,
        tech_event_a: formData.tech_event_a,
        tech_event_b: formData.tech_event_b,
        tech_format: formData.tech_format,
        tech_pro_a: formData.tech_pro_a,
        tech_pro_b: formData.tech_pro_b,
        tech_eve_a: formData.tech_eve_a,
        tech_rep_a: formData.tech_rep_a,
        tech_eve_b: formData.tech_eve_b,
        tech_rep_b: formData.tech_rep_b,
        tech_andb: formData.tech_andb,
        tech_prob_b: formData.tech_prob_b,
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
      tech_for: "1", // 1 2 3 4 5
      tech_nbr1: "6",
      tech_event: "10",
      tech_nbr2: "12",
      tech_event_a: "16",
      tech_event_b: "18",
      tech_format: "2",
      tech_pro_a: "1",
      tech_pro_b: "1",
      tech_eve_a: "0.0632",
      tech_rep_a: "6",
      tech_eve_b: "0.0341",
      tech_rep_b: "4",
      tech_andb: "48",
      tech_prob_b: "38",
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  ga5-2  md:gap-1">
              <div className="col-span-12 ">
                <label htmlFor="tech_for" className="label">
                  Calculating For:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_for"
                    id="tech_for"
                    value={formData.tech_for}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["single_pro"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["multiple_events"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["two"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["events"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["con_pro"]}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {formData.tech_for == "1" && (
              <>
                <div className="grid grid-cols-12 mt-5 gap-1  md:gap-1 single">
                  <div className="col-span-12">
                    <label htmlFor="tech_nbr1" className="label">
                      {data?.payload?.tech_lang_keys["no_out"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_nbr1"
                        id="tech_nbr1"
                        min="1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_nbr1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_event" className="label">
                      {data?.payload?.tech_lang_keys["no_events"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_event"
                        id="tech_event"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_event}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.tech_for == "2" && (
              <>
                <div className="grid grid-cols-12 mt-5  gap-1  md:gap-1 multi ">
                  <div className="col-span-12">
                    <label htmlFor="tech_nbr2" className="label">
                      {data?.payload?.tech_lang_keys["no_out_n"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_nbr2"
                        id="tech_nbr2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        min="1"
                        value={formData.tech_nbr2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_event_a" className="label">
                      {data?.payload?.tech_lang_keys["no_out_a"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_event_a"
                        id="tech_event_a"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        min="1"
                        value={formData.tech_event_a}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_event_b" className="label">
                      {data?.payload?.tech_lang_keys["no_out_b"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_event_b"
                        id="tech_event_b"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        min="1"
                        value={formData.tech_event_b}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.tech_for == "3" && (
              <>
                <div className="grid grid-cols-12  mt-5  gap-1  md:gap-1 solver ">
                  <div className="col-span-6">
                    <label htmlFor="tech_format" className="label">
                      {data?.payload?.tech_lang_keys["format"]}
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_format"
                        id="tech_format"
                        value={formData.tech_format}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["dec"]}
                        </option>
                        <option value="2">Percent</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_pro_a" className="label">
                      {data?.payload?.tech_lang_keys["pro_of"]} P(A)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_pro_a"
                        id="tech_pro_a"
                        className="input my-2"
                        aria-label="input"
                        placeholder="values between 0 and 1"
                        min="0"
                        max="1"
                        value={formData.tech_pro_a}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_pro_b" className="label">
                      {data?.payload?.tech_lang_keys["pro_of"]} P(B)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_pro_b"
                        id="tech_pro_b"
                        className="input my-2"
                        aria-label="input"
                        placeholder="values between 0 and 1"
                        min="0"
                        max="1"
                        value={formData.tech_pro_b}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.tech_for == "4" && (
              <>
                <div className="grid grid-cols- gap-1 md:gap-1 mt-3 events ">
                  <table className="input_table">
                    <tbody>
                      <tr>
                        <td className="py-2 border-b">&nbsp;</td>
                        <td className="text-center">
                          <label for="eve_a" className="font-s-14 text-blue">
                            {data?.payload?.tech_lang_keys["prob"]}
                          </label>
                        </td>
                        <td className="text-center">
                          <label for="eve_b" className="font-s-14 text-blue">
                            {data?.payload?.tech_lang_keys["rep"]}
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="pe-1">
                          <label for="rep_a" className="font-s-14 text-blue">
                            {data?.payload?.tech_lang_keys["event"]}&nbsp;A
                          </label>
                        </td>
                        <td className="pe-1">
                          <div className="w-full py-1">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_eve_a"
                                id="tech_eve_a"
                                className="input my-2"
                                aria-label="input"
                                placeholder="e.g. 0.0632"
                                min="0"
                                max="1"
                                value={formData.tech_eve_a}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="ps-1">
                          <div className="w-full py-1">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_rep_a"
                                id="tech_rep_a"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                min="1"
                                value={formData.tech_rep_a}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="pe-1">
                          <label for="rep_b" className="font-s-14 text-blue">
                            {data?.payload?.tech_lang_keys["event"]}&nbsp;B
                          </label>
                        </td>
                        <td className="pe-1">
                          <div className="w-full py-1">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_eve_b"
                                id="tech_eve_b"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                min="0"
                                max="1"
                                value={formData.tech_eve_b}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="ps-1">
                          <div className="w-full py-1">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_rep_b"
                                id="tech_rep_b"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                min="1"
                                value={formData.tech_rep_b}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {formData.tech_for == "5" && (
              <>
                <div className="grid grid-cols-12 mt-5   gap-1  md:gap-1 condi ">
                  <div className="col-span-6">
                    <label htmlFor="tech_andb" className="label">
                      P(A and B)
                    </label>
                    <div className="w-full py-2">
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_andb"
                          id="tech_andb"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          min="1"
                          value={formData.tech_andb}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_prob_b" className="label">
                      P(B)
                    </label>
                    <div className="w-full py-2">
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_prob_b"
                          id="tech_prob_b"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          min="1"
                          value={formData.tech_prob_b}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
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
                    <div className="w-full p-3 radius-10 mt-3">
                      <div className="w-full overflow-auto">
                        {result?.tech_Single ? (
                          <>
                            <div className="w-full mt-2 overflow-auto">
                              <table className="min-w-[600px] w-full">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="text-blue">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["dec"]}
                                      </strong>
                                    </td>
                                    <td className="text-blue">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["per"]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <div className="">
                                        <img
                                          src="/images/single1.png"
                                          alt="Probability"
                                          loading="lazy"
                                          className="w-10 sm:w-12 md:w-14 lg:w-[50px] h-auto"
                                        />
                                      </div>
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_occurs_a"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_event_occur}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          result?.tech_event_occur * 100
                                        ).toFixed(2)}{" "}
                                        %
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single2.png"
                                        alt="Probability"
                                        loading="lazy"
                                        className="w-10 sm:w-12 md:w-14 lg:w-[50px] h-auto"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_occurs_a_not"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_occur}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          result?.tech_not_occur * 100
                                        ).toFixed(2)}{" "}
                                        %
                                      </b>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : null}

                        {result?.tech_Solver ? (
                          <>
                            <div className="w-full mt-2 overflow-auto">
                              <table className="min-w-[600px] w-full">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="text-blue">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["dec"]}
                                      </strong>
                                    </td>
                                    <td className="text-blue">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["per"]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single4.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_occurs_a_not"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_a_occur}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_a_occur * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single6.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_occurs_b_not"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_b_occur}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_b_occur * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single7.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_both"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_both_events}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_both_events * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single8.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_either"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_either_events}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {result?.tech_either_events * 100} %
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single7.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["aorb"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_both}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_both * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single9.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["anorb"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_nor_both}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_nor_both * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single6.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {data?.payload?.tech_lang_keys["nb"]} B
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_anotb}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_anotb * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single4.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      B {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {data?.payload?.tech_lang_keys["nb"]} A:
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_bnota}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_bnota * 100} %</b>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="row">
                                <p className="text-blue font-s-20">
                                  <strong>Steps</strong>
                                </p>
                                <div className="col-lg-6">
                                  <p>P(A') = 1 - P(A)</p>
                                  <p>P(A') = 1 - {result?.tech_pro_a}</p>
                                  <p>P(A') = {result?.tech_not_a_occur}</p>
                                </div>
                                <div className="col-lg-6 mt-lg-0 mt-2">
                                  <p>P(B') = 1 - P(B)</p>
                                  <p>P(B') = 1 - {result?.tech_pro_b}</p>
                                  <p>P(B') = {result?.tech_not_b_occur}</p>
                                </div>
                                <div className="col-lg-6 mt-2">
                                  <p>P(A∩B) = P(A) × P(B)</p>
                                  <p>
                                    P(A∩B) = {result?.tech_pro_a} *{" "}
                                    {result?.tech_pro_a}
                                  </p>
                                  <p>P(A∩B) = {result?.tech_both_events}</p>
                                </div>
                                <div className="col-lg-6 mt-2">
                                  <p>P(A∪B) = P(A) + P(B) - P(A∩B)</p>
                                  <p>
                                    P(A∪B) = {result?.tech_pro_a} +{" "}
                                    {result?.tech_pro_b} -{" "}
                                    {result?.tech_both_events}
                                  </p>
                                  <p>P(A∪B) = {result?.tech_either_events}</p>
                                </div>
                                <div className="col-lg-6 mt-2">
                                  <p>P(AΔB) = P(A) + P(B) - 2P(A∩B)</p>
                                  <p>
                                    P(AΔB) = {result?.tech_pro_a} +{" "}
                                    {result?.tech_pro_a} - 2 *{" "}
                                    {result?.tech_both_events}
                                  </p>
                                  <p>P(AΔB) = {result?.tech_not_both}</p>
                                </div>
                                <div className="col-lg-6 mt-2">
                                  <p>P((A∪B)') = 1 - P(A∪B)</p>
                                  <p>
                                    P((A∪B)') = 1 - {result?.tech_either_events}
                                  </p>
                                  <p>P((A∪B)') = {result?.tech_nor_both}</p>
                                </div>
                                <div className="col-lg-6 mt-2">
                                  <p>
                                    P(A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                    {data?.payload?.tech_lang_keys["nb"]} B) =
                                    P(A) × (1- P(B))
                                  </p>
                                  <p>
                                    P(A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                    {data?.payload?.tech_lang_keys["nb"]} B) ={" "}
                                    {result?.tech_pro_a} × (1 -{" "}
                                    {result?.tech_pro_a})
                                  </p>
                                  <p>
                                    P(A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                    {data?.payload?.tech_lang_keys["nb"]} B) ={" "}
                                    {result?.tech_anotb}
                                  </p>
                                </div>
                                <div className="col-lg-6 mt-2">
                                  <p>
                                    P(B {data?.payload?.tech_lang_keys["occr"]}{" "}
                                    {data?.payload?.tech_lang_keys["nb"]} A) =
                                    (1 - P(A)) × P(B)
                                  </p>
                                  <p>
                                    P(B {data?.payload?.tech_lang_keys["occr"]}{" "}
                                    {data?.payload?.tech_lang_keys["nb"]} A) =
                                    (1 - {result?.tech_pro_a}) ×{" "}
                                    {result?.tech_pro_a}
                                  </p>
                                  <p>
                                    P(B {data?.payload?.tech_lang_keys["occr"]}{" "}
                                    {data?.payload?.tech_lang_keys["nb"]} A) ={" "}
                                    {result?.tech_bnota}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}

                        {result?.tech_Events ? (
                          <>
                            <div className="w-full mt-2 overflow-auto">
                              <table className="min-w-[600px] w-full">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {formData?.tech_rep_a}{" "}
                                      {data?.payload?.tech_lang_keys["time"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            formData?.tech_eve_a,
                                            formData?.tech_rep_a
                                          )
                                        ).toFixed(5)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      A {data?.payload?.tech_lang_keys["not"]}{" "}
                                      {data?.payload?.tech_lang_keys["occr"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            1 - formData?.tech_eve_a,
                                            formData?.tech_rep_a
                                          )
                                        ).toFixed(5)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      A {data?.payload?.tech_lang_keys["occr"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          1 -
                                            Math.pow(
                                              1 - formData?.tech_eve_a,
                                              formData?.tech_rep_a
                                            )
                                        ).toFixed(5)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      B {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {formData?.tech_rep_b}{" "}
                                      {data?.payload?.tech_lang_keys["time"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            formData?.tech_eve_b,
                                            formData?.tech_rep_b
                                          )
                                        ).toFixed(5)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      B {data?.payload?.tech_lang_keys["not"]}{" "}
                                      {data?.payload?.tech_lang_keys["occr"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            1 - formData?.tech_eve_b,
                                            formData?.tech_rep_b
                                          )
                                        ).toFixed(5)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      B {data?.payload?.tech_lang_keys["occr"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          1 -
                                            Math.pow(
                                              1 - formData?.tech_eve_b,
                                              formData?.tech_rep_b
                                            )
                                        ).toFixed(5)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {formData?.tech_rep_a}{" "}
                                      {data?.payload?.tech_lang_keys["time"]}{" "}
                                      and B{" "}
                                      {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {formData?.tech_rep_b}{" "}
                                      {data?.payload?.tech_lang_keys["time"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            formData?.tech_eve_a,
                                            formData?.tech_rep_a
                                          ) *
                                            Math.pow(
                                              formData?.tech_eve_b,
                                              formData?.tech_rep_b
                                            )
                                        ).toFixed(9)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      neither A nor B{" "}
                                      {data?.payload?.tech_lang_keys["occr"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            1 - formData?.tech_eve_a,
                                            formData?.tech_rep_a
                                          ) *
                                            Math.pow(
                                              1 - formData?.tech_eve_b,
                                              formData?.tech_rep_b
                                            )
                                        ).toFixed(9)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      both A and B{" "}
                                      {data?.payload?.tech_lang_keys["occr"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          (1 -
                                            Math.pow(
                                              1 - formData?.tech_eve_a,
                                              formData?.tech_rep_a
                                            )) *
                                            (1 -
                                              Math.pow(
                                                1 - formData?.tech_eve_b,
                                                formData?.tech_rep_b
                                              ))
                                        ).toFixed(9)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {formData?.tech_rep_a}{" "}
                                      {data?.payload?.tech_lang_keys["time"]}{" "}
                                      {data?.payload?.tech_lang_keys["nb"]} B
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            formData?.tech_eve_a,
                                            formData?.tech_rep_a
                                          ) *
                                            Math.pow(
                                              1 - formData?.tech_eve_b,
                                              formData?.tech_rep_b
                                            )
                                        ).toFixed(9)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      B {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {formData?.tech_rep_b}{" "}
                                      {data?.payload?.tech_lang_keys["time"]}{" "}
                                      {data?.payload?.tech_lang_keys["nb"]} A
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            1 - formData?.tech_eve_a,
                                            formData?.tech_rep_a
                                          ) *
                                            Math.pow(
                                              formData?.tech_eve_b,
                                              formData?.tech_rep_b
                                            )
                                        ).toFixed(9)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {data?.payload?.tech_lang_keys["nb"]} B
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          (1 -
                                            Math.pow(
                                              1 - formData?.tech_eve_a,
                                              formData?.tech_rep_a
                                            )) *
                                            Math.pow(
                                              1 - formData?.tech_eve_b,
                                              formData?.tech_rep_b
                                            )
                                        ).toFixed(9)}
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["pro_of"]}{" "}
                                      A {data?.payload?.tech_lang_keys["occr"]}{" "}
                                      {data?.payload?.tech_lang_keys["nb"]} B
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {Number(
                                          Math.pow(
                                            1 - formData?.tech_eve_a,
                                            formData?.tech_rep_a
                                          ) *
                                            (1 -
                                              Math.pow(
                                                1 - formData?.tech_eve_b,
                                                formData?.tech_rep_b
                                              ))
                                        ).toFixed(9)}
                                      </b>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : null}

                        {result?.tech_Multiple ? (
                          <>
                            <div className="w-full mt-2 overflow-auto">
                              <table className="min-w-[600px] w-full">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="text-blue py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["dec"]}
                                      </strong>
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["per"]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single3.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_occurs_a"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_event_a_occur}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {result?.tech_event_a_occur * 100} %
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single4.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_occurs_a_not"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_a_occur}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_a_occur * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single5.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_occurs_b"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_event_b_occur}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {result?.tech_event_b_occur * 100} %
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single6.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_occurs_b_not"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_b_occur}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_not_b_occur * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single7.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_both"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_both_events}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_both_events * 100} %</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single8.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "pro_either"
                                        ]
                                      }
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_either_events}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>
                                        {result?.tech_either_events * 100} %
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single9.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["con_pro"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_conditional}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_conditional * 100} %</b>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : null}

                        {result?.tech_condi ? (
                          <>
                            <div className="w-full mt-2 overflow-auto">
                              <table className="min-w-[600px] w-full">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="py-2 border-b text-blue">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["dec"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b text-blue">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["per"]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <img
                                        src="/images/single9.png"
                                        loading="lazy"
                                        alt="Probability"
                                        className="image"
                                        width="50"
                                      />
                                    </td>
                                    <td className="py-2 border-b text-blue">
                                      {data?.payload?.tech_lang_keys["con_pro"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_condi}</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>{result?.tech_condi * 100} %</b>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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

export default ProbabilityCalculator;
