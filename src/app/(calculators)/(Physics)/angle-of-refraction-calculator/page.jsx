"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useAngleOfRefractionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AngleOfRefractionCalculator = () => {
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
    tech_calculation: "from1",
    tech_medium1: "custom",
    tech_n1: 13,
    tech_medium2: "custom",
    tech_n2: 25,
    tech_angle_first: 5,
    tech_angle_f_unit: "mrad",
    tech_angle_second: 5,
    tech_angle_s_unit: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAngleOfRefractionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_medium1" || name === "tech_medium2") {
      // Map refractive indices
      const refractiveIndexMap = {
        vacuum: "1",
        air: "1.000293",
        water: "1.333",
        ethanol: "1.36",
        ice: "1.31",
        acrylic: "1.49",
        window: "1.52",
        diamond: "2.419",
        custom: "0",
      };

      // Determine which n field to update
      const nField = name === "tech_medium1" ? "tech_n1" : "tech_n2";

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        [nField]: refractiveIndexMap[value] || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculation) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculation: formData.tech_calculation,
        tech_medium1: formData.tech_medium1,
        tech_n1: formData.tech_n1,
        tech_medium2: formData.tech_medium2,
        tech_n2: formData.tech_n2,
        tech_angle_first: formData.tech_angle_first,
        tech_angle_f_unit: formData.tech_angle_f_unit,
        tech_angle_second: formData.tech_angle_second,
        tech_angle_s_unit: formData.tech_angle_s_unit,
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
      tech_calculation: "from1",
      tech_medium1: "custom",
      tech_n1: 13,
      tech_medium2: "custom",
      tech_n2: 25,
      tech_angle_first: 5,
      tech_angle_f_unit: "mrad",
      tech_angle_second: 5,
      tech_angle_s_unit: "deg",
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
    setFormData((prev) => ({ ...prev, tech_angle_f_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_s_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <div className="row">
                  <div className="w-full px-2 mb-4">
                    <label htmlFor="tech_calculation" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_calculation"
                        id="tech_calculation"
                        value={formData.tech_calculation}
                        onChange={handleChange}
                      >
                        <option value="from1">
                          Find n1 | Given n2, θ₁ and θ₂
                        </option>
                        <option value="from2">
                          Find n2 | Given n1, θ₁ and θ₂{" "}
                        </option>
                        <option value="from3">
                          Find θ₁ | Given n1, n2 and θ₂{" "}
                        </option>
                        <option value="from4">
                          Find θ₂ | Given n1, n2 and θ₁{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  {(formData.tech_calculation == "from2" ||
                    formData.tech_calculation == "from3" ||
                    formData.tech_calculation == "from4") && (
                    <>
                      <div className="w-full mb-4" id="medium_index_1">
                        <div className="row">
                          <div className="w-full px-2">
                            <label htmlFor="tech_medium1" className="label">
                              {data?.payload?.tech_lang_keys["12"]} 1
                            </label>
                            <div className="mt-2">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_medium1"
                                id="tech_medium1"
                                value={formData.tech_medium1}
                                onChange={handleChange}
                              >
                                <option value="vacuum">
                                  {data?.payload?.tech_lang_keys["2"]}
                                </option>
                                <option value="air">
                                  {data?.payload?.tech_lang_keys["3"]}
                                </option>
                                <option value="water">
                                  {data?.payload?.tech_lang_keys["4"]} 20°C 🌊
                                </option>
                                <option value="ethanol">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </option>
                                <option value="ice">
                                  {data?.payload?.tech_lang_keys["6"]} 🧊
                                </option>
                                <option value="acrylic">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </option>
                                <option value="window">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </option>
                                <option value="diamond">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </option>
                                <option value="custom">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="w-full px-2">
                            <label htmlFor="tech_n1" className="label">
                              {data?.payload?.tech_lang_keys["11"]} 1 (n₁)
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_n1"
                                id="tech_n1"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_n1}
                                onChange={handleChange}
                                disabled={formData.tech_medium1 !== "custom"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {(formData.tech_calculation == "from1" ||
                    formData.tech_calculation == "from3" ||
                    formData.tech_calculation == "from4") && (
                    <>
                      <div className="w-full mb-4" id="medium_index_2">
                        <div className="row">
                          <div className="w-full px-2">
                            <label htmlFor="tech_medium2" className="label">
                              {data?.payload?.tech_lang_keys["12"]} 2
                            </label>
                            <div className="mt-2">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_medium2"
                                id="tech_medium2"
                                value={formData.tech_medium2}
                                onChange={handleChange}
                              >
                                <option value="vacuum">
                                  {data?.payload?.tech_lang_keys["2"]}
                                </option>
                                <option value="air">
                                  {data?.payload?.tech_lang_keys["3"]}
                                </option>
                                <option value="water">
                                  {data?.payload?.tech_lang_keys["4"]} 20°C 🌊
                                </option>
                                <option value="ethanol">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </option>
                                <option value="ice">
                                  {data?.payload?.tech_lang_keys["6"]} 🧊
                                </option>
                                <option value="acrylic">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </option>
                                <option value="window">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </option>
                                <option value="diamond">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </option>
                                <option value="custom">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="w-full px-2">
                            <label htmlFor="tech_n2" className="label">
                              {data?.payload?.tech_lang_keys["11"]} 2 (n₂)
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_n2"
                                id="tech_n2"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_n2}
                                onChange={handleChange}
                                disabled={formData.tech_medium2 !== "custom"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {(formData.tech_calculation == "from1" ||
                    formData.tech_calculation == "from2" ||
                    formData.tech_calculation == "from4") && (
                    <>
                      <div className="w-full px-2 mb-4" id="angle1">
                        <label htmlFor="tech_angle_first" className="label">
                          {data?.payload?.tech_lang_keys["13"]} (θ₁)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_angle_first"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_angle_first}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_angle_f_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "deg", value: "deg" },
                                { label: "rad", value: "rad" },
                                { label: "gon", value: "gon" },
                                { label: "tr", value: "tr" },
                                { label: "arcmin", value: "arcmin" },
                                { label: "arcsec", value: "arcsec" },
                                { label: "mrad", value: "mrad" },
                                { label: "μrad", value: "μrad" },
                                { label: "* π rad", value: "* π rad" },
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
                  {(formData.tech_calculation == "from1" ||
                    formData.tech_calculation == "from2" ||
                    formData.tech_calculation == "from3") && (
                    <>
                      <div className="w-full px-2 mb-3" id="angle2">
                        <label htmlFor="tech_angle_second" className="label">
                          {data?.payload?.tech_lang_keys["13"]} (θ₁)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_angle_second"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_angle_second}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_angle_s_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "deg", value: "deg" },
                                { label: "rad", value: "rad" },
                                { label: "gon", value: "gon" },
                                { label: "tr", value: "tr" },
                                { label: "arcmin", value: "arcmin" },
                                { label: "arcsec", value: "arcsec" },
                                { label: "mrad", value: "mrad" },
                                { label: "μrad", value: "μrad" },
                                { label: "* π rad", value: "* π rad" },
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
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 text-center px-2">
                <img
                  src="/images/snells_img.svg"
                  alt="Triangle Image"
                  width="250px"
                  height="165px"
                />
              </div>
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
                    <div className="w-full  mt-3">
                      <div className="w-full">
                        {result?.tech_calculation === "from1" && (
                          <>
                            <div className="text-center">
                              <p className="text-[19px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys[11]} 1 (n₁)
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {Number(result?.tech_jawab).toFixed(4)}
                                  </strong>
                                </p>
                              </div>
                            </div>
                            <p className="w-full mt-3 text-[19px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[14]}
                              </strong>
                            </p>
                            <p className="w-full mt-2">
                              n₂ {data?.payload?.tech_lang_keys[15]} 2 ={" "}
                              {formData?.tech_n2}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[13]} (θ₁) ={" "}
                              {result?.tech_angle_first}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[19]} (θ₂) ={" "}
                              {result?.tech_angle_second}
                            </p>
                            <p className="w-full mt-3 text-[19px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[16]}
                              </strong>
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[17]} = (n₂ *
                              sin(θ₂)) / sin(θ₁)
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[18]}
                            </p>
                            <p className="w-full mt-2">
                              n₁ = ({formData?.tech_n2} * sin(
                              {result?.tech_angle_second})) / sin(
                              {result?.tech_angle_first})
                            </p>
                            <p className="w-full mt-2">
                              n₁ = {Number(result?.tech_jawab).toFixed(4)}
                            </p>
                          </>
                        )}
                        {result?.tech_calculation === "from2" && (
                          <>
                            <div className="text-center">
                              <p className="text-[19px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys[11]} 2 (n₂)
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {Number(result?.tech_jawab).toFixed(4)}
                                  </strong>
                                </p>
                              </div>
                            </div>
                            <p className="w-full mt-3 text-[19px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[14]}
                              </strong>
                            </p>
                            <p className="w-full mt-2">
                              n₁ {data?.payload?.tech_lang_keys[15]} 1 ={" "}
                              {formData?.tech_n1}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[13]} (θ₁) ={" "}
                              {result?.tech_angle_first}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[19]} (θ₂) ={" "}
                              {result?.tech_angle_second}
                            </p>
                            <p className="w-full mt-3 text-[19px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[16]}
                              </strong>
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[17]} = (n₁ *
                              sin(θ₁)) / sin(θ₂)
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[18]}
                            </p>
                            <p className="w-full mt-2">
                              n₂ = ({formData?.tech_n1} * sin(
                              {result?.tech_angle_first})) / sin(
                              {result?.tech_angle_second})
                            </p>
                            <p className="w-full mt-2">
                              n₂ = {Number(result?.tech_jawab).toFixed(4)}
                            </p>
                          </>
                        )}

                        {result?.tech_calculation === "from3" && (
                          <>
                            <div className="text-center">
                              <p className="text-[19px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys[13]} (θ₁)
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_jawab * 57.2958
                                    ).toFixed(4)}{" "}
                                    deg
                                  </strong>
                                </p>
                              </div>
                            </div>
                            <p className="w-full mt-3 text-[19px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[14]}
                              </strong>
                            </p>
                            <p className="w-full mt-2">
                              n₁ {data?.payload?.tech_lang_keys[15]} 1 ={" "}
                              {formData?.tech_n1}
                            </p>
                            <p className="w-full mt-2">
                              n₂ {data?.payload?.tech_lang_keys[15]} 2 ={" "}
                              {formData?.tech_n2}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[19]} (θ₂) ={" "}
                              {result?.tech_angle_second}
                            </p>
                            <p className="w-full mt-3 text-[19px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[16]}
                              </strong>
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[17]} = sin
                              <sup>-1</sup>((n₂ * sin(θ₂)) / n₁)
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[18]}
                            </p>
                            <p className="w-full mt-2">
                              θ₁ = sin<sup>-1</sup>(({formData?.tech_n2} * sin(
                              {result?.tech_angle_second})) /{" "}
                              {formData?.tech_n1});
                            </p>
                            <p className="w-full mt-2">
                              θ₁ ={" "}
                              {Number(result?.tech_jawab * 57.2958).toFixed(4)}
                            </p>
                          </>
                        )}

                        {result?.tech_calculation === "from4" && (
                          <>
                            <div className="text-center">
                              <p className="text-[19px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys[19]} (θ₂)
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    {Number(
                                      result?.tech_jawab * 57.2958
                                    ).toFixed(4)}{" "}
                                    deg
                                  </strong>
                                </p>
                              </div>
                            </div>
                            <p className="w-full mt-3 text-[19px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[14]}
                              </strong>
                            </p>
                            <p className="w-full mt-2">
                              n₁ {data?.payload?.tech_lang_keys[15]} 1 ={" "}
                              {formData?.tech_n1}
                            </p>
                            <p className="w-full mt-2">
                              n₂ {data?.payload?.tech_lang_keys[15]} 2 ={" "}
                              {formData?.tech_n2}
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[13]} (θ₁) ={" "}
                              {result?.tech_angle_first}
                            </p>
                            <p className="w-full mt-3 text-[19px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[16]}
                              </strong>
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[17]} = sin
                              <sup>-1</sup>((n₁ * sin(θ₁)) / n₂)
                            </p>
                            <p className="w-full mt-2">
                              {data?.payload?.tech_lang_keys[18]}
                            </p>
                            <p className="w-full mt-2">
                              θ₁ = sin<sup>-1</sup>(({formData?.tech_n1} * sin(
                              {result?.tech_angle_first})) / {formData?.tech_n2}
                              )
                            </p>
                            <p className="w-full mt-2">
                              θ₁ ={" "}
                              {Number(result?.tech_jawab * 57.2958).toFixed(4)}
                            </p>
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

export default AngleOfRefractionCalculator;
