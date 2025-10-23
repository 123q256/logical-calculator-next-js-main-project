"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useRingSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RingSizeCalculator = () => {
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
    tech_unit: "inches", //  inches  millimeters
    tech_to_measure: "d_o_r",
    tech_d_o_r_mm: 10.72,
    tech_d_o_r_in: 0.442,
    tech_c_o_f_mm: 33.68,
    tech_c_o_f_in: 1.39,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRingSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_unit || !formData.tech_to_measure) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit: formData.tech_unit,
        tech_to_measure: formData.tech_to_measure,
        tech_d_o_r_mm: formData.tech_d_o_r_mm,
        tech_d_o_r_in: formData.tech_d_o_r_in,
        tech_c_o_f_mm: formData.tech_c_o_f_mm,
        tech_c_o_f_in: formData.tech_c_o_f_in,
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
      tech_unit: "inches", //  inches  millimeters
      tech_to_measure: "d_o_r",
      tech_d_o_r_mm: 10.72,
      tech_d_o_r_in: 0.442,
      tech_c_o_f_mm: 33.68,
      tech_c_o_f_in: 1.39,
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <input
                type="hidden"
                name="tech_unit"
                id="calculator_time"
                value={formData.tech_unit}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit === "millimeters" ? "tagsUnit" : ""
                    }`}
                    id="millimeters"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit: "millimeters" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit === "inches" ? "tagsUnit" : ""
                    }`}
                    id="inches"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit: "inches" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["3"]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_to_measure" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_to_measure"
                    id="tech_to_measure"
                    value={formData.tech_to_measure}
                    onChange={handleChange}
                  >
                    <option value="d_o_r">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="c_o_f">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_unit == "millimeters" && (
                <>
                  {formData.tech_to_measure == "d_o_r" && (
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_d_o_r_mm" className="label">
                        {data?.payload?.tech_lang_keys["8"]}:
                      </label>
                      <div className="mt-2 relative">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_d_o_r_mm"
                          id="tech_d_o_r_mm"
                          value={formData.tech_d_o_r_mm}
                          onChange={handleChange}
                        >
                          {[
                            "9.91",
                            "10.72",
                            "11.53",
                            "11.95",
                            "12.37",
                            "12.60",
                            "12.78",
                            "13.00",
                            "13.21",
                            "13.41",
                            "13.61",
                            "13.83",
                            "14.05",
                            "14.15",
                            "14.25",
                            "14.36",
                            "14.45",
                            "14.56",
                            "14.65",
                            "14.86",
                            "15.04",
                            "15.27",
                            "15.40",
                            "15.53",
                            "15.70",
                            "15.80",
                            "15.90",
                            "16.00",
                            "16.10",
                            "16.30",
                            "16.41",
                            "16.51",
                            "16.71",
                            "16.92",
                            "17.13",
                            "17.35",
                            "17.45",
                            "17.75",
                            "17.97",
                            "18.19",
                            "18.35",
                            "18.53",
                            "18.61",
                            "18.69",
                            "18.80",
                            "18.89",
                            "19.10",
                            "19.22",
                            "19.31",
                            "19.41",
                            "19.51",
                            "19.62",
                            "19.84",
                            "20.02",
                            "20.20",
                            "20.32",
                            "20.44",
                            "20.68",
                            "20.76",
                            "20.85",
                            "20.94",
                            "21.08",
                            "21.18",
                            "21.24",
                            "21.30",
                            "21.49",
                            "21.69",
                            "21.89",
                            "22.10",
                            "22.33",
                            "22.60",
                          ].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                        <span className="input_unit">mm</span>
                      </div>
                    </div>
                  )}
                  {formData.tech_to_measure == "c_o_f" && (
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_d_o_r_in" className="label">
                        {data?.payload?.tech_lang_keys["7"]}:
                      </label>
                      <div className="mt-2 relative">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_d_o_r_in"
                          id="tech_d_o_r_in"
                          value={formData.tech_d_o_r_in}
                          onChange={handleChange}
                        >
                          <option value="0.39">0.39</option>
                          <option value="0.442">0.442</option>
                          <option value="0.454">0.454</option>
                          <option value="0.474">0.474</option>
                          <option value="0.482">0.482</option>
                          <option value="0.487">0.487</option>
                          <option value="0.496">0.496</option>
                          <option value="0.503">0.503</option>
                          <option value="0.512">0.512</option>
                          <option value="0.520">0.520</option>
                          <option value="0.528">0.528</option>
                          <option value="0.536">0.536</option>
                          <option value="0.544">0.544</option>
                          <option value="0.553">0.553</option>
                          <option value="0.557">0.557</option>
                          <option value="0.561">0.561</option>
                          <option value="0.565">0.565</option>
                          <option value="0.569">0.569</option>
                          <option value="0.573">0.573</option>
                          <option value="0.577">0.577</option>
                          <option value="0.585">0.585</option>
                          <option value="0.592">0.592</option>
                          <option value="0.601">0.601</option>
                          <option value="0.606">0.606</option>
                          <option value="0.611">0.611</option>
                          <option value="0.618">0.618</option>
                          <option value="0.622">0.622</option>
                          <option value="0.626">0.626</option>
                          <option value="0.630">0.630</option>
                          <option value="0.634">0.634</option>
                          <option value="0.642">0.642</option>
                          <option value="0.646">0.646</option>
                          <option value="0.650">0.650</option>
                          <option value="0.658">0.658</option>
                          <option value="0.666">0.666</option>
                          <option value="0.674">0.674</option>
                          <option value="0.683">0.683</option>
                          <option value="0.687">0.687</option>
                          <option value="0.699">0.699</option>
                          <option value="0.707">0.707</option>
                          <option value="0.716">0.716</option>
                          <option value="0.722">0.722</option>
                          <option value="0.729">0.729</option>
                          <option value="0.733">0.733</option>
                          <option value="0.736">0.736</option>
                          <option value="0.740">0.740</option>
                          <option value="0.748">0.748</option>
                          <option value="0.752">0.752</option>
                          <option value="0.757">0.757</option>
                          <option value="0.760">0.760</option>
                          <option value="0.764">0.764</option>
                          <option value="0.768">0.768</option>
                          <option value="0.772">0.772</option>
                          <option value="0.781">0.781</option>
                          <option value="0.788">0.788</option>
                          <option value="0.797">0.797</option>
                          <option value="0.800">0.800</option>
                          <option value="0.805">0.805</option>
                          <option value="0.814">0.814</option>
                          <option value="0.817">0.817</option>
                          <option value="0.821">0.821</option>
                          <option value="0.824">0.824</option>
                          <option value="0.830">0.830</option>
                          <option value="0.834">0.834</option>
                          <option value="0.836">0.836</option>
                          <option value="0.839">0.839</option>
                          <option value="0.846">0.846</option>
                          <option value="0.854">0.854</option>
                          <option value="0.862">0.862</option>
                          <option value="0.870">0.870</option>
                          <option value="0.879">0.879</option>
                          <option value="0.891">0.891</option>
                        </select>
                        <span className="input_unit text-blue">mm</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              {formData.tech_unit == "inches" && (
                <>
                  {formData.tech_to_measure == "d_o_r" && (
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_d_o_r_in" className="label">
                        {data?.payload?.tech_lang_keys["8"]}:
                      </label>
                      <div className="mt-2 relative">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_d_o_r_in"
                          id="tech_d_o_r_in"
                          value={formData.tech_d_o_r_in}
                          onChange={handleChange}
                        >
                          {[
                            "0.39",
                            "0.442",
                            "0.454",
                            "0.474",
                            "0.482",
                            "0.487",
                            "0.496",
                            "0.503",
                            "0.512",
                            "0.520",
                            "0.528",
                            "0.536",
                            "0.544",
                            "0.553",
                            "0.557",
                            "0.561",
                            "0.565",
                            "0.569",
                            "0.573",
                            "0.577",
                            "0.585",
                            "0.592",
                            "0.601",
                            "0.606",
                            "0.611",
                            "0.618",
                            "0.622",
                            "0.626",
                            "0.630",
                            "0.634",
                            "0.642",
                            "0.646",
                            "0.650",
                            "0.658",
                            "0.666",
                            "0.674",
                            "0.683",
                            "0.687",
                            "0.699",
                            "0.707",
                            "0.716",
                            "0.722",
                            "0.729",
                            "0.733",
                            "0.736",
                            "0.740",
                            "0.748",
                            "0.752",
                            "0.757",
                            "0.760",
                            "0.764",
                            "0.768",
                            "0.772",
                            "0.781",
                            "0.788",
                            "0.797",
                            "0.800",
                            "0.805",
                            "0.814",
                            "0.817",
                            "0.821",
                            "0.824",
                            "0.830",
                            "0.834",
                            "0.836",
                            "0.839",
                            "0.846",
                            "0.854",
                            "0.862",
                            "0.870",
                            "0.879",
                            "0.891",
                          ].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                        <span className="input_unit">in</span>
                      </div>
                    </div>
                  )}
                  {formData.tech_to_measure == "c_o_f" && (
                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_c_o_f_in" className="label">
                        {data?.payload?.tech_lang_keys["7"]}:
                      </label>
                      <div className="mt-2 flex items-center gap-2 relative">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_c_o_f_in"
                          id="tech_c_o_f_in"
                          value={formData.tech_c_o_f_in}
                          onChange={handleChange}
                        >
                          <option value="1.22">1.22</option>
                          <option value="1.39">1.39</option>
                          <option value="1.43">1.43</option>
                          <option value="1.49">1.49</option>
                          <option value="1.51">1.51</option>
                          <option value="1.53">1.53</option>
                          <option value="1.56">1.56</option>
                          <option value="1.58">1.58</option>
                          <option value="1.61">1.61</option>
                          <option value="1.63">1.63</option>
                          <option value="1.66">1.66</option>
                          <option value="1.68">1.68</option>
                          <option value="1.71">1.71</option>
                          <option value="1.74">1.74</option>
                          <option value="1.75">1.75</option>
                          <option value="1.76">1.76</option>
                          <option value="1.77">1.77</option>
                          <option value="1.79">1.79</option>
                          <option value="1.80">1.80</option>
                          <option value="1.81">1.81</option>
                          <option value="1.84">1.84</option>
                          <option value="1.86">1.86</option>
                          <option value="1.89">1.89</option>
                          <option value="1.90">1.90</option>
                          <option value="1.92">1.92</option>
                          <option value="1.94">1.94</option>
                          <option value="1.95">1.95</option>
                          <option value="1.97">1.97</option>
                          <option value="1.98">1.98</option>
                          <option value="1.99">1.99</option>
                          <option value="2.02">2.02</option>
                          <option value="2.03">2.03</option>
                          <option value="2.04">2.04</option>
                          <option value="2.07">2.07</option>
                          <option value="2.09">2.09</option>
                          <option value="2.12">2.12</option>
                          <option value="2.15">2.15</option>
                          <option value="2.16">2.16</option>
                          <option value="2.20">2.20</option>
                          <option value="2.22">2.22</option>
                          <option value="2.25">2.25</option>
                          <option value="2.27">2.27</option>
                          <option value="2.29">2.29</option>
                          <option value="2.30">2.30</option>
                          <option value="2.31">2.31</option>
                          <option value="2.32">2.32</option>
                          <option value="2.35">2.35</option>
                          <option value="2.36">2.36</option>
                          <option value="2.38">2.38</option>
                          <option value="2.39">2.39</option>
                          <option value="2.40">2.40</option>
                          <option value="2.41">2.41</option>
                          <option value="2.43">2.43</option>
                          <option value="2.45">2.45</option>
                          <option value="2.48">2.48</option>
                          <option value="2.50">2.50</option>
                          <option value="2.51">2.51</option>
                          <option value="2.53">2.53</option>
                          <option value="2.56">2.56</option>
                          <option value="2.57">2.57</option>
                          <option value="2.58">2.58</option>
                          <option value="2.59">2.59</option>
                          <option value="2.61">2.61</option>
                          <option value="2.62">2.62</option>
                          <option value="2.63">2.63</option>
                          <option value="2.64">2.64</option>
                          <option value="2.66">2.66</option>
                          <option value="2.68">2.68</option>
                          <option value="2.71">2.71</option>
                          <option value="2.73">2.73</option>
                          <option value="2.76">2.76</option>
                          <option value="2.80">2.80</option>
                        </select>
                        <span className="input_unit text-blue">in</span>
                      </div>
                    </div>
                  )}
                </>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[60%] lg:w-[60%] text-[18px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {formData?.tech_to_measure === "d_o_r"
                                      ? `${data?.payload?.tech_lang_keys[7]} :`
                                      : formData?.tech_to_measure === "c_o_f"
                                      ? `${data?.payload?.tech_lang_keys[8]} :`
                                      : null}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_ring_size).toFixed(2)}{" "}
                                  {result?.tech_unit}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full overflow-auto">
                          <table className="w-full mt-2">
                            <thead>
                              <tr>
                                <td className="border-b p-2">
                                  <b>{data?.payload?.tech_lang_keys[9]}</b>
                                </td>
                                <td className="border-b p-2">
                                  <b>{data?.payload?.tech_lang_keys[10]}</b>
                                </td>
                                <td className="border-b p-2">
                                  <b>{data?.payload?.tech_lang_keys[11]}</b>
                                </td>
                                <td className="border-b p-2">
                                  <b>{data?.payload?.tech_lang_keys[12]}</b>
                                </td>
                                <td className="border-b p-2">
                                  <b>{data?.payload?.tech_lang_keys[13]}</b>
                                </td>
                                <td className="border-b p-2">
                                  <b>{data?.payload?.tech_lang_keys[14]}</b>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b p-2">
                                  {result?.tech_uk_au}
                                </td>
                                <td className="border-b p-2">
                                  {result?.tech_us_ca}
                                </td>
                                <td className="border-b p-2">
                                  {result?.tech_f}
                                </td>
                                <td className="border-b p-2">
                                  {result?.tech_g}
                                </td>
                                <td className="border-b p-2">
                                  {result?.tech_j}
                                </td>
                                <td className="border-b p-2">
                                  {result?.tech_s}
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default RingSizeCalculator;
