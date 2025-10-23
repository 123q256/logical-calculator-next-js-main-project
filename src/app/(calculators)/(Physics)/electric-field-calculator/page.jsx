"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useElectricFieldCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ElectricFieldCalculator = () => {
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
    tech_selection: "1", // 1 2
    tech_selection3: "1", // 1 2 3
    tech_per: "5",
    tech_charge: "8",
    tech_c_unit: "μC",
    tech_distance: "8",
    tech_d_unit: "nm",
    tech_electric_field: "2",
    tech_charge1: ["1"],
    tech_charge_unit: ["nm"],
    tech_distance1: ["2"],
    tech_distance_unit: ["nm"],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useElectricFieldCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //       setResult(null);
  //   setFormError(null);
  // };

  // const handleChange = (e, index, field) => {
  //   const { value } = e.target;

  //   setFormData(prev => {
  //     const updated = { ...prev };

  //     // Check if array exists, if not initialize it
  //     if (!updated[field]) {
  //       updated[field] = [];
  //     }

  //     updated[field][index] = value;
  //     return updated;
  //   });
  // };

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev };

      if (index !== null && field) {
        // Array field (like tech_charge1, tech_distance1)
        if (!Array.isArray(updated[field])) {
          updated[field] = [];
        }
        updated[field][index] = value;
      } else {
        // Regular field (like tech_selection, tech_selection3, tech_per)
        updated[name] = value;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_selection3: formData.tech_selection3,
        tech_per: formData.tech_per,
        tech_charge: formData.tech_charge,
        tech_c_unit: formData.tech_c_unit,
        tech_distance: formData.tech_distance,
        tech_d_unit: formData.tech_d_unit,
        tech_electric_field: formData.tech_electric_field,
        tech_charge1: formData.tech_charge1,
        tech_charge_unit: formData.tech_charge_unit,
        tech_distance1: formData.tech_distance1,
        tech_distance_unit: formData.tech_distance_unit,
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
      tech_selection: "1", // 1 2
      tech_selection3: "1", // 1 2 3
      tech_per: "5",
      tech_charge: "8",
      tech_c_unit: "μC",
      tech_distance: "8",
      tech_d_unit: "nm",
      tech_electric_field: "2",
      tech_charge1: ["1"],
      tech_charge_unit: ["nm"],
      tech_distance1: ["2"],
      tech_distance_unit: ["nm"],
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

  const [dropdownVisible, setDropdownVisible] = useState([]);

  const toggleDropdown = (index) => {
    setDropdownVisible((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const setUnitHandler = (index, field, unit) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[field][index] = unit;
      return updated;
    });
    setDropdownVisible((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };
  const [dropdownVisible1, setDropdownVisible1] = useState([]);

  const toggleDropdown1 = (index) => {
    setDropdownVisible1((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const setUnitHandler1 = (index, field, unit) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[field][index] = unit;
      return updated;
    });
    setDropdownVisible1((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      tech_charge1: [...prev.tech_charge1, ""],
      tech_charge_unit: [...prev.tech_charge_unit, "μC"],
      tech_distance1: [...prev.tech_distance1, ""],
      tech_distance_unit: [...prev.tech_distance_unit, "nm"],
    }));
    setDropdownVisible((prev) => [...prev, false]);
  };

  const removeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      tech_charge1: prev.tech_charge1.filter((_, i) => i !== index),
      tech_charge_unit: prev.tech_charge_unit.filter((_, i) => i !== index),
      tech_distance1: prev.tech_distance1.filter((_, i) => i !== index),
      tech_distance_unit: prev.tech_distance_unit.filter((_, i) => i !== index),
    }));
    setDropdownVisible((prev) => prev.filter((_, i) => i !== index));
  };

  //dropdown states
  const [dropdownVisible001, setDropdownVisible001] = useState(false);

  const setUnitHandler001 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c_unit: unit }));
    setDropdownVisible001(false);
  };

  const toggleDropdown001 = () => {
    setDropdownVisible001(!dropdownVisible001);
  };

  //dropdown states
  const [dropdownVisible002, setDropdownVisible002] = useState(false);

  const setUnitHandler002 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_d_unit: unit }));
    setDropdownVisible002(false);
  };

  const toggleDropdown002 = () => {
    setDropdownVisible002(!dropdownVisible002);
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]} a:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_selection == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 dis calculate1">
                    <label htmlFor="tech_selection3" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_selection3"
                        id="tech_selection3"
                        value={formData.tech_selection3}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["6"]}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["7"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_per" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_per"
                    id="tech_per"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_per}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {((formData.tech_selection == "1" &&
                formData.tech_selection3 == "1") ||
                (formData.tech_selection == "1" &&
                  formData.tech_selection3 == "2") ||
                formData.tech_selection == "2") && (
                <>
                  <div className="col-span-6 charge" id="charge">
                    {formData.tech_selection == "2" ? (
                      <>
                        <label htmlFor="tech_charge" className="label">
                          {data?.payload?.tech_lang_keys["7"]} 1
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_charge" className="label">
                          {data?.payload?.tech_lang_keys["7"]}{" "}
                        </label>
                      </>
                    )}
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_charge"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_charge}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown001}
                      >
                        {formData.tech_c_unit} ▾
                      </label>
                      {dropdownVisible001 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "PC", value: "PC" },
                            { label: "NC", value: "NC" },
                            { label: "μC", value: "μC" },
                            { label: "mC", value: "mC" },
                            { label: "C", value: "C" },
                            { label: "e", value: "e" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler001(unit.value)}
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
              {((formData.tech_selection == "1" &&
                formData.tech_selection3 == "1") ||
                (formData.tech_selection == "1" &&
                  formData.tech_selection3 == "3") ||
                formData.tech_selection == "2") && (
                <>
                  <div className="col-span-6 distance" id="distance">
                    {formData.tech_selection == "2" ? (
                      <>
                        <label htmlFor="tech_distance" className="label">
                          {data?.payload?.tech_lang_keys["6"]} 1
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_distance" className="label">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </label>
                      </>
                    )}

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_distance"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_distance}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown002}
                      >
                        {formData.tech_d_unit} ▾
                      </label>
                      {dropdownVisible002 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nm", value: "nm" },
                            { label: "μm", value: "μm" },
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler002(unit.value)}
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

              {((formData.tech_selection == "1" &&
                formData.tech_selection3 == "2") ||
                (formData.tech_selection == "1" &&
                  formData.tech_selection3 == "3")) && (
                <>
                  <div className="col-span-6 electric_field">
                    <label htmlFor="tech_electric_field" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_electric_field"
                        id="tech_electric_field"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_electric_field}
                        onChange={handleChange}
                      />
                      <span className="input_unit">N/C</span>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_selection == "2" && (
                <>
                  <div className="col-span-12">
                    {formData.tech_charge1.map((_, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                        <div className="col-span-6">
                          <label className="label">
                            {data?.payload?.tech_lang_keys["7"]} {index + 2}
                          </label>
                          <div className="relative w-full">
                            <input
                              type="number"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_charge1[index]}
                              placeholder="00"
                              onChange={(e) =>
                                handleChange(e, index, "tech_charge1")
                              }
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={() => toggleDropdown(index)}
                            >
                              {formData.tech_charge_unit[index]} ▾
                            </label>
                            {dropdownVisible[index] && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {["PC", "NC", "μC", "mC", "C", "e"].map(
                                  (unit, i) => (
                                    <p
                                      key={i}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler(
                                          index,
                                          "tech_charge_unit",
                                          unit
                                        )
                                      }
                                    >
                                      {unit}
                                    </p>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-6">
                          <div className="flex justify-between">
                            <div>
                              <label className="label">
                                {data?.payload?.tech_lang_keys["6"]} {index + 2}
                              </label>
                            </div>
                            {formData.tech_charge1.length > 1 && (
                              <div className="col-span-12 flex justify-end mt-2">
                                <img
                                  src="/images/delete_btn.png"
                                  alt="delete"
                                  className="h-4 w-4"
                                  onClick={() => removeRow(index)}
                                />
                              </div>
                            )}
                          </div>

                          <div className="relative w-full">
                            <input
                              type="number"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_distance1[index]}
                              placeholder="00"
                              onChange={(e) =>
                                handleChange(e, index, "tech_distance1")
                              }
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={() => toggleDropdown1(index)}
                            >
                              {formData.tech_distance_unit[index]} ▾
                            </label>
                            {dropdownVisible1[index] && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  "nm",
                                  "μm",
                                  "mm",
                                  "cm",
                                  "m",
                                  "km",
                                  "in",
                                  "ft",
                                  "yd",
                                  "mi",
                                ].map((unit, i) => (
                                  <p
                                    key={i}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                      setUnitHandler1(
                                        index,
                                        "tech_distance_unit",
                                        unit
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

                    <div className="col-12 d-flex px-2 mt-5">
                      <button
                        type="button"
                        className="bg-[#2845F5] cursor-pointer text-white border rounded px-4 py-2 me-2"
                        onClick={addRow}
                      >
                        <strong className="text-blue">
                          + {data?.payload?.tech_lang_keys[9]}
                        </strong>
                      </button>
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
                    <div className="w-full justify-center flex mt-3">
                      <div className="w-full ">
                        {result?.tech_answer && (
                          <div className="text-center overflow-auto">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[5]}
                              </strong>
                            </p>
                            <p className="text-[21px] bg-sky bordered rounded-lg px-3 py-3 my-3">
                              <strong className="text-blue">
                                {result?.tech_answer} (N/C)
                              </strong>
                            </p>
                          </div>
                        )}

                        {result?.tech_answer1 && (
                          <div className="text-center overflow-auto">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[6]}
                              </strong>
                            </p>
                            <p className="text-[21px] bg-sky bordered rounded-lg px-3 py-3 my-3">
                              <strong className="text-blue">
                                {result?.tech_answer1} (m)
                              </strong>
                            </p>
                          </div>
                        )}

                        {result?.tech_answer2 && (
                          <div className="text-center overflow-auto">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[7]}
                              </strong>
                            </p>
                            <p className="text-[21px] bg-sky bordered rounded-lg px-3 py-3 my-3">
                              <strong className="text-blue">
                                {result?.tech_answer2} (c)
                              </strong>
                            </p>
                          </div>
                        )}

                        {result?.tech_answer3 && (
                          <div className="text-center overflow-auto">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[5]}
                              </strong>
                            </p>
                            <p className="text-[21px] bg-sky bordered rounded-lg px-3 py-3 my-3">
                              <strong className="text-blue">
                                {result?.tech_answer3} (N/C)
                              </strong>
                            </p>
                          </div>
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

export default ElectricFieldCalculator;
