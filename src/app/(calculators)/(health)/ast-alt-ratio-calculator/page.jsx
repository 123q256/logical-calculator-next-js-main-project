"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useLoveCalculatorCalculationMutation,
  useAstAltRatioCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AstAltRatioCalculator = () => {
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
    tech_ast: "12",
    tech_ast_unit: "U / cu ft",
    tech_alt: "1",
    tech_alt_unit: "U / ml",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAstAltRatioCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_ast ||
      !formData.tech_ast_unit ||
      !formData.tech_alt ||
      !formData.tech_alt_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_ast: formData.tech_ast,
        tech_ast_unit: formData.tech_ast_unit,
        tech_alt: formData.tech_alt,
        tech_alt_unit: formData.tech_alt_unit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_ast: "12",
      tech_ast_unit: "U / cu ft",
      tech_alt: "1",
      tech_alt_unit: "U / ml",
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
    setFormData((prev) => ({ ...prev, tech_ast_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_alt_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  // result

  const ratio = result?.tech_ratio;

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_ast" className="label">
                  AST{" "}
                  <span
                    className="bg-white radius-circle px-2"
                    title="Aspartate transaminase<br>(AspAT/SGOT/ASAT/AAT/GOT)"
                  >
                    ?
                  </span>
                  :
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_ast"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_ast}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_ast_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: "U / millimeters cube (mm³)",
                          value: "U / mm³",
                        },
                        {
                          label: "U / centimeters cube (cm³)",
                          value: "U / cm³",
                        },
                        {
                          label: "U / decimeters cube (dm³)",
                          value: "U / dm³",
                        },
                        {
                          label: "U / cubic inches (cu in)",
                          value: "U / cu in",
                        },
                        { label: "U / cubic feet (cu ft)", value: "U / cu ft" },
                        { label: "U / milliliters (ml)", value: "U / ml" },
                        { label: "U / centiliters (cl)", value: "U / cl" },
                        { label: "U / liter", value: "U / liter" },
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
                <label htmlFor="tech_alt" className="label">
                  ALT{" "}
                  <span
                    className="bg-white radius-circle px-2"
                    title="Alanine transaminase / alanine aminotransferase<br>(ALAT/SGPT)"
                  >
                    ?
                  </span>
                  :
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_alt"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_alt}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_alt_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: "U / millimeters cube (mm³)",
                          value: "U / mm³",
                        },
                        {
                          label: "U / centimeters cube (cm³)",
                          value: "U / cm³",
                        },
                        {
                          label: "U / decimeters cube (dm³)",
                          value: "U / dm³",
                        },
                        {
                          label: "U / cubic inches (cu in)",
                          value: "U / cu in",
                        },
                        { label: "U / cubic feet (cu ft)", value: "U / cu ft" },
                        { label: "U / milliliters (ml)", value: "U / ml" },
                        { label: "U / centiliters (cl)", value: "U / cl" },
                        { label: "U / liter", value: "U / liter" },
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="col-12">
                        <p>
                          <strong>
                            {data?.payload?.tech_lang_keys["ratio"]}
                          </strong>
                        </p>

                        <p>
                          <strong className="text-[30px] text-[#119154]">
                            {result?.tech_ratio}
                          </strong>
                        </p>

                        <p>
                          <strong>{result?.tech_m3}</strong>
                        </p>

                        {ratio >= 2 && (
                          <p>{data?.payload?.tech_lang_keys["suggest"]}</p>
                        )}

                        <div className="col s12 overflow-auto mt-2">
                          <table
                            className="w-full md:w-[100%] lg:w-[90%]"
                            cellSpacing="0"
                          >
                            <thead>
                              <tr id="first_row">
                                <th className="border-b py-2 text-left">
                                  <strong>Name</strong>
                                </th>
                                <th className="border-b py-2 text-left">
                                  <strong>Value</strong>
                                </th>
                                <th className="border-b py-2 text-left">
                                  <strong>Result</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b py-2">AST</td>
                                <td className="border-b py-2">
                                  {result?.tech_ast} U / liter
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_m1}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">ALT</td>
                                <td className="border-b py-2">
                                  {result?.tech_alt} U / liter
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_m2}
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

export default AstAltRatioCalculator;
