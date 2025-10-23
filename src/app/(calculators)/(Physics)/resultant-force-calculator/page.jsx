"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useResultantForceCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ResultantForceCalculator = () => {
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
    tech_force: [1, 3, 5, 7],
    tech_angle: [2, 4, 6, 8],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useResultantForceCalculatorMutation();

  const handleChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[field] = [...updated[field]];
      updated[field][index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_force: formData.tech_force,
        tech_angle: formData.tech_angle,
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
      tech_force: [1, 3, 5, 7],
      tech_angle: [2, 4, 6, 8],
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

  const handleAdd = () => {
    setFormData((prev) => ({
      tech_force: [...prev.tech_force, ""],
      tech_angle: [...prev.tech_angle, ""],
    }));
  };

  const handleRemove = (index) => {
    setFormData((prev) => ({
      tech_force: prev.tech_force.filter((_, i) => i !== index),
      tech_angle: prev.tech_angle.filter((_, i) => i !== index),
    }));
  };

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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto">
            {formData.tech_force.map((_, index) => (
              <div key={index} className="grid grid-cols-12 gap-2  p-2 rounded">
                <p key={index} className="col-span-12 text-[18px] px-2 ">
                  <strong># {index + 1}</strong>
                </p>
                <div className="col-span-6 px-2">
                  <label className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      className="input my-2"
                      placeholder="00"
                      value={formData.tech_force[index]}
                      onChange={(e) =>
                        handleChange(index, "tech_force", e.target.value)
                      }
                    />
                    <span className="input_unit">N</span>
                  </div>
                </div>
                <div className="col-span-6 px-2">
                  <div className="flex justify-between">
                    <div>
                      <label className="label">
                        {data?.payload?.tech_lang_keys["3"]}:
                      </label>
                    </div>
                    <div>
                      {formData.tech_force.length > 1 && (
                        <div className="col-span-12 flex justify-end px-2 mt-1">
                          <img
                            src="/images/delete_btn.png"
                            alt="delte"
                            className="w-4 h-4"
                            onClick={() => handleRemove(index)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      className="input my-2"
                      placeholder="00"
                      value={formData.tech_angle[index]}
                      onChange={(e) =>
                        handleChange(index, "tech_angle", e.target.value)
                      }
                    />
                    <span className="input_unit">deg</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-span-12 flex justify-end px-2 mt-3">
              <button
                type="button"
                onClick={handleAdd}
                className="bg-[#2845F5] cursor-pointer border rounded-lg px-4 py-1"
              >
                <strong className="text-white">
                  <span className="text-[18px] text-blue">+</span> &nbsp;Add
                </strong>
              </button>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] px-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_Horizontal).toFixed(2)}{" "}
                                    N
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_Vertical).toFixed(2)} N
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_Magnitude).toFixed(2)}{" "}
                                    N
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(result?.tech_Direction).toFixed(2)}{" "}
                                    °
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="col-12 mt-3 px-2">
                          <strong>{data?.payload?.tech_lang_keys["8"]}</strong>
                        </p>
                        <div className="w-full md:w-[80%] lg:w-[60%] px-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_Magnitude * 0.001
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_Magnitude * 0.2248
                                    ).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2 border-b">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="p-2 border-b">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_Magnitude * 100000
                                    ).toFixed(2)}
                                  </strong>
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

export default ResultantForceCalculator;
