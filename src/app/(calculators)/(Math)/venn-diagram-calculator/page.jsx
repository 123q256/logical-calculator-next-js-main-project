"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useVennDiagramCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VennDiagramCalculator = () => {
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
    tech_selection: "twoset", // threeset  twoset
    tech_venn_name: "Venn diagram 2 Set",
    tech_ta: "A",
    tech_tb: "B",
    tech_a: "10",
    tech_b: "20",
    tech_u: "30",
    tech_c: "40",
    tech_venn_name3: "Venn diagram 3 Set",
    tech_ta3: "A",
    tech_tb3: "B",
    tech_tc3: "C",
    tech_a3: "10",
    tech_b3: "20",
    tech_c3: "30",
    tech_u3: "40",
    tech_anb3: "50",
    tech_bnc3: "60",
    tech_cna3: "70",
    tech_anbnc: "80",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVennDiagramCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_venn_name: formData.tech_venn_name,
        tech_ta: formData.tech_ta,
        tech_tb: formData.tech_tb,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_u: formData.tech_u,
        tech_c: formData.tech_c,
        tech_venn_name3: formData.tech_venn_name3,
        tech_ta3: formData.tech_ta3,
        tech_tb3: formData.tech_tb3,
        tech_tc3: formData.tech_tc3,
        tech_a3: formData.tech_a3,
        tech_b3: formData.tech_b3,
        tech_c3: formData.tech_c3,
        tech_u3: formData.tech_u3,
        tech_anb3: formData.tech_anb3,
        tech_bnc3: formData.tech_bnc3,
        tech_cna3: formData.tech_cna3,
        tech_anbnc: formData.tech_anbnc,
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
      tech_selection: "twoset", // threeset  twoset
      tech_venn_name: "Venn diagram 2 Set",
      tech_ta: "A",
      tech_tb: "B",
      tech_a: "10",
      tech_b: "20",
      tech_u: "30",
      tech_c: "40",
      tech_venn_name3: "Venn diagram 3 Set",
      tech_ta3: "A",
      tech_tb3: "B",
      tech_tc3: "C",
      tech_a3: "10",
      tech_b3: "20",
      tech_c3: "30",
      tech_u3: "40",
      tech_anb3: "50",
      tech_bnc3: "60",
      tech_cna3: "70",
      tech_anbnc: "80",
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
          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_selection"
                id="calculator_time"
                value={formData.tech_selection}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_selection === "twoset" ? "tagsUnit" : ""
                    }`}
                    id="twoset"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "twoset" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_selection === "threeset" ? "tagsUnit" : ""
                    }`}
                    id="threeset"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "threeset" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              {formData.tech_selection == "twoset" && (
                <>
                  <div className="col-span-12 mt-3 toset">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12">
                        <label htmlFor="tech_venn_name" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_venn_name"
                            id="tech_venn_name"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_venn_name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_ta" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_ta"
                            id="tech_ta"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ta}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_tb" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_tb"
                            id="tech_tb"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_tb}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_a" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a"
                            id="tech_a"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_a}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_b" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_b"
                            id="tech_b"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_b}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_u" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_u"
                            id="tech_u"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_u}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_c" className="label">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_c"
                            id="tech_c"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_c}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "threeset" && (
                <>
                  <div className="col-span-12 threeset mt-3">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12">
                        <label htmlFor="tech_venn_name3" className="label">
                          {data?.payload?.tech_lang_keys["3"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_venn_name3"
                            id="tech_venn_name3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_venn_name3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_ta3" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_ta3"
                            id="tech_ta3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ta3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_tb3" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_tb3"
                            id="tech_tb3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_tb3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_tc3" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_tc3"
                            id="tech_tc3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_tc3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_a3" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
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
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_b3" className="label">
                          {data?.payload?.tech_lang_keys["7"]}:
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
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_c3" className="label">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_c3"
                            id="tech_c3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_c3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12">
                        <label htmlFor="tech_u3" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_u3"
                            id="tech_u3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_u3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_anb3" className="label">
                          {data?.payload?.tech_lang_keys["9"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_anb3"
                            id="tech_anb3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_anb3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_bnc3" className="label">
                          {data?.payload?.tech_lang_keys["12"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bnc3"
                            id="tech_bnc3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bnc3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-4">
                        <label htmlFor="tech_cna3" className="label">
                          {data?.payload?.tech_lang_keys["13"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_cna3"
                            id="tech_cna3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_cna3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-span-12">
                        <label htmlFor="tech_anbnc" className="label">
                          {data?.payload?.tech_lang_keys["14"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_anbnc"
                            id="tech_anbnc"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_anbnc}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3 overflow-auto">
                      <div className="w-full">
                        {result?.tech_venn_name && (
                          <>
                            <p className="text-accent-4 text-center">
                              {data?.payload?.tech_lang_keys[15]}
                            </p>
                            <span className="uclass ml-[120px]">
                              U = {result?.tech_u}
                            </span>
                            <div className="venn text-center overflow-auto">
                              <div className="circle">
                                <div className="a10">
                                  {result?.tech_ta}
                                  <br />
                                  {result?.tech_a}
                                </div>
                                <div className="aonly">
                                  {result?.tech_a - result?.tech_c}
                                </div>
                              </div>
                              <div className="circle">
                                <div className="b20">
                                  {result?.tech_tb}
                                  <br />
                                  {result?.tech_b}
                                </div>
                                <div className="bonly">
                                  {result?.tech_b - result?.tech_c}
                                </div>
                              </div>
                              <div id="res2">D = {result?.tech_res2set}</div>
                              <div className="joined">{result?.tech_c}</div>
                            </div>
                            {/* Set A explanation */}
                            <p className="text-accent-4 font_s25 mb-2">
                              {data?.payload?.tech_lang_keys[17]}:
                            </p>
                            <p className="text-accent-4 font_size18 mb-2">
                              <strong>
                                {result?.tech_ta}{" "}
                                {data?.payload?.tech_lang_keys[18]}:
                              </strong>
                            </p>
                            <p className="text-accent-4">
                              {result?.tech_ta}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_a} - {result?.tech_c}
                            </p>
                            <p className="text-accent-4 mb-2">
                              {result?.tech_ta}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_a - result?.tech_c}
                            </p>
                            {/* Set B explanation */}
                            <p className="text-accent-4 font_size18 mb-2">
                              <strong>
                                {result?.tech_tb}{" "}
                                {data?.payload?.tech_lang_keys[18]}:
                              </strong>
                            </p>
                            <p className="text-accent-4">
                              {result?.tech_tb}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_b} - {result?.tech_c}
                            </p>
                            <p className="text-accent-4 mb-2">
                              {result?.tech_tb}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_b - result?.tech_c}
                            </p>
                            {/* D explanation */}
                            <p className="text-accent-4 font_size18 mb-2">
                              <strong>
                                D ({data?.payload?.tech_lang_keys[19]}):
                              </strong>
                            </p>
                            <p className="text-accent-4">
                              D = {result?.tech_u} - (
                              {result?.tech_a - result?.tech_c} +{" "}
                              {result?.tech_b - result?.tech_c} +{" "}
                              {result?.tech_c})
                            </p>
                            <p className="text-accent-4">
                              D = {result?.tech_u} - ({result?.tech_res})
                            </p>
                            <p className="text-accent-4">
                              D = {result?.tech_res2set}
                            </p>
                          </>
                        )}

                        {/* For 3-set Venn diagram */}
                        {result?.tech_venn_name3 && (
                          <>
                            <p className="text-center">
                              {data?.payload?.tech_lang_keys[15]}
                            </p>
                            <br />
                            <div id="Infographic">
                              <div className="a21">
                                {result?.tech_ta3} <br />
                                {result?.tech_a3}
                              </div>
                              <div className="o2">{result?.tech_anb3}</div>
                              <div className="b22">
                                {result?.tech_tb3} <br />
                                {result?.tech_b3}
                              </div>
                              <div id="c1" className="circle">
                                <div className="a_only">
                                  {result?.tech_a_only}
                                </div>
                                <div id="j12">{result?.tech_ab}</div>
                              </div>
                              <div id="c2" className="circle">
                                <div className="b_only">
                                  {result?.tech_b_only}
                                </div>
                              </div>
                              <div id="c3" className="circle">
                                <div id="j13" className="joined">
                                  {result?.tech_ca}
                                </div>
                                <div className="c_only">
                                  {result?.tech_c_only}
                                </div>
                                <div id="j23" className="joined">
                                  {result?.tech_bc}
                                </div>
                                <div id="j70">{result?.tech_cna3}</div>
                                <div id="j60">{result?.tech_bnc3}</div>
                                <div className="c13">
                                  {result?.tech_tc3}
                                  <br />
                                  {result?.tech_c3}
                                </div>
                                <div className="d10">D={result?.tech_d}</div>
                                <div id="j80">{result?.tech_anbnc}</div>
                              </div>
                            </div>

                            <p className="color_blue text-accent-4  font_s25 ">
                              {data?.payload?.tech_lang_keys[17]}:
                            </p>
                            <p className=" text-accent-4 ">
                              <strong>
                                x = {result?.tech_ta3}∩{result?.tech_tb3}∩
                                {result?.tech_tc3}
                              </strong>
                            </p>
                            <p className="text-accent-4  font_size18">
                              <strong>
                                {" "}
                                {result?.tech_ta3}{" "}
                                {data?.payload?.tech_lang_keys[18]}:
                              </strong>
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_ta3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_ta3} - ( ab + x + ca ){" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_ta3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_a3} - ({result?.tech_ab} +{" "}
                              {result?.tech_anbnc} + ({result?.tech_ca}))
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_ta3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_a_only}
                            </p>
                            <p className="text-accent-4  font_size18">
                              <strong>
                                {" "}
                                {result?.tech_tb3}{" "}
                                {data?.payload?.tech_lang_keys[18]}:
                              </strong>
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tb3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_tb3} - ( bc + x + ab ){" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tb3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_b3} - ({result?.tech_bc} +{" "}
                              {result?.tech_anbnc} + ({result?.tech_ab})){" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tb3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_b_only}
                            </p>
                            <p className="text-accent-4  font_size18">
                              <strong>
                                {" "}
                                {result?.tech_tc3}{" "}
                                {data?.payload?.tech_lang_keys[18]}:
                              </strong>
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tc3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_tc3} - ( bc + x + ca ){" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tc3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_c3} - ({result?.tech_bc} +{" "}
                              {result?.tech_anbnc} + ({result?.tech_ca})){" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tc3}{" "}
                              {data?.payload?.tech_lang_keys[18]} ={" "}
                              {result?.tech_c_only}
                            </p>
                            <p className="text-accent-4  font_size18">
                              <strong>
                                {" "}
                                {result?.tech_ta3}
                                {result?.tech_tb3}:
                              </strong>
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_ta3}
                              {result?.tech_tb3} = ({result?.tech_ta3}∩
                              {result?.tech_tb3}) - x{" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_ta3}
                              {result?.tech_tb3} = {result?.tech_anb3} -{" "}
                              {result?.tech_anbnc}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_ta3}
                              {result?.tech_tb3} = {result?.tech_ab}
                            </p>
                            <p className="text-accent-4  font_size18">
                              <strong>
                                {" "}
                                {result?.tech_tb3}
                                {result?.tech_tc3}:
                              </strong>
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tb3}
                              {result?.tech_tc3} = ({result?.tech_tb3}∩
                              {result?.tech_tc3}) - x{" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tb3}
                              {result?.tech_tc3} = {result?.tech_bnc3} -{" "}
                              {result?.tech_anbnc}{" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tb3}
                              {result?.tech_tc3} = {result?.tech_bc}
                            </p>
                            <p className="text-accent-4  font_size18">
                              <strong>
                                {" "}
                                {result?.tech_tc3}
                                {result?.tech_ta3}:
                              </strong>
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tc3}
                              {result?.tech_ta3} = ({result?.tech_tc3}∩
                              {result?.tech_ta3}) - x{" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tc3}
                              {result?.tech_ta3} = {result?.tech_cna3} -{" "}
                              {result?.tech_anbnc}{" "}
                            </p>
                            <p className=" text-accent-4 ">
                              {result?.tech_tc3}
                              {result?.tech_ta3} = {result?.tech_ca}
                            </p>
                            <p className="text-accent-4  font_size18">
                              <strong>
                                {" "}
                                D ({data?.payload?.tech_lang_keys[19]}):
                              </strong>
                            </p>
                            <p className=" text-accent-4 ">
                              D = U - ({result?.tech_ta3}{" "}
                              {data?.payload?.tech_lang_keys[18]} +{" "}
                              {result?.tech_tb3}{" "}
                              {data?.payload?.tech_lang_keys[18]} +{" "}
                              {result?.tech_tc3}{" "}
                              {data?.payload?.tech_lang_keys[18]} +{" "}
                              {result?.tech_ta3}
                              {result?.tech_tb3} + {result?.tech_tb3}
                              {result?.tech_tc3} + {result?.tech_tc3}
                              {result?.tech_ta3} + x){" "}
                            </p>
                            <p className=" text-accent-4 ">
                              D = {result?.tech_u3} - ({result?.tech_a_only}) +
                              ({result?.tech_b_only}) + ({result?.tech_c_only})
                              + ({result?.tech_ab}) + ({result?.tech_bc}) + (
                              {result?.tech_ca}) + ({result?.tech_anbnc}){" "}
                            </p>
                            <p className=" text-accent-4 ">
                              D = {result?.tech_u3} - ({result?.tech_res}){" "}
                            </p>
                            <p className=" text-accent-4 ">
                              D = {result?.tech_d}
                            </p>
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

export default VennDiagramCalculator;
