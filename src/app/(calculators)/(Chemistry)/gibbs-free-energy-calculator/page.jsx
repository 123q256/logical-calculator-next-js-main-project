"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useGibbsFreeEnergyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GibbsFreeEnergyCalculator = () => {
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
    tech_enthalpy: 50,
    tech_enthalpy_units: "cal",
    tech_entropy: 45,
    tech_entropy_units: "kcal",
    tech_temperature: 30,
    tech_t_units: "°F",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGibbsFreeEnergyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_enthalpy ||
      !formData.tech_enthalpy_units ||
      !formData.tech_entropy ||
      !formData.tech_entropy_units ||
      !formData.tech_temperature ||
      !formData.tech_t_units
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_enthalpy: formData.tech_enthalpy,
        tech_enthalpy_units: formData.tech_enthalpy_units,
        tech_entropy: formData.tech_entropy,
        tech_entropy_units: formData.tech_entropy_units,
        tech_temperature: formData.tech_temperature,
        tech_t_units: formData.tech_t_units,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_enthalpy: 50,
      tech_enthalpy_units: "cal",
      tech_entropy: 45,
      tech_entropy_units: "kcal",
      tech_temperature: 30,
      tech_t_units: "°F",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_enthalpy_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_entropy_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-1  md:gap-2">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_enthalpy" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_enthalpy"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_enthalpy}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_enthalpy_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "J", value: "J" },
                        { label: "KJ", value: "KJ" },
                        { label: "cal", value: "cal" },
                        { label: "kcal", value: "kcal" },
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
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_entropy" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_entropy"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_entropy}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_entropy_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "J", value: "J" },
                        { label: "KJ", value: "KJ" },
                        { label: "cal", value: "cal" },
                        { label: "kcal", value: "kcal" },
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
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_temperature" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_temperature"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_temperature}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_t_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "K", value: "K" },
                        { label: "°C", value: "°C" },
                        { label: "°F", value: "°F" },
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8  rounded-lg result_calculator space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8  rounded-lg result_calculator space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="bg-sky bordered rounded-lg p-3 px-3 py-2">
                        <p>
                          <strong>
                            {data?.payload?.tech_lang_keys["4"]} ={" "}
                          </strong>
                          <strong className="text-green-600 text-[25px]">
                            {Number(result?.tech_gibbs).toFixed(2)} KJ
                          </strong>
                        </p>
                        <p>
                          {result?.tech_gibbs < 0
                            ? data?.payload?.tech_lang_keys["9"]
                            : data?.payload?.tech_lang_keys["10"]}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <div className="mt-3">
                          <p>
                            <strong>J</strong>
                          </p>
                          <p>{Number(result?.tech_gibbs * 1000).toFixed(2)}</p>
                        </div>

                        <div className="mt-3">
                          <p>
                            <strong>cal</strong>
                          </p>
                          <p>{Number(result?.tech_gibbs * 239).toFixed(2)}</p>
                        </div>

                        <div className="mt-3">
                          <p>
                            <strong>kcal</strong>
                          </p>
                          <p>{Number(result?.tech_gibbs * 0.239).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="w-full">
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["6"]}</strong>
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["1"]} :{" "}
                          {formData?.tech_enthalpy}{" "}
                          {formData?.tech_enthalpy_units}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["2"]} :{" "}
                          {formData?.tech_entropy}{" "}
                          {formData?.tech_entropy_units}{" "}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["3"]} :{" "}
                          {formData?.tech_temperature} {formData?.tech_t_units}
                        </p>
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["7"]}</strong>
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["8"]} :
                        </p>
                        <p className="mt-2">
                          <InlineMath math="\Delta G = \Delta H - T \times \Delta S" />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`\\Delta G = (${formData?.tech_enthalpy} - ${formData?.tech_entropy} \\times ${formData?.tech_temperature})`}
                          />
                        </p>
                        <p className="mt-2">
                          <InlineMath
                            math={`\\Delta G = ${Number(
                              result?.tech_gibbs
                            ).toFixed(2)}\\ \\text{KJ}`}
                          />
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

export default GibbsFreeEnergyCalculator;
