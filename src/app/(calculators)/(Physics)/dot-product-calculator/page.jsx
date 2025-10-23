"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useDotProductCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DotProductCalculator = () => {
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
    tech_input1: "4,6,8,4,6,8,4,6,8",
    tech_input2: "3,4,5,4,6,8,4,6,8",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDotProductCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_input1 || !formData.tech_input2) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_input1: formData.tech_input1,
        tech_input2: formData.tech_input2,
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
      tech_input1: "4,6,8,4,6,8,4,6,8",
      tech_input2: "3,4,5,4,6,8,4,6,8",
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

  const components = result?.tech_components || [];
  const components2 = result?.tech_components2 || [];

  const mgntd_a = result?.tech_mgntd_a || "";
  const mgntd_b = result?.tech_mgntd_b || "";
  const prod = result?.tech_prod || "";
  const angle = result?.tech_angle || "";
  const deg = result?.tech_deg || "";

  const length = Math.min(components.length, components2.length);

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
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-4">
              <div className="col-span-12 ">
                <div className="py-2 flex text-[16px] items-center gap-3">
                  <label htmlFor="tech_input1" className="label">
                    u:
                  </label>
                  <div className=" relative flex">
                    {" "}
                    <span className="text-[33px] px-1">⟨</span>
                    <input
                      type="text"
                      step="any"
                      name="tech_input1"
                      id="tech_input1"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      required
                      value={formData.tech_input1}
                      onChange={handleChange}
                    />
                    <span className="text-[33px] px-1"> ⟩</span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 ">
                <div className="py-2 flex text-[16px] items-center gap-3">
                  <label htmlFor="tech_input2" className="label">
                    v:
                  </label>
                  <div className=" relative flex">
                    <span className="text-[33px] px-1">⟨</span>
                    <input
                      type="text"
                      step="any"
                      name="tech_input2"
                      id="tech_input2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      required
                      value={formData.tech_input2}
                      onChange={handleChange}
                    />
                    <span className="text-[33px] px-1"> ⟩</span>
                  </div>
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

                  <div className="w-full  md:p-5 p-1 rounded-xl mt-5">
                    <div className="text-base space-y-4 overflow-auto">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="py-2 font-semibold w-2/3">
                              {data?.payload?.tech_lang_keys["15"]} :
                            </td>
                            <td className="py-2">{prod}</td>
                          </tr>
                          <tr>
                            <td className="py-2 border-t">
                              {data?.payload?.tech_lang_keys["16"]} u =&gt; |u|
                            </td>
                            <td className="py-2 border-t">{mgntd_a}</td>
                          </tr>
                          <tr>
                            <td className="py-2 border-t">
                              {data?.payload?.tech_lang_keys["16"]} v =&gt; |v|
                            </td>
                            <td className="py-2 border-t">{mgntd_b}</td>
                          </tr>
                          <tr>
                            <td className="py-2 border-t">
                              {data?.payload?.tech_lang_keys["17"]} (α)
                            </td>
                            <td className="py-2 border-t">{deg} deg</td>
                          </tr>
                        </tbody>
                      </table>

                      <p className="text-blue-700 font-bold">
                        {data?.payload?.tech_lang_keys["20"]}:
                      </p>

                      <p className="font-semibold">
                        ⟨{components.join(", ")}⟩ + ⟨{components2.join(", ")}⟩
                      </p>

                      <BlockMath
                        math={`\\vec u \\cdot \\vec v = ${components
                          .map((c, i) => `(${c} * ${components2[i]})`)
                          .join(" + ")}`}
                      />
                      <BlockMath
                        math={`\\vec u \\cdot \\vec v = ${components
                          .map((c, i) => `(${c * components2[i]})`)
                          .join(" + ")}`}
                      />
                      <BlockMath math={`\\vec u \\cdot \\vec v = ${prod}`} />

                      <p className="font-bold">
                        {data?.payload?.tech_lang_keys["16"]} A:
                      </p>
                      <BlockMath
                        math={`|A| = \\sqrt{${components
                          .map((c) => `(${c})^2`)
                          .join(" + ")}}`}
                      />
                      <BlockMath math={`|A| = ${mgntd_a}`} />

                      <p className="font-bold">
                        {data?.payload?.tech_lang_keys["16"]} B:
                      </p>
                      <BlockMath
                        math={`|B| = \\sqrt{${components2
                          .map((c) => `(${c})^2`)
                          .join(" + ")}}`}
                      />
                      <BlockMath math={`|B| = ${mgntd_b}`} />

                      <p className="font-bold">
                        {data?.payload?.tech_lang_keys["17"]} A{" "}
                        {data?.payload?.tech_lang_keys["21"]} B:
                      </p>
                      <BlockMath
                        math={`\\cos\\theta = \\frac{${prod}}{${mgntd_a} \\cdot ${mgntd_b}}`}
                      />
                      <BlockMath math={`\\cos\\theta = ${angle}`} />
                      <BlockMath math={`\\theta = \\cos^{-1}(${angle})`} />
                      <BlockMath math={`\\theta = ${deg} \\text{ deg}`} />
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

export default DotProductCalculator;
