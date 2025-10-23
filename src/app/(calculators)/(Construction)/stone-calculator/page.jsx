"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useStoneCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StoneCalculator = () => {
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
    tech_selection: "1", // 1 2 3
    tech_material: "105",
    tech_length: "7",
    tech_length_unit: "cm",
    tech_width: "6",
    tech_width_unit: "cm",
    tech_area: "6",
    tech_area_unit: "ft²",
    tech_depth: "6",
    tech_depth_unit: "cm",
    tech_volume: "6",
    tech_volume_unit: "ft³",
    tech_price: "2",
    tech_price_unit: "per ton",
    tech_currancy: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStoneCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_selection == 1) {
      if (
        !formData.tech_selection ||
        !formData.tech_material ||
        !formData.tech_length ||
        !formData.tech_length_unit ||
        !formData.tech_width ||
        !formData.tech_width_unit ||
        !formData.tech_depth ||
        !formData.tech_depth_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_selection == 1) {
      if (
        !formData.tech_selection ||
        !formData.tech_material ||
        !formData.tech_depth ||
        !formData.tech_depth_unit ||
        !formData.tech_area ||
        !formData.tech_area_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_selection ||
        !formData.tech_material ||
        !formData.tech_volume ||
        !formData.tech_volume_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_material: formData.tech_material,
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
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
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
      tech_selection: "1", // 1 2 3
      tech_material: "105",
      tech_length: "7",
      tech_length_unit: "cm",
      tech_width: "6",
      tech_width_unit: "cm",
      tech_area: "6",
      tech_area_unit: "ft²",
      tech_depth: "6",
      tech_depth_unit: "cm",
      tech_volume: "6",
      tech_volume_unit: "ft³",
      tech_price: "2",
      tech_price_unit: "per ton",
      tech_currancy: "$",
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
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
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

          <input
            type="hidden"
            step="any"
            name="tech_currancy"
            id="tech_currancy"
            className="input my-2"
            aria-label="input"
            value={currency.symbol}
            onChange={handleChange}
          />

          <div className="mx-auto mt-2 w-full lg:w-[80%] md:w-[80%]">
            <input
              type="hidden"
              name="tech_selection"
              id="calculator_time"
              value={formData.tech_selection}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              {/* Date Cal Tab */}
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                    formData.tech_selection === "1" ? "tagsUnit" : ""
                  }`}
                  id="1"
                  onClick={() => {
                    setFormData({ ...formData, tech_selection: "1" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["2"]}
                </div>
              </div>
              {/* Time Cal Tab */}
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_selection === "2" ? "tagsUnit" : ""
                  }`}
                  id="2"
                  onClick={() => {
                    setFormData({ ...formData, tech_selection: "2" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["3"]}
                </div>
              </div>
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_selection === "3" ? "tagsUnit" : ""
                  }`}
                  id="3"
                  onClick={() => {
                    setFormData({ ...formData, tech_selection: "3" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["4"]}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-0 mt-lg-2">
                <label htmlFor="tech_material" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="mt-1">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_material"
                    id="tech_material"
                    value={formData.tech_material}
                    onChange={handleChange}
                  >
                    <option value="105">
                      {data?.payload?.tech_lang_keys["16"]} (¼” – 2″)
                    </option>
                    <option value="150">
                      {data?.payload?.tech_lang_keys["17"]} (2″ – 6″){" "}
                    </option>
                    <option value="160">
                      {data?.payload?.tech_lang_keys["18"]} (
                      {data?.payload?.tech_lang_keys["19"]}){" "}
                    </option>
                    <option value="145">
                      {data?.payload?.tech_lang_keys["20"]} (
                      {data?.payload?.tech_lang_keys["21"]}){" "}
                    </option>
                    <option value="168">
                      {data?.payload?.tech_lang_keys["22"]} (
                      {data?.payload?.tech_lang_keys["19"]}){" "}
                    </option>
                    <option value="160">
                      {data?.payload?.tech_lang_keys["22"]} (
                      {data?.payload?.tech_lang_keys["21"]}){" "}
                    </option>
                    <option value="168">
                      {data?.payload?.tech_lang_keys["23"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_selection == "1" && (
                <>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6  mt-0 mt-lg-2 length">
                    <label htmlFor="tech_length" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
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
              {formData.tech_selection == "1" && (
                <>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6  mt-0 mt-lg-2 width">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
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
              {(formData.tech_selection == "2" ||
                formData.tech_selection == "2") && (
                <>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6  mt-0 mt-lg-2 area ">
                    <label htmlFor="tech_area" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
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
                            { label: "ft²", value: "ft²" },
                            { label: "yd²", value: "yd²" },
                            { label: "m²", value: "m²" },
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
              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2") && (
                <>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6  mt-0 mt-lg-2 depth">
                    <label htmlFor="tech_depth" className="label">
                      {data?.payload?.tech_lang_keys["15"]}
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
              {formData.tech_selection == "3" && (
                <>
                  <div className="col-span-6 md:col-span-6 lg:col-span-6  mt-0 mt-lg-2 volume">
                    <label htmlFor="tech_volume" className="label">
                      {data?.payload?.tech_lang_keys["8"]}
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
                            { label: "ft³", value: "ft³" },
                            { label: "yd²", value: "yd²" },
                            { label: "m²", value: "m²" },
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
              <div className="col-span-6 md:col-span-6 lg:col-span-6  mt-0 mt-lg-2 price">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["10"]} (
                  {data?.payload?.tech_lang_keys["11"]}):
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_price"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_price}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown5}
                  >
                    {formData.tech_price_unit} ▾
                  </label>
                  {dropdownVisible5 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "per ton", value: "per ton" },
                        { label: "per cu yad", value: "per cu yad" },
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      {/* Calculate trimmed price_unit and currency */}
                      {(() => {
                        const priceUnit = formData?.tech_price_unit
                          ?.replace(`${formData?.tech_currancy} `, "")
                          .trim();

                        return (
                          <div className="w-full my-2">
                            <div className="w-full md:w-[70%] lg:w-[70%] overflow-auto text-[16px]">
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="60%" className="border-b py-3">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}:
                                      </strong>
                                    </td>
                                    <td className="border-b py-3">
                                      {Number(result?.tech_array?.[0]).toFixed(
                                        2
                                      )}{" "}
                                      -{" "}
                                      {Number(result?.tech_array?.[1]).toFixed(
                                        2
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-3">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["13"]}:
                                      </strong>
                                    </td>
                                    <td className="border-b py-3">
                                      {Number(result?.tech_cubicyd1).toFixed(6)}
                                    </td>
                                  </tr>

                                  {formData?.tech_price && (
                                    <tr>
                                      <td className="border-b py-3">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["14"]}:
                                        </strong>
                                      </td>
                                      <td className="border-b py-3">
                                        {formData?.tech_price_unit ==
                                        "per ton" ? (
                                          <>
                                            {Number(
                                              result?.tech_array?.[0]
                                            ).toFixed(0) ===
                                            Number(
                                              result?.tech_array?.[1]
                                            ).toFixed(0) ? (
                                              <>
                                                {Number(
                                                  result?.tech_array?.[0]
                                                ).toFixed(0)}{" "}
                                                <span>{currency.symbol}</span>
                                              </>
                                            ) : (
                                              <>
                                                {Math.abs(
                                                  Number(
                                                    result?.tech_array?.[0]
                                                  ) -
                                                    Number(
                                                      result?.tech_array?.[1]
                                                    )
                                                ).toFixed(0)}{" "}
                                                <span>{currency.symbol}</span>
                                              </>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {Number(
                                              result?.tech_price_cu
                                            ).toFixed(2)}{" "}
                                            <span>{currency.symbol}</span>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  )}
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

export default StoneCalculator;
