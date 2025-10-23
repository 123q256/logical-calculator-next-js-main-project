"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDeckingCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DeckingCalculator = () => {
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
    tech_deck_length: "8",
    tech_deck_length_unit: "cm",
    tech_deck_width: "8",
    tech_deck_width_unit: "cm",
    tech_board_length: "8",
    tech_board_length_unit: "cm",
    tech_board_width: "1",
    tech_board_width_unit: "cm",
    tech_material: "screws",
    tech_price: "17",
    tech_Cost: "196",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDeckingCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_deck_length ||
      !formData.tech_deck_length_unit ||
      !formData.tech_deck_width ||
      !formData.tech_deck_width_unit ||
      !formData.tech_board_length ||
      !formData.tech_board_length_unit ||
      !formData.tech_board_width ||
      !formData.tech_board_width_unit ||
      !formData.tech_material ||
      !formData.tech_price ||
      !formData.tech_Cost
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_deck_length: formData.tech_deck_length,
        tech_deck_length_unit: formData.tech_deck_length_unit,
        tech_deck_width: formData.tech_deck_width,
        tech_deck_width_unit: formData.tech_deck_width_unit,
        tech_board_length: formData.tech_board_length,
        tech_board_length_unit: formData.tech_board_length_unit,
        tech_board_width: formData.tech_board_width,
        tech_board_width_unit: formData.tech_board_width_unit,
        tech_material: formData.tech_material,
        tech_price: formData.tech_price,
        tech_Cost: formData.tech_Cost,
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
      tech_deck_length: "8",
      tech_deck_length_unit: "cm",
      tech_deck_width: "8",
      tech_deck_width_unit: "cm",
      tech_board_length: "8",
      tech_board_length_unit: "cm",
      tech_board_width: "1",
      tech_board_width_unit: "cm",
      tech_material: "screws",
      tech_price: "17",
      tech_Cost: "196",
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
    setFormData((prev) => ({ ...prev, tech_deck_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_deck_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_board_length_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_board_width_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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
            <p className="col-span-12">
              <strong>{data?.payload?.tech_lang_keys["1"]}</strong>
            </p>
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_deck_length" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_deck_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_deck_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_deck_length_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
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
                <label htmlFor="tech_deck_width" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_deck_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_deck_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_deck_width_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
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
              <p className="col-span-12 mt-1">
                <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_board_length" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_board_length"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_board_length}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_board_length_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
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
                <label htmlFor="tech_board_width" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_board_width"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_board_width}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_board_width_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feet (ft)", value: "ft" },
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

              <p className="col-span-12 mt-1">
                <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
              </p>
              <div className="col-span-12  md:flex align-items-center mt-2 font-s-14">
                <p className="col-span-12 text-blue">
                  {data?.payload?.tech_lang_keys["6"]}:
                </p>

                <label className="pe-2" htmlFor="screws">
                  <input
                    type="radio"
                    name="tech_material"
                    value="screws"
                    id="screws"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_material === "screws"}
                  />
                  <span>{data?.payload?.tech_lang_keys["7"]}</span>
                </label>
                <label htmlFor="hidden">
                  <input
                    type="radio"
                    name="tech_material"
                    className="mr-2 border"
                    value="hidden"
                    id="hidden"
                    onChange={handleChange}
                    checked={formData.tech_material === "hidden"}
                  />
                  <span>{data?.payload?.tech_lang_keys["8"]}</span>
                </label>
              </div>
              <p className="col-span-12 mt-1">
                <strong>{data?.payload?.tech_lang_keys["9"]}</strong>
              </p>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_price"
                    id="tech_price"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_price}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_Cost" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_Cost"
                    id="tech_Cost"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_Cost}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mb-2">
                        <div className="w-full md:w-[100%] lg:w-[90%] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="50%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["12"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_size_deck}{" "}
                                  <span className="font-s-14">
                                    ft² ({data?.payload?.tech_lang_keys["14"]})
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="pt-3 pb-2" colSpan="2">
                                  {data?.payload?.tech_lang_keys["15"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">cm² :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_size_deck * 929).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">m² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_size_deck / 10.764
                                  ).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">In² :</td>
                                <td className="py-2">
                                  {Number(result?.tech_size_deck * 144).toFixed(
                                    4
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b pt-3 pb-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]} :
                                  </strong>
                                </td>
                                <td className="border-b pt-3 pb-2">
                                  {result?.tech_size_board}{" "}
                                  <span className="font-s-14">
                                    ft² ({data?.payload?.tech_lang_keys["14"]})
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="pt-3 pb-2" colSpan="2">
                                  {data?.payload?.tech_lang_keys["17"]}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">cm² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_size_board * 929
                                  ).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">m² :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_size_board / 10.764
                                  ).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">In² :</td>
                                <td className="py-2">
                                  {Number(
                                    result?.tech_size_board * 144
                                  ).toFixed(4)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b pb-2 pt-4">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]} :
                                  </strong>
                                </td>
                                <td className="border-b pb-2 pt-4">
                                  {result?.tech_numbers}{" "}
                                  <span className="font-s-14">
                                    {data?.payload?.tech_lang_keys["18"]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {formData?.tech_material === "hidden" ? (
                                    <>
                                      {Number(result?.tech_clips).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {Number(result?.tech_nails).toFixed(2)}{" "}
                                      <span className="font-s-14">
                                        {data?.payload?.tech_lang_keys["20"]}
                                      </span>
                                    </>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol} {result?.tech_price_boards}{" "}
                                  <span className="font-s-14">
                                    {data?.payload?.tech_lang_keys["21"]}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol} {result?.tech_Cost_boards}{" "}
                                  <span className="font-s-14">
                                    {data?.payload?.tech_lang_keys["22"]}
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

export default DeckingCalculator;
