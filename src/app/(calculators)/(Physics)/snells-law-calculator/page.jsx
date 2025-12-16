"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useSnellsLawCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const SnellsLawCalculator = () => {
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
    tech_calculation: "from1", // from1 from2 from3 from4
    tech_medium1: "window",
    tech_n1: "1.52",
    tech_medium2: "diamond",
    tech_n2: "2.419",
    tech_angle_first: "5",
    tech_angle_f_unit: "* π rad",
    tech_angle_second: "5",
    tech_angle_s_unit: "tr",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSnellsLawCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Determine if tech_n1 or tech_n2 needs to be auto-set
    let update = {
      ...formData,
      [name]: value,
    };

    if (name === "tech_medium1") {
      update.tech_n1 = getNValue(value);
    }

    if (name === "tech_medium2") {
      update.tech_n2 = getNValue(value);
    }

    setFormData(update);
    setResult(null);
    setFormError(null);
  };

  const getNValue = (mediumVal) => {
    switch (mediumVal) {
      case "vacuum":
        return "1";
      case "air":
        return "1.000293";
      case "water":
        return "1.333";
      case "ethanol":
        return "1.36";
      case "ice":
        return "1.31";
      case "acrylic":
        return "1.49";
      case "window":
        return "1.52";
      case "diamond":
        return "2.419";
      case "custom":
        return ""; // Allow user entry
      default:
        return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculation) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculation: formData.tech_calculation,
        tech_medium1: formData.tech_medium1,
        tech_n1: formData.tech_n1,
        tech_medium2: formData.tech_medium2,
        tech_n2: formData.tech_n2,
        tech_angle_first: formData.tech_angle_first,
        tech_angle_f_unit: formData.tech_angle_f_unit,
        tech_angle_second: formData.tech_angle_second,
        tech_angle_s_unit: formData.tech_angle_s_unit,
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
      tech_calculation: "from1", // from1 from2 from3 from4
      tech_medium1: "window",
      tech_n1: "1.52",
      tech_medium2: "diamond",
      tech_n2: "2.419",
      tech_angle_first: "5",
      tech_angle_f_unit: "* π rad",
      tech_angle_second: "5",
      tech_angle_s_unit: "tr",
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
    setFormData((prev) => ({ ...prev, tech_angle_f_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_s_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="col-span-12">
                <div className="col-lg-12 col-12 mt-0">
                  <label htmlFor="tech_calculation" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_calculation"
                      id="tech_calculation"
                      value={formData.tech_calculation}
                      onChange={handleChange}
                    >
                      <option value="from1">
                        Find n1 | Given n2, θ₁ and θ₂
                      </option>
                      <option value="from2">
                        Find n2 | Given n1, θ₁ and θ₂
                      </option>
                      <option value="from3">
                        Find θ₁ | Given n1, n2 and θ₂
                      </option>
                      <option value="from4">
                        Find θ₂ | Given n1, n2 and θ₁
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-span-12 flex justify-center">
                <img
                  src="/images/snells_img.svg"
                  alt="Triangle Image"
                  width="250px"
                />
              </div>
              {(formData.tech_calculation == "from2" ||
                formData.tech_calculation == "from3" ||
                formData.tech_calculation == "from4") && (
                <>
                  <div className="col-span-12 md:col-span-6 medium_index_1">
                    <label htmlFor="tech_medium1" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 1
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_medium1"
                        id="tech_medium1"
                        value={formData.tech_medium1}
                        onChange={handleChange}
                      >
                        <option value="vacuum">
                          {" "}
                          {data?.payload?.tech_lang_keys[2]}
                        </option>
                        <option value="air">
                          {" "}
                          {data?.payload?.tech_lang_keys[3]}
                        </option>
                        <option value="water">
                          {" "}
                          {data?.payload?.tech_lang_keys[4]} 20°C 🌊
                        </option>
                        <option value="ethanol">
                          {" "}
                          {data?.payload?.tech_lang_keys[5]}
                        </option>
                        <option value="ice">
                          {" "}
                          {data?.payload?.tech_lang_keys[6]} 🧊
                        </option>
                        <option value="acrylic">
                          {" "}
                          {data?.payload?.tech_lang_keys[7]}
                        </option>
                        <option value="window">
                          {" "}
                          {data?.payload?.tech_lang_keys[8]}
                        </option>
                        <option value="diamond">
                          {" "}
                          {data?.payload?.tech_lang_keys[9]}
                        </option>
                        <option value="custom">
                          {" "}
                          {data?.payload?.tech_lang_keys[10]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 medium_index_1">
                    <label htmlFor="tech_n1" className="label">
                      {data?.payload?.tech_lang_keys["11"]} 1 (n₁)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n1"
                        id="tech_n1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n1}
                        onChange={handleChange}
                        disabled={formData.tech_medium1 !== "custom"}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation == "from1" ||
                formData.tech_calculation == "from3" ||
                formData.tech_calculation == "from4") && (
                <>
                  <div className="col-span-12 md:col-span-6  medium_index_2">
                    <label htmlFor="tech_medium2" className="label">
                      {data?.payload?.tech_lang_keys["12"]} 2
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_medium2"
                        id="tech_medium2"
                        value={formData.tech_medium2}
                        onChange={handleChange}
                      >
                        <option value="vacuum">
                          {" "}
                          {data?.payload?.tech_lang_keys[2]}
                        </option>
                        <option value="air">
                          {" "}
                          {data?.payload?.tech_lang_keys[3]}
                        </option>
                        <option value="water">
                          {" "}
                          {data?.payload?.tech_lang_keys[4]} 20°C 🌊
                        </option>
                        <option value="ethanol">
                          {" "}
                          {data?.payload?.tech_lang_keys[5]}
                        </option>
                        <option value="ice">
                          {data?.payload?.tech_lang_keys[6]} 🧊
                        </option>
                        <option value="acrylic">
                          {" "}
                          {data?.payload?.tech_lang_keys[7]}
                        </option>
                        <option value="window">
                          {" "}
                          {data?.payload?.tech_lang_keys[8]}
                        </option>
                        <option value="diamond">
                          {" "}
                          {data?.payload?.tech_lang_keys[9]}
                        </option>
                        <option value="custom">
                          {data?.payload?.tech_lang_keys[10]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 medium_index_2 ">
                    <label htmlFor="tech_n2" className="label">
                      {data?.payload?.tech_lang_keys["11"]} 2 (n₁)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n2"
                        id="tech_n2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n2}
                        disabled={formData.tech_medium2 !== "custom"} // Disable except custom
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculation == "from3" ||
                formData.tech_calculation == "from1" ||
                formData.tech_calculation == "from2") && (
                <>
                  <div className="col-span-12 md:col-span-6" id="angle1">
                    <label htmlFor="tech_angle_first" className="label">
                      {data?.payload?.tech_lang_keys["13"]} (θ₁)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_angle_first"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_angle_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_angle_f_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "deg", value: "deg" },
                            { label: "rad", value: "rad" },
                            { label: "gon", value: "gon" },
                            { label: "tr", value: "tr" },
                            { label: "arcmin", value: "arcmin" },
                            { label: "arcsec", value: "arcsec" },
                            { label: "mrad", value: "mrad" },
                            { label: "μrad", value: "μrad" },
                            { label: "* π rad", value: "* π rad" },
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
              {(formData.tech_calculation == "from4" ||
                formData.tech_calculation == "from1" ||
                formData.tech_calculation == "from2") && (
                <>
                  <div className="col-span-12 md:col-span-6" id="angle2">
                    <label htmlFor="tech_angle_second" className="label">
                      {data?.payload?.tech_lang_keys["13"]} (θ₂)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_angle_second"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_angle_second}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_angle_s_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "deg", value: "deg" },
                            { label: "rad", value: "rad" },
                            { label: "gon", value: "gon" },
                            { label: "tr", value: "tr" },
                            { label: "arcmin", value: "arcmin" },
                            { label: "arcsec", value: "arcsec" },
                            { label: "mrad", value: "mrad" },
                            { label: "μrad", value: "μrad" },
                            { label: "* π rad", value: "* π rad" },
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[18px]">
                        {formData?.tech_calculation === "from1" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                              <table className="w-full text-[16px] md:text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[11]} 1
                                        (n₁)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(result?.tech_jawab).toFixed(6)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full text-[16px] md:text-[18px]">
                              <p className="mt-2 margin_top_10">
                                <strong>
                                  {data?.payload?.tech_lang_keys[16]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[17]} = (n₂ *
                                sin(θ₂)) / sin(θ₁)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[18]}
                              </p>
                              <p className="mt-2">
                                n₁ = ({formData?.tech_n2} * sin(
                                {result?.tech_angle_second})) / sin(
                                {result?.tech_angle_first})
                              </p>
                              <p className="mt-2">
                                n₁ = {Number(result?.tech_jawab).toFixed(6)}
                              </p>
                            </div>
                          </>
                        )}
                        {formData?.tech_calculation === "from2" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] mt-2 overflow-auto">
                              <table className="w-full text-[16px] md:text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[11]} 2
                                        (n₂)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(result?.tech_jawab).toFixed(6)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full text-[16px] md:text-[18px]">
                              <p className="mt-2 margin_top_10">
                                <strong>
                                  {data?.payload?.tech_lang_keys[16]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[17]} = (n₁ *
                                sin(θ₁)) / sin(θ₂)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[18]}
                              </p>
                              <p className="mt-2">
                                n₂ = ({formData?.tech_n1} * sin(
                                {result?.tech_angle_first})) / sin(
                                {result?.tech_angle_second})
                              </p>
                              <p className="mt-2">
                                n₂ = {Number(result?.tech_jawab).toFixed(6)}
                              </p>
                            </div>
                          </>
                        )}
                        {formData?.tech_calculation === "from3" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px] md:text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[13]} (θ₁)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_jawab * 57.2958
                                      ).toFixed(6)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full text-[16px] md:text-[18px]">
                              <p className="mt-2 margin_top_10">
                                <strong>
                                  {data?.payload?.tech_lang_keys[16]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[17]} = sin
                                <sup>-1</sup>((n₂ * sin(θ₂)) / n₁)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[18]}
                              </p>
                              <p className="mt-2">
                                θ₁ = sin<sup>-1</sup>(({formData?.tech_n1} *
                                sin({result?.tech_angle_second})) /{" "}
                                {formData?.tech_n1});
                              </p>
                              <p className="mt-2">
                                θ₁ ={" "}
                                {Number(result?.tech_jawab * 57.2958).toFixed(
                                  6
                                )}
                              </p>
                            </div>
                          </>
                        )}

                        {formData?.tech_calculation === "from4" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px] md:text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[13]} (θ₂)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_jawab * 57.2958
                                      ).toFixed(6)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full text-[16px] md:text-[18px]">
                              <p className="mt-2 margin_top_10">
                                <strong>
                                  {data?.payload?.tech_lang_keys[16]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[17]} = sin
                                <sup>-1</sup>((n₁ * sin(θ₁)) / n₂)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[18]}
                              </p>
                              <p className="mt-2">
                                θ₁ = sin<sup>-1</sup>(( {formData?.tech_n1} *
                                sin({result?.tech_angle_first})) /{" "}
                                {formData?.tech_n1})
                              </p>
                              <p className="mt-2">
                                θ₁ ={" "}
                                {Number(result?.tech_jawab * 57.2958).toFixed(
                                  6
                                )}
                              </p>
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

export default SnellsLawCalculator;
