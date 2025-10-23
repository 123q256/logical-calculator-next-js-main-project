"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useElectricFluxCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ElectricFluxCalculator = () => {
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
    tech_electric: "17",
    tech_surface: "9",
    tech_degree: "74",
    tech_charge: "1.79",
    tech_unit: "picocoulomb",
    tech_const: "8.854",
    tech_power: "-12",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useElectricFluxCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_electric: formData.tech_electric,
        tech_surface: formData.tech_surface,
        tech_degree: formData.tech_degree,
        tech_charge: formData.tech_charge,
        tech_unit: formData.tech_unit,
        tech_const: formData.tech_const,
        tech_power: formData.tech_power,
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
      tech_electric: "17",
      tech_surface: "9",
      tech_degree: "74",
      tech_charge: "1.79",
      tech_unit: "picocoulomb",
      tech_const: "8.854",
      tech_power: "-12",
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_electric" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (|E|) V/m:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_electric"
                    id="tech_electric"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_electric}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_surface" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (|E|) (|A|) m
                  <sup className="text-blue">2</sup>:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_surface"
                    id="tech_surface"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_surface}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_degree" className="label">
                  {data?.payload?.tech_lang_keys["3"]} (θ)°:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_degree"
                    id="tech_degree"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_degree}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-7 md:col-span-4 lg:col-span-4">
                <label htmlFor="tech_charge" className="label">
                  {data?.payload?.tech_lang_keys["4"]} (Q):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_charge"
                    id="tech_charge"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_charge}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-5 md:col-span-2 lg:col-span-2">
                <label htmlFor="tech_unit" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_unit"
                    id="tech_unit"
                    value={formData.tech_unit}
                    onChange={handleChange}
                  >
                    <option value="picocoulomb">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="nanocoulomb">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="microcoulomb">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="millicoulomb">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                    <option value="coulomb">
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="elementry">
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                    <option value="ampere">
                      {data?.payload?.tech_lang_keys["11"]}{" "}
                    </option>
                    <option value="milliampere">
                      {data?.payload?.tech_lang_keys["12"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-8   md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_const" className="label">
                  (ϵ<sub className="text-blue">0</sub>) C
                  <sup className="text-blue">2</sup>/N∙m
                  <sup className="text-blue">2</sup>:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_const"
                    id="tech_const"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_const}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    × 10 {data?.payload?.tech_lang_keys["13"]}
                  </span>
                </div>
              </div>
              <div className="col-span-4 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_power" className="label">
                  &nbsp;
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_power"
                    id="tech_power"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_power}
                    onChange={handleChange}
                  />
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-center">
                        <p className="text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys["14"]}</strong>
                        </p>
                        <div className="flex justify-center">
                          <p className="md:text-[25px] text-[18px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                            <strong className="text-blue">
                              {result?.tech_flux}
                            </strong>
                          </p>
                        </div>
                      </div>
                      <div className="w-full  mt-3  p-2 md:p-5 overflow-auto">
                        <p className="w-full mt-3 text-[18px]">
                          {data?.payload?.tech_lang_keys["15"]}
                        </p>
                        <p className="mt-3 w-full">
                          {data?.payload?.tech_lang_keys["1"]} |E| ={" "}
                          {result?.tech_electric} V/m
                        </p>
                        <p className="mt-3 w-full">
                          {data?.payload?.tech_lang_keys["2"]} |A| ={" "}
                          {result?.tech_surface} m<sup>2</sup>
                        </p>
                        <p className="mt-3 w-full">
                          {data?.payload?.tech_lang_keys["3"]} (θ) ° ={" "}
                          {result?.tech_degree} θ
                        </p>
                        <p className="mt-3 w-full">
                          {data?.payload?.tech_lang_keys["4"]} (Q) ={" "}
                          {result?.tech_charge} C
                        </p>
                        <p className="mt-3 w-full">
                          (ϵ0) C²/N·m² =
                          <InlineMath
                            math={`${result?.tech_const} \\times 10^{${result?.tech_power}}`}
                          />
                        </p>

                        <p className="w-full mt-3 text-[18px] text-blue">
                          {data?.payload?.tech_lang_keys["16"]}
                        </p>
                        <p className="mt-3 w-full text-blue">
                          {data?.payload?.tech_lang_keys["14"]}{" "}
                          {data?.payload?.tech_lang_keys["17"]}
                        </p>
                        <BlockMath math={`\\Phi = \\frac{Q}{\\epsilon_0}`} />
                        <BlockMath
                          math={`\\Phi = \\frac{${result?.tech_charge}}{${result?.tech_const} \\times 10^{${result?.tech_power}}}`}
                        />
                        <p className="mt-3 w-full text-[18px] text-blue">
                          Φ = {result?.tech_flux}
                        </p>

                        <p className="mt-3 w-full text-blue">
                          {data?.payload?.tech_lang_keys["14"]}{" "}
                          {data?.payload?.tech_lang_keys["18"]}
                        </p>
                        <BlockMath
                          math={`\\Phi = |\\vec{E}| \\times |\\vec{A}| \\times \\cos(180 - \\theta)`}
                        />
                        <p className="mt-3 w-full">
                          Φ = {result?.tech_electric} x {result?.tech_surface} x
                          cos(180 - {result?.tech_degree})
                        </p>
                        <p className="mt-3 w-full">
                          Φ = {result?.tech_electric} x {result?.tech_surface} x
                          cos({result?.tech_sum})
                        </p>
                        <p className="mt-3 w-full">
                          Φ = {result?.tech_electric} x {result?.tech_surface} x{" "}
                          {result?.tech_cos}
                        </p>
                        <p className="mt-3 w-full text-[18px] text-blue">
                          Φ = {result?.tech_inward}
                        </p>

                        <p className="mt-3 w-full text-blue">
                          {data?.payload?.tech_lang_keys["14"]}{" "}
                          {data?.payload?.tech_lang_keys["19"]}
                        </p>
                        <BlockMath
                          math={`\\Phi = |\\vec{E}| \\times |\\vec{A}| \\times \\cos(\\theta)`}
                        />
                        <p className="mt-3 w-full">
                          Φ = {result?.tech_electric} x {result?.tech_surface} x
                          cos({result?.tech_degree})
                        </p>
                        <p className="mt-3 w-full">
                          Φ = {result?.tech_electric} x {result?.tech_surface} x{" "}
                          {result?.tech_cosoutward}
                        </p>
                        <p className="mt-3 w-full text-[18px] text-blue">
                          Φ = {result?.tech_outward}
                        </p>
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

export default ElectricFluxCalculator;
