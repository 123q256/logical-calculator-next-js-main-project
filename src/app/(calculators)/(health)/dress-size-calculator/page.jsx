"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDressSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DressSizeCalculator = () => {
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
    tech_waist: 50,
    tech_bust: 46,
    tech_hips: 38,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDressSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_waist || !formData.tech_bust) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_waist: formData.tech_waist,
        tech_bust: formData.tech_bust,
        tech_hips: formData.tech_hips,
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
      tech_waist: 50,
      tech_bust: 46,
      tech_hips: 38,
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_waist" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_waist"
                    id="tech_waist"
                    value={formData.tech_waist}
                    onChange={handleChange}
                  >
                    <option value="30">{"58 cm (< 23 in)"}</option>
                    <option value="32">58-61 cm (23-24 in)</option>
                    <option value="34">62-64 cm (24-25 in)</option>
                    <option value="36">65-68 cm (25-26.5 in)</option>
                    <option value="38">69-72 cm (26.5-28 in)</option>
                    <option value="40">73-77 cm (28-30 in)</option>
                    <option value="42">78-81 cm (30-32 in)</option>
                    <option value="44">82-85 cm (32-33.5 in)</option>
                    <option value="46">86-90 cm (33.5-35.5 in)</option>
                    <option value="48">91-95 cm (35.5-37.5 in)</option>
                    <option value="50">96-102 cm (37.5-40 in)</option>
                    <option value="52">103-108 cm (40-42.5 in)</option>
                    <option value="54">109-114 cm (42.5-45 in)</option>
                    <option value="56">{">114 cm (>45 in)"}</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_bust" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_bust"
                    id="tech_bust"
                    value={formData.tech_bust}
                    onChange={handleChange}
                  >
                    <option value="30">74 cm (29 in)</option>
                    <option value="32">74-77 cm (29-30 in)</option>
                    <option value="34">78-81 cm (31-32 in)</option>
                    <option value="36">82-85 cm (32-33.5 in)</option>
                    <option value="38">86-89 cm (33.5-35 in)</option>
                    <option value="40">90-93 cm (35-36.5 in)</option>
                    <option value="42">94-97 cm (36.5-38 in)</option>
                    <option value="44">98-102 cm (38-40 in)</option>
                    <option value="46">103-107 cm (40-42 in)</option>
                    <option value="48">108-113 cm (42-44.5 in)</option>
                    <option value="50">114-119 cm (44.5-47 in)</option>
                    <option value="52">120-125 cm (47-49 in)</option>
                    <option value="54">126-131 cm (49-51.5 in)</option>
                    <option value="56">{">131 cm (>51.5 in)"}</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_tech_hips" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_tech_hips"
                    id="tech_tech_hips"
                    value={formData.tech_tech_hips}
                    onChange={handleChange}
                  >
                    <option value="30">{"< 80 cm (< 31.5 in)"}</option>
                    <option value="32">80-84 cm (31.5-33 in)</option>
                    <option value="34">85-89 cm (33-35 in)</option>
                    <option value="36">90-94 cm (35-37 in)</option>
                    <option value="38">95-97 cm (37-38 in)</option>
                    <option value="40">98-101 cm (38-40 in)</option>
                    <option value="42">102-104 cm (40-41 in)</option>
                    <option value="44">105-108 cm (41-42.5 in)</option>
                    <option value="46">109-112 cm (42.5-44 in)</option>
                    <option value="48">113-116 cm (44-45.5 in)</option>
                    <option value="50">117-122 cm (45.5-48 in)</option>
                    <option value="52">123-128 cm (48-50 in)</option>
                    <option value="54">129-134 cm (50-53 in)</option>
                    <option value="56">{">134 cm (>53 in)"}</option>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_firstText && (
                          <>
                            {/* Optional message - if needed dynamically you can adjust */}
                            <p className="mt-2 text-[18px]">
                              {`${data?.payload?.tech_lang_keys["5"]} 🙂.`}
                            </p>
                          </>
                        )}

                        {result?.tech_secondText && (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["8"]}
                            </p>
                            <div className="w-full md:w-[100%] lg:w-[80%] mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <thead>
                                  <tr>
                                    <td className="py-2 border-b">&nbsp;</td>
                                    <td className="py-2 border-b font-bold">
                                      {data?.payload?.tech_lang_keys["2"]}
                                    </td>
                                    <td className="py-2 border-b font-bold">
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </td>
                                    <td className="py-2 border-b font-bold">
                                      {data?.payload?.tech_lang_keys["3"]}
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b">USA</td>
                                    <td className="py-2 border-b">
                                      {result?.tech_usBust}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_usHips}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_usWaist}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">UK</td>
                                    <td className="py-2 border-b">
                                      {result?.tech_ukBust}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_ukHips}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_ukWaist}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">EU</td>
                                    <td className="py-2 border-b">
                                      {result?.tech_euBust}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_euHips}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_euWaist}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_internationalBust}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_internationalHips}
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_internationalWaist}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_usaSize && (
                          <>
                            <p className="my-2 font-bold">
                              {data?.payload?.tech_lang_keys["6"]}
                            </p>
                            <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                              {[
                                {
                                  label: "USA",
                                  value: result?.tech_usaSize,
                                  flag: "/images/USA.png",
                                },
                                {
                                  label: "UK",
                                  value: result?.tech_ukSize,
                                  flag: "/images/UK.png",
                                },
                                {
                                  label: "Europe (DE/AT/NL/SE/DK)",
                                  value: result?.tech_euroSize,
                                  flag: "/images/Europe.png",
                                },
                                {
                                  label: data?.payload?.tech_lang_keys["9"],
                                  value: result?.tech_internationalSize,
                                  flag: "/images/International.png",
                                },
                              ].map((item, index) => (
                                <div
                                  key={index}
                                  className="col-span-12 md:col-span-6 lg:col-span-6"
                                >
                                  <div className="flex flex-wrap items-center justify-between bg-sky border rounded-lg px-3 py-2">
                                    <div className="flex flex-wrap items-center me-2">
                                      <img
                                        src={item.flag}
                                        width="30px"
                                        alt={item.label}
                                      />
                                      <span className="pt-1 ms-2">
                                        {item.label}
                                      </span>
                                    </div>
                                    <div>
                                      <strong className="text-green-500 text-[28px]">
                                        {item.value}
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <p className="mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["10"]}:
                          </strong>{" "}
                          {data?.payload?.tech_lang_keys["11"]}
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

export default DressSizeCalculator;
