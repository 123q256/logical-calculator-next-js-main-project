"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useRiverRockCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RiverRockCalculator = () => {
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
    tech_rock_type: "1505",
    tech_density: "12",
    tech_density_unit: "t/m³",
    tech_length: "12",
    tech_length_unit: "yd",
    tech_width: "12",
    tech_width_unit: "m",
    tech_depth: "12",
    tech_depth_unit: "yd",
    tech_wastage: "5",
    tech_price: "12",
    tech_price_unit: "/t",
    tech_currancy: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRiverRockCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_rock_type ||
      !formData.tech_density ||
      !formData.tech_density_unit ||
      !formData.tech_length ||
      !formData.tech_length_unit ||
      !formData.tech_width ||
      !formData.tech_width_unit ||
      !formData.tech_depth ||
      !formData.tech_depth_unit ||
      !formData.tech_wastage
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_rock_type: formData.tech_rock_type,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_depth: formData.tech_depth,
        tech_depth_unit: formData.tech_depth_unit,
        tech_wastage: formData.tech_wastage,
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
        tech_currancy: formData.tech_currancy,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_rock_type: "1505",
      tech_density: "12",
      tech_density_unit: "t/m³",
      tech_length: "12",
      tech_length_unit: "yd",
      tech_width: "12",
      tech_width_unit: "m",
      tech_depth: "12",
      tech_depth_unit: "yd",
      tech_wastage: "5",
      tech_price: "12",
      tech_price_unit: "/t",
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
    setFormData((prev) => ({ ...prev, tech_density_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
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
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_rock_type" className="label">
                  {data?.payload?.tech_lang_keys["rock_type"]}:
                </label>

                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_rock_type"
                    id="tech_rock_type"
                    value={formData.tech_rock_type}
                    onChange={handleChange}
                  >
                    {[
                      {
                        value: "1425",
                        label: data?.payload?.tech_lang_keys["s_r_r"],
                      },
                      {
                        value: "1483",
                        label: data?.payload?.tech_lang_keys["b_g"],
                      },
                      {
                        value: "1545",
                        label: data?.payload?.tech_lang_keys["c_p_g"],
                      },
                      {
                        value: "1314",
                        label: data?.payload?.tech_lang_keys["c_r_r"],
                      },
                      {
                        value: "1670",
                        label: data?.payload?.tech_lang_keys["c_b"],
                      },
                      {
                        value: "2098",
                        label: data?.payload?.tech_lang_keys["c_g_g"],
                      },
                      {
                        value: "721",
                        label: data?.payload?.tech_lang_keys["c_a"],
                      },
                      {
                        value: "1320",
                        label: data?.payload?.tech_lang_keys["c_g"],
                      },
                      {
                        value: "1602",
                        label: data?.payload?.tech_lang_keys["c_s"],
                      },
                      {
                        value: "1522",
                        label: data?.payload?.tech_lang_keys["cr_r_r"],
                      },
                      {
                        value: "1865",
                        label: data?.payload?.tech_lang_keys["d_g"],
                      },
                      {
                        value: "2650",
                        label: data?.payload?.tech_lang_keys["grnt"],
                      },
                      {
                        value: "1506",
                        label: data?.payload?.tech_lang_keys["i_c_g"],
                      },
                      {
                        value: "1788",
                        label: data?.payload?.tech_lang_keys["p_g"],
                      },
                      {
                        value: "1490",
                        label: data?.payload?.tech_lang_keys["p_r_r"],
                      },
                      {
                        value: "2700",
                        label: data?.payload?.tech_lang_keys["qrtz"],
                      },
                      {
                        value: "1346",
                        label: data?.payload?.tech_lang_keys["r_g"],
                      },
                      {
                        value: "1505",
                        label: data?.payload?.tech_lang_keys["s_g_g"],
                      },
                      {
                        value: "1430",
                        label: data?.payload?.tech_lang_keys["w_m_c"],
                      },
                      {
                        value: "custom",
                        label: data?.payload?.tech_lang_keys["custom"],
                      },
                    ].map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_density" className="label">
                  {data?.payload?.tech_lang_keys["density"]}
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
                    onClick={toggleDropdown}
                  >
                    {formData.tech_density_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kg/m³", value: "kg/m³" },
                        { label: "t/m³", value: "t/m³" },
                        { label: "g/cm³", value: "g/cm³" },
                        { label: "lb/cu in", value: "lb/cu in" },
                        { label: "lb/cu ft", value: "lb/cu ft" },
                        { label: "lb/cu yd", value: "lb/cu yd" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_length" className="label">
                  {data?.payload?.tech_lang_keys["length"]}
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
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_length_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_width" className="label">
                  {data?.payload?.tech_lang_keys["width"]}
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
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_width_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_depth" className="label">
                  {data?.payload?.tech_lang_keys["depth"]}
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
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_wastage" className="label">
                  {data?.payload?.tech_lang_keys["wastage"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_wastage"
                    id="tech_wastage"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_wastage}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_mass_price" className="label">
                  {data?.payload?.tech_lang_keys["mass_price"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_mass_price"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_mass_price}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_price_unit} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: currency.symbol + "/kg",
                          value: currency.symbol + "/kg",
                        },
                        {
                          label: currency.symbol + "/t",
                          value: currency.symbol + "/t",
                        },
                        {
                          label: currency.symbol + "/lb",
                          value: currency.symbol + "/lb",
                        },
                        {
                          label: currency.symbol + "/stone",
                          value: currency.symbol + "/stone",
                        },
                        {
                          label: currency.symbol + "/us_ton",
                          value: currency.symbol + "/us_ton",
                        },
                        {
                          label: currency.symbol + "/long_ton",
                          value: currency.symbol + "/long_ton",
                        },
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

                <input
                  type="hidden"
                  name="tech_currancy"
                  value={currency.symbol}
                  onChange={handleChange}
                />
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
                      <div className="w-full mt-4">
                        {/* Volume Section */}
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          <div className="col-span-12 md:col-span-4 lg:col-span-4">
                            <div className="bg-sky bordered p-3 rounded-lg">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["volume"]}
                                </strong>
                              </p>
                              <p className="text-25px mt-1">
                                <strong className="text-[#119154] text-[24px]">
                                  {result?.tech_volume}
                                </strong>
                                <span className="text-[23px]">m³</span>
                              </p>
                            </div>
                          </div>

                          {result?.tech_volume_units?.map((item, index) => {
                            const parts = item.split("@@@");
                            const isLast =
                              index === result.tech_volume_units.length - 1;
                            return (
                              <div
                                key={index}
                                className={`col-span-6 md:col-span-2 lg:col-span-2 ${
                                  !isLast ? "border-r" : ""
                                }`}
                              >
                                <p className="pb-1">
                                  <strong>{parts[0]}</strong>
                                </p>
                                <p>{parts[1]}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Weight Section */}
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          <div className="col-span-12 md:col-span-3 lg:col-span-4">
                            <div className="bg-sky bordered p-3 rounded-lg">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["weight"]}
                                </strong>
                              </p>
                              <p className="mt-1">
                                <strong className="text-[#119154] text-[24px]">
                                  {result?.tech_weight}
                                </strong>
                                <span className="text-[18px]">ton</span>
                              </p>
                            </div>
                          </div>

                          {result?.tech_weight_units?.map((item, index) => {
                            const parts = item.split("@@@");
                            const isLast =
                              index === result.tech_weight_units.length - 1;
                            return (
                              <div
                                key={index}
                                className={`col-span-6 md:col-span-2 lg:col-span-2 ${
                                  !isLast ? "border-r" : ""
                                }`}
                              >
                                <p className="pb-1">
                                  <strong>{parts[0]}</strong>
                                </p>
                                <p>{parts[1]}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Area Section */}
                        <div className="grid grid-cols-12 mt-3 gap-4">
                          <div className="col-span-12 md:col-span-3 lg:col-span-4">
                            <div className="bg-sky bordered p-3 rounded-lg">
                              <p className="text-[18px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["area"]}
                                </strong>
                              </p>
                              <p className="mt-1">
                                <strong className="text-[#119154] text-[24px]">
                                  {result?.tech_area}
                                </strong>
                                <span className="text-[18px]">m²</span>
                              </p>
                            </div>
                          </div>

                          {result?.tech_area_units?.map((item, index) => {
                            const parts = item.split("@@@");
                            const isLast =
                              index === result.tech_area_units.length - 1;
                            return (
                              <div
                                key={index}
                                className={`col-span-6 md:col-span-2 lg:col-span-2 ${
                                  !isLast ? "border-end" : ""
                                }`}
                              >
                                <p className="pb-1">
                                  <strong>{parts[0]}</strong>
                                </p>
                                <p>{parts[1]}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Volume Price Section */}
                        {result?.tech_price_v && (
                          <>
                            <div className="grid grid-cols-12 mt-3 gap-4">
                              <div className="col-span-12 md:col-span-3 lg:col-span-4">
                                <div className="bg-sky bordered rounded-lg p-2">
                                  <p className="text-[20px]">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["v_price"]}
                                    </strong>
                                  </p>
                                  <p className="mt-1">
                                    <strong className="text-[#119154] text-[24px]">
                                      {result?.tech_price_v}
                                    </strong>
                                    <span className="font-s-20">
                                      {currency.symbol}/m³
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {result?.tech_price_v_units?.map(
                                (item, index) => {
                                  const parts = item.split("@@@");
                                  const isLast =
                                    index ===
                                    result.tech_price_v_units.length - 1;
                                  return (
                                    <div
                                      key={index}
                                      className={`col-span-6 md:col-span-2 lg:col-span-2 ${
                                        !isLast ? "border-r" : ""
                                      }`}
                                    >
                                      <p className="pb-1">
                                        <strong>{parts[0]}</strong>
                                      </p>
                                      <p>{parts[1]}</p>
                                    </div>
                                  );
                                }
                              )}
                            </div>

                            <div className="col-lg-4 mt-4">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["cost"]}
                                </strong>
                              </p>
                              <p className="mt-1">
                                <strong className="text-[#119154] text-[25px]">
                                  {currency.symbol} {result?.tech_total_cost}
                                </strong>
                              </p>
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

export default RiverRockCalculator;
