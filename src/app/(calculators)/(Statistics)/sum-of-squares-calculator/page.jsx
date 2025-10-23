"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useSumOfSquaresCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SumOfSquaresCalculator = () => {
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
    tech_seprateby: ",",
    tech_seprate: ",",
    tech_x: "55, 62, 35, 32, 50, 57, 54",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSumOfSquaresCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResult(null);
    setFormError(null);

    // Separator dropdown change
    if (name === "tech_seprateby") {
      let sep = "";
      let updatedTechX = formData.tech_x;

      if (value === "space") {
        sep = " ";
        updatedTechX = formData.tech_x.replaceAll(",", " ");
      } else if (value === ",") {
        sep = ",";
        updatedTechX = formData.tech_x.replaceAll(" ", ",");
      } else if (value === "user") {
        sep = "";
      }

      setFormData((prev) => ({
        ...prev,
        tech_seprateby: value,
        tech_seprate: sep,
        tech_x: updatedTechX,
      }));
      return;
    }

    // Custom separator input
    if (name === "tech_seprate") {
      const sep = value;
      const parts = formData.tech_x
        .split(sep)
        .map((val) => val.trim())
        .filter((val) => val !== "");

      setFormData((prev) => ({
        ...prev,
        tech_seprate: sep,
        tech_x: parts.join(" "),
      }));
      return;
    }

    // Textarea input
    if (name === "tech_x") {
      let updatedValue = value;

      if (formData.tech_seprateby === "space") {
        updatedValue = value.replaceAll(",", " ");
      } else if (formData.tech_seprateby === ",") {
        updatedValue = value.replaceAll(" ", ",");
      } else if (formData.tech_seprateby === "user") {
        const sep = formData.tech_seprate;
        const parts = value
          .split(sep)
          .map((val) => val.trim())
          .filter((val) => val !== "");

        updatedValue = parts.join(" ");
      }

      setFormData((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
      return;
    }

    // Default case
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_seprateby) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_seprateby: formData.tech_seprateby,
        tech_seprate: formData.tech_seprate,
        tech_x: formData.tech_x,
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
      tech_seprateby: ",",
      tech_seprate: ",",
      tech_x: "55, 62, 35, 32, 50, 57, 54",
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-2">
              {/* Dropdown */}
              <div className="col-span-8 px-2">
                <label htmlFor="tech_seprateby" className="label">
                  {data?.payload?.tech_lang_keys["no"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_seprateby"
                    id="tech_seprateby"
                    value={formData.tech_seprateby}
                    onChange={handleChange}
                  >
                    <option value="space">
                      {data?.payload?.tech_lang_keys["Space"]}
                    </option>
                    <option value=",">
                      {data?.payload?.tech_lang_keys["comma"]}
                    </option>
                    {/* <option value="user">{data?.payload?.tech_lang_keys["user"]}</option> */}
                  </select>
                </div>
              </div>
              {/* Separator Input */}
              <div className="col-span-4 px-2">
                <label htmlFor="tech_seprate" className="label">
                  &nbsp;
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="tech_seprate"
                    id="tech_seprate"
                    className="input my-2"
                    aria-label="input"
                    readOnly={formData.tech_seprateby !== "user"}
                    maxLength={1}
                    value={formData.tech_seprate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Textarea */}
              <div className="col-span-12 px-2">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["enter"]}:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 12 32 12 33 4 21"
                    value={formData.tech_x}
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
                    <div className="w-full mx-auto  mt-5">
                      <div className="">
                        <div className="rounded-lg  ">
                          <div className="w-full  mt-3">
                            <div className="w-full text-center ">
                              <p className="text-[16px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ans"]}{" "}
                                  {data?.payload?.tech_lang_keys["stat"]}
                                </strong>
                              </p>
                              <p className="my-3 text-[22px]">
                                <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2 ">
                                  {result?.tech_ss}{" "}
                                </strong>
                              </p>
                            </div>
                            <div className="w-full text-center text-[16px]">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["ans"]}{" "}
                                  {data?.payload?.tech_lang_keys["algbra"]}
                                </strong>
                              </p>
                              <p className="my-3 text-[22px]">
                                <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2">
                                  {result?.tech_su}{" "}
                                </strong>
                              </p>
                            </div>
                            <div className="row p-2">
                              <p className="col-12 mt-2 px-lg-2 px-0 text-[20px] text-center ">
                                {" "}
                                <b>Step by Step Solution</b>
                              </p>
                              <p className="col-12 mt-2 px-lg-2 px-0 text-[18px] text-center">
                                {" "}
                                <strong className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["stat"]}{" "}
                                </strong>{" "}
                              </p>
                              <p className="col-12 mt-2 px-lg-2 px-0">
                                {" "}
                                <strong>
                                  {data?.payload?.tech_lang_keys["sdata"]}{" "}
                                </strong>{" "}
                                = ({formData?.tech_x})
                              </p>
                              <p className="col-12 mt-2 px-lg-2 px-0">
                                <strong>
                                  {data?.payload?.tech_lang_keys["tdata"]}{" "}
                                </strong>
                                : {result?.tech_n}
                              </p>
                              <p className="col-12 mt-2 px-lg-2 px-0">
                                <strong>
                                  {data?.payload?.tech_lang_keys["mean"]} (X̄)
                                </strong>{" "}
                                = {result?.tech_so} / {result?.tech_n} ={" "}
                                {result?.tech_s}
                              </p>
                              <p className="col-12 mt-2 px-lg-2 px-0">
                                {" "}
                                <strong>
                                  {data?.payload?.tech_lang_keys["sum"]}
                                </strong>{" "}
                                = Σ (Xi - X̄)
                              </p>
                              <p
                                className="col-12 mt-2 px-lg-2 px-0"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_sns,
                                }}
                              ></p>
                              <p
                                className="col-12 mt-2 px-lg-2 px-0"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_snns,
                                }}
                              ></p>
                              <p
                                className="col-12 mt-2 px-lg-2 px-0"
                                dangerouslySetInnerHTML={{
                                  __html: `"${result?.tech_ss}"`,
                                }}
                              ></p>

                              <p className="col-12 mt-2 px-lg-2 px-0 text-[18px] text-center ">
                                {" "}
                                <strong className="text-[#2845F5]">
                                  {data?.payload?.tech_lang_keys["algbra"]}{" "}
                                </strong>{" "}
                              </p>
                              <p
                                className="col-12 mt-2 px-lg-2 px-0"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_soa,
                                }}
                              ></p>
                              <p
                                className="col-12 mt-2 px-lg-2 px-0"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_soas,
                                }}
                              ></p>
                              <p
                                className="col-12 mt-2 px-lg-2 px-0"
                                dangerouslySetInnerHTML={{
                                  __html: `"${result?.tech_su}"`,
                                }}
                              ></p>
                            </div>
                          </div>
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

export default SumOfSquaresCalculator;
