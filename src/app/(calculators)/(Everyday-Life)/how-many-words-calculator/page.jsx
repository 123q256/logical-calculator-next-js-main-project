"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHowManyWordsCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HowManyWordsCalculator = () => {
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

  // Wrap handleFetchDetails in useCallback to prevent unnecessary recreations
  const handleFetchDetails = useCallback(async () => {
    try {
      // Call the mutation with the `tech_calculator_link`
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  }, [getSingleCalculatorDetails, url]); // Add dependencies

  useEffect(() => {
    handleFetchDetails();
  }, [handleFetchDetails]); // Now include handleFetchDetails in the dependency array

  const [formData, setFormData] = useState({
    tech_main: "1", // 1 2 3 4
    tech_page: "12",
    tech_size: "12",
    tech_font: "Arial",
    tech_space: "1.5",
    tech_page2: "",
    tech_title: "Quran",
    tech_sp_title: "Perfect",
    tech_lang: "English",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHowManyWordsCalculatorMutation();

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
        tech_sp_title: formData.tech_sp_title,
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
      tech_main: "1", // 1 2 3 4
      tech_page: "12",
      tech_size: "12",
      tech_font: "Arial",
      tech_space: "1.5",
      tech_page2: "",
      tech_title: "Quran",
      tech_sp_title: "Perfect",
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
          path: pathname, // Use pathname instead of location.pathname
        },
      ]}
    >
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg3 space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg-w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="row grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="w-full flex justify-between lg:text-[14px] md:text-[14px] text-[11px] pace_border relative">
                  <strong className="col-lg-3 pe- font-s-14">
                    {data?.payload?.tech_lang_keys["to_cal"] ?? "To Calculate"}{" "}
                    :
                  </strong>
                  <p
                    id="pace_tab"
                    className={` px-3 cursor-pointer ${
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
                    className={` cursor-pointer ${
                      formData.tech_main === "2" ? "pace_tab active" : ""
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
                    className={` cursor-pointer ${
                      formData.tech_main === "3" ? "pace_tab active" : ""
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, tech_main: "3" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    <strong>{data?.payload?.tech_lang_keys["3"]}</strong>
                  </p>
                  <p
                    id="distance_tab"
                    className={` cursor-pointer ${
                      formData.tech_main === "4" ? "pace_tab active" : ""
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, tech_main: "4" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg-w-[60%] md:w-[60%] w-full mx-auto ">
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
                    {/* <div className="col-span-6">
                              <label htmlFor="tech_custom_font" className="label">
                                {data?.payload?.tech_lang_keys["cus"] ?? "Add Your Own Font"}:
                                  </label>
                                  <div className=" relative">
                                  <input
                                    type="text"
                                    step="any"
                                    name="tech_custom_font"
                                    id="tech_custom_font"
                                    className="input my-2"
                                    aria-label="input"
                                    placeholder="Times New Roman"
                                    value={formData.tech_custom_font}
                                    onChange={handleChange}
                                  />
                                  </div>
                            
                          </div> */}
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
                    <div className="col-span-12 md:col-span-6">
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
                    <div className="col-span-12 md:col-span-6">
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
              {formData.tech_main === "3" && (
                <>
                  <div className="grid grid-cols-12 mt-3  gap-2 ">
                    <div className="col-span-3 hidden md:flex"></div>
                    <div className="col-span-12 md:col-span-6">
                      <label htmlFor="tech_sp_title" className="label">
                        {data?.payload?.tech_lang_keys["11"] ?? "Title"}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_sp_title"
                          id="tech_sp_title"
                          value={formData.tech_sp_title}
                          onChange={handleChange}
                        >
                          <option value="Empty">Empty</option>
                          <option value="Perfect">A More Perfect Union</option>
                          <option value="Gettysburg">Gettysburg Address</option>
                          <option value="Dream">I Have A Dream</option>
                          <option value="Beaches">
                            We Shall Fight on the Beaches
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-3 hidden md:flex"></div>
                    <span className="col-span-12 text-center">
                      ----------- OR -----------
                    </span>
                    <div className="col-span-3 hidden md:flex"></div>
                    <div className="col-span-12 md:col-span-6">
                      <label htmlFor="tech_page2" className="label">
                        {data?.payload?.tech_lang_keys["12"] ?? "Minutes"}:
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
              {formData.tech_main === "4" && (
                <>
                  <div className="grid grid-cols-12 mt-3  gap-2 ">
                    <div className="col-span-3 hidden md:flex"></div>
                    <div className="col-span-12 md:col-span-6">
                      <label htmlFor="tech_lang" className="label">
                        {data?.payload?.tech_lang_keys["13"] ?? "Language"}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_lang"
                          id="tech_lang"
                          value={formData.tech_lang}
                          onChange={handleChange}
                        >
                          <option value="English">English</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Russian">Russian</option>
                          <option value="Spanish">Spanish</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Korean">Korean</option>
                          <option value="Portuguese">Portuguese</option>
                          <option value="Swedish">Swedish</option>
                          <option value="Italian">Italian</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Urdu">Urdu</option>
                          <option value="Arabic">Arabic</option>
                          <option value="Turkish">Turkish</option>
                          <option value="Chinese">Chinese</option>
                        </select>
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
                                  "Word Count"}
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

export default HowManyWordsCalculator;
