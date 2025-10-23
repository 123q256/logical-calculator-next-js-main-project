"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAmpHourCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AmpHourCalculator = () => {
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
    tech_type: "first", //  first  second
    tech_find: "1", //  1 2 3
    tech_vol: "12",
    tech_bc: "32",
    tech_bc_unit: "mAh",
    tech_wt_hour: "26.4",
    tech_wt_hour_unit: "kJ",
    tech_c_rate: "2",
    tech_load_size: "2",
    tech_load_duration: "2",
    tech_temp_chk: "on",
    tech_age_chk: "on",
    tech_batteries: "gel",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAmpHourCalculatorMutation();

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
        tech_find: formData.tech_find,
        tech_vol: formData.tech_vol,
        tech_bc: formData.tech_bc,
        tech_bc_unit: formData.tech_bc_unit,
        tech_wt_hour: formData.tech_wt_hour,
        tech_wt_hour_unit: formData.tech_wt_hour_unit,
        tech_c_rate: formData.tech_c_rate,
        tech_load_size: formData.tech_load_size,
        tech_load_duration: formData.tech_load_duration,
        tech_temp_chk: formData.tech_temp_chk,
        tech_age_chk: formData.tech_age_chk,
        tech_batteries: formData.tech_batteries,
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
      tech_type: "first", //  first  second
      tech_find: "1", //  1 2 3
      tech_vol: "12",
      tech_bc: "32",
      tech_bc_unit: "mAh",
      tech_wt_hour: "26.4",
      tech_wt_hour_unit: "kJ",
      tech_c_rate: "2",
      tech_load_size: "2",
      tech_load_duration: "2",
      tech_temp_chk: "on",
      tech_age_chk: "on",
      tech_batteries: "gel",
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
    setFormData((prev) => ({ ...prev, tech_bc_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wt_hour_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="w-full">
              <p className="d-inline pe-lg-3 ps-lg-2 text-blue">
                {data?.payload?.tech_lang_keys["1"]}
              </p>
              <label className="pe-2" htmlFor="first">
                <input
                  type="radio"
                  name="tech_type"
                  value="first"
                  id="first"
                  className="mr-2 border"
                  onChange={handleChange}
                  checked={formData.tech_type === "first"}
                />
                <span>{data?.payload?.tech_lang_keys["2"]}</span>
              </label>
              <label className="pe-2" htmlFor="second">
                <input
                  type="radio"
                  name="tech_type"
                  value="second"
                  id="second"
                  className="mr-2 border"
                  onChange={handleChange}
                  checked={formData.tech_type === "second"}
                />
                <span>{data?.payload?.tech_lang_keys["3"]}</span>
              </label>
            </div>

            {formData.tech_type === "first" && (
              <>
                <div className="grid grid-cols-12 mt-3  gap-4 firsts">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 wow">
                    <label htmlFor="tech_find" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
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
                        <option value="1">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["6"]}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["7"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  {(formData.tech_find == "1" || formData.tech_find == "3") && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 vol">
                        <label htmlFor="tech_vol" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_vol"
                            id="tech_vol"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_vol}
                            onChange={handleChange}
                          />
                          <span className="input_unit">V</span>
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_find == "2" || formData.tech_find == "3") && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 bc ">
                        <label htmlFor="tech_bc" className="label">
                          {data?.payload?.tech_lang_keys["5"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_bc"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_bc}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_bc_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "Ah", value: "Ah" },
                                { label: "mAh", value: "mAh" },
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
                  {(formData.tech_find == "1" || formData.tech_find == "2") && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 wt ">
                        <label htmlFor="tech_wt_hour" className="label">
                          {data?.payload?.tech_lang_keys["7"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_wt_hour"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_wt_hour}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_wt_hour_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "kJ", value: "kJ" },
                                { label: "MJ", value: "MJ" },
                                { label: "Wh", value: "Wh" },
                                { label: "kWh", value: "kWh" },
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

                  <div className="col-span-12 md:col-span-6 lg:col-span-6 c_rate">
                    <label htmlFor="tech_c_rate" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c_rate"
                        id="tech_c_rate"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c_rate}
                        onChange={handleChange}
                      />
                      <span className="input_unit">C</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.tech_type === "second" && (
              <>
                <div className="grid grid-cols-12 mt-3  gap-4 second ">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 load_size">
                    <label htmlFor="tech_load_size" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_load_size"
                        id="tech_load_size"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_load_size}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 load_duration">
                    <label htmlFor="tech_load_duration" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_load_duration"
                        id="tech_load_duration"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_load_duration}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 ">
                    <div className="mt-2">
                      <span className="text-blue text-[14px] pe-2">
                        {data?.payload?.tech_lang_keys["11"]} :
                      </span>
                      <label htmlFor="tech_temp_chk" className="label">
                        <input
                          type="checkbox"
                          step="any"
                          name="tech_temp_chk"
                          id="tech_temp_chk"
                          className="input w-full border rounded-md p-2 mx-2 text-[14px]"
                          aria-label="input"
                          value={formData.tech_temp_chk}
                          onChange={handleChange}
                        />
                        {data?.payload?.tech_lang_keys["12"]} 0-85°F
                      </label>
                    </div>

                    <div className="mt-2">
                      <span className="text-blue text-[14px] pe-2">
                        {data?.payload?.tech_lang_keys["13"]} :
                      </span>

                      <label htmlFor="tech_temp_chk" className="label">
                        <input
                          type="checkbox"
                          step="any"
                          name="tech_temp_chk"
                          id="tech_temp_chk"
                          className="input w-full border rounded-md p-2 mx-2 text-[14px]"
                          aria-label="input"
                          value={formData.tech_temp_chk}
                          onChange={handleChange}
                        />
                        {data?.payload?.tech_lang_keys["14"]}:
                      </label>
                    </div>
                  </div>
                  <div className="col-span-12 ">
                    <p className="d-inline pe-lg-3 text-blue">
                      {data?.payload?.tech_lang_keys["15"]}
                    </p>
                    <label className="pe-2" htmlFor="gel">
                      <input
                        type="radio"
                        name="tech_batteries"
                        value="gel"
                        id="gel"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_batteries === "gel"}
                      />
                      <span>{data?.payload?.tech_lang_keys["16"]}</span>
                    </label>
                    <label className="pe-2" htmlFor="agm">
                      <input
                        type="radio"
                        name="tech_batteries"
                        value="agm"
                        id="agm"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_batteries === "agm"}
                      />
                      <span>{data?.payload?.tech_lang_keys["17"]}</span>
                    </label>
                    <label className="pe-2" htmlFor="flooded">
                      <input
                        type="radio"
                        name="tech_batteries"
                        value="flooded"
                        id="flooded"
                        className="mr-2 border"
                        onChange={handleChange}
                        checked={formData.tech_batteries === "flooded"}
                      />
                      <span>{data?.payload?.tech_lang_keys["18"]}</span>
                    </label>
                  </div>
                </div>
              </>
            )}
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
                      <div className="w-full my-2">
                        <div className="col-lg-8 text-[16px] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              {result?.tech_type === "first" && (
                                <>
                                  {result?.tech_find === "1" && (
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["5"]} :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {Number(result?.tech_ans).toFixed(2)}
                                        <span className="text-[14px]">
                                          {" "}
                                          (Ah)
                                        </span>
                                      </td>
                                    </tr>
                                  )}
                                  {result?.tech_find === "2" && (
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["6"]} :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {Number(result?.tech_ans).toFixed(3)}
                                        <span className="text-[14px]">
                                          {" "}
                                          (V)
                                        </span>
                                      </td>
                                    </tr>
                                  )}
                                  {result?.tech_find === "3" && (
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["7"]} :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {Number(result?.tech_ans).toFixed(3)}
                                        <span className="text-[14px]">
                                          {" "}
                                          (Wh)
                                        </span>
                                      </td>
                                    </tr>
                                  )}
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_dc).toFixed(3)}
                                      <span className="text-[14px]"> (A)</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["20"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(1 / result?.tech_c_rate).toFixed(
                                        3
                                      )}
                                      <span className="text-[14px]">
                                        {" "}
                                        (hrs)
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              )}

                              {result?.tech_type === "second" && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["21"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(result?.tech_ans).toFixed(2)}
                                    <span className="text-[14px]"> (Ah)</span>
                                  </td>
                                </tr>
                              )}
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

export default AmpHourCalculator;
