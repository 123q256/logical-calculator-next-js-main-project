"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useSolutionDilutionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SolutionDilutionCalculator = () => {
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
    tech_concentration: 4,
    tech_concentration_unit: "M",
    tech_volume: 45,
    tech_volume_unit: "l",
    tech_final: 3,
    tech_final_unit: "M",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSolutionDilutionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_concentration ||
      !formData.tech_concentration_unit ||
      !formData.tech_volume ||
      !formData.tech_volume_unit ||
      !formData.tech_final ||
      !formData.tech_final_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_concentration: formData.tech_concentration,
        tech_concentration_unit: formData.tech_concentration_unit,
        tech_volume: formData.tech_volume,
        tech_volume_unit: formData.tech_volume_unit,
        tech_final: formData.tech_final,
        tech_final_unit: formData.tech_final_unit,
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
      tech_concentration: 4,
      tech_concentration_unit: "M",
      tech_volume: 45,
      tech_volume_unit: "l",
      tech_final: 3,
      tech_final_unit: "M",
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
    setFormData((prev) => ({ ...prev, tech_concentration_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_volume_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_final_unit: unit }));
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
            <div className="grid grid-cols-12 gap-1   md:gap-2">
              <div className="col-span-12 md:col-span-6 ">
                <label htmlFor="tech_concentration" className="label">
                  {data?.payload?.tech_lang_keys["1"]}{" "}
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_concentration"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_concentration}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_concentration_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "M", value: "M" },
                        { label: "mM", value: "mM" },
                        { label: "μM", value: "μM" },
                        { label: "nM", value: "nM" },
                        { label: "pM", value: "pM" },
                        { label: "fM", value: "fM" },
                        { label: "aM", value: "aM" },
                        { label: "zM", value: "zM" },
                        { label: "yM", value: "yM" },
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
              <div className="col-span-12 md:col-span-6 ">
                <label htmlFor="tech_volume" className="label">
                  {data?.payload?.tech_lang_keys["3"]}{" "}
                  {data?.payload?.tech_lang_keys["2"]}
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
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_volume_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cubic millimeters (mm³)", value: "mm³" },
                        { label: "cubic centimeters (cm³)", value: "cm³" },
                        { label: "cubic decimeters (dm³)", value: "dm³" },
                        { label: "cubic meters (m³)", value: "m³" },
                        { label: "cubic inches (in³)", value: "in³" },
                        { label: "cubic feet (ft³)", value: "ft³" },
                        { label: "cubic yards (yd³)", value: "yd³" },
                        { label: "milliliters (ml)", value: "ml" },
                        { label: "centiliters (cl)", value: "cl" },
                        { label: "liters (l)", value: "l" },
                        { label: "US gallons (US gal)", value: "US gal" },
                        { label: "UK gallons (UK gal)", value: "UK gal" },
                        {
                          label: "US fluid ounces (US fl oz)",
                          value: "US fl oz",
                        },
                        {
                          label: "UK fluid ounces (UK fl oz)",
                          value: "UK fl oz",
                        },
                        { label: "cups", value: "cups" },
                        { label: "tablespoon (tbsp)", value: "tbsp" },
                        { label: "US liquid quart (US qt)", value: "US qt" },
                        { label: "UK liquid quart (UK qt)", value: "UK qt" },
                        { label: "US pints (US pt)", value: "US pt" },
                        { label: "UK pints (UK pt)", value: "UK pt" },
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
              <div className="col-span-12 md:col-span-6 ">
                <label htmlFor="tech_final" className="label">
                  {data?.payload?.tech_lang_keys["1"]}{" "}
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_final"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_final}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_final_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "M", value: "M" },
                        { label: "mM", value: "mM" },
                        { label: "μM", value: "μM" },
                        { label: "nM", value: "nM" },
                        { label: "pM", value: "pM" },
                        { label: "fM", value: "fM" },
                        { label: "aM", value: "aM" },
                        { label: "zM", value: "zM" },
                        { label: "yM", value: "yM" },
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
                        <div className="d-flex flex-column flex-md-row items-center bg-sky bordered rounded-lg  px-3 py-2">
                          <strong className="pe-md-3">
                            {data?.payload?.tech_lang_keys["3"]} (
                            {data?.payload?.tech_lang_keys["4"]}) =
                          </strong>
                          <strong className="text-[#119154] text-[28px]">
                            {result?.tech_answer}{" "}
                            <span className="text-[16px]">
                              {data?.payload?.tech_lang_keys["6"]}
                            </span>
                          </strong>
                        </div>
                        <p className="mt-2 mb-3">
                          <strong>
                            {data?.payload?.tech_lang_keys["3"]} (
                            {data?.payload?.tech_lang_keys["4"]}){" "}
                            {data?.payload?.tech_lang_keys["5"]}
                          </strong>
                        </p>
                        <div className="w-full overflow-auto">
                          <table className="w-full" cellSpacing="0">
                            <thead>
                              <tr className="bg-sky bordered">
                                <td className="border p-2">
                                  <strong className="text-blue">mm³</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">cm³</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">dm³</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">m³</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 1e6}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 1000}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 1}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer / 1000}
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-sky bordered">
                                <td className="border p-2">
                                  <strong className="text-blue">in³</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">ft³</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">yd³</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">ml</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 61.024}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer / 28.317}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer / 764.6}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 1000}
                                </td>
                              </tr>
                              <tr className="bg-sky bordered">
                                <td className="border p-2">
                                  <strong className="text-blue">cl</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">tsp</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">US gal</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">UK gal</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 100}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 202.9}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer / 3.785}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer / 4.546}
                                </td>
                              </tr>
                              <tr className="bg-sky bordered">
                                <td className="border p-2">
                                  <strong className="text-blue">
                                    US fl oz
                                  </strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">
                                    UK fl oz
                                  </strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">cups</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">tbsp</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 33.814}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 35.195}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 4.227}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 66.6667}
                                </td>
                              </tr>
                              <tr className="bg-sky bordered">
                                <td className="border p-2">
                                  <strong className="text-blue">US qt</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">UK qt</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">US pt</strong>
                                </td>
                                <td className="border p-2">
                                  <strong className="text-blue">UK pt</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 1.057}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer / 1.136}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 2.113376}
                                </td>
                                <td className="bg-white border p-2">
                                  {result?.tech_answer * 1.759754}
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

export default SolutionDilutionCalculator;
