"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePermutationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PermutationCalculator = () => {
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
    tech_name: 1,
    tech_n: 6,
    tech_r: 2,
    tech_find: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePermutationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_name ||
      !formData.tech_n ||
      !formData.tech_r ||
      !formData.tech_find
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_name: formData.tech_name,
        tech_n: formData.tech_n,
        tech_r: formData.tech_r,
        tech_find: formData.tech_find,
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
      tech_name: 1,
      tech_n: 6,
      tech_r: 2,
      tech_find: "1",
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-1">
              <div className="col-span-12 px-2">
                <label htmlFor="tech_name" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_name"
                    id="tech_name"
                    value={formData.tech_name}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 px-2">
                {formData.tech_name == "0" && (
                  <>
                    <label htmlFor="tech_n" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:{" "}
                    </label>
                  </>
                )}
                {formData.tech_name == "1" && (
                  <>
                    <label htmlFor="tech_n" className="label">
                      How many different numbers are possible?{" "}
                    </label>
                  </>
                )}
                {formData.tech_name == "2" && (
                  <>
                    <label htmlFor="tech_n" className="label">
                      How many different balls can be selected?{" "}
                    </label>
                  </>
                )}
                {formData.tech_name == "3" && (
                  <>
                    <label htmlFor="tech_n" className="label">
                      How many different Objects are there?{" "}
                    </label>
                  </>
                )}

                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_n"
                    id="tech_n"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_n}
                    onChange={handleChange}
                  />
                  <span className="input_unit">(n)</span>
                </div>
              </div>
              <div className="col-span-12 px-2">
                {formData.tech_name == "0" && (
                  <>
                    <label htmlFor="tech_r" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:{" "}
                    </label>
                  </>
                )}
                {formData.tech_name == "1" && (
                  <>
                    <label htmlFor="tech_r" className="label">
                      How many numbers are used?{" "}
                    </label>
                  </>
                )}
                {formData.tech_name == "2" && (
                  <>
                    <label htmlFor="tech_r" className="label">
                      How many balls do you select?{" "}
                    </label>
                  </>
                )}
                {formData.tech_name == "3" && (
                  <>
                    <label htmlFor="tech_r" className="label">
                      How many Objects will you choose?{" "}
                    </label>
                  </>
                )}

                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_r"
                    id="tech_r"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_r}
                    onChange={handleChange}
                  />
                  <span className="input_unit">(r)</span>
                </div>
              </div>
              <div className="col-span-12 px-2">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["12"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="2">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                  </select>
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full">
                      {result?.tech_perms ? (
                        <>
                          <div className="text-center">
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_perm}
                                </strong>
                              </p>
                            </div>
                          </div>

                          {result?.tech_show_steps ? (
                            <>
                              <p className="w-full mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}
                                </strong>
                              </p>
                              <p className="w-full mt-2">
                                P(n, r) = n! / (n - r)!
                              </p>

                              <p className="w-full mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["12"]} n!
                                </strong>
                              </p>
                              <p className="w-full mt-2">
                                {result?.tech_n}! = {result?.tech_s1}
                              </p>
                              <p className="w-full mt-2">
                                {result?.tech_n}! = {result?.tech_n_fact}
                              </p>

                              <p className="w-full mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["12"]} (n - r)!
                                </strong>
                              </p>
                              <p className="w-full mt-2">
                                (n - r)! = ({result?.tech_n} - {result?.tech_r}
                                )! = {result?.tech_nr}
                              </p>
                              <p className="w-full mt-2">
                                {result?.tech_nr}! = {result?.tech_s2}
                              </p>
                              <p className="w-full mt-2">
                                {result?.tech_nr}! = {result?.tech_nr_fact}
                              </p>

                              <p className="w-full mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>
                              <p className="w-full mt-2">
                                P(n, r) = n! / (n - r)!
                              </p>
                              <p className="w-full mt-2">
                                P({result?.tech_n}, {result?.tech_r}) ={" "}
                                {result?.tech_n_fact} / {result?.tech_nr_fact}
                              </p>
                              <p className="w-full mt-2">
                                <strong>
                                  P({result?.tech_n}, {result?.tech_r}) ={" "}
                                  {result?.tech_perm}
                                </strong>
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="w-full mt-2">
                                P(n, r) = n! / (n - r)!
                              </p>
                              <p className="w-full mt-2">
                                P({result?.tech_n}, {result?.tech_r}) ={" "}
                                {result?.tech_n}! / ({result?.tech_n} -{" "}
                                {result?.tech_r})!
                              </p>
                              <p className="w-full mt-2">
                                <strong>
                                  P({result?.tech_n}, {result?.tech_r}) ={" "}
                                  {result?.tech_perm}
                                </strong>
                              </p>
                            </>
                          )}
                        </>
                      ) : result?.tech_p_w_r ? (
                        <>
                          <div className="text-center">
                            <p className="text-[20px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_perm_rep}
                                </strong>
                              </p>
                            </div>
                          </div>
                          <p className="col-12 mt-3 text-[20px]">
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys["10"]}:
                            </strong>
                          </p>
                          <p className="w-full mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["14"]}
                            </strong>
                          </p>
                          <p className="w-full mt-2">
                            <span className="text_set">P</span>(n, r) = n
                            <sup>r</sup>
                          </p>
                          <p className="w-full mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"]} n
                              <sup>r</sup>
                            </strong>
                          </p>
                          <p className="w-full mt-2">
                            {result?.tech_n}
                            <sup>{result?.tech_r}</sup> ={" "}
                            {result?.tech_perm_rep}
                          </p>
                          <p className="w-full mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["13"]}
                            </strong>
                          </p>
                          <p className="w-full mt-2">
                            <span className="text_set">P</span>(n, r) = n
                            <sup>r</sup>
                          </p>
                          <p
                            className="w-full mt-2"
                            dangerouslySetInnerHTML={{
                              __html: `<span className="text_set">P</span>(${result?.tech_n}, ${result?.tech_r}) = ${result?.tech_n}<sup>${result?.tech_r}</sup>`,
                            }}
                          ></p>
                          <p
                            className="w-full mt-2 font-bold"
                            dangerouslySetInnerHTML={{
                              __html: `<span className="text_set">P</span>(${result?.tech_n}, ${result?.tech_r}) = ${result?.tech_perm_rep}`,
                            }}
                          ></p>
                        </>
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

export default PermutationCalculator;
