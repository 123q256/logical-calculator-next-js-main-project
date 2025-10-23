"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCoulombsLawCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CoulombsLawCalculator = () => {
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
    tech_choose: "1", // 1 2
    tech_selection1: "1", // 1 2 3 4
    tech_selection2: "1",
    tech_charge_three: "7",
    tech_charge_three_unit: "pC",
    tech_charge_one: "7",
    tech_charge_one_unit: "pC",
    tech_charge_two: "7",
    tech_charge_two_unit: "pC",
    tech_distance: "7",
    tech_distance_unit: "nm",
    tech_force: "7",
    tech_force_unit: "mN",
    tech_constant: "8.98755",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCoulombsLawCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_choose) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_choose: formData.tech_choose,
        tech_selection1: formData.tech_selection1,
        tech_selection2: formData.tech_selection2,
        tech_charge_three: formData.tech_charge_three,
        tech_charge_three_unit: formData.tech_charge_three_unit,
        tech_charge_one: formData.tech_charge_one,
        tech_charge_one_unit: formData.tech_charge_one_unit,
        tech_charge_two: formData.tech_charge_two,
        tech_charge_two_unit: formData.tech_charge_two_unit,
        tech_distance: formData.tech_distance,
        tech_distance_unit: formData.tech_distance_unit,
        tech_force: formData.tech_force,
        tech_force_unit: formData.tech_force_unit,
        tech_constant: formData.tech_constant,
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
      tech_choose: "1", // 1 2
      tech_selection1: "1", // 1 2 3 4
      tech_selection2: "1",
      tech_charge_three: "7",
      tech_charge_three_unit: "pC",
      tech_charge_one: "7",
      tech_charge_one_unit: "pC",
      tech_charge_two: "7",
      tech_charge_two_unit: "pC",
      tech_distance: "7",
      tech_distance_unit: "nm",
      tech_force: "7",
      tech_force_unit: "mN",
      tech_constant: "8.98755",
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
    setFormData((prev) => ({ ...prev, tech_charge_three_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_charge_one: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_charge_two: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_distance_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_force_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-1  md:gap-4">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_choose" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_choose"
                    id="tech_choose"
                    value={formData.tech_choose}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_choose == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 " id="calculation2">
                    <label htmlFor="tech_selection1" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_selection1"
                        id="tech_selection1"
                        value={formData.tech_selection1}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["5"]} (F)
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["6"]} (q1)
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["7"]} (q2)
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["8"]} (r)
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_choose == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 " id="calculation1">
                    <label htmlFor="tech_selection2" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_selection2"
                        id="tech_selection2"
                        value={formData.tech_selection2}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["5"]} (F)
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["6"]} (q₁ & q₂)
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["7"]} (r)
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {((formData.tech_choose == "1" &&
                formData.tech_selection2 == "1") ||
                (formData.tech_choose == "1" &&
                  formData.tech_selection2 == "3")) && (
                <>
                  <div className="col-span-12 md:col-span-6 charge_three">
                    <label htmlFor="tech_charge_three" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (q₁ & q₂)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_charge_three"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_charge_three}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_charge_three_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "pC", value: "pC" },
                            { label: "nC", value: "nC" },
                            { label: "μC", value: "μC" },
                            { label: "mC", value: "mC" },
                            { label: "C", value: "C" },
                            { label: "e", value: "e" },
                            { label: "Ah", value: "Ah" },
                            { label: "mAh", value: "mAh" },
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

              {((formData.tech_choose == "2" &&
                formData.tech_selection1 == "1") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "4") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "3")) && (
                <>
                  <div className="col-span-12 md:col-span-6  charge_one">
                    <label htmlFor="tech_charge_one" className="label">
                      {data?.payload?.tech_lang_keys["10"]} (q₁)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_charge_one"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_charge_one}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_charge_one_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "pC", value: "pC" },
                            { label: "nC", value: "nC" },
                            { label: "μC", value: "μC" },
                            { label: "mC", value: "mC" },
                            { label: "C", value: "C" },
                            { label: "e", value: "e" },
                            { label: "Ah", value: "Ah" },
                            { label: "mAh", value: "mAh" },
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
              {((formData.tech_choose == "2" &&
                formData.tech_selection1 == "1") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "4") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "2")) && (
                <>
                  <div className="col-span-12 md:col-span-6   charge_two">
                    <label htmlFor="tech_charge_two" className="label">
                      {data?.payload?.tech_lang_keys["11"]} (q₂)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_charge_two"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_charge_two}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_charge_two_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "pC", value: "pC" },
                            { label: "nC", value: "nC" },
                            { label: "μC", value: "μC" },
                            { label: "mC", value: "mC" },
                            { label: "C", value: "C" },
                            { label: "e", value: "e" },
                            { label: "Ah", value: "Ah" },
                            { label: "mAh", value: "mAh" },
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
                </>
              )}
              {((formData.tech_choose == "1" &&
                formData.tech_selection2 == "1") ||
                (formData.tech_choose == "1" &&
                  formData.tech_selection2 == "2") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "1") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "2") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "3")) && (
                <>
                  <div className="col-span-12 md:col-span-6  distance">
                    <label htmlFor="tech_distance" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (r)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_distance"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_distance}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_distance_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nm", value: "nm" },
                            { label: "μm", value: "μm" },
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler3(unit.value)}
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

              {((formData.tech_choose == "1" &&
                formData.tech_selection2 == "2") ||
                (formData.tech_choose == "1" &&
                  formData.tech_selection2 == "3") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "2") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "3") ||
                (formData.tech_choose == "2" &&
                  formData.tech_selection1 == "4")) && (
                <>
                  <div className="col-span-12 md:col-span-6  force">
                    <label htmlFor="tech_force" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (F)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_force"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_force}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_force_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mN", value: "mN" },
                            { label: "N", value: "N" },
                            { label: "kN", value: "kN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
                            { label: "pdl", value: "pdl" },
                            { label: "lbf", value: "lbf" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler4(unit.value)}
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

              <div className="col-span-12 md:col-span-6 constant">
                <label htmlFor="tech_constant" className="label">
                  {data?.payload?.tech_lang_keys["9"]} (Ke)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_constant"
                    id="tech_constant"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_constant}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    x10<sup>9</sup> N⋅m²/C²
                  </span>
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
                      {result?.tech_force && (
                        <>
                          <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                            <table className="w-full text-[16px] md:text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {result?.tech_force} (N){" "}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"]}:
                            </strong>
                          </p>
                          <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                            <table className="w-full text-[16px] md:text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="30%">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_force * 0.001} (Kilo Newton)
                                    kN
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="30%">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_force * 1000} (Milli Newton)
                                    mN
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="30%">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_force * 0.224809}{" "}
                                    (pounds-force) lbf
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="30%">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_force * 0.000001} (Mega
                                    Newton) MN
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="30%">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_force * 0.000000001} (Giga
                                    Newton) GN
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="30%">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_force * 0.000000000001} (Tera
                                    Newton) TN
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_force * 7.23301} (poundals)
                                    pdl
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      {result?.tech_charging && (
                        <>
                          <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                            <table className="w-full text-[16px] md:text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]} (q1 &
                                      q2)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {result?.tech_charging} (C)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-2">
                            <strong>Results in other units:</strong>
                          </p>
                          <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                            <table className="w-full text-[16px] md:text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["6"]} (q1&q2)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_charging * 1000000000}{" "}
                                    (nanocoulombs) nC
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["6"]} (q1&q2)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_charging * 1000000000000}{" "}
                                    (picocoulombs) pC
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["6"]} (q1&q2)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_charging * 1000}{" "}
                                    (millicoulombs) mC
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["6"]} (q1&q2)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_charging * 0.000277778}{" "}
                                    (ampere hours) Ah{" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["6"]} (q1&q2)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_charging * 0.277778}{" "}
                                    (milliampere hours) aAh
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["6"]} (q1&q2)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_charging *
                                      6241509074460762608}{" "}
                                    (Elementary charge) e
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      {result?.tech_distancing && (
                        <>
                          <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                            <table className="w-full text-[16px] md:text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]} (r)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {" "}
                                    {result?.tech_distancing} (m)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-2">
                            <strong>Results in other units:</strong>
                          </p>
                          <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                            <table className="w-full text-[16px] md:text-[18px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_distancing * 1000000000}{" "}
                                    (nanometers) nm
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_distancing * 1000000}{" "}
                                    (micrometers) μm
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_distancing * 1000}{" "}
                                    (millimeters) mm
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_distancing * 100}{" "}
                                    (centimeters) cm{" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_distancing * 0.001}{" "}
                                    (kilometers) km
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_distancing * 39.3701} (inches)
                                    in
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_distancing * 3.28084} (feet)
                                    ft
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="40%">
                                    {data?.payload?.tech_lang_keys["8"]} (r)
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_distancing * 1.093613} (yards)
                                    yd
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      {result?.tech_method &&
                        (result.tech_method == "1" ||
                          result.tech_method == "2") && (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%]  mt-2">
                              <table className="w-full text-[16px] md:text-[18px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="40%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]}
                                        {result?.tech_method == "1" ? (
                                          <> (q1) </>
                                        ) : (
                                          <> (q2) </>
                                        )}
                                      </strong>
                                    </td>
                                    {result?.tech_charge_one && (
                                      <>
                                        <td className="py-2 border-b">
                                          {" "}
                                          {result?.tech_charge_one} (C)
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            {result?.tech_charge_one && (
                              <>
                                <p className="mt-2">
                                  <strong>Results in other units:</strong>
                                </p>
                                <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                                  <table className="w-full text-[16px] md:text-[18px]">
                                    <tbody>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="40%"
                                        >
                                          {data?.payload?.tech_lang_keys["6"]}{" "}
                                          {result?.tech_method == "1" ? (
                                            <> (q1) </>
                                          ) : (
                                            <> (q2) </>
                                          )}
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_charge_one * 1000000000}{" "}
                                          <span>(nanocoulombs) nC</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="40%"
                                        >
                                          {data?.payload?.tech_lang_keys["6"]}{" "}
                                          {result?.tech_method == "1" ? (
                                            <> (q1) </>
                                          ) : (
                                            <> (q2) </>
                                          )}
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_charge_one *
                                            1000000000000}{" "}
                                          <span>(picocoulombs) pC</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="40%"
                                        >
                                          {data?.payload?.tech_lang_keys["6"]}{" "}
                                          {result?.tech_method == "1" ? (
                                            <> (q1) </>
                                          ) : (
                                            <> (q2) </>
                                          )}
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_charge_one * 1000}{" "}
                                          <span>(millicoulombs) mC</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="40%"
                                        >
                                          {data?.payload?.tech_lang_keys["6"]}{" "}
                                          {result?.tech_method == "1" ? (
                                            <> (q1) </>
                                          ) : (
                                            <> (q2) </>
                                          )}
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_charge_one *
                                            0.000277778}{" "}
                                          <span>(ampere hours) Ah</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="40%"
                                        >
                                          {data?.payload?.tech_lang_keys["6"]}{" "}
                                          {result?.tech_method == "1" ? (
                                            <> (q1) </>
                                          ) : (
                                            <> (q2) </>
                                          )}
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_charge_one * 0.277778}{" "}
                                          <span>(milliampere hours) mAh</span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="40%"
                                        >
                                          {data?.payload?.tech_lang_keys["6"]}{" "}
                                          {result?.tech_method == "1" ? (
                                            <> (q1) </>
                                          ) : (
                                            <> (q2) </>
                                          )}
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_charge_one *
                                            6241509074460762608}{" "}
                                          <span>(Elementary charge) e</span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </>
                            )}
                          </>
                        )}
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

export default CoulombsLawCalculator;
