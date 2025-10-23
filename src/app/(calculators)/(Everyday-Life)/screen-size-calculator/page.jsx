"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useScreenSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ScreenSizeCalculator = () => {
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
    screen: "17:10",
    tech_ratio_1: 17,
    tech_ratio_2: 10,
    tech_type: "curved",
    tech_curvature: "1500",
    tech_radius: 12,
    tech_radius_units: "m",
    tech_select_one: "Width",
    tech_select_two: "Height",
    tech_flat_dimensions: 12,
    tech_flat_dimensions_units: "yd",
    tech_curved_dimensions: 12,
    tech_curved_dimensions_units: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useScreenSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name == "screen") {
      if (value !== "custom" && value.includes(":")) {
        const [r1, r2] = value.split(":");
        setFormData((prevData) => ({
          ...prevData,
          screen: value,
          tech_ratio_1: r1,
          tech_ratio_2: r2,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          screen: value,
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

    if (!formData.screen) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        screen: formData.screen,
        tech_ratio_1: formData.tech_ratio_1,
        tech_ratio_2: formData.tech_ratio_2,
        tech_type: formData.tech_type,
        tech_curvature: formData.tech_curvature,
        tech_radius: formData.tech_radius,
        tech_radius_units: formData.tech_radius_units,
        tech_select_one: formData.tech_select_one,
        tech_select_two: formData.tech_select_two,
        tech_flat_dimensions: formData.tech_flat_dimensions,
        tech_flat_dimensions_units: formData.tech_flat_dimensions_units,
        tech_curved_dimensions: formData.tech_curved_dimensions,
        tech_curved_dimensions_units: formData.tech_curved_dimensions_units,
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
      screen: "17:10",
      tech_ratio_1: 17,
      tech_ratio_2: 10,
      tech_type: "curved",
      tech_curvature: "1500",
      tech_radius: 12,
      tech_radius_units: "m",
      tech_select_one: "Width",
      tech_select_two: "Height",
      tech_flat_dimensions: 12,
      tech_flat_dimensions_units: "yd",
      tech_curved_dimensions: 12,
      tech_curved_dimensions_units: "m",
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
    setFormData((prev) => ({ ...prev, tech_radius_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_flat_dimensions_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_curved_dimensions_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="screen" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="screen"
                    id="screen"
                    value={formData.screen}
                    onChange={handleChange}
                  >
                    <option value="16:9">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="4:3">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="16:10">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="17:10">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="1:2.35">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="21:9">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="32:9">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="1:1">1:1</option>
                    <option value="5:3">5:3</option>
                    <option value="3:2">3:2</option>
                    <option value="2:1">2:1</option>
                    <option value="5:4">5:4</option>
                    <option value="custom">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ratio_1" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ratio_1"
                    id="tech_ratio_1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ratio_1}
                    onChange={handleChange}
                  />
                  <span className="input_unit">:</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ratio_2" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ratio_2"
                    id="tech_ratio_2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ratio_2}
                    onChange={handleChange}
                  />
                  <span className="input_unit">:</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="flat">Flat</option>
                    <option value="curved">Curved</option>
                  </select>
                </div>
              </div>
              {formData.tech_type == "curved" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_curvature" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_curvature"
                        id="tech_curvature"
                        value={formData.tech_curvature}
                        onChange={handleChange}
                      >
                        <option value="1500">1500R</option>
                        <option value="1800">2300R</option>
                        <option value="2300">2300R</option>
                        <option value="3000">3000R</option>
                        <option value="4000">4000R</option>
                        <option value="enter">Enter your own value</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_curvature == "enter" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                    <label htmlFor="tech_radius" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_radius"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_radius}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_radius_units} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
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
                </>
              )}
              {formData.tech_type == "flat" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                    <label htmlFor="tech_select_one" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_select_one"
                        id="tech_select_one"
                        value={formData.tech_select_one}
                        onChange={handleChange}
                      >
                        <option value="Width">
                          {data?.payload?.tech_lang_keys["18"]}
                        </option>
                        <option value="Height">
                          {data?.payload?.tech_lang_keys["19"]}
                        </option>
                        <option value="Diagonal">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    {formData.tech_select_one == "Width" && (
                      <label htmlFor="tech_flat_dimensions" className="label">
                        {data?.payload?.tech_lang_keys["18"]}
                      </label>
                    )}
                    {formData.tech_select_one == "Height" && (
                      <label htmlFor="tech_flat_dimensions" className="label">
                        {data?.payload?.tech_lang_keys["19"]}
                      </label>
                    )}

                    {formData.tech_select_one == "Diagonal" && (
                      <label htmlFor="tech_flat_dimensions" className="label">
                        {data?.payload?.tech_lang_keys["8"]}
                      </label>
                    )}

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_flat_dimensions"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_flat_dimensions}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_flat_dimensions_units} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
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
                </>
              )}

              {formData.tech_type == "curved" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_select_two" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_select_two"
                        id="tech_select_two"
                        value={formData.tech_select_two}
                        onChange={handleChange}
                      >
                        <option value="Width">
                          {data?.payload?.tech_lang_keys["21"]}
                        </option>
                        <option value="Height">
                          {data?.payload?.tech_lang_keys["19"]}
                        </option>
                        <option value="Diagonal">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    {formData.tech_select_two == "Width" && (
                      <label htmlFor="tech_curved_dimensions" className="label">
                        {data?.payload?.tech_lang_keys["21"]}
                      </label>
                    )}
                    {formData.tech_select_two == "Height" && (
                      <label htmlFor="tech_curved_dimensions" className="label">
                        {data?.payload?.tech_lang_keys["19"]}
                      </label>
                    )}

                    {formData.tech_select_two == "Diagonal" && (
                      <label htmlFor="tech_curved_dimensions" className="label">
                        {data?.payload?.tech_lang_keys["8"]}
                      </label>
                    )}

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_curved_dimensions"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_curved_dimensions}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_curved_dimensions_units} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
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
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] == "en"
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

                  <div className="w-full py-2">
                    <div className="w-full md:w-[80%] lg:w-[80% text-18px">
                      <table className="w-full">
                        <tbody>
                          {formData?.tech_type === "flat" ? (
                            <>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["17"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_screenArea).toFixed(3)}{" "}
                                  <span className="font-s-14">in²</span>
                                </td>
                              </tr>

                              {formData?.tech_select_one === "height" ? (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_diagonal).toFixed(2)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["18"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_width).toFixed(1)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_select_one === "width" ? (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_diagonal).toFixed(2)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_height).toFixed(1)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_height).toFixed(2)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["18"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_width)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                </>
                              )}

                              <tr>
                                <td colSpan="2" className="pt-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">mm² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 645.16
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">cm² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 6.4516
                                  ).toFixed(1)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">dm² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 0.0645
                                  ).toFixed(3)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">m² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 0.00064516
                                  ).toFixed(5)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">ft² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 0.00064516
                                  ).toFixed(5)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">yd² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 0.00007122
                                  ).toFixed(5)}
                                </td>
                              </tr>
                            </>
                          ) : formData?.tech_type === "curved" ? (
                            <>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["17"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_screenArea).toFixed(3)}{" "}
                                  <span className="font-s-14">in²</span>
                                </td>
                              </tr>

                              {formData?.tech_select_two === "Height" ? (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["21"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_base_width).toFixed(
                                        2
                                      )}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_diagonal).toFixed(2)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_select_two === "Width" ? (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_height).toFixed(1)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_diagonal).toFixed(2)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_select_two === "Diagonal" ? (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_height).toFixed(2)}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["21"]}
                                      </strong>{" "}
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_base_width).toFixed(
                                        2
                                      )}{" "}
                                      <span className="font-s-14">in</span>
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <tr>
                                  <td className="border-b py-2" colSpan="2">
                                    <em>
                                      No data available for the selected
                                      combination.
                                    </em>
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </strong>{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_base_depth).toFixed(2)}{" "}
                                  <span className="font-s-14">in</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["23"]}
                                  </strong>{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_screen_length).toFixed(
                                    2
                                  )}{" "}
                                  <span className="font-s-14">in</span>
                                </td>
                              </tr>

                              <tr>
                                <td colSpan="2" className="pt-2">
                                  {data?.payload?.tech_lang_keys["20"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">mm² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 645.16
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">cm² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 6.4516
                                  ).toFixed(1)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">dm² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 0.0645
                                  ).toFixed(3)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">m² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 0.00064516
                                  ).toFixed(5)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">ft² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 0.00064516
                                  ).toFixed(5)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">yd² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_screenArea * 0.00007122
                                  ).toFixed(5)}
                                </td>
                              </tr>
                            </>
                          ) : null}
                        </tbody>
                      </table>
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

export default ScreenSizeCalculator;
