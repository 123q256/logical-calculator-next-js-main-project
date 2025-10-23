"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useVaporPressureCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VaporPressureCalculator = () => {
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
    tech_t1: Number(298),
    tech_t1_units: "°C",
    tech_t2: Number(298),
    tech_t2_units: "°C",
    tech_p1: Number(298),
    tech_p1_units: "Pa",
    tech_deltaHvap: Number(40000),
    tech_deltaHvap_units: "J",
    tech_x_sol: Number(0.98),
    tech_p_sol: Number(47.1),
    tech_p_sol_units: "Pa",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVaporPressureCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_t1 ||
      !formData.tech_t1_units ||
      !formData.tech_t2 ||
      !formData.tech_t2_units ||
      !formData.tech_p1 ||
      !formData.tech_p1_units ||
      !formData.tech_deltaHvap ||
      !formData.tech_deltaHvap_units ||
      !formData.tech_x_sol ||
      !formData.tech_p_sol ||
      !formData.tech_p_sol_units
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_t1: formData.tech_t1,
        tech_t1_units: formData.tech_t1_units,
        tech_t2: formData.tech_t2,
        tech_t2_units: formData.tech_t2_units,
        tech_p1: formData.tech_p1,
        tech_p1_units: formData.tech_p1_units,
        tech_deltaHvap: formData.tech_deltaHvap,
        tech_deltaHvap_units: formData.tech_deltaHvap_units,
        tech_x_sol: formData.tech_x_sol,
        tech_p_sol: formData.tech_p_sol,
        tech_p_sol_units: formData.tech_p_sol_units,
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
      tech_t1: Number(298),
      tech_t1_units: "°C",
      tech_t2: Number(298),
      tech_t2_units: "°C",
      tech_p1: Number(298),
      tech_p1_units: "Pa",
      tech_deltaHvap: Number(40000),
      tech_deltaHvap_units: "J",
      tech_x_sol: Number(0.98),
      tech_p_sol: Number(47.1),
      tech_p_sol_units: "Pa",
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
    setFormData((prev) => ({ ...prev, tech_t1_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t2_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_p1_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_deltaHvap_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_p_sol_units: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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
            <div className="w-full  mb-2">
              <p>
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["1"]}
                </strong>
              </p>
            </div>
            <div className="grid grid-cols-12 gap-1  md:gap-3">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_t1" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_t1"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_t1}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_t1_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "°C", value: "°C" },
                        { label: "°F", value: "°F" },
                        { label: "k", value: "k" },
                        { label: "°R", value: "°R" },
                        { label: "°De", value: "°De" },
                        { label: "°N", value: "°N" },
                        { label: "°Ré", value: "°Ré" },
                        { label: "°Rø", value: "°Rø" },
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
                <label htmlFor="tech_t2" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_t2"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_t2}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_t2_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "°C", value: "°C" },
                        { label: "°F", value: "°F" },
                        { label: "k", value: "k" },
                        { label: "°R", value: "°R" },
                        { label: "°De", value: "°De" },
                        { label: "°N", value: "°N" },
                        { label: "°Ré", value: "°Ré" },
                        { label: "°Rø", value: "°Rø" },
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
                <label htmlFor="tech_p1" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_p1"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_p1}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_p1_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "Pa", value: "Pa" },
                        { label: "Bar", value: "Bar" },
                        { label: "psi", value: "psi" },
                        { label: "at", value: "at" },
                        { label: "atm", value: "atm" },
                        { label: "Torr", value: "Torr" },
                        { label: "hPa", value: "hPa" },
                        { label: "kPa", value: "kPa" },
                        { label: "MPa", value: "MPa" },
                        { label: "GPa", value: "GPa" },
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
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_deltaHvap" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_deltaHvap"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_deltaHvap}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_deltaHvap_units} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "J", value: "J" },
                        { label: "KJ", value: "KJ" },
                        { label: "MJ", value: "MJ" },
                        { label: "Wh", value: "Wh" },
                        { label: "KWh", value: "KWh" },
                        { label: "ft-lb", value: "ft-lb" },
                        { label: "kcal", value: "kcal" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler3(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full  mt-1 mb-2">
              <p>
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["6"]}
                </strong>
              </p>
            </div>
            <div className="grid grid-cols-12 gap-1  md:gap-3">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_x_sol" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_x_sol"
                    id="tech_x_sol"
                    className="input mt-1"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_x_sol}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_p_sol" className="label">
                  {data?.payload?.tech_lang_keys["8"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_p_sol"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_p_sol}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_p_sol_units} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "Pa", value: "Pa" },
                        { label: "Bar", value: "Bar" },
                        { label: "psi", value: "psi" },
                        { label: "at", value: "at" },
                        { label: "atm", value: "atm" },
                        { label: "Torr", value: "Torr" },
                        { label: "hPa", value: "hPa" },
                        { label: "kPa", value: "kPa" },
                        { label: "MPa", value: "MPa" },
                        { label: "GPa", value: "GPa" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler4(unit.value)}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full  rounded-lg mt-3">
                      <div className="w-full">
                        {/* <!-- Section 1 --> */}
                        <div className="bg-sky bordered rounded-lg px-3 py-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["9"]} =
                          </strong>
                          <strong className="text-[#119154] text-2xl">
                            {Number(result?.tech_p2, 3)}
                          </strong>
                        </div>
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["11"]}</strong>
                        </p>
                        <div className="flex justify-between overflow-auto gap-4">
                          <div className="mt-3 text-center">
                            <p>
                              <strong>bar</strong>
                            </p>
                            <p>
                              {Number(result?.tech_p2 * 0.00001).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>psi</strong>
                            </p>
                            <p>
                              {Number(result?.tech_p2 * 0.00014504).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>at</strong>
                            </p>
                            <p>
                              {Number(result?.tech_p2 * 0.000010197).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>atm</strong>
                            </p>
                            <p>
                              {Number(result?.tech_p2 * 0.00000987).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>torr</strong>
                            </p>
                            <p>{Number(result?.tech_p2 * 0.0075).toFixed(3)}</p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>hpa</strong>
                            </p>
                            <p>{Number(result?.tech_p2 * 0.01).toFixed(3)}</p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>kpa</strong>
                            </p>
                            <p>{Number(result?.tech_p2 * 0.001).toFixed(3)}</p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>Mpa</strong>
                            </p>
                            <p>
                              {Number(result?.tech_p2 * 0.000001).toFixed(3)}
                            </p>
                          </div>
                        </div>

                        {/* <!-- Section 2 --> */}
                        <div className="bg-sky bordered rounded-lg px-3 py-2 mt-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["10"]} =
                          </strong>
                          <strong className="text-[#119154] text-2xl">
                            {Number(result?.tech_xsolvent, 3)}
                          </strong>
                        </div>
                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["11"]}</strong>
                        </p>
                        <div className="flex justify-between overflow-auto gap-4">
                          <div className="mt-3 text-center">
                            <p>
                              <strong>bar</strong>
                            </p>
                            <p>
                              {Number(result?.tech_xsolvent * 0.00001).toFixed(
                                3
                              )}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>psi</strong>
                            </p>
                            <p>
                              {Number(
                                result?.tech_xsolvent * 0.00014504
                              ).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>at</strong>
                            </p>
                            <p>
                              {Number(
                                result?.tech_xsolvent * 0.000010197
                              ).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>atm</strong>
                            </p>
                            <p>
                              {Number(
                                result?.tech_xsolvent * 0.00000987
                              ).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>torr</strong>
                            </p>
                            <p>
                              {Number(result?.tech_xsolvent * 0.0075).toFixed(
                                3
                              )}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>hpa</strong>
                            </p>
                            <p>
                              {Number(result?.tech_xsolvent * 0.01).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>kpa</strong>
                            </p>
                            <p>
                              {Number(result?.tech_xsolvent * 0.001).toFixed(3)}
                            </p>
                          </div>
                          <div className="border-r border-gray-300 pr-4">
                            &nbsp;
                          </div>
                          <div className="mt-3 text-center">
                            <p>
                              <strong>Mpa</strong>
                            </p>
                            <p>
                              {Number(result?.tech_xsolvent * 0.000001).toFixed(
                                3
                              )}
                            </p>
                          </div>
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

export default VaporPressureCalculator;
