"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTuroCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TuroCalculator = () => {
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
    tech_type: "first", //  second  first
    tech_f_first: 1500,
    tech_f_second: 1500,
    tech_f_third: 1500,

    tech_operations: "3",
    tech_first: 12,
    tech_second: 12,
    tech_third: 12,
    tech_four: 12,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTuroCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_type == "first") {
      if (
        !formData.tech_type ||
        !formData.tech_f_first ||
        !formData.tech_f_second ||
        !formData.tech_f_third
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (formData.tech_type == "1") {
        if (
          !formData.tech_type ||
          !formData.tech_first ||
          !formData.tech_second
        ) {
          setFormError("Please fill in field");
          return;
        }
      } else if (formData.tech_type == "2") {
        if (
          !formData.tech_type ||
          !formData.tech_first ||
          !formData.tech_second ||
          !formData.tech_third
        ) {
          setFormError("Please fill in field");
          return;
        }
      } else {
        if (
          !formData.tech_type ||
          !formData.tech_first ||
          !formData.tech_second ||
          !formData.tech_third ||
          !formData.tech_four
        ) {
          setFormError("Please fill in field");
          return;
        }
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
        tech_four: formData.tech_four,
        tech_f_first: formData.tech_f_first,
        tech_f_second: formData.tech_f_second,
        tech_f_third: formData.tech_f_third,
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
      tech_type: "first", //  second  first
      tech_operations: "3",
      tech_first: 12,
      tech_second: 12,
      tech_third: 12,
      tech_four: 12,
      tech_f_first: 1500,
      tech_f_second: 1500,
      tech_f_third: 1500,
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
          path: "/category/Finance",
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
            <div className="grid grid-cols-1  gap-4 my-3">
              <div className="">
                <p className="font-s-16 text-blue">Calculate: </p>
                <label className="pe-2" htmlFor="first">
                  <input
                    type="radio"
                    name="tech_type"
                    value="first"
                    id="first"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_type === "first"}
                  />
                  <span>{data?.payload?.tech_lang_keys["12"]}</span>
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
                  />
                  <span>{data?.payload?.tech_lang_keys["13"]}</span>
                </label>
              </div>
            </div>

            {formData.tech_type === "second" && (
              <div className="grid grid-cols-1  gap-4 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-3">
                  <div className="space-y-2">
                    <label htmlFor="tech_operations" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations"
                        id="tech_operations"
                        value={formData.tech_operations}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>

                  {formData.tech_operations == "3" && (
                    <>
                      <div className="space-y-2 " id="i1">
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_first"
                            id="tech_first"
                            className="input "
                            aria-label="input"
                            value={formData.tech_first}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {currency.symbol}/day
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 " id="i2">
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_second"
                            id="tech_second"
                            className="input"
                            aria-label="input"
                            value={formData.tech_second}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {currency.symbol}/month
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 " id="i3">
                        <label htmlFor="tech_third" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_third"
                            id="tech_third"
                            className="input "
                            aria-label="input"
                            value={formData.tech_third}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {currency.symbol}/month
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 " id="i4">
                        <label htmlFor="tech_four" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_four"
                            id="tech_four"
                            className="input"
                            aria-label="input"
                            value={formData.tech_four}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {currency.symbol}/month
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_operations == "2" && (
                    <>
                      <div className="space-y-2 " id="i1">
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["14"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_first"
                            id="tech_first"
                            className="input "
                            aria-label="input"
                            value={formData.tech_first}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 " id="i2">
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["15"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_second"
                            id="tech_second"
                            className="input"
                            aria-label="input"
                            value={formData.tech_second}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {currency.symbol}/month
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 " id="i3">
                        <label htmlFor="tech_third" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_third"
                            id="tech_third"
                            className="input "
                            aria-label="input"
                            value={formData.tech_third}
                            onChange={handleChange}
                          />
                          <span className="input_unit">#months</span>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_operations == "1" && (
                    <>
                      <div className="space-y-2 " id="i1">
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_first"
                            id="tech_first"
                            className="input "
                            aria-label="input"
                            value={formData.tech_first}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {currency.symbol}/day
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 " id="i2">
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_second"
                            id="tech_second"
                            className="input"
                            aria-label="input"
                            value={formData.tech_second}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            {currency.symbol}/month
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {formData.tech_type === "first" && (
              <div className="grid grid-cols-1  gap-4 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2  gap-2 mt-3">
                  <div className="space-y-2 ">
                    <label htmlFor="tech_f_first" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_f_first"
                        id="tech_f_first"
                        className="input my-2"
                        aria-label="input"
                        placeholder="1500"
                        value={formData.tech_f_first}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        {currency.symbol}/month
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 ">
                    <label htmlFor="tech_f_second" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_f_second"
                        id="tech_f_second"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_f_second}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}/day</span>
                    </div>
                  </div>
                  <div className="space-y-2 ">
                    <label htmlFor="tech_f_third" className="label">
                      {data?.payload?.tech_lang_keys["11"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_f_third"
                        id="tech_f_third"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_f_third}
                        onChange={handleChange}
                      />
                      <span className="input_unit">days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className="w-full text-center text-xl">
                        <p>{result?.tech_heading}</p>
                        <p className="my-3" id="jawab">
                          <strong className="bg-[#2845F5] px-3 py-2 lg:text-2xl rounded-lg text-white">
                            {result?.tech_answer} {currency.symbol}/month
                          </strong>
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

export default TuroCalculator;
