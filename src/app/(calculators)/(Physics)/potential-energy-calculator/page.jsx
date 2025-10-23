"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePotentialEnergyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PotentialEnergyCalculator = () => {
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
    tech_cal: "mass", //mass   gravity  height    pe
    tech_pe: 50,
    tech_pe_unit: "j",
    tech_mass: "50",
    tech_mass_unit: "earths",
    tech_gravity: 9.80665,
    tech_gravity_unit: "mi_h_s",
    tech_height: 5,
    tech_height_unit: "mi",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePotentialEnergyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal: formData.tech_cal,
        tech_pe: formData.tech_pe,
        tech_pe_unit: formData.tech_pe_unit,
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_gravity: formData.tech_gravity,
        tech_gravity_unit: formData.tech_gravity_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
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
      tech_cal: "mass", //mass   gravity  height    pe
      tech_pe: 50,
      tech_pe_unit: "j",
      tech_mass: "50",
      tech_mass_unit: "earths",
      tech_gravity: 9.80665,
      tech_gravity_unit: "mi_h_s",
      tech_height: 5,
      tech_height_unit: "mi",
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
    setFormData((prev) => ({ ...prev, tech_pe_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mass_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_gravity_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_cal" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal"
                    id="tech_cal"
                    value={formData.tech_cal}
                    onChange={handleChange}
                  >
                    <option value="mass">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="gravity">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="height">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="pe">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_cal == "mass" ||
                formData.tech_cal == "gravity" ||
                formData.tech_cal == "height") && (
                <>
                  <div className="space-y-2 " id="pes">
                    <label htmlFor="tech_pe" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_pe"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_pe}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_pe_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "j", value: "j" },
                            { label: "kJ", value: "kJ" },
                            { label: "MJ", value: "MJ" },
                            { label: "Wh", value: "Wh" },
                            { label: "kWh", value: "kWh" },
                            { label: "ft-lbs", value: "ft_lbs" },
                            { label: "kcal", value: "kcal" },
                            { label: "eV", value: "eV" },
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
              {(formData.tech_cal == "pe" ||
                formData.tech_cal == "gravity" ||
                formData.tech_cal == "height") && (
                <>
                  <div className="space-y-2 " id="masss">
                    <label htmlFor="tech_mass" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mass"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mass}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_mass_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "µg", value: "µg" },
                            { label: "mg", value: "mg" },
                            { label: "g", value: "g" },
                            { label: "dag", value: "dag" },
                            { label: "kg", value: "kg" },
                            { label: "t", value: "t" },
                            { label: "gr", value: "gr" },
                            { label: "dr", value: "dr" },
                            { label: "oz", value: "oz" },
                            { label: "lb", value: "lb" },
                            { label: "stone", value: "stone" },
                            { label: "US ton", value: "us_ton" },
                            { label: "Long ton", value: "long_ton" },
                            { label: "Earths", value: "earths" },
                            { label: "me", value: "me" },
                            { label: "u", value: "u" },
                            { label: "oz t", value: "oz_t" },
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
              {(formData.tech_cal == "pe" ||
                formData.tech_cal == "mass" ||
                formData.tech_cal == "height") && (
                <>
                  <div className="space-y-2 " id="gravitys">
                    <label htmlFor="tech_gravity" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_gravity"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_gravity}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_gravity_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s²", value: "m_s2" },
                            { label: "cm/s²", value: "cm_s2" },
                            { label: "in/s²", value: "in_s2" },
                            { label: "mi/h/s", value: "mi_h_s" },
                            { label: "g²", value: "g" },
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
              {(formData.tech_cal == "pe" ||
                formData.tech_cal == "mass" ||
                formData.tech_cal == "gravity") && (
                <>
                  <div className="space-y-2 " id="heights">
                    <label htmlFor="tech_height" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
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
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_height_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "nmi", value: "nmi" },

                            { label: "g²", value: "g" },
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
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className="lg:w-2/5 mt-2 overflow-auto">
                        <table className="w-full text-lg">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b w-7/10">
                                <strong>{result?.tech_cal} </strong>
                              </td>
                              <td className="py-2 border-b">
                                <strong>
                                  {Number(result?.tech_ans).toFixed(4)}
                                  <span className="text-2xl">
                                    {result?.tech_unit}
                                  </span>
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-lg">
                        <div className="w-full">
                          <p className="w-full mt-2">
                            {data?.payload?.tech_lang_keys[6]}:
                          </p>

                          {result?.tech_cal === "mass" && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </p>
                              <p className="mt-2">m = PE * g * h</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[8]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                PE = {result.tech_pe}, g = {result.tech_g}, h ={" "}
                                {result.tech_h}, m = ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[9]}
                                </strong>
                              </p>
                              <p className="mt-2">m = PE * g * h</p>
                              <p className="mt-2">
                                m = {result.tech_pe} * {result.tech_g} *{" "}
                                {result.tech_h}
                              </p>
                              <p className="mt-2">
                                m = <strong>{result.tech_ans}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_cal === "gravity" && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </p>
                              <p className="mt-2">g = PE * m * h</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[8]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                PE = {result.tech_pe}, m = {result.tech_m}, h ={" "}
                                {result.tech_h}, g = ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[9]}
                                </strong>
                              </p>
                              <p className="mt-2">g = PE * m * h</p>
                              <p className="mt-2">
                                g = {result.tech_pe} * {result.tech_m} *{" "}
                                {result.tech_h}
                              </p>
                              <p className="mt-2">
                                g = <strong>{result.tech_ans}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_cal === "height" && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </p>
                              <p className="mt-2">h = PE * m * g</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[8]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                PE = {result.tech_pe}, m = {result.tech_m}, g ={" "}
                                {result.tech_g}, h = ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[9]}
                                </strong>
                              </p>
                              <p className="mt-2">h = PE * m * g</p>
                              <p className="mt-2">
                                h = {result.tech_pe} * {result.tech_m} *{" "}
                                {result.tech_g}
                              </p>
                              <p className="mt-2">
                                h = <strong>{result.tech_ans}</strong>
                              </p>
                            </>
                          )}

                          {result?.tech_cal === "pe" && (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </p>
                              <p className="mt-2">PE = m * g * h</p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[8]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                m = {result.tech_m}, g = {result.tech_g}, h ={" "}
                                {result.tech_h}, PE = ?
                              </p>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[9]}
                                </strong>
                              </p>
                              <p className="mt-2">PE = m * g * h</p>
                              <p className="mt-2">
                                PE = {result.tech_m} * {result.tech_g} *{" "}
                                {result.tech_h}
                              </p>
                              <p className="mt-2">
                                PE = <strong>{result.tech_ans}</strong>
                              </p>
                            </>
                          )}
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

export default PotentialEnergyCalculator;
