"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useAverageVelocityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AverageVelocityCalculator = () => {
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
    tech_method: "1",
    tech_x: 8,
    tech_iv: "mph",
    tech_y: 8,
    tech_fv: "km/s",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAverageVelocityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_x: formData.tech_x,
        tech_iv: formData.tech_iv,
        tech_y: formData.tech_y,
        tech_fv: formData.tech_fv,
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
      tech_method: "1",
      tech_x: 8,
      tech_iv: "mph",
      tech_y: 8,
      tech_fv: "km/s",
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
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <div className="col-lg-2 py-2 font-s-14">
                {data?.payload?.tech_lang_keys["to_calc"]}:
              </div>
              <input
                type="hidden"
                name="tech_method"
                id="calculator_time"
                value={formData.tech_method}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_method === "1" ? "tagsUnit" : ""
                    }`}
                    id="1"
                    onClick={() => {
                      setFormData({ ...formData, tech_method: "1" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["ave_vel"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_method === "2" ? "tagsUnit" : ""
                    }`}
                    id="2"
                    onClick={() => {
                      setFormData({ ...formData, tech_method: "2" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["iv"]}
                  </div>
                </div>
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_method === "3" ? "tagsUnit" : ""
                    }`}
                    id="3"
                    onClick={() => {
                      setFormData({ ...formData, tech_method: "3" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["fv"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-5  gap-2 ">
              <div className="col-span-6">
                {formData.tech_method == "1" && (
                  <>
                    <label htmlFor="tech_x" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["iv"]}{" "}
                    </label>
                  </>
                )}
                {formData.tech_method == "2" && (
                  <>
                    <label htmlFor="tech_x" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["ave_vel"]}{" "}
                    </label>
                  </>
                )}
                {formData.tech_method == "3" && (
                  <>
                    <label htmlFor="tech_x" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["ave_vel"]}{" "}
                    </label>
                  </>
                )}

                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_x"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_x}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_iv} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m/s", value: "m/s" },
                        { label: "ft/s", value: "ft/s" },
                        { label: "km/h", value: "km/h" },
                        { label: "km/s", value: "km/s" },
                        { label: "mi/s", value: "mi/s" },
                        { label: "mph", value: "mph" },
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
              <div className="col-span-6">
                {formData.tech_method == "1" && (
                  <>
                    <label htmlFor="tech_y" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["fv"]}{" "}
                    </label>
                  </>
                )}
                {formData.tech_method == "2" && (
                  <>
                    <label htmlFor="tech_y" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["fv"]}{" "}
                    </label>
                  </>
                )}
                {formData.tech_method == "3" && (
                  <>
                    <label htmlFor="tech_y" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["iv"]}{" "}
                    </label>
                  </>
                )}
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_y"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_y}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_fv} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m/s", value: "m/s" },
                        { label: "ft/s", value: "ft/s" },
                        { label: "km/h", value: "km/h" },
                        { label: "km/s", value: "km/s" },
                        { label: "mi/s", value: "mi/s" },
                        { label: "mph", value: "mph" },
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
                    <div className="w-full mt-3 ">
                      {formData?.tech_method == "1" && (
                        <>
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys["ave_vel"]} </p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] text-white px-3 py-2 md:text-[25px] text-[18px] rounded-lg">
                                {result?.tech_ave}
                              </strong>
                            </p>
                          </div>
                        </>
                      )}
                      {formData?.tech_method == "2" && (
                        <>
                          <div className="w-full  text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys["iv"]} </p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] text-white px-3 py-2 md:text-[25px] text-[18px] rounded-lg">
                                {result?.tech_ave}
                              </strong>
                            </p>
                          </div>
                        </>
                      )}
                      {formData?.tech_method == "3" && (
                        <>
                          <div className="w-full  text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys["fv"]} </p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] text-white px-3 py-2 md:text-[25px] text-[18px] rounded-lg">
                                {result?.tech_ave}
                              </strong>
                            </p>
                          </div>
                        </>
                      )}
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

export default AverageVelocityCalculator;
