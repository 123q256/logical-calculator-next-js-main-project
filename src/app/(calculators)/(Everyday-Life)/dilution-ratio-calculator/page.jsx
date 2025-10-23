"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDilutionRatioCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DilutionRatioCalculator = () => {
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
    tech_final_volume: "28",
    tech_final_unit: "liter",
    tech_dilution_ratio: "",
    tech_concentrate_volume: "",
    tech_concentrate_unit: "liter",
    tech_water_volume: "35",
    tech_water_unit: "liter",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDilutionRatioCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_final_volume: formData.tech_final_volume,
        tech_final_unit: formData.tech_final_unit,
        tech_dilution_ratio: formData.tech_dilution_ratio,
        tech_concentrate_volume: formData.tech_concentrate_volume,
        tech_concentrate_unit: formData.tech_concentrate_unit,
        tech_water_volume: formData.tech_water_volume,
        tech_water_unit: formData.tech_water_unit,
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
      tech_final_volume: "28",
      tech_final_unit: "liter",
      tech_dilution_ratio: "",
      tech_concentrate_volume: "",
      tech_concentrate_unit: "liter",
      tech_water_volume: "35",
      tech_water_unit: "liter",
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
    setFormData((prev) => ({ ...prev, tech_final_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_concentrate_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_water_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_final_volume" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_final_volume"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_final_volume}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_final_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm³", value: "cm³" },
                        { label: "dm³", value: "dm³" },
                        { label: "cu in", value: "cu in" },
                        { label: "cu ft", value: "cu ft" },
                        { label: "cu yd", value: "cu yd" },
                        { label: "ml", value: "ml" },
                        { label: "cl", value: "cl" },
                        { label: "liter", value: "liter" },
                        { label: "US gal", value: "US gal" },
                        { label: "UK gal", value: "UK gal" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_dilution_ratio" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dilution_ratio"
                    id="tech_dilution_ratio"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_dilution_ratio}
                    onChange={handleChange}
                  />
                  <span className="input_unit">:1</span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_concentrate_volume" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_concentrate_volume"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_concentrate_volume}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_concentrate_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm³", value: "cm³" },
                        { label: "dm³", value: "dm³" },
                        { label: "cu in", value: "cu in" },
                        { label: "cu ft", value: "cu ft" },
                        { label: "cu yd", value: "cu yd" },
                        { label: "ml", value: "ml" },
                        { label: "cl", value: "cl" },
                        { label: "liter", value: "liter" },
                        { label: "US gal", value: "US gal" },
                        { label: "UK gal", value: "UK gal" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_water_volume" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_water_volume"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_water_volume}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_water_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm³", value: "cm³" },
                        { label: "dm³", value: "dm³" },
                        { label: "cu in", value: "cu in" },
                        { label: "cu ft", value: "cu ft" },
                        { label: "cu yd", value: "cu yd" },
                        { label: "ml", value: "ml" },
                        { label: "cl", value: "cl" },
                        { label: "liter", value: "liter" },
                        { label: "US gal", value: "US gal" },
                        { label: "UK gal", value: "UK gal" },
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="col mt-3">
                          <p className="text-[20px]">
                            <strong>{result?.tech_name1} </strong>
                          </p>
                          <p className="text-[25px] py-2">
                            <strong className="text-[#119154]">
                              {result?.tech_res1}
                            </strong>
                          </p>
                        </div>
                        <div
                          className="col-12 overflow-auto text-[18px]"
                          style={{ overflow: "auto" }}
                        >
                          <table width={765} className="text-[16px]">
                            <thead>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>cm³</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>dm³</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>m³</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>cu in</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>cu ft</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>cu yd</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>ml</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>cl</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>US gal</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>UK gal</strong>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res11 * 1000).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res11 * 1).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res11 * 0.001).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res11 * 61.02).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_res11 * 0.035315
                                  ).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_res11 * 0.001308
                                  ).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res11 * 1000).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res11 * 100).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res11 * 0.26417).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res11 * 0.21997).toFixed(
                                    2
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col mt-3">
                          <p className="text-[20px]">
                            <strong>{result?.tech_name2} </strong>
                          </p>
                          <p className="text-[25px] py-2">
                            <strong className="text-[#119154]">
                              {result?.tech_res2}
                            </strong>
                          </p>
                        </div>
                        <table>
                          <tbody>
                            <tr>
                              <td className="border-b py-2"></td>
                              <td className="border-b py-2"></td>
                            </tr>
                          </tbody>
                        </table>
                        <div
                          className="col-12 overflow-auto text-[18px]"
                          style={{ overflow: "auto" }}
                        >
                          <table width={765} className="text-[16px]">
                            <thead>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>cm³</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>dm³</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>m³</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>cu in</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>cu ft</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>cu yd</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>ml</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>cl</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>US gal</strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>UK gal</strong>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res22 * 1000).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res22 * 1).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res22 * 0.001).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res22 * 61.02).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_res22 * 0.035315
                                  ).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_res22 * 0.001308
                                  ).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res22 * 1000).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res22 * 100).toFixed(2)}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res22 * 0.26417).toFixed(
                                    2
                                  )}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_res22 * 0.21997).toFixed(
                                    2
                                  )}
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

export default DilutionRatioCalculator;
