"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useDeterminantCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DeterminantCalculator = () => {
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
    tech_dtrmn_slct_method: "5",
    tech_dtrmn_0_0: "4",
    tech_dtrmn_0_1: "1",
    tech_dtrmn_0_2: "1",
    tech_dtrmn_0_3: "2",
    tech_dtrmn_0_4: "2",
    tech_dtrmn_1_0: "2",
    tech_dtrmn_1_1: "1",
    tech_dtrmn_1_2: "1",
    tech_dtrmn_1_3: "8",
    tech_dtrmn_1_4: "1",
    tech_dtrmn_2_0: "0",
    tech_dtrmn_2_1: "5",
    tech_dtrmn_2_2: "6",
    tech_dtrmn_2_3: "1",
    tech_dtrmn_2_4: "1",
    tech_dtrmn_3_0: "2",
    tech_dtrmn_3_1: "7",
    tech_dtrmn_3_2: "2",
    tech_dtrmn_3_3: "1",
    tech_dtrmn_3_4: "1",
    tech_dtrmn_4_0: "3",
    tech_dtrmn_4_1: "2",
    tech_dtrmn_4_2: "1",
    tech_dtrmn_4_3: "9",
    tech_dtrmn_4_4: "1",
    tech_dtrmn_opts_method: "exp_row",
    tech_dtrmn_opts: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDeterminantCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_dtrmn_slct_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_dtrmn_slct_method: formData.tech_dtrmn_slct_method,
        tech_dtrmn_0_0: formData.tech_dtrmn_0_0,
        tech_dtrmn_0_1: formData.tech_dtrmn_0_1,
        tech_dtrmn_0_2: formData.tech_dtrmn_0_2,
        tech_dtrmn_0_3: formData.tech_dtrmn_0_3,
        tech_dtrmn_0_4: formData.tech_dtrmn_0_4,
        tech_dtrmn_1_0: formData.tech_dtrmn_1_0,
        tech_dtrmn_1_1: formData.tech_dtrmn_1_1,
        tech_dtrmn_1_2: formData.tech_dtrmn_1_2,
        tech_dtrmn_1_3: formData.tech_dtrmn_1_3,
        tech_dtrmn_1_4: formData.tech_dtrmn_1_4,
        tech_dtrmn_2_0: formData.tech_dtrmn_2_0,
        tech_dtrmn_2_1: formData.tech_dtrmn_2_1,
        tech_dtrmn_2_2: formData.tech_dtrmn_2_2,
        tech_dtrmn_2_3: formData.tech_dtrmn_2_3,
        tech_dtrmn_2_4: formData.tech_dtrmn_2_4,
        tech_dtrmn_3_0: formData.tech_dtrmn_3_0,
        tech_dtrmn_3_1: formData.tech_dtrmn_3_1,
        tech_dtrmn_3_2: formData.tech_dtrmn_3_2,
        tech_dtrmn_3_3: formData.tech_dtrmn_3_3,
        tech_dtrmn_3_4: formData.tech_dtrmn_3_4,
        tech_dtrmn_4_0: formData.tech_dtrmn_4_0,
        tech_dtrmn_4_1: formData.tech_dtrmn_4_1,
        tech_dtrmn_4_2: formData.tech_dtrmn_4_2,
        tech_dtrmn_4_3: formData.tech_dtrmn_4_3,
        tech_dtrmn_4_4: formData.tech_dtrmn_4_4,
        tech_dtrmn_opts_method: formData.tech_dtrmn_opts_method,
        tech_dtrmn_opts: formData.tech_dtrmn_opts,
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
      tech_dtrmn_slct_method: "5",
      tech_dtrmn_0_0: "4",
      tech_dtrmn_0_1: "1",
      tech_dtrmn_0_2: "1",
      tech_dtrmn_0_3: "2",
      tech_dtrmn_0_4: "2",
      tech_dtrmn_1_0: "2",
      tech_dtrmn_1_1: "1",
      tech_dtrmn_1_2: "1",
      tech_dtrmn_1_3: "8",
      tech_dtrmn_1_4: "1",
      tech_dtrmn_2_0: "0",
      tech_dtrmn_2_1: "5",
      tech_dtrmn_2_2: "6",
      tech_dtrmn_2_3: "1",
      tech_dtrmn_2_4: "1",
      tech_dtrmn_3_0: "2",
      tech_dtrmn_3_1: "7",
      tech_dtrmn_3_2: "2",
      tech_dtrmn_3_3: "1",
      tech_dtrmn_3_4: "1",
      tech_dtrmn_4_0: "3",
      tech_dtrmn_4_1: "2",
      tech_dtrmn_4_2: "1",
      tech_dtrmn_4_3: "9",
      tech_dtrmn_4_4: "1",
      tech_dtrmn_opts_method: "exp_row",
      tech_dtrmn_opts: "1",
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

  const handleGenerateRandom = () => {
    const newFormData = { ...formData };

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const key = `tech_dtrmn_${i}_${j}`;
        newFormData[key] = Math.floor(Math.random() * 11).toString(); // 0–10 random
      }
    }

    setFormData(newFormData);
  };

  const handleClearInputs = () => {
    const newFormData = { ...formData };

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const key = `tech_dtrmn_${i}_${j}`;
        newFormData[key] = "";
      }
    }

    setFormData(newFormData);
  };

  // dspVl gets the matrix value from formData by key like '0_0', '1_2' etc
  const dspVl = (formData, key) => formData[`tech_dtrmn_${key}`] || "0";

  // gtVl multiplies two values in formData
  const gtVl = (formData, [a, b]) =>
    Number(formData[`tech_dtrmn_${a}`] || 0) *
    Number(formData[`tech_dtrmn_${b}`] || 0);

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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 ">
                <label htmlFor="tech_dtrmn_slct_method" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_dtrmn_slct_method"
                    id="tech_dtrmn_slct_method"
                    value={formData.tech_dtrmn_slct_method}
                    onChange={handleChange}
                  >
                    <option value="2">2 </option>
                    <option value="3">3 </option>
                    <option value="4">4 </option>
                    <option value="5">5 </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <table className="w-full dtrmn_mtrx_tbl">
                  <tbody>
                    <tr>
                      <td>
                        <div className="px-1 ">
                          <input
                            type="number"
                            step="any"
                            name="tech_dtrmn_0_0"
                            id="tech_dtrmn_0_0"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_dtrmn_0_0}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </td>
                      <td>
                        <div className="px-1 ">
                          <input
                            type="number"
                            step="any"
                            name="tech_dtrmn_0_1"
                            id="tech_dtrmn_0_1"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_dtrmn_0_1}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </td>
                      {(formData.tech_dtrmn_slct_method == "3" ||
                        formData.tech_dtrmn_slct_method == "4" ||
                        formData.tech_dtrmn_slct_method == "5") && (
                        <>
                          <td className="">
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_0_2"
                                id="tech_dtrmn_0_2"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_0_2}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </>
                      )}
                      {(formData.tech_dtrmn_slct_method == "4" ||
                        formData.tech_dtrmn_slct_method == "5") && (
                        <>
                          <td className="">
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_0_3"
                                id="tech_dtrmn_0_3"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_0_3}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </>
                      )}
                      {formData.tech_dtrmn_slct_method == "5" && (
                        <>
                          <td className="">
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_0_4"
                                id="tech_dtrmn_0_4"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_0_4}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td>
                        <div className="px-1 ">
                          <input
                            type="number"
                            step="any"
                            name="tech_dtrmn_1_0"
                            id="tech_dtrmn_1_0"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_dtrmn_1_0}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </td>
                      <td>
                        <div className="px-1 ">
                          <input
                            type="number"
                            step="any"
                            name="tech_dtrmn_1_1"
                            id="tech_dtrmn_1_1"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_dtrmn_1_1}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </td>
                      {(formData.tech_dtrmn_slct_method == "3" ||
                        formData.tech_dtrmn_slct_method == "4" ||
                        formData.tech_dtrmn_slct_method == "5") && (
                        <>
                          <td className="">
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_1_2"
                                id="tech_dtrmn_1_2"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_1_2}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </>
                      )}
                      {(formData.tech_dtrmn_slct_method == "4" ||
                        formData.tech_dtrmn_slct_method == "5") && (
                        <>
                          <td className="">
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_1_3"
                                id="tech_dtrmn_1_3"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_1_3}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </>
                      )}
                      {formData.tech_dtrmn_slct_method == "5" && (
                        <>
                          <td className="">
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_1_4"
                                id="tech_dtrmn_1_4"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_1_4}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </>
                      )}
                    </tr>

                    {(formData.tech_dtrmn_slct_method == "3" ||
                      formData.tech_dtrmn_slct_method == "4" ||
                      formData.tech_dtrmn_slct_method == "5") && (
                      <>
                        <tr className="">
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_2_0"
                                id="tech_dtrmn_2_0"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_2_0}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_2_1"
                                id="tech_dtrmn_2_1"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_2_1}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          {(formData.tech_dtrmn_slct_method == "3" ||
                            formData.tech_dtrmn_slct_method == "4" ||
                            formData.tech_dtrmn_slct_method == "5") && (
                            <>
                              <td>
                                <div className="px-1 ">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_dtrmn_2_2"
                                    id="tech_dtrmn_2_2"
                                    className="input "
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_dtrmn_2_2}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </td>
                            </>
                          )}
                          {(formData.tech_dtrmn_slct_method == "4" ||
                            formData.tech_dtrmn_slct_method == "5") && (
                            <>
                              <td>
                                <div className="px-1 ">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_dtrmn_2_3"
                                    id="tech_dtrmn_2_3"
                                    className="input "
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_dtrmn_2_3}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </td>
                            </>
                          )}
                          {formData.tech_dtrmn_slct_method == "5" && (
                            <>
                              <td>
                                <div className="px-1 ">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_dtrmn_2_4"
                                    id="tech_dtrmn_2_4"
                                    className="input "
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_dtrmn_2_4}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    )}
                    {(formData.tech_dtrmn_slct_method == "4" ||
                      formData.tech_dtrmn_slct_method == "5") && (
                      <>
                        <tr className="">
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_3_0"
                                id="tech_dtrmn_3_0"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_3_0}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_3_1"
                                id="tech_dtrmn_3_1"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_3_1}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          {(formData.tech_dtrmn_slct_method == "3" ||
                            formData.tech_dtrmn_slct_method == "4" ||
                            formData.tech_dtrmn_slct_method == "5") && (
                            <>
                              <td>
                                <div className="px-1 ">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_dtrmn_3_2"
                                    id="tech_dtrmn_3_2"
                                    className="input "
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_dtrmn_3_2}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </td>
                            </>
                          )}
                          {(formData.tech_dtrmn_slct_method == "4" ||
                            formData.tech_dtrmn_slct_method == "5") && (
                            <>
                              <td>
                                <div className="px-1 ">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_dtrmn_3_3"
                                    id="tech_dtrmn_3_3"
                                    className="input "
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_dtrmn_3_3}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </td>
                            </>
                          )}
                          {formData.tech_dtrmn_slct_method == "5" && (
                            <>
                              <td>
                                <div className="px-1 ">
                                  <input
                                    type="number"
                                    step="any"
                                    name="tech_dtrmn_3_4"
                                    id="tech_dtrmn_3_4"
                                    className="input "
                                    aria-label="input"
                                    placeholder="00"
                                    value={formData.tech_dtrmn_3_4}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    )}
                    {formData.tech_dtrmn_slct_method == "5" && (
                      <>
                        <tr className="">
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_4_0"
                                id="tech_dtrmn_4_0"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_4_0}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_4_1"
                                id="tech_dtrmn_4_1"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_4_1}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_4_2"
                                id="tech_dtrmn_4_2"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_4_2}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_4_3"
                                id="tech_dtrmn_4_3"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_4_3}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <div className="px-1 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dtrmn_4_4"
                                id="tech_dtrmn_4_4"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dtrmn_4_4}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="col-span-12 ">
                <div className="col-span-12">
                  <button
                    type="button"
                    id="dtrmn_gen_btn"
                    onClick={handleGenerateRandom}
                    className="px-3 py-2 mt-1 mx-1 addmore cursor-pointer bg-[#2845F5] text-white rounded-lg"
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </button>

                  <button
                    type="button"
                    id="dtrmn_clr_btn"
                    onClick={handleClearInputs}
                    className="px-3 py-2 mt-1 mx-1 addmore cursor-pointer bg-[#2845F5] text-white rounded-lg"
                  >
                    {data?.payload?.tech_lang_keys["3"]}
                  </button>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_dtrmn_opts_method" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_dtrmn_opts_method"
                    id="tech_dtrmn_opts_method"
                    value={formData.tech_dtrmn_opts_method}
                    onChange={handleChange}
                  >
                    <option value="exp_col">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="exp_row">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="leibniz">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="triangle">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                    <option value="sarrus">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_dtrmn_opts_method == "exp_col" ||
                formData.tech_dtrmn_opts_method == "exp_row") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="dtrmn_opts_Input"
                  >
                    <label htmlFor="tech_dtrmn_opts" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        max="3"
                        min="1"
                        name="tech_dtrmn_opts"
                        id="tech_dtrmn_opts"
                        className="input "
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_dtrmn_opts}
                        onChange={handleChange}
                      />
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {result?.tech_ans}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full">
                        {/*                           
                        <div className="w-full text-[16px]">
                            <p className="mt-2">{data?.payload?.tech_lang_keys['13']}:</p>

                            <p className="text-[20px] text-blue-600 mt-2">Step 1</p>
                            <BlockMath
                                math={`
                                \\begin{aligned}
                                &(-1)^1 \\cdot ${dspVl(formData, '0_0')} \\cdot 
                                \\begin{vmatrix}
                                    ${dspVl(formData, '1_1')} & ${dspVl(formData, '1_2')} \\\\
                                    ${dspVl(formData, '2_1')} & ${dspVl(formData, '2_2')}
                                \\end{vmatrix} \\\\
                                +\\; &(-1)^2 \\cdot ${dspVl(formData, '0_1')} \\cdot 
                                \\begin{vmatrix}
                                    ${dspVl(formData, '1_0')} & ${dspVl(formData, '1_2')} \\\\
                                    ${dspVl(formData, '2_0')} & ${dspVl(formData, '2_2')}
                                \\end{vmatrix} \\\\
                                +\\; &(-1)^3 \\cdot ${dspVl(formData, '0_2')} \\cdot 
                                \\begin{vmatrix}
                                    ${dspVl(formData, '1_0')} & ${dspVl(formData, '1_1')} \\\\
                                    ${dspVl(formData, '2_0')} & ${dspVl(formData, '2_1')}
                                \\end{vmatrix}
                                \\end{aligned}
                                `}
                            />

                            <p className="text-[20px] text-blue-600 mt-2">Step 2</p>
                            <BlockMath
                                math={`
                                \\begin{aligned}
                                &(-1)^1 \\cdot ${dspVl(formData, '0_0')} \\cdot 
                                \\left(${dspVl(formData, '1_1')} \\cdot ${dspVl(formData, '2_2')} - 
                                ${dspVl(formData, '1_2')} \\cdot ${dspVl(formData, '2_1')}\\right) \\\\
                                +\\; &(-1)^2 \\cdot ${dspVl(formData, '0_1')} \\cdot 
                                \\left(${dspVl(formData, '1_0')} \\cdot ${dspVl(formData, '2_2')} - 
                                ${dspVl(formData, '1_2')} \\cdot ${dspVl(formData, '2_0')}\\right) \\\\
                                +\\; &(-1)^3 \\cdot ${dspVl(formData, '0_2')} \\cdot 
                                \\left(${dspVl(formData, '1_0')} \\cdot ${dspVl(formData, '2_1')} - 
                                ${dspVl(formData, '1_1')} \\cdot ${dspVl(formData, '2_0')}\\right)
                                \\end{aligned}
                                `}
                            />

                            <p className="text-[20px] text-blue-600 mt-2">Step 3</p>
                            <BlockMath
                                math={`
                                \\begin{aligned}
                                &(-1)^1 \\cdot ${dspVl(formData, '0_0')} \\cdot 
                                \\left(${gtVl(formData, ['1_1','2_2'])} - ${gtVl(formData, ['1_2','2_1'])}\\right) \\\\
                                +\\; &(-1)^2 \\cdot ${dspVl(formData, '0_1')} \\cdot 
                                \\left(${gtVl(formData, ['1_0','2_2'])} - ${gtVl(formData, ['1_2','2_0'])}\\right) \\\\
                                +\\; &(-1)^3 \\cdot ${dspVl(formData, '0_2')} \\cdot 
                                \\left(${gtVl(formData, ['1_0','2_1'])} - ${gtVl(formData, ['1_1','2_0'])}\\right)
                                \\end{aligned}
                                `}
                            />

                            <p className="text-[20px] text-blue-600 mt-2">Step 4</p>
                            <BlockMath
                                math={`
                                \\begin{aligned}
                                &(${(-1) ** 1} \\cdot ${dspVl(formData, '0_0')} \\cdot 
                                (${gtVl(formData, ['1_1','2_2']) - gtVl(formData, ['1_2','2_1'])})) \\\\
                                +\\; &(${(-1) ** 2} \\cdot ${dspVl(formData, '0_1')} \\cdot 
                                (${gtVl(formData, ['1_0','2_2']) - gtVl(formData, ['1_2','2_0'])})) \\\\
                                +\\; &(${(-1) ** 3} \\cdot ${dspVl(formData, '0_2')} \\cdot 
                                (${gtVl(formData, ['1_0','2_1']) - gtVl(formData, ['1_1','2_0'])}))
                                \\end{aligned}
                                `}
                            />
                            </div> */}

                        {/* <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 5
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      ({ pow(-1, $rc4) }) \times ({ dspVl($a1) * (gtVl([$a2, $b2]) - gtVl([$a3, $b1])) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      ({ pow(-1, $rc5) }) \times ({ dspVl($b3) * (gtVl([$c1, $b2]) - gtVl([$c2, $b1])) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      ({ pow(-1, $rc6) }) \times ({ dspVl($c3) * (gtVl([$c1, $a3]) - gtVl([$c2, $a2])) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 6
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big(
                                      { pow(-1, $rc4) * dspVl($a1) * (gtVl([$a2, $b2]) - gtVl([$a3, $b1])) }
                                      \Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big(
                                      { pow(-1, $rc5) * dspVl($b3) * (gtVl([$c1, $b2]) - gtVl([$c2, $b1])) }
                                      \Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big(
                                      { pow(-1, $rc6) * dspVl($c3) * (gtVl([$c1, $a3]) - gtVl([$c2, $a2])) }
                                      \Big)
                                      \)
                                  </p>
                                  </p>
                                  <?php
                                          }

                                          //Expand along the Rows For 3x3 matrix
                                          function dspThrdRw($rc1,$rc2,$rc3,$rc4,$rc5,$rc6,$a1,$a2,$a3,$b1,$b2,$b3,$c1,$c2,$c3,$stepKey) {
                                      }
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 1
                                  </p>


                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } \\
                                      { dspVl($b1) } & { dspVl($b2) }
                                      \end{smallmatrix}\bigr)
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($b3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c1) } & { dspVl($a3) } \\
                                      { dspVl($c2) } & { dspVl($b2) }
                                      \end{smallmatrix}\bigr)
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($c3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c1) } & { dspVl($a2) } \\
                                      { dspVl($c2) } & { dspVl($b1) }
                                      \end{smallmatrix}\bigr)
                                      \;\;\Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size14" >
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 2
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\Big[\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \{\;\;({ dspVl($a2) } \times { dspVl($b2) } ) - ( { dspVl($a3) } \times
                                      { dspVl($b1) })\;\;\}
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]\;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (-1)^{({ $rc2 })} \times { dspVl($b3) } \times
                                      \{\;\;({ dspVl($c1) } \times { dspVl($b2) } ) - ( { dspVl($a3) } \times
                                      { dspVl($c2) })\;\;\}
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]\;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (-1)^{({ $rc3 })} \times { dspVl($c3) } \times
                                      \{\;\;({ dspVl($c1) } \times { dspVl($b1) } ) - ( { dspVl($a2) } \times
                                      { dspVl($c2) })\;\;\}
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size14" >
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 3
                                  </p>


                                  <p className="dtrmn_cols">
                                      \(
                                      =\Big[\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($a1) } \times
                                      \{\;\;( { gtVl([$a2, $b2]) } ) - ( { gtVl([$a3, $b1]) })\;\;\}
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($b3) } \times
                                      \{\;\;( { gtVl([$c1, $b2]) } ) - ( { gtVl([$a3, $c2]) })\;\;\}
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      (-1)^{({ $rc6 })} \times { dspVl($c3) } \times
                                      \{\;\;( { gtVl([$c1, $b1]) } ) - ( { gtVl([$a2, $c2]) })\;\;\}
                                      \;\;\Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size14" >
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 4
                                  </p>


                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($a1) } \times
                                      ( { gtVl([$a2, $b2]) - gtVl([$a3, $b1]) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($b3) } \times
                                      ( { gtVl([$c1, $b2]) - gtVl([$a3, $c2]) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      (-1)^{({ $rc6 })} \times { dspVl($c3) } \times
                                      ( { gtVl([$c1, $b1]) - gtVl([$a2, $c2]) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 5
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      ({ pow(-1, $rc4) }) \times ({ dspVl($a1) * (gtVl([$a2, $b2]) - gtVl([$a3, $b1])) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      ({ pow(-1, $rc5) }) \times ({ dspVl($b3) * (gtVl([$c1, $b2]) - gtVl([$a3, $c2])) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big[\;\;
                                      ({ pow(-1, $rc6) }) \times ({ dspVl($c3) * (gtVl([$c1, $b1]) - gtVl([$a2, $c2])) })
                                      \;\;\Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 6</p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big(
                                      { pow(-1, $rc4) * dspVl($a1) * (gtVl([$a2, $b2]) - gtVl([$a3, $b1])) }
                                      \Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big(
                                      { pow(-1, $rc5) * dspVl($b3) * (gtVl([$c1, $b2]) - gtVl([$a3, $c2])) }
                                      \Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \Big(
                                      { pow(-1, $rc6) * dspVl($c3) * (gtVl([$c1, $b1]) - gtVl([$a2, $c2])) }
                                      \Big)
                                      \)
                                  </p>
                                  </p>
                                  <?php
                                          }
          
                                          //Expand along the Rows For 4x4 matrix
                                          function dspFrthCl($rc1,$rc2,$rc3,$rc4,$rc5,$rc6,$rc7,$rc8,$a1,$a2,$a3,$a4,$b1,$b2,$b3,$b4,$c1,$c2,$c3,$c4,$d1,$d2,$d3,$d4,$stepKey) {
                                              }
                                  <p className="col s12 font_size20" style="margin-top:30px;">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 1
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($b4) } & { dspVl($c1) } & { dspVl($c2) }
                                      \end{vmatrix}
                                      \;\Big\}\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc2 })} \times { dspVl($c3) } \times
                                      \begin{vmatrix}
                                      { dspVl($c4) } & { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($b4) } & { dspVl($c1) } & { dspVl($c2) }
                                      \end{vmatrix}
                                      \;\Big\}\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;
                                      (-1)^{({ $rc3 })} \times { dspVl($d3) } \times
                                      \begin{vmatrix}
                                      { dspVl($c4) } & { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b4) } & { dspVl($c1) } & { dspVl($c2) }
                                      \end{vmatrix}
                                      \;\Big\}\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;
                                      (-1)^{({ $rc4 })} \times { dspVl($d4) } \times
                                      \begin{vmatrix}
                                      { dspVl($c4) } & { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) }
                                      \end{vmatrix}
                                      \;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 2
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;(-1)^{\;({ $rc1 })} \times { dspVl($a1) } \times\;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b2) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc2 })} \times { dspVl($c3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($b2) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc3 })} \times { dspVl($d3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($a3) } & { dspVl($a4) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc4 })} \times { dspVl($d4) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b2) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($b2) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($d1) } & { dspVl($d2) } \\
                                      { dspVl($a3) } & { dspVl($a4) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 3
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($b3) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($b3) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc2 })} \times { dspVl($c3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($b3) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($d1) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($d2) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($d1) } \times { dspVl($b3) }\;)
                                      \;-\;
                                      (\;{ dspVl($d2) } \times { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc3 })} \times { dspVl($d3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($d1) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($d2) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($d1) } \times { dspVl($a4) }\;)
                                      \;-\;
                                      (\;{ dspVl($d2) } \times { dspVl($a3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc4 })} \times { dspVl($d4) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($b3) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($d1) } \times { dspVl($b3) }\;)
                                      \;-\;
                                      (\;{ dspVl($d2) } \times { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($d1) } \times { dspVl($a4) }\;)
                                      \;-\;
                                      (\;{ dspVl($d2) } \times { dspVl($a3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}

                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 4
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc5 })} \times { dspVl($a1) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c2]) - gtVl([$b3, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c2]) - gtVl([$a4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b3]) - gtVl([$a4, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc6 })} \times { dspVl($c3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c2]) - gtVl([$b3, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $c2]) - gtVl([$d2, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $b3]) - gtVl([$d2, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc7 })} \times { dspVl($d3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c2]) - gtVl([$a4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $c2]) - gtVl([$d2, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $a4]) - gtVl([$d2, $a3]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}

                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc8 })} \times { dspVl($d4) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b3]) - gtVl([$a4, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $b3]) - gtVl([$d2, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $a4]) - gtVl([$d2, $a3]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 5
                                  </p>


                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc5 })} \times { dspVl($a1) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c2]) - gtVl([$b3, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c2]) - gtVl([$a4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b3]) - gtVl([$a4, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}

                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc6 })} \times { dspVl($c3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c2]) - gtVl([$b3, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $c2]) - gtVl([$d2, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $b3]) - gtVl([$d2, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc7 })} \times { dspVl($d3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c2]) - gtVl([$a4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $c2]) - gtVl([$d2, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $a4]) - gtVl([$d2, $a3]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}

                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big\{\;
                                      (-1)^{({ $rc8 })} \times { dspVl($d4) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b3]) - gtVl([$a4, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $b3]) - gtVl([$d2, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$d1, $a4]) - gtVl([$d2, $a3]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}

                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 6
                                  </p>
                                  \(
                                  =\;\Big[\;\; \\
                                  \;\Big\{\;\;
                                  ({ pow(-1, $rc5) }) \times { dspVl($a1) } \times
                                  \Big(\;
                                  ( { pow(-1, 1 + 1) * (dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) } )
                                  +
                                  ( { pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) } )
                                  +
                                  ( { pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) } )
                                  \;\Big)
                                  \;\Big\}\;\; \\
                                  + \\

                                  \;\Big\{\;\;
                                  ({ pow(-1, $rc6) }) \times { dspVl($c3) } \times
                                  \Big(\;
                                  ( { pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) } )
                                  +
                                  ( { pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$d1, $c2]) - gtVl([$d2, $c1]))) } )
                                  +
                                  ( { pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$d1, $b3]) - gtVl([$d2, $b2]))) } )
                                  \;\Big)
                                  \;\Big\}\;\; \\
                                  + \\

                                  \;\Big\{\;\;
                                  ({ pow(-1, $rc7) }) \times { dspVl($d3) } \times
                                  \Big(\;
                                  ( { pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) } )
                                  +
                                  ( { pow(-1, 2 + 1) * (dspVl($a2) * (gtVl([$d1, $c2]) - gtVl([$d2, $c1]))) } )
                                  +
                                  ( { pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$d1, $a4]) - gtVl([$d2, $a3]))) } )
                                  \;\Big)
                                  \;\Big\}\;\; \\
                                  + \\

                                  \;\Big\{\;\;
                                  ({ pow(-1, $rc8) }) \times { dspVl($d4) } \times
                                  \Big(\;
                                  ( { pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) } )
                                  +
                                  ( { pow(-1, 2 + 1) * (dspVl($a2) * (gtVl([$d1, $b3]) - gtVl([$d2, $b2]))) } )
                                  +
                                  ( { pow(-1, 3 + 1) * (dspVl($b1) * (gtVl([$d1, $a4]) - gtVl([$d2, $a3]))) } )
                                  \;\Big)
                                  \;\Big\}\;\; \\
                                  \;\;\Big]
                                  \)
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 7
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      \Big(\;
                                      ({ pow(-1, $rc5) * dspVl($a1) }) \times
                                      ({ pow(-1, 1 + 1) * (dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) })
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      ({ pow(-1, $rc6) * dspVl($c3) }) \times
                                      ({ pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$d1, $c2]) - gtVl([$d2, $c1]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$d1, $b3]) - gtVl([$d2, $b2]))) })
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      ({ pow(-1, $rc7) * dspVl($d3) }) \times
                                      ({ pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 2 + 1) * (dspVl($a2) * (gtVl([$d1, $c2]) - gtVl([$d2, $c1]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$d1, $a4]) - gtVl([$d2, $a3]))) })
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      ({ pow(-1, $rc8) * dspVl($d4) }) \times
                                      ({ pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) + pow(-1, 2 + 1) * (dspVl($a2) * (gtVl([$d1, $b3]) - gtVl([$d2, $b2]))) + pow(-1, 3 + 1) * (dspVl($b1) * (gtVl([$d1, $a4]) - gtVl([$d2, $a3]))) })
                                      \;\Big)
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 8
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      \Big(\;
                                      { pow(-1, $rc5) * dspVl($a1) * (pow(-1, 1 + 1) * (dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2])))) }
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      { pow(-1, $rc6) * dspVl($c3) * (pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$d1, $c2]) - gtVl([$d2, $c1]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$d1, $b3]) - gtVl([$d2, $b2])))) }
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      { pow(-1, $rc7) * dspVl($d3) * (pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 2 + 1) * (dspVl($a2) * (gtVl([$d1, $c2]) - gtVl([$d2, $c1]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$d1, $a4]) - gtVl([$d2, $a3])))) }
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      { pow(-1, $rc8) * dspVl($d4) * (pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) + pow(-1, 2 + 1) * (dspVl($a2) * (gtVl([$d1, $b3]) - gtVl([$d2, $b2]))) + pow(-1, 3 + 1) * (dspVl($b1) * (gtVl([$d1, $a4]) - gtVl([$d2, $a3])))) }
                                      \;\Big)
                                      \)
                                  </p>
                                  </p>

                                  <?php	}

                                          //Expand along the Rows For 4x4 matrix
                                          function dspFrthRw($rc1,$rc2,$rc3,$rc4,$rc5,$rc6,$rc7,$rc8,$a1,$a2,$a3,$a4,$b1,$b2,$b3,$b4,$c1,$c2,$c3,$c4,$d1,$d2,$d3,$d4,$stepKey) {
                                  }
                                  <p className="col s12 font_size20" style="margin-top:30px;">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 1
                                  </p>



                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($b4) } & { dspVl($c1) } & { dspVl($c2) }
                                      \end{vmatrix}
                                      \;\Big\}\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;
                                      (-1)^{({ $rc2 })} \times { dspVl($c3) } \times
                                      \begin{vmatrix}
                                      { dspVl($c4) } & { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($d1) } & { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($d2) } & { dspVl($c1) } & { dspVl($c2) } \\
                                      \end{vmatrix}
                                      \;\Big\}\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;
                                      (-1)^{({ $rc3 })} \times { dspVl($d3) } \times
                                      \begin{vmatrix}
                                      { dspVl($c4) } & { dspVl($a2) } & { dspVl($a4) } \\
                                      { dspVl($d1) } & { dspVl($b1) } & { dspVl($b3) } \\
                                      { dspVl($d2) } & { dspVl($b4) } & { dspVl($c2) } \\
                                      \end{vmatrix}
                                      \;\Big\}\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;
                                      (-1)^{({ $rc4 })} \times { dspVl($d4) } \times
                                      \begin{vmatrix}
                                      { dspVl($c4) } & { dspVl($a2) } & { dspVl($a3) } \\
                                      { dspVl($d1) } & { dspVl($b1) } & { dspVl($b2) } \\
                                      { dspVl($d2) } & { dspVl($b4) } & { dspVl($c1) } \\
                                      \end{vmatrix}
                                      \;\Big\}\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 2
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b2) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($c3) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($c3) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b2) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($d3) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b1) } & { dspVl($b3) } \\
                                      { dspVl($b4) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a2) } & { dspVl($a4) } \\
                                      { dspVl($b4) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a2) } & { dspVl($a4) } \\
                                      { dspVl($b1) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b1) } & { dspVl($b2) } \\
                                      { dspVl($b4) } & { dspVl($c1) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } \\
                                      { dspVl($b4) } & { dspVl($c1) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } \\
                                      { dspVl($b1) } & { dspVl($b2) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 3
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($b3) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($b3) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($c3) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($b3) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($b3) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}

                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($d3) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b1) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($b3) } \times { dspVl($b4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a2) } \times { dspVl($c2) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a2) } \times { dspVl($b3) }\;)
                                      \;-\;
                                      (\;{ dspVl($a4) } \times { dspVl($b1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(1+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b1) } \times { dspVl($c1) }\;)
                                      \;-\;
                                      (\;{ dspVl($b2) } \times { dspVl($b4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(2+1)} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a2) } \times { dspVl($c1) }\;)
                                      \;-\;
                                      (\;{ dspVl($a3) } \times { dspVl($b4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{(3+1)} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a2) } \times { dspVl($b2) }\;)
                                      \;-\;
                                      (\;{ dspVl($a3) } \times { dspVl($b1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 4
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($a1) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c2]) - gtVl([$b3, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c2]) - gtVl([$a4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($b4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b3]) - gtVl([$a4, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}

                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc6 })} \times { dspVl($c3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c2]) - gtVl([$b3, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c2]) - gtVl([$a4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b3]) - gtVl([$a4, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc7 })} \times { dspVl($d3) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b1, $c2]) - gtVl([$b3, $b4]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a2, $c2]) - gtVl([$a4, $b4]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a2, $b3]) - gtVl([$a4, '2_21']) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc8 })} \times { dspVl($d4) } \times
                                      \;\Big(
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 1 + 1 })} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b1, $c1]) - gtVl([$b2, $b4]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 2 + 1 })} \times { dspVl($d1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a2, $c1]) - gtVl([$a3, $b4]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      (-1)^{({ 3 + 1 })} \times { dspVl($d2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a2, $b2]) - gtVl([$a3, $b1]) }
                                      \end{smallmatrix}\bigr)
                                      \end{vmatrix}

                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big)\;\Big\}
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 5</p>
                                  \(
                                  =\;\Big[\;\; \\
                                  \;\Big\{\;\;
                                  ({ pow(-1, $rc5) }) \times { dspVl($a1) } \times \\
                                  \Big(\;
                                  ( { pow(-1, 1 + 1) * (dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) } )
                                  +
                                  ( { pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) } )
                                  +
                                  ( { pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) } )
                                  \;\Big)
                                  \;\Big\}\;\; \\
                                  + \\

                                  \;\Big\{\;\;
                                  ({ pow(-1, $rc6) }) \times { dspVl($c3) } \times \\
                                  \Big(\;
                                  ( { pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) } )
                                  +
                                  ( { pow(-1, 2 + 1) * (dspVl($d1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) } )
                                  +
                                  ( { pow(-1, 3 + 1) * (dspVl($d2) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) } )
                                  \;\Big)
                                  \;\Big\}\;\; \\
                                  + \\

                                  \;\Big\{\;\;
                                  ({ pow(-1, $rc7) }) \times { dspVl($d3) } \times \\
                                  \Big(\;
                                  ( { pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b1, $c2]) - gtVl([$b3, $b4]))) } )
                                  +
                                  ( { pow(-1, 2 + 1) * (dspVl($d1) * (gtVl([$a2, $c2]) - gtVl([$a4, $b4]))) } )
                                  +
                                  ( { pow(-1, 3 + 1) * (dspVl($d2) * (gtVl([$a2, $b3]) - gtVl([$a4, $b1]))) } )
                                  \;\Big)
                                  \;\Big\}\;\; \\
                                  + \\

                                  \;\Big\{\;\;
                                  ({ pow(-1, $rc8) }) \times { dspVl($d4) } \times \\
                                  \Big(\;
                                  ( { pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b1, $c1]) - gtVl([$b2, $b4]))) } )
                                  +
                                  ( { pow(-1, 2 + 1) * (dspVl($d1) * (gtVl([$a2, $c1]) - gtVl([$a3, $b4]))) } )
                                  +
                                  ( { pow(-1, 3 + 1) * (dspVl($d2) * (gtVl([$a2, $b2]) - gtVl([$a3, $b1]))) } )
                                  \;\Big)
                                  \;\Big\}\;\; \\
                                  \;\;\Big]
                                  \)
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 6
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      \Big(\;
                                      ({ pow(-1, $rc5) * dspVl($a1) }) \times
                                      ({ pow(-1, 1 + 1) * (dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) })
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      ({ pow(-1, $rc6) * dspVl($c3) }) \times
                                      ({ pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * (dspVl($d1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 3 + 1) * (dspVl($d2) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) })
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      ({ pow(-1, $rc7) * dspVl($d3) }) \times
                                      ({ pow(-1, 1 + 1) * (dspVl($c3) * (gtVl([$b1, $c2]) - gtVl([$b3, $b4]))) + pow(-1, 2 + 1) * (dspVl($a2) * (gtVl([$a2, $c2]) - gtVl([$a4, $b4]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$a2, $b3]) - gtVl([$a4, $b1]))) })
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      ({ pow(-1, $rc8) * dspVl($d4) }) \times
                                      ({ pow(-1, 1 + 1) * (dspVl($c3) * (gtVl([$b1, $c1]) - gtVl([$b2, $b4]))) + pow(-1, 2 + 1) * (dspVl($a2) * (gtVl([$a2, $c1]) - gtVl([$a3, $b4]))) + pow(-1, 3 + 1) * (dspVl($b1) * (gtVl([$a2, $b2]) - gtVl([$a3, $b1]))) })
                                      \;\Big)
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 7
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      \Big(\;
                                      { pow(-1, $rc5) * dspVl($a1) * (pow(-1, 1 + 1) * (dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * (dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 3 + 1) * (dspVl($b4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2])))) }
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      { pow(-1, $rc6) * dspVl($c3) * (pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * (dspVl($d1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 3 + 1) * (dspVl($d2) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2])))) }
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      { pow(-1, $rc7) * dspVl($d3) * (pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b1, $c2]) - gtVl([$b3, $b4]))) + pow(-1, 2 + 1) * (dspVl($d1) * (gtVl([$a2, $c2]) - gtVl([$a4, $b4]))) + pow(-1, 3 + 1) * (dspVl($d2) * (gtVl([$a2, $b3]) - gtVl([$a4, $b1])))) }
                                      \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \Big(\;
                                      { pow(-1, $rc8) * dspVl($d4) * (pow(-1, 1 + 1) * (dspVl($c4) * (gtVl([$b1, $c1]) - gtVl([$b2, $b4]))) + pow(-1, 2 + 1) * (dspVl($d1) * (gtVl([$a2, $c1]) - gtVl([$a3, $b4]))) + pow(-1, 3 + 1) * (dspVl($d2) * (gtVl([$a2, $b2]) - gtVl([$a3, $b1])))) }
                                      \;\Big)
                                      \)
                                  </p>
                                  </p>
                                  <?php	}

                                          //Expand along the Columns For 5x5 matrix
                                          function dspFifthCl($rc1,$rc2,$rc3,$rc4,$rc5,$rc6,$rc7,$rc8,$rc9,$rc10,$a1,$a2,$a3,$a4,$a5,$b1,$b2,$b3,$b4,$b5,$c1,$c2,$c3,$c4,$c5,$d1,$d2,$d3,$d4,$d5,$e1,$e2,$e3,$e4,$e5,$stepKey) {
                                  }
                                  <p className="col s12 font_size20" style="margin-top:30px;">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 1
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big\}\;\; +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($d3) } \times
                                      \begin{vmatrix}
                                      { dspVl($d4) } & { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big\}\;\; +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($e3) } \times
                                      \begin{vmatrix}
                                      { dspVl($d4) } & { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big\}\;\; +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($e4) } \times
                                      \begin{vmatrix}
                                      { dspVl($d4) } & { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big\}\;\; +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($e5) } \times
                                      \begin{vmatrix}
                                      { dspVl($d4) } & { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) } \\
                                      \end{vmatrix}
                                      \;\Big\}\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \( \;\;\Big] \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 2
                                  </p>
                                  <p className="dtrmn_cols">
                                      \( =\;\Big[\;\; \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \( (-1)^{({ $rc1 })} \times { dspVl($a1) } \times \;\Big\{\;\; \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\; +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\; +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\; +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      \;\Big\}\;\;
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;(-1)^{({ $rc2 })} \times { dspVl($d3) } \times \;\Big\{\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\; +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($e3) } \times \;\Big\{\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($e4) } \times \;\Big\{\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }
                                      \end{vmatrix}
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($e5) } \times \;\Big\{\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($b5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($d5) } & { dspVl($e1) } & { dspVl($e2) }\\
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }
                                      \end{vmatrix}
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\;\Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 3
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \;\Big\{\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($d3) } \times
                                      \;\Big\{\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($e3) } \times
                                      \;\Big\{\;\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a4) } & { dspVl($a5) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a4) } & { dspVl($a5) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($e4) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b1) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a4) } & { dspVl($a5) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a4) } & { dspVl($a5) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\;\Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($e5) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b1) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a4) } & { dspVl($a5) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($b5) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($e1) } & { dspVl($e2) } \\
                                      { dspVl($a4) } & { dspVl($a5) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)\;
                                      \;\Big\}\;
                                      \;\Big]\;
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 4
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(

                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($d3) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($e3) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($a5) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($a4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($a5) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($a4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($e4) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b1) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($a5) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($a4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($a5) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($a4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($e5) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($a2) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b1) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($a5) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($a4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)\;
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($b5) } \times
                                      \;\Big(\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($d5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($e1) } \times { dspVl($a5) }\;)\;-\;(\;{ dspVl($e2) } \times
                                      { dspVl($a4) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 5
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;
                                      ({ pow(-1, $rc6) * dspVl($a1) }) \times \;
                                      \Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times \;
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />

                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times \;
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                      \;\Big(\;\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      ({ pow(-1, $rc7) * dspVl($d3) }) \times
                                      \;\Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $d2]) - gtVl([$e2, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $c3]) - gtVl([$e2, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $d2]) - gtVl([$e2, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $b4]) - gtVl([$e2, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $c3]) - gtVl([$e2, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $b4]) - gtVl([$e2, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      ({ pow(-1, $rc8) * dspVl($e3) }) \times
                                      \;\Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 2 + 1) * dspVl($a2) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $d2]) - gtVl([$e2, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $c3]) - gtVl([$e2, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $d2]) - gtVl([$e2, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $a5]) - gtVl([$e2, $a4]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $c3]) - gtVl([$e2, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $a5]) - gtVl([$e2, $a4]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      ({ pow(-1, $rc9) * dspVl($e4) }) \times
                                      \;\Big\{\;
                                      \Big(\;\;
                                      ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 2 + 1) * dspVl($a2) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $d2]) - gtVl([$e2, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $b4]) - gtVl([$e2, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 3 + 1) * dspVl($b1) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $d2]) - gtVl([$e2, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $a5]) - gtVl([$e2, $a4]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $b4]) - gtVl([$e2, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $a5]) - gtVl([$e2, $a4]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      ({ pow(-1, $rc10) * dspVl($e5) }) \times
                                      \;\Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 2 + 1) * dspVl($a2) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $c3]) - gtVl([$e2, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $b4]) - gtVl([$e2, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 3 + 1) * dspVl($b1) }) \times
                                      \;\Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $c3]) - gtVl([$e2, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $a5]) - gtVl([$e2, $a4]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 4 + 1) * dspVl($b5) }) \times
                                      \;\Big(\;\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($d5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $b4]) - gtVl([$e2, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$e1, $a5]) - gtVl([$e2, $a4]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 6
                                  </p>
                                  \(
                                  =\;\Big[\;\;
                                  ({ pow(-1, $rc6) * dspVl($a1) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) } )
                                  )
                                  \Big) \\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) } )
                                  )
                                  \Big) \\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) } )
                                  )
                                  \Big) \\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) } )
                                  )
                                  \Big) \\
                                  \Big\}
                                  \Big] \\

                                  + \\

                                  \Big[\;\;
                                  ({ pow(-1, $rc7) * dspVl($d3) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) } )
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\

                                  + \\

                                  \Big[\;\;
                                  ({ pow(-1, $rc8) * dspVl($e3) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($a2) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])) } )
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\

                                  + \\

                                  \Big[\;\;
                                  ({ pow(-1, $rc9) * dspVl($e4) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) } )
                                  )
                                  \Big) \\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($a2) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($b1) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($b2) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])) } )
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\

                                  + \\

                                  \Big[\;\;
                                  ({ pow(-1, $rc10) * dspVl($e5) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($a2) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($b1) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])) } )
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($b5) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($b2) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])) } )
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\

                                  \)
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 7
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      ({ pow(-1, $rc6) * dspVl($a1) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 3 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) })
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \;\Big[\;\;
                                      ({ pow(-1, $rc7) * dspVl($d3) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2]))) + pow(-1, 3 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3]))) })
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \;\Big[\;\;
                                      ({ pow(-1, $rc8) * dspVl($e3) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 2 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2]))) + pow(-1, 3 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) })
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \;\Big[\;\;
                                      ({ pow(-1, $rc9) * dspVl($e4) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 2 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3]))) + pow(-1, 3 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) + pow(-1, 3 + 1) * dspVl($b2) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) })
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \;\Big[\;\;
                                      ({ pow(-1, $rc10) * dspVl($e5) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 2 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3]))) + pow(-1, 3 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) + pow(-1, 4 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) + pow(-1, 3 + 1) * dspVl($b2) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) })
                                      \;\;\Big]\;
                                      \)
                                  </p>

                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 8
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      { pow(-1, $rc6) *
                              dspVl($a1) *
                              (pow(-1, 1 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 3 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])))) }
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \;\Big[\;\;
                                      { pow(-1, $rc7) *
                              dspVl($d3) *
                              (pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2]))) + pow(-1, 3 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])))) }
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \;\Big[\;\;
                                      { pow(-1, $rc8) *
                              dspVl($e3) *
                              (pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 2 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2]))) + pow(-1, 3 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])))) }
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \;\Big[\;\;
                                      { pow(-1, $rc9) *
                              dspVl($e4) *
                              (pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 2 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3]))) + pow(-1, 3 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $d2]) - gtVl([$e2, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) + pow(-1, 3 + 1) * dspVl($b2) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])))) }
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      \;\Big[\;\;
                                      { pow(-1, $rc10) *
                              dspVl($e5) *
                              (pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 2 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3]))) + pow(-1, 3 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $c3]) - gtVl([$e2, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4]))) + pow(-1, 4 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($d5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) + pow(-1, 2 + 1) * dspVl($a3) * (gtVl([$e1, $b4]) - gtVl([$e2, $b3])) + pow(-1, 3 + 1) * dspVl($b2) * (gtVl([$e1, $a5]) - gtVl([$e2, $a4])))) }
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  </p>
                                  <?php	}
                  
                                          //Expand along the Columns For 5x5 matrix
                                          function dspFifthRw($rc1,$rc2,$rc3,$rc4,$rc5,$rc6,$rc7,$rc8,$rc9,$rc10,$a1,$a2,$a3,$a4,$a5,$b1,$b2,$b3,$b4,$b5,$c1,$c2,$c3,$c4,$c5,$d1,$d2,$d3,$d4,$d5,$e1,$e2,$e3,$e4,$e5,$stepKey) {
                                  }
                                  <p className="col s12 font_size20" style="margin-top:30px;">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 1
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big\}\;\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($d3) } \times
                                      \begin{vmatrix}
                                      { dspVl($d4) } & { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d5) } & { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($e1) } & { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($e2) } & { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big\}\;\; +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($e3) } \times
                                      \begin{vmatrix}
                                      { dspVl($d4) } & { dspVl($a2) } & { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d5) } & { dspVl($b1) } & { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($e1) } & { dspVl($b5) } & { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($e2) } & { dspVl($c4) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big\}\;\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($e4) } \times
                                      \begin{vmatrix}
                                      { dspVl($d4) } & { dspVl($a2) } & { dspVl($a3) } & { dspVl($a5) } \\
                                      { dspVl($d5) } & { dspVl($b1) } & { dspVl($b2) } & { dspVl($b4) } \\
                                      { dspVl($e1) } & { dspVl($b5) } & { dspVl($c1) } & { dspVl($c3) } \\
                                      { dspVl($e2) } & { dspVl($c4) } & { dspVl($c5) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big\}\;\; +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big\{\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($e5) } \times
                                      \begin{vmatrix}
                                      { dspVl($d4) } & { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($d5) } & { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($e1) } & { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) } \\
                                      { dspVl($e2) } & { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) } \\
                                      \end{vmatrix}
                                      \;\Big\}\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\;\Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 2
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \;\Big\{\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      \;\Big\}\;\;
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (-1)^{({ $rc2 })} \times { dspVl($d3) } \times
                                      \;\Big\{\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c5) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b2) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c1) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      \;\Big\}\;\;
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (-1)^{({ $rc3 })} \times { dspVl($e3) } \times
                                      \;\Big\{\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($b1) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($b5) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c4) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b5) } & { dspVl($c2) } & { dspVl($c3) }\\
                                      { dspVl($c4) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b1) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($c4) } & { dspVl($d1) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a4) } & { dspVl($a5) }\\
                                      { dspVl($b1) } & { dspVl($b3) } & { dspVl($b4) }\\
                                      { dspVl($b5) } & { dspVl($c2) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)
                                      \;\Big\}
                                      \;\Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (-1)^{({ $rc4 })} \times { dspVl($e4) } \times
                                      \;\Big\{\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b4) }\\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c3) }\\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a5) }\\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c3) }\\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a5) }\\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b4) }\\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d2) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a5) }\\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b4) }\\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c3) }
                                      \end{vmatrix}
                                      \;\Big)
                                      \;\Big\}
                                      \;\Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (-1)^{({ $rc5 })} \times { dspVl($e5) } \times
                                      \;\Big\{\;\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) }\\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) }\\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) }\\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) }\\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) }\\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) }\\
                                      { dspVl($c4) } & { dspVl($c5) } & { dspVl($d1) }
                                      \end{vmatrix}
                                      \;\Big)\;\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \begin{vmatrix}
                                      { dspVl($a2) } & { dspVl($a3) } & { dspVl($a4) }\\
                                      { dspVl($b1) } & { dspVl($b2) } & { dspVl($b3) }\\
                                      { dspVl($b5) } & { dspVl($c1) } & { dspVl($c2) }
                                      \end{vmatrix}
                                      \;\Big)
                                      \;\Big\}
                                      \;\Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 3
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \;\Big\{\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($d3) } \times
                                      \;\Big\{\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($e3) } \times
                                      \;\Big\{\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c2) } & { dspVl($c3) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($d1) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b3) } & { dspVl($b4) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($c2) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a4) } & { dspVl($a5) } \\
                                      { dspVl($b3) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($e4) } \times
                                      \;\Big\{\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c1) } & { dspVl($c3) } \\
                                      { dspVl($c5) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b4) } \\
                                      { dspVl($c5) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b4) } \\
                                      { dspVl($c1) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c1) } & { dspVl($c3) } \\
                                      { dspVl($c5) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a5) } \\
                                      { dspVl($c5) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a5) } \\
                                      { dspVl($c1) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b4) } \\
                                      { dspVl($c5) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a5) } \\
                                      { dspVl($c5) } & { dspVl($d2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a5) } \\
                                      { dspVl($b2) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b4) } \\
                                      { dspVl($c1) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a5) } \\
                                      { dspVl($c1) } & { dspVl($c3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a5) } \\
                                      { dspVl($b2) } & { dspVl($b4) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($e5) } \times
                                      \;\Big\{\;
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c1) } & { dspVl($c2) } \\
                                      { dspVl($c5) } & { dspVl($d1) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($c5) } & { dspVl($d1) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($c1) } & { dspVl($c2) } \\
                                      { dspVl($c5) } & { dspVl($d1) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($c5) } & { dspVl($d1) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($c5) } & { dspVl($d1) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($c5) } & { dspVl($d1) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b2) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($b2) } & { dspVl($b3) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(

                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($c1) } & { dspVl($c2) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      { dspVl($a3) } & { dspVl($a4) } \\
                                      { dspVl($b2) } & { dspVl($b3) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 4
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      (-1)^{({ $rc1 })} \times { dspVl($a1) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(4+1)} \times { dspVl($c4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc2 })} \times { dspVl($d3) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a3) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc3 })} \times { dspVl($e3) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($d1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a4) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b3) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc4 })} \times { dspVl($e4) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c1) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c1) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($c3) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($d2) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($b4) } \times
                                      { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($c3) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($b4) }\;)\;-\;(\;{ dspVl($a5) } \times
                                      { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      (-1)^{({ $rc5 })} \times { dspVl($e5) } \times
                                      \;\Big\{
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big(\;
                                      (-1)^{(1+1)} \times { dspVl($d4) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c1) } \times { dspVl($d1) }\;)\;-\;(\;{ dspVl($c2) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($d1) }\;)\;-\;(\;{ dspVl($b3) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($c2) }\;)\;-\;(\;{ dspVl($b3) } \times
                                      { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(2+1)} \times { dspVl($d5) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($c1) } \times { dspVl($d1) }\;)\;-\;(\;{ dspVl($c2) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($d1) }\;)\;-\;(\;{ dspVl($a4) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($c2) }\;)\;-\;(\;{ dspVl($a4) } \times
                                      { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(3+1)} \times { dspVl($e1) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($d1) }\;)\;-\;(\;{ dspVl($b3) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($d1) }\;)\;-\;(\;{ dspVl($a4) } \times
                                      { dspVl($c5) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($c4) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($b3) }\;)\;-\;(\;{ dspVl($a4) } \times
                                      { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      (-1)^{(4+1)} \times { dspVl($e2) } \times
                                      \Big(\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(1+1)} \times { dspVl($a2) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($b2) } \times { dspVl($c2) }\;)\;-\;(\;{ dspVl($b3) } \times
                                      { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(2+1)} \times { dspVl($b1) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($c2) }\;)\;-\;(\;{ dspVl($a4) } \times
                                      { dspVl($c1) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      (-1)^{(3+1)} \times { dspVl($b5) } \times
                                      \bigl(\begin{smallmatrix}
                                      (\;{ dspVl($a3) } \times { dspVl($b3) }\;)\;-\;(\;{ dspVl($a4) } \times
                                      { dspVl($b2) }\;)
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 5
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;
                                      ({ pow(-1, $rc6) * dspVl($a1) }) \times
                                      \;\Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;\;
                                      ({ pow(-1, $rc7) * dspVl($d3) }) \times
                                      \;\Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 2 + 1) * dspVl($d5) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 3 + 1) * dspVl($e1) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 4 + 1) * dspVl($e2) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a3) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      ({ pow(-1, 3 + 1) * dspVl($e3) }) \times
                                      \;\Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 2 + 1) * dspVl($d5) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c2, $d2]) - gtVl([$c3, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 3 + 1) * dspVl($e1) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $d2]) - gtVl([$b4, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $d2]) - gtVl([$a5, $d1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 4 + 1) * dspVl($e2) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b3, $c3]) - gtVl([$b4, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $c3]) - gtVl([$a5, $c2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a4, $b4]) - gtVl([$a5, $b3]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      ({ pow(-1, 4 + 1) * dspVl($e4) }) \times
                                      \;\Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c1, $d2]) - gtVl([$c3, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $d2]) - gtVl([$b4, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c3]) - gtVl([$b4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 2 + 1) * dspVl($d5) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c1, $d2]) - gtVl([$c3, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $d2]) - gtVl([$a5, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c3]) - gtVl([$a5, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 3 + 1) * dspVl($e1) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $d2]) - gtVl([$b4, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $d2]) - gtVl([$a5, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b4]) - gtVl([$a5, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 4 + 1) * dspVl($e2) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c3]) - gtVl([$b4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c3]) - gtVl([$a5, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b4]) - gtVl([$a5, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \Big[\;
                                      ({ pow(-1, 5 + 1) * dspVl($e5) }) \times
                                      \;\Big\{\;
                                      \Big(\;
                                      ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c1, $d1]) - gtVl([$c2, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $d1]) - gtVl([$b3, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c2]) - gtVl([$b3, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 2 + 1) * dspVl($d5) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$c1, $d1]) - gtVl([$c2, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $d1]) - gtVl([$a4, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c2]) - gtVl([$a4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;\;
                                      ({ pow(-1, 3 + 1) * dspVl($e1) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $d1]) - gtVl([$b3, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $d1]) - gtVl([$a4, $c5]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($c4) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b3]) - gtVl([$a4, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;\Big)
                                      \;\Big)
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      +
                                      \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big(\;
                                      ({ pow(-1, 4 + 1) * dspVl($e2) }) \times
                                      \Big(\;
                                      (\;
                                      ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$b2, $c2]) - gtVl([$b3, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;
                                      ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $c2]) - gtVl([$a4, $c1]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \;+\;
                                      (\;
                                      ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                      \bigl(\begin{smallmatrix}
                                      { gtVl([$a3, $b3]) - gtVl([$a4, $b2]) }
                                      \end{smallmatrix}\bigr)
                                      \;)
                                      \Big)
                                      \Big)
                                      \Big\}
                                      \Big]
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 6
                                  </p>
                                  \(
                                  =\;\Big[\;\;
                                  ({ pow(-1, $rc6) * dspVl($a1) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($a2) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($b1) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($b5) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($c4) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) })
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\

                                  + \\

                                  \Big[\;\;
                                  ({ pow(-1, $rc7) * dspVl($d3) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($d5) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($e1) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($e2) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) })
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\

                                  + \\

                                  \Big[\;\;
                                  ({ pow(-1, $rc8) * dspVl($e3) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($d5) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($e1) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($e2) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])) })
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\

                                  + \\

                                  \Big[\;\;
                                  ({ pow(-1, $rc9) * dspVl($e4) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c1, $d2]) - gtVl([$c3, $c5])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b2, $d2]) - gtVl([$b4, $c5])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b2, $c3]) - gtVl([$b4, $c1])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($d5) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c1, $d2]) - gtVl([$c3, $c5])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a3, $d2]) - gtVl([$a5, $c5])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $c3]) - gtVl([$a5, $c1])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($e1) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $d2]) - gtVl([$b4, $c5])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $d2]) - gtVl([$a5, $c5])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $b4]) - gtVl([$a5, $b2])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($e2) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $c3]) - gtVl([$b4, $c1])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $c3]) - gtVl([$a5, $c1])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a3, $b4]) - gtVl([$a5, $b2])) })
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\

                                  + \\

                                  \Big[\;\;
                                  ({ pow(-1, $rc10) * dspVl($e5) }) \times
                                  \;\Big\{\\
                                  \Big(
                                  ({ pow(-1, 1 + 1) * dspVl($d4) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c1, $d1]) - gtVl([$c2, $c5])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b2, $d1]) - gtVl([$b3, $c5])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 2 + 1) * dspVl($d5) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c1, $d1]) - gtVl([$c2, $c5])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a3, $d1]) - gtVl([$a4, $c5])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 3 + 1) * dspVl($e1) }) \times
                                  (
                                  ({ pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $d1]) - gtVl([$b3, $c5])) })
                                  +
                                  ({ pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $d1]) - gtVl([$a4, $c5])) })
                                  +
                                  ({ pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2])) })
                                  )
                                  \Big)\\
                                  +
                                  \Big(
                                  ({ pow(-1, 4 + 1) * dspVl($e2) }) \times
                                  (
                                  ( { pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1])) } )
                                  +
                                  ( { pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1])) } )
                                  +
                                  ( { pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2])) } )
                                  )
                                  \Big)\\
                                  \Big\}
                                  \Big]\\
                                  \)
                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 7
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      ({ pow(-1, $rc6) * dspVl($a1) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 3 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) })
                                      \;\;\Big]\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big[\;\;
                                      ({ pow(-1, $rc7) * dspVl($d3) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($d5) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 3 + 1) * dspVl($e1) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 4 + 1) * dspVl($e2) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) })
                                      \;\;\Big]\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big[\;\;
                                      ({ pow(-1, $rc8) * dspVl($e3) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($d5) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 3 + 1) * dspVl($e1) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 4 + 1) * dspVl($e2) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) })
                                      \;\;\Big]\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big[\;\;
                                      ({ pow(-1, $rc9) * dspVl($e4) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c1, $d2]) - gtVl([$c3, $c5])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b2, $d2]) - gtVl([$b4, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b2, $c3]) - gtVl([$b4, $c1]))) + pow(-1, 2 + 1) * dspVl($d5) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c1, $d2]) - gtVl([$c3, $c5])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a3, $d2]) - gtVl([$a5, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $c3]) - gtVl([$a5, $c1]))) + pow(-1, 3 + 1) * dspVl($e1) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $d2]) - gtVl([$b4, $c5])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $d2]) - gtVl([$a5, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $b4]) - gtVl([$a5, $b2]))) + pow(-1, 4 + 1) * dspVl($e2) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $c3]) - gtVl([$b4, $c1])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $c3]) - gtVl([$a5, $c1])) + pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a3, $b4]) - gtVl([$a5, $b2]))) })
                                      \;\;\Big]\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big[\;\;
                                      ({ pow(-1, $rc10) * dspVl($e5) })
                                      \times
                                      ({ pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c1, $d1]) - gtVl([$c2, $c5])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b2, $d1]) - gtVl([$b3, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * dspVl($d5) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c1, $d1]) - gtVl([$c2, $c5])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a3, $d1]) - gtVl([$a4, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 3 + 1) * dspVl($e1) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $d1]) - gtVl([$b3, $c5])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $d1]) - gtVl([$a4, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) + pow(-1, 4 + 1) * dspVl($e2) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1])) + pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) })
                                      \;\;\Big]\;
                                      \)
                                  </p>

                                  </p>

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >
                                      { $stepKey } : 8
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;\Big[\;\;
                                      { pow(-1, $rc6) *
                              dspVl($a1) *
                              (pow(-1, 1 + 1) * dspVl($a2) * (pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($b1) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 3 + 1) * dspVl($b5) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 4 + 1) * dspVl($c4) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])))) }
                                      \;\;\Big]\;
                                      +
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big[\;\;
                                      { pow(-1, $rc7) *
                              dspVl($d3) *
                              (pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($d5) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($c1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 3 + 1) * dspVl($e1) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 4 + 1) * dspVl($e2) * (pow(-1, 1 + 1) * dspVl($a3) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b2) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($c1) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])))) }
                                      \;\;\Big]\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big[\;\;
                                      { pow(-1, $rc8) *
                              dspVl($e3) *
                              (pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2]))) + pow(-1, 2 + 1) * dspVl($d5) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c2, $d2]) - gtVl([$c3, $d1])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2]))) + pow(-1, 3 + 1) * dspVl($e1) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b3, $d2]) - gtVl([$b4, $d1])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a4, $d2]) - gtVl([$a5, $d1])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3]))) + pow(-1, 4 + 1) * dspVl($e2) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b3, $c3]) - gtVl([$b4, $c2])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a4, $c3]) - gtVl([$a5, $c2])) + pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a4, $b4]) - gtVl([$a5, $b3])))) }
                                      \;\;\Big]\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big[\;\;
                                      { pow(-1, $rc9) *
                              dspVl($e4) *
                              (pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c1, $d2]) - gtVl([$c3, $c5])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b2, $d2]) - gtVl([$b4, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b2, $c3]) - gtVl([$b4, $c1]))) + pow(-1, 2 + 1) * dspVl($d5) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c1, $d2]) - gtVl([$c3, $c5])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a3, $d2]) - gtVl([$a5, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $c3]) - gtVl([$a5, $c1]))) + pow(-1, 3 + 1) * dspVl($e1) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $d2]) - gtVl([$b4, $c5])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $d2]) - gtVl([$a5, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $b4]) - gtVl([$a5, $b2]))) + pow(-1, 4 + 1) * dspVl($e2) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $c3]) - gtVl([$b4, $c1])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $c3]) - gtVl([$a5, $c1])) + pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a3, $b4]) - gtVl([$a5, $b2])))) }
                                      \;\;\Big]\;
                                      +
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;\Big[\;\;
                                      { pow(-1, $rc10) *
                              dspVl($e5) *
                              (pow(-1, 1 + 1) * dspVl($d4) * (pow(-1, 1 + 1) * dspVl($b1) * (gtVl([$c1, $d1]) - gtVl([$c2, $c5])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$b2, $d1]) - gtVl([$b3, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1]))) + pow(-1, 2 + 1) * dspVl($d5) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$c1, $d1]) - gtVl([$c2, $c5])) + pow(-1, 2 + 1) * dspVl($b5) * (gtVl([$a3, $d1]) - gtVl([$a4, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1]))) + pow(-1, 3 + 1) * dspVl($e1) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $d1]) - gtVl([$b3, $c5])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $d1]) - gtVl([$a4, $c5])) + pow(-1, 3 + 1) * dspVl($c4) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2]))) + pow(-1, 4 + 1) * dspVl($e2) * (pow(-1, 1 + 1) * dspVl($a2) * (gtVl([$b2, $c2]) - gtVl([$b3, $c1])) + pow(-1, 2 + 1) * dspVl($b1) * (gtVl([$a3, $c2]) - gtVl([$a4, $c1])) + pow(-1, 3 + 1) * dspVl($b5) * (gtVl([$a3, $b3]) - gtVl([$a4, $b2])))) }
                                      \;\;\Big]\;
                                      \)
                                  </p>
                                  </p>
                                  <?php	}
                  
                                      if (formData?.tech_dtrmn_slct_method=='2') { //Showing calculation of 2 x 2 Matrix

                                          if (formData?.tech_dtrmn_opts_method=='leibniz') { //Using Leibniz method

                                      }
                                  <p className="col s12 font_size16">
                                      \(
                                      det
                                      \begin{vmatrix}
                                      { dspVl('0_0') } & { dspVl('0_1') } \\
                                      { dspVl('1_0') } & { dspVl('1_1') }
                                      \end{vmatrix} \\
                                      \)
                                  </p>

                                  <p className="col s12 font_size16">
                                      \(
                                      \;=\; ( { dspVl('0_0') } \times { dspVl('1_1') } ) - ( { dspVl('0_1') } \times
                                      { dspVl('1_0') } )
                                      \)
                                  </p>

                                  <p className="col s12 font_size16">
                                      \(
                                      \;=\; { result?.tech_ans }
                                      \)
                                  </p>

                                  <?php

                                    } elseif (formData?.tech_dtrmn_opts_method=='exp_col' || formData?.tech_dtrmn_opts_method=='exp_row') {

                                        }
                                  <p className="col s12 font_size16">
                                      \(
                                      det
                                      \begin{vmatrix}
                                      { dspVl('0_0') } & { dspVl('0_1') } \\
                                      { dspVl('1_0') } & { dspVl('1_1') }
                                      \end{vmatrix} \\
                                      \)
                                  </p>

                                  <p className="col s12 font_size16">
                                      \(
                                      \;=\; { result?.tech_ans }
                                      \)
                                  </p>

                                  <?php

                                          }

                                      } elseif (formData?.tech_dtrmn_slct_method=='3') { //Showing calculation of 3 x 3 Matrix

                                          if (formData?.tech_dtrmn_opts_method=='leibniz') { //Using Leibniz method

                                              }

                                  <p className="col s12 font_size16">
                                      \(
                                      det
                                      \begin{vmatrix}
                                      { dspVl('0_0') } & { dspVl('0_1') } & { dspVl('0_2') } \\
                                      { dspVl('1_0') } & { dspVl('1_1') } & { dspVl('1_2') } \\
                                      { dspVl('2_0') } & { dspVl('2_1') } & { dspVl('2_2') }
                                      \end{vmatrix} \\
                                      \)
                                  </p>






                                  <p className="col s12 font_size16">


                                  <p className="dtrmn_cols">
                                      \(
                                      \;=\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_2') } )
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_0') } )
                                      \)
                                  </p>
                                  </p>

                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      =\; { result?.tech_ans }
                                      \)
                                  </p>
                                  </p>

                                  <?php
                  
                                          } elseif (formData?.tech_dtrmn_opts_method=='exp_col') { //Using Expand along the columns method
                                      }
                                  <p className="col s12 font_size14" >
                                      \(
                                      det
                                      \begin{vmatrix}
                                      { dspVl('0_0') } & { dspVl('0_1') } & { dspVl('0_2') } \\
                                      { dspVl('1_0') } & { dspVl('1_1') } & { dspVl('1_2') } \\
                                      { dspVl('2_0') } & { dspVl('2_1') } & { dspVl('2_2') }
                                      \end{vmatrix} \;=\;\\
                                      \)
                                  </p>
                                  <?php
                                              if (formData?.tech_dtrmn_opts=='1') { //Column 1
                                                  dspThrdCl("1+1","2+1","3+1",1+1,2+1,3+1,"0_0","1_1","1_2","2_1","2_2","1_0","0_1","0_2","2_0",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='2') { //Column 2
                                                  dspThrdCl("1+2","2+2","3+2",1+2,2+2,3+2,"0_1","1_0","1_2","2_0","2_2","1_1","0_0","0_2","2_1",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='3') { //Column 3
                                                  dspThrdCl("1+3","2+3","3+3",1+3,2+3,3+3,"0_2","1_0","1_1","2_0","2_1","1_2","0_0","0_1","2_2",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              }
                                          } elseif (formData?.tech_dtrmn_opts_method=='exp_row') { //Using Expand along the rows method
                                      }
                                  <p className="col s12 font_size14" >
                                      \(
                                      det
                                      \begin{vmatrix}
                                      { dspVl('0_0') } & { dspVl('0_1') } & { dspVl('0_2') } \\
                                      { dspVl('1_0') } & { dspVl('1_1') } & { dspVl('1_2') } \\
                                      { dspVl('2_0') } & { dspVl('2_1') } & { dspVl('2_2') }
                                      \end{vmatrix} \;=\;\\
                                      \)
                                  </p>
                                  <?php
                                              if (formData?.tech_dtrmn_opts=='1') { //Row 1
                                                  dspThrdRw("1+1","1+2","1+3",1+1,1+2,1+3,"0_0","1_1","1_2","2_1","2_2","0_1","1_0","2_0","0_2",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='2') { //Row 2
                                                  dspThrdRw("2+1","2+2","2+3",2+1,2+2,2+3,"1_0","0_1","0_2","2_1","2_2","1_1","0_0","2_0","1_2",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                                  
                                              } elseif (formData?.tech_dtrmn_opts=='3') { //Row 3
                                                  dspThrdRw("3+1","3+2","3+3",3+1,3+2,3+3,"2_0","0_1","0_2","1_1","1_2","2_1","0_0","1_0","2_2",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              }

                                          } elseif (formData?.tech_dtrmn_opts_method=='sarrus') { //Using Sarrus method
                                      }
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >Rule of
                                      Sarrus : </p>
                                  \(
                                  M =
                                  \begin{bmatrix}
                                  a11 & a12 & a13 \\
                                  a21 & a22 & a23 \\
                                  a31 & a32 & a33
                                  \end{bmatrix}
                                  \)
                                  <br />
                                  <br />
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      det(M)\;=
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a11 \times a22 \times a33\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a12 \times a23 \times a31\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a13 \times a21 \times a32\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;-\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a31 \times a22 \times a13\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;-\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a32 \times a23 \times a11\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;-\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a33 \times a21 \times a12\;)
                                      \)
                                  </p>
                                  <p className="color_blue left-align font_size20"></p>
                                  {{-- <img data-src="{ base_url('assets/img/sarrus-matrix.png') }" title="Rule of Sarrus"
                                      alt="Rule of Sarrus" className="image"
                                      style="display:block;width:222px;margin:10px 10px 0px;"> --}}
                                      <img src="{{asset('assets/img/sarrus-matrix.png')}}" height="100%" width="222px" alt="Rule of Sarrus" loading="lazy" decoding="async">
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:30px 0;">
                                      { data?.payload?.tech_lang_keys['14'] } : 1</p>
                                  \(
                                  det
                                  \begin{vmatrix}
                                  { dspVl('0_0') } & { dspVl('0_1') } & { dspVl('0_2') } \\
                                  { dspVl('1_0') } & { dspVl('1_1') } & { dspVl('1_2') } \\
                                  { dspVl('2_0') } & { dspVl('2_1') } & { dspVl('2_2') }
                                  \end{vmatrix} \\
                                  \)
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:30px 0;">
                                      { data?.payload?.tech_lang_keys['14'] } : 2</p>
                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      \Big(\;\; { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_2') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;\Big(\;\; { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_0') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;\Big(\;\; { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_1') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { dspVl('2_0') } \times { dspVl('1_1') } \times { dspVl('0_2') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { dspVl('2_1') } \times { dspVl('1_2') } \times { dspVl('0_0') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { dspVl('2_2') } \times { dspVl('1_0') } \times { dspVl('0_1') } \;\Big)
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:30px 0;">
                                      { data?.payload?.tech_lang_keys['14'] } : 3</p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      \Big(\;\; { gtVl(['0_0', '1_1', '2_2']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;\Big(\;\; { gtVl(['0_1', '1_2', '2_0']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;\Big(\;\; { gtVl(['0_2', '1_0', '2_1']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { gtVl(['2_0', '1_1', '0_2']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { gtVl(['2_1', '1_2', '0_0']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { gtVl(['2_2', '1_0', '0_1']) } \;\Big)
                                      \)
                                  </p>
                                  </p> */}

                        {/* <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:30px 0;">
                                      { data?.payload?.tech_lang_keys['14'] } : 4</p>
                                  \(
                                  =\;
                                  \Big(\;\;
                                  { gtVl(['0_0', '1_1', '2_2']) + gtVl(['0_1', '1_2', '2_0']) + gtVl(['0_2', '1_0', '2_1']) }
                                  \;\Big)
                                  -\;\Big(\;\;
                                  { gtVl(['2_0', '1_1', '0_2']) + gtVl(['2_1', '1_2', '0_0']) + gtVl(['2_2', '1_0', '0_1']) }
                                  \;\Big)
                                  \)
                                  </p>

                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                    } elseif (formData?.tech_dtrmn_opts_method=='triangle') { //Using Triangle method
                                      }

                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" >Triangle’s
                                      Rule : </p>
                                  \(
                                  M =
                                  \begin{bmatrix}
                                  a11 & a12 & a13 \\
                                  a21 & a22 & a23 \\
                                  a31 & a32 & a33
                                  \end{bmatrix}
                                  \)
                                  </p>
                                  <br />
                                  <p className="dtrmn_cols">
                                      \(
                                      det(M)\;=
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;(\;a11 \times a22 \times a33\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a12 \times a23 \times a31\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;+\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a13 \times a21 \times a32\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;-\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a31 \times a22 \times a13\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;-\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a32 \times a23 \times a11\;)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      \;-\;
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      (\;a33 \times a21 \times a12\;)
                                      \)
                                  </p>
                                  <p className="col s12 font_size20">
                                      <img src={getImgUrl(`/assets/img/triangle-matrix.png`)} height="100%" width="222px" alt="Rule of Triangle" loading="lazy" decoding="async"/>
                                  </p>

                                  <p className="col s12 font_size16" style="margin:50px 0 0 0;">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:30px 0;">
                                      { data?.payload?.tech_lang_keys['14'] } : 1</p>
                                  \(
                                  det
                                  \begin{vmatrix}
                                  { dspVl('0_0') } & { dspVl('0_1') } & { dspVl('0_2') } \\
                                  { dspVl('1_0') } & { dspVl('1_1') } & { dspVl('1_2') } \\
                                  { dspVl('2_0') } & { dspVl('2_1') } & { dspVl('2_2') }
                                  \end{vmatrix} \\
                                  \)
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:30px 0;">
                                      { data?.payload?.tech_lang_keys['14'] } : 2</p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      \Big(\;\; { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_2') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;\Big(\;\; { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_0') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;\Big(\;\; { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_1') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { dspVl('2_0') } \times { dspVl('1_1') } \times { dspVl('0_2') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { dspVl('2_1') } \times { dspVl('1_2') } \times { dspVl('0_0') } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { dspVl('2_2') } \times { dspVl('1_0') } \times { dspVl('0_1') } \;\Big)
                                      \)
                                  </p>
                                  </p> */}

                        {/* <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:30px 0;">
                                      { data?.payload?.tech_lang_keys['14'] } : 3</p>

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      \Big(\;\; { gtVl(['0_0', '1_1', '2_2']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;\Big(\;\; { gtVl(['0_1', '1_2', '2_0']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;\Big(\;\; { gtVl(['0_2', '1_0', '2_1']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { gtVl(['2_0', '1_1', '0_2']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { gtVl(['2_1', '1_2', '0_0']) } \;\Big)
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\Big(\;\; { gtVl(['2_2', '1_0', '0_1']) } \;\Big)
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size20">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:30px 0;">
                                      { data?.payload?.tech_lang_keys['14'] } : 4</p>
                                  \(
                                  =\;
                                  \Big(\;\;
                                  { gtVl(['0_0', '1_1', '2_2']) + gtVl(['0_1', '1_2', '2_0']) + gtVl(['0_2', '1_0', '2_1']) }
                                  \;\Big)
                                  -\;\Big(\;\;
                                  { gtVl(['2_0', '1_1', '0_2']) + gtVl(['2_1', '1_2', '0_0']) + gtVl(['2_2', '1_0', '0_1']) }
                                  \;\Big)
                                  \)
                                  </p>

                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                          }

                                      } elseif (formData?.tech_dtrmn_slct_method=='4') { //Showing calculation of 4 x 4 Matrix
                                      }
                                  <p className="col s12 font_size16">
                                      \(
                                      det
                                      \begin{vmatrix}
                                      { dspVl('0_0') } & { dspVl('0_1') } & { dspVl('0_2') } & { dspVl('0_3') } \\
                                      { dspVl('1_0') } & { dspVl('1_1') } & { dspVl('1_2') } & { dspVl('1_3') } \\
                                      { dspVl('2_0') } & { dspVl('2_1') } & { dspVl('2_2') } & { dspVl('2_3') } \\
                                      { dspVl('3_0') } & { dspVl('3_1') } & { dspVl('3_2') } & { dspVl('3_3') }
                                      \end{vmatrix} \;=\;\\
                                      \)
                                  </p>
                                  <?php
                                          if (formData?.tech_dtrmn_opts_method=='leibniz') { //Using Leibniz method

                                              }
                                  <p className="col s12 font_size16">

                                  <p className="dtrmn_cols">
                                      \(
                                      =\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_2') } \times
                                      { dspVl('3_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_3') } \times
                                      { dspVl('3_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_1') } \times
                                      { dspVl('3_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">

                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_3') } \times
                                      { dspVl('3_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_3') } \times { dspVl('2_1') } \times
                                      { dspVl('3_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_3') } \times { dspVl('2_2') } \times
                                      { dspVl('3_1') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_2') } \times
                                      { dspVl('3_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_3') } \times
                                      { dspVl('3_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_0') } \times
                                      { dspVl('3_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_3') } \times
                                      { dspVl('3_0') } )
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_3') } \times { dspVl('2_0') } \times
                                      { dspVl('3_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_3') } \times { dspVl('2_2') } \times
                                      { dspVl('3_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_1') } \times
                                      { dspVl('3_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_3') } \times
                                      { dspVl('3_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_0') } \times
                                      { dspVl('3_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_3') } \times
                                      { dspVl('3_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_3') } \times { dspVl('2_0') } \times
                                      { dspVl('3_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_3') } \times { dspVl('2_1') } \times
                                      { dspVl('3_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_0') } \times { dspVl('2_1') } \times
                                      { dspVl('3_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_0') } \times { dspVl('2_2') } \times
                                      { dspVl('3_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_1') } \times { dspVl('2_0') } \times
                                      { dspVl('3_2') } )
                                      \)
                                  </p>
                                  </p> */}
                        {/* <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_1') } \times { dspVl('2_2') } \times
                                      { dspVl('3_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_2') } \times { dspVl('2_0') } \times
                                      { dspVl('3_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_2') } \times { dspVl('2_1') } \times
                                      { dspVl('3_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      =\; { result?.tech_ans }
                                      \)
                                  </p>
                                  </p> */}
                        {/* <?php
                                          } elseif (formData?.tech_dtrmn_opts_method=='exp_col') { //Using Expand along the columns method

                                              if (formData?.tech_dtrmn_opts=='1') { //Column 1
                                                  dspFrthCl("1+1","2+1","3+1","4+1",1+1,2+1,3+1,4+1,"0_0","1_1","1_2","1_3","2_1","2_2","2_3","3_1","3_2","3_3","1_0","0_1","0_2","0_3","2_0","3_0",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='2') { //Column 2
                                                  dspFrthCl("1+2","2+2","3+2","4+2",1+2,2+2,3+2,4+2,"0_1","1_0","1_2","1_3","2_0","2_2","2_3","3_0","3_2","3_3","1_1","0_0","0_2","0_3","2_1","3_1",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='3') { //Column 3
                                                  dspFrthCl("1+3","2+3","3+3","4+3",1+3,2+3,3+3,4+3,"0_2","1_0","1_1","1_3","2_0","2_1","2_3","3_0","3_1","3_3","1_2","0_0","0_1","0_3","2_2","3_2",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='4') { //Column 4
                                                  dspFrthCl("1+4","2+4","3+4","4+4",1+4,2+4,3+4,4+4,"0_3","1_0","1_1","1_2","2_0","2_1","2_2","3_0","3_1","3_2","1_3","0_0","0_1","0_2","2_3","3_3",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              }

                                          } elseif (formData?.tech_dtrmn_opts_method=='exp_row') { //Using Expand along the rows method

                                              if (formData?.tech_dtrmn_opts=='1') { //Row 1
                                                  dspFrthRw("1+1","1+2","1+3","1+4",1+1,1+2,1+3,1+4,"0_0","1_1","1_2","1_3","2_1","2_2","2_3","3_1","3_2","3_3","0_1","1_0","2_0","3_0","0_2","0_3",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='2') { //Row 2
                                                  dspFrthRw("2+1","2+2","2+3","2+4",2+1,2+2,2+3,2+4,"1_0","0_1","0_2","0_3","2_1","2_2","2_3","3_1","3_2","3_3","1_1","0_0","2_0","3_0","1_2","1_3",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='3') { //Row 3
                                                  dspFrthRw("3+1","3+2","3+3","3+4",3+1,3+2,3+3,3+4,"2_0","0_1","0_2","0_3","1_1","1_2","1_3","3_1","3_2","3_3","2_1","0_0","1_0","3_0","2_2","2_3",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='4') { //Row 4
                                                  dspFrthRw("4+1","4+2","4+3","4+4",4+1,4+2,4+3,4+4,"3_0","0_1","0_2","0_3","1_1","1_2","1_3","2_1","2_2","2_3","3_1","0_0","1_0","2_0","3_2","3_3",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p> */}
                        {/* <?php
                                              }

                                          }

                                      } elseif (formData?.tech_dtrmn_slct_method=='5') { //Showing calculation of 5 x 5 Matrix

                                      }
                                  <p className="col s12 font_size16">
                                      \(
                                      det
                                      \begin{vmatrix}
                                      { dspVl('0_0') } & { dspVl('0_1') } & { dspVl('0_2') } & { dspVl('0_3') } &
                                      { dspVl('0_4') } \\
                                      { dspVl('1_0') } & { dspVl('1_1') } & { dspVl('1_2') } & { dspVl('1_3') } &
                                      { dspVl('1_4') } \\
                                      { dspVl('2_0') } & { dspVl('2_1') } & { dspVl('2_2') } & { dspVl('2_3') } &
                                      { dspVl('2_4') } \\
                                      { dspVl('3_0') } & { dspVl('3_1') } & { dspVl('3_2') } & { dspVl('3_3') } &
                                      { dspVl('3_4') } \\
                                      { dspVl('4_0') } & { dspVl('4_1') } & { dspVl('4_2') } & { dspVl('4_3') } &
                                      { dspVl('4_4') } \\
                                      \end{vmatrix} \;=\;\\
                                      \)
                                  </p>

                                  <?php
                                          if (formData?.tech_dtrmn_opts_method=='leibniz') { //Using Leibniz method
                                      }

                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_2') } \times
                                      { dspVl('3_3') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_2') } \times
                                      { dspVl('3_4') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_3') } \times
                                      { dspVl('3_2') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_3') } \times
                                      { dspVl('3_4') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_4') } \times
                                      { dspVl('3_2') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_1') } \times { dspVl('2_4') } \times
                                      { dspVl('3_3') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_1') } \times
                                      { dspVl('3_3') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_1') } \times
                                      { dspVl('3_4') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_3') } \times
                                      { dspVl('3_1') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_3') } \times
                                      { dspVl('3_4') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_4') } \times
                                      { dspVl('3_1') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_2') } \times { dspVl('2_4') } \times
                                      { dspVl('3_3') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_3') } \times { dspVl('2_1') } \times
                                      { dspVl('3_2') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_3') } \times { dspVl('2_1') } \times
                                      { dspVl('3_4') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_3') } \times { dspVl('2_2') } \times
                                      { dspVl('3_1') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p> */}
                        {/* <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_3') } \times { dspVl('2_2') } \times
                                      { dspVl('3_4') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_3') } \times { dspVl('2_4') } \times
                                      { dspVl('3_1') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_3') } \times { dspVl('2_4') } \times
                                      { dspVl('3_2') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_4') } \times { dspVl('2_1') } \times
                                      { dspVl('3_2') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_4') } \times { dspVl('2_1') } \times
                                      { dspVl('3_3') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_4') } \times { dspVl('2_2') } \times
                                      { dspVl('3_1') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_4') } \times { dspVl('2_2') } \times
                                      { dspVl('3_3') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_0') } \times { dspVl('1_4') } \times { dspVl('2_3') } \times
                                      { dspVl('3_1') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_0') } \times { dspVl('1_4') } \times { dspVl('2_3') } \times
                                      { dspVl('3_2') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_2') } \times
                                      { dspVl('3_3') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_2') } \times
                                      { dspVl('3_4') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_3') } \times
                                      { dspVl('3_2') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_3') } \times
                                      { dspVl('3_4') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_4') } \times
                                      { dspVl('3_2') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_0') } \times { dspVl('2_4') } \times
                                      { dspVl('3_3') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_0') } \times
                                      { dspVl('3_3') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_0') } \times
                                      { dspVl('3_4') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_3') } \times
                                      { dspVl('3_0') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_3') } \times
                                      { dspVl('3_4') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_4') } \times
                                      { dspVl('3_0') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_2') } \times { dspVl('2_4') } \times
                                      { dspVl('3_3') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_3') } \times { dspVl('2_0') } \times
                                      { dspVl('3_2') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_3') } \times { dspVl('2_0') } \times
                                      { dspVl('3_4') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_3') } \times { dspVl('2_2') } \times
                                      { dspVl('3_0') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p> */}
                        {/* <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_3') } \times { dspVl('2_2') } \times
                                      { dspVl('3_4') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_3') } \times { dspVl('2_4') } \times
                                      { dspVl('3_0') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_3') } \times { dspVl('2_4') } \times
                                      { dspVl('3_2') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_4') } \times { dspVl('2_0') } \times
                                      { dspVl('3_2') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_4') } \times { dspVl('2_0') } \times
                                      { dspVl('3_3') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_4') } \times { dspVl('2_2') } \times
                                      { dspVl('3_0') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_4') } \times { dspVl('2_2') } \times
                                      { dspVl('3_3') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_1') } \times { dspVl('1_4') } \times { dspVl('2_3') } \times
                                      { dspVl('3_0') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_1') } \times { dspVl('1_4') } \times { dspVl('2_3') } \times
                                      { dspVl('3_2') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_1') } \times
                                      { dspVl('3_3') } \times { dspVl('4_4') } )
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_1') } \times
                                      { dspVl('3_4') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_3') } \times
                                      { dspVl('3_1') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_3') } \times
                                      { dspVl('3_4') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_4') } \times
                                      { dspVl('3_1') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_0') } \times { dspVl('2_4') } \times
                                      { dspVl('3_3') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_0') } \times
                                      { dspVl('3_3') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_0') } \times
                                      { dspVl('3_4') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_3') } \times
                                      { dspVl('3_0') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p> */}
                        {/* <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_3') } \times
                                      { dspVl('3_4') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_4') } \times
                                      { dspVl('3_0') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_1') } \times { dspVl('2_4') } \times
                                      { dspVl('3_3') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_3') } \times { dspVl('2_0') } \times
                                      { dspVl('3_1') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_3') } \times { dspVl('2_0') } \times
                                      { dspVl('3_4') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_3') } \times { dspVl('2_1') } \times
                                      { dspVl('3_0') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_3') } \times { dspVl('2_1') } \times
                                      { dspVl('3_4') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_3') } \times { dspVl('2_4') } \times
                                      { dspVl('3_0') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_3') } \times { dspVl('2_4') } \times
                                      { dspVl('3_1') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_4') } \times { dspVl('2_0') } \times
                                      { dspVl('3_1') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_4') } \times { dspVl('2_0') } \times
                                      { dspVl('3_3') } \times { dspVl('4_1') } )
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_4') } \times { dspVl('2_1') } \times
                                      { dspVl('3_0') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_4') } \times { dspVl('2_1') } \times
                                      { dspVl('3_3') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_2') } \times { dspVl('1_4') } \times { dspVl('2_3') } \times
                                      { dspVl('3_0') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_2') } \times { dspVl('1_4') } \times { dspVl('2_3') } \times
                                      { dspVl('3_1') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_0') } \times { dspVl('2_1') } \times
                                      { dspVl('3_2') } \times { dspVl('4_4') } )

                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_0') } \times { dspVl('2_1') } \times
                                      { dspVl('3_4') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_0') } \times { dspVl('2_2') } \times
                                      { dspVl('3_1') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p> */}
                        {/* <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_0') } \times { dspVl('2_2') } \times
                                      { dspVl('3_4') } \times { dspVl('4_1') } )
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_0') } \times { dspVl('2_4') } \times
                                      { dspVl('3_1') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_0') } \times { dspVl('2_4') } \times
                                      { dspVl('3_2') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_1') } \times { dspVl('2_0') } \times
                                      { dspVl('3_2') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_1') } \times { dspVl('2_0') } \times
                                      { dspVl('3_4') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_1') } \times { dspVl('2_2') } \times
                                      { dspVl('3_0') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_1') } \times { dspVl('2_2') } \times
                                      { dspVl('3_4') } \times { dspVl('4_0') } )
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_1') } \times { dspVl('2_4') } \times
                                      { dspVl('3_0') } \times { dspVl('4_2') } )
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_1') } \times { dspVl('2_4') } \times
                                      { dspVl('3_2') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_2') } \times { dspVl('2_0') } \times
                                      { dspVl('3_1') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_2') } \times { dspVl('2_0') } \times
                                      { dspVl('3_4') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_2') } \times { dspVl('2_1') } \times
                                      { dspVl('3_0') } \times { dspVl('4_4') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_2') } \times { dspVl('2_1') } \times
                                      { dspVl('3_4') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_2') } \times { dspVl('2_4') } \times
                                      { dspVl('3_0') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_2') } \times { dspVl('2_4') } \times
                                      { dspVl('3_1') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_4') } \times { dspVl('2_0') } \times
                                      { dspVl('3_1') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_4') } \times { dspVl('2_0') } \times
                                      { dspVl('3_2') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_4') } \times { dspVl('2_1') } \times
                                      { dspVl('3_0') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_4') } \times { dspVl('2_1') } \times
                                      { dspVl('3_2') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_3') } \times { dspVl('1_4') } \times { dspVl('2_2') } \times
                                      { dspVl('3_0') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_3') } \times { dspVl('1_4') } \times { dspVl('2_2') } \times
                                      { dspVl('3_1') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p> */}
                        {/* <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_0') } \times { dspVl('2_1') } \times
                                      { dspVl('3_2') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_0') } \times { dspVl('2_1') } \times
                                      { dspVl('3_3') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_0') } \times { dspVl('2_2') } \times
                                      { dspVl('3_1') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_0') } \times { dspVl('2_2') } \times
                                      { dspVl('3_3') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_0') } \times { dspVl('2_3') } \times
                                      { dspVl('3_1') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_0') } \times { dspVl('2_3') } \times
                                      { dspVl('3_2') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_1') } \times { dspVl('2_0') } \times
                                      { dspVl('3_2') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_1') } \times { dspVl('2_0') } \times
                                      { dspVl('3_3') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_1') } \times { dspVl('2_2') } \times
                                      { dspVl('3_0') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_1') } \times { dspVl('2_2') } \times
                                      { dspVl('3_3') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_1') } \times { dspVl('2_3') } \times
                                      { dspVl('3_0') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_1') } \times { dspVl('2_3') } \times
                                      { dspVl('3_2') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_2') } \times { dspVl('2_0') } \times
                                      { dspVl('3_1') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_2') } \times { dspVl('2_0') } \times
                                      { dspVl('3_3') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_2') } \times { dspVl('2_1') } \times
                                      { dspVl('3_0') } \times { dspVl('4_3') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_2') } \times { dspVl('2_1') } \times
                                      { dspVl('3_3') } \times { dspVl('4_0') } )
                                      \)
                                  </p>

                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_2') } \times { dspVl('2_3') } \times
                                      { dspVl('3_0') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;\;
                                      ( { dspVl('0_4') } \times { dspVl('1_2') } \times { dspVl('2_3') } \times
                                      { dspVl('3_1') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_3') } \times { dspVl('2_0') } \times
                                      { dspVl('3_1') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_3') } \times { dspVl('2_0') } \times
                                      { dspVl('3_2') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_3') } \times { dspVl('2_1') } \times
                                      { dspVl('3_0') } \times { dspVl('4_2') } )
                                      \)
                                  </p>
                                  </p> */}
                        {/* <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_3') } \times { dspVl('2_1') } \times
                                      { dspVl('3_2') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      -\;
                                      ( { dspVl('0_4') } \times { dspVl('1_3') } \times { dspVl('2_2') } \times
                                      { dspVl('3_0') } \times { dspVl('4_1') } )
                                      \)
                                  </p>
                                  <p className="dtrmn_cols">
                                      \(
                                      +\;
                                      ( { dspVl('0_4') } \times { dspVl('1_3') } \times { dspVl('2_2') } \times
                                      { dspVl('3_1') } \times { dspVl('4_0') } )
                                      \)
                                  </p>
                                  </p>
                                  <p className="col s12 font_size16">
                                  <p className="dtrmn_cols">
                                      \(
                                      =\; { result?.tech_ans }
                                      \)
                                  </p>
                                  </p> */}
                        {/* <?php

                                          } elseif (formData?.tech_dtrmn_opts_method=='exp_col') { //Using Expand along the columns method

                                              if (formData?.tech_dtrmn_opts=='1') { //Column 1
                                                  dspFifthCl("1+1","2+1","3+1","4+1","5+1",1+1,2+1,3+1,4+1,5+1,"0_0","1_1","1_2","1_3","1_4","2_1","2_2","2_3","2_4","3_1","3_2","3_3","3_4","4_1","4_2","4_3","4_4","1_0","0_1","0_2","0_3","0_4","2_0","3_0","4_0",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='2') { //Column 2
                                                  dspFifthCl("1+2","2+2","3+2","4+2","5+2",1+2,2+2,3+2,4+2,5+2,"0_1","1_0","1_2","1_3","1_4","2_0","2_2","2_3","2_4","3_0","3_2","3_3","3_4","4_0","4_2","4_3","4_4","1_1","0_0","0_2","0_3","0_4","2_1","3_1","4_1",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='3') { //Column 3
                                                  dspFifthCl("1+3","2+3","3+3","4+3","5+3",1+3,2+3,3+3,4+3,5+3,"0_2","1_0","1_1","1_3","1_4","2_0","2_1","2_3","2_4","3_0","3_1","3_3","3_4","4_0","4_1","4_3","4_4","1_2","0_0","0_1","0_3","0_4","2_2","3_2","4_2",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='4') { //Column 4
                                                  dspFifthCl("1+4","2+4","3+4","4+4","5+4",1+4,2+4,3+4,4+4,5+4,"0_3","1_0","1_1","1_2","1_4","2_0","2_1","2_2","2_4","3_0","3_1","3_2","3_4","4_0","4_1","4_2","4_4","1_3","0_0","0_1","0_2","0_4","2_3","3_3","4_3",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='5') { //Column 5
                                                  dspFifthCl("1+5","2+5","3+5","4+5","5+5",1+5,2+5,3+5,4+5,5+5,"0_4","1_0","1_1","1_2","1_3","2_0","2_1","2_2","2_3","3_0","3_1","3_2","3_3","4_0","4_1","4_2","4_3","1_4","0_0","0_1","0_2","0_3","2_4","3_4","4_4",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              }
                                          
                                          } elseif (formData?.tech_dtrmn_opts_method=='exp_row') { //Using Expand along the rows method

                                              if (formData?.tech_dtrmn_opts=='1') { //Row 1
                                                  dspFifthRw("1+1","1+2","1+3","1+4","1+5",1+1,1+2,1+3,1+4,1+5,"0_0","1_1","1_2","1_3","1_4","2_1","2_2","2_3","2_4","3_1","3_2","3_3","3_4","4_1","4_2","4_3","4_4","0_1","1_0","2_0","3_0","4_0","0_2","0_3","0_4",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='2') { //Row 2
                                                  dspFifthRw("2+1","2+2","2+3","2+4","2+5",2+1,2+2,2+3,2+4,2+5,"1_0","0_1","0_2","0_3","0_4","2_1","2_2","2_3","2_4","3_1","3_2","3_3","3_4","4_1","4_2","4_3","4_4","1_1","0_0","2_0","3_0","4_0","1_2","1_3","1_4",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='3') { //Row 3
                                                  dspFifthRw("3+1","3+2","3+3","3+4","3+5",3+1,3+2,3+3,3+4,3+5,"2_0","0_1","0_2","0_3","0_4","1_1","1_2","1_3","1_4","3_1","3_2","3_3","3_4","4_1","4_2","4_3","4_4","2_1","0_0","1_0","3_0","4_0","2_2","2_3","2_4",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='4') { //Row 4
                                                  dspFifthRw("4+1","4+2","4+3","4+4","4+5",4+1,4+2,4+3,4+4,4+5,"3_0","0_1","0_2","0_3","0_4","1_1","1_2","1_3","1_4","2_1","2_2","2_3","2_4","4_1","4_2","4_3","4_4","3_1","0_0","1_0","2_0","4_0","3_2","3_3","3_4",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              } elseif (formData?.tech_dtrmn_opts=='5') { //Row 5
                                                  dspFifthRw("5+1","5+2","5+3","5+4","5+5",5+1,5+2,5+3,5+4,5+5,"4_0","0_1","0_2","0_3","0_4","1_1","1_2","1_3","1_4","2_1","2_2","2_3","2_4","3_1","3_2","3_3","3_4","4_1","0_0","1_0","2_0","3_0","4_2","4_3","4_4",data?.payload?.tech_lang_keys['14']);
                                      }
                                  <p className="col s12 font_size16">
                                  <p className="color_blue left-align font_size20" style="font-weight:600;margin:25px 0;">
                                      { data?.payload?.tech_lang_keys['15'] } = { result?.tech_ans }</p>
                                  </p>
                                  <?php
                                              }
                                          }
                                      }
                                      }
                                  </p> */}
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

export default DeterminantCalculator;
