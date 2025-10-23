"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVolumeOfCapsuleMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VolumeOfCapsuleCalculator = () => {
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
    tech_choose: "a_r", // a_r    v_r   s_r    c_a
    tech_first: "15",
    tech_first_unit: "mm",
    tech_second: "15",
    tech_second_unit: "mm",
    tech_pi_val: "3.14159265359",
    tech_units: "mm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVolumeOfCapsuleMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_choose) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_choose: formData.tech_choose,
        tech_first: formData.tech_first,
        tech_first_unit: formData.tech_first_unit,
        tech_second: formData.tech_second,
        tech_second_unit: formData.tech_second_unit,
        tech_pi_val: formData.tech_pi_val,
        tech_units: formData.tech_units,
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
      tech_choose: "a_r", // a_r    v_r   s_r    c_a
      tech_first: "15",
      tech_first_unit: "mm",
      tech_second: "15",
      tech_second_unit: "mm",
      tech_pi_val: "3.14159265359",
      tech_units: "mm",
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
    setFormData((prev) => ({ ...prev, tech_first_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_second_unit: unit }));
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

          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-5">
              <div className="md:col-span-6 col-span-12">
                <div className="grid grid-cols-12 mt-3 gap-2">
                  <div className="col-span-12">
                    <label htmlFor="tech_choose" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_choose"
                        id="tech_choose"
                        value={formData.tech_choose}
                        onChange={handleChange}
                      >
                        <option value="a_r">
                          {data?.payload?.tech_lang_keys["2"]} V, S, C |{" "}
                          {data?.payload?.tech_lang_keys["3"]} r, a{" "}
                        </option>
                        <option value="v_r">
                          {data?.payload?.tech_lang_keys["2"]} a, S, C |{" "}
                          {data?.payload?.tech_lang_keys["3"]} r, V{" "}
                        </option>
                        <option value="s_r">
                          {data?.payload?.tech_lang_keys["2"]} a, V, C |{" "}
                          {data?.payload?.tech_lang_keys["3"]} r, S{" "}
                        </option>
                        <option value="c_a">
                          {data?.payload?.tech_lang_keys["2"]} r, V, S |{" "}
                          {data?.payload?.tech_lang_keys["3"]} a, C{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12">
                    {formData?.tech_choose === "c_a" ? (
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys[5]} (a)
                      </label>
                    ) : (
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys[4]} (r)
                      </label>
                    )}
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_first"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_first}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_first_unit} ▾
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
                  <div className="col-span-12">
                    {formData?.tech_choose === "c_a" ? (
                      <label htmlFor="tech_second" className="label">
                        {data?.payload?.tech_lang_keys[10]} (C)
                      </label>
                    ) : formData?.tech_choose === "v_r" ? (
                      <label htmlFor="tech_second" className="label">
                        {data?.payload?.tech_lang_keys[8]} (V)
                      </label>
                    ) : formData?.tech_choose === "s_r" ? (
                      <label htmlFor="tech_second" className="label">
                        {data?.payload?.tech_lang_keys[9]} (S)
                      </label>
                    ) : (
                      <label htmlFor="tech_second" className="label">
                        {data?.payload?.tech_lang_keys[5]} (a)
                      </label>
                    )}
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_second"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_second}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_second_unit} ▾
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
                  <div className="col-span-12">
                    <label htmlFor="tech_pi_val" className="label">
                      {data?.payload?.tech_lang_keys["6"]} π
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_pi_val"
                        id="tech_pi_val"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_pi_val}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-6 col-span-12">
                <div className="grid grid-cols-12 mt-3   gap-2 ">
                  <div className=" col-span-12 text-center mt-3 items-center justify-center hidden md:block">
                    <img
                      src="/images/new_volume-cap.webp"
                      height="100%"
                      width="80%"
                      alt="Volume of a Rectangular Prism Image"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="tech_units" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_units"
                        id="tech_units"
                        value={formData.tech_units}
                        onChange={handleChange}
                      >
                        <option value="mm">mm </option>
                        <option value="m">m </option>
                        <option value="km">km </option>
                        <option value="in">in </option>
                        <option value="ft">ft </option>
                        <option value="yd">yd </option>
                        <option value="mi">mi </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 text-center mt-3 flex items-center justify-center md:hidden">
                    <img
                      src="/images/new_volume-cap.webp"
                      height="100%"
                      width="50%"
                      alt="Volume of a Rectangular Prism Image"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_volume} {formData?.tech_units}³
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_surface} {formData?.tech_units}²
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_circumference}{" "}
                                  {formData?.tech_units}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_radius} {formData?.tech_units}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_side} {formData?.tech_units}
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

export default VolumeOfCapsuleCalculator;
