"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useFabricCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FabricCalculator = () => {
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
    tech_fabric: "5",
    tech_fabric_unit: "cm",
    tech_width: "5",
    tech_width_unit: "cm",
    tech_length: "5",
    tech_length_unit: "cm",
    tech_piece: "4",
    tech_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFabricCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_fabric ||
      !formData.tech_fabric_unit ||
      !formData.tech_width ||
      !formData.tech_width_unit ||
      !formData.tech_length ||
      !formData.tech_length_unit ||
      !formData.tech_piece ||
      !formData.tech_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_fabric: formData.tech_fabric,
        tech_fabric_unit: formData.tech_fabric_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_piece: formData.tech_piece,
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
      tech_fabric: "5",
      tech_fabric_unit: "cm",
      tech_width: "5",
      tech_width_unit: "cm",
      tech_length: "5",
      tech_length_unit: "cm",
      tech_piece: "4",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fabric_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-12 md:col-span-12">
                    <label htmlFor="tech_fabric" className="label">
                      {data?.payload?.tech_lang_keys["1"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fabric"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_fabric}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_fabric_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "kilometers (km)", value: "km" },
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
                  <div className="col-span-12 md:col-span-12">
                    <label htmlFor="tech_width" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
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
                        {formData.tech_width_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "kilometers (km)", value: "km" },
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
                  <div className="col-span-12 md:col-span-12">
                    <label htmlFor="tech_length" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
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
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_length_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "meters (m)", value: "m" },
                            { label: "inches (in)", value: "in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "kilometers (km)", value: "km" },
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
                  <div className="col-span-12 md:col-span-12">
                    <label htmlFor="tech_piece" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_piece"
                        id="tech_piece"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_piece}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-12">
                    <label htmlFor="tech_unit" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
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
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="km">km</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                        <option value="yd">yd</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 flex items-center justify-center">
                <img
                  src="/images/fabric_new.webp"
                  alt="Fabric"
                  className="max-width"
                  width="260px"
                  height="260px"
                />
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto text-[16px]">
                          <p className="text-[20px] mt-3 mb-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["6"]}
                            </strong>
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["7"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_answer + result?.tech_unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b pt-4 pb-2">
                                  {data?.payload?.tech_lang_keys["8"]} :
                                </td>
                                <td className="border-b pt-4 pb-2">
                                  {result?.tech_down}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["9"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_across}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <p className="text-[20px] my-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["10"]}
                            </strong>
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["11"]}.
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["9"]} ={" "}
                            {data?.payload?.tech_lang_keys["1"]} /{" "}
                            {data?.payload?.tech_lang_keys["2"]}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["9"]} ={" "}
                            {result?.tech_fabric} /{result?.tech_width}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["9"]} ={" "}
                            {result?.tech_across}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["12"]}.
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["8"]} ={" "}
                            {data?.payload?.tech_lang_keys["4"]} /{" "}
                            {data?.payload?.tech_lang_keys["9"]}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["8"]} ={" "}
                            {result?.tech_piece} / {result?.tech_across}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["8"]} ={" "}
                            {result?.tech_down}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["13"]}.
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["14"]} ={" "}
                            {data?.payload?.tech_lang_keys["3"]} *
                            {data?.payload?.tech_lang_keys["8"]}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["14"]} ={" "}
                            {result?.tech_length} * {result?.tech_down}
                          </p>
                          <p className="my-2">
                            {data?.payload?.tech_lang_keys["14"]} ={" "}
                            {result?.tech_answer}
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

export default FabricCalculator;
