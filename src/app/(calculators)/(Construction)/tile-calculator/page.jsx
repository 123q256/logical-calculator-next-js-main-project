"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTileCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TileCalculator = () => {
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
    tech_calculation_unit: "1",
    tech_total_area: "10",
    tech_total_area_unit: "cm",
    tech_area_length: "15",
    tech_area_length_unit: "cm",
    tech_area_width: "15",
    tech_area_width_unit: "cm",
    tech_tile_length: "15",
    tech_tile_length_unit: "m",
    tech_tile_width: "15",
    tech_tile_width_unit: "m",
    tech_gap_size: "15",
    tech_gap_size_unit: "m",
    tech_waste: "10",
    tech_price: "",
    tech_price_unit: "tile",
    tech_box_size: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTileCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculation_unit || !formData.tech_total_area) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculation_unit: formData.tech_calculation_unit,
        tech_total_area: formData.tech_total_area,
        tech_total_area_unit: formData.tech_total_area_unit,
        tech_area_length: formData.tech_area_length,
        tech_area_length_unit: formData.tech_area_length_unit,
        tech_area_width: formData.tech_area_width,
        tech_area_width_unit: formData.tech_area_width_unit,
        tech_tile_length: formData.tech_tile_length,
        tech_tile_length_unit: formData.tech_tile_length_unit,
        tech_tile_width: formData.tech_tile_width,
        tech_tile_width_unit: formData.tech_tile_width_unit,
        tech_gap_size: formData.tech_gap_size,
        tech_gap_size_unit: formData.tech_gap_size_unit,
        tech_waste: formData.tech_waste,
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
        tech_box_size: formData.tech_box_size,
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
      tech_calculation_unit: "1",
      tech_total_area: "10",
      tech_total_area_unit: "cm",
      tech_area_length: "15",
      tech_area_length_unit: "cm",
      tech_area_width: "15",
      tech_area_width_unit: "cm",
      tech_tile_length: "15",
      tech_tile_length_unit: "m",
      tech_tile_width: "15",
      tech_tile_width_unit: "m",
      tech_gap_size: "15",
      tech_gap_size_unit: "m",
      tech_waste: "10",
      tech_price: "",
      tech_price_unit: "tile",
      tech_box_size: "",
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
    setFormData((prev) => ({ ...prev, tech_total_area_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_length_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_width_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tile_length_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tile_width_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_gap_size_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_calculation_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculation_unit"
                    id="tech_calculation_unit"
                    value={formData.tech_calculation_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_calculation_unit == "2" && (
                <>
                  <div className="col-span-6 total_area">
                    <label htmlFor="tech_total_area" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_total_area"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_total_area}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_total_area_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sq ft", value: "sq ft" },
                            { label: "sq m", value: "sq m" },
                            { label: "sq yd", value: "sq yd" },
                            { label: "sq in", value: "sq in" },
                            { label: "sq cm", value: "sq cm" },
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
              {formData.tech_calculation_unit == "1" && (
                <>
                  <div className="col-span-6 area_length">
                    <label htmlFor="tech_area_length" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_area_length"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_area_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_area_length_unit} ▾
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
                  <div className="col-span-6 area_width">
                    <label htmlFor="tech_area_width" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_area_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_area_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_area_width_unit} ▾
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

              <div className="col-span-6 tile_length ">
                <label htmlFor="tech_tile_length" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_tile_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_tile_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_tile_length_unit} ▾
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
              <div className="col-span-6 tile_width">
                <label htmlFor="tech_tile_width" className="label">
                  {data?.payload?.tech_lang_keys["8"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_tile_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_tile_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_tile_width_unit} ▾
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
              <div className="col-span-6 gap_size ">
                <label htmlFor="tech_gap_size" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_gap_size"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_gap_size}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown5}
                  >
                    {formData.tech_gap_size_unit} ▾
                  </label>
                  {dropdownVisible5 && (
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
                          onClick={() => setUnitHandler5(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-6 waste ">
                <label htmlFor="tech_waste" className="label">
                  {data?.payload?.tech_lang_keys["10"]} (%):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_waste"
                    id="tech_waste"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_waste}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <p className="col-span-12">
                <strong>
                  {data?.payload?.tech_lang_keys["11"]} (
                  {data?.payload?.tech_lang_keys["12"]}):
                </strong>
              </p>

              <div className="lg:col-span-6 md:col-span-6 col-span-12 price ">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["13"]}
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
                    onClick={toggleDropdown6}
                  >
                    {formData.tech_price_unit} ▾
                  </label>
                  {dropdownVisible6 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: currency.symbol + " tile",
                          value: currency.symbol + " tile",
                        },
                        {
                          label: currency.symbol + " box",
                          value: currency.symbol + " box",
                        },
                        {
                          label: currency.symbol + " inch²",
                          value: currency.symbol + " inch²",
                        },
                        {
                          label: currency.symbol + " feet²",
                          value: currency.symbol + " feet²",
                        },
                        {
                          label: currency.symbol + " yard²",
                          value: currency.symbol + " yard²",
                        },
                        {
                          label: currency.symbol + " acre",
                          value: currency.symbol + " acre",
                        },
                        {
                          label: currency.symbol + " meter²",
                          value: currency.symbol + " meter²",
                        },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12 box_size">
                <label htmlFor="tech_box_size" className="label">
                  {data?.payload?.tech_lang_keys["14"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_box_size"
                    id="tech_box_size"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_box_size}
                    onChange={handleChange}
                  />
                  <span className="input_unit">Tiles Per Box</span>
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
                      <div className="w-full my-2">
                        <p className="text-[20px]">
                          <strong>{data?.payload?.tech_lang_keys[15]}</strong>
                        </p>
                        <div className="w-ful overflow-auto text-[16px] mt-3">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="50%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[16]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_formula?.toExponential(2)}{" "}
                                  <span>
                                    ({data?.payload?.tech_lang_keys[17]})
                                  </span>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[20]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_calculate_size?.toExponential(
                                    2
                                  )}{" "}
                                  <span>(ft²)</span>
                                </td>
                              </tr>

                              {result?.tech_calculate_box_size ? (
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[18]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_calculate_box_size?.toExponential(
                                      2
                                    )}
                                  </td>
                                </tr>
                              ) : null}

                              {result?.tech_price_per_tile ? (
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[19]} :
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol}{" "}
                                    {result?.tech_price_per_tile?.toExponential(
                                      2
                                    )}
                                  </td>
                                </tr>
                              ) : null}
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

export default TileCalculator;
