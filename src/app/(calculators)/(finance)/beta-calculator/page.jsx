"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBetaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

// import {
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BetaCalculator = () => {
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
    tech_rs: "1, 13, 5, 7, 9",
    tech_rm: "2, 4, 6, 18, 10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBetaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_rs || !formData.tech_rm) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_rs: formData.tech_rs,
        tech_rm: formData.tech_rm,
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
      tech_rs: "1, 13, 5, 7, 9",
      tech_rm: "2, 4, 6, 18, 10",
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 ">
                <label htmlFor="tech_rs" className="label">
                  {data?.payload?.tech_lang_keys["company"]} (,):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_rs"
                    id="tech_rs"
                    className="input textareaInput h-25"
                    aria-label="textarea input"
                    placeholder="1, 13, 5, 7, 9"
                    value={formData.tech_rs || "1, 13, 5, 7, 9"}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 ">
                <label htmlFor="tech_rm" className="label">
                  {data?.payload?.tech_lang_keys["market"]} (,):
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_rm"
                    id="tech_rm"
                    className="input textareaInput h-25"
                    aria-label="textarea input"
                    placeholder="2, 4, 6, 18, 10"
                    value={formData.tech_rm || "2, 4, 6, 18, 10"}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      {/* Destructuring data from result */}
                      {(() => {
                        const {
                          tech_n: n,
                          tech_rs: rs,
                          tech_rm: rm,
                          tech_rs_sum: rs_sum,
                          tech_rm_sum: rm_sum,
                          tech_xi2: xi2,
                          tech_yi2: yi2,
                          tech_xi2_sum: xi2_sum,
                          tech_yi2_sum: yi2_sum,
                          tech_xy_sum: xy_sum,
                          tech_ss_xx: ss_xx,
                          tech_ss_yy: ss_yy,
                          tech_ss_xy: ss_xy,
                          tech_beta_1: beta_1,
                        } = result || {};

                        return (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>β</strong>
                                    </td>
                                    <td className="py-2 border-b">{beta_1}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="w-full text-[16px]">
                              <p className="mt-4">
                                <b>
                                  {data?.payload?.tech_lang_keys?.solution} :
                                </b>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys?.statement1}:
                              </p>

                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <b>Obs.</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>rM</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>rS</b>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rm?.map((value, index) => (
                                    <tr key={index}>
                                      <td className="py-2 border-b">
                                        {index + 1}
                                      </td>
                                      <td className="py-2 border-b">{value}</td>
                                      <td className="py-2 border-b">
                                        {rs?.[index]}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys?.statement2}:
                              </p>

                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <b>Obs.</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>rM</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>rS</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>Xᵢ²</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>Yᵢ²</b>
                                    </td>
                                    <td className="py-2 border-b">
                                      <b>Xᵢ · Yᵢ</b>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rm?.map((xi, index) => {
                                    const yi = rs?.[index] || 0;
                                    return (
                                      <tr key={index}>
                                        <td className="py-2 border-b">
                                          {index + 1}
                                        </td>
                                        <td className="py-2 border-b">{xi}</td>
                                        <td className="py-2 border-b">{yi}</td>
                                        <td className="py-2 border-b">
                                          {xi2?.[index]}
                                        </td>
                                        <td className="py-2 border-b">
                                          {yi2?.[index]}
                                        </td>
                                        <td className="py-2 border-b">
                                          {xi * yi}
                                        </td>
                                      </tr>
                                    );
                                  })}

                                  <tr>
                                    <td className="py-2 border-b">Sum</td>
                                    <td className="py-2 border-b">{rm_sum}</td>
                                    <td className="py-2 border-b">{rs_sum}</td>
                                    <td className="py-2 border-b">{xi2_sum}</td>
                                    <td className="py-2 border-b">{yi2_sum}</td>
                                    <td className="py-2 border-b">{xy_sum}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        );
                      })()}
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

export default BetaCalculator;
