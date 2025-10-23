"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useGravityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GravitationalForceCalculator = () => {
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
    tech_calculate: "1", // 1 2 3 4 5
    tech_mass_one: 7,
    tech_mass_one_unit: "g",
    tech_mass_two: 7,
    tech_mass_two_unit: "g",
    tech_gravitational_force: 13,
    tech_gravitational_force_unit: "N",
    tech_distance: 13,
    tech_distance_unit: "nm",
    tech_constant: 6.6743,
    tech_latitude: 37.16802,
    tech_height: 13,
    tech_height_unit: "ft",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGravityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculate) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculate: formData.tech_calculate,
        tech_mass_one: formData.tech_mass_one,
        tech_mass_one_unit: formData.tech_mass_one_unit,
        tech_mass_two: formData.tech_mass_two,
        tech_mass_two_unit: formData.tech_mass_two_unit,
        tech_gravitational_force: formData.tech_gravitational_force,
        tech_gravitational_force_unit: formData.tech_gravitational_force_unit,
        tech_distance: formData.tech_distance,
        tech_distance_unit: formData.tech_distance_unit,
        tech_constant: formData.tech_constant,
        tech_latitude: formData.tech_latitude,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
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
      tech_calculate: "1", // 1 2 3 4 5
      tech_mass_one: 7,
      tech_mass_one_unit: "g",
      tech_mass_two: 7,
      tech_mass_two_unit: "g",
      tech_gravitational_force: 13,
      tech_gravitational_force_unit: "N",
      tech_distance: 13,
      tech_distance_unit: "nm",
      tech_constant: 6.6743,
      tech_latitude: 37.16802,
      tech_height: 13,
      tech_height_unit: "ft",
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
    setFormData((prev) => ({ ...prev, tech_mass_one_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mass_two_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_gravitational_force_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_distance_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_calculate" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculate"
                    id="tech_calculate"
                    value={formData.tech_calculate}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_calculate == "1" ||
                formData.tech_calculate == "3" ||
                formData.tech_calculate == "4") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mass_one">
                    <label htmlFor="tech_mass_one" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (M)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mass_one"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_mass_one}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_mass_one_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "g", value: "g" },
                            { label: "kg", value: "kg" },
                            { label: "t", value: "t" },
                            { label: "oz", value: "oz" },
                            { label: "lb", value: "lb" },
                            { label: "stone", value: "stone" },
                            { label: "US ton", value: "US ton" },
                            { label: "Long ton", value: "Long ton" },
                            { label: "Earths", value: "Earths" },
                            { label: "Suns", value: "Suns" },
                            { label: "me", value: "me" },
                            { label: "mp", value: "mp" },
                            { label: "mn", value: "mn" },
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

              {(formData.tech_calculate == "1" ||
                formData.tech_calculate == "2" ||
                formData.tech_calculate == "4") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 mass_two">
                    <label htmlFor="tech_mass_two" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (m)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mass_two"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_mass_two}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_mass_two_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "g", value: "g" },
                            { label: "kg", value: "kg" },
                            { label: "t", value: "t" },
                            { label: "oz", value: "oz" },
                            { label: "lb", value: "lb" },
                            { label: "stone", value: "stone" },
                            { label: "US ton", value: "US ton" },
                            { label: "Long ton", value: "Long ton" },
                            { label: "Earths", value: "Earths" },
                            { label: "Suns", value: "Suns" },
                            { label: "me", value: "me" },
                            { label: "mp", value: "mp" },
                            { label: "mn", value: "mn" },
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
              {(formData.tech_calculate == "2" ||
                formData.tech_calculate == "3" ||
                formData.tech_calculate == "4") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 gf ">
                    <label htmlFor="tech_gravitational_force" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (F)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_gravitational_force"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_gravitational_force}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_gravitational_force_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "kN", value: "kN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
                            { label: "lbf", value: "lbf" },
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
              {(formData.tech_calculate == "1" ||
                formData.tech_calculate == "2" ||
                formData.tech_calculate == "3") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 distance">
                    <label htmlFor="tech_distance" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (R)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_distance"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_distance}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_distance_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nm", value: "nm" },
                            { label: "μm", value: "μm" },
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
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
              {(formData.tech_calculate == "1" ||
                formData.tech_calculate == "2" ||
                formData.tech_calculate == "3" ||
                formData.tech_calculate == "4") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 constant">
                    <label htmlFor="tech_constant" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (G) =
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_constant"
                        id="tech_constant"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_constant}
                        onChange={handleChange}
                      />
                      <span className="input_unit">
                        x10<sup>-11</sup>N-m<sup>2</sup>/kg<sup>2</sup>
                      </span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculate == "5" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 latitude ">
                    <label htmlFor="tech_latitude" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_latitude"
                        id="tech_latitude"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_latitude}
                        onChange={handleChange}
                      />
                      <span className="input_unit">degree</span>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculate == "5" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 height ">
                    <label htmlFor="tech_height" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (R)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_height}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_height_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "ft", value: "ft" },
                            { label: "m", value: "m" },
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
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      {result?.tech_force && (
                        <>
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys["5"]} (F)</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] px-3 py-2 text-[32px] rounded-lg text-white">
                                {Number(result?.tech_force).toFixed(3)} (N)
                              </strong>
                            </p>
                          </div>
                        </>
                      )}

                      {result?.tech_first_mass && (
                        <>
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys["2"]} (M)</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] px-3 py-2 text-[32px] rounded-lg text-white">
                                {Number(result?.tech_first_mass).toFixed(3)}{" "}
                                (kg)
                              </strong>
                            </p>
                          </div>
                        </>
                      )}

                      {result?.tech_second_mass && (
                        <>
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys["3"]} (m)</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] px-3 py-2 text-[32px] rounded-lg text-white">
                                {Number(result?.tech_second_mass).toFixed(3)}{" "}
                                (kg)
                              </strong>
                            </p>
                          </div>
                        </>
                      )}

                      {result?.tech_distance && (
                        <>
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys["4"]} (R)</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] px-3 py-2 text-[32px] rounded-lg text-white">
                                {Number(result?.tech_distance).toFixed(3)} (m)
                              </strong>
                            </p>
                          </div>
                        </>
                      )}

                      {result?.tech_g && (
                        <>
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys["9"]} (g)</p>
                            <p className="my-3">
                              <strong className="bg-[#2845F5] px-3 py-2 text-[32px] rounded-lg text-white">
                                {Number(result?.tech_g).toFixed(3)} (g ms
                                <sup>-2</sup>)
                              </strong>
                            </p>
                          </div>
                        </>
                      )}
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

export default GravitationalForceCalculator;
