"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useHemisphereCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HemisphereCalculator = () => {
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
    tech_to_calculate: "rad", // rad vol  tsa csa   cf
    tech_value: 5,
    tech_unit: "cm",
    tech_rof: 8,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHemisphereCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_to_calculate) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_to_calculate: formData.tech_to_calculate,
        tech_value: formData.tech_value,
        tech_unit: formData.tech_unit,
        tech_rof: formData.tech_rof,
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
      tech_to_calculate: "rad", // rad vol  tsa csa   cf
      tech_value: 5,
      tech_unit: "cm",
      tech_rof: 8,
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
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
              <div className="col-span-12">
                <label htmlFor="tech_to_calculate" className="label">
                  {data?.payload?.tech_lang_keys["know"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_to_calculate"
                    id="tech_to_calculate"
                    value={formData.tech_to_calculate}
                    onChange={handleChange}
                  >
                    <option value="rad">
                      {data?.payload?.tech_lang_keys["rad"]}
                    </option>
                    <option value="tsa">
                      {data?.payload?.tech_lang_keys["tsa"]}
                    </option>
                    <option value="vol">
                      {data?.payload?.tech_lang_keys["vol"]}
                    </option>
                    <option value="csa">
                      {data?.payload?.tech_lang_keys["cfa"]}
                    </option>
                    <option value="cf">
                      {data?.payload?.tech_lang_keys["bc"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_value" className="label">
                  {formData.tech_to_calculate == "tsa"
                    ? data?.payload?.tech_lang_keys["tsa"]
                    : formData.tech_to_calculate == "vol"
                    ? data?.payload?.tech_lang_keys["vol"]
                    : formData.tech_to_calculate == "csa"
                    ? data?.payload?.tech_lang_keys["cfa"]
                    : formData.tech_to_calculate == "cf"
                    ? data?.payload?.tech_lang_keys["bc"]
                    : data?.payload?.tech_lang_keys["rad"]}
                </label>

                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_value"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_value}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
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
              <div className="col-span-6">
                <label htmlFor="tech_rof" className="label">
                  {data?.payload?.tech_lang_keys["round"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_rof"
                    id="tech_rof"
                    value={formData.tech_rof}
                    onChange={handleChange}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
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

                  <div className="rounded-lg flex items-center ">
                    <div className="w-full lg:w-[60%] md:w-[90%] rounded-lg mt-3">
                      <div className=" flex-col space-y-3">
                        <div className="w-full mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["rad"]}
                                </td>
                                <td className="py-2 border-b border-gray-300">
                                  {result?.tech_radi}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["bc"]}
                                </td>
                                <td className="py-2 border-b border-gray-300">
                                  {result?.tech_cs}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["vol"]}
                                </td>
                                <td
                                  className="py-2 border-b border-gray-300"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_vs,
                                  }}
                                />
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["cfa"]}
                                </td>
                                <td
                                  className="py-2 border-b border-gray-300"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_as,
                                  }}
                                />
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["bsa"]}
                                </td>
                                <td
                                  className="py-2 border-b border-gray-300"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_as,
                                  }}
                                />
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["tsa"]}
                                </td>
                                <td
                                  className="py-2 border-b border-gray-300"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_tsas,
                                  }}
                                />
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 text-lg">
                          <strong>In terms of Pi π</strong>
                        </p>
                        <div className="w-full mt-3 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["bc"]}
                                </td>
                                <td className="py-2 border-b border-gray-300">
                                  {result?.tech_pcs}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["vol"]}
                                </td>
                                <td
                                  className="py-2 border-b border-gray-300"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_pvs,
                                  }}
                                />
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["cfa"]}
                                </td>
                                <td
                                  className="py-2 border-b border-gray-300"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_pas,
                                  }}
                                />
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["bsa"]}
                                </td>
                                <td
                                  className="py-2 border-b border-gray-300"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_pbs,
                                  }}
                                />
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-gray-300 ">
                                  {data?.payload?.tech_lang_keys["tsa"]}
                                </td>
                                <td
                                  className="py-2 border-b border-gray-300"
                                  dangerouslySetInnerHTML={{
                                    __html: result.tech_ptsas,
                                  }}
                                />
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

export default HemisphereCalculator;
