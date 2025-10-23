"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useSpringConstantCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SpringConstantCalculator = () => {
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
    tech_selection: "2", //  1 2 3
    tech_spring_constant: "4",
    tech_spring_displacement: "45",
    tech_spring_displacement_unit: "cm",
    tech_spring_force: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSpringConstantCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_spring_constant: formData.tech_spring_constant,
        tech_spring_displacement: formData.tech_spring_displacement,
        tech_spring_displacement_unit: formData.tech_spring_displacement_unit,
        tech_spring_force: formData.tech_spring_force,
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
      tech_selection: "2", //  1 2 3
      tech_spring_constant: "4",
      tech_spring_displacement: "45",
      tech_spring_displacement_unit: "cm",
      tech_spring_force: "4",
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
    setFormData((prev) => ({ ...prev, tech_spring_displacement_unit: unit }));
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-1">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
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
              {(formData.tech_selection == "1" ||
                formData.tech_selection == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 const">
                    <label htmlFor="tech_spring_constant" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (K)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_spring_constant"
                        id="tech_spring_constant"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_spring_constant}
                        onChange={handleChange}
                      />
                      <span className="input_unit">N/m</span>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2") && (
                <>
                  <div className="col-span-12 md:col-span-6 dis">
                    <label htmlFor="tech_spring_displacement" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (X)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_spring_displacement"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_spring_displacement}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_spring_displacement_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m", value: "m" },
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "inches", value: "inches" },
                            { label: "feet", value: "feet" },
                            { label: "yards", value: "yards" },
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

              {(formData.tech_selection == "2" ||
                formData.tech_selection == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6  force">
                    <label htmlFor="tech_spring_force" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (F)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_spring_force"
                        id="tech_spring_force"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_spring_force}
                        onChange={handleChange}
                      />
                      <span className="input_unit">N</span>
                    </div>
                  </div>
                </>
              )}
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                      <div className="w-full text-[20px]">
                        {result?.tech_fahad1 !== undefined ? (
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys[8]} (F)</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2 text-[25px]">
                                {Number(result?.tech_fahad1).toFixed(3)} N
                              </strong>
                            </p>
                          </div>
                        ) : result?.tech_fahad2 !== undefined ? (
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys[5]} (K)</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2 text-[25px]">
                                {Number(result?.tech_fahad2).toFixed(3)} N/m
                              </strong>
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="w-full text-center  overflow-auto">
                              <p>{data?.payload?.tech_lang_keys[9]} (X)</p>
                              <p className="my-3">
                                <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2 text-[25px]">
                                  {Number(result?.tech_an).toFixed(3)} M
                                </strong>
                              </p>
                            </div>
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[10]}
                              </strong>
                            </p>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                              <tbody>
                                {[11, 12, 13, 14, 15].map((index, i) => (
                                  <tr key={index}>
                                    <td className="py-2 border-b" width="70%">
                                      {data?.payload?.tech_lang_keys[index]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {
                                          result?.[
                                            `tech_ans${i === 0 ? "" : i}`
                                          ]
                                        }{" "}
                                        ({data?.payload?.tech_lang_keys[index]})
                                      </strong>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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

export default SpringConstantCalculator;
