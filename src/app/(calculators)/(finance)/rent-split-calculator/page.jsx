"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useRentSplitCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RentSplitCalculator = () => {
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
    tech_total_rent: 1000, // Total rent for the house
    tech_total_area: 1200, // Total area of the house (in square feet)
    tech_bedrooms: 2, // Number of bedrooms
    tech_room_area: [350, 275], // Areas of each room (array of room areas)
    tech_persons: [5, 3], // Number of persons sharing each room (array of persons per room)
    tech_bath: [100, 100], // Areas of bathrooms (array of bathroom areas)
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRentSplitCalculatorMutation();

  const handleChange = (e, field, index) => {
    let value = e.target.value;

    // Convert to number for numeric fields
    if (["tech_room_area", "tech_persons", "tech_bath"].includes(field)) {
      value = Number(value);
    }

    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;

      return {
        ...prev,
        [field]: updatedArray,
      };
    });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_total_rent ||
      !formData.tech_total_area ||
      !formData.tech_bedrooms ||
      !formData.tech_room_area ||
      !formData.tech_persons ||
      !formData.tech_bath
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_total_rent: formData.tech_total_rent,
        tech_total_area: formData.tech_total_area,
        tech_bedrooms: formData.tech_bedrooms,
        tech_room_area: formData.tech_room_area,
        tech_persons: formData.tech_persons,
        tech_bath: formData.tech_bath,
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
      tech_total_rent: 1000, // Total rent for the house
      tech_total_area: 1200, // Total area of the house (in square feet)
      tech_bedrooms: 2, // Number of bedrooms
      tech_room_area: [350, 275], // Areas of each room (array of room areas)
      tech_persons: [5, 3], // Number of persons sharing each room (array of persons per room)
      tech_bath: [100, 100], // Areas of bathrooms (array of bathroom areas)
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_total_rent" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_total_rent"
                    id="tech_total_rent"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_total_rent}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_total_area" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_total_area"
                    id="tech_total_area"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_total_area}
                    onChange={handleChange}
                  />
                  <span className="input_unit text-blue">
                    ft<sup>2</sup>
                  </span>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_bedrooms" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_bedrooms"
                    id="tech_bedrooms"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_bedrooms}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 overflow-x-auto">
                <table className="lg-[100%] md:w-[100%]" width={400} id="rooms">
                  <thead>
                    <tr>
                      <td className="text-center" width="10%">
                        <strong>{data?.payload?.tech_lang_keys[15]} #</strong>
                      </td>
                      <td className="text-center" width="30%">
                        <strong>
                          {data?.payload?.tech_lang_keys[16]} (ft<sup>2</sup>)
                        </strong>
                      </td>
                      <td className="text-center" width="30%">
                        <strong>{data?.payload?.tech_lang_keys[17]}</strong>
                      </td>
                      <td className="text-center" width="30%">
                        <strong>{data?.payload?.tech_lang_keys[18]}</strong>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.tech_room_area.map((_, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_room_area"
                              className="input "
                              aria-label="room-area"
                              value={formData.tech_room_area[index]}
                              onChange={(e) =>
                                handleChange(e, "tech_room_area", index)
                              }
                            />
                            <span className="input_unit text-blue">
                              ft<sup>2</sup>
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_persons"
                              className="input my-2"
                              aria-label="persons"
                              value={formData.tech_persons[index]}
                              onChange={(e) =>
                                handleChange(e, "tech_persons", index)
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className="">
                            <select
                              className="input"
                              name="tech_bath"
                              aria-label="bath"
                              value={formData.tech_bath[index]}
                              onChange={(e) =>
                                handleChange(e, "tech_bath", index)
                              }
                            >
                              <option value="100">
                                {data?.payload?.tech_lang_keys["12"]}
                              </option>
                              <option value="50">
                                {data?.payload?.tech_lang_keys["13"]}
                              </option>
                              <option value="0">
                                {data?.payload?.tech_lang_keys["14"]}
                              </option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="row my-2">
                        <div className="w-full md:w-[80%] lg:w-[80%] lg:text-[18px] md:text-[16px] text-[14px] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              {Object.entries(result?.tech_room_rent || {}).map(
                                ([key, val]) => (
                                  <tr key={key}>
                                    <td width="60%" className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[10]}{" "}
                                        {parseInt(key) + 1}{" "}
                                        {data?.payload?.tech_lang_keys[11]}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {currency.symbol} {val.toFixed(2)}
                                    </td>
                                  </tr>
                                )
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

export default RentSplitCalculator;
