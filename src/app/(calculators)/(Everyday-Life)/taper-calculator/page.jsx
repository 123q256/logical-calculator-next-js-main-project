"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTaperCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TaperCalculator = () => {
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
    tech_major: "100",
    tech_major_unit: "mm",
    tech_minor: "50",
    tech_minor_unit: "mm",
    tech_length: "100",
    tech_length_unit: "in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTaperCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_major ||
      !formData.tech_major_unit ||
      !formData.tech_minor ||
      !formData.tech_minor_unit ||
      !formData.tech_length ||
      !formData.tech_length_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_major: formData.tech_major,
        tech_major_unit: formData.tech_major_unit,
        tech_minor: formData.tech_minor,
        tech_minor_unit: formData.tech_minor_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
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
      tech_major: "100",
      tech_major_unit: "mm",
      tech_minor: "50",
      tech_minor_unit: "mm",
      tech_length: "100",
      tech_length_unit: "in",
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
    setFormData((prev) => ({ ...prev, tech_major_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_minor_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="col-lg-6 pe-lg-4">
                <div className="col-12 px-2 mt-0 mt-lg-2">
                  <label htmlFor="tech_major" className="label">
                    {data?.payload?.tech_lang_keys["1"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_major"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_major}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_major_unit} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "meters (m)", value: "m" },
                          { label: "feet (ft)", value: "ft" },
                          { label: "inches (in)", value: "in" },
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
                <div className="col-12 px-2 mt-0 mt-lg-2">
                  <label htmlFor="tech_minor" className="label">
                    {data?.payload?.tech_lang_keys["2"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_minor"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_minor}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown1}
                    >
                      {formData.tech_minor_unit} ▾
                    </label>
                    {dropdownVisible1 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "meters (m)", value: "m" },
                          { label: "feet (ft)", value: "ft" },
                          { label: "inches (in)", value: "in" },
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
                <div className="col-12 px-2 mt-0 mt-lg-2">
                  <label htmlFor="tech_length" className="label">
                    {data?.payload?.tech_lang_keys["3"]}
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
                      onClick={toggleDropdown2}
                    >
                      {formData.tech_length_unit} ▾
                    </label>
                    {dropdownVisible2 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "meters (m)", value: "m" },
                          { label: "feet (ft)", value: "ft" },
                          { label: "inches (in)", value: "in" },
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
              <div className="col-lg-6 ps-lg-4 text-center flex items-center mt-lg-0 mt-3">
                <img
                  src="/images/taper_new.webp"
                  alt="skirt"
                  className="mt-lg-5 max-width"
                  width="500px"
                  height="80x"
                />
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
                      <div className="grid grid-cols-12 gap-3 my-2">
                        <div className="col-span-12 md:col-span-6 text-[18px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="80%" className="border-b py-2">
                                  <p className="font-s-20 mb-2 mt-1">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]} (θ)
                                    </strong>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td width="80%" className="border-b py-2">
                                  {Number(result?.tech_answer).toFixed(2)} :
                                </td>
                                <td className="border-b py-2">deg</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer_rad).toFixed(2)} :
                                </td>
                                <td className="border-b py-2">red</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer_gon).toFixed(2)} :
                                </td>
                                <td className="border-b py-2">gon</td>
                              </tr>
                            </tbody>
                          </table>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="80%" className="border-b py-2">
                                  <p className="font-s-20 mt-3 mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["5"]} (T)
                                    </strong>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td width="80%" className="border-b py-2">
                                  {Number(result?.tech_main).toFixed(2)} :
                                </td>
                                <td className="border-b py-2">in</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_main_cm).toFixed(2)} :
                                </td>
                                <td className="border-b py-2">cm</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_main_m).toFixed(2)} :
                                </td>
                                <td className="border-b py-2">m</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_main_mm).toFixed(2)} :
                                </td>
                                <td className="border-b py-2">mm</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_main_ft).toFixed(2)} :
                                </td>
                                <td className="border-b py-2">ft</td>
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

export default TaperCalculator;
