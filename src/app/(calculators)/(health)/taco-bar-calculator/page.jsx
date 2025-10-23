"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTacoBarCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TacoBarCalculator = () => {
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

  console.log(data);

  const [formData, setFormData] = useState({
    tech_first: "50",
    tech_second: "155.92",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTacoBarCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_first || !formData.tech_second) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
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
      tech_first: "50",
      tech_second: "155.92",
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

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <input
                  type="number"
                  step="any"
                  name="tech_first"
                  id="tech_first"
                  className="input my-2"
                  aria-label="input"
                  placeholder="00"
                  value={formData.tech_first}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_second"
                    id="tech_second"
                    value={formData.tech_second}
                    onChange={handleChange}
                  >
                    <option value="184.27">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="155.92">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="41.75">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="184.27">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="198.45">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full border-b pb-4">
                        <div className="w-full md:w-[80%] lg:w-[80%]">
                          <p>
                            <strong className="text-blue-500 mb-1">
                              {data?.payload?.tech_lang_keys[25]}
                            </strong>
                          </p>
                          <div className="flex flex-wrap justify-between">
                            <div className="px-3">
                              <p>{data?.payload?.tech_lang_keys[8]}</p>
                              <p>
                                <strong className="text-[28px] text-[#119154]">
                                  {Number(result?.tech_meat_mass).toFixed(2)}
                                </strong>
                                <strong className="text-blue font-s-20">
                                  g
                                </strong>
                              </p>
                            </div>
                            <div className="border-r hidden md:block lg:block">
                              &nbsp;
                            </div>
                            <div className="px-3">
                              <p>{data?.payload?.tech_lang_keys[9]}</p>
                              <p>
                                <strong className="text-[28px] text-[#119154]">
                                  {Number(result?.tech_cheddar_cheese).toFixed(
                                    2
                                  )}
                                </strong>
                                <strong className="text-blue font-s-20">
                                  g
                                </strong>
                              </p>
                            </div>
                            <div className="border-r hidden md:block lg:block">
                              &nbsp;
                            </div>
                            <div className="px-3">
                              <p>{data?.payload?.tech_lang_keys[10]}</p>
                              <p>
                                <strong className="text-[28px] text-[#119154]">
                                  {Number(result?.tech_monterey_cheese).toFixed(
                                    2
                                  )}
                                </strong>
                                <strong className="text-blue font-s-20">
                                  g
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full border-b pb-4 mt-4">
                        <p className="my-2">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys[26]}
                          </strong>
                        </p>
                        <div className="flex flex-wrap justify-between">
                          <div className="px-3">
                            <p>{data?.payload?.tech_lang_keys[11]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_sour_cream).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>
                          <div className="px-3">
                            <p>{data?.payload?.tech_lang_keys[12]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_guacamole).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>
                          <div className="px-3">
                            <p>{data?.payload?.tech_lang_keys[13]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_taco_sauce).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>
                          <div className="px-3">
                            <p>{data?.payload?.tech_lang_keys[14]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_pico_de_gallo).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full border-b pb-4 mt-4">
                        <p className="my-2">
                          <strong className="text-blue">
                            {data?.payload?.tech_lang_keys[27]}
                          </strong>
                        </p>
                        <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-6 md:col-span-3 lg:col-span-3 lg:border-r md:border-r">
                            <p>{data?.payload?.tech_lang_keys[15]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_lettuce).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-3 lg:col-span-3 lg:border-r md:border-r">
                            <p>{data?.payload?.tech_lang_keys[16]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_onions).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-3 lg:col-span-3 lg:border-r md:border-r">
                            <p>{data?.payload?.tech_lang_keys[17]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_beans).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-3 lg:col-span-3">
                            <p>{data?.payload?.tech_lang_keys[18]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_refried_beans).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-12 mt-[20px] gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-6 md:col-span-3 lg:col-span-3 lg:border-r md:border-r">
                            <p>{data?.payload?.tech_lang_keys[19]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_tomatoes).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-3 lg:col-span-3 lg:border-r md:border-r">
                            <p>{data?.payload?.tech_lang_keys[20]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_olives).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                          <div className="col-span-6 md:col-span-3 lg:col-span-3">
                            <p>{data?.payload?.tech_lang_keys[21]}</p>
                            <p className="col s12 white padding_10 center bdr-rad-7">
                              <strong className="text-[28px] text-[#119154]">
                                {Number(result?.tech_bell_pepper).toFixed(2)}
                              </strong>
                              <strong className="text-blue font-s-20">g</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full border-b pb-4 mt-4">
                        <div className="w-full md:w-[80%] lg:w-[80%]">
                          <p className="my-2">
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys[28]}
                            </strong>
                          </p>
                          <div className="flex flex-wrap justify-between">
                            <div className="px-3">
                              <p>{data?.payload?.tech_lang_keys[22]}</p>
                              <p className="col s12 white padding_10 center bdr-rad-7">
                                <strong className="text-[28px] text-[#119154]">
                                  {Number(result?.tech_taco_shells).toFixed(2)}
                                </strong>
                                <strong className="text-blue font-s-20">
                                  #
                                </strong>
                              </p>
                            </div>
                            <div className="border-r hidden md:block lg:block">
                              &nbsp;
                            </div>
                            <div className="px-3">
                              <p>{data?.payload?.tech_lang_keys[23]}</p>
                              <p className="col s12 white padding_10 center bdr-rad-7">
                                <strong className="text-[28px] text-[#119154]">
                                  {Number(result?.tech_tortillas).toFixed(2)}
                                </strong>
                                <strong className="text-blue font-s-20">
                                  #
                                </strong>
                              </p>
                            </div>
                            <div className="border-r hidden md:block lg:block">
                              &nbsp;
                            </div>
                            <div className="px-3">
                              <p>{data?.payload?.tech_lang_keys[24]}</p>
                              <p className="col s12 white padding_10 center bdr-rad-7">
                                <strong className="text-[28px] text-[#119154]">
                                  {Number(result?.tech_rice).toFixed(2)}
                                </strong>
                                <strong className="text-blue font-s-20">
                                  g
                                </strong>
                              </p>
                            </div>
                          </div>
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

export default TacoBarCalculator;
