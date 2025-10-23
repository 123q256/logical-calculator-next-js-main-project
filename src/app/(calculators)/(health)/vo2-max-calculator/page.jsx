"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVO2MaxCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VO2MaxCalculator = () => {
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
    tech_methods: "2",
    tech_operations1: "1",
    tech_first: "22",
    tech_second: "67",
    tech_units2: "kg",
    tech_third: "45",
    tech_units3: "sec",
    tech_operations2: "2",
    tech_four: "70",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVO2MaxCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_methods == 1) {
      if (
        !formData.tech_methods ||
        !formData.tech_operations1 ||
        !formData.tech_four
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_methods == 2) {
      if (
        !formData.tech_methods ||
        !formData.tech_operations1 ||
        !formData.tech_first ||
        !formData.tech_second ||
        !formData.tech_units2 ||
        !formData.tech_third ||
        !formData.tech_units3 ||
        !formData.tech_four
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_methods == 3) {
      if (
        !formData.tech_methods ||
        !formData.tech_operations1 ||
        !formData.tech_four
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_methods == 4) {
      if (
        !formData.tech_methods ||
        !formData.tech_third ||
        !formData.tech_units3
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_methods == 5) {
      if (
        !formData.tech_methods ||
        !formData.tech_operations1 ||
        !formData.tech_second ||
        !formData.tech_units2 ||
        !formData.tech_third ||
        !formData.tech_units3 ||
        !formData.tech_operations2
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_methods: formData.tech_methods,
        tech_operations1: formData.tech_operations1,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_units2: formData.tech_units2,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_operations2: formData.tech_operations2,
        tech_four: formData.tech_four,
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
      tech_methods: "2",
      tech_operations1: "1",
      tech_first: "22",
      tech_second: "67",
      tech_units2: "kg",
      tech_third: "45",
      tech_units3: "sec",
      tech_operations2: "2",
      tech_four: "70",
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
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-3 lg:gap-3">
              <div className="col-span-12">
                <label htmlFor="tech_methods" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_methods"
                    id="tech_methods"
                    value={formData.tech_methods}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_methods == "1" && (
                <>
                  <div className="col-span-6" id="div1">
                    <label htmlFor="tech_operations1" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations1"
                        id="tech_operations1"
                        value={formData.tech_operations1}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="0">
                          {data?.payload?.tech_lang_keys["9"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6" id="div5">
                    <label htmlFor="tech_four" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_four"
                        id="tech_four"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_four}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        {data?.payload?.tech_lang_keys["18"]} / 20 sec
                      </span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_methods == "2" && (
                <>
                  <div className="col-span-6" id="div1">
                    <label htmlFor="tech_operations1" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations1"
                        id="tech_operations1"
                        value={formData.tech_operations1}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="0">
                          {data?.payload?.tech_lang_keys["9"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6" id="div2">
                    <label htmlFor="tech_first" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_first"
                        id="tech_first"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_first}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        {data?.payload?.tech_lang_keys["11"]}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-6" id="div3">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["12"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_second"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_second}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_units2} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "pounds (lbs)", value: "lbs" },
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
                  <div className="col-span-6" id="div4">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["13"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_third"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_third}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_units3} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
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
                  <div className="col-span-6" id="div5">
                    <label htmlFor="tech_four" className="label">
                      {data?.payload?.tech_lang_keys["17"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_four"
                        id="tech_four"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_four}
                        onChange={handleChange}
                      />
                      <span className="input_unit">beats / 10 sec</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_methods == "3" && (
                <>
                  <div className="col-span-6" id="div1">
                    <label htmlFor="tech_operations1" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations1"
                        id="tech_operations1"
                        value={formData.tech_operations1}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="0">
                          {data?.payload?.tech_lang_keys["9"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6" id="div5">
                    <label htmlFor="tech_four" className="label">
                      {data?.payload?.tech_lang_keys["17"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_four"
                        id="tech_four"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_four}
                        onChange={handleChange}
                      />
                      <span className="input_unit">beats / 15 sec</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_methods == "4" && (
                <>
                  <div className="col-span-6" id="div4">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["20"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_third"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_third}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_units3} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
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
              {formData.tech_methods == "5" && (
                <>
                  <div className="col-span-6" id="div1">
                    <label htmlFor="tech_operations1" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations1"
                        id="tech_operations1"
                        value={formData.tech_operations1}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="0">
                          {data?.payload?.tech_lang_keys["9"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6" id="div3">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["12"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_second"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_second}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_units2} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "pounds (lbs)", value: "lbs" },
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
                  <div className="col-span-6" id="div4">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_third"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_third}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_units3} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
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
                  <div className="col-span-6 " id="div6">
                    <label htmlFor="tech_operations2" className="label">
                      {data?.payload?.tech_lang_keys["14"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations2"
                        id="tech_operations2"
                        value={formData.tech_operations2}
                        onChange={handleChange}
                      >
                        <option value="2">
                          {data?.payload?.tech_lang_keys["15"]}
                        </option>
                        <option value="1">
                          {data?.payload?.tech_lang_keys["16"]}
                        </option>
                      </select>
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
                    <div className="col-12 bg-light-blue result radius-10 p-3 mt-3">
                      <div className="col-12 text-center">
                        <p>
                          <strong>{data?.payload?.tech_lang_keys[19]}</strong>
                        </p>
                        <p className="text-[32px]">
                          <strong className="text-[#119154]">
                            {Number(result?.tech_answer).toFixed(2)}
                            <span className="text-[20px] text-green">
                              {" "}
                              (ml/kg/min)
                            </span>
                          </strong>
                        </p>
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

export default VO2MaxCalculator;
