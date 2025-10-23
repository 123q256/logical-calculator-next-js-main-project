"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDimensionalAnalysisCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DimensionalAnalysisCalculator = () => {
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
    tech_pq1: "12",
    tech_pq1_unit: "mm",
    tech_pq2: "12",
    tech_pq2_unit: "mm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDimensionalAnalysisCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_pq1 ||
      !formData.tech_pq1_unit ||
      !formData.tech_pq2 ||
      !formData.tech_pq2_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_pq1: formData.tech_pq1,
        tech_pq1_unit: formData.tech_pq1_unit,
        tech_pq2: formData.tech_pq2,
        tech_pq2_unit: formData.tech_pq2_unit,
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
      tech_pq1: "12",
      tech_pq1_unit: "mm",
      tech_pq2: "12",
      tech_pq2_unit: "mm",
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
    setFormData((prev) => ({ ...prev, tech_pq1_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pq2_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 ">
                <label htmlFor="tech_pq1" className="label">
                  {data?.payload?.tech_lang_keys["1"]} :1
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_pq1"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_pq1}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_pq1_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "miles (fur)", value: "fur" },
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
              <div className="col-span-12 ">
                <label htmlFor="tech_pq2" className="label">
                  {data?.payload?.tech_lang_keys["1"]} 2
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_pq2"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_pq2}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_pq2_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "miles (fur)", value: "fur" },
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[80%]  mt-2">
                        <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[3]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_upr} : {result?.tech_btm}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[1]} 1{" "}
                                  {data?.payload?.tech_lang_keys[9]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <span>{result?.tech_res}</span>{" "}
                                {data?.payload?.tech_lang_keys[2]}{" "}
                                {data?.payload?.tech_lang_keys[1]} 2
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="40%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[1]} 2{" "}
                                  {data?.payload?.tech_lang_keys[9]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <span>{result?.tech_res1}</span>{" "}
                                {data?.payload?.tech_lang_keys[2]}{" "}
                                {data?.payload?.tech_lang_keys[1]} 1
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="col-12 text-[16px] mt-2">
                        <p>
                          <strong>{data?.payload?.tech_lang_keys[4]}:</strong>
                        </p>

                        {result?.tech_check ? (
                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[6]}</strong>{" "}
                            {result?.tech_pq1} : {result?.tech_pq2}
                          </p>
                        ) : result?.tech_cnvrt1 ? (
                          <>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[7]}
                              </strong>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[1]} 1 ={" "}
                              {result?.tech_cnvrt1}
                            </p>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[6]}
                              </strong>{" "}
                              {result?.tech_cnvrt1} : {result?.tech_pq2}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[7]}
                              </strong>
                            </p>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys[1]} 2 ={" "}
                              {result?.tech_cnvrt2}
                            </p>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[6]}
                              </strong>{" "}
                              {result?.tech_pq1} : {result?.tech_cnvrt2}
                            </p>
                          </>
                        )}

                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys[8]}</strong>{" "}
                          {result?.tech_upr} : {result?.tech_btm}
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

export default DimensionalAnalysisCalculator;
