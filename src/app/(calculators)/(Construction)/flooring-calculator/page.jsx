"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFlooringCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FlooringCalculator = () => {
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
    tech_room_length: ["22", "1", "13"],
    tech_room_length_unit: ["cm", "cm", "cm"],
    tech_room_width: ["13", "2", "4"],
    tech_room_width_unit: ["cm", "cm", "cm"],
    tech_cost: "",
    tech_currancy: "$",
    tech_cost_unit: "m²",
    tech_waste_factor: "",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFlooringCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //       setResult(null);
  //   setFormError(null);
  // };

  const handleSingleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes to length or width values
  const handleChange = (type, index, value) => {
    setFormData((prevData) => {
      const updated = [...prevData[type]];
      updated[index] = value;
      return { ...prevData, [type]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_room_length) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_room_length: formData.tech_room_length,
        tech_room_length_unit: formData.tech_room_length_unit,
        tech_room_width: formData.tech_room_width,
        tech_room_width_unit: formData.tech_room_width_unit,
        tech_cost: formData.tech_cost,
        tech_currancy: formData.tech_currancy,
        tech_cost_unit: formData.tech_cost_unit,
        tech_waste_factor: formData.tech_waste_factor,
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
      tech_room_length: ["22", "1", "13"],
      tech_room_length_unit: ["cm", "cm", "cm"],
      tech_room_width: ["13", "2", "4"],
      tech_room_width_unit: ["cm", "cm", "cm"],
      tech_cost: "",
      tech_currancy: "$",
      tech_cost_unit: "m²",
      tech_waste_factor: "",
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
  const [dropdownVisible0, setDropdownVisible0] = useState(false);

  const setUnitHandler0 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cost_unit: unit }));
    setDropdownVisible0(false);
  };

  const toggleDropdown0 = () => {
    setDropdownVisible0(!dropdownVisible0);
  };

  const [dropdownVisible, setDropdownVisible] = useState({});
  // Set unit from dropdown
  const setUnitHandler = (type, index, unit) => {
    setFormData((prev) => {
      const updated = [...prev[type]];
      updated[index] = unit;
      return { ...prev, [type]: updated };
    });
    setDropdownVisible((prev) => ({ ...prev, [`${type}-${index}`]: false }));
  };

  // Toggle dropdown visibility
  const toggleDropdown = (type, index) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [`${type}-${index}`]: !prev[`${type}-${index}`],
    }));
  };

  // Add new field group
  const addField = () => {
    setFormData((prev) => ({
      ...prev,
      tech_room_length: [...prev.tech_room_length, ""],
      tech_room_length_unit: [...prev.tech_room_length_unit, "cm"],
      tech_room_width: [...prev.tech_room_width, ""],
      tech_room_width_unit: [...prev.tech_room_width_unit, "cm"],
    }));
  };

  // Remove field group by index
  const removeField = (index) => {
    setFormData((prev) => ({
      ...prev,
      tech_room_length: prev.tech_room_length.filter((_, i) => i !== index),
      tech_room_length_unit: prev.tech_room_length_unit.filter(
        (_, i) => i !== index
      ),
      tech_room_width: prev.tech_room_width.filter((_, i) => i !== index),
      tech_room_width_unit: prev.tech_room_width_unit.filter(
        (_, i) => i !== index
      ),
    }));
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
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12">
                {formData.tech_room_length.map((_, index) => (
                  <div className="grid grid-cols-12 gap-4 mb-4" key={index}>
                    {/* Length */}
                    <div className="col-span-6">
                      <label className="label">
                        {data?.payload?.tech_lang_keys["1"]}
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="number"
                          className="input w-full"
                          value={formData.tech_room_length[index]}
                          onChange={(e) =>
                            handleChange(
                              "tech_room_length",
                              index,
                              e.target.value
                            )
                          }
                          placeholder="00"
                        />
                        <label
                          className="absolute right-6 top-3 cursor-pointer underline text-sm"
                          onClick={() =>
                            toggleDropdown("tech_room_length_unit", index)
                          }
                        >
                          {formData.tech_room_length_unit[index]} ▾
                        </label>
                        {dropdownVisible[`tech_room_length_unit-${index}`] && (
                          <div className="absolute z-10 bg-white border rounded-md right-0 mt-1">
                            {["cm", "m", "in", "ft"].map((unit) => (
                              <p
                                key={unit}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  setUnitHandler(
                                    "tech_room_length_unit",
                                    index,
                                    unit
                                  )
                                }
                              >
                                {unit}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Width */}
                    <div className="col-span-6">
                      <div className="col-span-12 flex justify-between">
                        <label className="label">
                          {data?.payload?.tech_lang_keys["2"]}
                        </label>
                        {/* Remove Button */}
                        {formData.tech_room_length.length > 1 && (
                          <div className="col-span-1 flex items-center cursor-pointer">
                            <a onClick={() => removeField(index)}>🗑</a>
                          </div>
                        )}
                      </div>

                      <div className="relative mt-2">
                        <input
                          type="number"
                          className="input w-full"
                          value={formData.tech_room_width[index]}
                          onChange={(e) =>
                            handleChange(
                              "tech_room_width",
                              index,
                              e.target.value
                            )
                          }
                          placeholder="00"
                        />
                        <label
                          className="absolute right-6 top-3 cursor-pointer underline text-sm"
                          onClick={() =>
                            toggleDropdown("tech_room_width_unit", index)
                          }
                        >
                          {formData.tech_room_width_unit[index]} ▾
                        </label>
                        {dropdownVisible[`tech_room_width_unit-${index}`] && (
                          <div className="absolute z-10 bg-white border rounded-md right-0 mt-1">
                            {["cm", "m", "in", "ft"].map((unit) => (
                              <p
                                key={unit}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  setUnitHandler(
                                    "tech_room_width_unit",
                                    index,
                                    unit
                                  )
                                }
                              >
                                {unit}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add Button */}
                <div className="col-span-12 my-2">
                  <span
                    title="Add More Fields"
                    className="p-2 bg-[#2845F5] text-white cursor-pointer rounded inline-block"
                    onClick={addField}
                  >
                    <b>
                      <span>+</span> {data?.payload?.tech_lang_keys["3"]}
                    </b>
                  </span>
                </div>
              </div>
              <p className="col-span-12">
                {data?.payload?.tech_lang_keys["4"]} (Optional):
              </p>
              <div className="col-span-6">
                <label htmlFor="tech_cost" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_cost"
                    step="any"
                    className="mt-2 input"
                    value={formData.tech_cost}
                    placeholder="00"
                    onChange={handleSingleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown0}
                  >
                    {formData.tech_cost_unit} ▾
                  </label>
                  {dropdownVisible0 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: currency.symbol + " m²",
                          value: currency.symbol + " m²",
                        },
                        {
                          label: currency.symbol + " ft²",
                          value: currency.symbol + " ft²",
                        },
                        {
                          label: currency.symbol + " yd²",
                          value: currency.symbol + " yd²",
                        },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler0(unit.value)}
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
                  className="input my-2"
                  value={currency.symbol}
                  onChange={handleSingleChange}
                />
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_waste_factor" className="label">
                  {data?.payload?.tech_lang_keys["6"]} %:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_waste_factor"
                    id="tech_waste_factor"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_waste_factor}
                    onChange={handleSingleChange}
                  />
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
                      <div className="w-full justify-content-between">
                        <div className="grid grid-cols-12 gap-2 my-1">
                          <div className="col-span-12 md:col-span-6 overflow-auto text-[16px]">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["7"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_area} (m<sup>2</sup>)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_total_material} (m<sup>2</sup>
                                    )
                                  </td>
                                </tr>
                                {formData?.tech_cost && (
                                  <>
                                    <tr>
                                      <td className="border-b py-2">
                                        <strong>
                                          {data?.payload?.tech_lang_keys["9"]} :
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
                            <p className="mt-2 mb-1">
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]}
                              </strong>
                            </p>
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b py-1">
                                    {data?.payload?.tech_lang_keys["7"]} :
                                  </td>
                                  <td className="border-b">
                                    {Number(result?.tech_area * 10.764).toFixed(
                                      4
                                    )}{" "}
                                    square feet (ft<sup>2</sup>)
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-1">
                                    {data?.payload?.tech_lang_keys["7"]} :
                                  </td>
                                  <td className="border-b">
                                    {Number(result?.tech_area * 1.196).toFixed(
                                      4
                                    )}{" "}
                                    square yards (yd<sup>2</sup>)
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

export default FlooringCalculator;
