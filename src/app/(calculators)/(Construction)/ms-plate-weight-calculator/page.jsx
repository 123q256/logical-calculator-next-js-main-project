"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMsPlateWeightCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MsPlateWeightCalculator = () => {
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
    tech_st_type: "7860",
    tech_st_shape: "4", // 1 2 3 4
    tech_length: "6",
    tech_length_unit: "cm",
    tech_width: "6",
    tech_width_unit: "cm",
    tech_thickness: "6",
    tech_thickness_unit: "cm",
    tech_side: "6",
    tech_side_unit: "cm",
    tech_diameter: "6",
    tech_diameter_unit: "cm",
    tech_area: "6",
    tech_area_unit: "cm²",
    tech_quantity: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMsPlateWeightCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_st_shape == 1) {
      if (
        !formData.tech_st_shape ||
        !formData.tech_st_type ||
        !formData.tech_quantity ||
        !formData.tech_length ||
        !formData.tech_length_unit ||
        !formData.tech_width ||
        !formData.tech_width_unit ||
        !formData.tech_thickness ||
        !formData.tech_thickness_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_st_shape == 2) {
      if (
        !formData.tech_st_shape ||
        !formData.tech_st_type ||
        !formData.tech_thickness ||
        !formData.tech_thickness_unit ||
        !formData.tech_side ||
        !formData.tech_side_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_st_shape == 3) {
      if (
        !formData.tech_st_shape ||
        !formData.tech_st_type ||
        !formData.tech_thickness ||
        !formData.tech_thickness_unit ||
        !formData.tech_diameter ||
        !formData.tech_diameter_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_st_shape ||
        !formData.tech_st_type ||
        !formData.tech_thickness ||
        !formData.tech_thickness_unit ||
        !formData.tech_area ||
        !formData.tech_area_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_st_type: formData.tech_st_type,
        tech_st_shape: formData.tech_st_shape,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_thickness: formData.tech_thickness,
        tech_thickness_unit: formData.tech_thickness_unit,
        tech_side: formData.tech_side,
        tech_side_unit: formData.tech_side_unit,
        tech_diameter: formData.tech_diameter,
        tech_diameter_unit: formData.tech_diameter_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_quantity: formData.tech_quantity,
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
      tech_st_type: "7860",
      tech_st_shape: "4", // 1 2 3 4
      tech_length: "6",
      tech_length_unit: "cm",
      tech_width: "6",
      tech_width_unit: "cm",
      tech_thickness: "6",
      tech_thickness_unit: "cm",
      tech_side: "6",
      tech_side_unit: "cm",
      tech_diameter: "6",
      tech_diameter_unit: "cm",
      tech_area: "6",
      tech_area_unit: "cm²",
      tech_quantity: "5",
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
    setFormData((prev) => ({ ...prev, tech_thickness_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_side_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_diameter_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="grid grid-cols-12  gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_st_type" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_st_type"
                        id="tech_st_type"
                        value={formData.tech_st_type}
                        onChange={handleChange}
                      >
                        <option value="7715">
                          {data?.payload?.tech_lang_keys["1"]} (7715 kg/m³)
                        </option>
                        <option value="7750">
                          {data?.payload?.tech_lang_keys["2"]} (7750 kg/m³)
                        </option>
                        <option value="7820">
                          {data?.payload?.tech_lang_keys["3"]} (7820 kg/m³)
                        </option>
                        <option value="7830">
                          {data?.payload?.tech_lang_keys["4"]} (7830 kg/m³)
                        </option>
                        <option value="7840">
                          {data?.payload?.tech_lang_keys["5"]} (7840 kg/m³)
                        </option>
                        <option value="7850">
                          {data?.payload?.tech_lang_keys["6"]} (7850 kg/m³)
                        </option>
                        <option value="7860">
                          {data?.payload?.tech_lang_keys["7"]} (7860 kg/m³)
                        </option>
                        <option value="7870">
                          {data?.payload?.tech_lang_keys["8"]} (7870 kg/m³)
                        </option>
                        <option value="8030">
                          {data?.payload?.tech_lang_keys["9"]} (8030 kg/m³)
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_st_shape" className="label">
                      {data?.payload?.tech_lang_keys["11"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_st_shape"
                        id="tech_st_shape"
                        value={formData.tech_st_shape}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["12"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["13"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["14"]}{" "}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["15"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  {formData.tech_st_shape == "1" && (
                    <>
                      <div className="col-span-12 length">
                        <label htmlFor="tech_length" className="label">
                          {data?.payload?.tech_lang_keys["16"]} (l):
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
                                { label: "mm", value: "mm" },
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
                  {formData.tech_st_shape == "1" && (
                    <>
                      <div className="col-span-12 width">
                        <label htmlFor="tech_width" className="label">
                          {data?.payload?.tech_lang_keys["17"]} (w):
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
                                { label: "mm", value: "mm" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
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
                  {(formData.tech_st_shape == "1" ||
                    formData.tech_st_shape == "2" ||
                    formData.tech_st_shape == "3" ||
                    formData.tech_st_shape == "4") && (
                    <>
                      <div className="col-span-12 thickness">
                        <label htmlFor="tech_thickness" className="label">
                          {data?.payload?.tech_lang_keys["18"]} (t):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_thickness"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_thickness}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_thickness_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "mm", value: "mm" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
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
                  {formData.tech_st_shape == "2" && (
                    <>
                      <div className="col-span-12 side ">
                        <label htmlFor="tech_side" className="label">
                          {data?.payload?.tech_lang_keys["19"]} (s):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_side"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_side}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_side_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "mm", value: "mm" },
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
                  {formData.tech_st_shape == "3" && (
                    <>
                      <div className="col-span-12 diameter ">
                        <label htmlFor="tech_diameter" className="label">
                          {data?.payload?.tech_lang_keys["20"]} (d):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_diameter"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_diameter}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_diameter_unit} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "mm", value: "mm" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
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
                  {formData.tech_st_shape == "4" && (
                    <>
                      <div className="col-span-12 area ">
                        <label htmlFor="tech_area" className="label">
                          {data?.payload?.tech_lang_keys["21"]} (a):
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
                            onClick={toggleDropdown5}
                          >
                            {formData.tech_area_unit} ▾
                          </label>
                          {dropdownVisible5 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm²", value: "cm²" },
                                { label: "mm²", value: "mm²" },
                                { label: "m²", value: "m²" },
                                { label: "in²", value: "in²" },
                                { label: "ft²", value: "ft²" },
                                { label: "yd²", value: "yd²" },
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
              <div className="col-span-12 md:col-span-6">
                <div className="grid grid-cols-12  gap-4">
                  <div className="col-span-12">
                    <label htmlFor="tech_quantity" className="label">
                      {data?.payload?.tech_lang_keys["22"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_quantity"
                        id="tech_quantity"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_quantity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-12">&nbsp;</div>
                <div className="col-span-12">&nbsp;</div>
                <div className="col-span-12 flex items-center">
                  {formData.tech_st_shape == "1" && (
                    <>
                      <img
                        src="/images/k12.webp"
                        alt="Shape Image"
                        className="max-width change_img mt-lg-5"
                        width="500px"
                        height="150px"
                      />
                    </>
                  )}
                  {formData.tech_st_shape == "2" && (
                    <>
                      <img
                        src="/images/k22.webp"
                        alt="Shape Image"
                        className="max-width change_img mt-lg-5"
                        width="500px"
                        height="150px"
                      />
                    </>
                  )}
                  {formData.tech_st_shape == "3" && (
                    <>
                      <img
                        src="/images/k32.webp"
                        alt="Shape Image"
                        className="max-width change_img mt-lg-5"
                        width="500px"
                        height="150px"
                      />
                    </>
                  )}
                  {formData.tech_st_shape == "4" && (
                    <>
                      <img
                        src="/images/k42.webp"
                        alt="Shape Image"
                        className="max-width change_img mt-lg-5"
                        width="500px"
                        height="150px"
                      />
                    </>
                  )}
                </div>
              </div>
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
                      <div className="row my-2">
                        <div className="w-full md-w-[60%] lg:w-[60%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["21"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_area).toFixed(2)}{" "}
                                  <span className="font-s-14">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["23"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume).toFixed(2)}
                                  <span className="font-s-14">
                                    {" "}
                                    (cm<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["24"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_weight}
                                  <span className="font-s-14"> (g)</span>
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

export default MsPlateWeightCalculator;
