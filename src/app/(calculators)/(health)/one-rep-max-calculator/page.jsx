"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useOneRepMaxCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const OneRepMaxCalculator = () => {
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

  console.log(data);

  const [formData, setFormData] = useState({
    tech_weight: "5",
    tech_weight_unit: "kg",
    tech_rep: "19",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOneRepMaxCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_weight ||
      !formData.tech_weight_unit ||
      !formData.tech_rep
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_rep: formData.tech_rep,
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
      tech_weight: "5",
      tech_weight_unit: "kg",
      tech_rep: "19",
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
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-12">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.tech_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "pounds (lbs)", value: "lbs" },
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
              <div className="col-span-12 md:col-span-12">
                <label htmlFor="tech_rep" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_rep"
                  id="tech_rep"
                  className="input my-2"
                  aria-label="input"
                  placeholder="00"
                  value={formData.tech_rep}
                  onChange={handleChange}
                />
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
              <div className=" w-full h-[30px] bg-gray-3 animate-pulse rounded-[10px] mb-4"></div>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full text-center">
                          <p className="text-[20px]">
                            <strong>{data?.payload?.tech_lang_keys[3]}</strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong>
                                {Math.round(result?.tech_ans * 10) / 10}{" "}
                                <span className="font_size22">
                                  {formData?.tech_weight_unit}
                                </span>
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="w-full overflow-auto mt-3">
                          <table
                            className="w-full md:w-[60%] lg:w-[60%]"
                            cellSpacing="0"
                          >
                            <tbody>
                              <tr>
                                <th className="text-start text-blue border-b py-2">
                                  % of 1RM
                                </th>
                                <th className="text-start text-blue border-b py-2">
                                  {data?.payload?.tech_lang_keys[4]}
                                </th>
                                <th className="text-start text-blue border-b py-2">
                                  {data?.payload?.tech_lang_keys[5]} 1RM
                                </th>
                              </tr>
                              <tr>
                                <td className="border-b py-2">100%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">1</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">95%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.95 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">2</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">90%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.9 * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">4</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">85%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.85 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">6</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">80%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.8 * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">8</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">75%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.75 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">10</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">70%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.7 * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">12</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">65%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.65 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">16</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">60%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.6 * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">20</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">55%</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.55 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">24</td>
                              </tr>
                              <tr>
                                <td className="py-2">50%</td>
                                <td className="py-2">
                                  {Math.round(result?.tech_ans * 0.5 * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="py-2">30</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[20px] mt-3">
                          <strong className="text ">
                            {data?.payload?.tech_lang_keys[6]} % of 1RM
                          </strong>
                        </p>
                        <div className="w-full overflow-auto">
                          <table
                            className="w-full md:w-[60%] lg:w-[60%] "
                            cellSpacing="0"
                          >
                            <tbody>
                              <tr>
                                <th className="text-start text-blue border-b py-2 ">
                                  {data?.payload?.tech_lang_keys[2]}
                                </th>
                                <th className="text-start text-blue border-b py-2 ">
                                  {data?.payload?.tech_lang_keys[4]}
                                </th>
                                <th className="text-start text-blue border-b py-2">
                                  % of 1RM
                                </th>
                              </tr>
                              <tr>
                                <td className="border-b py-2">1</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">100%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">2</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.97 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">97%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">3</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.94 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">94%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">4</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.92 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">92%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">5</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.89 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">89%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">6</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.86 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">86%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">7</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.83 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">83%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">8</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.81 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">81%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">9</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.78 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">78%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">10</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.75 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">75%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">11</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.73 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">73%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">12</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.71 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">71%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">13</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.7 * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">70%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">14</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.68 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">68%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">15</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.67 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">67%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">16</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.65 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">65%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">17</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.64 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">64%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">18</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.63 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">63%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">19</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.61 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">61%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">20</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.6 * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">60%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">21</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.59 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">59%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">22</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.58 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">58%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">23</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.57 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">57%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">24</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.56 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">56%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">25</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.55 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">55%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">26</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.54 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">54%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">27</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.53 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">53%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">28</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.52 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">52%</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">29</td>
                                <td className="border-b py-2">
                                  {Math.round(result?.tech_ans * 0.51 * 10) /
                                    10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="border-b py-2">51%</td>
                              </tr>
                              <tr>
                                <td className="py-2">30</td>
                                <td className="py-2">
                                  {Math.round(result?.tech_ans * 0.5 * 10) / 10}{" "}
                                  {formData?.tech_weight_unit}
                                </td>
                                <td className="py-2">50%</td>
                              </tr>
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

export default OneRepMaxCalculator;
