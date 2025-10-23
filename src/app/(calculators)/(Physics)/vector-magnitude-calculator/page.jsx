"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useVectorMagnitudeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VectorMagnitudeCalculator = () => {
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
    tech_dem: "5",
    tech_a_rep: "point", //  point coor
    tech_ax: "3",
    tech_ay: "4",
    tech_az: "4",
    tech_w: "4",
    tech_t: "2",
    tech_a1: "2",
    tech_a2: "2",
    tech_a3: "2",
    tech_a4: "-4",
    tech_a5: "1",
    tech_b1: "1",
    tech_b2: "1",
    tech_b3: "1",
    tech_b4: "3",
    tech_b5: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVectorMagnitudeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_dem || !formData.tech_a_rep) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_dem: formData.tech_dem,
        tech_a_rep: formData.tech_a_rep,
        tech_ax: formData.tech_ax,
        tech_ay: formData.tech_ay,
        tech_az: formData.tech_az,
        tech_w: formData.tech_w,
        tech_t: formData.tech_t,
        tech_a1: formData.tech_a1,
        tech_a2: formData.tech_a2,
        tech_a3: formData.tech_a3,
        tech_a4: formData.tech_a4,
        tech_a5: formData.tech_a5,
        tech_b1: formData.tech_b1,
        tech_b2: formData.tech_b2,
        tech_b3: formData.tech_b3,
        tech_b4: formData.tech_b4,
        tech_b5: formData.tech_b5,
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
      tech_dem: "5",
      tech_a_rep: "point", //  point coor
      tech_ax: "3",
      tech_ay: "4",
      tech_az: "4",
      tech_w: "4",
      tech_t: "2",
      tech_a1: "2",
      tech_a2: "2",
      tech_a3: "2",
      tech_a4: "-4",
      tech_a5: "1",
      tech_b1: "1",
      tech_b2: "1",
      tech_b3: "1",
      tech_b4: "3",
      tech_b5: "2",
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
  // result

  const ax = formData?.tech_ax || 0;
  const ay = formData?.tech_ay || 0;
  const az = formData?.tech_az || 0;
  const aw = formData?.tech_w || 0;
  const at = formData?.tech_t || 0;
  const dim = formData?.tech_dem;

  // Vector components
  const ax1 = formData?.tech_b1 - formData?.tech_a1;
  const ay1 = formData?.tech_b2 - formData?.tech_a2;
  const az1 = formData?.tech_b3 - formData?.tech_a3;
  const aw1 = formData?.tech_b4 - formData?.tech_a4;
  const at1 = formData?.tech_b5 - formData?.tech_a5;

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_dem" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_dem"
                    id="tech_dem"
                    value={formData.tech_dem}
                    onChange={handleChange}
                  >
                    <option value="2">2-D</option>
                    <option value="3">3-D </option>
                    <option value="4">4-D </option>
                    <option value="5">5-D </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a_rep" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a_rep"
                    id="tech_a_rep"
                    value={formData.tech_a_rep}
                    onChange={handleChange}
                  >
                    <option value="coor">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_a_rep == "coor" && (
                <>
                  <div className="col-span-12 a_coor">
                    <div className="grid grid-cols-12 mt-3  gap-2">
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3" ||
                        formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6">
                            <label htmlFor="tech_ax" className="label">
                              x
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_ax"
                                id="tech_ax"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_ax}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-6">
                            <label htmlFor="tech_ay" className="label">
                              y
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_ay"
                                id="tech_ay"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_ay}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_dem == "3" ||
                        formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6 ">
                            <label htmlFor="tech_az" className="label">
                              z
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_az"
                                id="tech_az"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_az}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6  ">
                            <label htmlFor="tech_w" className="label">
                              w
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_w"
                                id="tech_w"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_w}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_dem == "5" && (
                        <>
                          <div className="col-span-6  ">
                            <label htmlFor="tech_t" className="label">
                              t
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_t"
                                id="tech_t"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_t}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_a_rep == "point" && (
                <>
                  <div className="col-span-12  a_points">
                    <div className="grid grid-cols-12 mt-3  gap-2">
                      <p className="col-span-12">
                        <strong>
                          {data?.payload?.tech_lang_keys["5"]} (A):
                        </strong>
                      </p>

                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3" ||
                        formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6">
                            <label htmlFor="tech_a1" className="label">
                              x
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_a1"
                                id="tech_a1"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a1}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-6">
                            <label htmlFor="tech_a2" className="label">
                              y
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_a2"
                                id="tech_a2"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a2}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_dem == "3" ||
                        formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6 three">
                            <label htmlFor="tech_a3" className="label">
                              z
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_a3"
                                id="tech_a3"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a3}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6 four">
                            <label htmlFor="tech_a4" className="label">
                              w
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_a4"
                                id="tech_a4"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a4}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_dem == "5" && (
                        <>
                          <div className="col-span-6 five">
                            <label htmlFor="tech_a5" className="label">
                              t
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_a5"
                                id="tech_a5"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a5}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <p className="col-span-12">
                        <strong>
                          {data?.payload?.tech_lang_keys["5"]} (B):
                        </strong>
                      </p>

                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3" ||
                        formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6">
                            <label htmlFor="tech_b1" className="label">
                              x
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_b1"
                                id="tech_b1"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b1}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-6">
                            <label htmlFor="tech_b2" className="label">
                              y
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_b2"
                                id="tech_b2"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b2}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {(formData.tech_dem == "3" ||
                        formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6 three">
                            <label htmlFor="tech_b3" className="label">
                              z
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_b3"
                                id="tech_b3"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b3}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_dem == "4" ||
                        formData.tech_dem == "5") && (
                        <>
                          <div className="col-span-6 four">
                            <label htmlFor="tech_b4" className="label">
                              w
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_b4"
                                id="tech_b4"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b4}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_dem == "5" && (
                        <>
                          <div className="col-span-6 five">
                            <label htmlFor="tech_b5" className="label">
                              t
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_b5"
                                id="tech_b5"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b5}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px]  md:text-[20px] overflow-auto">
                        <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                          <table className="w-full text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="70%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[7]}{" "}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {" "}
                                  {result?.tech_mag}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </p>
                        <p className="mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["9"]}:{" "}
                            <InlineMath
                              math={
                                "|\\vec{v}| = \\sqrt{\\sum\\limits_{i=1}^{n} |x_i|^2}"
                              }
                            />
                            , {data?.payload?.tech_lang_keys["10"]}{" "}
                            <InlineMath math={"x_i ,\\ i = 1\\dots n"} />{" "}
                            {data?.payload?.tech_lang_keys["11"]}.
                          </strong>
                        </p>
                        {formData?.tech_coor == "coor" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["12"]}:
                            </p>

                            {dim === "2" && (
                              <>
                                <BlockMath math="|\vec v| = \sqrt{a_x^2 + a_y^2}" />
                                <BlockMath
                                  math={`|\\vec v| = \\sqrt{(${ax})^2 + (${ay})^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec v| = \\sqrt{${ax ** 2} + ${
                                    ay ** 2
                                  }}`}
                                />
                                <BlockMath
                                  math={`|\\vec v| = ${result?.tech_mag}`}
                                />
                              </>
                            )}

                            {dim === "3" && (
                              <>
                                <BlockMath math="|\vec v| = \sqrt{a_x^2 + a_y^2 + a_z^2}" />
                                <BlockMath
                                  math={`|\\vec v| = \\sqrt{(${ax})^2 + (${ay})^2 + (${az})^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec v| = \\sqrt{${ax ** 2} + ${
                                    ay ** 2
                                  } + ${az ** 2}}`}
                                />
                                <BlockMath
                                  math={`|\\vec v| = ${result?.tech_mag}`}
                                />
                              </>
                            )}

                            {dim === "4" && (
                              <>
                                <BlockMath math="|\vec v| = \sqrt{a_x^2 + a_y^2 + a_z^2 + a_w^2}" />
                                <BlockMath
                                  math={`|\\vec v| = \\sqrt{(${ax})^2 + (${ay})^2 + (${az})^2 + (${aw})^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec v| = \\sqrt{${ax ** 2} + ${
                                    ay ** 2
                                  } + ${az ** 2} + ${aw ** 2}}`}
                                />
                                <BlockMath
                                  math={`|\\vec v| = ${result?.tech_mag}`}
                                />
                              </>
                            )}

                            {dim === "5" && (
                              <>
                                <BlockMath math="|\vec v| = \sqrt{a_x^2 + a_y^2 + a_z^2 + a_w^2 + a_t^2}" />
                                <BlockMath
                                  math={`|\\vec v| = \\sqrt{(${ax})^2 + (${ay})^2 + (${az})^2 + (${aw})^2 + (${at})^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec v| = \\sqrt{${ax ** 2} + ${
                                    ay ** 2
                                  } + ${az ** 2} + ${aw ** 2} + ${at ** 2}}`}
                                />
                                <BlockMath
                                  math={`|\\vec v| = ${result?.tech_mag}`}
                                />
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["13"]}:
                            </p>

                            {dim === "2" && (
                              <>
                                <BlockMath
                                  math={`\\vec{AB} = \\{B_x - A_x, B_y - A_y\\}`}
                                />
                                <BlockMath
                                  math={`\\vec{AB} = \\{ ${formData.tech_b1} - (${formData.tech_a1}), ${formData.tech_b2} - (${formData.tech_a2}) \\}`}
                                />
                                <BlockMath
                                  math={`\\vec{AB} = \\{ ${ax1}, ${ay1} \\}`}
                                />
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["12"]}:
                                </p>
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{AB_x^2 + AB_y^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{(${ax1})^2 + (${ay1})^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{${ax1 ** 2} + ${
                                    ay1 ** 2
                                  }}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = ${result?.tech_mag}`}
                                />
                              </>
                            )}

                            {dim === "3" && (
                              <>
                                <BlockMath
                                  math={`\\vec{AB} = \\{B_x - A_x, B_y - A_y, B_z - A_z\\}`}
                                />
                                <BlockMath
                                  math={`\\vec{AB} = \\{ ${formData.tech_b1} - (${formData.tech_a1}), ${formData.tech_b2} - (${formData.tech_a2}), ${formData.tech_b3} - (${formData.tech_a3}) \\}`}
                                />
                                <BlockMath
                                  math={`\\vec{AB} = \\{ ${ax1}, ${ay1}, ${az1} \\}`}
                                />
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["12"]}:
                                </p>
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{AB_x^2 + AB_y^2 + AB_z^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{(${ax1})^2 + (${ay1})^2 + (${az1})^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{${ax1 ** 2} + ${
                                    ay1 ** 2
                                  } + ${az1 ** 2}}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = ${result?.tech_mag}`}
                                />
                              </>
                            )}

                            {dim === "4" && (
                              <>
                                <BlockMath
                                  math={`\\vec{AB} = \\{B_x - A_x, B_y - A_y, B_z - A_z, B_w - A_w\\}`}
                                />
                                <BlockMath
                                  math={`\\vec{AB} = \\{ ${formData.tech_b1} - (${formData.tech_a1}), ${formData.tech_b2} - (${formData.tech_a2}), ${formData.tech_b3} - (${formData.tech_a3}), ${formData.tech_b4} - (${formData.tech_a4}) \\}`}
                                />
                                <BlockMath
                                  math={`\\vec{AB} = \\{ ${ax1}, ${ay1}, ${az1}, ${aw1} \\}`}
                                />
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["12"]}:
                                </p>
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{AB_x^2 + AB_y^2 + AB_z^2 + AB_w^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{(${ax1})^2 + (${ay1})^2 + (${az1})^2 + (${aw1})^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{${ax1 ** 2} + ${
                                    ay1 ** 2
                                  } + ${az1 ** 2} + ${aw1 ** 2}}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = ${result?.tech_mag}`}
                                />
                              </>
                            )}

                            {dim === "5" && (
                              <>
                                <BlockMath
                                  math={`\\vec{AB} = \\{B_x - A_x, B_y - A_y, B_z - A_z, B_w - A_w, B_t - A_t\\}`}
                                />
                                <BlockMath
                                  math={`\\vec{AB} = \\{ ${formData.tech_b1} - (${formData.tech_a1}), ${formData.tech_b2} - (${formData.tech_a2}), ${formData.tech_b3} - (${formData.tech_a3}), ${formData.tech_b4} - (${formData.tech_a4}), ${formData.tech_b5} - (${formData.tech_a5}) \\}`}
                                />
                                <BlockMath
                                  math={`\\vec{AB} = \\{ ${ax1}, ${ay1}, ${az1}, ${aw1}, ${at1} \\}`}
                                />
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["12"]}:
                                </p>
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{AB_x^2 + AB_y^2 + AB_z^2 + AB_w^2 + AB_t^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{(${ax1})^2 + (${ay1})^2 + (${az1})^2 + (${aw1})^2 + (${at1})^2}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = \\sqrt{${ax1 ** 2} + ${
                                    ay1 ** 2
                                  } + ${az1 ** 2} + ${aw1 ** 2} + ${at1 ** 2}}`}
                                />
                                <BlockMath
                                  math={`|\\vec{AB}| = ${result?.tech_mag}`}
                                />
                              </>
                            )}
                          </>
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

export default VectorMagnitudeCalculator;
