"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useFrictionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FrictionCalculator = () => {
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
    tech_calculate: "1", // 1 2 3 4
    tech_fr_co: 0.2,
    tech_force: 12,
    tech_force_unit: "N",
    tech_fr: 12,
    tech_fr_unit: "N",
    tech_mass: 13,
    tech_plane: 30,
    tech_gravity: 9.81,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFrictionCalculatorMutation();

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
        tech_fr_co: formData.tech_fr_co,
        tech_force: formData.tech_force,
        tech_force_unit: formData.tech_force_unit,
        tech_fr: formData.tech_fr,
        tech_fr_unit: formData.tech_fr_unit,
        tech_mass: formData.tech_mass,
        tech_plane: formData.tech_plane,
        tech_gravity: formData.tech_gravity,
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
      tech_calculate: "1", // 1 2 3 4
      tech_fr_co: 0.2,
      tech_force: 12,
      tech_force_unit: "N",
      tech_fr: 12,
      tech_fr_unit: "N",
      tech_mass: 13,
      tech_plane: 30,
      tech_gravity: 9.81,
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
    setFormData((prev) => ({ ...prev, tech_force_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fr_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-3">
              <div className="col-span-12">
                <label htmlFor="tech_calculate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                    <option value="1">Friction Coefficient</option>
                    <option value="2">Normal Force</option>
                    <option value="3">Friction</option>
                    <option value="4">Frictional Force</option>
                  </select>
                </div>
              </div>
              {(formData.tech_calculate == "2" ||
                formData.tech_calculate == "3" ||
                formData.tech_calculate == "4") && (
                <>
                  <div className="col-span-12 friction_coefficient px-2 ">
                    <label htmlFor="tech_fr_co" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (μ)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_fr_co"
                        id="tech_fr_co"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_fr_co}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_calculate == "1" ||
                formData.tech_calculate == "3") && (
                <>
                  <div className="col-span-12 normal_force">
                    <label htmlFor="tech_force" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (N)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_force"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_force}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_force_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "kN", value: "kN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
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
                formData.tech_calculate == "2") && (
                <>
                  <div className="col-span-12 friction">
                    <label htmlFor="tech_fr" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (F)
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fr"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_fr}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_fr_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "kN", value: "kN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
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

              {formData.tech_calculate == "4" && (
                <>
                  <div className="col-span-12 mass  ">
                    <label htmlFor="tech_mass" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (m)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mass"
                        id="tech_mass"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mass}
                        onChange={handleChange}
                      />
                      <span className="input_unit">kg</span>
                    </div>
                  </div>
                  <div className="col-span-12 plane  ">
                    <label htmlFor="tech_plane" className="label">
                      {data?.payload?.tech_lang_keys["6"]} (θ)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_plane"
                        id="tech_plane"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_plane}
                        onChange={handleChange}
                      />
                      <span className="input_unit">kg</span>
                    </div>
                  </div>
                  <div className="col-span-12 gravity  ">
                    <label htmlFor="tech_gravity" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (g)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_gravity"
                        id="tech_gravity"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_gravity}
                        onChange={handleChange}
                      />
                      <span className="input_unit">kg</span>
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
                    <div className="col-full mt-3">
                      {result?.tech_friction_coefficient && (
                        <div className="w-full text-center text-[18px]">
                          <p>{data?.payload?.tech_lang_keys["2"]} (μ)</p>
                          <p className="my-3">
                            <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2 text-[25px]">
                              {result?.tech_friction_coefficient}
                            </strong>
                          </p>
                        </div>
                      )}

                      {result?.tech_calculate_force && (
                        <div className="w-full text-center text-[18px]">
                          <p>{data?.payload?.tech_lang_keys["3"]}</p>
                          <p className="my-3">
                            <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2 text-[25px]">
                              {Number(result?.tech_calculate_force).toFixed(2)}{" "}
                              (N)
                            </strong>
                          </p>
                        </div>
                      )}

                      {result?.tech_friction && (
                        <div className="w-full text-center text-[18px]">
                          <p>{data?.payload?.tech_lang_keys["4"]}</p>
                          <p className="my-3">
                            <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2 text-[25px]">
                              {Number(result?.tech_friction).toFixed(2)} (N)
                            </strong>
                          </p>
                        </div>
                      )}

                      {result?.tech_friction2 && (
                        <div className="w-full text-center text-[18px]">
                          <p>{data?.payload?.tech_lang_keys["8"]}</p>
                          <p className="my-3">
                            <strong className="bg-[#2845F5] text-white rounded-lg px-3 py-2 text-[25px]">
                              {Number(result?.tech_friction2).toFixed(2)} (N)
                            </strong>
                          </p>
                        </div>
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

export default FrictionCalculator;
