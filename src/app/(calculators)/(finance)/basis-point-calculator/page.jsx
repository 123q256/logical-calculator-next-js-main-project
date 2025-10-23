"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBasisPointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BasisPointCalculator = () => {
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
    tech_unit_type: "submit",
    tech_dec: "25",
    tech_percent: "",
    tech_perm: "",
    tech_bsp: "",

    tech_bps1: "",
    tech_bps_unit: "decimal",
    tech_of: "10000",
    tech_equals: "10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBasisPointCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_unit_type == "submit") {
      if (
        !formData.tech_unit_type ||
        (!formData.tech_dec &&
          !formData.tech_percent &&
          !formData.tech_perm &&
          !formData.tech_bsp)
      ) {
        setFormError("Just enter one value to get other values.");
        return;
      }
    } else {
      if (
        !formData.tech_unit_type || // this is required
        (!formData.tech_bps1 && !formData.tech_of && !formData.tech_equals)
      ) {
        setFormError("Just enter two value to get other value.");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_dec: formData.tech_dec,
        tech_percent: formData.tech_percent,
        tech_perm: formData.tech_perm,
        tech_bsp: formData.tech_bsp,
        tech_bps1: formData.tech_bps1,
        tech_bps_unit: formData.tech_bps_unit,
        tech_of: formData.tech_of,
        tech_equals: formData.tech_equals,
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
      tech_unit_type: "submit",
      tech_dec: "25",
      tech_percent: "",
      tech_perm: "",
      tech_bsp: "",

      tech_bps1: "19",
      tech_bps_unit: "decimal",
      tech_of: "10000",
      tech_equals: "10",
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
    setFormData((prev) => ({ ...prev, tech_bps_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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

          <div className="lg:w-[70%] md:w-[70%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "submit" ? "tagsUnit" : ""
                    }`}
                    id="submit"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "submit" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Basis Point Calculator
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "submit1" ? "tagsUnit" : ""
                    }`}
                    id="submit1"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "submit1" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    What is x bps of y?
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-3  gap-4">
              {formData.tech_unit_type == "submit" ? (
                <div className="col-span-12">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <p className="col-span-12 py-2">
                      <strong>{data?.payload?.tech_lang_keys[1]}:</strong>{" "}
                      {data?.payload?.tech_lang_keys[2]}.
                    </p>
                    <div className="col-span-6">
                      <label htmlFor="tech_dec" className="label">
                        {data?.payload?.tech_lang_keys["3"]}:
                      </label>
                      <div className="w-full py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_dec"
                          id="tech_dec"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_dec}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_percent" className="label">
                        {data?.payload?.tech_lang_keys["4"]} (%):
                      </label>
                      <div className="w-full py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_percent"
                          id="tech_percent"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_percent}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_perm" className="label">
                        {data?.payload?.tech_lang_keys["5"]} (‰):
                      </label>
                      <div className="w-full py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_perm"
                          id="tech_perm"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_perm}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_bsp" className="label">
                        {data?.payload?.tech_lang_keys["6"]} (‰):
                      </label>
                      <div className="w-full py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_bsp"
                          id="tech_bsp"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_bsp}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-span-12 ">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <p className="col-span-12 my-2">
                      <strong>{data?.payload?.tech_lang_keys[7]}?</strong>
                    </p>
                    <p className="col-span-12 ">
                      <strong>{data?.payload?.tech_lang_keys[1]}:</strong>{" "}
                      {data?.payload?.tech_lang_keys[8]}.
                    </p>

                    <div className="col-span-6 ">
                      <label htmlFor="tech_bps1" className="label">
                        &nbsp;
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_bps1"
                          step="any"
                          className="mt-2 input"
                          value={formData.tech_bps1}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-5"
                          onClick={toggleDropdown}
                        >
                          {formData.tech_bps_unit} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0 ">
                            {[
                              { label: "decimal", value: "decimal" },
                              { label: "percent", value: "percent" },
                              { label: "permille", value: "permille" },
                              { label: "bps", value: "bps" },
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

                    <div className="col-span-6">
                      <label htmlFor="tech_of" className="label">
                        {data?.payload?.tech_lang_keys["9"]} :
                      </label>
                      <div className="w-full  relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_of"
                          id="tech_of"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_of}
                          onChange={handleChange}
                        />
                        <span className=" input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6 ">
                      <label htmlFor="tech_equals" className="label">
                        {data?.payload?.tech_lang_keys["10"]} :
                      </label>
                      <div className="w-full py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_equals"
                          id="tech_equals"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_equals}
                          onChange={handleChange}
                        />
                        <span className=" input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            {[1, 2, 3, 4].includes(result?.tech_ans) ? (
                              <>
                                {result.tech_ans !== 2 && (
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} (%)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_percent}
                                    </td>
                                  </tr>
                                )}

                                {result.tech_ans !== 3 && (
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[5]} (‰)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_perm}
                                    </td>
                                  </tr>
                                )}

                                {result.tech_ans !== 1 && (
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_dec}
                                    </td>
                                  </tr>
                                )}

                                <tr>
                                  <td className="py-2 border-b" width="70%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[6]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_bsp}
                                  </td>
                                </tr>
                              </>
                            ) : result?.tech_ans === 5 ? (
                              <>
                                <tr>
                                  <td className="py-2 border-b" colSpan={2}>
                                    <strong>
                                      {result?.tech_bps1} bps{" "}
                                      {data?.payload?.tech_lang_keys[9]}{" "}
                                      {currency.symbol} {result?.tech_of}{" "}
                                      {data?.payload?.tech_lang_keys[10]}{" "}
                                      {currency.symbol} {result?.tech_equals}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" colSpan={2}>
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}:
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" colSpan={2}>
                                    {data?.payload?.tech_lang_keys[13]}{" "}
                                    {result?.tech_bps1} bps{" "}
                                    {data?.payload?.tech_lang_keys[14]}{" "}
                                    {currency.symbol}
                                    {result?.tech_of}{" "}
                                    {data?.payload?.tech_lang_keys[15]}{" "}
                                    {currency.symbol} {result?.tech_equals}
                                    {data?.payload?.tech_lang_keys[16]}{" "}
                                    {currency.symbol}{" "}
                                    {result?.tech_equals + result?.tech_of}
                                  </td>
                                </tr>
                              </>
                            ) : null}
                          </tbody>
                        </table>
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

export default BasisPointCalculator;
