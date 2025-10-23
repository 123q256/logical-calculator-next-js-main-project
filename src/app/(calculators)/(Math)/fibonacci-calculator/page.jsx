"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useLoveCalculatorCalculationMutation,
  useFibonacciCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FibonacciCalculator = () => {
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
    tech_units: "A Sequence",
    tech_first_term: 2,
    tech_second_term: 6,
    tech_n: 10,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateLovePercentage,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFibonacciCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_units === "A Sequence") {
      if (
        !formData.tech_units ||
        !formData.tech_first_term ||
        !formData.tech_second_term
      ) {
        setFormError("Please fill in all input fields.");
        return;
      }
    } else {
      if (!formData.tech_units || !formData.tech_n) {
        setFormError("Please fill in all input fields.");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateLovePercentage({
        tech_units: formData.tech_units,
        tech_first_term: Number(formData.tech_first_term),
        tech_second_term: Number(formData.tech_second_term),
        tech_n: Number(formData.tech_n),
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
      tech_units: "A Sequence",
      tech_first_term: 2,
      tech_second_term: 6,
      tech_n: 10,
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

  console.log(formData);

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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-9 lg:col-span-9">
                <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-10">
                    <label htmlFor="conversion" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className="w-full py-2">
                      <select
                        name="tech_units"
                        value={formData.tech_units}
                        onChange={handleChange}
                        className="input"
                        id="conversion"
                        aria-label="select"
                      >
                        <option value="A Sequence">
                          {data?.payload?.tech_lang_keys[3]}
                        </option>
                        <option value="One Number">
                          {data?.payload?.tech_lang_keys[4]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-10">
                    {formData.tech_units === "One Number" ? (
                      <div
                        className="items-center justify-center mt-0 mt-lg-2 py-2 flex"
                        id="one"
                      >
                        <div>
                          F<sub>n</sub> for n ={" "}
                        </div>
                        <div>
                          <input
                            step="any"
                            type="number"
                            name="tech_n"
                            id="tech_n"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_n}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="items-center flex justify-center mt-0 mt-lg-2 py-2 "
                        id="two"
                      >
                        <div>
                          F<sub>n</sub>&nbsp;for&nbsp;n&nbsp;=&nbsp;
                        </div>
                        <div>
                          <input
                            step="any"
                            type="number"
                            name="tech_first_term"
                            id="tech_first_term"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_first_term}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="px-2">to</div>
                        <div>
                          <input
                            step="any"
                            type="number"
                            name="tech_second_term"
                            id="tech_second_term"
                            className="input my-2"
                            aria-label="input"
                            value={formData.tech_second_term}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-3 lg:col-span-3 text-center flex items-center">
                <div>
                  <p className="font-s-20">
                    <strong>
                      F<sub>0</sub> = 0, F<sub>1</sub> = 1,
                    </strong>
                  </p>
                  <p className="font-s-20">
                    <strong>
                      F<sub>n</sub> = F<sub>n-1</sub> + F<sub>n-2</sub>
                    </strong>
                  </p>
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
                      <div className="w-full">
                        {formData.tech_units === "A Sequence" ? (
                          <div className="w-full overflow-auto mt-2">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" colSpan="2">
                                    <strong>
                                      F
                                      <sub className="font-s-14">
                                        {formData.tech_first_term}
                                      </sub>{" "}
                                      to F
                                      <sub className="font-s-14">
                                        {formData.tech_second_term}
                                      </sub>{" "}
                                      ={" "}
                                      {result?.tech_fibonacci_sequence?.join(
                                        " , "
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>n</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>Fn</strong>
                                  </td>
                                </tr>
                                {result?.tech_fibonacci_sequence?.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td className="py-2 border-b" width="60%">
                                        {parseInt(formData.tech_first_term) +
                                          index}
                                      </td>
                                      <td className="py-2 border-b">{item}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="w-full text-center text-[20px]">
                            <p className="my-3">
                              <strong className="bg-sky px-3 py-2 m d:text-[32px] rounded-lg text-blue">
                                F<sub className="">{formData.tech_n}</sub> ={" "}
                                {result?.tech_answer}
                              </strong>
                            </p>
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

export default FibonacciCalculator;
