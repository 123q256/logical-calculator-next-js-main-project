"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCbmCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CbmCalculator = () => {
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
    tech_type: "advance", //  advance   basic
    tech_width: 150,
    tech_width_unit: "mi",
    tech_length: 120,
    tech_length_unit: "mm",
    tech_heigth: 100,
    tech_heigth_unit: "mm",
    tech_quantity: 50,
    tech_weight: 40,
    tech_weight_unit: "earths",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCbmCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type || !formData.tech_width) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_heigth: formData.tech_heigth,
        tech_heigth_unit: formData.tech_heigth_unit,
        tech_quantity: formData.tech_quantity,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
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
      tech_type: "advance", //  advance   basic
      tech_width: 150,
      tech_width_unit: "mi",
      tech_length: 120,
      tech_length_unit: "mm",
      tech_heigth: 100,
      tech_heigth_unit: "mm",
      tech_quantity: 50,
      tech_weight: 40,
      tech_weight_unit: "earths",
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

          <div className="lg:w-[80%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 text-center">
                <span className="font-s-14 text-blue pe-lg-3 pe-2">
                  {data?.payload?.tech_lang_keys["1"]}:
                </span>
                <label className="pe-2" htmlFor="basic">
                  <input
                    type="radio"
                    name="tech_type"
                    value="basic"
                    id="basic"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_type === "basic"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>
                </label>
                <label htmlFor="advance">
                  <input
                    type="radio"
                    name="tech_type"
                    className="mr-2 border"
                    value="advance"
                    id="advance"
                    onChange={handleChange}
                    checked={formData.tech_type === "advance"}
                  />
                  <span>{data?.payload?.tech_lang_keys["3"]}</span>
                </label>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_width" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="grid grid-cols-12   gap-2">
                  <div className="col-span-8">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_width"
                        id="tech_width"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_width}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_width_unit"
                        id="tech_width_unit"
                        value={formData.tech_width_unit}
                        onChange={handleChange}
                      >
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                        <option value="yd">yd</option>
                        <option value="mi">mi</option>
                        <option value="km">km</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_length" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="grid grid-cols-12  gap-2">
                  <div className="col-span-8">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_length"
                        id="tech_length"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_length}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_length_unit"
                        id="tech_length_unit"
                        value={formData.tech_length_unit}
                        onChange={handleChange}
                      >
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                        <option value="yd">yd</option>
                        <option value="mi">mi</option>
                        <option value="km">km</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_heigth" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="grid grid-cols-12  gap-2">
                  <div className="col-span-8">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_heigth"
                        id="tech_heigth"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_heigth}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_heigth_unit"
                        id="tech_heigth_unit"
                        value={formData.tech_heigth_unit}
                        onChange={handleChange}
                      >
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                        <option value="yd">yd</option>
                        <option value="mi">mi</option>
                        <option value="km">km</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_quantity" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
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
              {formData.tech_type === "advance" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 sman1">
                    <label htmlFor="tech_weight" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="grid grid-cols-12  gap-2">
                      <div className="col-span-8">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_weight"
                            id="tech_weight"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_weight}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_weight_unit"
                            id="tech_weight_unit"
                            value={formData.tech_weight_unit}
                            onChange={handleChange}
                          >
                            <option value="ug">ug</option>
                            <option value="mg">mg</option>
                            <option value="g">g</option>
                            <option value="dag">dag</option>
                            <option value="lb">lb</option>
                            <option value="kg">kg</option>
                            <option value="t">t</option>
                            <option value="gr">gr</option>
                            <option value="dr">dr</option>
                            <option value="oz">oz</option>
                            <option value="stone">stone</option>
                            <option value="us-ton">US ton</option>
                            <option value="long-ton">Long ton</option>
                            <option value="earths">Earths</option>
                            <option value="me">me</option>
                            <option value="u">u</option>
                            <option value="oz-t">oz t</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                      <div className="w-full">
                        {formData?.tech_type === "basic" ? (
                          <div className="text-center">
                            <p className="text-[20px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-blue">
                                  {result?.tech_cbm}{" "}
                                  <span className="text-[20px]">
                                    m<sup>3</sup>
                                  </span>
                                </strong>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_cbm}{" "}
                                    <span className="font-s-14">
                                      m<sup>3</sup>
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["10"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_total_cbm}{" "}
                                    <span className="font-s-14">
                                      m<sup>3</sup>
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["11"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_total_weight}{" "}
                                    <span className="font-s-14">Kg</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["12"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_total_volumetric_weight}{" "}
                                    <span className="font-s-14">Kg</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    20 feet Standard Dry Container :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_size_20}{" "}
                                    <span className="font-s-14">
                                      Number of Cartons
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    40 feet Standard Dry Container :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_size_40}{" "}
                                    <span className="font-s-14">
                                      Number of Cartons
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    40 feet High Cube Dry Container :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_size_40_hq}{" "}
                                    <span className="font-s-14">
                                      Number of Cartons
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    45 feet High Cube Dry Container :
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_size_45_hq}{" "}
                                    <span className="font-s-14">
                                      Number of Cartons
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
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

export default CbmCalculator;
