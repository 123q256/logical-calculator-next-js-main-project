"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAspectRatioCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AspectRatioCalculator = () => {
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
    tech_ratios: "728x90",
    tech_w1: "728",
    tech_h1: "90",
    tech_w2: "",
    tech_h2: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAspectRatioCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_ratios") {
      if (value === "custom") {
        setFormData((prevData) => ({
          ...prevData,
          tech_ratios: value,
          tech_w1: "",
          tech_h1: "",
        }));
      } else {
        const [w, h] = value.split("x").map(Number);
        setFormData((prevData) => ({
          ...prevData,
          tech_ratios: value,
          tech_w1: w,
          tech_h1: h,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_ratios || !formData.tech_w1 || !formData.tech_h1) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_ratios: formData.tech_ratios,
        tech_w1: formData.tech_w1,
        tech_h1: formData.tech_h1,
        tech_w2: formData.tech_w2,
        tech_h2: formData.tech_h2,
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
      tech_ratios: "728x90",
      tech_w1: "728",
      tech_h1: "90",
      tech_w2: "400",
      tech_h2: "",
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

  const parseStyle = (styleString) => {
    return styleString.split(";").reduce((acc, item) => {
      const [key, value] = item.split(":");
      if (key && value) {
        const camelKey = key
          .trim()
          .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        acc[camelKey] = value.trim();
      }
      return acc;
    }, {});
  };

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
          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ratios" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ratios"
                    id="tech_ratios"
                    value={formData.tech_ratios}
                    onChange={handleChange}
                  >
                    <option value="custom">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="7680x4320">
                      7680 x 4320 {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="5120x2880">
                      5120 x 2880 {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="3840x2160">
                      3840 × 2160 {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="2048x1536">
                      2048 x 1536 {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="1920x1200">
                      1920 x 1200 {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="1920x1080">
                      1920 x 1080 {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="1334x750">
                      1334 x 750 {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="1200x630">
                      1200 x 630 {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="1136x640">
                      1136 x 640 {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="1024x768">
                      1024 x 768 {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="1024x512">
                      1024 x 512 {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="960x640">
                      960 x 640 {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="800x600">800 x 600</option>
                    <option value="728x90">
                      728 x 90 {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="720x576">
                      720 x 576 {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="640x480">
                      640 x 480 {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="576x486">
                      576 x 486 {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="320x480">
                      320 x 480 {data?.payload?.tech_lang_keys["19"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_w1" className="label">
                  {data?.payload?.tech_lang_keys["20"]} (W₁):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_w1"
                    id="tech_w1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_w1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_h1" className="label">
                  {data?.payload?.tech_lang_keys["21"]} (H₁):
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_w2" className="label">
                  {data?.payload?.tech_lang_keys["20"]} (W₂){" "}
                  {data?.payload?.tech_lang_keys["22"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_w2"
                    id="tech_w2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_w2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_h2" className="label">
                  {data?.payload?.tech_lang_keys["21"]} (H₂){" "}
                  {data?.payload?.tech_lang_keys["22"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_h2"
                    id="tech_h2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_h2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="col-span-12">
                <strong>{data?.payload?.tech_lang_keys["23"]}: </strong>
                {data?.payload?.tech_lang_keys["24"]}.
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-3 mb-6 mt-10">
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
                      <div className="w-full my-1">
                        <div className="w-full md:w-[80%] lg:w-[80%] font-s-18">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["25"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_asp_ratio} (cu yd)
                                </td>
                              </tr>

                              {result?.tech_ans && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {result?.tech_check === "h2"
                                        ? "New Height"
                                        : "New Width"}{" "}
                                      :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_ans}
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td colSpan="2" className="pt-2 pb-1">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["26"]}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {(result?.tech_ans ? "Original " : "") +
                                    data?.payload?.tech_lang_keys["27"]}{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {formData?.tech_w1} x {formData?.tech_h1}
                                </td>
                              </tr>

                              {result?.tech_ans && (
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["28"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_check === "h2"
                                      ? `${formData?.tech_w2} x ${result?.tech_ans}`
                                      : `${result?.tech_ans} x ${formData?.tech_h2}`}
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["29"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_pixels}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["30"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_mode}
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <p className="mt-4">
                            <strong>
                              {data?.payload?.tech_lang_keys["31"]}:
                            </strong>
                          </p>
                          <p
                            className="text-center bg-sky bordered rounded-lg mt-3"
                            style={parseStyle(result?.tech_vsl_ratio || "")}
                          >
                            {data?.payload?.tech_lang_keys["25"]}
                          </p>
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

export default AspectRatioCalculator;
