"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useParallelResistorCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ParallelResistorCalculator = () => {
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
    tech_mode: "2",
    tech_missing: "500",
    tech_mis_unit: "MΩ",
    tech_res_val: ["50", "50"],
    tech_unit: ["1000", "1000000"],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useParallelResistorCalculatorMutation();

  const handleChange = (e, index = null, type = null) => {
    const { name, value } = e.target;

    if (index !== null && type !== null) {
      // Handle array updates (for tech_res_val or tech_unit)
      setFormData((prevData) => {
        const updated = [...prevData[type]];
        updated[index] = value;
        return { ...prevData, [type]: updated };
      });
    } else {
      // Handle simple value update
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_mode: formData.tech_mode,
        tech_missing: formData.tech_missing,
        tech_mis_unit: formData.tech_mis_unit,
        tech_res_val: formData.tech_res_val,
        tech_unit: formData.tech_unit,
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
      tech_mode: "2",
      tech_missing: "500",
      tech_mis_unit: "MΩ",
      tech_res_val: ["50", "50"],
      tech_unit: ["1000", "1000000"],
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
    setFormData((prev) => ({ ...prev, tech_mis_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleAddMore = () => {
    setFormData((prevData) => ({
      ...prevData,
      tech_res_val: [...prevData.tech_res_val, ""],
      tech_unit: [...prevData.tech_unit, "1"],
    }));
  };

  const handleRemove = (index) => {
    setFormData((prevData) => {
      const resVals = [...prevData.tech_res_val];
      const units = [...prevData.tech_unit];
      resVals.splice(index, 1);
      units.splice(index, 1);
      return {
        ...prevData,
        tech_res_val: resVals,
        tech_unit: units,
      };
    });
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_mode" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_mode"
                    id="tech_mode"
                    value={formData.tech_mode}
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
              {formData.tech_mode == "2" && (
                <>
                  <div className="col-span-12  miss">
                    <label htmlFor="tech_missing" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_missing"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_missing}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_mis_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mΩ", value: "mΩ" },
                            { label: "Ω", value: "Ω" },
                            { label: "kΩ", value: "kΩ" },
                            { label: "MΩ", value: "MΩ" },
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
              <div className="col-span-12">
                <div className="grid grid-cols-12 mt-3 gap-4" id="more">
                  {formData.tech_res_val.map((val, index) => (
                    <React.Fragment key={index}>
                      <div className="col-span-6">
                        <label
                          htmlFor={`tech_res_val_${index}`}
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys["1"]} {index + 1}:
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name={`tech_res_val_${index}`}
                            id={`tech_res_val_${index}`}
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={val}
                            onChange={(e) =>
                              handleChange(e, index, "tech_res_val")
                            }
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="flex justify-between">
                          <div>
                            <label
                              htmlFor={`tech_unit_${index}`}
                              className="label"
                            >
                              &nbsp;
                            </label>
                          </div>
                          <div className="col-span-12 text-end">
                            {formData.tech_res_val.length > 1 && (
                              <img
                                src="/images/delete_btn.png"
                                alt="delete"
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => handleRemove(index)}
                              />
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name={`tech_unit_${index}`}
                            id={`tech_unit_${index}`}
                            value={formData.tech_unit[index]}
                            onChange={(e) =>
                              handleChange(e, index, "tech_unit")
                            }
                          >
                            <option value="0.001">mΩ</option>
                            <option value="1">vΩ</option>
                            <option value="1000">kΩ</option>
                            <option value="1000000">MΩ</option>
                          </select>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="col-span-12">
                  <div className="col-12 text-end mt-3">
                    <button
                      type="button"
                      name="submit"
                      id="btn7"
                      className="px-3 py-2 mx-1 addmore cursor-pointer bg-[#2845F5] text-white rounded-lg"
                      onClick={handleAddMore}
                    >
                      <span>+</span> {data?.payload?.tech_lang_keys[6]}
                    </button>
                  </div>
                </div>
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
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[70%]  mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(result?.tech_answer).toFixed(2)} (
                                {result?.tech_unit})
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full md:w-[70%] lg:w-[70%] mt-2">
                        {result?.tech_mode == 1 ? (
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[8]}{" "}
                            <strong>
                              {Number(result?.tech_answer).toFixed(2)}{" "}
                              {result?.tech_unit}
                            </strong>
                          </p>
                        ) : result?.tech_mode == 2 ? (
                          result?.tech_answer > 0 ? (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[9]}{" "}
                              <strong>
                                {Number(result?.tech_answer).toFixed(2)}{" "}
                                {result?.tech_unit}
                              </strong>
                            </p>
                          ) : result?.tech_answer === 0 ? (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[10]}.
                            </p>
                          ) : (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[11]}
                            </p>
                          )
                        ) : null}
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

export default ParallelResistorCalculator;
