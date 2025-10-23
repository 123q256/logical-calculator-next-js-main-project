"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePhotonEnergyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PhotonEnergyCalculator = () => {
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
    tech_wave: "8",
    tech_width_units: "μm",
    tech_freq: "16",
    tech_unit_f: "MHz",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePhotonEnergyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_wave ||
      !formData.tech_width_units ||
      !formData.tech_freq ||
      !formData.tech_unit_f
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_wave: formData.tech_wave,
        tech_width_units: formData.tech_width_units,
        tech_freq: formData.tech_freq,
        tech_unit_f: formData.tech_unit_f,
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
      tech_wave: "8",
      tech_width_units: "μm",
      tech_freq: "16",
      tech_unit_f: "MHz",
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
    setFormData((prev) => ({ ...prev, tech_width_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_f: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <p className="col-span-12">
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys[1]}:
                </strong>
                {data?.payload?.tech_lang_keys[2]}.
              </p>
              <div className="col-span-12 ">
                <label htmlFor="tech_wave" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (λ):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_wave"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_wave}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_width_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "Å", value: "Å" },
                        { label: "mm", value: "mm" },
                        { label: "μm", value: "μm" },
                        { label: "nm", value: "nm" },
                        { label: "m", value: "m" },
                        { label: "km", value: "km" },
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
              <div className="col-span-12 ">
                <label htmlFor="tech_freq" className="label">
                  {data?.payload?.tech_lang_keys["4"]} (f):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_freq"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_freq}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_unit_f} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "Hz", value: "Hz" },
                        { label: "kHz", value: "kHz" },
                        { label: "MHz", value: "MHz" },
                        { label: "GHz", value: "GHz" },
                        { label: "THz", value: "THz" },
                        { label: "RPM", value: "RPM" },
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="flex flex-col items-center  rounded-lg p-1">
                    {/* First Table */}
                    <div className="w-full  mt-4">
                      <div className="md:p-4  overflow-auto">
                        <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b w-[40%]">
                                <strong>
                                  {data?.payload?.tech_lang_keys[5]}
                                </strong>
                              </td>

                              <td className="py-2 border-b flex space-x-2">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_energy,
                                  }}
                                />
                                joules
                              </td>
                            </tr>
                            {isNumeric(formData?.tech_wave) && (
                              <tr>
                                <td className="py-2 border-b w-[40%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[4]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_frequency} Hz
                                </td>
                              </tr>
                            )}
                            {isNumeric(formData?.tech_freq) && (
                              <tr>
                                <td className="py-2 border-b w-[40%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[3]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_wave} m
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Second Table */}
                    <div className="w-full  mt-2">
                      <div className="md:p-4 overflow-auto ">
                        <p className="mb-3">
                          <strong>{data?.payload?.tech_lang_keys[6]}:</strong>
                        </p>
                        <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b w-[40%]">
                                {data?.payload?.tech_lang_keys[5]}
                              </td>
                              <td className="py-2 border-b">
                                <strong>{result?.tech_en * 6.242e18} eV</strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-[40%]">
                                {data?.payload?.tech_lang_keys[5]}
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {result?.tech_en * 6.242e15} keV
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-[40%]">
                                {data?.payload?.tech_lang_keys[5]}
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {result?.tech_en * 6.242e12} MeV
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-[40%]">
                                {data?.payload?.tech_lang_keys[5]}
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {result?.tech_en * 6.242e24} μeV
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-[40%]">
                                {data?.payload?.tech_lang_keys[5]}
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {result?.tech_en * 6.242e21} meV
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b w-[40%]">
                                {data?.payload?.tech_lang_keys[5]}
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {result?.tech_en * 6.242e27} neV
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

export default PhotonEnergyCalculator;
