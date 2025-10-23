"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useMechanicalEnergyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MechanicalEnergyCalculator = () => {
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
    tech_mass: "1200",
    tech_mass_unit: "ton(short)",
    tech_velocity: "1200",
    tech_velocity_unit: "miles/s",
    tech_height: "1200",
    tech_height_unit: "mil",
    tech_engergyunit: "11",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMechanicalEnergyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_mass) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_velocity: formData.tech_velocity,
        tech_velocity_unit: formData.tech_velocity_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
        tech_engergyunit: formData.tech_engergyunit,
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
      tech_mass: "1200",
      tech_mass_unit: "ton(short)",
      tech_velocity: "1200",
      tech_velocity_unit: "miles/s",
      tech_height: "1200",
      tech_height_unit: "mil",
      tech_engergyunit: "11",
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
    setFormData((prev) => ({ ...prev, tech_mass_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_velocity_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <div className="col s12 center">
                  <BlockMath math="\text{ME} = \frac{1}{2}m v^{2} + mgh" />
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_mass" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_mass"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_mass}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_mass_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg", value: "kg" },
                        { label: "g", value: "g" },
                        { label: "mg", value: "mg" },
                        { label: "mu-gr", value: "mu-gr" },
                        { label: "ct", value: "ct" },
                        { label: "lbs", value: "lbs" },
                        { label: "troy", value: "troy" },
                        { label: "ozm", value: "ozm" },
                        { label: "slug", value: "slug" },
                        { label: "ton(short)", value: "ton(short)" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_velocity" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_velocity"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_velocity}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_velocity_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m/s", value: "m/s" },
                        { label: "ft/min", value: "ft/min" },
                        { label: "ft/s", value: "ft/s" },
                        { label: "km/hr", value: "km/hr" },
                        { label: "knot (int'l)", value: "knot (int'l)" },
                        { label: "mph", value: "mph" },
                        {
                          label: `${data?.payload?.tech_lang_keys["29"]}/hr`,
                          value: `${data?.payload?.tech_lang_keys["29"]}/hr`,
                        },
                        {
                          label: `${data?.payload?.tech_lang_keys["29"]}/min`,
                          value: `${data?.payload?.tech_lang_keys["29"]}/min`,
                        },
                        {
                          label: `${data?.payload?.tech_lang_keys["29"]}/s`,
                          value: `${data?.payload?.tech_lang_keys["29"]}/s`,
                        },
                        {
                          label: data?.payload?.tech_lang_keys["30"],
                          value: data?.payload?.tech_lang_keys["30"],
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
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_height" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_height"
                    step="any"
                    min="1"
                    className="mt-1 input"
                    value={formData.tech_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_height_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m", value: "m" },
                        { label: "AU", value: "AU" },
                        { label: "cm", value: "cm" },
                        { label: "km", value: "km" },
                        { label: "ft", value: "ft" },
                        { label: "in", value: "in" },
                        { label: "mil", value: "mil" },
                        { label: "mm", value: "mm" },
                        { label: "nm", value: "nm" },
                        { label: "mile", value: "mile" },
                        { label: "parsec", value: "parsec" },
                        { label: "pm", value: "pm" },
                        { label: "yd", value: "yd" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler2(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_engergyunit" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_engergyunit"
                    id="tech_engergyunit"
                    value={formData.tech_engergyunit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys[5]} (J)
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys[6]}{" "}
                      {data?.payload?.tech_lang_keys[7]}{" "}
                    </option>
                    <option value="3">
                      {" "}
                      {data?.payload?.tech_lang_keys[6]}{" "}
                      {data?.payload?.tech_lang_keys[8]}
                    </option>
                    <option value="4">
                      {" "}
                      {data?.payload?.tech_lang_keys[9]}{" "}
                      {data?.payload?.tech_lang_keys[10]}
                    </option>
                    <option value="5">
                      {" "}
                      {data?.payload?.tech_lang_keys[11]}
                    </option>
                    <option value="6">
                      {" "}
                      {data?.payload?.tech_lang_keys[12]}{" "}
                      {data?.payload?.tech_lang_keys[13]}
                    </option>
                    <option value="7">
                      {" "}
                      {data?.payload?.tech_lang_keys[14]}
                    </option>
                    <option value="8">
                      {" "}
                      {data?.payload?.tech_lang_keys[15]}
                    </option>
                    <option value="9">
                      {" "}
                      {data?.payload?.tech_lang_keys[16]}
                    </option>
                    <option value="10">
                      {" "}
                      {data?.payload?.tech_lang_keys[17]}{" "}
                      {data?.payload?.tech_lang_keys[18]}
                    </option>
                    <option value="11">
                      {" "}
                      {data?.payload?.tech_lang_keys[19]}{" "}
                      {data?.payload?.tech_lang_keys[20]}
                    </option>
                    <option value="12">
                      {" "}
                      {data?.payload?.tech_lang_keys[21]}
                    </option>
                    <option value="13">
                      {" "}
                      {data?.payload?.tech_lang_keys[22]}{" "}
                      {data?.payload?.tech_lang_keys[23]}
                    </option>
                    <option value="14">
                      {" "}
                      {data?.payload?.tech_lang_keys[24]}{" "}
                      {data?.payload?.tech_lang_keys[25]}
                    </option>
                    <option value="15">
                      {data?.payload?.tech_lang_keys[26]}{" "}
                      {data?.payload?.tech_lang_keys[27]}
                    </option>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full lg:text-[18px] md:text-[18px] text-[16px] overflow-auto">
                        {formData?.tech_engergyunit == "1" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(2)}{" "}
                                      Joule
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(2)}{" "}
                                      Joule
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(2)}{" "}
                                      Joule
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "2" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(2)}{" "}
                                      BTU
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(2)}{" "}
                                      BTU
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(2)}{" "}
                                      BTU
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "3" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(2)}{" "}
                                      BTU
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(2)}{" "}
                                      BTU
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(2)}{" "}
                                      BTU
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "4" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(2)}{" "}
                                      cal
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(2)}{" "}
                                      cal
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(2)}{" "}
                                      cal
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "5" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy / 1e21,
                                        3
                                      ) * 1e21}{" "}
                                      eV
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy / 1e21,
                                        3
                                      ) * 1e21}{" "}
                                      eV
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy / 1e21,
                                        3
                                      ) * 1e21}{" "}
                                      eV
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "6" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(5)}{" "}
                                      erg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(5)}{" "}
                                      erg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(5)}{" "}
                                      erg
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "7" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy,
                                        3
                                      )}{" "}
                                      ft⋅lbf
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy,
                                        3
                                      )}{" "}
                                      ft⋅lbf
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy,
                                        3
                                      )}{" "}
                                      ft⋅lbf
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "8" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy,
                                        3
                                      )}{" "}
                                      ft-pdl
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy,
                                        3
                                      )}{" "}
                                      ft-pdl
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy,
                                        3
                                      )}{" "}
                                      ft-pdl
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "9" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(5)}{" "}
                                      hp.h
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(5)}{" "}
                                      hp.h
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(5)}{" "}
                                      hp.h
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "10" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(5)}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(5)}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(5)}{" "}
                                      kcal
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "11" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(5)}{" "}
                                      kW hr
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(5)}{" "}
                                      kW hr
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(5)}{" "}
                                      kW hr
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "12" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy,
                                        10
                                      )}{" "}
                                      tTNT
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy,
                                        10
                                      )}{" "}
                                      tTNT
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy,
                                        10
                                      )}{" "}
                                      tTNT
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "13" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(5)}{" "}
                                      V Cb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(5)}{" "}
                                      V Cb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(5)}{" "}
                                      V Cb
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "14" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(5)}{" "}
                                      W hr
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(5)}{" "}
                                      W hr
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(5)}{" "}
                                      W hr
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {formData?.tech_engergyunit == "15" && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[31]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_mechanical_energy
                                      ).toFixed(5)}{" "}
                                      W sec
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_kinatic_engrgy
                                      ).toFixed(5)}{" "}
                                      W sec
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="70%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[33]}{" "}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {" "}
                                      {Number(
                                        result?.tech_potentional_engergy
                                      ).toFixed(5)}{" "}
                                      W sec
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        <div className="col">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys[34]} :
                            </strong>
                          </p>

                          <BlockMath math={`\\text{Here :}`} />
                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys[1]} unit = kg}`}
                          />
                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys[2]} unit = m/s}`}
                          />
                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys[3]} unit = m}`}
                          />
                          <BlockMath
                            math={`\\text{${
                              data?.payload?.tech_lang_keys[1]
                            } = ${Number(result?.tech_mass).toFixed(2)} kg}`}
                          />
                          <BlockMath
                            math={`\\text{${
                              data?.payload?.tech_lang_keys[2]
                            } = ${Number(result?.tech_velocity).toFixed(
                              2
                            )} m/s}`}
                          />
                          <BlockMath
                            math={`\\text{${
                              data?.payload?.tech_lang_keys[3]
                            } = ${Number(result?.tech_height).toFixed(2)} m}`}
                          />
                          <BlockMath
                            math={`\\text{ME} = \\frac{1}{2}m v^{2} + mgh`}
                          />
                          <BlockMath
                            math={`\\text{ME} = \\frac{1}{2}(${Number(
                              result?.tech_mass
                            ).toFixed(2)})(${Number(
                              result?.tech_velocity
                            ).toFixed(2)})^{2} + (${Number(
                              result?.tech_mass
                            ).toFixed(2)})(9.8)(${Number(
                              result?.tech_height
                            ).toFixed(2)})`}
                          />
                          <BlockMath
                            math={`\\text{ME} = (${Number(
                              result?.tech_kinatic_eng
                            ).toFixed(2)}) + (${Number(
                              result?.tech_potentional_eng
                            ).toFixed(2)})`}
                          />
                          <BlockMath
                            math={`\\text{ME} = ${Number(
                              result?.tech_mechanical_eng
                            ).toFixed(2)} J`}
                          />
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

export default MechanicalEnergyCalculator;
