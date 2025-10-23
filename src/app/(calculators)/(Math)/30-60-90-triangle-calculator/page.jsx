"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useThirtySixtyNinetyCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ThirtySixtyNinetyCalculator = () => {
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
    tech_sides: "a", // a b c h A p
    tech_input: "5",
    tech_linear_unit: "cm",
    tech_square_unit: "cm²",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useThirtySixtyNinetyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_sides || !formData.tech_input) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_sides: formData.tech_sides,
        tech_input: formData.tech_input,
        tech_linear_unit: formData.tech_linear_unit,
        tech_square_unit: formData.tech_square_unit,
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
      tech_sides: "a", // a b c h A p
      tech_input: "5",
      tech_linear_unit: "cm",
      tech_square_unit: "cm²",
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
    setFormData((prev) => ({ ...prev, tech_linear_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_square_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="col-span-12">
                  <label htmlFor="tech_sides" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_sides"
                      id="tech_sides"
                      value={formData.tech_sides}
                      onChange={handleChange}
                    >
                      <option value="a">
                        {data?.payload?.tech_lang_keys[3]} (a)
                      </option>
                      <option value="b">
                        {data?.payload?.tech_lang_keys[3]} (b)
                      </option>
                      <option value="c">
                        {data?.payload?.tech_lang_keys[17]} (c)
                      </option>
                      <option value="h">
                        {data?.payload?.tech_lang_keys[4]} (h)
                      </option>
                      <option value="A">
                        {data?.payload?.tech_lang_keys[5]} (A)
                      </option>
                      <option value="p">
                        {data?.payload?.tech_lang_keys[6]} (p)
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-span-12">
                  <label htmlFor="tech_input" className="label">
                    {formData?.tech_sides === "b"
                      ? "Enter leg (b)"
                      : formData?.tech_sides === "c"
                      ? "Enter Hypotenuse (c)"
                      : formData?.tech_sides === "h"
                      ? "Enter Height (h)"
                      : formData?.tech_sides === "A"
                      ? "Enter Area (A)"
                      : formData?.tech_sides === "p"
                      ? "Enter Perimeter (p)"
                      : "Enter leg (a)"}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_input"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_input}
                      placeholder="00"
                      onChange={handleChange}
                    />

                    {formData.tech_sides != "A" ? (
                      <>
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown}
                        >
                          {formData.tech_linear_unit} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimeters (mm)", value: "mm" },
                              { label: "centimeters (cm)", value: "cm" },
                              { label: "meters (m)", value: "m" },
                              { label: "kilometers (km)", value: "km" },
                              { label: "inches (in)", value: "in" },
                              { label: "feets (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
                              { label: "miles (mi)", value: "mi" },
                              { label: "nautical miles (nmi)", value: "nmi" },
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
                      </>
                    ) : (
                      <>
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_square_unit} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              {
                                label: "square millimeters (mm²)",
                                value: "mm²",
                              },
                              {
                                label: "square centimeters (cm²)",
                                value: "cm²",
                              },
                              { label: "square meters (m²)", value: "m²" },
                              {
                                label: "square kilometers (km²)",
                                value: "km²",
                              },
                              { label: "square inches (in²)", value: "in²" },
                              { label: "square feets (ft²)", value: "ft²" },
                              { label: "square yards (yd²)", value: "yd²" },
                              { label: "square miles (mi²)", value: "mi²" },
                              {
                                label: "square nautical miles (nmi²)",
                                value: "nmi²",
                              },
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
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 my-auto">
                <div className="col-12 text-center mt-3">
                  <img
                    src="/images/qsqs.png"
                    height="100%"
                    width="80%"
                    alt="30 60 90 Triangle Image"
                    loading="lazy"
                    decoding="async"
                  />
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[90%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {result?.tech_method != "1" && (
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["3"]} (a)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_a} cm
                                  </td>
                                </tr>
                              )}
                              {result?.tech_method != "2" && (
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["3"]} (b)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_b} cm
                                  </td>
                                </tr>
                              )}
                              {result?.tech_method != "3" && (
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["17"]} (c)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_c} cm
                                  </td>
                                </tr>
                              )}
                              {result?.tech_method != "4" && (
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]} (h)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_height} cm
                                  </td>
                                </tr>
                              )}
                              {result?.tech_method != "5" && (
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["5"]} (A)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_aa} cm²
                                  </td>
                                </tr>
                              )}
                              {result?.tech_method != "6" && (
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]} (p)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_peri} cm
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_in_radius} cm
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]} (R)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_radius} cm
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["10"]}:
                            </strong>
                          </p>

                          {result?.tech_method === "1" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} b:
                              </p>
                              <BlockMath math={`b = a \\times \\sqrt{3}`} />
                              <BlockMath
                                math={`b = ${result?.tech_a} \\times \\sqrt{3}`}
                              />
                              <BlockMath math={`b = ${result?.tech_b}`} />
                            </>
                          )}

                          {result?.tech_method === "2" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} a:
                              </p>
                              <BlockMath math={`a = \\dfrac{b}{\\sqrt{3}}`} />
                              <BlockMath
                                math={`a = \\dfrac{${result?.tech_b}}{\\sqrt{3}}`}
                              />
                              <BlockMath math={`a = ${result?.tech_a}`} />
                            </>
                          )}

                          {result?.tech_method === "3" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} a:
                              </p>
                              <BlockMath math={`a = \\dfrac{c}{2}`} />
                              <BlockMath
                                math={`a = \\dfrac{${result?.tech_c}}{2}`}
                              />
                              <BlockMath math={`a = ${result?.tech_a}`} />

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} b:
                              </p>
                              <BlockMath math={`b = a \\times \\sqrt{3}`} />
                              <BlockMath
                                math={`b = ${result?.tech_a} \\times \\sqrt{3}`}
                              />
                              <BlockMath math={`b = ${result?.tech_b}`} />
                            </>
                          )}

                          {result?.tech_method === "4" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} b:
                              </p>
                              <BlockMath math={`b = h \\times 2`} />
                              <BlockMath
                                math={`b = ${result?.tech_height} \\times 2`}
                              />
                              <BlockMath math={`b = ${result?.tech_b}`} />

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} a:
                              </p>
                              <BlockMath math={`a = \\dfrac{b}{\\sqrt{3}}`} />
                              <BlockMath
                                math={`a = \\dfrac{${result?.tech_b}}{\\sqrt{3}}`}
                              />
                              <BlockMath math={`a = ${result?.tech_a}`} />
                            </>
                          )}

                          {result?.tech_method === "5" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} a:
                              </p>
                              <BlockMath
                                math={`a = \\sqrt{\\dfrac{2 \\times area}{\\sqrt{3}}}`}
                              />
                              <BlockMath
                                math={`a = \\sqrt{\\dfrac{2 \\times ${result?.tech_aa}}{\\sqrt{3}}}`}
                              />
                              <BlockMath math={`a = ${result?.tech_a}`} />

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} b:
                              </p>
                              <BlockMath math={`b = a \\times \\sqrt{3}`} />
                              <BlockMath
                                math={`b = ${result?.tech_a} \\times \\sqrt{3}`}
                              />
                              <BlockMath math={`b = ${result?.tech_b}`} />
                            </>
                          )}

                          {result?.tech_method === "6" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} a:
                              </p>
                              <BlockMath
                                math={`a = \\dfrac{perimeter}{3 + \\sqrt{3}}`}
                              />
                              <BlockMath
                                math={`a = \\dfrac{${result?.tech_peri}}{3 + \\sqrt{3}}`}
                              />
                              <BlockMath math={`a = ${result?.tech_a}`} />

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} b:
                              </p>
                              <BlockMath math={`b = a \\times \\sqrt{3}`} />
                              <BlockMath
                                math={`b = ${result?.tech_a} \\times \\sqrt{3}`}
                              />
                              <BlockMath math={`b = ${result?.tech_b}`} />
                            </>
                          )}

                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["11"]} c:
                            </p>
                            <BlockMath math={`c = 2a`} />
                            <BlockMath
                              math={`c = 2 \\times ${result?.tech_a}`}
                            />
                            <BlockMath math={`c = ${result?.tech_c}`} />

                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["12"]} (h):
                            </p>
                            <BlockMath math={`h = \\dfrac{a \\times b}{c}`} />
                            <BlockMath
                              math={`h = \\dfrac{${result?.tech_a} \\times ${result?.tech_b}}{${result?.tech_c}}`}
                            />
                            <BlockMath
                              math={`h = \\dfrac{${
                                result?.tech_a * result?.tech_b
                              }}{${result?.tech_c}}`}
                            />
                            <BlockMath math={`h = ${result?.tech_height}`} />

                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["13"]} (A):
                            </p>
                            <BlockMath
                              math={`A = \\dfrac{a^2 \\times \\sqrt{3}}{2}`}
                            />
                            <BlockMath
                              math={`A = \\dfrac{${result?.tech_a}^2 \\times \\sqrt{3}}{2}`}
                            />
                            <BlockMath
                              math={`A = \\dfrac{${
                                result?.tech_a * result?.tech_a
                              } \\times \\sqrt{3}}{2}`}
                            />
                            <BlockMath math={`A = ${result?.tech_aa}`} />

                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["14"]} (p):
                            </p>
                            <BlockMath math={`p = a + b + c`} />
                            <BlockMath
                              math={`p = ${result?.tech_a} + ${result?.tech_b} + ${result?.tech_c}`}
                            />
                            <BlockMath math={`p = ${result?.tech_peri}`} />

                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["15"]} (r):
                            </p>
                            <BlockMath
                              math={`r = \\dfrac{a \\times b}{\\text{perimeter}}`}
                            />
                            <BlockMath
                              math={`r = \\dfrac{${result?.tech_a} \\times ${result?.tech_b}}{${result?.tech_peri}}`}
                            />
                            <BlockMath math={`r = ${result?.tech_in_radius}`} />

                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["16"]} (R):
                            </p>
                            <BlockMath math={`R = \\dfrac{c}{2}`} />
                            <BlockMath
                              math={`R = \\dfrac{${result?.tech_c}}{2}`}
                            />
                            <BlockMath math={`R = ${result?.tech_radius}`} />
                          </>
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

export default ThirtySixtyNinetyCalculator;
