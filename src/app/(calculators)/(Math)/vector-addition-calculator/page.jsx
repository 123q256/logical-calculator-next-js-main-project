"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVectorAdditionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VectorAdditionCalculator = () => {
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
    tech_calculation: "2D", // 2D 3D
    tech_operation: "1", //  1 2 3 4
    tech_alpha: "7",
    tech_beta: "7",
    tech_vectora_representation: "1", // 1 2
    tech_ax: "3",
    tech_ay: "4",
    tech_az: "5",
    tech_magnitude_x: "3",
    tech_direction_x: "4",
    tech_direction_x_unit: "rad",
    tech_vectorb_representation: "1", // 1 2
    tech_bx: "3",
    tech_by: "4",
    tech_bz: "5",
    tech_magnitude_y: "3",
    tech_direction_y: "4",
    tech_direction_y_unit: "rad",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVectorAdditionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculation) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculation: formData.tech_calculation,
        tech_operation: formData.tech_operation,
        tech_alpha: formData.tech_alpha,
        tech_beta: formData.tech_beta,
        tech_vectora_representation: formData.tech_vectora_representation,
        tech_ax: formData.tech_ax,
        tech_ay: formData.tech_ay,
        tech_az: formData.tech_az,
        tech_magnitude_x: formData.tech_magnitude_x,
        tech_direction_x: formData.tech_direction_x,
        tech_direction_x_unit: formData.tech_direction_x_unit,
        tech_vectorb_representation: formData.tech_vectorb_representation,
        tech_bx: formData.tech_bx,
        tech_by: formData.tech_by,
        tech_bz: formData.tech_bz,
        tech_magnitude_y: formData.tech_magnitude_y,
        tech_direction_y: formData.tech_direction_y,
        tech_direction_y_unit: formData.tech_direction_y_unit,
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
      tech_calculation: "2D", // 2D 3D
      tech_operation: "1", //  1 2 3 4
      tech_alpha: "7",
      tech_beta: "7",
      tech_vectora_representation: "1", // 1 2
      tech_ax: "3",
      tech_ay: "4",
      tech_az: "5",
      tech_magnitude_x: "3",
      tech_direction_x: "4",
      tech_direction_x_unit: "rad",
      tech_vectorb_representation: "1", // 1 2
      tech_bx: "3",
      tech_by: "4",
      tech_bz: "5",
      tech_magnitude_y: "3",
      tech_direction_y: "4",
      tech_direction_y_unit: "rad",
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_calculation" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculation"
                    id="tech_calculation"
                    value={formData.tech_calculation}
                    onChange={handleChange}
                  >
                    <option value="2D">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="3D">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_operation" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operation"
                    id="tech_operation"
                    value={formData.tech_operation}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_operation == "2" ||
                formData.tech_operation == "4") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 alpha ">
                    <label htmlFor="tech_alpha" className="label">
                      {" "}
                      α:{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_alpha"
                        id="tech_alpha"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_alpha}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 beta ">
                    <label htmlFor="tech_beta" className="label">
                      {" "}
                      β:{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_beta"
                        id="tech_beta"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_beta}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_calculation == "2D" && (
                <>
                  <div className="col-span-12 " id="stokes">
                    <label
                      htmlFor="tech_vectora_representation"
                      className="label"
                    >
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_vectora_representation"
                        id="tech_vectora_representation"
                        value={formData.tech_vectora_representation}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["11"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_calculation == "3D" ||
                (formData.tech_calculation == "2D" &&
                  formData.tech_vectora_representation == "1")) && (
                <>
                  <div className="col-span-12 x_coor">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 px-lg-3">
                        {data?.payload?.tech_lang_keys["12"]} (a){" "}
                      </p>
                      {(formData.tech_calculation == "3D" ||
                        (formData.tech_calculation == "2D" &&
                          formData.tech_vectora_representation == "1")) && (
                        <>
                          <div className="col-span-4">
                            <label htmlFor="tech_ax" className="label">
                              {data?.payload?.tech_lang_keys["13"]}:{" "}
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_ax"
                                id="tech_ax"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_ax}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <label htmlFor="tech_ay" className="label">
                              {data?.payload?.tech_lang_keys["14"]}:{" "}
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_ay"
                                id="tech_ay"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_ay}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {formData.tech_calculation == "3D" && (
                        <>
                          <div className="col-span-4 az">
                            <label htmlFor="tech_az" className="label">
                              {data?.payload?.tech_lang_keys["15"]}:{" "}
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_az"
                                id="tech_az"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_az}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculation == "2D" &&
                formData.tech_vectora_representation == "2" && (
                  <>
                    <div className="col-span-12 data_x ">
                      <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                        <div className="col-span-6">
                          <label htmlFor="tech_magnitude_x" className="label">
                            {data?.payload?.tech_lang_keys["16"]} (m):
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_magnitude_x"
                              id="tech_magnitude_x"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_magnitude_x}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-span-6">
                          <label htmlFor="tech_direction_x" className="label">
                            {data?.payload?.tech_lang_keys["17"]} (θ):
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_direction_x"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_direction_x}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown}
                            >
                              {formData.tech_direction_x_unit} ▾
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
                                  { label: "μrad", value: "μrad" },
                                  { label: "* π rad", value: "* π rad" },
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

              {formData.tech_calculation == "2D" && (
                <>
                  <div className="col-span-12 " id="stokes2">
                    <label
                      htmlFor="tech_vectorb_representation"
                      className="label"
                    >
                      {data?.payload?.tech_lang_keys["18"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_vectorb_representation"
                        id="tech_vectorb_representation"
                        value={formData.tech_vectorb_representation}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["11"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_calculation == "3D" ||
                (formData.tech_calculation == "2D" &&
                  formData.tech_vectorb_representation == "1")) && (
                <>
                  <div className="col-span-12 y_coor ">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 px-lg-3">
                        {data?.payload?.tech_lang_keys["12"]} (2){" "}
                      </p>
                      {(formData.tech_calculation == "3D" ||
                        (formData.tech_calculation == "2D" &&
                          formData.tech_vectorb_representation == "1")) && (
                        <>
                          <div className="col-span-4">
                            <label htmlFor="tech_bx" className="label">
                              {data?.payload?.tech_lang_keys["13"]} :
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_bx"
                                id="tech_bx"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_bx}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <label htmlFor="tech_by" className="label">
                              {data?.payload?.tech_lang_keys["14"]} :
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_by"
                                id="tech_by"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_by}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {formData.tech_calculation == "3D" && (
                        <>
                          <div className="col-span-4 bz">
                            <label htmlFor="tech_bz" className="label">
                              {data?.payload?.tech_lang_keys["15"]} :
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_bz"
                                id="tech_bz"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_bz}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {formData.tech_calculation == "2D" &&
                formData.tech_vectorb_representation == "2" && (
                  <>
                    <div className="col-span-12 data_y  ">
                      <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                        <div className="col-span-6">
                          <label htmlFor="tech_magnitude_y" className="label">
                            {data?.payload?.tech_lang_keys["16"]} (m):
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_magnitude_y"
                              id="tech_magnitude_y"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_magnitude_y}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-span-6">
                          <label htmlFor="tech_direction_y" className="label">
                            {data?.payload?.tech_lang_keys["17"]} (θ):
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_direction_y"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_direction_y}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown}
                            >
                              {formData.tech_direction_y_unit} ▾
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
                                  { label: "μrad", value: "μrad" },
                                  { label: "* π rad", value: "* π rad" },
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
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2 overflow-auto">
                        {formData?.tech_calculation == "3D" ? (
                          <>
                            {result?.tech_operation == "1" && (
                              <>
                                <div className="text-center">
                                  <p className="text-[20px]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["23"]}
                                    </strong>
                                  </p>
                                  <p className="text-[32px] bg-sky-100 px-3 py-2 rounded-lg inline-block my-3">
                                    <strong className="text-blue">
                                      <InlineMath
                                        math={`(${result?.tech_x}, ${result?.tech_y}, ${result?.tech_z})`}
                                      />
                                    </strong>
                                  </p>
                                </div>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["24"]}
                                  </strong>
                                </p>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["25"]}
                                  </strong>
                                  <InlineMath
                                    math={`(${formData?.tech_ax}, ${formData?.tech_ay}, ${formData?.tech_az}) + (${formData?.tech_bx}, ${formData?.tech_by}, ${formData?.tech_bz})`}
                                  />
                                </p>
                                <p className="mt-2">
                                  <InlineMath
                                    math={`= (${formData?.tech_ax} + ${formData?.tech_bx}, ${formData?.tech_ay} + ${formData?.tech_by}, ${formData?.tech_az} + ${formData?.tech_bz})`}
                                  />
                                </p>
                                <p className="mt-2">
                                  <InlineMath
                                    math={`= (${result?.tech_x}, ${result?.tech_y}, ${result?.tech_z})`}
                                  />
                                </p>
                              </>
                            )}

                            {result?.tech_operation == "2" && (
                              <>
                                <div className="text-center">
                                  <p className="text-[20px]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["23"]}
                                    </strong>
                                  </p>
                                  <p className="text-[32px] bg-sky-100 px-3 py-2 rounded-lg inline-block my-3">
                                    <strong className="text-blue">
                                      <InlineMath
                                        math={`(${result?.tech_x}, ${result?.tech_y}, ${result?.tech_z})`}
                                      />
                                    </strong>
                                  </p>
                                </div>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["24"]}
                                  </strong>
                                </p>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["25"]}
                                  </strong>
                                  <InlineMath
                                    math={`(${formData?.tech_ax}, ${formData?.tech_ay}, ${formData?.tech_az}) * ${formData?.tech_alpha} + (${formData?.tech_bx}, ${formData?.tech_by}, ${formData?.tech_bz}) * ${formData?.tech_beta}`}
                                  />
                                </p>
                                <p className="mt-2">
                                  <InlineMath
                                    math={`= (${formData?.tech_ax}*${formData?.tech_alpha} + ${formData?.tech_bx}*${formData?.tech_beta}, ${formData?.tech_ay}*${formData?.tech_alpha} + ${formData?.tech_by}*${formData?.tech_beta}, ${formData?.tech_az}*${formData?.tech_alpha} + ${formData?.tech_bz}*${formData?.tech_beta})`}
                                  />
                                </p>
                                <p className="mt-2">
                                  <InlineMath
                                    math={`= (${result?.tech_x}, ${result?.tech_y}, ${result?.tech_z})`}
                                  />
                                </p>
                              </>
                            )}

                            {result?.tech_operation == "3" && (
                              <>
                                <div className="text-center">
                                  <p className="text-[20px]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["23"]}
                                    </strong>
                                  </p>
                                  <p className="text-[32px] bg-sky-100 px-3 py-2 rounded-lg inline-block my-3">
                                    <strong className="text-blue">
                                      <InlineMath
                                        math={`(${result?.tech_x}, ${result?.tech_y}, ${result?.tech_z})`}
                                      />
                                    </strong>
                                  </p>
                                </div>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["24"]}
                                  </strong>
                                </p>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["25"]}
                                  </strong>
                                  <InlineMath
                                    math={`(${formData?.tech_ax}, ${formData?.tech_ay}, ${formData?.tech_az}) - (${formData?.tech_bx}, ${formData?.tech_by}, ${formData?.tech_bz})`}
                                  />
                                </p>
                                <p className="mt-2">
                                  <InlineMath
                                    math={`= (${formData?.tech_ax} - ${formData?.tech_bx}, ${formData?.tech_ay} - ${formData?.tech_by}, ${formData?.tech_az} - ${formData?.tech_bz})`}
                                  />
                                </p>
                                <p className="mt-2">
                                  <InlineMath
                                    math={`= (${result?.tech_x}, ${result?.tech_y}, ${result?.tech_z})`}
                                  />
                                </p>
                              </>
                            )}

                            {result?.tech_operation == "4" && (
                              <>
                                <div className="text-center">
                                  <p className="text-[20px]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["23"]}
                                    </strong>
                                  </p>
                                  <p className="text-[32px] bg-sky-100 px-3 py-2 rounded-lg inline-block my-3">
                                    <strong className="text-blue">
                                      <InlineMath
                                        math={`(${result?.tech_x}, ${result?.tech_y}, ${result?.tech_z})`}
                                      />
                                    </strong>
                                  </p>
                                </div>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["24"]}
                                  </strong>
                                </p>
                                <p className="mt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["25"]}
                                  </strong>
                                  <InlineMath
                                    math={`(${formData?.tech_ax}, ${formData?.tech_ay}, ${formData?.tech_az}) * ${formData?.tech_alpha} - (${formData?.tech_bx}, ${formData?.tech_by}, ${formData?.tech_bz}) * ${formData?.tech_beta}`}
                                  />
                                </p>
                                <p className="mt-2">
                                  <InlineMath
                                    math={`= (${formData?.tech_ax}*${formData?.tech_alpha} - ${formData?.tech_bx}*${formData?.tech_beta}, ${formData?.tech_ay}*${formData?.tech_alpha} - ${formData?.tech_by}*${formData?.tech_beta}, ${formData?.tech_az}*${formData?.tech_alpha} - ${formData?.tech_bz}*${formData?.tech_beta})`}
                                  />
                                </p>
                                <p className="mt-2">
                                  <InlineMath
                                    math={`= (${result?.tech_x}, ${result?.tech_y}, ${result?.tech_z})`}
                                  />
                                </p>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="col-span-12 text-[16px] overflow-auto">
                              <table className="w-full">
                                <tbody>
                                  {(result?.tech_method == "1" ||
                                    result?.tech_method == "2") && (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "19"
                                              ]
                                            }{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          <InlineMath
                                            math={`x = ${Number(
                                              result?.tech_x
                                            ).toFixed(2)}`}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "20"
                                              ]
                                            }{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          <InlineMath
                                            math={`y = ${Number(
                                              result?.tech_y
                                            ).toFixed(2)}`}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "21"
                                              ]
                                            }{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          <InlineMath
                                            math={`m = ${Number(
                                              result?.tech_m
                                            ).toFixed(2)}`}
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "22"
                                              ]
                                            }{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          <InlineMath
                                            math={`\\theta = ${Number(
                                              result?.tech_theta
                                            ).toFixed(2)}`}
                                          />{" "}
                                          <span className="font-s-16">
                                            (rad)
                                          </span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          <strong>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "22"
                                              ]
                                            }{" "}
                                            :
                                          </strong>
                                        </td>
                                        <td className="border-b py-2">
                                          <InlineMath
                                            math={`\\theta = ${Number(
                                              result?.tech_theta * 57.2958
                                            ).toFixed(2)}`}
                                          />{" "}
                                          <span className="font-s-16">
                                            (deg)
                                          </span>
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
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

export default VectorAdditionCalculator;
