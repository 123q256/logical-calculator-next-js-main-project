"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useLoveCalculatorCalculationMutation,
  useFfmiCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FFMICalculator = () => {
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
    tech_gender: "Male", //Male  Female
    tech_weight: 39,
    tech_unit: "lbs",
    tech_height_ft: 34,
    tech_unit_ft_in: "ft/in",
    tech_height_in: 3,
    tech_unit_h: "ft/in",
    tech_height_cm: 5,
    tech_unit_h_cm: "ft/in",
    tech_percent: 13,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFfmiCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_gender ||
      !formData.tech_weight ||
      !formData.tech_unit ||
      !formData.tech_percent
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_weight: formData.tech_weight,
        tech_unit: formData.tech_unit,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_percent: formData.tech_percent,
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
      tech_gender: "Male", //Male  Female
      tech_weight: 39,
      tech_unit: "lbs",
      tech_height_ft: 34,
      tech_unit_ft_in: "ft/in",
      tech_height_in: 3,
      tech_unit_h: "ft/in",
      tech_height_cm: 5,
      tech_unit_h_cm: "ft/in",
      tech_percent: 13,
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

  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
    }));
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

          <div className="lg:w-[80%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["gender"]}:
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
                    <option value="Male">
                      {data?.payload?.tech_lang_keys["male"]}
                    </option>
                    <option value="Female">
                      {data?.payload?.tech_lang_keys["female"]}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["weight"]}
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
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
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

              <input
                type="hidden"
                step="any"
                name="tech_unit_ft_in"
                id="tech_unit_ft_in"
                className="input my-2"
                aria-label="input"
                value={formData.tech_unit_ft_in}
                onChange={handleChange}
              />
              {formData.tech_unit_ft_in == "ft/in" && (
                <>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["height"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height_ft"
                        id="tech_height_ft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_height_ft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in">
                    <label htmlFor="tech_height_in" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_in"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_in}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "centimeters (cm)", value: "cm" },
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
              {formData.tech_unit_ft_in == "cm" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  h_cm">
                    <label htmlFor="tech_height_cm" className="label">
                      {data?.payload?.tech_lang_keys["height"]} (cm):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_cm"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_cm}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
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
                </>
              )}
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_percent" className="label">
                  {data?.payload?.tech_lang_keys["body_fat"]} %{" "}
                  {data?.payload?.tech_lang_keys["dont"]}
                  <a
                    title="Body Fat Percentage Calculator"
                    href="/body-fat-percentage-calculator"
                    className="text-blue-800 font-s-12 underline "
                    target="_blank"
                    rel="noopener"
                  >
                    {data?.payload?.tech_lang_keys["click"]}{" "}
                  </a>
                  :
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_percent"
                    id="tech_percent"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_percent}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  mt-3">
                      <div className="w-full">
                        <div className="w-full overflow-auto">
                          <table
                            className="w-full md:w-[80%] lg:w-[80%]"
                            cellSpacing="0"
                          >
                            <thead>
                              <tr>
                                <th className="text-start text-blue border-b py-2">
                                  {data?.payload?.tech_lang_keys["name"]}
                                </th>
                                <th className="text-start text-blue border-b">
                                  {data?.payload?.tech_lang_keys["value"]}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["fat"]}
                                </td>
                                <td className="border-b">
                                  {result?.tech_lean !== undefined &&
                                  result?.tech_lean !== ""
                                    ? `${result.tech_lean} kg / ${(
                                        result.tech_lean * 2.205
                                      ).toFixed(2)} lbs`
                                    : "00 kg"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["body_fat"]}
                                </td>
                                <td className="border-b">
                                  {result?.tech_body_fat !== undefined &&
                                  result?.tech_body_fat !== ""
                                    ? `${result.tech_body_fat} kg / ${(
                                        result.tech_body_fat * 2.205
                                      ).toFixed(2)} lbs`
                                    : "00 kg"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["ffmi"]}
                                </td>
                                <td className="border-b">
                                  {result?.tech_ffmi !== undefined &&
                                  result?.tech_ffmi !== ""
                                    ? `${result.tech_ffmi} kg/m²`
                                    : "00 kg/m²"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["nffmi"]}
                                </td>
                                <td className="border-b">
                                  {result?.tech_nffmi !== undefined &&
                                  result?.tech_nffmi !== ""
                                    ? `${result.tech_nffmi} kg/m²`
                                    : "00 kg/m²"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["f_cat"]}
                                </td>
                                <td className="border-b">
                                  {result?.tech_cat || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  {data?.payload?.tech_lang_keys["bmi"]}
                                </td>
                                <td>
                                  {result?.tech_bmi !== undefined &&
                                  result?.tech_bmi !== ""
                                    ? `${result.tech_bmi} kg/m²`
                                    : "00 kg/m²"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full overflow-auto mt-3">
                          <table className="w-full lg:w-4/5" cellSpacing="0">
                            <thead>
                              <tr>
                                <th className="text-start text-blue border-b py-2">
                                  {data?.payload?.tech_lang_keys["frang"]}
                                </th>
                                <th className="text-start text-blue border-b">
                                  {data?.payload?.tech_lang_keys["des"]}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className={result?.skinny || "bg-[#2845F5]"}>
                                <td className="border-b p-2">
                                  {data?.payload?.tech_lang_keys["Below"]}
                                </td>
                                <td className="border-b p-2">
                                  {data?.payload?.tech_lang_keys["b_a"]}
                                </td>
                              </tr>
                              <tr className={result?.average || ""}>
                                <td className="border-b p-2">18 - 20</td>
                                <td className="border-b p-2">
                                  {data?.payload?.tech_lang_keys["ave"]}
                                </td>
                              </tr>
                              <tr className={result?.fat || ""}>
                                <td className="border-b p-2">20 - 22</td>
                                <td className="border-b p-2">
                                  {data?.payload?.tech_lang_keys["a_a"]}
                                </td>
                              </tr>
                              <tr className={result?.athlete || ""}>
                                <td className="border-b p-2">22 - 23</td>
                                <td className="border-b p-2">
                                  {data?.payload?.tech_lang_keys["ex"]}
                                </td>
                              </tr>
                              <tr className={result?.gym || ""}>
                                <td className="border-b p-2">23 - 26</td>
                                <td className="border-b p-2">
                                  {data?.payload?.tech_lang_keys["sup"]}
                                </td>
                              </tr>
                              <tr className={result?.body || ""}>
                                <td className="p-2">26 - 28</td>
                                <td className="p-2">
                                  {data?.payload?.tech_lang_keys["sups"]}
                                </td>
                              </tr>
                              <tr className={result?.unlikely || ""}>
                                <td className="p-2">{">"} 28</td>
                                <td className="p-2">
                                  Highly Unlikely without steroids
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

export default FFMICalculator;
