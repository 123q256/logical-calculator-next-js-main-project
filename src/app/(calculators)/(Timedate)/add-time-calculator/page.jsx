"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAddtimeCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AddTimeCalculator = () => {
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

  // console.log(data);

  const [formData, setFormData] = useState({
    tech_inhour: [0], // Default value is 0 for the first input
    tech_inminutes: [0], // Default value is 0 for the first input
    tech_inseconds: [0], // Default value is 0 for the first input
    tech_inmiliseconds: [0], // Default value is 0 for the first input
    tech_checkbox1: "1",
    tech_checkbox2: "1",
    tech_checkbox3: "1",
    tech_checkbox4: "1",
    tech_count_val: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useAddtimeCalculationMutation();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const fieldName = name.replace("[]", ""); // Remove '[]' from the field name

    setFormData((prevFormData) => {
      // Update the array for the specific field
      const updatedField = [...(prevFormData[fieldName] || [])];

      // Set value or default to 0 if empty
      updatedField[index] = value === "" ? 0 : value; // Default to 0 if value is empty

      return {
        ...prevFormData,
        [fieldName]: updatedField,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_inhour ||
      !formData.tech_inminutes ||
      !formData.tech_inseconds ||
      !formData.tech_inmiliseconds
    ) {
      setFormError("Please fill in Field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_inhour: formData.tech_inhour,
        tech_inminutes: formData.tech_inminutes,
        tech_inseconds: formData.tech_inseconds,
        tech_inmiliseconds: formData.tech_inmiliseconds,
        tech_checkbox1: formData.tech_checkbox1,
        tech_checkbox2: formData.tech_checkbox2,
        tech_checkbox3: formData.tech_checkbox3,
        tech_checkbox4: formData.tech_checkbox4,
        tech_count_val: formData.tech_count_val,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      if (err.data.error) {
        setFormError("Please fill in Field.");
        toast.error("Please fill in Field.");
      }
      // setFormError(err.data.error);
      // toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_inhour: [0], // Default value is 0 for the first input
      tech_inminutes: [0], // Default value is 0 for the first input
      tech_inseconds: [0], // Default value is 0 for the first input
      tech_inmiliseconds: [0], // Default value is 0 for the first input
      tech_checkbox1: "1",
      tech_checkbox2: "1",
      tech_checkbox3: "1",
      tech_checkbox4: "1",
      tech_count_val: "1",
    });
    setResult(null);
    setFormError(null);
  };

  const [isHoursChecked, setIsHoursChecked] = useState(true);
  const [isMinutesChecked, setIsMinutesChecked] = useState(true);
  const [isSecondsChecked, setIsSecondsChecked] = useState(true);
  const [isMilliChecked, setIsMilliChecked] = useState(true);

  // State for rows
  const [rows, setRows] = useState([{}]); // Initially one row

  // Handle checkbox changes
  const handleCheckboxChange = (type) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev };

      if (type === "hours") {
        updatedFormData.tech_checkbox1 = prev.tech_checkbox1 === "1" ? "" : "1";
        setIsHoursChecked(updatedFormData.tech_checkbox1 === "1");
      }
      if (type === "minutes") {
        updatedFormData.tech_checkbox2 = prev.tech_checkbox2 === "1" ? "" : "1";
        setIsMinutesChecked(updatedFormData.tech_checkbox2 === "1");
      }
      if (type === "seconds") {
        updatedFormData.tech_checkbox3 = prev.tech_checkbox3 === "1" ? "" : "1";
        setIsSecondsChecked(updatedFormData.tech_checkbox3 === "1");
      }
      if (type === "milli") {
        updatedFormData.tech_checkbox4 = prev.tech_checkbox4 === "1" ? "" : "1";
        setIsMilliChecked(updatedFormData.tech_checkbox4 === "1");
      }

      return updatedFormData;
    });
  };

  // Jab bhi rows change hon, tech_count_val update karo
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      tech_count_val: rows.length,
    }));
  }, [rows]);

  // Add a new row
  const addRow = () => {
    setRows([...rows, {}]);
  };

  // Remove a row
  const removeRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
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

          <div className="lg:w-[90%] md:w-[90%] w-full mx-auto ">
            <input
              type="hidden"
              name="tech_count_val"
              id="tech_count_val"
              className="input my-2"
              aria-label="input"
              value={formData.tech_count_val}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 gap-4">
              <div className="w-full overflow-auto mera_table">
                <table
                  className="w-full time_table table-auto border-collapse"
                  cellSpacing="0"
                >
                  <thead>
                    <tr>
                      <td></td>
                      <td>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="tech_checkbox1"
                            id="hours_check"
                            checked={formData.tech_checkbox1 === "1"}
                            onChange={() => handleCheckboxChange("hours")}
                            className="input filled-in cursor-pointer"
                          />
                          <span className="text-black">
                            {data?.payload?.tech_lang_keys[1]}
                          </span>
                        </label>
                      </td>
                      <td></td>
                      <td>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="tech_checkbox2"
                            id="min_check"
                            checked={formData.tech_checkbox2 === "1"}
                            onChange={() => handleCheckboxChange("minutes")}
                            className="input filled-in cursor-pointer"
                          />
                          <span className="text-black">
                            {data?.payload?.tech_lang_keys[2]}
                          </span>
                        </label>
                      </td>
                      <td></td>
                      <td>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="tech_checkbox3"
                            id="sec_check"
                            checked={formData.tech_checkbox3 === "1"}
                            onChange={() => handleCheckboxChange("seconds")}
                            className="input filled-in cursor-pointer"
                          />
                          <span className="text-black">
                            {data?.payload?.tech_lang_keys[3]}
                          </span>
                        </label>
                      </td>
                      <td></td>
                      <td>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="tech_checkbox4"
                            id="milli_check"
                            checked={formData.tech_checkbox4 === "1"}
                            onChange={() => handleCheckboxChange("milli")}
                            className="input filled-in cursor-pointer"
                          />
                          <span className="text-black">
                            {data?.payload?.tech_lang_keys[4]}
                          </span>
                        </label>
                      </td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((_, index) => (
                      <tr
                        key={index}
                        className={index === 0 ? "f_time" : "s_time"}
                      >
                        <td>
                          {index === 0 ? (
                            <p></p>
                          ) : (
                            <p className="plus text-blue">+</p>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            min={index === 0 ? "0" : "1"}
                            name="tech_inhour[]"
                            placeholder="hours"
                            className="input hours"
                            value={formData.tech_inhour[index] || ""}
                            onChange={(e) => handleChange(e, index)}
                            disabled={!isHoursChecked}
                          />
                        </td>
                        <td>
                          <p>:</p>
                        </td>
                        <td className="minutes">
                          <input
                            type="number"
                            min={index === 0 ? "0" : "1"}
                            name="tech_inminutes[]"
                            placeholder="minutes"
                            className="input minutes"
                            value={formData.tech_inminutes[index] || ""}
                            onChange={(e) => handleChange(e, index)}
                            disabled={!isMinutesChecked}
                          />
                        </td>
                        <td>
                          <p>:</p>
                        </td>
                        <td className="seconds">
                          <input
                            type="number"
                            min={index === 0 ? "0" : "1"}
                            name="tech_inseconds[]"
                            placeholder="seconds"
                            className="input seconds"
                            value={formData.tech_inseconds[index] || ""}
                            onChange={(e) => handleChange(e, index)}
                            disabled={!isSecondsChecked}
                          />
                        </td>
                        <td>
                          <p>:</p>
                        </td>
                        <td className="milliseconds">
                          <input
                            type="number"
                            min={index === 0 ? "0" : "1"}
                            name="tech_inmiliseconds[]"
                            placeholder="milliseconds"
                            className="input milliseconds"
                            value={formData.tech_inmiliseconds[index] || ""}
                            onChange={(e) => handleChange(e, index)}
                            disabled={!isMilliChecked}
                          />
                        </td>
                        <td className="del_btn">
                          {index !== 0 && (
                            <img
                              src="/belete_btn.png"
                              width="52"
                              height="52"
                              className="p_5 remove pl-2 cursor-pointer"
                              alt="Delete"
                              onClick={() => removeRow(index)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="w-full add ">
                  <button
                    type="button"
                    title="Add New Time"
                    onClick={addRow}
                    className="add_btn units_active  font-semibold bg-[#2845F5] text-white rounded-[30px] focus:outline-none px-4 py-2 my-5 cursor-pointer"
                  >
                    <div className="flex items-center justify-center">
                      <strong className=" font-semibold text-lg pe-2">+</strong>
                      <strong className="">
                        {data?.payload?.tech_lang_keys[5]}
                      </strong>
                    </div>
                  </button>
                </div>
              </div>
              <div>
                <table></table>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDeadlineLoading}>
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
        {calculateDeadlineLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue result p-3 radius-10 mt-3">
                      <div className="row">
                        <div className="w-full overflow-auto">
                          <table className="w-full" cellspacing="0">
                            <tbody>
                              <>
                                {result?.tech_hour_list?.map((value, key) => {
                                  const isLastRow =
                                    key === result?.tech_hour_list.length - 1;
                                  return (
                                    <tr key={key}>
                                      <td className="border-b p-2">
                                        <p className="text-center mx-2">
                                          <strong className="mx-2 text-[20px]">
                                            {isLastRow && "+"}
                                            {value}
                                          </strong>
                                          <span className="text-[16px]">
                                            {data?.payload?.tech_lang_keys[1]}
                                          </span>
                                        </p>
                                      </td>
                                      <td className="border-b p-2">
                                        <p className="text-center mx-2">
                                          <strong className="mx-2 text-[20px]">
                                            {result?.tech_min_list[key]}
                                          </strong>
                                          {data?.payload?.tech_lang_keys[2]}
                                        </p>
                                      </td>
                                      <td className="border-b p-2">
                                        <p className="text-center mx-2">
                                          <strong className="mx-2 text-[20px]">
                                            {result?.tech_sec_list[key]}
                                          </strong>
                                          {data?.payload?.tech_lang_keys[3]}
                                        </p>
                                      </td>
                                      <td className="border-b p-2">
                                        <p className="text-center mx-2">
                                          <strong className="mx-2 text-[20px]">
                                            {result?.tech_mili_list[key]}
                                          </strong>
                                          {data?.payload?.tech_lang_keys[4]}
                                        </p>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </>
                              <tr>
                                <td className="p-2">
                                  <p className="text-center">
                                    <strong className="text-green-800 mx-2 text-[25px]">
                                      {Math.round(result?.tech_time_hour)}
                                    </strong>
                                    {data?.payload?.tech_lang_keys[1]}
                                  </p>
                                </td>
                                <td className="p-2">
                                  <p className="text-center">
                                    <strong className="text-green-800 mx-2 text-[25px]">
                                      {Math.round(result?.tech_time_minutes)}
                                    </strong>
                                    {data?.payload?.tech_lang_keys[2]}
                                  </p>
                                </td>
                                <td className="p-2">
                                  <p className="text-center">
                                    <strong className="text-green-800 mx-2 text-[25px]">
                                      {Math.round(result?.tech_time_seconds)}
                                    </strong>
                                    {data?.payload?.tech_lang_keys[3]}
                                  </p>
                                </td>
                                <td className="p-2">
                                  <p className="text-center">
                                    <strong className="text-green-800 mx-2 text-[25px]">
                                      {Math.round(
                                        result?.tech_time_miliseconds
                                      )}
                                    </strong>
                                    {data?.payload?.tech_lang_keys[4]}
                                  </p>
                                </td>
                              </tr>
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

export default AddTimeCalculator;
