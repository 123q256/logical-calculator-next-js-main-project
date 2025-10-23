"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHeightPercentileCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HeightPercentileCalculator = () => {
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
    tech_gender: Number(1),
    tech_age: Number(15),
    tech_age_unit: "days",
    tech_height_ft: Number(4),
    tech_unit_ft_in: "ft/in",
    tech_height_in: Number(10),
    tech_unit_h: "cm",
    tech_height_cm: Number(10),
    tech_unit_h_cm: "ft/in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHeightPercentileCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_gender ||
      !formData.tech_age ||
      !formData.tech_age_unit
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_age: formData.tech_age,
        tech_age_unit: formData.tech_age_unit,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
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
      tech_gender: "1",
      tech_age: "15",
      tech_age_unit: "days",
      tech_height_ft: 4,
      tech_unit_ft_in: "ft/in",
      tech_height_in: 10,
      tech_unit_h: "cm",
      tech_height_cm: 10,
      tech_unit_h_cm: "ft/in",
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
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_height_in: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible2(false);
  };
  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-3 lg:gap-3">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["gen"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_gender"
                    id="tech_gender"
                    value={formData.tech_gender}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["male"]}
                    </option>
                    <option value="0">
                      {data?.payload?.tech_lang_keys["female"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["age"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_age"
                    step="any"
                    className="my-2 input"
                    value={formData.tech_age}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_age_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "days", value: "days" },
                        { label: "weeks", value: "weeks" },
                        { label: "months", value: "months" },
                        { label: "years", value: "years" },
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

              <input
                type="hidden"
                step="any"
                name="tech_unit_ft_in"
                id="tech_unit_ft_in"
                className="input my-2"
                aria-label="input"
                value={formData.tech_unit_ft_in}
                onChange={handleChange}
              />
              {formData.tech_unit_ft_in == "ft/in" && (
                <>
                  <div className="col-span-6 md:col-span-4 lg:col-span-4 px-2 ">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["height"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_height_ft"
                        id="tech_height_ft"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_height_ft}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_height_in" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_in"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_in}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-5"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler1(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_unit_ft_in == "m" ||
                formData.tech_unit_ft_in == "cm" ||
                formData.tech_unit_ft_in == "in" ||
                formData.tech_unit_ft_in == "ft") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_height_cm" className="label">
                      {data?.payload?.tech_lang_keys["height"]}{" "}
                      {formData.tech_unit_ft_in == "m" ? (
                        <span className="text-blue height_unit">(m)</span>
                      ) : formData.tech_unit_ft_in == "cm" ? (
                        <span className="text-blue height_unit">(cm)</span>
                      ) : formData.tech_unit_ft_in == "in" ? (
                        <span className="text-blue height_unit">(in)</span>
                      ) : formData.tech_unit_ft_in == "ft" ? (
                        <span className="text-blue height_unit">(ft)</span>
                      ) : null}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_cm"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_cm}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "feet / inches (ft/in", value: "ft/in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "inch (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler2(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
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
                      <div className="w-full">
                        <div className="bg-sky bordered rounded-[10px] p-3">
                          {data?.payload?.tech_lang_keys[2]} ={" "}
                          <span className="text-[#119154] text-[25px]">
                            {result?.tech_first_ans}
                          </span>{" "}
                          {data?.payload?.tech_lang_keys[3]}
                        </div>

                        <p
                          className="text-[16px] mt-2"
                          id="line"
                          dangerouslySetInnerHTML={{
                            __html: result?.tech_line,
                          }}
                        ></p>

                        <div className="mt-3">
                          <img
                            src={`/images/${result?.tech_image}.png`}
                            alt="Growth Chart"
                            style={{ width: "100%", height: "100px" }}
                          />
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

export default HeightPercentileCalculator;
