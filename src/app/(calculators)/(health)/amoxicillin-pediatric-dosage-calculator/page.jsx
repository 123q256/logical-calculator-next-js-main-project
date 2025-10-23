"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAmoxicillinPediatricDosageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AmoxicillinPediatricDosageCalculator = () => {
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
    tech_age: 4,
    tech_age_unit: "Months", // Weeks  Months Years
    tech_weight: 4,
    tech_weight_unit: "kg",
    tech_med_type: "1",
    tech_general_dosing: "1",
    tech_route: "1",
    tech_dosag: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAmoxicillinPediatricDosageCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_age || !formData.tech_age_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_age_unit: formData.tech_age_unit,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_med_type: formData.tech_med_type,
        tech_general_dosing: formData.tech_general_dosing,
        tech_route: formData.tech_route,
        tech_dosag: formData.tech_dosag,
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
      tech_age: 4,
      tech_age_unit: "Months", // Weeks  Months Years
      tech_weight: 4,
      tech_weight_unit: "kg",
      tech_med_type: "1",
      tech_general_dosing: "1",
      tech_route: "1",
      tech_dosag: "5",
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
    setFormData((prev) => ({ ...prev, tech_age_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  // result

  const milli1 = result?.tech_in_mm * 2;
  const milli2 = result?.tech_in_milli * 2;
  const generalDosing = result?.tech_general_dosing;
  const langKeys = data?.payload?.tech_lang_keys;
  const techRoute = result?.tech_route;
  const dosage = result?.tech_dosag;
  const weightVal = result?.tech_w_val;

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-lg-6 px-2 pe-lg-4">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_age"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_age}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_age_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["2"],
                          value: data?.payload?.tech_lang_keys["2"],
                        },
                        {
                          label: data?.payload?.tech_lang_keys["3"],
                          value: data?.payload?.tech_lang_keys["3"],
                        },
                        {
                          label: data?.payload?.tech_lang_keys["4"],
                          value: data?.payload?.tech_lang_keys["4"],
                        },
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

              <div className="col-lg-6 px-2 pe-lg-4">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg", value: "kg" },
                        { label: "lbs", value: "lbs" },
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
              <div className="col-lg-6 px-2 pe-lg-4">
                <label htmlFor="tech_med_type" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_med_type"
                    id="tech_med_type"
                    value={formData.tech_med_type}
                    onChange={handleChange}
                  >
                    <option value="1">(125 mg/5 mL)</option>
                    <option value="2">(250 mg/5 mL) </option>
                    <option value="3">(200 mg/5 mL) </option>
                    <option value="4">(400 mg/5 m) </option>
                  </select>
                </div>
              </div>
              <div className="col-lg-6 px-2 ps-lg-4">
                <label htmlFor="tech_general_dosing" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_general_dosing"
                    id="tech_general_dosing"
                    value={formData.tech_general_dosing}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_general_dosing == "1" && (
                <div className="col-lg-6 px-2 pe-lg-4 route">
                  <label htmlFor="tech_route" className="label">
                    {data?.payload?.tech_lang_keys["11"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_route"
                      id="tech_route"
                      value={formData.tech_route}
                      onChange={handleChange}
                    >
                      <option value="1">
                        {data?.payload?.tech_lang_keys["12"]} (PO)
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["13"]} (IV)
                      </option>
                    </select>
                  </div>
                </div>
              )}

              <div className="col-lg-6 px-2 ps-lg-4 dosag">
                <label htmlFor="tech_dosag" className="label">
                  {data?.payload?.tech_lang_keys["20"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dosag"
                    id="tech_dosag"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_dosag}
                    onChange={handleChange}
                  />
                  <span className="input_unit">mg/kg/dose</span>
                </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <p className="w-full">{langKeys["14"]}</p>

                      {(generalDosing === "1" ||
                        generalDosing === "2" ||
                        generalDosing === "3") && (
                        <>
                          <p className="text-blue font-s-18">
                            {generalDosing === "1" && (
                              <>
                                {techRoute === "1" && (
                                  <>
                                    3 {langKeys["21"]}/{langKeys["22"]} 8 Hours
                                    :
                                  </>
                                )}
                                {techRoute === "2" && <>3 {langKeys["21"]} :</>}
                              </>
                            )}
                            {generalDosing === "2" && (
                              <>{langKeys["23"]} 10 days :</>
                            )}
                            {generalDosing === "3" && (
                              <>30-60 {langKeys["24"]}:</>
                            )}
                          </p>

                          <div className="w-full overflow-auto mt-4">
                            <table
                              className="w-full md:w-[60%] lg:w-[60%]"
                              cellSpacing="0"
                            >
                              <tbody>
                                <tr>
                                  <td className="border-b py-3">
                                    <strong>{langKeys["15"]} :</strong>
                                  </td>
                                  <td className="border-b">
                                    <strong className="text-[#119154] text-[18px]">
                                      {generalDosing === "1"
                                        ? `${result?.tech_in_mm} - ${milli1}`
                                        : result?.tech_in_mm}
                                      <span className="text-blue"> (mg)</span>
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-3">
                                    <strong>{langKeys["16"]} :</strong>
                                  </td>
                                  <td className="border-b">
                                    <strong className="text-[#119154] text-[18px]">
                                      {generalDosing === "1"
                                        ? `${result?.tech_in_milli} - ${milli2}`
                                        : result?.tech_in_milli}
                                      <span className="text-blue"> (mL)</span>
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            {generalDosing === "1" && (
                              <>
                                {techRoute === "1" && milli1 > 500 && (
                                  <>
                                    <p className="mt-3">
                                      <b>❗</b> {langKeys["25"]} 500 milligrams
                                      per dose.
                                    </p>
                                    {milli1 * 3 > 4000 && (
                                      <p className="mt-3">
                                        <b>❗</b> {langKeys["25"]} of 4 grams
                                        per day.
                                      </p>
                                    )}
                                  </>
                                )}
                                {techRoute === "2" && milli1 * 3 > 4000 && (
                                  <p className="mt-3">
                                    <b>❗</b> {langKeys["25"]} 4 grams per day.
                                  </p>
                                )}
                              </>
                            )}

                            {generalDosing === "3" && milli1 / 2 > 2000 && (
                              <p className="mt-3">
                                <b>❗</b> {langKeys["27"]} 2 grams per dose.
                              </p>
                            )}

                            {dosage && (
                              <>
                                <p className="mt-3">
                                  {langKeys["18"]} :
                                  <strong className="text-[#119154]">
                                    {" "}
                                    {weightVal * dosage}
                                  </strong>
                                  <span className="text-blue"> (mg)</span>
                                </p>

                                {generalDosing === "1" && techRoute === "1" && (
                                  <>
                                    {dosage >= 15 && dosage <= 30 ? (
                                      <p className="mt-3">
                                        ✅ {langKeys["19"]}
                                      </p>
                                    ) : (
                                      <p className="mt-3">
                                        ❌ {langKeys["17"]}
                                      </p>
                                    )}
                                  </>
                                )}

                                {generalDosing === "1" && techRoute === "2" && (
                                  <>
                                    {dosage >= 31 && dosage <= 60 ? (
                                      <p className="mt-3">
                                        ✅ {langKeys["19"]}
                                      </p>
                                    ) : (
                                      <p className="mt-3">
                                        ❌ {langKeys["17"]}
                                      </p>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
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

export default AmoxicillinPediatricDosageCalculator;
