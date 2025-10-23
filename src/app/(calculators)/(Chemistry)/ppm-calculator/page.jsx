"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePpmCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PpmCalculator = () => {
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
    tech_calculator_name: "calculator1", // calculator1  calculator2
    tech_operations: "6",
    tech_first: "4",
    tech_drop1: "1",
    tech_drop2: "1",
    tech_drop3: "30.01",
    tech_second: "30.01",
    tech_drop4: "1",
    tech_third: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePpmCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If tech_drop3 is changed, also update tech_second with selected molar mass
    if (name === "tech_drop3") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        tech_second: value, // auto-populate the input field
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculator_name) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_calculator_name: formData.tech_calculator_name,
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_drop1: formData.tech_drop1,
        tech_drop2: formData.tech_drop2,
        tech_drop3: formData.tech_drop3,
        tech_second: formData.tech_second,
        tech_drop4: formData.tech_drop4,
        tech_third: formData.tech_third,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_calculator_name: "calculator1", // calculator1  calculator2
      tech_operations: "6",
      tech_first: "4",
      tech_drop1: "1",
      tech_drop2: "1",
      tech_drop3: "30.01",
      tech_second: "30.01",
      tech_drop4: "1",
      tech_third: "2",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="w-full col-lg-9 mx-auto mt-5">
              <input
                type="hidden"
                name="tech_calculator_name"
                id="calculator_time"
                value={formData.tech_calculator_name}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_calculator_name === "calculator1"
                        ? "tagsUnit"
                        : ""
                    }`}
                    id="calculator1"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        tech_calculator_name: "calculator1",
                      });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_calculator_name === "calculator2"
                        ? "tagsUnit"
                        : ""
                    }`}
                    id="calculator2"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        tech_calculator_name: "calculator2",
                      });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 mt-5   gap-4">
              {formData.tech_calculator_name == "calculator1" && (
                <>
                  <div className="w-full calculators calculator1">
                    <div className="grid grid-cols-12 gap-1  md:gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <label htmlFor="tech_operations" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_operations"
                            id="tech_operations"
                            value={formData.tech_operations}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["4"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["5"]}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["6"]}
                            </option>
                            <option value="4">PPM</option>
                            <option value="5">PPB</option>
                            <option value="6">PPT</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 tno ">
                        {formData.tech_operations == "1" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "2" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {data?.payload?.tech_lang_keys["5"]}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "3" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              {data?.payload?.tech_lang_keys["6"]}
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "4" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              PPM
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "5" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              PPB
                            </label>
                          </>
                        )}
                        {formData.tech_operations == "6" && (
                          <>
                            <label htmlFor="tech_first" className="label">
                              PPT
                            </label>
                          </>
                        )}

                        <div className=" relative">
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
                          {formData.tech_operations == "1" && (
                            <>
                              <span className="input_unit"></span>
                            </>
                          )}
                          {formData.tech_operations == "2" && (
                            <>
                              <span className="input_unit">%</span>
                            </>
                          )}
                          {formData.tech_operations == "3" && (
                            <>
                              <span className="input_unit">‰</span>
                            </>
                          )}
                          {formData.tech_operations == "4" && (
                            <>
                              <span className="input_unit">ppm</span>
                            </>
                          )}
                          {formData.tech_operations == "5" && (
                            <>
                              <span className="input_unit">ppb</span>
                            </>
                          )}
                          {formData.tech_operations == "6" && (
                            <>
                              <span className="input_unit">ppt</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculator_name == "calculator2" && (
                <>
                  <div className="w-full calculators calculator2 ">
                    <div className="grid grid-cols-12 gap-1  md:gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <label htmlFor="tech_drop1" className="label">
                          {data?.payload?.tech_lang_keys["7"]} (ppm){" "}
                          {data?.payload?.tech_lang_keys["8"]}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_drop1"
                            id="tech_drop1"
                            value={formData.tech_drop1}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["9"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["10"]}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["11"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label htmlFor="tech_drop2" className="label">
                          measured in:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_drop2"
                            id="tech_drop2"
                            value={formData.tech_drop2}
                            onChange={handleChange}
                          >
                            <option value="1">Air</option>
                            <option value="2">Water</option>
                          </select>
                        </div>
                      </div>
                      {(formData.tech_drop1 == "1" ||
                        formData.tech_drop1 == "2") && (
                        <>
                          <div className="col-span-12 md:col-span-6" id="chal1">
                            <label htmlFor="tech_drop3" className="label">
                              {data?.payload?.tech_lang_keys["14"]}
                            </label>
                            <div className="mt-2">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_drop3"
                                id="tech_drop3"
                                value={formData.tech_drop3}
                                onChange={handleChange}
                              >
                                {[
                                  {
                                    name: `[${data?.payload?.tech_lang_keys["13"]}]`,
                                    val: "",
                                  },
                                  { name: "Ammonia [NH3]", val: "17.03" },
                                  { name: "Argon [Ar]", val: "39.95" },
                                  {
                                    name: "Carbon Dioxide [CO2]",
                                    val: "44.01",
                                  },
                                  {
                                    name: "Carbon Monoxide [CO]",
                                    val: "28.01",
                                  },
                                  { name: "Helium [He]", val: "4.00" },
                                  { name: "Hydrogen [H2]", val: "2.02" },
                                  {
                                    name: "Hydrogen Sulfide [H2S]",
                                    val: "34.08",
                                  },
                                  { name: "Krypton [Kr]", val: "83.80" },
                                  { name: "Methane [CH4]", val: "16.04" },
                                  { name: "Neon [Ne]", val: "20.18" },
                                  { name: "Nitric Oxide [NO]", val: "30.01" },
                                  { name: "Nitrogen [N2]", val: "28.01" },
                                  {
                                    name: "Nitrogen Dioxide [NO2]",
                                    val: "46.01",
                                  },
                                  { name: "Nitrous Oxide [N2O]", val: "44.01" },
                                  { name: "Oxygen [O2]", val: "32.00" },
                                  { name: "Ozone [O3]", val: "48.00" },
                                  {
                                    name: "Sulfur Dioxide [SO2]",
                                    val: "64.06",
                                  },
                                  { name: "Water [H2O]", val: "18.02" },
                                  { name: "Xenon [Xe]", val: "131.29" },
                                ].map((item, index) => (
                                  <option key={index} value={item.val}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div
                            className="col-span-12 md:col-span-6 "
                            id="chal2"
                          >
                            <label htmlFor="tech_second" className="label">
                              M:
                            </label>
                            <div className="mt-2 relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_second"
                                id="tech_second"
                                className="input my-"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_second}
                                onChange={handleChange}
                              />
                              <span className="input_unit">g/mol</span>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="col-span-12 md:col-span-6">
                        <label htmlFor="tech_drop4" className="label">
                          {data?.payload?.tech_lang_keys["14"]}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_drop4"
                            id="tech_drop4"
                            value={formData.tech_drop4}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["15"]} ppm
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["15"]} mg/m3
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        {formData.tech_drop4 == "1" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {" "}
                              Xppm:{" "}
                            </label>
                          </>
                        )}
                        {formData.tech_drop4 == "2" && (
                          <>
                            <label htmlFor="tech_third" className="label">
                              {" "}
                              Xmg/m3:{" "}
                            </label>
                          </>
                        )}
                        <div className="mt-2 relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_third"
                            id="tech_third"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_third}
                            onChange={handleChange}
                          />
                          {formData.tech_drop4 == "1" && (
                            <>
                              <span className="input_unit">ppm</span>
                            </>
                          )}
                          {formData.tech_drop4 == "2" && (
                            <>
                              <span className="input_unit">mg/m3</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_type == "calculator1" ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-5   gap-1">
                              <div className=" py-1">
                                <div className="bg-sky p-3 bordered rounded-lg px-3 ">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[4]} =
                                  </strong>
                                  <strong className="text-[#119154] text-[22px]">
                                    {" "}
                                    {result?.tech_answer1}
                                  </strong>
                                </div>
                              </div>
                              <div className=" py-1">
                                <div className="bg-sky p-3 bordered rounded-lg px-3 ">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[5]} =
                                  </strong>
                                  <strong className="text-[#119154] text-[22px]">
                                    {" "}
                                    {result?.tech_answer2}{" "}
                                    <span className="text-green">(%)</span>
                                  </strong>
                                </div>
                              </div>
                              <div className=" py-1">
                                <div className="bg-sky p-3 bordered rounded-lg px-3 ">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[6]} =
                                  </strong>
                                  <strong className="text-[#119154] text-[22px]">
                                    {" "}
                                    {result?.tech_answer3}{" "}
                                    <span className="text-green">(‰)</span>
                                  </strong>
                                </div>
                              </div>
                              <div className=" py-1">
                                <div className="bg-sky p-3 bordered rounded-lg px-3 ">
                                  <strong>PPM =</strong>
                                  <strong className="text-[#119154] text-[22px]">
                                    {" "}
                                    {result?.tech_answer4}{" "}
                                    <span className="text-green">(PPM)</span>
                                  </strong>
                                </div>
                              </div>
                              <div className=" py-1">
                                <div className="bg-sky p-3 bordered rounded-lg px-3 ">
                                  <strong>PPB =</strong>
                                  <strong className="text-[#119154] text-[22px]">
                                    {" "}
                                    {result?.tech_answer5}{" "}
                                    <span className="text-green">(PPB)</span>
                                  </strong>
                                </div>
                              </div>
                              <div className=" py-1">
                                <div className="bg-sky p-3 bordered rounded-lg px-3 ">
                                  <strong>PPT =</strong>
                                  <strong className="text-[#119154] text-[22px]">
                                    {" "}
                                    {result?.tech_answer6}{" "}
                                    <span className="text-green">(PPT)</span>
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : result?.tech_type == "calculator2" ? (
                          <>
                            <p className="text-center text-[14px] md:text-[20px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[16]}
                              </strong>
                            </p>
                            {formData?.tech_drop4 == 1 ? (
                              <>
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className=" text-[20px] md:text-[32px]">
                                      {result?.tech_jawab2}{" "}
                                      <span className="">mg/m3</span>
                                    </strong>
                                  </p>
                                </div>
                              </>
                            ) : formData?.tech_drop4 == 2 ? (
                              <>
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className=" text-[20px] md:text-[32px]">
                                      {result?.tech_jawab2} <span>ppm</span>
                                    </strong>
                                  </p>
                                </div>
                              </>
                            ) : null}
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

export default PpmCalculator;
