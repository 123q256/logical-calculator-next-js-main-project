"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTrigonometryCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TrigonometryCalculator = () => {
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
    tech_find: "sin",
    tech_angle: 12,
    tech_angle_unit: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTrigonometryCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_angle: formData.tech_angle,
        tech_angle_unit: formData.tech_angle_unit,
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
      tech_find: "sin",
      tech_angle: 12,
      tech_angle_unit: "deg",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="All">All</option>
                    <option value="sin">sin(x)</option>
                    <option value="cos">cos(x)</option>
                    <option value="tan">tan(x)</option>
                    <option value="cot">cot(x)</option>
                    <option value="sec">sec(x)</option>
                    <option value="csc">csc(x)</option>
                    <option value="arcsin">arcsin(x)</option>
                    <option value="arccos">arccos(x)</option>
                    <option value="arctan">arctan(x)</option>
                    <option value="arccsc">arccsc(x)</option>
                    <option value="arcsec">arcsec(x)</option>
                    <option value="arccot">arccot(x)</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_angle" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_angle"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_angle}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_angle_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "degrees (degs)", value: "deg" },
                        { label: "radians (rad)", value: "rad" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
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
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {result?.tech_method == "1" ? (
                                <>
                                  {result?.tech_angle_unit == "deg" ? (
                                    <>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            {result?.tech_find} (
                                            {result?.tech_angle}°) =
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {Number(result?.tech_ans1).toFixed(0)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            ({result?.tech_angle}°) =
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {Number(result?.tech_ans2).toFixed(0)}{" "}
                                          (rad)
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            {result?.tech_find} (
                                            {result?.tech_angle}) =
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {Number(result?.tech_ans1).toFixed(0)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            ({result?.tech_angle} rad) =
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {Number(result?.tech_ans2).toFixed(0)}
                                          °
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </>
                              ) : result?.tech_method == "2" ? (
                                <>
                                  {result?.tech_angle_unit == "deg" ? (
                                    <>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            sin (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_sin}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            cos (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_cos}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            tan (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_tan}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            cot (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_cot}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            sec (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_sec}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            csc (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_csc}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arcsin (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_asin}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arccos (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_atan}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arctan (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_acos}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arccot (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_acot}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arcsec (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_asec}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arccsc (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_acsc}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ){"°"}
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {Number(result?.tech_fns).toFixed(0)}{" "}
                                          (rad)
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            sin (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_sin}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            cos (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_cos}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            tan (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_tan}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            cot (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_cot}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            sec (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_sec}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            csc (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_csc}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arcsin (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_asin}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arccos (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_atan}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arctan (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_acos}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arccot (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_acot}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arcsec (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_asec}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            arccsc (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            )
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_acsc}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>
                                            (
                                            {Number(result?.tech_angle).toFixed(
                                              0
                                            )}
                                            ) rad
                                          </strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {Number(result?.tech_fns).toFixed(0)}°
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </>
                              ) : result?.tech_method == "3" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {result?.tech_find} (
                                        {result?.tech_angle})
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_deg}°
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {result?.tech_find} (
                                        {result?.tech_angle})
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_rad} (rad)
                                    </td>
                                  </tr>
                                </>
                              ) : null}
                            </tbody>
                          </table>
                        </div>
                        {result?.tech_naam && (
                          <>
                            <div className="w-full mt-2">
                              <div className="w-full md:w-[60%] lg:w-[60%]">
                                <img
                                  src={`/images/${result?.tech_naam}.webp`}
                                  width="100%"
                                  height="100%"
                                  alt={
                                    result?.tech_naam ||
                                    "Trigonometric Illustration"
                                  }
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
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

export default TrigonometryCalculator;
