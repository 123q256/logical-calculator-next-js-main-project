"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useTireSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import "../../../../components/styles/CssOrderOfOperationsCalculator.css";
const TireSizeCalculator = () => {
 
      const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  
  let url = "";
  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
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
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    // Browser-only: set currentPath
    setCurrentPath(window.location.pathname);
  }, []);
  const [formData, setFormData] = useState({
    compare_with_another_tire: "no",
    // dingle
    width:2250,
    width_unit:"mm" ,
    profile_ratio:65 ,//%
    tire_construction:"radial" ,
    wheel_diameter:17,
    wheel_diameter_unit:"in" ,
    // compare two tire

    width_one: 2250,
    width_one_unit: "mm",
    profile_ratio_one: 65,
    tire_construction_one: "radial",
    wheel_diameter_one: 17,
    wheel_diameter_one_unit: "in",
      
    width_two: 245,
    width_two_unit: "mm",
    profile_ratio_two: 70,
    tire_construction_two: "radial",
    wheel_diameter_two: 17,
    wheel_diameter_two_unit: "in",
    speedometer_reading: 100,
    speedometer_reading_unit: "km/h"


  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useTireSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.compare_with_another_tire) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await CatAgeCalculator({
          compare_with_another_tire:formData.compare_with_another_tire,
          width:formData.width,
          width_unit:formData.width_unit,
          profile_ratio:formData.profile_ratio,
          tire_construction:formData.tire_construction,
          wheel_diameter:formData.wheel_diameter,
          wheel_diameter_unit:formData.wheel_diameter_unit,
          width_one: formData.width_one,
          width_one_unit: formData.width_one_unit,
          profile_ratio_one: formData.profile_ratio_one,
          tire_construction_one: formData.tire_construction_one,
          wheel_diameter_one: formData.wheel_diameter_one,
          wheel_diameter_one_unit: formData.wheel_diameter_one_unit,
          width_two: formData.width_two,
          width_two_unit: formData.width_two_unit,
          profile_ratio_two: formData.profile_ratio_two,
          tire_construction_two: formData.tire_construction_two,
          wheel_diameter_two: formData.wheel_diameter_two,
          wheel_diameter_two_unit:formData.wheel_diameter_two_unit, 
          speedometer_reading: formData.speedometer_reading,
          speedometer_reading_unit: formData.speedometer_reading_unit,

      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
      
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      compare_with_another_tire: "no",
    // dingle
    width:2250,
    width_unit:"mm" ,
    profile_ratio:65 ,//%
    tire_construction:"radial" ,
    wheel_diameter:17,
    wheel_diameter_unit:"in" ,
    // compare two tire

    width_one: 2250,
    width_one_unit: "mm",
    profile_ratio_one: 65,
    tire_construction_one: "radial",
    wheel_diameter_one: 17,
    wheel_diameter_one_unit: "in",
      
    width_two: 245,
    width_two_unit: "mm",
    profile_ratio_two: 70,
    tire_construction_two: "radial",
    wheel_diameter_two: 17,
    wheel_diameter_two_unit: "in",
    speedometer_reading: 100,
    speedometer_reading_unit: "km/h"
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
  setFormData((prev) => ({ ...prev, width_unit: unit }));
  setDropdownVisible(false);
};

const toggleDropdown = () => {
  setDropdownVisible(!dropdownVisible);
};
//dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

const setUnitHandler1 = (unit) => {
  setFormData((prev) => ({ ...prev, wheel_diameter: unit }));
  setDropdownVisible1(false);
};

const toggleDropdown1 = () => {
  setDropdownVisible1(!dropdownVisible1);
};

// compare two

//dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

const setUnitHandler2 = (unit) => {
  setFormData((prev) => ({ ...prev, width_one_unit: unit }));
  setDropdownVisible2(false);
};

const toggleDropdown2 = () => {
  setDropdownVisible2(!dropdownVisible2);
};
//dropdown states 2
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

const setUnitHandler3 = (unit) => {
  setFormData((prev) => ({ ...prev, wheel_diameter_one_unit: unit }));
  setDropdownVisible3(false);
};

const toggleDropdown3 = () => {
  setDropdownVisible3(!dropdownVisible3);
};
//dropdown states 3
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

const setUnitHandler4 = (unit) => {
  setFormData((prev) => ({ ...prev, width_two_unit: unit }));
  setDropdownVisible4(false);
};

const toggleDropdown4 = () => {
  setDropdownVisible4(!dropdownVisible4);
};
//dropdown states 4
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

const setUnitHandler5 = (unit) => {
  setFormData((prev) => ({ ...prev, wheel_diameter_two_unit: unit }));
  setDropdownVisible5(false);
};

const toggleDropdown5 = () => {
  setDropdownVisible5(!dropdownVisible5);
};
//dropdown states 5
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

const setUnitHandler6 = (unit) => {
  setFormData((prev) => ({ ...prev, speedometer_reading_unit: unit }));
  setDropdownVisible6(false);
};

const toggleDropdown6 = () => {
  setDropdownVisible6(!dropdownVisible6);
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
              <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
                  <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
                    <input
                      type="hidden"
                      name="compare_with_another_tire"
                      id="calculator_time"
                      value={formData.compare_with_another_tire}
                    />
                    <div className="flex flex-wrap items-center bg-green-100 border border-blue-500 text-center rounded-lg px-1">
                      {/* Date Cal Tab */}
                      <div className="lg:w-1/2 w-full px-2 py-1">
                        <div
                          className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                            formData.compare_with_another_tire === "no" ? "tagsUnit" : ""
                          }`}
                          id="no"
                          onClick={() => {
                            setFormData({ ...formData, compare_with_another_tire: "no" });
                            setResult(null);
                            setFormError(null);
                          }}
                          
                        >
                          Single Tire
                        </div>
                      </div>
                      {/* Time Cal Tab */}
                      <div className="lg:w-1/2 w-full px-2 py-1">
                        <div
                          className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                            formData.compare_with_another_tire === "yes" ? "tagsUnit" : ""
                          }`}
                          id="yes"
                          onClick={() => {
                            setFormData({ ...formData, compare_with_another_tire: "yes" });
                            setResult(null);
                            setFormError(null);
                          }}
                        >
                           Compare Two Tires
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              {formData.compare_with_another_tire == "no" && (
                <>
                  <div className="lg:w-[80%] md:w-[65%] w-full mx-auto ">
                    <div className="grid grid-cols-12 gap-2 md:gap-3">

                       <div className="col-span-12 md:col-span-6 relative">
                        <label htmlFor="width" className="label" >
                           Width
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="width"
                              step="any"
                              className="mt-1 input"
                              value={formData.width}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown}
                            >
                              {formData.width_unit} ▾
                            </label>
                            {dropdownVisible && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                      { label: "mm", value: "mm" },
                                        { label: "cm", value: "cm" },
                                        { label: "in", value: "in" },
                                
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
                        <div className="col-span-12 md:col-span-6 relative">
                            <label htmlFor="profile_ratio" className="label">
                                  Profile Ratio
                            </label>
                            <div class=" relative">
                            <input
                                type="number"
                                name="profile_ratio"
                                id="profile_ratio"
                                className="input my-2"
                                placeholder=""
                                aria-label="input"
                                value={formData.profile_ratio}
                                onChange={handleChange}
                            />
                            <span className="text-blue input_unit">%</span>
                            </div>
                        </div>
                        <div className="col-span-12 flex flex-wrap gap-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tire_construction"
                            value="radial"
                            id="radial"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tire_construction === 'radial'}
                          />
                          <span>Radial (R)</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tire_construction"
                            value="bias_belt"
                            id="bias_belt"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tire_construction === 'bias_belt'}
                          />
                          <span>Bias belt (B)</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tire_construction"
                            value="diagonal"
                            id="diagonal"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tire_construction === 'diagonal'}
                          />
                          <span>Diagonal (D)</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tire_construction"
                            value="letter_not_present"
                            id="letter_not_present"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tire_construction === 'letter_not_present'}
                          />
                          <span>Letter not present</span>
                        </label>
                      </div>

                      
                        <div className="col-span-12 md:col-span-6 relative">
                            <label htmlFor="wheel_diameter" className="label" >
                            Weel Diameter
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="wheel_diameter"
                                step="any"
                                className="mt-1 input"
                                value={formData.wheel_diameter}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown1}
                              >
                                {formData.wheel_diameter_unit} ▾
                              </label>
                              {dropdownVisible1 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                        { label: "mm", value: "mm" },
                                          { label: "cm", value: "cm" },
                                          { label: "in", value: "in" },
                                  
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
                     
                    </div>
                  </div>
                </>
              )}

                 {formData.compare_with_another_tire == "yes" && (
                <>
                  <div className="lg:w-[80%] md:w-[65%] w-full mx-auto ">
                    <div className="grid grid-cols-12 gap-2 md:gap-3">

                      <div className="col-span-12">
                        <p className="text-xl  text-bold"> <strong>First tire </strong>  </p>
                      </div>

                      <div className="col-span-12 md:col-span-6 relative">
                      <label htmlFor="width_one" className="label" >
                          Width 
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="width_one"
                            step="any"
                            className="mt-1 input"
                            value={formData.width_one}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.width_one_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                    { label: "mm", value: "mm" },
                                      { label: "cm", value: "cm" },
                                      { label: "in", value: "in" },
                              
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
                      <div className="col-span-12 md:col-span-6 relative">
                          <label htmlFor="profile_ratio_one" className="label">
                                Profile Ratio 
                          </label>
                          <div class=" relative">
                          <input
                              type="number"
                              name="profile_ratio_one"
                              id="profile_ratio_one"
                              className="input my-2"
                              placeholder=""
                              aria-label="input"
                              value={formData.profile_ratio_one}
                              onChange={handleChange}
                          />
                          <span className="text-blue input_unit">%</span>
                          </div>
                      </div>
                       <div className="col-span-12 flex flex-wrap gap-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tire_construction_one"
                            value="radial"
                            id="radial"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tire_construction_one === 'radial'}
                          />
                          <span>Radial (R)</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tire_construction_one"
                            value="bias_belt"
                            id="bias_belt"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tire_construction_one === 'bias_belt'}
                          />
                          <span>Bias belt (B)</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tire_construction_one"
                            value="diagonal"
                            id="diagonal"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tire_construction_one === 'diagonal'}
                          />
                          <span>Diagonal (D)</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tire_construction_one"
                            value="letter_not_present"
                            id="letter_not_present"
                            className="mr-2 border cursor-pointer"
                            onChange={handleChange}
                            checked={formData.tire_construction_one === 'letter_not_present'}
                          />
                          <span>Letter not present</span>
                        </label>
                      </div>
                      <div className="col-span-12 md:col-span-6 relative">
                          <label htmlFor="wheel_diameter_one" className="label" >
                          Weel Diameter
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="wheel_diameter_one"
                              step="any"
                              className="mt-1 input"
                              value={formData.wheel_diameter_one}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown3}
                            >
                              {formData.wheel_diameter_one_unit} ▾
                            </label>
                            {dropdownVisible3 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                      { label: "mm", value: "mm" },
                                        { label: "cm", value: "cm" },
                                        { label: "in", value: "in" },
                                
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
                      <div className="col-span-12">
                          <p className="text-xl  text-bold"> <strong>Second tire </strong>  </p>
                      </div>
                      <div className="col-span-12 md:col-span-6 relative">
                      <label htmlFor="width_two" className="label" >
                        Width 
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="width_two"
                          step="any"
                          className="mt-1 input"
                          value={formData.width_two}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.width_two_unit} ▾
                        </label>
                        {dropdownVisible4 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                                  { label: "mm", value: "mm" },
                                    { label: "cm", value: "cm" },
                                    { label: "in", value: "in" },
                            
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
                      <div className="col-span-12 md:col-span-6 relative">
                          <label htmlFor="profile_ratio_two" className="label">
                                Profile Ratio 
                          </label>
                          <div class=" relative">
                          <input
                              type="number"
                              name="profile_ratio_two"
                              id="profile_ratio_two"
                              className="input my-2"
                              placeholder=""
                              aria-label="input"
                              value={formData.profile_ratio_two}
                              onChange={handleChange}
                          />
                          <span className="text-blue input_unit">%</span>
                          </div>
                      </div>
                      <div className="col-span-12 flex flex-wrap gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="tire_construction_two"
                          value="radial"
                          id="radial"
                          className="mr-2 border cursor-pointer"
                          onChange={handleChange}
                          checked={formData.tire_construction_two === 'radial'}
                        />
                        <span>Radial (R)</span>
                      </label>

                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="tire_construction_two"
                          value="bias_belt"
                          id="bias_belt"
                          className="mr-2 border cursor-pointer"
                          onChange={handleChange}
                          checked={formData.tire_construction_two === 'bias_belt'}
                        />
                        <span>Bias belt (B)</span>
                      </label>

                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="tire_construction_two"
                          value="diagonal"
                          id="diagonal"
                          className="mr-2 border cursor-pointer"
                          onChange={handleChange}
                          checked={formData.tire_construction_two === 'diagonal'}
                        />
                        <span>Diagonal (D)</span>
                      </label>

                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="tire_construction_two"
                          value="letter_not_present"
                          id="letter_not_present"
                          className="mr-2 border cursor-pointer"
                          onChange={handleChange}
                          checked={formData.tire_construction_two === 'letter_not_present'}
                        />
                        <span>Letter not present</span>
                      </label>
                      </div>
                      <div className="col-span-12 md:col-span-6 relative">
                          <label htmlFor="wheel_diameter_two" className="label" >
                          Weel Diameter
                          </label>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="wheel_diameter_two"
                              step="any"
                              className="mt-1 input"
                              value={formData.wheel_diameter_two}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={toggleDropdown5}
                            >
                              {formData.wheel_diameter_two_unit} ▾
                            </label>
                            {dropdownVisible5 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                      { label: "mm", value: "mm" },
                                        { label: "cm", value: "cm" },
                                        { label: "in", value: "in" },
                                
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
                      <div className="col-span-12">
                      <p className="text-xl  text-bold"> <strong>Speedometer difference </strong>  </p>
                      </div>

                      <div className="col-span-12 md:col-span-6 relative">
                      <label htmlFor="speedometer_reading" className="label" >
                      Weel Diameter
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="speedometer_reading"
                          step="any"
                          className="mt-1 input"
                          value={formData.speedometer_reading}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown6}
                        >
                          {formData.speedometer_reading_unit} ▾
                        </label>
                        {dropdownVisible6 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                                  { label: "km/h", value: "km/h" },
                                    { label: "mph", value: "mph" },
                            
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
                      
                  </div>
                </div>
              </>
            )}





                <div className="mb-6 mt-10 text-center space-x-2">
                <Button type="submit" isLoading={calculateDogLoading}>
                    {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate"}
                  </Button>
                  {result && (
                    <ResetButton type="button" onClick={handleReset}>
                      {data?.payload?.tech_lang_keys["locale"] === "en"? "RESET" : data?.payload?.tech_lang_keys["reset"] || "RESET" }
                    </ResetButton>
                    )}
                  </div>
            </div>
            <div className="lg:w-[100%] w-full mx-auto ">
                <div className="col-span-12">
                  {isLoading && (
                    <div className="mt-8 bg-gray-100 rounded-lg p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  )}
                {result !== null && !isLoading && (
                <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full bg-light-blue result rounded-lg">
                      <div className="flex justify-center">
                        <div className="w-full text-lg">

                          {formData.compare_with_another_tire === "no" && (
                            <>
                              {/* HIGHLIGHTED RESULT CARD - Image Style */}
                              <div className=" rounded-xl p-6 mb-6 text-center ">
                                <h3 className="text-gray-600 text-sm md:text-base mb-3 font-medium">
                                  Total Tire Diameter
                                </h3>
                                <div className="bg-sky bordered rounded-lg md:py-4 py-2 md:px-6 px-2 inline-block ">
                                  <span className="text-[#2845F5] md:text-[30px] text-[20px] font-bold">
                                    {result?.tire_diameter?.mm} mm
                                  </span>
                                </div>
                              </div>

                              {/* Tire Single Result Table */}
                              <div className="overflow-auto">
                              <table className="w-full md:w-[80%] mb-4 text-[16px] md:text-[20px]">
                                <tbody>
                                  {/* Tire Diameter */}
                                  <tr className="border-b"><td className="font-bold text-black-700 py-3" colSpan={2}>Tire Diameter</td></tr>
                                  <tr className="border-b"><td>mm</td><td>{result?.tire_diameter?.mm}</td></tr>
                                  <tr className="border-b"><td>cm</td><td>{result?.tire_diameter?.cm}</td></tr>
                                  <tr className="border-b"><td>in</td><td>{result?.tire_diameter?.in}</td></tr>
                                  <tr className="border-b"><td>ft</td><td>{result?.tire_diameter?.ft}</td></tr>

                                  {/* Sidewall Height */}
                                  <tr className="border-b"><td className="font-bold text-black-700 py-3" colSpan={2}>Sidewall Height</td></tr>
                                  <tr className="border-b"><td>mm</td><td>{result?.sidewall_height?.mm}</td></tr>
                                  <tr className="border-b"><td>cm</td><td>{result?.sidewall_height?.cm}</td></tr>
                                  <tr className="border-b"><td>in</td><td>{result?.sidewall_height?.in}</td></tr>

                                  {/* Circumference */}
                                  <tr className="border-b"><td className="font-bold text-black-700 py-3" colSpan={2}>Circumference</td></tr>
                                  {Object.entries(result?.circumference || {}).map(([k, v]) => (
                                    <tr className="border-b" key={k}><td>{k}</td><td>{v}</td></tr>
                                  ))}

                                  {/* Revolutions */}
                                  <tr className="border-b"><td className="font-bold text-black-700 py-3" colSpan={2}>Revolutions</td></tr>
                                  <tr className="border-b"><td>revs/km</td><td>{result?.revolutions?.["revs/km"]}</td></tr>
                                  <tr className="border-b"><td>revs/mi</td><td>{result?.revolutions?.["revs/mi"]}</td></tr>
                                </tbody>
                              </table></div>
                            </>
                          )}

                          {/* Condition 2: Compare = YES */}
                          {formData.compare_with_another_tire === "yes" && (
                            <>
                              {/* COMPARISON HIGHLIGHT CARDS */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Tire One Card */}
                                <div className="bg-white  to-green-100 rounded-xl p-5 text-center ">
                                  <h4 className="text-gray-700 text-sm font-semibold mb-2">Tire One Diameter</h4>
                                  <div className="bg-sky bordered rounded-lg py-3 px-4 inline-block ">
                                    <span className="text-green-600 text-3xl font-bold">
                                      {result?.tire_one?.tire_diameter?.mm} mm
                                    </span>
                                  </div>
                                </div>

                                {/* Tire Two Card */}
                                <div className="bg-white  rounded-xl p-5 text-center ">
                                  <h4 className="text-gray-700 text-sm font-semibold mb-2">Tire Two Diameter</h4>
                                  <div className="bg-sky bordered rounded-lg py-3 px-4 inline-block ">
                                    <span className="text-purple-600 text-3xl font-bold">
                                      {result?.tire_two?.tire_diameter?.mm} mm
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Difference Highlight */}
                              <div className="bg-white  rounded-xl p-6 mb-6 text-center ">
                                <h3 className="text-gray-600 text-sm md:text-base mb-3 font-medium">
                                  Diameter Difference
                                </h3>
                                <div className="bg-sky bordered rounded-lg py-4 px-6 inline-block ">
                                  <span className="text-orange-600 text-4xl md:text-5xl font-bold">
                                    {result?.difference?.diameter_difference_percent}
                                  </span>
                                </div>
                              </div>

                              {/* Tire One Details */}
                              <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-12 md:col-span-6">
                                  <h3 className="text-lg font-bold text-black-700 mb-2 col-span-12">Tire One</h3>
                                   <div className="overfow-auto">
                                  <table className="w-full md:w-[90%] mb-6 text-[16px] md:text-[18px]">
                                    <tbody>
                                      <tr className="border-b"><td className="font-bold text-black-700" colSpan={2}>Tire Diameter</td></tr>
                                      {Object.entries(result?.tire_one?.tire_diameter || {}).map(([k, v]) => (
                                        <tr className="border-b" key={k}><td>{k}</td><td>{v}</td></tr>
                                      ))}

                                      <tr className="border-b"><td className="font-bold text-black-700 py-2" colSpan={2}>Sidewall Height</td></tr>
                                      {Object.entries(result?.tire_one?.sidewall_height || {}).map(([k, v]) => (
                                        <tr className="border-b" key={k}><td>{k}</td><td>{v}</td></tr>
                                      ))}

                                      <tr className="border-b"><td className="font-bold text-black-700 py-2" colSpan={2}>Circumference</td></tr>
                                      {Object.entries(result?.tire_one?.circumference || {}).map(([k, v]) => (
                                        <tr className="border-b" key={k}><td>{k}</td><td>{v}</td></tr>
                                      ))}

                                      <tr className="border-b"><td className="font-bold text-black-700 py-2" colSpan={2}>Revolutions</td></tr>
                                      <tr className="border-b"><td>revs/km</td><td>{result?.tire_one?.revolutions?.["revs/km"]}</td></tr>
                                      <tr className="border-b"><td>revs/mi</td><td>{result?.tire_one?.revolutions?.["revs/mi"]}</td></tr>
                                    </tbody>
                                  </table>
                                  </div>
                                </div>

                                {/* Tire Two Details */}
                                <div className="col-span-12 md:col-span-6">
                                  <h3 className="text-lg font-bold text-black-700 mb-2">Tire Two</h3>
                                  <div className="overfow-auto">
                                  <table className="w-full md:w-[90%] mb-6 text-[16px] md:text-[18px]">
                                    <tbody>
                                      <tr className="border-b"><td className="font-bold text-black-700">Tire Diameter</td></tr>
                                      {Object.entries(result?.tire_two?.tire_diameter || {}).map(([k, v]) => (
                                        <tr className="border-b" key={k}><td>{k}</td><td>{v}</td></tr>
                                      ))}

                                      <tr className="border-b"><td className="font-bold text-black-700 py-2">Sidewall Height</td></tr>
                                      {Object.entries(result?.tire_two?.sidewall_height || {}).map(([k, v]) => (
                                        <tr className="border-b" key={k}><td>{k}</td><td>{v}</td></tr>
                                      ))}

                                      <tr className="border-b"><td className="font-bold text-black-700 py-2">Circumference</td></tr>
                                      {Object.entries(result?.tire_two?.circumference || {}).map(([k, v]) => (
                                        <tr className="border-b" key={k}><td>{k}</td><td>{v}</td></tr>
                                      ))}

                                      <tr className="border-b"><td className="font-bold text-black-700 py-2">Revolutions</td></tr>
                                      <tr className="border-b"><td>revs/km</td><td>{result?.tire_two?.revolutions?.["revs/km"]}</td></tr>
                                      <tr className="border-b"><td>revs/mi</td><td>{result?.tire_two?.revolutions?.["revs/mi"]}</td></tr>
                                    </tbody>
                                  </table>
                                  </div>
                                </div>
                              </div>

                              {/* Difference Table */}
                              <h3 className="text-lg font-bold text-black-700 mb-2">Difference</h3>
                              <div className="overfow-auto">
                              <table className="w-full md:w-[90%] mb-6 text-[16px] md:text-[18px]">
                                <tbody>
                                  {Object.entries(result?.difference?.diameter_difference || {}).map(([k, v]) => (
                                    <tr className="border-b" key={k}><td>{k}</td><td>{v}</td></tr>
                                  ))}

                                  <tr className="border-b">
                                    <td className="font-bold">Difference %</td>
                                    <td>{result?.difference?.diameter_difference_percent}</td>
                                  </tr>

                                  <tr className="border-b">
                                    <td className="font-bold">Note</td>
                                    <td>{result?.difference?.note}</td>
                                  </tr>
                                </tbody>
                              </table></div>

                              {/* Speedometer Difference */}
                              <h3 className="text-lg font-bold text-black-700 mb-2">Speedometer Difference</h3>
                              <div className="overfow-auto">
                              <table className="w-full md:w-[90%] mb-4 text-[16px] md:text-[18px]">
                                <tbody>
                                  <tr className="border-b"><td>Speedometer Reading</td><td>{result?.speedometer_difference?.speedometer_reading}</td></tr>
                                  <tr className="border-b"><td>Actual Speed (km/h)</td><td>{result?.speedometer_difference?.actual_speed?.["km/h"]}</td></tr>
                                  <tr className="border-b"><td>Actual Speed (mph)</td><td>{result?.speedometer_difference?.actual_speed?.mph}</td></tr>
                                </tbody>
                              </table></div>
                            </>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                </div>
            </div>
          </form>
        {result && (
              <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
            )}
            
    </Calculator>
  );
};

export default TireSizeCalculator;
