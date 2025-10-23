"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useWeekCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DeadlineCalculator = () => {
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
    tech_current: "",
    tech_stype: "s_date",
    tech_next: "",
    tech_number: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateWeekCalculator,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useWeekCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_stype == "s_date" || formData.tech_stype == "e_date") {
      if (!formData.tech_current || !formData.tech_number) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_stype ||
        !formData.tech_next ||
        !formData.tech_current
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateWeekCalculator({
        tech_stype: formData.tech_stype,
        tech_current: formData.tech_current,
        tech_number: formData.tech_number,
        tech_next: formData.tech_next,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating");
      toast.error("Error calculating");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_current: "",
      tech_stype: "s_date",
      tech_next: "5",
      tech_number: "5",
    });
    setResult(null);
    setFormError(null);
  };

  // table add dates and table start

  const today = new Date();

  useEffect(() => {
    const weeksContainer = document
      .getElementById("weeksContainer")
      ?.querySelector("tbody");

    if (!weeksContainer || weeksContainer.children.length > 0) return;

    const htmlContent = Array.from({ length: 50 }, (_, i) => {
      const index = i + 1;

      const addedWeeksDate = addWeeks(today, index);
      const formattedDate = formatDateString(addedWeeksDate);
      const formattedDateS = formatDates(addedWeeksDate);
      const dateName = getDayName(addedWeeksDate);
      return `
         <tr className="font-bold hover:bg-gray-600" style={{ fontWeight: 700 }}>
             <td><time datetime="PT${index}W">${index} Weeks</time></td>
          <td><time datetime="${formattedDateS}">${dateName}, ${formattedDate}</time></td>
          </tr>`;
    }).join("");

    setTimeout(() => {
      weeksContainer.innerHTML = htmlContent;
    }, 500);
  }, [data?.payload?.tech_content]);

  function addWeeks(date, weeks) {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result;
  }
  function formatDates(date) {
    return date.toISOString().split("T")[0];
  }
  function formatDateString(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  function getDayName(date, locale = "en-US") {
    return new Date(date).toLocaleDateString(locale, { weekday: "long" });
  }

  const addTwoWeeks = addWeeks(today, 2);
  const addFourWeeks = addWeeks(today, 4);
  const addSixWeeks = addWeeks(today, 6);
  const addEightWeeks = addWeeks(today, 8);
  const addTenWeeks = addWeeks(today, 10);
  const currentday = getDayName(today);
  const currentyearMonth = formatDateString(today);

  useEffect(() => {
    setTimeout(() => {
      const alldays = document.querySelectorAll(".todaydate");
      alldays.forEach((elements) => {
        elements.textContent = `${currentday}, ${currentyearMonth}`;
      });
    }, 8000); // 8 second ka delay
  }, [currentday, currentyearMonth]);

  const dateName22 = getDayName(addTwoWeeks);
  const formattedDate22 = formatDateString(addTwoWeeks);

  const dateName44 = getDayName(addFourWeeks);
  const formattedDate44 = formatDateString(addFourWeeks);

  const dateName66 = getDayName(addSixWeeks);
  const formattedDate66 = formatDateString(addSixWeeks);

  const dateName88 = getDayName(addEightWeeks);
  const formattedDate88 = formatDateString(addEightWeeks);

  const dateName10 = getDayName(addTenWeeks);
  const formattedDate10 = formatDateString(addTenWeeks);

  // 2 week
  useEffect(() => {
    if (addTwoWeeks) {
      const element = document.getElementById("addTwoWeeks");
      const elementFour = document.getElementById("addFourWeeks");
      const elementSix = document.getElementById("addSixWeeks");
      const elementEight = document.getElementById("addEightWeeks");
      const elementTen = document.getElementById("addTenWeeks");
      if (element) {
        element.textContent = `${dateName22}, ${formattedDate22}`;
        elementFour.textContent = `${dateName44}, ${formattedDate44}`;
        elementSix.textContent = ` ${dateName66}, ${formattedDate66}`;
        elementEight.textContent = `${dateName88}, ${formattedDate88}`;
        elementTen.textContent = `${dateName10}, ${formattedDate10}`;
      }
    }
  }, [addTwoWeeks]);
  // table add dates and table end

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
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="lg:flex md:flex  items-center space-x-4">
                  <label className="pe-2" htmlFor="s_date">
                    <input
                      type="radio"
                      name="tech_stype"
                      value="s_date"
                      id="s_date"
                      className="mr-2 border"
                      onChange={handleChange}
                      checked={formData.tech_stype === "s_date"}
                    />
                    <span>{data?.payload?.tech_lang_keys["4"]}</span>
                  </label>
                  <label htmlFor="e_date">
                    <input
                      type="radio"
                      name="tech_stype"
                      className="mr-2 border"
                      value="e_date"
                      id="e_date"
                      onChange={handleChange}
                      checked={formData.tech_stype === "e_date"}
                    />
                    <span>{data?.payload?.tech_lang_keys["5"]}</span>
                  </label>
                  <label htmlFor="date">
                    <input
                      type="radio"
                      name="tech_stype"
                      className="mr-2 border"
                      value="date"
                      id="date"
                      onChange={handleChange}
                      checked={formData.tech_stype === "date"}
                    />
                    <span>{data?.payload?.tech_lang_keys["6"]}</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-3 lg:grid-cols-5 md:grid-cols-5 mt-4 gap-2 items-center">
                <div className="space-y-1 col-span-2">
                  <label htmlFor="tech_current" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <input
                    type="date"
                    step="any"
                    name="tech_current"
                    id="tech_current"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_current}
                    onChange={handleChange}
                  />
                </div>

                {formData.tech_stype === "s_date" ? (
                  <>
                    <p className="text-lg mt-3 col-span-1 text-center symble">
                      {" "}
                      ➕{" "}
                    </p>
                    <div className="space-y-1 col-span-2 dateshow">
                      <label htmlFor="tech_number" className="label">
                        {data?.payload?.tech_lang_keys["3"]}:
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="tech_number"
                        id="tech_number"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_number}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : formData.tech_stype === "e_date" ? (
                  <>
                    <p className="text-lg mt-3 col-span-1 text-center symble">
                      {" "}
                      ➖{" "}
                    </p>
                    <div className="space-y-1 col-span-2 dateshow">
                      <label htmlFor="tech_number" className="label">
                        {data?.payload?.tech_lang_keys["3"]}:
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="tech_number"
                        id="tech_number"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_number}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : formData.tech_stype === "date" ? (
                  <>
                    <p className="text-lg mt-3 col-span-1 text-center symble">
                      {" "}
                      ⇢{" "}
                    </p>
                    <div className="space-y-1 col-span-2 dateshow">
                      <label htmlFor="tech_next" className="label">
                        {data?.payload?.tech_lang_keys["2"]}:
                      </label>
                      <input
                        type="date"
                        step="any"
                        name="tech_next"
                        id="tech_next"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_next}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDeadlineLoading}>
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
        {calculateDeadlineLoading ? (
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  p-6 rounded-lg mt-6 overflow-auto">
                      <div className="grid grid-cols-1">
                        <div className="w-full">
                          {formData.tech_stype === "date" ? (
                            <div className="text-center">
                              <p className="text-2xl md:text-4xl lg:text-4xl bg-[#2845F5] px-4 py-3 rounded-lg inline-block my-6">
                                <strong className="text-white">
                                  {result?.tech_weeks}
                                  <span className="text-xl"> Weeks</span>
                                </strong>
                              </p>
                            </div>
                          ) : formData.tech_stype === "s_date" ? (
                            <div className="text-center">
                              <p className="text-2xl md:text-4xl lg:text-4xl bg-[#2845F5] px-4 py-3 rounded-lg inline-block my-6">
                                <strong className="text-white">
                                  {result?.tech_adding}
                                </strong>
                              </p>
                            </div>
                          ) : formData.tech_stype === "e_date" ? (
                            <div className="text-center">
                              <p className="text-2xl md:text-4xl lg:text-4xl bg-[#2845F5] px-4 py-3 rounded-lg inline-block my-6">
                                <strong className="text-white">
                                  {result?.tech_subbtract}
                                </strong>
                              </p>
                            </div>
                          ) : null}
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

export default DeadlineCalculator;
