"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePaverCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PaverCalculator = () => {
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
    tech_operations: "3",
    tech_first: "8",
    tech_units1: "in",
    tech_second: "8",
    tech_units2: "in",
    tech_third: "10",
    tech_units3: "in",
    tech_four: "15",
    tech_units4: "in",
    tech_fiveb: "15",
    tech_price: "",
    tech_currancy: "",
    tech_price_unit: "ft²",
    tech_cost: "",
    tech_cost_unit: "ft²",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePaverCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations || !formData.tech_first) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_second: formData.tech_second,
        tech_units2: formData.tech_units2,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_four: formData.tech_four,
        tech_units4: formData.tech_units4,
        tech_fiveb: formData.tech_fiveb,
        tech_price: formData.tech_price,
        tech_currancy: formData.tech_currancy,
        tech_price_unit: formData.tech_price_unit,
        tech_cost: formData.tech_cost,
        tech_cost_unit: formData.tech_cost_unit,
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
      tech_operations: "3",
      tech_first: "8",
      tech_units1: "in",
      tech_second: "8",
      tech_units2: "in",
      tech_third: "10",
      tech_units3: "in",
      tech_four: "15",
      tech_units4: "in",
      tech_fiveb: "15",
      tech_price: "",
      tech_currancy: null,
      tech_price_unit: "ft²",
      tech_cost: "",
      tech_cost_unit: "ft²",
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
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units4: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cost_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations"
                    id="tech_operations"
                    value={formData.tech_operations}
                    onChange={handleChange}
                  >
                    <option value="3">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4" ||
                formData.tech_operations == "5") && (
                <>
                  <div className=" col-span-6 ffirst">
                    <label htmlFor="tech_first" className="label">
                      {formData.tech_operations == "5"
                        ? data?.payload?.tech_lang_keys["20"]
                        : data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_first"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_units1} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "km", value: "km" },
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
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4") && (
                <>
                  <div className=" col-span-6 second ">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_second"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_second}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_units2} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "km", value: "km" },
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
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4" ||
                formData.tech_operations == "5") && (
                <>
                  <div className=" col-span-6 third ">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["12"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_third"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_third}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_units3} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "km", value: "km" },
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
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "4" ||
                formData.tech_operations == "5") && (
                <>
                  <div className="col-span-6 four ">
                    <label htmlFor="tech_four" className="label">
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_four"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_four}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_units4} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "km", value: "km" },
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

              {formData.tech_operations == "4" && (
                <>
                  <div className=" col-span-12 md:col-span-6  fiveb ">
                    <label htmlFor="tech_fiveb" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_fiveb"
                        id="tech_fiveb"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_fiveb}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6  price ">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["13"]}{" "}
                  {data?.payload?.tech_lang_keys["14"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_price"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_price}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_price_unit} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: currency.symbol + " ft²",
                          value: currency.symbol + " ft²",
                        },
                        {
                          label: currency.symbol + " m²",
                          value: currency.symbol + " m²",
                        },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler4(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="hidden"
                  step="any"
                  name="tech_currancy"
                  id="tech_currancy"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_currancy}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 md:col-span-6 cost ">
                <label htmlFor="tech_cost" className="label">
                  {data?.payload?.tech_lang_keys["15"]}{" "}
                  {data?.payload?.tech_lang_keys["14"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_cost"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_cost}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown5}
                  >
                    {formData.tech_cost_unit} ▾
                  </label>
                  {dropdownVisible5 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: currency.symbol + " ft²",
                          value: currency.symbol + " ft²",
                        },
                        {
                          label: currency.symbol + " m²",
                          value: currency.symbol + " m²",
                        },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler5(unit.value)}
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
                      <div className="w-full my-1">
                        <div className="w-full md:w-[80%] lg:w-[60%] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_no_paver}
                                </td>
                              </tr>

                              {result?.tech_area_ans !== undefined && (
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["5"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {parseFloat(result.tech_area_ans).toFixed(
                                      2
                                    )}{" "}
                                    (ft²)
                                  </td>
                                </tr>
                              )}

                              {result?.tech_patio_area_ans !== undefined && (
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["10"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {parseFloat(
                                      result.tech_patio_area_ans
                                    ).toFixed(2)}{" "}
                                    (ft²)
                                  </td>
                                </tr>
                              )}

                              {result?.tech_price_p !== undefined && (
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["17"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol} {result.tech_price_p}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_cost_p !== undefined && (
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["18"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol} {result.tech_cost_p}
                                  </td>
                                </tr>
                              )}

                              {result?.tech_total_cost !== undefined && (
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["19"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol} {result.tech_total_cost}
                                  </td>
                                </tr>
                              )}
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

export default PaverCalculator;
