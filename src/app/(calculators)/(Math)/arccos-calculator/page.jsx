"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useArccosCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ArccosCalculator = () => {
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
    tech_arccos: 0.5,
    tech_round: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useArccosCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_arccos || !formData.tech_round) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_arccos: formData.tech_arccos,
        tech_round: formData.tech_round,
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
      tech_arccos: 0.5,
      tech_round: 5,
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
  // result
  const angle = result?.tech_angle || 0;
  const radian = result?.tech_rad || 0;
  const roundTo = parseInt(formData?.tech_round || 2);

  const anglePlus = [
    (angle + -1 * 360).toFixed(roundTo),
    (angle + 0 * 360).toFixed(roundTo),
    (angle + 1 * 360).toFixed(roundTo),
  ];

  const piRad = radian / Math.PI;
  const radianPlus = [
    (piRad + -1 * 2).toFixed(roundTo),
    (piRad + 0 * 2).toFixed(roundTo),
    (piRad + 1 * 2).toFixed(roundTo),
  ];

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg overflow-auto space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 ">
              <div className="col-span-12">
                <label htmlFor="tech_arccos" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    min="-1"
                    max="1"
                    step="any"
                    name="tech_arccos"
                    id="tech_arccos"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_arccos}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_round" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="any"
                    name="tech_round"
                    id="tech_round"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_round}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_angle}°
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_rad} rad
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 text-[18px]">
                          <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                        </p>
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-3">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  arccos ({formData?.tech_arccos})
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_gon} (gradians)</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  arccos ({formData?.tech_arccos})
                                </td>
                                <td className="py-2 border-b">
                                  <strong>{result?.tech_tr} (turns)</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  arccos ({formData?.tech_arccos})
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_arcmin} (minutes of)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  arccos ({formData?.tech_arccos})
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_arcsec} (seconds of)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  arccos ({formData?.tech_arccos})
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_mrad} (miliradians)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  arccos ({formData?.tech_arccos})
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_urad} (microradians)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="40%">
                                  arccos ({formData?.tech_arccos})
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    {result?.tech_pirad} (π radians)
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full text-[16px] mt-3 overflow-auto">
                          <p>
                            <strong>{data?.payload?.tech_lang_keys[6]}</strong>
                          </p>
                          <p className="mt-2">
                            arccos {formData?.tech_arccos} = cos
                            <sup className="font-s-14">-1</sup>{" "}
                            {formData?.tech_arccos} = {result?.tech_deg}°{" "}
                            {result?.tech_min}' {result?.tech_sec}"
                          </p>
                          <p className="mt-2">
                            = {angle} + k * 360° (k = -1,0,1,...)
                          </p>
                          <p className="mt-2">
                            = {anglePlus.join("°, ")}°, ...
                          </p>
                          <p className="mt-2">
                            = {radian} rad + k * 2π (k = -1,0,1,...)
                          </p>
                          <p className="mt-2">
                            = {radianPlus.map((val) => `${val}π`).join(", ")},
                            ...
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

export default ArccosCalculator;
