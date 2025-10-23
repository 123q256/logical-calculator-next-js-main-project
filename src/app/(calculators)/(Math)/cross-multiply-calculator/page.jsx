"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useCrossMultiplyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CrossMultiplyCalculator = () => {
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
    tech_a: "1",
    tech_b: "13",
    tech_c: "2",
    tech_d: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCrossMultiplyCalculatorMutation();

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
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_d: formData.tech_d,
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
      tech_a: "1",
      tech_b: "13",
      tech_c: "2",
      tech_d: "",
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

  const a = formData?.tech_a;
  const b = formData?.tech_b;
  const c = formData?.tech_c;
  const d = formData?.tech_d;

  const getEquation = () => {
    if (result?.tech_a_val != undefined) {
      return (
        <>
          <BlockMath math={`\\frac{A}{${b}} = \\frac{${c}}{${d}}`} />
          <BlockMath math={`A \\times ${d} = ${c} \\times ${b}`} />
          <BlockMath math={`A = \\frac{${c} \\times ${b}}{${d}}`} />
          <BlockMath math={`A = \\frac{${c * b}}{${d}}`} />
          <BlockMath math={`A = ${result.tech_a_val.toFixed(5)}`} />
        </>
      );
    } else if (result?.tech_b_val != undefined) {
      return (
        <>
          <BlockMath math={`\\frac{${a}}{B} = \\frac{${c}}{${d}}`} />
          <BlockMath math={`${a} \\times ${d} = ${c} \\times B`} />
          <BlockMath math={`B = \\frac{${a} \\times ${d}}{${c}}`} />
          <BlockMath math={`B = \\frac{${a * d}}{${c}}`} />
          <BlockMath math={`B = ${result.tech_b_val.toFixed(5)}`} />
        </>
      );
    } else if (result?.tech_c_val != undefined) {
      return (
        <>
          <BlockMath math={`\\frac{${a}}{${b}} = \\frac{C}{${d}}`} />
          <BlockMath math={`${a} \\times ${d} = C \\times ${b}`} />
          <BlockMath math={`C = \\frac{${a} \\times ${d}}{${b}}`} />
          <BlockMath math={`C = \\frac{${a * d}}{${b}}`} />
          <BlockMath math={`C = ${result.tech_c_val.toFixed(5)}`} />
        </>
      );
    } else if (result?.tech_d_val != undefined) {
      return (
        <>
          <BlockMath math={`\\frac{${a}}{${b}} = \\frac{${c}}{D}`} />
          <BlockMath math={`${a} \\times D = ${c} \\times ${b}`} />
          <BlockMath math={`D = \\frac{${b} \\times ${c}}{${a}}`} />
          <BlockMath math={`D = \\frac{${b * c}}{${a}}`} />
          <BlockMath math={`D = ${result.tech_d_val.toFixed(5)}`} />
        </>
      );
    }
    return <p>No result available</p>;
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 text-center flex items-center justify-center">
                <p className="text-[32px]">
                  <strong>
                    <span className="quadratic_fraction">
                      <span className="num">A</span>
                      <span>B</span>
                    </span>{" "}
                    =
                    <span className="quadratic_fraction">
                      <span className="num">C</span>
                      <span>D</span>
                    </span>
                  </strong>
                </p>
              </div>

              <div className="col-span-12">
                <div className="col-lg-10">
                  <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                    <div className="col-span-6">
                      <label htmlFor="tech_a" className="label">
                        A:
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
                    <div className="col-span-6">
                      <label htmlFor="tech_c" className="label">
                        C:
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
                    <div className="col-span-6">
                      <label htmlFor="tech_b" className="label">
                        B:
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
                    <div className="col-span-6">
                      <label htmlFor="tech_d" className="label">
                        D:
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
                      </div>
                    </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center mt-3">
                    <div className="w-full overflow-auto">
                      <p className="md:text-[18px] font-bold mb-2">
                        {data?.payload?.tech_lang_keys["2"]}
                      </p>
                      {getEquation()}
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

export default CrossMultiplyCalculator;
