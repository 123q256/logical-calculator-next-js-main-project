"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useCfuCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CfuCalculator = () => {
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
    tech_nc: "9",
    tech_df: "7",
    tech_volume: "10",
    tech_volume_units: "l",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCfuCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_nc || !formData.tech_df) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_nc: formData.tech_nc,
        tech_df: formData.tech_df,
        tech_volume: formData.tech_volume,
        tech_volume_units: formData.tech_volume_units,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_nc: "9",
      tech_df: "7",
      tech_volume: "10",
      tech_volume_units: "l",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_volume_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
            <div className="grid grid-cols-12 gap-1  md:gap-3">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_nc" className="label">
                  {data?.payload?.tech_lang_keys["amount"]} [nc]:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_nc"
                    id="tech_nc"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_nc}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_df" className="label">
                  {data?.payload?.tech_lang_keys["2"]} [DF]:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_df"
                    id="tech_df"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_df}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_volume" className="label">
                  {data?.payload?.tech_lang_keys["3"]} [vc]
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_volume"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_volume}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_volume_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cubic millimeters (mm³)", value: "mm³" },
                        { label: "cubic centimeters (cm³)", value: "cm³" },
                        { label: "cubic decimeters (dm³)", value: "dm³" },
                        { label: "cubic meters (m³)", value: "m³" },
                        { label: "cubic inches (cu in)", value: "cu in" },
                        { label: "cubic yards (cu yd)", value: "cu yd" },
                        { label: "milliliters (ml)", value: "ml" },
                        { label: "centiliters (cl)", value: "cl" },
                        { label: "liters (l)", value: "l" },
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full overflow-auto">
                        {result?.tech_cfu && (
                          <>
                            <p>
                              <strong className="text-[18px]">
                                {data?.payload?.tech_lang_keys["4"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[32px]">
                                {result?.tech_cfu} m³
                              </strong>
                            </p>
                            <p className="mt-3">
                              <strong className="text-[18px]">
                                {data?.payload?.tech_lang_keys["5"]}
                              </strong>
                            </p>
                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["4"]}} = \\dfrac{(n_c \\times DF)}{V_c}`}
                            />

                            <p className="mt-2">
                              <strong className="text-[18px]">
                                {data?.payload?.tech_lang_keys["6"]}
                              </strong>
                            </p>

                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["7"]}} [n_c] = ${result?.tech_nc}`}
                            />
                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["8"]}} [DF] = ${result?.tech_df}`}
                            />
                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["9"]}} [V_c] = ${result?.tech_volume} \\ m^3`}
                            />

                            <p className="mt-3">
                              <strong className="text-[18px]">
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>

                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["4"]}} = \\dfrac{(n_c \\times DF)}{V_c}`}
                            />
                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["4"]}} = \\dfrac{(${result?.tech_nc} \\times ${result?.tech_df})}{${result?.tech_volume}}`}
                            />
                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["4"]}} = \\dfrac{${result?.tech_res}}{${result?.tech_volume}}`}
                            />
                            <BlockMath
                              math={`\\text{${data?.payload?.tech_lang_keys["4"]}} = ${result?.tech_cfu} \\ m^3`}
                            />

                            <p className="mt-4">
                              <strong className="text-[18px]">
                                {data?.payload?.tech_lang_keys["4"]}
                              </strong>
                            </p>

                            <div className="col-12 overflow-auto mt-3">
                              <table
                                className="col-12 col-lg-7"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["12"]}{" "}
                                      {data?.payload?.tech_lang_keys["12"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {(
                                          Number(result?.tech_cfu) * 0.001
                                        ).toExponential(1)}
                                      </strong>{" "}
                                      cells/L
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["12"]}{" "}
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {(
                                          Number(result?.tech_cfu) * 1e-9
                                        ).toExponential(1)}
                                      </strong>{" "}
                                      cells/µL
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      {data?.payload?.tech_lang_keys["15"]}{" "}
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                    <td className="py-2 ps-2">
                                      <strong>
                                        {(
                                          Number(result?.tech_cfu) * 1e-12
                                        ).toExponential(1)}
                                      </strong>{" "}
                                      K/µL
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
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

export default CfuCalculator;
