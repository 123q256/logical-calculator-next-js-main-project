"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useLaborCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

// import {
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LaborCostCalculator = () => {
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
    tech_h_p_w: "40",
    tech_p_r: "10",
    tech_a_d_p_y: "15",
    tech_tax: "900",
    tech_insurance: "600",
    tech_benefits: "1200",
    tech_overtime: "800",
    tech_supplies: "400",
    tech_total_revenue: "80000",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLaborCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_h_p_w ||
      !formData.tech_p_r ||
      !formData.tech_a_d_p_y ||
      !formData.tech_tax ||
      !formData.tech_insurance ||
      !formData.tech_benefits ||
      !formData.tech_overtime ||
      !formData.tech_supplies ||
      !formData.tech_total_revenue
    ) {
      setFormError("Please fill in Field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_h_p_w: formData.tech_h_p_w,
        tech_p_r: formData.tech_p_r,
        tech_a_d_p_y: formData.tech_a_d_p_y,
        tech_tax: formData.tech_tax,
        tech_insurance: formData.tech_insurance,
        tech_benefits: formData.tech_benefits,
        tech_overtime: formData.tech_overtime,
        tech_supplies: formData.tech_supplies,
        tech_total_revenue: formData.tech_total_revenue,
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
      tech_h_p_w: "40",
      tech_p_r: "10",
      tech_a_d_p_y: "15",
      tech_tax: "900",
      tech_insurance: "600",
      tech_benefits: "1200",
      tech_overtime: "800",
      tech_supplies: "400",
      tech_total_revenue: "80000",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-3">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_h_p_w" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_h_p_w"
                    id="tech_h_p_w"
                    className="input my-2"
                    aria-label="input"
                    placeholder="10"
                    value={formData.tech_h_p_w}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["2"]}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_p_r" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="  relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_p_r"
                    id="tech_p_r"
                    className="input my-2"
                    aria-label="input"
                    placeholder="10"
                    value={formData.tech_p_r}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}/{data?.payload?.tech_lang_keys["2"]}
                  </span>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_a_d_p_y" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="  relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_a_d_p_y"
                    id="tech_a_d_p_y"
                    className="input my-2"
                    aria-label="input"
                    placeholder="15"
                    value={formData.tech_a_d_p_y}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {data?.payload?.tech_lang_keys["5"]}
                  </span>
                </div>
              </div>
              <div className="col-span-12">
                <p>
                  <strong>{data?.payload?.tech_lang_keys["23"]}</strong>
                </p>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_tax" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className=" py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_tax"
                    id="tech_tax"
                    className="input my-2"
                    aria-label="input"
                    placeholder="900"
                    value={formData.tech_tax}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_insurance" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_insurance"
                    id="tech_insurance"
                    className="input my-2"
                    aria-label="input"
                    placeholder="600"
                    value={formData.tech_insurance}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_benefits" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_benefits"
                    id="tech_benefits"
                    className="input my-2"
                    aria-label="input"
                    placeholder="1200"
                    value={formData.tech_benefits}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_overtime" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className=" py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_overtime"
                    id="tech_overtime"
                    className="input my-2"
                    aria-label="input"
                    placeholder="800"
                    value={formData.tech_overtime}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_supplies" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className=" py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_supplies"
                    id="tech_supplies"
                    className="input my-2"
                    aria-label="input"
                    placeholder="400"
                    value={formData.tech_supplies}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_total_revenue" className="label">
                  {data?.payload?.tech_lang_keys["11"]}:
                </label>
                <div className=" py-2 relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_total_revenue"
                    id="tech_total_revenue"
                    className="input my-2"
                    aria-label="input"
                    placeholder="80000"
                    value={formData.tech_total_revenue}
                    onChange={handleChange}
                  />
                  <span className="text-blue input_unit">
                    {currency.symbol}
                  </span>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
                                  {data?.payload?.tech_lang_keys["12"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {" "}
                                {currency.symbol}{" "}
                                {Number(
                                  result?.tech_annual_p_labor_cost
                                ).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="70%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {currency.symbol}{" "}
                                {Number(result?.tech_h_l_cost).toFixed(3)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="col-12  text-[16px]">
                        <div className="col ">
                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["15"]}
                            </strong>
                          </p>
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["16"]}{" "}
                              {data?.payload?.tech_lang_keys["17"]}.
                            </strong>{" "}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["18"]}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} ={" "}
                            {data?.payload?.tech_lang_keys["1"]} x 52
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["18"]}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} ={" "}
                            {result?.tech_h_p_w} x 52
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["18"]}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} ={" "}
                            {result?.tech_g_h_per_year}{" "}
                            {data?.payload?.tech_lang_keys["2"]}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["17"]} ={" "}
                            {data?.payload?.tech_lang_keys["18"]}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} x{" "}
                            {data?.payload?.tech_lang_keys["3"]}{" "}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["17"]} ={" "}
                            {result?.tech_g_h_per_year} x {result?.tech_p_r}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["17"]} ={" "}
                            {result?.tech_gross_pay} {currency.symbol}
                          </p>
                          <p className="mt-2 ">
                            <strong>
                              {" "}
                              {data?.payload?.tech_lang_keys["16"]}{" "}
                              {data?.payload?.tech_lang_keys["22"]}{" "}
                              {data?.payload?.tech_lang_keys["2"]}{" "}
                              {data?.payload?.tech_lang_keys["20"]}.
                            </strong>
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                            {data?.payload?.tech_lang_keys["20"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} ={" "}
                            {data?.payload?.tech_lang_keys["4"]} x 8
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                            {data?.payload?.tech_lang_keys["20"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} ={" "}
                            {result?.tech_a_d_p_y} x 8
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                            {data?.payload?.tech_lang_keys["20"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} ={" "}
                            {result?.tech_n_w_p_year}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["22"]}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["20"]} = Gross{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]} -{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                            {data?.payload?.tech_lang_keys["20"]}{" "}
                            {data?.payload?.tech_lang_keys["19"]}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["22"]}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["20"]} ={" "}
                            {result?.tech_g_h_per_year} -{" "}
                            {result?.tech_n_w_p_year}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["22"]}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                            {data?.payload?.tech_lang_keys["20"]} ={" "}
                            {result?.tech_net_h_work}{" "}
                            {data?.payload?.tech_lang_keys["2"]}{" "}
                          </p>
                          <p className="mt-2">
                            {" "}
                            <strong>
                              {data?.payload?.tech_lang_keys["16"]}{" "}
                              {data?.payload?.tech_lang_keys["23"]}.
                            </strong>{" "}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["24"]} ={" "}
                            {data?.payload?.tech_lang_keys["6"]} +{" "}
                            {data?.payload?.tech_lang_keys["7"]} +{" "}
                            {data?.payload?.tech_lang_keys["8"]} +{" "}
                            {data?.payload?.tech_lang_keys["9"]} +{" "}
                            {data?.payload?.tech_lang_keys["10"]}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["24"]} ={" "}
                            {result?.tech_tax} + {result?.tech_insurance} +{" "}
                            {result?.tech_benefits} + {result?.tech_overtime} +{" "}
                            {result?.tech_supplies}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["24"]} ={" "}
                            {result?.tech_annual_cost} \ {currency.symbol}
                          </p>
                          <p className="mt-2">
                            <strong>
                              {" "}
                              {data?.payload?.tech_lang_keys["16"]}{" "}
                              {data?.payload?.tech_lang_keys["25"]}.
                            </strong>{" "}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["12"]} ={" "}
                            {data?.payload?.tech_lang_keys["17"]} +{" "}
                            {data?.payload?.tech_lang_keys["24"]}{" "}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["12"]} ={" "}
                            {result?.tech_gross_pay} +{" "}
                            {result?.tech_annual_cost}
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["12"]} ={" "}
                            {Number(result?.tech_annual_p_labor_cost).toFixed(
                              2
                            )}{" "}
                            {currency.symbol}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["13"]} =
                            <span
                              className="fractionUpDown"
                              aria-label="fractionUpDown with sum over count"
                            >
                              <span className="num">
                                {data?.payload?.tech_lang_keys["12"]}
                              </span>
                              <span className="visually-hidden"> / </span>
                              <span className="den">
                                {" "}
                                Net {data?.payload?.tech_lang_keys["2"]}{" "}
                                {data?.payload?.tech_lang_keys["20"]}
                              </span>
                            </span>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["13"]} =
                            <span
                              className="fractionUpDown"
                              aria-label="fractionUpDown with sum over count"
                            >
                              <span className="num">
                                {Number(
                                  result?.tech_annual_p_labor_cost
                                ).toFixed(2)}
                              </span>
                              <span className="visually-hidden"> / </span>
                              <span className="den">
                                {result?.tech_net_h_work}
                              </span>
                            </span>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["13"]} =
                            <span
                              className="fractionUpDown"
                              aria-label="fractionUpDown with sum over count"
                            >
                              <span className="num">
                                {Number(result?.tech_h_l_cost).toFixed(3)}
                              </span>
                              <span className="visually-hidden"> / </span>
                              <span className="den">
                                {result?.tech_total_revenue}
                              </span>
                            </span>{" "}
                            x 100
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["13"]} ={" "}
                            {Number(result?.tech_h_l_cost).toFixed(3)}{" "}
                            {currency.symbol}{" "}
                          </p>
                          <p className="mt-2">
                            {" "}
                            <strong>
                              {" "}
                              {data?.payload?.tech_lang_keys["16"]}{" "}
                              {data?.payload?.tech_lang_keys["26"]}.
                            </strong>{" "}
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["26"]} =
                            <span
                              className="fractionUpDown"
                              aria-label="fractionUpDown with sum over count"
                            >
                              <span className="num">
                                {data?.payload?.tech_lang_keys["12"]}
                              </span>
                              <span className="visually-hidden"> / </span>
                              <span className="den">
                                {data?.payload?.tech_lang_keys["11"]}
                              </span>
                            </span>{" "}
                            x 100
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["26"]} =
                            <span
                              className="fractionUpDown"
                              aria-label="fractionUpDown with sum over count"
                            >
                              <span className="num">
                                {Number(
                                  result?.tech_annual_p_labor_cost
                                ).toFixed(2)}
                              </span>
                              <span className="visually-hidden"> / </span>
                              <span className="den">
                                {result?.tech_total_revenue}
                              </span>
                            </span>{" "}
                            x 100
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["26"]} ={" "}
                            {result?.tech_l_c_percentge} x 100
                          </p>
                          <p className="mt-2">
                            {" "}
                            {data?.payload?.tech_lang_keys["26"]} ={" "}
                            {Number(result?.tech_l_c_percentge * 100).toFixed(
                              1
                            )}{" "}
                            %
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

export default LaborCostCalculator;
