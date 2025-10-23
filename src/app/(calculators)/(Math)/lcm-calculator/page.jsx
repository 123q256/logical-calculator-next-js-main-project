"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useLcmCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LcmCalculator = () => {
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
    tech_x: "12, 44, 10, 8, 18, 20, 26",
    tech_method: "none", // none lm  Pf gcf cl  dm
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLcmCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_x || !formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_x: formData.tech_x,
        tech_method: formData.tech_method,
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
      tech_x: "12, 44, 10, 8, 18, 20, 26",
      tech_method: "none", // none lm  Pf gcf cl  dm
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["enter"]}{" "}
                  {data?.payload?.tech_lang_keys["comoa"]}:
                </label>
                <div className="w-full py-2">
                  <textarea
                    name="tech_x"
                    id="tech_x"
                    className="input textareaInput"
                    aria-label="textarea input"
                    placeholder="e.g. 6, 7, 7, 8, 12, 14, 15, 16, 16, 19"
                    value={formData.tech_x || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["m"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="none">
                      {data?.payload?.tech_lang_keys["none"]}{" "}
                    </option>
                    <option value="lm">
                      {data?.payload?.tech_lang_keys["list"]}{" "}
                    </option>
                    <option value="Pf">
                      {data?.payload?.tech_lang_keys["prime"]}{" "}
                    </option>
                    <option value="gcf">
                      {data?.payload?.tech_lang_keys["gcf"]}{" "}
                    </option>
                    <option value="cl">
                      {data?.payload?.tech_lang_keys["cake"]}{" "}
                    </option>
                    <option value="dm">
                      {data?.payload?.tech_lang_keys["divi"]}{" "}
                    </option>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {formData?.tech_method == "none" ? (
                          <>
                            <div className="w-full text-center text-[20px]">
                              <p>
                                {data?.payload?.tech_lang_keys["of_"]}{" "}
                                {formData?.tech_x}
                              </p>
                              <p className="my-3">
                                <strong className="bg-[#2845F5] px-3 py-2 md:text-[32px] rounded-lg text-white">
                                  {result?.tech_lcm}
                                </strong>
                              </p>
                            </div>
                          </>
                        ) : formData?.tech_method == "lm" ? (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="80%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["of_"]}{" "}
                                        {formData?.tech_x}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_lcm}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="w-full text-[16px] overflow-auto">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["sol"]} (
                                  {data?.payload?.tech_lang_keys["list"]}) :
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["find"]}.
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["val"]} : (
                                {formData?.tech_x})
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["to_f"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["multi"]}{" "}
                                {formData?.tech_x}:
                              </p>

                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_sl,
                                }}
                              ></p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["there"]} (
                                {formData?.tech_x}){" "}
                                {data?.payload?.tech_lang_keys["hc"]} "
                                {result?.tech_lcm}".
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["so"]} (
                                {formData?.tech_x}) = "{result?.tech_lcm}"
                              </p>
                            </div>
                          </>
                        ) : formData?.tech_method == "Pf" ? (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="80%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["of_"]}{" "}
                                        {formData?.tech_x}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_lcm}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="w-full text-[16px]">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["sol"]} (
                                  {data?.payload?.tech_lang_keys["prime"]}):
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["val"]} : (
                                {formData?.tech_x})
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["to_f"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["list_p"]}:
                              </p>
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_sl,
                                }}
                              ></p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["for_"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["new"]} ={" "}
                                {result?.tech_ss} = {result?.tech_lcm}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["of_"]} (
                                {formData?.tech_x}){" "}
                                {data?.payload?.tech_lang_keys["is"]} "
                                {result?.tech_lcm}"
                              </p>
                            </div>
                          </>
                        ) : formData?.tech_method == "gcf" ? (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="80%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["of_"]}{" "}
                                        {formData?.tech_x}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_lcm}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="w-full text-[16px]">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["sol"]} (
                                  {data?.payload?.tech_lang_keys["gcf"]}) :
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["val"]} : (
                                {formData?.tech_x})
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["to_f"]}
                              </p>
                              <p className="mt-2">LCM = (a × b) / GCF(a, b)</p>
                              <p
                                className="mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: result?.tech_lce,
                                }}
                              ></p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["of_"]} (
                                {formData?.tech_x}) = "{result?.tech_lcm}"
                              </p>
                            </div>
                          </>
                        ) : formData?.tech_method == "cl" ? (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="80%">
                                      <strong>LCM of {formData?.tech_x}</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_lcm}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="w-full text-[16px] overflow-auto">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["sol"]} (
                                  {data?.payload?.tech_lang_keys["cake"]}{" "}
                                  {data?.payload?.tech_lang_keys["m"]})
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["val"]} : (
                                {formData?.tech_x})
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["to_f"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["cake"]}
                              </p>

                              <table className="w-full text-center border-collapse border">
                                <tbody>
                                  {result?.tech_fd?.map((item, keyIndex) => (
                                    <tr key={keyIndex}>
                                      <td className="py-2 border-b font-bold">
                                        {item}
                                      </td>
                                      {result?.tech_ev?.map((_, colIndex) => {
                                        const flatIndex =
                                          keyIndex * result.tech_ev.length +
                                          colIndex;
                                        return (
                                          <td
                                            key={colIndex}
                                            className="py-2 border-b"
                                          >
                                            {result?.tech_sd?.[flatIndex] ?? ""}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}

                                  {/* Final row */}
                                  <tr>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    {result?.tech_ev?.map((_, colIndex) => {
                                      const flatIndex =
                                        result?.tech_fd?.length *
                                          result?.tech_ev?.length +
                                        colIndex;
                                      return (
                                        <td
                                          key={colIndex}
                                          className="py-2 border-b"
                                        >
                                          {result?.tech_sd?.[flatIndex] ?? ""}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                </tbody>
                              </table>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["lcm_is"]}.
                              </p>
                              <p className="mt-2">LCM = {result?.tech_sl}</p>
                              <p className="mt-2">LCM = {result?.tech_lcm}</p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["of_"]} (
                                {formData?.tech_x}) = "{result?.tech_lcm}"
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="80%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["of_"]}{" "}
                                        {formData?.tech_x}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_lcm}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="w-full text-[16px]">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["sol"]} (
                                  {data?.payload?.tech_lang_keys["divi"]}) :
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["write"]}.
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["simply"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["divis"]}:
                              </p>

                              <table className="w-full text-center border-collapse border overflow-auto">
                                <tbody>
                                  {result?.tech_fd?.map((item, keyIndex) => (
                                    <tr key={keyIndex}>
                                      <td className="py-2 border-b font-bold">
                                        {item}
                                      </td>
                                      {result?.tech_ev?.map((_, colIndex) => {
                                        const flatIndex =
                                          keyIndex * result.tech_ev.length +
                                          colIndex;
                                        return (
                                          <td
                                            key={colIndex}
                                            className="py-2 border-b"
                                          >
                                            {result?.tech_sd?.[flatIndex] ?? ""}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}

                                  {/* Final row */}
                                  <tr>
                                    <td className="py-2 border-b text-center">
                                      &nbsp;
                                    </td>
                                    {result?.tech_ev?.map((_, colIndex) => {
                                      const totalColumns =
                                        result?.tech_ev?.length;
                                      const finalRowIndex =
                                        result?.tech_fd?.length * totalColumns +
                                        colIndex;
                                      return (
                                        <td
                                          key={colIndex}
                                          className="py-2 border-b text-center"
                                        >
                                          {result?.tech_sd?.[finalRowIndex] ??
                                            ""}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                </tbody>
                              </table>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["need"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["rem"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["you_n"]}
                              </p>
                              <p className="mt-2">LCM = {result?.tech_sl}</p>
                              <p className="mt-2">LCM = {result?.tech_lcm}</p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["of_"]} (
                                {formData?.tech_x}) = "{result?.tech_lcm}"
                              </p>
                            </div>
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

export default LcmCalculator;
