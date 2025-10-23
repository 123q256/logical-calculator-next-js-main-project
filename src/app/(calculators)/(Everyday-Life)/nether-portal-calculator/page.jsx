"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useNetherPortalCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const NetherPortalCalculator = () => {
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
    tech_sim_adv: "advance", // simple  advance
    tech_cal: "2",
    tech_x: Number(100),
    tech_y: Number(200),
    tech_z: Number(300),
    tech_x1: 200,
    tech_x2: 300,
    tech_y1: 400,
    tech_y2: 500,
    tech_z1: 600,
    tech_z2: 700,
    tech_submit: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useNetherPortalCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_sim_adv) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_sim_adv: formData.tech_sim_adv,
        tech_cal: formData.tech_cal,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_z: formData.tech_z,

        tech_x1: formData.tech_x1,
        tech_x2: formData.tech_x2,
        tech_y1: formData.tech_y1,
        tech_y2: formData.tech_y2,
        tech_z1: formData.tech_z1,
        tech_z2: formData.tech_z2,
        tech_submit: formData.tech_submit,
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
      tech_sim_adv: "advance", // simple  advance
      tech_cal: "2",
      tech_x: Number(100),
      tech_y: Number(200),
      tech_z: Number(300),
      tech_x1: 200,
      tech_x2: 300,
      tech_y1: 400,
      tech_y2: 500,
      tech_z1: 600,
      tech_z2: 700,
      tech_submit: "1",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[65%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <input
                type="hidden"
                name="tech_sim_adv"
                id="calculator_time"
                value={formData.tech_sim_adv}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_sim_adv == "simple" ? "tagsUnit" : ""
                    }`}
                    id="simple"
                    onClick={() => {
                      setFormData({ ...formData, tech_sim_adv: "simple" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    Nether Portal Calculator
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_sim_adv == "advance" ? "tagsUnit" : ""
                    }`}
                    id="advance"
                    onClick={() => {
                      setFormData({ ...formData, tech_sim_adv: "advance" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    3D {data?.payload?.tech_lang_keys["5"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3  lg:gap-4 md:gap-4 gap-1">
              {formData.tech_sim_adv == "simple" && (
                <>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_cal" className="label">
                      {data?.payload?.tech_lang_keys["calculate"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_cal"
                        id="tech_cal"
                        value={formData.tech_cal}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["2"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["3"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_x" className="label">
                      {" "}
                      X{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x"
                        id="tech_x"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_y" className="label">
                      {" "}
                      Y{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y"
                        id="tech_y"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_z" className="label">
                      {" "}
                      Z{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z"
                        id="tech_z"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_sim_adv == "advance" && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_x1" className="label">
                      {" "}
                      X1{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x1"
                        id="tech_x1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_x2" className="label">
                      {" "}
                      X2{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x2"
                        id="tech_x2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_x2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_y1" className="label">
                      {" "}
                      Y1{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y1"
                        id="tech_y1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_y2" className="label">
                      {" "}
                      Y2{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y2"
                        id="tech_y2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_z1" className="label">
                      {" "}
                      Z1{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z1"
                        id="tech_z1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6  md:col-span-6 col-span-12">
                    <label htmlFor="tech_z2" className="label">
                      {" "}
                      Z2{" "}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z2"
                        id="tech_z2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] == "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        {formData?.tech_sim_adv == "simple" ? (
                          <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto text-[16px]">
                            <table className="w-full">
                              <thead>
                                <tr>
                                  <td colSpan="2">
                                    <strong>
                                      {formData?.tech_cal == "1"
                                        ? "Nether Coordinates"
                                        : formData?.tech_cal == "2"
                                        ? "Overworld Coordinates"
                                        : ""}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">X</td>
                                  <td className="border-b py-2">
                                    {result?.tech_x}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">Y</td>
                                  <td className="border-b py-2">
                                    {result?.tech_y}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">Z</td>
                                  <td className="border-b py-2">
                                    {result?.tech_z}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2" className="pt-2"></td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">X,Y,Z</td>
                                  <td className="border-b py-2">
                                    {result?.tech_x}, {result?.tech_y},{" "}
                                    {result?.tech_z}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            {result?.tech_comment && (
                              <p className="mt-4">{result.tech_comment}</p>
                            )}
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-[20px] font-bold">
                              {data?.payload?.tech_lang_keys["4"]}
                            </p>
                            <p className="text-[32px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block mt-3">
                              <strong className="text-white">
                                {Number(result?.tech_distance).toFixed(2)}
                              </strong>
                            </p>
                          </div>
                        )}
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

export default NetherPortalCalculator;
