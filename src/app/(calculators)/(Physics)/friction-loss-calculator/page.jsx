"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useFrictionLossCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FrictionLossCalculator = () => {
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
    tech_pipe_diameter: "12",
    tech_pipe_diameter_unit: "ft",
    tech_pipe_length: "10",
    tech_pipe_length_unit: "cm",
    tech_volumetric: "10",
    tech_volumetric_unit: "US gal/hrn",
    tech_material: "135",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFrictionLossCalculatorMutation();

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
        tech_pipe_diameter: formData.tech_pipe_diameter,
        tech_pipe_diameter_unit: formData.tech_pipe_diameter_unit,
        tech_pipe_length: formData.tech_pipe_length,
        tech_pipe_length_unit: formData.tech_pipe_length_unit,
        tech_volumetric: formData.tech_volumetric,
        tech_volumetric_unit: formData.tech_volumetric_unit,
        tech_material: formData.tech_material,
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
      tech_pipe_diameter: "12",
      tech_pipe_diameter_unit: "ft",
      tech_pipe_length: "10",
      tech_pipe_length_unit: "cm",
      tech_volumetric: "10",
      tech_volumetric_unit: "US gal/hrn",
      tech_material: "135",
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
    setFormData((prev) => ({ ...prev, tech_pipe_diameter_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pipe_length_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_volumetric_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_pipe_diameter" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_pipe_diameter"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_pipe_diameter}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_pipe_diameter_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mm", value: "mm" },
                        { label: "m", value: "m" },
                        { label: "cm", value: "cm" },
                        { label: "in", value: "in" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_pipe_length" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_pipe_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_pipe_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_pipe_length_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mm", value: "mm" },
                        { label: "m", value: "m" },
                        { label: "cm", value: "cm" },
                        { label: "in", value: "in" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_volumetric" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_volumetric"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_volumetric}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_volumetric_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "US gal/s", value: "US gal/s" },
                        { label: "US gal/min", value: "US gal/min" },
                        { label: "US gal/hr", value: "US gal/hr" },
                        { label: "UK gal/s", value: "UK gal/s" },
                        { label: "UK gal/min", value: "UK gal/min" },
                        { label: "UK gal/hr", value: "UK gal/hr" },
                        { label: "ft³/s", value: "ft³/s" },
                        { label: "ft³/min", value: "ft³/min" },
                        { label: "ft³/hr", value: "ft³/hr" },
                        { label: "m³/s", value: "m³/s" },
                        { label: "m³/min", value: "m³/min" },
                        { label: "m³/hr", value: "m³/hr" },
                        { label: "L/s", value: "L/s" },
                        { label: "L/min", value: "L/min" },
                        { label: "L/hr", value: "L/hr" },
                        { label: "ml/min", value: "ml/min" },
                        { label: "ml/hr", value: "ml/hr" },
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
                <label htmlFor="tech_material" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_material"
                    id="tech_material"
                    value={formData.tech_material}
                    onChange={handleChange}
                  >
                    <option value="130">
                      Acrylonitrile Butadiene Styrene (ABS)
                    </option>
                    <option value="140">Aluminium</option>
                    <option value="140">Asbestos Cement</option>
                    <option value="135">Asphalt Lining</option>
                    <option value="135">Brass</option>
                    <option value="95">Brick Sewer</option>
                    <option value="130">Cast Iron - New</option>
                    <option value="110">Cast Iron - 10 years old</option>
                    <option value="94.5">Cast Iron - 20 years old</option>
                    <option value="92.5">Cast Iron - 30 years old</option>
                    <option value="73.5">Cast Iron - 40 years old</option>
                    <option value="100">Cast Iron - Asphalt coated</option>
                    <option value="140">Cast Iron - Bituminous lined</option>
                    <option value="140">Cast Iron - Cement lined</option>
                    <option value="120">Cast Iron - Sea coated</option>
                    <option value="100">Cast Iron - Wrought plain</option>
                    <option value="135">Cement lining</option>
                    <option value="120">Concrete</option>
                    <option value="140">Concrete lined,Steel forms</option>
                    <option value="120">Concrete lined, Wooden forms</option>
                    <option value="105">Concrete, old</option>
                    <option value="135">Copper</option>
                    <option value="60">Corrugated Metal</option>
                    <option value="154">Ductile Iron Pipe (DIP)</option>
                    <option value="120">Ductile Iron, cement lined</option>
                    <option value="140">Fiber</option>
                    <option value="150">Fiberglass - FRP</option>
                    <option value="135">Fire hose - Rubber lined</option>
                    <option value="120">Galvanized Iron</option>
                    <option value="130">Glass</option>
                    <option value="152">HDPE</option>
                    <option value="135">Lead</option>
                    <option value="135">Metal pipes - very smooth</option>
                    <option value="140">Plastic</option>
                    <option value="140">Polyethylene, PE, PEH</option>
                    <option value="150">Polyvinyl chloride, PVC, CPVC</option>
                    <option value="140">Smooth pipes</option>
                    <option value="145">Steel, new unlined</option>
                    <option value="60">Steel, corrugated</option>
                    <option value="110">
                      Steel, interior riveted, no projecting rivets
                    </option>
                    <option value="100">
                      Steel, projecting girth and horizontal rivets
                    </option>
                    <option value="95">Steel, vitrified, spiral-riveted</option>
                    <option value="100">Steel, welded and seamless</option>
                    <option value="130">Tin</option>
                    <option value="110">Vitrified Clay</option>
                    <option value="115">Wood Stave</option>
                    <option value="120">Wooden or Masonry Pipe - Smooth</option>
                    <option value="100">Wrought iron, plain</option>
                  </select>
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
                        <div className="w-full md:w-[90%] lg:w-[80%]  overflow-auto">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[5]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_material}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[6]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_head_loss} (m)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys[7]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {result?.tech_pressure_loss} (bar)
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

export default FrictionLossCalculator;
