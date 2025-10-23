"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSohcahtoaCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SohcahtoaCalculator = () => {
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
    tech_len_a: "",
    tech_len_b: "",
    tech_len_c: "4",
    tech_angle_alpha: "",
    tech_angle_alpha_unit: "rad",
    tech_angle_beta: "4",
    tech_angle_beta_unit: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSohcahtoaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_len_a: formData.tech_len_a,
        tech_len_b: formData.tech_len_b,
        tech_len_c: formData.tech_len_c,
        tech_angle_alpha: formData.tech_angle_alpha,
        tech_angle_alpha_unit: formData.tech_angle_alpha_unit,
        tech_angle_beta: formData.tech_angle_beta,
        tech_angle_beta_unit: formData.tech_angle_beta_unit,
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
      tech_len_a: "",
      tech_len_b: "",
      tech_len_c: "4",
      tech_angle_alpha: "",
      tech_angle_alpha_unit: "rad",
      tech_angle_beta: "4",
      tech_angle_beta_unit: "deg",
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
    setFormData((prev) => ({ ...prev, tech_angle_alpha_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_beta_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  // Initialize state with default unit from formData and angle values from result
  const [unitA, setUnitA] = useState(
    formData?.tech_angle_beta_unit === "deg" ? "c" : "rad"
  );
  const [unitB, setUnitB] = useState("rad"); // or initialize similarly if you want
  const angleA = result?.tech_anglea ?? 0;
  const angleB = result?.tech_angleb ?? 0;

  // Helper function to convert rad to deg
  const radToDeg = (rad) => rad * (180 / Math.PI);
  // Helper function to convert deg to rad
  const degToRad = (deg) => deg * (Math.PI / 180);

  // Compute displayed value for angle A based on selected unit
  const displayAngleA = unitA === "c" ? radToDeg(angleA) : angleA;
  // Compute displayed value for angle B based on selected unit
  const displayAngleB = unitB === "c" ? radToDeg(angleB) : angleB;

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

          <div className="lg:w-[70%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-6">
                    <label htmlFor="tech_len_a" className="label">
                      {/* {data?.payload?.tech_lang_keys["8"]} a */} Leg (a)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_len_a"
                        id="tech_len_a"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_len_a}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_len_b" className="label">
                      {/* {data?.payload?.tech_lang_keys["8"]} b */} Leg (b)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_len_b"
                        id="tech_len_b"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_len_b}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_len_c" className="label">
                      {/* {data?.payload?.tech_lang_keys["9"]} c */} Hypotenuse
                      (c)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_len_c"
                        id="tech_len_c"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_len_c}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_angle_alpha" className="label">
                      {data?.payload?.tech_lang_keys["2"]} α
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_angle_alpha"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_angle_alpha}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_angle_alpha_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "degrees (deg)", value: "deg" },
                            { label: "radians (rad)", value: "rad" },
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
                  <div className="col-span-12">
                    <label htmlFor="tech_angle_beta" className="label">
                      {data?.payload?.tech_lang_keys["2"]} β
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_angle_beta"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_angle_beta}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_angle_beta_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "degrees (deg)", value: "deg" },
                            { label: "radians (rad)", value: "rad" },
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
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 flex justify-center items-center">
                <div className="w-full">
                  <img
                    src="/images/trogono_co.png"
                    height="160px"
                    width="220px"
                    alt="trianle details image"
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
                        {(result?.tech_method == "1" ||
                          result?.tech_method == "2" ||
                          result?.tech_method == "3" ||
                          result?.tech_method == "4" ||
                          result?.tech_method == "5" ||
                          result?.tech_method == "6" ||
                          result?.tech_method == "7" ||
                          result?.tech_method == "8" ||
                          result?.tech_method == "9" ||
                          result?.tech_method == "10" ||
                          result?.tech_method == "12" ||
                          result?.tech_method == "13" ||
                          result?.tech_method == "14" ||
                          result?.tech_method == "11") && (
                          <>
                            <div className="w-full  ">
                              <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2p-3">
                                <table className="w-full text-[18px] px-lg-3 p-1 py-2">
                                  <tbody>
                                    {(result?.tech_method == "1" ||
                                      result?.tech_method == "4" ||
                                      result?.tech_method == "5" ||
                                      result?.tech_method == "7" ||
                                      result?.tech_method == "8" ||
                                      result?.tech_method == "10" ||
                                      result?.tech_method == "13" ||
                                      result?.tech_method == "14" ||
                                      result?.tech_method == "11") && (
                                      <>
                                        <tr>
                                          <td className="py-2 border-b">
                                            <strong>
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "9"
                                                ]
                                              }{" "}
                                              c
                                            </strong>
                                          </td>
                                          <td className="py-2 border-b">
                                            {Number(result?.tech_c).toFixed(3)}{" "}
                                          </td>
                                        </tr>
                                      </>
                                    )}
                                    {(result?.tech_method == "2" ||
                                      result?.tech_method == "4" ||
                                      result?.tech_method == "6" ||
                                      result?.tech_method == "7" ||
                                      result?.tech_method == "9" ||
                                      result?.tech_method == "10" ||
                                      result?.tech_method == "12" ||
                                      result?.tech_method == "13" ||
                                      result?.tech_method == "14") && (
                                      <>
                                        <tr>
                                          <td className="py-2 border-b">
                                            <strong>
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "8"
                                                ]
                                              }{" "}
                                              b
                                            </strong>
                                          </td>
                                          <td className="py-2 border-b">
                                            {Number(result?.tech_b).toFixed(3)}{" "}
                                          </td>
                                        </tr>
                                      </>
                                    )}
                                    {(result?.tech_method == "3" ||
                                      result?.tech_method == "5" ||
                                      result?.tech_method == "6" ||
                                      result?.tech_method == "8" ||
                                      result?.tech_method == "9" ||
                                      result?.tech_method == "12" ||
                                      result?.tech_method == "13" ||
                                      result?.tech_method == "14" ||
                                      result?.tech_method == "11") && (
                                      <>
                                        <tr>
                                          <td className="py-2 border-b">
                                            <strong>
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "8"
                                                ]
                                              }{" "}
                                              a
                                            </strong>
                                          </td>
                                          <td className="py-2 border-b">
                                            {Number(result?.tech_a).toFixed(3)}{" "}
                                          </td>
                                        </tr>
                                      </>
                                    )}
                                    {((result?.tech_method != "4" &&
                                      result?.tech_method != "5" &&
                                      result?.tech_method != "6") ||
                                      result?.tech_method == "8" ||
                                      result?.tech_method == "9" ||
                                      result?.tech_method == "10" ||
                                      result?.tech_method == "12" ||
                                      result?.tech_method == "14" ||
                                      result?.tech_method == "11") && (
                                      <>
                                        {result?.tech_method !== "13" && (
                                          <tr>
                                            <td className="py-2 border-b">
                                              <strong>
                                                {
                                                  data?.payload?.tech_lang_keys[
                                                    "2"
                                                  ]
                                                }{" "}
                                                α
                                              </strong>
                                            </td>
                                            {formData?.tech_angle_beta_unit ===
                                            "deg" ? (
                                              <td className="py-2 border-b flex items-center">
                                                <span id="result_value">
                                                  {displayAngleA.toFixed(3)}
                                                </span>
                                                <div className="py-2 px-2 relative">
                                                  <select
                                                    className="input"
                                                    name="to_cal"
                                                    id="to_cal"
                                                    value={unitA}
                                                    onChange={(e) =>
                                                      setUnitA(e.target.value)
                                                    }
                                                  >
                                                    <option value="c">°</option>
                                                    <option value="rad">
                                                      rad
                                                    </option>
                                                  </select>
                                                </div>
                                              </td>
                                            ) : (
                                              <td className="py-2 border-b flex items-center">
                                                <span id="result_valueb">
                                                  {displayAngleB.toFixed(3)}
                                                </span>
                                                <div className="py-2 px-2 relative">
                                                  <select
                                                    className="input"
                                                    name="to_calb"
                                                    id="to_calb"
                                                    value={unitB}
                                                    onChange={(e) =>
                                                      setUnitB(e.target.value)
                                                    }
                                                  >
                                                    <option value="c">°</option>
                                                    <option value="rad">
                                                      rad
                                                    </option>
                                                  </select>
                                                </div>
                                              </td>
                                            )}
                                          </tr>
                                        )}
                                      </>
                                    )}

                                    {((result?.tech_method != "7" &&
                                      result?.tech_method != "8" &&
                                      result?.tech_method != "9") ||
                                      result?.tech_method == "10" ||
                                      result?.tech_method == "12" ||
                                      result?.tech_method == "13" ||
                                      result?.tech_method == "11") && (
                                      <>
                                        <tr>
                                          <td className="py-2 border-b">
                                            <strong>
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "2"
                                                ]
                                              }{" "}
                                              β
                                            </strong>
                                          </td>
                                          {formData?.tech_angle_beta_unit ===
                                          "deg" ? (
                                            <td className="py-2 border-b flex items-center">
                                              {/* <span id="result_valueb">
                                                      {Number(result?.tech_angleb * (180 / Math.PI)).toFixed(3)}
                                                    </span>
                                                     */}
                                              <span id="result_value">
                                                {displayAngleA.toFixed(3)}
                                              </span>
                                              <div className="py-2 px-2 relative">
                                                <select
                                                  className="input"
                                                  name="to_calb"
                                                  id="to_calb"
                                                  value={unitA}
                                                  onChange={(e) =>
                                                    setUnitA(e.target.value)
                                                  }
                                                >
                                                  <option value="c">°</option>
                                                  <option value="rad">
                                                    rad
                                                  </option>
                                                </select>
                                              </div>
                                            </td>
                                          ) : (
                                            <td className="py-2 border-b flex items-center">
                                              <span id="result_valueb">
                                                {displayAngleB.toFixed(3)}
                                              </span>

                                              {/* <span id="result_valueb">{Number(result?.tech_angleb).toFixed(3)}</span> */}
                                              <div className="py-2 px-2 relative">
                                                <select
                                                  className="input"
                                                  name="to_calb"
                                                  id="to_calb"
                                                  value={unitB}
                                                  onChange={(e) =>
                                                    setUnitB(e.target.value)
                                                  }
                                                >
                                                  <option value="rad">
                                                    rad
                                                  </option>
                                                  <option value="c">°</option>
                                                </select>
                                              </div>
                                            </td>
                                          )}
                                        </tr>
                                      </>
                                    )}
                                    <tr>
                                      <td className="py-2 border-b" width="35%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[
                                            "ht"
                                          ] ?? "Height"}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {Number(result?.tech_height).toFixed(3)}{" "}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="35%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[
                                            "ar"
                                          ] ?? "Area"}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {Number(result?.tech_area).toFixed(3)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="35%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[
                                            "per"
                                          ] ?? "Perimeter"}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {Number(result?.tech_peremter).toFixed(
                                          3
                                        )}{" "}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 border-b" width="35%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[
                                            "cir"
                                          ] ?? "Circumradius"}
                                        </strong>
                                      </td>
                                      <td className="py-2 border-b">
                                        {Number(result?.tech_R_cap).toFixed(3)}{" "}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 " width="35%">
                                        <strong>
                                          {data?.payload?.tech_lang_keys[
                                            "inr"
                                          ] ?? "Inradius"}
                                        </strong>
                                      </td>
                                      <td className="py-2 ">
                                        {Number(result?.tech_R_sml).toFixed(3)}{" "}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["3"]}
                            </strong>
                          </p>
                          {(result?.tech_method == "1" ||
                            result?.tech_method == "2" ||
                            result?.tech_method == "3" ||
                            result?.tech_method == "4" ||
                            result?.tech_method == "5" ||
                            result?.tech_method == "6" ||
                            result?.tech_method == "7" ||
                            result?.tech_method == "8" ||
                            result?.tech_method == "9") && (
                            <>
                              {["2", "4", "6", "7", "9"].includes(
                                result?.tech_method
                              ) && (
                                <>
                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]} b:
                                    </strong>
                                  </p>
                                  <BlockMath math={`b=\\sqrt{c^2 - a^2}`} />
                                  <BlockMath
                                    math={`b=\\sqrt{(${Number(
                                      result?.tech_c
                                    ).toFixed(2)}^2 - ${Number(
                                      result?.tech_a
                                    ).toFixed(2)}^2)}`}
                                  />
                                  <BlockMath
                                    math={`b=\\sqrt{(${Math.pow(
                                      Number(result?.tech_c).toFixed(2),
                                      2
                                    )} - ${Math.pow(
                                      Number(result?.tech_a).toFixed(2),
                                      2
                                    )})}`}
                                  />
                                  <BlockMath
                                    math={`b=${Number(result?.tech_b).toFixed(
                                      2
                                    )}`}
                                  />
                                </>
                              )}

                              {["1", "4", "5", "7", "8"].includes(
                                result?.tech_method
                              ) && (
                                <>
                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]} c:
                                    </strong>
                                  </p>
                                  <BlockMath math={`c=\\sqrt{a^2 + b^2}`} />
                                  <BlockMath
                                    math={`c=\\sqrt{(${Number(
                                      result?.tech_a
                                    ).toFixed(2)}^2 + ${Number(
                                      result?.tech_b
                                    ).toFixed(2)}^2)}`}
                                  />
                                  <BlockMath
                                    math={`c=\\sqrt{(${Math.pow(
                                      Number(result?.tech_a).toFixed(2),
                                      2
                                    )} + ${Math.pow(
                                      Number(result?.tech_b).toFixed(2),
                                      2
                                    )})}`}
                                  />
                                  <BlockMath
                                    math={`c=${Number(result?.tech_c).toFixed(
                                      2
                                    )}`}
                                  />
                                </>
                              )}

                              {["3", "5", "6", "8", "9"].includes(
                                result?.tech_method
                              ) && (
                                <>
                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["4"]} a:
                                    </strong>
                                  </p>
                                  <BlockMath math={`a=\\sqrt{c^2 - b^2}`} />
                                  <BlockMath
                                    math={`a=\\sqrt{(${Number(
                                      result?.tech_c
                                    ).toFixed(2)}^2 - ${Number(
                                      result?.tech_b
                                    ).toFixed(2)}^2)}`}
                                  />
                                  <BlockMath
                                    math={`a=\\sqrt{(${Math.pow(
                                      Number(result?.tech_c).toFixed(2),
                                      2
                                    )} - ${Math.pow(
                                      Number(result?.tech_b).toFixed(2),
                                      2
                                    )})}`}
                                  />
                                  <BlockMath
                                    math={`a=${Number(result?.tech_a).toFixed(
                                      2
                                    )}`}
                                  />
                                </>
                              )}

                              {!["4", "5", "6"].includes(
                                result?.tech_method
                              ) && (
                                <>
                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["5"]} α:
                                    </strong>
                                  </p>
                                  <BlockMath
                                    math={`\\alpha = \\arctan\\left(\\dfrac{a}{b}\\right)`}
                                  />
                                  <BlockMath
                                    math={`\\alpha = \\arctan\\left(\\dfrac{${Number(
                                      result?.tech_a
                                    ).toFixed(2)}}{${Number(
                                      result?.tech_b
                                    ).toFixed(2)}}\\right)`}
                                  />
                                  <BlockMath
                                    math={`\\alpha = \\arctan(${Number(
                                      result?.tech_a / result?.tech_b
                                    ).toFixed(2)})`}
                                  />
                                  <BlockMath
                                    math={`\\alpha = ${Number(
                                      result?.tech_anglea
                                    ).toFixed(3)} \\text{ rad}`}
                                  />
                                  <BlockMath
                                    math={`\\alpha = ${Number(
                                      result?.tech_anglea * (180 / Math.PI)
                                    ).toFixed(3)} \\degree`}
                                  />
                                </>
                              )}

                              {!["7", "8", "9"].includes(
                                result?.tech_method
                              ) && (
                                <>
                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["5"]} β:
                                    </strong>
                                  </p>
                                  <BlockMath
                                    math={`\\beta = \\arctan\\left(\\dfrac{b}{a}\\right)`}
                                  />
                                  <BlockMath
                                    math={`\\beta = \\arctan\\left(\\dfrac{${Number(
                                      result?.tech_b
                                    ).toFixed(2)}}{${Number(
                                      result?.tech_a
                                    ).toFixed(2)}}\\right)`}
                                  />
                                  <BlockMath
                                    math={`\\beta = \\arctan(${Number(
                                      result?.tech_b / result?.tech_a
                                    ).toFixed(2)})`}
                                  />
                                  <BlockMath
                                    math={`\\beta = ${Number(
                                      result?.tech_angleb
                                    ).toFixed(3)} \\text{ rad}`}
                                  />
                                  <BlockMath
                                    math={`\\beta = ${Number(
                                      result?.tech_angleb * (180 / Math.PI)
                                    ).toFixed(3)} \\degree`}
                                  />
                                </>
                              )}
                            </>
                          )}
                          {result?.tech_method != "10" &&
                            result?.tech_method != "11" &&
                            result?.tech_method != "12" &&
                            result?.tech_method != "13" &&
                            result?.tech_method != "14" && (
                              <>
                                <p className="mt-2">
                                  <strong>Find Area:</strong>
                                </p>

                                <BlockMath
                                  math={`area = \\dfrac{a \\cdot b}{2}`}
                                />

                                <BlockMath
                                  math={`area = \\dfrac{${Number(
                                    result?.tech_a
                                  ).toFixed(2)} \\cdot ${Number(
                                    result?.tech_b
                                  ).toFixed(2)}}{2}`}
                                />

                                <BlockMath
                                  math={`area = ${Number(
                                    result?.tech_area
                                  ).toFixed(2)}`}
                                />
                              </>
                            )}

                          {(result?.tech_method == "10" ||
                            result?.tech_method == "11" ||
                            result?.tech_method == "12" ||
                            result?.tech_method == "13") && (
                            <>
                              {result?.tech_method !== "12" &&
                                result?.tech_method !== "13" && (
                                  <>
                                    <p className="mt-2">
                                      <strong>Find c:</strong>
                                    </p>
                                    <BlockMath math={`c=\\sqrt{a^2 + b^2}`} />
                                    <BlockMath
                                      math={`c=\\sqrt{(${Number(
                                        result?.tech_a
                                      ).toFixed(2)}^2 + ${Number(
                                        result?.tech_b
                                      ).toFixed(2)}^2)}`}
                                    />
                                    <BlockMath
                                      math={`c=\\sqrt{(${Math.pow(
                                        Number(result?.tech_a),
                                        2
                                      ).toFixed(2)} + ${Math.pow(
                                        Number(result?.tech_b),
                                        2
                                      ).toFixed(2)})}`}
                                    />
                                    <BlockMath
                                      math={`c=${Number(result?.tech_c).toFixed(
                                        2
                                      )}`}
                                    />
                                  </>
                                )}

                              {result?.tech_method === "10" &&
                                result?.tech_method !== "13" && (
                                  <>
                                    <p className="mt-2">
                                      <strong>Find b:</strong>
                                    </p>
                                    <BlockMath
                                      math={`b=\\dfrac{2 \\cdot area}{a}`}
                                    />
                                    <BlockMath
                                      math={`b=\\dfrac{2 \\cdot ${Number(
                                        result?.tech_area
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_a
                                      ).toFixed(2)}}`}
                                    />
                                    <BlockMath
                                      math={`b=${Number(result?.tech_b).toFixed(
                                        2
                                      )}`}
                                    />
                                  </>
                                )}

                              {result?.tech_method === "11" &&
                                result?.tech_method !== "13" && (
                                  <>
                                    <p className="mt-2">
                                      <strong>Find a:</strong>
                                    </p>
                                    <BlockMath
                                      math={`a=\\dfrac{2 \\cdot area}{b}`}
                                    />
                                    <BlockMath
                                      math={`a=\\dfrac{2 \\cdot ${Number(
                                        result?.tech_area
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_b
                                      ).toFixed(2)}}`}
                                    />
                                    <BlockMath
                                      math={`a=${Number(result?.tech_a).toFixed(
                                        2
                                      )}`}
                                    />
                                  </>
                                )}

                              {result?.tech_method === "12" &&
                                result?.tech_method !== "13" && (
                                  <>
                                    <p className="mt-2">
                                      <strong>Find a:</strong>
                                    </p>
                                    <BlockMath
                                      math={`a=\\sqrt{\\dfrac{c^2 + \\sqrt{c^4 - 16a^2}}{2}}`}
                                    />
                                    <BlockMath
                                      math={`a=\\sqrt{\\dfrac{${Math.pow(
                                        Number(result?.tech_c),
                                        2
                                      ).toFixed(2)} + \\sqrt{${Math.pow(
                                        Number(result?.tech_c),
                                        4
                                      ).toFixed(2)} - 16 \\cdot ${Math.pow(
                                        Number(result?.tech_a),
                                        2
                                      ).toFixed(2)}}}{2}}`}
                                    />
                                    <BlockMath
                                      math={`a=${Number(result?.tech_a).toFixed(
                                        2
                                      )}`}
                                    />

                                    <p className="mt-2">
                                      <strong>Find b:</strong>
                                    </p>
                                    <BlockMath
                                      math={`b=\\sqrt{\\dfrac{c^2 - \\sqrt{c^4 - 16a^2}}{2}}`}
                                    />
                                    <BlockMath
                                      math={`b=\\sqrt{\\dfrac{${Math.pow(
                                        Number(result?.tech_c),
                                        2
                                      ).toFixed(2)} - \\sqrt{${Math.pow(
                                        Number(result?.tech_c),
                                        4
                                      ).toFixed(2)} - 16 \\cdot ${Math.pow(
                                        Number(result?.tech_a),
                                        2
                                      ).toFixed(2)}}}{2}}`}
                                    />
                                    <BlockMath
                                      math={`b=${Number(result?.tech_b).toFixed(
                                        2
                                      )}`}
                                    />
                                  </>
                                )}

                              {result?.tech_method !== "13" && (
                                <>
                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["5"]} α:
                                    </strong>
                                  </p>
                                  <BlockMath
                                    math={`\\alpha = \\arctan\\left(\\dfrac{a}{b}\\right)`}
                                  />
                                  <BlockMath
                                    math={`\\alpha = \\arctan\\left(\\dfrac{${Number(
                                      result?.tech_a
                                    ).toFixed(2)}}{${Number(
                                      result?.tech_b
                                    ).toFixed(2)}}\\right)`}
                                  />
                                  <BlockMath
                                    math={`\\alpha = \\arctan(${(
                                      Number(result?.tech_a) /
                                      Number(result?.tech_b)
                                    ).toFixed(2)})`}
                                  />
                                  <BlockMath
                                    math={`\\alpha = ${Number(
                                      result?.tech_anglea
                                    ).toFixed(3)} \\text{ rad}`}
                                  />
                                  <BlockMath
                                    math={`\\alpha = ${(
                                      Number(result?.tech_anglea) *
                                      (180 / Math.PI)
                                    ).toFixed(3)}^\\circ`}
                                  />

                                  <p className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["5"]} β:
                                    </strong>
                                  </p>
                                  <BlockMath
                                    math={`\\beta = \\arctan\\left(\\dfrac{b}{a}\\right)`}
                                  />
                                  <BlockMath
                                    math={`\\beta = \\arctan\\left(\\dfrac{${Number(
                                      result?.tech_b
                                    ).toFixed(2)}}{${Number(
                                      result?.tech_a
                                    ).toFixed(2)}}\\right)`}
                                  />
                                  <BlockMath
                                    math={`\\beta = \\arctan(${(
                                      Number(result?.tech_b) /
                                      Number(result?.tech_a)
                                    ).toFixed(2)})`}
                                  />
                                  <BlockMath
                                    math={`\\beta = ${Number(
                                      result?.tech_angleb
                                    ).toFixed(3)} \\text{ rad}`}
                                  />
                                  <BlockMath
                                    math={`\\beta = ${(
                                      Number(result?.tech_angleb) *
                                      (180 / Math.PI)
                                    ).toFixed(3)}^\\circ`}
                                  />
                                </>
                              )}
                            </>
                          )}

                          {(result?.tech_method == "13" ||
                            result?.tech_method == "14") && (
                            <>
                              <p className="mt-2">
                                <strong>Find a:</strong>
                              </p>
                              <BlockMath
                                math={`a = \\sqrt{2 \\cdot area \\cdot \\tan(\\alpha)}`}
                              />
                              <BlockMath
                                math={`a = \\sqrt{2 \\cdot ${Number(
                                  result?.tech_area
                                ).toFixed(2)} \\cdot \\tan(${Number(
                                  result?.tech_anglea
                                ).toFixed(2)})}`}
                              />
                              <BlockMath
                                math={`a = ${Number(result?.tech_a).toFixed(
                                  2
                                )}`}
                              />

                              <p className="mt-2">
                                <strong>Find b:</strong>
                              </p>
                              <BlockMath
                                math={`b = \\sqrt{\\dfrac{2 \\cdot area}{\\tan(\\alpha)}}`}
                              />
                              <BlockMath
                                math={`b = \\sqrt{\\dfrac{2 \\cdot ${Number(
                                  result?.tech_area
                                ).toFixed(2)}}{\\tan(${Number(
                                  result?.tech_anglea
                                ).toFixed(2)})}}`}
                              />
                              <BlockMath
                                math={`b = ${Number(result?.tech_b).toFixed(
                                  2
                                )}`}
                              />

                              <p className="mt-2">
                                <strong>Find c:</strong>
                              </p>
                              <BlockMath math={`c = \\sqrt{a^2 + b^2}`} />
                              <BlockMath
                                math={`c = \\sqrt{${Number(
                                  result?.tech_a
                                ).toFixed(2)}^2 + ${Number(
                                  result?.tech_b
                                ).toFixed(2)}^2}`}
                              />
                              <BlockMath
                                math={`c = \\sqrt{${Math.pow(
                                  Number(result?.tech_a),
                                  2
                                ).toFixed(2)} + ${Math.pow(
                                  Number(result?.tech_b),
                                  2
                                ).toFixed(2)}}`}
                              />
                              <BlockMath
                                math={`c = ${Number(result?.tech_c).toFixed(
                                  3
                                )}`}
                              />

                              {result?.tech_method === "13" &&
                                result?.tech_method !== "14" && (
                                  <>
                                    <p className="mt-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} β:
                                      </strong>
                                    </p>
                                    <BlockMath
                                      math={`\\beta = \\arctan\\left(\\dfrac{b}{a}\\right)`}
                                    />
                                    <BlockMath
                                      math={`\\beta = \\arctan\\left(\\dfrac{${Number(
                                        result?.tech_b
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_a
                                      ).toFixed(2)}}\\right)`}
                                    />
                                    <BlockMath
                                      math={`\\beta = \\arctan(${(
                                        Number(result?.tech_b) /
                                        Number(result?.tech_a)
                                      ).toFixed(2)})`}
                                    />
                                    <BlockMath
                                      math={`\\beta = ${Number(
                                        result?.tech_angleb
                                      ).toFixed(3)} \\text{ rad}`}
                                    />
                                    <BlockMath
                                      math={`\\beta = ${(
                                        Number(result?.tech_angleb) *
                                        (180 / Math.PI)
                                      ).toFixed(3)}^\\circ`}
                                    />
                                  </>
                                )}

                              {result?.tech_method === "14" &&
                                result?.tech_method !== "13" && (
                                  <>
                                    <p className="mt-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} α:
                                      </strong>
                                    </p>
                                    <BlockMath
                                      math={`\\alpha = \\arctan\\left(\\dfrac{a}{b}\\right)`}
                                    />
                                    <BlockMath
                                      math={`\\alpha = \\arctan\\left(\\dfrac{${Number(
                                        result?.tech_a
                                      ).toFixed(2)}}{${Number(
                                        result?.tech_b
                                      ).toFixed(2)}}\\right)`}
                                    />
                                    <BlockMath
                                      math={`\\alpha = \\arctan(${(
                                        Number(result?.tech_a) /
                                        Number(result?.tech_b)
                                      ).toFixed(2)})`}
                                    />
                                    <BlockMath
                                      math={`\\alpha = ${Number(
                                        result?.tech_anglea
                                      ).toFixed(3)} \\text{ rad}`}
                                    />
                                    <BlockMath
                                      math={`\\alpha = ${(
                                        Number(result?.tech_anglea) *
                                        (180 / Math.PI)
                                      ).toFixed(3)}^\\circ`}
                                    />
                                  </>
                                )}
                            </>
                          )}
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

export default SohcahtoaCalculator;
