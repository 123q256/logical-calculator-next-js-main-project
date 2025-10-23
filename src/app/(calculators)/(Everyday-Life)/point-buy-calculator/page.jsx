"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePointBuyCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const Dandd5ePointBuyCalculator = () => {
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
    tech_choice: "2", // 1 2
    tech_racial_choice: "1.1.1.1.1.1",
    tech_points_budget: "27",
    tech_smallest_score: "8",
    tech_largest_score: "15",
    tech_s: [
      "-9",
      "-6",
      "-4",
      "-2",
      "-1",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "7",
      "9",
      "12",
      "15",
      "19",
    ],
    tech_strength: "8",
    tech_dexerity: "8",
    tech_intelligence: "8",
    tech_wisdom: "8",
    tech_charisma: "8",
    tech_constitution: "8",
    tech_strength1: "6",
    tech_dexerity1: "6",
    tech_intelligence1: "6",
    tech_wisdom1: "6",
    tech_charisma1: "6",
    tech_constitution1: "6",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePointBuyCalculatorMutation();

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "tech_s[]") {
      // Handle array inputs
      setFormData((prevData) => {
        const newTechS = [...prevData.tech_s];
        newTechS[index] = value;
        return { ...prevData, tech_s: newTechS };
      });
    } else {
      // Handle regular inputs
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.tech_x) {
    //   setFormError("Please fill in input.");
    //   return;
    // }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_choice: formData.tech_choice,
        tech_racial_choice: formData.tech_racial_choice,
        tech_points_budget: formData.tech_points_budget,
        tech_smallest_score: formData.tech_smallest_score,
        tech_largest_score: formData.tech_largest_score,
        tech_s1: formData.tech_s[0],
        tech_s2: formData.tech_s[1],
        tech_s3: formData.tech_s[2],
        tech_s4: formData.tech_s[3],
        tech_s5: formData.tech_s[4],
        tech_s6: formData.tech_s[5],
        tech_s7: formData.tech_s[6],
        tech_s8: formData.tech_s[7],
        tech_s9: formData.tech_s[8],
        tech_s10: formData.tech_s[9],
        tech_s11: formData.tech_s[10],
        tech_s12: formData.tech_s[11],
        tech_s13: formData.tech_s[12],
        tech_s14: formData.tech_s[13],
        tech_s15: formData.tech_s[14],
        tech_s16: formData.tech_s[15],
        tech_strength: formData.tech_strength,
        tech_dexerity: formData.tech_dexerity,
        tech_intelligence: formData.tech_intelligence,
        tech_wisdom: formData.tech_wisdom,
        tech_charisma: formData.tech_charisma,
        tech_constitution: formData.tech_constitution,
        tech_strength1: formData.tech_strength1,
        tech_dexerity1: formData.tech_dexerity1,
        tech_intelligence1: formData.tech_intelligence1,
        tech_wisdom1: formData.tech_wisdom1,
        tech_charisma1: formData.tech_charisma1,
        tech_constitution1: formData.tech_constitution1,
        tech_submit: formData.tech_submit,
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
      tech_choice: "2", // 1 2
      tech_racial_choice: "1.1.1.1.1.1",
      tech_points_budget: "27",
      tech_smallest_score: "8",
      tech_largest_score: "15",
      tech_s: [
        "-9",
        "-6",
        "-4",
        "-2",
        "-1",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "7",
        "9",
        "12",
        "15",
        "19",
      ],
      tech_strength: "8",
      tech_dexerity: "8",
      tech_intelligence: "8",
      tech_wisdom: "8",
      tech_charisma: "8",
      tech_constitution: "8",
      tech_strength1: "6",
      tech_dexerity1: "6",
      tech_intelligence1: "6",
      tech_wisdom1: "6",
      tech_charisma1: "6",
      tech_constitution1: "6",
      tech_submit: "calculate",
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_choice" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_choice"
                    id="tech_choice"
                    value={formData.tech_choice}
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_racial_choice" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_racial_choice"
                    id="tech_racial_choice"
                    value={formData.tech_racial_choice}
                    onChange={handleChange}
                  >
                    {[
                      data?.payload?.tech_lang_keys[5],
                      `${data?.payload?.tech_lang_keys[6]} (${data?.payload?.tech_lang_keys[7]})`,
                      `Elf (${data?.payload?.tech_lang_keys[8]})`,
                      `${data?.payload?.tech_lang_keys[9]} (${data?.payload?.tech_lang_keys[10]})`,
                      `${data?.payload?.tech_lang_keys[11]}-Elf`,
                      `${data?.payload?.tech_lang_keys[11]}-Orc`,
                      `${data?.payload?.tech_lang_keys[12]} (${data?.payload?.tech_lang_keys[13]})`,
                      data?.payload?.tech_lang_keys[14],
                      data?.payload?.tech_lang_keys[15],
                      data?.payload?.tech_lang_keys[16],
                      data?.payload?.tech_lang_keys[17],
                      data?.payload?.tech_lang_keys[18],
                      data?.payload?.tech_lang_keys[19],
                      data?.payload?.tech_lang_keys[20],
                      data?.payload?.tech_lang_keys[21],
                      data?.payload?.tech_lang_keys[22],
                      data?.payload?.tech_lang_keys[23],
                      data?.payload?.tech_lang_keys[24],
                      data?.payload?.tech_lang_keys[25],
                      data?.payload?.tech_lang_keys[26],
                      data?.payload?.tech_lang_keys[12],
                      data?.payload?.tech_lang_keys[27],
                      data?.payload?.tech_lang_keys[28],
                      data?.payload?.tech_lang_keys[29],
                      data?.payload?.tech_lang_keys[30],
                      data?.payload?.tech_lang_keys[31],
                      data?.payload?.tech_lang_keys[32],
                      data?.payload?.tech_lang_keys[33],
                      data?.payload?.tech_lang_keys[34],
                      data?.payload?.tech_lang_keys[35],
                      data?.payload?.tech_lang_keys[36],
                      data?.payload?.tech_lang_keys[37],
                      data?.payload?.tech_lang_keys[38],
                      data?.payload?.tech_lang_keys[39],
                      data?.payload?.tech_lang_keys[40],
                    ].map((label, index) => {
                      const values = [
                        "2.0.0.0.0.1",
                        "0.0.2.0.1.0",
                        "0.2.0.1.0.0",
                        "0.0.1.0.2.0",
                        "0.0.0.0.0.2",
                        "2.0.1.0.0.0",
                        "0.2.0.0.0.1",
                        "1.1.1.1.1.1",
                        "0.0.0.1.0.2",
                        "0.2.0.0.0.1",
                        "0.0.0.0.0.2",
                        "2.1.0.0.0.0",
                        "2.0.0.0.1.0",
                        "1.0.0.0.2.0",
                        "0.0.2.0.0.0",
                        "0.0.0.1.0.0",
                        "0.0.0.2.0.0",
                        "0.2.1.0.0.0",
                        "2.0.1.0.0.0",
                        "0.2.1.0.0.0",
                        "0.2.0.0.0.0",
                        "0.0.2.1.0.0",
                        "0.0.0.0.2.1",
                        "0.2.0.0.1.0",
                        "0.2.0.0.0.0",
                        "1.0.2.0.0.0",
                        "0.0.2.0.1.0",
                        "2.1.0.0.0.0",
                        "0.0.2.0.1.0",
                        "2.0.1.0.0.0",
                        "0.1.0.0.0.2",
                        "0.2.0.0.0.1",
                        "2.0.0.0.1.0",
                        "1.0.1.0.0.1",
                        "39",
                      ];

                      return (
                        <option key={index} value={values[index]}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="col-span-12 custmize hidden">
                <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-4 md:col-span-4 lg:col-span-4">
                    <label htmlFor="tech_points_budget" className="label">
                      {data?.payload?.tech_lang_keys["41"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_points_budget"
                        id="tech_points_budget"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_points_budget}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-4 lg:col-span-4">
                    <label htmlFor="tech_smallest_score" className="label">
                      {data?.payload?.tech_lang_keys["42"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_smallest_score"
                        id="tech_smallest_score"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_smallest_score}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-4 lg:col-span-4">
                    <label htmlFor="tech_largest_score" className="label">
                      {data?.payload?.tech_lang_keys["43"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_largest_score"
                        id="tech_largest_score"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_largest_score}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {formData.tech_s.map((value, index) => (
                    <div
                      key={index}
                      className="col-span-4 md:col-span-3 lg:col-span-3"
                    >
                      <label htmlFor={`tech_s${index}`} className="label">
                        {index + 3}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_s[]"
                          id={`tech_s${index}`}
                          className="input my-2"
                          placeholder="00"
                          value={value}
                          onChange={(e) => handleChange(e, index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_strength" className="label">
                  {data?.payload?.tech_lang_keys[46]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_strength"
                    id="tech_strength"
                    className="input"
                    aria-label="input"
                    value={formData.tech_strength}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_dexerity" className="label">
                  {data?.payload?.tech_lang_keys[47]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_dexerity"
                    id="tech_dexerity"
                    className="input"
                    aria-label="input"
                    value={formData.tech_dexerity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_intelligence" className="label">
                  {data?.payload?.tech_lang_keys[48]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_intelligence"
                    id="tech_intelligence"
                    className="input"
                    aria-label="input"
                    value={formData.tech_intelligence}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_wisdom" className="label">
                  {data?.payload?.tech_lang_keys[49]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_wisdom"
                    id="tech_wisdom"
                    className="input"
                    aria-label="input"
                    value={formData.tech_wisdom}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_charisma" className="label">
                  {data?.payload?.tech_lang_keys[50]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_charisma"
                    id="tech_charisma"
                    className="input"
                    aria-label="input"
                    value={formData.tech_charisma}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_constitution" className="label">
                  {data?.payload?.tech_lang_keys[51]}:
                </label>
                <div className="w-full py-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_constitution"
                    id="tech_constitution"
                    className="input"
                    aria-label="input"
                    value={formData.tech_constitution}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 others hidden">
                <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                  <p className="col-span-12">
                    {data?.payload?.tech_lang_keys[52]}
                  </p>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_strength1" className="label">
                      {data?.payload?.tech_lang_keys[46]}:
                    </label>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_strength1"
                        id="tech_strength1"
                        className="input"
                        aria-label="input"
                        value={formData.tech_strength1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_dexerity1" className="label">
                      {data?.payload?.tech_lang_keys[47]}:
                    </label>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_dexerity1"
                        id="tech_dexerity1"
                        className="input"
                        aria-label="input"
                        value={formData.tech_dexerity1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_intelligence1" className="label">
                      {data?.payload?.tech_lang_keys[48]}:
                    </label>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_intelligence1"
                        id="tech_intelligence1"
                        className="input"
                        aria-label="input"
                        value={formData.tech_intelligence1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_wisdom1" className="label">
                      {data?.payload?.tech_lang_keys[49]}:
                    </label>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_wisdom1"
                        id="tech_wisdom1"
                        className="input"
                        aria-label="input"
                        value={formData.tech_wisdom1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_charisma1" className="label">
                      {data?.payload?.tech_lang_keys[50]}:
                    </label>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_charisma1"
                        id="tech_charisma1"
                        className="input"
                        aria-label="input"
                        value={formData.tech_charisma1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_constitution1" className="label">
                      {data?.payload?.tech_lang_keys[51]}:
                    </label>
                    <div className="w-full py-2">
                      <input
                        type="number"
                        step="any"
                        name="tech_constitution1"
                        id="tech_constitution1"
                        className="input"
                        aria-label="input"
                        value={formData.tech_constitution1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
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

export default Dandd5ePointBuyCalculator;
