"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDrugHalfLifeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DrugHalfLifeCalculator = () => {
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
    tech_time_min: 9,
    tech_time_unit: "min/sec",
    tech_time_sec: 12,
    tech_unit_h: "min/sec",
    tech_time: 157,
    tech_unit_h_cm: "min/sec",
    tech_dosage: 1000,
    tech_dosage_unit: "mg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDrugHalfLifeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_dosage || !formData.tech_dosage_unit) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_time_min: formData.tech_time_min,
        tech_time_unit: formData.tech_time_unit,
        tech_time_sec: formData.tech_time_sec,
        tech_unit_h: formData.tech_unit_h,
        tech_time: formData.tech_time,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_dosage: formData.tech_dosage,
        tech_dosage_unit: formData.tech_dosage_unit,
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
      tech_time_min: 9,
      tech_time_unit: "min/sec",
      tech_time_sec: 12,
      tech_unit_h: "min/sec",
      tech_time: 157,
      tech_unit_h_cm: "min/sec",
      tech_dosage: 1000,
      tech_dosage_unit: "mg",
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
    setFormData((prev) => ({ ...prev, tech_dosage_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_time_unit: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_time_unit: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible2(false);
  };
  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  // result:

  const getTimeUnit = () => {
    switch (formData?.tech_time_unit) {
      case "mins":
        return "mins";
      case "hrs":
        return "hrs";
      case "days":
        return "days";
      case "sec":
        return "sec";
      case "min/sec":
        return "mins";
      case "hrs/min":
        return "hrs";
      default:
        return "";
    }
  };

  const rows = [
    {
      answer: result?.tech_answer,
      subAnswer: result?.tech_subanswer,
      percentage: "50%",
    },
    {
      answer: result?.tech_answer_one,
      subAnswer: result?.tech_subanswer_one,
      percentage: "25%",
    },
    {
      answer: result?.tech_answer_two,
      subAnswer: result?.tech_subanswer_sec,
      percentage: "12.5%",
    },
    {
      answer: result?.tech_answer_three,
      subAnswer: result?.tech_subanswer_three,
      percentage: "6.25%",
    },
    {
      answer: result?.tech_answer_four,
      subAnswer: result?.tech_subanswer_four,
      percentage: "3.125%",
    },
    {
      answer: result?.tech_answer_five,
      subAnswer: result?.tech_subanswer_five,
      percentage: "1.562%",
    },
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <input
                type="hidden"
                step="any"
                name="tech_time_unit"
                id="tech_time_unit"
                className="input my-2"
                aria-label="input"
                value={formData.tech_time_unit}
                onChange={handleChange}
              />

              {(formData.tech_time_unit == "min/sec" ||
                formData.tech_time_unit == "hrs/min") && (
                <>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6  ft_in">
                    <label htmlFor="tech_time_min" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_time_min"
                        id="tech_time_min"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_time_min}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_time_sec" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_time_sec"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_time_sec}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (mins)", value: "mins" },
                            { label: "hours (hrs)", value: "hrs" },
                            { label: "days", value: "days" },
                            {
                              label: "minutes / second (min/sec)",
                              value: "min/sec",
                            },
                            {
                              label: "hours / minute (hrs/min)",
                              value: "hrs/min",
                            },
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
              {(formData.tech_time_unit == "sec" ||
                formData.tech_time_unit == "mins" ||
                formData.tech_time_unit == "hrs" ||
                formData.tech_time_unit == "days") && (
                <>
                  <div className="col-span-12">
                    <label htmlFor="tech_time" className="label">
                      {data?.payload?.tech_lang_keys["1"]}{" "}
                      {formData.tech_time_unit == "sec" ? (
                        <span className="text-blue height_unit">(sec)</span>
                      ) : formData.tech_time_unit == "mins" ? (
                        <span className="text-blue height_unit">(mins)</span>
                      ) : formData.tech_time_unit == "hrs" ? (
                        <span className="text-blue height_unit">(hrs)</span>
                      ) : formData.tech_time_unit == "days" ? (
                        <span className="text-blue height_unit">(days)</span>
                      ) : null}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_time"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_time}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (mins)", value: "mins" },
                            { label: "hours (hrs)", value: "hrs" },
                            { label: "days", value: "days" },
                            {
                              label: "minutes / second (min/sec)",
                              value: "min/sec",
                            },
                            {
                              label: "hours / minute (hrs/min)",
                              value: "hrs/min",
                            },
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

              <div className="col-span-12">
                <label htmlFor="tech_dosage" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_dosage"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_dosage}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_dosage_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "micrograms (µg)", value: "µg" },
                        { label: "milligrams (mg)", value: "mg" },
                        { label: "grams (g)", value: "g" },
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
                    <div className="w-full p-3 mt-3">
                      <div className="w-full mt-2">
                        <div className="w-full overflow-auto">
                          <table className="w-full" cellSpacing="0">
                            <thead>
                              <tr>
                                <th className="text-start border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]} (
                                    {getTimeUnit()})
                                  </strong>
                                </th>
                                <th className="text-start border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["2"]} (mg)
                                  </strong>
                                </th>
                                <th className="text-start border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row, index) => (
                                <tr key={index}>
                                  <td className="border-b py-2">
                                    {row.answer}
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(row.subAnswer || 0).toFixed(2)}
                                  </td>
                                  <td className="border-b py-2">
                                    {row.percentage}
                                  </td>
                                </tr>
                              ))}
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

export default DrugHalfLifeCalculator;
