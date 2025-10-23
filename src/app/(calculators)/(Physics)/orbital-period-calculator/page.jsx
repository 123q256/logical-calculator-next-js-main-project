"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useOrbitalPeriodCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const OrbitalPeriodcCalculator = () => {
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
    tech_density: "5.51",
    tech_density_unit: "kg/cm³",
    tech_Semi: "3",
    tech_Semi_unit: "m",
    tech_first: "10",
    tech_first_unit: "kg",
    tech_second: "10",
    tech_second_unit: "kg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOrbitalPeriodCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_density) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_Semi: formData.tech_Semi,
        tech_Semi_unit: formData.tech_Semi_unit,
        tech_first: formData.tech_first,
        tech_first_unit: formData.tech_first_unit,
        tech_second: formData.tech_second,
        tech_second_unit: formData.tech_second_unit,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_density: "5.51",
      tech_density_unit: "kg/cm³",
      tech_Semi: "3",
      tech_Semi_unit: "m",
      tech_first: "10",
      tech_first_unit: "kg",
      tech_second: "10",
      tech_second_unit: "kg",
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
    setFormData((prev) => ({ ...prev, tech_density_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_Semi_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_first_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_second_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <p className="col-span-12 text-[18px]">
                <strong>{data?.payload?.tech_lang_keys[1]}</strong>
              </p>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_density" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_density"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_density}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_density_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg/m³", value: "kg/m³" },
                        { label: "lb/ft³", value: "lb/ft³" },
                        { label: "lb/yd³", value: "lb/yd³" },
                        { label: "g/cm³", value: "g/cm³" },
                        { label: "kg/cm³", value: "kg/cm³" },
                        { label: "mg/cm³", value: "mg/cm³" },
                        { label: "g/m³", value: "g/m³" },
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
              <p className="col-span-12 text-[18px]">
                <strong>{data?.payload?.tech_lang_keys[3]}</strong>
              </p>
              <div className="col-span-6">
                <label htmlFor="tech_Semi" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_Semi"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_Semi}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_Semi_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m", value: "m" },
                        { label: "km", value: "km" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
                        { label: "nmi", value: "nmi" },
                        { label: "Ro", value: "Ro" },
                        { label: "ly", value: "ly" },
                        { label: "au", value: "au" },
                        { label: "pcs", value: "pcs" },
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
              <div className="col-span-6">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_first"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_first}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_first_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg", value: "kg" },
                        { label: "t", value: "t" },
                        { label: "lb", value: "lb" },
                        { label: "st", value: "st" },
                        { label: "US ton", value: "US ton" },
                        { label: "long ton", value: "long ton" },
                        { label: "earth", value: "earth" },
                        { label: "sun", value: "sun" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["6"]}
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
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_second_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg", value: "kg" },
                        { label: "t", value: "t" },
                        { label: "lb", value: "lb" },
                        { label: "st", value: "st" },
                        { label: "US ton", value: "US ton" },
                        { label: "long ton", value: "long ton" },
                        { label: "earth", value: "earth" },
                        { label: "sun", value: "sun" },
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
                        <div className="w-full md:w-[60%] lg:w-[60%]  overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[7]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer).toFixed(2)}{" "}
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="col-12 my-3">
                          <strong>{data?.payload?.tech_lang_keys[8]}</strong>
                        </p>
                        <div className="w-full md:w-[80%] lg:w-[60%]  overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer * 3600).toFixed(
                                      2
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer * 60).toFixed(
                                      2
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer / 24).toFixed(
                                      2
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer / 168).toFixed(
                                      2
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer / 730).toFixed(
                                      2
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_answer / 8760).toFixed(
                                      2
                                    )}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="col-12">&nbsp;</p>
                        <div className="w-full md:w-[80%] lg:w-[60%]  overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[16]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_sub_answer).toFixed(2)}{" "}
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="col-12 my-3">
                          <strong>{data?.payload?.tech_lang_keys[8]}</strong>
                        </p>
                        <div className="w-full md:w-[80%] lg:w-[60%]  overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_sub_answer * 3600
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_sub_answer * 60
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_sub_answer / 24
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_sub_answer / 168
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["14"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_sub_answer / 730
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_sub_answer / 8760
                                    ).toFixed(2)}
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

export default OrbitalPeriodcCalculator;
