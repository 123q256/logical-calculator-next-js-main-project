"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useAreaOfASemicircleMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AreaOfASemicircleCalculator = () => {
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
    tech_selection: "1",
    tech_radius: "9",
    tech_pi: "3.1415926535898",
    tech_units: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAreaOfASemicircleMutation();

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
        tech_radius: formData.tech_radius,
        tech_pi: formData.tech_pi,
        tech_units: formData.tech_units,
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
      tech_selection: "1",
      tech_radius: "9",
      tech_pi: "3.1415926535898",
      tech_units: "cm",
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

  // result

  const unitSuperscript = {
    cm: "cm²",
    m: "m²",
    mm: "mm²",
    ft: "ft²",
    yd: "yd²",
  };

  const unit = result?.tech_unit || "";
  const unitDisplay = unitSuperscript[unit] || unit;

  const r = result?.tech_radius;
  const d = result?.tech_diameter;
  const a = result?.tech_arc_length;
  const p = result?.tech_perimeter;
  const A = result?.tech_area;
  const pi = result?.tech_pi;

  const roundVal = (v) => (v !== undefined ? Math.round(v * 1000) / 1000 : "");

  const selection = result?.tech_selection;

  const renderSteps = () => {
    switch (selection) {
      case "1": // Given radius
        return (
          <>
            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["3"]}}\\,(d) = 2r`}
            />
            <BlockMath math={`d = 2 \\times ${r}`} />
            <BlockMath math={`d = ${roundVal(r * 2)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["4"]}}\\,(a) = \\pi r`}
            />
            <BlockMath math={`a = \\pi \\times ${r}`} />
            <BlockMath math={`a = ${roundVal(a)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["6"]}}\\,(A) = \\dfrac{\\pi \\times r^2}{2}`}
            />
            <BlockMath math={`A = \\dfrac{\\pi \\times ${r}^2}{2}`} />
            <BlockMath math={`A = ${roundVal((pi * r * r) / 2)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["5"]}}\\,(p) = \\pi r + 2r`}
            />
            <BlockMath math={`p = ${r}\\pi + 2 \\times ${r}`} />
            <BlockMath math={`p = ${p}`} />
          </>
        );

      case "2": // Given diameter
        return (
          <>
            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["2"]}}\\,(r) = \\dfrac{d}{2}`}
            />
            <BlockMath math={`r = \\dfrac{${d}}{2}`} />
            <BlockMath math={`r = ${roundVal(r)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["4"]}}\\,(a) = r\\pi`}
            />
            <BlockMath math={`a = ${r} \\times ${pi}`} />
            <BlockMath math={`a = ${roundVal(pi * r)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["6"]}}\\,(A) = \\dfrac{\\pi \\times r^2}{2}`}
            />
            <BlockMath math={`A = \\dfrac{\\pi \\times ${r}^2}{2}`} />
            <BlockMath math={`A = ${roundVal(A)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["5"]}}\\,(p) = \\pi r + 2r`}
            />
            <BlockMath math={`p = ${r}\\pi + 2 \\times ${r}`} />
            <BlockMath math={`p = ${roundVal(p)}`} />
          </>
        );

      case "3": // Given arc length
        return (
          <>
            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["2"]}}\\,(r) = \\dfrac{c}{\\pi}`}
            />
            <BlockMath math={`r = \\dfrac{${a}}{\\pi}`} />
            <BlockMath math={`r = ${roundVal(r)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["3"]}}\\,(d) = 2r`}
            />
            <BlockMath math={`d = ${r} \\times 2`} />
            <BlockMath math={`d = ${roundVal(d)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["6"]}}\\,(A) = \\dfrac{\\pi \\times r^2}{2}`}
            />
            <BlockMath math={`A = \\dfrac{\\pi \\times ${r}^2}{2}`} />
            <BlockMath math={`A = ${roundVal(A)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["5"]}}\\,(p) = \\pi r + 2r`}
            />
            <BlockMath math={`p = ${r}\\pi + 2 \\times ${r}`} />
            <BlockMath math={`p = ${roundVal(p)}`} />
          </>
        );

      case "4": // Given perimeter
        return (
          <>
            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["2"]}}\\,(r) = \\dfrac{p}{\\pi + 2}`}
            />
            <BlockMath math={`r = \\dfrac{${p}}{${pi + 2}}`} />
            <BlockMath math={`r = ${roundVal(r)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["4"]}}\\,(a) = r\\pi`}
            />
            <BlockMath math={`a = ${r} \\times ${pi}`} />
            <BlockMath math={`a = ${roundVal(a)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["6"]}}\\,(A) = \\dfrac{\\pi \\times r^2}{2}`}
            />
            <BlockMath math={`A = \\dfrac{\\pi \\times ${r}^2}{2}`} />
            <BlockMath math={`A = ${roundVal(A)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["5"]}}\\,(p) = \\pi r + 2r`}
            />
            <BlockMath math={`p = ${r}\\pi + 2 \\times ${r}`} />
            <BlockMath math={`p = ${roundVal(p)}`} />
          </>
        );

      case "6": // Given Area
        return (
          <>
            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["2"]}}\\,(r) = \\sqrt{\\dfrac{2a}{\\pi}}`}
            />
            <BlockMath math={`r = \\sqrt{\\dfrac{2 \\times ${A}}{\\pi}}`} />
            <BlockMath math={`r = ${roundVal(r)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["4"]}}\\,(a) = r\\pi`}
            />
            <BlockMath math={`a = ${r} \\times ${pi}`} />
            <BlockMath math={`a = ${roundVal(a)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["3"]}}\\,(d) = 2r`}
            />
            <BlockMath math={`d = ${r} \\times 2`} />
            <BlockMath math={`d = ${roundVal(d)}`} />

            <BlockMath
              math={`\\textbf{${data?.payload?.tech_lang_keys["5"]}}\\,(p) = \\pi r + 2r`}
            />
            <BlockMath math={`p = ${r}\\pi + 2 \\times ${r}`} />
            <BlockMath math={`p = ${roundVal(p)}`} />
          </>
        );

      default:
        return <p>No calculation steps available.</p>;
    }
  };

  const getUnitWithSuperscript = (unit) => {
    switch (unit) {
      case "cm":
        return "cm²";
      case "m":
        return "m²";
      case "mm":
        return "mm²";
      case "ft":
        return "ft²";
      case "yd":
        return "yd²";
      default:
        return unit;
    }
  };

  const unitSup = getUnitWithSuperscript(unit);

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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} (r){" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} (d)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["3"]} (a)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["3"]} (p)
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["3"]} (A)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                {formData.tech_selection == "2" ? (
                  <>
                    <label htmlFor="tech_radius" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (d):
                    </label>
                  </>
                ) : formData.tech_selection == "3" ? (
                  <>
                    <label htmlFor="tech_radius" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (a):
                    </label>
                  </>
                ) : formData.tech_selection == "4" ? (
                  <>
                    <label htmlFor="tech_radius" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (p):
                    </label>
                  </>
                ) : formData.tech_selection == "6" ? (
                  <>
                    <label htmlFor="tech_radius" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (A):
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_radius" className="label">
                      {" "}
                      Radius (r):
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_radius"
                    id="tech_radius"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_radius}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_pi" className="label">
                  {data?.payload?.tech_lang_keys["t"]} π = :
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_pi"
                    id="tech_pi"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_pi}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_units" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_units"
                    id="tech_units"
                    value={formData.tech_units}
                    onChange={handleChange}
                  >
                    <option value="cm">cm </option>
                    <option value="m">m </option>
                    <option value="in">in </option>
                    <option value="ft">ft </option>
                    <option value="yd">yd </option>
                  </select>
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

                  <div className="rounded-lg flex  mt-3">
                    <div className="w-full md:w-[60%] text-[16px]">
                      <div className="w-full">
                        <div className="w-full md:w-[100%] lg:w-[90%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b  font-bold">
                                  {data?.payload?.tech_lang_keys["2"]} (r)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_radius} {unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b font-bold">
                                  {data?.payload?.tech_lang_keys["3"]} (d)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_diameter} {unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b font-bold">
                                  {data?.payload?.tech_lang_keys["4"]} (a)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_arc_length} {unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b font-bold">
                                  {data?.payload?.tech_lang_keys["5"]} (p)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_perimeter} {unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b font-bold">
                                  {data?.payload?.tech_lang_keys["6"]} (A)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_area} {unitSup}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <p className="font-bold text-[18px] mb-2">
                        {data?.payload?.tech_lang_keys["14"]}
                      </p>
                      {renderSteps()}
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

export default AreaOfASemicircleCalculator;
