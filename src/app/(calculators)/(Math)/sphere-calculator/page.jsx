"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useSphereCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SphereCalculator = () => {
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
    tech_slct1: "1",
    tech_rad: "7",
    tech_pi: "3.1415926535898",
    tech_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSphereCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_slct1 || !formData.tech_rad) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_slct1: formData.tech_slct1,
        tech_rad: formData.tech_rad,
        tech_pi: formData.tech_pi,
        tech_unit: formData.tech_unit,
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
      tech_slct1: "1",
      tech_rad: "7",
      tech_pi: "3.1415926535898",
      tech_unit: "m",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_slct1" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_slct1"
                    id="tech_slct1"
                    value={formData.tech_slct1}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} (r){" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} (V)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]} (A)
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]} (C){" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                {formData.tech_slct1 == "1" && (
                  <>
                    <label htmlFor="tech_rad" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (r)
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "2" && (
                  <>
                    <label htmlFor="tech_rad" className="label">
                      {data?.payload?.tech_lang_keys["3"]} (V)
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "3" && (
                  <>
                    <label htmlFor="tech_rad" className="label">
                      {data?.payload?.tech_lang_keys["4"]} (A)
                    </label>
                  </>
                )}
                {formData.tech_slct1 == "4" && (
                  <>
                    <label htmlFor="tech_rad" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (C):
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_rad"
                    id="tech_rad"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_rad}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_pi" className="label">
                  pi π:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_pi"
                    id="tech_pi"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_pi}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_unit" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
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
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="in">in</option>
                    <option value="ft">ft</option>
                    <option value="yd">yd</option>
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
                        <div className="w-full md:w-[90%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["2"]} (r)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_rad} {formData?.tech_unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["3"]} (V)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_vol} {formData?.tech_unit}
                                  <sup className="text-[14px]">3</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["4"]} (A)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_area} {formData?.tech_unit}
                                  <sup className="text-[14px]">2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["5"]} (C)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_c} {formData?.tech_unit}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 text-[18px]">
                          <strong>
                            {data?.payload?.tech_lang_keys["7"]} Pi π
                          </strong>
                        </p>
                        <div className="w-full md:w-[90%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["3"]} (V)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_v1} π {formData?.tech_unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["4"]} (A)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_s1} π {formData?.tech_unit}
                                  <sup className="text-[14px]">2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  {data?.payload?.tech_lang_keys["5"]} (C)
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_c1} π {formData?.tech_unit}
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

export default SphereCalculator;
