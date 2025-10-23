"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVelocityCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VelocityCalculator = () => {
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
    tech_velo_value: "1", //  1 2 3
    tech_dem: "t",
    tech_x: "1",
    tech_dis_unit: "m",
    tech_vel: "3",
    tech_val_units: "m/s",
    tech_y: "1",
    tech_time_unit: "sec",
    tech_z: [6, 5],
    tech_val_unit: ["m/s", "m/s"],
    tech_aty: [2, 2],
    tech_ytime_unit: ["sec", "sec"],
    tech_collection: "1",
    tech_x1: "4",
    tech_iv_unit: "m/s",
    tech_z1: "1",
    tech_fv_unit: "m/s",
    tech_y1: "4",
    tech_atime_unit: "sec",
    tech_acc: "5",
    tech_acc_unit: "m/s²",
    tech_circle_unit_result: "m/s",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVelocityCalculatorMutation();

  const [filledCount, setFilledCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Count how many fields are non-empty
      const filledCount = ["tech_x", "tech_y", "tech_z"].filter(
        (key) => updatedData[key] !== "" && updatedData[key] !== null
      ).length;

      // Update filled fields count (you can store it in state if needed)
      setFilledCount(filledCount); // <- you'll need to create a filledCount state

      return updatedData;
    });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_velo_value) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_velo_value: formData.tech_velo_value,
        tech_dem: formData.tech_dem,
        tech_x: formData.tech_x,
        tech_dis_unit: formData.tech_dis_unit,
        tech_vel: formData.tech_vel,
        tech_val_units: formData.tech_val_units,
        tech_y: formData.tech_y,
        tech_time_unit: formData.tech_time_unit,
        tech_z: formData.tech_z,
        tech_val_unit: formData.tech_val_unit,
        tech_aty: formData.tech_aty,
        tech_ytime_unit: formData.tech_ytime_unit,
        tech_collection: formData.tech_collection,
        tech_x1: formData.tech_x1,
        tech_iv_unit: formData.tech_iv_unit,
        tech_z1: formData.tech_z1,
        tech_fv_unit: formData.tech_fv_unit,
        tech_y1: formData.tech_y1,
        tech_atime_unit: formData.tech_atime_unit,
        tech_acc: formData.tech_acc,
        tech_acc_unit: formData.tech_acc_unit,
        tech_circle_unit_result: formData.tech_circle_unit_result,
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
      tech_velo_value: "1", //  1 2 3
      tech_dem: "t",
      tech_x: "1",
      tech_dis_unit: "m",
      tech_vel: "3",
      tech_val_units: "m/s",
      tech_y: "1",
      tech_time_unit: "sec",
      tech_z: [6, 5],
      tech_val_unit: ["m/s", "m/s"],
      tech_aty: [2, 2],
      tech_ytime_unit: ["sec", "sec"],
      tech_collection: "1",
      tech_x1: "4",
      tech_iv_unit: "m/s",
      tech_z1: "1",
      tech_fv_unit: "m/s",
      tech_y1: "4",
      tech_atime_unit: "sec",
      tech_acc: "5",
      tech_acc_unit: "m/s²",
      tech_circle_unit_result: "m/s",
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

  // dropdown states
  const [dropdownVisible00, setDropdownVisible00] = useState(false);

  const setUnitHandler00 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit: unit }));
    setDropdownVisible00(false);
  };

  const toggleDropdown00 = () => {
    setDropdownVisible00(!dropdownVisible00);
  };

  // dropdown states
  const [dropdownVisible01, setDropdownVisible01] = useState(false);

  const setUnitHandler01 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_val_units: unit }));
    setDropdownVisible01(false);
  };

  const toggleDropdown01 = () => {
    setDropdownVisible01(!dropdownVisible01);
  };

  // dropdown states
  const [dropdownVisible02, setDropdownVisible02] = useState(false);

  const setUnitHandler02 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_time_unit: unit }));
    setDropdownVisible02(false);
  };

  const toggleDropdown02 = () => {
    setDropdownVisible02(!dropdownVisible02);
  };

  // dropdown states
  const [dropdownVisible03, setDropdownVisible03] = useState(false);

  const setUnitHandler03 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_iv_unit: unit }));
    setDropdownVisible03(false);
  };

  const toggleDropdown03 = () => {
    setDropdownVisible03(!dropdownVisible03);
  };

  // dropdown states
  const [dropdownVisible04, setDropdownVisible04] = useState(false);

  const setUnitHandler04 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fv_unit: unit }));
    setDropdownVisible04(false);
  };

  const toggleDropdown04 = () => {
    setDropdownVisible04(!dropdownVisible04);
  };

  // dropdown states
  const [dropdownVisible05, setDropdownVisible05] = useState(false);

  const setUnitHandler05 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_atime_unit: unit }));
    setDropdownVisible05(false);
  };

  const toggleDropdown05 = () => {
    setDropdownVisible05(!dropdownVisible05);
  };
  // dropdown states
  const [dropdownVisible06, setDropdownVisible06] = useState(false);

  const setUnitHandler06 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_acc_unit: unit }));
    setDropdownVisible06(false);
  };

  const toggleDropdown06 = () => {
    setDropdownVisible06(!dropdownVisible06);
  };

  // result

  const [selectedUnit, setSelectedUnit] = useState("");
  const [convertedValue, setConvertedValue] = useState(
    parseFloat(result?.tech_ans)
  );
  const [initialValue, setInitialValue] = useState(
    parseFloat(result?.tech_ans)
  );

  const conversionFactors = {
    Distance: {
      m: 1,
      cm: 100,
      in: 39.3701,
      ft: 3.28084,
      yd: 1.09361,
      km: 0.001,
      mi: 0.000621371,
    },
    Velocity: {
      "m/s": 1,
      "km/h": 3.6,
      "ft/s": 3.28084,
      mph: 2.23694,
      kn: 1.94384,
      "ft/m": 196.8504,
      "cm/s": 100,
      "m/min": 60,
    },
    "Avrage Velocity": {
      "m/s": 1,
      "km/h": 3.6,
      "ft/s": 3.28084,
      mph: 2.23694,
      kn: 1.94384,
      "ft/m": 196.8504,
      "cm/s": 100,
      "m/min": 60,
    },
    "Final Velocity": {
      "m/s": 1,
      "km/h": 3.6,
      "ft/s": 3.28084,
      mph: 2.23694,
      kn: 1.94384,
      "ft/m": 196.8504,
      "cm/s": 100,
      "m/min": 60,
    },
    "Initial Velocity": {
      "m/s": 1,
      "km/h": 3.6,
      "ft/s": 3.28084,
      mph: 2.23694,
      kn: 1.94384,
      "ft/m": 196.8504,
      "cm/s": 100,
      "m/min": 60,
    },
    Time: {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
      w: 604800,
      mo: 2.628e6,
      y: 3.154e7,
    },
    Acceleration: {
      "m/s²": 1,
      "cm/s²": 100,
      "in/s²": 39.3701,
      "ft/s²": 3.28084,
      "km/s²": 0.001,
      "mi/s²": 0.000621371,
      g: 0.10197162129779,
    },
  };

  const getOptions = () => {
    const type = result?.tech_ans_t;
    const units = conversionFactors[type];
    if (!units) return null;

    return Object.keys(units).map((unit) => (
      <option key={unit} value={unit}>
        {unit}
      </option>
    ));
  };

  const handleChangex = (e) => {
    const unit = e.target.value;
    setSelectedUnit(unit);

    const unitType = result?.tech_ans_t;
    const factor = conversionFactors[unitType]?.[unit];

    if (factor !== undefined) {
      const newVal =
        unitType === "Time" ? initialValue / factor : initialValue * factor;
      setConvertedValue(Number(newVal.toFixed(10)));
    }
  };

  useEffect(() => {
    setInitialValue(parseFloat(result?.tech_ans));
    setConvertedValue(parseFloat(result?.tech_ans));
  }, [result]);

  // add to moew

  const [dropdownVisible, setDropdownVisible] = useState({
    speed: {},
    time: {},
  });

  const toggleDropdown = (index, type) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [index]: !prev[type]?.[index],
      },
    }));
  };

  const setUnitHandler = (index, unit, stateKey, type) => {
    const updated = [...formData[stateKey]];
    updated[index] = unit;
    setFormData({ ...formData, [stateKey]: updated });

    setDropdownVisible((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [index]: false,
      },
    }));
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      tech_z: [...prev.tech_z, 0],
      tech_val_unit: [...prev.tech_val_unit, "m/s"],
      tech_aty: [...prev.tech_aty, 0],
      tech_ytime_unit: [...prev.tech_ytime_unit, "sec"],
    }));

    setDropdownVisible((prev) => {
      const newIndex = Object.keys(prev.speed).length;
      return {
        speed: { ...prev.speed, [newIndex]: false },
        time: { ...prev.time, [newIndex]: false },
      };
    });
  };

  const removeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      tech_z: prev.tech_z.filter((_, i) => i !== index),
      tech_val_unit: prev.tech_val_unit.filter((_, i) => i !== index),
      tech_aty: prev.tech_aty.filter((_, i) => i !== index),
      tech_ytime_unit: prev.tech_ytime_unit.filter((_, i) => i !== index),
    }));

    setDropdownVisible((prev) => {
      const newSpeed = { ...prev.speed };
      const newTime = { ...prev.time };
      delete newSpeed[index];
      delete newTime[index];

      // Re-index the remaining keys
      const reindexedSpeed = {};
      const reindexedTime = {};
      Object.keys(newSpeed)
        .sort((a, b) => a - b)
        .forEach((key, i) => (reindexedSpeed[i] = newSpeed[key]));
      Object.keys(newTime)
        .sort((a, b) => a - b)
        .forEach((key, i) => (reindexedTime[i] = newTime[key]));

      return {
        speed: reindexedSpeed,
        time: reindexedTime,
      };
    });
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

          <div className=" w-full mx-auto ">
            <div className="grid grid-cols-12 gap-2">
              <div className="md:col-span-1 md:flex hidden"></div>
              <div className="col-span-12 md:col-span-10  mx-auto mt-2  w-full">
                <input
                  type="hidden"
                  name="tech_velo_value"
                  id="calculator_time"
                  value={formData.tech_velo_value}
                />
                <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                  {/* Date Cal Tab */}
                  <div className="lg:w-1/3 w-full px-2 py-1">
                    <div
                      className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                        formData.tech_velo_value === "1" ? "tagsUnit" : ""
                      }`}
                      id="1"
                      onClick={() => {
                        setFormData({ ...formData, tech_velo_value: "1" });
                        setResult(null);
                        setFormError(null);
                      }}
                    >
                      {data?.payload?.tech_lang_keys["d_c"]}
                    </div>
                  </div>
                  {/* Time Cal Tab */}
                  <div className="lg:w-1/3 w-full px-2 py-1">
                    <div
                      className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                        formData.tech_velo_value === "2" ? "tagsUnit" : ""
                      }`}
                      id="2"
                      onClick={() => {
                        setFormData({ ...formData, tech_velo_value: "2" });
                        setResult(null);
                        setFormError(null);
                      }}
                    >
                      {data?.payload?.tech_lang_keys["a"]}
                    </div>
                  </div>
                  <div className="lg:w-1/3 w-full px-2 py-1">
                    <div
                      className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                        formData.tech_velo_value === "3" ? "tagsUnit" : ""
                      }`}
                      id="3"
                      onClick={() => {
                        setFormData({ ...formData, tech_velo_value: "3" });
                        setResult(null);
                        setFormError(null);
                      }}
                    >
                      {data?.payload?.tech_lang_keys["av"]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            {formData.tech_velo_value == "1" && (
              <>
                <div className="grid grid-cols-12 lg:gap-4 gap-2 distance_co mt-3">
                  <div className="col-span-12">
                    <label htmlFor="tech_dem" className="label">
                      {data?.payload?.tech_lang_keys["to_calc"] ??
                        "To calculate"}
                      :
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_dem"
                        id="tech_dem"
                        value={formData.tech_dem}
                        onChange={handleChange}
                      >
                        <option value="dc">
                          {data?.payload?.tech_lang_keys["d"]}
                        </option>
                        <option value="av">
                          {data?.payload?.tech_lang_keys["v"]}
                        </option>
                        <option value="t">
                          {data?.payload?.tech_lang_keys["t"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  {(formData.tech_dem == "av" || formData.tech_dem == "t") && (
                    <>
                      <div className="col-span-6 px-2" id="distance">
                        <label htmlFor="tech_x" className="label">
                          {data?.payload?.tech_lang_keys["d"]}
                        </label>
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
                            onClick={toggleDropdown00}
                          >
                            {formData.tech_dis_unit} ▾
                          </label>
                          {dropdownVisible00 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                                { label: "m", value: "m" },
                                { label: "cm", value: "cm" },
                                { label: "km", value: "km" },
                                { label: "mi", value: "mi" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler00(unit.value)}
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
                  {(formData.tech_dem == "dc" || formData.tech_dem == "t") && (
                    <>
                      <div className="col-span-6 px-2 " id="velocity">
                        <label htmlFor="tech_vel" className="label">
                          {data?.payload?.tech_lang_keys["v"]}
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
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown01}
                          >
                            {formData.tech_val_units} ▾
                          </label>
                          {dropdownVisible01 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "m/s", value: "m/s" },
                                { label: "km/h", value: "km/h" },
                                { label: "ft/s", value: "ft/s" },
                                { label: "mph", value: "mph" },
                                { label: "kn", value: "kn" },
                                { label: "ft/m", value: "ft/m" },
                                { label: "cm/s", value: "cm/s" },
                                { label: "m/min", value: "m/min" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler01(unit.value)}
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
                  {(formData.tech_dem == "dc" || formData.tech_dem == "av") && (
                    <>
                      <div className="col-span-6 px-2" id="times">
                        <label htmlFor="tech_y" className="label">
                          {data?.payload?.tech_lang_keys["t"]}
                        </label>
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
                            onClick={toggleDropdown02}
                          >
                            {formData.tech_time_unit} ▾
                          </label>
                          {dropdownVisible02 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "sec", value: "sec" },
                                { label: "min", value: "min" },
                                { label: "hrs", value: "hrs" },
                                { label: "days", value: "days" },
                                { label: "wks", value: "wks" },
                                { label: "mos", value: "mos" },
                                { label: "yrs", value: "yrs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler02(unit.value)}
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
              </>
            )}
            {formData.tech_velo_value == "2" && (
              <>
                <div className="acceleration  mt-3">
                  <div className="col-span-6 px-lg-2">
                    <label htmlFor="tech_collection" className="label">
                      {data?.payload?.tech_lang_keys["to_calc"] ??
                        "To calculate"}
                      :
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_collection"
                        id="tech_collection"
                        value={formData.tech_collection}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["i_v"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["f_v"]}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["a"]}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["t"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2 mt-4">
                    {(formData.tech_collection == "2" ||
                      formData.tech_collection == "3" ||
                      formData.tech_collection == "4") && (
                      <>
                        <div className="col-span-6 px-lg-2" id="intial">
                          <label htmlFor="tech_x1" className="label">
                            {data?.payload?.tech_lang_keys["i_v"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_x1"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_x1}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown03}
                            >
                              {formData.tech_iv_unit} ▾
                            </label>
                            {dropdownVisible03 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "m/s", value: "m/s" },
                                  { label: "km/h", value: "km/h" },
                                  { label: "ft/s", value: "ft/s" },
                                  { label: "mph", value: "mph" },
                                  { label: "kn", value: "kn" },
                                  { label: "ft/m", value: "ft/m" },
                                  { label: "cm/s", value: "cm/s" },
                                  { label: "m/min", value: "m/min" },
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler03(unit.value)}
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
                    {(formData.tech_collection == "1" ||
                      formData.tech_collection == "3" ||
                      formData.tech_collection == "4") && (
                      <>
                        <div className="col-span-6 px-lg-2 " id="final">
                          <label htmlFor="tech_z1" className="label">
                            {data?.payload?.tech_lang_keys["f_v"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_z1"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_z1}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown04}
                            >
                              {formData.tech_fv_unit} ▾
                            </label>
                            {dropdownVisible04 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "m/s", value: "m/s" },
                                  { label: "km/h", value: "km/h" },
                                  { label: "ft/s", value: "ft/s" },
                                  { label: "mph", value: "mph" },
                                  { label: "kn", value: "kn" },
                                  { label: "ft/m", value: "ft/m" },
                                  { label: "cm/s", value: "cm/s" },
                                  { label: "m/min", value: "m/min" },
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler04(unit.value)}
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
                    {(formData.tech_collection == "1" ||
                      formData.tech_collection == "2" ||
                      formData.tech_collection == "3") && (
                      <>
                        <div className="col-span-6 px-lg-2" id="time">
                          <label htmlFor="tech_y1" className="label">
                            {data?.payload?.tech_lang_keys["t"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_y1"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_y1}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown05}
                            >
                              {formData.tech_atime_unit} ▾
                            </label>
                            {dropdownVisible05 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "sec", value: "sec" },
                                  { label: "min", value: "min" },
                                  { label: "hrs", value: "hrs" },
                                  { label: "days", value: "days" },
                                  { label: "wks", value: "wks" },
                                  { label: "mos", value: "mos" },
                                  { label: "yrs", value: "yrs" },
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler05(unit.value)}
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
                    {(formData.tech_collection == "1" ||
                      formData.tech_collection == "2" ||
                      formData.tech_collection == "4") && (
                      <>
                        <div className="col-span-6 px-lg-2" id="accele">
                          <label htmlFor="tech_acc" className="label">
                            {data?.payload?.tech_lang_keys["a"]}
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_acc"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_acc}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown06}
                            >
                              {formData.tech_acc_unit} ▾
                            </label>
                            {dropdownVisible06 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "in/s²", value: "in/s²" },
                                  { label: "ft/s²", value: "ft/s²" },
                                  { label: "cm/s²", value: "cm/s²" },
                                  { label: "m/s²", value: "m/s²" },
                                  { label: "mi/s²", value: "mi/s²" },
                                  { label: "km/s²", value: "km/s²" },
                                  { label: "g", value: "g" },
                                ].map((unit, index) => (
                                  <p
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setUnitHandler06(unit.value)}
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
              </>
            )}

            {formData.tech_velo_value == "3" && (
              <>
                {formData.tech_z.map((_, index) => (
                  <div key={index} className="row grid grid-cols-12 gap-2 mb-4">
                    {/* Tech Z */}
                    <div className="col-span-6 px-2">
                      <label className="label">Speed {index + 1}</label>
                      <div className="relative w-full">
                        <input
                          type="number"
                          name={`tech_z[${index}]`}
                          step="any"
                          className="input mt-1"
                          value={formData.tech_z[index]}
                          onChange={(e) => {
                            const updated = [...formData.tech_z];
                            updated[index] = e.target.value;
                            setFormData({ ...formData, tech_z: updated });
                          }}
                        />
                        <label
                          className="absolute right-6 top-4 cursor-pointer text-sm underline"
                          onClick={() => toggleDropdown(index, "speed")}
                        >
                          {formData.tech_val_unit[index]} ▾
                        </label>

                        {dropdownVisible.speed?.[index] && (
                          <div className="absolute z-10 bg-white border mt-1 right-0 rounded-md shadow">
                            {[
                              "m/s",
                              "km/h",
                              "ft/s",
                              "mph",
                              "kn",
                              "ft/m",
                              "cm/s",
                              "m/min",
                            ].map((unit) => (
                              <p
                                key={unit}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  setUnitHandler(
                                    index,
                                    unit,
                                    "tech_val_unit",
                                    "speed"
                                  )
                                }
                              >
                                {unit}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tech ATY */}
                    <div className="col-span-6 px-2">
                      <div className="flex justify-between">
                        <label className="label">Time {index + 1}</label>
                        {formData.tech_z.length > 1 && (
                          <div className="col-span-12 px-2 text-right">
                            <img
                              src="/images/delete_btn.png"
                              className="w-4 h-4"
                              onClick={() => removeRow(index)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="relative w-full">
                        <input
                          type="number"
                          name={`tech_aty[${index}]`}
                          step="any"
                          className="input mt-1"
                          value={formData.tech_aty[index]}
                          onChange={(e) => {
                            const updated = [...formData.tech_aty];
                            updated[index] = e.target.value;
                            setFormData({ ...formData, tech_aty: updated });
                          }}
                        />
                        <label
                          className="absolute right-6 top-4 cursor-pointer text-sm underline"
                          onClick={() => toggleDropdown(index, "time")}
                        >
                          {formData.tech_ytime_unit[index]} ▾
                        </label>

                        {dropdownVisible.time?.[index] && (
                          <div className="absolute z-10 bg-white border mt-1 right-0 rounded-md shadow">
                            {[
                              "sec",
                              "min",
                              "hrs",
                              "days",
                              "wks",
                              "mos",
                              "yrs",
                            ].map((unit) => (
                              <p
                                key={unit}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  setUnitHandler(
                                    index,
                                    unit,
                                    "tech_ytime_unit",
                                    "time"
                                  )
                                }
                              >
                                {unit}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Row Button */}
                <div className="col-span-12 px-2">
                  <button
                    type="button"
                    onClick={addRow}
                    className="bg-black hover:bg-[#2845F5] border-none text-white px-4 py-2 rounded-lg"
                  >
                    + Add Row
                  </button>
                </div>
              </>
            )}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator  space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className="text-center">
                        <p className="text-[18px] font-bold">
                          {result?.tech_ans_t}
                        </p>

                        <div className="inline-flex items-center bg-white rounded-lg my-3 px-3 py-2 space-x-3 justify-center">
                          <strong className="text-white bordered bg-[#2845F5] px-3 py-1 rounded-lg lg:text-[25px] md:text-[20px] text-[18px]">
                            {!isNaN(convertedValue) ? convertedValue : "0"}
                          </strong>
                          <select
                            className="input  text-[16px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            name="tech_circle_unit_result"
                            id="tech_circle_unit_result"
                            style={{ width: "80px" }}
                            onChange={handleChangex}
                          >
                            {getOptions()}
                          </select>
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

export default VelocityCalculator;
