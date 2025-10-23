"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWaistToHeightRatioCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WaistToHeightRatioCalculator = () => {
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
    tech_gender: "Female", // Male
    tech_age: "25",
    tech_height_ft: "5",
    tech_unit_ft_in: "cm",
    tech_height_in: "9",
    tech_unit_h: "cm",
    tech_height_cm: "17",
    tech_unit_h_cm: "ft/in",
    tech_waist: "32",
    tech_unit: "in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWaistToHeightRatioCalculatorMutation();

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
      !formData.tech_age ||
      !formData.tech_waist ||
      !formData.tech_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_age: formData.tech_age,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_waist: formData.tech_waist,
        tech_unit: formData.tech_unit,
        tech_y: formData.tech_y,
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
      tech_gender: "Female", // Male
      tech_age: "25",
      tech_height_ft: "5",
      tech_unit_ft_in: "cm",
      tech_height_in: "9",
      tech_unit_h: "cm",
      tech_height_cm: "17",
      tech_unit_h_cm: "ft/in",
      tech_waist: "32",
      tech_unit: "in",
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
    setFormData((prev) => ({
      ...prev,
      // tech_unit_h: unit,
      // tech_unit_ft_in: unit, // hidden input bhi update ho jaega

      tech_unit_h: unit,
      tech_unit_ft_in: unit,
    }));
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
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit, // hidden input update hoga
      //    tech_unit_h_cm: unit.label,
      // tech_unit_ft_in: unit.value,
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["gen"]}:
                </label>
                <div className="">
                  <select
                    className="input mt-2"
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
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["age"]}:
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
                        onClick={toggleDropdown}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            { label: "centimeters (cm)", value: "cm" },
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
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h_cm} ▾
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_waist" className="label">
                  {data?.payload?.tech_lang_keys["waist"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_waist"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_waist}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_unit} ▾
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                      <div className="w-full md:w-[80%] lg:w-[70%]  mx-auto">
                        <div className="bg-sky bordered rounded-lg px-3 py-3 lg:text-[16px] md:text-[16px] text-[14px]">
                          <span className="px-1">
                            {data?.payload?.tech_lang_keys["ans"]} =
                          </span>
                          <strong className="text-[#119154] text-[25px]">
                            {result?.tech_ratio !== undefined &&
                            result?.tech_ratio !== null
                              ? result.tech_ratio
                              : "0.0"}
                          </strong>
                        </div>
                        <div className="grid grid-cols-12 mt-[50px] mb-4 relative">
                          <div
                            className="col-span-12 speech-bubble-area text-center radius-5 pt-2px"
                            style={{
                              position: "absolute",
                              width: "18%",
                              top: "-29px",
                              background: result?.tech_color,
                              left: `${result?.tech_left}`,
                              animation: `${result?.tech_bmi_res} 0.5s`,
                            }}
                          >
                            <div
                              className="speech-bubble text-white rounded-lg text-[13px] relative"
                              style={{
                                position: "relative",
                                padding: "2px",
                              }}
                            >
                              {/* Triangle / Arrow */}
                              <span
                                style={{
                                  content: '""',
                                  position: "absolute",
                                  width: 0,
                                  height: 0,
                                  bottom: 0,
                                  left: "40%",
                                  border: "8px solid transparent",
                                  borderBottom: 0,
                                  marginBottom: "-7px",
                                  borderTopColor: result?.tech_color,
                                }}
                              />
                              {result?.tech_ratio !== undefined &&
                              result?.tech_ratio !== null
                                ? result.tech_ratio
                                : "0.0"}
                            </div>
                          </div>

                          <div className="col-span-3 bg-blue-800 text-center py-1 rounded-l pt-2px">
                            <p className="text-white text-[13px]">
                              {data?.payload?.tech_lang_keys["under"]}
                            </p>
                          </div>
                          <div className="col-span-3 bg-green-800 text-center py-1 pt-2px">
                            <p className="text-white text-[13px]">
                              {data?.payload?.tech_lang_keys["health"]}
                            </p>
                          </div>
                          <div className="col-span-3 bg-yellow-500 text-center py-1 pt-2px">
                            <p className="text-white text-[13px]">
                              {data?.payload?.tech_lang_keys["over"]}
                            </p>
                          </div>
                          <div className="col-span-3 bg-red-800 text-center py-1 rounded-r pt-2px">
                            <p className="text-white text-[13px]">
                              {data?.payload?.tech_lang_keys["obese"]}
                            </p>
                          </div>
                        </div>
                        <div className="w-full overflow-auto mt-3 mt-md-0">
                          <table className="w-full" cellSpacing="0">
                            <tbody>
                              <tr>
                                <th className="text-start text-blue-700 py-2">
                                  {data?.payload?.tech_lang_keys["val"]}
                                </th>
                                <th className="text-start text-blue-700 py-2">
                                  {data?.payload?.tech_lang_keys["clasi"]}
                                </th>
                              </tr>
                              <tr
                                className={` ${
                                  result?.tech_xslim ? result.tech_xslim : ""
                                }`}
                              >
                                <td className="border-b py-2">
                                  0.34 {data?.payload?.tech_lang_keys["and_b"]}
                                </td>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["xslim"]}
                                </td>
                              </tr>
                              <tr
                                className={` ${
                                  result?.tech_slim ? result.tech_slim : ""
                                }`}
                              >
                                <td className="border-b py-2">
                                  {formData?.tech_gender == "Female"
                                    ? "0.35 to 0.41"
                                    : "0.35 to 0.42"}
                                </td>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["slim"]}
                                </td>
                              </tr>
                              <tr
                                className={` ${
                                  result?.tech_health ? result.tech_health : ""
                                }`}
                              >
                                <td className="border-b py-2">
                                  {formData?.tech_gender == "Female"
                                    ? "0.42 to 0.48"
                                    : "0.43 to 0.52"}
                                </td>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["health"]}
                                </td>
                              </tr>
                              <tr
                                className={` ${
                                  result?.tech_overc ? result.tech_overc : ""
                                }`}
                              >
                                <td className="border-b py-2">
                                  {formData?.tech_gender == "Female"
                                    ? "0.49 to 0.57"
                                    : "0.53 to 0.62"}
                                </td>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["over"]}
                                </td>
                              </tr>
                              <tr
                                className={` ${
                                  result?.tech_overh ? result.tech_overh : ""
                                }`}
                              >
                                <td className="py-2">
                                  {formData?.tech_gender == "Female"
                                    ? "0.58"
                                    : "0.63"}{" "}
                                  {data?.payload?.tech_lang_keys["and_a"]}
                                </td>
                                <td className="py-2">
                                  {data?.payload?.tech_lang_keys["obese"]}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full text-center flex justify-center">
                          <img
                            src="/images/all_calculators/waist-min.png"
                            className="materialboxed"
                            alt="Waist to Height Ratio Chart"
                            width="500px"
                            height="auto"
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

export default WaistToHeightRatioCalculator;
