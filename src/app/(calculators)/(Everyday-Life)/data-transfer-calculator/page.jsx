"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDataFransferCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DataFransferCalculator = () => {
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
    tech_first: 620,
    tech_f_unit: "15", //  1   to 26
    tech_second: 2,
    tech_s_unit: "24", //  1   to 26
    tech_overhead: "2", //  1 2 3 4 5  6 7
    tech_kilo: "2", //  1 2
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDataFransferCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_first || !formData.tech_f_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_first: formData.tech_first,
        tech_f_unit: formData.tech_f_unit,
        tech_second: formData.tech_second,
        tech_s_unit: formData.tech_s_unit,
        tech_overhead: formData.tech_overhead,
        tech_kilo: formData.tech_kilo,
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
      tech_first: 100,
      tech_f_unit: "15", //  1   to 26
      tech_second: 10,
      tech_s_unit: "24", //  1   to 26
      tech_overhead: "1", //  1 2 3 4 5  6 7
      tech_kilo: "1", //  1 2
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

  let hours_ans = "";
  let minutes_ans = "";
  let seconds_ans = "";

  if (result?.tech_main_ans) {
    [hours_ans, minutes_ans, seconds_ans] = result.tech_main_ans.split(":");
  }

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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6 file-size">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-8">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_first"
                        id="tech_first"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_first}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_f_unit"
                        id="tech_f_unit"
                        value={formData.tech_f_unit}
                        onChange={handleChange}
                      >
                        <option value="1">B</option>
                        <option value="2">kB</option>
                        <option value="3">MB</option>
                        <option value="4">GB</option>
                        <option value="5">TB</option>
                        <option value="6">PB</option>
                        <option value="7">EB</option>
                        <option value="8">ZB</option>
                        <option value="9">YB</option>
                        <option value="10">bit</option>
                        <option value="11">kbit</option>
                        <option value="12">Mbit</option>
                        <option value="13">Gbits</option>
                        <option value="14">Tbit</option>
                        <option value="15">KiB</option>
                        <option value="16">MiB</option>
                        <option value="17">GiB</option>
                        <option value="18">TiB</option>
                        <option value="19">PiB</option>
                        <option value="20">EiB</option>
                        <option value="21">ZiB</option>
                        <option value="22">YiB</option>
                        <option value="23">Kibit</option>
                        <option value="24">Mibit</option>
                        <option value="25">Gibit</option>
                        <option value="26">Tibit</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 dwn-speed ">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-8">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second"
                        id="tech_second"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_second}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_s_unit"
                        id="tech_s_unit"
                        value={formData.tech_s_unit}
                        onChange={handleChange}
                      >
                        <option value="1">B/s</option>
                        <option value="2">kB/s</option>
                        <option value="3">MB/s</option>
                        <option value="4">GB/s</option>
                        <option value="5">TB/s</option>
                        <option value="6">PB/s</option>
                        <option value="7">EB/s</option>
                        <option value="8">ZB/s</option>
                        <option value="9">YB/s</option>
                        <option value="10">bit/s</option>
                        <option value="11">kbit/s</option>
                        <option value="12">Mbit/s</option>
                        <option value="13">Gbits/s</option>
                        <option value="14">Tbit/s</option>
                        <option value="15">KiB/s</option>
                        <option value="16">MiB/s</option>
                        <option value="17">GiB/s</option>
                        <option value="18">TiB/s</option>
                        <option value="19">PiB/s</option>
                        <option value="20">EiB/s</option>
                        <option value="21">ZiB/s</option>
                        <option value="22">YiB/s</option>
                        <option value="23">Kibit/s</option>
                        <option value="24">Mibit/s</option>
                        <option value="25">Gibit/s</option>
                        <option value="26">Tibit/s</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_overhead" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_overhead"
                    id="tech_overhead"
                    value={formData.tech_overhead}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["4"]}:0%
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]}:5%
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}:10%
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["4"]}:20%
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["4"]}:30%
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["4"]}:40%
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["4"]}:50%
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_kilo" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_kilo"
                    id="tech_kilo"
                    value={formData.tech_kilo}
                    onChange={handleChange}
                  >
                    <option value="1">1024</option>
                    <option value="2">1000</option>
                  </select>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[50%] lg:w-[50%] overflow-auto">
                          <p className="text-[25px]">
                            <strong>{data?.payload?.tech_lang_keys[5]}</strong>
                          </p>

                          <div className="flex justify-between my-1">
                            <p className="border-lg-end pe-lg-5">
                              <b className="text-[25px] text-[#2845F5]">
                                {hours_ans}
                              </b>{" "}
                              Hours
                            </p>
                            <p className="border-lg-end pe-lg-5">
                              <b className="text-[25px] text-[#2845F5]">
                                {minutes_ans}
                              </b>{" "}
                              Minutes
                            </p>
                            <p>
                              <b className="text-[25px] text-[#2845F5]">
                                {seconds_ans}
                              </b>{" "}
                              Seconds
                            </p>
                          </div>
                        </div>
                        <div className="w-full md:w-[90%] lg:w-[90%] overflow-auto">
                          <table className="w-full md:w-[60%] lg:w-[60%] mt-2">
                            <tbody>
                              <tr>
                                <td colspan="2" className="pt-3">
                                  <strong>Time in Days</strong>
                                </td>
                              </tr>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  {Number(result?.tech_jawab / 86400).toFixed(
                                    5
                                  )}
                                </td>
                                <td className="border-b py-2">Days</td>
                              </tr>
                              <tr>
                                <td colspan="2" className="pt-3">
                                  <strong>Times in Weeks</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_jawab / 604800).toFixed(
                                    5
                                  )}
                                </td>
                                <td className="border-b py-2">Weeks</td>
                              </tr>
                              <tr>
                                <td colspan="2" className="pt-3">
                                  <strong>Times in Hours</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_jawab / 3600).toFixed(5)}
                                </td>
                                <td className="border-b py-2">Hours</td>
                              </tr>
                              <tr>
                                <td colspan="2" className="pt-3">
                                  <strong>Times in Minutes</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {Number(result?.tech_jawab / 60).toFixed(5)}
                                </td>
                                <td className="border-b py-2">Minutes</td>
                              </tr>
                            </tbody>
                          </table>
                          <table className="w-full md:w-[80%] mt-4 lg:w-[80%]">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[6]}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[7]}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[8]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  T1/DS1 {data?.payload?.tech_lang_keys[9]}
                                </td>
                                <td className="border-b py-2">1.544 Mbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f1}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[10]}
                                </td>
                                <td className="border-b py-2">10 Mbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f2}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[11]}
                                </td>
                                <td className="border-b py-2">100 Mbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f3}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[12]}
                                </td>
                                <td className="border-b py-2">1000 Mbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f4}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  10 {data?.payload?.tech_lang_keys[13]}
                                </td>
                                <td className="border-b py-2">10 Gbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f5}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">USB 2.0</td>
                                <td className="border-b py-2">480 Mbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f6}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">USB 3.0</td>
                                <td className="border-b py-2">5 Gbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f7}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[14]}
                                </td>
                                <td className="border-b py-2">10 Gbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f8}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[14]} 2
                                </td>
                                <td className="border-b py-2">20 Gbps</td>
                                <td className="border-b py-2">
                                  {result?.tech_f9}
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

export default DataFransferCalculator;
