"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBirthdayCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BirthdayCalculator = () => {
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
    tech_next_birth: "1999-11-05",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBirthdayCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_next_birth) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_next_birth: formData.tech_next_birth,
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
      tech_next_birth: "1999-11-05",
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

  // chart
  const datachart = {
    labels: [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    datasets: [
      {
        label: "Days",
        data: result?.tech_totalDays, // array like [4, 3, 6, 2, 5, 3, 4]
        backgroundColor: [
          "#FF2445",
          "#00A8F1",
          "#00D2FF",
          "#00ECA6",
          "#00AE28",
          "#D5DC23",
          "#FF681C",
        ],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    cutout: "50%", // Donut hole size
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#000",
          font: {
            size: 14,
          },
        },
      },
    },
    maintainAspectRatio: false,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form  rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_next_birth" className="label">
                  {data?.payload?.tech_lang_keys["dob"]}:
                </label>
                <div className=" relative">
                  <input
                    type="date"
                    name="tech_next_birth"
                    id="tech_next_birth"
                    className="input my-2"
                    value={formData.tech_next_birth}
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
                    <div className="w-full bg-light-blue rounded-[10px] mt-3">
                      <div className="my-2">
                        <div className="lg:w-[100%] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="w-[55%] border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["57"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_nextBirth}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[59]}{" "}
                                    <u>{data?.payload?.tech_lang_keys[60]}</u>{" "}
                                    {data?.payload?.tech_lang_keys[50]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_half_brdy}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[58]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_remDays}{" "}
                                  {data?.payload?.tech_lang_keys["days"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[62]} :
                                  </strong>
                                </td>
                                <td className="py-2">
                                  {result?.tech_next_half_r_days}{" "}
                                  {data?.payload?.tech_lang_keys["days"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b pb-2 pt-4">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[59]}{" "}
                                    <u>{data?.payload?.tech_lang_keys[61]}</u>{" "}
                                    {data?.payload?.tech_lang_keys[63]} :
                                  </strong>
                                </td>
                                <td className="border-b pb-2 pt-4">
                                  <b>{result?.tech_Age}</b>{" "}
                                  <span className="text-[16px]">
                                    {data?.payload?.tech_lang_keys["years"]}
                                  </span>
                                  <b>{result?.tech_Age_months}</b>{" "}
                                  <span className="text-[16px]">
                                    {data?.payload?.tech_lang_keys["months"]}
                                  </span>
                                  <b>{result?.tech_Age_days}</b>{" "}
                                  <span className="text-[16px]">
                                    {data?.payload?.tech_lang_keys["days"]}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="lg:flex mf:flex">
                          <div className="w-full lg:w-[50%] text-[18px] mt-3">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="w-[85%] border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys?.[40]}
                                    </strong>{" "}
                                    :
                                  </td>
                                  <td className="border-b py-2">
                                    {Array.isArray(result?.tech_totalDays)
                                      ? result.tech_totalDays.reduce(
                                          (acc, val) => acc + Number(val || 0),
                                          0
                                        )
                                      : 0}
                                  </td>
                                </tr>

                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["41"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_totalDays[1]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["42"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_totalDays[2]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["43"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_totalDays[3]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["44"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_totalDays[4]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["45"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_totalDays[5]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["46"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_totalDays[6]}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["47"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_totalDays[0]}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="w-full lg:w-[50%] flex items-center">
                            <div
                              style={{
                                width: "350px",
                                height: "350px",
                                margin: "0 auto",
                              }}
                            >
                              <Doughnut data={datachart} options={options} />
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

export default BirthdayCalculator;
