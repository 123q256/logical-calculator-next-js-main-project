"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBodyShapeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BodyShapeCalculator = () => {
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
    tech_gender: "men",
    tech_chest: 38.6,
    tech_bust_units: "cm", //  in  cm
    tech_waist: 27.6,
    tech_waist_units: "in", //  in  cm
    tech_high: 37.4,
    tech_high_units: "in", //  in  cm
    tech_hip: 39.4,
    tech_hip_units: "cm", //  in  cm
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBodyShapeCalculatorMutation();

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
      !formData.tech_chest ||
      !formData.tech_bust_units ||
      !formData.tech_waist ||
      !formData.tech_waist_units ||
      !formData.tech_high ||
      !formData.tech_high_units ||
      !formData.tech_hip ||
      !formData.tech_hip_units
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_chest: formData.tech_chest,
        tech_bust_units: formData.tech_bust_units,
        tech_waist: formData.tech_waist,
        tech_waist_units: formData.tech_waist_units,
        tech_high: formData.tech_high,
        tech_high_units: formData.tech_high_units,
        tech_hip: formData.tech_hip,
        tech_hip_units: formData.tech_hip_units,
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
      tech_gender: "men",
      tech_chest: 38.6,
      tech_bust_units: "cm", //  in  cm
      tech_waist: 27.6,
      tech_waist_units: "in", //  in  cm
      tech_high: 37.4,
      tech_high_units: "in", //  in  cm
      tech_hip: 39.4,
      tech_hip_units: "cm", //  in  cm
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
    setFormData((prev) => ({ ...prev, tech_bust_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_waist_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_high_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hip_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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

          <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
            <div className="w-full">
              <label htmlFor="gender" className="pe-3 text-[14px] text-blue">
                {data?.payload?.tech_lang_keys["gen"]}:
              </label>
              <div className="py-2">
                <label className="pe-2" htmlFor="men">
                  <input
                    type="radio"
                    name="tech_gender"
                    value="men"
                    id="men"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_gender === "men"}
                  />
                  <span>{data?.payload?.tech_lang_keys["male"]}</span>
                </label>

                <label htmlFor="women">
                  <input
                    type="radio"
                    name="tech_gender"
                    className="mr-2 border"
                    value="women"
                    id="women"
                    onChange={handleChange}
                    checked={formData.tech_gender === "women"}
                  />
                  <span>{data?.payload?.tech_lang_keys["female"]}</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-8">
                <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-6">
                    <label htmlFor="tech_chest" className="label">
                      {data?.payload?.tech_lang_keys["bust"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_chest"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_chest}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_bust_units} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "inches (in", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
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

                  {/* <div className="col-span-6">
                                <label htmlFor="chest" className="text-[14px] text-blue chest">{ data?.payload?.tech_lang_keys['bust'] }:</label>
                                <div className="relative w-full mt-[7px]">
                                    <input type="number" name="chest" id="chest" step="any" min="14" max="98"  className="border border-gray-300 p-2 rounded-lg focus:ring-2  w-full" value="{ isset($_POST['chest']) ? $_POST['chest'] : '' }" aria-label="input" placeholder="00" oninput="checkInput()"/>
                                    <label htmlFor="bust_units" className="absolute cursor-pointer text-sm underline right-6 top-4" onclick="toggleDropdown('bust_units_dropdown')">{ isset($_POST['bust_units'])?$_POST['bust_units']:'in' } ▾</label>
                                    <input type="text" name="bust_units" value="{ isset($_POST['bust_units'])?$_POST['bust_units']:'in' }" id="bust_units" className="hidden">
                                    <div id="bust_units_dropdown" className="units bust_units absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0 hidden" to="bust_units">
                                        <p value="in" onclick="changeUnits(this, 'chest', 14, 98)" onclick="setUnit('bust_units', 'in')" className="p-2 hover:bg-gray-100 cursor-pointer" >inches (in)</p>
                                        <p  value="cm" onclick="changeUnits(this, 'chest', 41, 250)" onclick="setUnit('bust_units', 'cm')" className="p-2 hover:bg-gray-100 cursor-pointer" >centimeters (cm)</p>
                                    </div>
                                </div>
                            </div>  */}

                  <div className="col-span-6">
                    <label htmlFor="tech_waist" className="label">
                      {data?.payload?.tech_lang_keys["Waist"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_waist"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_waist}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_waist_units} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "inches (in", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
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

                  {/* <div className="col-span-6">
                                <label htmlFor="waist" className="text-[14px] text-blue">{ data?.payload?.tech_lang_keys['Waist'] }:</label>
                                <div className="w-100 py-2 relative">
                                    <input type="number" step="any" name="waist" id="waist" className="input" aria-label="input" placeholder="00" value="{ isset(request()->waist)?request()->waist:'' }" min="14" max="78" />
                                    <label htmlFor="waist_units" className="text-blue input_unit text-decoration-underline">{ isset($_POST['waist_units'])?$_POST['waist_units']:'in' } ▾</label>
                                    <input type="text" name="waist_units" value="{ isset($_POST['waist_units'])?$_POST['waist_units']:'in' }" id="waist_units" className="hidden">
                                    <div className="units waist_units hidden" to="waist_units">
                                        <p value="in" onclick="changeUnits(this, 'waist', 14, 78)">inches (in)</p>
                                        <p value="cm" onclick="changeUnits(this, 'waist', 41, 200)">centimeters (cm)</p>
                                    </div>
                                </div>
                            </div>  */}

                  <div className="col-span-6">
                    <label htmlFor="tech_high" className="label">
                      {data?.payload?.tech_lang_keys["high"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_high"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_high}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_high_units} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "inches (in", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
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

                  {/* <div className="col-span-6">
                                <label htmlFor="high" className="text-[14px] text-blue">{ data?.payload?.tech_lang_keys['high'] }:</label>
                                <div className="w-100 py-2 relative">
                                    <input type="number" step="any" name="high" id="high" className="input" aria-label="input" placeholder="00" value="{ isset(request()->high)?request()->high:'' }"  min="14" max="55"/>
                                    <label htmlFor="high_units" className="text-blue input_unit text-decoration-underline">{ isset($_POST['high_units'])?$_POST['high_units']:'in' } ▾</label>
                                    <input type="text" name="high_units" value="{ isset($_POST['high_units'])?$_POST['high_units']:'in' }" id="high_units" className="hidden">
                                    <div className="units high_units hidden" to="high_units">
                                        <p value="in" onclick="changeUnits(this, 'high', 14, 55)">inches (in)</p>
                                        <p value="cm" onclick="changeUnits(this, 'high', 41, 130)">centimeters (cm)</p>
                                    </div>
                                </div>
                            </div>  */}

                  <div className="col-span-6">
                    <label htmlFor="tech_hip" className="label">
                      {data?.payload?.tech_lang_keys["Hip"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_hip"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_hip}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_hip_units} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "inches (in", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler3(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="col-span-6">
                                <label htmlFor="hip" className="text-[14px] text-blue">{ data?.payload?.tech_lang_keys['Hip'] }:</label>
                                <div className="w-100 py-2 relative">
                                    <input type="number" step="any" name="hip" id="hip" className="input" aria-label="input" placeholder="00" value="{ isset(request()->hip)?request()->hip:'' }" min="14" max="47" />
                                    <label htmlFor="hip_units" className="text-blue input_unit text-decoration-underline">{ isset($_POST['hip_units'])?$_POST['hip_units']:'in' } ▾</label>
                                    <input type="text" name="hip_units" value="{ isset($_POST['hip_units'])?$_POST['hip_units']:'in' }" id="hip_units" className="hidden">
                                    <div className="units hip_units hidden" to="hip_units">
                                        <p value="in" onclick="changeUnits(this, 'hip', 14, 47)">inches (in)</p>
                                        <p value="cm" onclick="changeUnits(this, 'hip', 41, 120)">centimeters (cm)</p>
                                    </div>
                                </div>
                            </div>  */}
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 flex items-center justify-center">
                <div className="col-12 flex   mt-4 mt-lg-0 py-2">
                  {formData.tech_gender == "men" && (
                    <img
                      src="/images/all_calculators/bodyshapes/male_shape_new.png"
                      alt="Shape Image"
                      className="max-width img w-[200px]"
                      height="auto"
                    />
                  )}
                  {formData.tech_gender == "women" && (
                    <img
                      src="/images/all_calculators/bodyshapes/new_female_shape_new.png"
                      alt="Shape Image"
                      className="max-width img w-[200px]"
                      height="auto"
                    />
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
                    <div className="w-full  mt-3">
                      <div className="w-full">
                        <div className=" bordered rounded-lg p-3">
                          <div className="w-full md:w-[80%] lg:w-[80%] flex flex-column flex-md-row justify-between mx-auto items-center">
                            <div className="">
                              <p>
                                <strong className="text-[21px]">
                                  {data?.payload?.tech_lang_keys["ans"]}
                                </strong>
                              </p>
                              <p className="text-center my-2">
                                <strong className="text-green-700 text-[25px] ">
                                  {result?.tech_shape}
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[18px]">
                                  {data?.payload?.tech_lang_keys["whr"]}
                                </strong>
                              </p>
                              <p className="text-center">
                                <strong className="text-green-700 text-[18px]">
                                  {result?.tech_whr}
                                </strong>
                              </p>
                            </div>

                            <div className="border-r hidden lg:block py-5"></div>
                            <div className="text-center">
                              {formData.tech_gender === "men" && (
                                <img
                                  src={`/images/all_calculators/bodyshapes/${result?.tech_img}.png`}
                                  alt="Shape Image"
                                  className="max-width w-[100px] img"
                                  height="70px"
                                />
                              )}

                              {formData.tech_gender === "women" && (
                                <img
                                  src={`/images/all_calculators/bodyshapes/${result?.tech_img}.png`}
                                  alt="Shape Image"
                                  className="max-width w-[100px] img imageToZoom"
                                  height="70px"
                                />
                              )}

                              <p className="text-[14px] md:hidden">
                                <strong>Remember:</strong> your body is a gift,
                                treat it with kindness and it will treat you
                                even better
                              </p>
                            </div>
                          </div>
                          <p className="text-[14px] text-center hidden md:block">
                            <strong>Remember:</strong> your body is a gift,
                            treat it with kindness and it will treat you even
                            better
                          </p>
                        </div>
                        {formData?.tech_gender == "men" && (
                          <div className="w-full   bordered rounded-lg p-5 mt-4 ">
                            {result?.tech_shape == "Rectangle" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Rectangle Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full ">
                                  <p>
                                    Most of the men in this world possess this
                                    body shape and this is why. Men who have
                                    this body type are generally smart-looking
                                    individuals with a tall height compared to
                                    men of other body shapes. If your body is
                                    rectangular, your shoulders, waist, and hips
                                    measure the same value. Every 4 men out of
                                    10 have this particular body type.{" "}
                                  </p>
                                  <div className="w-full">
                                    <p className="text-[18px] mt-2">
                                      <strong className="text-blue">
                                        Celebrites having Rectangle Body Shape:
                                      </strong>
                                    </p>
                                    <div className="col-span-12 text-[18px] mt-2">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">David Beckham</li>
                                        <li className="py-1">Ryan Reynolds</li>
                                        <li className="py-1">Ashton Kutcher</li>
                                        <li className="py-1">Jared Leto</li>
                                        <li className="py-1">Hugh Grant</li>
                                        <li className="py-1">Ewan McGregor</li>
                                        <li className="py-1">Ryan Gosling</li>
                                        <li className="py-1">Bradley Cooper</li>
                                      </ul>
                                    </div>
                                    <p className="text-[18px] mt-2">
                                      <strong className="text-blue">
                                        How to dress up?
                                      </strong>
                                    </p>
                                    <div className="w-full">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Add volume to your shoulders with
                                          structured jackets and blazers
                                        </li>
                                        <li className="py-1">
                                          Create the illusion of a waist with
                                          belts and accessories
                                        </li>
                                        <li className="py-1">
                                          Wear clothing with vertical stripes or
                                          patterns to elongate your silhouette
                                        </li>
                                        <li className="py-1">
                                          Opt for fitted shirts and pants to
                                          enhance your natural shape
                                        </li>
                                        <li className="py-1">
                                          Avoid overly baggy or boxy clothing
                                          that can make you appear wider
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape == "Trapezoid" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Trapezoid Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full ">
                                  <p>
                                    The trapezoid body shape, also known as the
                                    "wedge", is characterized by broader
                                    shoulders and a narrower waist. Men with
                                    this body type often have a muscular upper
                                    body and a more tapered waistline.{" "}
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <p className="col-span-12 text-[18px] mt-2">
                                      <strong className="text-blue">
                                        Celebrites having Trapezoid Body Shape :
                                      </strong>
                                    </p>
                                    <div className="col-span-12 text-[18px] mt-2">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Chris Evans</li>
                                        <li className="py-1">Henry Cavill</li>
                                        <li className="py-1">Ryan Reynolds</li>
                                        <li className="py-1">Brad Pitt</li>
                                        <li className="py-1">
                                          Dwayne Johnson (The Rock)
                                        </li>
                                      </ul>
                                    </div>
                                    <p className="col-span-12 text-[18px] mt-2">
                                      <strong className="text-blue">
                                        How to dress up?:
                                      </strong>
                                    </p>
                                    <div className="col-span-12">
                                      <ul className=" blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Use belts to accentuate your natural
                                          waistline.
                                        </li>
                                        <li className="py-1">
                                          Wear V-neck shirts or jackets with
                                          slightly tapered sleeves.
                                        </li>
                                        <li className="py-1">
                                          Wear pants or shorts that showcase
                                          your legs.
                                        </li>
                                        <li className="py-1">
                                          Opt for slim-fitting clothing to avoid
                                          adding bulk to your upper body.
                                        </li>
                                        <li className="py-1">
                                          Layering can help create a more
                                          balanced silhouette.
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {result?.tech_shape == "Triangle" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Triangle Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full ">
                                  <p>
                                    You must have a wider waist if this body
                                    shape belongs to you. The body type is quite
                                    similar to that of the oval shape. Men with
                                    triangular bodies have narrow shoulders.
                                    This is why it is suggested to wear
                                    dark-colored costumes that highlight the
                                    upper half of the body. The body type is
                                    also known as “The Dad Bold” and a few men
                                    in the world have this shape.
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <p className="col-span-12 text-[18px] mt-2">
                                      <strong className="text-blue">
                                        Celebrites having Triangle Body Shape :
                                      </strong>
                                    </p>
                                    <div className="col-span-12 text-[18px] mt-2">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Tom Cruise</li>
                                        <li className="py-1">Ryan Reynolds</li>
                                        <li className="py-1">Hugh Jackman</li>
                                        <li className="py-1">Brad Pitt</li>
                                        <li className="py-1">Dwayne Johnson</li>
                                      </ul>
                                    </div>
                                    <p className="col-span-12 text-[18px] mt-2">
                                      <strong className="text-blue">
                                        How to dress up?:
                                      </strong>
                                    </p>
                                    <div className="col-span-12 ">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Choose clothing that adds volume to
                                          your hips and legs
                                        </li>
                                        <li className="py-1">
                                          Opt for shirts and jackets with subtle
                                          detailing or patterns around the
                                          shoulder area
                                        </li>
                                        <li className="py-1">
                                          Use belts or accessories to cinch your
                                          waist and create a more defined
                                          silhouette
                                        </li>
                                        <li className="py-1">
                                          Wearing clothing with vertical stripes
                                          can help to create a more balanced
                                          appearance
                                        </li>
                                        <li className="py-1">
                                          Steer clear of bulky or oversized
                                          clothing that can make your upper body
                                          appear even broader
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape == "Oval" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Oval Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full ">
                                  <p>
                                    The oval body shape, also known as the
                                    "round" or "apple" shape, is characterized
                                    by a fuller midsection and a more rounded
                                    appearance. Men with this body type often
                                    have a larger chest and waist, with their
                                    shoulders and hips measuring similarly.
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <p className="col-span-12 text-[18px] mt-2">
                                      <strong className="text-blue">
                                        Celebrites having Oval Body Shape :
                                      </strong>
                                    </p>
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">James Corden</li>
                                        <li className="py-1">Elton John</li>
                                        <li className="py-1">Ryan Reynolds</li>
                                        <li className="py-1">John Goodman</li>
                                        <li className="py-1">Jack Black</li>
                                        <li className="py-1">Zach Miko</li>
                                      </ul>
                                    </div>
                                    <p className="col-span-12 text-[18px] mt-2">
                                      <strong className="text-blue">
                                        How to dress up?:
                                      </strong>
                                    </p>
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Opt for clothing with V-necks or
                                          vertical stripes to help elongate your
                                          torso
                                        </li>
                                        <li className="py-1">
                                          Layering can help add dimension and
                                          break up the rounded shape. Choose
                                          pieces that complement each other and
                                          create a visually appealing effect
                                        </li>
                                        <li className="py-1">
                                          Steer clear of overly tight-fitting
                                          garments that can accentuate your
                                          midsection
                                        </li>
                                        <li className="py-1">
                                          Use color and pattern to draw
                                          attention away from your midsection
                                          and create a more balanced look
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape == "Inverted Triangle" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Inverted Triangle Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full ">
                                  <p>
                                    The inverted triangle body shape, also known
                                    as the "wedge" or "triangle" shape, is
                                    characterized by broader shoulders and a
                                    narrower waist. Men with this body type
                                    often have a muscular upper body and a more
                                    tapered waistline.{" "}
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <p className="col-span-12 text-[18px] mt-2">
                                      <strong className="text-blue">
                                        Celebrites having Inverted Triangle Body
                                        Shape :
                                      </strong>
                                    </p>
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Brad Pitt</li>
                                        <li className="py-1">
                                          Chris Hemsworth
                                        </li>
                                        <li className="py-1">Chris Evan</li>
                                        <li className="py-1">Ryan Gosling</li>
                                      </ul>
                                    </div>
                                    <p className="col-span-12 text-[18px] mt-2">
                                      <strong className="text-blue">
                                        How to dress up?:
                                      </strong>
                                    </p>
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Opt for clothing that balances the
                                          broader shoulders with the narrower
                                          waist. For example, try wearing V-neck
                                          shirts or jackets with slightly
                                          tapered sleeves.
                                        </li>
                                        <li className="py-1">
                                          Since the upper body is often more
                                          prominent, consider wearing pants or
                                          shorts that showcase your legs to
                                          create a balanced overall look.
                                        </li>
                                        <li className="py-1">
                                          Steer clear of bulky or oversized
                                          clothing that can make your upper body
                                          appear even broader.
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {formData?.tech_gender == "women" && (
                          <div className="w-full  bordered rounded-lg p-5 mt-4 ">
                            {result?.tech_shape == "Hourglass" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Hourglass Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full { (request()->gender === 'men') ? 'hidden' : '' }">
                                  <p>
                                    Hourglass body shape consists of larger hips
                                    and bust measurements along with a narrower
                                    waist. Approximately 8.4% of the total women
                                    population around the globe have such a body
                                    type. Moreover, it is a body kind almost
                                    every woman wishes to have. This body figure
                                    is very attractive and adds beauty to the
                                    women’s personality.
                                  </p>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      Celebrities having hourglass body shape:
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Christina Hendricks
                                        </li>
                                        <li className="py-1">Salma Hayek</li>
                                        <li className="py-1">Kim Novak</li>
                                        <li className="py-1">
                                          Elizabeth Taylor
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Sophia Loren</li>
                                        <li className="py-1">
                                          Scarlett Johansson
                                        </li>
                                        <li className="py-1">Marilyn Monroe</li>
                                        <li className="py-1">Ursula Andress</li>
                                      </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Raquel Welch</li>
                                        <li className="py-1">Marilyn Monroe</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      How to dress up an hourglass body shape?
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          You must use undergarments and
                                          costumes that best fit your slim body
                                        </li>
                                        <li className="py-1">
                                          Wear up dresses that go on prominent
                                          your waist and hips{" "}
                                        </li>
                                        <li className="py-1">
                                          Use jumpsuits that increase to your
                                          body dimensions{" "}
                                        </li>
                                        <li className="py-1">
                                          Try using the thinner border lined
                                          tops{" "}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape == "Bottom" && (
                              <div className="w-full ">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Bottom Hourglass Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full">
                                  <p>
                                    Usually, a bottom hourglass body shape
                                    constitutes a larger waist to hip ratio than
                                    the bust. Almost 9% of the total women in
                                    the world are having this body figure.
                                    Putting up considerable dresses enhances
                                    attraction towards the women having this
                                    kind of body figure.
                                  </p>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      Celebrities having bottom hourglass body
                                      shape:
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Tyra Banks</li>
                                        <li className="py-1">Sofia Vergara</li>
                                        <li className="py-1">Jennifer Lopez</li>
                                        <li className="py-1">
                                          America Ferrera
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Katherine Heigl
                                        </li>
                                        <li className="py-1">Tyra Banks</li>
                                        <li className="py-1">Sara Ramirez</li>
                                        <li className="py-1">Jordin Sparks</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      How to dress up a bottom hourglass body
                                      shape?
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Use simple tops with jeans that are
                                          straight
                                        </li>
                                        <li className="py-1">
                                          You should use scarf or anything that
                                          will give a particular highlight to
                                          your face dimensions
                                        </li>
                                        <li className="py-1">
                                          Try avoiding straight costumes that
                                          make you look odd enough
                                        </li>
                                        <li className="py-1">
                                          Never use low waisted skirts due to
                                          the bulk accumulated in your lower
                                          body
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape == "Top Hourglass" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Top Hourglass Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full">
                                  <p>
                                    The top hourglass shape is defined by a
                                    greater bust circumference than hip
                                    circumference. As well as the ratios of
                                    their bust-to-waist and hips-to-waist
                                    measurements are significant enough to
                                    result in a distinct waistline.
                                    Approximately, less than 10% of the global
                                    women population comprise such a figure.
                                  </p>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      Celebrities with top hourglass body shape:
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Emilia Clarke</li>
                                        <li className="py-1">Emma Roberts</li>
                                        <li className="py-1">Dita von Teese</li>
                                        <li className="py-1">Kat Dennings</li>
                                      </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Jenna Dewan</li>
                                        <li className="py-1">Bridget Bardot</li>
                                        <li className="py-1">Halle Berry</li>
                                        <li className="py-1">
                                          Jayne Mansfield
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      How to dress up an upper hourglass body
                                      shape?
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Don't use flexible tops that broaden
                                          your shoulder and bust
                                        </li>
                                        <li className="py-1">
                                          Use nipped dresses that add to the
                                          dimensions of such body
                                        </li>
                                        <li className="py-1">
                                          Using wrap dresses may be a great
                                          option as they create a catchy
                                          silhouette
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape == "Spoon" && (
                              <div className="w-full ">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Spoon Shaped Body:
                                  </strong>
                                </p>
                                <div className="w-full">
                                  <p>
                                    Spoon shaped body is just like a pear
                                    shaped. Women having such a body figure have
                                    broader hips than that of the bust and
                                    shoulders. But a spoon shaped body typically
                                    has a larger belly than a pear one. Women
                                    with such a shape have thinner necklines and
                                    slim waist that give their figure a charming
                                    sight.
                                  </p>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      Celebrities having an spoon body shape:
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Cheryl Burke</li>
                                        <li className="py-1">
                                          Jennifer Love Hewitt
                                        </li>
                                        <li className="py-1">Cameron Diaz</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      How to dress up an inverted triangle body
                                      shape?
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Use A line shirts with princess cut
                                          designs{" "}
                                        </li>
                                        <li className="py-1">
                                          You may use strapless costumes in case
                                          you have this kind of body. Try using
                                          dresses with one strap as well
                                        </li>
                                        <li className="py-1">
                                          For lower part of the body, you should
                                          better wear long pants
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape == "Triangle" && (
                              <div className="w-full ">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Triangle Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full">
                                  <p>
                                    This body shape is quite similar to that of
                                    the hourglass. The larger hip size than bust
                                    and waist give it the name of pear shaped
                                    figure. All around the globe, typically 21%
                                    of women have such a body type. A flat
                                    stomach adds to the beauty of the shape as
                                    well. People also call the triangular shaped
                                    body a pear one.
                                  </p>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      Celebrities having pear body shape:
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Kate Winslet</li>
                                        <li className="py-1">Beyonce</li>
                                        <li className="py-1">Jennifer Lopez</li>
                                      </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Shakira</li>
                                        <li className="py-1">Paris Hilton</li>
                                        <li className="py-1">Rihanna</li>
                                      </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Kim Kardashian{" "}
                                        </li>
                                        <li className="py-1">
                                          Christina Aguilera
                                        </li>
                                        <li className="py-1">Eva Longoria</li>
                                      </ul>
                                    </div>
                                  </div>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      How to dress up a pear body shape?
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          You should try to use bright colored
                                          tops to prominent your upper area of
                                          the body
                                        </li>
                                        <li className="py-1">
                                          Use costumes that helps you prominent
                                          your shoulders and bust specially
                                        </li>
                                        <li className="py-1">
                                          Try using clothes having long sleeves
                                          to highlight your arms’ dimensions
                                        </li>
                                        <li className="py-1">
                                          Use dark colored skirts or pants to
                                          cover your bottom body area
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape ==
                              "BottInverted Triangleom" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Inverted Triangle Body Shape:
                                  </strong>
                                </p>
                                <p>
                                  An inverted triangular body shape has large
                                  measurements for shoulders and bust but the
                                  measure of waist and hips are small enough. On
                                  an average, about 10% of the total ladies
                                  around the globe have this body shape. Another
                                  name used for this body kind is strawberry
                                  shaped.
                                </p>
                                <p className="text-[18px] mt-2">
                                  <strong className="text-blue">
                                    Celebrities having an inverted triangle body
                                    shape:
                                  </strong>
                                </p>
                                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                  <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                    <ul className="blue-marker float-start ps-3 list-disc">
                                      <li className="py-1">Giselle Bundchen</li>
                                      <li className="py-1">Angelina Jolie</li>
                                      <li className="py-1">Naomi Campbell</li>
                                    </ul>
                                  </div>
                                  <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                    <ul className="blue-marker float-start ps-3 list-disc">
                                      <li className="py-1">Renee Zellweger</li>
                                      <li className="py-1">Charlize Theron</li>
                                      <li className="py-1">Demi Moore</li>
                                    </ul>
                                  </div>
                                  <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                    <ul className="blue-marker float-start ps-3 list-disc">
                                      <li className="py-1">
                                        Catherine Zeta-Jones
                                      </li>
                                      <li className="py-1">
                                        Federica Pellegrini
                                      </li>
                                      <li className="py-1">Jennifer Garner</li>
                                    </ul>
                                  </div>
                                </div>
                                <p className="text-[18px] mt-2">
                                  <strong className="text-blue">
                                    How to dress up an inverted triangle body
                                    shape?
                                  </strong>
                                </p>
                                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                  <div className="col-span-12">
                                    <ul className="blue-marker float-start ps-3 list-disc">
                                      <li className="py-1">
                                        Try wearing blouses with asymmetrical
                                        necklines
                                      </li>
                                      <li className="py-1">
                                        Use longer pants to show off your long
                                        legs{" "}
                                      </li>
                                      <li className="py-1">
                                        Use leather jackets and uppers that
                                        extent to the hips{" "}
                                      </li>
                                      <li className="py-1">
                                        Try to wear tops with wider straps
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                            {result?.tech_shape == "Rectangle" && (
                              <div className="w-full">
                                <p className="text-[18px]">
                                  <strong className="text-blue">
                                    Rectangle Body Shape:
                                  </strong>
                                </p>
                                <div className="w-full">
                                  <p>
                                    A rectangular body shape is a kind of
                                    straight figure having almost equal
                                    measurements for bust, waist, and hips.
                                    Women having such a body shape are
                                    relatively tall and seem physically active
                                    enough. Almost 46% of the total women
                                    population around the globe has this figure
                                    type. A good fact to consider here is that
                                    if weight is increased, it gets distributed
                                    thoroughly around the whole body.
                                  </p>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      Celebrities having rectangular body shape:
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Kate Hudson </li>
                                        <li className="py-1">Gigi Hadid </li>
                                        <li className="py-1">Cameron Diaz</li>
                                      </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">Kendall Jenner</li>
                                        <li className="py-1">Sienna Miller</li>
                                        <li className="py-1">Kate Moss</li>
                                      </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Gwyneth Paltrow
                                        </li>
                                        <li className="py-1">Gwen Stefani</li>
                                        <li className="py-1">
                                          Natalie Portman
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <p className="text-[18px] mt-2">
                                    <strong className="text-blue">
                                      How to dress up a rectangular body shape?
                                    </strong>
                                  </p>
                                  <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                                    <div className="col-span-12">
                                      <ul className="blue-marker float-start ps-3 list-disc">
                                        <li className="py-1">
                                          Avoid tucking your tops into trousers
                                        </li>
                                        <li className="py-1">
                                          Use dark colored belts around your
                                          waist area that seem prominent
                                        </li>
                                        <li className="py-1">
                                          Wear such tops in which your shoulders
                                          and waist get prominent{" "}
                                        </li>
                                        <li className="py-1">
                                          Use such costumes that create illusion
                                          around your waist area
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="w-full text-[18px] my-3">
                          <strong>Different Body Shapes are:</strong>
                        </p>
                        <div className="w-full bg-sky bordered rounded-lg p-2 zoom-container flex items-center">
                          <div className="w-full text-center">
                            {formData.tech_gender == "men" && (
                              <img
                                src="/images/all_calculators/bodyshapes/new_male_result_shape.png"
                                alt="Shape Image v"
                                className="max-width img"
                                height="270px"
                              />
                            )}
                            {formData.tech_gender == "women" && (
                              <img
                                src="/images/all_calculators/bodyshapes/bodyshape_femalenew.png"
                                alt="Shape Image imageToZoom"
                                className="max-width img"
                                height="270px"
                              />
                            )}
                          </div>
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

export default BodyShapeCalculator;
