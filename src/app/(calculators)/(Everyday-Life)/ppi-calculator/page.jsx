"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePpiCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PpiCalculator = () => {
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
    tech_h: "1136",
    tech_v: "640",
    tech_d: "10.16000",
    tech_unit: "cm",
    tech_myName: "2880x1800x15.4",
    tech_myName2: "720x1280x5.55",
    tech_myName3: "1136x640x4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePpiCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_h ||
      !formData.tech_v ||
      !formData.tech_d ||
      !formData.tech_unit ||
      !formData.tech_myName ||
      !formData.tech_myName2 ||
      !formData.tech_myName3
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_h: formData.tech_h,
        tech_v: formData.tech_v,
        tech_d: formData.tech_d,
        tech_unit: formData.tech_unit,
        tech_myName: formData.tech_myName,
        tech_myName2: formData.tech_myName2,
        tech_myName3: formData.tech_myName3,
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
      tech_h: "1136",
      tech_v: "640",
      tech_d: "10.16000",
      tech_unit: "cm",
      tech_myName: "2880x1800x15.4",
      tech_myName2: "720x1280x5.55",
      tech_myName3: "1136x640x4",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_h" className="label">
                  {data?.payload?.tech_lang_keys["horizontal"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_h"
                    id="tech_h"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_h}
                    onChange={handleChange}
                  />
                  <span className="input_unit">pixels</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_v" className="label">
                  {data?.payload?.tech_lang_keys["vertical"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_v"
                    id="tech_v"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_v}
                    onChange={handleChange}
                  />
                  <span className="input_unit">pixels</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_d" className="label">
                  {data?.payload?.tech_lang_keys["screen_size"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_d"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_d}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-3"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "in", value: "in" },
                        { label: "cm", value: "cm" },
                        { label: "ft", value: "ft" },
                        { label: "m", value: "m" },
                        { label: "yd", value: "yd" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="col-span-12">Optional</p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_myName" className="label">
                  {data?.payload?.tech_lang_keys["comp"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_myName"
                    id="tech_myName"
                    value={formData.tech_myName}
                    onChange={handleChange}
                  >
                    <option value="empty">Select a device...</option>
                    <option value="1920x1080x21.5">Apple iMac 21"</option>
                    <option value="2560x1440x27">Apple iMac 27"</option>
                    <option value="5120x2880x27">
                      Apple iMac 27" (Retina 5K)
                    </option>
                    <option value="1366x768x11.6">Apple MacBook Air 11"</option>
                    <option value="1440x900x13.3">Apple MacBook Air 13"</option>
                    <option value="1280x800x13.3">Apple MacBook Pro 13"</option>
                    <option value="1440x900x15.4">Apple MacBook Pro 15"</option>
                    <option value="2560x1600x13.3">
                      Apple MacBook Pro Retina 13"
                    </option>
                    <option value="2880x1800x15.4">
                      Apple MacBook Pro Retina 15"
                    </option>
                    <option value="3840x2160x28">Dell P2815Q 4K Monitor</option>
                    <option value="2560x1700x12.58">
                      Google Chromebook Pixel
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_myName2" className="label">
                  {data?.payload?.tech_lang_keys["phone"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_myName2"
                    id="tech_myName2"
                    value={formData.tech_myName2}
                    onChange={handleChange}
                  >
                    <option value="empty">Select a device...</option>
                    <option value="640x960x3.5">Apple iPhone 4/S</option>
                    <option value="640x1136x4">Apple iPhone 5/S</option>
                    <option value="1334x750x4.7">Apple iPhone 6 </option>
                    <option value="1920x1080x5.5">Apple iPhone 6 Plus</option>
                    <option value="1280x768x4.7">Google Nexus 4 </option>
                    <option value="1920x1080x4.95">Google Nexus 5 </option>
                    <option value="1440x2560x6">Google Nexus 6 </option>
                    <option value="1080x1920x4.7">HTC One</option>
                    <option value="768x1280x4.5">Nokia Lumia 920</option>
                    <option value="720x1280x5.55">
                      Samsung Galaxy Note II
                    </option>
                    <option value="720x1280x4.8">Samsung Galaxy S3</option>
                    <option value="1080x1920x5">Samsung Galaxy S4</option>
                    <option value="1920x1080x5.1">Samsung Galaxy S5</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_myName3" className="label">
                  {data?.payload?.tech_lang_keys["tab"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_myName3"
                    id="tech_myName3"
                    value={formData.tech_myName3}
                    onChange={handleChange}
                  >
                    <option value="empty">Select a device...</option>
                    <option value="800x1280x7">Amazon Kindle Fire HD</option>
                    <option value="768x1024x7.9">Apple iPad mini 1</option>
                    <option value="1536x2048x7.9">Apple iPad mini 2,3</option>
                    <option value="1536x2048x9.7">Apple iPad Air 1,2</option>
                    <option value="1136x640x4">
                      Apple iPod Touch (Retina)
                    </option>
                    <option value="1920x1200x7.02">
                      Google Nexus 7 (2013)
                    </option>
                    <option value="2048x1536x8.9">Google Nexus 9 </option>
                    <option value="2560x1600x10.055">Google Nexus 10 </option>
                    <option value="768x1366x10.6">Microsoft Surface RT</option>
                    <option value="1920x1080x10.6">
                      Microsoft Surface Pro 1,2
                    </option>
                    <option value="2160x1440x12">
                      Microsoft Surface Pro 3
                    </option>
                    <option value="800x1280x10.1">
                      Samsung Galaxy Note 10.1
                    </option>
                  </select>
                </div>
              </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full mb-md-0 mb-3">
                          <div className="w-full bg-sky p-3 rounded-lg bordered">
                            <div className="grid grid-cols-12 mt-3  gap-1">
                              <div className="col-span-12 md:col-span-7 lg:col-span-7 border-lg-end pe-lg-2 border-sm-bottom pb-lg-0 pb-2">
                                <p>{data?.payload?.tech_lang_keys["2"]}</p>
                              </div>
                              <div className="col-span-12 md:col-span-5 lg:col-span-5 pt-lg-0 pt-2">
                                <div className="ps-lg-4 col">
                                  <span className="d-lg-block">
                                    {data?.payload?.tech_lang_keys["per_inch"]}
                                  </span>
                                  <strong className="text-[22px] text-[#119154] ps-lg-0 ps-4">
                                    {result?.tech_PPI ? result?.tech_PPI : "00"}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-sky p-3 rounded-lg bordered mt-3">
                            <div className="grid grid-cols-12 mt-3  gap-1">
                              <div className="col-span-12 md:col-span-7 lg:col-span-7 border-lg-end pe-lg-2 border-sm-bottom pb-lg-0 pb-2">
                                <p className="margin_top_10">
                                  {data?.payload?.tech_lang_keys["3"]}
                                </p>
                              </div>
                              <div className="col-span-12 md:col-span-5 lg:col-span-5 pt-lg-0 pt-2">
                                <div className="ps-lg-4 col">
                                  <span className="d-lg-block">
                                    {data?.payload?.tech_lang_keys["dot"]}
                                  </span>
                                  <strong className="text-[22px] text-[#119154] ps-lg-0 ps-5">
                                    {result?.tech_Pixls
                                      ? result?.tech_Pixls
                                      : "00"}{" "}
                                    <span className="font-s-18">(mm)</span>
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex p-2 items-center">
                          <p>
                            <strong className="text-blue pe-lg-4">
                              {data?.payload?.tech_lang_keys["display"]} :
                            </strong>
                          </p>
                          <p className="border-lg-end pe-lg-3">
                            {result?.tech_screen_in}
                          </p>
                          <p className="ps-lg-3">{result?.tech_screen_cm}</p>
                        </div>
                        <div className="w-full md:w-[80%] lg:w-[60%] mt-2">
                          <p className="ps-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]}
                            </strong>
                          </p>
                          <div className="ms-3">
                            <div className="border-b py-2 flex justify-between items-center">
                              <p>{data?.payload?.tech_lang_keys["total"]} :</p>
                              <p>{result?.tech_mpx} MPX</p>
                            </div>
                            <div className="border-b py-2 flex justify-between items-center">
                              <p>
                                {data?.payload?.tech_lang_keys["PPI"]}
                                <sup>2</sup> :
                              </p>
                              <p>{result?.tech_PPIS}</p>
                            </div>
                            <div className="border-b py-2 flex justify-between items-center">
                              <p>{data?.payload?.tech_lang_keys["dia"]} :</p>
                              <p>{result?.tech_dia} Pixels</p>
                            </div>
                            <div className="d-flex pt-2 justify-between items-center">
                              <p>{data?.payload?.tech_lang_keys["ar"]} :</p>
                              <p>{result?.tech_ratio} Pixels</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 mt-3  gap-4">
                          <p className="text-[20px] col-span-12">
                            <strong>
                              {data?.payload?.tech_lang_keys["5"]}
                            </strong>
                          </p>
                          <p className="col-span-12">
                            {data?.payload?.tech_lang_keys["6"]}
                          </p>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="lg:text-center md:text-center text-left my-3">
                              <p className="lg:text-[21px] md:text-[21px] text-[16px]">
                                diagonal ={" "}
                                <span className="overline">width²+height²</span>
                              </p>
                            </div>

                            <p className="padding_0">
                              {data?.payload?.tech_lang_keys["7"]}
                            </p>
                            <div className="text-center mt-3">
                              <p className="lg:text-[21px] md:text-[21px] text-[16px]">
                                PPI ={" "}
                                <span className="fraction">
                                  <span className="num">digonal in pixels</span>{" "}
                                  <span className="visually-hidden">/</span>{" "}
                                  <span className="den">digonal in inches</span>
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-3 text-center">
                            <img
                              src="/images/ppi_dia1.webp"
                              alt="Screen Diagram"
                              className="max-width"
                              width="330px"
                              height="200px"
                            />
                          </div>
                        </div>
                        <div className="w-full ps-3 pt-4">
                          <p>{data?.payload?.tech_lang_keys["8"]}</p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["9"]}
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

export default PpiCalculator;
