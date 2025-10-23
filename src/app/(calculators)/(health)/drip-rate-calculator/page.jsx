"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDripRateCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IVDripRateCalculator = () => {
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
    tech_type: "first", /// second  first
    tech_v: 5,
    tech_v_unit: "mm³",
    tech_t: 5,
    tech_t_unit: "sec",
    tech_d: 0.02,
    tech_d_unit: "mg/kg/min",
    tech_bw: 85,
    tech_bw_unit: "kg",
    tech_bv: 40,
    tech_bv_unit: "ml",
    tech_drug: 10,
    tech_drug_unit: "µg",
    tech_dp: 10,
    tech_dp_unit: "gtts/mm³",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDripRateCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_type == "first") {
      if (
        !formData.tech_type ||
        !formData.tech_v ||
        !formData.tech_v_unit ||
        !formData.tech_t ||
        !formData.tech_t_unit ||
        !formData.tech_dp ||
        !formData.tech_dp_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_type ||
        !formData.tech_d ||
        !formData.tech_d_unit ||
        !formData.tech_bw ||
        !formData.tech_bw_unit ||
        !formData.tech_bv ||
        !formData.tech_bv_unit ||
        !formData.tech_drug ||
        !formData.tech_drug_unit ||
        !formData.tech_dp_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_v: formData.tech_v,
        tech_v_unit: formData.tech_v_unit,
        tech_t: formData.tech_t,
        tech_t_unit: formData.tech_t_unit,
        tech_d: formData.tech_d,
        tech_d_unit: formData.tech_d_unit,
        tech_bw: formData.tech_bw,
        tech_bw_unit: formData.tech_bw_unit,
        tech_bv: formData.tech_bv,
        tech_bv_unit: formData.tech_bv_unit,
        tech_drug: formData.tech_drug,
        tech_drug_unit: formData.tech_drug_unit,
        tech_dp: formData.tech_dp,
        tech_dp_unit: formData.tech_dp_unit,
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
      tech_type: "second", /// second  first
      tech_v: 5,
      tech_v_unit: "mm³",
      tech_t: 5,
      tech_t_unit: "sec",
      tech_d: 0.02,
      tech_d_unit: "mg/kg/min",
      tech_bw: 85,
      tech_bw_unit: "kg",
      tech_bv: 40,
      tech_bv_unit: "ml",
      tech_drug: 10,
      tech_drug_unit: "µg",
      tech_dp: 10,
      tech_dp_unit: "gtts/mm³",
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

  //dropdown states 0
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_d_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_bw_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_bv_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_drug_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dp_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label className="pe-2" htmlFor="first">
                  <input
                    type="radio"
                    name="tech_type"
                    value="first"
                    id="first"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_type === "first"}
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "first" });
                      setResult(null);
                      setFormError(null);
                    }}
                  />
                  <span>{data?.payload?.tech_lang_keys["14"]}</span>
                </label>
                <label htmlFor="second">
                  <input
                    type="radio"
                    name="tech_type"
                    className="mr-2 border"
                    value="second"
                    id="second"
                    onChange={handleChange}
                    checked={formData.tech_type === "second"}
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "second" });
                      setResult(null);
                      setFormError(null);
                    }}
                  />
                  <span>{data?.payload?.tech_lang_keys["15"]}</span>
                </label>
              </div>
              {formData.tech_type == "first" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_v" className="label">
                      {data?.payload?.tech_lang_keys["1"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_v"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_v}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_v_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm³", value: "mm³" },
                            { label: "cm³", value: "cm³" },
                            { label: "dm³", value: "dm³" },
                            { label: "ml", value: "ml" },
                            { label: "cl", value: "cl" },
                            { label: "l", value: "l" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_t" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_t"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_t}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_t_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
                            { label: "hours (hrs)", value: "hrs" },
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

              {formData.tech_type == "second" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_d" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_d"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_d}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_d_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mg/kg/min", value: "mg/kg/min" },
                            { label: "mg/oz/min", value: "mg/oz/min" },
                            { label: "mg/lb/min", value: "mg/lb/min" },
                            { label: "mg/stone/min", value: "mg/stone/min" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_bw" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_bw"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_bw}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_bw_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "pounds" },
                            { label: "stone", value: "stone" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_bv" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_bv"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_bv}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_bv_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milliliters (ml)", value: "ml" },
                            { label: "centiliters (cl)", value: "cl" },
                            { label: "liters (l)", value: "l" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_drug" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_drug"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_drug}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_drug_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milcrograms (µg)", value: "µg" },
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler5(unit.value)}
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                <label htmlFor="tech_dp" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_dp"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_dp}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown6}
                  >
                    {formData.tech_dp_unit} ▾
                  </label>
                  {dropdownVisible6 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: "drops (gtts) per millimeters cube (mm³)",
                          value: "gtts/mm³",
                        },
                        {
                          label: "drops (gtts) per centimeters cube (cm³)",
                          value: "gtts/cm",
                        },
                        {
                          label: "drops (gtts) per milliliter (ml)",
                          value: "gtts/ml",
                        },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler6(unit.value)}
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
                      <div className="w-full">
                        {result?.tech_type === "first" ? (
                          <>
                            <p className="text-center">
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]}
                              </strong>
                            </p>
                            <p className="text-center">
                              <strong className="text-[#119154] text-[18px]">
                                {Number(result?.tech_dr)}{" "}
                                <span className="text-[#119154] text-[18px]">
                                  (ml/h)
                                </span>
                              </strong>
                            </p>
                            <div className="w-full md:w-[60%] lg:w-[60%] mx-auto">
                              <div className="flex flex-wrap justify-between">
                                <div className="text-center px-3 mt-3">
                                  <p>
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </strong>
                                  </p>
                                  <p className="text-[25px]">
                                    <strong className="text-[#119154]">
                                      {Number(result?.tech_dpm).toFixed(3)}
                                    </strong>
                                  </p>
                                </div>
                                <div className="border-r hidden md:block lg:block mt-3">
                                  &nbsp;
                                </div>
                                <div className="text-center px-3 mt-3">
                                  <p>
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </strong>
                                  </p>
                                  <p className="text-[25px]">
                                    <strong className="text-[#119154]">
                                      {Number(result?.tech_dph).toFixed(3)}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : result?.tech_type === "second" ? (
                          <>
                            <p className="text-center">
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]}
                              </strong>
                            </p>
                            <p className="text-center">
                              <strong className="text-[#119154] font-s-32">
                                {Number(result?.tech_dr)}{" "}
                                <span className="text-[#119154] font-s-22">
                                  (ml/h)
                                </span>
                              </strong>
                            </p>
                            <div className="w-full md:w-[80%] lg:w-[80%] mx-auto">
                              <div className="flex flex-wrap justify-between">
                                <div className="text-center px-3 mt-3">
                                  <p>
                                    <strong>
                                      {data?.payload?.tech_lang_keys["11"]}
                                    </strong>
                                  </p>
                                  <p className="text-[25px]">
                                    <strong className="text-[#119154]">
                                      {Number(
                                        result?.tech_concentration
                                      ).toFixed(3)}{" "}
                                      <span className="text-[#119154] text-[18px]">
                                        (mg/L)
                                      </span>
                                    </strong>
                                  </p>
                                </div>
                                <div className="border-r hidden md:block lg:block mt-3">
                                  &nbsp;
                                </div>
                                <div className="text-center px-3 mt-3">
                                  <p>
                                    <strong>
                                      {data?.payload?.tech_lang_keys["12"]}
                                    </strong>
                                  </p>
                                  <p className="text-[25px]">
                                    <strong className="text-[#119154]">
                                      {Number(result?.tech_flow_rate).toFixed(
                                        3
                                      )}{" "}
                                      <span className="text-[#119154] text-[18px]">
                                        (gtts/per h)
                                      </span>
                                    </strong>
                                  </p>
                                </div>
                                <div className="border-r hidden md:block lg:block mt-3">
                                  &nbsp;
                                </div>
                                <div className="text-center px-3 mt-3">
                                  <p>
                                    <strong>
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </strong>
                                  </p>
                                  <p className="text-[25px]">
                                    <strong className="text-[#119154]">
                                      {Number(result?.tech_time_to_bag).toFixed(
                                        2
                                      )}{" "}
                                      <span className="text-[#119154] text-[18px]">
                                        (hrs)
                                      </span>
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
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

export default IVDripRateCalculator;
