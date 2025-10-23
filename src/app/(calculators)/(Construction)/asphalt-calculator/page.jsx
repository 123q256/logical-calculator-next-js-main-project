"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAsphaltCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AsphaltCalculator = () => {
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
    tech_cal: "lwt",
    tech_length: Number(24),
    tech_length_unit: "cm",
    tech_width: Number(10),
    tech_width_unit: "cm",
    tech_area: Number(10),
    tech_area_unit: "m²",
    tech_depth: Number(15),
    tech_depth_unit: "cm",
    tech_volume: Number(15),
    tech_volume_unit: "m³",
    tech_density: Number(12),
    tech_density_unit: "kg/m³",
    tech_cs_depth: Number(15),
    tech_cs_depth_unit: "cm",
    tech_depth_dr: Number(15),
    tech_depth_dr_unit: "cm",
    tech_cost: "",
    tech_cost_unit: "kg",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAsphaltCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal || !formData.tech_length) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal: formData.tech_cal,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_depth: formData.tech_depth,
        tech_depth_unit: formData.tech_depth_unit,
        tech_volume: formData.tech_volume,
        tech_volume_unit: formData.tech_volume_unit,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_cs_depth: formData.tech_cs_depth,
        tech_cs_depth_unit: formData.tech_cs_depth_unit,
        tech_depth_dr: formData.tech_depth_dr,
        tech_depth_dr_unit: formData.tech_depth_dr_unit,
        tech_cost: formData.tech_cost,
        tech_cost_unit: formData.tech_cost_unit,
        tech_submit: formData.tech_submit,
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
      tech_cal: "lwt",
      tech_length: Number(24),
      tech_length_unit: "cm",
      tech_width: Number(10),
      tech_width_unit: "cm",
      tech_area: Number(10),
      tech_area_unit: "m²",
      tech_depth: Number(15),
      tech_depth_unit: "cm",
      tech_volume: Number(15),
      tech_volume_unit: "m³",
      tech_density: Number(12),
      tech_density_unit: "kg/m³",
      tech_cs_depth: Number(15),
      tech_cs_depth_unit: "cm",
      tech_depth_dr: Number(15),
      tech_depth_dr_unit: "cm",
      tech_cost: "",
      tech_cost_unit: "kg",
      tech_submit: "calculate",
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
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_depth_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_volume_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_density_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cs_depth_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_depth_dr_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cost_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
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
                    <option value="lwt">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="at">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="vad">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="csn">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="dtbr">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_cal == "lwt" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 length">
                    <label htmlFor="tech_length" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_length"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_length_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
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
              {formData.tech_cal == "lwt" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 width">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["8"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_width_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
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

              {(formData.tech_cal == "at" ||
                formData.tech_cal == "csn" ||
                formData.tech_cal == "dtbr") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 area ">
                    <label htmlFor="tech_area" className="label">
                      {data?.payload?.tech_lang_keys["9"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_area"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_area}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_area_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m²", value: "m²" },
                            { label: "km²", value: "km²" },
                            { label: "in²", value: "in²" },
                            { label: "ft²", value: "ft²" },
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
              {(formData.tech_cal == "lwt" ||
                formData.tech_cal == "at" ||
                formData.tech_cal == "csn" ||
                formData.tech_cal == "dtbr") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 depth ">
                    <label htmlFor="tech_depth" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_depth"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_depth}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_depth_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
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
              {formData.tech_cal == "vad" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 volume ">
                    <label htmlFor="tech_volume" className="label">
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_volume"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_volume}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_volume_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m³", value: "m³" },
                            { label: "cu ft", value: "cu ft" },
                            { label: "US Gal", value: "US Gal" },
                            { label: "UK Gal", value: "UK Gal" },
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
              {(formData.tech_cal == "lwt" ||
                formData.tech_cal == "at" ||
                formData.tech_cal == "vad") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 density">
                    <label htmlFor="tech_density" className="label">
                      {data?.payload?.tech_lang_keys["12"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_density"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_density}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_density_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kg/m³", value: "kg/m³" },
                            { label: "lb/cu ft", value: "lb/cu ft" },
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
              {formData.tech_cal == "csn" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 cs_depth ">
                    <label htmlFor="tech_cs_depth" className="label">
                      {data?.payload?.tech_lang_keys["13"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_cs_depth"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_cs_depth}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_cs_depth_unit} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler6(unit.value)}
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
              {formData.tech_cal == "dtbr" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 depth_dr ">
                    <label htmlFor="tech_depth_dr" className="label">
                      {data?.payload?.tech_lang_keys["14"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_depth_dr"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_depth_dr}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown7}
                      >
                        {formData.tech_depth_dr_unit} ▾
                      </label>
                      {dropdownVisible7 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler7(unit.value)}
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
              {(formData.tech_cal == "lwt" ||
                formData.tech_cal == "at" ||
                formData.tech_cal == "vad") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 cost ">
                    <label htmlFor="tech_cost" className="label">
                      {data?.payload?.tech_lang_keys["15"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_cost"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_cost}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown8}
                      >
                        {formData.tech_cost_unit} ▾
                      </label>
                      {dropdownVisible8 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kg", value: "kg" },
                            { label: "ton", value: "ton" },
                            { label: "lb", value: "lb" },
                            { label: "us_ton", value: "us_ton" },
                            { label: "long_ton", value: "long_ton" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler8(unit.value)}
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
                      <div className="w-ful my-2">
                        <div className="w-full  md:w-[90%] lg:w-[80%] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_asphalt} tons
                                </td>
                              </tr>

                              {formData?.tech_cal === "lwt" && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["9"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_area} m²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["11"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_volume} m³
                                    </td>
                                  </tr>
                                  {result?.tech_total_cost && (
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["17"]}{" "}
                                          :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol}{" "}
                                        {Number(
                                          result?.tech_total_cost
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  )}
                                </>
                              )}

                              {formData?.tech_cal === "at" && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["11"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_volume} m³
                                    </td>
                                  </tr>
                                  {result?.tech_total_cost && (
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["17"]}{" "}
                                          :
                                        </strong>
                                      </td>
                                      <td className="border-b py-2">
                                        {currency.symbol +
                                          " " +
                                          Number(
                                            result?.tech_total_cost
                                          ).toFixed(2)}
                                      </td>
                                    </tr>
                                  )}
                                </>
                              )}

                              {formData?.tech_cal === "vad" &&
                                result?.tech_total_cost && (
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["17"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol +
                                        " " +
                                        Number(result?.tech_total_cost).toFixed(
                                          2
                                        )}
                                    </td>
                                  </tr>
                                )}

                              {formData?.tech_cal === "csn" && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["18"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_stone} tons
                                  </td>
                                </tr>
                              )}

                              {formData?.tech_cal === "dtbr" && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["19"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_dirt} cu yd
                                  </td>
                                </tr>
                              )}

                              {/* Conversion Table */}
                              <tr>
                                <td colSpan="2" className="pt-3 pb-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["20"]}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["16"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_kg).toFixed(5)} kilograms
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["16"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_lb).toFixed(5)} pounds
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["16"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_us_ton).toFixed(5)} US
                                  short tons
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["16"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_long_ton).toFixed(5)}{" "}
                                  imperial tons
                                </td>
                              </tr>
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

export default AsphaltCalculator;
