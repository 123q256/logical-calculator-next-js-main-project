"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useVariationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VariationCalculator = () => {
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
    tech_select: "1",
    tech_y: "31",
    tech_x: "3",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVariationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_select || !formData.tech_y || !formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_select: formData.tech_select,
        tech_y: Number(formData.tech_y),
        tech_x: Number(formData.tech_x),
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
      tech_select: "1",
      tech_y: "31",
      tech_x: "3",
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

  const [selectedValue, setSelectedValue] = useState("1"); // default 1 ya jo chaho

  // Yeh hai lang object
  const lang = {
    1: data?.payload?.tech_lang_keys["1"],
    2: data?.payload?.tech_lang_keys["2"],
    3: data?.payload?.tech_lang_keys["3"],
    4: data?.payload?.tech_lang_keys["4"],
    5: data?.payload?.tech_lang_keys["5"],
    6: data?.payload?.tech_lang_keys["6"],
    7: data?.payload?.tech_lang_keys["7"],
    8: data?.payload?.tech_lang_keys["8"],
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[30%] md:w-[30%] mx-auto">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_select" className="label">
                  Y:
                </label>
                <div className="w-full py-2">
                  <select
                    className="input"
                    aria-label="tech_select"
                    name="tech_select"
                    id="tech_select"
                    value={formData.tech_select}
                    onChange={handleChange}
                  >
                    {Object.keys(lang).map((key) => (
                      <option key={key} value={key}>
                        {lang[key]} (X)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-12 mx-auto relative">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["9"]} Y =
                </label>
                <input
                  type="number"
                  name="tech_y"
                  id="tech_y"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_y}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 mx-auto relative">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["10"]} X =
                </label>
                <input
                  type="number"
                  name="tech_x"
                  id="tech_x"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_x}
                  onChange={handleChange}
                />
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[80%] mt-2">
                          <table className="w-full lg:text-[16px] md:text-[16px] text-[14px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["11"]} (k)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result.tech_ans).toFixed(5)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  y = {Number(result.tech_ans).toFixed(5)}{" "}
                                  {formData.tech_select === "1" && "x"}
                                  {formData.tech_select === "2" && "/ x"}
                                  {formData.tech_select === "3" && (
                                    <>
                                      x<sup className="label">2</sup>
                                    </>
                                  )}
                                  {formData.tech_select === "4" && (
                                    <>
                                      x<sup className="label">3</sup>
                                    </>
                                  )}
                                  {formData.tech_select === "5" && "√x"}
                                  {formData.tech_select === "6" && (
                                    <>
                                      / x<sup className="label">2</sup>
                                    </>
                                  )}
                                  {formData.tech_select === "7" && (
                                    <>
                                      / x<sup className="label">3</sup>
                                    </>
                                  )}
                                  {![
                                    "1",
                                    "2",
                                    "3",
                                    "4",
                                    "5",
                                    "6",
                                    "7",
                                  ].includes(formData.tech_select) && "/ √x"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full  text-[16px] mt-3">
                          <p>
                            <strong>{data?.payload?.tech_lang_keys[22]}</strong>
                          </p>
                          {formData.tech_select === "1" && (
                            <>
                              <p className="mt-2">
                                Y {data?.payload?.tech_lang_keys[1]} (X), y ={" "}
                                {formData.tech_y} and x = {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[13]}:
                              </p>
                              <p className="mt-2">y = kx</p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[14]} x ={" "}
                                {formData.tech_x} and y = {formData.tech_y}
                              </p>
                              <p className="mt-2">
                                {formData.tech_y} = {formData.tech_x}k
                              </p>
                              <p className="mt-2">
                                k = {formData.tech_y} / {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[11]} (k) ={" "}
                                {Number(result.tech_ans).toFixed(5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[12]}: y ={" "}
                                {Number(result.tech_ans).toFixed(5)}x
                              </p>
                            </>
                          )}

                          {formData.tech_select === "2" && (
                            <>
                              <p className="mt-2">
                                Y {data?.payload?.tech_lang_keys[2]} (X), y ={" "}
                                {formData.tech_y} and x = {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[15]}:
                              </p>
                              <p className="mt-2">y = k/x</p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[14]} x ={" "}
                                {formData.tech_x} and y = {formData.tech_y}
                              </p>
                              <p className="mt-2">
                                {formData.tech_y} = k/{formData.tech_x}
                              </p>
                              <p className="mt-2">
                                k = {formData.tech_y} * {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[11]} (k) ={" "}
                                {Number(result.tech_ans).toFixed(5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[12]}: y ={" "}
                                {Number(result.tech_ans).toFixed(5)} / x
                              </p>
                            </>
                          )}

                          {formData.tech_select === "3" && (
                            <>
                              <p className="mt-2">
                                Y {data?.payload?.tech_lang_keys[3]} (X), y ={" "}
                                {formData.tech_y} and x = {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[16]}:
                              </p>
                              <p className="mt-2">
                                y = kx<sup className="label">2</sup>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[14]} x ={" "}
                                {formData.tech_x} and y = {formData.tech_y}
                              </p>
                              <p className="mt-2">
                                {formData.tech_y} = k({formData.tech_x})
                                <sup className="label">2</sup>
                              </p>
                              <p className="mt-2">
                                k = {formData.tech_y} /{" "}
                                {Math.pow(formData.tech_x, 2)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[11]} (k) ={" "}
                                {Number(result.tech_ans).toFixed(5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[12]}: y ={" "}
                                {Number(result.tech_ans).toFixed(5)}x
                                <sup className="label">2</sup>
                              </p>
                            </>
                          )}

                          {formData.tech_select === "4" && (
                            <>
                              <p className="mt-2">
                                Y {data?.payload?.tech_lang_keys[4]} (X), y ={" "}
                                {formData.tech_y} and x = {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[17]}:
                              </p>
                              <p className="mt-2">
                                y = kx<sup className="label">3</sup>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[14]} x ={" "}
                                {formData.tech_x} and y = {formData.tech_y}
                              </p>
                              <p className="mt-2">
                                {formData.tech_y} = k({formData.tech_x})
                                <sup className="label">3</sup>
                              </p>
                              <p className="mt-2">
                                k = {formData.tech_y} /{" "}
                                {Math.pow(formData.tech_x, 3)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[11]} (k) ={" "}
                                {Number(result.tech_ans).toFixed(5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[12]}: y ={" "}
                                {Number(result.tech_ans).toFixed(5)}x
                                <sup className="label">3</sup>
                              </p>
                            </>
                          )}

                          {formData.tech_select === "5" && (
                            <>
                              <p className="mt-2">
                                Y {data?.payload?.tech_lang_keys[5]} (X), y ={" "}
                                {formData.tech_y} and x = {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[18]}:
                              </p>
                              <p className="mt-2">y = k√x</p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[14]} x ={" "}
                                {formData.tech_x} and y = {formData.tech_y}
                              </p>
                              <p className="mt-2">
                                {formData.tech_y} = k√({formData.tech_x})
                              </p>
                              <p className="mt-2">
                                k = {formData.tech_y} /{" "}
                                {Math.pow(formData.tech_x, 0.5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[11]} (k) ={" "}
                                {Number(result.tech_ans).toFixed(5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[12]}: y ={" "}
                                {Number(result.tech_ans).toFixed(5)}√x
                              </p>
                            </>
                          )}

                          {formData.tech_select === "6" && (
                            <>
                              <p className="mt-2">
                                Y {data?.payload?.tech_lang_keys[6]} (X), y ={" "}
                                {formData.tech_y} and x = {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[19]}:
                              </p>
                              <p className="mt-2">
                                y = k / x<sup className="label">2</sup>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[14]} x ={" "}
                                {formData.tech_x} and y = {formData.tech_y}
                              </p>
                              <p className="mt-2">
                                {formData.tech_y} = k / ({formData.tech_x})
                                <sup className="label">2</sup>
                              </p>
                              <p className="mt-2">
                                k = {formData.tech_y} *{" "}
                                {Math.pow(formData.tech_x, 2)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[11]} (k) ={" "}
                                {Number(result.tech_ans).toFixed(5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[12]}: y ={" "}
                                {Number(result.tech_ans).toFixed(5)} / x
                                <sup className="label">2</sup>
                              </p>
                            </>
                          )}

                          {formData.tech_select === "7" && (
                            <>
                              <p className="mt-2">
                                Y {data?.payload?.tech_lang_keys[7]} (X), y ={" "}
                                {formData.tech_y} and x = {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[20]}:
                              </p>
                              <p className="mt-2">
                                y = k / x<sup className="label">3</sup>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[14]} x ={" "}
                                {formData.tech_x} and y = {formData.tech_y}
                              </p>
                              <p className="mt-2">
                                {formData.tech_y} = k / ({formData.tech_x})
                                <sup className="label">3</sup>
                              </p>
                              <p className="mt-2">
                                k = {formData.tech_y} *{" "}
                                {Math.pow(formData.tech_x, 3)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[11]} (k) ={" "}
                                {Number(result.tech_ans).toFixed(5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[12]}: y ={" "}
                                {Number(result.tech_ans).toFixed(5)} / x
                                <sup className="label">3</sup>
                              </p>
                            </>
                          )}

                          {formData.tech_select === "8" && (
                            <>
                              <p className="mt-2">
                                Y {data?.payload?.tech_lang_keys[7]} (X), y ={" "}
                                {formData.tech_y} and x = {formData.tech_x}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[20]}:
                              </p>
                              <p className="mt-2">
                                y = k / x<sup className="label">3</sup>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[14]} x ={" "}
                                {formData.tech_x} and y = {formData.tech_y}
                              </p>
                              <p className="mt-2">
                                {formData.tech_y} = k / ({formData.tech_x})
                                <sup className="label">3</sup>
                              </p>
                              <p className="mt-2">
                                k = {formData.tech_y} *{" "}
                                {Math.pow(formData.tech_x, 3)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[11]} (k) ={" "}
                                {Number(result.tech_ans).toFixed(5)}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[12]}: y ={" "}
                                {Number(result.tech_ans).toFixed(5)} / x
                                <sup className="label">3</sup>
                              </p>
                            </>
                          )}
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

export default VariationCalculator;
