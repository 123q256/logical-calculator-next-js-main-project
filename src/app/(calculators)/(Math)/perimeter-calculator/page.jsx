"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePerimeterCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PerimeterCalculator = () => {
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
    tech_shape: "1", // 1 2 3 4 5 6 7 8 9 10 11 12 13
    tech_given: "1",
    tech_givena: "1",
    tech_nbr: "5",
    tech_r: "7",
    tech_r_unit: "m",
    tech_b: "7",
    tech_b_unit: "m",
    tech_c: "7",
    tech_c_unit: "m",
    tech_d: "7",
    tech_d_unit: "m",
    tech_angle: "7",
    tech_angle_unit: "deg",
    tech_angleb: "7",
    tech_angleb_unit: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePerimeterCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_shape) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_shape: formData.tech_shape,
        tech_given: formData.tech_given,
        tech_givena: formData.tech_givena,
        tech_nbr: formData.tech_nbr,
        tech_r: formData.tech_r,
        tech_r_unit: formData.tech_r_unit,
        tech_b: formData.tech_b,
        tech_b_unit: formData.tech_b_unit,
        tech_c: formData.tech_c,
        tech_c_unit: formData.tech_c_unit,
        tech_d: formData.tech_d,
        tech_d_unit: formData.tech_d_unit,
        tech_angle: formData.tech_angle,
        tech_angle_unit: formData.tech_angle_unit,
        tech_angleb: formData.tech_angleb,
        tech_angleb_unit: formData.tech_angleb_unit,
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
      tech_shape: "1", // 1 2 3 4 5 6 7 8 9 10 11 12 13
      tech_given: "1",
      tech_givena: "1",
      tech_nbr: "5",
      tech_r: "7",
      tech_r_unit: "m",
      tech_b: "7",
      tech_b_unit: "m",
      tech_c: "7",
      tech_c_unit: "m",
      tech_d: "7",
      tech_d_unit: "m",
      tech_angle: "7",
      tech_angle_unit: "deg",
      tech_angleb: "7",
      tech_angleb_unit: "deg",
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
    setFormData((prev) => ({ ...prev, tech_r_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_b_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_d_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angleb_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  const shapeImages = {
    1: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["2"],
      src: "/images/square.svg",
    },
    2: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["3"],
      src: "/images/rectangle.svg",
    },
    3: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["4"],
      src: "/images/triangle1.svg",
    },
    4: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["5"],
      src: "/images/circle.svg",
    },
    5: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["6"],
      src: "/images/semicircle-p.svg",
    },
    6: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["7"],
      src: "/images/sector.svg",
    },
    7: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["8"],
      src: "/images/ellipse.svg",
    },
    8: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["9"],
      src: "/images/trapezoid.svg",
    },
    9: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["10"],
      src: "/images/parallelogram1.svg",
    },
    10: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["11"],
      src: "/images/rhombus1.svg",
    },
    11: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["12"],
      src: "/images/kite.svg",
    },
    12: {
      label:
        data?.payload?.tech_lang_keys["23"] +
        " " +
        data?.payload?.tech_lang_keys["13"],
      src: "/images/annulus4.svg",
    },
    13: {
      label: data?.payload?.tech_lang_keys["14"],
      src: "/images/polygon.svg",
    },
  };

  const shape = shapeImages[formData?.tech_shape];

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
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 order-1">
                <div className="col-span-12">
                  <label htmlFor="tech_shape" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_shape"
                      id="tech_shape"
                      value={formData.tech_shape}
                      onChange={handleChange}
                    >
                      <option value="1">
                        {data?.payload?.tech_lang_keys["2"]}{" "}
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["3"]}{" "}
                      </option>
                      <option value="3">
                        {data?.payload?.tech_lang_keys["4"]}{" "}
                      </option>
                      <option value="4">
                        {data?.payload?.tech_lang_keys["5"]}{" "}
                      </option>
                      <option value="5">
                        {data?.payload?.tech_lang_keys["6"]}{" "}
                      </option>
                      <option value="6">
                        {data?.payload?.tech_lang_keys["7"]}{" "}
                      </option>
                      <option value="7">
                        {data?.payload?.tech_lang_keys["8"]}{" "}
                      </option>
                      <option value="8">
                        {data?.payload?.tech_lang_keys["9"]}{" "}
                      </option>
                      <option value="9">
                        {data?.payload?.tech_lang_keys["10"]}{" "}
                      </option>
                      <option value="10">
                        {data?.payload?.tech_lang_keys["11"]}{" "}
                      </option>
                      <option value="11">
                        {data?.payload?.tech_lang_keys["12"]}{" "}
                      </option>
                      <option value="12">
                        {data?.payload?.tech_lang_keys["13"]}{" "}
                      </option>
                      <option value="13">
                        {data?.payload?.tech_lang_keys["14"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>
                {formData.tech_shape == "3" && (
                  <>
                    <div className="col-span-12 given">
                      <label htmlFor="tech_given" className="label">
                        {data?.payload?.tech_lang_keys["15"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_given"
                          id="tech_given"
                          value={formData.tech_given}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["16"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["17"]}{" "}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["18"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
                {formData.tech_shape == "9" && (
                  <>
                    <div className="col-span-12 givena">
                      <label htmlFor="tech_givena" className="label">
                        {data?.payload?.tech_lang_keys["16"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_givena"
                          id="tech_givena"
                          value={formData.tech_givena}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["19"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["20"]}{" "}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {formData.tech_shape == "13" && (
                  <>
                    <div className="col-span-12 nbr_main">
                      <label htmlFor="tech_nbr" className="label">
                        {data?.payload?.tech_lang_keys["22"]} n:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_nbr"
                          id="tech_nbr"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_nbr}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                {(formData.tech_shape == "1" ||
                  formData.tech_shape == "2" ||
                  formData.tech_shape == "4" ||
                  formData.tech_shape == "5" ||
                  formData.tech_shape == "6" ||
                  formData.tech_shape == "7" ||
                  formData.tech_shape == "8" ||
                  formData.tech_shape == "10" ||
                  formData.tech_shape == "11" ||
                  formData.tech_shape == "12" ||
                  formData.tech_shape == "13" ||
                  (formData.tech_shape == "3" && formData.tech_given == "1") ||
                  (formData.tech_shape == "3" && formData.tech_given == "2") ||
                  (formData.tech_shape == "3" && formData.tech_given == "3") ||
                  (formData.tech_shape == "9" && formData.tech_givena == "1") ||
                  (formData.tech_shape == "9" && formData.tech_givena == "2") ||
                  (formData.tech_shape == "9" &&
                    formData.tech_givena == "3")) && (
                  <>
                    <div className="col-span-12 r_main">
                      {(formData.tech_shape == "1" ||
                        formData.tech_shape == "2" ||
                        formData.tech_shape == "3" ||
                        formData.tech_shape == "7" ||
                        formData.tech_shape == "8" ||
                        formData.tech_shape == "13" ||
                        (formData.tech_shape == "9" &&
                          formData.tech_givena == "1") ||
                        formData.tech_shape == "10" ||
                        formData.tech_shape == "11") && (
                        <>
                          <label htmlFor="tech_r" className="label">
                            {" "}
                            Side (a){" "}
                          </label>
                        </>
                      )}
                      {(formData.tech_shape == "4" ||
                        formData.tech_shape == "5" ||
                        formData.tech_shape == "6") && (
                        <>
                          <label htmlFor="tech_r" className="label">
                            {" "}
                            Radius (r){" "}
                          </label>
                        </>
                      )}

                      {formData.tech_shape == "12" && (
                        <>
                          <label htmlFor="tech_r" className="label">
                            {" "}
                            Radius of outer circle (R){" "}
                          </label>
                        </>
                      )}

                      {((formData.tech_shape == "9" &&
                        formData.tech_givena == "2") ||
                        (formData.tech_shape == "9" &&
                          formData.tech_givena == "3")) && (
                        <>
                          <label htmlFor="tech_r" className="label">
                            {" "}
                            Side (b)
                          </label>
                        </>
                      )}

                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_r"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_r}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
                          onClick={toggleDropdown}
                        >
                          {formData.tech_r_unit} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimetre  (mm)", value: "mm" },
                              { label: "meters (m)", value: "m" },
                              { label: "inches (in)", value: "in" },
                              { label: "feet (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
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
                {(formData.tech_shape == "2" ||
                  (formData.tech_shape == "3" && formData.tech_given == "1") ||
                  formData.tech_shape == "7" ||
                  formData.tech_shape == "8" ||
                  formData.tech_shape == "11" ||
                  formData.tech_shape == "12" ||
                  (formData.tech_shape == "3" && formData.tech_given == "2") ||
                  (formData.tech_shape == "9" && formData.tech_givena == "1") ||
                  (formData.tech_shape == "9" && formData.tech_givena == "2") ||
                  (formData.tech_shape == "9" &&
                    formData.tech_givena == "3")) && (
                  <>
                    <div className="col-span-12 b_main">
                      {formData.tech_shape == "9" &&
                      formData.tech_givena == "2" ? (
                        <>
                          <label htmlFor="tech_b" className="label">
                            Diagonal (e)
                          </label>
                        </>
                      ) : formData.tech_shape == "9" &&
                        formData.tech_givena == "3" ? (
                        <>
                          <label htmlFor="tech_b" className="label">
                            {" "}
                            Height (h)
                          </label>
                        </>
                      ) : formData.tech_shape == "12" ? (
                        <>
                          <label htmlFor="tech_b" className="label">
                            {" "}
                            Radius (r)
                          </label>
                        </>
                      ) : (
                        <>
                          <label htmlFor="tech_b" className="label">
                            {" "}
                            Side (b)
                          </label>
                        </>
                      )}

                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_b"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_b}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_b_unit} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimetre  (mm)", value: "mm" },
                              { label: "meters (m)", value: "m" },
                              { label: "inches (in)", value: "in" },
                              { label: "feet (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
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
                {((formData.tech_shape == "3" && formData.tech_given == "1") ||
                  formData.tech_shape == "8" ||
                  (formData.tech_shape == "9" &&
                    formData.tech_givena == "2")) && (
                  <>
                    <div className="col-span-12 c_main">
                      {formData.tech_shape == "9" &&
                      formData.tech_givena == "2" ? (
                        <>
                          <label htmlFor="tech_c" className="label">
                            Diagonal (f)
                          </label>
                        </>
                      ) : (
                        <>
                          <label htmlFor="tech_c" className="label">
                            {" "}
                            Side (c){" "}
                          </label>
                        </>
                      )}

                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_c"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_c}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_c_unit} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimetre  (mm)", value: "mm" },
                              { label: "meters (m)", value: "m" },
                              { label: "inches (in)", value: "in" },
                              { label: "feet (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
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
                {formData.tech_shape == "8" && (
                  <>
                    <div className="col-span-12 d_main">
                      <label htmlFor="tech_d" className="label">
                        Side (d)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_d"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_d}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_d_unit} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimetre  (mm)", value: "mm" },
                              { label: "meters (m)", value: "m" },
                              { label: "inches (in)", value: "in" },
                              { label: "feet (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
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
                {((formData.tech_shape == "3" && formData.tech_given == "3") ||
                  formData.tech_shape == "6" ||
                  (formData.tech_shape == "9" &&
                    formData.tech_givena == "3")) && (
                  <>
                    <div className="col-span-12 angle_a">
                      {(formData.tech_shape == "9" &&
                        formData.tech_givena == "3") ||
                      formData.tech_shape == "6" ? (
                        <>
                          <label htmlFor="tech_angle" className="label">
                            Angle α
                          </label>
                        </>
                      ) : (
                        <>
                          <label htmlFor="tech_angle" className="label">
                            {data?.payload?.tech_lang_keys["4"]} β:
                          </label>
                        </>
                      )}

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
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_angle_unit} ▾
                        </label>
                        {dropdownVisible4 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "deg", value: "deg" },
                              { label: "rad", value: "rad" },
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
                {((formData.tech_shape == "3" && formData.tech_given == "2") ||
                  (formData.tech_shape == "3" &&
                    formData.tech_given == "3")) && (
                  <>
                    <div className="col-span-12 angle_b">
                      <label htmlFor="tech_angleb" className="label">
                        {data?.payload?.tech_lang_keys["24"]} γ:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angleb"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_angleb}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
                          onClick={toggleDropdown5}
                        >
                          {formData.tech_angleb_unit} ▾
                        </label>
                        {dropdownVisible5 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "deg", value: "deg" },
                              { label: "rad", value: "rad" },
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
              </div>

              <div className="col-span-12 md:col-span-6 flex items-center ps-lg-3 justify-center ">
                {formData.tech_shape == "1" && (
                  <>
                    <img
                      src="/images/square.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "2" && (
                  <>
                    <img
                      src="/images/rectangle.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "3" && (
                  <>
                    {formData.tech_given == "1" && (
                      <>
                        <img
                          src="/images/triangle1.svg"
                          alt="Perimeter Calculator"
                          width="150px"
                          height="120"
                          className="shape_img"
                        />
                      </>
                    )}
                    {formData.tech_given == "2" && (
                      <>
                        <img
                          src="/images/triangle2.svg"
                          alt="Perimeter Calculator"
                          width="150px"
                          height="120"
                          className="shape_img"
                        />
                      </>
                    )}
                    {formData.tech_given == "3" && (
                      <>
                        <img
                          src="/images/triangle3.svg"
                          alt="Perimeter Calculator"
                          width="150px"
                          height="120"
                          className="shape_img"
                        />
                      </>
                    )}
                  </>
                )}
                {formData.tech_shape == "4" && (
                  <>
                    <img
                      src="/images/circle.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "5" && (
                  <>
                    <img
                      src="/images/semicircle-p.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "6" && (
                  <>
                    <img
                      src="/images/sector.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "7" && (
                  <>
                    <img
                      src="/images/ellipse.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "8" && (
                  <>
                    <img
                      src="/images/trapezoid.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "9" && (
                  <>
                    {formData.tech_givena == "1" && (
                      <>
                        <img
                          src="/images/parallelogram1.svg"
                          alt="Perimeter Calculator"
                          width="150px"
                          height="120"
                          className="shape_img"
                        />
                      </>
                    )}
                    {formData.tech_givena == "2" && (
                      <>
                        <img
                          src="/images/parallelogram2.svg"
                          alt="Perimeter Calculator"
                          width="150px"
                          height="120"
                          className="shape_img"
                        />
                      </>
                    )}
                    {formData.tech_givena == "3" && (
                      <>
                        <img
                          src="/images/parallelogram3.svg"
                          alt="Perimeter Calculator"
                          width="150px"
                          height="120"
                          className="shape_img"
                        />
                      </>
                    )}
                  </>
                )}
                {formData.tech_shape == "10" && (
                  <>
                    <img
                      src="/images/rhombus1.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "11" && (
                  <>
                    <img
                      src="/images/kite.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "12" && (
                  <>
                    <img
                      src="/images/annulus4.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
                {formData.tech_shape == "13" && (
                  <>
                    <img
                      src="/images/polygon.svg"
                      alt="Perimeter Calculator"
                      width="150px"
                      height="120"
                      className="shape_img"
                    />
                  </>
                )}
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
                      <div className="w-full my-2 flex justify-center overflow-auto">
                        <div className="text-center">
                          {shape && (
                            <>
                              <p className="text-[20px] mb-2 font-bold">
                                {shape.label}
                              </p>
                              <img
                                src={shape.src}
                                alt="Perimeter Calculator"
                                height={120}
                                width="150px"
                                className="shape_img margin_top_20"
                              />
                            </>
                          )}
                          <div>
                            <p className="text-[32px] bg-[#2845F5] px-3 py-2 rounded-lg text-white inline-block my-3">
                              <strong className="text-blue">
                                {result?.tech_peri}
                              </strong>
                            </p>
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

export default PerimeterCalculator;
