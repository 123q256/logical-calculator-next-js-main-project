"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBoxFillCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BoxFillCalculator = () => {
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
    tech_conducting_wire_size: 2.25,
    tech_clamps: "no",
    tech_conducting_wire: 10,
    tech_fittings: "no",
    tech_devices: 5,
    tech_grounding_conductor: 10,
    tech_largest_wire_size: 2,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBoxFillCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_conducting_wire_size ||
      !formData.tech_clamps ||
      !formData.tech_conducting_wire ||
      !formData.tech_fittings ||
      !formData.tech_devices ||
      !formData.tech_grounding_conductor ||
      !formData.tech_largest_wire_size
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_conducting_wire_size: formData.tech_conducting_wire_size,
        tech_clamps: formData.tech_clamps,
        tech_conducting_wire: formData.tech_conducting_wire,
        tech_fittings: formData.tech_fittings,
        tech_devices: formData.tech_devices,
        tech_grounding_conductor: formData.tech_grounding_conductor,
        tech_largest_wire_size: formData.tech_largest_wire_size,
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
      tech_conducting_wire_size: 2.25,
      tech_clamps: "no",
      tech_conducting_wire: 10,
      tech_fittings: "no",
      tech_devices: 5,
      tech_grounding_conductor: 10,
      tech_largest_wire_size: 2,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg input_form space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[80%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_conducting_wire_size" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_conducting_wire_size"
                    id="tech_conducting_wire_size"
                    value={formData.tech_conducting_wire_size}
                    onChange={handleChange}
                  >
                    <option value="5">6 AWG</option>
                    <option value="3">8 AWG</option>
                    <option value="2.5">10 AWG</option>
                    <option value="2.25">12 AWG</option>
                    <option value="2">14 AWG</option>
                    <option value="1.75">16 AW</option>
                    <option value="1.5">18 AWG</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_clamps" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_clamps"
                    id="tech_clamps"
                    value={formData.tech_clamps}
                    onChange={handleChange}
                  >
                    <option value="no"> No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_conducting_wire" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_conducting_wire"
                    id="tech_conducting_wire"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_conducting_wire}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["3"]}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_fittings" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_fittings"
                    id="tech_fittings"
                    value={formData.tech_fittings}
                    onChange={handleChange}
                  >
                    <option value="no"> No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 ">
                <label htmlFor="tech_devices" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_devices"
                    id="tech_devices"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_devices}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["6"]}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_grounding_conductor" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_grounding_conductor"
                    id="tech_grounding_conductor"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_grounding_conductor}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["3"]}
                  </span>
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_largest_wire_size" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_largest_wire_size"
                    id="tech_largest_wire_size"
                    value={formData.tech_largest_wire_size}
                    onChange={handleChange}
                  >
                    <option value="5">6 AWG</option>
                    <option value="3">8 AWG</option>
                    <option value="2.5">10 AWG</option>
                    <option value="2.25">12 AWG</option>
                    <option value="2">14 AWG</option>
                    <option value="1.75">16 AW</option>
                    <option value="1.5">18 AWG</option>
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

                  <div className="rounded-lg  flex items-center ">
                    <div className="w-full md:w-[80%] bg-light-blue p-3 rounded-lg mt-3">
                      <div className="flex flex-wrap my-2">
                        <div className="w-full text-[16px] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              {result?.tech_conducting_wire_size ===
                              result?.tech_largest_wire_size ? (
                                <tr>
                                  <td className="border-b border-[#99EA48] py-2 w-7/10">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["10"]} :
                                    </strong>
                                  </td>
                                  <td className="border-b border-[#99EA48] py-2">
                                    {result?.tech_total_volume_allowance_needed}
                                  </td>
                                </tr>
                              ) : (
                                <>
                                  <tr>
                                    <td className="border-b border-[#99EA48] py-2 w-7/10">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["11"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b border-[#99EA48] py-2">
                                      {result?.tech_larg_cond_wire}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b border-[#99EA48] py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b border-[#99EA48] py-2">
                                      {Math.round(
                                        result?.tech_grounding_fill_vol_allownce *
                                          10
                                      ) / 10}
                                    </td>
                                  </tr>
                                </>
                              )}

                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["13"]} :
                                  </strong>
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_total_box_vol} (c<sup>3</sup>)
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full text-lg mt-3">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2 w-7/10">
                                  {data?.payload?.tech_lang_keys[14]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_conducting_wire}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[15]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_conducting_wire_size}{" "}
                                  <span>
                                    (c<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[16]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_conductor_fill_volume}{" "}
                                  <span>
                                    (c<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[17]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_clamp_vol_allownce}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[18]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_clamp_fill_vol}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[19]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_fitt_vol_allownce}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[20]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_fitt_fill_vol}{" "}
                                  <span>
                                    (c<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[21]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_device_vol_allownce}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[22]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_device_fill_vol}{" "}
                                  <span>
                                    (c<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[23]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_grounding_fill_vol_allownce}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[24]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_largest_wire_size}{" "}
                                  <span>
                                    (c<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b border-[#99EA48] py-2">
                                  {data?.payload?.tech_lang_keys[25]} :
                                </td>
                                <td className="border-b border-[#99EA48] py-2">
                                  {result?.tech_grounding_fill_vol}{" "}
                                  <span>
                                    (c<sup>3</sup>)
                                  </span>
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

export default BoxFillCalculator;
