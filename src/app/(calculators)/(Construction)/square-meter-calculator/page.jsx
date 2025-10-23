"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSquareMeterCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SquareMeterCalculator = () => {
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
    tech_volume_select: 1, // Integer (1 | 2 | 3 | 4)
    tech_length: 8, // Number
    tech_l_units: "cm", // String: "cm", "m", etc.
    tech_width: 4, // Number
    tech_w_units: "m", // String
    tech_side: 4, // Number
    tech_s_units: "cm", // String
    tech_quantity: 1, // Number (default to 1 if empty)
    tech_price: "", // String (can be converted to float in backend)
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSquareMeterCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_volume_select) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_volume_select: formData.tech_volume_select,
        tech_length: formData.tech_length,
        tech_l_units: formData.tech_l_units,
        tech_width: formData.tech_width,
        tech_w_units: formData.tech_w_units,
        tech_side: formData.tech_side,
        tech_s_units: formData.tech_s_units,
        tech_quantity: formData.tech_quantity,
        tech_price: formData.tech_price,
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
      tech_volume_select: 1, // Integer (1 | 2 | 3 | 4)
      tech_length: 8, // Number
      tech_l_units: "cm", // String: "cm", "m", etc.
      tech_width: 4, // Number
      tech_w_units: "m", // String
      tech_side: 4, // Number
      tech_s_units: "cm", // String
      tech_quantity: 1, // Number (default to 1 if empty)
      tech_price: "", // String (can be converted to float in backend)
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
    setFormData((prev) => ({ ...prev, tech_l_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_w_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_s_units: unit }));
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

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 md:col-span-6 row">
                <div className="space-y-2  ">
                  <label htmlFor="tech_volume_select" className="label">
                    {data?.payload?.tech_lang_keys["12"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_volume_select"
                      id="tech_volume_select"
                      value={formData.tech_volume_select}
                      onChange={handleChange}
                    >
                      <option value="1">
                        {data?.payload?.tech_lang_keys["13"]}
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["14"]}{" "}
                      </option>
                      <option value="3">
                        {data?.payload?.tech_lang_keys["15"]}{" "}
                      </option>
                      <option value="4">
                        {data?.payload?.tech_lang_keys["16"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-12  gap-4 mt-3">
                  {(formData.tech_volume_select == "1" ||
                    formData.tech_volume_select == "3" ||
                    formData.tech_volume_select == "4") && (
                    <>
                      <div className="col-span-6 md:col-span-6 lg:col-span-6  sidea">
                        {formData.tech_volume_select == "1" && (
                          <>
                            <label htmlFor="tech_length" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["1"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "2" && (
                          <>
                            <label htmlFor="tech_length" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["1"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "3" && (
                          <>
                            <label htmlFor="tech_length" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["18"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "4" && (
                          <>
                            <label htmlFor="tech_length" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]} a:{" "}
                            </label>
                          </>
                        )}
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
                            {formData.tech_l_units} ▾
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
                    </>
                  )}
                  {(formData.tech_volume_select == "1" ||
                    formData.tech_volume_select == "2" ||
                    formData.tech_volume_select == "4") && (
                    <>
                      <div className="col-span-6 md:col-span-6 lg:col-span-6  sideb">
                        {formData.tech_volume_select == "1" && (
                          <>
                            <label htmlFor="tech_width" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["2"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "2" && (
                          <>
                            <label htmlFor="tech_width" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["2"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "3" && (
                          <>
                            <label htmlFor="tech_width" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["2"]}{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "4" && (
                          <>
                            <label htmlFor="tech_width" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]} b:
                            </label>
                          </>
                        )}

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
                            {formData.tech_w_units} ▾
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
                    </>
                  )}
                  {formData.tech_volume_select == "4" && (
                    <>
                      <div className="col-span-6 md:col-span-6 lg:col-span-6  sidec ">
                        {formData.tech_volume_select == "1" && (
                          <>
                            <label htmlFor="tech_side" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]} c:
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "2" && (
                          <>
                            <label htmlFor="tech_side" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]} c:
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "3" && (
                          <>
                            <label htmlFor="tech_side" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]} c:
                            </label>
                          </>
                        )}
                        {formData.tech_volume_select == "4" && (
                          <>
                            <label htmlFor="tech_side" className="label">
                              {" "}
                              {data?.payload?.tech_lang_keys["17"]} c:
                            </label>
                          </>
                        )}

                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_side"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_side}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_s_units} ▾
                          </label>
                          {dropdownVisible2 && (
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
                  {(formData.tech_volume_select == "1" ||
                    formData.tech_volume_select == "2" ||
                    formData.tech_volume_select == "3" ||
                    formData.tech_volume_select == "4") && (
                    <>
                      <div className="col-span-6 md:col-span-6 lg:col-span-6  quantity">
                        <label htmlFor="tech_quantity" className="label">
                          {data?.payload?.tech_lang_keys["19"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_quantity"
                            id="tech_quantity"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_quantity}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-2 mt-3 ">
                  <label htmlFor="tech_price" className="label">
                    {data?.payload?.tech_lang_keys["3"]} ({" "}
                    {data?.payload?.tech_lang_keys["4"]}):
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
                    <span className="input_unit">{currency.symbol}/m</span>
                  </div>
                </div>
              </div>
              <div className=" col-span-12 md:col-span-6  ps-lg-4 flex items-center">
                <div className="col-11 px-2 mx-auto">
                  {formData.tech_volume_select == "1" && (
                    <>
                      <img
                        src="/images/meter1.png"
                        alt="Square Meter"
                        id="imgchange"
                        className="max-width "
                      />
                    </>
                  )}
                  {formData.tech_volume_select == "2" && (
                    <>
                      <img
                        src="/images/meter2.png"
                        alt="Square Meter"
                        id="imgchange"
                        className="max-width "
                      />
                    </>
                  )}
                  {formData.tech_volume_select == "3" && (
                    <>
                      <img
                        src="/images/meter3.png"
                        alt="Square Meter"
                        id="imgchange"
                        className="max-width "
                      />
                    </>
                  )}
                  {formData.tech_volume_select == "4" && (
                    <>
                      <img
                        src="/images/meter4.png"
                        alt="Square Meter"
                        id="imgchange"
                        className="max-width "
                      />
                    </>
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
                    <div className="w-full mt-3">
                      <div className="row mt-2">
                        <div className="w-full">
                          <div className="w-full md:w-[70%] lg:w-[70%] overflow-auto text-[16px]">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td width="60%" className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[20]}{" "}
                                      {data?.payload?.tech_lang_keys[5]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(result?.tech_res).toFixed(2)} m
                                    <sup>2</sup>
                                  </td>
                                </tr>
                                {result?.tech_cost && (
                                  <>
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[3]} :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(result?.tech_cost).toFixed(2)}
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td width="60%" className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[20]}{" "}
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    {data?.payload?.tech_lang_keys["6"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(result?.tech_res).toFixed(2) *
                                      1000000}{" "}
                                    mm<sup>2</sup>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[20]}{" "}
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    {data?.payload?.tech_lang_keys["7"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(result?.tech_res).toFixed(2) *
                                      10000}{" "}
                                    cm<sup>2</sup>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[20]}{" "}
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    {data?.payload?.tech_lang_keys["8"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(result?.tech_res).toFixed(2) * 1550}{" "}
                                    in<sup>2</sup>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[20]}{" "}
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    {data?.payload?.tech_lang_keys["9"]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(result?.tech_res).toFixed(2) *
                                      10.764}{" "}
                                    ft<sup>2</sup>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    {data?.payload?.tech_lang_keys[20]}{" "}
                                    {data?.payload?.tech_lang_keys["11"]}{" "}
                                    {data?.payload?.tech_lang_keys["10"]} :
                                  </td>
                                  <td>
                                    {Number(result?.tech_res).toFixed(2) *
                                      1.196}{" "}
                                    yd<sup>2</sup>
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

export default SquareMeterCalculator;
