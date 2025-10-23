"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBiologicalAgeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BiologicalAgeCalculator = () => {
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
    tech_m1: "m",
    tech_m2: "other",
    tech_m3: "00",
    tech_m5: "00",
    tech_m6: "00",
    tech_m7: "00",
    tech_m8: "00",
    tech_m11: "00",
    tech_m12: "00",
    tech_m13: "00",
    tech_m14: "00",
    tech_m16: "00",
    tech_m17: "00",
    tech_m18: "00",
    tech_m19: "00",
    tech_m20: "00",
    tech_m21: "00",
    tech_m22: "00",
    tech_m23: "00",
    tech_m24: "00",
    tech_m27: "00",
    tech_m28: "00",
    tech_m30: "00",
    tech_m31: "00",
    tech_m34: "00",
    tech_m35: "00",
    tech_m36: "00",
    age: null,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBiologicalAgeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_m1 || !formData.tech_m2) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_m1: formData.tech_m1,
        tech_m2: formData.tech_m2,
        tech_m3: formData.tech_m3,
        tech_m5: formData.tech_m5,
        tech_m6: formData.tech_m6,
        tech_m7: formData.tech_m7,
        tech_m8: formData.tech_m8,
        tech_m11: formData.tech_m11,
        tech_m12: formData.tech_m12,
        tech_m13: formData.tech_m13,
        tech_m14: formData.tech_m14,
        tech_m16: formData.tech_m16,
        tech_m17: formData.tech_m17,
        tech_m18: formData.tech_m18,
        tech_m19: formData.tech_m19,
        tech_m20: formData.tech_m20,
        tech_m21: formData.tech_m21,
        tech_m22: formData.tech_m22,
        tech_m23: formData.tech_m23,
        tech_m24: formData.tech_m24,
        tech_m27: formData.tech_m27,
        tech_m28: formData.tech_m28,
        tech_m30: formData.tech_m30,
        tech_m31: formData.tech_m31,
        tech_m34: formData.tech_m34,
        tech_m35: formData.tech_m35,
        tech_m36: formData.tech_m36,
        age: formData.age,
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
      tech_m1: "m",
      tech_m2: "other",
      tech_m3: "00",
      tech_m5: "00",
      tech_m6: "00",
      tech_m7: "00",
      tech_m8: "00",
      tech_m11: "00",
      tech_m12: "00",
      tech_m13: "00",
      tech_m14: "00",
      tech_m16: "00",
      tech_m17: "00",
      tech_m18: "00",
      tech_m19: "00",
      tech_m20: "00",
      tech_m21: "00",
      tech_m22: "00",
      tech_m23: "00",
      tech_m24: "00",
      tech_m27: "00",
      tech_m28: "00",
      tech_m30: "00",
      tech_m31: "00",
      tech_m34: "00",
      tech_m35: "00",
      tech_m36: "00",
      age: null,
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 ">
                <strong className="text-[#2845F5]">
                  {data?.payload?.tech_lang_keys["4"]}
                </strong>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m1" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m1"
                    id="tech_m1"
                    value={formData.tech_m1}
                    onChange={handleChange}
                  >
                    <option value="m">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="male">----------</option>
                    <option value="female">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="male">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m2" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m2"
                    id="tech_m2"
                    value={formData.tech_m2}
                    onChange={handleChange}
                  >
                    <option value="other">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="other">----------</option>
                    <option value="white">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="black">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="hipansic">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="asian">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="amindian">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="other">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m3" className="label">
                  {data?.payload?.tech_lang_keys["18"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m3"
                    id="tech_m3"
                    value={formData.tech_m3}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="0">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["17"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m5" className="label">
                  {data?.payload?.tech_lang_keys["24"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m5"
                    id="tech_m5"
                    value={formData.tech_m5}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      7-8 {data?.payload?.tech_lang_keys["25"]}
                    </option>
                    <option value="0">
                      8-9 {data?.payload?.tech_lang_keys["25"]}
                    </option>
                    <option value="0">
                      6-7 {data?.payload?.tech_lang_keys["25"]}
                    </option>
                    <option value="-1">
                      {data?.payload?.tech_lang_keys["26"]}
                    </option>
                    <option value="-2">
                      {data?.payload?.tech_lang_keys["27"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12  ">
                <strong className="text-[#2845F5]">
                  {data?.payload?.tech_lang_keys["28"]}
                </strong>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m6" className="label">
                  {data?.payload?.tech_lang_keys["29"]} (HDL):
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m6"
                    id="tech_m6"
                    value={formData.tech_m6}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["30"]} 160 (&lt; 3)
                    </option>
                    <option value="0">160-200 (3-4)</option>
                    <option value="0">200-240 (4-5)</option>
                    <option value="-1">240-280 (5-6)</option>
                    <option value="-2">
                      {data?.payload?.tech_lang_keys["31"]} 280 (&gt; 6)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m7" className="label">
                  {data?.payload?.tech_lang_keys["32"]} (
                  {data?.payload?.tech_lang_keys["33"]} /{" "}
                  {data?.payload?.tech_lang_keys["34"]}):
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m7"
                    id="tech_m7"
                    value={formData.tech_m7}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="2">
                      {" "}
                      {data?.payload?.tech_lang_keys["30"]}{" "}
                    </option>
                    <option value="1">160-200 (3-4)</option>
                    <option value="-1">200-240 (4-5)</option>
                    <option value="-2"> 240-280 (5-6)</option>
                    <option value="-4">
                      {data?.payload?.tech_lang_keys["31"]} 280 (&gt; 6)
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m8" className="label">
                  {data?.payload?.tech_lang_keys["35"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m8"
                    id="tech_m8"
                    value={formData.tech_m8}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["36"]}{" "}
                    </option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["37"]} 10 years{" "}
                      {data?.payload?.tech_lang_keys["38"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["39"]} 10 years ago{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["40"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["41"]}{" "}
                    </option>
                    <option value="-3">
                      1 {data?.payload?.tech_lang_keys["42"]}{" "}
                    </option>
                    <option value="-5">
                      {" "}
                      2{data?.payload?.tech_lang_keys["43"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m11" className="label">
                  {data?.payload?.tech_lang_keys["84"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m11"
                    id="tech_m11"
                    value={formData.tech_m11}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["85"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["86"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["87"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["88"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["89"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 ">
                <label htmlFor="tech_m12" className="label">
                  {data?.payload?.tech_lang_keys["90"]} (
                  {data?.payload?.tech_lang_keys["91"]},
                  {data?.payload?.tech_lang_keys["92"]},
                  {data?.payload?.tech_lang_keys["93"]}):
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m12"
                    id="tech_m12"
                    value={formData.tech_m12}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="2">
                      {" "}
                      60 minutes {data?.payload?.tech_lang_keys["94"]}{" "}
                    </option>
                    <option value="1">
                      30 minutes {data?.payload?.tech_lang_keys["95"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      20-30 minutes {
                        data?.payload?.tech_lang_keys["96"]
                      } 3-5 {data?.payload?.tech_lang_keys["97"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      10-20 minutes {
                        data?.payload?.tech_lang_keys["98"]
                      } 1-2 {data?.payload?.tech_lang_keys["97"]}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["99"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12  ">
                <strong className="text-[#2845F5]">
                  {data?.payload?.tech_lang_keys["100"]}
                </strong>
              </div>
              <div className="col-span-12 ">
                <label htmlFor="tech_m13" className="label">
                  {data?.payload?.tech_lang_keys["101"]} (
                  {data?.payload?.tech_lang_keys["102"]},
                  {data?.payload?.tech_lang_keys["103"]},
                  {data?.payload?.tech_lang_keys["104"]}):
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m13"
                    id="tech_m13"
                    value={formData.tech_m13}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["105"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["106"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["107"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["108"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m14" className="label">
                  {data?.payload?.tech_lang_keys["109"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m14"
                    id="tech_m14"
                    value={formData.tech_m14}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["110"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["111"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["112"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["113"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["114"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m16" className="label">
                  {data?.payload?.tech_lang_keys["122"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m16"
                    id="tech_m16"
                    value={formData.tech_m16}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["123"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["124"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["125"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["126"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["127"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m17" className="label">
                  {data?.payload?.tech_lang_keys["128"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m17"
                    id="tech_m17"
                    value={formData.tech_m17}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["129"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["130"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["131"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["132"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["133"]}{" "}
                    </option>
                    <option value="-4">
                      {" "}
                      {data?.payload?.tech_lang_keys["134"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m18" className="label">
                  {data?.payload?.tech_lang_keys["135"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m18"
                    id="tech_m18"
                    value={formData.tech_m18}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["136"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["137"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["138"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["139"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["140"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 ">
                <strong className="text-[#2845F5]">
                  {data?.payload?.tech_lang_keys["141"]} (
                  {data?.payload?.tech_lang_keys["142"]})
                </strong>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m19" className="label">
                  {data?.payload?.tech_lang_keys["143"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m19"
                    id="tech_m19"
                    value={formData.tech_m19}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["144"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["145"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["146"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["147"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["148"]}{" "}
                    </option>
                    <option value="-4">
                      {" "}
                      {data?.payload?.tech_lang_keys["149"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m20" className="label">
                  {data?.payload?.tech_lang_keys["150"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m20"
                    id="tech_m20"
                    value={formData.tech_m20}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["144"]}
                    </option>
                    <option value="00">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["151"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["152"]} 5 years ago{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["153"]} 30 years old{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["154"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["155"]} 35 years old{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 ">
                <strong className="text-[#2845F5]">
                  {data?.payload?.tech_lang_keys["156"]}
                </strong>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m21" className="label">
                  {data?.payload?.tech_lang_keys["157"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m21"
                    id="tech_m21"
                    value={formData.tech_m21}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["158"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["159"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["160"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["161"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["162"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m22" className="label">
                  {data?.payload?.tech_lang_keys["163"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m22"
                    id="tech_m22"
                    value={formData.tech_m22}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      3 {data?.payload?.tech_lang_keys["164"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      2 {data?.payload?.tech_lang_keys["165"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["166"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["167"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m23" className="label">
                  {data?.payload?.tech_lang_keys["174"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m23"
                    id="tech_m23"
                    value={formData.tech_m23}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      5 {data?.payload?.tech_lang_keys["175"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      From 2 - 4 {data?.payload?.tech_lang_keys["176"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["159"]} 1{" "}
                      {data?.payload?.tech_lang_keys["177"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["178"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m24" className="label">
                  {data?.payload?.tech_lang_keys["179"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m24"
                    id="tech_m24"
                    value={formData.tech_m24}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["180"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["181"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["182"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["183"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["184"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["185"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 ">
                <strong className="text-[#2845F5]">
                  {data?.payload?.tech_lang_keys["198"]}
                </strong>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m27" className="label">
                  {data?.payload?.tech_lang_keys["199"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m27"
                    id="tech_m27"
                    value={formData.tech_m27}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["200"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["201"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["202"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["203"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["204"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m28" className="label">
                  {data?.payload?.tech_lang_keys["211"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m28"
                    id="tech_m28"
                    value={formData.tech_m28}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["212"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["213"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["214"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["215"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["216"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m30" className="label">
                  {data?.payload?.tech_lang_keys["205"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m30"
                    id="tech_m30"
                    value={formData.tech_m30}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["206"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["207"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["208"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["209"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["210"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m31" className="label">
                  {data?.payload?.tech_lang_keys["168"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m31"
                    id="tech_m31"
                    value={formData.tech_m31}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="2">
                      {" "}
                      {data?.payload?.tech_lang_keys["169"]}{" "}
                    </option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["170"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["171"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["172"]}{" "}
                    </option>
                    <option value="-3">
                      {" "}
                      {data?.payload?.tech_lang_keys["173"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 ">
                <strong className="text-[#2845F5]">
                  {data?.payload?.tech_lang_keys["55"]}
                </strong>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m34" className="label">
                  {data?.payload?.tech_lang_keys["56"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m34"
                    id="tech_m34"
                    value={formData.tech_m34}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["57"]} 11.000km/year
                    </option>
                    <option value="0"> 11.000-24.000km/year </option>
                    <option value="-1"> 24.000-32.000km/year </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["58"]} 32.000 km/year{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_m35" className="label">
                  {data?.payload?.tech_lang_keys["51"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m35"
                    id="tech_m35"
                    value={formData.tech_m35}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["52"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["54"]} 75%{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["53"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["41"]} (25%)
                    </option>
                    <option value="-4">
                      {" "}
                      {data?.payload?.tech_lang_keys["46"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 ">
                <label htmlFor="tech_m36" className="label">
                  {data?.payload?.tech_lang_keys["45"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_m36"
                    id="tech_m36"
                    value={formData.tech_m36}
                    onChange={handleChange}
                  >
                    <option value="00">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="0">----------</option>
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["46"]}{" "}
                    </option>
                    <option value="0">
                      {" "}
                      {data?.payload?.tech_lang_keys["47"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["48"]}{" "}
                    </option>
                    <option value="-1">
                      {" "}
                      {data?.payload?.tech_lang_keys["49"]}{" "}
                    </option>
                    <option value="-2">
                      {" "}
                      {data?.payload?.tech_lang_keys["50"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["44"]}:
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[80%] lg:w-[80%]">
                        <div className="flex flex-wrap justify-between">
                          <div>
                            <p>{data?.payload?.tech_lang_keys["223"]}</p>
                            <p className="text-[28px]">
                              <strong className="text-[#119154]">
                                {result?.tech_typ}
                              </strong>
                            </p>
                          </div>
                          <div className="lg:border-r-2 md:border-r-2">
                            &nbsp;
                          </div>
                          <div>
                            <p>{data?.payload?.tech_lang_keys["224"]}</p>
                            <p className="text-[28px]">
                              <strong className="text-[#119154]">
                                {result?.tech_exp}
                              </strong>
                            </p>
                          </div>
                          <div className="lg:border-r-2 md:border-r-2">
                            &nbsp;
                          </div>
                          <div>
                            <p>{data?.payload?.tech_lang_keys["225"]}</p>
                            <p className="text-[28px]">
                              <strong className="text-[#119154]">
                                {result?.tech_bio}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <p className="text-[18px] mt-3">
                          <strong className="text-[#2845F5]">
                            {data?.payload?.tech_lang_keys["233"]} (Years)
                          </strong>
                        </p>
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto">
                          <table className="w-full" cellSpacing="0">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["226"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_per}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["227"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_med}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["228"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_cad}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["229"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_nut}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["230"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_psychT}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["231"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_saf}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["232"]} =
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_tot}</strong>
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

export default BiologicalAgeCalculator;
