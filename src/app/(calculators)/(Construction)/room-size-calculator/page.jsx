"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRoomSizeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RoomSizeCalculator = () => {
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
      console.error("Error fetching calculator results:tech_", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_name: "feet",
    tech_lenght_f: ["7", "7"],
    tech_lenght_in: ["4", "4"],
    tech_width_f: ["7", "7"],
    tech_width_in: ["4", "4"],

    tech_lenght_m: ["7", "7"],
    tech_width_m: ["4", "4"],
    tech_perce: "10",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRoomSizeCalculatorMutation();

  const handleChange = (type, indexOrEvent, maybeValue) => {
    setFormData((prevData) => {
      // If 'type' is tech_perce or any single value field (no index)
      if (typeof indexOrEvent === "object" && indexOrEvent.target) {
        // Called from select or input for single value
        return {
          ...prevData,
          [type]: indexOrEvent.target.value,
        };
      }

      // Otherwise, update array item by index
      const index = indexOrEvent;
      const value = maybeValue;
      const updatedArray = [...prevData[type]];
      updatedArray[index] = value;
      return {
        ...prevData,
        [type]: updatedArray,
      };
    });
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_name) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_name: formData.tech_name,
        tech_lenght_f: formData.tech_lenght_f,
        tech_lenght_in: formData.tech_lenght_in,
        tech_width_f: formData.tech_width_f,
        tech_width_in: formData.tech_width_in,
        tech_lenght_m: formData.tech_lenght_m,
        tech_width_m: formData.tech_width_m,
        tech_perce: formData.tech_perce,
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
      tech_name: "feet",
      tech_lenght_f: ["7", "7"],
      tech_lenght_in: ["4", "4"],
      tech_width_f: ["7", "7"],
      tech_width_in: ["4", "4"],
      tech_lenght_m: ["7", "7"],
      tech_width_m: ["4", "4"],
      tech_perce: "10",
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
  const addRow1 = () => {
    setFormData((prev) => ({
      ...prev,
      tech_lenght_f: [...prev.tech_lenght_f, ""],
      tech_lenght_in: [...prev.tech_lenght_in, ""],
      tech_width_f: [...prev.tech_width_f, ""],
      tech_width_in: [...prev.tech_width_in, ""],
    }));
  };

  const removeRow1 = (index) => {
    setFormData((prev) => ({
      ...prev,
      tech_lenght_f: prev.tech_lenght_f.filter((_, i) => i !== index),
      tech_lenght_in: prev.tech_lenght_in.filter((_, i) => i !== index),
      tech_width_f: prev.tech_width_f.filter((_, i) => i !== index),
      tech_width_in: prev.tech_width_in.filter((_, i) => i !== index),
    }));
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      tech_lenght_m: [...prev.tech_lenght_m, ""],
      tech_width_m: [...prev.tech_width_m, ""],
    }));
  };

  const removeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      tech_lenght_m: prev.tech_lenght_m.filter((_, i) => i !== index),
      tech_width_m: prev.tech_width_m.filter((_, i) => i !== index),
    }));
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

          <div className="lg:w-[80%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12">
                <img
                  src="/images/room_size.svg"
                  alt="beam image"
                  width={220}
                  height="100%"
                />
              </div>
              <div className="col-span-12">
                <div className="grid lg:grid-cols-12 md:grid-cols-12 grid-cols-1 gap-2">
                  <div className="col-span-8 w-full">
                    <input
                      type="hidden"
                      name="tech_name"
                      id="calculator_time"
                      value={formData.tech_name}
                    />
                    <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                      {/* Date Cal Tab */}
                      <div className="lg:w-1/2 w-full px-2 py-1">
                        <div
                          className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                            formData.tech_name === "feet" ? "tagsUnit" : ""
                          }`}
                          id="feet"
                          onClick={() => {
                            setFormData({ ...formData, tech_name: "feet" });
                            setResult(null);
                            setFormError(null);
                          }}
                        >
                          {data?.payload?.tech_lang_keys["2"]}
                        </div>
                      </div>
                      {/* Time Cal Tab */}
                      <div className="lg:w-1/2 w-full px-2 py-1">
                        <div
                          className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                            formData.tech_name === "meter" ? "tagsUnit" : ""
                          }`}
                          id="meter"
                          onClick={() => {
                            setFormData({ ...formData, tech_name: "meter" });
                            setResult(null);
                            setFormError(null);
                          }}
                        >
                          {data?.payload?.tech_lang_keys["1"]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="col-span-12">
                {data?.payload?.tech_lang_keys["3"]}
              </p>

              {formData.tech_name == "feet" && (
                <>
                  <div className="col-span-12  round">
                    {formData.tech_lenght_f.map((_, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mt-3">
                        {/* Length ft */}
                        <div className="col-span-5 md:col-span-2">
                          <label className="label">
                            {data?.payload?.tech_lang_keys["4"]} (ft):
                          </label>
                          <input
                            type="number"
                            step="any"
                            className="input my-2"
                            value={formData.tech_lenght_f[index]}
                            onChange={(e) =>
                              handleChange(
                                "tech_lenght_f",
                                index,
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* Length in */}
                        <div className="col-span-5 md:col-span-2">
                          <label className="label">
                            {data?.payload?.tech_lang_keys["4"]} (in):
                          </label>
                          <input
                            type="number"
                            step="any"
                            className="input my-2"
                            value={formData.tech_lenght_in[index]}
                            onChange={(e) =>
                              handleChange(
                                "tech_lenght_in",
                                index,
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* x separator */}
                        <span className="pt-[40px] col-span-1 text-center">
                          x
                        </span>

                        {/* Width ft */}
                        <div className="col-span-5 md:col-span-2">
                          <label className="label">
                            {data?.payload?.tech_lang_keys["5"]} (ft):
                          </label>
                          <input
                            type="number"
                            step="any"
                            className="input my-2"
                            value={formData.tech_width_f[index]}
                            onChange={(e) =>
                              handleChange(
                                "tech_width_f",
                                index,
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* Width in */}
                        <div className="col-span-5 md:col-span-2">
                          <label className="label">
                            {data?.payload?.tech_lang_keys["5"]} (in):
                          </label>
                          <input
                            type="number"
                            step="any"
                            className="input my-2"
                            value={formData.tech_width_in[index]}
                            onChange={(e) =>
                              handleChange(
                                "tech_width_in",
                                index,
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* 🗑️ Delete icon, only show if more than 1 row */}
                        {formData.tech_lenght_f.length > 1 && (
                          <div className="col-span-1 flex items-center cursor-pointer">
                            <span
                              onClick={() => removeRow1(index)}
                              className="text-red-500 text-2xl"
                            >
                              🗑️
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="col-span-12 feet_row mt-3">
                      <a
                        onClick={addRow1}
                        className="cursor-pointer font-bold text-blue-600"
                      >
                        <span className="text-xl">+</span>{" "}
                        {data?.payload?.tech_lang_keys["7"]}
                      </a>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_name == "meter" && (
                <>
                  <div className="col-span-12 round1  ">
                    {formData.tech_lenght_m.map((length, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mt-3">
                        <div className="col-span-5 md:col-span-3 ">
                          <label>Length (m):</label>
                          <input
                            type="number"
                            step="any"
                            className="input my-2"
                            value={formData.tech_lenght_m[index]}
                            onChange={(e) =>
                              handleChange(
                                "tech_lenght_m",
                                index,
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="pt-[40px] col-span-1 text-center">
                          x
                        </div>
                        <div className="col-span-5 md:col-span-3 ">
                          <label>Width (m):</label>
                          <input
                            type="number"
                            step="any"
                            className="input my-2"
                            value={formData.tech_width_m[index]}
                            onChange={(e) =>
                              handleChange(
                                "tech_width_m",
                                index,
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {/* Show delete button only if there are 2 or more rows */}
                        {formData.tech_lenght_m.length > 1 && (
                          <div className="col-span-1 flex items-center cursor-pointer">
                            <a onClick={() => removeRow(index)}>🗑</a>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="col-span-12">
                      <a
                        onClick={addRow}
                        className="text-blue-600 font-bold cursor-pointer"
                      >
                        + Add Another Room
                      </a>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12 md:col-span-4">
                <label htmlFor="tech_perce" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_perce"
                    id="tech_perce"
                    value={formData.tech_perce}
                    onChange={(e) => handleChange("tech_perce", e)}
                  >
                    <option value="0">0 %</option>
                    <option value="5">5 %</option>
                    <option value="10">10 %</option>
                    <option value="15">15 %</option>
                  </select>
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

                  <div className="rounded-lg  w-full items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[70%] g:w-[70%] overflow-auto text-[16px]">
                          {formData?.tech_name === "feet" && (
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_f_r_s?.toFixed(3)} ft²
                                  </td>
                                </tr>

                                {formData?.tech_perce != 0 && (
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}{" "}
                                        {data?.payload?.tech_lang_keys["9"]}{" "}
                                        {result?.tech_perce}%{" "}
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_perc?.toFixed(3)} ft²
                                    </td>
                                  </tr>
                                )}

                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["8"]} (
                                    {data?.payload?.tech_lang_keys["11"]})
                                  </td>
                                  <td className="border-b py-2">
                                    {(result?.tech_f_r_s * 144).toFixed(3)} in
                                    <sup>2</sup>
                                  </td>
                                </tr>

                                {formData?.tech_perce != 0 && (
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["8"]}{" "}
                                      {data?.payload?.tech_lang_keys["10"]} (
                                      {data?.payload?.tech_lang_keys["11"]})
                                    </td>
                                    <td className="border-b py-2">
                                      {(result?.tech_perc * 144).toFixed(3)} in
                                      <sup>2</sup>
                                    </td>
                                  </tr>
                                )}

                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["8"]} (
                                    {data?.payload?.tech_lang_keys["12"]})
                                  </td>
                                  <td className="border-b py-2">
                                    {(result?.tech_f_r_s / 10.764).toFixed(3)} m
                                    <sup>2</sup>
                                  </td>
                                </tr>

                                {formData?.tech_perce != 0 && (
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["8"]}{" "}
                                      {data?.payload?.tech_lang_keys["10"]} (
                                      {data?.payload?.tech_lang_keys["12"]})
                                    </td>
                                    <td className="border-b py-2">
                                      {(result?.tech_perc / 10.764).toFixed(3)}{" "}
                                      m<sup>2</sup>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          )}

                          {formData?.tech_name === "meter" && (
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    {result?.tech_m_r_s?.toFixed(3)} m²
                                  </td>
                                </tr>

                                {formData?.tech_perce != 0 && (
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}{" "}
                                        with {result?.tech_perce}%{" "}
                                        {data?.payload?.tech_lang_keys["10"]}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_perc?.toFixed(3)} m
                                      <sup>2</sup>
                                    </td>
                                  </tr>
                                )}

                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {(result?.tech_m_r_s * 10.764).toFixed(3)}{" "}
                                    ft²
                                  </td>
                                </tr>

                                {formData?.tech_perce != 0 && (
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["8"]}{" "}
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {(result?.tech_perc * 10.764).toFixed(3)}{" "}
                                      ft²
                                    </td>
                                  </tr>
                                )}

                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </td>
                                  <td className="border-b py-2">
                                    {(result?.tech_m_r_s * 1550).toFixed(3)} in
                                    <sup>2</sup>
                                  </td>
                                </tr>

                                {formData?.tech_perce != 0 && (
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["8"]}{" "}
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </td>
                                    <td className="border-b py-2">
                                      {(result?.tech_perc * 1550).toFixed(3)} in
                                      <sup>2</sup>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          )}
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

export default RoomSizeCalculator;
