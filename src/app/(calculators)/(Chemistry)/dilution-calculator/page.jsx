"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDilutionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DilutionCalculator = () => {
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
    tech_cal: "c1", // c1   v1 c2  v2
    tech_c1: "2",
    tech_c1_unit: "mM",
    tech_v1: "2",
    tech_v1_unit: "mL",
    tech_c2: "4",
    tech_c2_unit: "mM",
    tech_v2: "4",
    tech_v2_unit: "mL",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDilutionCalculatorMutation();

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
        tech_c1: formData.tech_c1,
        tech_c1_unit: formData.tech_c1_unit,
        tech_v1: formData.tech_v1,
        tech_v1_unit: formData.tech_v1_unit,
        tech_c2: formData.tech_c2,
        tech_c2_unit: formData.tech_c2_unit,
        tech_v2: formData.tech_v2,
        tech_v2_unit: formData.tech_v2_unit,
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
      tech_cal: "c1", // c1   v1 c2  v2
      tech_c1: "2",
      tech_c1_unit: "mM",
      tech_v1: "2",
      tech_v1_unit: "mL",
      tech_c2: "4",
      tech_c2_unit: "mM",
      tech_v2: "4",
      tech_v2_unit: "mL",
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
    setFormData((prev) => ({ ...prev, tech_c1_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v1_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c2_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v2_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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
            <div className="grid grid-cols-12 gap-1  md:gap-3">
              <div className="col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_cal" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-1">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal"
                    id="tech_cal"
                    value={formData.tech_cal}
                    onChange={handleChange}
                  >
                    <option value="c1">
                      {data?.payload?.tech_lang_keys["2"]} (
                      {data?.payload?.tech_lang_keys["3"]}) (C₁)
                    </option>
                    <option value="v1">
                      {data?.payload?.tech_lang_keys["4"]} (
                      {data?.payload?.tech_lang_keys["3"]}) (V₁)
                    </option>
                    <option value="c2">
                      {data?.payload?.tech_lang_keys["2"]} (
                      {data?.payload?.tech_lang_keys["5"]}) (C₂)
                    </option>
                    <option value="v2">
                      {data?.payload?.tech_lang_keys["4"]} (
                      {data?.payload?.tech_lang_keys["5"]}) (V₂)
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_cal == "v1" ||
                formData.tech_cal == "c2" ||
                formData.tech_cal == "v2") && (
                <>
                  <div className="col-span-12 md:col-span-6 c1">
                    <label htmlFor="tech_c1" className="label">
                      {data?.payload?.tech_lang_keys["2"]} 1:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_c1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_c1}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_c1_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "fM", value: "fM" },
                            { label: "pM", value: "pM" },
                            { label: "nM", value: "nM" },
                            { label: "μM", value: "μM" },
                            { label: "mM", value: "mM" },
                            { label: "M", value: "M" },
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
              {(formData.tech_cal == "c1" ||
                formData.tech_cal == "c2" ||
                formData.tech_cal == "v2") && (
                <>
                  <div className="col-span-12 md:col-span-6 v1">
                    <label htmlFor="tech_v1" className="label">
                      {data?.payload?.tech_lang_keys["4"]} 1:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_v1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_v1}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_v1_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nL", value: "nL" },
                            { label: "μL", value: "μL" },
                            { label: "mL", value: "mL" },
                            { label: "L", value: "L" },
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
              {(formData.tech_cal == "c1" ||
                formData.tech_cal == "v1" ||
                formData.tech_cal == "v2") && (
                <>
                  <div className="col-span-12 md:col-span-6 c2">
                    <label htmlFor="tech_c2" className="label">
                      {data?.payload?.tech_lang_keys["2"]} 2:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_c2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_c2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_c2_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "fM", value: "fM" },
                            { label: "pM", value: "pM" },
                            { label: "nM", value: "nM" },
                            { label: "μM", value: "μM" },
                            { label: "mM", value: "mM" },
                            { label: "M", value: "M" },
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
              {(formData.tech_cal == "c1" ||
                formData.tech_cal == "v1" ||
                formData.tech_cal == "c2") && (
                <>
                  <div className="col-span-12 md:col-span-6 v2 ">
                    <label htmlFor="tech_v2" className="label">
                      {data?.payload?.tech_lang_keys["4"]} 2:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_v2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_v2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_v2_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nL", value: "nL" },
                            { label: "μL", value: "μL" },
                            { label: "mL", value: "mL" },
                            { label: "L", value: "L" },
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
                    <div className="w-full mt-3">
                      {(() => {
                        let head = "";

                        if (formData?.tech_cal === "c1") {
                          head = `${data?.payload?.tech_lang_keys["6"]} (${data?.payload?.tech_lang_keys["3"]})`;
                        } else if (formData?.tech_cal === "v1") {
                          head = `${data?.payload?.tech_lang_keys["4"]} (${data?.payload?.tech_lang_keys["3"]})`;
                        } else if (formData?.tech_cal === "c2") {
                          head = `${data?.payload?.tech_lang_keys["6"]} (${data?.payload?.tech_lang_keys["5"]})`;
                        } else if (formData?.tech_cal === "v2") {
                          head = `${data?.payload?.tech_lang_keys["4"]} (${data?.payload?.tech_lang_keys["5"]})`;
                        }

                        return (
                          <div className="w-full">
                            <p>
                              <strong>{head}</strong>
                            </p>
                            <p className="my-3">
                              <strong
                                className="text-[#119154] text-[30px]"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_ans,
                                }}
                              ></strong>
                            </p>
                            <p className="my-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["6"]}
                              </strong>
                            </p>

                            <div className="lg:w-[70%] md:w-[100%] w-full overflow-auto">
                              <table className="w-full" cellSpacing="0">
                                <tbody>
                                  {formData?.tech_cal === "c1" ||
                                  formData?.tech_cal === "c2" ? (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_fm}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_pm}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_nm}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_um}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="py-2">{head}</td>
                                        <td className="py-2">
                                          <strong>{result?.tech_ans_m}</strong>
                                        </td>
                                      </tr>
                                    </>
                                  ) : formData?.tech_cal === "v1" ||
                                    formData?.tech_cal === "v2" ? (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_nl}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_ul}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="py-2">{head}</td>
                                        <td className="py-2">
                                          <strong>{result?.tech_ans_l}</strong>
                                        </td>
                                      </tr>
                                    </>
                                  ) : null}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}
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

export default DilutionCalculator;
