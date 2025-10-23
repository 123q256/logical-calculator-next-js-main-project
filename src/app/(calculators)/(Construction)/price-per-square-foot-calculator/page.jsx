"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePricePerSquareFootCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PricePerSquareFootCalculator = () => {
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
    tech_calculate: "1",
    tech_pp: "290000",
    tech_area_measure: "1400",
    tech_area_measure_unit: "ft²",
    tech_compare: "1",
    tech_pp1: "290000",
    tech_area_measure1: "1400",
    tech_area_measure_unit1: "ft²",
    tech_compare2: "2",
    tech_pp2: "290000",
    tech_area_measure2: "1400",
    tech_area_measure_unit2: "ft²",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePricePerSquareFootCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_calculate ||
      !formData.tech_pp ||
      !formData.tech_area_measure ||
      !formData.tech_area_measure_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculate: formData.tech_calculate,
        tech_pp: formData.tech_pp,
        tech_area_measure: formData.tech_area_measure,
        tech_area_measure_unit: formData.tech_area_measure_unit,
        tech_compare: formData.tech_compare,
        tech_pp1: formData.tech_pp1,
        tech_area_measure1: formData.tech_area_measure1,
        tech_area_measure_unit1: formData.tech_area_measure_unit1,
        tech_compare2: formData.tech_compare2,
        tech_pp2: formData.tech_pp2,
        tech_area_measure2: formData.tech_area_measure2,
        tech_area_measure_unit2: formData.tech_area_measure_unit2,
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
      tech_calculate: "1",
      tech_pp: "290000",
      tech_area_measure: "1400",
      tech_area_measure_unit: "ft²",
      tech_compare: "1",
      tech_pp1: "290000",
      tech_area_measure1: "1400",
      tech_area_measure_unit1: "ft²",
      tech_compare2: "2",
      tech_pp2: "290000",
      tech_area_measure2: "1400",
      tech_area_measure_unit2: "ft²",
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
    setFormData((prev) => ({ ...prev, tech_area_measure_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_measure_unit1: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_measure_unit2: unit }));
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
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_calculate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculate"
                    id="tech_calculate"
                    value={formData.tech_calculate}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_pp" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_pp"
                    id="tech_pp"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_pp}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_area_measure" className="label">
                  {data?.payload?.tech_lang_keys["6"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_area_measure"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_area_measure}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_area_measure_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "ft²", value: "ft²" },
                        { label: "m²", value: "m²" },
                        { label: "in²", value: "in²" },
                        { label: "yd²", value: "yd²" },
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
              <p className="col-span-12 mt-2">
                {data?.payload?.tech_lang_keys["7"]}
              </p>
              <div className="col-span-12">
                <label htmlFor="tech_compare" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_compare"
                    id="tech_compare"
                    value={formData.tech_compare}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["14"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_compare == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 saman1 ">
                    {formData.tech_calculate == "1" && (
                      <label htmlFor="tech_pp1" className="label">
                        {" "}
                        {data?.payload?.tech_lang_keys["5"]}:{" "}
                      </label>
                    )}
                    {formData.tech_calculate == "2" && (
                      <label htmlFor="tech_pp1" className="label">
                        {" "}
                        {data?.payload?.tech_lang_keys["9"]}:{" "}
                      </label>
                    )}
                    {formData.tech_calculate == "3" && (
                      <label htmlFor="tech_pp1" className="label">
                        {" "}
                        {data?.payload?.tech_lang_keys["18"]}:{" "}
                      </label>
                    )}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_pp1"
                        id="tech_pp1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_pp1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 saman1 ">
                    <label htmlFor="tech_area_measure1" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_area_measure1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_area_measure1}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_area_measure_unit1} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "ft²", value: "ft²" },
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

                  <p className="mt-2 col-span-12 saman1 ">
                    {data?.payload?.tech_lang_keys["11"]}
                  </p>
                  <div className="col-span-12 mt-0 mt-lg-2 saman1 ">
                    <label htmlFor="tech_compare2" className="label">
                      {data?.payload?.tech_lang_keys["12"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_compare2"
                        id="tech_compare2"
                        value={formData.tech_compare2}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["13"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["14"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  {formData.tech_compare2 == "2" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 saman2 ">
                        {formData.tech_calculate == "1" && (
                          <label htmlFor="tech_pp2" className="label">
                            {" "}
                            {data?.payload?.tech_lang_keys["5"]}:{" "}
                          </label>
                        )}
                        {formData.tech_calculate == "2" && (
                          <label htmlFor="tech_pp2" className="label">
                            {" "}
                            {data?.payload?.tech_lang_keys["9"]}:{" "}
                          </label>
                        )}
                        {formData.tech_calculate == "3" && (
                          <label htmlFor="tech_pp2" className="label">
                            {" "}
                            {data?.payload?.tech_lang_keys["18"]}:{" "}
                          </label>
                        )}

                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_pp2"
                            id="tech_pp2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_pp2}
                            onChange={handleChange}
                          />
                          <span className="input_unit">{currency.symbol}</span>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 saman2 ">
                        <label htmlFor="tech_area_measure2" className="label">
                          {data?.payload?.tech_lang_keys["6"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_area_measure2"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_area_measure2}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_area_measure_unit2} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "ft²", value: "ft²" },
                                { label: "m²", value: "m²" },
                                { label: "in²", value: "in²" },
                                { label: "yd²", value: "yd²" },
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
                </>
              )}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue result p-3 radius-10 mt-3">
                      <div className="w-full py-2">
                        <div className="w-full md:w-[80%] lg:w-[80%]  overflow-auto lg:text-[18px] md:text-[18px] text-[14px]">
                          {result?.tech_calculate == "1" && (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["5"]}{" "}
                                      <span className="font-s-14">
                                        (ft<sup>2</sup>)
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="">
                                <p className="mt-2 ">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["15"]}:
                                  </strong>
                                </p>
                              </div>
                              <div className="">
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td width="60%" className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["5"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res * 10.7639
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (m)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["5"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res * 0.00694444
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (in)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["5"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(result?.tech_res * 9).toFixed(
                                          2
                                        )}
                                        <span className="font-s-14">
                                          {" "}
                                          (yd)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}
                          {formData?.tech_compare == "2" && (
                            <>
                              <div className="">
                                <p className="font-s-20 mt-3">
                                  <strong>
                                    {" "}
                                    {data?.payload?.tech_lang_keys["7"]} :{" "}
                                  </strong>
                                </p>
                              </div>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["5"]}{" "}
                                      <span className="font-s-14">
                                        (ft<sup>2</sup>)
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res1).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="">
                                <p className="mt-2 ">
                                  <strong>
                                    {" "}
                                    {data?.payload?.tech_lang_keys["15"]}:
                                  </strong>
                                </p>
                              </div>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res1 * 10.7639
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (m)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res1 * 0.00694444
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (in)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res1 * 9).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (yd)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          )}
                          {formData?.tech_compare2 == "2" &&
                            formData?.tech_compare == "2" && (
                              <>
                                <div className="font-s-20">
                                  <p className="mt-3">
                                    <strong>
                                      {" "}
                                      {
                                        data?.payload?.tech_lang_keys["11"]
                                      } :{" "}
                                    </strong>
                                  </p>
                                </div>
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td width="60%" className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["5"]}{" "}
                                        <span className="font-s-14">
                                          (ft<sup>2</sup>)
                                        </span>
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(result?.tech_res2).toFixed(2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="">
                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["15"]}:
                                    </strong>
                                  </p>
                                </div>
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td width="60%" className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["5"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {" "}
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res2 * 10.7639
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (m)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["5"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {" "}
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res2 * 0.00694444
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (in)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["5"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {" "}
                                        {currency.symbol}{" "}
                                        {Number(result?.tech_res2 * 9).toFixed(
                                          2
                                        )}{" "}
                                        <span className="font-s-14">
                                          (yd)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </>
                            )}
                          {result?.tech_calculate == "2" && (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}{" "}
                                      <span className="font-s-14">
                                        (ft<sup>2</sup>)
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}:
                                </strong>
                              </p>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res * 10.7639
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (m)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res * 0.00694444
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (in)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res * 9).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (yd)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}{" "}
                                      <span className="font-s-14">
                                        (ft<sup>2</sup>)
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res * 12).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}:
                                </strong>
                              </p>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res * 12 * 10.7639
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (m)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res * 12 * 0.00694444
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (in)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res * 12 * 9
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (yd)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          )}
                          {formData?.tech_compare == "2" && (
                            <>
                              <p className="font-s-20 mt-2">
                                <strong>
                                  {" "}
                                  {data?.payload?.tech_lang_keys["7"]} :{" "}
                                </strong>
                              </p>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}{" "}
                                      <span className="font-s-14">
                                        (ft<sup>2</sup>)
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res1).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}:
                                </strong>
                              </p>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res1 * 10.7639
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (m)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res1 * 0.00694444
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (in)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res1 * 9).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (yd)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}{" "}
                                      <span className="font-s-14">
                                        (ft<sup>2</sup>)
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res1 * 12).toFixed(
                                        2
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="">
                                <p className="mt-2">
                                  <strong>
                                    {" "}
                                    {data?.payload?.tech_lang_keys["15"]}:
                                  </strong>
                                </p>
                              </div>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res1 * 12 * 10.7639
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (m)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res1 * 12 * 0.00694444
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (in)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(
                                        result?.tech_res1 * 12 * 9
                                      ).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        (yd)<sup>2</sup>
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          )}
                          {formData?.tech_compare2 == "2" &&
                            formData?.tech_compare == "2" && (
                              <>
                                <div className="">
                                  <p className="font-s-20 mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["11"]} :{" "}
                                    </strong>
                                  </p>
                                </div>
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td width="60%" className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["9"]}{" "}
                                        <span className="font-s-14">
                                          (ft<sup>2</sup>)
                                        </span>
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(result?.tech_res2).toFixed(2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="">
                                  <p className="mt-2 ">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["15"]}:
                                    </strong>
                                  </p>
                                </div>
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td width="60%" className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["9"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res2 * 10.7639
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (m)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["9"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res2 * 0.00694444
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (in)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["9"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {Number(result?.tech_res2 * 9).toFixed(
                                          2
                                        )}{" "}
                                        {currency.symbol}{" "}
                                        <span className="font-s-14">
                                          (yd)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td width="60%" className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["10"]}{" "}
                                        <span className="font-s-14">
                                          (ft<sup>2</sup>)
                                        </span>
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(result?.tech_res2 * 12).toFixed(
                                          2
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="">
                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["15"]}:
                                    </strong>
                                  </p>
                                </div>
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td width="60%" className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res2 * 12 * 10.7639
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (m)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res2 * 12 * 0.00694444
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (in)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_res2 * 12 * 9
                                        ).toFixed(2)}{" "}
                                        <span className="font-s-14">
                                          (yd)<sup>2</sup>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </>
                            )}
                          {result?.tech_calculate == "3" && (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["16"]}{" "}
                                      <span className="font-s-14">
                                        {" "}
                                        (ft<sup>2</sup>)
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["17"]}{" "}
                                      <span className="font-s-14">
                                        (ft<sup>2</sup>)
                                      </span>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_res / 12).toFixed(2)}
                                    </td>
                                  </tr>
                                  {formData?.tech_compare == "2" && (
                                    <>
                                      <tr>
                                        <td colSpan="2" className="pt-2">
                                          {data?.payload?.tech_lang_keys["7"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["16"]}{" "}
                                          <span className="font-s-14">
                                            (ft<sup>2</sup>)
                                          </span>
                                        </td>
                                        <td className="border-b py-2">
                                          {currency.symbol}{" "}
                                          {Number(result?.tech_res1).toFixed(2)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {data?.payload?.tech_lang_keys["17"]}{" "}
                                          <span className="font-s-14">
                                            (ft<sup>2</sup>)
                                          </span>
                                        </td>
                                        <td className="border-b py-2">
                                          {currency.symbol}{" "}
                                          {Number(
                                            result?.tech_res1 / 12
                                          ).toFixed(2)}
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                  {formData?.tech_compare2 == "2" &&
                                    formData?.tech_compare == "2" && (
                                      <>
                                        <tr>
                                          <td colSpan="2" className="pt-2">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "11"
                                              ]
                                            }
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-b py-2">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "16"
                                              ]
                                            }{" "}
                                            <span className="font-s-14">
                                              (ft<sup>2</sup>)
                                            </span>
                                          </td>
                                          <td className="border-b py-2">
                                            {currency.symbol}{" "}
                                            {Number(result?.tech_res2).toFixed(
                                              2
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border-b py-2">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "17"
                                              ]
                                            }{" "}
                                            <span className="font-s-14">
                                              (ft<sup>2</sup>)
                                            </span>
                                          </td>
                                          <td className="border-b py-2">
                                            {currency.symbol}{" "}
                                            {Number(
                                              result?.tech_res2 / 12
                                            ).toFixed(2)}
                                          </td>
                                        </tr>
                                      </>
                                    )}
                                </tbody>
                              </table>
                            </>
                          )}
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

export default PricePerSquareFootCalculator;
