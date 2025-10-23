"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePValueCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PvalueCalculator = () => {
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
    tech_with: "q", // z t  chi  f   r  q
    tech_tail: "2",
    tech_score: "1",
    tech_deg: "3",
    tech_deg2: "3",
    tech_degree_freedom: "3",
    tech_level: ".01",
    tech_conversionType: "custom_value",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePValueCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_with) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_with: formData.tech_with,
        tech_tail: formData.tech_tail,
        tech_score: formData.tech_score,
        tech_deg: formData.tech_deg,
        tech_deg2: formData.tech_deg2,
        tech_degree_freedom: formData.tech_degree_freedom,
        tech_level: formData.tech_level,
        tech_conversionType: formData.tech_conversionType,
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
      tech_with: "q", // z t  chi  f   r  q
      tech_tail: "2",
      tech_score: "1",
      tech_deg: "3",
      tech_deg2: "3",
      tech_degree_freedom: "3",
      tech_level: ".01",
      tech_conversionType: "custom_value",
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

  // result
  const getTailText = () => {
    if (result?.tech_tail === "0") {
      return data?.payload?.tech_lang_keys["2"];
    } else if (result?.tech_tail === "-1") {
      return data?.payload?.tech_lang_keys["3"];
    } else if (result?.tech_tail) {
      return data?.payload?.tech_lang_keys["4"];
    }
    return "";
  };

  const getPComparisonText = () => {
    if (result?.tech_inter === "not") {
      return `${data?.payload?.tech_lang_keys["14"]} p < ${result?.tech_level}`;
    } else {
      return `${data?.payload?.tech_lang_keys["15"]} p < ${result?.tech_level}`;
    }
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-6">
                <label htmlFor="tech_with" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_with"
                    id="tech_with"
                    value={formData.tech_with}
                    onChange={handleChange}
                  >
                    <option value="z">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="t">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="chi">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="f">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="r">Pearson r score</option>
                    <option value="q">Tukey q score</option>
                  </select>
                </div>
              </div>
              {(formData.tech_with == "z" || formData.tech_with == "t") && (
                <>
                  <div className="col-span-6 want_find">
                    <label htmlFor="tech_tail" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_tail"
                        id="tech_tail"
                        value={formData.tech_tail}
                        onChange={handleChange}
                      >
                        <option value="0">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="2">One-tailed P-value</option>
                        <option value="-1">
                          {data?.payload?.tech_lang_keys["4"]}
                        </option>
                        <option value="1">
                          {data?.payload?.tech_lang_keys["3"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-6">
                {formData.tech_with == "t" ? (
                  <>
                    <label htmlFor="tech_score" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["7"]}:{" "}
                    </label>
                  </>
                ) : formData.tech_with == "chi" ? (
                  <>
                    <label htmlFor="tech_score" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["8"]}:{" "}
                    </label>
                  </>
                ) : formData.tech_with == "f" ? (
                  <>
                    <label htmlFor="tech_score" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["9"]}:{" "}
                    </label>
                  </>
                ) : formData.tech_with == "r" ? (
                  <>
                    <label htmlFor="tech_score" className="label">
                      {" "}
                      R Score:{" "}
                    </label>
                  </>
                ) : formData.tech_with == "q" ? (
                  <>
                    <label htmlFor="tech_score" className="label">
                      {" "}
                      The value of q:{" "}
                    </label>
                  </>
                ) : formData.tech_with == "z" ? (
                  <>
                    <label htmlFor="tech_score" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["6"]}:{" "}
                    </label>
                  </>
                ) : null}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_score"
                    id="tech_score"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_score}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {(formData.tech_with == "t" ||
                formData.tech_with == "chi" ||
                formData.tech_with == "f" ||
                formData.tech_with == "r" ||
                formData.tech_with == "q") && (
                <>
                  <div className="col-span-6  deg1">
                    {formData.tech_with == "t" ? (
                      <>
                        <label htmlFor="tech_deg" className="label">
                          {" "}
                          {data?.payload?.tech_lang_keys["10"]} (d):{" "}
                        </label>
                      </>
                    ) : formData.tech_with == "chi" ? (
                      <>
                        <label htmlFor="tech_deg" className="label">
                          {" "}
                          {data?.payload?.tech_lang_keys["10"]} (d):{" "}
                        </label>
                      </>
                    ) : formData.tech_with == "f" ? (
                      <>
                        <label htmlFor="tech_deg" className="label">
                          {" "}
                          {data?.payload?.tech_lang_keys["13"]} (d₁):{" "}
                        </label>
                      </>
                    ) : formData.tech_with == "r" ? (
                      <>
                        <label htmlFor="tech_deg" className="label">
                          {" "}
                          N:{" "}
                        </label>
                      </>
                    ) : formData.tech_with == "q" ? (
                      <>
                        <label htmlFor="tech_deg" className="label">
                          {" "}
                          Number of groups (or means):{" "}
                        </label>
                      </>
                    ) : formData.tech_with == "z" ? (
                      <>
                        <label htmlFor="tech_deg" className="label">
                          {" "}
                          {data?.payload?.tech_lang_keys["10"]} (d):{" "}
                        </label>
                      </>
                    ) : null}

                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_deg"
                        id="tech_deg"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_deg}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_with == "f" && (
                <>
                  <div className="col-span-6  deg2">
                    <label htmlFor="tech_deg2" className="label">
                      {data?.payload?.tech_lang_keys["11"]} (d₂):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_deg2"
                        id="tech_deg2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_deg2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_with == "q" && (
                <>
                  <div className="col-span-6  n_score">
                    <label htmlFor="tech_degree_freedom" className="label">
                      Degrees of freedom (within-groups):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_degree_freedom"
                        id="tech_degree_freedom"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_degree_freedom}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {/* <div className="col-span-6 hidden r_score">
                       <label htmlFor="tech_r_score" className="label">
                           R Score:
                          </label>
                          <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_r_score"
                            id="tech_r_score"
                            className="input my-2"
                            aria-label="input"
                          placeholder="00"
                            value={formData.tech_r_score}
                            onChange={handleChange}
                          />
                          </div>
                    
                    </div>
                    <div className="col-span-6 hidden r_score">
                        <label htmlFor="tech_n_score" className="label">
                           N:
                          </label>
                          <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_n_score"
                            id="tech_n_score"
                            className="input my-2"
                            aria-label="input"
                          placeholder="00"
                            value={formData.tech_n_score}
                            onChange={handleChange}
                          />
                          </div>
                    </div> 
                
                     <div className="col-span-6 hidden valueof_q">
                       <label htmlFor="tech_value_q" className="label">
                           The value of q:
                          </label>
                          <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_value_q"
                            id="tech_value_q"
                            className="input my-2"
                            aria-label="input"
                          placeholder="00"
                            value={formData.tech_value_q}
                            onChange={handleChange}
                          />
                          </div>
                      
                    </div>
                    <div className="col-span-6 hidden n_score">
                       <label htmlFor="tech_number_of" className="label">
                           Number of groups (or means):
                          </label>
                          <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_number_of"
                            id="tech_number_of"
                            className="input my-2"
                            aria-label="input"
                          placeholder="00"
                            value={formData.tech_number_of}
                            onChange={handleChange}
                          />
                          </div>

                    </div>
                    <div className="col-span-6 hidden n_score">
                        <label htmlFor="tech_degree_freedom" className="label">
                           Degrees of freedom (within-groups):
                          </label>
                          <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_degree_freedom"
                            id="tech_degree_freedom"
                            className="input my-2"
                            aria-label="input"
                          placeholder="00"
                            value={formData.tech_degree_freedom}
                            onChange={handleChange}
                          />
                          </div>
                      
                    </div>  */}
              <div className="col-span-12">
                <label className="pe-2" htmlFor="custom_value">
                  <input
                    type="radio"
                    name="tech_conversionType"
                    value="custom_value"
                    id="custom_value"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_conversionType === "custom_value"}
                  />
                  <span>Custom</span>
                </label>
                <label htmlFor="fixed_value">
                  <input
                    type="radio"
                    name="tech_conversionType"
                    className="mr-2 border"
                    value="fixed_value"
                    id="fixed_value"
                    onChange={handleChange}
                    checked={formData.tech_conversionType === "fixed_value"}
                  />
                  <span>Fixed</span>
                </label>
              </div>
              {formData.tech_conversionType == "fixed_value" && (
                <>
                  <div className="col-span-12  my-2 fixed_value">
                    <p className="font-s-14 text-blue my-1">
                      Significance Level:
                    </p>
                    <table id="RadioButtonList1">
                      <tbody className="flex">
                        <tr>
                          <td>
                            <input
                              type="radio"
                              name="tech_level"
                              value=".01"
                              id=".01"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_level === ".01"}
                            />
                            <label htmlFor=".01" className="label">
                              0.01
                            </label>
                          </td>
                        </tr>
                        <tr className="px-3">
                          <td>
                            <input
                              type="radio"
                              name="tech_level"
                              value=".05"
                              id=".05"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_level === ".05"}
                            />
                            <label htmlFor=".05" className="label">
                              0.05
                            </label>
                          </td>
                        </tr>
                        <tr className="px-3 level_radio">
                          <td>
                            <input
                              type="radio"
                              name="tech_level"
                              value=".10"
                              id=".10"
                              className="mr-2 border"
                              onChange={handleChange}
                              checked={formData.tech_level === ".10"}
                            />
                            <label htmlFor=".10" className="label">
                              0.10
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {formData.tech_conversionType == "custom_value" && (
                <>
                  <div className="col-span-6 custom_value">
                    <label htmlFor="tech_level" className="label">
                      {data?.payload?.tech_lang_keys["12"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_level"
                        id="tech_level"
                        className="input my-2"
                        aria-label="input"
                        min="0"
                        max="1"
                        placeholder="00"
                        value={formData.tech_level}
                        onChange={handleChange}
                      />
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-center">
                        <p className="text-[20px] font-semibold">
                          <strong>{getTailText()}</strong>
                        </p>
                        <p className="text-[32px] bg-[#2845F5] px-3 py-2 rounded-[10px] inline-block my-3">
                          <strong className="text-white" id="testResult">
                            {result?.tech_p}
                          </strong>
                        </p>
                      </div>

                      <p className="w-full text-center" id="p_greater">
                        {getPComparisonText()}
                      </p>
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

export default PvalueCalculator;
