"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAcreageCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AcreageCalculator = () => {
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

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_to_cal: "3", // 1 2 3
    tech_length: "4",
    tech_length_unit: "cm",
    tech_width: "4",
    tech_width_unit: "cm",
    tech_area: "12",
    tech_area_unit: "mm²",
    tech_price: "",
    tech_price_unit: "/m²",
    tech_currancy: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAcreageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_to_cal == 1) {
      if (
        !formData.tech_to_cal ||
        !formData.tech_length ||
        !formData.tech_length_unit ||
        !formData.tech_width ||
        !formData.tech_width_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_to_cal == 2) {
      if (
        !formData.tech_to_cal ||
        !formData.tech_width ||
        !formData.tech_width_unit ||
        !formData.tech_area ||
        !formData.tech_area_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_to_cal == 3) {
      if (
        !formData.tech_to_cal ||
        !formData.tech_length ||
        !formData.tech_length_unit ||
        !formData.tech_area ||
        !formData.tech_area_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_to_cal: formData.tech_to_cal,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
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
      tech_to_cal: "3", // 1 2 3
      tech_length: "4",
      tech_length_unit: "cm",
      tech_width: "4",
      tech_width_unit: "cm",
      tech_area: "12",
      tech_area_unit: "mm²",
      tech_price: "",
      tech_price_unit: "/m²",
      tech_currancy: "$",
    });
    setResult(null);
    setFormError(null);
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  // result

  const formatValue = (value, precision = 6) => {
    const num = Number(value);
    if (isNaN(num)) return "";
    return Math.abs(num) < 0.0001
      ? num.toExponential(6)
      : num.toFixed(precision);
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
          <input
            type="hidden"
            step="any"
            name="tech_currancy"
            id="tech_currancy"
            className="input my-2"
            aria-label="input"
            placeholder="00"
            value={currency.symbol}
            onChange={handleChange}
          />

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_to_cal" className="label">
                  {data?.payload?.tech_lang_keys["15"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_to_cal"
                    id="tech_to_cal"
                    value={formData.tech_to_cal}
                    onChange={handleChange}
                  >
                    <option value="1">Area</option>
                    <option value="2">Length </option>
                    <option value="3">Width </option>
                  </select>
                </div>
              </div>
              {(formData.tech_to_cal == "1" || formData.tech_to_cal == "3") && (
                <>
                  <div className="col-span-6 md:col-span-6 length">
                    <label htmlFor="tech_length" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
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
                        onClick={toggleDropdown}
                      >
                        {formData.tech_length_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inches (in)", value: "in" },
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
                </>
              )}
              {(formData.tech_to_cal == "1" || formData.tech_to_cal == "2") && (
                <>
                  <div className="col-span-6 md:col-span-6  width ">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_width_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inches (in)", value: "in" },
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
                </>
              )}
              {(formData.tech_to_cal == "2" || formData.tech_to_cal == "3") && (
                <>
                  <div className="col-span-6 md:col-span-6  area">
                    <label htmlFor="tech_area" className="label">
                      {data?.payload?.tech_lang_keys["1"]}
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
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_area_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm²", value: "mm²" },
                            { label: "cm²", value: "cm²" },
                            { label: "m²", value: "m²" },
                            { label: "in²", value: "in²" },
                            { label: "ft²", value: "ft²" },
                            { label: "yd²", value: "yd²" },
                            { label: "ac", value: "ac" },
                            { label: "ha", value: "ha" },
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
              <div className="col-span-12 md:col-span-6 ">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
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
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_price_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "/cm²", value: "/cm²" },
                        { label: "/m²", value: "/m²" },
                        { label: "/in²", value: "/in²" },
                        { label: "/ft²", value: "/ft²" },
                        { label: "/yd²", value: "/yd²" },
                        { label: "/ac", value: "/ac" },
                        { label: "/ha", value: "/ha" },
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

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] == "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg  result_calculator space-y-6 result">
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-6 lg:text-[18px] md:text-[18px] text-[16px]">
                          {formData?.tech_to_cal == 1 && (
                            <div className="col-lg-7">
                              <table className="w-full font-s-18">
                                <td className="mt-3 mb-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["6"]} :
                                    </td>
                                    <td width="60%" className="border-b py-2">
                                      {formatValue(
                                        result?.tech_area * 0.0002471054
                                      )}{" "}
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <p className="mt-3 my-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["16"]}
                                </strong>
                              </p>
                              <table className="w-full font-s-18">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["7"]}:
                                    </td>
                                    <td width="60%" className="border-b py-2">
                                      {formatValue(result?.tech_area * 0.0001)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["8"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {formatValue(
                                        result?.tech_area * 10.7639,
                                        2
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {formatValue(result?.tech_area)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {formatValue(
                                        result?.tech_area * 0.000000386102,
                                        8
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["11"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {formatValue(
                                        result?.tech_area * 0.000001
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}

                          {formData?.tech_to_cal == 2 && (
                            <div className="col-lg-6">
                              <table className="w-full font-s-18">
                                <td className="mt-3 mb-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["2"]}
                                  </strong>
                                </td>
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["12"]} :
                                    </td>
                                    <td width="60%" className="border-b py-2">
                                      {Number(result?.tech_length).toFixed(7)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}

                          {formData?.tech_to_cal == 3 && (
                            <div className="col-lg-6">
                              <table className="w-full font-s-18">
                                <thead>
                                  <tr>
                                    <td className="mt-3 mb-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["12"]} :
                                    </td>
                                    <td width="60%" className="border-b py-2">
                                      {Number(result?.tech_width).toFixed(6)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="col-lg-7 col-12">
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                              <thead>
                                <tr>
                                  <td className="mt-3 mb-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["12"]} :
                                  </td>
                                  <td width="60%" className="border-b py-2">
                                    {result?.tech_perimeter}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            {formData?.tech_price && (
                              <table className="w-full font-s-18">
                                <thead>
                                  <tr>
                                    <td className="mt-3 mb-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["14"]}
                                      </strong>
                                    </td>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {currency?.symbol} :
                                    </td>
                                    <td width="60%" className="border-b py-2">
                                      {Number(result?.tech_final_price).toFixed(
                                        2
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                          </div>
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

export default AcreageCalculator;
