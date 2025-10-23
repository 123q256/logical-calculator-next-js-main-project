"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDownloadCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DownloadCalculator = () => {
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
    tech_operations: "2", // 1 2 3
    tech_first: "12",
    tech_f_unit: "MB",
    tech_third: "48",
    tech_t_unit: "days",
    tech_second: "10",
    tech_s_unit: "GB",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDownloadCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_operations == 1) {
      if (
        !formData.tech_operations ||
        !formData.tech_first ||
        !formData.tech_f_unit ||
        !formData.tech_second ||
        !formData.tech_s_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_operations == 2) {
      if (
        !formData.tech_operations ||
        !formData.tech_first ||
        !formData.tech_f_unit ||
        !formData.tech_third ||
        !formData.tech_t_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_operations ||
        !formData.tech_third ||
        !formData.tech_t_unit ||
        !formData.tech_second ||
        !formData.tech_s_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_f_unit: formData.tech_f_unit,
        tech_third: formData.tech_third,
        tech_t_unit: formData.tech_t_unit,
        tech_second: formData.tech_second,
        tech_s_unit: formData.tech_s_unit,
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
      tech_operations: "2", // 1 2 3
      tech_first: "12",
      tech_f_unit: "MB",
      tech_third: "48",
      tech_t_unit: "days",
      tech_second: "10",
      tech_s_unit: "GB",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_s_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations"
                    id="tech_operations"
                    value={formData.tech_operations}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_operations == "1" ||
                formData.tech_operations == "2") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_first" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_first"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_f_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            // Data units
                            { label: "Bytes (B)", value: "B" },
                            { label: "Kilobytes (kB)", value: "kB" },
                            { label: "Megabytes (MB)", value: "MB" },
                            { label: "Gigabytes (GB)", value: "GB" },
                            { label: "Terabytes (TB)", value: "TB" },
                            { label: "Petabytes (PB)", value: "PB" },
                            { label: "Exabytes (EB)", value: "EB" },
                            { label: "Zettabytes (ZB)", value: "ZB" },
                            { label: "Yottabytes (YB)", value: "YB" },
                            // Bits and subunits
                            { label: "Bits (bit)", value: "bit" },
                            { label: "Kilobits (kbit)", value: "kbit" },
                            { label: "Megabits (Mbit)", value: "Mbit" },
                            { label: "Gigabits (Gbits)", value: "Gbits" },
                            { label: "Terabits (Tbit)", value: "Tbit" },
                            // Binary prefixes
                            { label: "Kibibytes (KiB)", value: "KiB" },
                            { label: "Mebibytes (MiB)", value: "MiB" },
                            { label: "Gibibytes (GiB)", value: "GiB" },
                            { label: "Tebibytes (TiB)", value: "TiB" },
                            { label: "Pebibytes (PiB)", value: "PiB" },
                            { label: "Exbibytes (EiB)", value: "EiB" },
                            { label: "Zebibytes (ZiB)", value: "ZiB" },
                            { label: "Yobibytes (YiB)", value: "YiB" },
                            { label: "Kibibits (Kibit)", value: "Kibit" },
                            { label: "Mebibits (Mibit)", value: "Mibit" },
                            { label: "Gibibits (Gibit)", value: "Gibit" },
                            { label: "Tebibits (Tibit)", value: "Tibit" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "2" ||
                formData.tech_operations == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_third"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_third}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_t_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            // Data units
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "hrs", value: "hrs" },
                            { label: "days", value: "days" },
                            { label: "wks", value: "wks" },
                            { label: "mos", value: "mos" },
                            { label: "yrs", value: "yrs" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler1(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "1" ||
                formData.tech_operations == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  ">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_second"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_second}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_s_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            // Data units
                            { label: "Bytes (B)", value: "B" },
                            { label: "Kilobytes (kB)", value: "kB" },
                            { label: "Megabytes (MB)", value: "MB" },
                            { label: "Gigabytes (GB)", value: "GB" },
                            { label: "Terabytes (TB)", value: "TB" },
                            { label: "Petabytes (PB)", value: "PB" },
                            { label: "Exabytes (EB)", value: "EB" },
                            { label: "Zettabytes (ZB)", value: "ZB" },
                            { label: "Yottabytes (YB)", value: "YB" },
                            // Bits and subunits
                            { label: "Bits (bit)", value: "bit" },
                            { label: "Kilobits (kbit)", value: "kbit" },
                            { label: "Megabits (Mbit)", value: "Mbit" },
                            { label: "Gigabits (Gbits)", value: "Gbits" },
                            { label: "Terabits (Tbit)", value: "Tbit" },
                            // Binary prefixes
                            { label: "Kibibytes (KiB)", value: "KiB" },
                            { label: "Mebibytes (MiB)", value: "MiB" },
                            { label: "Gibibytes (GiB)", value: "GiB" },
                            { label: "Tebibytes (TiB)", value: "TiB" },
                            { label: "Pebibytes (PiB)", value: "PiB" },
                            { label: "Exbibytes (EiB)", value: "EiB" },
                            { label: "Zebibytes (ZiB)", value: "ZiB" },
                            { label: "Yobibytes (YiB)", value: "YiB" },
                            { label: "Kibibits (Kibit)", value: "Kibit" },
                            { label: "Mebibits (Mibit)", value: "Mibit" },
                            { label: "Gibibits (Gibit)", value: "Gibit" },
                            { label: "Tebibits (Tibit)", value: "Tibit" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler2(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
                      <div className="w-full my-1">
                        <div className="w-full md:w-[80%] lg:w-[80%] text-[16px] overflow-auto">
                          {formData?.tech_operations == 1 ? (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[2]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_jawab} sec
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[2]} (min)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_jawab / 60).toFixed(
                                        6
                                      )}{" "}
                                      min
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[2]} (hrs)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab / 3600
                                      ).toFixed(6)}{" "}
                                      hrs
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[2]}{" "}
                                        (days) :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab / 86400
                                      ).toFixed(6)}{" "}
                                      days
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[2]} (wks)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab / 604800
                                      ).toFixed(6)}{" "}
                                      wks
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table className="w-full text-center">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[5]}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[2]}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[6]}
                                    </td>
                                    <td className="border-b py-2">
                                      28,8 kbit/s
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_f1}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[6]}
                                    </td>
                                    <td className="border-b py-2">
                                      56,6 kbit/s
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_f2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">ADSL</td>
                                    <td className="border-b py-2">
                                      256 kbit/s
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_f3}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">ADSL</td>
                                    <td className="border-b py-2">
                                      512 kbit/s
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_f4}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">ADSL</td>
                                    <td className="border-b py-2">1 Mbit/s</td>
                                    <td className="border-b py-2">
                                      {result?.tech_f5}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">ADSL</td>
                                    <td className="border-b py-2">2 Mbit/s</td>
                                    <td className="border-b py-2">
                                      {result?.tech_f6}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">ADSL</td>
                                    <td className="border-b py-2">8 Mbit/s</td>
                                    <td className="border-b py-2">
                                      {result?.tech_f7}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">ADSL</td>
                                    <td className="border-b py-2">24 Mbit/s</td>
                                    <td className="border-b py-2">
                                      {result?.tech_f8}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">LAN</td>
                                    <td className="border-b py-2">10 Mbit/s</td>
                                    <td className="border-b py-2">
                                      {result?.tech_f9}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">LAN</td>
                                    <td className="border-b py-2">
                                      100 Mbit/s
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_f10}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[7]} 3G
                                    </td>
                                    <td className="border-b py-2">
                                      7,2 Mbit/s
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_f11}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">4G</td>
                                    <td className="border-b py-2">80 Mbit/s</td>
                                    <td className="border-b py-2">
                                      {result?.tech_f12}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">5G</td>
                                    <td className="border-b py-2">1 Gbit/s</td>
                                    <td className="border-b py-2">
                                      {result?.tech_f13}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : formData?.tech_operations == 2 ? (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_jawab}MB
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]} (b) :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab * 1000000
                                      ).toFixed(6)}{" "}
                                      b
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]} (kb)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab * 1000
                                      ).toFixed(6)}{" "}
                                      kb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]} (gb)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab / 1000
                                      ).toFixed(6)}{" "}
                                      gb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]} (tb)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab / 1000000
                                      ).toFixed(6)}{" "}
                                      tb
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : formData?.tech_operations == 3 ? (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_jawab}MB
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} (b) :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab * 1000000
                                      ).toFixed(6)}{" "}
                                      b
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} (kb)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab * 1000
                                      ).toFixed(6)}{" "}
                                      kb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} (gb)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab / 1000
                                      ).toFixed(6)}{" "}
                                      gb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]} (tb)
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_jawab / 1000000
                                      ).toFixed(6)}{" "}
                                      tb
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          ) : null}
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

export default DownloadCalculator;
