"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useJouleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const JoulesCalculator = () => {
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
    tech_mass: "5",
    tech_mass_unit: "0.000001",
    tech_velocity: "4",
    tech_velocity_unit: "0.5144444",
    tech_joule_unit: "Watt-second (W sec)",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useJouleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_mass) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_velocity: formData.tech_velocity,
        tech_velocity_unit: formData.tech_velocity_unit,
        tech_joule_unit: formData.tech_joule_unit,
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
      tech_mass: "5",
      tech_mass_unit: "0.000001",
      tech_velocity: "4",
      tech_velocity_unit: "0.5144444",
      tech_joule_unit: "Watt-second (W sec)",
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
            <div className="grid grid-cols-2   gap-2 md:gap-4 lg:gap-4">
              <div className="lg:col-span-7 md:col-span-7 col-span-6">
                <label htmlFor="tech_mass" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                </div>
              </div>
              <div className="lg:col-span-5 md:col-span-5 col-span-6">
                <label htmlFor="tech_mass_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_mass_unit"
                    id="tech_mass_unit"
                    value={formData.tech_mass_unit}
                    onChange={handleChange}
                  >
                    <option value="1">kg</option>
                    <option value="0.001">g</option>
                    <option value="0.000001">mg</option>
                    <option value="0.000000001">mu-gr</option>
                    <option value="0.0002">ct</option>
                    <option value="50.80235">Hundredweight (l)</option>
                    <option value="45.35924">Hundredweight (s)</option>
                    <option value="0.4535924">lbs</option>
                    <option value="0.3732417">troy</option>
                    <option value="0.02834952">ozm</option>
                    <option value="0.03110348">troy</option>
                    <option value="14.5939">Slug</option>
                    <option value="907.1847">Ton (s)</option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-7 md:col-span-7 col-span-6">
                <label htmlFor="tech_velocity" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_velocity"
                    id="tech_velocity"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_velocity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-5 md:col-span-5 col-span-6">
                <label htmlFor="tech_velocity_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_velocity_unit"
                    id="tech_velocity_unit"
                    value={formData.tech_velocity_unit}
                    onChange={handleChange}
                  >
                    <option value="1">m/s</option>
                    <option value="0.00508">ft/min</option>
                    <option value="0.3048">ft/s</option>
                    <option value="0.2777778">km/hr</option>
                    <option value="0.5144444">Knot (int'l)</option>
                    <option value="0.44707">mph</option>
                    <option value="0.514444">Mile (nautical)/hour</option>
                    <option value="26.8224">Mile (US)/minute</option>
                    <option value="1609.344">Mile (US)/second</option>
                    <option value="299792458">Speed of light (c)</option>
                    <option value="340.006875">Mach (STP)(a)</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_joule_unit" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_joule_unit"
                    id="tech_joule_unit"
                    value={formData.tech_joule_unit}
                    onChange={handleChange}
                  >
                    <option value="Joule (J)">Joule (J)</option>
                    <option value="BTU (mean)">BTU (mean)</option>
                    <option value="BTU (thermochemical)">
                      BTU (thermochemical)
                    </option>
                    <option value="Calorie (SI) (cal)">
                      Calorie (SI) (cal)
                    </option>
                    <option value="Electron volt (eV)">
                      Electron volt (eV)
                    </option>
                    <option value="Erg (erg)">Erg (erg)</option>
                    <option value="Foot-pound force">Foot-pound force</option>
                    <option value="Foot-poundal">Foot-poundal</option>
                    <option value="Horsepower-hour">Horsepower-hour</option>
                    <option value="Kilocalorie (SI)(kcal)">
                      Kilocalorie (SI)(kcal)
                    </option>
                    <option value="Kilowatt-hour (kW hr)">
                      Kilowatt-hour (kW hr)
                    </option>
                    <option value="Ton of TNT">Ton of TNT</option>
                    <option value="Volt-coulomb (V Cb)">
                      Volt-coulomb (V Cb)
                    </option>
                    <option value="Watt-hour (W hr)">Watt-hour (W hr)</option>
                    <option value="Watt-second (W sec)">
                      Watt-second (W sec)
                    </option>
                  </select>
                </div>
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys[4]} (
                              {data?.payload?.tech_lang_keys[5]})
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong className="text-blue">
                                {Number(result?.tech_answer).toFixed(3)}{" "}
                                <span className="text-[14px]">
                                  {formData?.tech_joule_unit}
                                </span>
                              </strong>
                            </p>
                          </div>
                        </div>
                        lg:
                        <p className="col-12 mt-3 text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys[6]}</strong>
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[7]}
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[8]}.
                        </p>
                        <p className="col-12 mt-2">(K) = 1/2 *(m)*(v)^2</p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[9]}s
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[10]}
                        </p>
                        <p className="col-12 mt-2">
                          {data?.payload?.tech_lang_keys[11]}
                        </p>
                        <p className="col-12 mt-2">
                          K = 1/2 *({formData?.tech_mass})*(
                          {formData?.tech_velocity})^2
                        </p>
                        <p className="col-12 mt-2">K = {result?.tech_answer}</p>
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

export default JoulesCalculator;
