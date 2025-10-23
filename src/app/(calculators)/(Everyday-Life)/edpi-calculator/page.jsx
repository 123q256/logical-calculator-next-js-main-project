"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEdpiCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EdpiCalculator = () => {
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
    tech_game: "2",
    tech_dpi: "600",
    tech_sen: "0.12",
    tech_row: "0",
    tech_win: "1",
    tech_submit: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEdpiCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_game == 1) {
      if (
        !formData.tech_game ||
        !formData.tech_dpi ||
        !formData.tech_sen ||
        !formData.tech_row ||
        !formData.tech_win
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (!formData.tech_game || !formData.tech_dpi || !formData.tech_sen) {
        setFormError("Please fill in field");
        return;
      }
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_game: formData.tech_game,
        tech_dpi: formData.tech_dpi,
        tech_sen: formData.tech_sen,
        tech_row: formData.tech_row,
        tech_win: formData.tech_win,
        tech_submit: formData.tech_submit,
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
      tech_game: "2",
      tech_dpi: "600",
      tech_sen: "0.12",
      tech_row: "0",
      tech_win: "1",
      tech_submit: "1",
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_game" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_game"
                    id="tech_game"
                    value={formData.tech_game}
                    onChange={handleChange}
                  >
                    <option value="1" selected>
                      CS:GO
                    </option>
                    <option value="2">Call of Duty</option>
                    <option value="3">Valorant</option>
                    <option value="4">Fortnite</option>
                    <option value="5">Overwatch</option>
                    <option value="6">Apex Legends</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 cs_og">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_dpi" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_dpi"
                        id="tech_dpi"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_dpi}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_sen" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_sen"
                        id="tech_sen"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_sen}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {formData.tech_game == "1" && (
                <div className="col-span-12 call_of_duty">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_row" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_row"
                          id="tech_row"
                          value={formData.tech_row}
                          onChange={handleChange}
                        >
                          <option value="0" selected>
                            Off
                          </option>
                          <option value="1">On</option>
                        </select>
                      </div>
                    </div>
                    <div
                      className="col-span-12 md:col-span-6 lg:col-span-6 "
                      id="window"
                    >
                      <label htmlFor="tech_win" className="label">
                        {data?.payload?.tech_lang_keys["6"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_win"
                          id="tech_win"
                          value={formData.tech_win}
                          onChange={handleChange}
                        >
                          <option value="0.03">1</option>
                          <option value="0.06">2</option>
                          <option value="0.25">3</option>
                          <option value="0.5">4</option>
                          <option value="0.75">5</option>
                          <option value="1">6</option>
                          <option value="1.5">7</option>
                          <option value="2">8</option>
                          <option value="2.5">9</option>
                          <option value="3">10</option>
                          <option value="3.5">11</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="text-[18px] w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_ans}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_type}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>Cm/360° :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cm}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>In/360° :</strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_in}
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

export default EdpiCalculator;
