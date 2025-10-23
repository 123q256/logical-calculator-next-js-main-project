"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEBITDACalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EBITDACalculator = () => {
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
    tech_unit_type: "simple",
    tech_x: Number("50"),
    tech_y: Number("50"),
    tech_a: Number("50"),
    tech_d: Number("50"),

    tech_rev: Number("50"),
    tech_net: Number("50"),
    tech_Interest: Number("50"),
    tech_Taxes: Number("50"),
    tech_ae: Number("50"),
    tech_de: Number("50"),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEBITDACalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_unit_type == "simple") {
      if (
        !formData.tech_unit_type ||
        !formData.tech_x ||
        !formData.tech_y ||
        !formData.tech_a ||
        !formData.tech_d
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_unit_type ||
        !formData.tech_rev ||
        !formData.tech_net ||
        !formData.tech_Interest ||
        !formData.tech_Taxes ||
        !formData.tech_ae ||
        !formData.tech_de
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_x: Number(formData.tech_x),
        tech_y: Number(formData.tech_y),
        tech_a: Number(formData.tech_a),
        tech_d: Number(formData.tech_d),
        tech_rev: Number(formData.tech_rev),
        tech_net: Number(formData.tech_net),
        tech_Interest: Number(formData.tech_Interest),
        tech_Taxes: Number(formData.tech_Taxes),
        tech_ae: Number(formData.tech_ae),
        tech_de: Number(formData.tech_de),
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
      tech_unit_type: "simple",
      tech_x: "50",
      tech_y: "50",
      tech_a: "50",
      tech_d: "50",

      tech_rev: "50",
      tech_net: "50",
      tech_Interest: "50",
      tech_Taxes: "50",
      tech_ae: "50",
      tech_de: "50",
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_unit_type"
                id="tech_unit_type"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_unit_type === "simple" ? "tagsUnit" : ""
                    }`}
                    id="simple"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "simple" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["Simple"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "extended" ? "tagsUnit" : ""
                    }`}
                    id="extended"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "extended" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["Extended"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-3  gap-4">
              {formData.tech_unit_type == "simple" ? (
                <div className="col-span-12">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-6">
                      <label htmlFor="tech_x" className="label">
                        {data?.payload?.tech_lang_keys["r"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_x"
                          id="tech_x"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_x}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_y" className="label">
                        {data?.payload?.tech_lang_keys["e"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_y"
                          id="tech_y"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_y}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_a" className="label">
                        {data?.payload?.tech_lang_keys["a"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_a"
                          id="tech_a"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_a}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_d" className="label">
                        {data?.payload?.tech_lang_keys["d"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_d"
                          id="tech_d"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_d}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-span-12">
                  <div className="grid grid-cols-12 mt-3  gap-4">
                    <div className="col-span-6">
                      <label htmlFor="tech_rev" className="label">
                        {data?.payload?.tech_lang_keys["r"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_rev"
                          id="tech_rev"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_rev}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_net" className="label">
                        {data?.payload?.tech_lang_keys["n_p"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_net"
                          id="tech_net"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_net}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_Interest" className="label">
                        {data?.payload?.tech_lang_keys["Interest"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_Interest"
                          id="tech_Interest"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_Interest}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_Taxes" className="label">
                        {data?.payload?.tech_lang_keys["Taxes"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_Taxes"
                          id="tech_Taxes"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_Taxes}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_ae" className="label">
                        {data?.payload?.tech_lang_keys["a"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_ae"
                          id="tech_ae"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_ae}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label htmlFor="tech_de" className="label">
                        {data?.payload?.tech_lang_keys["d"]}:
                      </label>
                      <div className="py-2 relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_de"
                          id="tech_de"
                          className="input my-2"
                          aria-label="input"
                          placeholder="50"
                          value={formData.tech_de}
                          onChange={handleChange}
                        />
                        <span className="input_unit">{currency.symbol}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        <table className="w-full font-s-18">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ebitda"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <b>
                                  {result?.tech_ebitda !== "" &&
                                  result?.tech_ebitda != null
                                    ? `${result.tech_ebitda}`
                                    : `0.0 ${currency.symbol}`}
                                </b>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["margin"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                <b>
                                  {result?.tech_margin !== "" &&
                                  result?.tech_margin != null
                                    ? `${result.tech_margin}`
                                    : `0.0 ${currency.symbol}`}
                                </b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

export default EBITDACalculator;
