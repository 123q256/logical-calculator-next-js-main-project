"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHowManyPagesCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HowManyPagesCalculator = () => {
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
    tech_main: "2", // 1 2
    tech_page: "12",
    tech_size: "12",
    tech_font: "Arial",
    tech_space: "1.5",
    tech_page2: "",
    tech_title: "Quran",
    tech_lang: "English",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHowManyPagesCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_main) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_main: formData.tech_main,
        tech_page: formData.tech_page,
        tech_size: formData.tech_size,
        tech_font: formData.tech_font,
        tech_space: formData.tech_space,
        tech_page2: formData.tech_page2,
        tech_title: formData.tech_title,
        tech_lang: formData.tech_lang,
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
      tech_main: "2", // 1 2
      tech_page: "12",
      tech_size: "12",
      tech_font: "Arial",
      tech_space: "1.5",
      tech_page2: "",
      tech_title: "Quran",
      tech_lang: "English",
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="row grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="w-full flex justify-between text-[14px] pace_border relative">
                  <strong className="col-lg-3 pe- font-s-14">
                    {data?.payload?.tech_lang_keys["to_cal"] ?? "To Calculate"}{" "}
                    :
                  </strong>
                  <p
                    id="pace_tab"
                    className={` px-3  cursor-pointer  ${
                      formData.tech_main === "1" ? "pace_tab active" : ""
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, tech_main: "1" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    <strong>{data?.payload?.tech_lang_keys["1"]}</strong>
                  </p>

                  <p
                    id="time_tab"
                    className={`  ${
                      formData.tech_main === "2"
                        ? "pace_tab cursor-pointer active"
                        : ""
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, tech_main: "2" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    <strong>{data?.payload?.tech_lang_keys["2"]}</strong>
                  </p>

                  <p
                    id="distance_tab"
                    className={`  ${
                      formData.tech_main === "4" ? "pace_tab active" : ""
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, tech_main: "4" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    <strong>{data?.payload?.tech_lang_keys["3"]}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className=" grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4"></div>
            <div className="col-span-12">
              {formData.tech_main === "1" && (
                <>
                  <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                    <div className="col-span-6">
                      <label htmlFor="tech_page" className="label">
                        {data?.payload?.tech_lang_keys["5"] ?? "Words"}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_page"
                          id="tech_page"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_page}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_size" className="label">
                        {data?.payload?.tech_lang_keys["6"] ?? "Size"}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_size"
                          id="tech_size"
                          value={formData.tech_size}
                          onChange={handleChange}
                        >
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                          <option value="13">13</option>
                          <option value="14">14</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_font" className="label">
                        {data?.payload?.tech_lang_keys["7"] ?? "Font"}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_font"
                          id="tech_font"
                          value={formData.tech_font}
                          onChange={handleChange}
                        >
                          <option value="Times">Times New Roman</option>
                          <option value="Calibri">Calibri</option>
                          <option value="Courier">Courier</option>
                          <option value="Garamond">Garamond</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Century Gothic">Century Gothic</option>
                          <option value="Candara">Candara</option>
                          <option value="Cambria">Cambria</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_space" className="label">
                        {data?.payload?.tech_lang_keys["8"] ?? "Spacing"}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_space"
                          id="tech_space"
                          value={formData.tech_space}
                          onChange={handleChange}
                        >
                          <option value="single">Single</option>
                          <option value="1.5">1.5</option>
                          <option value="double">Double</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_main === "2" && (
                <>
                  <div className="grid grid-cols-12 mt-3  gap-2 ">
                    <div className="col-span-3 hidden md:flex"></div>
                    <div className="lg:col-span-6 md:col-span-6 col-span-12">
                      <label htmlFor="tech_title" className="label">
                        {data?.payload?.tech_lang_keys["11"] ?? "Title"}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_title"
                          id="tech_title"
                          value={formData.tech_title}
                          onChange={handleChange}
                        >
                          <option value="Empty">Empty</option>
                          <option value="Quran">Quran</option>
                          <option value="Bible">The Bible (KJV)</option>
                          <option value="Gatsby">The Great Gatsby</option>
                          <option value="Harry">Harry Potter (Series)</option>
                          <option value="Av_noval">Average Novel</option>
                          <option value="Hobbit">The Hobbit</option>
                          <option value="Rings">The Lord of the Rings</option>
                          <option value="Peace">War and Peace</option>
                          <option value="Pride">Pride and Prejudice</option>
                          <option value="Rich">Rich Dad Poor Dad</option>
                          <option value="Great_Ex">Great Expectations</option>
                          <option value="Shakespearean">
                            Shakespearean Tragedy Play
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-3 hidden md:flex"></div>
                    <span className="col-span-12 text-center">
                      ----------- OR -----------
                    </span>
                    <div className="col-span-3 hidden md:flex"></div>
                    <div className="lg:col-span-6 md:col-span-6 col-span-12">
                      <label htmlFor="tech_page2" className="label">
                        {data?.payload?.tech_lang_keys["5"] ?? "Words"}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_page2"
                          id="tech_page2"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_page2}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-3 hidden md:flex"></div>
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
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full text-[18px]">
                          <div className="text-center">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["ans_key"] ??
                                  "Pages Count"}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_counter}
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

export default HowManyPagesCalculator;
