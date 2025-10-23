"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import {
  useGetSingleCalculatorDetailsMutation,
  useCoefficientOfVariationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CoefficientOfVariationCalculator = () => {
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
    tech_x: "12, 23, 45, 33, 65, 54, 54",
    tech_type_: "2", // 1 2
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCoefficientOfVariationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_type_) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_type_: formData.tech_type_,
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
      tech_x: "12, 23, 45, 33, 65, 54, 54",
      tech_type_: "2", // 1 2
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

  const sum = result?.tech_arr?.reduce((acc, value) => {
    const diff = value - result?.tech_m;
    return acc + Math.pow(diff, 2);
  }, 0);

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
            <div className="grid grid-cols-1   gap-4">
              <div className="w-full raw { isset($_POST['form']) && $_POST['form']=='summary' ? 'd-none' : '' }">
                <div className="grid grid-cols-1   gap-4">
                  <div className="space-y-2 px-2">
                    <div className="pt-2 pb-3 md:flex  items-center">
                      <label className="pe-2" htmlFor="1">
                        <input
                          type="radio"
                          name="tech_type_"
                          value="1"
                          id="1"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_type_ === "1"}
                        />
                        <span>{data?.payload?.tech_lang_keys["sample"]}</span>
                      </label>
                      <label className="pe-2" htmlFor="2">
                        <input
                          type="radio"
                          name="tech_type_"
                          value="2"
                          id="2"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={formData.tech_type_ === "2"}
                        />
                        <span>{data?.payload?.tech_lang_keys["pop"]}</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2 raw_mean">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["x"]} (
                      {data?.payload?.tech_lang_keys["note_value"]})
                    </label>
                    <div className="w-full py-2">
                      <textarea
                        name="tech_x"
                        id="tech_x"
                        className="input textareaInput"
                        aria-label="textarea input"
                        placeholder="e.g. 12, 23, 45, 33, 65, 54, 54"
                        value={formData.tech_x || "2, 4, 6, 18, 10"}
                        onChange={handleChange}
                      />
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="row">
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["d"]}
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {result?.tech_c}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="w-full md:w-[90%] lg:w-[60%] mt-2">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <img
                                    src="/images/sample.webp"
                                    alt={data?.payload?.tech_lang_keys["a"]}
                                    loading="lazy"
                                    width="25"
                                    height="25"
                                  />
                                </td>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["a"]}
                                </td>
                                <td className="py-2 border-b">
                                  <b>{result?.tech_t_n ?? "0"}</b>
                                </td>
                              </tr>

                              <tr>
                                <td className="py-2 border-b">
                                  <img
                                    src="/images/mean.webp"
                                    alt={data?.payload?.tech_lang_keys["b"]}
                                    loading="lazy"
                                    width="25"
                                    height="25"
                                  />
                                </td>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["b"]}
                                </td>
                                <td className="py-2 border-b">
                                  <b>{result?.tech_m ?? "0"}</b>
                                </td>
                              </tr>

                              <tr>
                                <td className="py-2 border-b">
                                  <img
                                    src="/images/deviation.webp"
                                    alt={data?.payload?.tech_lang_keys["c"]}
                                    loading="lazy"
                                    width="25"
                                    height="25"
                                  />
                                </td>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["c"]}
                                </td>
                                <td className="py-2 border-b">
                                  <b>{result?.tech_d ?? "0"}</b>
                                </td>
                              </tr>

                              <tr>
                                <td className="py-2 border-b">
                                  <img
                                    src="/images/coeffi.webp"
                                    alt={data?.payload?.tech_lang_keys["d"]}
                                    loading="lazy"
                                    width="25"
                                    height="25"
                                  />
                                </td>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["d"]}
                                </td>
                                <td className="py-2 border-b">
                                  <b>{result?.tech_c ?? "0"}</b>
                                </td>
                              </tr>

                              <tr>
                                <td className="py-2 border-b">
                                  <img
                                    src="/images/coeffi.webp"
                                    alt={data?.payload?.tech_lang_keys["d"]}
                                    loading="lazy"
                                    width="25"
                                    height="25"
                                  />
                                </td>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["d"]} %
                                </td>
                                <td className="py-2 border-b">
                                  <b>
                                    {result?.tech_c
                                      ? `${(result.tech_c * 100).toFixed(2)} %`
                                      : "0 %"}
                                  </b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <>
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["1"]}
                              </strong>
                            </p>

                            <div>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["2"]} ={" "}
                                {formData?.tech_x}
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["3"]} ={" "}
                                {result?.tech_count}
                              </p>
                            </div>

                            <p className="mt-2">
                              <span className="mb-5">
                                {formData?.tech_type_ === 1 ? "x̄" : "μ"} =
                              </span>
                              <span className="fraction">
                                <span className="num">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </span>
                                <span className="visually-hidden"></span>
                                <span className="den">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </span>
                              </span>
                            </p>

                            <p>
                              <span className="mb-5">
                                {formData?.tech_type_ === 1 ? "x̄" : "μ"} =
                              </span>
                              <span className="fraction">
                                <span className="num">
                                  {result?.tech_replace}
                                </span>
                                <span className="visually-hidden"></span>
                                <span className="den">
                                  {result?.tech_count}
                                </span>
                              </span>
                            </p>

                            <p>
                              <span className="mb-5">
                                {formData?.tech_type_ === 1 ? "x̄" : "μ"} =
                              </span>
                              <span className="fraction">
                                <span className="num">{result?.tech_sum}</span>
                                <span className="visually-hidden"></span>
                                <span className="den">
                                  {result?.tech_count}
                                </span>
                              </span>
                            </p>

                            <p className="mt-2">
                              {formData?.tech_type_ === 1 ? "x̄" : "μ"} ={" "}
                              {result?.tech_m}
                            </p>
                          </>

                          <>
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys["1"]}
                              </strong>
                            </p>

                            <div>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["2"]} ={" "}
                                {formData?.tech_x}
                              </p>
                              <p className="mt-3">
                                {data?.payload?.tech_lang_keys["3"]} ={" "}
                                {result?.tech_count}
                              </p>
                            </div>

                            <p className="mt-2">
                              <span className="mb-5">
                                {formData?.tech_type_ === "1" ? "x̄" : "μ"} =
                              </span>
                              <span className="fraction">
                                <span className="num">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </span>{" "}
                                <span className="den">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </span>
                              </span>
                            </p>

                            <p>
                              {formData?.tech_type_ === "1" ? "x̄" : "μ"} =
                              <span className="fraction">
                                <span className="num">
                                  {result?.tech_replace}
                                </span>{" "}
                                <span className="den">
                                  {result?.tech_count}
                                </span>
                              </span>
                            </p>

                            <p>
                              {formData?.tech_type_ === "1" ? "x̄" : "μ"} =
                              <span className="fraction">
                                <span className="num">{result?.tech_sum}</span>{" "}
                                <span className="den">
                                  {result?.tech_count}
                                </span>
                              </span>
                            </p>

                            <p className="mt-2">
                              {formData?.tech_type_ === "1" ? "x̄" : "μ"} ={" "}
                              {result?.tech_m}
                            </p>

                            {formData?.tech_type_ === "1" ? (
                              <>
                                <p className="mt-4">
                                  <InlineMath
                                    math={
                                      "s = \\sqrt{\\frac{\\sum_{i=1}^{n}(x_i - \\bar{x})^2}{n-1}}"
                                    }
                                  />
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={
                                      "\\sum_{i=1}^{n} (x_i - \\bar{x})^2 ="
                                    }
                                  />{" "}
                                  {result?.tech_arr?.map((val, i) => (
                                    <span key={i}>
                                      ( {val} - {result?.tech_m} )²
                                      {i < result?.tech_arr.length - 1
                                        ? " + "
                                        : ""}
                                    </span>
                                  ))}
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={
                                      "\\sum_{i=1}^{n} (x_i - \\bar{x})^2 ="
                                    }
                                  />{" "}
                                  {result?.tech_arr?.map((val, i) => (
                                    <span key={i}>
                                      ( {val - result?.tech_m} )²
                                      {i < result?.tech_arr.length - 1
                                        ? " + "
                                        : ""}
                                    </span>
                                  ))}
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={`\\sum_{i=1}^{n} (x_i - \\bar{x})^2 = ${sum}`}
                                  />
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={`s = \\sqrt{\\frac{${sum}}{${result?.tech_count}-1}}`}
                                  />
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={`s = \\sqrt{${
                                      sum / (result?.tech_count - 1)
                                    }}`}
                                  />
                                </p>

                                <p className="mt-4">S.D = {result?.tech_d}</p>

                                <p>
                                  <span className="mb-5">
                                    {data?.payload?.tech_lang_keys["6"]} (CV) =
                                  </span>
                                  <span className="fraction">
                                    <span className="num">s</span>{" "}
                                    <span className="den">x̄</span>
                                  </span>
                                </p>

                                <p>
                                  CV ={" "}
                                  <span className="fraction">
                                    <span className="num">
                                      {result?.tech_d}
                                    </span>{" "}
                                    <span className="den">
                                      {result?.tech_m}
                                    </span>
                                  </span>
                                </p>

                                <p>CV = {result?.tech_c}</p>
                              </>
                            ) : (
                              <>
                                <p className="mt-4">
                                  <InlineMath
                                    math={
                                      "\\sigma = \\sqrt{\\frac{\\sum_{i=1}^{n}(x_i - \\mu)^2}{n}}"
                                    }
                                  />
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={"\\sum_{i=1}^{n} (x_i - \\mu)^2 ="}
                                  />{" "}
                                  {result?.tech_arr?.map((val, i) => (
                                    <span key={i}>
                                      ( {val} - {result?.tech_m} )²
                                      {i < result?.tech_arr.length - 1
                                        ? " + "
                                        : ""}
                                    </span>
                                  ))}
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={"\\sum_{i=1}^{n} (x_i - \\mu)^2 ="}
                                  />{" "}
                                  {result?.tech_arr?.map((val, i) => (
                                    <span key={i}>
                                      ( {val - result?.tech_m} )²
                                      {i < result?.tech_arr.length - 1
                                        ? " + "
                                        : ""}
                                    </span>
                                  ))}
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={`\\sum_{i=1}^{n} (x_i - \\mu)^2 = ${sum}`}
                                  />
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={`\\sigma = \\sqrt{\\frac{${sum}}{${result?.tech_count}}}`}
                                  />
                                </p>

                                <p className="mt-4">
                                  <InlineMath
                                    math={`\\sigma = \\sqrt{${
                                      sum / result?.tech_count
                                    }}`}
                                  />
                                </p>

                                <p className="mt-4">σ = {result?.tech_d}</p>

                                <p>
                                  <span className="mb-5">
                                    {data?.payload?.tech_lang_keys["6"]} (CV) =
                                  </span>
                                  <span className="fraction">
                                    <span className="num">σ</span>{" "}
                                    <span className="den">μ</span>
                                  </span>
                                </p>

                                <p>
                                  CV ={" "}
                                  <span className="fraction">
                                    <span className="num">
                                      {result?.tech_d}
                                    </span>{" "}
                                    <span className="den">
                                      {result?.tech_m}
                                    </span>
                                  </span>
                                </p>

                                <p>CV = {result?.tech_c}</p>
                              </>
                            )}
                          </>
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

export default CoefficientOfVariationCalculator;
