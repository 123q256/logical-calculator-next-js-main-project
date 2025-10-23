"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useVoriciChromaticCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VoriciCalculator = () => {
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
    tech_submit: "1",
    tech_s_f: "4",
    tech_str_f: "",
    tech_dex_f: "137",
    tech_int_f: "",
    tech_r_f: "3",
    tech_g_f: "",
    tech_b_f: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVoriciChromaticCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_submit) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_submit: formData.tech_submit,
        tech_s_f: formData.tech_s_f,
        tech_str_f: formData.tech_str_f,
        tech_dex_f: formData.tech_dex_f,
        tech_int_f: formData.tech_int_f,
        tech_r_f: formData.tech_r_f,
        tech_g_f: formData.tech_g_f,
        tech_b_f: formData.tech_b_f,
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
      tech_submit: "1",
      tech_s_f: "4",
      tech_str_f: "",
      tech_dex_f: "137",
      tech_int_f: "",
      tech_r_f: "3",
      tech_g_f: "",
      tech_b_f: "",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg3 space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td colSpan="3">
                        <label htmlFor="tech_s_f" className="label">
                          {data?.payload?.tech_lang_keys["1"]}:
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <input
                          type="number"
                          step="any"
                          name="tech_s_f"
                          id="tech_s_f"
                          className="input my-2"
                          aria-label="input"
                          placeholder="2"
                          value={formData.tech_s_f}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="pt-2">
                        <label htmlFor="tech_str_f" className="label">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          step="any"
                          name="tech_str_f"
                          id="tech_str_f"
                          className="input my-2"
                          aria-label="input"
                          placeholder="str"
                          value={formData.tech_str_f}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          name="tech_dex_f"
                          id="tech_dex_f"
                          className="input my-2"
                          aria-label="input"
                          placeholder="dex"
                          value={formData.tech_dex_f}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          name="tech_int_f"
                          id="tech_int_f"
                          className="input my-2"
                          aria-label="input"
                          placeholder="int"
                          value={formData.tech_int_f}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <label htmlFor="tech_r_f" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          step="any"
                          name="tech_r_f"
                          id="tech_r_f"
                          className="input my-2"
                          aria-label="input"
                          placeholder="R"
                          value={formData.tech_r_f}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          name="tech_g_f"
                          id="tech_g_f"
                          className="input my-2"
                          aria-label="input"
                          placeholder="G"
                          value={formData.tech_g_f}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          name="tech_b_f"
                          id="tech_b_f"
                          className="input my-2"
                          aria-label="input"
                          placeholder="B"
                          value={formData.tech_b_f}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                      <div className="w-full text-center">
                        <div className="w-full">
                          <input
                            type="hidden"
                            id="s_f"
                            value="{result?.tech_s_f}"
                          />
                          <input
                            type="hidden"
                            id="str_f"
                            value="{result?.tech_str_f}"
                          />
                          <input
                            type="hidden"
                            id="dex_f"
                            value="{result?.tech_dex_f}"
                          />
                          <input
                            type="hidden"
                            id="int_f"
                            value="{result?.tech_int_f}"
                          />
                          <input
                            type="hidden"
                            id="r_f"
                            value="{result?.tech_r_f}"
                          />
                          <input
                            type="hidden"
                            id="g_f"
                            value="{result?.tech_g_f}"
                          />
                          <input
                            type="hidden"
                            id="b_f"
                            value="{result?.tech_b_f}"
                          />
                          <div className="overflow-auto">
                            <table className="" width={750} id="table">
                              <thead>
                                <tr className="head">
                                  <th className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </th>
                                  <th className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["6"]}
                                    <br />
                                    <span className="tab_sub">
                                      ({data?.payload?.tech_lang_keys["7"]})
                                    </span>
                                  </th>
                                  <th className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </th>
                                  <th className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["9"]}
                                    <br />
                                    <span className="tab_sub">
                                      ({data?.payload?.tech_lang_keys["10"]})
                                    </span>
                                  </th>
                                  <th className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["11"]}
                                    <br />
                                    <span className="tab_sub">
                                      ({data?.payload?.tech_lang_keys["7"]})
                                    </span>
                                  </th>
                                  <th className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["12"]}
                                    <br />
                                    <span className="tab_sub">
                                      ({data?.payload?.tech_lang_keys["13"]})
                                    </span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody id="tbody"></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* @include('inc.vorici-calculator') */}
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

export default VoriciCalculator;
