"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTitrationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TitrationCalculator = () => {
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
    tech_cal: "ma", // ma  va hp  mb  vb  oh
    tech_ma: "2",
    tech_ma_unit: "M",
    tech_va: "3",
    tech_va_unit: "ml",
    tech_hp: "4",
    tech_mb: "2",
    tech_mb_unit: "M",
    tech_vb: "6",
    tech_vb_unit: "ml",
    tech_oh: "7",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTitrationCalculatorMutation();

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
        tech_ma: formData.tech_ma,
        tech_ma_unit: formData.tech_ma_unit,
        tech_va: formData.tech_va,
        tech_va_unit: formData.tech_va_unit,
        tech_hp: formData.tech_hp,
        tech_mb: formData.tech_mb,
        tech_mb_unit: formData.tech_mb_unit,
        tech_vb: formData.tech_vb,
        tech_vb_unit: formData.tech_vb_unit,
        tech_oh: formData.tech_oh,
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
      tech_cal: "ma", // ma  va hp  mb  vb  oh
      tech_ma: "2",
      tech_ma_unit: "M",
      tech_va: "3",
      tech_va_unit: "ml",
      tech_hp: "4",
      tech_mb: "2",
      tech_mb_unit: "M",
      tech_vb: "6",
      tech_vb_unit: "ml",
      tech_oh: "7",
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
    setFormData((prev) => ({ ...prev, tech_ma_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_va_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mb_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_vb_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  // result

  let mainHeading = "";

  switch (formData?.tech_cal) {
    case "ma":
      mainHeading = data?.payload?.tech_lang_keys["1"];
      break;
    case "va":
      mainHeading = data?.payload?.tech_lang_keys["2"];
      break;
    case "hp":
      mainHeading = data?.payload?.tech_lang_keys["3"];
      break;
    case "mb":
      mainHeading = data?.payload?.tech_lang_keys["4"];
      break;
    case "vb":
      mainHeading = data?.payload?.tech_lang_keys["5"];
      break;
    case "oh":
      mainHeading = data?.payload?.tech_lang_keys["6"];
      break;
    default:
      mainHeading = "";
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-1  md:gap-2 mt-1">
              <div className="col-span-12 md:col-span-12 relative">
                <div className="grid grid-cols-12 gap-1  md:gap-2 mt-1">
                  <div className="col-span-12 md:col-span-5 flex items-center">
                    <label htmlFor="tech_cal" className="label">
                      {data?.payload?.tech_lang_keys["to_calc"]}:
                    </label>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_cal"
                        id="tech_cal"
                        value={formData.tech_cal}
                        onChange={handleChange}
                      >
                        <option value="ma">
                          {data?.payload?.tech_lang_keys["1"]}
                        </option>
                        <option value="va">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="hp">
                          {data?.payload?.tech_lang_keys["3"]}
                        </option>
                        <option value="mb">
                          {data?.payload?.tech_lang_keys["4"]}
                        </option>
                        <option value="vb">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value="oh">
                          {data?.payload?.tech_lang_keys["6"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {(formData.tech_cal == "va" ||
                formData.tech_cal == "hp" ||
                formData.tech_cal == "mb" ||
                formData.tech_cal == "vb" ||
                formData.tech_cal == "oh") && (
                <>
                  <div className="col-span-12  ma ">
                    <div className="grid grid-cols-12 gap-1  md:gap-2 mt-1">
                      <div className="col-span-12 md:col-span-5 flex items-center">
                        <label htmlFor="tech_ma" className="label">
                          {data?.payload?.tech_lang_keys["1"]}
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_ma"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_ma}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_ma_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
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
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_cal == "ma" ||
                formData.tech_cal == "hp" ||
                formData.tech_cal == "mb" ||
                formData.tech_cal == "vb" ||
                formData.tech_cal == "oh") && (
                <>
                  <div className="col-span-12  va">
                    <div className="grid grid-cols-12 gap-1  md:gap-2 mt-1">
                      <div className="col-span-12 md:col-span-5 flex items-center">
                        <label htmlFor="tech_va" className="label">
                          {data?.payload?.tech_lang_keys["2"]}
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_va"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_va}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_va_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "mm³", value: "mm³" },
                                { label: "cm³", value: "cm³" },
                                { label: "dm³", value: "dm³" },
                                { label: "m³", value: "m³" },
                                {
                                  label: "cubic inches (cu in)",
                                  value: "cu in",
                                },
                                { label: "cubic feet (cu ft)", value: "cu ft" },
                                { label: "cubic feet (cu yd)", value: "cu yd" },
                                { label: "milliliteers (ml)", value: "ml" },
                                { label: "centiliters (cl)", value: "cl" },
                                { label: "liters (l)", value: "l" },
                                {
                                  label: "US gallons (us gal)",
                                  value: "us gal",
                                },
                                {
                                  label: "UK gallons (uk gal)",
                                  value: "uk gal",
                                },
                                {
                                  label: "fluid ounces (US) (us fl oz)",
                                  value: "us fl oz",
                                },
                                {
                                  label: "fluid ounces (US) (uk fl oz)",
                                  value: "uk fl oz",
                                },
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
                  </div>
                </>
              )}
              {(formData.tech_cal == "ma" ||
                formData.tech_cal == "va" ||
                formData.tech_cal == "mb" ||
                formData.tech_cal == "vb" ||
                formData.tech_cal == "oh") && (
                <>
                  <div className="col-span-12  hp">
                    <div className="grid grid-cols-12 gap-1  md:gap-2 mt-1">
                      <div className="col-span-12 md:col-span-5 flex items-center">
                        <label htmlFor="tech_hp" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_hp"
                            id="tech_hp"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_hp}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_cal == "ma" ||
                formData.tech_cal == "va" ||
                formData.tech_cal == "hp" ||
                formData.tech_cal == "vb" ||
                formData.tech_cal == "oh") && (
                <>
                  <div className="col-span-12  mb">
                    <div className="grid grid-cols-12 gap-1  md:gap-2 mt-1">
                      <div className="col-span-12 md:col-span-5 flex items-center">
                        <label htmlFor="tech_mb" className="label">
                          {data?.payload?.tech_lang_keys["4"]}
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_mb"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_mb}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_mb_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
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
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_cal == "ma" ||
                formData.tech_cal == "va" ||
                formData.tech_cal == "hp" ||
                formData.tech_cal == "mb" ||
                formData.tech_cal == "oh") && (
                <>
                  <div className="col-span-12  vb">
                    <div className="grid grid-cols-12 gap-1  md:gap-2 mt-1">
                      <div className="col-span-12 md:col-span-5 flex items-center">
                        <label htmlFor="tech_vb" className="label">
                          {data?.payload?.tech_lang_keys["5"]}
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_vb"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_vb}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_vb_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "mm³", value: "mm³" },
                                { label: "cm³", value: "cm³" },
                                { label: "dm³", value: "dm³" },
                                { label: "m³", value: "m³" },
                                {
                                  label: "cubic inches (cu in)",
                                  value: "cu in",
                                },
                                { label: "cubic feet (cu ft)", value: "cu ft" },
                                { label: "cubic feet (cu yd)", value: "cu yd" },
                                { label: "milliliteers (ml)", value: "ml" },
                                { label: "centiliters (cl)", value: "cl" },
                                { label: "liters (l)", value: "l" },
                                {
                                  label: "US gallons (us gal)",
                                  value: "us gal",
                                },
                                {
                                  label: "UK gallons (uk gal)",
                                  value: "uk gal",
                                },
                                {
                                  label: "fluid ounces (US) (us fl oz)",
                                  value: "us fl oz",
                                },
                                {
                                  label: "fluid ounces (US) (uk fl oz)",
                                  value: "uk fl oz",
                                },
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
                  </div>
                </>
              )}
              {(formData.tech_cal == "ma" ||
                formData.tech_cal == "va" ||
                formData.tech_cal == "mb" ||
                formData.tech_cal == "vb" ||
                formData.tech_cal == "hp") && (
                <>
                  <div className="col-span-12  hp">
                    <div className="grid grid-cols-12 gap-1  md:gap-2 mt-1">
                      <div className="col-span-12 md:col-span-5 flex items-center">
                        <label htmlFor="tech_oh" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_oh"
                            id="tech_oh"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_oh}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="bg-sky bordered rounded-lg p-3 mb-3 text-center">
                          <strong className=" text-[18px] md:text-[20px]">
                            {mainHeading} =
                          </strong>
                          <strong
                            className="text-[#119154] text-[18px] md:text-[20px]"
                            dangerouslySetInnerHTML={{
                              __html: result?.tech_ans,
                            }}
                          ></strong>
                        </div>

                        {(formData?.tech_cal === "ma" ||
                          formData?.tech_cal === "mb") && (
                          <>
                            <p className="mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <div className="w-full overflow-auto text-[16px]">
                              <table className="w-full" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {mainHeading}
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>{result?.tech_ans_pm}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {mainHeading}
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>{result?.tech_ans_nm}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {mainHeading}
                                    </td>
                                    <td className="border-b py-2">
                                      <strong>{result?.tech_ans_um}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">{mainHeading}</td>
                                    <td className="py-2">
                                      <strong>{result?.tech_ans_mm}</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {(formData?.tech_cal === "va" ||
                          formData?.tech_cal === "vb") && (
                          <>
                            <p className="mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["7"]}
                              </strong>
                            </p>
                            <div className="w-full overflow-auto text-[16px]">
                              <table className="w-full" cellSpacing="0">
                                <tbody>
                                  <tr className="va_vb">
                                    <td className="border-b py-2"></td>
                                    <td className="border-b py-2">
                                      <strong>{result?.tech_ans_nl}</strong>
                                    </td>
                                  </tr>
                                  <tr className="va_vb">
                                    <td className="border-b py-2"></td>
                                    <td className="border-b py-2">
                                      <strong>{result?.tech_ans_ul}</strong>
                                    </td>
                                  </tr>
                                  <tr className="va_vb">
                                    <td className="py-2"></td>
                                    <td className="py-2">
                                      <strong>{result?.tech_ans_ml}</strong>
                                    </td>
                                  </tr>
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

export default TitrationCalculator;
