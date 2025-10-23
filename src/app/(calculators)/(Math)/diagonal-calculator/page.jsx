"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDiagonalCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DiagonalCalculator = () => {
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
    tech_given: "1", // 1 2 3 4 5 6 7 8
    tech_ls: "12",
    tech_ls_unit: "cm",
    tech_ss: "2",
    tech_ss_unit: "cm",
    tech_area: "3",
    tech_area_unit: "cm²",
    tech_perimeter: "140",
    tech_perimeter_unit: "cm",
    tech_angle: "120",
    tech_angle_unit: "deg",
    tech_circum: "1",
    tech_circum_unit: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDiagonalCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_given) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_given: formData.tech_given,
        tech_ls: formData.tech_ls,
        tech_ls_unit: formData.tech_ls_unit,
        tech_ss: formData.tech_ss,
        tech_ss_unit: formData.tech_ss_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_perimeter: formData.tech_perimeter,
        tech_perimeter_unit: formData.tech_perimeter_unit,
        tech_angle: formData.tech_angle,
        tech_angle_unit: formData.tech_angle_unit,
        tech_circum: formData.tech_circum,
        tech_circum_unit: formData.tech_circum_unit,
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
      tech_given: "1", // 1 2 3 4 5 6 7 8
      tech_ls: "12",
      tech_ls_unit: "cm",
      tech_ss: "2",
      tech_ss_unit: "cm",
      tech_area: "3",
      tech_area_unit: "cm²",
      tech_perimeter: "140",
      tech_perimeter_unit: "cm",
      tech_angle: "120",
      tech_angle_unit: "deg",
      tech_circum: "1",
      tech_circum_unit: "deg",
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
    setFormData((prev) => ({ ...prev, tech_ls_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ss_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_perimeter_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_circum_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-7">
                <div className="col-span-12">
                  <label htmlFor="tech_given" className="label">
                    Given:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_given"
                      id="tech_given"
                      value={formData.tech_given}
                      onChange={handleChange}
                    >
                      <option value="1">Longer (l) & Shorter Side (w)</option>
                      <option value="2">Longer (l) Side & Area</option>
                      <option value="3">Longer (l) Side & Perimeter</option>
                      <option value="4">Longer (l) Side & Angle (α)</option>
                      <option value="5">Shorter Side (w) & Area</option>
                      <option value="6">Shorter Side (w) & Perimeter</option>
                      <option value="7">Shorter Side (w) & Angle (α)</option>
                      <option value="8">Circumcircle radius (r)</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-12">
                  {(formData.tech_given == "1" ||
                    formData.tech_given == "2" ||
                    formData.tech_given == "3" ||
                    formData.tech_given == "4") && (
                    <>
                      <div className="col-12 mt-0 mt-lg-2  lsInput">
                        <label htmlFor="tech_ls" className="label">
                          {data?.payload?.tech_lang_keys["1"]} (I)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_ls"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_ls}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_ls_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "millimeters (mm)", value: "mm" },
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "kilometers (km)", value: "km" },
                                { label: "inches (in)", value: "in" },
                                { label: "feets (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
                                { label: "miles (mi)", value: "mi" },
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
                  {(formData.tech_given == "1" ||
                    formData.tech_given == "5" ||
                    formData.tech_given == "6" ||
                    formData.tech_given == "7") && (
                    <>
                      <div className="col-12 mt-0 mt-lg-2 ssInput">
                        <label htmlFor="tech_ss" className="label">
                          {data?.payload?.tech_lang_keys["2"]} (w)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_ss"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_ss}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_ss_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "millimeters (mm)", value: "mm" },
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "kilometers (km)", value: "km" },
                                { label: "inches (in)", value: "in" },
                                { label: "feets (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
                                { label: "miles (mi)", value: "mi" },
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
                  {(formData.tech_given == "2" ||
                    formData.tech_given == "5") && (
                    <>
                      <div className="col-12 mt-0 mt-lg-2  areaInput">
                        <label htmlFor="tech_area" className="label">
                          {data?.payload?.tech_lang_keys["3"]} (A)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_area"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_area}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_area_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: "square millimeters (mm²)",
                                  value: "mm²",
                                },
                                {
                                  label: "square centimeters (cm²)",
                                  value: "cm²",
                                },
                                { label: "square meters (m²)", value: "m²" },
                                {
                                  label: "square kilometers (km²)",
                                  value: "km²",
                                },
                                { label: "square inches (in²)", value: "in²" },
                                { label: "square feets (ft²)", value: "ft²" },
                                { label: "square yards (yd²)", value: "yd²" },
                                { label: "square miles (mi²)", value: "mi²" },
                                { label: "(a)", value: "a" },
                                { label: "(da)", value: "da" },
                                { label: "(ha)", value: "ha" },
                                { label: "(ac)", value: "ac" },
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
                    </>
                  )}
                  {(formData.tech_given == "3" ||
                    formData.tech_given == "6") && (
                    <>
                      <div className="col-12 mt-0 mt-lg-2  perimeterInput">
                        <label htmlFor="tech_perimeter" className="label">
                          {data?.payload?.tech_lang_keys["4"]} (P)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_perimeter"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_perimeter}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_perimeter_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "millimeters (mm)", value: "mm" },
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "kilometers (km)", value: "km" },
                                { label: "inches (in)", value: "in" },
                                { label: "feets (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
                                { label: "miles (mi)", value: "mi" },
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
                    </>
                  )}
                  {(formData.tech_given == "4" ||
                    formData.tech_given == "7") && (
                    <>
                      <div className="col-12 mt-0 mt-lg-2 angleInput">
                        <label htmlFor="tech_angle" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (α)
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
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_angle_unit} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "degrees (deg)", value: "deg" },
                                { label: "radians (rad)", value: "rad" },
                                { label: "gradians (gon)", value: "gon" },
                                { label: "* π rad (pirad)", value: "pirad" },
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
                    </>
                  )}
                  {formData.tech_given == "8" && (
                    <>
                      <div className="col-12 mt-0 mt-lg-2  circumInput">
                        <label htmlFor="tech_circum" className="label">
                          {data?.payload?.tech_lang_keys["6"]} (r)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_circum"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_circum}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown5}
                          >
                            {formData.tech_circum_unit} ▾
                          </label>
                          {dropdownVisible5 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "millimeters (mm)", value: "mm" },
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "kilometers (km)", value: "km" },
                                { label: "inches (in)", value: "in" },
                                { label: "feets (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
                                { label: "miles (mi)", value: "mi" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler5(unit.value)}
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
              <div className="col-span-12 md:col-span-5 flex items-center text-center">
                <img
                  src="/images/diagonal.webp"
                  height="180px"
                  width="100%"
                  alt="trianle details image"
                  loading="lazy"
                  decoding="async"
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                        <div className="w-full md:w-[80%] lg:w-[80%] mt-2">
                          <table className="w-full font-s-18">
                            <tbody>
                              {result?.tech_lsv != "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[1]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_lsv).toFixed(3)} cm
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_ssv != "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[2]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_ssv).toFixed(3)} cm
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_area != "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[3]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(3)} cm²
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_perimeter != "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[4]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_perimeter).toFixed(
                                        3
                                      )}{" "}
                                      cm
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_radius != "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[6]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_radius).toFixed(3)}{" "}
                                      cm
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_angle_α != "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[8]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_angle_α).toFixed(3)}{" "}
                                      rad
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_diagonal != "" && (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[7]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_diagonal).toFixed(3)}{" "}
                                      rad
                                    </td>
                                  </tr>
                                </>
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

export default DiagonalCalculator;
