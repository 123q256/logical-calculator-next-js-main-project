"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePowerReducingFormulaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PowerReducingFormulaCalculator = () => {
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
    tech_know: 1,
    tech_angle: 30,
    tech_angle_unit: "rad",
    tech_sinx: 1,
    tech_cosx: "",
    tech_tanx: "",
    tech_sin2x: "",
    tech_cos2x: "",
    tech_tan2x: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePowerReducingFormulaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_know) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_know: formData.tech_know,
        tech_angle: formData.tech_angle,
        tech_angle_unit: formData.tech_angle_unit,
        tech_sinx: formData.tech_sinx,
        tech_cosx: formData.tech_cosx,
        tech_tanx: formData.tech_tanx,
        tech_sin2x: formData.tech_sin2x,
        tech_cos2x: formData.tech_cos2x,
        tech_tan2x: formData.tech_tan2x,
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
      tech_know: 1,
      tech_angle: 30,
      tech_angle_unit: "rad",
      tech_sinx: 1,
      tech_cosx: "",
      tech_tanx: "",
      tech_sin2x: "",
      tech_cos2x: "",
      tech_tan2x: "",
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
    setFormData((prev) => ({ ...prev, tech_angle_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const deg2rad = (deg) => (deg * Math.PI) / 180;

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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_know" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_know"
                    id="tech_know"
                    value={formData.tech_know}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_know == "1" && (
                <>
                  <div className="col-span-12 angle ">
                    <label htmlFor="tech_angle" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_angle"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_angle}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_angle_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "degrees (deg)", value: "deg" },
                            { label: "radians (rad)", value: "rad" },
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
              {formData.tech_know == "2" && (
                <>
                  <div className="col-span-12 function ">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12 text-center mt-3 mb-1">
                        <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
                      </p>
                      <div className="col-span-6">
                        <label htmlFor="tech_sinx" className="label">
                          sin(x):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sinx"
                            id="tech_sinx"
                            className="input my-2"
                            aria-label="input"
                            min="-1"
                            max="1"
                            placeholder="00"
                            value={formData.tech_sinx}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_sin2x" className="label">
                          sin²(x):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_sin2x"
                            id="tech_sin2x"
                            className="input my-2"
                            aria-label="input"
                            min="0"
                            max="1"
                            placeholder="00"
                            value={formData.tech_sin2x}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_cosx" className="label">
                          cos(x):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_cosx"
                            id="tech_cosx"
                            className="input my-2"
                            aria-label="input"
                            min="-1"
                            max="1"
                            placeholder="00"
                            value={formData.tech_cosx}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_cos2x" className="label">
                          cos²(x):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_cos2x"
                            id="tech_cos2x"
                            className="input my-2"
                            aria-label="input"
                            min="0"
                            max="1"
                            placeholder="00"
                            value={formData.tech_cos2x}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_tanx" className="label">
                          tan(x):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_tanx"
                            id="tech_tanx"
                            className="input my-2"
                            aria-label="input"
                            min="-1"
                            max="1"
                            placeholder="00"
                            value={formData.tech_tanx}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_tan2x" className="label">
                          tan²(x):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_tan2x"
                            id="tech_tan2x"
                            className="input my-2"
                            aria-label="input"
                            min="0"
                            max="1"
                            placeholder="00"
                            value={formData.tech_tan2x}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_angle && (
                          <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-3">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    {data?.payload?.tech_lang_keys[2]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(result.tech_angle).toFixed(5)}{" "}
                                      (deg)
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b" width="60%">
                                    {data?.payload?.tech_lang_keys[2]}
                                  </td>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {Number(
                                        deg2rad(result.tech_angle)
                                      ).toFixed(5)}{" "}
                                      (rad)
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        <p className="mt-3 text-[20px]">
                          <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                        </p>
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-3">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>sin(x)</strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_sin).toFixed(5)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>cos(x)</strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_cos).toFixed(5)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>tan(x)</strong>
                                </td>
                                <td className="py-2 border-b">
                                  {Number(result?.tech_tan).toFixed(5)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <p className="mt-3 text-[20px]">
                          <strong>{data?.payload?.tech_lang_keys["6"]}</strong>
                        </p>
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-3">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {[2, 3, 4].map((power) =>
                                ["sin", "cos", "tan"].map((func) => (
                                  <tr key={`${func}${power}`}>
                                    <td className="py-2 border-b" width="60%">
                                      {func}
                                      <sup className="text-[14px]">{power}</sup>
                                      (x)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {Number(
                                          result?.[`tech_${func}${power}`]
                                        ).toFixed(5)}
                                      </strong>
                                    </td>
                                  </tr>
                                ))
                              )}
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

export default PowerReducingFormulaCalculator;
