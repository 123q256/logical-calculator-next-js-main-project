"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTimespanCalculationMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

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

  // console.log(data);

  const [formData, setFormData] = useState({
    tech_clock_format: "12",
    tech_s_hour: "07",
    tech_s_min: "30",
    tech_s_sec: "00",
    tech_s_ampm: "am",
    tech_e_hour: "01",
    tech_e_min: "30",
    tech_e_sec: "00",
    tech_e_ampm: "am",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: calculateDeadlineLoading, isError, error: calculateLoveError },
  ] = useTimespanCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_clock_format == 24) {
      if (
        !formData.tech_clock_format ||
        !formData.tech_s_hour ||
        !formData.tech_s_min ||
        !formData.tech_s_sec ||
        !formData.tech_e_hour ||
        !formData.tech_e_min ||
        !formData.tech_e_sec
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_clock_format ||
        !formData.tech_s_hour ||
        !formData.tech_s_min ||
        !formData.tech_s_sec ||
        !formData.tech_e_hour ||
        !formData.tech_e_min ||
        !formData.tech_e_sec ||
        !formData.tech_s_ampm ||
        !formData.tech_e_ampm
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_clock_format: formData.tech_clock_format,
        tech_s_hour: formData.tech_s_hour,
        tech_s_min: formData.tech_s_min,
        tech_s_sec: formData.tech_s_sec,
        tech_s_ampm: formData.tech_s_ampm,
        tech_e_hour: formData.tech_e_hour,
        tech_e_min: formData.tech_e_min,
        tech_e_sec: formData.tech_e_sec,
        tech_e_ampm: formData.tech_e_ampm,
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
      tech_clock_format: "12",
      tech_s_hour: "07",
      tech_s_min: "30",
      tech_s_sec: "00",
      tech_s_ampm: "am",
      tech_e_hour: "01",
      tech_e_min: "30",
      tech_e_sec: "00",
      tech_e_ampm: "am",
    });
    setResult(null);
    setFormError(null);
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

          <div className="mt-0 my-lg-2 text-center">
            <span className="font-s-14 text-blue pe-3">
              {data?.payload?.tech_lang_keys["1"]}
            </span>
            <label className="pe-2" htmlFor="bedtime">
              <input
                type="radio"
                name="tech_clock_format"
                value="12"
                id="bedtime"
                className="mr-2 border"
                onChange={handleChange}
                checked={formData.tech_clock_format === "12"}
              />
              <span>12 {data?.payload?.tech_lang_keys["2"]}</span>{" "}
              <br className="lg:hidden md:hidde flex" />
            </label>
            <label className="lg:ml-auto  ml-[100px]" htmlFor="wkup">
              <input
                type="radio"
                name="tech_clock_format"
                className="mr-2 border"
                value="24"
                id="wkup"
                onChange={handleChange}
                checked={formData.tech_clock_format === "24"}
              />
              <span> 24 {data?.payload?.tech_lang_keys["3"]}</span>
            </label>
          </div>

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto overflow-x-auto">
            <div className="flex flex-wrap ">
              <label className="label my-1">
                {data?.payload?.tech_lang_keys[6]}:
              </label>
              <div className="w-full flex space-x-4">
                <div className="w-full px-2">
                  <label htmlFor="tech_s_hour" className="label">
                    {data?.payload?.tech_lang_keys["2"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_s_hour"
                    min="0"
                    max="23"
                    id="tech_s_hour"
                    className="input my-2"
                    placeholder="Hrs"
                    aria-label="input"
                    value={formData.tech_s_hour}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full px-2">
                  <label htmlFor="tech_s_min" className="label">
                    {data?.payload?.tech_lang_keys["4"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_s_min"
                    min="0"
                    max="59"
                    id="tech_s_min"
                    className="input my-2"
                    placeholder="Min"
                    aria-label="input"
                    value={formData.tech_s_min}
                    onChange={handleChange}
                  />
                </div>

                <div className="w-full px-2">
                  <label htmlFor="tech_s_sec" className="label">
                    {data?.payload?.tech_lang_keys["5"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_s_sec"
                    min="0"
                    max="59"
                    id="tech_s_sec"
                    className="input my-2"
                    placeholder="Sec"
                    aria-label="input"
                    value={formData.tech_s_sec}
                    onChange={handleChange}
                  />
                </div>

                {formData?.tech_clock_format === "12" && (
                  <div className="w-full px-2 s_ampm ">
                    <label htmlFor="tech_s_sec" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        style={{ width: "100px" }}
                        className="input"
                        aria-label="select"
                        name="tech_s_sec"
                        id="tech_s_sec"
                        value={formData.tech_s_sec}
                        onChange={handleChange}
                      >
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <label className="label my-1">
                {data?.payload?.tech_lang_keys[7]}:
              </label>
              <div className="w-full flex space-x-4">
                <div className="w-full px-2">
                  <label htmlFor="tech_e_hour" className="label">
                    {data?.payload?.tech_lang_keys["3"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_e_hour"
                    id="tech_e_hour"
                    min="0"
                    max="23"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Hrs"
                    value={formData.tech_e_hour}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full px-2">
                  <label htmlFor="tech_e_min" className="label">
                    {data?.payload?.tech_lang_keys["4"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_e_min"
                    id="tech_e_min"
                    min="0"
                    max="59"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Min"
                    value={formData.tech_e_min}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full px-2">
                  <label htmlFor="tech_e_sec" className="label">
                    {data?.payload?.tech_lang_keys["5"]}:
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_e_sec"
                    id="tech_e_sec"
                    min="0"
                    max="59"
                    className="input my-2"
                    aria-label="input"
                    placeholder="Sec"
                    value={formData.tech_e_sec}
                    onChange={handleChange}
                  />
                </div>

                {formData?.tech_clock_format === "12" && (
                  <div className="w-full px-2 e_ampm">
                    <label htmlFor="tech_e_ampm" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        style={{ width: "100px" }}
                        className="input"
                        aria-label="select"
                        name="tech_e_ampm"
                        id="tech_e_ampm"
                        value={formData.tech_e_ampm}
                        onChange={handleChange}
                      >
                        <option value="am">AM</option>
                        <option value="pm">PM</option>
                      </select>
                    </div>
                  </div>
                )}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue  rounded-[10px] mt-3">
                      <div className="my-2">
                        <div className="lg:text-[16px] md:text-[16px] text-[14px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="w-[70%] border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[8]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_first_to_second}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[9]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_second_to_first}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[10]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_first_to_second_over_night}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[11]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_second_to_first_over_night}
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

export default DeadlineCalculator;
