"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useNernstEquationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NernstEquationCalculator = () => {
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
    tech_cal: "ecell", // ecell eo  t n q
    tech_ecell: "2",
    tech_ecell_unit: "mV", // mV
    tech_eo: "2",
    tech_eo_unit: "mV",
    tech_t: "4",
    tech_t_unit: "K",
    tech_n: "5",
    tech_q: "6",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNernstEquationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_cal: formData.tech_cal,
        tech_ecell: formData.tech_ecell,
        tech_ecell_unit: formData.tech_ecell_unit,
        tech_eo: formData.tech_eo,
        tech_eo_unit: formData.tech_eo_unit,
        tech_t: formData.tech_t,
        tech_t_unit: formData.tech_t_unit,
        tech_n: formData.tech_n,
        tech_q: formData.tech_q,
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
      tech_cal: "ecell", // ecell eo  t n q
      tech_ecell: "2",
      tech_ecell_unit: "mV", // mV
      tech_eo: "2",
      tech_eo_unit: "mV",
      tech_t: "4",
      tech_t_unit: "K",
      tech_n: "5",
      tech_q: "6",
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
    setFormData((prev) => ({ ...prev, tech_ecell_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_eo_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_t_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 ">
                <label htmlFor="tech_cal" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal"
                    id="tech_cal"
                    value={formData.tech_cal}
                    onChange={handleChange}
                  >
                    <option value="ecell">E𝒸ₑₗₗ</option>
                    <option value="eo">Eᵒ</option>
                    <option value="t">T</option>
                    <option value="n">n</option>
                    <option value="q">Q</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2  mt-3 gap-4">
              {formData.tech_cal != "ecell" && (
                <>
                  <div className="space-y-2 ecell ">
                    <label htmlFor="tech_ecell" className="label">
                      E<sub> {data?.payload?.tech_lang_keys["2"]} </sub>{" "}
                      <span
                        className="bg-white radius-circle px-2"
                        title="Electromotive force of the cell"
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ecell"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ecell}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_ecell_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mV", value: "mV" },
                            { label: "V", value: "V" },
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
              {formData.tech_cal != "eo" && (
                <>
                  <div className="space-y-2 eo">
                    <label htmlFor="tech_eo" className="label">
                      E<sup>o</sup>{" "}
                      <span
                        className="bg-white radius-circle px-2"
                        title="Standard Electrode potential of the cell"
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_eo"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_eo}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_eo_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mV", value: "mV" },
                            { label: "V", value: "V" },
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
              {formData.tech_cal != "t" && (
                <>
                  <div className="space-y-2 t">
                    <label htmlFor="tech_t" className="label">
                      T{" "}
                      <span
                        className="bg-white radius-circle px-2"
                        title="Temperature"
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_t"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_t}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_t_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "K", value: "K" },
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
              {formData.tech_cal != "n" && (
                <>
                  <div className="space-y-2 n">
                    <label htmlFor="tech_n" className="label">
                      n{" "}
                      <span
                        className="bg-white radius-circle px-2"
                        title="The number of electrons transferred per cell reaction"
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_n"
                        id="tech_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_cal != "q" && (
                <>
                  <div className="space-y-2 q">
                    <label htmlFor="tech_q" className="label">
                      Q{" "}
                      <span
                        className="bg-white radius-circle px-2"
                        title="Reaction Quotient"
                      >
                        ?
                      </span>
                      :
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_q"
                        id="tech_q"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_q}
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
                      <div className="w-full text-center">
                        {formData?.tech_cal === "ecell" && (
                          <p>
                            <strong className="text-[20px]">
                              E<sub>cell</sub>
                            </strong>
                          </p>
                        )}
                        {formData?.tech_cal === "eo" && (
                          <p>
                            <strong className="text-[20px]">
                              E<sup>o</sup>
                            </strong>
                          </p>
                        )}
                        {formData?.tech_cal === "temp" && (
                          <p>
                            <strong className="text-[20px]">Temperature</strong>
                          </p>
                        )}
                        {formData?.tech_cal === "n" && (
                          <p>
                            <strong className="text-[20px]">
                              Number of Electrons
                            </strong>
                          </p>
                        )}
                        {formData?.tech_cal === "q" && (
                          <p>
                            <strong className="text-[20px]">
                              Reaction Quotient
                            </strong>
                          </p>
                        )}
                        <p>
                          <strong
                            className="text-[#119154] text-[16px] md:text-[25px]"
                            dangerouslySetInnerHTML={{
                              __html: result?.tech_ans,
                            }}
                          ></strong>
                        </p>
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

export default NernstEquationCalculator;
