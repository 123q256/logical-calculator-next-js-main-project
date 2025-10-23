"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useStairCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StairCalculator = () => {
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
    tech_type: "first",
    tech_f_input: "12",
    tech_f_units: "cm",
    tech_s_input: "12",
    tech_s_units: "m",
    tech_rise: "1",
    tech_t_input: "24",
    tech_t_units: "cm",
    tech_tread: "1",
    tech_tread_input: "24",
    tech_tread_units: "cm",
    tech_headroom: "1",
    tech_h_req: "24",
    tech_hr_units: "cm",
    tech_f_thickness: "24",
    tech_ft_units: "cm",
    tech_f_opening: "1",
    tech_fo_units: "cm",
    tech_mount: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStairCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type || !formData.tech_f_input) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_f_input: formData.tech_f_input,
        tech_f_units: formData.tech_f_units,
        tech_s_input: formData.tech_s_input,
        tech_s_units: formData.tech_s_units,
        tech_rise: formData.tech_rise,
        tech_t_input: formData.tech_t_input,
        tech_t_units: formData.tech_t_units,
        tech_tread: formData.tech_tread,
        tech_tread_input: formData.tech_tread_input,
        tech_tread_units: formData.tech_tread_units,
        tech_headroom: formData.tech_headroom,
        tech_h_req: formData.tech_h_req,
        tech_hr_units: formData.tech_hr_units,
        tech_f_thickness: formData.tech_f_thickness,
        tech_ft_units: formData.tech_ft_units,
        tech_f_opening: formData.tech_f_opening,
        tech_fo_units: formData.tech_fo_units,
        tech_mount: formData.tech_mount,
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
      tech_type: "first",
      tech_f_input: "12",
      tech_f_units: "cm",
      tech_s_input: "12",
      tech_s_units: "m",
      tech_rise: "1",
      tech_t_input: "24",
      tech_t_units: "cm",
      tech_tread: "1",
      tech_tread_input: "24",
      tech_tread_units: "cm",
      tech_headroom: "1",
      tech_h_req: "24",
      tech_hr_units: "cm",
      tech_f_thickness: "24",
      tech_ft_units: "cm",
      tech_f_opening: "1",
      tech_fo_units: "cm",
      tech_mount: "1",
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
    setFormData((prev) => ({ ...prev, tech_f_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_s_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tread_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hr_units: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ft_units: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fo_units: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="mt-2 lg:w-[70%] ">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "first" ? "tagsUnit" : ""
                    }`}
                    id="first"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "first" });
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
                      formData.tech_type === "second" ? "tagsUnit" : ""
                    }`}
                    id="second"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "second" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_f_input" className="label">
                  {formData.tech_type === "first"
                    ? data?.payload?.tech_lang_keys["2"]
                    : data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_f_input"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_f_input}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_f_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "in", value: "in" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                <label htmlFor="tech_s_input" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_s_input"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_s_input}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_s_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_rise" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_rise"
                    id="tech_rise"
                    value={formData.tech_rise}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["6"]} (
                      {data?.payload?.tech_lang_keys["7"]})
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                <label htmlFor="tech_t_input" className="label">
                  {formData.tech_rise !== "1"
                    ? data?.payload?.tech_lang_keys["23"]
                    : `${data?.payload?.tech_lang_keys["9"]} (${data?.payload?.tech_lang_keys["7"]})`}
                </label>

                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_t_input"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_t_input}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_t_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "in", value: "in" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                <label htmlFor="tech_tread" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_tread"
                    id="tech_tread"
                    value={formData.tech_tread}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_tread == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 tread ">
                    <label htmlFor="tech_tread_input" className="label">
                      {data?.payload?.tech_lang_keys["13"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_tread_input"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_tread_input}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_tread_units} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "in", value: "in" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                <label htmlFor="tech_headroom" className="label">
                  {data?.payload?.tech_lang_keys["14"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_headroom"
                    id="tech_headroom"
                    value={formData.tech_headroom}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_headroom == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 headroom1 ">
                    <label htmlFor="tech_h_req" className="label">
                      {data?.payload?.tech_lang_keys["17"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_h_req"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_h_req}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_hr_units} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 headroom1 ">
                    <label htmlFor="tech_f_thickness" className="label">
                      {data?.payload?.tech_lang_keys["18"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_f_thickness"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_f_thickness}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_ft_units} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 headroom1">
                    <label htmlFor="tech_f_opening" className="label">
                      {data?.payload?.tech_lang_keys["19"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_f_opening"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_f_opening}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_fo_units} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler6(unit.value)}
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_mount" className="label">
                  {data?.payload?.tech_lang_keys["20"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_mount"
                    id="tech_mount"
                    value={formData.tech_mount}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["22"]}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[80%] lg:w-[80%] text-[16px] overflow-auto">
                          <table className="">
                            <tbody>
                              {result?.tech_inch && (
                                <tr>
                                  <td width="50%" className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_inch}{" "}
                                    {data?.payload?.tech_lang_keys[29]} or{" "}
                                    {result.tech_inch * 2.54} cm
                                  </td>
                                </tr>
                              )}

                              {result?.tech_run_ans && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[3]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_run_ans}{" "}
                                    {data?.payload?.tech_lang_keys[29]} or{" "}
                                    {result.tech_run_ans * 2.54} cm
                                  </td>
                                </tr>
                              )}

                              {result?.tech_step_ans && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      1st {data?.payload?.tech_lang_keys[7]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_step_ans}{" "}
                                    {data?.payload?.tech_lang_keys[29]} or{" "}
                                    {result.tech_step_ans * 2.54} cm
                                  </td>
                                </tr>
                              )}

                              {result?.tech_total_run_ans && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[2]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_total_run_ans}{" "}
                                    {data?.payload?.tech_lang_keys[29]} or{" "}
                                    {result.tech_total_run_ans * 2.54} cm
                                  </td>
                                </tr>
                              )}

                              {result?.tech_stair_ans && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[23]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_stair_ans}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_mount_ans && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[24]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_mount_ans}{" "}
                                    {data?.payload?.tech_lang_keys[29]} or{" "}
                                    {result.tech_mount_ans * 2.54} cm
                                  </td>
                                </tr>
                              )}

                              {result?.tech_str && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[25]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_str}{" "}
                                    {data?.payload?.tech_lang_keys[29]} or{" "}
                                    {result.tech_str * 2.54} cm
                                  </td>
                                </tr>
                              )}

                              {result?.tech_angle_ans && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[26]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_angle_ans}° or{" "}
                                    {(result.tech_angle_ans * 0.017).toFixed(3)}{" "}
                                    rad
                                  </td>
                                </tr>
                              )}

                              {result?.tech_answ && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[14]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_answ}{" "}
                                    {data?.payload?.tech_lang_keys[29]} or{" "}
                                    {result.tech_answ * 2.54} cm
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
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

export default StairCalculator;
