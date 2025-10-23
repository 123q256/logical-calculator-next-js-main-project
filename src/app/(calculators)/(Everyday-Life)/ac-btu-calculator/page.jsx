"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAcBtuCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ACBTUCalculator = () => {
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
    tech_calculate: "heating", /// heating  ac
    tech_height: 20,
    tech_height_unit: "ft",
    tech_width: 20,
    tech_width_unit: "ft",
    tech_length: 20,
    tech_length_unit: "ft",
    tech_type: "first-floor",
    tech_peoples: 8,
    tech_insulation_condition: "average",
    tech_sun_exposure: "sunny",
    tech_climate: "hot",
    tech_temperature: 20,
    tech_temperature_unit: "ft",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAcBtuCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_calculate ||
      !formData.tech_height ||
      !formData.tech_height_unit ||
      !formData.tech_width ||
      !formData.tech_width_unit ||
      !formData.tech_length ||
      !formData.tech_length_unit ||
      !formData.tech_type ||
      !formData.tech_peoples ||
      !formData.tech_insulation_condition ||
      !formData.tech_sun_exposure ||
      !formData.tech_climate ||
      !formData.tech_temperature ||
      !formData.tech_temperature_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculate: formData.tech_calculate,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_type: formData.tech_type,
        tech_peoples: formData.tech_peoples,
        tech_insulation_condition: formData.tech_insulation_condition,
        tech_sun_exposure: formData.tech_sun_exposure,
        tech_climate: formData.tech_climate,
        tech_temperature: formData.tech_temperature,
        tech_temperature_unit: formData.tech_temperature_unit,
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
      tech_calculate: "heating", /// heating  ac
      tech_height: 20,
      tech_height_unit: "ft",
      tech_width: 20,
      tech_width_unit: "ft",
      tech_length: 20,
      tech_length_unit: "ft",
      tech_type: "first-floor",
      tech_peoples: 8,
      tech_insulation_condition: "average",
      tech_sun_exposure: "sunny",
      tech_climate: "hot",
      tech_temperature: 20,
      tech_temperature_unit: "ft",
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
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temperature_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_calculate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-1">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculate"
                    id="tech_calculate"
                    value={formData.tech_calculate}
                    onChange={handleChange}
                  >
                    <option value="ac">AC BTU</option>
                    <option value="heating">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_length" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_length_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m", value: "m" },
                        { label: "ft", value: "ft" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 tip mt-2">
                <label htmlFor="tech_width" className="label">
                  {data?.payload?.tech_lang_keys["8"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_width_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m", value: "m" },
                        { label: "ft", value: "ft" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ppl mt-2">
                <label htmlFor="tech_height" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_height_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m", value: "m" },
                        { label: "ft", value: "ft" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="bedroom">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="living-room">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="kitchen">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="house">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="first-floor">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="above-floor">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_calculate == "ac" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 peoples">
                    <label htmlFor="tech_peoples" className="label">
                      {data?.payload?.tech_lang_keys["13"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_peoples"
                        id="tech_peoples"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_peoples}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_insulation_condition" className="label">
                  {data?.payload?.tech_lang_keys["14"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_insulation_condition"
                    id="tech_insulation_condition"
                    value={formData.tech_insulation_condition}
                    onChange={handleChange}
                  >
                    <option value="good">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="average">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="poor">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_calculate == "ac" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 sun-exposure">
                    <label htmlFor="tech_sun_exposure" className="label">
                      {data?.payload?.tech_lang_keys["18"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_sun_exposure"
                        id="tech_sun_exposure"
                        value={formData.tech_sun_exposure}
                        onChange={handleChange}
                      >
                        <option value="shaded">
                          {data?.payload?.tech_lang_keys["19"]}
                        </option>
                        <option value="average">
                          {data?.payload?.tech_lang_keys["20"]}
                        </option>
                        <option value="sunny">
                          {data?.payload?.tech_lang_keys["21"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 climate">
                    <label htmlFor="tech_climate" className="label">
                      {data?.payload?.tech_lang_keys["22"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_climate"
                        id="tech_climate"
                        value={formData.tech_climate}
                        onChange={handleChange}
                      >
                        <option value="cold">
                          {data?.payload?.tech_lang_keys["23"]}(e.g. Boston)
                        </option>
                        <option value="average">
                          {data?.payload?.tech_lang_keys["24"]}
                        </option>
                        <option value="hot">
                          {data?.payload?.tech_lang_keys["25"]}(e.g. Houston)
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6 desired-temperature">
                <label htmlFor="tech_temperature" className="label">
                  {data?.payload?.tech_lang_keys["26"]}
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
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_temperature_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m", value: "m" },
                        { label: "ft", value: "ft" },
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <p>
                            <strong>
                              {formData?.tech_calculate === "ac"
                                ? data?.payload?.tech_lang_keys[27]
                                : data?.payload?.tech_lang_keys[28]}
                            </strong>
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">BTU :</td>
                                <td className="border-b py-2">
                                  {result?.tech_total_btu}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">ton :</td>
                                <td className="border-b py-2">
                                  {result?.tech_ton}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">watts :</td>
                                <td className="border-b py-2">
                                  {result?.tech_watts}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">kilowatt :</td>
                                <td className="border-b py-2">
                                  {result?.tech_kilowatts}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">hp(I) :</td>
                                <td className="border-b py-2">
                                  {result?.tech_hp_i}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">hp(E) :</td>
                                <td className="border-b py-2">
                                  {result?.tech_hp_e}
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

export default ACBTUCalculator;
