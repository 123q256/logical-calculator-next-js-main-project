"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFramingCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FramingCalculator = () => {
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
    tech_wall: "8",
    tech_wall_unit: "m",
    tech_spacing: "8",
    tech_spacing_unit: "m",
    tech_price: "10",
    tech_estimated: "10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFramingCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_wall ||
      !formData.tech_wall_unit ||
      !formData.tech_spacing ||
      !formData.tech_spacing_unit ||
      !formData.tech_price ||
      !formData.tech_estimated
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_wall: formData.tech_wall,
        tech_wall_unit: formData.tech_wall_unit,
        tech_spacing: formData.tech_spacing,
        tech_spacing_unit: formData.tech_spacing_unit,
        tech_price: formData.tech_price,
        tech_estimated: formData.tech_estimated,
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
      tech_wall: "8",
      tech_wall_unit: "m",
      tech_spacing: "8",
      tech_spacing_unit: "m",
      tech_price: "10",
      tech_estimated: "10",
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
    setFormData((prev) => ({ ...prev, tech_wall_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_spacing_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2 my-2">
                  <label htmlFor="tech_wall" className="label">
                    {data?.payload?.tech_lang_keys["1"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_wall"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_wall}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_wall_unit} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "meters (m)", value: "m" },
                          { label: "inches (in)", value: "in" },
                          { label: "feets (ft)", value: "ft" },
                          { label: "yards (yd)", value: "yd" },
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
                <div className="space-y-2 my-2">
                  <label htmlFor="tech_spacing" className="label">
                    {data?.payload?.tech_lang_keys["2"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_spacing"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_spacing}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown1}
                    >
                      {formData.tech_spacing_unit} ▾
                    </label>
                    {dropdownVisible1 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "meters (m)", value: "m" },
                          { label: "inches (in)", value: "in" },
                          { label: "feets (ft)", value: "ft" },
                          { label: "yards (yd)", value: "yd" },
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
                <div className="w-full">
                  <label htmlFor="tech_price" className="label">
                    {data?.payload?.tech_lang_keys["4"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_price"
                      id="tech_price"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_price}
                      onChange={handleChange}
                    />
                    <span className="input_unit">{currency.symbol}</span>
                  </div>
                </div>
                <div className="w-full">
                  <label htmlFor="tech_estimated" className="label">
                    {data?.payload?.tech_lang_keys["4"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_estimated"
                      id="tech_estimated"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_estimated}
                      onChange={handleChange}
                    />
                    <span className="input_unit">%</span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 flex items-center justify-center">
                <img
                  src="/images/framing_length.webp"
                  alt="Framing"
                  className="max-width"
                  width="260px"
                  height="260px"
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
                      <div className="w-full my-2">
                        <div className="w-full md:w-[70%] lg:w-[50%] overflow-auto text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["5"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_answer).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b pt-4 pb-2">
                                  {data?.payload?.tech_lang_keys["6"]} :
                                </td>
                                <td className="border-b pt-4 pb-2">
                                  {currency.symbol}{" "}
                                  {Number(result?.tech_sub_answer).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <p className="font-s-20 my-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]}
                            </strong>
                          </p>
                          <p>{data?.payload?.tech_lang_keys[8]}.</p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[5]} = (
                            {data?.payload?.tech_lang_keys[1]} /{" "}
                            {data?.payload?.tech_lang_keys[2]}) + 1
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[5]} = (
                            {formData?.tech_wall}
                            {formData?.tech_wall_unit}/ {formData?.tech_spacing}
                            {formData?.tech_spacing_unit}) + 1
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[5]} ={" "}
                            {Number(result?.tech_answer).toFixed(2)}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[9]}.
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[6]} = (
                            {data?.payload?.tech_lang_keys[5]} *{" "}
                            {data?.payload?.tech_lang_keys[4]} / 100 *{" "}
                            {data?.payload?.tech_lang_keys[3]}) + (Price per
                            stud * {data?.payload?.tech_lang_keys[5]} )
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[6]} = (
                            {Number(result?.tech_answer).toFixed(2)} *{" "}
                            {formData?.tech_estimated}/ 100 *{" "}
                            {formData?.tech_price}) + ({formData?.tech_price}*{" "}
                            {Number(result?.tech_answer).toFixed(2)})
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[6]} ={" "}
                            {currency.symbol}{" "}
                            {Number(result?.tech_sub_answer).toFixed(2)}
                          </p>
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

export default FramingCalculator;
