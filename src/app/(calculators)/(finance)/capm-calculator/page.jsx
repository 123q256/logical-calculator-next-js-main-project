"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCapmCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CapmCalculator = () => {
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
    tech_cal: "Rm", // Bi  R  Rf  Rm
    tech_rf: "50",
    tech_rm: "50",
    tech_bi: "50",
    tech_r: "50",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCapmCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal || !formData.tech_cal) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal: formData.tech_cal,
        tech_rf: formData.tech_rf,
        tech_rm: formData.tech_rm,
        tech_bi: formData.tech_bi,
        tech_r: formData.tech_r,
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
      tech_cal: "Rm", // Bi  R  Rf  Rm
      tech_rf: "50",
      tech_rm: "50",
      tech_bi: "50",
      tech_r: "50",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_cal" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal"
                    id="tech_cal"
                    value={formData.tech_cal}
                    onChange={handleChange}
                  >
                    <option value="R">
                      {data?.payload?.tech_lang_keys["2"]} (R)
                    </option>
                    <option value="Bi">
                      {data?.payload?.tech_lang_keys["3"]} (βᵢ)
                    </option>
                    <option value="Rf">
                      {data?.payload?.tech_lang_keys["4"]} (Rf)
                    </option>
                    <option value="Rm">
                      {data?.payload?.tech_lang_keys["5"]} (Rm)
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_cal == "R" && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rfx"
                  >
                    <label htmlFor="tech_rf" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (Rf)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rf"
                        id="tech_rf"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_rf}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rmx"
                  >
                    <label htmlFor="tech_rm" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (Rm)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rm"
                        id="tech_rm"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_rm}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="bix"
                  >
                    <label htmlFor="tech_bi" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (βi)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bi"
                        id="tech_bi"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_bi}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_cal == "Bi" && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rx"
                  >
                    <label htmlFor="tech_r" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (R)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_r"
                        id="tech_r"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_r}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rfx"
                  >
                    <label htmlFor="tech_rf" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (Rf)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rf"
                        id="tech_rf"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_rf}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rmx"
                  >
                    <label htmlFor="tech_rm" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (Rm)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rm"
                        id="tech_rm"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_rm}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_cal == "Rf" && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rx"
                  >
                    <label htmlFor="tech_r" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (R)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_r"
                        id="tech_r"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_r}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>

                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rmx"
                  >
                    <label htmlFor="tech_rm" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (Rm)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rm"
                        id="tech_rm"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_rm}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="bix"
                  >
                    <label htmlFor="tech_bi" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (βi)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bi"
                        id="tech_bi"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_bi}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_cal == "Rm" && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rx"
                  >
                    <label htmlFor="tech_r" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (R)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_r"
                        id="tech_r"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_r}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="rfx"
                  >
                    <label htmlFor="tech_rf" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (Rf)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_rf"
                        id="tech_rf"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_rf}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>

                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="bix"
                  >
                    <label htmlFor="tech_bi" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (βi)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bi"
                        id="tech_bi"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_bi}
                        onChange={handleChange}
                      />
                    </div>
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
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        <table className="w-100 font-s-18">
                          <tr>
                            <td className="py-2 border-b" width="70%">
                              <strong>
                                {result?.tech_cal == "R"
                                  ? data?.payload?.tech_lang_keys["6"]
                                  : result?.tech_cal == "Bi"
                                  ? data?.payload?.tech_lang_keys["7"]
                                  : result?.tech_cal == "Rf"
                                  ? data?.payload?.tech_lang_keys["8"]
                                  : result?.tech_cal == "Rm"
                                  ? data?.payload?.tech_lang_keys["9"]
                                  : null}
                              </strong>
                            </td>
                            <td className="py-2 border-b">
                              {result?.tech_cal == "R"
                                ? result?.tech_R
                                : result?.tech_cal == "Bi"
                                ? result?.tech_Bi
                                : result?.tech_cal == "Rf"
                                ? result?.tech_Rf
                                : result?.tech_cal == "Rm"
                                ? result?.tech_Rm
                                : null}
                              %
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div className="w-full  text-[16px]">
                        <div className="col s12 margin_top_10">
                          <p className="mt-4">
                            <strong>
                              {data?.payload?.tech_lang_keys["10"]}:
                            </strong>
                          </p>
                          {result?.tech_cal == "R" && (
                            <div>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["6"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} = Rf + Bi
                                * (Rm - Rf)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {result?.tech_Rf} + {result?.tech_Bi} * (
                                {result?.tech_Rm} − {result?.tech_Rf})
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {result?.tech_Rf} + ({result?.tech_Bi} *{" "}
                                {result?.tech_Emp})
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {result?.tech_Rf} + {result?.tech_Rp} ={" "}
                                <strong>{result?.tech_R}%</strong>
                              </p>
                            </div>
                          )}

                          {result?.tech_cal == "Bi" && (
                            <div>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["12"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["13"]} = (R - Rf)
                                / (Rm - Rf)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["13"]} = (
                                {result?.tech_R} - {result?.tech_Rf}) / (
                                {result?.tech_Rm} − {result?.tech_Rf})
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["13"]} ={" "}
                                {result?.tech_s1} / {result?.tech_Emp} ={" "}
                                <strong>{result?.tech_Bi}%</strong>
                              </p>
                            </div>
                          )}

                          {result?.tech_cal == "Rf" && (
                            <div>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["14"]} = ((Bi *
                                Rm) - R) / (Bi - 1)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["14"]} = ((
                                {result?.tech_Bi} * {result?.tech_Rm}) -{" "}
                                {result?.tech_R}) / ({result?.tech_Bi} − 1)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["14"]} = (
                                {result?.tech_s1} - {result?.tech_R}) / (
                                {result?.tech_Bi} − 1)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["14"]} ={" "}
                                {result?.tech_s2} / {result?.tech_s3} ={" "}
                                <strong>{result?.tech_Rf}%</strong>
                              </p>
                            </div>
                          )}

                          {result?.tech_cal == "Rm" && (
                            <div>
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["15"]} = (Rf *
                                (Bi - 1) + R) / Bi
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["15"]} = (
                                {result?.tech_Rf} * ({result?.tech_Bi} - 1) +{" "}
                                {result?.tech_R}) / {result?.tech_Bi}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["15"]} = ((
                                {result?.tech_Rf} * {result?.tech_s1}) +{" "}
                                {result?.tech_R}) / {result?.tech_Bi}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["15"]} = (
                                {result?.tech_s2} + {result?.tech_R}) /{" "}
                                {result?.tech_Bi}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["15"]} ={" "}
                                {result?.tech_s3} / {result?.tech_Bi} ={" "}
                                <strong>{result?.tech_Rm}%</strong>
                              </p>
                            </div>
                          )}

                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["16"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["17"]} = Bi * (Rm -
                            Rf)
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["17"]} ={" "}
                            {result?.tech_Bi} * ({result?.tech_Rm} −{" "}
                            {result?.tech_Rf}) ={" "}
                            <strong>{result?.tech_Rp}%</strong>
                          </p>
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["18"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["18"]} = Rm - Rf
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["18"]} ={" "}
                            {result?.tech_Rm} − {result?.tech_Rf} ={" "}
                            <strong>{result?.tech_Emp}%</strong>
                          </p>
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["19"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["11"]} = (Rf + Bi *
                            (Rm - Rf)) + ((Rm * Bi) / Rf)
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["11"]} = (
                            {result?.tech_Rf} + {result?.tech_Bi} * (
                            {result?.tech_Rm} − {result?.tech_Rf})) + ((
                            {result?.tech_Rm} * {result?.tech_Bi}) /{" "}
                            {result?.tech_Rf})
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["11"]} ={" "}
                            {result?.tech_R} + {result?.tech_Rmr} ={" "}
                            <strong>{result?.tech_Rmrp}%</strong>
                          </p>
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

export default CapmCalculator;
