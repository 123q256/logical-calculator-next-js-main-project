"use client";
import React, { useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useRoofReplacementCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const RoofReplacementCostCalculator = () => {
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
    tech_size1: "46",
    tech_size2: "44",
    tech_slop: "seven",
    tech_difficulty: "Medium",
    tech_existing: "yes",
    tech_floor: "2",
    tech_material: "1",
    tech_region: "na",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRoofReplacementCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_size1 ||
      !formData.tech_size2 ||
      !formData.tech_slop ||
      !formData.tech_difficulty ||
      !formData.tech_existing ||
      !formData.tech_floor ||
      !formData.tech_material ||
      !formData.tech_region
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_size1: formData.tech_size1,
        tech_size2: formData.tech_size2,
        tech_slop: formData.tech_slop,
        tech_difficulty: formData.tech_difficulty,
        tech_existing: formData.tech_existing,
        tech_floor: formData.tech_floor,
        tech_material: formData.tech_material,
        tech_region: formData.tech_region,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_size1: "46",
      tech_size2: "44",
      tech_slop: "seven",
      tech_difficulty: "Medium",
      tech_existing: "yes",
      tech_floor: "2",
      tech_material: "1",
      tech_region: "na",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_size1" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_size1"
                    id="tech_size1"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_size1}
                    onChange={handleChange}
                  />
                  <span className="input_unit">ft</span>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_size2" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_size2"
                    id="tech_size2"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_size2}
                    onChange={handleChange}
                  />
                  <span className="input_unit">ft</span>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_slop" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_slop"
                    id="tech_slop"
                    value={formData.tech_slop}
                    onChange={handleChange}
                  >
                    <option value="zero">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="three">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="five">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="seven">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="nine">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                    <option value="ten">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="twelve">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_difficulty" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_difficulty"
                    id="tech_difficulty"
                    value={formData.tech_difficulty}
                    onChange={handleChange}
                  >
                    <option value="Simple">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="Medium">
                      {data?.payload?.tech_lang_keys["13"]}{" "}
                    </option>
                    <option value="Difficult">
                      {data?.payload?.tech_lang_keys["14"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_existing" className="label">
                  {data?.payload?.tech_lang_keys["15"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_existing"
                    id="tech_existing"
                    value={formData.tech_existing}
                    onChange={handleChange}
                  >
                    <option value="yes">YES - 1 layer</option>
                    <option value="yes2">YES - 2 layers </option>
                    <option value="no">NO tear-off </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_floor" className="label">
                  {data?.payload?.tech_lang_keys["16"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_floor"
                    id="tech_floor"
                    value={formData.tech_floor}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["18"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["19"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_material" className="label">
                  {data?.payload?.tech_lang_keys["20"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_material"
                    id="tech_material"
                    value={formData.tech_material}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["22"]}{" "}
                    </option>
                    <option value="11">
                      {data?.payload?.tech_lang_keys["23"]}{" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["24"]}{" "}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["25"]}{" "}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["26"]}{" "}
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["27"]}{" "}
                    </option>
                    <option value="12">
                      {data?.payload?.tech_lang_keys["28"]}{" "}
                    </option>
                    <option value="13">
                      {data?.payload?.tech_lang_keys["29"]}{" "}
                    </option>
                    <option value="14">
                      {data?.payload?.tech_lang_keys["30"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_region" className="label">
                  {data?.payload?.tech_lang_keys["31"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_region"
                    id="tech_region"
                    value={formData.tech_region}
                    onChange={handleChange}
                  >
                    <option value="na">
                      {data?.payload?.tech_lang_keys["32"]}
                    </option>
                    <option value="ne">
                      {data?.payload?.tech_lang_keys["33"]}{" "}
                    </option>
                    <option value="ma">
                      {data?.payload?.tech_lang_keys["34"]}{" "}
                    </option>
                    <option value="sa">
                      {data?.payload?.tech_lang_keys["35"]}{" "}
                    </option>
                    <option value="esc">
                      {data?.payload?.tech_lang_keys["36"]}{" "}
                    </option>
                    <option value="wsc">
                      {data?.payload?.tech_lang_keys["37"]}{" "}
                    </option>
                    <option value="wnc">
                      {data?.payload?.tech_lang_keys["38"]}{" "}
                    </option>
                    <option value="wnc">
                      {data?.payload?.tech_lang_keys["39"]}{" "}
                    </option>
                    <option value="m">
                      {data?.payload?.tech_lang_keys["40"]}{" "}
                    </option>
                    <option value="p">
                      {data?.payload?.tech_lang_keys["41"]}{" "}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="grid grid-cols-12 gap-3 mt-2">
                        <div className="col-span-12 md:col-span-6 overflow-auto md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["42"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_result[0]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["43"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_result[1]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["44"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_result[2]}
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default RoofReplacementCostCalculator;
