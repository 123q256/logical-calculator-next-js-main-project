"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCarboplatinCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CarboplatinCalculator = () => {
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
    tech_type: "first",
    tech_operations: "1",
    tech_first: "22",
    tech_second: "67",
    tech_s_units: "kg",
    tech_third: "5",
    tech_t_units: "mg/dL",
    tech_four: "5",
    tech_five: "67",
    tech_f_units: "in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCarboplatinCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_type == "first") {
      if (
        !formData.tech_type ||
        !formData.tech_operations ||
        !formData.tech_first ||
        !formData.tech_second ||
        !formData.tech_s_units ||
        !formData.tech_third ||
        !formData.tech_t_units ||
        !formData.tech_four
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_type ||
        !formData.tech_operations ||
        !formData.tech_first ||
        !formData.tech_second ||
        !formData.tech_s_units ||
        !formData.tech_third ||
        !formData.tech_t_units ||
        !formData.tech_four ||
        !formData.tech_five ||
        !formData.tech_f_units
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_s_units: formData.tech_s_units,
        tech_third: formData.tech_third,
        tech_t_units: formData.tech_t_units,
        tech_four: formData.tech_four,
        tech_five: formData.tech_five,
        tech_f_units: formData.tech_f_units,
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
      tech_type: "first",
      tech_operations: "1",
      tech_first: "22",
      tech_second: "67",
      tech_s_units: "kg",
      tech_third: "5",
      tech_t_units: "mg/dL",
      tech_four: "5",
      tech_five: "67",
      tech_f_units: "in",
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
    setFormData((prev) => ({ ...prev, tech_s_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[50%] w-full">
                  <input
                    type="hidden"
                    name="tech_type"
                    id="calculator_time"
                    value={formData.tech_type}
                  />
                  <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                    {/* Date Cal Tab */}
                    <div className="lg:w-1/2 w-full px-2 py-1">
                      <div
                        className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                          formData.tech_type === "first" ? "tagsUnit" : ""
                        }`}
                        id="first"
                        onClick={() => {
                          setFormData({ ...formData, tech_type: "first" });
                          setResult(null);
                          setFormError(null);
                        }}
                      >
                        Simple
                      </div>
                    </div>
                    {/* Time Cal Tab */}
                    <div className="lg:w-1/2 w-full px-2 py-1">
                      <div
                        className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                          formData.tech_type === "second" ? "tagsUnit" : ""
                        }`}
                        id="second"
                        onClick={() => {
                          setFormData({ ...formData, tech_type: "second" });
                          setResult(null);
                          setFormError(null);
                        }}
                      >
                        Advance
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations"
                    id="tech_operations"
                    value={formData.tech_operations}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_first"
                    id="tech_first"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_first}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["26"]}
                  </span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_second"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_second}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_s_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "stone", value: "stone" },
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
                <label htmlFor="tech_third" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_third"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_third}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_t_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mg/dL", value: "mg/dL" },
                        { label: "μmol/L", value: "μmol/L" },
                        { label: "stone", value: "stone" },
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
                <label htmlFor="tech_four" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_four"
                    id="tech_four"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_four}
                    onChange={handleChange}
                  />
                  <span className="input_unit">mg/ml/min</span>
                </div>
              </div>
              {formData.tech_type === "second" && (
                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                  <label htmlFor="tech_five" className="label">
                    {data?.payload?.tech_lang_keys["11"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_five"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_five}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown2}
                    >
                      {formData.tech_f_units} ▾
                    </label>
                    {dropdownVisible2 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "inches (in)", value: "in" },
                          { label: "centimeters (cm)", value: "cm" },
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
              )}
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
                      <div className="w-full mt-2">
                        {formData?.tech_type === "first" ? (
                          <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                            <div className="col-span-12 md:col-span-4 lg:col-span-4">
                              <div className="text-center text-md-start md:border-r lg:border-r border-sm-bottom pb-3 pb-md-0">
                                <p className="text-[18px]">
                                  <strong>GFR</strong>
                                </p>
                                <p className="text-[28px] mt-1">
                                  <strong className="text-[#119154]">
                                    {Number(result?.tech_answer).toFixed(3)}
                                  </strong>
                                  <span className="text-[#119154] font-s-20">
                                    {" "}
                                    (ml/min)
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-4 lg:col-span-4">
                              <div className="text-center text-md-start md:border-r lg:border-r border-sm-bottom ps-md-4 mt-3 mt-md-0 pb-3 pb-md-0">
                                <p className="text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[24]}
                                  </strong>
                                </p>
                                <p className="text-[28px] mt-1">
                                  <strong className="text-[#119154]">
                                    {Number(result?.tech_car_dos).toFixed(3)}
                                  </strong>
                                  <span className="text-[#119154] font-s-20">
                                    {" "}
                                    (mg)
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-4 lg:col-span-4">
                              <div className="text-center text-md-start ps-md-4 mt-3 mt-md-0">
                                <p className="text-[18px]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[25]}
                                  </strong>
                                </p>
                                <p className="text-[28px] mt-1">
                                  <strong className="text-[#119154]">
                                    {Number(result?.tech_max_dos).toFixed(3)}
                                  </strong>
                                  <span className="text-[#119154] font-s-20">
                                    {" "}
                                    (mg)
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          formData?.tech_type === "second" && (
                            <>
                              <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                  <div className="text-center text-md-start md:border-r lg:border-r border-bottom pb-3">
                                    <p className="text-[18px]">
                                      <strong>
                                        BSA ({data?.payload?.tech_lang_keys[27]}
                                        )
                                      </strong>
                                    </p>
                                    <p className="text-[28px] mt-1">
                                      <strong className="text-[#119154]">
                                        {result?.tech_bsa}
                                      </strong>
                                      <span className="text-[#119154] font-s-20">
                                        {" "}
                                        (M2)
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                  <div className="text-center text-md-start border-bottom ps-md-4 mt-3 mt-md-0 pb-3">
                                    <p className="text-[18px]">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[28]}{" "}
                                        (IBW)
                                      </strong>
                                    </p>
                                    <p className="text-[28px] mt-1">
                                      <strong className="text-[#119154]">
                                        {Number(result?.tech_ibw).toFixed(2)}
                                      </strong>
                                      <span className="text-[#119154] font-s-20">
                                        {" "}
                                        (kg)
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                  <div className="text-center text-md-start md:border-r lg:border-r border-sm-bottom pt-3 pb-3 pb-md-0">
                                    <p className="text-[18px]">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[29]}{" "}
                                        (abw)
                                      </strong>
                                    </p>
                                    <p className="text-[28px] mt-1">
                                      <strong className="text-[#119154]">
                                        {result?.tech_abw}
                                      </strong>
                                      <span className="text-[#119154] font-s-20">
                                        {" "}
                                        (kg)
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                  <div className="text-center text-md-start ps-md-4 pt-3">
                                    <p className="text-[18px]">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[30]}{" "}
                                        (abw)
                                      </strong>
                                    </p>
                                    <p className="text-[28px] mt-1">
                                      <strong className="text-[#119154]">
                                        {result?.tech_abw_alt}
                                      </strong>
                                      <span className="text-[#119154] font-s-20">
                                        {" "}
                                        (kg)
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="w-full mt-3 overflow-auto">
                                <table className="w-full" cellSpacing="0">
                                  <thead>
                                    <tr>
                                      <th className="text-blue text-start text-[18px] border-b py-3">
                                        {data?.payload?.tech_lang_keys[31]}
                                      </th>
                                      <th className="text-blue text-start text-[18px] border-b py-3">
                                        {data?.payload?.tech_lang_keys[32]}{" "}
                                        (ml/min)
                                      </th>
                                      <th className="text-blue text-start text-[18px] border-b py-3">
                                        {data?.payload?.tech_lang_keys[33]}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border-b py-3">
                                        {data?.payload?.tech_lang_keys[34]}
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(result?.tech_jell_ans1).toFixed(
                                          1
                                        )}
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(result?.tech_jell_ans11)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-3">
                                        {data?.payload?.tech_lang_keys[34]} (
                                        {data?.payload?.tech_lang_keys[35]} BSA)
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(result?.tech_jell_ans2).toFixed(
                                          1
                                        )}
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(result?.tech_jell_ans22)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-3">
                                        {data?.payload?.tech_lang_keys[36]} (
                                        {data?.payload?.tech_lang_keys[37]} ibw)
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(
                                          result?.tech_cg_ibw_ans
                                        ).toFixed(1)}
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(result?.tech_cg_ibw_ans2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-3">
                                        {data?.payload?.tech_lang_keys[36]} (
                                        {data?.payload?.tech_lang_keys[38]} wt)
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(
                                          result?.tech_cg_abw_ans
                                        ).toFixed(1)}
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(result?.tech_cg_abw_ans2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-3">
                                        {data?.payload?.tech_lang_keys[36]} (
                                        {data?.payload?.tech_lang_keys[38]} wt{" "}
                                        {data?.payload?.tech_lang_keys[39]} eq)
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(
                                          result?.tech_cg_abwalt_ans
                                        ).toFixed(1)}
                                      </td>
                                      <td className="border-b text-center">
                                        {Number(result?.tech_cg_abwalt_ans2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-3">
                                        {data?.payload?.tech_lang_keys[36]} (
                                        {data?.payload?.tech_lang_keys[40]})
                                      </td>
                                      <td className="text-center">
                                        {Number(result?.tech_cg_ac_ans).toFixed(
                                          1
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {Number(result?.tech_cg_ac_ans2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )
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

export default CarboplatinCalculator;
