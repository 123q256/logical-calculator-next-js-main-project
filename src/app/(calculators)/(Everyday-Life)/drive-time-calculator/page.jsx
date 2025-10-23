"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDriveTimeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DrivingTimeCalculator = () => {
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

  const getDefaultDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    tech_distance: "800",
    tech_distance_unit: "km",
    tech_average_speed: "800",
    tech_average_speed_unit: "km/h",
    tech_breaks: "800",
    tech_breaks_unit: "sec",
    tech_departure_time: getDefaultDateTime(), // 👈 set default here
    tech_fuel_e: "800",
    tech_fuel_e_unit: "L/100km",
    tech_fuel_p: "1.22",
    tech_fuel_p_unit: "/L",
    tech_passengers: "1",
    tech_currancy: "$",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDriveTimeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_distance ||
      !formData.tech_distance_unit ||
      !formData.tech_average_speed ||
      !formData.tech_average_speed_unit ||
      !formData.tech_breaks ||
      !formData.tech_breaks_unit ||
      !formData.tech_departure_time ||
      !formData.tech_fuel_e ||
      !formData.tech_fuel_e_unit ||
      !formData.tech_fuel_p ||
      !formData.tech_fuel_p_unit ||
      !formData.tech_passengers
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_distance: formData.tech_distance,
        tech_distance_unit: formData.tech_distance_unit,
        tech_average_speed: formData.tech_average_speed,
        tech_average_speed_unit: formData.tech_average_speed_unit,
        tech_breaks: formData.tech_breaks,
        tech_breaks_unit: formData.tech_breaks_unit,
        tech_departure_time: formData.tech_departure_time,
        tech_fuel_e: formData.tech_fuel_e,
        tech_fuel_e_unit: formData.tech_fuel_e_unit,
        tech_fuel_p: formData.tech_fuel_p,
        tech_fuel_p_unit: formData.tech_fuel_p_unit,
        tech_passengers: formData.tech_passengers,
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
      tech_distance: "800",
      tech_distance_unit: "km",
      tech_average_speed: "800",
      tech_average_speed_unit: "km/h",
      tech_breaks: "800",
      tech_breaks_unit: "sec",
      tech_departure_time: getDefaultDateTime(), // 👈 set default here
      tech_fuel_e: "800",
      tech_fuel_e_unit: "L/100km",
      tech_fuel_p: "1.22",
      tech_fuel_p_unit: "/L",
      tech_passengers: "1",
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
    setFormData((prev) => ({ ...prev, tech_distance_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_average_speed_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };
  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_breaks_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };
  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fuel_e_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };
  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fuel_p_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  // result
  const totalHours = parseFloat(result?.tech_total_drive_hours || 0);
  const wholeHours = Math.floor(totalHours);
  const remainingMinutes = Math.round((totalHours - wholeHours) * 60);

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_distance" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_distance"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_distance}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_distance_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "km", value: "km" },
                        { label: "m", value: "m" },
                        { label: "mi", value: "mi" },
                        { label: "nmi", value: "nmi" },
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
                <label htmlFor="tech_average_speed" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_average_speed"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_average_speed}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_average_speed_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "km/h", value: "km/h" },
                        { label: "m/h", value: "m/h" },
                        { label: "mph", value: "mph" },
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
                <label htmlFor="tech_breaks" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_breaks"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_breaks}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_breaks_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "sec", value: "sec" },
                        { label: "min", value: "min" },
                        { label: "hrs", value: "hrs" },
                        { label: "days", value: "days" },
                        { label: "wks", value: "wks" },
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
                <label htmlFor="tech_departure_time" className="7">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className=" relative">
                  <input
                    type="datetime-local"
                    name="tech_departure_time"
                    id="tech_departure_time"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_departure_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_fuel_e" className="label">
                  {data?.payload?.tech_lang_keys["8"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_fuel_e"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_fuel_e}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_fuel_e_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "L/100km", value: "L/100km" },
                        { label: "us mpg", value: "us mpg" },
                        { label: "uk mpg", value: "uk mpg" },
                        { label: "km/L", value: "km/L" },
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
                <label htmlFor="tech_fuel_p" className="label">
                  {data?.payload?.tech_lang_keys["9"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_fuel_p"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_fuel_p}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_fuel_p_unit} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: currency.symbol + "/L",
                          value: currency.symbol + "/L",
                        },
                        {
                          label: currency.symbol + "/us gal",
                          value: currency.symbol + "/us gal",
                        },
                        {
                          label: currency.symbol + "/uk gal",
                          value: currency.symbol + "/uk gal",
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
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_passengers" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_passengers"
                    id="tech_passengers"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_passengers}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <input
                type="hidden"
                step="any"
                name="tech_currancy"
                id="tech_currancy"
                className="input my-2"
                aria-label="input"
                value={currency.symbol}
              />
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
                      <div className="w-full my-2">
                        <div className="w-full md:w-[80%] lg:w-[80%]">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td
                                  width="60%"
                                  className="border-b py-2 font-semibold"
                                >
                                  {data?.payload?.tech_lang_keys["11"]}:
                                </td>
                                <td className="border-b py-2">
                                  {String(wholeHours).padStart(2, "0")}
                                  {data?.payload?.tech_lang_keys["5"]}{" "}
                                  {String(remainingMinutes).padStart(2, "0")}
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                              </tr>

                              {result?.tech_arrival_time && (
                                <tr>
                                  <td className="border-b py-2 font-semibold">
                                    {data?.payload?.tech_lang_keys["12"]}:
                                  </td>
                                  <td className="border-b py-2">
                                    {result.tech_arrival_time}
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="border-b py-2 font-semibold">
                                  {data?.payload?.tech_lang_keys["13"]}:
                                </td>
                                <td className="border-b py-2">
                                  {currency?.symbol}{" "}
                                  {Number(
                                    result?.tech_total_drive_cost || 0
                                  ).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2 font-semibold">
                                  {data?.payload?.tech_lang_keys["14"]}:
                                </td>
                                <td className="border-b py-2">
                                  {currency?.symbol}{" "}
                                  {Number(
                                    result?.tech_drive_cost_per_person || 0
                                  ).toFixed(2)}
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

export default DrivingTimeCalculator;
