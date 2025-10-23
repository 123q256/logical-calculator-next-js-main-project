"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMomentOfInertiaCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MomentOfInertiaCalculator = () => {
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
    tech_selection: "1", // 1 2 3 4  7 8 9 10 11
    tech_b_width: "4",
    tech_radius: "1",
    tech_radius2: "1",
    tech_height: "1",
    tech_dis_to_height: "1",
    tech_tfw: "1",
    tech_tft: "1",
    tech_bfw: "1",
    tech_bft: "1",
    tech_lft: "1",
    tech_lfh: "1",
    tech_wh: "1",
    tech_wt: "1",
    tech_r: "1",
    tech_b1: "1",
    tech_h1: "1",
    tech_unit: "mm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMomentOfInertiaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_b_width: formData.tech_b_width,
        tech_radius: formData.tech_radius,
        tech_radius2: formData.tech_radius2,
        tech_height: formData.tech_height,
        tech_dis_to_height: formData.tech_dis_to_height,
        tech_tfw: formData.tech_tfw,
        tech_tft: formData.tech_tft,
        tech_bfw: formData.tech_bfw,
        tech_bft: formData.tech_bft,
        tech_lft: formData.tech_lft,
        tech_lfh: formData.tech_lfh,
        tech_wh: formData.tech_wh,
        tech_wt: formData.tech_wt,
        tech_r: formData.tech_r,
        tech_b1: formData.tech_b1,
        tech_h1: formData.tech_h1,
        tech_unit: formData.tech_unit,
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
      tech_selection: "1", // 1 2 3 4  7 8 9 10 11
      tech_b_width: "4",
      tech_radius: "1",
      tech_radius2: "1",
      tech_height: "1",
      tech_dis_to_height: "1",
      tech_tfw: "1",
      tech_tft: "1",
      tech_bfw: "1",
      tech_bft: "1",
      tech_lft: "1",
      tech_lfh: "1",
      tech_wh: "1",
      tech_wt: "1",
      tech_r: "1",
      tech_b1: "1",
      tech_h1: "1",
      tech_unit: "mm",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {" "}
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="4">
                      {" "}
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="7">
                      {" "}
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="8">
                      {" "}
                      I-{data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="9">
                      {" "}
                      L-{data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="10">
                      T-{data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="11">
                      {" "}
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 flex justify-center my-3">
                {formData.tech_selection == "1" && (
                  <>
                    <img
                      src="/images/p9.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
                {formData.tech_selection == "2" && (
                  <>
                    <img
                      src="/images/p1.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
                {formData.tech_selection == "3" && (
                  <>
                    <img
                      src="/images/p4.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
                {formData.tech_selection == "4" && (
                  <>
                    <img
                      src="/images/p3.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
                {formData.tech_selection == "7" && (
                  <>
                    <img
                      src="/images/p2.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
                {formData.tech_selection == "8" && (
                  <>
                    <img
                      src="/images/p5.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
                {formData.tech_selection == "9" && (
                  <>
                    <img
                      src="/images/p7.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
                {formData.tech_selection == "10" && (
                  <>
                    <img
                      src="/images/p6.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
                {formData.tech_selection == "11" && (
                  <>
                    <img
                      src="/images/p8.png"
                      alt="moment of inertia calculator"
                      width="180"
                      height="180"
                      className="change_img coloring"
                    />
                  </>
                )}
              </div>

              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2" ||
                formData.tech_selection == "7") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 base">
                    <label htmlFor="tech_b_width" className="label">
                      {data?.payload?.tech_lang_keys["9"]} (b):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_b_width"
                        id="tech_b_width"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_b_width}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "3" ||
                formData.tech_selection == "4") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  radius">
                    <label htmlFor="tech_radius" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_radius"
                        id="tech_radius"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_radius}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "3" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  radius2">
                    <label htmlFor="tech_radius2" className="label">
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_radius2"
                        id="tech_radius2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_radius2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2" ||
                formData.tech_selection == "7") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 height">
                    <label htmlFor="tech_height" className="label">
                      {data?.payload?.tech_lang_keys["12"]} (h)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height"
                        id="tech_height"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 distance">
                    <label htmlFor="tech_dis_to_height" className="label">
                      {data?.payload?.tech_lang_keys["13"]} (a)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_dis_to_height"
                        id="tech_dis_to_height"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_dis_to_height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "8" ||
                formData.tech_selection == "10" ||
                formData.tech_selection == "11") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  tfw">
                    <label htmlFor="tech_tfw" className="label">
                      TFw
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_tfw"
                        id="tech_tfw"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_tfw}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "8" ||
                formData.tech_selection == "10" ||
                formData.tech_selection == "11") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis tft">
                    <label htmlFor="tech_tft" className="label">
                      TFt
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_tft"
                        id="tech_tft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_tft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "8" ||
                formData.tech_selection == "9" ||
                formData.tech_selection == "11") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis bfw">
                    <label htmlFor="tech_bfw" className="label">
                      BFw
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bfw"
                        id="tech_bfw"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_bfw}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "8" ||
                formData.tech_selection == "9" ||
                formData.tech_selection == "11") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis bft">
                    <label htmlFor="tech_bft" className="label">
                      BFt
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bft"
                        id="tech_bft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_bft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "9" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis lft">
                    <label htmlFor="tech_lft" className="label">
                      LFt
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_lft"
                        id="tech_lft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_lft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "9" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis lfh">
                    <label htmlFor="tech_lfh" className="label">
                      LFh
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_lfh"
                        id="tech_lfh"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_lfh}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "8" ||
                formData.tech_selection == "10") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis wh">
                    <label htmlFor="tech_wh" className="label">
                      Wh
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_wh"
                        id="tech_wh"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_wh}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "8" ||
                formData.tech_selection == "10" ||
                formData.tech_selection == "11") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis wt">
                    <label htmlFor="tech_wt" className="label">
                      Wt
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_wt"
                        id="tech_wt"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_wt}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "0" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis r">
                    <label htmlFor="tech_r" className="label">
                      r
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_r"
                        id="tech_r"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_r}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "7" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis b1">
                    <label htmlFor="tech_b1" className="label">
                      b1
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_b1"
                        id="tech_b1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_b1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "11" ||
                formData.tech_selection == "7") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  dis h1">
                    <label htmlFor="tech_h1" className="label">
                      h
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_h1"
                        id="tech_h1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_h1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_unit" className="label">
                  {data?.payload?.tech_lang_keys["14"]}:
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
                    <option value="mm">mm</option>
                    <option value="m">m</option>
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                    <option value="ft">ft</option>
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
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2 overflow-auto">
                        <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>Ix</strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer1).toFixed(3)}{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_m4,
                                  }}
                                />{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>Iy</strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer2).toFixed(3)}{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_m4,
                                  }}
                                />{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>Cy</strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer3).toFixed(3)}{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_m,
                                  }}
                                />{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>Cx</strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer4).toFixed(3)}{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_m,
                                  }}
                                />{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>Area</strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer5).toFixed(3)}{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_m2,
                                  }}
                                />{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>Sz</strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer6).toFixed(3)}{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_m3,
                                  }}
                                />{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>Sx</strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_answer7).toFixed(3)}{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_m3,
                                  }}
                                />{" "}
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

export default MomentOfInertiaCalculator;
