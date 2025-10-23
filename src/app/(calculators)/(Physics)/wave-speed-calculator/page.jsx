"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useWaveSpeedCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WaveSpeedCalculator = () => {
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
    tech_frequency: "8",
    tech_f_unit: "kHz",
    tech_wavelength: "0.221",
    tech_w_units: "yd",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWaveSpeedCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_frequency || !formData.tech_wavelength) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_frequency: formData.tech_frequency,
        tech_f_unit: formData.tech_f_unit,
        tech_wavelength: formData.tech_wavelength,
        tech_w_units: formData.tech_w_units,
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
      tech_frequency: "8",
      tech_f_unit: "kHz",
      tech_wavelength: "0.221",
      tech_w_units: "yd",
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
    setFormData((prev) => ({ ...prev, tech_f_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_w_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  // Helper for rounding
  const round = (value, precision) => {
    return value ? Number(value).toFixed(precision) : "";
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_frequency" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_frequency"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_frequency}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_f_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "Hz", value: "Hz" },
                        { label: "kHz", value: "kHz" },
                        { label: "MHz", value: "MHz" },
                        { label: "GHz", value: "GHz" },
                        { label: "nmi", value: "nmi" },
                        { label: "kWh", value: "kWh" },
                        { label: "THz", value: "THz" },
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
              <div className="col-span-12">
                <label htmlFor="tech_wavelength" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_wavelength"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_wavelength}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_w_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m", value: "m" },
                        { label: "nm", value: "nm" },
                        { label: "μm", value: "μm" },
                        { label: "mm", value: "mm" },
                        { label: "cm", value: "cm" },
                        { label: "km", value: "km" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
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
                    <div className="w-full bg-light-blue result p-3 radius-10 mt-3 overflow-auto">
                      <div className="row">
                        <p className="w-full mt-2 font-s-18">
                          <strong>{data?.payload?.tech_lang_keys[3]}</strong>
                        </p>
                        <div className="w-full md:w-[60%] lg:w-[60%]  mt-2 overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_v}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">m/s</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_v * 3.6}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">km/h</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_v * 3.28084}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">ft/s</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_v * 2.236936}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">mph</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_v * 1.943844}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">knots</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_v * 0.00000000333564}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">light speed</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_v * 100}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">cm/s</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="w-full mt-2 font-s-18">
                          <strong>{data?.payload?.tech_lang_keys[4]}</strong>
                        </p>
                        <div className="w-full md:w-[60%] lg:w-[60%]  mt-2 overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_t}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">sec</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_t * 1000000000000}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_t * 1000000000}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_t * 1000000}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_t * 1000}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_t * 0.016667}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="w-full mt-2 font-s-18">
                          <strong>{data?.payload?.tech_lang_keys[10]}</strong>
                        </p>
                        <div className="w-full md:w-[60%] lg:w-[60%]  mt-2 overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_vn}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">m</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_vn * 0.001}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">mm</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_vn * 0.01}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">cm</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_vn * 1000}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">km</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_vn * 0.0254}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">in</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_vn * 0.3048}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">ft</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_vn * 0.9144}
                                  </strong>
                                </td>
                                <td className="p-2 border-b">yd</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <p className="w-full mt-3 font-s-18 text-blue">
                            <strong>
                              {data?.payload?.tech_lang_keys["11"]}
                            </strong>
                          </p>

                          <p className="w-full mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["1"]}} = ${result?.tech_frequency}`}
                            />
                          </p>

                          <p className="w-full mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["2"]}} = ${result?.tech_wavelength}`}
                            />
                          </p>

                          <p className="w-full mt-3 font-s-18 text-blue">
                            {data?.payload?.tech_lang_keys["12"]}
                          </p>

                          <p className="w-full mt-3 color_blue padding_5">
                            {data?.payload?.tech_lang_keys["13"]}{" "}
                            {data?.payload?.tech_lang_keys["3"]}.
                          </p>

                          <p className="w-full mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["3"]}} = f \\lambda`}
                            />
                          </p>

                          <p className="w-full mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["3"]}} = ${result?.tech_frequency} \\times ${result?.tech_wavelength}`}
                            />
                          </p>

                          <p className="w-full mt-3 font-s-18">
                            <InlineMath
                              math={`\\text{${
                                data?.payload?.tech_lang_keys["3"]
                              }} = ${round(result?.tech_v, 3)} \\text{m/s}`}
                            />
                          </p>

                          <p className="w-full mt-3 color_blue padding_5">
                            {data?.payload?.tech_lang_keys["13"]}{" "}
                            {data?.payload?.tech_lang_keys["4"]}.
                          </p>

                          <p className="w-full mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["4"]}} = \\frac{1}{\\text{${data?.payload?.tech_lang_keys["1"]}}}`}
                            />
                          </p>

                          <p className="w-full mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["4"]}} = \\frac{1}{${result?.tech_frequency}}`}
                            />
                          </p>

                          <p className="w-full mt-3 font-s-18">
                            <InlineMath
                              math={`\\text{${
                                data?.payload?.tech_lang_keys["4"]
                              }} = ${round(result?.tech_t, 8)} \\text{sec}`}
                            />
                          </p>

                          <p className="w-full mt-3 color_blue padding_5">
                            {data?.payload?.tech_lang_keys["13"]}{" "}
                            {data?.payload?.tech_lang_keys["10"]}.
                          </p>

                          <p className="w-full mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["10"]}} = \\frac{1}{\\lambda}`}
                            />
                          </p>

                          <p className="w-full mt-3">
                            <InlineMath
                              math={`\\text{${data?.payload?.tech_lang_keys["10"]}} = \\frac{1}{${result?.tech_wavelength}}`}
                            />
                          </p>

                          <p className="w-full mt-3 font-s-18">
                            <InlineMath
                              math={`\\text{${
                                data?.payload?.tech_lang_keys["10"]
                              }} = ${round(result?.tech_vn, 3)} \\text{m}`}
                            />
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

export default WaveSpeedCalculator;
