"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useLeadtimeCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LeadTimeCalculator = () => {
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
    tech_type: "manufac",
    tech_pre_time: "10",
    tech_pre_units: "days",
    tech_p_time: "20",
    tech_p_units: "days",
    tech_post_time: "25",
    tech_post_units: "days",

    tech_place_time: "",
    tech_receive_time: "",

    tech_s_delay: "25",
    tech_supply_units: "days",
    tech_r_delay: "25",
    tech_r_units: "days",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    LeadTimeCalculator,
    { isLoading: calculateLeadTimeLoading, isError, error: calculateLoveError },
  ] = useLeadtimeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_type == "manufac") {
      if (
        !formData.tech_type ||
        !formData.tech_pre_time ||
        !formData.tech_pre_units ||
        !formData.tech_p_time ||
        !formData.tech_p_units ||
        !formData.tech_post_time ||
        !formData.tech_post_units
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_type == "order") {
      if (
        !formData.tech_type ||
        !formData.tech_place_time ||
        !formData.tech_receive_time
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_type ||
        !formData.tech_s_delay ||
        !formData.tech_supply_units ||
        !formData.tech_r_delay ||
        !formData.tech_r_units
      ) {
        setFormError("Please fill in field");
        return;
      }
    }
    setFormError("");
    try {
      const response = await LeadTimeCalculator({
        tech_type: formData.tech_type,
        tech_pre_time: formData.tech_pre_time,
        tech_pre_units: formData.tech_pre_units,
        tech_p_time: formData.tech_p_time,
        tech_p_units: formData.tech_p_units,
        tech_post_time: formData.tech_post_time,
        tech_post_units: formData.tech_post_units,
        tech_place_time: formData.tech_place_time,
        tech_receive_time: formData.tech_receive_time,
        tech_s_delay: formData.tech_s_delay,
        tech_supply_units: formData.tech_supply_units,
        tech_r_delay: formData.tech_r_delay,
        tech_r_units: formData.tech_r_units,
      }).unwrap();
      setResult(response); // Assuming the response has'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating");
      toast.error("Error calculating");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_type: "manufac",
      tech_pre_time: "10",
      tech_pre_units: "days",
      tech_p_time: "20",
      tech_p_units: "days",
      tech_post_time: "25",
      tech_post_units: "days",
      tech_place_time: "",
      tech_receive_time: "",
      tech_s_delay: "",
      tech_supply_units: "days",
      tech_r_delay: "",
      tech_r_units: "days",
    });
    setResult(null);
    setFormError(null);
  };

  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pre_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_p_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_post_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 4
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_supply_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states 5
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_r_units: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="py-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="manufac">
                      {data?.payload?.tech_lang_keys["24"]}
                    </option>
                    <option value="order">
                      {data?.payload?.tech_lang_keys["25"]}{" "}
                    </option>
                    <option value="supply">
                      {data?.payload?.tech_lang_keys["26"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 mt-4 lg:grid-cols-2 md:grid-cols-2  gap-4">
              {formData.tech_type === "manufac" && (
                <>
                  {/*  days */}
                  <div className="space-y-2 days">
                    <label
                      htmlFor="tech_pre_time"
                      className="label"
                      id="textChanged"
                    >
                      {data?.payload?.tech_lang_keys["2"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_pre_time"
                        step="any"
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                        value={formData.tech_pre_time}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_pre_units} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "days", value: "days" },
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
                            { label: "wks", value: "wks" },
                            { label: "mos", value: "mos" },
                            { label: "yrs", value: "yrs" },
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
                  <div className="space-y-2 days">
                    <label
                      htmlFor="tech_p_time"
                      className="label"
                      id="textChanged"
                    >
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_p_time"
                        step="any"
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                        value={formData.tech_p_time}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_p_units} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "days", value: "days" },
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
                            { label: "wks", value: "wks" },
                            { label: "mos", value: "mos" },
                            { label: "yrs", value: "yrs" },
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
                  <div className="space-y-2 days">
                    <label
                      htmlFor="tech_post_time"
                      className="label"
                      id="textChanged"
                    >
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_post_time"
                        step="any"
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                        value={formData.tech_post_time}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_post_units} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "days", value: "days" },
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
                            { label: "wks", value: "wks" },
                            { label: "mos", value: "mos" },
                            { label: "yrs", value: "yrs" },
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
              {formData.tech_type === "order" && (
                <>
                  {/* date */}
                  <div className="space-y-2 date ">
                    <label htmlFor="tech_place_time" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <input
                      type="datetime-local"
                      name="tech_place_time"
                      id="tech_place_time"
                      step="any"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_place_time}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2 date ">
                    <label htmlFor="tech_receive_time" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <input
                      type="datetime-local"
                      name="tech_receive_time"
                      id="tech_receive_time"
                      step="any"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_receive_time}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              {formData.tech_type === "supply" && (
                <>
                  {/* supplys */}
                  <div className="space-y-2 supplys">
                    <label
                      htmlFor="tech_s_delay"
                      className="label"
                      id="textChanged"
                    >
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_s_delay"
                        step="any"
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                        value={formData.tech_s_delay}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_supply_units} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "days", value: "days" },
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
                            { label: "wks", value: "wks" },
                            { label: "mos", value: "mos" },
                            { label: "yrs", value: "yrs" },
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
                  <div className="space-y-2 supplys">
                    <label
                      htmlFor="tech_r_delay"
                      className="label"
                      id="textChanged"
                    >
                      {data?.payload?.tech_lang_keys["8"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_r_delay"
                        step="any"
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                        value={formData.tech_r_delay}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_r_units} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "days", value: "days" },
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
                            { label: "wks", value: "wks" },
                            { label: "mos", value: "mos" },
                            { label: "yrs", value: "yrs" },
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
            </div>
          </div>
          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateLeadTimeLoading}>
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
        {calculateLeadTimeLoading ? (
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
                      <div className="w-full my-2">
                        <div className="col-lg-7 font-s-18">
                          {/* Manufacturing Type */}
                          {result?.tech_type === "manufac" &&
                            (() => {
                              const manufac = result?.tech_manufac
                                ? Math.round(result.tech_manufac * 100) / 100
                                : 0;
                              return (
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td
                                        width="60%"
                                        className="border-b py-2 font-bold"
                                      >
                                        {data?.payload?.tech_lang_keys["9"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {manufac}{" "}
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["11"]}
                                        {data?.payload?.tech_lang_keys["12"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {manufac * 86400}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["11"]}
                                        {data?.payload?.tech_lang_keys["14"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {manufac * 1440}{" "}
                                        {data?.payload?.tech_lang_keys["15"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["16"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {manufac * 24}{" "}
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["18"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {(manufac / 7).toFixed(4)}{" "}
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["20"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {(manufac / 30.417).toFixed(4)}{" "}
                                        {data?.payload?.tech_lang_keys["21"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["11"]}{" "}
                                        {data?.payload?.tech_lang_keys["22"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {(manufac / 365).toFixed(4)}{" "}
                                        {data?.payload?.tech_lang_keys["23"]}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              );
                            })()}

                          {/* Order Type */}
                          {result?.tech_type === "order" &&
                            (() => {
                              const timeDiff = result?.tech_diff_minutes
                                ? Math.round(result.tech_diff_minutes * 100) /
                                  100
                                : 0;
                              return (
                                <>
                                  <p>
                                    <strong>{timeDiff}</strong>
                                  </p>
                                  <table className="w-full">
                                    <tbody>
                                      <tr>
                                        <td
                                          width="60%"
                                          className="border-b py-2"
                                        >
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["12"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {timeDiff * 60}{" "}
                                          {data?.payload?.tech_lang_keys["13"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["14"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {timeDiff}{" "}
                                          {data?.payload?.tech_lang_keys["15"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["10"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {Math.round(timeDiff / 1440)}{" "}
                                          {data?.payload?.tech_lang_keys["10"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["18"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {(timeDiff / 10080).toFixed(6)}{" "}
                                          {data?.payload?.tech_lang_keys["19"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["20"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {(timeDiff / 43800).toFixed(6)}{" "}
                                          {data?.payload?.tech_lang_keys["21"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["22"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {(timeDiff / 525600).toFixed(6)}{" "}
                                          {data?.payload?.tech_lang_keys["23"]}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </>
                              );
                            })()}

                          {/* Supply Type */}
                          {result?.tech_type === "supply" &&
                            (() => {
                              const supply = result?.tech_supply
                                ? Math.round(result.tech_supply * 100) / 100
                                : 0;
                              return (
                                <>
                                  <p>
                                    <strong>
                                      {supply}{" "}
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </strong>
                                  </p>
                                  <table className="w-full">
                                    <tbody>
                                      <tr>
                                        <td
                                          width="60%"
                                          className="border-b py-2"
                                        >
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["12"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {supply * 86400}{" "}
                                          {data?.payload?.tech_lang_keys["13"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["14"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {supply * 1440}{" "}
                                          {data?.payload?.tech_lang_keys["15"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["16"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {supply * 24}{" "}
                                          {data?.payload?.tech_lang_keys["17"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["18"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {(supply / 7).toFixed(4)}{" "}
                                          {data?.payload?.tech_lang_keys["19"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["20"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {(supply / 30.417).toFixed(4)}{" "}
                                          {data?.payload?.tech_lang_keys["21"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["11"]}{" "}
                                          {data?.payload?.tech_lang_keys["22"]}:
                                        </td>
                                        <td className="border-b py-2">
                                          {(supply / 365).toFixed(4)}{" "}
                                          {data?.payload?.tech_lang_keys["23"]}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </>
                              );
                            })()}
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

export default LeadTimeCalculator;
