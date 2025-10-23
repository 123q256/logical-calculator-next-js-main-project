"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWeightWatchersPointsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WeightWatchersPointsCalculator = () => {
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
    tech_selection: "4",
    tech_fe: 50,
    tech_fe_unit: "cal",
    tech_sf: 100,
    tech_sf_unit: "g",
    tech_sgr: 100,
    tech_sgr_unit: "g",
    tech_ptn: 150,
    tech_ptn_unit: "g",
    tech_ptn2: 150,
    tech_ptn2_unit: "g",
    tech_carbo: 150,
    tech_carbo_unit: "g",
    tech_fat: 150,
    tech_fat_unit: "g",
    tech_fiber: 150,
    tech_fiber_unit: "g",
    tech_call2: 56,
    tech_call2_unit: "cal",
    tech_fat2: 150,
    tech_fat2_unit: "g",
    tech_fiber2: 150,
    tech_fiber2_unit: "g",
    tech_weight: 565,
    tech_weight_unit: "kg",
    tech_height: 565,
    tech_height_unit: "cm",
    tech_age: 23,
    tech_gender: "female",
    tech_activity: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWeightWatchersPointsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_selection == 1) {
      if (
        !formData.tech_selection ||
        !formData.tech_fe ||
        !formData.tech_fe_unit ||
        !formData.tech_sf ||
        !formData.tech_sf_unit ||
        !formData.tech_sgr ||
        !formData.tech_sgr_unit ||
        !formData.tech_ptn ||
        !formData.tech_ptn_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_selection == 2) {
      if (
        !formData.tech_selection ||
        !formData.tech_ptn2 ||
        !formData.tech_ptn2_unit ||
        !formData.tech_carbo ||
        !formData.tech_carbo_unit ||
        !formData.tech_fat ||
        !formData.tech_fat_unit ||
        !formData.tech_fiber ||
        !formData.tech_fiber_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else if (formData.tech_selection == 3) {
      if (
        !formData.tech_selection ||
        !formData.tech_call2 ||
        !formData.tech_call2_unit ||
        !formData.tech_fat2 ||
        !formData.tech_fat2_unit ||
        !formData.tech_fiber2 ||
        !formData.tech_fiber2_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_selection ||
        !formData.tech_weight ||
        !formData.tech_weight_unit ||
        !formData.tech_height ||
        !formData.tech_height_unit ||
        !formData.tech_age ||
        !formData.tech_gender ||
        !formData.tech_activity
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_fe: formData.tech_fe,
        tech_fe_unit: formData.tech_fe_unit,
        tech_sf: formData.tech_sf,
        tech_sf_unit: formData.tech_sf_unit,
        tech_sgr: formData.tech_sgr,
        tech_sgr_unit: formData.tech_sgr_unit,
        tech_ptn: formData.tech_ptn,
        tech_ptn_unit: formData.tech_ptn_unit,
        tech_ptn2: formData.tech_ptn2,
        tech_ptn2_unit: formData.tech_ptn2_unit,
        tech_carbo: formData.tech_carbo,
        tech_carbo_unit: formData.tech_carbo_unit,
        tech_fat: formData.tech_fat,
        tech_fat_unit: formData.tech_fat_unit,
        tech_fiber: formData.tech_fiber,
        tech_fiber_unit: formData.tech_fiber_unit,
        tech_call2: formData.tech_call2,
        tech_call2_unit: formData.tech_call2_unit,
        tech_fat2: formData.tech_fat2,
        tech_fat2_unit: formData.tech_fat2_unit,
        tech_fiber2: formData.tech_fiber2,
        tech_fiber2_unit: formData.tech_fiber2_unit,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
        tech_age: formData.tech_age,
        tech_gender: formData.tech_gender,
        tech_activity: formData.tech_activity,
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
      tech_selection: "4",
      tech_fe: 50,
      tech_fe_unit: "cal",
      tech_sf: 100,
      tech_sf_unit: "g",
      tech_sgr: 100,
      tech_sgr_unit: "g",
      tech_ptn: 150,
      tech_ptn_unit: "g",
      tech_ptn2: 150,
      tech_ptn2_unit: "g",
      tech_carbo: 150,
      tech_carbo_unit: "g",
      tech_fat: 150,
      tech_fat_unit: "g",
      tech_fiber: 150,
      tech_fiber_unit: "g",
      tech_call2: 56,
      tech_call2_unit: "cal",
      tech_fat2: 150,
      tech_fat2_unit: "g",
      tech_fiber2: 150,
      tech_fiber2_unit: "g",
      tech_weight: 565,
      tech_weight_unit: "kg",
      tech_height: 565,
      tech_height_unit: "cm",
      tech_age: 23,
      tech_gender: "female",
      tech_activity: "4",
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

  //dropdown states 0
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fe_unit: unit }));
    setDropdownVisible(false);
  };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sf_unit: unit }));
    setDropdownVisible1(false);
  };
  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sgr_unit: unit }));
    setDropdownVisible2(false);
  };
  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 3
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ptn_unit: unit }));
    setDropdownVisible3(false);
  };
  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states 4
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ptn2_unit: unit }));
    setDropdownVisible4(false);
  };
  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states 5
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_carbo_unit: unit }));
    setDropdownVisible5(false);
  };
  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states 6
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fat_unit: unit }));
    setDropdownVisible6(false);
  };
  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states 7
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fiber_unit: unit }));
    setDropdownVisible7(false);
  };
  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states 8
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_call2_unit: unit }));
    setDropdownVisible8(false);
  };
  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states 9
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fat2_unit: unit }));
    setDropdownVisible9(false);
  };
  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };

  //dropdown states 10
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fiber2_unit: unit }));
    setDropdownVisible10(false);
  };
  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };

  //dropdown states 11
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
    setDropdownVisible11(false);
  };
  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };

  //dropdown states 12
  const [dropdownVisible12, setDropdownVisible12] = useState(false);

  const setUnitHandler12 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
    setDropdownVisible12(false);
  };
  const toggleDropdown12 = () => {
    setDropdownVisible12(!dropdownVisible12);
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
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_selection" className="label">
                      {data?.payload?.tech_lang_keys["20"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_selection"
                        id="tech_selection"
                        value={formData.tech_selection}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["21"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["22"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["23"]}{" "}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["24"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {formData.tech_selection == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_fe" className="label">
                      {data?.payload?.tech_lang_keys["1"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fe"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_fe}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_fe_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "calories (cal)", value: "cal" },
                            { label: "kilojoules (kJ)", value: "kJ" },
                            { label: "joules (J)", value: "J" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_sf" className="label">
                      {data?.payload?.tech_lang_keys["2"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_sf"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_sf}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_sf_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_sgr" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_sgr"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_sgr}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_sgr_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_ptn" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ptn"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ptn}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_ptn_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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
                </>
              )}

              {formData.tech_selection == "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_ptn2" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ptn2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ptn2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_ptn2_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_carbo" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_carbo"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_carbo}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_carbo_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_fat" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fat"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_fat}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_fat_unit} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_fiber" className="label">
                      {data?.payload?.tech_lang_keys["19"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fiber"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_fiber}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown7}
                      >
                        {formData.tech_fiber_unit} ▾
                      </label>
                      {dropdownVisible7 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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

              {formData.tech_selection == "3" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_call2" className="label">
                      {data?.payload?.tech_lang_keys["1"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_call2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_call2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown8}
                      >
                        {formData.tech_call2_unit} ▾
                      </label>
                      {dropdownVisible8 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "calories (cal)", value: "cal" },
                            { label: "kilojoules (kJ)", value: "kJ" },
                            { label: "joules (J)", value: "J" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_fat2" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fat2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_fat2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown9}
                      >
                        {formData.tech_fat2_unit} ▾
                      </label>
                      {dropdownVisible9 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_fiber2" className="label">
                      {data?.payload?.tech_lang_keys["19"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fiber2"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_fiber2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown10}
                      >
                        {formData.tech_fiber2_unit} ▾
                      </label>
                      {dropdownVisible10 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "ounces (oz)", value: "oz" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "dr", value: "dr" },
                            { label: "gr", value: "gr" },
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

              {formData.tech_selection == "4" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_weight" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
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
                        onClick={toggleDropdown11}
                      >
                        {formData.tech_weight_unit} ▾
                      </label>
                      {dropdownVisible11 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "pounds (lbs)", value: "lbs" },
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_height" className="label">
                      {data?.payload?.tech_lang_keys["8"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown12}
                      >
                        {formData.tech_height_unit} ▾
                      </label>
                      {dropdownVisible12 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "inches (in)", value: "in" },
                            { label: "centimeters (cm)", value: "cm" },
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

                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["9"]} (
                      {data?.payload?.tech_lang_keys["10"]}):
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_gender" className="label">
                      {data?.payload?.tech_lang_keys["13"]}:
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
                        <option value="female">
                          {data?.payload?.tech_lang_keys["11"]}
                        </option>
                        <option value="male">
                          {data?.payload?.tech_lang_keys["12"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_activity" className="label">
                      {data?.payload?.tech_lang_keys["14"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_activity"
                        id="tech_activity"
                        value={formData.tech_activity}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["15"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["16"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["17"]}{" "}
                        </option>
                        <option value="4">
                          {data?.payload?.tech_lang_keys["18"]}{" "}
                        </option>
                      </select>
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
                      <div className="w-full  text-center">
                        <p>
                          <strong>
                            {result?.tech_method == "4"
                              ? "Your daily target is"
                              : ""}
                          </strong>
                        </p>
                        <div className="flex justify-center">
                          <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                            <strong className="">
                              {Number(result?.tech_ans).toFixed(2)}
                            </strong>
                            <span className="text-[25px]">
                              {result?.tech_method == 3 ? "Older" : ""} Points{" "}
                              {result?.tech_method == 4 ? "per day" : ""}
                            </span>
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

export default WeightWatchersPointsCalculator;
