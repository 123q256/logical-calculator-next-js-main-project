"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVectorProjectionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VectorProjectionCalculator = () => {
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
    tech_dem: "2",
    tech_vector_representation: "point", // coor  point
    tech_ax: "3",
    tech_ay: "4",
    tech_az: "5",
    tech_1a: "2",
    tech_2a: "3",
    tech_3a: "4",
    tech_1b: "5",
    tech_2b: "6",
    tech_3b: "7",
    tech_vector_b: "point", // coor  point
    tech_bx: "7",
    tech_by: "8",
    tech_bz: "9",
    tech_1aa: "6",
    tech_2aa: "7",
    tech_3aa: "8",
    tech_1bb: "9",
    tech_2bb: "10",
    tech_3bb: "11",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVectorProjectionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_dem) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_dem: formData.tech_dem,
        tech_vector_representation: formData.tech_vector_representation,
        tech_ax: formData.tech_ax,
        tech_ay: formData.tech_ay,
        tech_az: formData.tech_az,
        tech_1a: formData.tech_1a,
        tech_2a: formData.tech_2a,
        tech_3a: formData.tech_3a,
        tech_1b: formData.tech_1b,
        tech_2b: formData.tech_2b,
        tech_3b: formData.tech_3b,
        tech_vector_b: formData.tech_vector_b,
        tech_bx: formData.tech_bx,
        tech_by: formData.tech_by,
        tech_bz: formData.tech_bz,
        tech_1aa: formData.tech_1aa,
        tech_2aa: formData.tech_2aa,
        tech_3aa: formData.tech_3aa,
        tech_1bb: formData.tech_1bb,
        tech_2bb: formData.tech_2bb,
        tech_3bb: formData.tech_3bb,
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
      tech_dem: "2",
      tech_vector_representation: "point", // coor  point
      tech_ax: "3",
      tech_ay: "4",
      tech_az: "5",
      tech_1a: "2",
      tech_2a: "3",
      tech_3a: "4",
      tech_1b: "5",
      tech_2b: "6",
      tech_3b: "7",
      tech_vector_b: "point", // coor  point
      tech_bx: "7",
      tech_by: "8",
      tech_bz: "9",
      tech_1aa: "6",
      tech_2aa: "7",
      tech_3aa: "8",
      tech_1bb: "9",
      tech_2bb: "10",
      tech_3bb: "11",
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

          <div className="lg:w-[70%] md:w-[98%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              {/* one */}

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
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
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_vector_representation" className="label">
                  {data?.payload?.tech_lang_keys["2"]} (A){" "}
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_vector_representation"
                    id="tech_vector_representation"
                    value={formData.tech_vector_representation}
                    onChange={handleChange}
                  >
                    <option value="coor">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_vector_representation == "coor" && (
                <>
                  <div className="col-span-12 a_coor">
                    <div className="grid grid-cols-12 gap-4">
                      <p className="col-span-12 ">
                        <strong className="label">
                          {data?.payload?.tech_lang_keys[2]} (a)
                        </strong>
                      </p>
                      <div className="lg:col-span-4 md:col-span-4 col-span-6">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ax"
                            id="tech_ax"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ax}
                            onChange={handleChange}
                          />
                          <span className="input_unit">i</span>
                        </div>
                      </div>
                      <div className="lg:col-span-4 md:col-span-4 col-span-6">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ay"
                            id="tech_ay"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ay}
                            onChange={handleChange}
                          />
                          <span className="input_unit">j</span>
                        </div>
                      </div>
                      {formData.tech_dem == "3" && (
                        <>
                          <div className="lg:col-span-4 md:col-span-4 col-span-6 third_one">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_az"
                                id="tech_az"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_az}
                                onChange={handleChange}
                              />
                              <span className="input_unit">k</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {formData.tech_vector_representation == "point" && (
                <>
                  <div className="lg:col-span-8 md:col-span-8 col-span-12 a_one">
                    <div className="grid grid-cols-12 gap-4">
                      <p className="col-span-12">
                        <strong className="label">
                          {data?.payload?.tech_lang_keys[2]} (a)
                        </strong>
                      </p>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
                        <label htmlFor="tech_1a" className="label">
                          {data?.payload?.tech_lang_keys[6]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_1a"
                            id="tech_1a"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_1a}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ">
                        <label htmlFor="tech_2a" className="label">
                          &nbsp;
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_2a"
                            id="tech_2a"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_2a}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {formData.tech_dem == "3" && (
                    <>
                      <div className="md:col-span-4 col-span-12  a_two">
                        <p className="col-12 mx-2 mt-2">&nbsp;</p>
                        <div className="w-full py-2">
                          <label htmlFor="tech_3a" className="label">
                            &nbsp;
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_3a"
                              id="tech_3a"
                              className="input "
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_3a}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="lg:col-span-8 md:col-span-8 col-span-12 a_three">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ">
                        <label htmlFor="tech_1b" className="label">
                          {data?.payload?.tech_lang_keys[7]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_1b"
                            id="tech_1b"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_1b}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ">
                        <label htmlFor="tech_2b" className="label">
                          &nbsp;
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_2b"
                            id="tech_2b"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_2b}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {formData.tech_dem == "3" && (
                    <>
                      <div className="md:col-span-4 col-span-12 px-2 a_four">
                        <div className="w-full ">
                          <label htmlFor="tech_3b" className="label">
                            &nbsp;
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_3b"
                              id="tech_3b"
                              className="input "
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_3b}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* two */}

              <div className="col-span-12 ">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
                    <label htmlFor="tech_vector_b" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (B){" "}
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_vector_b"
                        id="tech_vector_b"
                        value={formData.tech_vector_b}
                        onChange={handleChange}
                      >
                        <option value="coor">
                          {data?.payload?.tech_lang_keys["4"]}
                        </option>
                        <option value="point">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {formData.tech_vector_b == "coor" && (
                <>
                  <div className="col-span-12 b_coor">
                    <div className="grid grid-cols-12 gap-4">
                      <p className="col-span-12">
                        <strong className="label">
                          {data?.payload?.tech_lang_keys[8]} (b)
                        </strong>
                      </p>
                      <div className="lg:col-span-4 md:col-span-4 col-span-6 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bx"
                            id="tech_bx"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bx}
                            onChange={handleChange}
                          />
                          <span className="input_unit">i</span>
                        </div>
                      </div>
                      <div className="lg:col-span-4 md:col-span-4 col-span-6 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_by"
                            id="tech_by"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_by}
                            onChange={handleChange}
                          />
                          <span className="input_unit">j</span>
                        </div>
                      </div>
                      {formData.tech_dem == "3" && (
                        <>
                          <div className="lg:col-span-4 md:col-span-4 col-span-6  tw">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_bz"
                                id="tech_bz"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_bz}
                                onChange={handleChange}
                              />
                              <span className="input_unit">k</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {formData.tech_vector_b == "point" && (
                <>
                  <div className="lg:col-span-8 md:col-span-8 col-span-12 b_one">
                    <div className="grid grid-cols-12 gap-4">
                      <p className="col-span-12">
                        <strong className="label">
                          {data?.payload?.tech_lang_keys[8]} (b)
                        </strong>
                      </p>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ">
                        <label htmlFor="1aa" className="label">
                          {data?.payload?.tech_lang_keys[6]} (A):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_1aa"
                            id="tech_1aa"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_1aa}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ">
                        <label htmlFor="tech_2aa" className="label">
                          &nbsp;
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_2aa"
                            id="tech_2aa"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_2aa}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {formData.tech_dem == "3" && (
                    <>
                      <div className="md:col-span-4 col-span-12 px-2 b_two">
                        <p className="lg:col-span-6 md:col-span-6 col-span-12 ">
                          &nbsp;
                        </p>
                        <div className="w-full mt-3 ">
                          <label htmlFor="tech_3aa" className="label">
                            &nbsp;
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_3aa"
                              id="tech_3aa"
                              className="input "
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_3aa}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="lg:col-span-8 md:col-span-8 col-span-12 b_three">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ">
                        <label htmlFor="tech_1bb" className="label">
                          {data?.payload?.tech_lang_keys[7]} (B):
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_1bb"
                            id="tech_1bb"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_1bb}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-6 md:col-span-6 col-span-12  ">
                        <label htmlFor="tech_2bb" className="label">
                          &nbsp;
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_2bb"
                            id="tech_2bb"
                            className="input "
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_2bb}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {formData.tech_dem == "3" && (
                    <>
                      <div className="md:col-span-4 col-span-12 px-2 b_four">
                        <div className="w-full ">
                          <label htmlFor="tech_3bb" className="label">
                            &nbsp;
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_3bb"
                              id="tech_3bb"
                              className="input "
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_3bb}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full overflow-auto">
                        {result?.tech_dem == "3" && (
                          <>
                            {result?.tech_vector_representation == "coor" &&
                              result?.tech_vector_b == "coor" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </p>
                                  <p className="col-12 mt-2 text-center font-s-20">
                                    <BlockMath
                                      math={` 
                                            \\operatorname{proj}_{\\vec{u}} \\vec{v} = 
                                            \\left(
                                              \\frac{${
                                                result?.tech_call0 *
                                                result?.tech_ax
                                              }}{${result?.tech_call1}},
                                              \\frac{${
                                                result?.tech_call0 *
                                                result?.tech_ay
                                              }}{${result?.tech_call1}},
                                              \\frac{${
                                                result?.tech_call0 *
                                                result?.tech_az
                                              }}{${result?.tech_call1}}
                                            \\right)
                                          `}
                                    />
                                  </p>

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["12"]}{" "}
                                    {data?.payload?.tech_lang_keys["14"]}
                                  </p>
                                  <p className="col-12 mt-2 text-center font-s-20">
                                    <BlockMath
                                      math={`\\left| \\operatorname{proj}_{\\vec{u}} \\vec{v} \\right| = \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}`}
                                    />
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`\\operatorname{proj}_{\\vec{u}} \\vec{v} = \\frac{\\vec{v} \\cdot \\vec{u}}{\\lVert \\vec{u} \\rVert^2} \\vec{u}`}
                                    />
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`\\vec v \\cdot \\vec u = ${result?.tech_vector_unit}`}
                                    />
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}
                                      <a
                                        href="/dot-product-calculator/"
                                        title="Dot Product Calculator"
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                      )
                                    </span>
                                    <BlockMath
                                      math={`|\\vec u| = \\sqrt{${result?.tech_vector_u}}`}
                                    />
                                  </p>

                                  <p className="text-center">
                                    <span className="text-center">
                                      ({data?.payload?.tech_lang_keys["11"]}
                                      <a
                                        href="/vector-magnitude-calculator"
                                        title="Vector Magnitude Calculator"
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                      )
                                    </span>
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`\\operatorname{proj}_{\\vec{u}} \\vec{v} = 
                                              \\frac{${result?.tech_vector_unit}}{(\\sqrt{${result?.tech_vector_u}})^2}
                                              \\Bigg(${result?.tech_ax}, ${result?.tech_ay}, ${result?.tech_az}\\Bigg)`}
                                    />
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`\\operatorname{proj}_{\\vec{u}} \\vec{v} = 
                                              \\frac{${result?.tech_call0}}{${result?.tech_call1}}
                                              \\Bigg(${result?.tech_ax}, ${result?.tech_ay}, ${result?.tech_az}\\Bigg)`}
                                    />
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`${
                                        data?.payload?.tech_lang_keys["13"]
                                      } ${data?.payload?.tech_lang_keys["14"]} 
                                              \\operatorname{proj}_{\\vec{u}} \\vec{v} = 
                                              \\Bigg(
                                                \\frac{${
                                                  result?.tech_call0 *
                                                  result?.tech_ax
                                                }}{${result?.tech_call1}},
                                                \\frac{${
                                                  result?.tech_call0 *
                                                  result?.tech_ay
                                                }}{${result?.tech_call1}},
                                                \\frac{${
                                                  result?.tech_call0 *
                                                  result?.tech_az
                                                }}{${result?.tech_call1}}
                                              \\Bigg)`}
                                    />
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`\\left| \\operatorname{proj}_{\\vec{u}} \\vec{v} \\right| = 
                                              \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}`}
                                    />
                                  </p>
                                </>
                              )}
                            {result?.tech_vector_representation == "coor" &&
                              result?.tech_vector_b == "point" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </p>
                                  <p className="col-12 mt-2 text-center font-s-20">
                                    <BlockMath
                                      math={`\\operatorname{proj}_{\\vec{u}} \\vec{v} = \\Bigg(
                                              \\frac{${
                                                result?.tech_call0 *
                                                result?.tech_ax
                                              }}{${result?.tech_call1}},
                                              \\frac{${
                                                result?.tech_call0 *
                                                result?.tech_ay
                                              }}{${result?.tech_call1}},
                                              \\frac{${
                                                result?.tech_call0 *
                                                result?.tech_az
                                              }}{${result?.tech_call1}}
                                            \\Bigg)`}
                                    />
                                  </p>

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </p>
                                  <p className="col-12 mt-2 text-center font-s-20">
                                    <BlockMath
                                      math={`|\\operatorname{proj}_{\\vec{u}} \\vec{v}| = \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}`}
                                    />
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`\\operatorname{proj}_{\\vec{u}} \\vec{v} = \\frac{\\vec{v} \\cdot \\vec{u}}{||\\vec{u}||^2} \\vec{u}`}
                                    />
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`\\vec v \\cdot \\vec u = ${result?.tech_vector_unit}`}
                                    />
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}
                                      <a
                                        href="/dot-product-calculator"
                                        title="Dot Product Calculator"
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                      )
                                    </span>
                                    <BlockMath
                                      math={`|\\vec u| = \\sqrt{${result?.tech_vector_u}}`}
                                    />
                                  </p>

                                  <p className="text-center">
                                    <span className="text-center">
                                      ({data?.payload?.tech_lang_keys["11"]}
                                      <a
                                        href="vector-magnitude-calculator"
                                        title="Vector Magnitude Calculator"
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                      )
                                    </span>
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} = 
                                          \\frac{${result?.tech_vector_unit}}{\\left(\\sqrt{${result?.tech_vector_u}}\\right)^2} 
                                          \\Big(${result?.tech_ax}, ${result?.tech_ay}, ${result?.tech_az}\\Big)
                                        `}
                                    />
                                  </p>

                                  <p className="col-12 mt-2">
                                    <BlockMath
                                      math={`
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} = 
                                          \\frac{${result?.tech_call0}}{${result?.tech_call1}} 
                                          \\Big(${result?.tech_ax}, ${result?.tech_ay}, ${result?.tech_az}\\Big)
                                        `}
                                    />
                                    <BlockMath
                                      math={`
                                          Vector\\ ${
                                            data?.payload?.tech_lang_keys["14"]
                                          }\\ 
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} = \\Big(
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ax
                                            }}{${result?.tech_call1}},\\
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ay
                                            }}{${result?.tech_call1}},\\
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_az
                                            }}{${result?.tech_call1}}
                                          \\Big)
                                        `}
                                    />
                                    <BlockMath
                                      math={`
                                          |\\operatorname{proj}_{\\vec{u}} \\vec{v}| = \\frac{\\vec{v} \\cdot \\vec{u}}{|\\vec{u}|}
                                        `}
                                    />
                                    <BlockMath
                                      math={`
                                          |\\operatorname{proj}_{\\vec{u}} \\vec{v}| = \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                        `}
                                    />
                                  </p>
                                </>
                              )}
                            {result?.tech_vector_representation == "coor" &&
                              result?.tech_vector_b == "point" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} = \\Bigg(
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ax
                                            }}{${result?.tech_call1}},
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ay
                                            }}{${result?.tech_call1}},
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_az
                                            }}{${result?.tech_call1}}
                                          \\Bigg)
                                        `}
                                  />

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                          |\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                          \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          ${data?.payload?.tech_lang_keys["13"]} ${data?.payload?.tech_lang_keys["14"]} =
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                          \\frac{ \\vec{v} \\cdot \\vec{u} }{ ||\\vec{u}||^2 } \\vec{u}
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          \\vec{v} \\cdot \\vec{u} = ${result?.tech_vector_unit}
                                        `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`/dot-product-calculator/?res_link=0&g=3d&a_rep=${formData?.tech_vector_representation}&ax=${result?.tech_f1}&ay=${result?.tech_f2}&az=${result?.tech_f3}&b_rep=coor&bx=${result?.tech_ax}&by=${result?.tech_ay}&bz=${result?.tech_az}&submit=vc`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                          |\\vec{u}| = \\sqrt{${result?.tech_vector_u}}
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                          \\frac{${result?.tech_vector_unit}}{(\\sqrt{${result?.tech_vector_u}})^2}
                                          \\Bigg(${result?.tech_ax}, ${result?.tech_ay}, ${result?.tech_az}\\Bigg)
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                          \\frac{${result?.tech_call0}}{${result?.tech_call1}}
                                          \\Bigg(${result?.tech_ax}, ${result?.tech_ay}, ${result?.tech_az}\\Bigg)
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          Vector\\ ${
                                            data?.payload?.tech_lang_keys["14"]
                                          }\\ \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                          \\Bigg(
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ax
                                            }}{${result?.tech_call1}},
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ay
                                            }}{${result?.tech_call1}},
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_az
                                            }}{${result?.tech_call1}}
                                          \\Bigg)
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          ${data?.payload?.tech_lang_keys["12"]}\\ ${data?.payload?.tech_lang_keys["14"]}\\ |\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                          \\frac{ \\vec{v} \\cdot \\vec{u} }{ |\\vec{u}| }
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          ${data?.payload?.tech_lang_keys["12"]}\\ ${data?.payload?.tech_lang_keys["14"]}\\ |\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                          \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                        `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span>
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`/vector-magnitude-calculator/?res_link=0&dem=3d&rep=${result?.tech_vector_representation}&ax=${result?.tech_ax}&ay=${result?.tech_ay}&az=${result?.tech_az}`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                    </span>
                                  </p>
                                </>
                              )}
                            {result?.tech_vector_representation == "point" &&
                              result?.tech_vector_b == "coor" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                        \\operatorname{proj}_{\\vec{u}} \\vec{v} = \\Bigg(
                                          \\frac{${
                                            result?.tech_call0 * result?.tech_bx
                                          }}{${result?.tech_call1}},
                                          \\frac{${
                                            result?.tech_call0 * result?.tech_by
                                          }}{${result?.tech_call1}},
                                          \\frac{${
                                            result?.tech_call0 * result?.tech_bz
                                          }}{${result?.tech_call1}}
                                        \\Bigg)
                                      `}
                                  />

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                        |\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                        \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                      `}
                                  />

                                  <BlockMath
                                    math={`
                                        Vector\\ ${data?.payload?.tech_lang_keys["14"]} =
                                        \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                        \\frac{ \\vec{v} \\cdot \\vec{u} }{ ||\\vec{u}||^2 } \\vec{u}
                                      `}
                                  />

                                  <BlockMath
                                    math={`
                                        \\vec{v} \\cdot \\vec{u} = ${result?.tech_vector_unit}
                                      `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`/dot-product-calculator/?res_link=0&g=3d&a_rep=${result?.tech_vector_b}&ax=${result?.tech_ax}&ay=${result?.tech_ay}&az=${result?.tech_az}&b_rep=coor&bx=${result?.tech_bx}&by=${result?.tech_by}&bz=${result?.tech_bz}&submit=vc`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                        |\\vec u| = \\sqrt{${result?.tech_vector_u}}
                                      `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span>
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`/vector-magnitude-calculator/?res_link=0&dem=3d&rep=${result?.tech_vector_b}&ax=${result?.tech_bx}&ay=${result?.tech_by}&az=${result?.tech_bz}`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                      \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                      \\frac{${result?.tech_vector_unit}}{(\\sqrt{${result?.tech_vector_u}})^2}
                                      \\Bigg(${result?.tech_bx}, ${result?.tech_by}, ${result?.tech_bz}\\Bigg)
                                    `}
                                  />

                                  <BlockMath
                                    math={`
                                      \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                      \\frac{${result?.tech_call0}}{${result?.tech_call1}}
                                      \\Bigg(${result?.tech_bx}, ${result?.tech_by}, ${result?.tech_bz}\\Bigg)
                                    `}
                                  />

                                  <BlockMath
                                    math={`
                                      Vector\\ ${
                                        data?.payload?.tech_lang_keys["14"]
                                      }\\ \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                      \\Bigg(
                                        \\frac{${
                                          result?.tech_call0 * result?.tech_bx
                                        }}{${result?.tech_call1}},
                                        \\frac{${
                                          result?.tech_call0 * result?.tech_by
                                        }}{${result?.tech_call1}},
                                        \\frac{${
                                          result?.tech_call0 * result?.tech_bz
                                        }}{${result?.tech_call1}}
                                      \\Bigg)
                                    `}
                                  />

                                  <BlockMath
                                    math={`
                                      ${data?.payload?.tech_lang_keys["12"]}\\ ${data?.payload?.tech_lang_keys["14"]}\\ |\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                      \\frac{ \\vec{v} \\cdot \\vec{u} }{ |\\vec{u}| }
                                    `}
                                  />

                                  <BlockMath
                                    math={`
                                      ${data?.payload?.tech_lang_keys["12"]}\\ ${data?.payload?.tech_lang_keys["14"]}\\ |\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                      \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                    `}
                                  />
                                </>
                              )}
                            {result?.tech_vector_representation == "point" &&
                              result?.tech_vector_b == "point" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} = \\Bigg(
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ax
                                            }}{${result?.tech_call1}},
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ay
                                            }}{${result?.tech_call1}},
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_az
                                            }}{${result?.tech_call1}}
                                          \\Bigg)
                                        `}
                                  />

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                          |\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                          \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          ${data?.payload?.tech_lang_keys["13"]} ${data?.payload?.tech_lang_keys["14"]} =
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                          \\frac{ \\vec{v} \\cdot \\vec{u} }{ ||\\vec{u}||^2 } \\vec{u}
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          \\vec{v} \\cdot \\vec{u} = ${result?.tech_vector_unit}
                                        `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`/dot-product-calculator/?res_link=0&g=3d&a_rep=coor&ax=${result?.tech_ax}&ay=${result?.tech_ay}&az=${result?.tech_az}&b_rep=coor&bx=${result?.tech_ex}&by=${result?.tech_ey}&bz=${result?.tech_ez}&submit=vc`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                          |\\vec u| = \\sqrt{${result?.tech_vector_u}}
                                        `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span>
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`/vector-magnitude-calculator/?res_link=0&dem=3d&rep=coor&ax=${result?.tech_ax}&ay=${result?.tech_ay}&az=${result?.tech_az}`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                          \\frac{${result?.tech_vector_unit}}{\\left( \\sqrt{${result?.tech_vector_u}} \\right)^2}
                                          \\Bigg(${result?.tech_ax}, ${result?.tech_ay}, ${result?.tech_az}\\Bigg)
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                          \\frac{${result?.tech_call0}}{${result?.tech_call1}}
                                          \\Bigg(${result?.tech_ax}, ${result?.tech_ay}, ${result?.tech_az}\\Bigg)
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          Vector\\;${
                                            data?.payload?.tech_lang_keys["14"]
                                          }\\;\\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                          \\Bigg(
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ax
                                            }}{${result?.tech_call1}},
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_ay
                                            }}{${result?.tech_call1}},
                                            \\frac{${
                                              result?.tech_call0 *
                                              result?.tech_az
                                            }}{${result?.tech_call1}}
                                          \\Bigg)
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          ${data?.payload?.tech_lang_keys["12"]}\\;${data?.payload?.tech_lang_keys["14"]}\\;|\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                          \\frac{ \\vec{v} \\cdot \\vec{u} }{ |\\vec{u}| }
                                        `}
                                  />

                                  <BlockMath
                                    math={`
                                          ${data?.payload?.tech_lang_keys["12"]}\\;${data?.payload?.tech_lang_keys["14"]}\\;|\\operatorname{proj}_{\\vec{u}} \\vec{v}| =
                                          \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                        `}
                                  />
                                </>
                              )}
                          </>
                        )}
                        {result?.tech_dem == "2" && (
                          <>
                            {result?.tech_vector_representation == "coor" &&
                              result?.tech_vector_b == "coor" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                \\operatorname{proj}_{\\vec{u}} \\vec{v} = \\Bigg(
                                  \\frac{${
                                    result?.tech_call0 * result?.tech_ax
                                  }}{${result?.tech_call1}},
                                  \\frac{${
                                    result?.tech_call0 * result?.tech_ay
                                  }}{${result?.tech_call1}}
                                \\Bigg)
                              `}
                                  />

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                \\left| \\operatorname{proj}_{\\vec{u}} \\vec{v} \\right| =
                                \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                              `}
                                  />

                                  <BlockMath
                                    math={`
                                ${data?.payload?.tech_lang_keys["13"]}\\;${data?.payload?.tech_lang_keys["14"]} =
                                \\operatorname{proj}_{\\vec{u}} \\vec{v} =
                                \\frac{ \\vec{v} \\cdot \\vec{u} }{ \\| \\vec{u} \\|^2 } \\vec{u}
                              `}
                                  />

                                  <BlockMath
                                    math={`
                                \\vec{v} \\cdot \\vec{u} = ${result?.tech_vector_unit}
                              `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`dot-product-calculator/?res_link=0&g=2d&a_rep=coor&ax=${result?.tech_bx}&ay=${result?.tech_by}&b_rep=coor&bx=${result?.tech_ax}&by=${result?.tech_ay}&submit=vc`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                  |\\vec u| = \\sqrt{${result?.tech_vector_u}}
                                `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span>
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`vector-magnitude-calculator/?res_link=0&dem=2d&rep=coor&ax=${result?.tech_ax}&ay=${result?.tech_ay}`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                    \\operatorname{proj}_{\\vec u} \\vec{v} =
                                    \\frac{${result?.tech_vector_unit}}{(\\sqrt{${result?.tech_vector_u}})^2}
                                    \\Bigg(${result?.tech_ax}, ${result?.tech_ay}\\Bigg)
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    \\operatorname{proj}_{\\vec u} \\vec{v} =
                                    \\frac{${result?.tech_call0}}{${result?.tech_call1}}
                                    \\Bigg(${result?.tech_ax}, ${result?.tech_ay}\\Bigg)
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    \\text{Vector } ${
                                      data?.payload?.tech_lang_keys["14"]
                                    } \\operatorname{proj}_{\\vec u} \\vec{v} =
                                    \\Bigg(
                                      \\frac{${
                                        result?.tech_call0 * result?.tech_ax
                                      }}{${result?.tech_call1}},
                                      \\frac{${
                                        result?.tech_call0 * result?.tech_ay
                                      }}{${result?.tech_call1}}
                                    \\Bigg)
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    ${data?.payload?.tech_lang_keys["12"]} ${data?.payload?.tech_lang_keys["14"]} 
                                    \\left| \\operatorname{proj}_{\\vec u} \\vec{v} \\right| =
                                    \\frac{ \\vec{v} \\cdot \\vec{u} }{ \\left| \\vec{u} \\right| }
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    ${data?.payload?.tech_lang_keys["12"]} ${data?.payload?.tech_lang_keys["14"]} 
                                    \\left| \\operatorname{proj}_{\\vec u} \\vec{v} \\right| =
                                    \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                  `}
                                  />
                                </>
                              )}
                            {result?.tech_vector_representation == "coor" &&
                              result?.tech_vector_b == "point" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    Vector {data?.payload?.tech_lang_keys["14"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                    \\operatorname{proj}_{\\vec u} \\vec{v} =
                                    \\Bigg(
                                      \\frac{${
                                        result?.tech_call0 * result?.tech_ax
                                      }}{${result?.tech_call1}},
                                      \\frac{${
                                        result?.tech_call0 * result?.tech_ay
                                      }}{${result?.tech_call1}}
                                    \\Bigg)
                                  `}
                                  />

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["10"]}{" "}
                                    {data?.payload?.tech_lang_keys["14"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                    \\left| \\operatorname{proj}_{\\vec u} \\vec{v} \\right| =
                                    \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    ${data?.payload?.tech_lang_keys["13"]} ${data?.payload?.tech_lang_keys["14"]} =
                                    \\operatorname{proj}_{\\vec u} \\vec{v} =
                                    \\frac{ \\vec{v} \\cdot \\vec{u} }{ \\|\\vec{u}\\|^2 } \\vec{u}
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    \\vec{v} \\cdot \\vec{u} = ${result?.tech_vector_unit}
                                  `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`dot-product-calculator/?res_link=0&g=2d&a_rep=coor&ax=${result?.tech_ex}&ay=${result?.tech_ey}&b_rep=coor&bx=${result?.tech_ax}&by=${result?.tech_ay}&submit=vc`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                      |\\vec u| = \\sqrt{${result?.tech_vector_u}}
                                    `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span>
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`vector-magnitude-calculator/?res_link=0&dem=2&rep=coor&ax=${result?.tech_ax}&ay=${result?.tech_ay}`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath math={`|\\vec{u}| = \\sqrt{18}`} />
                                  <BlockMath
                                    math={`\\mathrm{proj}_{\\vec{u}} \\vec{v} = \\frac{21}{(\\sqrt{18})^2} \\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}`}
                                  />

                                  <BlockMath
                                    math={`\\mathrm{proj}_{\\vec{u}} \\vec{v} = \\frac{7}{6} \\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}`}
                                  />

                                  <BlockMath
                                    math={`Vector\\ Projection\\ \\mathrm{proj}_{\\vec{u}} \\vec{v} = \\begin{pmatrix} \\frac{21}{6} \\\\ \\frac{21}{6} \\end{pmatrix}`}
                                  />

                                  <BlockMath
                                    math={`Scalar\\ Projection\\ |\\mathrm{proj}_{\\vec{u}} \\vec{v}| = \\frac{\\vec{v} \\cdot \\vec{u}}{|\\vec{u}|}`}
                                  />

                                  <BlockMath
                                    math={`Scalar\\ Projection\\ |\\mathrm{proj}_{\\vec{u}} \\vec{v}| = \\frac{21}{\\sqrt{18}}`}
                                  />
                                </>
                              )}
                            {result?.tech_vector_representation == "point" &&
                              result?.tech_vector_b == "coor" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                  \\mathrm{proj}_{\\vec{u}} \\vec{v} =
                                  \\Bigg(
                                    \\frac{${
                                      result?.tech_call0 * result?.tech_ax
                                    }}{${result?.tech_call1}},
                                    \\frac{${
                                      result?.tech_call0 * result?.tech_ay
                                    }}{${result?.tech_call1}}
                                  \\Bigg)
                                `}
                                  />

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                |\\mathrm{proj}_{\\vec{u}} \\vec{v}| =
                                \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                              `}
                                  />

                                  <BlockMath
                                    math={`
                                ${data?.payload?.tech_lang_keys["13"]} ${data?.payload?.tech_lang_keys["14"]} =
                                \\mathrm{proj}_{\\vec{u}} \\vec{v} =
                                \\frac{ \\vec{v} \\cdot \\vec{u} }{ ||\\vec{u}||^2 } \\vec{u}
                              `}
                                  />

                                  <BlockMath
                                    math={`
                                \\vec{v} \\cdot \\vec{u} = ${result?.tech_vector_unit}
                              `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`dot-product-calculator/?res_link=0&g=2d&a_rep=coor&ax=${result?.tech_cx}&ay=${result?.tech_cy}&b_rep=coor&bx=${result?.tech_ax}&by=${result?.tech_ay}&submit=vc`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                    |\\vec u| = \\sqrt{${result?.tech_vector_u}}
                                  `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span>
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`vector-magnitude-calculator/?res_link=0&dem=2&rep=coor&ax=${result?.tech_ax}&ay=${result?.tech_ay}`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                              \\mathrm{proj}_{\\vec{u}} \\vec{v} =
                              \\frac{${result?.tech_vector_unit}}{${result?.tech_vector_u}}
                              \\Bigg(${result?.tech_ax}, ${result?.tech_ay}\\Bigg)
                            `}
                                  />

                                  <BlockMath
                                    math={`
                              \\mathrm{proj}_{\\vec{u}} \\vec{v} =
                              \\frac{${result?.tech_call0}}{${result?.tech_call1}}
                              \\Bigg(${result?.tech_ax}, ${result?.tech_ay}\\Bigg)
                            `}
                                  />

                                  <BlockMath
                                    math={`
                              \\text{Vector} \\; ${
                                data?.payload?.tech_lang_keys["14"]
                              } \\mathrm{proj}_{\\vec{u}} \\vec{v} =
                              \\Bigg(
                                \\frac{${
                                  result?.tech_call0 * result?.tech_ax
                                }}{${result?.tech_call1}},
                                \\frac{${
                                  result?.tech_call0 * result?.tech_ay
                                }}{${result?.tech_call1}}
                              \\Bigg)
                            `}
                                  />

                                  <BlockMath
                                    math={`
                              ${data?.payload?.tech_lang_keys["12"]} \\; ${data?.payload?.tech_lang_keys["14"]} \\; |\\mathrm{proj}_{\\vec{u}} \\vec{v}| =
                              \\frac{ \\vec{v} \\cdot \\vec{u} }{ |\\vec{u}| }
                            `}
                                  />

                                  <BlockMath
                                    math={`
                              ${data?.payload?.tech_lang_keys["12"]} \\; ${data?.payload?.tech_lang_keys["14"]} \\; |\\mathrm{proj}_{\\vec{u}} \\vec{v}| =
                              \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                            `}
                                  />
                                </>
                              )}
                            {result?.tech_vector_representation == "point" &&
                              result?.tech_vector_b == "point" && (
                                <>
                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </p>
                                  <BlockMath
                                    math={`
                                        \\mathrm{proj}_{\\vec{u}} \\vec{v} = 
                                        \\Bigg(
                                          \\frac{${
                                            result?.tech_call0 * result?.tech_ax
                                          }}{${result?.tech_call1}}, \\
                                          \\frac{${
                                            result?.tech_call0 * result?.tech_ay
                                          }}{${result?.tech_call1}}
                                        \\Bigg)
                                      `}
                                  />

                                  <p className="col-12 text-[18px] mt-2 text-center text-blue">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </p>

                                  <BlockMath
                                    math={`
                                        |\\mathrm{proj}_{\\vec{u}} \\vec{v}| = 
                                        \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                      `}
                                  />

                                  <BlockMath
                                    math={`
                                        ${data?.payload?.tech_lang_keys["13"]} ${data?.payload?.tech_lang_keys["14"]} = 
                                        \\mathrm{proj}_{\\vec{u}} \\vec{v} = 
                                        \\frac{\\vec{v} \\cdot \\vec{u}}{||\\vec{u}||^2} \\vec{u}
                                      `}
                                  />

                                  <BlockMath
                                    math={`
                                        \\vec{v} \\cdot \\vec{u} = ${result?.tech_vector_unit}
                                      `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span className="font_size18">
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`dot-product-calculator/?res_link=0&g=2d&a_rep=coor&ax=${result?.tech_ax}&ay=${result?.tech_ay}&b_rep=coor&bx=${result?.tech_dx}&by=${result?.tech_dy}&submit=vc`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Dot Product Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                      |\\vec u| = \\sqrt{${result?.tech_vector_u}}
                                    `}
                                  />

                                  <p className="col-12 mt-2 text-center">
                                    <span>
                                      ({data?.payload?.tech_lang_keys["11"]}){" "}
                                      <a
                                        href={`vector-magnitude-calculator/?res_link=0&dem=2&rep=coor&ax=${result?.tech_ax}&ay=${result?.tech_ay}`}
                                        target="_blank"
                                        rel="noopener"
                                      >
                                        Vector Magnitude Calculator
                                      </a>
                                    </span>
                                  </p>

                                  <BlockMath
                                    math={`
                                    \\mathrm{proj}_{\\vec{u}} \\vec{v} =
                                    \\frac{${result?.tech_vector_unit}}{\\left( \\sqrt{${result?.tech_vector_u}} \\right)^2}
                                    \\Bigg(${result?.tech_ax}, ${result?.tech_ay}\\Bigg)
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    \\mathrm{proj}_{\\vec{u}} \\vec{v} =
                                    \\frac{${result?.tech_call0}}{${result?.tech_call1}}
                                    \\Bigg(${result?.tech_ax}, ${result?.tech_ay}\\Bigg)
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    \\text{Vector} \\; ${
                                      data?.payload?.tech_lang_keys["14"]
                                    } \\; \\mathrm{proj}_{\\vec{u}} \\vec{v} =
                                    \\Bigg(
                                      \\frac{${
                                        result?.tech_call0 * result?.tech_ax
                                      }}{${result?.tech_call1}},
                                      \\frac{${
                                        result?.tech_call0 * result?.tech_ay
                                      }}{${result?.tech_call1}}
                                    \\Bigg)
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    ${data?.payload?.tech_lang_keys["12"]} \\; ${data?.payload?.tech_lang_keys["14"]} \\; |\\mathrm{proj}_{\\vec{u}} \\vec{v}| =
                                    \\frac{ \\vec{v} \\cdot \\vec{u} }{ |\\vec{u}| }
                                  `}
                                  />

                                  <BlockMath
                                    math={`
                                    ${data?.payload?.tech_lang_keys["12"]} \\; ${data?.payload?.tech_lang_keys["14"]} \\; |\\mathrm{proj}_{\\vec{u}} \\vec{v}| =
                                    \\frac{${result?.tech_vector_unit}}{\\sqrt{${result?.tech_vector_u}}}
                                  `}
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

export default VectorProjectionCalculator;
