"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePlantSpacingCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PlantSpacingCalculator = () => {
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
    tech_bed: "grid",
    tech_grid: "square",
    tech_hedgerows: "3",
    tech_length: "24",
    tech_length_unit: "m",
    tech_width: "10",
    tech_width_unit: "m",
    tech_want: "amount",
    tech_border: "10",
    tech_border_unit: "m",
    tech_hedge: "10",
    tech_hedge_unit: "m",
    tech_plant_spacing: "10",
    tech_plant_spacing_unit: "m",
    tech_row_spacing: "10",
    tech_row_spacing_unit: "m",
    tech_total_plants: "50",
    tech_total_rows: "110",
    tech_no_of_plant: "5",
    tech_plant_price: "110",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePlantSpacingCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_bed || !formData.tech_grid) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_bed: formData.tech_bed,
        tech_grid: formData.tech_grid,
        tech_hedgerows: formData.tech_hedgerows,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_want: formData.tech_want,
        tech_border: formData.tech_border,
        tech_border_unit: formData.tech_border_unit,
        tech_hedge: formData.tech_hedge,
        tech_hedge_unit: formData.tech_hedge_unit,
        tech_plant_spacing: formData.tech_plant_spacing,
        tech_plant_spacing_unit: formData.tech_plant_spacing_unit,
        tech_row_spacing: formData.tech_row_spacing,
        tech_row_spacing_unit: formData.tech_row_spacing_unit,
        tech_total_plants: formData.tech_total_plants,
        tech_total_rows: formData.tech_total_rows,
        tech_no_of_plant: formData.tech_no_of_plant,
        tech_plant_price: formData.tech_plant_price,
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
      tech_bed: "grid",
      tech_grid: "square",
      tech_hedgerows: "3",
      tech_length: "24",
      tech_length_unit: "m",
      tech_width: "10",
      tech_width_unit: "m",
      tech_want: "amount",
      tech_border: "10",
      tech_border_unit: "m",
      tech_hedge: "10",
      tech_hedge_unit: "m",
      tech_plant_spacing: "10",
      tech_plant_spacing_unit: "m",
      tech_row_spacing: "10",
      tech_row_spacing_unit: "m",
      tech_total_plants: "50",
      tech_total_rows: "110",
      tech_no_of_plant: "5",
      tech_plant_price: "110",
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
    setFormData((prev) => ({ ...prev, tech_border_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hedge_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_plant_spacing_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_row_spacing_unit: unit }));
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12">
                <div className="grid grid-cols-12  mt-3  gap-4">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <div className="grid grid-cols-1  mt-3  gap-4">
                      <div className="col-span-12">
                        <label htmlFor="tech_bed" className="label">
                          {data?.payload?.tech_lang_keys["1"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_bed"
                            id="tech_bed"
                            value={formData.tech_bed}
                            onChange={handleChange}
                          >
                            <option value="grid">
                              {data?.payload?.tech_lang_keys["2"]}
                            </option>
                            <option value="hedgerow">
                              {data?.payload?.tech_lang_keys["3"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      {formData.tech_bed == "grid" && (
                        <>
                          <div className="col-span-12 ">
                            <label htmlFor="tech_grid" className="label">
                              {data?.payload?.tech_lang_keys["4"]}:
                            </label>
                            <div className="mt-2">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_grid"
                                id="tech_grid"
                                value={formData.tech_grid}
                                onChange={handleChange}
                              >
                                <option value="square">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </option>
                                <option value="rectangular">
                                  {data?.payload?.tech_lang_keys["6"]}
                                </option>
                                <option value="triangular">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_bed == "hedgerow" && (
                        <>
                          <div className="col-span-12 ">
                            <label htmlFor="tech_hedgerows" className="label">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </label>
                            <div className="mt-2">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_hedgerows"
                                id="tech_hedgerows"
                                value={formData.tech_hedgerows}
                                onChange={handleChange}
                              >
                                <option value="1">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </option>
                                <option value="2">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </option>
                                <option value="3">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </option>
                                <option value="4">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </option>
                                <option value="5">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    {formData.tech_bed == "grid" && (
                      <>
                        {formData.tech_grid == "square" ? (
                          <img
                            src="/images/plant-spacing-img/square.png"
                            alt="ShapeImage"
                            className="max-width my-lg-2 set_img"
                            width="300px"
                            height="220px"
                          />
                        ) : formData.tech_grid == "rectangular" ? (
                          <img
                            src="/images/plant-spacing-img/rectangle.png"
                            alt="Double Plant Spacing"
                            className="max-width my-lg-2 set_img"
                            width="300px"
                            height="220px"
                          />
                        ) : formData.tech_grid == "triangular" ? (
                          <img
                            src="/images/plant-spacing-img/triangle.png"
                            alt="Triple Plant Spacing"
                            className="max-width my-lg-2 set_img"
                            width="300px"
                            height="220px"
                          />
                        ) : null}
                      </>
                    )}
                    {formData.tech_bed == "hedgerow" && (
                      <>
                        {formData?.tech_hedgerows == "1" ? (
                          <img
                            src="/images/plant-spacing-img/single.png"
                            alt="Single Plant Spacing"
                            className="max-width my-lg-2 set_img"
                            width="300px"
                            height="220px"
                          />
                        ) : formData?.tech_hedgerows == "2" ? (
                          <img
                            src="/images/plant-spacing-img/double.png"
                            alt="Double Plant Spacing"
                            className="max-width my-lg-2 set_img"
                            width="300px"
                            height="220px"
                          />
                        ) : formData?.tech_hedgerows == "3" ? (
                          <img
                            src="/images/plant-spacing-img/triple.png"
                            alt="Triple Plant Spacing"
                            className="max-width my-lg-2 set_img"
                            width="300px"
                            height="220px"
                          />
                        ) : formData?.tech_hedgerows == "4" ? (
                          <img
                            src="/images/plant-spacing-img/four.png"
                            alt="Four Plant Spacing"
                            className="max-width my-lg-2 set_img"
                            width="300px"
                            height="220px"
                          />
                        ) : formData?.tech_hedgerows == "5" ? (
                          <img
                            src="/images/plant-spacing-img/five.png"
                            alt="Five Plant Spacing"
                            className="max-width my-lg-2 set_img"
                            width="300px"
                            height="220px"
                          />
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {formData.tech_bed == "grid" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 length">
                    <label htmlFor="tech_length" className="label">
                      {data?.payload?.tech_lang_keys["14"]}
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
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_length_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "miles (mi)", value: "mi" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 width ">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["15"]}
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
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_width_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "kilometers (km)", value: "km" },
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
                </>
              )}

              {formData.tech_grid == "rectangular" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 want ">
                    <label htmlFor="tech_want" className="label">
                      {data?.payload?.tech_lang_keys["16"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_want"
                        id="tech_want"
                        value={formData.tech_want}
                        onChange={handleChange}
                      >
                        <option value="amount">
                          {data?.payload?.tech_lang_keys["17"]}
                        </option>
                        <option value="arrange">
                          {data?.payload?.tech_lang_keys["18"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_bed == "grid" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 borderr ">
                    <label htmlFor="tech_border" className="label">
                      {data?.payload?.tech_lang_keys["19"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_border"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_border}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_border_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "kilometers (km)", value: "km" },
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
                </>
              )}

              {formData.tech_bed == "hedgerow" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 hedge ">
                    <label htmlFor="tech_hedge" className="label">
                      {data?.payload?.tech_lang_keys["20"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_hedge"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_hedge}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_hedge_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "kilometers (km)", value: "km" },
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
                </>
              )}

              {formData.tech_want == "amount" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 plant_spacing ">
                    <label htmlFor="tech_plant_spacing" className="label">
                      {data?.payload?.tech_lang_keys["21"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_plant_spacing"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_plant_spacing}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_plant_spacing_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "miles (mi)", value: "mi" },
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
              {formData.tech_grid == "rectangular" && (
                <>
                  {formData.tech_want == "amount" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 row_spacing ">
                        <label htmlFor="tech_row_spacing" className="label">
                          {data?.payload?.tech_lang_keys["22"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_row_spacing"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_row_spacing}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-3"
                            onClick={toggleDropdown5}
                          >
                            {formData.tech_row_spacing_unit} ▾
                          </label>
                          {dropdownVisible5 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "inches (in)", value: "in" },
                                { label: "feets (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
                                { label: "milimeters (mm)", value: "mm" },
                                { label: "kilometers (km)", value: "km" },
                                { label: "miles (mi)", value: "mi" },
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
                </>
              )}

              {formData.tech_want == "arrange" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 total_plants ">
                    <label htmlFor="tech_total_plants" className="label">
                      {data?.payload?.tech_lang_keys["23"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_total_plants"
                        id="tech_total_plants"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_total_plants}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 total_rows ">
                    <label htmlFor="tech_total_rows" className="label">
                      {data?.payload?.tech_lang_keys["24"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_total_rows"
                        id="tech_total_rows"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_total_rows}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <p className="col-span-12 ">
                {data?.payload?.tech_lang_keys["39"]}
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 no_of_plant ">
                <label htmlFor="tech_no_of_plant" className="label">
                  {data?.payload?.tech_lang_keys["40"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_no_of_plant"
                    id="tech_no_of_plant"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_no_of_plant}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 plant_price ">
                <label htmlFor="tech_plant_price" className="label">
                  {data?.payload?.tech_lang_keys["41"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_plant_price"
                    id="tech_plant_price"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_plant_price}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
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
                      <div className="w-full my-1">
                        {formData?.tech_bed === "grid" ? (
                          <>
                            {formData?.tech_grid === "square" ? (
                              <>
                                <div className="grid grid-cols-12 gap-4">
                                  <div className="flex col-span-12 border-b py-2 text-[18px]">
                                    <span>
                                      <strong>
                                        {data?.payload?.tech_lang_keys[25]} :
                                      </strong>
                                    </span>
                                    <span>{result?.tech_plants}</span>
                                  </div>
                                </div>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys[28]}{" "}
                                  {result?.tech_plant_cols} x{" "}
                                  {result?.tech_plant_rows}{" "}
                                  {data?.payload?.tech_lang_keys[29]}
                                </p>
                              </>
                            ) : formData?.tech_grid === "rectangular" ? (
                              formData?.tech_want === "amount" ? (
                                <>
                                  <div className="grid grid-cols-12 gap-4">
                                    <div className="flex col-span-12 border-b py-2 text-[18px]">
                                      <span>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[25]} :
                                        </strong>
                                      </span>
                                      <span>{result?.tech_plants}</span>
                                    </div>
                                  </div>
                                  <p className="mt-2">
                                    {data?.payload?.tech_lang_keys[30]}{" "}
                                    {result?.tech_plant_cols} x{" "}
                                    {result?.tech_plant_rows}{" "}
                                    {data?.payload?.tech_lang_keys[31]}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <div className="grid grid-cols-12 gap-4">
                                    <div className="flex col-span-6 border-b py-2 text-[18px]">
                                      <span>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[26]} :
                                        </strong>
                                      </span>
                                      <span>{result?.tech_cols}</span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-12 gap-4">
                                    <div className="flex col-span-6 border-b py-2 text-[18px]">
                                      <span>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[32]} :
                                        </strong>
                                      </span>
                                      <span>
                                        {result?.tech_row_space} <span>m</span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-12 gap-4">
                                    <div className="flex col-span-6 border-b py-2 text-[18px]">
                                      <span>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[27]} :
                                        </strong>
                                      </span>
                                      <span>
                                        {result?.tech_plant_spacing}{" "}
                                        <span>m</span>
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )
                            ) : formData?.tech_grid === "triangular" ? (
                              <>
                                <div className="grid grid-cols-12 gap-4">
                                  <div className="flex col-span-6 border-b py-2 text-[18px]">
                                    <span>
                                      <strong>
                                        {data?.payload?.tech_lang_keys[25]} :
                                      </strong>
                                    </span>
                                    <span>{result?.tech_total_plants}</span>
                                  </div>
                                </div>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys[33]}{" "}
                                  {result?.tech_total_rows}{" "}
                                  {data?.payload?.tech_lang_keys[34]}{" "}
                                  {result?.tech_row_spacing} m{" "}
                                  {data?.payload?.tech_lang_keys[35]}{" "}
                                  {result?.tech_plant_spacing_m} m{" "}
                                  {data?.payload?.tech_lang_keys[36]}{" "}
                                  {result?.tech_odd_num_plant}{" "}
                                  {data?.payload?.tech_lang_keys[37]}{" "}
                                  {result?.tech_evn_num_plant}{" "}
                                  {data?.payload?.tech_lang_keys[38]}
                                </p>
                              </>
                            ) : null}
                          </>
                        ) : (
                          <>
                            {formData?.tech_want === "amount" ? (
                              <div className="grid grid-cols-12 gap-4">
                                <div className="flex col-span-6 border-b py-2 text-[18px]">
                                  <span>
                                    <strong>
                                      {data?.payload?.tech_lang_keys[25]} :
                                    </strong>
                                  </span>
                                  <span>{result?.tech_total_plants}</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="grid grid-cols-12 gap-4">
                                  <div className="flex col-span-6 border-b py-2 text-[18px]">
                                    <span>
                                      <strong>
                                        {data?.payload?.tech_lang_keys[26]} :
                                      </strong>
                                    </span>
                                    <span>{result?.tech_plant_per_row}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-12 gap-4">
                                  <div className="flex col-span-6 border-b py-2 text-[18px]">
                                    <span>
                                      <strong>
                                        {data?.payload?.tech_lang_keys[27]} :
                                      </strong>
                                    </span>
                                    <span>
                                      {result?.tech_plant_space} <span>m</span>
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* Total Plant Cost */}
                        <div className="grid grid-cols-12 gap-4">
                          <div className="flex col-span-6 text-[18px] border-b py-2">
                            <span>
                              <strong>
                                {data?.payload?.tech_lang_keys[42]} :
                              </strong>
                            </span>
                            <span>
                              {currency.symbol} {result?.tech_total_plant_cost}
                            </span>
                          </div>
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

export default PlantSpacingCalculator;
