"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTestCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TestGradeCalculator = () => {
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
    tech_grades: "1", //  1 2
    tech_first: "50",
    tech_second: "15",
    tech_increment: "1",
    tech_aplus: "97",
    tech_a: "93",
    tech_aminus: "90",
    tech_bplus: "87",
    tech_b: "83",
    tech_bminus: "80",
    tech_cplus: "77",
    tech_c: "73",
    tech_cminus: "70",
    tech_dplus: "67",
    tech_d: "63",
    tech_dminus: "63",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTestCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_grades: formData.tech_grades,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_increment: formData.tech_increment,
        tech_aplus: formData.tech_aplus,
        tech_a: formData.tech_a,
        tech_aminus: formData.tech_aminus,
        tech_bplus: formData.tech_bplus,
        tech_b: formData.tech_b,
        tech_bminus: formData.tech_bminus,
        tech_cplus: formData.tech_cplus,
        tech_c: formData.tech_c,
        tech_cminus: formData.tech_cminus,
        tech_dplus: formData.tech_dplus,
        tech_d: formData.tech_d,
        tech_dminus: formData.tech_dminus,
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
      tech_grades: "1", //  1 2
      tech_first: "50",
      tech_second: "15",
      tech_increment: "1",
      tech_aplus: "97",
      tech_a: "93",
      tech_aminus: "90",
      tech_bplus: "87",
      tech_b: "83",
      tech_bminus: "80",
      tech_cplus: "77",
      tech_c: "73",
      tech_cminus: "70",
      tech_dplus: "67",
      tech_d: "63",
      tech_dminus: "63",
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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_grades" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_grades"
                    id="tech_grades"
                    value={formData.tech_grades}
                    onChange={handleChange}
                  >
                    <option value="1">A,B,C,D,...... </option>
                    <option value="2">A+,A,A-,B+,...... </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
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
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_second" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_second"
                    id="tech_second"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_second}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_increment" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_increment"
                    id="tech_increment"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_increment}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="col-span-12 text-center mt-3 mb-1">
                <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
              </p>
              {formData.tech_grades == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hide ">
                    <label htmlFor="tech_aplus" className="label">
                      {data?.payload?.tech_lang_keys["6"]} A+ ≥
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_aplus"
                        id="tech_aplus"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_aplus}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 md:col-span-6 lg:col-span-6 notHide">
                <label htmlFor="tech_a" className="label">
                  {data?.payload?.tech_lang_keys["6"]} A ≥
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_a"
                    id="tech_a"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_a}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_grades == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hide ">
                    <label htmlFor="tech_aminus" className="label">
                      {data?.payload?.tech_lang_keys["6"]} A- ≥
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_aminus"
                        id="tech_aminus"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_aminus}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hide ">
                    <label htmlFor="tech_bplus" className="label">
                      {data?.payload?.tech_lang_keys["6"]} B+ ≥
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bplus"
                        id="tech_bplus"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_bplus}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 md:col-span-6 lg:col-span-6 notHide">
                <label htmlFor="tech_b" className="label">
                  {data?.payload?.tech_lang_keys["6"]} B ≥
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_b"
                    id="tech_b"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_b}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_grades == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hide ">
                    <label htmlFor="tech_bminus" className="label">
                      {data?.payload?.tech_lang_keys["6"]} B- ≥
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bminus"
                        id="tech_bminus"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_bminus}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hide ">
                    <label htmlFor="tech_cplus" className="label">
                      {data?.payload?.tech_lang_keys["6"]} C+ ≥
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_cplus"
                        id="tech_cplus"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_cplus}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 md:col-span-6 lg:col-span-6 notHide">
                <label htmlFor="tech_c" className="label">
                  {data?.payload?.tech_lang_keys["6"]} C ≥
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_c"
                    id="tech_c"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_c}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_grades == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hide ">
                    <label htmlFor="tech_cminus" className="label">
                      {data?.payload?.tech_lang_keys["6"]} C- ≥
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_cminus"
                        id="tech_cminus"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_cminus}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hide ">
                    <label htmlFor="tech_dplus" className="label">
                      {data?.payload?.tech_lang_keys["6"]} D+ ≥
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_dplus"
                        id="tech_dplus"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_dplus}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 md:col-span-6 lg:col-span-6 notHide">
                <label htmlFor="tech_d" className="label">
                  {data?.payload?.tech_lang_keys["6"]} D ≥
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_d"
                    id="tech_d"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_d}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              {formData.tech_grades == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hide ">
                    <label htmlFor="tech_dminus" className="label">
                      {data?.payload?.tech_lang_keys["6"]} D- ≥
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_dminus"
                        id="tech_dminus"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_dminus}
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
                      <div className="w-full">
                        {/* First Table */}
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_per} %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_letter_ans}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_correct}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_correct}/{result?.tech_first}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Second Table */}
                        <div className="w-full mt-3 text-center overflow-auto">
                          <table className="w-full text-[16px]">
                            <thead className="bg-[#2845F5] text-white">
                              <tr>
                                <td className="py-2 border-b">
                                  <strong>
                                    # {data?.payload?.tech_lang_keys[11]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    # {data?.payload?.tech_lang_keys[12]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[6]} (%)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[13]}
                                  </strong>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {(result?.tech_q_array || [])
                                .slice(0, -1)
                                .map((q, i) => (
                                  <tr key={i}>
                                    <td className="py-2 border-b">{q}</td>
                                    <td className="py-2 border-b">
                                      {result?.tech_i_array[i]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_g_array[i]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_l_array[i]}
                                    </td>
                                  </tr>
                                ))}
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

export default TestGradeCalculator;
