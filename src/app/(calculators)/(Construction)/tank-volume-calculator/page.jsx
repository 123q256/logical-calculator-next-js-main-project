"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTankVolumeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TankVolumeCalculator = () => {
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
    tech_operations: "3",
    tech_first: Number(24),
    tech_units1: "m",
    tech_second: Number(10),
    tech_units2: "m",
    tech_third: Number(16),
    tech_units3: "mm",
    tech_fill: Number(12),
    tech_fill_units: "ft",
    tech_four: Number(15),
    tech_units4: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTankVolumeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations || !formData.tech_first) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_second: formData.tech_second,
        tech_units2: formData.tech_units2,
        tech_third: formData.tech_third,
        tech_units3: formData.tech_units3,
        tech_fill: formData.tech_fill,
        tech_fill_units: formData.tech_fill_units,
        tech_four: formData.tech_four,
        tech_units4: formData.tech_units4,
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
      tech_operations: "3",
      tech_first: "24",
      tech_units1: "m",
      tech_second: "10",
      tech_units2: "m",
      tech_third: "16",
      tech_units3: "mm",
      tech_fill: "12",
      tech_fill_units: "ft",
      tech_four: "15",
      tech_units4: "m",
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
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units3: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fill_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units4: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="col-lg-6">
                <div className="space-y-2 ">
                  <label htmlFor="tech_operations" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_operations"
                      id="tech_operations"
                      value={formData.tech_operations}
                      onChange={handleChange}
                    >
                      <option value="3">
                        {data?.payload?.tech_lang_keys["2"]}
                      </option>
                      <option value="4">
                        {data?.payload?.tech_lang_keys["3"]}
                      </option>
                      <option value="5">
                        {data?.payload?.tech_lang_keys["4"]}
                      </option>
                      <option value="6">
                        {data?.payload?.tech_lang_keys["5"]}
                      </option>
                      <option value="7">
                        {data?.payload?.tech_lang_keys["6"]}
                      </option>
                      <option value="8">
                        {data?.payload?.tech_lang_keys["7"]}
                      </option>
                      <option value="9">
                        {data?.payload?.tech_lang_keys["8"]}
                      </option>
                      <option value="12">
                        {data?.payload?.tech_lang_keys["9"]}
                      </option>
                      <option value="13">
                        {data?.payload?.tech_lang_keys["10"]}
                      </option>
                      <option value="14">
                        {data?.payload?.tech_lang_keys["11"]}
                      </option>
                      <option value="15">
                        {data?.payload?.tech_lang_keys["12"]} (
                        {data?.payload?.tech_lang_keys["13"]})
                      </option>
                      <option value="16">
                        {data?.payload?.tech_lang_keys["14"]}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="text-center md:hidden">
                  {formData.tech_operations == "3" && (
                    <>
                      <img
                        src="/images/tank/Horizantal-cylinder.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "4" && (
                    <>
                      <img
                        src="/images/tank/Vertical Cylinder.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "5" && (
                    <>
                      <img
                        src="/images/tank/Rectangle.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "6" && (
                    <>
                      <img
                        src="/images/tank/Horizontal Oval.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "7" && (
                    <>
                      <img
                        src="/images/tank/Vertical Oval.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "8" && (
                    <>
                      <img
                        src="/images/tank/Horizontal Capsule.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "9" && (
                    <>
                      <img
                        src="/images/tank/Vertical Capsule.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "12" && (
                    <>
                      <img
                        src="/images/tank/Horizontal Elliptical.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "13" && (
                    <>
                      <img
                        src="/images/tank/Cone Bottom.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "14" && (
                    <>
                      <img
                        src="/images/tank/Cone Top.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "15" && (
                    <>
                      <img
                        src="/images/tank/Frustum (truncated cone, funnel).webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "16" && (
                    <>
                      <img
                        src="/images/tank/Sphere.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                </div>

                <div className="space-y-2 mt-3" id="1">
                  {formData.tech_operations == "3" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["19"]} (l)
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "4" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["21"]} (h)
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "5" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["21"]} (h)
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "6" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        Height (h):
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "7" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["21"]} (h)
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "8" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["24"]} (a)
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "9" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["24"]} (a)
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "12" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["21"]} (h)
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "13" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["25"]}{" "}
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "14" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["25"]}{" "}
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "15" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["25"]}{" "}
                      </label>
                    </>
                  )}
                  {formData.tech_operations == "16" && (
                    <>
                      <label htmlFor="tech_first" className="label">
                        {data?.payload?.tech_lang_keys["20"]}{" "}
                      </label>
                    </>
                  )}

                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_first"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_first}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_units1} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "in", value: "in" },
                          { label: "ft", value: "ft" },
                          { label: "cm", value: "cm" },
                          { label: "m", value: "m" },
                          { label: "mm", value: "mm" },
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

                {formData.tech_operations != "16" && (
                  <>
                    <div className="space-y-2 second " id="2">
                      {formData.tech_operations == "3" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["20"]} (d)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "4" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["20"]} (d)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "5" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["22"]} (w)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "6" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["22"]} (w)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "7" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["22"]} (w)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "8" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["20"]} (d)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "9" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["20"]} (d)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "12" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["22"]} (w)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "13" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["26"]}{" "}
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "14" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["26"]}{" "}
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "15" && (
                        <>
                          <label htmlFor="tech_second" className="label">
                            {data?.payload?.tech_lang_keys["26"]}{" "}
                          </label>
                        </>
                      )}

                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_second"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_second}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_units2} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "mm", value: "mm" },
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

                {(formData.tech_operations == "5" ||
                  formData.tech_operations == "6" ||
                  formData.tech_operations == "7" ||
                  formData.tech_operations == "12" ||
                  formData.tech_operations == "13" ||
                  formData.tech_operations == "14" ||
                  formData.tech_operations == "15") && (
                  <>
                    <div className="space-y-2 third " id="3">
                      {formData.tech_operations == "5" && (
                        <>
                          <label htmlFor="tech_third" className="label">
                            {data?.payload?.tech_lang_keys["19"]} (l)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "6" && (
                        <>
                          <label htmlFor="tech_third" className="label">
                            {data?.payload?.tech_lang_keys["19"]} (l)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "7" && (
                        <>
                          <label htmlFor="tech_third" className="label">
                            {data?.payload?.tech_lang_keys["19"]} (l)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "12" && (
                        <>
                          <label htmlFor="tech_third" className="label">
                            {data?.payload?.tech_lang_keys["19"]} (l)
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "13" && (
                        <>
                          <label htmlFor="tech_third" className="label">
                            {data?.payload?.tech_lang_keys["27"]}{" "}
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "14" && (
                        <>
                          <label htmlFor="tech_third" className="label">
                            {data?.payload?.tech_lang_keys["27"]}{" "}
                          </label>
                        </>
                      )}
                      {formData.tech_operations == "15" && (
                        <>
                          <label htmlFor="tech_third" className="label">
                            {data?.payload?.tech_lang_keys["28"]}{" "}
                          </label>
                        </>
                      )}

                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_third"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_third}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_units3} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "mm", value: "mm" },
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

                <div className="space-y-2 fill mt-3 " id="5">
                  <label htmlFor="tech_fill" className="label">
                    {data?.payload?.tech_lang_keys[29]} (
                    {data?.payload?.tech_lang_keys[30]}):
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_fill"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_fill}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown3}
                    >
                      {formData.tech_fill_units} ▾
                    </label>
                    {dropdownVisible3 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "in", value: "in" },
                          { label: "ft", value: "ft" },
                          { label: "cm", value: "cm" },
                          { label: "m", value: "m" },
                          { label: "mm", value: "mm" },
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
              <div className="col-lg-6 mt-3">
                <div className="mt-3  justify-center hidden md:flex">
                  {formData.tech_operations == "3" && (
                    <>
                      <img
                        src="/images/tank/Horizantal-cylinder.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "4" && (
                    <>
                      <img
                        src="/images/tank/Vertical Cylinder.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "5" && (
                    <>
                      <img
                        src="/images/tank/Rectangle.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "6" && (
                    <>
                      <img
                        src="/images/tank/Horizontal Oval.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "7" && (
                    <>
                      <img
                        src="/images/tank/Vertical Oval.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "8" && (
                    <>
                      <img
                        src="/images/tank/Horizontal Capsule.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "9" && (
                    <>
                      <img
                        src="/images/tank/Vertical Capsule.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "12" && (
                    <>
                      <img
                        src="/images/tank/Horizontal Elliptical.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "13" && (
                    <>
                      <img
                        src="/images/tank/Cone Bottom.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "14" && (
                    <>
                      <img
                        src="/images/tank/Cone Top.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "15" && (
                    <>
                      <img
                        src="/images/tank/Frustum (truncated cone, funnel).webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                  {formData.tech_operations == "16" && (
                    <>
                      <img
                        src="/images/tank/Sphere.webp"
                        alt="Tank First"
                        className="max-width"
                        id="im"
                        width="200px"
                        height="250px"
                      />
                    </>
                  )}
                </div>

                {(formData.tech_operations == "13" ||
                  formData.tech_operations == "14") && (
                  <>
                    <div className="space-y-2 four" id="4">
                      <label htmlFor="tech_four" className="label">
                        {data?.payload?.tech_lang_keys[24]} :
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_four"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_four}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_units4} ▾
                        </label>
                        {dropdownVisible4 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "mm", value: "mm" },
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
                  </>
                )}
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

                  <div className="rounded-lg   items-center justify-center">
                    <div className="w-full  mt-3">
                      <div className="w-full my-2">
                        <div className="w-full  font-s-18">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="20%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[15]} in³:
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_v_tank).toFixed(2)} in³
                                </td>
                              </tr>
                              <tr>
                                <td width="20%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[15]} ft³:
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_v_feet).toFixed(2)} ft³
                                </td>
                              </tr>
                              <tr>
                                <td width="20%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[16]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_v_liter).toFixed(2)}{" "}
                                  liters
                                </td>
                              </tr>
                              <tr>
                                <td width="20%" className="border-b py-2">
                                  US {data?.payload?.tech_lang_keys[17]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_us_gallons).toFixed(2)}{" "}
                                </td>
                              </tr>
                              <tr>
                                <td width="20%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[15]} m³:
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_v_meter).toFixed(2)} m³
                                </td>
                              </tr>
                              <tr>
                                <td width="20%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[15]} yd³:
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_v_yard).toFixed(2)} yd³
                                </td>
                              </tr>
                              <tr>
                                <td width="20%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[15]} cm³:
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_v_cm).toFixed(2)} cm³
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          {result?.tech_v_fill && (
                            <>
                              <table className="w-full mt-2">
                                <tbody>
                                  <tr>
                                    <td width="20%" className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[18]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_v_fill).toFixed(2)}{" "}
                                      in³ (
                                      <span className="font-s-18">
                                        {Number(result?.tech_per_ans)} % FULL
                                      </span>
                                      )
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="20%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[15]} ft³:
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_v_feet_fill).toFixed(
                                        2
                                      )}{" "}
                                      ft³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="20%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[16]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_v_liter_fill
                                      ).toFixed(2)}{" "}
                                      liters
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="20%" className="border-b py-2">
                                      US {data?.payload?.tech_lang_keys[17]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_us_gallons_fill
                                      ).toFixed(2)}{" "}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="20%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[15]} m³:
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_v_meter_fill
                                      ).toFixed(2)}{" "}
                                      m³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="20%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[15]} yd³:
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_v_yard_fill).toFixed(
                                        2
                                      )}{" "}
                                      yd³
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="20%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[15]} cm³:
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_v_cm_fill).toFixed(
                                        2
                                      )}{" "}
                                      cm³
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
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

export default TankVolumeCalculator;
