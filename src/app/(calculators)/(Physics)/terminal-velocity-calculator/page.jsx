"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTerminalVelocityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TerminalVelocityCalculator = () => {
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
    tech_shapes: "1", // 1 2 3 4 5 6 7
    tech_mass: 75,
    tech_mass_unit: "oz",
    tech_area: 75,
    tech_area_unit: "yd²",
    tech_drag_coefficient: 1.05,
    tech_density: 75,
    tech_density_unit: "kg/cm³",
    tech_gravity: 75,
    tech_gravity_unit: "ft/s²",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTerminalVelocityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let dragValue = "";

    // Set shape value in formData
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Determine drag coefficient based on selected shape
    if (value === "1") {
      dragValue = "0.47";
    } else if (value === "2") {
      dragValue = "0.389";
    } else if (value === "3") {
      dragValue = "0.3275";
    } else if (value === "4") {
      dragValue = "0.42";
    } else if (value === "5") {
      dragValue = "1.05";
    } else if (value === "6") {
      dragValue = "0.8";
    } else if (value === "7") {
      dragValue = "0.04";
    }

    // Set drag coefficient in formData
    setFormData((prevData) => ({
      ...prevData,
      tech_drag_coefficient: dragValue,
    }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_shapes) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_shapes: formData.tech_shapes,
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_drag_coefficient: formData.tech_drag_coefficient,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_gravity: formData.tech_gravity,
        tech_gravity_unit: formData.tech_gravity_unit,
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
      tech_shapes: "1", // 1 2 3 4 5 6 7
      tech_mass: 75,
      tech_mass_unit: "oz",
      tech_area: 75,
      tech_area_unit: "yd²",
      tech_drag_coefficient: 1.05,
      tech_density: 75,
      tech_density_unit: "kg/cm³",
      tech_gravity: 75,
      tech_gravity_unit: "ft/s²",
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
    setFormData((prev) => ({ ...prev, tech_mass_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_density_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_gravity_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <div className="grid grid-cols-12   mt-3  gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_shapes" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_shapes"
                        id="tech_shapes"
                        value={formData.tech_shapes}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["7"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["9"]}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["10"]}
                        </option>
                        <option value="5">
                          {data?.payload?.tech_lang_keys["11"]}
                        </option>
                        <option value="6">
                          {data?.payload?.tech_lang_keys["12"]}
                        </option>
                        <option value="7">
                          {data?.payload?.tech_lang_keys["13"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12">
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
                        onClick={toggleDropdown}
                      >
                        {formData.tech_mass_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mg", value: "mg" },
                            { label: "g", value: "g" },
                            { label: "kg", value: "kg" },
                            { label: "t", value: "t" },
                            { label: "gr", value: "gr" },
                            { label: "oz", value: "oz" },
                            { label: "lb", value: "lb" },
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
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 text-center flex items-center justify-center">
                {formData.tech_shapes == "1" && (
                  <>
                    <img
                      src="/images/sph.png"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_shapes == "2" && (
                  <>
                    <img
                      src="/images/golfball.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_shapes == "3" && (
                  <>
                    <img
                      src="/images/baseball.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_shapes == "4" && (
                  <>
                    <img
                      src="/images/halfsphere.png"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_shapes == "5" && (
                  <>
                    <img
                      src="/images/cubee.png"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_shapes == "6" && (
                  <>
                    <img
                      src="/images/angledcube.png"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />
                  </>
                )}
                {formData.tech_shapes == "7" && (
                  <>
                    <img
                      src="/images/streamlinedbody.png"
                      alt="Flow Rate Calculator"
                      width="50"
                      height="90"
                      className="change_img"
                    />
                  </>
                )}
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 px-2">
                <label htmlFor="tech_area" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (A):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_area"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_area}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_area_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mm²", value: "mm²" },
                        { label: "cm²", value: "cm²" },
                        { label: "m²", value: "m²" },
                        { label: "in²", value: "in²" },
                        { label: "yd²", value: "yd²" },
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

              <div className="lg:col-span-6 md:col-span-6 col-span-12 px-2">
                <label htmlFor="tech_drag_coefficient" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_drag_coefficient"
                    id="tech_drag_coefficient"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_drag_coefficient}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 px-2">
                <label htmlFor="tech_density" className="label">
                  {data?.payload?.tech_lang_keys["5"]} (ρ):
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
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_density_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg/m³", value: "kg/m³" },
                        { label: "lb cu/ft", value: "lb cu/ft" },
                        { label: "g/cm³", value: "g/cm³" },
                        { label: "kg/cm³", value: "kg/cm³" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12 px-2">
                <label htmlFor="tech_gravity" className="label">
                  {data?.payload?.tech_lang_keys["6"]} (g):
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
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_gravity_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m/s²", value: "m/s²" },
                        { label: "ft/s²", value: "ft/s²" },
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%]  mt-2 overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys[14]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(
                                      result?.tech_terminal_velocity
                                    ).toFixed(5)}{" "}
                                    (m/s)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue py-2 border-b">
                                  {data?.payload?.tech_lang_keys[15]}
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {Number(
                                      result?.tech_drag_coefficient_area
                                    ).toFixed(5)}{" "}
                                    (m²)
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

export default TerminalVelocityCalculator;
