"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTheoreticalYieldCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TheoreticalYieldCalculator = () => {
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
    tech_lx: "8",
    tech_unit_x: "kg",
    tech_ly: "50",
    tech_sx: "0.75",
    tech_dx: "0.16",
    tech_dy: "48",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTheoreticalYieldCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_lx ||
      !formData.tech_unit_x ||
      !formData.tech_ly ||
      !formData.tech_sx ||
      !formData.tech_dx ||
      !formData.tech_dy
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_lx: formData.tech_lx,
        tech_unit_x: formData.tech_unit_x,
        tech_ly: formData.tech_ly,
        tech_sx: formData.tech_sx,
        tech_dx: formData.tech_dx,
        tech_dy: formData.tech_dy,
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
      tech_lx: "8",
      tech_unit_x: "kg",
      tech_ly: "50",
      tech_sx: "0.75",
      tech_dx: "0.16",
      tech_dy: "48",
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
    setFormData((prev) => ({ ...prev, tech_unit_x: unit }));
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
            <div className="w-full px-2 mb-2">
              <p>
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["limit"]}
                </strong>
              </p>
            </div>
            <div className="grid grid-cols-12   gap-1 md:gap-2">
              <div className="col-span-6 md:col-span-6">
                <label htmlFor="tech_lx" className="label">
                  {data?.payload?.tech_lang_keys["Mass"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_lx"
                    step="any"
                    className="mt-2 input"
                    value={formData.tech_lx}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit_x} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams (g)", value: "g" },
                        { label: "micrograms (µg)", value: "µg" },
                        { label: "milligrams (mg)", value: "mg" },
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "pounds (in)", value: "lbs" },
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
              <div className=" col-span-6 md:col-span-6">
                <label htmlFor="tech_ly" className="label">
                  {data?.payload?.tech_lang_keys["weight"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ly"
                    id="tech_ly"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ly}
                    onChange={handleChange}
                  />
                  <span className="input_unit">g / mol</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_sx" className="label">
                  {data?.payload?.tech_lang_keys["sat"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sx"
                    id="tech_sx"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_sx}
                    onChange={handleChange}
                  />
                  <span className="input_unit">g / mol</span>
                </div>
              </div>
            </div>
            <div className="col-12 px-2 my-2">
              <p>
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["dp"]}
                </strong>
              </p>
            </div>
            <div className="grid grid-cols-12 my-3   gap-1 md:gap-4">
              <div className="col-span-6 md:col-span-6 relative">
                <label htmlFor="tech_dx" className="label">
                  Mole(s):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dx"
                    id="tech_dx"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_dx}
                    onChange={handleChange}
                  />
                  <span className="input_unit">g / mol</span>
                </div>
              </div>
              <div className=" col-span-6 md:col-span-6">
                <label htmlFor="tech_dy" className="label">
                  {data?.payload?.tech_lang_keys["weight"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dy"
                    id="tech_dy"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_dy}
                    onChange={handleChange}
                  />
                  <span className="input_unit">g / mol</span>
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
                      <div className="w-full md:w-[57%] lg:w-[60%] mt-2 text-[16px] overflow-auto">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["theo"]}
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {result?.tech_ans
                                  ? `${result.tech_ans} g`
                                  : "00 g"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["limit"]}{" "}
                                  (moles)
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {result?.tech_mole ?? "00"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["sp"]}
                                </strong>
                              </td>
                              <td className="border-b py-2">
                                {result?.tech_st ?? "00"}
                              </td>
                            </tr>
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

export default TheoreticalYieldCalculator;
