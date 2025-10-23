"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRampCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RampCalculator = () => {
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
    tech_calc: "one", //one  two
    tech_appli: "a",
    tech_r_type: "st",
    tech_no: "4",
    tech_unit: "cm",
    tech_no1: "5",
    tech_unit0: "m",
    tech_no2: "5",
    tech_unit1: "m",
    tech_width: "5",
    tech_unit2: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRampCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calc) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calc: formData.tech_calc,
        tech_appli: formData.tech_appli,
        tech_r_type: formData.tech_r_type,
        tech_no: formData.tech_no,
        tech_unit: formData.tech_unit,
        tech_no1: formData.tech_no1,
        tech_unit0: formData.tech_unit0,
        tech_no2: formData.tech_no2,
        tech_unit1: formData.tech_unit1,
        tech_width: formData.tech_width,
        tech_unit2: formData.tech_unit2,
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
      tech_calc: "one", //one  two
      tech_appli: "a",
      tech_r_type: "st",
      tech_no: "4",
      tech_unit: "cm",
      tech_no1: "5",
      tech_unit0: "m",
      tech_no2: "5",
      tech_unit1: "m",
      tech_width: "5",
      tech_unit2: "m",
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

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit0: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit1: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit2: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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
            <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[50%] w-full">
              <input
                type="hidden"
                name="tech_calc"
                id="calculator_time"
                value={formData.tech_calc}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_calc === "one" ? "tagsUnit" : ""
                    }`}
                    id="one"
                    onClick={() => {
                      setFormData({ ...formData, tech_calc: "one" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_calc === "two" ? "tagsUnit" : ""
                    }`}
                    id="two"
                    onClick={() => {
                      setFormData({ ...formData, tech_calc: "two" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-4  gap-2">
              {formData.tech_calc == "one" && (
                <>
                  <div className="col-span-12 simple ">
                    <label htmlFor="tech_appli" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_appli"
                        id="tech_appli"
                        value={formData.tech_appli}
                        onChange={handleChange}
                      >
                        <option value="a">
                          {data?.payload?.tech_lang_keys["4"]}
                        </option>
                        <option value="b">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                        <option value="c">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </option>
                        <option value="d">
                          {data?.payload?.tech_lang_keys["7"]}{" "}
                        </option>
                        <option value="e">
                          {data?.payload?.tech_lang_keys["8"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 simple">
                    <div className="col-lg-6  pe-lg-4 ">
                      <div className="col-12  mt-0 mt-lg-2">
                        <label htmlFor="tech_r_type" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_r_type"
                            id="tech_r_type"
                            value={formData.tech_r_type}
                            onChange={handleChange}
                          >
                            <option value="st">
                              {data?.payload?.tech_lang_keys["10"]}
                            </option>
                            <option value="dl">
                              {data?.payload?.tech_lang_keys["11"]}{" "}
                            </option>
                            <option value="sb">
                              {data?.payload?.tech_lang_keys["12"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 mt-0 mt-lg-2">
                        <label htmlFor="tech_no" className="label">
                          {data?.payload?.tech_lang_keys["13"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_no"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_no}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
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
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calc == "two" && (
                <>
                  <div className="col-span-12 md:col-span-6  ">
                    <div className="col-span-12 md:col-span-6  pe-lg-4 ">
                      <div className="col-12 mt-0 mt-lg-2">
                        <label htmlFor="tech_no1" className="label">
                          {data?.payload?.tech_lang_keys["13"]} (a):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_no1"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_no1}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_unit0} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler1(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 mt-0 mt-lg-2">
                        <label htmlFor="tech_no2" className="label">
                          {data?.payload?.tech_lang_keys["13"]} (b):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_no2"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_no2}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_unit1} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler2(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 mt-0 mt-lg-2">
                        <label htmlFor="tech_width" className="label">
                          {data?.payload?.tech_lang_keys["16"]} (w):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_width"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_width}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_unit2} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler3(unit.value)}
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
                </>
              )}

              <div className="col-span-12 md:col-span-6">
                {formData.tech_calc == "one" && (
                  <>
                    <img
                      src="/images/rampsimple.webp"
                      alt="Ramp Picture"
                      className="max-width change_image"
                      width="100%"
                      height="80px"
                    />
                  </>
                )}
                {formData.tech_calc == "two" && (
                  <>
                    <img
                      src="/images/advanceramp.webp"
                      alt="Ramp Picture"
                      className="max-width change_image"
                      width="100%"
                      height="80px"
                    />
                  </>
                )}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  p-2 rounded-lg mt-6">
                      <div className="row py-2">
                        {formData?.tech_calc == "one" ? (
                          <>
                            <div className="grid grid-cols-12">
                              <div className="col-span-12 md:col-span-7 overflow-auto text-[16px] pe-lg-4">
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td className="border-b py-2 flex items-center">
                                        <img
                                          src="/images/deg.webp"
                                          alt="image of degree"
                                          width="30"
                                          height="30"
                                          className="max-width pe-2"
                                        />
                                        {data?.payload?.tech_lang_keys[18]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_deg}°
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 flex items-center">
                                        <img
                                          src="/images/percent.webp"
                                          alt="image of grade"
                                          width="30"
                                          height="30"
                                          className="max-width pe-2"
                                        />
                                        {data?.payload?.tech_lang_keys[19]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_grade}%
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 flex items-center">
                                        <img
                                          src="/images/lenght.webp"
                                          alt="mode"
                                          width="30"
                                          height="30"
                                          className="max-width pe-2"
                                        />
                                        {data?.payload?.tech_lang_keys[20]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_ramplenght}{" "}
                                        {result?.tech_unit}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 flex items-center">
                                        <img
                                          src="/images/lenght.webp"
                                          alt="image of grade"
                                          width="30"
                                          height="30"
                                          className="max-width pe-2"
                                        />
                                        {data?.payload?.tech_lang_keys[21]} :
                                      </td>
                                      <td className="py-2">
                                        {result?.tech_runs} {result?.tech_unit}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="col-span-12 md:col-span-5 flex items-center justify-center">
                                {result?.tech_appli === "a" ? (
                                  <img
                                    src="/images/ramp1.webp"
                                    alt="image of length"
                                    width="250px"
                                    height="100px"
                                  />
                                ) : result?.tech_appli === "b" ? (
                                  <img
                                    src="/images/ramp2.webp"
                                    alt="image of length2"
                                    width="250px"
                                    height="100px"
                                  />
                                ) : result?.tech_appli === "c" ? (
                                  <img
                                    src="/images/ramp3.webp"
                                    alt="image of length3"
                                    width="250px"
                                    height="100px"
                                  />
                                ) : result?.tech_appli === "d" ? (
                                  <img
                                    src="/images/ramp4.webp"
                                    alt="image of length4"
                                    width="250px"
                                    height="100px"
                                  />
                                ) : (
                                  <img
                                    src="/images/ramp5.webp"
                                    alt="image of length5"
                                    width="250px"
                                    height="100px"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="w-fill md:w-[70%] lg:w-[70%] my-3">
                              {result?.tech_r_type === "st" ? (
                                <img
                                  src="/images/ramp11.png"
                                  alt="image of length"
                                  className="max-width"
                                  width="450px"
                                  height="60px"
                                />
                              ) : result?.tech_r_type === "sb" ? (
                                <img
                                  src="/images/ramp180.png"
                                  alt="image of length"
                                  className="max-width"
                                  width="450px"
                                  height="100px"
                                />
                              ) : null}
                            </div>
                            <div className="w-full">
                              <div className="w-fill md:w-[70%] lg:w-[70%] overflow-auto text-[16px]">
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td colSpan="2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[22]}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[23]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_rad}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[24]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_millirad}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[25]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_microrad}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[26]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_pirad}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[27]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_gradian}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[28]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_turns}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[29]} :
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_minarc}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2">
                                        {data?.payload?.tech_lang_keys[30]} :
                                      </td>
                                      <td className="py-2">
                                        {result?.tech_secarc}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="col-lg-5 d-flex justify-content-center align-items-center">
                                {result?.tech_r_type == "dl" && (
                                  <>
                                    <img
                                      src="/images/ramp90.png"
                                      alt="image of lenght"
                                      className="max-width"
                                      width="300px"
                                      height="430px"
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full md:w-[70%] lg:w-[70%] overflow-auto text-[16px]">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 flex items-center">
                                      <img
                                        src="/images/hypotenuse.webp"
                                        alt="grade"
                                        className="max-width pe-2"
                                        width="30"
                                        height="30"
                                      />
                                      {data?.payload?.tech_lang_keys[31]} (c)
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_Hypotenuse}{" "}
                                      <span className="font-s-14">cm</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 flex items-center">
                                      <img
                                        src="/images/alpha2.webp"
                                        alt="grade"
                                        className="max-width pe-2"
                                        width="30"
                                        height="30"
                                      />
                                      {data?.payload?.tech_lang_keys[32]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_alpha}
                                      <sup>o</sup>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 flex items-center">
                                      <img
                                        src="/images/beta.webp"
                                        alt="grade"
                                        className="max-width pe-2"
                                        width="30"
                                        height="30"
                                      />
                                      {data?.payload?.tech_lang_keys[33]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_beta}
                                      <sup>o</sup>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 flex items-center">
                                      <img
                                        src="/images/area1.webp"
                                        alt="grade"
                                        className="max-width pe-2"
                                        width="30"
                                        height="30"
                                      />
                                      {data?.payload?.tech_lang_keys[34]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_area}{" "}
                                      <span className="font-s-14">cm</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 flex items-center">
                                      <img
                                        src="/images/volume.webp"
                                        alt="grade"
                                        className="max-width pe-2"
                                        width="30"
                                        height="30"
                                      />
                                      {data?.payload?.tech_lang_keys[35]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_volume}{" "}
                                      <span className="font-s-14">cm</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 flex items-center">
                                      <img
                                        src="/images/ratio2.webp"
                                        alt="grade"
                                        className="max-width pe-2"
                                        width="30"
                                        height="30"
                                      />
                                      {data?.payload?.tech_lang_keys[36]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_sv}{" "}
                                      <span className="font-s-14">cm</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <div className="text-[16px] mt-4 overflow-auto">
                                <p className="my-2 text-center font-bold">
                                  {data?.payload?.tech_lang_keys[37]}
                                </p>

                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[31]}:
                                </p>
                                <p className="mt-2">{String.raw`\( ${data?.payload?.tech_lang_keys[31]} \ (c) = \sqrt{a^2 + b^2} \)`}</p>
                                <p className="mt-2">{String.raw`\( ${data?.payload?.tech_lang_keys[31]} \ (c) = \sqrt{${result?.tech_no1}^2 + ${result?.tech_no2}^2} \)`}</p>
                                <p className="mt-2">{String.raw`\( ${data?.payload?.tech_lang_keys[31]} \ (c) = \sqrt{${result?.tech_Hypotenuse1}} \)`}</p>
                                <p className="mt-2">{String.raw`\( ${data?.payload?.tech_lang_keys[31]} \ (c) = ${result?.tech_Hypotenuse} \)`}</p>

                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[32]}:
                                </p>
                                <p className="mt-2">{String.raw`\( \alpha = \cos^{-1} \left( \frac{b^2 + c^2 - a^2}{2bc} \right) \)`}</p>
                                <p className="mt-2">
                                  {String.raw`\( \alpha = \cos^{-1} \left( \frac{${result?.tech_no2}^2 + ${result?.tech_Hypotenuse}^2 - ${result?.tech_no1}^2}{2 \cdot ${result?.tech_no2} \cdot ${result?.tech_Hypotenuse}} \right) \)`}
                                </p>
                                <p className="mt-2">{String.raw`\( \alpha = \cos^{-1}(${result?.tech_alpha2}) \)`}</p>
                                <p className="mt-2">{String.raw`\( \alpha = ${result?.tech_alpha} \)`}</p>

                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[33]}:
                                </p>
                                <p className="mt-2">{String.raw`\( \beta = 90^\circ - \alpha \)`}</p>
                                <p className="mt-2">{String.raw`\( \beta = ${
                                  90 - result?.tech_alpha
                                } \)`}</p>

                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[34]}:
                                </p>
                                <p className="mt-2">{String.raw`\( A = a \cdot b + w \cdot (a + b + c) \)`}</p>
                                <p className="mt-2">{String.raw`\( A = ${result?.tech_no1} \cdot ${result?.tech_no2} + ${result?.tech_width} \cdot (${result?.tech_no1} + ${result?.tech_no2} + ${result?.tech_Hypotenuse}) \)`}</p>
                                <p className="mt-2">{String.raw`\( A = ${result?.tech_area} \)`}</p>

                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[35]}:
                                </p>
                                <p className="mt-2">{String.raw`\( V = \frac{a \cdot b \cdot w}{2} \)`}</p>
                                <p className="mt-2">{String.raw`\( V = \frac{${result?.tech_no1} \cdot ${result?.tech_no2} \cdot ${result?.tech_width}}{2} \)`}</p>
                                <p className="mt-2">{String.raw`\( V = ${result?.tech_volume} \)`}</p>

                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[36]}:
                                </p>
                                <p className="mt-2 font-bold">{String.raw`\( A/V = \frac{${result?.tech_area}}{${result?.tech_volume}} \)`}</p>
                                <p className="mt-2 font-bold">{String.raw`\( A/V = ${result?.tech_sv} \)`}</p>
                              </div>
                            </div>
                          </>
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

export default RampCalculator;
