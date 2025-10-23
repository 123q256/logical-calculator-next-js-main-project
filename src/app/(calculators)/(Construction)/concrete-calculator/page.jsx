"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useConcreteCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ConcreteCalculator = () => {
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
    tech_operations: "3",
    tech_first: "15",
    tech_units1: "in",
    tech_second: "24",
    tech_units2: "in",
    tech_third: "24",
    tech_units3: "m",
    tech_four: "15",
    tech_units4: "ft",
    tech_price: "",
    tech_price_unit: "ft³",
    tech_quantity: "1",
    tech_five: "15",
    tech_units5: "ft",
    tech_fiveb: "15",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useConcreteCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations || !formData.tech_first) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_second: formData.tech_second,
        tech_units2: formData.tech_units2,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_four: formData.tech_four,
        tech_units4: formData.tech_units4,
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
        tech_quantity: formData.tech_quantity,
        tech_five: formData.tech_five,
        tech_units5: formData.tech_units5,
        tech_fiveb: formData.tech_fiveb,
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
      tech_operations: "3",
      tech_first: "15",
      tech_units1: "in",
      tech_second: "24",
      tech_units2: "in",
      tech_third: "24",
      tech_units3: "m",
      tech_four: "15",
      tech_units4: "ft",
      tech_price: "15",
      tech_price_unit: "ft³",
      tech_quantity: "1",
      tech_five: "15",
      tech_units5: "ft",
      tech_fiveb: "15",
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
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
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
    setFormData((prev) => ({ ...prev, tech_units4: unit }));
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
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-6 md:col-span-12">
                    <label htmlFor="tech_operations" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations"
                        id="tech_operations"
                        value={formData.tech_operations}
                        onChange={handleChange}
                      >
                        <option value="3">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["3"]}
                        </option>
                        <option value="5">
                          {data?.payload?.tech_lang_keys["4"]}
                        </option>
                        <option value="6">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value="7">
                          {data?.payload?.tech_lang_keys["6"]}
                        </option>
                        <option value="8">
                          {data?.payload?.tech_lang_keys["7"]}
                        </option>
                        <option value="9">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="10">
                          {data?.payload?.tech_lang_keys["9"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-12 first_v">
                    <label htmlFor="tech_first" className="label">
                      {(() => {
                        const op = formData?.tech_operations; // assuming 'operations' is part of your state/formData

                        if (op == "3" || op == "4" || op == "6") {
                          return data?.payload?.tech_lang_keys["10"];
                        } else if (op == "5" || op == "7" || op == "8") {
                          return data?.payload?.tech_lang_keys["28"];
                        } else if (op == "9") {
                          return data?.payload?.tech_lang_keys["29"];
                        } else {
                          return data?.payload?.tech_lang_keys["32"];
                        }
                      })()}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_first"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_units1} ▾
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
                  <div className="col-span-6 md:col-span-12 second">
                    <label htmlFor="tech_second" className="label">
                      {(() => {
                        const op = formData?.tech_operations; // assuming 'operations' is in your formData or state

                        if (op == "3" || op == "5" || op == "6" || op == "7") {
                          return data?.payload?.tech_lang_keys["11"];
                        } else if (op == "4" || op == "8") {
                          return data?.payload?.tech_lang_keys["27"];
                        } else if (op == "9") {
                          return data?.payload?.tech_lang_keys["30"];
                        } else {
                          return data?.payload?.tech_lang_keys["33"];
                        }
                      })()}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_second"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_second}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_units2} ▾
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
                  {(formData.tech_operations == "3" ||
                    formData.tech_operations == "5" ||
                    formData.tech_operations == "6" ||
                    formData.tech_operations == "7" ||
                    formData.tech_operations == "9" ||
                    formData.tech_operations == "10") && (
                    <>
                      <div className="col-span-6 md:col-span-12 third ">
                        <label htmlFor="tech_third" className="label">
                          {(() => {
                            const op = formData?.tech_operations; // assuming formData is your state holding the form values

                            if (
                              op === "3" ||
                              op === "5" ||
                              op === "6" ||
                              op === "7"
                            ) {
                              return data?.payload?.tech_lang_keys["12"];
                            } else if (op === "9") {
                              return data?.payload?.tech_lang_keys["31"];
                            } else {
                              return data?.payload?.tech_lang_keys["34"];
                            }
                          })()}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_third"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_third}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_units3} ▾
                          </label>
                          {dropdownVisible2 && (
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
                  {(formData.tech_operations == "9" ||
                    formData.tech_operations == "10") && (
                    <>
                      <div className="col-span-6 md:col-span-12 four ">
                        <label htmlFor="tech_four" className="label">
                          {formData?.operations == "9"
                            ? data?.payload?.tech_lang_keys["12"]
                            : data?.payload?.tech_lang_keys["13"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_four"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_four}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_units4} ▾
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
                  <div className="col-span-12 md:col-span-12 price ">
                    <label htmlFor="tech_price" className="label">
                      {data?.payload?.tech_lang_keys["17"]}
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
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_price_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "ft³", value: "ft³" },
                            { label: "yd³", value: "yd³" },
                            { label: "m³", value: "m³" },
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
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-12 quantity">
                    <label htmlFor="tech_quantity" className="label">
                      {data?.payload?.tech_lang_keys["16"]}:
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

                  {formData.tech_operations == "10" && (
                    <>
                      <div className="col-span-12 five ">
                        <label htmlFor="tech_five" className="label">
                          {formData?.operations === "9"
                            ? data?.payload?.tech_lang_keys["14"]
                            : data?.payload?.tech_lang_keys["11"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_five"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_five}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_units5} ▾
                          </label>
                          {dropdownVisible4 && (
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

                  {formData.tech_operations == "9" && (
                    <>
                      <div className="col-span-12 fiveb ">
                        <label htmlFor="tech_fiveb" className="label">
                          {data?.payload?.tech_lang_keys["15"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_fiveb"
                            id="tech_fiveb"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_fiveb}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-span-12">
                    {formData.tech_operations == "3" && (
                      <>
                        <img
                          src="/images/Square Slab.webp"
                          alt="ShapeImage"
                          className="max-width my-lg-2 imgset"
                          width="200px"
                          height="180px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "4" && (
                      <>
                        <img
                          src="/images/Round Slab.webp"
                          alt="ShapeImage"
                          className="max-width my-lg-2 imgset"
                          width="200px"
                          height="180px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "5" && (
                      <>
                        <img
                          src="/images/Wall.webp"
                          alt="ShapeImage"
                          className="max-width my-lg-2 imgset"
                          width="200px"
                          height="180px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "6" && (
                      <>
                        <img
                          src="/images/Footer.webp"
                          alt="ShapeImage"
                          className="max-width my-lg-2 imgset"
                          width="200px"
                          height="180px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "7" && (
                      <>
                        <img
                          src="/images/Square Column.webp"
                          alt="ShapeImage"
                          className="max-width my-lg-2 imgset"
                          width="200px"
                          height="180px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "8" && (
                      <>
                        <img
                          src="/images/Round Column.webp"
                          alt="ShapeImage"
                          className="max-width my-lg-2 imgset"
                          width="200px"
                          height="180px"
                        />
                      </>
                    )}
                    {formData.tech_operations == "9" && (
                      <>
                        <img
                          src="/images/Steps.webp"
                          alt="ShapeImage"
                          className="max-width my-lg-2 imgset"
                          width="200px"
                          height="180px"
                        />
                      </>
                    )}
                  </div>
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
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["18"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_feet} ft³
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["19"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_yard} yd³
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["20"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_cubic_meter} m³
                                </td>
                              </tr>

                              {formData?.tech_price_unit === "1" && price && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["21"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency?.symbol} {result?.tech_ft_price}
                                  </td>
                                </tr>
                              )}

                              {formData?.tech_price_unit === "2" && price && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["21"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency?.symbol} {result?.tech_yd_price}
                                  </td>
                                </tr>
                              )}

                              {formData?.tech_price_unit === "3" && price && (
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["21"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency?.symbol} {result?.tech_m_price}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <p className="mb-2 mt-3">
                          {data?.payload?.tech_lang_keys["22"]} 2,130 kg/m³{" "}
                          {data?.payload?.tech_lang_keys["23"]} 133 lbs/ft³
                        </p>

                        <div className="w-full md:w-[60%] lg:w-[60%] text-[18px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["24"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_lb} lbs or {result?.tech_kg} kgs
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {`${data?.payload?.tech_lang_keys["25"]} 40-lb ${data?.payload?.tech_lang_keys["26"]} :`}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_lb_40} bags
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {`${data?.payload?.tech_lang_keys["25"]} 60-lb ${data?.payload?.tech_lang_keys["26"]} :`}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_lb_60} bags
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {`${data?.payload?.tech_lang_keys["25"]} 80-lb ${data?.payload?.tech_lang_keys["26"]} :`}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_lb_80} bags
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {`${data?.payload?.tech_lang_keys["25"]} 40-kg ${data?.payload?.tech_lang_keys["26"]} :`}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_kg_40} bags
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {`${data?.payload?.tech_lang_keys["25"]} 60-kg ${data?.payload?.tech_lang_keys["26"]} :`}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_kg_60} bags
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {`${data?.payload?.tech_lang_keys["25"]} 80-kg ${data?.payload?.tech_lang_keys["26"]} :`}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_kg_80} bags
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

export default ConcreteCalculator;
