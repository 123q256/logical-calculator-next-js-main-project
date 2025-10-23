"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRateConstantCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RateConstantCalculator = () => {
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
    tech_unit_x: "uni", // tri  uni  bi
    tech_module_x: "1",
    tech_con_a: Number(3),
    tech_unit_a: "M",
    tech_half_a: Number(2),
    tech_time_a: "sec",
    tech_module_y: "1",
    tech_con_b: Number(3),
    tech_unit_b: "M",
    tech_half_b: Number(2),
    tech_time_b: "sec",
    tech_module_z: "1",
    tech_con_c: Number(3),
    tech_unit_c: "M",
    tech_half_c: Number(2),
    tech_time_c: "sec",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRateConstantCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_unit_x) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_unit_x: formData.tech_unit_x,
        tech_module_x: formData.tech_module_x,
        tech_con_a: formData.tech_con_a,
        tech_unit_a: formData.tech_unit_a,
        tech_half_a: formData.tech_half_a,
        tech_time_a: formData.tech_time_a,
        tech_module_y: formData.tech_module_y,
        tech_con_b: formData.tech_con_b,
        tech_unit_b: formData.tech_unit_b,
        tech_half_b: formData.tech_half_b,
        tech_time_b: formData.tech_time_b,
        tech_module_z: formData.tech_module_z,
        tech_con_c: formData.tech_con_c,
        tech_unit_c: formData.tech_unit_c,
        tech_half_c: formData.tech_half_c,
        tech_time_c: formData.tech_time_c,
      }).unwrap();
      setResult(response); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_unit_x: "bi", // tri  uni  bi
      tech_module_x: "1",
      tech_con_a: "3",
      tech_unit_a: "M",
      tech_half_a: "2",
      tech_time_a: "sec",
      tech_module_y: "1",
      tech_con_b: "3",
      tech_unit_b: "M",
      tech_half_b: "2",
      tech_time_b: "sec",
      tech_module_z: "1",
      tech_con_c: "3",
      tech_unit_c: "M",
      tech_half_c: "2",
      tech_time_c: "sec",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_a: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_time_a: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_b: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_time_b: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_c: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_time_c: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

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
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_unit_x" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_unit_x"
                    id="tech_unit_x"
                    value={formData.tech_unit_x}
                    onChange={handleChange}
                  >
                    <option value="uni">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="bi">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="tri">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-4  gap-4">
              <div className="col-span-12 text-center">
                {formData.tech_unit_x == "uni" && (
                  <>
                    <p className="one">
                      <strong>
                        {data?.payload?.tech_lang_keys["2"]}
                        {(formData.tech_module_x == "1" ||
                          formData.tech_module_x == "2") && (
                          <>
                            <span id="a">
                              {data?.payload?.tech_lang_keys["3"]}{" "}
                            </span>
                          </>
                        )}
                        {formData.tech_module_x == "2" && (
                          <>
                            <sup id="seq_0" className="">
                              2
                            </sup>
                          </>
                        )}
                      </strong>
                    </p>
                  </>
                )}
                {formData.tech_unit_x == "bi" && (
                  <>
                    <p className="two ">
                      <strong>
                        rate = K [A]
                        {formData.tech_module_x == "2" && (
                          <>
                            <sup id="seq_1" className="">
                              2
                            </sup>
                          </>
                        )}
                        [B]
                        {formData.tech_module_y == "2" && (
                          <>
                            <sup id="seq_2" className="">
                              2
                            </sup>
                          </>
                        )}
                      </strong>
                    </p>
                  </>
                )}

                {formData.tech_unit_x == "tri" && (
                  <>
                    <p className="two ">
                      <strong>
                        rate = K [A]
                        {formData.tech_module_x == "2" && (
                          <>
                            <sup id="seq_1" className="">
                              2
                            </sup>
                          </>
                        )}
                        [B]
                        {formData.tech_module_y == "2" && (
                          <>
                            <sup id="seq_2" className="">
                              2
                            </sup>
                          </>
                        )}
                        [C]
                        {formData.tech_module_z == "2" && (
                          <>
                            <sup id="seq_5" className="">
                              2
                            </sup>
                          </>
                        )}
                      </strong>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 mt-4   gap-4">
              <div className="col-span-12 ">
                <label htmlFor="tech_module_x" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_module_x"
                    id="tech_module_x"
                    value={formData.tech_module_x}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_con_a" className="label">
                  {data?.payload?.tech_lang_keys["11"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_con_a"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_con_a}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit_a} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "M", value: "M" },
                        { label: "mM", value: "mM" },
                        { label: "μM", value: "μM" },
                        { label: "nM", value: "nM" },
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
              <div className="col-span-6">
                <label htmlFor="tech_half_a" className="label">
                  {data?.payload?.tech_lang_keys["12"]} T<sub>1/2</sub>:
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_half_a"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_half_a}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_time_a} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "microseconds (μs)", value: "μs" },
                        { label: "milliseconds (ms)", value: "ms" },
                        { label: "seconds (sec)", value: "sec" },
                        { label: "minutes (min)", value: "min" },
                        {
                          label: "minutes per second (min/sec)",
                          value: "min/sec",
                        },
                        { label: "hours (hrs)", value: "hrs" },
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
            </div>
            {(formData.tech_unit_x == "bi" ||
              formData.tech_unit_x == "tri") && (
              <>
                <div className="grid grid-cols-12 mt-4   gap-4">
                  <div className="col-span-12 ">
                    <label htmlFor="tech_module_y" className="label">
                      {data?.payload?.tech_lang_keys["13"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_module_y"
                        id="tech_module_y"
                        value={formData.tech_module_y}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_con_b" className="label">
                      {data?.payload?.tech_lang_keys["14"]} :
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_con_b"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_con_b}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_b} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "M", value: "M" },
                            { label: "mM", value: "mM" },
                            { label: "μM", value: "μM" },
                            { label: "nM", value: "nM" },
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
                  <div className="col-span-6">
                    <label htmlFor="tech_half_b" className="label">
                      {data?.payload?.tech_lang_keys["12"]} T<sub>1/2</sub>:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_half_b"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_half_b}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_time_b} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "microseconds (μs)", value: "μs" },
                            { label: "milliseconds (ms)", value: "ms" },
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
                            {
                              label: "minutes per second (min/sec)",
                              value: "min/sec",
                            },
                            { label: "hours (hrs)", value: "hrs" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler3(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.tech_unit_x == "tri" && (
              <>
                <div className="grid grid-cols-12 mt-4   gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_module_z" className="label">
                      {data?.payload?.tech_lang_keys["15"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_module_z"
                        id="tech_module_z"
                        value={formData.tech_module_z}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_con_c" className="label">
                      {data?.payload?.tech_lang_keys["16"]} :
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_con_c"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_con_c}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_unit_c} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "M", value: "M" },
                            { label: "mM", value: "mM" },
                            { label: "μM", value: "μM" },
                            { label: "nM", value: "nM" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler4(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="tech_half_c" className="label">
                      {data?.payload?.tech_lang_keys["12"]} T<sub>1/2</sub>:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_half_c"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_half_c}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_time_c} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "microseconds (μs)", value: "μs" },
                            { label: "milliseconds (ms)", value: "ms" },
                            { label: "seconds (sec)", value: "sec" },
                            { label: "minutes (min)", value: "min" },
                            {
                              label: "minutes per second (min/sec)",
                              value: "min/sec",
                            },
                            { label: "hours (hrs)", value: "hrs" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler5(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
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
                    <div className="w-full  mt-3">
                      <div className="w-full">
                        <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
                          <div className="mt-2">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]} (K)
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[25px]">
                                {Number(result?.tech_k_res).toFixed(4)}
                              </strong>{" "}
                              <strong className="text-[20px]">sec</strong>
                            </p>
                          </div>
                          <div className="mt-2">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[25px]">
                                {Number(result?.tech_rate_res).toFixed(4)}
                              </strong>{" "}
                              <strong className="text-[20px]">
                                M s<sup>-1</sup>
                              </strong>
                            </p>
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

export default RateConstantCalculator;
