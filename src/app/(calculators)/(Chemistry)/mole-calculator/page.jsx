"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMoleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MoleCalculator = () => {
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
    tech_cal: "mw", //  mass  mw  moles
    tech_mass: "5",
    tech_mass_unit: "μg",
    tech_mw: "4",
    tech_moles: "5",
    tech_moles_unit: "nM",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMoleCalculatorMutation();

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
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_mw: formData.tech_mw,
        tech_moles: formData.tech_moles,
        tech_moles_unit: formData.tech_moles_unit,
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
      tech_cal: "mw", //  mass  mw  moles
      tech_mass: "5",
      tech_mass_unit: "μg",
      tech_mw: "4",
      tech_moles: "5",
      tech_moles_unit: "nM",
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
    setFormData((prev) => ({ ...prev, tech_moles_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mass_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  // ?result
  const ans = result?.tech_ans || "";
  const molecules_22 = result?.tech_molecules_22 || "";
  const molecules_23 = result?.tech_molecules_23 || "";
  const molecules_24 = result?.tech_molecules_24 || "";

  let head = "";
  if (formData?.tech_cal === "mass") {
    head = "Mass";
  } else if (formData?.tech_cal === "mw") {
    head = "Molecular Weight";
  } else if (formData?.tech_cal === "moles") {
    head = "Moles";
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-4">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2">
              <div className="col-span-12  relative">
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
                    <option value="mass">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="mw">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="moles">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_cal == "mass" ||
                formData.tech_cal == "moles") && (
                <>
                  <div className="col-span-12 md:col-span-6  mw">
                    <label htmlFor="tech_mw" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (g/mol):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mw"
                        id="tech_mw"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mw}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_cal == "mass" || formData.tech_cal == "mw") && (
                <>
                  <div className="col-span-12 md:col-span-6  moles">
                    <label htmlFor="tech_moles" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_moles"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_moles}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_moles_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "M", value: "M" },
                            { label: "mM", value: "mM" },
                            { label: "μM", value: "μM" },
                            { label: "nM", value: "nM" },
                            { label: "pM", value: "pM" },
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
              {(formData.tech_cal == "mw" || formData.tech_cal == "moles") && (
                <>
                  <div className="col-span-12 md:col-span-6  mass">
                    <label htmlFor="tech_mass" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mass"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mass}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_mass_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "picograms (pg)", value: "pg" },
                            { label: "nanograms (ng)", value: "ng" },
                            { label: "micrograms (μg)", value: "μg" },
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "decagrams (dag)", value: "dag" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "metric tons (t)", value: "t" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "stones", value: "stones" },
                            {
                              label: "US short tons (US ton)",
                              value: "US ton",
                            },
                            {
                              label: "imperial tons (Long ton)",
                              value: "Long ton",
                            },
                            { label: "atomic mass units (u)", value: "u" },
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
                    <div className="w-full p-3 radius-10 mt-3">
                      <div className="w-full">
                        <p>
                          <strong>{head}</strong>
                        </p>
                        <p>
                          <strong
                            className="text-[#119154] text-[32px]"
                            dangerouslySetInnerHTML={{ __html: ans }}
                          />
                        </p>
                        <p>
                          <strong>Molecules</strong>
                        </p>
                        <p className="text-[20px] my-2">
                          <strong className="text-[#119154]">
                            {molecules_22}
                          </strong>
                        </p>
                        <p className="text-[20px] my-2">
                          <strong className="text-[#119154]">
                            {molecules_23}
                          </strong>
                        </p>
                        <p className="text-[20px] my-2">
                          <strong className="text-[#119154]">
                            {molecules_24}
                          </strong>
                        </p>

                        {formData?.tech_cal !== "mw" && (
                          <>
                            <p className="my-2">
                              <strong>
                                {data?.payload?.tech_lang_keys?.["5"]}
                              </strong>
                            </p>
                            <div className="lg:w-[60%] md:w-[60%] overflow-auto text-[16px]">
                              <table className="w-full" cellSpacing="0">
                                <tbody>
                                  {formData?.tech_cal === "mass" && (
                                    <>
                                      {[
                                        "tech_ans_pg",
                                        "tech_ans_ng",
                                        "tech_ans_ug",
                                        "tech_ans_mg",
                                        "tech_ans_dag",
                                        "tech_ans_kg",
                                        "tech_ans_t",
                                        "tech_ans_oz",
                                        "tech_ans_lb",
                                        "tech_ans_stone",
                                        "tech_ans_us_ton",
                                        "tech_ans_long_ton",
                                        "tech_ans_u",
                                      ].map((key) => (
                                        <tr key={key}>
                                          <td className="border-b py-2">
                                            {head}
                                          </td>
                                          <td className="border-b py-2">
                                            <strong>{result?.[key]}</strong>
                                          </td>
                                        </tr>
                                      ))}
                                    </>
                                  )}

                                  {formData?.tech_cal === "moles" && (
                                    <>
                                      {[
                                        "tech_ans_pm",
                                        "tech_ans_nm",
                                        "tech_ans_um",
                                        "tech_ans_mm",
                                      ].map((key) => (
                                        <tr key={key}>
                                          <td className="border-b py-2">
                                            {head}
                                          </td>
                                          <td className="border-b py-2">
                                            <strong>{result?.[key]}</strong>
                                          </td>
                                        </tr>
                                      ))}
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
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

export default MoleCalculator;
