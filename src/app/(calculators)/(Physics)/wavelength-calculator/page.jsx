"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWavelengthCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WavelengthCalculator = () => {
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
    tech_find: "frequency", //  frequency  wavelength  velocity
    tech_preset: "3240",
    tech_velocity: "299792458",
    tech_velocity_unit: "knots",
    tech_frequency: "6",
    tech_frequency_unit: "mhz",
    tech_wavelength: "6",
    tech_wavelength_unit: "ft",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWavelengthCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //       setResult(null);
  //   setFormError(null);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setFormData((prevData) => ({
      ...prevData,
      tech_preset: value,
      tech_velocity: value === "custom" ? "" : value, // Custom हो तो खाली, वरना वैल्यू सेट करें
    }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_preset: formData.tech_preset,
        tech_velocity: formData.tech_velocity,
        tech_velocity_unit: formData.tech_velocity_unit,
        tech_frequency: formData.tech_frequency,
        tech_frequency_unit: formData.tech_frequency_unit,
        tech_wavelength: formData.tech_wavelength,
        tech_wavelength_unit: formData.tech_wavelength_unit,
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
      tech_find: "frequency", //  frequency  wavelength  velocity
      tech_preset: "3240",
      tech_velocity: "299792458",
      tech_velocity_unit: "knots",
      tech_frequency: "6",
      tech_frequency_unit: "mhz",
      tech_wavelength: "6",
      tech_wavelength_unit: "ft",
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
    setFormData((prev) => ({ ...prev, tech_velocity_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_frequency_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wavelength_unit: unit }));
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="wavelength">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="frequency">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="velocity">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_preset" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_preset"
                    id="tech_preset"
                    value={formData.tech_preset}
                    onChange={handleChange}
                  >
                    <option value="custom">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="299792458">
                      {" "}
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="299702547">
                      {" "}
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="225238511">
                      {" "}
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="199861639">
                      {" "}
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="343">
                      {" "}
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="355">
                      {" "}
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="60">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="1210">
                      {" "}
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="3240">
                      {" "}
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="4540">
                      {" "}
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="4600">
                      {" "}
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="6320">
                      {" "}
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_find == "wavelength" ||
                formData.tech_find == "frequency") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12 "
                    id="velocitys"
                  >
                    <label htmlFor="tech_velocity" className="label">
                      {data?.payload?.tech_lang_keys["19"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_velocity"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_velocity}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_velocity_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm/s", value: "cms" },
                            { label: "m/s", value: "ms" },
                            { label: "km/h", value: "kmh" },
                            { label: "ft/s", value: "fts" },
                            { label: "mph", value: "mph" },
                            { label: "knots", value: "knots" },
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
                </>
              )}
              {(formData.tech_find == "wavelength" ||
                formData.tech_find == "velocity") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="frequencys"
                  >
                    <label htmlFor="tech_frequency" className="label">
                      {data?.payload?.tech_lang_keys["20"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_frequency"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_frequency}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_frequency_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Hz", value: "hz" },
                            { label: "kHz", value: "khz" },
                            { label: "MHz", value: "mhz" },
                            { label: "GHz", value: "ghz" },
                            { label: "THz", value: "thz" },
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
              {(formData.tech_find == "frequency" ||
                formData.tech_find == "velocity") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12 "
                    id="wavelengths"
                  >
                    <label htmlFor="tech_wavelength" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_wavelength"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_wavelength}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_wavelength_unit} ▾
                      </label>
                      {dropdownVisible2 && (
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
                    <div className="w-full overflow-auto">
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                        <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>{result?.tech_find} </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                <strong>
                                  {result?.tech_ans}{" "}
                                  <span>{result?.tech_unit}</span>
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["22"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                <strong>
                                  {result?.tech_wn} <span>1/m</span>
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[20px]">
                        <div className="col m10 s12">
                          <div className="c">
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[23]}:
                            </p>
                            <p className="mt-2 font-bold">
                              {data?.payload?.tech_lang_keys[24]}
                            </p>

                            {formData?.tech_find === "wavelength" && (
                              <>
                                <p className="mt-2">λ = v × f</p>
                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[26]}
                                </p>
                                <p className="mt-2">λ = v × f</p>
                                <p className="mt-2">
                                  λ = {result?.tech_velocity} ×{" "}
                                  {result?.tech_frequency}
                                </p>
                                <p className="mt-2">
                                  λ = <strong>{result?.tech_ans}</strong>
                                </p>
                              </>
                            )}

                            {formData?.tech_find === "frequency" && (
                              <>
                                <p className="mt-2">f = v ÷ λ</p>
                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[26]}
                                </p>
                                <p className="mt-2">f = v ÷ λ</p>
                                <p className="mt-2">
                                  f = {result?.tech_velocity} ÷{" "}
                                  {result?.tech_wavelength}
                                </p>
                                <p className="mt-2">
                                  f = <strong>{result?.tech_ans}</strong>
                                </p>
                              </>
                            )}

                            {formData?.tech_find === "velocity" && (
                              <>
                                <p className="mt-2">v = f × λ</p>
                                <p className="mt-2 font-bold">
                                  {data?.payload?.tech_lang_keys[26]}
                                </p>
                                <p className="mt-2">v = f × λ</p>
                                <p className="mt-2">
                                  v = {result?.tech_frequency} ×{" "}
                                  {result?.tech_wavelength}
                                </p>
                                <p className="mt-2">
                                  v = <strong>{result?.tech_ans}</strong>
                                </p>
                              </>
                            )}
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

export default WavelengthCalculator;
