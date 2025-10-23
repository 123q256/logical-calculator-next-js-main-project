"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFortyFiveFortyFiveNinetyCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FortyFiveFortyFiveNinetyCalculator = () => {
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
    tech_sides: "a", //  a b c area perimeter
    tech_input: "5",
    tech_linear_unit: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFortyFiveFortyFiveNinetyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // If changing the 'tech_sides' field, auto-update unit too
    if (name === "tech_sides") {
      const defaultUnit = value === "area" ? "mm²" : "mm";
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        tech_linear_unit: defaultUnit, // update unit based on side type
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_sides) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_sides: formData.tech_sides,
        tech_input: formData.tech_input,
        tech_linear_unit: formData.tech_linear_unit,
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
      tech_sides: "a", //  a b c area perimeter
      tech_input: "5",
      tech_linear_unit: "cm",
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
    setFormData((prev) => ({ ...prev, tech_linear_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  //   const [dropdownVisible1, setDropdownVisible1] = useState(false);

  // const setUnitHandler1 = (unit) => {
  //   setFormData((prev) => ({ ...prev, tech_units2: unit }));
  //   setDropdownVisible1(false);
  // };

  // const toggleDropdown1 = () => {
  //   setDropdownVisible1(!dropdownVisible1);
  // };

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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-7">
                <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_sides" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_sides"
                        id="tech_sides"
                        value={formData.tech_sides}
                        onChange={handleChange}
                      >
                        <option value="a">
                          {data?.payload?.tech_lang_keys["2"]}{" "}
                        </option>
                        <option value="b">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                        <option value="c">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                        </option>
                        <option value="area">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                        <option value="perimeter">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-12" id="squareUnit">
                    <label htmlFor="tech_input" className="label">
                      {formData?.tech_sides === "perimeter"
                        ? data?.payload?.tech_lang_keys[6]
                        : formData?.tech_sides === "b"
                        ? data?.payload?.tech_lang_keys[11]
                        : formData?.tech_sides === "c"
                        ? data?.payload?.tech_lang_keys[12]
                        : formData?.tech_sides === "area"
                        ? data?.payload?.tech_lang_keys[5]
                        : data?.payload?.tech_lang_keys[7]}
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="tech_input"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_input}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_linear_unit} ▾
                      </label>

                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {(formData.tech_sides === "area"
                            ? [
                                {
                                  label: "square millimeters (mm²)",
                                  value: "mm²",
                                },
                                {
                                  label: "square centimeters (cm²)",
                                  value: "cm²",
                                },
                                { label: "square meters (m²)", value: "m²" },
                                {
                                  label: "square kilometers (km²)",
                                  value: "km²",
                                },
                                { label: "square inches (in²)", value: "in²" },
                                { label: "square feets (ft²)", value: "ft²" },
                                { label: "square yards (yd²)", value: "yd²" },
                                { label: "square miles (mi²)", value: "mi²" },
                                {
                                  label: "square nautical miles (nmi²)",
                                  value: "nmi²",
                                },
                              ]
                            : [
                                { label: "millimeters (mm)", value: "mm" },
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "kilometers (km)", value: "km" },
                                { label: "inches (in)", value: "in" },
                                { label: "feets (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
                                { label: "miles (mi)", value: "mi" },
                                { label: "nautical miles (nmi)", value: "nmi" },
                              ]
                          ).map((unit, index) => (
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
              <div className="col-span-5 mt-3 text-center flex justify-center items-center">
                <img
                  src="/images/new_fourty_five.webp"
                  height="100%"
                  width="150px"
                  alt="trianle details image"
                  loading="lazy"
                  decoding="async"
                />
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
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[2]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_a_ans).toFixed(2)} cm
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[3]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_b_ans).toFixed(2)} cm
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[4]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_c_ans).toFixed(2)} cm
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[8]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_height).toFixed(2)} cm
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[5]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_area_ans).toFixed(2)} cm²
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[9]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_radius).toFixed(2)} cm
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[10]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_height).toFixed(2)} cm
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

export default FortyFiveFortyFiveNinetyCalculator;
