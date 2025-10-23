"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";
import { useSubstitutionMethodCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SubstitutionCalculator = () => {
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
    tech_operations: "1", // 1 2
    tech_a1_f: "1",
    tech_b1_f: "3",
    tech_k1_f: "5",
    tech_a2_f: "7",
    tech_b2_f: "9",
    tech_k2_f: "11",
    tech_a1_s: "1",
    tech_b1_s: "2",
    tech_c1_s: "3",
    tech_k1_s: "4",
    tech_a2_s: "5",
    tech_b2_s: "6",
    tech_c2_s: "7",
    tech_k2_s: "8",
    tech_a3_s: "9",
    tech_b3_s: "10",
    tech_c3_s: "11",
    tech_k3_s: "12",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSubstitutionMethodCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_a1_f: formData.tech_a1_f,
        tech_b1_f: formData.tech_b1_f,
        tech_k1_f: formData.tech_k1_f,
        tech_a2_f: formData.tech_a2_f,
        tech_b2_f: formData.tech_b2_f,
        tech_k2_f: formData.tech_k2_f,
        tech_a1_s: formData.tech_a1_s,
        tech_b1_s: formData.tech_b1_s,
        tech_c1_s: formData.tech_c1_s,
        tech_k1_s: formData.tech_k1_s,
        tech_a2_s: formData.tech_a2_s,
        tech_b2_s: formData.tech_b2_s,
        tech_c2_s: formData.tech_c2_s,
        tech_k2_s: formData.tech_k2_s,
        tech_a3_s: formData.tech_a3_s,
        tech_b3_s: formData.tech_b3_s,
        tech_c3_s: formData.tech_c3_s,
        tech_k3_s: formData.tech_k3_s,
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
      tech_operations: "1", // 1 2
      tech_a1_f: "1",
      tech_b1_f: "3",
      tech_k1_f: "5",
      tech_a2_f: "7",
      tech_b2_f: "9",
      tech_k2_f: "11",
      tech_a1_s: "1",
      tech_b1_s: "2",
      tech_c1_s: "3",
      tech_k1_s: "4",
      tech_a2_s: "5",
      tech_b2_s: "6",
      tech_c2_s: "7",
      tech_k2_s: "8",
      tech_a3_s: "9",
      tech_b3_s: "10",
      tech_c3_s: "11",
      tech_k3_s: "12",
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

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="md:col-span-8 col-span-12 ">
                <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12 ">
                    <label htmlFor="tech_operations" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations"
                        id="tech_operations"
                        value={formData.tech_operations}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["2"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  {formData.tech_operations == "1" && (
                    <>
                      <div className="col-span-12  math_1">
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-4">
                            <label for="a1_f" className="font-s-14 text-blue">
                              a<sub className="font-s-14 text-blue">1</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_a1_f"
                                id="tech_a1_f"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a1_f}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <label for="b1_f" className="font-s-14 text-blue">
                              b<sub className="font-s-14 text-blue">1</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_b1_f"
                                id="tech_b1_f"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b1_f}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <label for="k1_f" className="font-s-14 text-blue">
                              k<sub className="font-s-14 text-blue">1</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_k1_f"
                                id="tech_k1_f"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_k1_f}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <label for="a2_f" className="font-s-14 text-blue">
                              a<sub className="font-s-14 text-blue">2</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_a2_f"
                                id="tech_a2_f"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a2_f}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <label for="b2_f" className="font-s-14 text-blue">
                              b<sub className="font-s-14 text-blue">2</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_b2_f"
                                id="tech_b2_f"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b2_f}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-4">
                            <label for="k2_f" className="font-s-14 text-blue">
                              k<sub className="font-s-14 text-blue">2</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_k2_f"
                                id="tech_k2_f"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_k2_f}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_operations == "2" && (
                    <>
                      <div className="col-span-12  math_2">
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-3">
                            <label for="a1_s" className="font-s-14 text-blue">
                              a<sub className="font-s-14 text-blue">1</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_a1_s"
                                id="tech_a1_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a1_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="b1_s" className="font-s-14 text-blue">
                              b<sub className="font-s-14 text-blue">1</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_b1_s"
                                id="tech_b1_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b1_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="c1_s" className="font-s-14 text-blue">
                              c<sub className="font-s-14 text-blue">1</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_c1_s"
                                id="tech_c1_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_c1_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="k1_s" className="font-s-14 text-blue">
                              k<sub className="font-s-14 text-blue">1</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_k1_s"
                                id="tech_k1_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_k1_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="a2_s" className="font-s-14 text-blue">
                              a<sub className="font-s-14 text-blue">2</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_a2_s"
                                id="tech_a2_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a2_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="b2_s" className="font-s-14 text-blue">
                              b<sub className="font-s-14 text-blue">2</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_b2_s"
                                id="tech_b2_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b2_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="c2_s" className="font-s-14 text-blue">
                              c<sub className="font-s-14 text-blue">2</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_c2_s"
                                id="tech_c2_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_c2_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="k2_s" className="font-s-14 text-blue">
                              k<sub className="font-s-14 text-blue">2</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_k2_s"
                                id="tech_k2_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_k2_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="a3_s" className="font-s-14 text-blue">
                              a<sub className="font-s-14 text-blue">3</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_a3_s"
                                id="tech_a3_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a3_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="b3_s" className="font-s-14 text-blue">
                              b<sub className="font-s-14 text-blue">3</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_b3_s"
                                id="tech_b3_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b3_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="c3_s" className="font-s-14 text-blue">
                              c<sub className="font-s-14 text-blue">3</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_c3_s"
                                id="tech_c3_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_c3_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label for="k3_s" className="font-s-14 text-blue">
                              k<sub className="font-s-14 text-blue">3</sub>
                            </label>
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_k3_s"
                                id="tech_k3_s"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_k3_s}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="md:col-span-4 col-span-12  text-[20px] flex items-center justify-center">
                {formData.tech_operations == "1" && (
                  <>
                    <div className="col-12  math_1">
                      <p>
                        <strong>
                          a<sub className="font-s-16">1</sub> x + b
                          <sub className="font-s-16">1</sub>y = k
                          <sub className="font-s-16">1</sub>
                        </strong>
                      </p>
                      <p className="mt-1">
                        <strong>
                          a<sub className="font-s-16">2</sub> x + b
                          <sub className="font-s-16">2</sub>y = k
                          <sub className="font-s-16">2</sub>
                        </strong>
                      </p>
                    </div>
                  </>
                )}

                {formData.tech_operations == "2" && (
                  <>
                    <div className="col-12  math_2">
                      <p>
                        <strong>
                          a<sub className="font-s-16">1</sub> x + b
                          <sub className="font-s-16">1</sub>y + c
                          <sub className="font-s-16">1</sub>z = k
                          <sub className="font-s-16">1</sub>
                        </strong>
                      </p>
                      <p className="mt-1">
                        <strong>
                          a<sub className="font-s-16">2</sub> x + b
                          <sub className="font-s-16">2</sub>y + c
                          <sub className="font-s-16">2</sub>z = k
                          <sub className="font-s-16">2</sub>
                        </strong>
                      </p>
                      <p className="mt-1">
                        <strong>
                          a<sub className="font-s-16">3</sub> x + b
                          <sub className="font-s-16">3</sub>y + c
                          <sub className="font-s-16">3</sub>z = k
                          <sub className="font-s-16">3</sub>
                        </strong>
                      </p>
                    </div>
                  </>
                )}
              </div>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {formData?.tech_operations === "1" ? (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="35%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{result?.tech_main_ans}</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="w-full text-[16px]">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[5]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[6]}:
                              </p>
                              <p className="mt-2">{result?.tech_f1_equation}</p>
                              <p className="mt-2">{result?.tech_f2_equation}</p>
                              <p className="mt-2">{result?.tech_first}</p>
                              <p className="mt-2">{result?.tech_second}</p>
                              <p className="mt-2">{result?.tech_third}</p>
                              <p className="mt-2">{result?.tech_four}</p>
                              <p className="mt-2">{result?.tech_five}</p>
                              <p className="mt-2">{result?.tech_six}</p>
                              {result?.tech_seven && (
                                <>
                                  <p className="mt-2">{result?.tech_seven}</p>
                                </>
                              )}
                              <p className="mt-2">{result?.tech_answer1}</p>
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_answer2,
                                }}
                              />
                              <p className="mt-2">{result?.tech_answer3}</p>
                              <p className="mt-2">{result?.tech_answer4}</p>
                              <p className="mt-2">{result?.tech_answer5}</p>
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_answer6,
                                }}
                              />
                              <p className="mt-2">{result?.tech_answer7}</p>
                              <p className="mt-2">{result?.tech_answer8}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full text-center text-[20px] overflow-auto">
                              <p>{data?.payload?.tech_lang_keys[4]}</p>
                              <p className="font-s-16">{result?.tech_s_fans}</p>
                              {result?.tech_s_fans2 && (
                                <>
                                  <div className="flex justify-center">
                                    <p className="bg-[#2845F5] px-3 py-2 rounded-lg text-white">
                                      {result?.tech_s_fans2}
                                    </p>
                                  </div>
                                </>
                              )}
                              {result?.tech_s_fans3 && (
                                <>
                                  <p className="my-3 font-s-16">
                                    {result?.tech_s_fans3}
                                  </p>
                                </>
                              )}
                              {result?.tech_s_fans4 && (
                                <>
                                  <p className="my-3 font-s-16">
                                    {result?.tech_s_fans4}
                                  </p>
                                </>
                              )}
                            </div>
                          </>
                        )}
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

export default SubstitutionCalculator;
