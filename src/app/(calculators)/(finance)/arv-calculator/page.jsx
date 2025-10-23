"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useArvCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ArvCalculator = () => {
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
    tech_method_unit: "Average Price In The Area", // Average Price In The Area  OR   Value Of The Property
    tech_property: "20000", // Property current value
    tech_area: "10000", // Area of the property (e.g., 250)
    tech_area_unit: "mi²", // Unit of area (ft², m², yd², mi²)
    tech_value: "20000", // Renovation value
    tech_total: "10000", // Total area for calculation
    tech_total_unit: "ft²", // Unit of total area (ft², m², yd², mi²)
    tech_average: "10000", // Average price per unit area for repairs
    tech_average_unit: "yd²", // Unit of average area (ft², m², yd², mi²)
    tech_cost: "1000", // Total cost of renovation
    tech_purchase: "50", // Investor's purchase rule percentage
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useArvCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method_unit || !formData.tech_property) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method_unit: formData.tech_method_unit,
        tech_property: formData.tech_property,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_value: formData.tech_value,
        tech_total: formData.tech_total,
        tech_total_unit: formData.tech_total_unit,
        tech_average: formData.tech_average,
        tech_average_unit: formData.tech_average_unit,
        tech_cost: formData.tech_cost,
        tech_purchase: formData.tech_purchase,
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
      tech_method_unit: "Average Price In The Area", // Average Price In The Area  OR   Value Of The Property
      tech_property: "20000", // Property current value
      tech_area: "10000", // Area of the property (e.g., 250)
      tech_area_unit: "mi²", // Unit of area (ft², m², yd², mi²)
      tech_value: "20000", // Renovation value
      tech_total: "10000", // Total area for calculation
      tech_total_unit: "ft²", // Unit of total area (ft², m², yd², mi²)
      tech_average: "10000", // Average price per unit area for repairs
      tech_average_unit: "yd²", // Unit of average area (ft², m², yd², mi²)
      tech_cost: "1000", // Total cost of renovation
      tech_purchase: "50", // Investor's purchase rule percentage
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
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_total_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_average_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="w-full px-2 my-2">
                  <strong>{data?.payload?.tech_lang_keys[1]} :</strong>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_method_unit" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method_unit"
                    id="tech_method_unit"
                    value={formData.tech_method_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys[11]}>
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys[12]}>
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_method_unit ==
                data?.payload?.tech_lang_keys[11] && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="hidden"
                  >
                    <label htmlFor="tech_property" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_property"
                        id="tech_property"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_property}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="hidden_sec"
                  >
                    <label htmlFor="tech_value" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_value"
                        id="tech_value"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_value}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_method_unit ==
                data?.payload?.tech_lang_keys[12] && (
                <>
                  <div className="col-span-12 md:col-span-6 " id="hidden_three">
                    <label htmlFor="tech_area" className="label">
                      <span className="text-blue">
                        {data?.payload?.tech_lang_keys["9"]}
                      </span>
                      <span className="text-blue"> {currency.symbol} per</span>
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_area"
                        step="any"
                        className="mt-2 input"
                        value={formData.tech_area}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-5"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_area_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m²", value: "m²" },
                            { label: "ft²", value: "ft²" },
                            { label: "yd²", value: "yd²" },
                            { label: "mi²", value: "mi²" },
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

                  <div className="col-span-12 md:col-span-6 " id="hidden_four">
                    <label htmlFor="tech_total" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_total"
                        step="any"
                        className="mt-2 input"
                        value={formData.tech_total}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-5"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_total_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m²", value: "m²" },
                            { label: "ft²", value: "ft²" },
                            { label: "yd²", value: "yd²" },
                            { label: "mi²", value: "mi²" },
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

              <div className="col-span-12">
                <div className="w-full px-2 my-3">
                  <strong>{data?.payload?.tech_lang_keys[5]} :</strong>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_average" className="label">
                  <span className="text-blue">
                    {data?.payload?.tech_lang_keys["6"]}
                  </span>
                  <span className="text-blue"> {currency.symbol} per</span>
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_average"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_average}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_average_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m²", value: "m²" },
                        { label: "ft²", value: "ft²" },
                        { label: "yd²", value: "yd²" },
                        { label: "mi²", value: "mi²" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_cost" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cost"
                    id="tech_cost"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_cost}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_purchase" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_purchase"
                    id="tech_purchase"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_purchase}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
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
              <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[80%] lg:w-[80%] mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[14]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol}{" "}
                                {result?.tech_after_repair_value}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[15]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {result?.tech_requires_repairs}{" "}
                                {formData?.tech_average_unit}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[16]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(
                                  result?.tech_maximum_bid_price
                                ).toFixed()}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>ROI </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_roi).toFixed()}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[17]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {Number(result?.tech_percentage).toFixed()} %
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px]">
                        <div className="w-full">
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[18]}
                          </p>

                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[14]}</strong>
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[14]} =
                            {formData?.method_unit ===
                            "Value of the property" ? (
                              <>
                                {" "}
                                {data?.payload?.tech_lang_keys[3]} +{" "}
                                {data?.payload?.tech_lang_keys[4]}
                              </>
                            ) : (
                              <>
                                {" "}
                                {data?.payload?.tech_lang_keys[9]} ×{" "}
                                {data?.payload?.tech_lang_keys[10]}
                              </>
                            )}
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[14]} ={" "}
                            {currency.symbol}{" "}
                            {Number(result?.tech_after_repair_value).toFixed(4)}
                          </p>

                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[15]}</strong>
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[15]} ={" "}
                            {data?.payload?.tech_lang_keys[7]} /{" "}
                            {data?.payload?.tech_lang_keys[6]}
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[15]} ={" "}
                            {Number(result?.tech_requires_repairs).toFixed(4)}
                            {formData?.tech_average_unit}
                          </p>

                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[16]}</strong>
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[16]} ={" "}
                            {data?.payload?.tech_lang_keys[15]} × (
                            {data?.payload?.tech_lang_keys[8]}%) −{" "}
                            {data?.payload?.tech_lang_keys[7]}
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[16]} ={" "}
                            {currency.symbol}{" "}
                            {Number(result?.tech_maximum_bid_price).toFixed(4)}
                          </p>

                          <p className="mt-2">
                            <strong>{data?.payload?.tech_lang_keys[17]}</strong>
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[17]} ={" "}
                            {data?.payload?.tech_lang_keys[8]} − 100
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys[17]} ={" "}
                            {Number(result?.tech_percentage).toFixed(4)}%
                          </p>

                          <p className="mt-2">
                            <strong>ROI</strong>
                          </p>

                          <p className="mt-2">
                            ROI = {data?.payload?.tech_lang_keys[17]} ×{" "}
                            {data?.payload?.tech_lang_keys[14]}
                          </p>

                          <p className="mt-2">
                            ROI = {currency.symbol}{" "}
                            {Number(result?.tech_roi).toFixed(4)}
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

export default ArvCalculator;
