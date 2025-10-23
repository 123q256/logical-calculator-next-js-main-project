"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePkaToPhCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PkaToPhcalculator = () => {
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
    tech_convert: "1", // 1 2
    tech_buf_unit: "2",
    tech_ka: "7",
    tech_acid: "20",
    tech_acid_unit: "M",
    tech_salt: "25",
    tech_salt_unit: "M",
    tech_ph: "25",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePkaToPhCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_convert) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_convert: formData.tech_convert,
        tech_buf_unit: formData.tech_buf_unit,
        tech_ka: formData.tech_ka,
        tech_acid: formData.tech_acid,
        tech_acid_unit: formData.tech_acid_unit,
        tech_salt: formData.tech_salt,
        tech_salt_unit: formData.tech_salt_unit,
        tech_ph: formData.tech_ph,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_convert: "1", // 1 2
      tech_buf_unit: "2",
      tech_ka: "7",
      tech_acid: "20",
      tech_acid_unit: "M",
      tech_salt: "25",
      tech_salt_unit: "M",
      tech_ph: "25",
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
    setFormData((prev) => ({ ...prev, tech_acid_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_salt_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-1  md:gap-2">
              <div className=" col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_convert" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_convert"
                    id="tech_convert"
                    value={formData.tech_convert}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["11"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className=" col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_buf_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_buf_unit"
                    id="tech_buf_unit"
                    value={formData.tech_buf_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_convert == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6  ka">
                    <label htmlFor="tech_ka" className="label">
                      K<span className="text-blue rep">a</span>:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_ka"
                        id="tech_ka"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_ka}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 md:col-span-6 ">
                {formData.tech_buf_unit == "1" && (
                  <label htmlFor="tech_salt" className="label">
                    {data?.payload?.tech_lang_keys["2"]}{" "}
                    {data?.payload?.tech_lang_keys["4"]}
                  </label>
                )}

                {formData.tech_buf_unit == "2" && (
                  <label htmlFor="tech_salt" className="label">
                    Base {data?.payload?.tech_lang_keys["4"]}
                  </label>
                )}

                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_acid"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_acid}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_acid_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "M", value: "M" },
                        { label: "mM", value: "mM" },
                        { label: "μM", value: "μM" },
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
              <div className="col-span-12 md:col-span-6 ">
                <label htmlFor="tech_salt" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_salt"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_salt}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_salt_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "M", value: "M" },
                        { label: "mM", value: "mM" },
                        { label: "μM", value: "μM" },
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
              {formData.tech_convert == "2" && (
                <>
                  <div className=" col-span-12 md:col-span-6 ph ">
                    <label htmlFor="tech_ph" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_ph"
                        id="tech_ph"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_ph}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full rounded-lg mt-3">
                      <div className="w-full text-center">
                        {result?.tech_pk && (
                          <>
                            {/* Select language key based on unit */}
                            <p className="text-lg">
                              {result?.tech_unit == "1"
                                ? data?.payload?.tech_lang_keys["12"]
                                : data?.payload?.tech_lang_keys["13"]}
                            </p>
                            {/* Display pK if available */}

                            <p>
                              <strong className="text-[#119154] lg:text-2xl">
                                {Number(result.tech_pk).toExponential(2)}
                              </strong>
                            </p>
                          </>
                        )}

                        {/* Display unit label (6 or 7 based on unit) */}
                        <p className="text-lg">
                          {result?.tech_unit == "1"
                            ? data?.payload?.tech_lang_keys["6"]
                            : data?.payload?.tech_lang_keys["7"]}
                        </p>
                        <p>
                          <strong className="text-[#119154] lg:text-2xl">
                            {Number(result?.tech_pka).toExponential(2)}
                          </strong>
                        </p>

                        {/* Display pH if available */}
                        {result?.tech_ph && (
                          <>
                            <p className="text-lg">
                              {data?.payload?.tech_lang_keys["8"]}
                            </p>
                            <p>
                              <strong className="text-[#119154] lg:text-2xl">
                                {Number(result?.tech_ph).toExponential(4)}
                              </strong>
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

export default PkaToPhcalculator;
