"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWalkingCalorieCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WalkingCaloriesCalculator = () => {
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
    tech_unit_type: "usa", // sl  usa
    tech_age: "22",
    tech_gender: "female",
    tech_height: "5",
    tech_inches: "5",
    tech_weight: "80",
    tech_speed_unit: "5.0mph (8.0km/h)",
    tech_mets: "8.3",
    tech_duration: "120",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWalkingCalorieCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_unit_type == "usa") {
      if (
        !formData.tech_unit_type ||
        !formData.tech_age ||
        !formData.tech_gender ||
        !formData.tech_height ||
        !formData.tech_weight ||
        !formData.tech_speed_unit ||
        !formData.tech_mets ||
        !formData.tech_duration
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_unit_type ||
        !formData.tech_age ||
        !formData.tech_gender ||
        !formData.tech_height ||
        !formData.tech_inches ||
        !formData.tech_speed_unit ||
        !formData.tech_mets ||
        !formData.tech_duration
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_age: formData.tech_age,
        tech_gender: formData.tech_gender,
        tech_height: formData.tech_height,
        tech_inches: formData.tech_inches,
        tech_weight: formData.tech_weight,
        tech_speed_unit: formData.tech_speed_unit,
        tech_mets: formData.tech_mets,
        tech_duration: formData.tech_duration,
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
      tech_unit_type: "usa", // sl  usa
      tech_age: "22",
      tech_gender: "female",
      tech_height: "5",
      tech_inches: "5",
      tech_weight: "80",
      tech_speed_unit: "5.0mph (8.0km/h)",
      tech_mets: "8.3",
      tech_duration: "120",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label className="pe-2" htmlFor="sl">
                  <input
                    type="radio"
                    name="tech_unit_type"
                    value="sl"
                    id="sl"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_unit_type === "sl"}
                  />
                  <span>SI(cm,kg)</span>
                </label>

                <label htmlFor="usa">
                  <input
                    type="radio"
                    name="tech_unit_type"
                    className="mr-2 border"
                    value="usa"
                    id="usa"
                    onChange={handleChange}
                    checked={formData.tech_unit_type === "usa"}
                  />
                  <span>USA(ft,lbs)</span>
                </label>
              </div>

              {formData.tech_unit_type === "sl" && (
                <>
                  <div className="col-span-6">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_age"
                        id="tech_age"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_gender" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_gender"
                        id="tech_gender"
                        value={formData.tech_gender}
                        onChange={handleChange}
                      >
                        <option value="male">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="female">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_height" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height"
                        id="tech_height"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_height}
                        onChange={handleChange}
                      />
                      <span className="input_unit">cm</span>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="tech_weight" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_weight"
                        id="tech_weight"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_weight}
                        onChange={handleChange}
                      />
                      <span className="input_unit">kg</span>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_speed_unit" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_speed_unit"
                        id="tech_speed_unit"
                        value={formData.tech_speed_unit}
                        onChange={handleChange}
                      >
                        <option value="less than 2.0mph (3.2km/h)">
                          less than 2.0mph (3.2km/h)
                        </option>
                        <option value="2.0mph (3.2km/h)">
                          2.0mph (3.2km/h)
                        </option>
                        <option value="2.5mph (4.0km/h)">
                          2.5mph (4.0km/h)
                        </option>
                        <option value="3.0mph (4.8km/h)">
                          3.0mph (4.8km/h)
                        </option>
                        <option value="3.5mph (5.6km/h)">
                          3.5mph (5.6km/h)
                        </option>
                        <option value="4.0mph (6.4km/h)">
                          4.0mph (6.4km/h)
                        </option>
                        <option value="4.5mph (7.2km/h)">
                          4.5mph (7.2km/h)
                        </option>
                        <option value="5.0mph (8.0km/h)">
                          5.0mph (8.0km/h)
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3">
                    <label htmlFor="tech_mets" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mets"
                        id="tech_mets"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mets}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3">
                    <label htmlFor="tech_duration" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_duration"
                        id="tech_duration"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_duration}
                        onChange={handleChange}
                      />
                      <span className="input_unit">min</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_unit_type === "usa" && (
                <>
                  <div className="col-span-6">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_age"
                        id="tech_age"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_gender" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_gender"
                        id="tech_gender"
                        value={formData.tech_gender}
                        onChange={handleChange}
                      >
                        <option value="male">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="female">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_height" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height"
                        id="tech_height"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_height}
                        onChange={handleChange}
                      />
                      <span className="input_unit">ft</span>
                    </div>
                  </div>
                  <div className="col-span-6 " id="inches">
                    <label htmlFor="tech_inches" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_inches"
                        id="tech_inches"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_inches}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        {data?.payload?.tech_lang_keys["10"]}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_weight" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_weight"
                        id="tech_weight"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_weight}
                        onChange={handleChange}
                      />
                      <span className="input_unit">lbs</span>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_speed_unit" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_speed_unit"
                        id="tech_speed_unit"
                        value={formData.tech_speed_unit}
                        onChange={handleChange}
                      >
                        <option value="less than 2.0mph (3.2km/h)">
                          less than 2.0mph (3.2km/h)
                        </option>
                        <option value="2.0mph (3.2km/h)">
                          2.0mph (3.2km/h)
                        </option>
                        <option value="2.5mph (4.0km/h)">
                          2.5mph (4.0km/h)
                        </option>
                        <option value="3.0mph (4.8km/h)">
                          3.0mph (4.8km/h)
                        </option>
                        <option value="3.5mph (5.6km/h)">
                          3.5mph (5.6km/h)
                        </option>
                        <option value="4.0mph (6.4km/h)">
                          4.0mph (6.4km/h)
                        </option>
                        <option value="4.5mph (7.2km/h)">
                          4.5mph (7.2km/h)
                        </option>
                        <option value="5.0mph (8.0km/h)">
                          5.0mph (8.0km/h)
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3">
                    <label htmlFor="tech_mets" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mets"
                        id="tech_mets"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mets}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3">
                    <label htmlFor="tech_duration" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_duration"
                        id="tech_duration"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_duration}
                        onChange={handleChange}
                      />
                      <span className="input_unit">min</span>
                    </div>
                  </div>
                </>
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
                    <div className="w-full bg-light-blue result radius-10 p-3 mt-3">
                      <div className="w-full mt-2">
                        <div className="w-full border-b-dark pb-3">
                          <div className="w-full md:w-[60%] lg:w-[60%]  flex justify-between">
                            <div>
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["12"]}:
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] px-1 lg:text-[32px] md:text-[32px] text-[25px]">
                                  {result?.tech_burned}
                                </strong>
                                <span className="text-[#119154] text-[18px]">
                                  kcal
                                </span>
                              </p>
                            </div>
                            <div
                              className="hidden md:block lg:block border-r"
                              style={{ borderRightColor: "#c6c3c3" }}
                            >
                              &nbsp;
                            </div>

                            <div>
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}:
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] px-1 lg:text-[32px] md:text-[32px] text-[25px]">
                                  {Number(result?.tech_male_calories).toFixed(
                                    2
                                  )}
                                </strong>
                                <span className="text-[#119154] text-[18px]">
                                  kcal/{data?.payload?.tech_lang_keys["17"]}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full overflow-auto">
                          <table className="w-full md:w-[60%] lg:w-[60%] ">
                            <tbody>
                              <tr>
                                <td className="border-b py-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["14"]}:
                                  </strong>
                                  <strong className="text-[#119154] px-1 lg:text-[28px] md:text-[28px] text-[22px]">
                                    {Number(result?.tech_exercise).toFixed(2)}
                                  </strong>
                                  <span className="text-[#119154]">
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["15"]}:
                                  </strong>
                                  <strong className="text-[#119154] px-1 lg:text-[28px] md:text-[28px] text-[22px]">
                                    {Number(
                                      result?.tech_hour_duration_min
                                    ).toFixed(2)}
                                  </strong>
                                  <span className="text-[#119154]">km</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["15"]}:
                                  </strong>
                                  <strong className="text-[#119154] px-1 lg:text-[28px] md:text-[28px] text-[22px]">
                                    {Number(result?.tech_hour_mile).toFixed(2)}
                                  </strong>
                                  <span className="text-[#119154]">
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </span>
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

export default WalkingCaloriesCalculator;
