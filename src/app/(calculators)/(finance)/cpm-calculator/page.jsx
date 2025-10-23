"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCPMCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const CpmCalculator = () => {
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
    tech_my_current: "$", // $
    tech_checkbox: "", // on
    tech_method: "cpm", // cpm  im  tc
    tech_x: 10,
    tech_y: 20,
    tech_methodf: "cpm",
    tech_xf: 10,
    tech_yf: 20,
    tech_methods: "cpm",
    tech_xs: 50,
    tech_ys: 50,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCPMCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_checkbox == "") {
      if (!formData.tech_method || !formData.tech_x || !formData.tech_y) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_methodf ||
        !formData.tech_xf ||
        !formData.tech_yf ||
        !formData.tech_methods ||
        !formData.tech_xs ||
        !formData.tech_ys
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_my_current: formData.tech_my_current,
        tech_checkbox: formData.tech_checkbox,
        tech_method: formData.tech_method,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_methodf: formData.tech_methodf,
        tech_xf: formData.tech_xf,
        tech_yf: formData.tech_yf,
        tech_methods: formData.tech_methods,
        tech_xs: formData.tech_xs,
        tech_ys: formData.tech_ys,
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
      tech_my_current: "$", // $
      tech_checkbox: "", // on
      tech_method: "cpm", // cpm  im  tc
      tech_x: 10,
      tech_y: 20,
      tech_methodf: "cpm",
      tech_xf: 10,
      tech_yf: 20,
      tech_methods: "cpm",
      tech_xs: 50,
      tech_ys: 50,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <input
              type="hidden"
              step="any"
              name="tech_my_current"
              id="tech_my_current"
              value={currency.symbol}
              className="input my-2"
              aria-label="input"
              onChange={handleChange}
            />

            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <div className=" py-2">
                  <label className="pe-2" htmlFor="on">
                    <input
                      type="checkbox"
                      name="tech_checkbox"
                      id="on"
                      className="mr-2 border"
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tech_checkbox:
                            prev.tech_checkbox === "on" ? "" : "on", // toggle between "on" and ""
                        }))
                      }
                      checked={formData.tech_checkbox === "on"}
                    />
                    <span>{data?.payload?.tech_lang_keys["comp"]}</span>
                  </label>
                </div>
              </div>

              {formData.tech_checkbox != "on" ? (
                <div className="single col-span-12">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-6 md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_method" className="label">
                        {data?.payload?.tech_lang_keys["t_cal"]}
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_method"
                          id="tech_method"
                          value={formData.tech_method}
                          onChange={handleChange}
                        >
                          <option value="cpm">
                            {data?.payload?.tech_lang_keys["cpm"]}
                          </option>
                          <option value="im">
                            {data?.payload?.tech_lang_keys["im"]}
                          </option>
                          <option value="tc">
                            {data?.payload?.tech_lang_keys["tc"]}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_x" className="label">
                        {formData.tech_method == "cpm"
                          ? data?.payload?.tech_lang_keys["im"]
                          : data?.payload?.tech_lang_keys["cpm"]}
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_x"
                          id="tech_x"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_x}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_y" className="label">
                        {formData.tech_method == "tc"
                          ? data?.payload?.tech_lang_keys["im"]
                          : data?.payload?.tech_lang_keys["tc"]}
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_y"
                          id="tech_y"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_y}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col col-span-12  ">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <p className="padding_5 col-span-12">
                      {" "}
                      <strong>{data?.payload?.tech_lang_keys["first"]}</strong>
                    </p>
                    <div className="col-span-6  md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_methodf" className="label">
                        {data?.payload?.tech_lang_keys["t_cal"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_methodf"
                          id="tech_methodf"
                          value={formData.tech_methodf}
                          onChange={handleChange}
                        >
                          <option value="cpm">
                            {data?.payload?.tech_lang_keys["cpm"]}
                          </option>
                          <option value="im">
                            {data?.payload?.tech_lang_keys["im"]}
                          </option>
                          <option value="tc">
                            {data?.payload?.tech_lang_keys["tc"]}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6  md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_xf" className="label">
                        {formData.tech_methodf == "cpm"
                          ? data?.payload?.tech_lang_keys["im"]
                          : data?.payload?.tech_lang_keys["cpm"]}
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_xf"
                          id="tech_xf"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_xf}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6  md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_yf" className="label">
                        {formData.tech_methodf == "tc"
                          ? data?.payload?.tech_lang_keys["im"]
                          : data?.payload?.tech_lang_keys["tc"]}
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_yf"
                          id="tech_yf"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_yf}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <p className="col col-span-12 s12 font_size18 color_blue">
                      <strong>{data?.payload?.tech_lang_keys["second"]}</strong>
                    </p>
                    <div className="col-span-6  md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_methods" className="label">
                        {data?.payload?.tech_lang_keys["t_cal"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_methods"
                          id="tech_methods"
                          value={formData.tech_methods}
                          onChange={handleChange}
                        >
                          <option value="cpm">
                            {data?.payload?.tech_lang_keys["cpm"]}
                          </option>
                          <option value="im">
                            {data?.payload?.tech_lang_keys["im"]}
                          </option>
                          <option value="tc">
                            {data?.payload?.tech_lang_keys["tc"]}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6  md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_xs" className="label">
                        {formData.tech_methods == "cpm"
                          ? data?.payload?.tech_lang_keys["im"]
                          : data?.payload?.tech_lang_keys["cpm"]}
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_xs"
                          id="tech_xs"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_xs}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6  md:col-span-4 lg::col-span-4">
                      <label htmlFor="tech_ys" className="label">
                        {formData.tech_methods == "tc"
                          ? data?.payload?.tech_lang_keys["im"]
                          : data?.payload?.tech_lang_keys["tc"]}
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_ys"
                          id="tech_ys"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_ys}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      {formData.tech_checkbox == "on" ? (
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["first"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  className="py-2 border-b"
                                  width="70%"
                                  id="ansf"
                                ></td>
                                <td className="py-2 border-b">
                                  <b>{result?.tech_ansf ?? "0.0"}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 mt-3" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["second"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  className="py-2 border-b"
                                  width="70%"
                                  id="anss"
                                ></td>
                                <td className="py-2 border-b">
                                  <b>{result?.tech_anss ?? "0.0"}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <b>
                                    {result?.tech_cpmf < result?.tech_cpms
                                      ? "Campaign 1 is less expensive."
                                      : result?.tech_cpmf > result?.tech_cpms
                                      ? "Campaign 2 is less expensive."
                                      : "The campaigns cost is the same."}
                                  </b>
                                </td>
                                <td className="py-2 border-b" width="70%"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="col-12 text-center text-[20px]">
                          <p id="ans"></p>
                          <p className="my-3">
                            <strong className="bg-[#2845F5]  px-3 py-2 text-[22px] rounded-lg text-white">
                              {result?.tech_ans ?? "0.0"}
                            </strong>
                          </p>
                        </div>
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

export default CpmCalculator;
