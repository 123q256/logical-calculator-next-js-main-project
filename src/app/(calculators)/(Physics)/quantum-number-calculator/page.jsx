"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useQuantumNumberCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const QuantumNumberCalculator = () => {
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
    tech_type: "principal", // principal  angular
    tech_value: 7,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useQuantumNumberCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type || !formData.tech_value) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_value: formData.tech_value,
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
      tech_type: "principal", // principal  angular
      tech_value: 7,
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12  mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="principal">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="angular">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                {formData.tech_type == "principal" && (
                  <>
                    <label htmlFor="tech_value" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                  </>
                )}
                {formData.tech_type == "angular" && (
                  <>
                    <label htmlFor="tech_value" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_value"
                    id="tech_value"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_value}
                    onChange={handleChange}
                  />
                </div>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 bg-white rounded-lg shadow-md space-y-6 result">
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      {result?.tech_type == "principal" && (
                        <>
                          <div className="w-full md:w-[100%] lg:w-[80%] overflow-auto mt-2">
                            <div className="mt-2">
                              {data?.payload?.tech_lang_keys["6"]}
                            </div>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[14px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="80%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[7]} (n)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_value}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="80%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[8]} (l)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_angular_momentum
                                      ? result.tech_angular_momentum
                                          .toString()
                                          .split("")
                                          .join(",")
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="80%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[9]} (m
                                      <sub>s</sub>)
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">-1/2, +1/2</td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="80%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_value * result?.tech_value}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="80%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {2 *
                                      result?.tech_value *
                                      result?.tech_value}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <p className="mt-4">
                            {data?.payload?.tech_lang_keys["12"]}
                          </p>

                          <div
                            className="col-12 col-lg-12 mt-2 overflow-auto"
                            dangerouslySetInnerHTML={{
                              __html: result?.tech_table || "",
                            }}
                          />
                        </>
                      )}
                      {result?.tech_type == "angular" && (
                        <>
                          <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                            <p className="mt-4">
                              {data?.payload?.tech_lang_keys["12"]}
                            </p>
                            <table className="w-full lg:text-[18px] md:text-[18px] text-[14px]">
                              <tr>
                                <td className="py-2 border-b" width="50%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]} (m
                                    <sub>l</sub>)
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {result?.tech_magnetic}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="50%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["14"]} (m
                                    <sub>s</sub>)
                                  </strong>
                                </td>
                                <td className="py-2 border-b"> -1/2, +1/2</td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="50%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {result?.tech_num_orbital}
                                </td>
                              </tr>
                            </table>
                          </div>
                        </>
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

export default QuantumNumberCalculator;
