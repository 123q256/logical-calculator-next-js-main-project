"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useKoreanAgeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const KoreanAgeCalculator = () => {
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
    tech_room_unit: "2", // 1 2
    tech_current_year: "2025",
    tech_year: "1998",
    tech_birthday_unit: "2", // 1 2
    tech_age: "20",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useKoreanAgeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_room_unit == 1) {
      if (
        !formData.tech_room_unit ||
        !formData.tech_current_year ||
        !formData.tech_year
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_room_unit ||
        !formData.tech_birthday_unit ||
        !formData.tech_age
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_room_unit: formData.tech_room_unit,
        tech_current_year: formData.tech_current_year,
        tech_year: formData.tech_year,
        tech_birthday_unit: formData.tech_birthday_unit,
        tech_age: formData.tech_age,
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
      tech_room_unit: "2", // 1 2
      tech_current_year: "2025",
      tech_year: "1998",
      tech_birthday_unit: "2", // 1 2
      tech_age: "20",
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

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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

          <div className="lg:w-[70%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-4">
              <div className="col-span-12 relative">
                <label htmlFor="tech_room_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_room_unit"
                    id="tech_room_unit"
                    value={formData.tech_room_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} (%)
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {formData.tech_room_unit == "1" && (
              <>
                <div className="grid grid-cols-12 mt-3  gap-4 ">
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_current_year" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_current_year"
                        id="tech_current_year"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_current_year}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_year" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_year"
                        id="tech_year"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_year}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.tech_room_unit == "2" && (
              <>
                <div className="grid grid-cols-12 mt-3  gap-4" id="current_age">
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_birthday_unit" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_birthday_unit"
                        id="tech_birthday_unit"
                        value={formData.tech_birthday_unit}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["7"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
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
              </>
            )}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className="flex justify-center mt-4">
                        <div className="text-center">
                          <p className="text-lg font-semibold">
                            {data?.payload?.tech_lang_keys["9"]}
                          </p>
                          <p className="text-3xl bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-3">
                            <strong className="text-blue">
                              {result?.tech_korean_age}
                              <span className="text-lg"> Year</span>
                            </strong>
                          </p>
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

export default KoreanAgeCalculator;
