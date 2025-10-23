"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useIndexOfRefractionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IndexOfRefractionCalculator = () => {
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
    tech_selection: "1",
    tech_medium_v: "0",
    tech_medium_value: 1200,
    tech_medium_value_unit: "c",
    tech_medium_v2: "0",
    tech_medium_value2: 1200,
    tech_medium_value_unit1: "mi/s",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useIndexOfRefractionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      if (name === "tech_medium_v") {
        if (value !== "0") {
          updatedData.tech_medium_value = value;
          updatedData.tech_medium_disabled = true;
        } else {
          updatedData.tech_medium_value = "";
          updatedData.tech_medium_disabled = false;
        }
      }

      if (name === "tech_medium_v2") {
        if (value !== "0") {
          updatedData.tech_medium_value2 = value;
          updatedData.tech_medium_disabled2 = true;
        } else {
          updatedData.tech_medium_value2 = "";
          updatedData.tech_medium_disabled2 = false;
        }
      }

      return updatedData;
    });

    setResult(null);
    setFormError(null);
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
        tech_medium_v: formData.tech_medium_v,
        tech_medium_value: formData.tech_medium_value,
        tech_medium_value_unit: formData.tech_medium_value_unit,
        tech_medium_v2: formData.tech_medium_v2,
        tech_medium_value2: formData.tech_medium_value2,
        tech_medium_value_unit1: formData.tech_medium_value_unit1,
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
      tech_selection: "1",
      tech_medium_v: "0",
      tech_medium_value: 1200,
      tech_medium_value_unit: "c",
      tech_medium_v2: "0",
      tech_medium_value2: 1200,
      tech_medium_value_unit1: "mi/s",
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
    setFormData((prev) => ({ ...prev, tech_medium_value_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_medium_value_unit1: unit }));
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
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-3 medium gap-4">
              <div className="col-span-6 medium">
                <label htmlFor="tech_medium_v" className="label">
                  {data?.payload?.tech_lang_keys["4"]} 1:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_medium_v"
                    id="tech_medium_v"
                    value={formData.tech_medium_v}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys[5]}{" "}
                    </option>
                    <option value="299792.5">
                      {" "}
                      {data?.payload?.tech_lang_keys[6]}{" "}
                    </option>
                    <option value="299704.6">
                      {" "}
                      {data?.payload?.tech_lang_keys[7]}{" "}
                    </option>
                    <option value="224900.6">
                      {" "}
                      {data?.payload?.tech_lang_keys[8]}{" "}
                    </option>
                    <option value="220435.6">
                      {" "}
                      {data?.payload?.tech_lang_keys[9]}{" "}
                    </option>
                    <option value="228849">
                      {" "}
                      {data?.payload?.tech_lang_keys[10]}{" "}
                    </option>
                    <option value="201203">
                      {" "}
                      {data?.payload?.tech_lang_keys[11]}{" "}
                    </option>
                    <option value="197232">
                      {" "}
                      {data?.payload?.tech_lang_keys[12]}{" "}
                    </option>
                    <option value="123932.4">
                      {" "}
                      {data?.payload?.tech_lang_keys[13]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6 custom_m">
                <label htmlFor="tech_medium_value" className="label">
                  {data?.payload?.tech_lang_keys["14"]}(v)
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_medium_value"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_medium_value}
                    placeholder="00"
                    onChange={handleChange}
                    disabled={formData.tech_medium_disabled}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_medium_value_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m/s", value: "m/s" },
                        { label: "km/s", value: "km/s" },
                        { label: "mi/s", value: "mi/s" },
                        { label: "c", value: "c" },
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

            {formData.tech_selection == "2" && (
              <>
                <div className="grid grid-cols-12 mt-3 medium2  gap-4">
                  <div className="col-span-6 ">
                    <label htmlFor="tech_medium_v2" className="label">
                      {data?.payload?.tech_lang_keys["4"]} 2:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_medium_v2"
                        id="tech_medium_v2"
                        value={formData.tech_medium_v2}
                        onChange={handleChange}
                      >
                        <option value="0">
                          {" "}
                          {data?.payload?.tech_lang_keys[5]}{" "}
                        </option>
                        <option value="299792.5">
                          {" "}
                          {data?.payload?.tech_lang_keys[6]}{" "}
                        </option>
                        <option value="299704.6">
                          {" "}
                          {data?.payload?.tech_lang_keys[7]}{" "}
                        </option>
                        <option value="224900.6">
                          {" "}
                          {data?.payload?.tech_lang_keys[8]}{" "}
                        </option>
                        <option value="220435.6">
                          {" "}
                          {data?.payload?.tech_lang_keys[9]}{" "}
                        </option>
                        <option value="228849">
                          {" "}
                          {data?.payload?.tech_lang_keys[10]}{" "}
                        </option>
                        <option value="201203">
                          {" "}
                          {data?.payload?.tech_lang_keys[11]}{" "}
                        </option>
                        <option value="197232">
                          {" "}
                          {data?.payload?.tech_lang_keys[12]}{" "}
                        </option>
                        <option value="123932.4">
                          {" "}
                          {data?.payload?.tech_lang_keys[13]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 custom_m">
                    <label htmlFor="tech_medium_value2" className="label">
                      {data?.payload?.tech_lang_keys["14"]} (v<sub>2</sub>)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_medium_value2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_medium_value2}
                        disabled={formData.tech_medium_disabled2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_medium_value_unit1} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "km/s", value: "km/s" },
                            { label: "mi/s", value: "mi/s" },
                            { label: "c", value: "c" },
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
                      {formData?.tech_selection == "1" ? (
                        <>
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys[15]}</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] px-3 py-2 text-[20px] md:text-[32px] rounded-lg text-white">
                                {Number(
                                  result?.tech_index_of_refraction
                                ).toFixed(6)}
                              </strong>
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys[3]}</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] px-3 py-2 text-[20px] md:text-[32px] rounded-lg text-white">
                                {Number(result?.tech_reflective_index).toFixed(
                                  6
                                )}
                              </strong>
                            </p>
                          </div>
                        </>
                      )}
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

export default IndexOfRefractionCalculator;
