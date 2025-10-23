"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAngularVelocityCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AngularVelocityCalculator = () => {
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
    tech_method: "0", // 0 1 2
    tech_g: "ang_vel",
    tech_check: "g21_value",
    tech_gg: "velocity",
    tech_ac: "8",
    tech_ac1: "deg",
    tech_t: "10",
    tech_t1: "sec",
    tech_av: "10",
    tech_av1: "rad/s",
    tech_vel: "10",
    tech_vel1: "m/s",
    tech_rad: "10",
    tech_rad1: "mm",
    tech_rpm: "10",
    tech_rds_m: "1.5",
    tech_rds_m1: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAngularVelocityCalculatorMutation();

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
        tech_g: formData.tech_g,
        tech_check: formData.tech_check,
        tech_gg: formData.tech_gg,
        tech_ac: formData.tech_ac,
        tech_ac1: formData.tech_ac1,
        tech_t: formData.tech_t,
        tech_t1: formData.tech_t1,
        tech_av: formData.tech_av,
        tech_av1: formData.tech_av1,
        tech_vel: formData.tech_vel,
        tech_vel1: formData.tech_vel1,
        tech_rad: formData.tech_rad,
        tech_rad1: formData.tech_rad1,
        tech_rpm: formData.tech_rpm,
        tech_rds_m: formData.tech_rds_m,
        tech_rds_m1: formData.tech_rds_m1,
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
      tech_method: "0", // 0 1 2
      tech_g: "ang_vel",
      tech_check: "g21_value",
      tech_gg: "velocity",
      tech_ac: "8",
      tech_ac1: "deg",
      tech_t: "10",
      tech_t1: "sec",
      tech_av: "10",
      tech_av1: "rad/s",
      tech_vel: "10",
      tech_vel1: "m/s",
      tech_rad: "10",
      tech_rad1: "mm",
      tech_rpm: "10",
      tech_rds_m: "1.5",
      tech_rds_m1: "m",
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
    setFormData((prev) => ({ ...prev, tech_ac1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t1: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_av1: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_vel1: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rad1: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rds_m1: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  mt-3  gap-2">
              <div className="col-span-12 mx-auto px-2">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_method == "0" && (
                <>
                  <div id="g-hide" className="col-span-12">
                    <div className="row">
                      <strong className="col-12 mt-2 px-2">
                        {data?.payload?.tech_lang_keys[5]}:
                      </strong>
                      <div className="col-12 px-2 mb-3 mt-3 d-flex align-items-center">
                        <label className="pe-2" htmlFor="ang_vel">
                          <input
                            type="radio"
                            name="tech_g"
                            value="ang_vel"
                            id="ang_vel"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_g === "ang_vel"}
                          />
                          <span>{data?.payload?.tech_lang_keys["6"]}</span>
                        </label>

                        <label className="pe-2" htmlFor="ang_chnge">
                          <input
                            type="radio"
                            name="tech_g"
                            value="ang_chnge"
                            id="ang_chnge"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_g === "ang_chnge"}
                          />
                          <span>{data?.payload?.tech_lang_keys["7"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="time">
                          <input
                            type="radio"
                            name="tech_g"
                            value="time"
                            id="time"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_g === "time"}
                          />
                          <span>{data?.payload?.tech_lang_keys["8"]}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method == "1" && (
                <>
                  <div id="g-hide1" className="col-span-12">
                    <div className="row">
                      <strong className="col-12 mt-2 px-2">
                        {data?.payload?.tech_lang_keys[5]}:
                      </strong>
                      <div className="col-12 px-2 mb-3 mt-3 d-flex align-items-center">
                        <label className="pe-2" htmlFor="ang_vel1">
                          <input
                            type="radio"
                            name="tech_gg"
                            value="ang_vel1"
                            id="ang_vel1"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_gg === "ang_vel1"}
                          />
                          <span>{data?.payload?.tech_lang_keys["6"]}</span>
                        </label>

                        <label className="pe-2" htmlFor="velocity">
                          <input
                            type="radio"
                            name="tech_gg"
                            value="velocity"
                            id="velocity"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_gg === "velocity"}
                          />
                          <span>{data?.payload?.tech_lang_keys["9"]}</span>
                        </label>
                        <label className="pe-2" htmlFor="radius">
                          <input
                            type="radio"
                            name="tech_gg"
                            value="radius"
                            id="radius"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_gg === "radius"}
                          />
                          <span>{data?.payload?.tech_lang_keys["10"]}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {((formData.tech_g == "ang_vel" && formData.tech_method == "0") ||
                (formData.tech_g == "time" && formData.tech_method == "0")) && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="ac"
                  >
                    <label htmlFor="tech_ac" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (Δα):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ac"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ac}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_ac1} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "deg", value: "deg" },
                            { label: "rad", value: "rad" },
                            { label: "gon", value: "gon" },
                            { label: "tr", value: "tr" },
                            { label: "arcmin", value: "arcmin" },
                            { label: "arcsec", value: "arcsec" },
                            { label: "mrad", value: "mrad" },
                            { label: "urad", value: "urad" },
                            { label: "pirad", value: "pirad" },
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
                </>
              )}
              {((formData.tech_g == "ang_vel" && formData.tech_method == "0") ||
                (formData.tech_g == "ang_chnge" &&
                  formData.tech_method == "0")) && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="t"
                  >
                    <label htmlFor="tech_t" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (t):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_t"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_t}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_t1} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
                            { label: "days", value: "days" },
                            { label: "weeks", value: "weeks" },
                            { label: "months", value: "months" },
                            { label: "year", value: "year" },
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
                </>
              )}
              {((formData.tech_g == "ang_chnge" &&
                formData.tech_method == "0") ||
                (formData.tech_g == "time" && formData.tech_method == "0") ||
                (formData.tech_gg == "velocity" &&
                  formData.tech_method == "1") ||
                (formData.tech_gg == "radius" &&
                  formData.tech_method == "1")) && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="av"
                  >
                    <label htmlFor="tech_av" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (ω)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_av"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_av}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_av1} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "rad/s", value: "rad/s" },
                            { label: "rpm", value: "rpm" },
                            { label: "hz", value: "hz" },
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
                </>
              )}
              {((formData.tech_gg == "ang_vel1" &&
                formData.tech_method == "1") ||
                (formData.tech_gg == "radius" &&
                  formData.tech_method == "1")) && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="vel"
                  >
                    <label htmlFor="tech_vel" className="label">
                      {data?.payload?.tech_lang_keys["9"]} (v):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_vel"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_vel}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_vel1} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "mi/s", value: "mi/s" },
                            { label: "mi/h", value: "mi/h" },
                            { label: "knots", value: "knots" },
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
                </>
              )}
              {((formData.tech_gg == "ang_vel1" &&
                formData.tech_method == "1") ||
                (formData.tech_gg == "velocity" &&
                  formData.tech_method == "1")) && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="rds"
                  >
                    <label htmlFor="tech_rad" className="label">
                      {data?.payload?.tech_lang_keys["10"]} (r):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_rad"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_rad}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_rad1} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "nmi", value: "nmi" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler4(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method == "2" && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="rpm"
                  >
                    <label htmlFor="tech_rpm" className="label">
                      {data?.payload?.tech_lang_keys["11"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rpm"
                        id="tech_rpm"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_rpm}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method == "2" && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="rds_m"
                  >
                    <label htmlFor="tech_rds_m" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_rds_m"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_rds_m}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_rds_m1} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m", value: "m" },
                            { label: "cm", value: "cm" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "in", value: "in" },
                            { label: "yd", value: "yd" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler5(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
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
                        <div className="w-full md:w-[90%] lg:w-[70%] mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {(() => {
                                    if (result?.tech_ang_chnge !== undefined) {
                                      return `${data?.payload?.tech_lang_keys["7"]} (Δα)`;
                                    } else if (
                                      result?.tech_time !== undefined
                                    ) {
                                      return `${data?.payload?.tech_lang_keys["8"]} (t)`;
                                    } else if (
                                      result?.tech_velocity !== undefined
                                    ) {
                                      return `${data?.payload?.tech_lang_keys["9"]} (v)`;
                                    } else if (
                                      result?.tech_radius !== undefined
                                    ) {
                                      return `${data?.payload?.tech_lang_keys["10"]} (r)`;
                                    } else {
                                      return `${data?.payload?.tech_lang_keys["6"]} (ω)`;
                                    }
                                  })()}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_ans} {result?.tech_res_unit}
                                  </strong>
                                </td>
                              </tr>
                              {result?.tech_rpm && (
                                <>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_l_v} m/s</strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <p className="w-full mt-3">
                          <strong>{data?.payload?.tech_lang_keys["12"]}</strong>
                        </p>
                        <div className="w-full md:w-[90%] lg:w-[70%] mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {(result?.tech_ang_vel ||
                                result?.tech_ang_vel1) && (
                                <>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]} (ω)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_vel_rpm}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}{" "}
                                        (rpm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]} (ω)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_vel_hertz}{" "}
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        (Hz)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_ang_chnge && (
                                <>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]} (Δα)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_chnge_deg}{" "}
                                        {data?.payload?.tech_lang_keys["34"]}{" "}
                                        (deg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]} (Δα)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_chnge_gon}{" "}
                                        {data?.payload?.tech_lang_keys["35"]}{" "}
                                        (gon)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]} (Δα)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_chnge_tr}{" "}
                                        {data?.payload?.tech_lang_keys["36"]}{" "}
                                        (tr)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]} (Δα)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_chnge_arcmin}{" "}
                                        {data?.payload?.tech_lang_keys["37"]}{" "}
                                        (arcmin)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]} (Δα)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_chnge_arcsec}{" "}
                                        {data?.payload?.tech_lang_keys["38"]}{" "}
                                        (arcsec)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]} (Δα)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_chnge_mrad}{" "}
                                        {data?.payload?.tech_lang_keys["39"]}{" "}
                                        (mrad)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]} (Δα)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_chnge_urad}{" "}
                                        {data?.payload?.tech_lang_keys["40"]}{" "}
                                        (μrad)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["7"]} (Δα)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_chnge_pirad} π{" "}
                                        {data?.payload?.tech_lang_keys["41"]} (*
                                        π rad)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_time && (
                                <>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]} (t)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_t_min}{" "}
                                        {data?.payload?.tech_lang_keys["15"]}{" "}
                                        (min)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]} (t)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_t_hrs}{" "}
                                        {data?.payload?.tech_lang_keys["16"]}{" "}
                                        (hrs)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]} (t)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_t_days}{" "}
                                        {data?.payload?.tech_lang_keys["30"]}{" "}
                                        (days)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]} (t)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_t_wks}{" "}
                                        {data?.payload?.tech_lang_keys["31"]}{" "}
                                        (wks)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]} (t)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_t_mos}{" "}
                                        {data?.payload?.tech_lang_keys["32"]}{" "}
                                        (mos)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["8"]} (t)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_t_yrs}{" "}
                                        {data?.payload?.tech_lang_keys["33"]}{" "}
                                        (yrs)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_velocity && (
                                <>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_kmps}{" "}
                                        {data?.payload?.tech_lang_keys["23"]}{" "}
                                        (km/s)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_kmph}{" "}
                                        {data?.payload?.tech_lang_keys["24"]}{" "}
                                        (km/h)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_ftps}{" "}
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        (ft/s)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_mips}{" "}
                                        {data?.payload?.tech_lang_keys["25"]}{" "}
                                        (mi/s)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_miph}{" "}
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        (mi/h)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_knots}{" "}
                                        {data?.payload?.tech_lang_keys["27"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_radius && (
                                <>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} (r)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_rad_mm}{" "}
                                        {data?.payload?.tech_lang_keys["48"]}{" "}
                                        (mm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} (r)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_rad_cm}{" "}
                                        {data?.payload?.tech_lang_keys["47"]}{" "}
                                        (cm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} (r)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_rad_km}{" "}
                                        {data?.payload?.tech_lang_keys["46"]}{" "}
                                        (km)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} (r)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_rad_in}{" "}
                                        {data?.payload?.tech_lang_keys["20"]}{" "}
                                        (in)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} (r)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_rad_ft}{" "}
                                        {data?.payload?.tech_lang_keys["18"]}{" "}
                                        (ft)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} (r)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_rad_yd}{" "}
                                        {data?.payload?.tech_lang_keys["21"]}{" "}
                                        (yd)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} (r)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_rad_mi}{" "}
                                        {data?.payload?.tech_lang_keys["28"]}{" "}
                                        (mi)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["10"]} (r)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_rad_nmi}{" "}
                                        {data?.payload?.tech_lang_keys["29"]}{" "}
                                        (nmi)
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_rpm && (
                                <>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]} (ω)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_vel_rpm}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}{" "}
                                        (rpm)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["6"]} (ω)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_ang_vel_hertz}{" "}
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        (Hz)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_kmps}{" "}
                                        {data?.payload?.tech_lang_keys["23"]}{" "}
                                        (km/s)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_kmph}{" "}
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        (km/h)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_ftps}{" "}
                                        {data?.payload?.tech_lang_keys["22"]}{" "}
                                        (ft/s)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_mips}{" "}
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        (mi/s)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_miph}{" "}
                                        {data?.payload?.tech_lang_keys["26"]}{" "}
                                        (mi/h)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]} (v)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_vel_knots}{" "}
                                        {data?.payload?.tech_lang_keys["27"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="overflow-auto">
                          <p className="w-full   mt-3 text-[18px]">
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys["42"]}:
                            </strong>
                          </p>
                          {result?.tech_ang_vel && (
                            <>
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["43"]}:
                                </strong>
                              </p>
                              <BlockMath
                                math={`Δα = ${result?.tech_ac}, \\; t = ${result?.tech_t}, \\; ω = ?`}
                              />
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["45"]}:
                                </strong>
                              </p>
                              <BlockMath math={`ω = \\frac{Δα}{t}`} />
                              <BlockMath
                                math={`ω = \\frac{${result?.tech_ac}}{${result?.tech_t}}`}
                              />
                              <BlockMath
                                math={`ω = ${result?.tech_ac / result?.tech_t}`}
                              />
                            </>
                          )}

                          {result?.tech_ang_chnge && (
                            <>
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["43"]}:
                                </strong>
                              </p>
                              <BlockMath
                                math={`ω = ${result?.tech_av}, \\; t = ${result?.tech_t}, \\; Δα = ?`}
                              />
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["45"]}:
                                </strong>
                              </p>
                              <BlockMath math={`Δα = ω \\times t`} />
                              <BlockMath
                                math={`Δα = ${result?.tech_av} \\times ${result?.tech_t}`}
                              />
                              <BlockMath
                                math={`Δα = ${
                                  result?.tech_av * result?.tech_t
                                }`}
                              />
                            </>
                          )}

                          {result?.tech_time && (
                            <>
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["43"]}:
                                </strong>
                              </p>
                              <BlockMath
                                math={`Δα = ${result?.tech_ac}, \\; ω = ${result?.tech_av}, \\; t = ?`}
                              />
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["45"]}:
                                </strong>
                              </p>
                              <BlockMath math={`t = \\frac{Δα}{ω}`} />
                              <BlockMath
                                math={`t = \\frac{${result?.tech_ac}}{${result?.tech_av}}`}
                              />
                              <BlockMath
                                math={`t = ${
                                  result?.tech_ac / result?.tech_av
                                }`}
                              />
                            </>
                          )}

                          {result?.tech_ang_vel1 && (
                            <>
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["43"]}:
                                </strong>
                              </p>
                              <BlockMath
                                math={`v = ${result?.tech_vel}, \\; r = ${result?.tech_rad}, \\; ω = ?`}
                              />
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["45"]}:
                                </strong>
                              </p>
                              <BlockMath math={`ω = \\frac{v}{r}`} />
                              <BlockMath
                                math={`ω = \\frac{${result?.tech_vel}}{${result?.tech_rad}}`}
                              />
                              <BlockMath
                                math={`ω = ${
                                  result?.tech_vel / result?.tech_rad
                                }`}
                              />
                            </>
                          )}

                          {result?.tech_velocity && (
                            <>
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["43"]}:
                                </strong>
                              </p>
                              <BlockMath
                                math={`ω = ${result?.tech_av}, \\; r = ${result?.tech_rad}, \\; v = ?`}
                              />
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["45"]}:
                                </strong>
                              </p>
                              <BlockMath math={`v = ω \\times r`} />
                              <BlockMath
                                math={`v = ${result?.tech_av} \\times ${result?.tech_rad}`}
                              />
                              <BlockMath
                                math={`v = ${
                                  result?.tech_av * result?.tech_rad
                                }`}
                              />
                            </>
                          )}

                          {result?.tech_radius && (
                            <>
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["43"]}:
                                </strong>
                              </p>
                              <BlockMath
                                math={`ω = ${result?.tech_av}, \\; v = ${result?.tech_vel}, \\; r = ?`}
                              />
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["45"]}:
                                </strong>
                              </p>
                              <BlockMath math={`r = \\frac{v}{ω}`} />
                              <BlockMath
                                math={`r = \\frac{${result?.tech_vel}}{${result?.tech_av}}`}
                              />
                              <BlockMath
                                math={`r = ${
                                  result?.tech_vel / result?.tech_av
                                }`}
                              />
                            </>
                          )}

                          {result?.tech_rpm && (
                            <>
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["43"]}:
                                </strong>
                              </p>
                              <BlockMath
                                math={`rpm = ${result?.tech_rpm}, \\; r = ${result?.tech_rds_m}, \\; ω = ?, \\; v = ?`}
                              />
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["44"]}{" "}
                                  {data?.payload?.tech_lang_keys["6"]} (ω):
                                </strong>
                              </p>
                              <BlockMath
                                math={`ω = \\frac{2 \\pi \\times rpm}{60}`}
                              />
                              <BlockMath
                                math={`ω = \\frac{2 \\times ${Math.PI.toFixed(
                                  4
                                )} \\times ${result?.tech_rpm}}{60}`}
                              />
                              <BlockMath
                                math={`ω = ${
                                  (2 * Math.PI * result?.tech_rpm) / 60
                                }`}
                              />
                              <p className="w-full mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["44"]}{" "}
                                  {data?.payload?.tech_lang_keys["9"]} (v):
                                </strong>
                              </p>
                              <BlockMath math={`v = ω \\times r`} />
                              <BlockMath
                                math={`v = ${
                                  (2 * Math.PI * result?.tech_rpm) / 60
                                } \\times ${result?.tech_rds_m}`}
                              />
                              <BlockMath
                                math={`v = ${
                                  ((2 * Math.PI * result?.tech_rpm) / 60) *
                                  result?.tech_rds_m
                                }`}
                              />
                            </>
                          )}
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

export default AngularVelocityCalculator;
