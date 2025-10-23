"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBikeSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BikeSizeCalculator = () => {
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
    tech_bike_for: "adult", // adult   kids
    tech_bike_type: "city",
    tech_kids_age: "11+",
    tech_hight: 5.7,
    tech_hight_unit: "cm",
    tech_inseam_length: 32,
    tech_inseam_length_unit: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBikeSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_bike_for == "adult") {
      if (
        !formData.tech_bike_for ||
        !formData.tech_bike_type ||
        !formData.tech_hight ||
        !formData.tech_hight_unit ||
        !formData.tech_inseam_length ||
        !formData.tech_inseam_length_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (!formData.tech_bike_for || !formData.tech_kids_age) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_bike_for: formData.tech_bike_for,
        tech_bike_type: formData.tech_bike_type,
        tech_kids_age: formData.tech_kids_age,
        tech_hight: formData.tech_hight,
        tech_hight_unit: formData.tech_hight_unit,
        tech_inseam_length: formData.tech_inseam_length,
        tech_inseam_length_unit: formData.tech_inseam_length_unit,
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
      tech_bike_for: "adult", // adult   kids
      tech_bike_type: "city",
      tech_kids_age: "11+",
      tech_hight: 5.7,
      tech_hight_unit: "cm",
      tech_inseam_length: 32,
      tech_inseam_length_unit: "cm",
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
    setFormData((prev) => ({ ...prev, tech_hight_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_inseam_length_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 mt-3  gap-4">
              <div className="col-lg-6 pe-lg-4">
                <div className="row">
                  <div className="col-12 mt-2">
                    <label htmlFor="tech_bike_for" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_bike_for"
                        id="tech_bike_for"
                        value={formData.tech_bike_for}
                        onChange={handleChange}
                      >
                        <option value="adult">
                          {data?.payload?.tech_lang_keys["33"]}
                        </option>
                        <option value="kids">
                          {data?.payload?.tech_lang_keys["34"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  {formData.tech_bike_for == "adult" && (
                    <>
                      <div className="col-12 mt-2 adults">
                        <label htmlFor="tech_bike_type" className="label">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_bike_type"
                            id="tech_bike_type"
                            value={formData.tech_bike_type}
                            onChange={handleChange}
                          >
                            <option value="road">
                              {data?.payload?.tech_lang_keys[3]}
                            </option>
                            <option value="city">
                              {data?.payload?.tech_lang_keys[4]}
                            </option>
                            <option value="hybrid">
                              {data?.payload?.tech_lang_keys[5]}
                            </option>
                            <option value="trekking">
                              {data?.payload?.tech_lang_keys[6]}
                            </option>
                            <option value="mountain">
                              {data?.payload?.tech_lang_keys[7]}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 mt-2 adults">
                        <label htmlFor="tech_hight" className="label">
                          {data?.payload?.tech_lang_keys["10"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_hight"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_hight}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_hight_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "milimeters (mm)", value: "mm" },
                                { label: "inch (in)", value: "in" },
                                { label: "feets (ft)", value: "ft" },
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
                      <div className="col-12 mt-2 adults">
                        <label htmlFor="tech_inseam_length" className="label">
                          {data?.payload?.tech_lang_keys["11"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_inseam_length"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_inseam_length}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_inseam_length_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "milimeters (mm)", value: "mm" },
                                { label: "inch (in)", value: "in" },
                                { label: "feets (ft)", value: "ft" },
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
                  {formData.tech_bike_for == "kids" && (
                    <>
                      <div className="col-12 mt-2 kids">
                        <label htmlFor="tech_kids_age" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_kids_age"
                            id="tech_kids_age"
                            value={formData.tech_kids_age}
                            onChange={handleChange}
                          >
                            <option value="2-3">
                              2-3 {data?.payload?.tech_lang_keys[9]} (86-102 cm)
                            </option>
                            <option value="2-4">
                              2-4 {data?.payload?.tech_lang_keys[9]} (94-109 cm)
                            </option>
                            <option value="4-6">
                              4-6 {data?.payload?.tech_lang_keys[9]} (109-122
                              cm)
                            </option>
                            <option value="5-8">
                              5-8 {data?.payload?.tech_lang_keys[9]} (114-130
                              cm)
                            </option>
                            <option value="8-11">
                              8-11 {data?.payload?.tech_lang_keys[9]} (122-135
                              cm)
                            </option>
                            <option value="11+">
                              11+ {data?.payload?.tech_lang_keys[9]} (135-145
                              cm)
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-6 ps-lg-4 d-flex align-items-center">
                <div className="row">
                  {formData.tech_bike_for == "adult" && (
                    <>
                      {formData.tech_bike_type == "road" && (
                        <>
                          <div className="col-12">
                            <img
                              src="/images/bike-size/Road.webp"
                              alt="bike"
                              className="max-width change_imge"
                              width="230px"
                              height="140px"
                            />
                          </div>
                        </>
                      )}
                      {formData.tech_bike_type == "city" && (
                        <>
                          <div className="col-12">
                            <img
                              src="/images/bike-size/City.webp"
                              alt="bike"
                              className="max-width change_imge"
                              width="230px"
                              height="140px"
                            />
                          </div>
                        </>
                      )}
                      {formData.tech_bike_type == "hybrid" && (
                        <>
                          <div className="col-12">
                            <img
                              src="/images/bike-size/Hybrid_n_Fitness.webp"
                              alt="bike"
                              className="max-width change_imge"
                              width="230px"
                              height="140px"
                            />
                          </div>
                        </>
                      )}
                      {formData.tech_bike_type == "trekking" && (
                        <>
                          <div className="col-12">
                            <img
                              src="/images/bike-size/Trekking.webp"
                              alt="bike"
                              className="max-width change_imge"
                              width="230px"
                              height="140px"
                            />
                          </div>
                        </>
                      )}
                      {formData.tech_bike_type == "mountain" && (
                        <>
                          <div className="col-12">
                            <img
                              src="/images/bike-size/City.webp"
                              alt="bike"
                              className="max-width change_imge"
                              width="230px"
                              height="140px"
                            />
                          </div>
                        </>
                      )}

                      <div className="col-12 mt-3">
                        <img
                          src="/images/bike-size/hight-inseam-new.png"
                          alt="bike"
                          className="max-width sec_image"
                          width="230px"
                          height="130px"
                        />
                      </div>
                    </>
                  )}
                  {formData.tech_bike_for == "kids" && (
                    <>
                      <div className="col-12">
                        <img
                          src="/images/bike-size/Mountain.webp"
                          alt="bike"
                          className="max-width change_imge"
                          width="230px"
                          height="140px"
                        />
                      </div>
                    </>
                  )}
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
                    <div className="col-12 bg-light-blue result p-3 rounded-lg mt-3">
                      <div className="grid grid-12 gap-5">
                        <p className="col-span-12">
                          <strong className="text-blue-500">
                            {data?.payload?.tech_lang_keys[12]}
                          </strong>
                        </p>
                        <p className="col-span-12">
                          <strong className="text-blue-500">
                            {formData?.tech_bike_for?.charAt(0).toUpperCase() +
                              formData?.tech_bike_for?.slice(1)}
                          </strong>
                        </p>

                        {formData?.tech_bike_for === "kids" ? (
                          <>
                            <div className="col-span-6">
                              <p className="pb-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[13]}
                                </strong>
                              </p>
                              <div className="bg-sky bordered rounded-lg px-3 py-2">
                                <p>
                                  <strong className="text-[18px] text-[#119154]">
                                    {result?.tech_kids_age}
                                  </strong>{" "}
                                  <span className="text-[14px] text-blue">
                                    {data?.payload?.tech_lang_keys[14]}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="col-span-6">
                              <p className="pb-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[15]}
                                </strong>
                              </p>
                              <div className="bg-sky bordered rounded-lg px-3 py-2">
                                <p>
                                  <strong className="text-[18px] text-[#119154]">
                                    {result?.tech_hight}
                                  </strong>{" "}
                                  <span className="text-[14px] text-blue">
                                    cm
                                  </span>
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="pt-2 col-span-12">
                              <strong>
                                {data?.payload?.tech_lang_keys[16]}
                              </strong>
                            </p>

                            {[
                              {
                                label: "milimeter",
                                value: result?.tech_hight_mm,
                              },
                              {
                                label: "centimeter",
                                value: result?.tech_hight_cm,
                              },
                              { label: "inch", value: result?.tech_hight_in },
                              { label: "foot", value: result?.tech_hight_ft },
                            ].map((item, idx) => (
                              <div className="col-span-6" key={idx}>
                                <div className="bg-sky bordered rounded-lg px-3 py-2">
                                  <p>
                                    <strong className="text-[18px] text-[#119154]">
                                      {item.value}
                                    </strong>{" "}
                                    <span className="text-[14px] text-blue">
                                      {item.label}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ))}

                            <p className="pt-2 col-span-12">
                              <strong>
                                {data?.payload?.tech_lang_keys[17]}
                              </strong>
                            </p>

                            {[
                              {
                                label: "milimeter",
                                value: result?.tech_inseam_mm,
                              },
                              {
                                label: "centimeter",
                                value: result?.tech_inseam_cm,
                              },
                              { label: "inch", value: result?.tech_inseam_in },
                              { label: "foot", value: result?.tech_inseam_ft },
                            ].map((item, idx) => (
                              <div className="col-span-6" key={`inseam-${idx}`}>
                                <div className="bg-sky bordered rounded-lg px-3 py-2">
                                  <p>
                                    <strong className="text-[18px] text-[#119154]">
                                      {item.value}
                                    </strong>{" "}
                                    <span className="text-[14px] text-blue">
                                      {item.label}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </>
                        )}

                        <div className="col-span-12 border-top-black my-2 pt-2">
                          <div className="grid grid-cols-12 mt-3 gap-4">
                            <div className="col-span-12 md:col-span-8 lg:col-span-8">
                              <p className="my-2">
                                <strong className="text-blue">
                                  {formData?.tech_bike_for === "kids"
                                    ? data?.payload?.tech_lang_keys[18]
                                    : `${
                                        formData?.tech_bike_type
                                          ?.charAt(0)
                                          .toUpperCase() +
                                        formData?.tech_bike_type?.slice(1)
                                      } ${data?.payload?.tech_lang_keys[19]}`}
                                </strong>
                              </p>
                              <p className="mb-2">
                                {formData?.tech_bike_for === "kids"
                                  ? "Kids"
                                  : formData?.tech_bike_type
                                      ?.charAt(0)
                                      .toUpperCase() +
                                    formData?.tech_bike_type?.slice(1)}{" "}
                                {data?.payload?.tech_lang_keys[20]}
                              </p>
                              {formData?.tech_bike_for === "kids" ? (
                                <>
                                  <strong>
                                    {data?.payload?.tech_lang_keys[21]}
                                  </strong>
                                  <p className="my-2">
                                    {data?.payload?.tech_lang_keys[22]}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <strong>
                                    {data?.payload?.tech_lang_keys[24]}
                                  </strong>
                                  <p className="my-2">
                                    {data?.payload?.tech_lang_keys[25]}
                                  </p>
                                </>
                              )}
                            </div>

                            <div className="col-span-12 md:col-span-4 lg:col-span-4">
                              {formData?.tech_bike_for === "kids" ? (
                                <img
                                  src="/images/bike-size/Child.webp"
                                  className="max-width mt-lg-4"
                                  width="200px"
                                  height="150px"
                                  alt="Wheel Size"
                                />
                              ) : (
                                <img
                                  src="/images/bike-size/frame-new.webp"
                                  className="max-width mt-lg-4"
                                  width="250px"
                                  height="150px"
                                  alt="Frame Size"
                                />
                              )}
                            </div>
                          </div>

                          {formData?.tech_bike_for === "kids" ? (
                            <>
                              <strong className="col-span-12 mb-1">
                                {data?.payload?.tech_lang_keys[23]}
                              </strong>
                              <div className="col-span-12">
                                <div className="grid grid-cols-12 mt-3 gap-4">
                                  {[
                                    {
                                      label: "milimeter",
                                      value: result?.tech_wheel_mm,
                                    },
                                    {
                                      label: "centimeter",
                                      value: result?.tech_wheel_cm,
                                    },
                                    {
                                      label: "inch",
                                      value: result?.tech_wheel_in,
                                    },
                                    {
                                      label: "foot",
                                      value: result?.tech_wheel_ft,
                                    },
                                  ].map((item, idx) => (
                                    <div
                                      className="col-span-6 md:col-span-4 lg:col-span-3"
                                      key={idx}
                                    >
                                      <div className="bg-sky bordered rounded-lg px-3 py-2">
                                        <p>
                                          <strong className="text-[18px] text-[#119154]">
                                            {item.value}
                                          </strong>{" "}
                                          <span className="text-[14px] text-blue">
                                            {item.label}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <strong className="col-span-12 mb-2">
                                {data?.payload?.tech_lang_keys[26]}
                              </strong>
                              <div className="col-span-12">
                                <div className="grid grid-cols-12 mt-3 gap-4">
                                  {[
                                    {
                                      label: "milimeter",
                                      value: result?.tech_frame_mm,
                                    },
                                    {
                                      label: "centimeter",
                                      value: result?.tech_frame_cm,
                                    },
                                    {
                                      label: "inch",
                                      value: result?.tech_frame_in,
                                    },
                                    {
                                      label: "foot",
                                      value: result?.tech_frame_ft,
                                    },
                                  ].map((item, idx) => (
                                    <div
                                      className="col-span-6 md:col-span-4 lg:col-span-3"
                                      key={idx}
                                    >
                                      <div className="bg-sky bordered rounded-lg px-3 py-2">
                                        <p>
                                          <strong className="text-[18px] text-[#119154]">
                                            {item.value}
                                          </strong>{" "}
                                          <span className="text-[14px] text-blue">
                                            {item.label}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="col-span-12 border-top-black pt-2 mt-1">
                          <div className="grid grid-cols-12 mt-3 gap-4">
                            <div className="col-span-12 md:col-span-8 lg:col-span-8">
                              <p className="my-2">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys[27]}
                                </strong>
                              </p>
                              <p className="mb-2">
                                {data?.payload?.tech_lang_keys[28]}
                              </p>
                              <strong className="text-blue">
                                {data?.payload?.tech_lang_keys[29]}
                              </strong>
                              {formData?.tech_bike_for === "kids" && (
                                <p className="my-2">
                                  {data?.payload?.tech_lang_keys[30]}
                                </p>
                              )}
                            </div>
                            <div className="col-span-12 md:col-span-4 lg:col-span-4">
                              <img
                                src="/images/bike-size/crank-updated.webp"
                                className="max-width"
                                width="200px"
                                height="170px"
                                alt="Frame Size"
                              />
                            </div>
                          </div>

                          {formData?.tech_bike_for === "adult" && (
                            <div className="row">
                              <div className="grid grid-cols-12 mt-3 gap-4">
                                <p className="col-span-12 my-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[31]} (L)
                                  </strong>
                                </p>
                                {[
                                  {
                                    value: result?.tech_crank_mm,
                                    label: "milimeter",
                                  },
                                  {
                                    value: result?.tech_crank_cm,
                                    label: "centimeter",
                                  },
                                  {
                                    value: result?.tech_crank_in,
                                    label: "inch",
                                  },
                                  {
                                    value: result?.tech_crank_ft,
                                    label: "foot",
                                  },
                                ].map((item, index) => (
                                  <div
                                    className="col-span-6 md:col-span-3 lg:col-span-3"
                                    key={index}
                                  >
                                    <div className="bg-sky bordered rounded-lg px-3 py-2">
                                      <p>
                                        <strong className="text-[18px] text-[#119154]">
                                          {item.value}
                                        </strong>{" "}
                                        <span className="text-[14px] text-blue">
                                          {item.label}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                ))}

                                <strong className="col-span-12 mb-2">
                                  {data?.payload?.tech_lang_keys[32]} (D)
                                </strong>

                                {[
                                  {
                                    value: result?.tech_crank_dia_mm,
                                    label: "milimeter",
                                  },
                                  {
                                    value: result?.tech_crank_dia_cm,
                                    label: "centimeter",
                                  },
                                  {
                                    value: result?.tech_crank_dia_in,
                                    label: "inch",
                                  },
                                  {
                                    value: result?.tech_crank_dia_ft,
                                    label: "foot",
                                  },
                                ].map((item, index) => (
                                  <div
                                    className="col-span-6 md:col-span-3 lg:col-span-3"
                                    key={index}
                                  >
                                    <div className="bg-sky bordered rounded-lg px-3 py-2">
                                      <p>
                                        <strong className="text-[18px] text-[#119154]">
                                          {item.value}
                                        </strong>{" "}
                                        <span className="text-[14px] text-blue">
                                          {item.label}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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

export default BikeSizeCalculator;
