"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCovarianceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CovarianceCalculator = () => {
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
    tech_formula: "2",
    tech_set_x: "5, 12, 18, 23, 45",
    tech_set_y: "2, 8, 18, 20, 28",
    tech_between: "0.5",
    tech_devi_x: "10",
    tech_devi_y: "4",
    tech_matrix: "[13 , 44 , 25],[43 , 65 , 76],[12 , 54 , 8]",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCovarianceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_formula) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_formula: formData.tech_formula,
        tech_set_x: formData.tech_set_x,
        tech_set_y: formData.tech_set_y,
        tech_between: formData.tech_between,
        tech_devi_x: formData.tech_devi_x,
        tech_devi_y: formData.tech_devi_y,
        tech_matrix: formData.tech_matrix,
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
      tech_formula: "2",
      tech_set_x: "5, 12, 18, 23, 45",
      tech_set_y: "2, 8, 18, 20, 28",
      tech_between: "0.5",
      tech_devi_x: "10",
      tech_devi_y: "4",
      tech_matrix: "[13 , 44 , 25],[43 , 65 , 76],[12 , 54 , 8]",
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

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
            <div className="grid grid-cols-1    gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_formula" className="label">
                  {data?.payload?.tech_lang_keys["cal_for"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_formula"
                    id="tech_formula"
                    value={formData.tech_formula}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["dataset"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["from"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["matrix"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-1  md:gap-3 mt-2">
              {formData.tech_formula == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 for1">
                    <label htmlFor="tech_set_x" className="label">
                      {data?.payload?.tech_lang_keys["set"]} x
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_set_x"
                        id="tech_set_x"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="Enter numbers & separate by comma ','"
                        value={formData.tech_set_x || "2, 4, 6, 18, 10"}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 for1">
                    <label htmlFor="tech_set_y" className="label">
                      {data?.payload?.tech_lang_keys["set"]} y
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_set_y"
                        id="tech_set_y"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="Enter numbers & separate by comma ','"
                        value={formData.tech_set_y || "2, 4, 6, 18, 10"}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-12 gap-1  md:gap-3 mt-2">
              {formData.tech_formula == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 for2">
                    <label htmlFor="tech_between" className="label">
                      {data?.payload?.tech_lang_keys["xy"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_between"
                        id="tech_between"
                        className="input my-2"
                        aria-label="input"
                        min="-0.99999"
                        max="0.99999"
                        placeholder="00"
                        value={formData.tech_between}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 for2">
                    <label htmlFor="tech_devi_x" className="label">
                      {data?.payload?.tech_lang_keys["devi"]} X:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_devi_x"
                        id="tech_devi_x"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_devi_x}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 for2">
                    <label htmlFor="tech_devi_y" className="label">
                      {data?.payload?.tech_lang_keys["devi"]} Y:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_devi_y"
                        id="tech_devi_y"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_devi_y}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            {formData.tech_formula == "3" && (
              <>
                <div className="grid grid-cols-12 gap-1  md:gap-3 ">
                  <div className="col-span-12 for3">
                    <label htmlFor="tech_matrix" className="label">
                      {data?.payload?.tech_lang_keys["input"]}
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_matrix"
                        id="tech_matrix"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="[13 , 44 , 25],[43 , 65 , 76],[12 , 54 , 8] Enter Matrix Value in this form"
                        value={formData.tech_matrix || "2, 4, 6, 18, 10"}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
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

                  <div className="rounded-lg mt-4   items-center justify-center">
                    <div className="row">
                      {result?.tech_formula == 1 && (
                        <>
                          <div className="w-full md:w-[80%] lg:w-[50%] mt-2 overflow-auto">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["s"]} X
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {formData?.tech_set_x ?? "0"}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["s"]} Y
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {formData?.tech_set_y ?? "0"}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["sample"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>{result?.tech_nbr ?? "0"}</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["Mean"]} X̄
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {result?.tech_mean_x ?? "0"}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["Mean"]} Ȳ
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {result?.tech_mean_y ?? "0"}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["s_cov"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {result?.tech_population ?? "0"}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys["p_cov"]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {result?.tech_sample ?? "0"}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      {result?.tech_formula == 2 && (
                        <div className="text-center">
                          <p className="text-[20px] font-semibold">
                            {data?.payload?.tech_lang_keys["cov_val"]}
                          </p>
                          <p className="text-[32px] px-3 py-2 inline-block my-3">
                            <strong className="bg-[#2845F5] text-white p-4 rounded-lg">
                              {result?.tech_ans_2 ?? "00"}
                            </strong>
                          </p>
                        </div>
                      )}

                      {result?.tech_formula == 3 && (
                        <div className="text-center bg-[#2845F5] text-white p-4 rounded-lg">
                          <p className="text-[20px] font-semibold">
                            {data?.payload?.tech_lang_keys["matrix"]}
                          </p>
                          <p className="px-3 py-2 inline-block my-3">
                            <strong
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_output ?? "00",
                              }}
                            />
                          </p>
                        </div>
                      )}
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

export default CovarianceCalculator;
