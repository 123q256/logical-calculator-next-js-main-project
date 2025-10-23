"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useReynoldsNumberCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ReynoldsNumberCalculator = () => {
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
    tech_fluid_substance: "1060|0.0035|0.000003302",
    tech_fluid_density: "1060",
    tech_fluid_density_unit: "lb/cu ft",
    tech_dynamic_velocity: "0.0035",
    tech_dynamic_velocity_unit: "lb-fts",
    tech_fluid_velocity: "5",
    tech_fluid_velocity_unit: "mi-h",
    tech_linear_dimension: "5",
    tech_linear_dimension_unit: "in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useReynoldsNumberCalculatorMutation();

  const [inputsDisabled, setInputsDisabled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_fluid_substance") {
      if (value === "custom") {
        // Enable and clear inputs
        setFormData((prevData) => ({
          ...prevData,
          tech_fluid_substance: value,
          tech_fluid_density: "",
          tech_dynamic_velocity: "",
        }));
        setInputsDisabled(false);
      } else {
        const [density, dynamicViscosity] = value.split("|");
        setFormData((prevData) => ({
          ...prevData,
          tech_fluid_substance: value,
          tech_fluid_density: density,
          tech_dynamic_velocity: dynamicViscosity,
        }));
        setInputsDisabled(true);
      }
      setResult(null);
      setFormError(null);
      return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_fluid_substance) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_fluid_substance: formData.tech_fluid_substance,
        tech_fluid_density: formData.tech_fluid_density,
        tech_fluid_density_unit: formData.tech_fluid_density_unit,
        tech_dynamic_velocity: formData.tech_dynamic_velocity,
        tech_dynamic_velocity_unit: formData.tech_dynamic_velocity_unit,
        tech_fluid_velocity: formData.tech_fluid_velocity,
        tech_fluid_velocity_unit: formData.tech_fluid_velocity_unit,
        tech_linear_dimension: formData.tech_linear_dimension,
        tech_linear_dimension_unit: formData.tech_linear_dimension_unit,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_fluid_substance: "1060|0.0035|0.000003302",
      tech_fluid_density: "1060",
      tech_fluid_density_unit: "lb/cu ft",
      tech_dynamic_velocity: "0.0035",
      tech_dynamic_velocity_unit: "lb-fts",
      tech_fluid_velocity: "5",
      tech_fluid_velocity_unit: "mi-h",
      tech_linear_dimension: "5",
      tech_linear_dimension_unit: "in",
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
    setFormData((prev) => ({ ...prev, tech_fluid_density_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dynamic_velocity_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fluid_velocity_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_linear_dimension_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_fluid_substance" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_fluid_substance"
                    id="tech_fluid_substance"
                    value={formData.tech_fluid_substance}
                    onChange={handleChange}
                  >
                    <option value="custom">
                      {data?.payload?.tech_lang_keys[2]}
                    </option>
                    <option value="1.225|0.0000181|0.000014776">
                      {data?.payload?.tech_lang_keys[3]} (15 °C)
                    </option>
                    <option value="1.184|0.0000186|0.00001571">
                      {data?.payload?.tech_lang_keys[3]} (25 °C)
                    </option>
                    <option value="999.7|0.001308|0.0000013084">
                      {data?.payload?.tech_lang_keys[4]} (10 °C)
                    </option>
                    <option value="988|0.0005471|0.0000005537">
                      {data?.payload?.tech_lang_keys[4]} (50 °C)
                    </option>
                    <option value="965.3|0.000315|0.0000003263">
                      {data?.payload?.tech_lang_keys[4]} (90 °C)
                    </option>
                    <option value="1060|0.0035|0.000003302">
                      {data?.payload?.tech_lang_keys[5]} (37 °C)
                    </option>
                    <option value="1450|0.006|0.000004138">
                      {data?.payload?.tech_lang_keys[6]}
                    </option>
                    <option value="1082|0.25|0.00023104">
                      {data?.payload?.tech_lang_keys[7]}
                    </option>
                    <option value="791|0.000306|0.00000038685">
                      {data?.payload?.tech_lang_keys[8]} (25 °C)
                    </option>
                    <option value="789|0.001074|0.0000013612">
                      {data?.payload?.tech_lang_keys[9]} (25 °C)
                    </option>
                    <option value="13600|0.001526|0.0000001122">
                      {data?.payload?.tech_lang_keys[10]} (25 °C)
                    </option>
                    <option value="807|0.000158|0.0000001958">
                      {data?.payload?.tech_lang_keys[11]} ( -196 °C)
                    </option>
                    <option value="920|0.081|0.00008804">
                      {data?.payload?.tech_lang_keys[12]} (25 °C)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_fluid_density" className="label">
                  {data?.payload?.tech_lang_keys["13"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_fluid_density"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_fluid_density}
                    placeholder="00"
                    onChange={handleChange}
                    disabled={inputsDisabled}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_fluid_density_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg/m³", value: "kg/m³" },
                        { label: "kg/dm³", value: "kg/dm³" },
                        { label: "t/m³", value: "t/m³" },
                        { label: "g/cm³", value: "g/cm³" },
                        { label: "oz/cu in", value: "oz/cu in" },
                        { label: "lb/cu in", value: "lb/cu in" },
                        { label: "lb/cu ft", value: "lb/cu ft" },
                        { label: "lb/cu yd", value: "lb/cu yd" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_dynamic_velocity" className="label">
                  {data?.payload?.tech_lang_keys["14"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_dynamic_velocity"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_dynamic_velocity}
                    placeholder="00"
                    onChange={handleChange}
                    disabled={inputsDisabled}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_dynamic_velocity_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg-m-s", value: "kg-m-s" },
                        { label: "p", value: "p" },
                        { label: "cp", value: "cp" },
                        { label: "mpas", value: "mpas" },
                        { label: "pas", value: "pas" },
                        { label: "slug", value: "slug" },
                        { label: "lbfs-ft2", value: "lbfs-ft2" },
                        { label: "lb-fts", value: "lb-fts" },
                        { label: "dynas-cm2", value: "dynas-cm2" },
                        { label: "g-cms", value: "g-cms" },
                        { label: "reyn", value: "reyn" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_fluid_velocity" className="label">
                  {data?.payload?.tech_lang_keys["15"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_fluid_velocity"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_fluid_velocity}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_fluid_velocity_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m-s", value: "m-s" },
                        { label: "km-h", value: "km-h" },
                        { label: "ft/s", value: "ft/s" },
                        { label: "mi-h", value: "mi-h" },
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
                <label htmlFor="tech_linear_dimension" className="label">
                  {data?.payload?.tech_lang_keys["16"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_linear_dimension"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_linear_dimension}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_linear_dimension_unit} ▾
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
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                        <table className="w-full font-s-18">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[17]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_kinematic} m²/s
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[18]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(result?.tech_reynolds)}{" "}
                                {result?.tech_reynolds < 2100
                                  ? data?.payload?.tech_lang_keys[19]
                                  : result?.tech_reynolds >= 2100 &&
                                    result?.tech_reynolds < 3000
                                  ? data?.payload?.tech_lang_keys[20]
                                  : result?.tech_reynolds >= 3000
                                  ? data?.payload?.tech_lang_keys[21]
                                  : ""}
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

export default ReynoldsNumberCalculator;
