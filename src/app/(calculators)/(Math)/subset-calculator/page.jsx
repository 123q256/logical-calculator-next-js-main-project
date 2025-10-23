"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useSubsetCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SubsetCalculator = () => {
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
    tech_cal_by: "elements", // elements  cardinality
    tech_set: "1,2,3,4,5",
    tech_cardinal: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSubsetCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal_by) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal_by: formData.tech_cal_by,
        tech_set: formData.tech_set,
        tech_cardinal: formData.tech_cardinal,
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
      tech_cal_by: "elements", // elements  cardinality
      tech_set: "1,2,3,4,5",
      tech_cardinal: 5,
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

  const ne = result?.tech_ne || [];
  const lang = data?.payload?.tech_lang_keys;

  const powersetRaw = result?.tech_pw || "";
  const sets = powersetRaw
    .replaceAll("},{", "}~{") // temporarily separate sets
    .split("~")
    .map((set) =>
      set === "{}"
        ? "\\left\\{\\right\\}" // empty set
        : `\\left\\{${set.replace(/[{}]/g, "")}\\right\\}`
    );

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 mb-1 flex items-center">
                <p className="font-s-14 text-blue pe-lg-2 pe-2">
                  {data?.payload?.tech_lang_keys["calculate"]}{" "}
                  {data?.payload?.tech_lang_keys["1"]}:
                </p>
                <p>
                  <label className="pe-2 cursor-pointer" htmlFor="elements">
                    <input
                      type="radio"
                      name="tech_cal_by"
                      value="elements"
                      id="elements"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_cal_by == "elements"}
                    />
                    <span>{data?.payload?.tech_lang_keys["2"]}</span>
                  </label>
                </p>
                <p>
                  <label className="pe-2 cursor-pointer" htmlFor="cardinality">
                    <input
                      type="radio"
                      name="tech_cal_by"
                      value="cardinality"
                      id="cardinality"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_cal_by == "cardinality"}
                    />
                    <span>{data?.payload?.tech_lang_keys["3"]}</span>
                  </label>
                </p>
              </div>
              {formData.tech_cal_by == "elements" && (
                <>
                  <div className="col-span-12 " id="setInput">
                    <label htmlFor="tech_set" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (,):
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_set"
                        id="tech_set"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                        value={formData.tech_set || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_cal_by == "cardinality" && (
                <>
                  <div className="col-span-12 " id="cardinalInput">
                    <label htmlFor="tech_cardinal" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_cardinal"
                        id="tech_cardinal"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_cardinal}
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
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>{lang["6"]}</strong>
                                </td>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={String(result?.tech_subsets)}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>{lang["7"]}</strong>
                                </td>
                                <td className="py-2 border-b">
                                  <InlineMath
                                    math={String(result?.tech_pro_subsets)}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>{lang["8"]}</strong>
                          </p>

                          {/* First element sentence */}
                          {ne.length > 0 && (
                            <p className="mt-2">
                              <strong>{ne[0]}</strong> {lang["9"]}{" "}
                              <strong>{lang["10"]}</strong> {lang["11"]}.
                            </p>
                          )}

                          {/* Remaining elements */}
                          {ne.slice(1).map((value, index) => (
                            <p className="mt-2" key={index}>
                              <strong>{value}</strong> {lang["9"]}{" "}
                              <strong>{index + 1}</strong> {lang["11"]}.
                            </p>
                          ))}
                        </div>

                        {result?.tech_pw && (
                          <div className="w-full text-[16px] overflow-auto">
                            <p className="mt-2">
                              <strong>{lang["6"]}</strong>
                            </p>
                            {sets.map((set, index) => (
                              <InlineMath
                                key={index}
                                math={
                                  set + (index < sets.length - 1 ? "," : "")
                                }
                              />
                            ))}
                          </div>
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

export default SubsetCalculator;
