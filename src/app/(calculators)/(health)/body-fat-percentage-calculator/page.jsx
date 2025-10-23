"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useBodyFatCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BodyFatCalculator = () => {
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
    tech_gender: "Male",
    tech_method: "2",
    tech_age: 25,
    tech_weight: Number(150),
    tech_unit: "lbs",
    tech_heightft: "5",
    tech_unit_ft_in: "ft/in",
    tech_heightin: "9",
    tech_unit_h: "ft/in",
    tech_heightcm: "175",
    tech_unit_h_cm: "cm",
    tech_hightUnit: "ft/in",
    tech_height_ft: Number(19),
    tech_neck: Number(19),
    tech_neck_in: "19",
    tech_height_cm: 19,
    tech_unit_n: "in",
    tech_waist: Number(30),
    tech_unit_w: "in",
    tech_hip: "30",
    tech_unit_hip: "in",
    tech_chest: "4",
    tech_unit_chest: "mm",
    tech_abd: "4",
    tech_unit_abd: "mm",
    tech_thigh: "6",
    tech_unit_thigh: "mm",
    tech_tricep: "4",
    tech_unit_tricep: "mm",
    tech_sub: "4",
    tech_unit_sub: "mm",
    tech_sup: "4",
    tech_unit_sup: "mm",
    tech_mid: "4",
    tech_unit_mid: "mm",
    tech_bicep: "1",
    tech_unit_bicep: "mm",
    tech_back: "1",
    tech_unit_back: "mm",
    tech_calf: "1",
    tech_unit_calf: "mm",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBodyFatCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_gender || !formData.tech_method) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gender: formData.tech_gender,
        tech_method: formData.tech_method,
        tech_age: formData.tech_age,
        tech_weight: formData.tech_weight,
        tech_unit: formData.tech_unit,
        tech_heightft: formData.tech_heightft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_heightin: formData.tech_heightin,
        tech_unit_h: formData.tech_unit_h,
        tech_heightcm: formData.tech_heightcm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_hightUnit: formData.tech_hightUnit,
        tech_neck: formData.tech_neck,
        tech_unit_n: formData.tech_unit_n,
        tech_waist: formData.tech_waist,
        tech_unit_w: formData.tech_unit_w,
        tech_hip: formData.tech_hip,
        tech_unit_hip: formData.tech_unit_hip,
        tech_chest: formData.tech_chest,
        tech_unit_chest: formData.tech_unit_chest,
        tech_abd: formData.tech_abd,
        tech_unit_abd: formData.tech_unit_abd,
        tech_thigh: formData.tech_thigh,
        tech_unit_thigh: formData.tech_unit_thigh,
        tech_tricep: formData.tech_tricep,
        tech_unit_tricep: formData.tech_unit_tricep,
        tech_sub: formData.tech_sub,
        tech_unit_sub: formData.tech_unit_sub,
        tech_sup: formData.tech_sup,
        tech_unit_sup: formData.tech_unit_sup,
        tech_mid: formData.tech_mid,
        tech_unit_mid: formData.tech_unit_mid,
        tech_bicep: formData.tech_bicep,
        tech_unit_bicep: formData.tech_unit_bicep,
        tech_back: formData.tech_back,
        tech_unit_back: formData.tech_unit_back,
        tech_calf: formData.tech_calf,
        tech_unit_calf: formData.tech_unit_calf,
        tech_submit: formData.tech_submit,
        tech_height_ft: formData.tech_height_ft,
        tech_neck_in: formData.tech_neck_in,
        tech_height_cm: formData.tech_height_cm,
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
      tech_gender: "Male",
      tech_method: "2",
      tech_age: "25",
      tech_weight: "150",
      tech_unit: "lbs",
      tech_heightft: "5",
      tech_unit_ft_in: "ft/in",
      tech_heightin: "9",
      tech_unit_h: "ft/in",
      tech_heightcm: "175",
      tech_unit_h_cm: "cm",
      tech_hightUnit: "ft/in",
      tech_height_ft: "19",
      tech_neck: "19",
      tech_neck_in: "19",
      tech_height_cm: "19",
      tech_unit_n: "in",
      tech_waist: "30",
      tech_unit_w: "in",
      tech_hip: "30",
      tech_unit_hip: "in",
      tech_chest: "4",
      tech_unit_chest: "mm",
      tech_abd: "4",
      tech_unit_abd: "mm",
      tech_thigh: "6",
      tech_unit_thigh: "mm",
      tech_tricep: "4",
      tech_unit_tricep: "mm",
      tech_sub: "4",
      tech_unit_sub: "mm",
      tech_sup: "4",
      tech_unit_sup: "mm",
      tech_mid: "4",
      tech_unit_mid: "mm",
      tech_bicep: "1",
      tech_unit_bicep: "mm",
      tech_back: "1",
      tech_unit_back: "mm",
      tech_calf: "1",
      tech_unit_calf: "mm",
      tech_submit: "calculate",
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
  const [dropdownVisible0, setDropdownVisible0] = useState(false);

  const setUnitHandler0 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_h_cm: unit }));
    setDropdownVisible0(false);
  };

  const toggleDropdown0 = () => {
    setDropdownVisible0(!dropdownVisible0);
  };

  //dropdown states 00
  const [dropdownVisible00, setDropdownVisible00] = useState(false);

  const setUnitHandler00 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_n: unit }));
    setDropdownVisible00(false);
  };

  const toggleDropdown00 = () => {
    setDropdownVisible00(!dropdownVisible00);
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_w: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_hip: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 3
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_chest: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };
  //dropdown states 4
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_abd: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };
  //dropdown states 5
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_thigh: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };
  //dropdown states 6
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_tricep: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states 7
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_sub: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states 8
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_sup: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };
  //dropdown states 9
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_mid: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };

  //dropdown states 10
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_bicep: unit }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };

  //dropdown states 11
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_bicep: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };
  //dropdown states 12
  const [dropdownVisible12, setDropdownVisible12] = useState(false);

  const setUnitHandler12 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_calf: unit }));
    setDropdownVisible12(false);
  };

  const toggleDropdown12 = () => {
    setDropdownVisible12(!dropdownVisible12);
  };

  //dropdown states 13
  const [dropdownVisible13, setDropdownVisible13] = useState(false);

  const setUnitHandler13 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_unit_ft_in: unit,
      tech_hightUnit: unit, // 🔥 hidden input value updated here
    }));
    setDropdownVisible13(false);
  };

  const toggleDropdown13 = () => {
    setDropdownVisible13(!dropdownVisible13);
  };

  //dropdown states 14
  const [dropdownVisible14, setDropdownVisible14] = useState(false);

  const setUnitHandler14 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
      tech_hightUnit: unit, // 🔥 hidden input value updated here
    }));
    setDropdownVisible14(false);
  };

  const toggleDropdown14 = () => {
    setDropdownVisible14(!dropdownVisible14);
  };

  // model popup images
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (id) => {
    setSelectedId(id); // yeh value hidden bhi ho sakti hai
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  const [showModal2, setShowModal2] = useState(false);

  const handleImageClick2 = () => {
    if (formData.tech_method) {
      setShowModal2(true);
    } else {
      alert("Pehle koi method select karo");
    }
  };

  const handleCloseModal2 = () => setShowModal2(false);

  const getModalContent2 = () => {
    switch (formData.tech_method) {
      case "1":
        return {
          title: `Estimate from BMI`,
          description:
            "Determine your body fat percentage and body fat weight based on your BMI along with other factors, such as gender, age, weight, and height.",
        };
      case "2":
        return {
          title: `U.S. Navy Method`,
          description:
            "The US Navy method includes the neck, waist, and hip circumference measurements to estimate the body fat percentage. To measure the body parts, use a flexible tape.",
        };
      case "3":
        return {
          title: `Jackson-Pollock 7 (Fat Caliper)`,
          description:
            "This method includes measuring the thickness of subcutaneous fat (the fat just beneath the skin) at seven specific locations on your body. It is done using the calipers.",
        };
      case "4":
        return {
          title: `Jackson-Pollock 4 (Fat Caliper)`,
          description:
            "This method estimates an individual's body fat percentage by measuring subcutaneous fat (the fat just beneath the skin).",
        };
      case "5":
        return {
          title: `Jackson-Pollock 3 (Fat Caliper)`,
          description:
            "It is designed to provide a quick and easy assessment of body fat, measuring only three specific sites of the body. The selected measurement sites differ between men and women.",
        };
      case "6":
        return {
          title: `Parillo (Fat Caliper)`,
          description:
            "This method measures nine sites of your body. It is good for individuals with higher muscle mass and lower body fat percentages.",
        };
      case "7":
        return {
          title: `Durnin/Wormsley (Fat Caliper)`,
          description:
            "This method includes measuring skinfold thickness at four specific sites of your body. It is considered applicable to a wide range of individuals.",
        };

      // Add more cases as needed...
      default:
        return { title: "", description: "" };
    }
  };

  const { title, description } = getModalContent2();

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
          <div className="lg:w-[70%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12 px-2 flex mb-2 items-center">
                <label htmlFor="gender" className="pe-lg-3 pe-2 label">
                  {data?.payload?.tech_lang_keys["gender"]}:
                </label>
                <label className="pe-2" htmlFor="Male">
                  <input
                    type="radio"
                    name="tech_gender"
                    value="Male"
                    id="Male"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_gender === "Male"}
                  />
                  <span>{data?.payload?.tech_lang_keys["male"]}</span>
                </label>
                <label htmlFor="Female">
                  <input
                    type="radio"
                    name="tech_gender"
                    className="mr-2 border"
                    value="Female"
                    id="Female"
                    onChange={handleChange}
                    checked={formData.tech_gender === "Female"}
                  />
                  <span>{data?.payload?.tech_lang_keys["female"]}</span>
                </label>
              </div>

              <div className="col-span-11 px-2 methods">
                <label htmlFor="tech_method" className="label">
                  Methods:
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
                    <option value="7">
                      {data?.payload?.tech_lang_keys["70"] ?? "BMI"}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["24"]} (
                      {data?.payload?.tech_lang_keys["22"]}){" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["25"]} 7 (
                      {data?.payload?.tech_lang_keys["23"]}){" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["25"]} 4 (
                      {data?.payload?.tech_lang_keys["23"]}){" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["25"]} 3 (
                      {data?.payload?.tech_lang_keys["23"]}){" "}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["26"]} (
                      {data?.payload?.tech_lang_keys["23"]}){" "}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["27"]} (
                      {data?.payload?.tech_lang_keys["23"]}){" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-1 flex items-center mt-8">
                <img
                  className="cursor-pointer"
                  src="/images/calorie_deficit/info.png"
                  onClick={handleImageClick2}
                  id="method_info"
                  width="19px"
                  alt=""
                />
              </div>

              {(formData.tech_method == "7" ||
                formData.tech_method == "1" ||
                formData.tech_method == "2" ||
                formData.tech_method == "3" ||
                formData.tech_method == "4" ||
                formData.tech_method == "5" ||
                formData.tech_method == "6") && (
                <>
                  <div className="col-span-6 px-2">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["age_year"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_age"
                        id="tech_age"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_method == "7" ||
                formData.tech_method == "1" ||
                formData.tech_method == "2" ||
                formData.tech_method == "3" ||
                formData.tech_method == "4" ||
                formData.tech_method == "5" ||
                formData.tech_method == "6") && (
                <>
                  <div className="col-span-6 px-2">
                    <label htmlFor="tech_weight" className="label">
                      {data?.payload?.tech_lang_keys["weight"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_weight"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_weight}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "lbs", value: "lbs" },
                            { label: "kg", value: "kg" },
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
                </>
              )}

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
              {(formData.tech_method == "1" ||
                formData.tech_method == "2" ||
                formData.tech_method == "3" ||
                formData.tech_method == "4" ||
                formData.tech_method == "5" ||
                formData.tech_method == "6") && (
                <>
                  {formData.tech_unit_ft_in == "ft/in" && (
                    <>
                      <div className="col-span-3  ft_in">
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
                            placeholder="ft"
                            value={formData.tech_height_ft}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-3  ps-lg-0 ft_in ">
                        <label htmlFor="tech_neck_in" className="label">
                          &nbsp;
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_neck_in"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_neck_in}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown13}
                          >
                            {formData.tech_unit_h} ▾
                          </label>
                          {dropdownVisible13 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "ft/in", value: "ft/in" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler13(unit.value)}
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
                  {formData.tech_unit_ft_in == "cm" && (
                    <>
                      <div className="col-span-6 h_cm   height-cm">
                        <label htmlFor="tech_height_cm" className="label">
                          {data?.payload?.tech_lang_keys["height"]} (cm):
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
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown14}
                          >
                            {formData.tech_unit_h_cm} ▾
                          </label>
                          {dropdownVisible14 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "ft/in", value: "ft/in" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler14(unit.value)}
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
                </>
              )}
              <input
                type="hidden"
                step="any"
                name="tech_hightUnit"
                id="tech_hightUnit"
                className="input my-2"
                aria-label="input"
                value={formData.tech_hightUnit}
                onChange={handleChange}
              />

              {formData.tech_method == "1" && (
                <>
                  <div className="col-span-6 px-2 navy neck ">
                    <label htmlFor="tech_neck" className="label">
                      {data?.payload?.tech_lang_keys["neck"]}:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_neck"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_neck}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown00}
                      >
                        {formData.tech_unit_n} ▾
                      </label>
                      {dropdownVisible00 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "inches (in)" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler00(unit.value)}
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
              {formData.tech_method == "1" && (
                <>
                  <div className="col-span-6 px-2 navy  waist ">
                    <label htmlFor="tech_waist" className="label">
                      {data?.payload?.tech_lang_keys["waist"]}:
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
                        {formData.tech_unit_w} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "inches (in)" },
                            { label: "cm", value: "cm" },
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

              {formData.tech_gender === "Female" && (
                <>
                  <div className="col-span-6 px-2 hip">
                    <label htmlFor="tech_hip" className="label">
                      {data?.payload?.tech_lang_keys["hip"]}:
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_hip"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_hip}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_hip} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "in", value: "inches (in)" },
                            { label: "cm", value: "cm" },
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

              {(formData.tech_method == "2" || formData.tech_method == "5") && (
                <>
                  <div className="col-span-6 px-2 chest ">
                    <label htmlFor="chest" className="label flex items-center">
                      <span>{data?.payload?.tech_lang_keys["28"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("chest")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>
                    <div className="w-full py-2 relative">
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_chest"
                          min="1"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_chest}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_unit_chest} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "in", value: "in" },
                              { label: "cm", value: "cm" },
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
                  </div>
                </>
              )}

              {(formData.tech_method == "2" ||
                formData.tech_method == "3" ||
                formData.tech_method == "5") && (
                <>
                  <div className="col-span-6 px-2 abd ">
                    <label
                      htmlFor="tech_abd"
                      className="label flex items-center"
                    >
                      <span>{data?.payload?.tech_lang_keys["29"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("abd")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>
                    <div className="w-full py-2 relative">
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_abd"
                          min="1"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_abd}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_unit_abd} ▾
                        </label>
                        {dropdownVisible4 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "in", value: "in" },
                              { label: "cm", value: "cm" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler4(unit.value)}
                              >
                                {unit.label}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_method == "2" ||
                formData.tech_method == "3" ||
                formData.tech_method == "4" ||
                formData.tech_method == "5") && (
                <>
                  <div className="col-span-6 px-2 thigh ">
                    <label
                      htmlFor="tech_thigh"
                      className="label flex items-center"
                    >
                      <span>{data?.payload?.tech_lang_keys["30"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("thigh")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_thigh"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_thigh}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_unit_thigh} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler5(unit.value)}
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
              {(formData.tech_method == "2" ||
                formData.tech_method == "3" ||
                formData.tech_method == "4" ||
                formData.tech_method == "5" ||
                formData.tech_method == "6") && (
                <>
                  <div className="col-span-6 px-2 tricep ">
                    <label
                      htmlFor="tritech_tricepcep"
                      className="label flex items-center"
                    >
                      <span>{data?.payload?.tech_lang_keys["31"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("tricep")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_tricep"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_tricep}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_unit_tricep} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler6(unit.value)}
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
              {(formData.tech_method == "2" ||
                formData.tech_method == "3" ||
                formData.tech_method == "5" ||
                formData.tech_method == "6") && (
                <>
                  <div className="col-span-6 px-2 sub ">
                    <label
                      htmlFor="tech_sub"
                      className="label flex items-center"
                    >
                      <span>{data?.payload?.tech_lang_keys["32"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("sub")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_sub"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_sub}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown7}
                      >
                        {formData.tech_unit_sub} ▾
                      </label>
                      {dropdownVisible7 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler7(unit.value)}
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
              {(formData.tech_method == "2" ||
                formData.tech_method == "4" ||
                formData.tech_method == "5" ||
                formData.tech_method == "6") && (
                <>
                  <div className="col-span-6 px-2 sup ">
                    <label
                      htmlFor="tech_sup"
                      className="label flex items-center"
                    >
                      <span>{data?.payload?.tech_lang_keys["33"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("sup")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_sup"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_sup}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown8}
                      >
                        {formData.tech_unit_sup} ▾
                      </label>
                      {dropdownVisible8 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler8(unit.value)}
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
              {formData.tech_method == "2" && (
                <>
                  <div className="col-span-6 px-2 mid ">
                    <label
                      htmlFor="tech_mid"
                      className="label flex items-center"
                    >
                      <span>{data?.payload?.tech_lang_keys["34"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("mid")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mid"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mid}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown9}
                      >
                        {formData.tech_unit_mid} ▾
                      </label>
                      {dropdownVisible9 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler9(unit.value)}
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

              {(formData.tech_method == "5" || formData.tech_method == "6") && (
                <>
                  <div className="col-span-6 px-2 bicep ">
                    <label
                      htmlFor="tech_bicep"
                      className="label flex items-center"
                    >
                      <span>{data?.payload?.tech_lang_keys["35"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("bicep")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_bicep"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_bicep}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown10}
                      >
                        {formData.tech_unit_bicep} ▾
                      </label>
                      {dropdownVisible10 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler10(unit.value)}
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
              {formData.tech_method == "5" && (
                <>
                  <div className="col-span-6 px-2 back ">
                    <label
                      htmlFor="tech_back"
                      className="label flex items-center"
                    >
                      <span>{data?.payload?.tech_lang_keys["36"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("back")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_back"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_back}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown11}
                      >
                        {formData.tech_unit_back} ▾
                      </label>
                      {dropdownVisible11 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler11(unit.value)}
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
              {formData.tech_method == "5" && (
                <>
                  <div className="col-span-6 px-2 calf ">
                    <label htmlFor="calf" className="label flex items-center">
                      <span>{data?.payload?.tech_lang_keys["37"]}:</span>
                      <img
                        className="cursor-pointer mx-2"
                        src="/images/calorie_deficit/info.png"
                        onClick={() => handleImageClick("calf")}
                        id="info_img"
                        width="15px"
                        alt=""
                      />
                    </label>

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_calf"
                        min="1"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_calf}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown12}
                      >
                        {formData.tech_unit_calf} ▾
                      </label>
                      {dropdownVisible12 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "in", value: "in" },
                            { label: "cm", value: "cm" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler12(unit.value)}
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

          <div>
            {/* Hidden Input (if you want to pass the selected value in a form) */}
            <input
              type="hidden"
              name="selected_part"
              value={selectedId || ""}
            />
            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-5 rounded-lg relative w-[350px]">
                  <button
                    className="absolute top-2 right-3 text-gray-600 text-xl cursor-pointer"
                    onClick={closeModal}
                  >
                    &times;
                  </button>

                  {/* Dynamic Image and Content */}
                  {selectedId === "hip" && (
                    <>
                      <div className="flex justify-center">
                        {/* <img src="/images/women/calf.png" alt="hip info" className="mb-3 w-[150px]" /> */}
                      </div>
                      <hr></hr>
                      <p className="text-[14px]">Description not available.</p>
                    </>
                  )}

                  {selectedId === "chest" && (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="/images/women/women_chest.png"
                          alt="chest info"
                          className="mb-3 w-[150px]"
                        />
                      </div>
                      <hr></hr>
                      <p className="text-[14px]">
                        You should pinch diagonally, about one-third of the way
                        between the armpit and the nipple.
                      </p>
                    </>
                  )}

                  {selectedId === "abd" && (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="/images/women/women_abd.png"
                          alt="abd info"
                          className="mb-3 w-[150px]"
                        />
                      </div>
                      <p className="text-[14px]">
                        Take a vertical pinch about 2.5 cm or 1 inch from your
                        belly button.
                      </p>
                    </>
                  )}
                  {selectedId === "thigh" && (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="/images/women/women_thigh.png"
                          alt="thigh info"
                          className="mb-3 w-[150px]"
                        />
                      </div>
                      <p className="text-[14px]">
                        Pinch vertically on the front surface of the thigh,
                        midway between the knee and hip.
                      </p>
                    </>
                  )}
                  {selectedId === "tricep" && (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="/images/women/women_tri.png"
                          alt="tricep info"
                          className="mb-3 w-[150px]"
                        />
                      </div>
                      <p className="text-[14px]">
                        Raise your arm and take a vertical pinch just below
                        nipple level on the midaxillary line, which goes
                        directly downward from the center of the armpit.
                      </p>
                    </>
                  )}
                  {selectedId === "sub" && (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="/images/women/women_sub.png"
                          alt="sub info"
                          className="mb-3 w-[150px]"
                        />
                      </div>
                      <p className="text-[14px]">
                        You should take a diagonal pinch at a 45-degree angle, 1
                        to 2 cm below the bottom point of the shoulder blade.
                      </p>
                    </>
                  )}
                  {selectedId === "sup" && (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="/images/women/women_sup.png"
                          alt="sup info"
                          className="mb-3 w-[150px]"
                        />
                      </div>
                      <p className="text-[14px]">
                        You should take a diagonal pinch above the front
                        protrusion of the hip bone, slightly toward the front
                        from the side of the waist.
                      </p>
                    </>
                  )}
                  {selectedId === "mid" && (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="/images/women/women_mid.png"
                          alt="mid info"
                          className="mb-3 w-[150px]"
                        />
                      </div>
                      <p className="text-[14px]">
                        Raise your arm and take a vertical pinch just below
                        nipple level on the midaxillary line that goes downward
                        from the center of the armpit.
                      </p>
                    </>
                  )}
                  {selectedId === "bicep" && (
                    <>
                      <div className="flex justify-center">
                        {/* <img src="/images/women/women_bi.png" alt="bicep info" className="mb-3 w-[150px]" /> */}
                      </div>
                      <p className="text-[14px]">Description not available.</p>
                    </>
                  )}
                  {selectedId === "back" && (
                    <>
                      <div className="flex justify-center">
                        {/* <img src="/images/women/arms.png" alt="back info" className="mb-3 w-[150px]" /> */}
                      </div>
                      <p className="text-[14px]">Description not available.</p>
                    </>
                  )}
                  {selectedId === "calf" && (
                    <>
                      <div className="flex justify-center">
                        {/* <img src="/images/women/arms.png" alt="calf info" className="mb-3 w-[150px]" /> */}
                      </div>
                      <p className="text-[14px]">Description not available.</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* 🪟 Modal */}
          {showModal2 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center ">
                  <h2 className="text-blue-700 font-bold text-lg text-center">
                    {title}
                  </h2>
                  <button onClick={handleCloseModal2} className="text-xl">
                    ×
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  {description}
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    onClick={handleCloseModal2}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          )}

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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="col-12">
                        {formData?.tech_method == 1 ||
                        formData?.tech_calculator_type == "simple" ? (
                          <div className="col-lg-12 mx-auto">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-12 md:col-span-6 ">
                                <div className="bg-sky text-center bordered rounded-lg p-3 ">
                                  <p>
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "body_fat"
                                        ]
                                      }
                                    </strong>
                                  </p>
                                  <p className="text-[32px]">
                                    <strong className="text-light-green">
                                      {result?.tech_army}%
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-12 md:col-span-6  ">
                                <div className="bg-sky text-center bordered rounded-lg p-3 ">
                                  <p>
                                    <strong>
                                      Your Body Fat in{" "}
                                      {result?.tech_fat_weight_unit}
                                    </strong>
                                  </p>
                                  <p className="text-[32px]">
                                    <strong className="text-light-green">
                                      {Number(result?.tech_fat_weight).toFixed(
                                        2
                                      )}{" "}
                                      {result?.tech_fat_weight_unit}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <p className="text-[12px] col-span-12 text-center font_w my-2">
                                Note: It is generally recommended to maintain a
                                body fat level of 15% or lower for men and 25%
                                or lower for women.
                              </p>
                            </div>
                            <div className="border rounded-lg mt-3 statistics">
                              <div className="row text-center ">
                                <p className="text-[14px] py-2 font_w  bg-[#2845F5] text-white br-top ">
                                  1) American Council on Exercise (Male, Body
                                  Fat 59%)
                                </p>
                              </div>
                              <div className="col-12">
                                <table
                                  className="table new_table font-s-14"
                                  cellspacing="0"
                                >
                                  <tbody>
                                    <tr className="bg-gray ">
                                      <td className="p-2 fw-bold">Category</td>
                                      <td className="p-2 fw-bold">Body Fat</td>
                                      <td className="p-2 fw-bold">Weight</td>
                                    </tr>
                                    <tr className="click_me { (result?.tech_army ?? 0) >= 2 && (result?.tech_army < 6) ? 'first_c' : '' }">
                                      <td className="p-2">Essential</td>
                                      <td className="p-2">2 to 5.9 %</td>
                                      <td className="p-2">67 to 70 lb</td>
                                    </tr>
                                    <tr className="click_me { (result?.tech_army ?? 0) >= 6 && (result?.tech_army < 14) ? 'second_c' : '' }">
                                      <td className="p-2">Athletes</td>
                                      <td className="p-2">6 to 13.9 %</td>
                                      <td className="p-2">70 to 76 lb</td>
                                    </tr>
                                    <tr className="click_me { (result?.tech_army ?? 0) >= 14 && (result?.tech_army < 18) ? 'third_c' : '' }">
                                      <td className="p-2">Fitness</td>
                                      <td className="p-2">14 to 17.9 %</td>
                                      <td className="p-2">76 to 80 lb</td>
                                    </tr>
                                    <tr className="click_me { (result?.tech_army ?? 0) >= 18 && (result?.tech_army < 25) ? 'fourth_c' : '' }">
                                      <td className="p-2">Acceptable</td>
                                      <td className="p-2">18 to 24.9 %</td>
                                      <td className="p-2">80 to 87 lb</td>
                                    </tr>
                                    <tr className="click_me { (result?.tech_army ?? 0) >= 25 ? 'fifth_c' : '' }">
                                      <td className="p-2">Obese</td>
                                      <td className="p-2">25 % and over</td>
                                      <td className="p-2">87 lb and over</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="bordered rounded-[10px] mt-3 statistics">
                              <div className="row text-center">
                                <p className="text-[14px] py-2 font_w bg-[#2845F5] text-white br-top">
                                  2) WHO/NIH Guidelines, Gallagher et al. (Male
                                  20 to 39 yrs, Body Fat 59 %)
                                </p>
                              </div>

                              <div className="col-12">
                                <table
                                  className="table new_table text-[14px]"
                                  cellSpacing="0"
                                >
                                  <tbody>
                                    <tr className="bg-gray">
                                      <td className="p-2 font-bold">
                                        Category
                                      </td>
                                      <td className="p-2 font-bold">
                                        Body Fat
                                      </td>
                                      <td className="p-2 font-bold">Weight</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_army ?? 0) < 8
                                          ? "second_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Underfat</td>
                                      <td className="p-2">under 8 %</td>
                                      <td className="p-2">under 71 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_army ?? 0) >= 8 &&
                                        result?.tech_army < 20
                                          ? "third_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Healthy</td>
                                      <td className="p-2">8 to 19.9 %</td>
                                      <td className="p-2">71 to 82 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_army ?? 0) >= 20 &&
                                        result?.tech_army < 25
                                          ? "fourth_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Overfat</td>
                                      <td className="p-2">20 to 24.9 %</td>
                                      <td className="p-2">82 to 87 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_army ?? 0) >= 25
                                          ? "fifth_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Obese</td>
                                      <td className="p-2">25 % and over</td>
                                      <td className="p-2">87 lb and over</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="border rounded-[10px] mt-3 statistics">
                              <div className="row text-center">
                                <p className="text-[14px] py-2 font_w bg-[#2845F5] text-white br-top">
                                  3) American College of Sports Medicine* (Male
                                  20 to 29 yrs, Body Fat 59%)
                                </p>
                              </div>

                              <div className="col-12">
                                <table
                                  className="table new_table text-[14px]"
                                  cellSpacing="0"
                                >
                                  <tbody>
                                    <tr className="bg-gray">
                                      <td className="p-2 font-bold">
                                        Category
                                      </td>
                                      <td className="p-2 font-bold">
                                        Body Fat
                                      </td>
                                      <td className="p-2 font-bold">Weight</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        result?.tech_army >= 4.2 &&
                                        result?.tech_army <= 7.8
                                          ? "first_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Very Lean</td>
                                      <td className="p-2">4.2 to 7.8 %</td>
                                      <td className="p-2">68 to 71 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        result?.tech_army >= 7.9 &&
                                        result?.tech_army <= 11.4
                                          ? "second_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Excellent</td>
                                      <td className="p-2">7.9 to 11.4 %</td>
                                      <td className="p-2">71 to 74 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        result?.tech_army >= 11.5 &&
                                        result?.tech_army <= 15.7
                                          ? "third_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Good</td>
                                      <td className="p-2">11.5 to 15.7 %</td>
                                      <td className="p-2">74 to 78 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        result?.tech_army >= 15.8 &&
                                        result?.tech_army <= 19.6
                                          ? "fourth_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Fair</td>
                                      <td className="p-2">15.8 to 19.6 %</td>
                                      <td className="p-2">78 to 82 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        result?.tech_army >= 19.7 &&
                                        result?.tech_army <= 24.8
                                          ? "fifth_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Poor</td>
                                      <td className="p-2">19.7 to 24.8 %</td>
                                      <td className="p-2">82 to 87 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        result?.tech_army >= 24.9
                                          ? "fifth_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Very Poor</td>
                                      <td className="p-2">24.9 % and over</td>
                                      <td className="p-2">87 lb and over</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="row bg-gradient rounded-lg hidden">
                              <p
                                className=" text-center text-white p-2"
                                colspan="2"
                              >
                                {data?.payload?.tech_lang_keys["13"]}
                              </p>
                            </div>
                            <div className="col-12 overflow-auto mt-2 table-wrapper hidden">
                              <table
                                className="col-12 table-border rounded-[10px]"
                                cellSpacing="0"
                              >
                                <thead className="mb-2">
                                  {/* Table Head (agar zarurat ho to yahan content daal sakte ho) */}
                                </thead>
                                <tbody className="top-table">
                                  <tr>
                                    <td className="px-3 py-2">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "fat_mass"
                                        ]
                                      }
                                    </td>
                                    <td className="text-center px-3 py-2">
                                      <strong className="text-blue">
                                        {result?.tech_fat_mass} kg
                                      </strong>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="px-3 py-2">
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "lean_mass"
                                        ]
                                      }
                                    </td>
                                    <td className="text-center px-3 py-2">
                                      <strong className="text-blue">
                                        {result?.tech_lean_mass} kg
                                      </strong>
                                    </td>
                                  </tr>

                                  {/* Hidden Row (conditionally render if needed) */}
                                  <tr className="hidden">
                                    <td className="px-3 py-2">
                                      {data?.payload?.tech_lang_keys["child"]}
                                    </td>
                                    <td className="text-center px-3 py-2">
                                      <strong className="text-blue">
                                        {result?.tech_child_body_fat} %
                                      </strong>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="px-3 py-2">
                                      {data?.payload?.tech_lang_keys["adult"]}
                                    </td>
                                    <td className="text-center px-3 py-2">
                                      <strong className="text-blue">
                                        {result?.tech_adult_body_fat} %
                                      </strong>
                                    </td>
                                  </tr>

                                  {/* Conditionally render BAI row only if gender === 'Female' */}
                                  {formData?.tech_gender === "Female" && (
                                    <tr>
                                      <td className="px-3 py-2">
                                        {data?.payload?.tech_lang_keys["bai"]}
                                      </td>
                                      <td className="text-center px-3 py-2">
                                        <strong className="text-blue">
                                          {result?.tech_BAI} %
                                        </strong>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div
                              className="col-md-10 relative mx-auto"
                              style={{ top: "-12px" }}
                            >
                              <div className="flex flex-col sm:flex-row text-center text-sm hidden">
                                <div
                                  className={`col blue px-2 py-1 rounded-sm rounded-l-lg ${
                                    result?.tech_Essential ? "scale-up" : ""
                                  }`}
                                >
                                  <p className="text-white">
                                    {data?.payload?.tech_lang_keys["1"]}
                                  </p>
                                  <span className="text-white">
                                    {formData?.tech_gender === "Female"
                                      ? "10-13 %"
                                      : "2-5 %"}
                                  </span>
                                </div>

                                <div
                                  className={`col teal text-white rounded-sm px-2 py-1 mt-1 sm:mt-0 ${
                                    result?.tech_Athletes ? "scale-up" : ""
                                  }`}
                                >
                                  <p className="text-white">
                                    {data?.payload?.tech_lang_keys["2"]}
                                  </p>
                                  <span className="text-white">
                                    {formData?.tech_gender === "Female"
                                      ? "14-20 %"
                                      : "6-13 %"}
                                  </span>
                                </div>

                                <div
                                  className={`col green text-white rounded-sm px-2 py-1 mt-1 sm:mt-0 ${
                                    result?.tech_Fitness ? "scale-up" : ""
                                  }`}
                                >
                                  <p className="text-white">
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </p>
                                  <span className="text-white">
                                    {formData?.tech_gender === "Female"
                                      ? "21-24 %"
                                      : "14-17 %"}
                                  </span>
                                </div>

                                <div
                                  className={`col yellow text-white rounded-sm px-2 py-1 mt-1 sm:mt-0 ${
                                    result?.tech_Average ? "scale-up" : ""
                                  }`}
                                >
                                  <p className="text-white">
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </p>
                                  <span className="text-white">
                                    {formData?.tech_gender === "Female"
                                      ? "25-31 %"
                                      : "18-25 %"}
                                  </span>
                                </div>

                                <div
                                  className={`col red text-white rounded-sm px-2 py-1 mt-1 sm:mt-0 rounded-r-lg ${
                                    result?.tech_Obese ? "scale-up" : ""
                                  }`}
                                >
                                  <p className="text-white">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </p>
                                  <span className="text-white">
                                    {formData?.tech_gender === "Female"
                                      ? "31+ %"
                                      : "25+ %"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="row hidden">
                              <div className="col-lg-3 p-2">
                                <div className="bg-sky text-center bordered rounded-lg px-3 py-2">
                                  <p className="font-s-12">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["6"]}
                                    </strong>
                                  </p>
                                  <p>
                                    <strong className="text-blue">
                                      {result?.tech_army}%
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-3 p-2">
                                <div className="bg-sky text-center bordered rounded-lg px-3 py-2">
                                  <p className="font-s-12">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["7"]}
                                    </strong>
                                  </p>
                                  <p>
                                    <strong className="text-blue">
                                      {result?.tech_body_fat}%
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-3 p-2">
                                <div className="bg-sky text-center bordered rounded-lg px-3 py-2">
                                  <p className="font-s-12">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["8"]}
                                    </strong>
                                  </p>
                                  <p>
                                    <strong className="text-blue">
                                      {result?.tech_army}%
                                    </strong>
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-3 p-2">
                                <div className="bg-sky text-center bordered rounded-lg px-3 py-2">
                                  <p className="font-s-12">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["9"]}
                                    </strong>
                                  </p>
                                  <p>
                                    <strong className="text-blue">
                                      {result?.tech_ymca}%
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="col-lg-12 mx-auto">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-12 md:col-span-6">
                                <div className="bg-sky text-center bordered rounded-lg p-3 ">
                                  <p>
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "body_fat"
                                        ]
                                      }
                                    </strong>
                                  </p>
                                  <p className="text-[32px]">
                                    <strong className="text-light-green">
                                      {result?.tech_body_fat}%
                                    </strong>
                                  </p>
                                </div>
                              </div>

                              <div className="col-span-12 md:col-span-6">
                                <div className="bg-sky text-center bordered rounded-lg p-3 ">
                                  <p>
                                    <strong>
                                      Your Body Fat in{" "}
                                      {result?.tech_fat_weight_unit}
                                    </strong>
                                  </p>
                                  <p className="text-[32px]">
                                    <strong className="text-light-green">
                                      {Number(result?.tech_fat_weight).toFixed(
                                        2
                                      )}{" "}
                                      {result?.tech_fat_weight_unit}
                                    </strong>
                                  </p>
                                </div>
                              </div>

                              <p className="text-[12px] col-span-12 text-center font_w my-2">
                                Note: It is generally recommended to maintain a
                                body fat level of 15% or lower for men and 25%
                                or lower for women.
                              </p>
                            </div>
                            <div className="row bg-[#2845F5] text-white rounded-lg">
                              <p className="text-center  p-2" colSpan={2}>
                                {data?.payload?.tech_lang_keys?.secoun_table_h
                                  ? data.payload.tech_lang_keys.secoun_table_h
                                  : "Body Fat Percentage Ranges"}
                              </p>
                            </div>

                            <div className="col-12 overflow-auto mt-2 table-wrapper">
                              <table className="col-12" cellSpacing="0">
                                <tbody className="">
                                  <tr>
                                    <th className="text-start border-b p-2">
                                      {data?.payload?.tech_lang_keys["10"]}
                                    </th>
                                    <th className="text-start border-b p-2">
                                      {data?.payload?.tech_lang_keys["11"]}
                                    </th>
                                    <th className="text-start border-b p-2">
                                      {data?.payload?.tech_lang_keys["12"]}
                                    </th>
                                  </tr>

                                  <tr
                                    className={` ${
                                      result?.tech_Essential ?? ""
                                    }`}
                                  >
                                    <td className="border-b p-2">
                                      {data?.payload?.tech_lang_keys["1"]}
                                    </td>
                                    <td className="border-b p-2">10-13 %</td>
                                    <td className="border-b p-2">2-5 %</td>
                                  </tr>

                                  <tr
                                    className={` ${
                                      result?.tech_Athletes ?? ""
                                    }`}
                                  >
                                    <td className="border-b p-2">
                                      {data?.payload?.tech_lang_keys["2"]}
                                    </td>
                                    <td className="border-b p-2">14-20 %</td>
                                    <td className="border-b p-2">6-13 %</td>
                                  </tr>

                                  <tr
                                    className={` ${result?.tech_Fitness ?? ""}`}
                                  >
                                    <td className="border-b p-2">
                                      {data?.payload?.tech_lang_keys["3"]}
                                    </td>
                                    <td className="border-b p-2">21-24 %</td>
                                    <td className="border-b p-2">14-17 %</td>
                                  </tr>

                                  <tr
                                    className={` ${result?.tech_Average ?? ""}`}
                                  >
                                    <td className="border-b p-2">
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </td>
                                    <td className="border-b p-2">25-31 %</td>
                                    <td className="border-b p-2">18-25 %</td>
                                  </tr>

                                  <tr
                                    className={` ${result?.tech_Obese ?? ""}`}
                                  >
                                    <td className="p-2">
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </td>
                                    <td className="p-2">31+ %</td>
                                    <td className="p-2">25+ %</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className=" rounded-lg mt-3 statistics">
                              <div className="row text-center ">
                                <p className="text-[14px] py-2 font_w  bg-[#2845F5] text-white br-top ">
                                  1) American Council on Exercise (Male, Body
                                  Fat 59%)
                                </p>
                              </div>
                              <div className="col-12">
                                <table
                                  className="table new_table text-sm w-full"
                                  cellSpacing="0"
                                >
                                  <tbody>
                                    <tr className="bg-gray">
                                      <td className="p-2 font-bold">
                                        Category
                                      </td>
                                      <td className="p-2 font-bold">
                                        Body Fat
                                      </td>
                                      <td className="p-2 font-bold">Weight</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_body_fat ?? 0) >= 2 &&
                                        result?.tech_body_fat < 6
                                          ? "first_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Essential</td>
                                      <td className="p-2">2 to 5.9 %</td>
                                      <td className="p-2">67 to 70 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_body_fat ?? 0) >= 6 &&
                                        result?.tech_body_fat < 14
                                          ? "second_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Athletes</td>
                                      <td className="p-2">6 to 13.9 %</td>
                                      <td className="p-2">70 to 76 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_body_fat ?? 0) >= 14 &&
                                        result?.tech_body_fat < 18
                                          ? "third_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Fitness</td>
                                      <td className="p-2">14 to 17.9 %</td>
                                      <td className="p-2">76 to 80 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_body_fat ?? 0) >= 18 &&
                                        result?.tech_body_fat < 25
                                          ? "fourth_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Acceptable</td>
                                      <td className="p-2">18 to 24.9 %</td>
                                      <td className="p-2">80 to 87 lb</td>
                                    </tr>

                                    <tr
                                      className={`click_me ${
                                        (result?.tech_body_fat ?? 0) >= 25
                                          ? "fifth_c"
                                          : ""
                                      }`}
                                    >
                                      <td className="p-2">Obese</td>
                                      <td className="p-2">25 % and over</td>
                                      <td className="p-2">87 lb and over</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="bordered rounded-[10px] mt-3 statistics">
                                <div className="row text-center">
                                  <p className="text-[14px] py-2 font_w bg-[#2845F5] text-white br-top">
                                    2) WHO/NIH Guidelines, Gallagher et al.
                                    (Male 20 to 39 yrs, Body Fat 59 %)
                                  </p>
                                </div>

                                <div className="col-12">
                                  <table
                                    className="table new_table text-sm w-full"
                                    cellSpacing="0"
                                  >
                                    <tbody>
                                      <tr className="bg-gray">
                                        <td className="p-2 font-bold">
                                          Category
                                        </td>
                                        <td className="p-2 font-bold">
                                          Body Fat
                                        </td>
                                        <td className="p-2 font-bold">
                                          Weight
                                        </td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          (result?.tech_body_fat ?? 0) < 8
                                            ? "second_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Underfat</td>
                                        <td className="p-2">under 8 %</td>
                                        <td className="p-2">under 71 lb</td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          (result?.tech_body_fat ?? 0) >= 8 &&
                                          result?.tech_body_fat < 20
                                            ? "third_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Healthy</td>
                                        <td className="p-2">8 to 19.9 %</td>
                                        <td className="p-2">71 to 82 lb</td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          (result?.tech_body_fat ?? 0) >= 20 &&
                                          result?.tech_body_fat < 25
                                            ? "fourth_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Overfat</td>
                                        <td className="p-2">20 to 24.9 %</td>
                                        <td className="p-2">82 to 87 lb</td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          (result?.tech_body_fat ?? 0) >= 25
                                            ? "fifth_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Obese</td>
                                        <td className="p-2">25 % and over</td>
                                        <td className="p-2">87 lb and over</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="bordered rounded-[10px] mt-3 statistics">
                                <div className="row text-center">
                                  <p className="text-[14px] py-2 font_w bg-[#2845F5] text-white br-top">
                                    3) American College of Sports Medicine*
                                    (Male 20 to 29 yrs, Body Fat 59%)
                                  </p>
                                </div>

                                <div className="col-12">
                                  <table
                                    className="table new_table text-sm w-full"
                                    cellSpacing="0"
                                  >
                                    <tbody>
                                      <tr className="bg-gray">
                                        <td className="p-2 font-bold">
                                          Category
                                        </td>
                                        <td className="p-2 font-bold">
                                          Body Fat
                                        </td>
                                        <td className="p-2 font-bold">
                                          Weight
                                        </td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          result?.tech_body_fat >= 4.2 &&
                                          result?.tech_body_fat <= 7.8
                                            ? "first_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Very Lean</td>
                                        <td className="p-2">4.2 to 7.8 %</td>
                                        <td className="p-2">68 to 71 lb</td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          result?.tech_body_fat >= 7.9 &&
                                          result?.tech_body_fat <= 11.4
                                            ? "second_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Excellent</td>
                                        <td className="p-2">7.9 to 11.4 %</td>
                                        <td className="p-2">71 to 74 lb</td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          result?.tech_body_fat >= 11.5 &&
                                          result?.tech_body_fat <= 15.7
                                            ? "third_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Good</td>
                                        <td className="p-2">11.5 to 15.7 %</td>
                                        <td className="p-2">74 to 78 lb</td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          result?.tech_body_fat >= 15.8 &&
                                          result?.tech_body_fat <= 19.6
                                            ? "fourth_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Fair</td>
                                        <td className="p-2">15.8 to 19.6 %</td>
                                        <td className="p-2">78 to 82 lb</td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          result?.tech_body_fat >= 19.7 &&
                                          result?.tech_body_fat <= 24.8
                                            ? "fifth_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Poor</td>
                                        <td className="p-2">19.7 to 24.8 %</td>
                                        <td className="p-2">82 to 87 lb</td>
                                      </tr>

                                      <tr
                                        className={`click_me ${
                                          result?.tech_body_fat >= 24.9
                                            ? "fifth_c"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-2">Very Poor</td>
                                        <td className="p-2">24.9 % and over</td>
                                        <td className="p-2">87 lb and over</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="col-md-10 relative mx-auto mt-5">
                                <div className="flex flex-col md:flex-row text-center text-sm hidden">
                                  <div
                                    className={`col blue px-2 py-1 radius-sm-10 radius-l-10 ${
                                      result?.tech_Essential ? "scale-up" : ""
                                    }`}
                                  >
                                    <p className="text-white">
                                      {data?.payload?.tech_lang_keys["1"]}
                                    </p>
                                    <span className="text-white">
                                      {formData?.tech_gender === "Female"
                                        ? "10-13 %"
                                        : "2-5 %"}
                                    </span>
                                  </div>

                                  <div
                                    className={`col teal text-white radius-sm-10 px-2 py-1 mt-1 md:mt-0 ${
                                      result?.tech_Athletes ? "scale-up" : ""
                                    }`}
                                  >
                                    <p className="text-white">
                                      {data?.payload?.tech_lang_keys["2"]}
                                    </p>
                                    <span className="text-white">
                                      {formData?.tech_gender === "Female"
                                        ? "14-20 %"
                                        : "6-13 %"}
                                    </span>
                                  </div>

                                  <div
                                    className={`col green text-white radius-sm-10 px-2 py-1 mt-1 md:mt-0 ${
                                      result?.tech_Fitness ? "scale-up" : ""
                                    }`}
                                  >
                                    <p className="text-white">
                                      {data?.payload?.tech_lang_keys["3"]}
                                    </p>
                                    <span className="text-white">
                                      {formData?.tech_gender === "Female"
                                        ? "21-24 %"
                                        : "14-17 %"}
                                    </span>
                                  </div>

                                  <div
                                    className={`col yellow text-white radius-sm-10 px-2 py-1 mt-1 md:mt-0 ${
                                      result?.tech_Average ? "scale-up" : ""
                                    }`}
                                  >
                                    <p className="text-white">
                                      {data?.payload?.tech_lang_keys["4"]}
                                    </p>
                                    <span className="text-white">
                                      {formData?.tech_gender === "Female"
                                        ? "25-31 %"
                                        : "18-25 %"}
                                    </span>
                                  </div>

                                  <div
                                    className={`col red text-white radius-sm-10 px-2 py-1 mt-1 md:mt-0 radius-r-10 ${
                                      result?.tech_Obese ? "scale-up" : ""
                                    }`}
                                  >
                                    <p className="text-white">
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </p>
                                    <span className="text-white">
                                      {formData?.tech_gender === "Female"
                                        ? "31+ %"
                                        : "25+ %"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="row hidden">
                                <div className="col-lg-6 p-2">
                                  <div className="bg-sky text-center bordered rounded-lg px-3 py-2">
                                    <p>
                                      <strong>
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "fat_mass"
                                          ]
                                        }
                                      </strong>
                                    </p>
                                    <p>
                                      <strong className="text-green">
                                        {result?.tech_body_fat_w}
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-lg-6 p-2">
                                  <div className="bg-sky text-center bordered rounded-lg px-3 py-2">
                                    <p>
                                      <strong>
                                        {
                                          data?.payload?.tech_lang_keys[
                                            "lean_mass"
                                          ]
                                        }
                                      </strong>
                                    </p>
                                    <p>
                                      <strong className="text-green">
                                        {result?.tech_lbm}
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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

export default BodyFatCalculator;
