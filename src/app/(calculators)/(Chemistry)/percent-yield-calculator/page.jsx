"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePercentYieldCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PercentYieldCalculator = () => {
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
    tech_method: "1", // 1 2 3
    tech_x: "8",
    tech_unit_x: "mg",
    tech_y: "4",
    tech_unit_y: "lbs",
    tech_z: "113.5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePercentYieldCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_method == 1) {
      if (
        !formData.tech_method ||
        !formData.tech_y ||
        !formData.tech_unit_y ||
        !formData.tech_x ||
        !formData.tech_unit_x
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_method == 2) {
      if (
        !formData.tech_method ||
        !formData.tech_y ||
        !formData.tech_unit_y ||
        !formData.tech_z
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_method ||
        !formData.tech_z ||
        !formData.tech_x ||
        !formData.tech_unit_x
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_method: formData.tech_method,
        tech_x: formData.tech_x,
        tech_unit_x: formData.tech_unit_x,
        tech_y: formData.tech_y,
        tech_unit_y: formData.tech_unit_y,
        tech_z: formData.tech_z,
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
      tech_method: "3", // 1 2 3
      tech_x: "8",
      tech_unit_x: "mg",
      tech_y: "4",
      tech_unit_y: "lbs",
      tech_z: "113.5",
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
    setFormData((prev) => ({ ...prev, tech_unit_x: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_y: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  // result

  let head = "";

  if (formData?.tech_method === "1") {
    head = data?.payload?.tech_lang_keys["yeild"];
  } else if (formData?.tech_method === "2") {
    head = data?.payload?.tech_lang_keys["ther"];
  } else {
    head = data?.payload?.tech_lang_keys["actul"];
  }

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2">
              <div className="col-span-12 ">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["to"]}:
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["yeild"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["ther"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["actul"]}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_method == "2" || formData.tech_method == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_z" className="label">
                      {data?.payload?.tech_lang_keys["yeild"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z"
                        id="tech_z"
                        className="input mt-1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_method == "1" || formData.tech_method == "2") && (
                <>
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_y" className="label">
                      {data?.payload?.tech_lang_keys["actul"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_y"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_y}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_y} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "grams (g)", value: "g" },
                            { label: "micrograms (µg)", value: "µg" },
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "pounds (lbs)", value: "lbs" },
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
              {(formData.tech_method == "1" || formData.tech_method == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["ther"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_x"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_x}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_unit_x} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "grams (g)", value: "g" },
                            { label: "micrograms (µg)", value: "µg" },
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "pounds (lbs)", value: "lbs" },
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full text-[20px] mt-3">
                      <div className="w-full text-center">
                        <p className="mb-2">
                          <strong className="z">{head}</strong>
                        </p>

                        <div className="flex justify-center">
                          <p className="bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                            <strong className="lg:text-[32px] md:text-[32px] text-[26px]">
                              {result?.tech_ans ?? "00"}
                            </strong>
                            <span className="lg:text-[20px] md:text-[20px] text-[16px] nachy">
                              {formData?.tech_method == "1" ? "%" : "g"}
                            </span>
                          </p>
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

export default PercentYieldCalculator;
