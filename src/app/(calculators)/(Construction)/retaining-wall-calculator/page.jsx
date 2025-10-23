"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRetainingWallCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RetainingWallCalculator = () => {
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
    tech_wall_length: "7",
    tech_wall_length_unit: "yd",
    tech_wall_height: "12",
    tech_wall_height_unit: "yd",
    tech_block_height: "1",
    tech_block_height_unit: "in",
    tech_cap_height: "12",
    tech_cap_height_unit: "in",
    tech_block_length: "6",
    tech_block_length_unit: "ft",
    tech_cap_length: "12",
    tech_cap_length_unit: "in",
    tech_wall_block_price: "10",
    tech_cap_block_price: "5",
    tech_backfill_thickness: "30",
    tech_backfill_thickness_unit: "cm",
    tech_backfill_length: "10",
    tech_backfill_length_unit: "ft",
    tech_backfill_height: "10",
    tech_backfill_height_unit: "ft",
    tech_backfill_price: "10",
    tech_backfill_price_unit: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRetainingWallCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_wall_length ||
      !formData.tech_wall_length_unit ||
      !formData.tech_wall_height ||
      !formData.tech_wall_height_unit ||
      !formData.tech_block_height ||
      !formData.tech_block_height_unit ||
      !formData.tech_cap_height ||
      !formData.tech_cap_height_unit ||
      !formData.tech_block_length ||
      !formData.tech_block_length_unit ||
      !formData.tech_cap_length ||
      !formData.tech_cap_length_unit ||
      !formData.tech_wall_block_price ||
      !formData.tech_cap_block_price ||
      !formData.tech_backfill_thickness ||
      !formData.tech_backfill_thickness_unit ||
      !formData.tech_backfill_length ||
      !formData.tech_backfill_length_unit ||
      !formData.tech_backfill_height ||
      !formData.tech_backfill_height_unit ||
      !formData.tech_backfill_price ||
      !formData.tech_backfill_price_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_wall_length: formData.tech_wall_length,
        tech_wall_length_unit: formData.tech_wall_length_unit,
        tech_wall_height: formData.tech_wall_height,
        tech_wall_height_unit: formData.tech_wall_height_unit,
        tech_block_height: formData.tech_block_height,
        tech_block_height_unit: formData.tech_block_height_unit,
        tech_cap_height: formData.tech_cap_height,
        tech_cap_height_unit: formData.tech_cap_height_unit,
        tech_block_length: formData.tech_block_length,
        tech_block_length_unit: formData.tech_block_length_unit,
        tech_cap_length: formData.tech_cap_length,
        tech_cap_length_unit: formData.tech_cap_length_unit,
        tech_wall_block_price: formData.tech_wall_block_price,
        tech_cap_block_price: formData.tech_cap_block_price,
        tech_backfill_thickness: formData.tech_backfill_thickness,
        tech_backfill_thickness_unit: formData.tech_backfill_thickness_unit,
        tech_backfill_length: formData.tech_backfill_length,
        tech_backfill_length_unit: formData.tech_backfill_length_unit,
        tech_backfill_height: formData.tech_backfill_height,
        tech_backfill_height_unit: formData.tech_backfill_height_unit,
        tech_backfill_price: formData.tech_backfill_price,
        tech_backfill_price_unit: formData.tech_backfill_price_unit,
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
      tech_wall_length: "7",
      tech_wall_length_unit: "yd",
      tech_wall_height: "12",
      tech_wall_height_unit: "yd",
      tech_block_height: "1",
      tech_block_height_unit: "in",
      tech_cap_height: "12",
      tech_cap_height_unit: "in",
      tech_block_length: "6",
      tech_block_length_unit: "ft",
      tech_cap_length: "12",
      tech_cap_length_unit: "in",
      tech_wall_block_price: "10",
      tech_cap_block_price: "5",
      tech_backfill_thickness: "30",
      tech_backfill_thickness_unit: "cm",
      tech_backfill_length: "10",
      tech_backfill_length_unit: "ft",
      tech_backfill_height: "10",
      tech_backfill_height_unit: "ft",
      tech_backfill_price: "10",
      tech_backfill_price_unit: "deg",
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
    setFormData((prev) => ({ ...prev, tech_wall_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wall_height_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_block_height_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cap_height_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_block_length_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cap_length_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_backfill_thickness_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_backfill_length_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };
  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_backfill_height_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };
  //dropdown states
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_backfill_price_unit: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <p className="col-span-12 ">
                <strong>{data?.payload?.tech_lang_keys["1"]}</strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 wall_length ">
                <label htmlFor="tech_wall_length" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_wall_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_wall_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_wall_length_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 wall_height">
                <label htmlFor="tech_wall_height" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_wall_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_wall_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_wall_height_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 block_height">
                <p className="mb-2 text-[14px">
                  {data?.payload?.tech_lang_keys["4"]}
                </p>

                <label htmlFor="tech_block_height" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_block_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_block_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_block_height_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 cap_height">
                <p className="mb-2 text-[14px">
                  {data?.payload?.tech_lang_keys["6"]}
                </p>

                <label htmlFor="tech_cap_height" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_cap_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_cap_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_cap_height_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 block_length">
                <label htmlFor="tech_block_length" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_block_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_block_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_block_length_unit} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_cap_length" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_cap_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_cap_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown5}
                  >
                    {formData.tech_cap_length_unit} ▾
                  </label>
                  {dropdownVisible5 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_wall_block_price" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_wall_block_price"
                    id="tech_wall_block_price"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_wall_block_price}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 cost">
                <label htmlFor="tech_cap_block_price" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cap_block_price"
                    id="tech_cap_block_price"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_cap_block_price}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <p className="col-span-12 ">
                <strong>{data?.payload?.tech_lang_keys["8"]}</strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 cost conc_mix_one">
                <label htmlFor="tech_backfill_thickness" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_backfill_thickness"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_backfill_thickness}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown6}
                  >
                    {formData.tech_backfill_thickness_unit} ▾
                  </label>
                  {dropdownVisible6 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_backfill_length" className="label">
                  {data?.payload?.tech_lang_keys["10"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_backfill_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_backfill_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown7}
                  >
                    {formData.tech_backfill_length_unit} ▾
                  </label>
                  {dropdownVisible7 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                <label htmlFor="tech_backfill_height" className="label">
                  {data?.payload?.tech_lang_keys["11"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_backfill_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_backfill_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown8}
                  >
                    {formData.tech_backfill_height_unit} ▾
                  </label>
                  {dropdownVisible8 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "dm", value: "dm" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_backfill_price" className="label">
                  {data?.payload?.tech_lang_keys["12"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_backfill_price"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_backfill_price}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown9}
                  >
                    {formData.tech_backfill_price_unit} ▾
                  </label>
                  {dropdownVisible9 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "deg", value: "deg" },
                        { label: "lb", value: "lb" },
                        { label: "t", value: "t" },
                        { label: "oz", value: "oz" },
                        { label: "stone", value: "stone" },
                        { label: "Us ton", value: "Us ton" },
                        { label: "Long ton", value: "Long ton" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler9(unit.value)}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-1">
                        <div className="w-full md:w-[60%] lg:w-[60%]">
                          <table>
                            <tbody>
                              <tr>
                                <td colSpan="2" className="">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[13]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[14]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_blocks)}{" "}
                                  <span className="text-[14px">
                                    {data?.payload?.tech_lang_keys[15]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[16]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_caps)}{" "}
                                  <span className="text-[14px">
                                    {data?.payload?.tech_lang_keys[15]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[17]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_backfill_volume}{" "}
                                  <span className="text-[14px">
                                    {data?.payload?.tech_lang_keys[18]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[19]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_backfill_weight)}{" "}
                                  <span className="text-[14px">
                                    {data?.payload?.tech_lang_keys[20]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="2" className="pt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[21]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[22]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_blocks_price)}{" "}
                                  <span className="text-[14px">
                                    {data?.payload?.tech_lang_keys[23]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[24]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_caps_price)}{" "}
                                  <span className="text-[14px">
                                    {data?.payload?.tech_lang_keys[23]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[25]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_backfill_total_price)}{" "}
                                  <span className="text-[14px">
                                    {data?.payload?.tech_lang_keys[23]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[26]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_total_cost)}{" "}
                                  <span className="text-[14px">
                                    {data?.payload?.tech_lang_keys[23]}
                                  </span>
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

export default RetainingWallCalculator;
