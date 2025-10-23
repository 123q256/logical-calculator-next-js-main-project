"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useActivationEnergyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ActivationEnergyCalculator = () => {
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
    tech_temperature: "100",
    tech_tempUnit: "fahrenheit", // celsius  fahrenheit  kelvin
    tech_rate: "100",
    tech_rateUnits: "month",
    tech_const: "8",
    tech_constUnits: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useActivationEnergyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_temperature ||
      !formData.tech_tempUnit ||
      !formData.tech_rate ||
      !formData.tech_rateUnits ||
      !formData.tech_const ||
      !formData.tech_constUnits
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_temperature: formData.tech_temperature,
        tech_tempUnit: formData.tech_tempUnit,
        tech_rate: formData.tech_rate,
        tech_rateUnits: formData.tech_rateUnits,
        tech_const: formData.tech_const,
        tech_constUnits: formData.tech_constUnits,
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
      tech_temperature: "100",
      tech_tempUnit: "fahrenheit", // celsius  fahrenheit  kelvin
      tech_rate: "100",
      tech_rateUnits: "month",
      tech_const: "8",
      tech_constUnits: "sec",
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
    setFormData((prev) => ({ ...prev, tech_tempUnit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rateUnits: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_constUnits: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-1  md:gap-2">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_temperature" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
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
                    onClick={toggleDropdown}
                  >
                    {formData.tech_tempUnit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["2"],
                          value: "celsius",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["3"],
                          value: "fahrenheit",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["4"],
                          value: "kelvin",
                        },
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
                <label htmlFor="tech_rate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_rate"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_rate}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_rateUnits} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["6"],
                          value: "sec",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["7"],
                          value: "min",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["8"],
                          value: "hour",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["9"],
                          value: "day",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["10"],
                          value: "week",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["11"],
                          value: "month",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["12"],
                          value: "year",
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
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_const" className="label">
                  {data?.payload?.tech_lang_keys["13"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_const"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_const}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_constUnits} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["6"],
                          value: "sec",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["7"],
                          value: "min",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["8"],
                          value: "hour",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["9"],
                          value: "day",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["10"],
                          value: "week",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["11"],
                          value: "month",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["12"],
                          value: "year",
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <p>
                          <strong>
                            {data?.payload?.tech_lang_keys["14"]} (Ea)
                          </strong>
                        </p>
                        <p>
                          <strong className="text-[#119154] text-[32px] mt-3">
                            {Number(result?.tech_res).toFixed(3)} KJ
                          </strong>
                        </p>
                        <div className="grid grid-cols-2  lg:grid-cols-4 md:grid-cols-4  gap-4">
                          <div className="mt-3 border-r-4 ">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["15"]}
                              </strong>
                            </p>
                            <p>{Number(result?.tech_joule).toFixed(2)}</p>
                          </div>
                          <div className="border-r-4  hidden d-md-block mt-3">
                            &nbsp;
                          </div>
                          <div className="mt-3 border-r-4 ">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["16"]}
                              </strong>
                            </p>
                            <p>{Number(result?.tech_megajoule).toFixed(2)}</p>
                          </div>
                          <div className="border-r-4  hidden d-md-block mt-3">
                            &nbsp;
                          </div>
                          <div className="mt-3 border-r-4 ">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>
                            <p>{Number(result?.tech_calories).toFixed(2)}</p>
                          </div>
                          <div className="border-r-4  hidden d-md-block mt-3">
                            &nbsp;
                          </div>
                          <div className="mt-3 border-r-4 ">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>
                            <p>
                              {Number(result?.tech_kilocalories).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="w-full mt-3">
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["19"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["1"]} ={" "}
                            {Number(result?.tech_temperature).toFixed(2)}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["5"]} ={" "}
                            {result?.tech_rate}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["13"]} ={" "}
                            {result?.tech_const}
                          </p>
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["20"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            Ea = {data?.payload?.tech_lang_keys["14"]}
                          </p>
                          <p className="mt-2">
                            R = {data?.payload?.tech_lang_keys["15"]}{" "}
                            (-0.008314) J/(K⋅mol)
                          </p>
                          <p className="mt-2">
                            T = {data?.payload?.tech_lang_keys["22"]}
                          </p>
                          <p className="mt-2">
                            k = {data?.payload?.tech_lang_keys["23"]}
                          </p>
                          <p className="mt-2">
                            A = {data?.payload?.tech_lang_keys["25"]}
                          </p>
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["26"]}
                            </strong>
                          </p>
                          <p className="mt-2">Ea = -R * T * ln(k / A)</p>
                          <p className="mt-2">
                            Ea = -0.008314 *{" "}
                            {Number(result?.tech_temperature).toFixed(2)} * ln(
                            {result?.tech_rate} / {result?.tech_const})
                          </p>
                          <p className="mt-2">
                            Ea = ({-0.008314 * result?.tech_temperature}) * (ln(
                            {result?.tech_rate / result?.tech_const}))
                          </p>
                          <p className="mt-2">
                            Ea = ({-0.008314 * result?.tech_temperature}) * (
                            {result?.tech_log})
                          </p>
                          <p className="mt-2">
                            Ea ={" "}
                            {Number(
                              -0.008314 *
                                result?.tech_temperature *
                                result?.tech_log
                            ).toFixed(3)}{" "}
                            KJ
                          </p>
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

export default ActivationEnergyCalculator;
