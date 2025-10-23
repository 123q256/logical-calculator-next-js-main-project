"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAverageAtomicMassCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AverageAtomicMassCalculator = () => {
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
    tech_isotopes_no: 2,
    tech_per: Array(2).fill("2"),
    tech_per_unit: Array(2).fill("%"), // default %
    tech_mass: Array(2).fill("2"),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAverageAtomicMassCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("tech_per[")) {
      const index = parseInt(name.match(/\[(\d+)\]/)[1]);
      const updated = [...formData.tech_per];
      updated[index] = value;
      setFormData({ ...formData, tech_per: updated });
    } else if (name.startsWith("tech_mass[")) {
      const index = parseInt(name.match(/\[(\d+)\]/)[1]);
      const updated = [...formData.tech_mass];
      updated[index] = value;
      setFormData({ ...formData, tech_mass: updated });
    } else if (name === "tech_isotopes_no") {
      const val = parseInt(value);
      setFormData({
        ...formData,
        tech_isotopes_no: val,
        tech_per: Array(val).fill("2"),
        tech_mass: Array(val).fill("2"),
        tech_per_unit: Array(val).fill("%"), // set default unit to %
      });
    }
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_isotopes_no) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_isotopes_no: formData.tech_isotopes_no,
        tech_per: formData.tech_per,
        tech_per_unit: formData.tech_per_unit,
        tech_mass: formData.tech_mass,
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
      tech_isotopes_no: 2,
      tech_per: Array(10).fill(""),
      tech_per_unit: Array(10).fill("%"),
      tech_mass: Array(10).fill(""),
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
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const setUnitHandler = (index, unit) => {
    const updated = [...formData.tech_per_unit];
    updated[index] = unit;
    setFormData({ ...formData, tech_per_unit: updated });
    setDropdownIndex(null);
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
            <div className="grid grid-cols-1    gap-2">
              {/* Dropdown for isotopes count */}
              <div className=" relative">
                <label htmlFor="tech_isotopes_no" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_isotopes_no"
                    id="tech_isotopes_no"
                    value={formData.tech_isotopes_no}
                    onChange={handleChange}
                  >
                    {[...Array(9)].map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1    gap-2">
              <div className="w-full isotopes">
                {[...Array(formData.tech_isotopes_no)].map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5"
                  >
                    {/* Percentage / Decimal Input */}
                    <div className="">
                      <label htmlFor={`tech_per${index}`} className="label">
                        % of {index + 1} isotope (f<sub>{index + 1}</sub>):
                      </label>
                      <div className="relative w-full">
                        <input
                          type="number"
                          name={`tech_per[${index}]`}
                          step="any"
                          className="mt-2 input"
                          placeholder="00"
                          value={formData.tech_per[index]}
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-5"
                          onClick={() => setDropdownIndex(index)}
                        >
                          {formData.tech_per_unit[index]} ▾
                        </label>
                        {dropdownIndex === index && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              {
                                label: data?.payload?.tech_lang_keys["3"],
                                value: "decimal",
                              },
                              { label: "%", value: "%" },
                            ].map((unit, i) => (
                              <p
                                key={i}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  setUnitHandler(index, unit.value)
                                }
                              >
                                {unit.label}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Mass Input */}
                    <div className="">
                      <label htmlFor={`mass${index}`} className="label">
                        Mass of {index + 1} isotope (m<sub>{index + 1}</sub>):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name={`tech_mass[${index}]`}
                          id={`mass${index}`}
                          step="any"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_mass[index]}
                          onChange={handleChange}
                        />
                        <span className="input_unit">amu</span>
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="bg-sky bordered rounded-[10px] px-3 py-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["7"]} ={" "}
                          </strong>
                          <strong className="text-[#119154] text-[28px]">
                            {" "}
                            {Number(result?.tech_amSum).toFixed(1)}
                          </strong>
                          <strong> amu</strong>
                        </div>

                        <div className="col-12">
                          <p className="mt-3">
                            <strong className="text-[18px]">
                              {data?.payload?.tech_lang_keys["8"]}
                            </strong>
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["9"]} (f) ={" "}
                            {formData.tech_per.map((value, index) => (
                              <span key={index}>
                                {value}
                                {index !== formData.tech_per.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                          </p>

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["10"]} (m) ={" "}
                            {formData.tech_mass.map((value, index) => (
                              <span key={index}>
                                {value}
                                {index !== formData.tech_mass.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                          </p>

                          <p className="mt-3">
                            <strong className="text-[18px]">
                              {data?.payload?.tech_lang_keys["11"]}
                            </strong>
                          </p>

                          {formData?.tech_per_unit[0] === "decimal" ? (
                            <>
                              <p className="mt-2">
                                AM = f<sub>1</sub>m<sub>1</sub> + f<sub>2</sub>m
                                <sub>2</sub> + f<sub>3</sub>m<sub>3</sub> ... +
                                f<sub>n</sub>m<sub>n</sub>
                              </p>
                              <p className="mt-2">
                                AM ={" "}
                                {formData.tech_per.map((per, i) => (
                                  <span key={i}>
                                    {i !== 0 && " + "}({per} x{" "}
                                    {formData.tech_mass[i]})
                                  </span>
                                ))}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}:
                                </strong>{" "}
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">
                                AM = (f<sub>1</sub>m<sub>1</sub> + f<sub>2</sub>
                                m<sub>2</sub> + f<sub>3</sub>m<sub>3</sub> ... +
                                f<sub>n</sub>m<sub>n</sub>) / 100
                              </p>
                              <p className="mt-2">
                                AM = [
                                {formData.tech_per.map((per, i) => (
                                  <span key={i}>
                                    {i !== 0 && " + "}({per} x{" "}
                                    {formData.tech_mass[i]})
                                  </span>
                                ))}
                                ] / 100
                              </p>
                            </>
                          )}

                          <p className="mt-2">
                            AM ={" "}
                            <strong>
                              {Number(result?.tech_amSum).toFixed(1)}
                            </strong>
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

export default AverageAtomicMassCalculator;
