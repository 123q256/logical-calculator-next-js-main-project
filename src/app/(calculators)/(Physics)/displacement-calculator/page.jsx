"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDisplacementCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DisplacementCalculator = () => {
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
    tech_known: "1", //  1 2 3 4
    tech_sldsp: "m",
    tech_av: "10",
    tech_slav: "m/s",
    tech_tm: "10",
    tech_sltm: "sec",
    tech_iv: "10",
    tech_sliv: "sec",
    tech_fv: "10",
    tech_slfv: "sec",
    tech_acc: "10",
    tech_slacc: "sec",
    tech_vloc_0: "10",
    tech_slvloc_0: "m/s",
    tech_timi_0: "10",
    tech_sltimi_0: "sec",
    tech_vloc_1: "10",
    tech_slvloc_1: "m/s",
    tech_timi_1: "10",
    tech_sltimi_1: "sec",
    tech_vloc_2: "10",
    tech_slvloc_2: "m/s",
    tech_timi_2: "10",
    tech_sltimi_2: "sec",
    tech_vloc_3: "10",
    tech_slvloc_3: "m/s",
    tech_timi_3: "10",
    tech_sltimi_3: "sec",
    tech_vloc_4: "10",
    tech_slvloc_4: "m/s",
    tech_timi_4: "10",
    tech_sltimi_4: "sec",
    tech_vloc_5: "10",
    tech_slvloc_5: "m/s",
    tech_timi_5: "10",
    tech_sltimi_5: "sec",
    tech_vloc_6: "10",
    tech_slvloc_6: "m/s",
    tech_timi_6: "10",
    tech_sltimi_6: "sec",
    tech_vloc_7: "10",
    tech_slvloc_7: "m/s",
    tech_timi_7: "10",
    tech_sltimi_7: "sec",
    tech_vloc_8: "10",
    tech_slvloc_8: "m/s",
    tech_timi_8: "10",
    tech_sltimi_8: "sec",
    tech_vloc_9: "10",
    tech_slvloc_9: "m/s",
    tech_timi_9: "10",
    tech_sltimi_9: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDisplacementCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_known) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_known: formData.tech_known,
        tech_sldsp: formData.tech_sldsp,
        tech_av: formData.tech_av,
        tech_slav: formData.tech_slav,
        tech_tm: formData.tech_tm,
        tech_sltm: formData.tech_sltm,
        tech_iv: formData.tech_iv,
        tech_sliv: formData.tech_sliv,
        tech_fv: formData.tech_fv,
        tech_slfv: formData.tech_slfv,
        tech_acc: formData.tech_acc,
        tech_slacc: formData.tech_slacc,
        tech_vloc_0: formData.tech_vloc_0,
        tech_slvloc_0: formData.tech_slvloc_0,
        tech_timi_0: formData.tech_timi_0,
        tech_sltimi_0: formData.tech_sltimi_0,
        tech_vloc_1: formData.tech_vloc_1,
        tech_slvloc_1: formData.tech_slvloc_1,
        tech_timi_1: formData.tech_timi_1,
        tech_sltimi_1: formData.tech_sltimi_1,
        tech_vloc_2: formData.tech_vloc_2,
        tech_slvloc_2: formData.tech_slvloc_2,
        tech_timi_2: formData.tech_timi_2,
        tech_sltimi_2: formData.tech_sltimi_2,
        tech_vloc_3: formData.tech_vloc_3,
        tech_slvloc_3: formData.tech_slvloc_3,
        tech_timi_3: formData.tech_timi_3,
        tech_sltimi_3: formData.tech_sltimi_3,
        tech_vloc_4: formData.tech_vloc_4,
        tech_slvloc_4: formData.tech_slvloc_4,
        tech_timi_4: formData.tech_timi_4,
        tech_sltimi_4: formData.tech_sltimi_4,
        tech_vloc_5: formData.tech_vloc_5,
        tech_slvloc_5: formData.tech_slvloc_5,
        tech_timi_5: formData.tech_timi_5,
        tech_sltimi_5: formData.tech_sltimi_5,
        tech_vloc_6: formData.tech_vloc_6,
        tech_slvloc_6: formData.tech_slvloc_6,
        tech_timi_6: formData.tech_timi_6,
        tech_sltimi_6: formData.tech_sltimi_6,
        tech_vloc_7: formData.tech_vloc_7,
        tech_slvloc_7: formData.tech_slvloc_7,
        tech_timi_7: formData.tech_timi_7,
        tech_sltimi_7: formData.tech_sltimi_7,
        tech_vloc_8: formData.tech_vloc_8,
        tech_slvloc_8: formData.tech_slvloc_8,
        tech_timi_8: formData.tech_timi_8,
        tech_sltimi_8: formData.tech_sltimi_8,
        tech_vloc_9: formData.tech_vloc_9,
        tech_slvloc_9: formData.tech_slvloc_9,
        tech_timi_9: formData.tech_timi_9,
        tech_sltimi_9: formData.tech_sltimi_9,
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
      tech_known: "1", //  1 2 3 4
      tech_sldsp: "m",
      tech_av: "10",
      tech_slav: "m/s",
      tech_tm: "10",
      tech_sltm: "sec",
      tech_iv: "10",
      tech_sliv: "sec",
      tech_fv: "10",
      tech_slfv: "sec",
      tech_acc: "10",
      tech_slacc: "sec",
      tech_vloc_0: "10",
      tech_slvloc_0: "m/s",
      tech_timi_0: "10",
      tech_sltimi_0: "sec",
      tech_vloc_1: "10",
      tech_slvloc_1: "m/s",
      tech_timi_1: "10",
      tech_sltimi_1: "sec",
      tech_vloc_2: "10",
      tech_slvloc_2: "m/s",
      tech_timi_2: "10",
      tech_sltimi_2: "sec",
      tech_vloc_3: "10",
      tech_slvloc_3: "m/s",
      tech_timi_3: "10",
      tech_sltimi_3: "sec",
      tech_vloc_4: "10",
      tech_slvloc_4: "m/s",
      tech_timi_4: "10",
      tech_sltimi_4: "sec",
      tech_vloc_5: "10",
      tech_slvloc_5: "m/s",
      tech_timi_5: "10",
      tech_sltimi_5: "sec",
      tech_vloc_6: "10",
      tech_slvloc_6: "m/s",
      tech_timi_6: "10",
      tech_sltimi_6: "sec",
      tech_vloc_7: "10",
      tech_slvloc_7: "m/s",
      tech_timi_7: "10",
      tech_sltimi_7: "sec",
      tech_vloc_8: "10",
      tech_slvloc_8: "m/s",
      tech_timi_8: "10",
      tech_sltimi_8: "sec",
      tech_vloc_9: "10",
      tech_slvloc_9: "m/s",
      tech_timi_9: "10",
      tech_sltimi_9: "sec",
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
  const [dropdownVisible01, setDropdownVisible01] = useState(false);

  const setUnitHandler01 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_slav: unit }));
    setDropdownVisible01(false);
  };

  const toggleDropdown01 = () => {
    setDropdownVisible01(!dropdownVisible01);
  };

  //dropdown states
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sltm: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };

  //dropdown states
  const [dropdownVisible12, setDropdownVisible12] = useState(false);

  const setUnitHandler12 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sliv: unit }));
    setDropdownVisible12(false);
  };

  const toggleDropdown12 = () => {
    setDropdownVisible12(!dropdownVisible12);
  };
  //dropdown states
  const [dropdownVisible13, setDropdownVisible13] = useState(false);

  const setUnitHandler13 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_slfv: unit }));
    setDropdownVisible13(false);
  };

  const toggleDropdown13 = () => {
    setDropdownVisible13(!dropdownVisible13);
  };
  //dropdown states
  const [dropdownVisible14, setDropdownVisible14] = useState(false);

  const setUnitHandler14 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_slacc: unit }));
    setDropdownVisible14(false);
  };

  const toggleDropdown14 = () => {
    setDropdownVisible14(!dropdownVisible14);
  };

  const [dropdownVisible, setDropdownVisible] = useState({});

  const toggleDropdown = (key) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setUnitHandler = (unit, indexKey, typeKey) => {
    setFormData((prev) => ({
      ...prev,
      [typeKey]: unit,
    }));
    setDropdownVisible((prev) => ({
      ...prev,
      [indexKey]: false,
    }));
  };

  const velocityUnits = [
    { label: "m/s", value: "m/s" },
    { label: "ft/s", value: "ft/s" },
    { label: "km/h", value: "km/h" },
    { label: "km/s", value: "km/s" },
    { label: "mi/s", value: "mi/s" },
    { label: "mph", value: "mph" },
  ];

  const timeUnits = [
    { label: "sec", value: "sec" },
    { label: "min", value: "min" },
    { label: "h", value: "h" },
  ];

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

          <div className="w-full lg:w-8/12 justify-center mx-auto mt-3">
            <div className="w-full grid grid-cols-12 gap-2 mt-3">
              <div className="col-span-12">
                <div className="grid grid-cols-12 gap-1">
                  <div className="lg:col-span-10 md:col-span-10 col-span-9">
                    <label htmlFor="tech_known" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_known"
                        id="tech_known"
                        value={formData.tech_known}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="lg:col-span-2 md:col-span-2 col-span-3">
                    <label htmlFor="tech_sldsp" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_sldsp"
                        id="tech_sldsp"
                        value={formData.tech_sldsp}
                        onChange={handleChange}
                      >
                        <option value="m">m</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                        <option value="km">km</option>
                        <option value="mi">mi</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="w-full grid grid-cols-12 gap-2 mt-3 rounded-md ">
                  {formData.tech_known == "1" && (
                    <>
                      <div className="col-span-6" id="disp_blk_av">
                        <label htmlFor="tech_av" className="label">
                          {data?.payload?.tech_lang_keys["6"]}
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
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown01}
                          >
                            {formData.tech_slav} ▾
                          </label>
                          {dropdownVisible01 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "m/s", value: "m/s" },
                                { label: "ft/s", value: "ft/s" },
                                { label: "km/h", value: "km/h" },
                                { label: "km/s", value: "km/s" },
                                { label: "mi/s", value: "mi/s" },
                                { label: "mph", value: "mph" },
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
                  {(formData.tech_known == "1" ||
                    formData.tech_known == "2" ||
                    formData.tech_known == "3") && (
                    <>
                      <div className="col-span-6 " id="disp_blk_tm">
                        <label htmlFor="tech_tm" className="label">
                          {data?.payload?.tech_lang_keys["7"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_tm"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_tm}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown11}
                          >
                            {formData.tech_sltm} ▾
                          </label>
                          {dropdownVisible11 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "sec", value: "sec" },
                                { label: "min", value: "min" },
                                { label: "h", value: "h" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler11(unit.value)}
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
                  {(formData.tech_known == "2" ||
                    formData.tech_known == "3") && (
                    <>
                      <div className=" col-span-6" id="disp_blk_iv">
                        <label htmlFor="tech_iv" className="label">
                          {data?.payload?.tech_lang_keys["8"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_iv"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_iv}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown12}
                          >
                            {formData.tech_sliv} ▾
                          </label>
                          {dropdownVisible12 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "m/s", value: "m/s" },
                                { label: "ft/s", value: "ft/s" },
                                { label: "km/h", value: "km/h" },
                                { label: "km/s", value: "km/s" },
                                { label: "mi/s", value: "mi/s" },
                                { label: "mph", value: "mph" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler12(unit.value)}
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
                  {formData.tech_known == "3" && (
                    <>
                      <div className="col-span-6 " id="disp_blk_fv">
                        <label htmlFor="tech_fv" className="label">
                          {data?.payload?.tech_lang_keys["9"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_fv"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_fv}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown13}
                          >
                            {formData.tech_slfv} ▾
                          </label>
                          {dropdownVisible13 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "m/s", value: "m/s" },
                                { label: "ft/s", value: "ft/s" },
                                { label: "km/h", value: "km/h" },
                                { label: "km/s", value: "km/s" },
                                { label: "mi/s", value: "mi/s" },
                                { label: "mph", value: "mph" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler13(unit.value)}
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
                  {formData.tech_known == "2" && (
                    <>
                      <div className="col-span-6 " id="disp_blk_acc">
                        <label htmlFor="tech_acc" className="label">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
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
                            onClick={toggleDropdown14}
                          >
                            {formData.tech_slacc} ▾
                          </label>
                          {dropdownVisible14 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "m/s²", value: "m/s²" },
                                { label: "ft/s²", value: "ft/s²" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler14(unit.value)}
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

              <div className="col-span-12">
                {formData.tech_known == "4" && (
                  <>
                    <div className="grid grid-cols-12 gap-2" id="disp_blk_10v">
                      {Array.from({ length: 10 }, (_, i) => {
                        const index = i + 0;
                        return (
                          <React.Fragment key={index}>
                            {/* Velocity Input */}
                            <div className="col-span-6">
                              <label
                                htmlFor={`tech_vloc_${index}`}
                                className="label"
                              >
                                v {index}
                              </label>
                              <div className="relative w-full">
                                <input
                                  type="number"
                                  name={`tech_vloc_${index}`}
                                  step="any"
                                  className="mt-1 input border px-2 py-1 w-full"
                                  value={formData[`tech_vloc_${index}`] || ""}
                                  placeholder="00"
                                  onChange={handleChange}
                                />
                                <label
                                  className="absolute cursor-pointer text-sm underline right-6 top-4"
                                  onClick={() => toggleDropdown(`v${index}`)}
                                >
                                  {formData[`tech_slvloc_${index}`] || "unit"} ▾
                                </label>
                                {dropdownVisible[`v${index}`] && (
                                  <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                    {velocityUnits.map((unit, uIndex) => (
                                      <p
                                        key={uIndex}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                          setUnitHandler(
                                            unit.value,
                                            `v${index}`,
                                            `tech_slvloc_${index}`
                                          )
                                        }
                                      >
                                        {unit.label}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Time Input */}
                            <div className="col-span-6">
                              <label
                                htmlFor={`tech_timi_${index}`}
                                className="label"
                              >
                                t {index}
                              </label>
                              <div className="relative w-full">
                                <input
                                  type="number"
                                  name={`tech_timi_${index}`}
                                  step="any"
                                  className="mt-1 input border px-2 py-1 w-full"
                                  value={formData[`tech_timi_${index}`] || ""}
                                  placeholder="00"
                                  onChange={handleChange}
                                />
                                <label
                                  className="absolute cursor-pointer text-sm underline right-6 top-4"
                                  onClick={() => toggleDropdown(`t${index}`)}
                                >
                                  {formData[`tech_sltimi_${index}`] || "unit"} ▾
                                </label>
                                {dropdownVisible[`t${index}`] && (
                                  <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                    {timeUnits.map((unit, uIndex) => (
                                      <p
                                        key={uIndex}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                          setUnitHandler(
                                            unit.value,
                                            `t${index}`,
                                            `tech_sltimi_${index}`
                                          )
                                        }
                                      >
                                        {unit.label}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
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
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full  rounded-lg mt-4">
                      <div className="w-full text-[18px] mt-4">
                        {formData?.tech_known != null &&
                          formData?.tech_known != "" && (
                            <div className="w-full md:w-[80%] lg:w-[60%]  mt-2">
                              <table className="w-full text-lg border-separate ">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b  font-semibold">
                                      {data?.payload?.tech_lang_keys[11]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_dsp}{" "}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        {formData?.tech_known == "1" && (
                          <p className="mt-2">
                            <img
                              src="/images/displacement-formula-3.webp"
                              className="w-full h-24 object-contain"
                              alt="Displacement Calculator Formula 3"
                            />
                          </p>
                        )}
                        {formData?.tech_known == "2" && (
                          <p className="mt-2">
                            <img
                              src="/images/displacement-formula-2.webp"
                              className="w-full h-24 object-contain"
                              alt="Displacement Calculator Formula 2"
                            />
                          </p>
                        )}
                        {formData?.tech_known == "3" && (
                          <p className="mt-2">
                            <img
                              src="/images/displacement-formula-1.webp"
                              className="w-full h-24 object-contain"
                              alt="Displacement Calculator Formula 1"
                            />
                          </p>
                        )}
                        {formData?.tech_known == "4" && (
                          <>
                            <div className="lg:w-1/2 mt-2">
                              <p className="mt-2 font-semibold text-[18px]">
                                {data?.payload?.tech_lang_keys["13"]}
                              </p>
                              <table className="w-full text-[18px] border-separate ">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b font-semibold">
                                      {result?.tech_dspft} ft
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b font-semibold">
                                      {result?.tech_dspkm} km
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b font-semibold">
                                      {result?.tech_dspmi} miles
                                    </td>
                                  </tr>
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

export default DisplacementCalculator;
