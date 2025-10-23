"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useHalfAngleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HalfAngleCalculator = () => {
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
    tech_cal: "angle", // angle sinx  cosx    tanx  sinx_2 cosx_2
    tech_angle: 60,
    tech_angle_unit: "deg",
    tech_func: "0.5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHalfAngleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal: formData.tech_cal,
        tech_angle: formData.tech_angle,
        tech_angle_unit: formData.tech_angle_unit,
        tech_func: formData.tech_func,
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
      tech_cal: "angle", // angle sinx  cosx    tanx  sinx_2 cosx_2
      tech_angle: 60,
      tech_angle_unit: "deg",
      tech_func: "0.5",
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
    setFormData((prev) => ({ ...prev, tech_angle_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const table = {
    0.866: "√3/2",
    0.7071: "√2/2",
    0.5: "1/2",
    "-0.866": "-√3/2",
    "-0.7071": "-√2/2",
    "-0.5": "-1/2",
  };

  const table1 = {
    1.732: "√3",
    "-1.732": "-√3",
    0.5774: "√3/3",
    "-0.5774": "-√3/3",
    1: "1",
    "-1": "-1",
  };

  const getTrigValue = (value, table) => {
    if (value == null) return "";
    const key = value < 0 ? (-1 * value).toFixed(4) : value.toFixed(4);
    let resultVal = table[key] || "";
    if (value < 0 && resultVal && !resultVal.startsWith("-")) {
      resultVal = "-" + resultVal;
    }
    return resultVal;
  };

  // Usage inside React component
  const sinx_val = getTrigValue(result?.sinx, table);
  const cosx_val = getTrigValue(result?.cosx, table);
  const tanx_val = getTrigValue(result?.tanx, table1);
  const sinx2_val = getTrigValue(result?.tech_sinx2, table);
  const cosx2_val = getTrigValue(result?.tech_cosx2, table);
  const tanx2_val = getTrigValue(result?.tech_tanx2, table1);

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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_cal" className="label">
                  {data?.payload?.tech_lang_keys["calculate"]}{" "}
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal"
                    id="tech_cal"
                    value={formData.tech_cal}
                    onChange={handleChange}
                  >
                    <option value="angle">
                      {data?.payload?.tech_lang_keys["2"]} (x)
                    </option>
                    <option value="sinx">sin(x) </option>
                    <option value="cosx">cos(x) </option>
                    <option value="tanx">tan(x) </option>
                    <option value="sinx_2">sin(x/2) </option>
                    <option value="cosx_2">cos(x/2) </option>
                  </select>
                </div>
              </div>
              {formData.tech_cal == "angle" && (
                <>
                  <div className="col-span-12 " id="angleInput">
                    <label htmlFor="tech_angle" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (x)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_angle"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_angle}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_angle_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "degrees (deg)", value: "deg" },
                            { label: "radians (rad)", value: "rad" },
                            { label: "* π rad (pirad)", value: "pirad" },
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
              {formData.tech_cal != "angle" && (
                <>
                  <div className="col-span-12 " id="functionInput">
                    {formData.tech_cal == "sinx" && (
                      <>
                        <label htmlFor="tech_func" className="label">
                          {" "}
                          sin(x)
                        </label>
                      </>
                    )}
                    {formData.tech_cal == "cosx" && (
                      <>
                        <label htmlFor="tech_func" className="label">
                          {" "}
                          cos(x)
                        </label>
                      </>
                    )}
                    {formData.tech_cal == "tanx" && (
                      <>
                        <label htmlFor="tech_func" className="label">
                          {" "}
                          tan(x)
                        </label>
                      </>
                    )}
                    {formData.tech_cal == "sinx_2" && (
                      <>
                        <label htmlFor="tech_func" className="label">
                          {" "}
                          sin(x/2){" "}
                        </label>
                      </>
                    )}
                    {formData.tech_cal == "cosx_2" && (
                      <>
                        <label htmlFor="tech_func" className="label">
                          {" "}
                          cos(x/2)
                        </label>
                      </>
                    )}
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_func"
                        id="tech_func"
                        min="-1"
                        max="1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_func}
                        onChange={handleChange}
                      />
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
                        {result?.tech_angle_u && (
                          <>
                            {result?.tech_angle_u == "deg" && (
                              <>
                                {sinx2_val && cosx2_val && tanx2_val && (
                                  <>
                                    <p className="mt-3 text-[18px]">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]}
                                      </strong>
                                    </p>

                                    <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                                      <table className="w-full text-[16px]">
                                        <tbody>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>sin(x/2)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {result?.tech_sinx2}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>cos(x/2)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {result?.tech_cosx2}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>tan(x/2)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {result?.tech_tanx2}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <p className="mt-3 text-[18px]">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]}
                                      </strong>
                                    </p>

                                    <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                                      <table className="w-full text-[16px]">
                                        <tbody>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              sin(x/2)
                                            </td>
                                            <td className="py-2 border-b">
                                              <strong>{sinx2_val}</strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              cos(x/2)
                                            </td>
                                            <td className="py-2 border-b">
                                              <strong>{cosx2_val}</strong>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              tan(x/2)
                                            </td>
                                            <td className="py-2 border-b">
                                              <strong>{tanx2_val}</strong>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}

                        {!sinx2_val && !cosx2_val && !tanx2_val && (
                          <>
                            <p className="mt-3 text-[18px]">
                              <strong>Half-Angle Functions</strong>
                            </p>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>sin(x/2)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_sinx2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>cos(x/2)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_cosx2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>tan(x/2)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_tanx2}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        <div className="w-full text-[16px] mt-3 overflow-auto">
                          <p className="text-[18px]">
                            <strong>Solution</strong>
                          </p>
                          <p className="mt-3">Formulas</p>

                          <BlockMath
                            math={`\\sin\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 - \\cos(x)}{2}}`}
                          />
                          <BlockMath
                            math={`\\cos\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 + \\cos(x)}{2}}`}
                          />
                          <BlockMath
                            math={`\\tan\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 - \\cos(x)}{1 + \\cos(x)}}`}
                          />

                          <p className="mt-3">
                            Put angle value ({formData?.tech_angle}) into cos(x)
                          </p>
                          <p className="mt-3">
                            cos({formData?.tech_angle}) = {result?.tech_cosx}
                          </p>

                          <p className="mt-3">Find sin(x/2)</p>
                          <BlockMath
                            math={`\\sin\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 - \\cos(x)}{2}}`}
                          />
                          <BlockMath
                            math={`\\sin\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 - (${result?.tech_cosx})}{2}}`}
                          />
                          <BlockMath
                            math={`\\sin\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{${result?.tech_s1}}{2}}`}
                          />
                          <BlockMath
                            math={`\\sin\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{${result?.tech_s2}}`}
                          />
                          <BlockMath
                            math={`\\sin\\left(\\frac{x}{2}\\right) = \\pm ${result?.tech_sinx2}`}
                          />

                          <p className="mt-3">Find cos(x/2)</p>
                          <BlockMath
                            math={`\\cos\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 + \\cos(x)}{2}}`}
                          />
                          <BlockMath
                            math={`\\cos\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 + (${result?.tech_cosx})}{2}}`}
                          />
                          <BlockMath
                            math={`\\cos\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{${result?.tech_c1}}{2}}`}
                          />
                          <BlockMath
                            math={`\\cos\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{${result?.tech_c2}}`}
                          />
                          <BlockMath
                            math={`\\cos\\left(\\frac{x}{2}\\right) = \\pm ${result?.tech_cosx2}`}
                          />

                          <p className="mt-3">Find tan(x/2)</p>
                          <BlockMath
                            math={`\\tan\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 - \\cos(x)}{1 + \\cos(x)}}`}
                          />
                          <BlockMath
                            math={`\\tan\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{1 - (${result?.tech_cosx})}{1 + (${result?.tech_cosx})}}`}
                          />
                          <BlockMath
                            math={`\\tan\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{\\frac{${result?.tech_s1}}{${result?.tech_c1}}}`}
                          />
                          <BlockMath
                            math={`\\tan\\left(\\frac{x}{2}\\right) = \\pm \\sqrt{${result?.tech_t1}}`}
                          />
                          <BlockMath
                            math={`\\tan\\left(\\frac{x}{2}\\right) = \\pm ${result?.tech_tanx2}`}
                          />
                        </div>

                        {result?.tech_angle_u && (
                          <>
                            {result?.tech_angle_u == "deg" && (
                              <>
                                {sinx2_val && cosx2_val && tanx2_val && (
                                  <>
                                    <p className="mt-3 text-[18px]">
                                      <strong>Basic Functions</strong>
                                    </p>
                                    <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                                      <table className="w-full text-[16px]">
                                        <tbody>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>sin(x)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {result?.tech_sinx}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>cos(x)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {result?.tech_cosx}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>tan(x)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {result?.tech_tanx}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <p className="mt-3 text-[18px]">
                                      <strong>Precise Values</strong>
                                    </p>
                                    <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                                      <table className="w-full text-[16px]">
                                        <tbody>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>sin(x)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {sinx_val}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>cos(x)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {cosx_val}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              className="py-2 border-b"
                                              width="60%"
                                            >
                                              <strong>tan(x)</strong>
                                            </td>
                                            <td className="py-2 border-b">
                                              {tanx_val}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                        {!sinx_val && !cosx_val && !tanx_val && (
                          <>
                            <p className="mt-3 text-[18px]">
                              <strong>Basic Functions</strong>
                            </p>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>sin(x)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_sinx}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>cos(x)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_cosx}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>tan(x)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_tanx}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        <div className="w-full text-[16px] mt-3 overflow-auto">
                          <p className="text-[18px]">
                            <strong>Solution</strong>
                          </p>
                          <p className="mt-3">
                            Put angle value ({formData?.tech_angle}) into
                            sin(x), cos(x) & tan(x)
                          </p>
                          <p className="mt-3">
                            sin({formData?.tech_angle}) = {result?.tech_sinx}
                          </p>
                          <p className="mt-3">
                            cos({formData?.tech_angle}) = {result?.tech_cosx}
                          </p>
                          <p className="mt-3">
                            tan({formData?.tech_angle}) = {result?.tech_tanx}
                          </p>
                        </div>
                        {formData?.tech_cal != "angle" && (
                          <>
                            <p className="mt-3 text-[18px]">
                              <strong>Angle</strong>
                            </p>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>Angle</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle_deg} degrees
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>Angle</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle_rad} radians
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>Angle</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle_pirad} π radians
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

export default HalfAngleCalculator;
