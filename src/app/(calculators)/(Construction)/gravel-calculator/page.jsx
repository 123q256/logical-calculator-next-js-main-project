"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGravelCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GravelCalculator = () => {
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
    tech_from: "rec", //  cic rec
    tech_to_calculate: "1",
    tech_length: "24",
    tech_l_unit: "m",
    tech_width: "10",
    tech_w_unit: "m",
    tech_area: "15",
    tech_a_unit: "m²",
    tech_depth: "15",
    tech_d_unit: "cm",
    tech_volume: "15",
    tech_v_unit: "m²",
    tech_density: "104.88",
    tech_dn_unit: "lb/ft³",
    tech_diameter: "15",
    tech_dia_unit: "m",
    tech_price: "23",
    tech_p_unit: "lbs",
    tech_currancy: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGravelCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_from == "rec") {
      if (formData.tech_to_calculate == 1) {
        if (
          !formData.tech_to_calculate ||
          !formData.tech_length ||
          !formData.tech_l_unit ||
          !formData.tech_width ||
          !formData.tech_w_unit ||
          !formData.tech_depth ||
          !formData.tech_d_unit ||
          !formData.tech_density ||
          !formData.tech_dn_unit
        ) {
          setFormError("Please fill in field");
          return;
        }
      } else if (formData.tech_to_calculate == 2) {
        if (
          !formData.tech_to_calculate ||
          !formData.tech_area ||
          !formData.tech_a_unit ||
          !formData.tech_depth ||
          !formData.tech_d_unit ||
          !formData.tech_price ||
          !formData.tech_p_unit ||
          !formData.tech_density ||
          !formData.tech_dn_unit
        ) {
          setFormError("Please fill in field");
          return;
        }
      } else {
        if (
          !formData.tech_to_calculate ||
          !formData.tech_volume ||
          !formData.tech_v_unit ||
          !formData.tech_price ||
          !formData.tech_p_unit ||
          !formData.tech_density ||
          !formData.tech_dn_unit
        ) {
          setFormError("Please fill in field");
          return;
        }
      }
    } else {
      if (
        !formData.tech_from ||
        !formData.tech_depth ||
        !formData.tech_d_unit ||
        !formData.tech_density ||
        !formData.tech_dn_unit ||
        !formData.tech_diameter ||
        !formData.tech_dia_unit ||
        !formData.tech_price ||
        !formData.tech_p_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_from: formData.tech_from,
        tech_to_calculate: formData.tech_to_calculate,
        tech_length: formData.tech_length,
        tech_l_unit: formData.tech_l_unit,
        tech_width: formData.tech_width,
        tech_w_unit: formData.tech_w_unit,
        tech_area: formData.tech_area,
        tech_a_unit: formData.tech_a_unit,
        tech_depth: formData.tech_depth,
        tech_d_unit: formData.tech_d_unit,
        tech_volume: formData.tech_volume,
        tech_v_unit: formData.tech_v_unit,
        tech_density: formData.tech_density,
        tech_dn_unit: formData.tech_dn_unit,
        tech_diameter: formData.tech_diameter,
        tech_dia_unit: formData.tech_dia_unit,
        tech_price: formData.tech_price,
        tech_p_unit: formData.tech_p_unit,
        tech_currancy: formData.tech_currancy,
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
      tech_from: "rec", //  cic rec
      tech_to_calculate: "1",
      tech_length: "24",
      tech_l_unit: "m",
      tech_width: "10",
      tech_w_unit: "m",
      tech_area: "15",
      tech_a_unit: "m²",
      tech_depth: "15",
      tech_d_unit: "cm",
      tech_volume: "15",
      tech_v_unit: "m²",
      tech_density: "104.88",
      tech_dn_unit: "lb/ft³",
      tech_diameter: "15",
      tech_dia_unit: "m",
      tech_price: "23",
      tech_p_unit: "lbs",
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
    setFormData((prev) => ({ ...prev, tech_l_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_w_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_d_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dn_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dia_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units7: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
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
            <div className="grid grid-cols-12 mt-3 gap-4">
              <div className="col-span-12 md:col-span-4">
                <span>{data?.payload?.tech_lang_keys["fill"]}</span>
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="pe-2" htmlFor="rec">
                  <input
                    type="radio"
                    name="tech_from"
                    value="rec"
                    id="rec"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_from === "rec"}
                  />
                  <span>{data?.payload?.tech_lang_keys["ract"]}</span>
                </label>
              </div>
              <div className="col-span-6 md:col-span-4">
                <label htmlFor="cic">
                  <input
                    type="radio"
                    name="tech_from"
                    className="mr-2 border"
                    value="cic"
                    id="cic"
                    onChange={handleChange}
                    checked={formData.tech_from === "cic"}
                  />
                  <span>{data?.payload?.tech_lang_keys["circ"]}</span>
                </label>
              </div>
            </div>
            {formData.tech_from === "rec" && (
              <>
                <div className="grid grid-cols-12 mt-5 gap-4">
                  <div className="col-span-12 to_calculate ">
                    <label htmlFor="tech_to_calculate" className="label">
                      {data?.payload?.tech_lang_keys["to_cal"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_to_calculate"
                        id="tech_to_calculate"
                        value={formData.tech_to_calculate}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["length"]}{" "}
                          {data?.payload?.tech_lang_keys["area"]}{" "}
                          {data?.payload?.tech_lang_keys["volume"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["length"]} &{" "}
                          {data?.payload?.tech_lang_keys["area"]}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["volume"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 mt-3 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="col-lg-6 pe-lg-3">
                {formData.tech_from === "rec" &&
                  formData.tech_to_calculate === "1" && (
                    <>
                      <div className="space-y-2 length ">
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
                            onClick={toggleDropdown}
                          >
                            {formData.tech_l_unit} ▾
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

                {formData.tech_from === "rec" &&
                  formData.tech_to_calculate === "1" && (
                    <>
                      <div className="space-y-2 width ">
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
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_w_unit} ▾
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
                {formData.tech_from === "rec" && (
                  <>
                    {formData.tech_to_calculate === "2" && (
                      <>
                        <div className="space-y-2 area ">
                          <label htmlFor="tech_area" className="label">
                            {data?.payload?.tech_lang_keys["area"]}
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
                              {formData.tech_a_unit} ▾
                            </label>
                            {dropdownVisible2 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "m²", value: "m²" },
                                  { label: "yd²", value: "yd²" },
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
                  </>
                )}
                {((formData.tech_from === "rec" &&
                  (formData.tech_to_calculate === "2" ||
                    formData.tech_to_calculate === "1")) ||
                  formData.tech_from === "cic") && (
                  <>
                    <div className="space-y-2 mt-3 depth">
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
                          {formData.tech_d_unit} ▾
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
                {formData.tech_from === "rec" &&
                  formData.tech_to_calculate === "3" && (
                    <>
                      <div className="space-y-2 mt-3  volume ">
                        <label htmlFor="tech_volume" className="label">
                          {data?.payload?.tech_lang_keys["volume"]}
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
                            {formData.tech_v_unit} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "m²", value: "m²" },
                                { label: "yd²", value: "yd²" },
                                { label: "ft²", value: "ft²" },
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

                <div className="space-y-2 mt-3 density ">
                  <label htmlFor="tech_density" className="label">
                    {data?.payload?.tech_lang_keys["den"]}
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
                      {formData.tech_dn_unit} ▾
                    </label>
                    {dropdownVisible5 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "lb/ft³", value: "lb/ft³" },
                          { label: "lb/yd³", value: "lb/yd³" },
                          { label: "t/yd³", value: "t/yd³" },
                          { label: "kg/m³", value: "kg/m³" },
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

                {formData.tech_from === "cic" && (
                  <>
                    <div className="space-y-2 mt-3 diameter  ">
                      <label htmlFor="tech_diameter" className="label">
                        {data?.payload?.tech_lang_keys["dia"]}
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
                          onClick={toggleDropdown6}
                        >
                          {formData.tech_dia_unit} ▾
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

                <div className="space-y-2 mt-3 cost ">
                  <label htmlFor="tech_price" className="label">
                    {data?.payload?.tech_lang_keys["price"]}
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
                      onClick={toggleDropdown7}
                    >
                      {formData.tech_p_unit} ▾
                    </label>
                    {dropdownVisible7 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          {
                            label: currency.symbol + " kg",
                            value: currency.symbol + " kg",
                          },
                          {
                            label: currency.symbol + " t",
                            value: currency.symbol + " t",
                          },
                          {
                            label: currency.symbol + " lbs",
                            value: currency.symbol + " lbs",
                          },
                          {
                            label: currency.symbol + " g",
                            value: currency.symbol + " g",
                          },
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
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full pl-3 flex items-center">
                  {formData.tech_from === "rec" && (
                    <>
                      <img
                        src="/images/react.webp"
                        alt="Ractangular"
                        className="setImage max-w-full"
                        width="280px"
                        height="auto"
                      />
                    </>
                  )}
                  {formData.tech_from === "cic" && (
                    <>
                      <img
                        src="/images/circle.webp"
                        alt="Ractangular"
                        className="setImage max-w-full"
                        width="280px"
                        height="auto"
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
                      <div className="grid grid-cols-12">
                        <div className="col-span-12 md:col-span-8 lg:text-[16px] md:text-[16px] text-[14px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="50%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["vol_n"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume / 27).toFixed(3)}{" "}
                                  cu³ ({result?.tech_volume} ft³)
                                </td>
                              </tr>
                              <tr className="grey lighten-5 border_1px">
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["we_n"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_weight / 2000).toFixed(
                                    3
                                  )}{" "}
                                  tons ({result?.tech_weight} lbs)
                                </td>
                              </tr>
                              {result?.tech_price && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["cost"]}{" "}
                                        :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol} {result?.tech_price}
                                    </td>
                                  </tr>
                                </>
                              )}
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

export default GravelCalculator;
