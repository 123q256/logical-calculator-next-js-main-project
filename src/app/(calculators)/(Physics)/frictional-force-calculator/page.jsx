"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useFrictionalForceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FrictionalForceCalculator = () => {
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
    tech_calculate: "1",
    tech_fr_co: "0.2",
    tech_force: "1200",
    tech_force_unit: "kN",
    tech_fr: "1200",
    tech_fr_unit: "GN",
    tech_mass: "13",
    tech_plane: "13",
    tech_gravity: "9.81",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFrictionalForceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculate) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculate: formData.tech_calculate,
        tech_fr_co: formData.tech_fr_co,
        tech_force: formData.tech_force,
        tech_force_unit: formData.tech_force_unit,
        tech_fr: formData.tech_fr,
        tech_fr_unit: formData.tech_fr_unit,
        tech_mass: formData.tech_mass,
        tech_plane: formData.tech_plane,
        tech_gravity: formData.tech_gravity,
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
      tech_calculate: "1",
      tech_fr_co: "0.2",
      tech_force: "1200",
      tech_force_unit: "kN",
      tech_fr: "1200",
      tech_fr_unit: "GN",
      tech_mass: "13",
      tech_plane: "13",
      tech_gravity: "9.81",
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
    setFormData((prev) => ({ ...prev, tech_force_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fr_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_calculate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculate"
                    id="tech_calculate"
                    value={formData.tech_calculate}
                    onChange={handleChange}
                  >
                    <option value="4">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
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

              {formData.tech_calculate != "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  friction_coefficient">
                    <label htmlFor="tech_fr_co" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (μ)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_fr_co"
                        id="tech_fr_co"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_fr_co}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate == "3" ||
                formData.tech_calculate == "1") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  normal_force ">
                    <label htmlFor="tech_force" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (N)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_force"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_force}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_force_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "kN", value: "kN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
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
              {(formData.tech_calculate == "1" ||
                formData.tech_calculate == "2") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  friction ">
                    <label htmlFor="tech_fr" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (F)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fr"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_fr}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_fr_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "kN", value: "kN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
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
                </>
              )}
              {formData.tech_calculate == "4" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  mass">
                    <label htmlFor="tech_mass" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (m)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mass"
                        id="tech_mass"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mass}
                        onChange={handleChange}
                      />
                      <span className="input_unit">kg</span>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate == "4" ||
                formData.tech_calculate == "4") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  plane">
                    <label htmlFor="tech_plane" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (θ)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_plane"
                        id="tech_plane"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_plane}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculate == "4" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  gravity">
                    <label htmlFor="tech_gravity" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (g)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_gravity"
                        id="tech_gravity"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_gravity}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full overflow-auto">
                      <div className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                        {result?.tech_friction_coefficient && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[2]} (μ)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(
                                        result?.tech_friction_coefficient
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2">
                              {data?.payload?.tech_lang_keys["9"]}
                            </div>

                            <div className="mt-2">
                              <InlineMath math={"\\mu = \\frac{F}{N}"} />
                            </div>

                            <div className="mt-2">
                              {data?.payload?.tech_lang_keys["10"]}
                            </div>

                            <div className="mt-2">
                              <InlineMath
                                math={`F - ${data?.payload?.tech_lang_keys["4"]} = ${result?.tech_fr_value}~N`}
                              />
                            </div>

                            <div className="mt-2">
                              <InlineMath
                                math={`N - ${data?.payload?.tech_lang_keys["3"]} = ${result?.tech_force_value}~N`}
                              />
                            </div>

                            <div className="mt-2">
                              {data?.payload?.tech_lang_keys["11"]}
                            </div>

                            <div className="mt-2">
                              <BlockMath math={"\\mu = \\frac{F}{N}"} />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\mu = \\frac{${result?.tech_fr_value}}{${result?.tech_force_value}}`}
                              />
                            </div>

                            <div className="mt-2">
                              <InlineMath
                                math={`\\mu = ${Number(
                                  result?.tech_friction_coefficient
                                ).toFixed(2)}`}
                              />
                            </div>
                          </>
                        )}
                        {result?.tech_calculate_force && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(
                                        result?.tech_calculate_force
                                      ).toFixed(2)}{" "}
                                      (N)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-2">
                              <span>{data?.payload?.tech_lang_keys["9"]}</span>
                            </div>

                            <div className="mt-2">
                              <BlockMath math="N = \dfrac{F}{\mu}" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`F - ${data?.payload?.tech_lang_keys["4"]} = ${result?.tech_force_value} N`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\mu - ${data?.payload?.tech_lang_keys["2"]} = ${result?.tech_fr_co}`}
                              />
                            </div>

                            <div className="mt-2">
                              {data?.payload?.tech_lang_keys["11"]}
                            </div>

                            <div className="mt-2">
                              <BlockMath math="N = \dfrac{F}{\mu}" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`N = \\dfrac{${result?.tech_force_value}}{${result?.tech_fr_co}}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`N = \\mathbf{${Number(
                                  result?.tech_calculate_force
                                ).toFixed(2)}\\ (N)}`}
                              />
                            </div>
                          </>
                        )}
                        {result?.tech_friction && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_friction).toFixed(2)}{" "}
                                      (N)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col m12 s12 margin_top_20">
                              <span>{data?.payload?.tech_lang_keys["9"]}</span>
                            </p>

                            <div className="mt-2">
                              <BlockMath math="F = N \times \mu" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`N - ${data?.payload?.tech_lang_keys["3"]} = ${result?.tech_force_value} N`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\mu - ${data?.payload?.tech_lang_keys["2"]} = ${result?.tech_fr_co}`}
                              />
                            </div>

                            <div className="mt-2">
                              {data?.payload?.tech_lang_keys["11"]}
                            </div>

                            <div className="mt-2">
                              <BlockMath math="F = N \times \mu" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`F = ${result?.tech_force_value} \\times ${result?.tech_fr_co}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`F = \\mathbf{${Number(
                                  result?.tech_friction
                                ).toFixed(2)}\\ (N)}`}
                              />
                            </div>
                          </>
                        )}
                        {result?.tech_friction2 && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[8]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_friction2).toFixed(
                                        2
                                      )}{" "}
                                      (N)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <p className="col m12 s12 margin_top_20">
                              <span>{data?.payload?.tech_lang_keys["9"]}</span>
                            </p>

                            <div className="mt-2">
                              <BlockMath math="F_{friction} = \mu \times m \times g \times \cos(\theta)" />
                            </div>

                            <p className="col m12 s12 margin_top_20">
                              <span>{data?.payload?.tech_lang_keys["10"]}</span>
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\mu - ${data?.payload?.tech_lang_keys["2"]} = ${result?.tech_fr_co}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`m - ${data?.payload?.tech_lang_keys["5"]} = ${result?.tech_mass} \\ kg`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`g - ${data?.payload?.tech_lang_keys["12"]} = ${result?.tech_gravity} \\ m/s^2`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`\\cos(\\theta) - ${
                                  data?.payload?.tech_lang_keys["6"]
                                } = ${
                                  result?.tech_plane
                                } \\ Deg \\Rightarrow ${Number(
                                  result?.tech_read
                                ).toFixed(4)} \\ Rad`}
                              />
                            </div>

                            <div className="mt-2">
                              {data?.payload?.tech_lang_keys["11"]}
                            </div>

                            <div className="mt-2">
                              <BlockMath math="F_{friction} = \mu \times m \times g \times \cos(\theta)" />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`F_{friction} = ${
                                  result?.tech_fr_co
                                } \\times ${result?.tech_mass} \\times ${
                                  result?.tech_gravity
                                } \\times ${Number(result?.tech_read).toFixed(
                                  4
                                )}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`F_{friction} = \\mathbf{${Number(
                                  result?.tech_friction2
                                ).toFixed(2)}\\ (N)}`}
                              />
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

export default FrictionalForceCalculator;
