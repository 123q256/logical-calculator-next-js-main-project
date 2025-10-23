"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCylinderVolumeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CylinderVolumeCalculator = () => {
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
    tech_f_height: "3",
    tech_f_height_units: "mm",
    tech_f_radius: "5",
    tech_f_radius_units: "cm",
    tech_s_height: "5",
    tech_s_height_units: "mm",
    tech_external: "15",
    tech_external_units: "m",
    tech_internal: "6",
    tech_internal_units: "mm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCylinderVolumeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_f_height ||
      !formData.tech_f_height_units ||
      !formData.tech_f_radius ||
      !formData.tech_f_radius_units ||
      !formData.tech_s_height ||
      !formData.tech_s_height_units ||
      !formData.tech_external ||
      !formData.tech_external_units ||
      !formData.tech_internal ||
      !formData.tech_internal_units
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_f_height: formData.tech_f_height,
        tech_f_height_units: formData.tech_f_height_units,
        tech_f_radius: formData.tech_f_radius,
        tech_f_radius_units: formData.tech_f_radius_units,
        tech_s_height: formData.tech_s_height,
        tech_s_height_units: formData.tech_s_height_units,
        tech_external: formData.tech_external,
        tech_external_units: formData.tech_external_units,
        tech_internal: formData.tech_internal,
        tech_internal_units: formData.tech_internal_units,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_f_height: "3",
      tech_f_height_units: "mm",
      tech_f_radius: "5",
      tech_f_radius_units: "cm",
      tech_s_height: "5",
      tech_s_height_units: "mm",
      tech_external: "15",
      tech_external_units: "m",
      tech_internal: "6",
      tech_internal_units: "mm",
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
    setFormData((prev) => ({ ...prev, tech_f_height_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_radius_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_s_height_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_external_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_internal_units: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1 mt-2 gap-4">
              <p className="mt-2">
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["1"]}
                </strong>
              </p>
            </div>
            <div className="grid grid-cols-1 mt-4 lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_f_height" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_f_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_f_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_f_height_units} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "yards (yd)", value: "yd" },
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
              <div className="space-y-2">
                <label htmlFor="tech_f_radius" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_f_radius"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_f_radius}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_f_radius_units} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "yards (yd)", value: "yd" },
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
            <div className="grid grid-cols-1 mt-4 gap-4">
              <p className="mt-2">
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["4"]}
                </strong>
              </p>
            </div>
            <div className="grid grid-cols-1 mt-4  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_s_height" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_s_height"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_s_height}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_s_height_units} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "yards (yd)", value: "yd" },
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
              <div className="space-y-2">
                <label htmlFor="tech_external" className="label">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_external"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_external}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_external_units} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "yards (yd)", value: "yd" },
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
              <div className="space-y-2">
                <label htmlFor="tech_internal" className="label">
                  {data?.payload?.tech_lang_keys["6"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_internal"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_internal}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_internal_units} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "miles (mi)", value: "mi" },
                        { label: "yards (yd)", value: "yd" },
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
                      <div className="grid grid-cols-12 gap-2 my-2">
                        <div className="col-span-12 md:cols-span-6 text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="70%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["7"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_vol1).toFixed(2)} cm³
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-3 mb-2 text-[18px]">
                            {data?.payload?.tech_lang_keys["8"]}
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="70%" className="border-b py-2">
                                  mm³ :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_vol1 * 1000).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">dm³ :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_vol1 / 1000).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">m³ :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_vol1 / 1000000).toFixed(
                                    2
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">cu in :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_vol1 * 0.0610237
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">cu ft :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_vol1 * 0.0000353147
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="70%" className="border-b pt-4 pb-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]} :
                                  </strong>
                                </td>
                                <td className="border-b pt-4 pb-2">
                                  {Number(result?.tech_vol2).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-3 mb-2 text-[18px]">
                            {data?.payload?.tech_lang_keys["10"]}
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="70%" className="border-b py-2">
                                  mm³ :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_vol2 * 1000).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">dm³ :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_vol2 / 1000).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">m³ :</td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_vol2 / 1000000).toFixed(
                                    2
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">cu in :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_vol2 * 0.0610237
                                  ).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">cu ft :</td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_vol2 * 0.0000353147
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-span-12 md:cols-span-6">
                          <p className="text-[20px] mt-2">
                            <strong>Solution</strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["12"]}
                          </p>
                          <p className="mt-2">
                            V = <i>πr²h</i>
                          </p>
                          <p className="mt-2">
                            V =
                            <i>
                              {" "}
                              3.14 x {formData?.tech_f_radius}² x{" "}
                              {formData?.tech_f_height}
                            </i>
                          </p>
                          <p className="mt-2">
                            V = {Number(result?.tech_vol1).toFixed(2)} cm³
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["13"]}
                          </p>
                          <p className="mt-2">
                            V = <i>πh(R² - r²)</i>
                          </p>
                          <p className="mt-2">
                            V ={" "}
                            <i>
                              3.14 x {formData?.tech_s_height} (
                              {formData?.tech_external}² -{" "}
                              {formData?.tech_internal}²)
                            </i>{" "}
                          </p>
                          <p className="mt-2">
                            V = {Number(result?.tech_vol2).toFixed(2)} cm³
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

export default CylinderVolumeCalculator;
