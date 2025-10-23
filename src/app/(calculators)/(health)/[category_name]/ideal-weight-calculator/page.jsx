"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useIdealWeightCalculatorMutation,
} from "../../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../../Calculator";
import { getUserCurrency } from "../../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../../components/Calculator/ResetButton";
import Button from "../../../../../components/Calculator/Button";

const IdealBodyWeightCalculator = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const url = segments.slice(-2).join("/");

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
    tech_age: 25,
    tech_gender: "Male", // Male  Female
    tech_height_ft: 5,
    tech_height_in: 9,
    tech_unit_h: "ft/in",
    tech_height_cm: 175,
    tech_unit_h_cm: "cm",
    tech_weight: 158,
    tech_unit: "Ibs",
    tech_unit_ft_in: "cm",
    tech_hidden_nameunit: "ft",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useIdealWeightCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_age ||
      !formData.tech_gender ||
      !formData.tech_weight ||
      !formData.tech_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_weight: formData.tech_weight,
        tech_gender: formData.tech_gender,
        tech_height_ft: formData.tech_height_ft,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_unit: formData.tech_unit,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_hidden_nameunit: formData.tech_hidden_nameunit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_age: 25,
      tech_gender: "Male", // Male  Female
      tech_height_ft: 5,
      tech_height_in: 9,
      tech_unit_h: "ft/in",
      tech_height_cm: 175,
      tech_unit_h_cm: "cm",
      tech_weight: 158,
      tech_unit: "Ibs",
      tech_unit_ft_in: "cm",
      tech_hidden_nameunit: "ft",
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

  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({
      ...prev,
      // tech_unit_h: unit,
      // tech_unit_ft_in: unit, // hidden input bhi update ho jaega

      tech_unit_h: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit, // hidden input update hoga
      //    tech_unit_h_cm: unit.label,
      // tech_unit_ft_in: unit.value,
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys?.["age_year"] || "—"} :
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys?.["1"] || "—"}:
                </label>
                <div className="">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_gender"
                    id="tech_gender"
                    value={formData.tech_gender}
                    onChange={handleChange}
                  >
                    <option value="Male">
                      {data?.payload?.tech_lang_keys?.["male"] || "—"}
                    </option>
                    <option value="Female">
                      {data?.payload?.tech_lang_keys?.["female"] || "—"}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12  gap-4 mt-4">
              <input
                type="hidden"
                step="any"
                name="tech_unit_ft_in"
                id="tech_unit_ft_in"
                className="input my-2"
                aria-label="input"
                value={formData.tech_unit_ft_in}
                onChange={handleChange}
              />
              <div className="col-span-12 lg:col-span-6 flex space-x-2">
                {formData.tech_unit_ft_in == "ft/in" && (
                  <>
                    <div className="w-[50%] ft_in mr-2 ">
                      <label htmlFor="tech_height_ft" className="label">
                        {data?.payload?.tech_lang_keys?.["height"] || "—"}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_height_ft"
                          id="tech_height_ft"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_height_ft}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="w-[50%] ft_in mr-2 mt-1">
                      <label htmlFor="tech_height_in" className="label">
                        &nbsp;
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_height_in"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_height_in}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown}
                        >
                          {formData.tech_unit_h} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              {
                                label: "feet / inches (ft/in)",
                                value: "ft/in",
                              },
                              { label: "centimeters (cm)", value: "cm" },
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
                {formData.tech_unit_ft_in == "cm" && (
                  <>
                    <div className="space-y-2 w-full  h_cm">
                      <label htmlFor="tech_height_cm" className="label">
                        {data?.payload?.tech_lang_keys?.["height"] || "—"} (cm):
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_height_cm"
                          step="any"
                          className="mt-3 input"
                          value={formData.tech_height_cm}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-6"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_unit_h_cm} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              {
                                label: "feet / inches (ft/in)",
                                value: "ft/in",
                              },
                              { label: "centimeters (cm)", value: "cm" },
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
              </div>
              <div className="col-span-12 lg:col-span-6 mt-2">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys?.["1"] || "—"}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "pounds (lbs)", value: "lbs" },
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
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys?.["calculate"] || "—"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.["locale"] || "—" === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
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
                  <ResultActions lang={data?.payload?.tech_lang_keys || "—"} />

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full md:w-[90%] lg:w-[80%] p-3  mt-3">
                      <div className="w-full mx-auto mt-2">
                        <div className=" text-center bordered rounded-lg p-3 bg-sky">
                          <p className="font-s-18">
                            <strong>
                              {data?.payload?.tech_lang_keys?.["4"] || "—"}
                            </strong>
                          </p>
                          <p className="font-s-28">
                            <strong
                              className="text-[#119154]"
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_ans,
                              }}
                            />
                          </p>
                        </div>
                        <div className="w-full overflow-auto mt-2">
                          <table className="w-full" cellSpacing="0">
                            <tbody>
                              <tr>
                                <td className="border-b py-3">
                                  {data?.payload?.tech_lang_keys?.["5"] || "—"}
                                </td>
                                <td className="border-b">
                                  <strong>{result?.tech_abw}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-3">
                                  {data?.payload?.tech_lang_keys?.["6"] || "—"}
                                </td>
                                <td className="border-b">
                                  <strong>{result?.tech_Percent}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-3">
                                  {data?.payload?.tech_lang_keys?.["7"] || "—"}
                                </td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_bsa?.replace(
                                      "M<sup>2</sup>",
                                      "M²"
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-3">
                                  {data?.payload?.tech_lang_keys?.["8"] || "—"}
                                </td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_bmi?.replace(
                                      "m<sup>2</sup>",
                                      "m²"
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3">
                                  {data?.payload?.tech_lang_keys?.["9"] || "—"}
                                </td>
                                <td>
                                  <strong>{result?.tech_lbw}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full overflow-auto mt-4">
                          <table className="w-full" cellSpacing="0">
                            <tbody>
                              <tr className="">
                                <td
                                  colSpan="3"
                                  className="text-center bg-[#2845F5] text-white  rounded-lg px-3 py-2"
                                >
                                  Your Ideal weight according to
                                </td>
                              </tr>
                              {result?.tech_Robinson ? (
                                <>
                                  <tr>
                                    <td className="border-b py-3">
                                      Robinson formula (1983)
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>
                                          {result?.tech_Robinson} kg
                                        </strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Robinson * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="border-b py-3">
                                      Miller formula (1983)
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>
                                          {result?.tech_Miller} kg
                                        </strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Miller * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="border-b py-3">
                                      Devine formula (1974)
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>
                                          {result?.tech_Devine} kg
                                        </strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Devine * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="border-b py-3">
                                      Hamwi formula (1964)
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>{result?.tech_Hamwi} kg</strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Hamwi * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="border-b py-3">
                                      Broca Formula (1871)
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>{result?.tech_Broca} kg</strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Broca * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="border-b py-3">
                                      Lorentz Formula
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>
                                          {result?.tech_Lorentz} kg
                                        </strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Lorentz * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="border-b py-3">
                                      Peterson formula (2016)
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>
                                          {result?.tech_Peterson} kg
                                        </strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Peterson * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="border-b py-3">
                                      Lemmens Formula (2005)
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>
                                          {result?.tech_Lemmens} kg
                                        </strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Lemmens * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="py-3">BMI Method</td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td>
                                        <strong>{result?.tech_BMI1}</strong>
                                      </td>
                                    ) : (
                                      <td>
                                        <strong>{result?.tech_BMI2}</strong>
                                      </td>
                                    )}
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td className="border-b py-3">
                                      Intuitive Formula
                                    </td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td className="border-b">
                                        <strong>
                                          {result?.tech_Intuitive} kg
                                        </strong>
                                      </td>
                                    ) : (
                                      <td className="border-b">
                                        <strong>
                                          {Number(
                                            result?.tech_Intuitive * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
                                  </tr>
                                  <tr>
                                    <td className="py-3">Baseline Formula</td>
                                    {formData?.tech_unit == "kg" ? (
                                      <td>
                                        <strong>
                                          {result?.tech_Baseline} kg
                                        </strong>
                                      </td>
                                    ) : (
                                      <td>
                                        <strong>
                                          {Number(
                                            result?.tech_Baseline * 2.205
                                          ).toFixed(2)}{" "}
                                          lbs
                                        </strong>
                                      </td>
                                    )}
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

export default IdealBodyWeightCalculator;
