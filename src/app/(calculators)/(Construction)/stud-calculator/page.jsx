"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useStudCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StudCalculator = () => {
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
    tech_want: "stud",
    tech_wall_end_stud: "0",
    tech_wall_on: "subfloor",
    tech_hight: "5",
    tech_hight_unit: "ft",
    tech_length: "7",
    tech_length_unit: "ft",
    tech_stud_spacing: "16",
    tech_stud_spacing_unit: "ft",
    tech_rim_joist_width: "6",
    tech_rim_joist_width_unit: "ft",
    tech_subfloor_thickness: "6",
    tech_subfloor_thickness_unit: "ft",
    tech_stud_width: "3.5",
    tech_stud_width_unit: "ft",
    tech_stud_price: "10",
    tech_estimated_waste: "15",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStudCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_want || !formData.tech_wall_end_stud) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_want: formData.tech_want,
        tech_wall_end_stud: formData.tech_wall_end_stud,
        tech_wall_on: formData.tech_wall_on,
        tech_hight: formData.tech_hight,
        tech_hight_unit: formData.tech_hight_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_stud_spacing: formData.tech_stud_spacing,
        tech_stud_spacing_unit: formData.tech_stud_spacing_unit,
        tech_rim_joist_width: formData.tech_rim_joist_width,
        tech_rim_joist_width_unit: formData.tech_rim_joist_width_unit,
        tech_subfloor_thickness: formData.tech_subfloor_thickness,
        tech_subfloor_thickness_unit: formData.tech_subfloor_thickness_unit,
        tech_stud_width: formData.tech_stud_width,
        tech_stud_width_unit: formData.tech_stud_width_unit,
        tech_stud_price: formData.tech_stud_price,
        tech_estimated_waste: formData.tech_estimated_waste,
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
      tech_want: "stud",
      tech_wall_end_stud: "0",
      tech_wall_on: "subfloor",
      tech_hight: "5",
      tech_hight_unit: "ft",
      tech_length: "5",
      tech_length_unit: "ft",
      tech_stud_spacing: "16",
      tech_stud_spacing_unit: "ft",
      tech_rim_joist_width: "6",
      tech_rim_joist_width_unit: "ft",
      tech_subfloor_thickness: "6",
      tech_subfloor_thickness_unit: "ft",
      tech_stud_width: "3.5",
      tech_stud_width_unit: "ft",
      tech_stud_price: "10",
      tech_estimated_waste: "15",
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
    setFormData((prev) => ({ ...prev, tech_hight_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_stud_spacing_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rim_joist_width_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_subfloor_thickness_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_stud_width_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-270 px-3">
                <label htmlFor="tech_want" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_want"
                    id="tech_want"
                    value={formData.tech_want}
                    onChange={handleChange}
                  >
                    <option value="stud">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="sheet">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="board">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="all">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3 wall_end_stud">
                <label htmlFor="tech_wall_end_stud" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_wall_end_stud"
                    id="tech_wall_end_stud"
                    value={formData.tech_wall_end_stud}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_want == "sheet" ||
                formData.tech_want == "all") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3 wall_on">
                    <label htmlFor="tech_wall_on" className="label">
                      {data?.payload?.tech_lang_keys["11"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_wall_on"
                        id="tech_wall_on"
                        value={formData.tech_wall_on}
                        onChange={handleChange}
                      >
                        <option value="subfloor">
                          {data?.payload?.tech_lang_keys["12"]}
                        </option>
                        <option value="slab">
                          {data?.payload?.tech_lang_keys["13"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_want == "stud" ||
                formData.tech_want == "sheet" ||
                formData.tech_want == "board" ||
                formData.tech_want == "all") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3 wall-height">
                    <label htmlFor="tech_hight" className="label">
                      {data?.payload?.tech_lang_keys["14"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_hight"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_hight}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_hight_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
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
              {(formData.tech_want == "stud" ||
                formData.tech_want == "sheet" ||
                formData.tech_want == "board" ||
                formData.tech_want == "all") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3 wall-length ">
                    <label htmlFor="tech_length" className="label">
                      {data?.payload?.tech_lang_keys["15"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_length"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_length_unit} ▾
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
                </>
              )}
              {(formData.tech_want == "stud" ||
                formData.tech_want == "sheet" ||
                formData.tech_want == "board" ||
                formData.tech_want == "all") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3 stud-spacing">
                    <label htmlFor="tech_stud_spacing" className="label">
                      {data?.payload?.tech_lang_keys["16"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_stud_spacing"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_stud_spacing}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_stud_spacing_unit} ▾
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
                </>
              )}
              {(formData.tech_want == "sheet" ||
                formData.tech_want == "all") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3 rim-joist ">
                    <label htmlFor="tech_rim_joist_width" className="label">
                      {data?.payload?.tech_lang_keys["17"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_rim_joist_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_rim_joist_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_rim_joist_width_unit} ▾
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
                </>
              )}
              {(formData.tech_want == "sheet" ||
                formData.tech_want == "all") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3 subfloor ">
                    <label htmlFor="tech_subfloor_thickness" className="label">
                      {data?.payload?.tech_lang_keys["18"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_subfloor_thickness"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_subfloor_thickness}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_subfloor_thickness_unit} ▾
                      </label>
                      {dropdownVisible4 && (
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
              {(formData.tech_want == "all" ||
                formData.tech_want == "board") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3 stud-width ">
                    <label htmlFor="tech_stud_width" className="label">
                      {data?.payload?.tech_lang_keys["19"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_stud_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_stud_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_stud_width_unit} ▾
                      </label>
                      {dropdownVisible5 && (
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
              {(formData.tech_want == "stud" ||
                formData.tech_want == "sheet" ||
                (formData.tech_want == "board") |
                  (formData.tech_want == "all")) && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3  ">
                    <label htmlFor="tech_stud_price" className="label">
                      {data?.payload?.tech_lang_keys["20"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_stud_price"
                        id="tech_stud_price"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_stud_price}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_want == "stud" ||
                formData.tech_want == "sheet" ||
                (formData.tech_want == "board") |
                  (formData.tech_want == "all")) && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2 px-3  ">
                    <label htmlFor="tech_estimated_waste" className="label">
                      {data?.payload?.tech_lang_keys["21"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_estimated_waste"
                        id="tech_estimated_waste"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_estimated_waste}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
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
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto text-[16px]">
                          {result && data?.payload && (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data.payload.tech_lang_keys[22]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result.tech_studs}
                                      <span className="text-base">
                                        {" "}
                                        {data.payload.tech_lang_keys[23]}
                                      </span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data.payload.tech_lang_keys[35]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol} {result.tech_total_cost}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data.payload.tech_lang_keys[24]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result.tech_finished_length_of_studs}
                                      <span className="text-base">
                                        {" "}
                                        {data.payload.tech_lang_keys[25]}
                                      </span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data.payload.tech_lang_keys[26]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result.tech_wall_area_ft}
                                      <span className="text-base">
                                        {" "}
                                        {data.payload.tech_lang_keys[27]}
                                      </span>
                                    </td>
                                  </tr>

                                  {(formData?.tech_want === "sheet" ||
                                    formData?.tech_want === "all") && (
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data.payload.tech_lang_keys[28]} :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {result.tech_sheets_req}
                                        <span className="text-base">
                                          {" "}
                                          {data.payload.tech_lang_keys[19]}
                                        </span>
                                      </td>
                                    </tr>
                                  )}

                                  {(formData?.tech_want === "board" ||
                                    formData?.tech_want === "all") && (
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data.payload.tech_lang_keys[30]} :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {result.tech_board_footage}
                                        <span className="text-base">
                                          {" "}
                                          {data.payload.tech_lang_keys[31]}
                                        </span>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>

                              <table className="w-full mt-4">
                                <tbody>
                                  <tr>
                                    <td colSpan="3" className="pb-2 pt-3">
                                      <strong>
                                        {data.payload.tech_lang_keys[32]}
                                      </strong>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>{result.tech_lumber8 * 2}</strong>
                                      <span className="text-base">
                                        {" "}
                                        8 {data.payload.tech_lang_keys[33]}
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>
                                        {result.tech_lumber10 * 2}
                                      </strong>
                                      <span className="text-base">
                                        {" "}
                                        10 {data.payload.tech_lang_keys[33]}
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>
                                        {result.tech_lumber12 * 2}
                                      </strong>
                                      <span className="text-base">
                                        {" "}
                                        12 {data.payload.tech_lang_keys[33]}
                                      </span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td colSpan="3" className="pb-2 pt-3">
                                      <strong>
                                        {data.payload.tech_lang_keys[34]}
                                      </strong>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>{result.tech_lumber8}</strong>
                                      <span className="text-base">
                                        {" "}
                                        8 {data.payload.tech_lang_keys[33]}
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>{result.tech_lumber10}</strong>
                                      <span className="text-base">
                                        {" "}
                                        10 {data.payload.tech_lang_keys[33]}
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>{result.tech_lumber12}</strong>
                                      <span className="text-base">
                                        {" "}
                                        12 {data.payload.tech_lang_keys[33]}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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

export default StudCalculator;
