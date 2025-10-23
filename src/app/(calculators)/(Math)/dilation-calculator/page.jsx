"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDilationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DilationCalculator = () => {
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
    tech_nbr: "2",
    tech_dil: 2,
    tech_a1: 2,
    tech_z1: 2,
    tech_a2: 2,
    tech_z2: 2,
    tech_a3: 2,
    tech_z3: 2,
    tech_a4: 2,
    tech_z4: 2,
    tech_a5: 2,
    tech_z5: 2,
    tech_a6: 2,
    tech_z6: 2,
    tech_a7: 2,
    tech_z7: 2,
    tech_a8: 2,
    tech_z8: 2,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDilationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_nbr) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_nbr: formData.tech_nbr,
        tech_dil: formData.tech_dil,
        tech_a1: formData.tech_a1,
        tech_z1: formData.tech_z1,
        tech_a2: formData.tech_a2,
        tech_z2: formData.tech_z2,
        tech_a3: formData.tech_a3,
        tech_z3: formData.tech_z3,
        tech_a4: formData.tech_a4,
        tech_z4: formData.tech_z4,
        tech_a5: formData.tech_a5,
        tech_z5: formData.tech_z5,
        tech_a6: formData.tech_a6,
        tech_z6: formData.tech_z6,
        tech_a7: formData.tech_a7,
        tech_z7: formData.tech_z7,
        tech_a8: formData.tech_a8,
        tech_z8: formData.tech_z8,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_nbr: "2",
      tech_dil: 2,
      tech_a1: 2,
      tech_z1: 2,
      tech_a2: 2,
      tech_z2: 2,
      tech_a3: 2,
      tech_z3: 2,
      tech_a4: 2,
      tech_z4: 2,
      tech_a5: 2,
      tech_z5: 2,
      tech_a6: 2,
      tech_z6: 2,
      tech_a7: 2,
      tech_z7: 2,
      tech_a8: 2,
      tech_z8: 2,
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
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
                <label htmlFor="tech_nbr" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_nbr"
                    id="tech_nbr"
                    value={formData.tech_nbr}
                    onChange={handleChange}
                  >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>

              {/* Your JSX here */}
              <div className="col-span-6">
                <label htmlFor="tech_a1" className="label">
                  {data?.payload?.tech_lang_keys["2"]} A:
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
                <label htmlFor="tech_z1" className="label">
                  &nbsp;
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

              {/* Your JSX here */}
              <div className="col-span-6">
                <label htmlFor="tech_a2" className="label">
                  {data?.payload?.tech_lang_keys["2"]} B:
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
              <div className="col-span-6">
                <label htmlFor="tech_z2" className="label">
                  &nbsp;
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

              {["3", "4", "5", "6", "7", "8"].includes(formData.tech_nbr) && (
                <>
                  {/* Your JSX here */}
                  <div className="col-span-6 three">
                    <label htmlFor="tech_a3" className="label">
                      {data?.payload?.tech_lang_keys["2"]} C:
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
                  <div className="col-span-6 three">
                    <label htmlFor="tech_z3" className="label">
                      &nbsp;
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z3"
                        id="tech_z3"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z3}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {["4", "5", "6", "7", "8"].includes(formData.tech_nbr) && (
                <>
                  {/* Your JSX here */}
                  <div className="col-span-6  four">
                    <label htmlFor="tech_a4" className="label">
                      {data?.payload?.tech_lang_keys["2"]} D:
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
                  <div className="col-span-6  four">
                    <label htmlFor="tech_z4" className="label">
                      &nbsp;
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z4"
                        id="tech_z4"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z4}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {["5", "6", "7", "8"].includes(formData.tech_nbr) && (
                <>
                  {/* Your JSX here */}
                  <div className="col-span-6  five">
                    <label htmlFor="tech_a5" className="label">
                      {data?.payload?.tech_lang_keys["2"]} E:
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
                  <div className="col-span-6  five">
                    <label htmlFor="tech_z5" className="label">
                      &nbsp;
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z5"
                        id="tech_z5"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z5}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {["6", "7", "8"].includes(formData.tech_nbr) && (
                <>
                  {/* Your JSX here */}
                  <div className="col-span-6  six">
                    <label htmlFor="tech_a6" className="label">
                      {data?.payload?.tech_lang_keys["2"]} F:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_a6"
                        id="tech_a6"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_a6}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6  six">
                    <label htmlFor="tech_z6" className="label">
                      &nbsp;
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z6"
                        id="tech_z6"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z6}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {["7", "8"].includes(formData.tech_nbr) && (
                <>
                  {/* Your JSX here */}
                  <div className="col-span-6 seven">
                    <label htmlFor="tech_a7" className="label">
                      {data?.payload?.tech_lang_keys["2"]} G:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_a7"
                        id="tech_a7"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_a7}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 seven">
                    <label htmlFor="tech_z7" className="label">
                      &nbsp;
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z7"
                        id="tech_z7"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z7}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {["8"].includes(formData.tech_nbr) && (
                <>
                  {/* Your JSX here */}
                  <div className="col-span-6  eight">
                    <label htmlFor="tech_a8" className="label">
                      {data?.payload?.tech_lang_keys["2"]} H:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_a8"
                        id="tech_a8"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_a8}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6  eight">
                    <label htmlFor="tech_z8" className="label">
                      &nbsp;
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z8"
                        id="tech_z8"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_z8}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12">
                <label htmlFor="tech_dil" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_dil"
                    id="tech_dil"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_dil}
                    onChange={handleChange}
                  />
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {Array.from({
                                length: formData?.tech_nbr || 0,
                              }).map((_, i) => (
                                <tr key={i}>
                                  <td className="py-2 border-b" width="60%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[4]} O
                                      {result?.tech_abc[i]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    ({result?.tech_aval[i] * formData?.tech_dil}
                                    ,{" "}
                                    {result?.tech_zval[i] * formData?.tech_dil})
                                  </td>
                                </tr>
                              ))}
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

export default DilationCalculator;
