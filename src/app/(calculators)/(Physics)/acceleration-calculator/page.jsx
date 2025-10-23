"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAccelerationcalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AccelerationCalculator = () => {
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
    velo_value: "1", //  1 2 3
    iv: 3,
    ivU: "m/s",
    fv: 5,
    fvU: "m/s",
    ct: 5,
    ctU: "sec",
    acc: 5,
    accU: "sec",
    cdis: 5,
    cdisU: "m",
    mass: 4,
    masU: "kg",
    force: 4,
    forceU: "MN",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAccelerationcalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.velo_value) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        velo_value: formData.velo_value,
        iv: formData.iv,
        ivU: formData.ivU,
        fv: formData.fv,
        fvU: formData.fvU,
        ct: formData.ct,
        ctU: formData.ctU,
        cdis: formData.cdis,
        cdisU: formData.cdisU,
        mass: formData.mass,
        masU: formData.masU,
        force: formData.force,
        forceU: formData.forceU,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      velo_value: "1", //  1 2 3
      iv: 3,
      ivU: "m/s",
      fv: 5,
      fvU: "m/s",
      ct: 5,
      ctU: "sec",
      cdis: 5,
      cdisU: "m",
      mass: 4,
      masU: "kg",
      force: 4,
      forceU: "MN",
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
    setFormData((prev) => ({ ...prev, ivU: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, fvU: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, ctU: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, cdisU: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, masU: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, forceU: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  // ressuyl

  const [initialValue, setInitialValue] = useState(result?.ans || 0);
  const [convertedValue, setConvertedValue] = useState(result?.ans || 0);
  const [selectedUnit, setSelectedUnit] = useState("m/s²");

  const conversionFactors = {
    "m/s²": 1,
    g: 0.10197,
    "ft/s²": 3.281,
  };

  useEffect(() => {
    setInitialValue(result?.ans || 0);
    setConvertedValue(result?.ans || 0);
  }, [result]);

  const handleChange1 = (e) => {
    const unit = e.target.value;
    setSelectedUnit(unit);
    const conversionFactor = conversionFactors[unit];
    if (conversionFactor !== undefined) {
      const newValue = (initialValue * conversionFactor).toFixed(6);
      setConvertedValue(newValue);
    } else {
      console.error("Invalid conversion factor for unit: " + unit);
    }
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="col-span-12">
              {data?.payload?.tech_lang_keys["to_calc"] ?? "To Calculate"}:
            </div>
            <div className="col-span-12 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="velo_value"
                id="calculator_time"
                value={formData.velo_value}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.velo_value === "1" ? "tagsUnit" : ""
                    }`}
                    id="1"
                    onClick={() => {
                      setFormData({ ...formData, velo_value: "1" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["v_d"] ??
                      "Velocity Difference"}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.velo_value === "2" ? "tagsUnit" : ""
                    }`}
                    id="2"
                    onClick={() => {
                      setFormData({ ...formData, velo_value: "2" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["d_t"] ??
                      "Displacement–Time"}
                  </div>
                </div>
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.velo_value === "3" ? "tagsUnit" : ""
                    }`}
                    id="3"
                    onClick={() => {
                      setFormData({ ...formData, velo_value: "3" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["f_m"] ?? "Force and Mass"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              {(formData.velo_value == "1" || formData.velo_value == "2") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 Ivelocity  ">
                    <label htmlFor="iv" className="label">
                      {data?.payload?.tech_lang_keys["iv"]} (V<sub>0</sub>)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="iv"
                        step="any"
                        className="mt-1 input"
                        value={formData.iv}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.ivU} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "km/s", value: "km/s" },
                            { label: "mi/s", value: "mi/s" },
                            { label: "mph", value: "mph" },
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
              {(formData.velo_value == "1" || formData.velo_value == "1") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 Fvelocity ">
                    <label htmlFor="fv" className="label">
                      {data?.payload?.tech_lang_keys["fv"]} (V<sub>f</sub>)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="fv"
                        step="any"
                        className="mt-1 input"
                        value={formData.fv}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.fvU} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "km/s", value: "km/s" },
                            { label: "mi/s", value: "mi/s" },
                            { label: "mph", value: "mph" },
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
              {(formData.velo_value == "1" || formData.velo_value == "2") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 time ">
                    <label htmlFor="ct" className="label">
                      {data?.payload?.tech_lang_keys["time"]} (t)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="ct"
                        step="any"
                        className="mt-1 input"
                        value={formData.ct}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.ctU} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "h", value: "h" },
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
              {formData.velo_value == "2" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12  displacement">
                    <label htmlFor="cdis" className="label">
                      {data?.payload?.tech_lang_keys["disp"]} (∆x)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="cdis"
                        step="any"
                        className="mt-1 input"
                        value={formData.cdis}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.cdisU} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m", value: "m" },
                            { label: "cm", value: "cm" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "km", value: "km" },
                            { label: "mi", value: "mi" },
                            { label: "yd", value: "yd" },
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
              {formData.velo_value == "3" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 force">
                    <label htmlFor="mass" className="label">
                      {data?.payload?.tech_lang_keys["mass"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="mass"
                        step="any"
                        className="mt-1 input"
                        value={formData.mass}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.masU} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kg", value: "kg" },
                            { label: "g", value: "g" },
                            { label: "mg", value: "mg" },
                            { label: "t", value: "t" },
                            { label: "gr", value: "gr" },
                            { label: "dr", value: "dr" },
                            { label: "oz", value: "oz" },
                            { label: "lbs", value: "lbs" },
                            { label: "us ton", value: "us ton" },
                            { label: "long ton", value: "long ton" },
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
                </>
              )}
              {formData.velo_value == "3" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 force">
                    <label htmlFor="force" className="label">
                      {data?.payload?.tech_lang_keys["net"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="force"
                        step="any"
                        className="mt-1 input"
                        value={formData.force}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.forceU} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "KN", value: "KN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
                            { label: "pdl", value: "pdl" },
                            { label: "lbf", value: "lbf" },
                            { label: "dyn", value: "dyn" },
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="text-center">
                        <p className="md:text-[32px] text-[20px] bg-[#2845F5] text-white inline-block p-2 rounded-[10px] ">
                          <strong className="text-white px-2" id="acel_result">
                            {convertedValue}
                          </strong>
                          <select
                            id="acel_unit"
                            name="acel_unit"
                            value={selectedUnit}
                            onChange={handleChange1}
                            className="inline border-0 text-black text-[16px] w-[90px] mx-2 result_select_dropdown"
                          >
                            <option value="m/s²">m/s²</option>
                            <option value="g">g</option>
                            <option value="ft/s²">ft/s²</option>
                          </select>
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

export default AccelerationCalculator;
