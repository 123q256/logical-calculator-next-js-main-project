"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useStpCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StpCalculator = () => {
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
    tech_volume: "5",
    tech_volume_units: "dm³",
    tech_temp: "350",
    tech_temp_units: "K",
    tech_pressure: "850",
    tech_pressure_units: "inHg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStpCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_volume ||
      !formData.tech_volume_units ||
      !formData.tech_temp ||
      !formData.tech_temp_units ||
      !formData.tech_pressure ||
      !formData.tech_pressure_units
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_volume: formData.tech_volume,
        tech_volume_units: formData.tech_volume_units,
        tech_temp: formData.tech_temp,
        tech_temp_units: formData.tech_temp_units,
        tech_pressure: formData.tech_pressure,
        tech_pressure_units: formData.tech_pressure_units,
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
      tech_volume: "5",
      tech_volume_units: "dm³",
      tech_temp: "350",
      tech_temp_units: "K",
      tech_pressure: "850",
      tech_pressure_units: "inHg",
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
    setFormData((prev) => ({ ...prev, tech_volume_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temp_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pressure_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

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
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  lg:gap-4 md:gap-4 gap-2">
              <div className="space-y-2">
                <label htmlFor="tech_volume" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_volume"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_volume}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_volume_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cubic millimeters (mm³)", value: "mm³" },
                        { label: "cubic centimeters (cm³)", value: "cm³" },
                        {
                          label: "cubic decimeters (dm³)",
                          value: "cubic decimeters (dm³)",
                        },
                        { label: "cubic meters (m³)", value: "m³" },
                        { label: "cubic inches (cu in)", value: "cu in" },
                        { label: "cubic feet (cu ft)", value: "cu ft" },
                        { label: "cubic yards (cu yd)", value: "cu yd" },
                        { label: "milliliters (ml)", value: "ml" },
                        { label: "centiliters (cl)", value: "cl" },
                        { label: "liters (l)", value: "l" },
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
              <div className="space-y-2">
                <label htmlFor="tech_temp" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_temp"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_temp}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_temp_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "°C", value: "°C" },
                        { label: "°F", value: "°F" },
                        { label: "K", value: "K" },
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
              <div className="space-y-2">
                <label htmlFor="tech_pressure" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_pressure"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_pressure}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_pressure_units} ▾
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
                        { label: "inHg", value: "inHg" },
                        { label: "mmHg", value: "mmHg" },
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  bg-light-blue result p-3 radius-10 mt-3">
                      <div className="w-full ">
                        {result?.tech_vstp && (
                          <>
                            <div className="col-lg-6">
                              <div className="d-flex flex-column flex-md-row justify-content-between">
                                <div>
                                  <p>
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </strong>
                                  </p>
                                  <p>
                                    <strong className="text-[#119154] lg:text-[32px] md:text-[32px] text-[26px]">
                                      {Number(result?.tech_vstp).toFixed(3)} L
                                    </strong>
                                  </p>
                                </div>
                                <div className="border-end d-none d-md-block">
                                  &nbsp;
                                </div>
                                <div>
                                  <p>
                                    <strong>
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </strong>
                                  </p>
                                  <p>
                                    <strong className="text-[#119154] lg:text-[32px] md:text-[32px] text-[26px]">
                                      {Number(result?.tech_moles).toFixed(3)}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <p className="mt-2">
                              <strong className="font-s-18">
                                {data?.payload?.tech_lang_keys["6"]}:
                              </strong>
                            </p>
                            <p className="mt-2">
                              {
                                "\\(V_{STP} = V \\times (\\dfrac{273.15}{T}) \\times (\\dfrac{P}{760})\\)"
                              }
                            </p>
                            <p className="mt-2">
                              <strong className="font-s-18">
                                {data?.payload?.tech_lang_keys["7"]}:
                              </strong>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["4"]} [V] ={" "}
                              {Number(result?.tech_volume).toFixed(2)} L
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["8"]} [T] ={" "}
                              {Number(result?.tech_temp).toFixed(2)} K
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["9"]} [P] ={" "}
                              {Number(result?.tech_pressure).toFixed(2)} Torr
                            </p>
                            <p className="mt-2">
                              <strong className="font-s-18">
                                {data?.payload?.tech_lang_keys["11"]}:
                              </strong>
                            </p>
                            <p className="mt-2">
                              {
                                "\\(V_{STP} = V \\times (\\dfrac{273.15}{T}) \\times (\\dfrac{P}{760})\\)"
                              }
                            </p>
                            <p className="mt-2">
                              {`\\(V_{STP} = ${result?.tech_volume} \\times (\\dfrac{273.15}{${result?.tech_temp}}) \\times (\\dfrac{${result?.tech_pressure}}{760})\\)`}
                            </p>
                            <p className="mt-2">
                              {`\\(V_{STP} = ${result?.tech_volume} \\times (${(
                                273.15 / result?.tech_temp
                              ).toFixed(4)}) \\times (${(
                                result?.tech_pressure / 760
                              ).toFixed(4)})\\)`}
                            </p>
                            <p className="mt-2 font-s-18">
                              {"\\(V_{STP} =\\)"}{" "}
                              <strong>
                                {Number(result?.tech_vstp).toFixed(3)} L
                              </strong>
                            </p>

                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}
                              </strong>
                            </p>
                            <p className="mt-2">
                              {"\\(Moles_{STP} = \\dfrac{V_{STP}}{22.4}\\)"}
                            </p>
                            <p className="mt-2">
                              {`\\(Moles_{STP} = \\dfrac{${Number(
                                result?.tech_vstp
                              ).toFixed(2)}}{22.4}\\)`}
                            </p>
                            <p className="mt-2 font-s-18">
                              {"\\(Moles_{STP} =\\)"}{" "}
                              <strong>
                                {Number(result?.tech_moles).toFixed(3)}
                              </strong>
                            </p>

                            <p className="mt-4">
                              <strong className="font-s-18">
                                {"\\(V_{STP}\\)"}{" "}
                                {data?.payload?.tech_lang_keys["13"]}:
                              </strong>
                            </p>

                            <div className="lg:w-[70%] md:w-[80%]  overflow-auto mt-3">
                              <table className="w-full" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["14"]}{" "}
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2) *
                                          1000000}
                                      </strong>{" "}
                                      mm³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["14"]}{" "}
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2) *
                                          1000}
                                      </strong>{" "}
                                      cm³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["14"]}{" "}
                                      {data?.payload?.tech_lang_keys["17"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2)}
                                      </strong>{" "}
                                      dm³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["14"]}{" "}
                                      {data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2) *
                                          0.001}
                                      </strong>{" "}
                                      m³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["14"]}{" "}
                                      {data?.payload?.tech_lang_keys["19"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2) *
                                          61.024}
                                      </strong>{" "}
                                      cu in
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["14"]}{" "}
                                      {data?.payload?.tech_lang_keys["20"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2) *
                                          0.035}
                                      </strong>{" "}
                                      cu ft
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["14"]}{" "}
                                      {data?.payload?.tech_lang_keys["20"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2) *
                                          0.001}
                                      </strong>{" "}
                                      cu yd
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["15"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2) *
                                          1000}
                                      </strong>{" "}
                                      ml
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      <InlineMath math="V_{STP}" />{" "}
                                      {data?.payload?.tech_lang_keys["22"]}
                                    </td>
                                    <td className="py-2 ps-2">
                                      <strong>
                                        {Number(result?.tech_vstp).toFixed(2) *
                                          100}
                                      </strong>{" "}
                                      cl
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

export default StpCalculator;
