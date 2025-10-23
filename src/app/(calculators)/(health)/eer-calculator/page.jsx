"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useEercalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EstimatedEnergyRequirementCalculator = () => {
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
    tech_gender: "Male",
    tech_age: "25",
    tech_child_age: "25",
    tech_trim: "1st",
    tech_period: "1st6",
    tech_lac: "1st",
    tech_height_ft: "5",
    tech_unit_ft_in: "ft/in",
    tech_height: "10",
    tech_unit_h: "ft/in",
    tech_height_cm: "175",
    tech_unit_h_cm: "ft/in",
    tech_weight: "160",
    tech_unit: "lbs",
    tech_activity: "Sedentary",
    tech_goal: "maintain",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEercalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.tech_gender == "Male" ||
      formData.tech_gender == "Female" ||
      formData.tech_gender == "obs_boy" ||
      formData.tech_gender == "obs_girl"
    ) {
      if (
        !formData.tech_gender ||
        !formData.tech_age ||
        !formData.tech_weight ||
        !formData.tech_unit ||
        !formData.tech_activity ||
        !formData.tech_goal
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_gender == "pergnant") {
      if (
        !formData.tech_gender ||
        !formData.tech_age ||
        !formData.tech_weight ||
        !formData.tech_unit ||
        !formData.tech_activity ||
        !formData.tech_goal ||
        !formData.tech_trim
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_gender == "child") {
      if (
        !formData.tech_gender ||
        !formData.tech_child_age ||
        !formData.tech_weight ||
        !formData.tech_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_gender == "lac") {
      if (
        !formData.tech_gender ||
        !formData.tech_age ||
        !formData.tech_weight ||
        !formData.tech_unit ||
        !formData.tech_activity ||
        !formData.tech_goal ||
        !formData.tech_period
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_age: formData.tech_age,
        tech_child_age: formData.tech_child_age,
        tech_trim: formData.tech_trim,
        tech_period: formData.tech_period,
        tech_lac: formData.tech_lac,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height: formData.tech_height,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_weight: formData.tech_weight,
        tech_unit: formData.tech_unit,
        tech_activity: formData.tech_activity,
        tech_goal: formData.tech_goal,
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
      tech_gender: "Male",
      tech_age: "25",
      tech_child_age: "25",
      tech_trim: "1st",
      tech_period: "1st6",
      tech_lac: "1st",
      tech_height_ft: "5",
      tech_unit_ft_in: "ft/in",
      tech_height: "10",
      tech_unit_h: "ft/in",
      tech_height_cm: "175",
      tech_unit_h_cm: "ft/in",
      tech_weight: "160",
      tech_unit: "lbs",
      tech_activity: "Sedentary",
      tech_goal: "maintain",
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
      tech_unit: unit,
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

  // result

  const lang = data?.payload?.tech_lang_keys;

  const getBMIClass = (techClass) => {
    return (
      {
        under: lang?.under,
        health: lang?.health,
        over: lang?.over,
        obese: lang?.obese,
        s_obese: lang?.s_obese,
      }[techClass] || ""
    );
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
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
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
                      {data?.payload?.tech_lang_keys["female"]}{" "}
                    </option>
                    <option value="pergnant">
                      {data?.payload?.tech_lang_keys["pergnant"]}{" "}
                    </option>
                    <option value="child">
                      {data?.payload?.tech_lang_keys["child"]}{" "}
                    </option>
                    <option value="lac">
                      {data?.payload?.tech_lang_keys["lac"]}{" "}
                    </option>
                    <option value="obs_boy">Obese Boy (3-18 Years) </option>
                    <option value="obs_girl">Obese Girl (3-18 Years) </option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6 lac hidden ">
                <label htmlFor="tech_lac" className="label">
                  {data?.payload?.tech_lang_keys["lac"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_lac"
                    id="tech_lac"
                    value={formData.tech_lac}
                    onChange={handleChange}
                  >
                    <option value="1st6">
                      {data?.payload?.tech_lang_keys["1st6"]}
                    </option>
                    <option value="2nd6">
                      {data?.payload?.tech_lang_keys["2nd6"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_gender == "child" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 child ">
                    <label htmlFor="tech_child_age" className="label">
                      {data?.payload?.tech_lang_keys["age_m"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_child_age"
                        id="tech_child_age"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_child_age}
                        onChange={handleChange}
                      />
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
                </>
              )}

              {formData.tech_gender != "child" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["age_year"]}:
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
                  {formData.tech_gender == "pergnant" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 trim ">
                        <label htmlFor="tech_trim" className="label">
                          {data?.payload?.tech_lang_keys["trim"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_trim"
                            id="tech_trim"
                            value={formData.tech_trim}
                            onChange={handleChange}
                          >
                            <option value="1st">
                              {data?.payload?.tech_lang_keys["1st"]}
                            </option>
                            <option value="2nd">
                              {data?.payload?.tech_lang_keys["2nd"]}{" "}
                            </option>
                            <option value="3rd">
                              {data?.payload?.tech_lang_keys["3rd"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_gender == "lac" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 period ">
                        <label htmlFor="tech_period" className="label">
                          {data?.payload?.tech_lang_keys["period"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_period"
                            id="tech_period"
                            value={formData.tech_period}
                            onChange={handleChange}
                          >
                            <option value="1st6">
                              {data?.payload?.tech_lang_keys["1st6"]}
                            </option>
                            <option value="2nd6">
                              {data?.payload?.tech_lang_keys["2nd6"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

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
                      <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in age">
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
                            placeholder="ft"
                            value={formData.tech_height_ft}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-3 lg:col-span-3 ft_in age">
                        <label htmlFor="tech_height" className="label">
                          &nbsp;
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_height"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_height}
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
                                {
                                  label: "feet / inches (ft/in)",
                                  value: "ft/in",
                                },
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
                          {data?.payload?.tech_lang_keys["height"]}
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
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_unit_h_cm} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: "feet / inches (ft/in)",
                                  value: "ft/in",
                                },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
                    <label htmlFor="tech_activity" className="label">
                      {data?.payload?.tech_lang_keys["activity"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_activity"
                        id="tech_activity"
                        value={formData.tech_activity}
                        onChange={handleChange}
                      >
                        <option value="Sedentary">
                          {data?.payload?.tech_lang_keys["stand"]}
                        </option>
                        <option value="Lightly Active">
                          {data?.payload?.tech_lang_keys["light"]}{" "}
                        </option>
                        <option value="Moderately Active">
                          {data?.payload?.tech_lang_keys["mod"]}{" "}
                        </option>
                        <option value="Very Active">
                          {data?.payload?.tech_lang_keys["very"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 age">
                    <label htmlFor="tech_goal" className="label">
                      {data?.payload?.tech_lang_keys["goal"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_goal"
                        id="tech_goal"
                        value={formData.tech_goal}
                        onChange={handleChange}
                      >
                        <option value="maintain">
                          {data?.payload?.tech_lang_keys["maintain"]}
                        </option>
                        <option value="lose">
                          {data?.payload?.tech_lang_keys["lose"]}{" "}
                        </option>
                        <option value="gain">
                          {data?.payload?.tech_lang_keys["gain"]}{" "}
                        </option>
                      </select>
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
                    <div className="w-full  mt-3">
                      {!result?.tech_EER_child && (
                        <>
                          <div className="w-full">
                            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                              {result?.tech_tee ? (
                                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                  <div className="bg-sky bordered rounded-lg px-3 py-4">
                                    <p className="text-center">
                                      <strong>
                                        Total Energy Expenditure (TEE)
                                      </strong>
                                    </p>
                                    <div className="flex items-center justify-between bg-white rounded-lg p-3 mt-2">
                                      <div className="flex items-center">
                                        <img
                                          src="/images/eer-icon.png"
                                          width="50px"
                                          height="50px"
                                          alt="eer calculator"
                                        />
                                        <p className="text-[18px] ms-2">
                                          <strong className="text-blue-500">
                                            Your TEE
                                          </strong>
                                        </p>
                                      </div>
                                      <div>
                                        <div className="text-[25px]">
                                          <strong className="text-blue-500">
                                            {result?.tech_tee}
                                          </strong>
                                        </div>
                                        <div>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "Calories/Day"
                                            ]
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <p className="col s12 mt-2">
                                      {data?.payload?.tech_lang_keys["obese_c"]}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                  <div className="bg-sky bordered rounded-lg px-3 py-4">
                                    <p className="text-center">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["eer"]}
                                      </strong>
                                    </p>
                                    <div className="flex items-center justify-between bordered bg-white rounded-lg p-3 mt-2">
                                      <div className="flex items-center">
                                        <img
                                          src="/images/eer-icon.png"
                                          width="50px"
                                          height="50px"
                                          alt="eer calculator"
                                        />
                                        <p className="text-[18px] ms-2">
                                          <strong className="text-blue-500">
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "your"
                                              ]
                                            }
                                          </strong>
                                        </p>
                                      </div>
                                      <div>
                                        <div className="text-[25px]">
                                          <strong className="text-blue-500">
                                            {result?.tech_EER}
                                          </strong>
                                        </div>
                                        <div>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "Calories/Day"
                                            ]
                                          }
                                        </div>
                                      </div>
                                    </div>

                                    {result?.tech_ibw && (
                                      <>
                                        <p className="mt-2">
                                          <strong>
                                            Healthy Weight Range would be:
                                          </strong>
                                        </p>
                                        <p className="text-[28px]">
                                          <strong className="text-blue-500">
                                            {result?.tech_ibw}
                                          </strong>
                                        </p>
                                      </>
                                    )}

                                    <p className="col s12">
                                      {data?.payload?.tech_lang_keys["adult"]}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                {/* BMR */}
                                <div className="px-lg-3 py-2 pt-lg-3">
                                  <div className="flex items-center justify-between bg-sky bordered rounded-lg p-3">
                                    <div className="flex items-center">
                                      <img
                                        src="/images/bmr.png"
                                        width="50"
                                        height="50"
                                        alt="bmr"
                                      />
                                      <p className="text-[18px] ms-2">
                                        <strong className="text-blue-500">
                                          BMR
                                        </strong>
                                      </p>
                                    </div>
                                    <div>
                                      {result?.tech_bmr !== "" ? (
                                        <>
                                          <div className="text-center text-[20px]">
                                            <strong className="text-blue-500">
                                              {result.tech_bmr}
                                            </strong>
                                          </div>
                                          <div className="text-[14px]">
                                            {lang?.["Calories/Day"]}
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="text-center text-[20px]">
                                            <strong className="text-blue-500">
                                              00.0
                                            </strong>
                                          </div>
                                          <div className="text-[14px]">
                                            {lang?.["Calories/Day"]}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* BMI */}
                                <div className="px-lg-3 py-2">
                                  <div className="flex items-center justify-between bg-sky bordered rounded-lg p-3">
                                    <div className="flex items-center">
                                      <img
                                        src="/images/bmi.png"
                                        width="50"
                                        height="50"
                                        alt="bmi"
                                      />
                                      <p className="text-[18px] ms-2">
                                        <strong className="text-blue-500">
                                          BMI
                                        </strong>
                                      </p>
                                    </div>
                                    <div>
                                      {result?.tech_BMI !== "" ? (
                                        <>
                                          <div className="text-center text-[20px]">
                                            <strong className="text-blue-500">
                                              {result.tech_BMI}
                                            </strong>
                                          </div>
                                          <div className="text-[14px]">
                                            {getBMIClass(result?.tech_class)}
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="text-center text-[20px]">
                                            <strong className="text-blue-500">
                                              00.0
                                            </strong>
                                          </div>
                                          <div className="text-[14px]">
                                            {lang?.["class"]}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* RMR */}
                                <div className="px-lg-3 py-2">
                                  <div className="flex items-center justify-between bg-sky bordered rounded-lg p-3">
                                    <div className="flex items-center">
                                      <img
                                        src="/images/rmr.png"
                                        width="50"
                                        height="50"
                                        alt="rmr"
                                      />
                                      <p className="text-[18px] ms-2">
                                        <strong className="text-blue-500">
                                          RMR
                                        </strong>
                                      </p>
                                    </div>
                                    <div>
                                      {result?.tech_rmr !== "" ? (
                                        <>
                                          <div className="text-center text-[20px]">
                                            <strong className="text-blue-500">
                                              {result.tech_rmr}
                                            </strong>
                                          </div>
                                          <div className="text-[14px]">
                                            {lang?.["Calories/Day"]}
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="text-center text-[20px]">
                                            <strong className="text-blue-500">
                                              00.0
                                            </strong>
                                          </div>
                                          <div className="text-[14px]">
                                            {lang?.["Calories/Day"]}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Healthy BMI */}
                                {(formData?.tech_gender === "Male" ||
                                  formData?.tech_gender === "Female") && (
                                  <div className="px-lg-3 py-2">
                                    <div className="flex items-center justify-between bg-sky bordered rounded-lg p-3">
                                      <div className="flex items-center">
                                        <img
                                          src="/images/healthy_bmi.png"
                                          width="50"
                                          height="50"
                                          alt="healthy_bmi"
                                        />
                                        <p className="text-[18px] ms-2">
                                          <strong className="text-blue-500">
                                            Healthy BMI
                                          </strong>
                                        </p>
                                      </div>
                                      <div>
                                        {result?.rmr !== "" && (
                                          <div className="text-center text-[20px]">
                                            <strong className="text-blue-500">
                                              18.5 - 24.9
                                            </strong>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* BEE */}
                                {result?.bee !== undefined && (
                                  <div className="px-lg-3 py-2">
                                    <div className="flex items-center justify-between bg-sky bordered rounded-lg p-3">
                                      <div className="flex items-center">
                                        <img
                                          src="/images/maintain.png"
                                          width="50"
                                          height="50"
                                          alt="bee"
                                        />
                                        <p className="text-[18px] ms-2">
                                          <strong className="text-blue-500">
                                            BEE
                                          </strong>
                                        </p>
                                      </div>
                                      <div>
                                        {result?.bee !== "" ? (
                                          <>
                                            <div className="text-center text-[20px]">
                                              <strong className="text-blue-500">
                                                {result.bee}
                                              </strong>
                                            </div>
                                            <div className="text-[14px]">
                                              {lang?.["Calories/Day"]}
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="text-center text-[20px]">
                                              <strong className="text-blue-500">
                                                00.0
                                              </strong>
                                            </div>
                                            <div className="text-[14px]">
                                              {lang?.["Calories/Day"]}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="col-span-12 overflow-auto px-lg-3">
                                <table className="w-full" cellSpacing="0">
                                  <thead>
                                    <tr>
                                      <th className="text-start text-blue-500 border-b py-2">
                                        {data?.payload?.tech_lang_keys["level"]}
                                      </th>
                                      <th className="text-start text-blue-500 border-b">
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "energy"
                                          ]
                                        }
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className={result?.stand || ""}>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["stand"]}
                                      </td>
                                      <td className="border-b">
                                        {result?.tech_s ? (
                                          <>
                                            <span>{result.tech_s}</span>
                                            <span className="text-[14px]">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "Calories/Day"
                                                ]
                                              }
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <span>00</span>
                                            <span className="text-[14px]">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "Calories/Day"
                                                ]
                                              }
                                            </span>
                                          </>
                                        )}
                                      </td>
                                    </tr>

                                    <tr className={result?.tech_light || ""}>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["light"]}
                                      </td>
                                      <td className="border-b">
                                        {result?.tech_l ? (
                                          <>
                                            <span>{result.tech_l}</span>
                                            <span className="text-[14px]">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "Calories/Day"
                                                ]
                                              }
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <span>00</span>
                                            <span className="text-[14px]">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "Calories/Day"
                                                ]
                                              }
                                            </span>
                                          </>
                                        )}
                                      </td>
                                    </tr>

                                    <tr className={result?.tech_mod || ""}>
                                      <td className="border-b py-2">
                                        {data?.payload?.tech_lang_keys["mod"]}
                                      </td>
                                      <td className="border-b">
                                        {result?.tech_m ? (
                                          <>
                                            <span>{result.tech_m}</span>
                                            <span className="text-[14px]">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "Calories/Day"
                                                ]
                                              }
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <span>00</span>
                                            <span className="text-[14px]">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "Calories/Day"
                                                ]
                                              }
                                            </span>
                                          </>
                                        )}
                                      </td>
                                    </tr>

                                    <tr className={result?.tech_very || ""}>
                                      <td className="py-2">
                                        {data?.payload?.tech_lang_keys["very"]}
                                      </td>
                                      <td>
                                        {result?.tech_v ? (
                                          <>
                                            <span>{result.tech_v}</span>
                                            <span className="text-[14px]">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "Calories/Day"
                                                ]
                                              }
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <span>00</span>
                                            <span className="text-[14px]">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  "Calories/Day"
                                                ]
                                              }
                                            </span>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {result?.tech_EER_child && (
                        <>
                          <div className="w-full text-center">
                            <p className="text-[20px] mb-2">
                              <strong className="text-blue-500">
                                {data?.payload?.tech_lang_keys["your"]}
                              </strong>
                            </p>
                            <div className="d-inline-block bg-white rounded-lg px-3 py-2">
                              <span className="text-green text-[25px]">
                                {result?.tech_EER}
                              </span>
                              <span>
                                {data?.payload?.tech_lang_keys["Calories/Day"]}
                              </span>
                            </div>
                            <p className="text-start mt-2">
                              {data?.payload?.tech_lang_keys["child1"]}
                            </p>
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

export default EstimatedEnergyRequirementCalculator;
