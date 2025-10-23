"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBlindSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BlindSizeCalculator = () => {
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
    tech_type: "inside", // outside  inside
    tech_top: "31",
    tech_t_units: "in",
    tech_width: "31",
    tech_w_units: "mm",
    tech_bottom: "42",
    tech_b_units: "ft",
    tech_h_left: "42",
    tech_l_units: "cm",
    tech_h_center: "50",
    tech_c_units: "mm",
    tech_h_right: "50",
    tech_r_units: "in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBlindSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_type ||
      !formData.tech_top ||
      !formData.tech_t_units ||
      !formData.tech_width ||
      !formData.tech_w_units ||
      !formData.tech_bottom ||
      !formData.tech_b_units ||
      !formData.tech_h_left ||
      !formData.tech_l_units ||
      !formData.tech_h_center ||
      !formData.tech_c_units ||
      !formData.tech_h_right ||
      !formData.tech_r_units
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_top: formData.tech_top,
        tech_t_units: formData.tech_t_units,
        tech_width: formData.tech_width,
        tech_w_units: formData.tech_w_units,
        tech_bottom: formData.tech_bottom,
        tech_b_units: formData.tech_b_units,
        tech_h_left: formData.tech_h_left,
        tech_l_units: formData.tech_l_units,
        tech_h_center: formData.tech_h_center,
        tech_c_units: formData.tech_c_units,
        tech_h_right: formData.tech_h_right,
        tech_r_units: formData.tech_r_units,
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
      tech_type: "inside", // outside  inside
      tech_top: "31",
      tech_t_units: "in",
      tech_width: "31",
      tech_w_units: "mm",
      tech_bottom: "42",
      tech_b_units: "ft",
      tech_h_left: "42",
      tech_l_units: "cm",
      tech_h_center: "50",
      tech_c_units: "mm",
      tech_h_right: "50",
      tech_r_units: "in",
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
    setFormData((prev) => ({ ...prev, tech_t_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_w_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_b_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_l_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c_units: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_r_units: unit }));
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-12">
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
                        <option value="inside">
                          {data?.payload?.tech_lang_keys["12"]}
                        </option>
                        <option value="outside">
                          {data?.payload?.tech_lang_keys["13"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_top" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_top"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_top}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_t_units} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
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
                  <div className="col-span-12">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_width"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_width}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_w_units} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
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
                  <div className="col-span-12">
                    <label htmlFor="tech_bottom" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_bottom"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_bottom}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_b_units} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inches (in)", value: "in" },
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
                  <div className="col-span-12">
                    <label htmlFor="tech_h_left" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_h_left"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_h_left}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_l_units} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inches (in)", value: "in" },
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
                </div>
              </div>
              <div className="col-span-6">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-12">
                    <img
                      className="max-width mt-lg-5"
                      src="/images/blind_size.webp"
                      alt="Blind"
                      width="300px"
                      height="200px"
                    />
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_h_center" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_h_center"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_h_center}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_c_units} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inches (in)", value: "in" },
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
                  <div className="col-span-12">
                    <label htmlFor="tech_h_right" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_h_right"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_h_right}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_r_units} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inches (in)", value: "in" },
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
                </div>
              </div>
              <div className="col-span-12"></div>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mt-2">
                        <div className="w-full md:w-[60%] lg:w-[60%] text-[18px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_blind_width} in
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {result?.tech_type == "inside" && (
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td width="60%" className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {Number(result?.tech_s_lenght).toFixed(2)}{" "}
                                    in
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}

                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_blind_lenght).toFixed(2)}{" "}
                                  in
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full md:w-[60%] lg:w-[60%] font-s-18">
                          <p className="text-[20px] text-center mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["11"]}
                            </strong>
                          </p>

                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_blind_width * 25.4
                                  ).toFixed(3)}{" "}
                                  mm
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_blind_width * 2.54
                                  ).toFixed(3)}{" "}
                                  cm
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["8"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_blind_width / 12
                                  ).toFixed(3)}{" "}
                                  ft
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <table className="w-full mt-3">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_blind_lenght * 25.4} mm
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_blind_lenght * 2.54} cm
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_blind_lenght / 12
                                  ).toFixed(3)}{" "}
                                  ft
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

export default BlindSizeCalculator;
