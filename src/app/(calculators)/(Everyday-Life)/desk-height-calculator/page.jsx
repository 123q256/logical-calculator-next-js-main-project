"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDeskHeightCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DeskHeightCalculator = () => {
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
    tech_units: "Feet and Inches", //  Feet and Inches   Centimeters
    tech_height: "150",
    tech_height2: "149.86",
    tech_position: "0", // 0 1
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDeskHeightCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_units || !formData.tech_height) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_units: formData.tech_units,
        tech_height: formData.tech_height,
        tech_height2: formData.tech_height2,
        tech_position: formData.tech_position,
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
      tech_units: "Feet and Inches", //  Feet and Inches   Centimeters
      tech_height: "150",
      tech_height2: "149.86",
      tech_position: "0", // 0 1
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
          <div className="lg:w-[40%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className=" col-span-12">
                <label htmlFor="tech_units" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_units"
                    id="tech_units"
                    value={formData.tech_units}
                    onChange={handleChange}
                  >
                    <option value="Centimeters">Centimeters</option>
                    <option value="Feet and Inches">Feet and Inches</option>
                  </select>
                </div>
              </div>
              {formData.tech_units == "Centimeters" && (
                <>
                  <div className="col-span-12 saman2">
                    <label htmlFor="tech_height" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (
                      {data?.payload?.tech_lang_keys["3"]}):
                    </label>

                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_height"
                        id="tech_height"
                        value={formData.tech_height}
                        onChange={handleChange}
                      >
                        {Array.from({ length: 56 }, (_, i) => {
                          const val = 150 + i;
                          return (
                            <option key={val} value={val}>
                              {val} cm
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_units == "Feet and Inches" && (
                <>
                  <div className="col-span-12 saman1 ">
                    <label htmlFor="tech_height2" className="label">
                      {data?.payload?.tech_lang_keys["2"]} (
                      {data?.payload?.tech_lang_keys["3"]}):
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_height2"
                        id="tech_height2"
                        value={formData.tech_height2}
                        onChange={handleChange}
                      >
                        {[
                          { val: "149.86", name: "4' 11" },
                          { val: "151.13", name: "4' 11½" },
                          { val: "152.4", name: "5'" },
                          { val: "153.67", name: "5' ½" },
                          { val: "154.94", name: "5' 1" },
                          { val: "156.21", name: "5' 1½" },
                          { val: "157.48", name: "5' 2" },
                          { val: "158.75", name: "5' 2½" },
                          { val: "160.02", name: "5' 3" },
                          { val: "161.29", name: "5' 3½" },
                          { val: "162.56", name: "5' 4" },
                          { val: "163.83", name: "5' 4½" },
                          { val: "165.1", name: "5' 5" },
                          { val: "166.37", name: "5' 5½" },
                          { val: "167.64", name: "5' 6" },
                          { val: "168.91", name: "5' 6½" },
                          { val: "170.18", name: "5' 7" },
                          { val: "171.45", name: "5' 7½" },
                          { val: "172.72", name: "5' 8" },
                          { val: "173.99", name: "5' 8½" },
                          { val: "175.26", name: "5' 9" },
                          { val: "176.53", name: "5' 9½" },
                          { val: "177.8", name: "5' 10" },
                          { val: "179.07", name: "5' 10½" },
                          { val: "180.34", name: "5' 11" },
                          { val: "181.61", name: "5' 11½" },
                          { val: "182.88", name: "6'" },
                          { val: "184.15", name: "6' ½" },
                          { val: "185.42", name: "6' 1" },
                          { val: "186.69", name: "6' 1½" },
                          { val: "187.96", name: "6' 2" },
                          { val: "189.23", name: "6' 2½" },
                          { val: "190.5", name: "6' 3" },
                          { val: "191.77", name: "6' 3½" },
                          { val: "193.04", name: "6' 4" },
                          { val: "194.31", name: "6' 4½" },
                          { val: "195.58", name: "6' 4" },
                          { val: "196.85", name: "6' 5½" },
                          { val: "198.12", name: "6' 6" },
                          { val: "199.39", name: "6' 6½" },
                          { val: "200.66", name: "6' 7" },
                          { val: "201.93", name: "6' 7½" },
                          { val: "203.2", name: "6' 8" },
                          { val: "204.47", name: "6' 8½" },
                          { val: "205.74", name: "6' 9" },
                        ].map((item) => (
                          <option key={item.val} value={item.val}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="col-span-12">
              <label htmlFor="tech_position" className="label">
                {data?.payload?.tech_lang_keys["4"]} (
                {data?.payload?.tech_lang_keys["5"]}):
              </label>
              <div className="mt-2">
                <select
                  className="input"
                  aria-label="select"
                  name="tech_position"
                  id="tech_position"
                  value={formData.tech_position}
                  onChange={handleChange}
                >
                  <option value="0">
                    {data?.payload?.tech_lang_keys["6"]}
                  </option>
                  <option value="1">
                    {data?.payload?.tech_lang_keys["7"]}
                  </option>
                </select>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
                    <div className="w-full mt-3">
                      <div className="grid grid-cols-12 mt-3 gap-4">
                        <div className="col-span-12 md:col-span-8 lg:col-span-8 text-[16px] overflow-auto">
                          {/* Unit Label */}
                          {result?.tech_units === "Centimeters" ? (
                            <span className="font_size16 black-text">cm</span>
                          ) : (
                            <span className="font_size16 black-text">in</span>
                          )}

                          {/* Description Text */}
                          <p className="mt-lg-0 mt-2">
                            {data?.payload?.tech_lang_keys["8"]}
                          </p>

                          {/* First Table Conditional */}
                          {result?.tech_position === "0" && (
                            <>
                              <table className="w-100">
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        * {data?.payload?.tech_lang_keys["9"]} :{" "}
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      <span>{result?.tech_ans1}</span> (
                                      {result?.tech_units === "Centimeters" ? (
                                        <span className="font_size16 black-text">
                                          cm
                                        </span>
                                      ) : (
                                        <span className="font_size16 black-text">
                                          in
                                        </span>
                                      )}
                                      )
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]} 90-110°
                              </p>
                            </>
                          )}

                          {/* Second Table */}
                          <table className="w-100">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    * {data?.payload?.tech_lang_keys["11"]} :{" "}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <span>{result?.tech_ans2}</span> (
                                  {result?.tech_units === "Centimeters" ? (
                                    <span className="font_size16 black-text">
                                      cm
                                    </span>
                                  ) : (
                                    <span className="font_size16 black-text">
                                      in
                                    </span>
                                  )}
                                  )
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Paragraph Logic */}
                          <p className="mt-2">
                            {result?.tech_position === "0" ? (
                              <>
                                {data?.payload?.tech_lang_keys["12"]} 90-110°.{" "}
                                {data?.payload?.tech_lang_keys["13"]}
                              </>
                            ) : result?.tech_position === "1" ? (
                              <>{data?.payload?.tech_lang_keys["14"]} 90-110°</>
                            ) : null}
                          </p>

                          {/* Third Table */}
                          <table className="w-100">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    * {data?.payload?.tech_lang_keys["15"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <span>{result?.tech_ans3}</span> (
                                  {result?.tech_units === "Centimeters" ? (
                                    <span className="font_size16 black-text">
                                      cm
                                    </span>
                                  ) : (
                                    <span className="font_size16 black-text">
                                      in
                                    </span>
                                  )}
                                  )
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Last paragraph */}
                          {result?.tech_position === "0" ||
                          result?.tech_position === "1" ? (
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["16"]}
                            </p>
                          ) : null}
                        </div>

                        {/* Image Section */}
                        <div className="col-span-12 md:col-span-4 lg:col-span-4 ps-lg-2 flex items-center">
                          {result?.tech_position === "0" ? (
                            <img
                              src="/images/desk1.svg"
                              className="img_set responsive sett"
                              width="230px"
                              height="300px"
                              alt="desk1"
                            />
                          ) : (
                            <img
                              src="/images/desk2.svg"
                              className="img_set responsive sett"
                              width="200px"
                              height="200px"
                              alt="desk2"
                            />
                          )}
                        </div>

                        {/* Final note */}
                        <p className="mt-2 col-span-12 text-[18px]">
                          <span>
                            <strong>
                              {data?.payload?.tech_lang_keys["17"]} :{" "}
                            </strong>
                          </span>
                          {data?.payload?.tech_lang_keys["18"]}
                        </p>
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

export default DeskHeightCalculator;
