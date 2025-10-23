"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCholesterolRatioCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CholesterolRatioCalculator = () => {
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
    tech_tc: 12,
    tech_tc_unit: "mmol/L",
    tech_hc: 12,
    tech_hc_unit: "mmol/L",
    tech_lc: 5,
    tech_lc_unit: "mg/dL",
    tech_tr: "",
    tech_tr_unit: "mg/dL",
    tech_gender: "female", // female   male
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCholesterolRatioCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_tc ||
      !formData.tech_tc_unit ||
      !formData.tech_hc ||
      !formData.tech_hc_unit ||
      !formData.tech_lc ||
      !formData.tech_lc_unit ||
      !formData.tech_gender
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_tc: formData.tech_tc,
        tech_tc_unit: formData.tech_tc_unit,
        tech_hc: formData.tech_hc,
        tech_hc_unit: formData.tech_hc_unit,
        tech_lc: formData.tech_lc,
        tech_lc_unit: formData.tech_lc_unit,
        tech_tr: formData.tech_tr,
        tech_tr_unit: formData.tech_tr_unit,
        tech_gender: formData.tech_gender,
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
      tech_tc: 12,
      tech_tc_unit: "mmol/L",
      tech_hc: 12,
      tech_hc_unit: "mmol/L",
      tech_lc: 5,
      tech_lc_unit: "mg/dL",
      tech_tr: "",
      tech_tr_unit: "mg/dL",
      tech_gender: "female", // female   male
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
    setFormData((prev) => ({ ...prev, tech_tc_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hc_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_lc_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };
  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tr_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  // result code

  const ans1 = result?.tech_ans1;
  const ans2 = result?.tech_ans2;
  const ans3 = result?.tech_ans3;
  const ans4 = result?.tech_ans4;
  const ans5 = result?.tech_ans5;
  const ans6 = result?.tech_ans6;
  const gender = result?.tech_gender;

  const keys = data?.payload?.tech_lang_keys;

  let line1 = "",
    line2 = "",
    line3 = "",
    line4 = "",
    line5 = "",
    line6 = "";

  // Line1 and Line2 based on gender
  if (gender === "male") {
    if (ans1 < 3.4) line1 = keys["21"];
    else if (ans1 <= 4.4) line1 = keys["22"];
    else if (ans1 <= 7.2) line1 = keys["23"];
    else if (ans1 <= 16.5) line1 = keys["24"];
    else if (ans1 > 16.6) line1 = keys["25"];

    if (ans2 > 0 && ans2 < 1.1) line2 = keys["21"];
    else if (ans2 <= 4.9) line2 = keys["23"];
    else if (ans2 <= 7.1) line2 = keys["24"];
    else if (ans2 > 7.2) line2 = keys["25"];
    else if (ans2 < 0) line2 = "";
  } else if (gender === "female") {
    if (ans1 < 3.3) line1 = keys["21"];
    else if (ans1 <= 4.1) line1 = keys["22"];
    else if (ans1 <= 5.7) line1 = keys["23"];
    else if (ans1 <= 9) line1 = keys["24"];
    else if (ans1 > 9.1) line1 = keys["25"];

    if (ans2 > 0 && ans2 < 1.5) line2 = keys["21"];
    else if (ans2 <= 4.1) line2 = keys["23"];
    else if (ans2 <= 5.5) line2 = keys["24"];
    else if (ans2 > 5.6) line2 = keys["25"];
    else if (ans2 < 0) line2 = "";
  }

  // Line3
  if (ans3 > 0 && ans3 < 200) line3 = keys["26"];
  else if (ans3 <= 239) line3 = keys["27"];
  else if (ans3 >= 240) line3 = keys["28"];
  else if (ans3 < 0) line3 = "";

  // Line4
  if (ans4 > 60) line4 = keys["26"];
  else if (ans4 >= 40 && ans4 <= 60) line4 = keys["27"];
  else if (ans4 > 0 && ans4 < 40) line4 = keys["28"];
  else if (ans4 < 0) line4 = "";

  // Line5
  if (ans5 > 0 && ans5 < 100) line5 = keys["26"];
  else if (ans5 <= 129) line5 = keys["29"];
  else if (ans5 <= 159) line5 = keys["27"];
  else if (ans5 <= 189) line5 = keys["28"];
  else if (ans5 >= 190) line5 = keys["30"];
  else if (ans5 < 0) line5 = "";

  // Line6
  if (ans6 > 0 && ans6 < 130) line6 = keys["26"];
  else if (ans6 <= 149) line6 = keys["29"];
  else if (ans6 <= 199) line6 = keys["27"];
  else if (ans6 >= 200) line6 = keys["28"];
  else line6 = "";

  // result code

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
                <p>
                  <strong className="text-blue">
                    {data?.payload?.tech_lang_keys["1"]} :{" "}
                  </strong>
                  <strong>{data?.payload?.tech_lang_keys["2"]}.</strong>
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_tc" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_tc"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_tc}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_tc_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: "milligrams per deciliter (mg/dL)",
                          value: "mg/dL",
                        },
                        {
                          label: "millimoles per liter (mmol/L)",
                          value: "mmol/L",
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_hc" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_hc"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_hc}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_hc_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: "milligrams per deciliter (mg/dL)",
                          value: "mg/dL",
                        },
                        {
                          label: "millimoles per liter (mmol/L)",
                          value: "mmol/L",
                        },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_lc" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_lc"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_lc}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_lc_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: "milligrams per deciliter (mg/dL)",
                          value: "mg/dL",
                        },
                        {
                          label: "millimoles per liter (mmol/L)",
                          value: "mmol/L",
                        },
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
                <label htmlFor="tech_tr" className="label">
                  {data?.payload?.tech_lang_keys["6"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_tr"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_tr}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_tr_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: "milligrams per deciliter (mg/dL)",
                          value: "mg/dL",
                        },
                        {
                          label: "millimoles per liter (mmol/L)",
                          value: "mmol/L",
                        },
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
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
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
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                  </select>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="col s12">
                          <p className="lg:text-[18px] md:text-[18px] text-[16px] my-1">
                            <strong className="text-[#2845F5]">
                              {keys["10"]}:
                            </strong>
                          </p>
                        </div>

                        <p className="col s12 kevin">
                          <span className="text-[#2845F5] me-1">■</span>
                          <strong>{keys["11"]}</strong> ={" "}
                          <strong className="text-[#119154] text-[20px]">
                            {ans1?.toFixed(2)}
                          </strong>{" "}
                          – {keys["12"]} <strong>{line1}</strong> {keys["13"]}.
                        </p>

                        <p className="col s12 kevin mt-2">
                          <span className="text-[#2845F5] me-1">■</span>
                          <strong>{keys["14"]}</strong> ={" "}
                          <strong className="text-[#119154] text-[20px]">
                            {ans2?.toFixed(2)}
                          </strong>{" "}
                          – {keys["12"]} <strong>{line2}</strong> {keys["13"]}.
                        </p>

                        <p className="col s12 kevin mt-2">
                          <span className="text-[#2845F5] me-1">■</span>
                          {keys["15"]} <strong>{keys["3"]}</strong> {keys["16"]}{" "}
                          <strong className="text-[#119154] text-[20px]">
                            {ans3}
                          </strong>{" "}
                          (mg/dl) {keys["17"]} <strong>{line3}</strong>.
                        </p>

                        <p className="col s12 kevin mt-2">
                          <span className="text-[#2845F5] me-1">■</span>
                          {keys["15"]} <strong>{keys["18"]}</strong>{" "}
                          {keys["16"]}{" "}
                          <strong className="text-[#119154] text-[20px]">
                            {ans4}
                          </strong>{" "}
                          (mg/dl) {keys["17"]} <strong>{line4}</strong>.
                        </p>

                        <p className="col s12 kevin mt-2">
                          <span className="text-[#2845F5] me-1">■</span>
                          {keys["15"]} <strong>{keys["19"]}</strong>{" "}
                          {keys["16"]}{" "}
                          <strong className="text-[#119154] text-[20px]">
                            {ans5}
                          </strong>{" "}
                          (mg/dl) {keys["17"]} <strong>{line5}</strong>.
                        </p>

                        <p className="col s12 kevin mt-2">
                          <span className="text-[#2845F5] me-1">■</span>
                          {keys["15"]} <strong>{keys["20"]}</strong>{" "}
                          {keys["16"]}{" "}
                          <strong className="text-[#119154] text-[20px]">
                            {ans6}
                          </strong>{" "}
                          (mg/dl) {keys["17"]} <strong>{line6}</strong>.
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

export default CholesterolRatioCalculator;
