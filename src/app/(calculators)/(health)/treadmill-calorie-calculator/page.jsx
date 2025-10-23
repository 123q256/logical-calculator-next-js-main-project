"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTreadmillCalorieCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TreadmillCalorieCalculator = () => {
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
    tech_gradient: 17,
    tech_weight: 175,
    tech_weight_unit: "lbs",
    tech_speed: 45,
    tech_speed_unit: "mph",
    tech_distance: 45,
    tech_distance_unit: "mile",
    tech_time: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTreadmillCalorieCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_gradient ||
      !formData.tech_weight ||
      !formData.tech_speed ||
      !formData.tech_distance ||
      !formData.tech_weight_unit ||
      !formData.tech_speed_unit ||
      !formData.tech_distance_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gradient: formData.tech_gradient,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_speed: formData.tech_speed,
        tech_speed_unit: formData.tech_speed_unit,
        tech_distance: formData.tech_distance,
        tech_distance_unit: formData.tech_distance_unit,
        tech_time: formData.tech_time,
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
      tech_x: "",
      tech_y: "",
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
  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_speed_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_distance_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_gradient" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_gradient"
                    id="tech_gradient"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_gradient}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>

              <div className="col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
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
                    onClick={toggleDropdown}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
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
              <div className="col-span-6">
                <label htmlFor="tech_speed" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_speed"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_speed}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_speed_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "miles per hour (mph)", value: "mph" },
                        { label: "kilometers per hour (Km/h)", value: "Km/h" },
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
              <div className="col-span-6">
                <label htmlFor="tech_distance" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
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
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_distance_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["5"],
                          value: "mile",
                        },
                        { label: "Km", value: "Km" },
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

              <div className="col-span-6">
                <label htmlFor="tech_time" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_time"
                    id="tech_time"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_time}
                    onChange={handleChange}
                  />
                  <span className="input_unit">min</span>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <p className="mb-2">
                          <strong className="text-[#2845F5] text-[18px]">
                            {data?.payload?.tech_lang_keys[7]}
                          </strong>
                        </p>
                        <div className="grid grid-cols-12 items-center">
                          <div className="col-span-12 md:col-span-5 lg:col-span-5">
                            <div className="w-full bg-sky-100 bordered rounded-lg overflow-auto px-3 py-2">
                              <table className="w-full" cellspacing="0">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[1]}
                                    </td>
                                    <td className="border-b py-2 ps-3">
                                      <strong className="text-[#119154]">
                                        {result?.tech_gradient} %
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[3]}
                                    </td>
                                    <td className="border-b py-2 ps-3">
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_speed_mph}
                                        </span>{" "}
                                        mph
                                      </strong>
                                      <span>/</span>
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_speed_kmh}
                                        </span>{" "}
                                        Km/h
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[6]}
                                    </td>
                                    <td className="border-b py-2 ps-3">
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_time_ans}
                                        </span>{" "}
                                        min
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      {data?.payload?.tech_lang_keys[4]}
                                    </td>
                                    <td className="py-2 ps-3">
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_distance_m}
                                        </span>{" "}
                                        {data?.payload?.tech_lang_keys[5]}
                                      </strong>
                                      <span>/</span>
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_distance_km}
                                        </span>{" "}
                                        Km
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-2 lg:col-span-2 flex justify-center py-4 text-center">
                            <img
                              src="/images/all_calculators/send.webp"
                              alt="send icon"
                              width="45px"
                              height="45px"
                            />
                          </div>
                          <div className="col-span-12 md:col-span-5 lg:col-span-5">
                            <div className="col-12 bg-sky-100 bordered rounded-lg overflow-auto px-3 py-2">
                              <table className="col-12" cellspacing="0">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[1]}
                                    </td>
                                    <td className="border-b py-2 ps-3">
                                      <strong>
                                        <span className="text-[#119154]">
                                          0.0
                                        </span>{" "}
                                        %
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[3]}
                                    </td>
                                    <td className="border-b py-2 ps-3">
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_speed_mph_sec}
                                        </span>{" "}
                                        mph
                                      </strong>
                                      <span>/</span>
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_speed_kmh_sec}
                                        </span>{" "}
                                        Km/h
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[6]}
                                    </td>
                                    <td className="border-b py-2 ps-3">
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_time_ans}
                                        </span>{" "}
                                        min
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      {data?.payload?.tech_lang_keys[4]}
                                    </td>
                                    <td className="py-2 ps-3">
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_distance_m_sec}
                                        </span>{" "}
                                        {data?.payload?.tech_lang_keys[5]}
                                      </strong>
                                      <span>/</span>
                                      <strong>
                                        <span className="text-[#119154]">
                                          {result?.tech_distance_km_sec}
                                        </span>{" "}
                                        Km
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        {/* weight loss meal planner */}
                        <div className="grid grid-cols-12  bg-sky-100 bordered rounded-lg  py-2 mt-3">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 px-3 overflow-auto md:border-r-2 lg:border-r-2 ">
                            <table className="w-full px-4" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[8]}
                                  </td>
                                  <td className="border-b py-2">
                                    <strong className="text-[#119154]">
                                      {result?.tech_cal} Kcal
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[9]}
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>{result?.tech_fatoz_ans} oz</strong>
                                    <span>/</span>
                                    <strong>{result?.tech_fatg_ans} g</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2">METs</td>
                                  <td className="py-2">
                                    <strong>{result?.tech_mets}</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 px-3 overflow-auto ps-md-3">
                            <table className="w-full px-4" cellspacing="0">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[10]}
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>
                                      {result?.tech_energy_kw_ans} KWH
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[11]}
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>
                                      {result?.tech_electric_heater_ans} min
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2">
                                    {data?.payload?.tech_lang_keys[12]}
                                  </td>
                                  <td className="py-2">
                                    <strong>
                                      {result?.tech_light_bulb_ans}{" "}
                                      {data?.payload?.tech_lang_keys[13]}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="w-full overflow-auto mt-3">
                          <table className="lg:w-[50%] w-full" cellspacing="0">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[14]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_cburger_ans}{" "}
                                    {data?.payload?.tech_lang_keys[15]}(s)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[16]} (355ml)
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_beer2_ans}{" "}
                                    {data?.payload?.tech_lang_keys[17]}(s)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[18]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_shop_ans} min</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  {data?.payload?.tech_lang_keys[19]}
                                </td>
                                <td className="py-2">
                                  <strong>
                                    {result?.tech_cleanning_ans} min
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full mt-3">
                          <ul className="blue-marker ">
                            <li className="py-1">
                              {data?.payload?.tech_lang_keys[20]}{" "}
                              <strong>{result?.tech_meter_dash_ans} sec</strong>
                            </li>
                            <li className="py-1">
                              {data?.payload?.tech_lang_keys[21]}{" "}
                              <strong>
                                {result?.tech_meter_run_h_ans} min{" "}
                                {result?.tech_meter_run_m_ans} sec
                              </strong>
                            </li>
                            <li className="py-1">
                              {data?.payload?.tech_lang_keys[22]}{" "}
                              <strong>
                                {result?.tech_half_marathonh}{" "}
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                {result?.tech_half_marathonm} min{" "}
                                {result?.tech_half_marathons} sec
                              </strong>
                            </li>
                            <li className="py-1">
                              {data?.payload?.tech_lang_keys[23]}{" "}
                              <strong>
                                {result?.tech_marathonh}{" "}
                                {data?.payload?.tech_lang_keys[13]}{" "}
                                {result?.tech_marathonm} min{" "}
                                {result?.tech_marathons} sec
                              </strong>
                            </li>
                          </ul>
                          <p>
                            *{data?.payload?.tech_lang_keys[24]}{" "}
                            <strong>{result?.tech_record_ans} %</strong>{" "}
                            {data?.payload?.tech_lang_keys[25]}.
                          </p>
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

export default TreadmillCalorieCalculator;
