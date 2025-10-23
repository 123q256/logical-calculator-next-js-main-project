"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCubicFeetCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CubicFeetCalculator = (
  l,
  w,
  h,
  length,
  width,
  height,
  lengthUnit,
  widthUnit,
  heightUnit
) => {
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
    tech_room_unit: "2", // 1 2
    tech_area: "8",
    tech_area_unit: "ft",
    tech_length: "8",
    tech_length_unit: "cm",
    tech_width: "8",
    tech_width_unit: "cm",
    tech_height: "8",
    tech_height_unit: "cm",
    tech_weight: "8",
    tech_weight_unit: "lbs",
    tech_quantity: "1",
    tech_price: "8",
    tech_price_unit: "ft³",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCubicFeetCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_room_unit || !formData.tech_area) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_room_unit: formData.tech_room_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_quantity: formData.tech_quantity,
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
      tech_room_unit: "2", // 1 2
      tech_area: "8",
      tech_area_unit: "ft",
      tech_length: "8",
      tech_length_unit: "cm",
      tech_width: "8",
      tech_width_unit: "cm",
      tech_height: "8",
      tech_height_unit: "cm",
      tech_weight: "8",
      tech_weight_unit: "lbs",
      tech_quantity: "1",
      tech_price: "8",
      tech_price_unit: "ft³",
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
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
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
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
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

  // chart  shape

  const canvasRef = useRef(null);

  const Fraction2Decimal = (str) => {
    const [numerator, denominator] = str.split("/").map(Number);
    return numerator / denominator;
  };

  useEffect(() => {
    if (formData?.tech_room_unit === "1") {
      const c = canvasRef.current;
      if (!c) return;

      const ctx = c.getContext("2d");
      if (!ctx) return;

      if (window.screen.width <= 370) {
        c.width = window.screen.width - 20; // thoda margin bhi dedo
        c.height = 300;
      }

      let margin_x = 70,
        margin_y = 50,
        dm_x = margin_x * 2,
        dm_y = margin_y * 2;

      let w = c.width - dm_x,
        h = c.height - dm_y,
        offset_x = 35,
        offset_y = 35;

      let x = (c.width - w - offset_x) / 2;
      let y = (c.height - h - offset_y) / 2 + offset_y;

      let l2 = result?.tech_l;
      let w2 = result?.tech_w;
      let h2 = result?.tech_h;

      const re = /[1-9][0-9]*\/[1-9][0-9]*/;

      if (re.test(l2)) l2 = Fraction2Decimal(l2);
      if (re.test(w2)) w2 = Fraction2Decimal(w2);
      if (re.test(h2)) h2 = Fraction2Decimal(h2);

      let rate = 1;

      if (l2 && w2 && h2 && !isNaN(l2) && !isNaN(w2) && !isNaN(h2)) {
        rate = (c.height - dm_y) / h2;
        w = w2 * rate;
        h = h2 * rate;

        if (w > c.width - dm_x) {
          rate = (c.width - dm_x) / w;
          w = c.width - dm_x;
          h = h * rate;
        }

        offset_x = (l2 / h2) * h * 0.35;
        offset_y = offset_x;

        if (offset_y + h > c.height - dm_y) {
          rate = (c.height - dm_y) / (offset_y + h);
          w = w * rate;
          h = h * rate;
          offset_x = offset_x * rate;
          offset_y = offset_x;
        }

        x = (c.width - w - offset_x) / 2;
        y = (c.height - h - offset_y) / 2 + offset_y;
      }

      ctx.clearRect(0, 0, c.width, c.height);
      ctx.textAlign = "center";
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";

      ctx.rect(x, y, w, h);
      ctx.moveTo(x, y);
      ctx.lineTo(x + offset_x, y - offset_y);
      ctx.lineTo(x + w + offset_x, y - offset_y);
      ctx.lineTo(x + w + offset_x, y + h - offset_y);
      ctx.lineTo(x + w, y + h);
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w + offset_x, y - offset_y);
      ctx.stroke();

      ctx.font = "15px curly";
      ctx.fillStyle = "#000000";

      if (l2 > 0) {
        const txt = `${formData?.tech_length} ${formData?.tech_length_unit}`;
        ctx.fillText(
          txt,
          x + offset_x / 2 - ctx.measureText(txt).width / 2 - 4,
          y - offset_y / 2
        );
      }
      if (h2 > 0) {
        const txt = `${formData?.tech_height} ${formData?.tech_height_unit}`;
        ctx.fillText(txt, x - ctx.measureText(txt).width / 2 - 4, y + h / 2);
      }
      if (w2 > 0) {
        const txt = `${formData?.tech_width} ${formData?.tech_width_unit}`;
        ctx.fillText(txt, x + w / 2, y + h + 14);
      }
    }
  }, [
    formData?.tech_room_unit,
    result,
    formData?.tech_length,
    formData?.tech_width,
    formData?.tech_height,
    formData?.tech_length_unit,
    formData?.tech_width_unit,
    formData?.tech_height_unit,
  ]);

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  lg:gap-4 md:gap-4 gap-4">
              <div className="space-y-2 room_unit ">
                <label htmlFor="tech_room_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-1">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_room_unit"
                    id="tech_room_unit"
                    value={formData.tech_room_unit}
                    onChange={handleChange}
                  >
                    <option value="1">Length & Width & Height</option>
                    <option value="2">Area & Height</option>
                  </select>
                </div>
              </div>
              {formData.tech_room_unit == "2" && (
                <>
                  <div className="space-y-2 area ">
                    <label htmlFor="tech_area" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_area"
                        step="any"
                        className="mt-0 input"
                        value={formData.tech_area}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_area_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sq in", value: "in" },
                            { label: "sq ft", value: "ft" },
                            { label: "sq yd", value: "yd" },
                            { label: "sq cm", value: "cm" },
                            { label: "sq m", value: "m" },
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
              {formData.tech_room_unit == "1" && (
                <>
                  <div className="space-y-2  length">
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
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_length_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "nmi", value: "nmi" },
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
              {formData.tech_room_unit == "1" && (
                <>
                  <div className="space-y-2  width ">
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
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_width_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "nmi", value: "nmi" },
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

              <div className="space-y-2  height">
                <label htmlFor="tech_height" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_height_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "mm", value: "mm" },
                        { label: "cm", value: "cm" },
                        { label: "m", value: "m" },
                        { label: "km", value: "km" },
                        { label: "in", value: "in" },
                        { label: "ft", value: "ft" },
                        { label: "yd", value: "yd" },
                        { label: "mi", value: "mi" },
                        { label: "nmi", value: "nmi" },
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
              {formData.tech_room_unit == "1" && (
                <>
                  <div className="space-y-2  weight ">
                    <label htmlFor="tech_weight" className="label">
                      {data?.payload?.tech_lang_keys["9"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_weight"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_weight}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_weight_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "lbs", value: "lbs" },
                            { label: "kg", value: "kg" },
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

              <div className="space-y-2 quantity">
                <label htmlFor="tech_quantity" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
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
              <div className="space-y-2  cost">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["8"]}
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
                        {
                          label: currency.symbol + " ft³",
                          value: currency.symbol + " ft³",
                        },
                        {
                          label: currency.symbol + " yd³",
                          value: currency.symbol + " yd³",
                        },
                        {
                          label: currency.symbol + "m³",
                          value: currency.symbol + " m³",
                        },
                        {
                          label: currency.symbol + " cm³",
                          value: currency.symbol + " cm³",
                        },
                        {
                          label: currency.symbol + " in³",
                          value: currency.symbol + " in³",
                        },
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
                        <div className="w-full md:w-[90%] lg:w-[50%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["11"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume).toFixed(2)} ft³
                                </td>
                              </tr>
                              {!formData?.tech_price && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol}{" "}
                                      {Number(result?.tech_estimated_price)}
                                    </td>
                                  </tr>
                                </>
                              )}
                              <tr>
                                <td colSpan="2" className="pt-3 pb-1">
                                  {data?.payload?.tech_lang_keys["12"]}
                                  {data?.payload?.tech_lang_keys["17"]}
                                </td>
                              </tr>

                              {formData?.tech_room_unit === "1" ? (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]} in³
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_cubic_inches
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]} cm³
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_cubic_centimeters
                                      ).toFixed(5)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]} m³ :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_cubic_meter).toFixed(
                                        5
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]}{" "}
                                      yards³ :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_cubic_yards).toFixed(
                                        5
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["14"]}{" "}
                                      Wt.kg :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_volumetric_weight}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["15"]}{" "}
                                      Wt.lbs :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_volumetric_weight2}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["16"]} lbs
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_weight}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["16"]} kg :
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_weight_convert}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">20 FT :</td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_twenty_ft)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">40 FT :</td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_fourty_ft)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">40 HC :</td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_fourty_high_cube)}
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]} in³
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_cubic_inches
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]} cm³
                                      :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_cubic_centimeters
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]} m³ :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_cubic_meter).toFixed(
                                        5
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["13"]}{" "}
                                      yards³ :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_cubic_yards).toFixed(
                                        5
                                      )}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {formData?.tech_room_unit === "1" ? (
                          <>
                            <div className="mt-3">
                              <p className="font-s-20">
                                <strong>
                                  {data?.payload?.tech_lang_keys["18"]}
                                </strong>
                              </p>
                              <p className="mt-2 font-s-18">
                                <b>{data?.payload?.tech_lang_keys["20"]}:</b>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {data?.payload?.tech_lang_keys["5"]} (ft) ×{" "}
                                {data?.payload?.tech_lang_keys["6"]} (ft) ×{" "}
                                {data?.payload?.tech_lang_keys["7"]} (ft)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["21"]}
                              </p>
                              <p className="mt-2">
                                {formData?.tech_length} (
                                {formData?.tech_length_unit}) ={" "}
                                {Number(result?.tech_l).toFixed(4)} (ft)
                              </p>
                              <p className="mt-2">
                                {formData?.tech_width} (
                                {formData?.tech_width_unit}) ={" "}
                                {Number(result?.tech_w).toFixed(4)} (ft)
                              </p>
                              <p className="mt-2">
                                {formData?.tech_height} (
                                {formData?.tech_height_unit}) ={" "}
                                {Number(result?.tech_h).toFixed(4)} (ft)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["22"]}:
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {Number(result?.tech_l).toFixed(4)} (ft) ×{" "}
                                {Number(result?.tech_w).toFixed(4)} (ft) ×{" "}
                                {Number(result?.tech_h).toFixed(4)} (ft)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {Number(result?.tech_volume).toFixed(2)} (ft³)
                              </p>
                              <p className="mt-2 font-s-18">
                                <b>Cube Shape:</b>
                              </p>
                              <div className="mt-5 flex justify-center">
                                <canvas
                                  ref={canvasRef}
                                  id="myCanvas"
                                  width="400"
                                  height="300"
                                  style={{ border: "1px solid #ccc" }}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mt-3">
                              <p className="font-s-20">
                                <strong>
                                  {data?.payload?.tech_lang_keys["18"]}
                                </strong>
                              </p>
                              <p className="mt-2 font-s-18">
                                <b>{data?.payload?.tech_lang_keys["20"]}:</b>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {data?.payload?.tech_lang_keys["4"]} (ft) ×{" "}
                                {data?.payload?.tech_lang_keys["7"]} (ft)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["21"]}
                              </p>
                              <p className="mt-2">
                                {formData?.tech_area} (
                                {formData?.tech_area_unit}) ={" "}
                                {Number(result?.tech_convert13).toFixed(4)} (ft)
                              </p>
                              <p className="mt-2">
                                {formData?.tech_height} (
                                {formData?.tech_height_unit}) ={" "}
                                {Number(result?.tech_h1).toFixed(4)} (ft)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["22"]}:
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {Number(result?.tech_convert13).toFixed(4)} (ft)
                                × {Number(result?.tech_h1).toFixed(4)} (ft)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]} ={" "}
                                {Number(result?.tech_volume).toFixed(4)} (ft³)
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

export default CubicFeetCalculator;
