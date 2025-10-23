"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useLoveCalculatorCalculationMutation,
  useYardsToTonsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const YardsToTonsCalculator = () => {
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
    tech_thickness_unit: 18.728,
    tech_density: 124,
    tech_density_unit: "kg/m³", // lb/ft³  kg/m³
    tech_cubic_yards: 73,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useYardsToTonsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_thickness_unit ||
      !formData.tech_density ||
      !formData.tech_density_unit ||
      !formData.tech_cubic_yards
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_thickness_unit: formData.tech_thickness_unit,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_cubic_yards: formData.tech_cubic_yards,
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
      tech_thickness_unit: 18.728,
      tech_density: 124,
      tech_density_unit: "kg/m³", // lb/ft³  kg/m³
      tech_cubic_yards: 73,
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
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_thickness_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (
                  {data?.payload?.tech_lang_keys["2"]}):
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_thickness_unit"
                    id="tech_thickness_unit"
                    value={formData.tech_thickness_unit}
                    onChange={handleChange}
                  >
                    {[
                      { name: "Own Density", value: "45" },
                      { name: "Asphalt (crushed)", value: "65" },
                      { name: "Asphalt (liquid)", value: "94" },
                      { name: "Cement (portland)", value: "145" },
                      { name: "Concrete", value: "72" },
                      { name: "Dirt", value: "85" },
                      { name: "Gravel (loose, dry)", value: "105" },
                      { name: "Gravel (dry, 1/4 to 2 in)", value: "125" },
                      { name: "Gravel (wet 1/4 to 2 in)", value: "120" },
                      { name: "Gravel (with sand)", value: "90" },
                      { name: "Limestone (crushed)", value: "120" },
                      { name: "Limestone (low density)", value: "160" },
                      { name: "Limestone (high density)", value: "18.728" },
                      { name: "Mulch (bark)", value: "24.97" },
                      { name: "Mulch (woodchip)", value: "100" },
                      { name: "Sand (dry)", value: "90" },
                      { name: "Sand (loose)", value: "120" },
                      { name: "Sand (wet)", value: "100" },
                      { name: "Topsoil", value: "115" },
                      { name: "Topsoil (saturated)", value: "" },
                    ].map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_density" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
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
                        { label: "lb/ft³", value: "lb/ft³" },
                        { label: "kg/m³", value: "kg/m³" },
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
              <div className="col-span-12">
                <label htmlFor="tech_cubic_yards" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cubic_yards"
                    id="tech_cubic_yards"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_cubic_yards}
                    onChange={handleChange}
                  />
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  items-center ">
                    <div className="grid grid-cols-12 gap-4 mt-5">
                      <div className="col-span-12 md:col-span-4 lg:col-span-4 border-r">
                        <p className="text-[25px]  px-lg-0 py-1">
                          <strong className="text-[#119154]">
                            {Number(result?.tech_tons).toFixed(2)}
                          </strong>{" "}
                          <span className="text-[18px]">
                            {" "}
                            {data?.payload?.tech_lang_keys["6"]}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-4 border-r">
                        <p className="text-[25px]  py-1">
                          <strong className="text-[#119154]">
                            {Number(result?.tech_metric_tonnes).toFixed(2)}
                          </strong>{" "}
                          <span className="text-[18px]">
                            {" "}
                            {data?.payload?.tech_lang_keys["7"]}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <p className="text-[25px]  py-1">
                          <strong className="text-[#119154]">
                            {Number(result?.tech_pounds).toFixed(2)}
                          </strong>{" "}
                          <span className="text-[18px]">
                            {" "}
                            {data?.payload?.tech_lang_keys["8"]}
                          </span>
                        </p>
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

export default YardsToTonsCalculator;
