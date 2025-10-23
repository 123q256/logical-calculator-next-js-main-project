"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWaccCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WaccCalculator = () => {
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
    tech_unit_type: "capm", //debt cd  capm
    tech_risk: 13,
    tech_beta: 13,
    tech_eq: 13,
    tech_tax: 13,
    tech_rate: 13,
    tech_a: 50000,
    tech_b: 9,
    tech_c: 30000,
    tech_d: 13,
    tech_e: 13,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWaccCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_unit_type == "capm") {
      if (
        !formData.tech_unit_type ||
        !formData.tech_a ||
        !formData.tech_b ||
        !formData.tech_c ||
        !formData.tech_d ||
        !formData.tech_e
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_unit_type == "cd") {
      if (
        !formData.tech_unit_type ||
        !formData.tech_risk ||
        !formData.tech_beta ||
        !formData.tech_eq
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_unit_type ||
        !formData.tech_rate ||
        !formData.tech_tax
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_risk: formData.tech_risk,
        tech_beta: formData.tech_beta,
        tech_eq: formData.tech_eq,
        tech_tax: formData.tech_tax,
        tech_rate: formData.tech_rate,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_d: formData.tech_d,
        tech_e: formData.tech_e,
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
      tech_unit_type: "capm", //debt cd  capm
      tech_risk: 13,
      tech_beta: 13,
      tech_eq: 13,
      tech_tax: 13,
      tech_rate: 13,
      tech_a: 50000,
      tech_b: 9,
      tech_c: 30000,
      tech_d: 13,
      tech_e: 13,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg ace-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[70%] md:w-[70%] w-full mx-auto ">
            <div className="col-12 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* WACC Calculator  Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "capm" ? "tagsUnit" : ""
                    }`}
                    id="capm"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "capm" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    WACC Calculator
                  </div>
                </div>
                {/* Cost of Equity Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "cd" ? "tagsUnit" : ""
                    }`}
                    id="cd"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "cd" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Cost of Equity
                  </div>
                </div>
                {/* Cost of Debt Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "debt" ? "tagsUnit" : ""
                    }`}
                    id="debt"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "debt" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Cost of Debt
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-3  gap-4">
              {formData.tech_unit_type == "capm" && (
                <div className="col-span-12 " id="test1">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_a" className="label">
                        {data?.payload?.tech_lang_keys["a"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_a"
                          id="tech_a"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_a}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_b" className="label">
                        {data?.payload?.tech_lang_keys["b"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_b"
                          id="tech_b"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_b}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_c" className="label">
                        {data?.payload?.tech_lang_keys["c"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_c"
                          id="tech_c"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_c}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_d" className="label">
                        {data?.payload?.tech_lang_keys["d"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_d"
                          id="tech_d"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_d}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_e" className="label">
                        {data?.payload?.tech_lang_keys["e"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_e"
                          id="tech_e"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_e}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {formData.tech_unit_type == "cd" && (
                <div className=" col-span-12  " id="test2">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <p className="col-span-12 px-2">
                      <strong>{data?.payload?.tech_lang_keys["capm"]}</strong>
                    </p>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_risk" className="label">
                        {data?.payload?.tech_lang_keys["risk"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_risk"
                          id="tech_risk"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_risk}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_beta" className="label">
                        {data?.payload?.tech_lang_keys["risk"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_beta"
                          id="tech_beta"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_beta}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_eq" className="label">
                        {data?.payload?.tech_lang_keys["erisk"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_eq"
                          id="tech_eq"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_eq}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {formData.tech_unit_type == "debt" && (
                <div className=" col-span-12  " id="test3">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <p className="col-span-12 px-2">
                      <strong>
                        {data?.payload?.tech_lang_keys["cd"]}{" "}
                        {data?.payload?.tech_lang_keys["calculator"]}
                      </strong>
                    </p>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_rate" className="label">
                        {data?.payload?.tech_lang_keys["int"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_rate"
                          id="tech_rate"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_rate}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_tax" className="label">
                        {data?.payload?.tech_lang_keys["int"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_tax"
                          id="tech_tax"
                          className="input my-2"
                          aria-label="input"
                          value={formData.tech_tax}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      {formData.tech_unit_type == "capm" ? (
                        <div className="w-full mt-2">
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["wacc"]}{" "}
                                    (WACC)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_wacc} %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["pfe"]} (PFE
                                    = E/V)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_pfe} %
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["pfd"]} (PFD
                                    = D/V)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_pfd} %
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : formData.tech_unit_type == "debt" ? (
                        <div className="w-full text-center text-[25px]">
                          <p>{data?.payload?.tech_lang_keys["eq"]}</p>
                          <p className="my-3">
                            <strong className="bg-sky px-3 py-2 bordered md:text-[30px] text-[18px] rounded-lg text-blue">
                              {result?.tech_eq ? result.tech_eq : "0.0"} %
                            </strong>
                          </p>
                        </div>
                      ) : formData.tech_unit_type == "cd" ? (
                        <div className="w-full text-center text-[25px]">
                          <p>{data?.payload?.tech_lang_keys["cd"]}</p>
                          <p className="my-3">
                            <strong className="bg-sky px-3 py-2 bordered md:text-[30px] text-[18px] rounded-lg text-blue">
                              {result?.tech_cd ? result.tech_cd : "0.0"} %
                            </strong>
                          </p>
                        </div>
                      ) : null}
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

export default WaccCalculator;
