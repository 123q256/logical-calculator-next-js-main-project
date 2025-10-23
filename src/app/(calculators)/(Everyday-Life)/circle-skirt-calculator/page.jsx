"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCircleSkirtCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CircleSkirtCalculator = () => {
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
    tech_type: "full", // three-quarter  quarter  half  full
    tech_waist: "12",
    tech_waist_unit: "cm",
    tech_length: "4",
    tech_length_unit: "ft",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCircleSkirtCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type || !formData.tech_waist) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_waist: formData.tech_waist,
        tech_waist_unit: formData.tech_waist_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
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
      tech_type: "full", // three-quarter  quarter  half  full
      tech_waist: "12",
      tech_waist_unit: "cm",
      tech_length: "4",
      tech_length_unit: "ft",
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
    setFormData((prev) => ({ ...prev, tech_waist_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="lg:col-lg-6 md:col-lg-6 col-lg-12">
                <div className="col-12 px-2 mt-0 mt-lg-2">
                  <label htmlFor="tech_type" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_type"
                      id="tech_type"
                      value={formData.tech_type}
                      onChange={handleChange}
                    >
                      <option value="full">
                        {data?.payload?.tech_lang_keys["2"]}
                      </option>
                      <option value="three-quarter">
                        {data?.payload?.tech_lang_keys["3"]}{" "}
                      </option>
                      <option value="half">
                        {data?.payload?.tech_lang_keys["4"]}{" "}
                      </option>
                      <option value="quarter">
                        {data?.payload?.tech_lang_keys["5"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="col-12 px-2 mt-0 mt-lg-2">
                  <label htmlFor="tech_waist" className="label">
                    {data?.payload?.tech_lang_keys["6"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_waist"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_waist}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_waist_unit} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "meters (m)", value: "m" },
                          { label: "feet (ft)", value: "ft" },
                          { label: "inches (in)", value: "in" },
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
                <div className="col-12 px-2 mt-0 mt-lg-2">
                  <label htmlFor="tech_length" className="label">
                    {data?.payload?.tech_lang_keys["4"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_length"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_length}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown1}
                    >
                      {formData.tech_length_unit} ▾
                    </label>
                    {dropdownVisible1 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "meters (m)", value: "m" },
                          { label: "feet (ft)", value: "ft" },
                          { label: "inches (in)", value: "in" },
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
              </div>
              <div className="lg:col-lg-6 md:col-lg-6 col-lg-12 text-center">
                {formData.tech_type == "full" && (
                  <>
                    <img
                      src="/images/full.svg"
                      alt="skirt"
                      className="set_img max-width"
                      width="230px"
                      height="260px"
                    />
                  </>
                )}
                {formData.tech_type == "three-quarter" && (
                  <>
                    <img
                      src="/images/three-quarter.svg"
                      alt="skirt"
                      className="set_img max-width"
                      width="230px"
                      height="260px"
                    />
                  </>
                )}
                {formData.tech_type == "half" && (
                  <>
                    <img
                      src="/images/half.svg"
                      alt="skirt"
                      className="set_img max-width"
                      width="230px"
                      height="260px"
                    />
                  </>
                )}
                {formData.tech_type == "quarter" && (
                  <>
                    <img
                      src="/images/quarter.svg"
                      alt="skirt"
                      className="set_img max-width"
                      width="230px"
                      height="260px"
                    />
                  </>
                )}
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
                      <div className="w-full mt-3">
                        <p className="text-[18px] mt-2">
                          <strong>{data?.payload?.tech_lang_keys["8"]}</strong>
                        </p>
                        <div className="w-full md:w-[60%] lg:w-[60%] text-[20px} overflow-auto my-3">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["10"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_radius_cm}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["11"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_radius_mm}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["12"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_radius_m}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["13"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_radius_in}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_radius_ft}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[20px] mt-2">
                          <strong>{data?.payload?.tech_lang_keys["9"]}</strong>
                        </p>
                        <div className="w-full md:w-[60%] lg:w-[60%] font-s-18 overflow-auto mt-2">
                          <table className="w-full lg:text-[18px] md:text-[18px] text-[16px]">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["10"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_fabric_length_cm}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["11"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_fabric_length_mm}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["12"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_fabric_length_m}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["13"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_fabric_length_in}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["14"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_fabric_length_ft}
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

export default CircleSkirtCalculator;
