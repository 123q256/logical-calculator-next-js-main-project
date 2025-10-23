"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useImpulseCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ImpulseCalculator = () => {
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
    tech_calculation: "1", //  1 2 3
    tech_impulse: "1200",
    tech_j_units: "dyn·s",
    tech_force: "1200",
    tech_f_units: "dyn",
    tech_time: "5",
    tech_t_units: "sec",
    tech_impulse_ans_units: "dyn·s",
    tech_force_ans_units: "dyn",
    tech_time_ans_units: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useImpulseCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
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
        tech_impulse: formData.tech_impulse,
        tech_j_units: formData.tech_j_units,
        tech_force: formData.tech_force,
        tech_f_units: formData.tech_f_units,
        tech_time: formData.tech_time,
        tech_t_units: formData.tech_t_units,
        tech_impulse_ans_units: formData.tech_impulse_ans_units,
        tech_force_ans_units: formData.tech_force_ans_units,
        tech_time_ans_units: formData.tech_time_ans_units,
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
      tech_calculation: "1", //  1 2 3
      tech_impulse: "1200",
      tech_j_units: "dyn·s",
      tech_force: "1200",
      tech_f_units: "dyn",
      tech_time: "5",
      tech_t_units: "sec",
      tech_impulse_ans_units: "dyn·s",
      tech_force_ans_units: "dyn",
      tech_time_ans_units: "sec",
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
    setFormData((prev) => ({ ...prev, tech_j_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_units: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} J |{" "}
                      {data?.payload?.tech_lang_keys["3"]} F, t{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2"]} F |{" "}
                      {data?.payload?.tech_lang_keys["3"]} J, t{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["2"]} t |{" "}
                      {data?.payload?.tech_lang_keys["3"]} J, F{" "}
                    </option>
                  </select>
                </div>

                <div className="col-span-12">
                  {formData.tech_calculation == "1" && (
                    <>
                      <div className="col s12 font_size20 center">
                        <BlockMath math="J = F t" />
                      </div>
                    </>
                  )}
                  {formData.tech_calculation == "2" && (
                    <>
                      <div className="col s12 font_size20 center">
                        <BlockMath math="F = \frac{J}{t}" />
                      </div>
                    </>
                  )}
                  {formData.tech_calculation == "3" && (
                    <>
                      <div className="col s12 font_size20 center">
                        <BlockMath math="t = \frac{J}{F}" />
                      </div>
                    </>
                  )}
                </div>
              </div>
              {(formData.tech_calculation == "2" ||
                formData.tech_calculation == "3") && (
                <>
                  <div className="col-span-6 impulse ">
                    <label htmlFor="tech_impulse" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (J)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_impulse"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_impulse}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_j_units} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "dyn·s", value: "dyn·s" },
                            { label: "dyn·min", value: "dyn·min" },
                            { label: "dyn·h", value: "dyn·h" },
                            { label: "kg·m/s", value: "kg·m/s" },
                            { label: "N·s", value: "N·s" },
                            { label: "N·min", value: "N·min" },
                            { label: "N·h", value: "N·h" },
                            { label: "mN·s", value: "mN·s" },
                            { label: "mN·min", value: "mN·min" },
                            { label: "kN·s", value: "kN·s" },
                            { label: "kN·min", value: "kN·min" },
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
              {(formData.tech_calculation == "1" ||
                formData.tech_calculation == "3") && (
                <>
                  <div className="col-span-6 force">
                    <label htmlFor="tech_force" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (f)
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
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_f_units} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "dyn", value: "dyn" },
                            { label: "kgf", value: "kgf" },
                            { label: "N", value: "N" },
                            { label: "kN", value: "kN" },
                            { label: "N·s", value: "N·s" },
                            { label: "kip", value: "kip" },
                            { label: "lbf", value: "lbf" },
                            { label: "ozf", value: "ozf" },
                            { label: "pdln", value: "pdln" },
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
              {(formData.tech_calculation == "1" ||
                formData.tech_calculation == "2") && (
                <>
                  <div className="col-span-6 time">
                    <label htmlFor="tech_time" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (t)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_time"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_time}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_t_units} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hr", value: "hr" },
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
              {formData.tech_calculation == "1" && (
                <>
                  <div className="col-span-6 impulse_units">
                    <label htmlFor="tech_impulse_ans_units" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_impulse_ans_units"
                        id="tech_impulse_ans_units"
                        value={formData.tech_impulse_ans_units}
                        onChange={handleChange}
                      >
                        <option value="dyn·s"> dyn·s</option>
                        <option value="dyn·min">dyn·min </option>
                        <option value="dyn·h"> dyn·h </option>
                        <option value="kg·m/s"> kg·m/s </option>
                        <option value="N·s"> N·s </option>
                        <option value="N·min"> N·min </option>
                        <option value="N·h"> N·h </option>
                        <option value="mN·s"> mN·s </option>
                        <option value="mN·min"> mN·min </option>
                        <option value="kN·s"> kN·s </option>
                        <option value="kN·min"> kN·min </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculation == "2" && (
                <>
                  <div className="col-span-6 force_units ">
                    <label htmlFor="tech_force_ans_units" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_force_ans_units"
                        id="tech_force_ans_units"
                        value={formData.tech_force_ans_units}
                        onChange={handleChange}
                      >
                        <option value="dyn"> dyn</option>
                        <option value="kgf">kgf </option>
                        <option value="N"> N</option>
                        <option value="kN"> kN </option>
                        <option value="kip"> kip</option>
                        <option value="lbf"> lbf </option>
                        <option value="ozf"> ozf</option>
                        <option value="pdl"> pdl </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculation == "3" && (
                <>
                  <div className="col-span-6 time_units ">
                    <label htmlFor="tech_time_ans_units" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_time_ans_units"
                        id="tech_time_ans_units"
                        value={formData.tech_time_ans_units}
                        onChange={handleChange}
                      >
                        <option value="sec">sec</option>
                        <option value="min">min </option>
                        <option value="hr">hr</option>
                      </select>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-center lg:text-[18px] md:text-[18px] text-[16px]">
                        <p>{data?.payload?.tech_lang_keys[4]}</p>
                        {result?.tech_calculation == "1" ? (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[4]}
                              </strong>
                            </p>
                          </>
                        ) : result?.tech_calculation == "2" ? (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[5]}
                              </strong>
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys[6]}
                              </strong>
                            </p>
                          </>
                        )}
                        <p className="my-3">
                          <strong className="bg-[#2845F5] rounded-lg text-white px-3 py-2 md:text-[25px] text-[18px]">
                            {Number(result?.tech_answer).toFixed(3)}{" "}
                            {result?.tech_unit_ans}
                          </strong>
                        </p>
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

export default ImpulseCalculator;
