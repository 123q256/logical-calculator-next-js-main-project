"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBusinessdaysCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BusinessDaysCalculator = () => {
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

  //

  const [formData, setFormData] = useState({
    tech_lang: "en",
    tech_sim_adv: "simple", // advance   simple
    tech_s_date: "2025-04-18",
    tech_e_date: "2025-04-18",
    tech_end_inc: "on",
    tech_sat_inc: "on",
    tech_holiday_c: "no",
    tech_cal_bus: "no",
    tech_nyd: "on",
    tech_mlkd: "on",
    tech_psd: "on",
    tech_ind: "on",
    tech_cold: "on",
    tech_vetd: "on",
    tech_thankd: "on",
    tech_cheve: "on",
    tech_nye: "on",
    tech_memd: "on",
    tech_labd: "on",
    tech_blkf: "on",
    tech_chirs: "on",
    tech_n0: "Eid-ul-Fitr",
    tech_m0: "3",
    tech_d0: "2",
    tech_n1: "Christmas",
    tech_m1: "3",
    tech_d1: "2",
    tech_n2: "New Year",
    tech_m2: "3",
    tech_d2: "2",
    tech_total_j: "3",
    tech_total_i: "3",
    tech_ex_in: "1",
    tech_satting: "2",
    tech_add_date: "2025-04-18",
    tech_method: "+",
    tech_years: "1",
    tech_months: "2",
    tech_weeks: "3",
    tech_days: "4",
    tech_sun: "on",
    tech_mon: "on",
    tech_tue: "on",
    tech_wed: "on",
    tech_thu: "on",
    tech_fri: "on",
    tech_sat: "on",

    tech_weekend_c: "Yes",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useBusinessdaysCalculationMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //   setResult(null);
  //    setResult(null);
  //   setFormError(null);
  // };
  const [count, setCount] = useState(1); // starts from 1 because tech_n0 is already there

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Create base payload
    const holidayPayload = {
      tech_lang: formData.tech_lang,
      tech_sim_adv: formData.tech_sim_adv,
      tech_s_date: formData.tech_s_date,
      tech_e_date: formData.tech_e_date,
      tech_end_inc: formData.tech_end_inc,
      tech_sat_inc: formData.tech_sat_inc,
      tech_holiday_c: formData.tech_holiday_c,
      tech_cal_bus: formData.tech_cal_bus,
      tech_nyd: formData.tech_nyd,
      tech_mlkd: formData.tech_mlkd,
      tech_psd: formData.tech_psd,
      tech_ind: formData.tech_ind,
      tech_cold: formData.tech_cold,
      tech_vetd: formData.tech_vetd,
      tech_thankd: formData.tech_thankd,
      tech_cheve: formData.tech_cheve,
      tech_nye: formData.tech_nye,

      tech_memd: formData.tech_memd,
      tech_labd: formData.tech_labd,
      tech_blkf: formData.tech_blkf,
      tech_chirs: formData.tech_chirs,

      tech_total_i: formData.tech_total_i,
      tech_ex_in: formData.tech_ex_in,
      tech_satting: formData.tech_satting,
      tech_add_date: formData.tech_add_date,
      tech_method: formData.tech_method,
      tech_years: formData.tech_years,
      tech_months: formData.tech_months,
      tech_weeks: formData.tech_weeks,
      tech_days: formData.tech_days,
      tech_weekend_c: formData.tech_weekend_c,
      tech_total_j: formData.tech_total_j,

      tech_sun: formData.tech_sun,
      tech_mon: formData.tech_mon,
      tech_tue: formData.tech_tue,
      tech_wed: formData.tech_wed,
      tech_thu: formData.tech_thu,
      tech_fri: formData.tech_fri,
      tech_sat: formData.tech_sat,
    };

    // Step 2: Dynamically loop over holidays
    const totalHolidays = Number(formData.tech_total_j) || 0;
    for (let i = 0; i < totalHolidays; i++) {
      holidayPayload[`tech_n${i}`] = formData[`tech_n${i}`] || "";
      holidayPayload[`tech_m${i}`] = formData[`tech_m${i}`] || "";
      holidayPayload[`tech_d${i}`] = formData[`tech_d${i}`] || "";
    }

    // Step 3: Submit to API
    try {
      const response = await calculateLovePercentage(holidayPayload).unwrap();
      setResult(response);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_lang: "en",
      tech_sim_adv: "simple", // advance   simple
      tech_s_date: "2025-04-18",
      tech_e_date: "2025-04-18",
      tech_end_inc: "on",
      tech_sat_inc: "on",
      tech_holiday_c: "no",
      tech_cal_bus: "no",
      tech_nyd: "on",
      tech_mlkd: "on",
      tech_psd: "on",
      tech_ind: "on",
      tech_cold: "on",
      tech_vetd: "on",
      tech_thankd: "on",
      tech_cheve: "on",
      tech_nye: "on",
      tech_memd: "on",
      tech_labd: "on",
      tech_blkf: "on",
      tech_chirs: "on",
      tech_n0: "Eid-ul-Fitr",
      tech_m0: "3",
      tech_d0: "2",
      tech_n1: "Christmas",
      tech_m1: "3",
      tech_d1: "2",
      tech_n2: "New Year",
      tech_m2: "3",
      tech_d2: "2",
      tech_total_j: "3",
      tech_total_i: "3",
      tech_ex_in: "1",
      tech_satting: "2",
      tech_add_date: "2025-04-18",
      tech_method: "+",
      tech_years: "1",
      tech_months: "2",
      tech_weeks: "3",
      tech_days: "4",
      tech_sun: "on",
      tech_mon: "on",
      tech_tue: "on",
      tech_wed: "on",
      tech_thu: "on",
      tech_fri: "on",
      tech_sat: "on",

      tech_weekend_c: "Yes",
    });
    setResult(null);
    setFormError(null);
  };

  // result

  const holidays = result?.tech_getworkdays?.get_holi || [];
  const holidayLabels = result?.tech_getworkdays?.dis_holi || [];

  const addHoliday = () => {
    const total = Number(formData.tech_total_j) || 0;
    const newIndex = total;

    setFormData((prev) => ({
      ...prev,
      [`tech_n${newIndex}`]: "",
      [`tech_m${newIndex}`]: "",
      [`tech_d${newIndex}`]: "",
      tech_total_j: (total + 1).toString(),
      tech_total_i: (total + 1).toString(), // Keep both equal
    }));
  };

  const removeHoliday = (index) => {
    const total = Number(formData.tech_total_j) || 0;
    if (total <= 1) return;

    const newForm = { ...formData };

    // Shift holidays down
    for (let i = index; i < total - 1; i++) {
      newForm[`tech_n${i}`] = newForm[`tech_n${i + 1}`];
      newForm[`tech_m${i}`] = newForm[`tech_m${i + 1}`];
      newForm[`tech_d${i}`] = newForm[`tech_d${i + 1}`];
    }

    // Delete the last holiday
    delete newForm[`tech_n${total - 1}`];
    delete newForm[`tech_m${total - 1}`];
    delete newForm[`tech_d${total - 1}`];

    // Update both counts equally
    const updatedTotal = total - 1;
    newForm.tech_total_j = updatedTotal.toString();
    newForm.tech_total_i = updatedTotal.toString();

    setFormData(newForm);
  };

  const renderHolidayRows = () => {
    const count = Number(formData.tech_total_j) || 0; // Fix: get from formData
    const rows = [];

    for (let i = 0; i < count; i++) {
      rows.push(
        <div key={i} className="grid grid-cols-12 gap-3 mb-3">
          {/* Holiday Name */}
          <div className="col-span-4">
            <label
              htmlFor={`tech_n${i}`}
              className="label block mb-1 font-medium"
            >
              Holiday
            </label>
            <input
              type="text"
              name={`tech_n${i}`}
              id={`tech_n${i}`}
              className="input w-full border p-2 rounded"
              placeholder="Holiday"
              value={formData[`tech_n${i}`] || ""}
              onChange={handleChange}
            />
          </div>

          {/* Month */}
          <div className="col-span-4">
            <label
              htmlFor={`tech_m${i}`}
              className="label block mb-1 font-medium"
            >
              Month
            </label>
            <select
              name={`tech_m${i}`}
              id={`tech_m${i}`}
              className="input w-full border p-2 rounded mt-1"
              value={formData[`tech_m${i}`] || ""}
              onChange={handleChange}
            >
              <option value="">--</option>
              <option value="01">Jan</option>
              <option value="02">Feb</option>
              <option value="03">Mar</option>
              <option value="04">Apr</option>
              <option value="05">May</option>
              <option value="06">Jun</option>
              <option value="07">Jul</option>
              <option value="08">Aug</option>
              <option value="09">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </select>
          </div>

          {/* Day */}
          <div className="col-span-4">
            <label
              htmlFor={`tech_d${i}`}
              className="label block mb-1 font-medium"
            >
              Day
            </label>
            <div className="flex items-center">
              <select
                name={`tech_d${i}`}
                id={`tech_d${i}`}
                className="input w-full border p-2 rounded"
                value={formData[`tech_d${i}`] || ""}
                onChange={handleChange}
              >
                <option value="">--</option>
                {[...Array(31)].map((_, j) => (
                  <option key={j} value={(j + 1).toString().padStart(2, "0")}>
                    {j + 1}
                  </option>
                ))}
              </select>

              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => removeHoliday(i)}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return rows;
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12">
                <div className="col-span-12 mt-3">
                  <div className="col-span-12 mx-auto">
                    <div className="row align-items-center  text-center">
                      <input
                        type="hidden"
                        name="tech_sim_adv"
                        id="calculator_time"
                        value={formData.tech_sim_adv}
                      />
                      <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                        {/* Date Cal Tab */}
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                              formData.tech_sim_adv == "simple"
                                ? "tagsUnit"
                                : ""
                            }`}
                            id="simple"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                tech_sim_adv: "simple",
                              });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys["n27"]}
                          </div>
                        </div>
                        {/* Time Cal Tab */}
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                              formData.tech_sim_adv == "advance"
                                ? "tagsUnit"
                                : ""
                            }`}
                            id="advance"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                tech_sim_adv: "advance",
                              });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys["n28"]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {formData.tech_sim_adv == "simple" && (
                  <>
                    <div className="simple">
                      <div className="grid grid-cols-12  gap-2">
                        <div className="col-span-12 md:col-span-6 mt-lg-4 mt-2 pe-lg-4">
                          <label htmlFor="tech_s_date" className="label">
                            {data?.payload?.tech_lang_keys["n6"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="date"
                              name="tech_s_date"
                              id="tech_s_date"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_s_date}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-6 mt-lg-4 mt-2 ps-lg-4">
                          <label htmlFor="tech_e_date" className="label">
                            {data?.payload?.tech_lang_keys["n6"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="date"
                              name="tech_e_date"
                              id="tech_e_date"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_e_date}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-span-6">
                          <input
                            type="checkbox"
                            name="tech_end_inc"
                            id="tech_end_inc"
                            className="mr-2"
                            onChange={handleChange}
                            checked={formData.tech_end_inc}
                          />
                          <label
                            htmlFor="tech_end_inc"
                            className="text-sm text-blue-500"
                          >
                            {data?.payload?.tech_lang_keys["n29"]}:
                          </label>
                        </div>
                        <div className="col-span-6 ps-lg-4">
                          <input
                            type="checkbox"
                            name="tech_sat_inc"
                            id="tech_sat_inc"
                            className="mr-2"
                            onChange={handleChange}
                            checked={formData.tech_sat_inc}
                          />
                          <label
                            htmlFor="tech_sat_inc"
                            className="text-sm text-blue-500"
                          >
                            {data?.payload?.tech_lang_keys["n30"]}:
                          </label>
                        </div>
                        <p className="mt-2 col-span-12 text-[14px]">
                          {data?.payload?.tech_lang_keys["n31"]}
                        </p>
                        <div className="col-span-6 mt-2">
                          <label className="pe-2" htmlFor="no">
                            <input
                              type="radio"
                              name="tech_holiday_c"
                              value="no"
                              id="no"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_holiday_c == "no"}
                            />
                            <span>{data?.payload?.tech_lang_keys["n32"]}</span>
                          </label>
                        </div>
                        <div className="col-span-6 mt-2 ps-lg-4">
                          <label className="pe-2" htmlFor="yes">
                            <input
                              type="radio"
                              name="tech_holiday_c"
                              value="yes"
                              id="yes"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_holiday_c == "yes"}
                            />
                            <span>{data?.payload?.tech_lang_keys["n33"]}</span>
                          </label>
                        </div>
                        {formData.tech_holiday_c == "yes" && (
                          <>
                            <div className="holiday col-span-12  my-3">
                              <div className="grid grid-cols-12  gap-4">
                                <div className="col-span-6">
                                  <label className="d-block">
                                    <input
                                      type="checkbox"
                                      name="tech_nyd"
                                      id="tech_nyd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_nyd}
                                    />
                                    <span className="black-text">
                                      New Year's Day
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_mlkd"
                                      id="tech_mlkd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_mlkd}
                                    />
                                    <span className="black-text">
                                      M. L. King Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_psd"
                                      id="tech_psd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_psd}
                                    />
                                    <span className="black-text">
                                      President's Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_memd"
                                      id="tech_memd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_memd}
                                    />
                                    <span className="black-text">
                                      Memorial Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_ind"
                                      id="tech_ind"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_ind}
                                    />
                                    <span className="black-text">
                                      Independence Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_labd"
                                      id="tech_labd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_labd}
                                    />
                                    <span className="black-text">
                                      Labor Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_cold"
                                      id="tech_cold"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_cold}
                                    />
                                    <span className="black-text">
                                      Columbus Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block">
                                    <input
                                      type="checkbox"
                                      name="tech_vetd"
                                      id="tech_vetd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_vetd}
                                    />
                                    <span className="black-text">
                                      Veteran's Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_thankd"
                                      id="tech_thankd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_thankd}
                                    />
                                    <span className="black-text">
                                      Thanksgiving (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_blkf"
                                      id="tech_blkf"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_blkf}
                                    />
                                    <span className="black-text">
                                      Black Friday (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_cheve"
                                      id="tech_cheve"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_cheve}
                                    />
                                    <span className="black-text">
                                      Christmas Eve
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_chirs"
                                      id="tech_chirs"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_chirs}
                                    />
                                    <span className="black-text">
                                      Christmas
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_nye"
                                      id="tech_nye"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_nye}
                                    />
                                    <span className="black-text">
                                      New Year's Eve
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <p className="fw-bold mb-3 mt-2">
                                If not in the list, define the holidays below:
                              </p>
                              <input
                                type="hidden"
                                name="total_i"
                                value={count}
                                id="total_i"
                              />
                              {renderHolidayRows()}
                              <div className="mt-4">
                                <button
                                  type="button"
                                  onClick={addHoliday}
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  + Add Holiday
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        <p className="mt-2 col-span-12 text-[14px]">
                          {data?.payload?.tech_lang_keys["n35"]}
                        </p>
                        <div className="col-span-12 md:col-span-6 mt-2 pe-lg-4">
                          <label htmlFor="tech_ex_in" className="label">
                            {data?.payload?.tech_lang_keys["n36"]}:
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_ex_in"
                              id="tech_ex_in"
                              value={formData.tech_ex_in}
                              onChange={handleChange}
                            >
                              <option value="1">
                                {data?.payload?.tech_lang_keys["n37"]}{" "}
                              </option>
                              <option value="2">
                                {data?.payload?.tech_lang_keys["n38"]}{" "}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-6 mt-2 ps-lg-4">
                          <label htmlFor="tech_satting" className="label">
                            {data?.payload?.tech_lang_keys["39"]}:
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_satting"
                              id="tech_satting"
                              value={formData.tech_satting}
                              onChange={handleChange}
                            >
                              <option value="2">
                                {data?.payload?.tech_lang_keys["n40"]}{" "}
                              </option>
                              <option value="4">
                                {data?.payload?.tech_lang_keys["n41"]}{" "}
                              </option>
                              <option value="5">
                                {data?.payload?.tech_lang_keys["n42"]}{" "}
                              </option>
                              <option value="6">
                                {data?.payload?.tech_lang_keys["n43"]}{" "}
                              </option>
                            </select>
                          </div>
                        </div>
                        {formData.tech_satting == "6" && (
                          <>
                            <div className="col-span-12" id="select_days">
                              <div className="grid grid-cols-12  gap-4 mt-3">
                                <div className="col-span-6">
                                  <label className="d-block">
                                    <input
                                      type="checkbox"
                                      name="tech_sun"
                                      id="tech_sun"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_sun}
                                    />
                                    <span className="black-text">
                                      {data?.payload?.tech_lang_keys["n44"]}
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_mon"
                                      id="tech_mon"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_mon}
                                    />
                                    <span className="black-text">
                                      {data?.payload?.tech_lang_keys["n45"]}
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_tue"
                                      id="tech_tue"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_tue}
                                    />
                                    <span className="black-text">
                                      {data?.payload?.tech_lang_keys["n36"]}
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_wed"
                                      id="tech_wed"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_wed}
                                    />
                                    <span className="black-text">
                                      {data?.payload?.tech_lang_keys["n37"]}
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block">
                                    <input
                                      type="checkbox"
                                      name="tech_thu"
                                      id="tech_thu"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_thu}
                                    />
                                    <span className="black-text">
                                      {data?.payload?.tech_lang_keys["n38"]}
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_fri"
                                      id="tech_fri"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_fri}
                                    />
                                    <span className="black-text">
                                      {data?.payload?.tech_lang_keys["n39"]}
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_sat"
                                      id="tech_sat"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_sat}
                                    />
                                    <span className="black-text">
                                      {data?.payload?.tech_lang_keys["n40"]}
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {/* {-- advance --} */}
                {formData?.tech_sim_adv == "advance" && (
                  <>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12 md:col-span-6">
                        <label htmlFor="tech_add_date" className="label">
                          {data?.payload?.tech_lang_keys["n6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="date"
                            name="tech_add_date"
                            id="tech_add_date"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_add_date}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <label htmlFor="tech_method" className="label">
                          {data?.payload?.tech_lang_keys["n19"]} /{" "}
                          {data?.payload?.tech_lang_keys["n20"]}:
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
                            <option value="+">
                              {data?.payload?.tech_lang_keys["n19"]} (+)
                            </option>
                            <option value="-">
                              {data?.payload?.tech_lang_keys["n21"]} (-)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12">
                        <div className="grid grid-cols-12 gap-2">
                          {!formData.tech_cal_bus && (
                            <>
                              <div className="col-span-12 md:col-span-3 pe-2 inthree ">
                                <label htmlFor="tech_years" className="label">
                                  {data?.payload?.tech_lang_keys["n46"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_years"
                                    id="tech_years"
                                    min="1"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_years}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-3 px-2 inthree">
                                <label htmlFor="tech_months" className="label">
                                  {data?.payload?.tech_lang_keys["n47"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_months"
                                    id="tech_months"
                                    min="1"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_months}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-3 px-2 inthree">
                                <label htmlFor="tech_weeks" className="label">
                                  {data?.payload?.tech_lang_keys["n48"]}:
                                </label>
                                <div className=" relative">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_weeks"
                                    id="tech_weeks"
                                    min="1"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_weeks}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          <div className="col-span-12 md:col-span-3 ps-2">
                            <label htmlFor="tech_days" className="label">
                              {data?.payload?.tech_lang_keys["n14"]}:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_days"
                                id="tech_days"
                                min="1"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_days}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label className="d-block my-2">
                          <input
                            type="checkbox"
                            name="tech_cal_bus"
                            id="tech_cal_bus"
                            className="mr-2"
                            onChange={handleChange}
                            checked={formData.tech_cal_bus}
                          />
                          <span className="black-text">
                            {data?.payload?.tech_lang_keys["n49"]}
                          </span>
                        </label>
                      </div>
                      {formData.tech_cal_bus && (
                        <>
                          <div className=" checkrow col-span-12 ">
                            <div className="grid grid-cols-12 gap-2">
                              <p className="mt-2 col-span-12 text-[14px]">
                                {data?.payload?.tech_lang_keys["n50"]}
                              </p>
                              <div className="col-span-12 md:col-span-6 mt-2">
                                <label className="pe-2" htmlFor="no">
                                  <input
                                    type="radio"
                                    name="tech_weekend_c"
                                    value="no"
                                    id="no"
                                    className="mr-2 border"
                                    onChange={handleChange}
                                    checked={formData.tech_weekend_c === "no"}
                                  />
                                  <span>
                                    {data?.payload?.tech_lang_keys["n51"]}
                                  </span>
                                </label>
                              </div>
                              <div className="col-span-12 md:col-span-6 mt-2 ps-lg-4">
                                <label className="pe-2" htmlFor="yes">
                                  <input
                                    type="radio"
                                    name="tech_weekend_c"
                                    value="yes"
                                    id="yes"
                                    className="mr-2 border"
                                    onChange={handleChange}
                                    checked={formData.tech_weekend_c === "yes"}
                                  />
                                  <span>
                                    {data?.payload?.tech_lang_keys["n52"]}
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_weekend_c == "yes" &&
                        formData.tech_cal_bus && (
                          <>
                            <div className="week my-3  col-span-12">
                              <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_nyd"
                                      id="tech_nyd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_nyd}
                                    />
                                    <span className="black-text">
                                      New Year's Day
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_mlkd"
                                      id="tech_mlkd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_mlkd}
                                    />
                                    <span className="black-text">
                                      M. L. King Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_psd"
                                      id="tech_psd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_psd}
                                    />
                                    <span className="black-text">
                                      President's Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_memd"
                                      id="tech_memd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_memd}
                                    />
                                    <span className="black-text">
                                      Memorial Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_ind"
                                      id="tech_ind"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_ind}
                                    />
                                    <span className="black-text">
                                      Independence Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_labd"
                                      id="tech_labd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_labd}
                                    />
                                    <span className="black-text">
                                      Labor Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_cold"
                                      id="tech_cold"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_cold}
                                    />
                                    <span className="black-text">
                                      Columbus Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_vetd"
                                      id="tech_vetd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_vetd}
                                    />
                                    <span className="black-text">
                                      Veteran's Day (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_thankd"
                                      id="tech_thankd"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_thankd}
                                    />
                                    <span className="black-text">
                                      Thanksgiving (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_blkf"
                                      id="tech_blkf"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_blkf}
                                    />
                                    <span className="black-text">
                                      Black Friday (US)
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_cheve"
                                      id="tech_cheve"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_cheve}
                                    />
                                    <span className="black-text">
                                      Christmas Eve
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_chirs"
                                      id="tech_chirs"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_chirs}
                                    />
                                    <span className="black-text">
                                      Christmas
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-6">
                                  <label className="d-block my-2">
                                    <input
                                      type="checkbox"
                                      name="tech_nye"
                                      id="tech_nye"
                                      className="mr-2"
                                      onChange={handleChange}
                                      checked={formData.tech_nye}
                                    />
                                    <span className="black-text">
                                      New Year's Eve
                                    </span>
                                  </label>
                                </div>
                              </div>
                              {/* Hidden input for total_j */}
                              <input
                                type="hidden"
                                name="total_j"
                                value={count}
                                id="total_j"
                              />
                              <p className="fw-bold my-2">
                                {data?.payload?.tech_lang_keys == "en"
                                  ? "If not in the list,"
                                  : ""}{" "}
                                {data?.payload?.tech_lang_keys["n53"]}
                              </p>
                              {renderHolidayRows()}
                              <div className="mt-4">
                                <button
                                  type="button"
                                  onClick={addHoliday}
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  + Add Holiday
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculateDeadlineLoading}>
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
        {calculateDeadlineLoading ? (
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
                      <div className="w-full my-2">
                        <div className="grid grid-cols-12 gap-3 my-2">
                          {result?.tech_count_days ? (
                            <>
                              <div className="col-span-12 md:col-span-8 text-[16px] overflow-auto">
                                <table className="w-full">
                                  <tbody>
                                    <tr className="">
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["19"]}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_from}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["20"]}
                                        </strong>
                                      </td>
                                      <td className="py-2">
                                        {result?.tech_to}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={2} className="border-b py-2">
                                        {result?.tech_getworkdays?.workdays}{" "}
                                        {data?.payload?.tech_lang_keys["34"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={2} className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["35"]}{" "}
                                        {result?.tech_getworkdays?.workdays * 8}{" "}
                                        {data?.payload?.tech_lang_keys["36"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={2} className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["35"]}{" "}
                                        {result?.tech_getworkdays?.workdays *
                                          8 *
                                          60}{" "}
                                        {data?.payload?.tech_lang_keys["37"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={2} className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["35"]}{" "}
                                        {result?.tech_getworkdays?.workdays *
                                          8 *
                                          60 *
                                          60}{" "}
                                        {data?.payload?.tech_lang_keys["38"]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="pt-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["21"]}
                                        </strong>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        Total Days
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_t_days}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        Business Days
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_getworkdays?.workdays}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        Weekend Days
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_getworkdays?.weekend}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        Work Hours
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_getworkdays?.workdays * 8}
                                        h
                                      </td>
                                    </tr>
                                    {formData?.tech_holiday_c == "yes" && (
                                      <tr>
                                        <td className="border-b py-2">
                                          Holidays{" "}
                                          {result?.tech_getworkdays?.holidays !=
                                            0 && (
                                            <span className="view_holi">
                                              (View result)
                                            </span>
                                          )}
                                        </td>
                                        <td className="border-b py-2">
                                          {result?.tech_getworkdays?.holidays}
                                        </td>
                                      </tr>
                                    )}

                                    {result?.tech_t_days &&
                                      result?.tech_ans2 && (
                                        <tr>
                                          <td className="border-b py-2">
                                            <strong>
                                              {result?.tech_t_days}
                                            </strong>{" "}
                                            Calendar Days –{" "}
                                            <strong>{result?.tech_ans2}</strong>{" "}
                                            Skipped Days
                                          </td>
                                        </tr>
                                      )}

                                    {result?.tech_weekends_days && (
                                      <tr>
                                        <td className="border-b py-2">
                                          {result?.tech_weekends_days} Weekend
                                          Days
                                        </td>
                                      </tr>
                                    )}
                                    {result?.tech_holi_days && (
                                      <tr>
                                        <td className="border-b py-2">
                                          {result?.tech_holi_days} Holidays
                                        </td>
                                      </tr>
                                    )}

                                    {Object.entries(result || {}).map(
                                      ([key, value]) => {
                                        if (
                                          key.match(
                                            /^tech_(sun|mon|tue|wed|thu|fri|sat)_day$/
                                          ) &&
                                          value
                                        ) {
                                          return (
                                            <tr key={key}>
                                              <td className="border-b py-2">
                                                <strong>{value}</strong>
                                              </td>
                                            </tr>
                                          );
                                        }
                                        return null;
                                      }
                                    )}

                                    {result?.tech_res_days && (
                                      <tr>
                                        <td className="border-b py-2" id="resu">
                                          Result:{" "}
                                        </td>
                                        <td className="border-b py-2">
                                          {result?.tech_res_days} Days
                                        </td>
                                      </tr>
                                    )}

                                    {formData?.tech_holiday_c == "yes" &&
                                      result?.tech_getworkdays?.holidays !=
                                        0 && (
                                        <>
                                          <tr>
                                            <td
                                              className="border-b py-2"
                                              colSpan={2}
                                            >
                                              <strong>
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "25"
                                                  ]
                                                }{" "}
                                                {result?.tech_from} and{" "}
                                                {result?.tech_to}
                                              </strong>
                                            </td>
                                          </tr>
                                          {holidays.map((holiday, i) => (
                                            <tr key={i}>
                                              <td className="border-b py-2">
                                                {holidayLabels[i]}
                                              </td>
                                              <td className="border-b py-2">
                                                <strong>{holiday}</strong>
                                              </td>
                                            </tr>
                                          ))}
                                        </>
                                      )}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="col-span-12 md:col-span-12 text-[16px] overflow-auto">
                                <table className="w-full">
                                  <tbody>
                                    {formData?.tech_cal_bus ? (
                                      <>
                                        <tr>
                                          <td
                                            colSpan={2}
                                            width="60%"
                                            className="border-b py-2"
                                          >
                                            {result?.tech_date}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            colSpan={2}
                                            className="border-b py-2"
                                          >
                                            {formData?.tech_method == "+" ? (
                                              <>
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "28"
                                                  ]
                                                }{" "}
                                                {formData?.tech_days}{" "}
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "22"
                                                  ]
                                                }{" "}
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "29"
                                                  ]
                                                }{" "}
                                                {result?.tech_from}{" "}
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "30"
                                                  ]
                                                }{" "}
                                                {result?.tech_from_s}{" "}
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "26"
                                                  ]
                                                }{" "}
                                                {result?.tech_date_e}
                                              </>
                                            ) : (
                                              <>
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "28"
                                                  ]
                                                }{" "}
                                                {formData?.tech_days}{" "}
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "22"
                                                  ]
                                                }{" "}
                                                before {result?.tech_from}{" "}
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "30"
                                                  ]
                                                }{" "}
                                                {result?.tech_date_e}{" "}
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "31"
                                                  ]
                                                }{" "}
                                                {result?.tech_from_s} and
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-b py-2">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "22"
                                              ]
                                            }
                                          </td>
                                          <td className="border-b py-2">
                                            {formData?.tech_days}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-b py-2">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "23"
                                              ]
                                            }
                                          </td>
                                          <td className="border-b py-2">
                                            {result?.tech_weekends}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-b py-2">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "24"
                                              ]
                                            }{" "}
                                            {result?.tech_holidays != 0 ? (
                                              <span className="view_holi">
                                                (View result)
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td className="border-b py-2">
                                            {result?.tech_holidays}
                                          </td>
                                        </tr>

                                        {formData?.tech_weekend_c == "yes" &&
                                          result?.tech_holidays != 0 && (
                                            <>
                                              <tr>
                                                <td className="border-b py-2 font-bold">
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys["25"]
                                                  }{" "}
                                                  {result?.tech_from}{" "}
                                                  {
                                                    data?.payload
                                                      ?.tech_lang_keys["26"]
                                                  }{" "}
                                                  {result?.tech_date}
                                                </td>
                                              </tr>
                                              {(
                                                result?.tech_get_holi || []
                                              ).map((holiday, i) => (
                                                <tr key={i}>
                                                  <td className="border-b py-2">
                                                    {result?.tech_dis_holi?.[i]}
                                                  </td>
                                                  <td className="border-b py-2">
                                                    {holiday}
                                                  </td>
                                                </tr>
                                              ))}
                                            </>
                                          )}
                                      </>
                                    ) : (
                                      <>
                                        <tr>
                                          <td
                                            width="60%"
                                            className="border-b py-2"
                                          >
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "19"
                                              ]
                                            }
                                          </td>
                                          <td className="border-b py-2">
                                            {result?.tech_from}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            colSpan={2}
                                            className="border-b py-2"
                                          >
                                            {result?.tech_des}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-b py-2">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "27"
                                              ]
                                            }
                                          </td>
                                          <td className="border-b py-2">
                                            {result?.tech_date}
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

export default BusinessDaysCalculator;
