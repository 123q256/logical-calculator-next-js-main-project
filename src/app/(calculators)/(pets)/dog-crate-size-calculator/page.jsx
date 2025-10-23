"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useDogCrateSizeCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DogCrateSizeCalculator = () => {
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
    tech_height: "3",
    tech_h_units: "cm",
    tech_length: "3",
    tech_l_units: "cm",
    tech_extra_lenght: "5.1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    DogCrateSizeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useDogCrateSizeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_height ||
      !formData.tech_h_units ||
      !formData.tech_length ||
      !formData.tech_l_units ||
      !formData.tech_extra_lenght
    ) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await DogCrateSizeCalculator({
        tech_height: formData.tech_height,
        tech_h_units: formData.tech_h_units,
        tech_length: formData.tech_length,
        tech_l_units: formData.tech_l_units,
        tech_extra_lenght: formData.tech_extra_lenght,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating.");
      toast.error("Error calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_height: "",
      tech_h_units: "cm",
      tech_length: "",
      tech_l_units: "cm",
      tech_extra_lenght: "5.1",
    });
    setResult(null);
    setFormError(null);
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_h_units: unit }));
    setDropdownVisible(false);
  };
  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_l_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible);
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <div className="col-span-12">
                  <p className="label mb-3">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </p>
                  <label
                    htmlFor="tech_height"
                    className="label"
                    id="textChanged"
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_height"
                      step="any"
                      className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                      value={formData.tech_height}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-5"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_h_units} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "meters (m)", value: "m" },
                          { label: "feets (ft)", value: "ft" },
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
                  <p className="label">{data?.payload?.tech_lang_keys["3"]}:</p>
                  <label
                    htmlFor="tech_length"
                    className="label"
                    id="textChanged"
                  >
                    {data?.payload?.tech_lang_keys["4"]}
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_length"
                      step="any"
                      className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                      value={formData.tech_length}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-5"
                      onClick={toggleDropdown1}
                    >
                      {formData.tech_l_units} ▾
                    </label>
                    {dropdownVisible1 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
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
              <div className="space-y-2">
                <img
                  src="/images/all_calculators/dogs-two.png"
                  className="max-width"
                  alt="Dog Crate"
                  width="300px"
                  height="180px"
                />
                <label htmlFor="tech_extra_lenght" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className=" py-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_extra_lenght"
                    id="tech_extra_lenght"
                    value={formData.tech_extra_lenght}
                    onChange={handleChange}
                  >
                    <option value="5.1">2 in/5.1 cm (small dog)</option>
                    <option value="7.6">3 in/7.6 cm (medium dog)</option>
                    <option value="10.2">4 in/10.2 cm (big dog)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDogLoading}>
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
        {calculateDogLoading ? (
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
                    <div className="w-full bg-light-blue p-2 rounded-lg mt-2">
                      <div className="mt-4">
                        <p className="text-lg mt-2 mb-2 font-bold">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                          {data?.payload?.tech_lang_keys["10"]}
                        </p>

                        {/* First table */}
                        <table className="text-base mb-6 w-full lg:w-1/2 overflow-auto">
                          <tbody>
                            <tr>
                              <td className="border-b py-2 w-3/4">
                                {data?.payload?.tech_lang_keys["10"]}:
                              </td>
                              <td className="border-b py-2">
                                {result?.tech_c_height} cm
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="text-lg mt-2 mb-2 font-bold">
                          {data?.payload?.tech_lang_keys["9"]}{" "}
                          {data?.payload?.tech_lang_keys["11"]}
                        </p>

                        {/* Second table */}
                        <table className="text-base mb-2 w-full lg:w-1/2 overflow-auto">
                          <tbody>
                            <tr>
                              <td className="border-b py-2 w-3/4">
                                {data?.payload?.tech_lang_keys["11"]}:
                              </td>
                              <td className="border-b py-2">
                                {result?.tech_c_lenght} cm
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="text-lg font-bold mb-2">
                          {data?.payload?.tech_lang_keys["12"]}
                        </p>

                        {/* Third table (already correct with tbody) */}
                        <div className="overflow-auto w-full lg:w-1/2 text-base">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["10"]} (
                                  {data?.payload?.tech_lang_keys["13"]}):
                                </td>
                                <td className="border-b py-2">
                                  {(result?.tech_c_height * 0.01).toFixed(2)} m
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["11"]} (
                                  {data?.payload?.tech_lang_keys["13"]}):
                                </td>
                                <td className="border-b py-2">
                                  {(result?.tech_c_lenght * 0.01).toFixed(2)} m
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["10"]} (
                                  {data?.payload?.tech_lang_keys["10"]}):
                                </td>
                                <td className="border-b py-2">
                                  {(result?.tech_c_height * 0.3937).toFixed(3)}{" "}
                                  in
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["11"]} (
                                  {data?.payload?.tech_lang_keys["10"]}):
                                </td>
                                <td className="border-b py-2">
                                  {(result?.tech_c_lenght * 0.3937).toFixed(3)}{" "}
                                  in
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["10"]} (
                                  {data?.payload?.tech_lang_keys["15"]}):
                                </td>
                                <td className="border-b py-2">
                                  {(result?.tech_c_height * 0.03281).toFixed(4)}{" "}
                                  ft
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["11"]} (
                                  {data?.payload?.tech_lang_keys["15"]}):
                                </td>
                                <td className="border-b py-2">
                                  {(result?.tech_c_lenght * 0.03281).toFixed(4)}{" "}
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

export default DogCrateSizeCalculator;
