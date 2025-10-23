"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWhpToHpCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WhpToHpCalculator = () => {
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
    tech_type: "whpToHp", // whpToHp   hpToWhp
    tech_whp: "230",
    tech_dt: ".10",
    tech_ehp: "230",
    tech_dtlf: "1.1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWhpToHpCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_whp: formData.tech_whp,
        tech_dt: formData.tech_dt,
        tech_ehp: formData.tech_ehp,
        tech_dtlf: formData.tech_dtlf,
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
      tech_type: "whpToHp", // whpToHp   hpToWhp
      tech_whp: "230",
      tech_dt: ".10",
      tech_ehp: "230",
      tech_dtlf: "1.1",
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

          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "whpToHp" ? "tagsUnit" : ""
                    }`}
                    id="whpToHp"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "whpToHp" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    WHP to HP
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "hpToWhp" ? "tagsUnit" : ""
                    }`}
                    id="hpToWhp"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "hpToWhp" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    HP to WHP
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-5  gap-4">
              {formData.tech_type == "whpToHp" && (
                <>
                  <div className="col-span-12 whpToHp">
                    <div className="grid grid-cols-12">
                      <div className="col-span-12">
                        <label htmlFor="tech_whp" className="label">
                          {data?.payload?.tech_lang_keys["1"]} (WHP):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_whp"
                            id="tech_whp"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_whp}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12">
                        <label htmlFor="tech_dt" className="label">
                          {data?.payload?.tech_lang_keys["2"]} (DL):
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_dt"
                            id="tech_dt"
                            value={formData.tech_dt}
                            onChange={handleChange}
                          >
                            <option value=".10">
                              {data?.payload?.tech_lang_keys["3"]}
                            </option>
                            <option value=".15">
                              {data?.payload?.tech_lang_keys["4"]}
                            </option>
                            <option value=".25">
                              {data?.payload?.tech_lang_keys["5"]}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "hpToWhp" && (
                <>
                  <div className="col-span-12 hpToWhp ">
                    <div className="rgrid grid-cols-12ow">
                      <div className="col-span-12">
                        <label htmlFor="tech_ehp" className="label">
                          {data?.payload?.tech_lang_keys["6"]} (HP):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ehp"
                            id="tech_ehp"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ehp}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12">
                        <label htmlFor="tech_dtlf" className="label">
                          {data?.payload?.tech_lang_keys["2"]} (DLTF):
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_dtlf"
                            id="tech_dtlf"
                            value={formData.tech_dtlf}
                            onChange={handleChange}
                          >
                            <option value="1.1">
                              {data?.payload?.tech_lang_keys["3"]}
                            </option>
                            <option value="1.15">
                              {data?.payload?.tech_lang_keys["4"]}
                            </option>
                            <option value="1.2">
                              {data?.payload?.tech_lang_keys["5"]}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_submit === "whpToHp" ? (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["6"]} (HP)
                                </strong>
                              </p>
                              <p className="text-[25px] bg-[#2845F5] inline-block my-3 px-3 py-2 rounded-lg">
                                <strong className="text-white">
                                  {result?.tech_hp}
                                </strong>
                              </p>
                            </div>

                            <p className="w-full mt-3 lg:text-[18px] md:text-[18px] text-[16px]">
                              {data?.payload?.tech_lang_keys["7"]}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["8"]} (WHP) ={" "}
                              {result?.tech_whp}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["9"]} (DL) ={" "}
                              {result?.tech_dt === 0.1
                                ? "10%"
                                : result?.tech_dt === 0.15
                                ? "15%"
                                : "25%"}
                            </p>

                            <p className="w-full mt-3 lg:text-[18px] md:text-[18px] text-[16px]">
                              {data?.payload?.tech_lang_keys["10"]}
                            </p>
                            <p className="w-full mt-2">
                              HP = WHP * 1 / (1 – DL)
                            </p>
                            <p className="w-full mt-2">
                              HP = {result?.tech_whp} * 1 / (1 –{" "}
                              {result?.tech_dt})
                            </p>
                            <p className="w-full mt-2">
                              HP = {result?.tech_hp}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]} (WHP)
                                </strong>
                              </p>
                              <p className="text-[25px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block my-3">
                                <strong className="text-white">
                                  {result?.tech_whp}
                                </strong>
                              </p>
                            </div>

                            <p className="w-full mt-3lg:text-[18px] md:text-[18px] text-[16px]">
                              {data?.payload?.tech_lang_keys["7"]}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["6"]} (HP) ={" "}
                              {result?.tech_ehp}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys["9"]} (DTLF) ={" "}
                              {result?.tech_dtlf}
                            </p>

                            <p className="w-full mt-3 lg:text-[18px] md:text-[18px] text-[16px]">
                              {data?.payload?.tech_lang_keys["10"]}
                            </p>
                            <p className="w-full mt-2">WHP = HP / DTLF</p>
                            <p className="w-full mt-2">
                              WHP = {result?.tech_ehp} / {result?.tech_dtlf}
                            </p>
                            <p className="w-full mt-2">
                              WHP = {result?.tech_whp}
                            </p>
                          </>
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

export default WhpToHpCalculator;
