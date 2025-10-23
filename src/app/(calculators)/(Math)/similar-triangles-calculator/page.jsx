"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSimilarTrianglesCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SimilarTrianglesCalculator = () => {
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
    tech_type: "1", // 1 2
    tech_similarity: "SSS", //  SSS  SAS
    tech_ABC_f: "19",
    tech_ABC_f_unit: "cm",
    tech_ABC_f_deg_rad: "rad",
    tech_ABC_s: "17",
    tech_ABC_s_unit: "cm",
    tech_ABC_s_deg_rad: "rad",
    tech_ABC_t: "15",
    tech_ABC_t_unit: "cm",
    tech_ABC_t_deg_rad: "rad",
    tech_ABC_corresponding: "19",
    tech_ABC_corresponding_unit: "cm",
    tech_scale_factor: "14",
    tech_DEF_f: "19",
    tech_DEF_f_unit: "cm",
    tech_DEF_f_deg_rad: "rad",
    tech_DEF_s: "17",
    tech_DEF_s_unit: "cm",
    tech_DEF_s_deg_rad: "rad",
    tech_DEF_t: "15",
    tech_DEF_t_unit: "cm",
    tech_DEF_t_deg_rad: "rad",
    tech_DEF_corresponding: "21",
    tech_DEF_corresponding_unit: "kg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSimilarTrianglesCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_similarity: formData.tech_similarity,
        tech_ABC_f: formData.tech_ABC_f,
        tech_ABC_f_unit: formData.tech_ABC_f_unit,
        tech_ABC_f_deg_rad: formData.tech_ABC_f_deg_rad,
        tech_ABC_s: formData.tech_ABC_s,
        tech_ABC_s_unit: formData.tech_ABC_s_unit,
        tech_ABC_s_deg_rad: formData.tech_ABC_s_deg_rad,
        tech_ABC_t: formData.tech_ABC_t,
        tech_ABC_t_unit: formData.tech_ABC_t_unit,
        tech_ABC_t_deg_rad: formData.tech_ABC_t_deg_rad,
        tech_ABC_corresponding: formData.tech_ABC_corresponding,
        tech_ABC_corresponding_unit: formData.tech_ABC_corresponding_unit,
        tech_scale_factor: formData.tech_scale_factor,
        tech_DEF_f: formData.tech_DEF_f,
        tech_DEF_f_unit: formData.tech_DEF_f_unit,
        tech_DEF_f_deg_rad: formData.tech_DEF_f_deg_rad,
        tech_DEF_s: formData.tech_DEF_s,
        tech_DEF_s_unit: formData.tech_DEF_s_unit,
        tech_DEF_s_deg_rad: formData.tech_DEF_s_deg_rad,
        tech_DEF_t: formData.tech_DEF_t,
        tech_DEF_t_unit: formData.tech_DEF_t_unit,
        tech_DEF_t_deg_rad: formData.tech_DEF_t_deg_rad,
        tech_DEF_corresponding: formData.tech_DEF_corresponding,
        tech_DEF_corresponding_unit: formData.tech_DEF_corresponding_unit,
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
      tech_type: "1", // 1 2
      tech_similarity: "SSS", //  SSS  SAS
      tech_ABC_f: "19",
      tech_ABC_f_unit: "cm",
      tech_ABC_f_deg_rad: "rad",
      tech_ABC_s: "17",
      tech_ABC_s_unit: "cm",
      tech_ABC_s_deg_rad: "rad",
      tech_ABC_t: "15",
      tech_ABC_t_unit: "cm",
      tech_ABC_t_deg_rad: "rad",
      tech_ABC_corresponding: "19",
      tech_ABC_corresponding_unit: "cm",
      tech_scale_factor: "14",
      tech_DEF_f: "19",
      tech_DEF_f_unit: "cm",
      tech_DEF_f_deg_rad: "rad",
      tech_DEF_s: "17",
      tech_DEF_s_unit: "cm",
      tech_DEF_s_deg_rad: "rad",
      tech_DEF_t: "15",
      tech_DEF_t_unit: "cm",
      tech_DEF_t_deg_rad: "rad",
      tech_DEF_corresponding: "21",
      tech_DEF_corresponding_unit: "kg",
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
    setFormData((prev) => ({ ...prev, tech_ABC_f_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ABC_f_deg_rad: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ABC_s_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ABC_s_deg_rad: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ABC_t_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ABC_t_deg_rad: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ABC_corresponding_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_DEF_f_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_DEF_f_deg_rad: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_DEF_s_unit: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };

  //dropdown states
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_DEF_s_deg_rad: unit }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };

  //dropdown states
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_DEF_t_unit: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };

  //dropdown states
  const [dropdownVisible12, setDropdownVisible12] = useState(false);

  const setUnitHandler12 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_DEF_t_deg_rad: unit }));
    setDropdownVisible12(false);
  };

  const toggleDropdown12 = () => {
    setDropdownVisible12(!dropdownVisible12);
  };

  //dropdown states
  const [dropdownVisible13, setDropdownVisible13] = useState(false);

  const setUnitHandler13 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_DEF_corresponding_unit: unit }));
    setDropdownVisible13(false);
  };

  const toggleDropdown13 = () => {
    setDropdownVisible13(!dropdownVisible13);
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_type == "1" && (
                <>
                  <div className="col-span-12" id="similarity_criterion_select">
                    <label htmlFor="tech_similarity" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_similarity"
                        id="tech_similarity"
                        value={formData.tech_similarity}
                        onChange={handleChange}
                      >
                        <option value="SSS">
                          {data?.payload?.tech_lang_keys["5"]} (SSS)
                        </option>
                        <option value="SAS">
                          {data?.payload?.tech_lang_keys["6"]} (SAS)
                        </option>
                        <option value="ASA">
                          {data?.payload?.tech_lang_keys["7"]} (ASA)
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <p className="col-span-12 text-[18px]">
                <strong>△ABC</strong>
              </p>
              {((formData.tech_type == "1" &&
                formData.tech_similarity == "SSS") ||
                (formData.tech_type == "1" &&
                  formData.tech_similarity == "SAS") ||
                formData.tech_type == "2") && (
                <>
                  <div className="col-span-12 md:col-span-4 lg:col-span-4 ABC_f_input">
                    <label htmlFor="tech_ABC_f" className="label">
                      AB (a):{" "}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ABC_f"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ABC_f}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_ABC_f_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "millimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nmi", value: "nmi" },
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

              {formData.tech_type == "1" &&
                formData.tech_similarity == "ASA" && (
                  <>
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 ABC_f_input">
                      <label htmlFor="tech_ABC_f" className="label">
                        {" "}
                        AB (a):{" "}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_ABC_f"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_ABC_f}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_ABC_f_deg_rad} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "degrees (deg)", value: "deg" },
                              { label: "radians (rad)", value: "rad" },
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

              {((formData.tech_type == "1" &&
                formData.tech_similarity == "SSS") ||
                (formData.tech_type == "1" &&
                  formData.tech_similarity == "SAS") ||
                formData.tech_type == "2") && (
                <>
                  <div className="col-span-12 md:col-span-4 lg:col-span-4 ABC_f_input">
                    <label htmlFor="tech_ABC_s" className="label">
                      BC (b):{" "}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ABC_s"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ABC_s}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_ABC_s_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "millimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nmi", value: "nmi" },
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

              {formData.tech_type == "1" &&
                formData.tech_similarity == "ASA" && (
                  <>
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 ABC_f_input">
                      <label htmlFor="tech_ABC_s" className="label">
                        {" "}
                        BC (b):{" "}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_ABC_s"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_ABC_s}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_ABC_s_deg_rad} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "degrees (deg)", value: "deg" },
                              { label: "radians (rad)", value: "rad" },
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

              {((formData.tech_type == "1" &&
                formData.tech_similarity == "SSS") ||
                formData.tech_type == "2") && (
                <>
                  <div className="col-span-12 md:col-span-4 lg:col-span-4 ABC_f_input">
                    <label htmlFor="tech_ABC_t" className="label">
                      AC (c):{" "}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ABC_t"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ABC_t}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_ABC_t_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "millimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nmi", value: "nmi" },
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

              {formData.tech_type == "1" &&
                formData.tech_similarity == "SAS" && (
                  <>
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 ABC_f_input">
                      <label htmlFor="tech_ABC_t" className="label">
                        {" "}
                        ∠BAC (α₁){" "}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_ABC_t"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_ABC_t}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown5}
                        >
                          {formData.tech_ABC_t_deg_rad} ▾
                        </label>
                        {dropdownVisible5 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "degrees (deg)", value: "deg" },
                              { label: "radians (rad)", value: "rad" },
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

              {formData.tech_type == "1" &&
                formData.tech_similarity == "ASA" && (
                  <>
                    <div className="col-span-12 ABC_f_input">
                      <label htmlFor="tech_ABC_corresponding" className="label">
                        {data?.payload?.tech_lang_keys["8"]} △ABC:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_ABC_corresponding"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_ABC_corresponding}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown6}
                        >
                          {formData.tech_ABC_corresponding_unit} ▾
                        </label>
                        {dropdownVisible6 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimeters (mm)", value: "mm" },
                              { label: "centimeters (cm)", value: "cm" },
                              { label: "meters (m)", value: "m" },
                              { label: "kilometers (km)", value: "km" },
                              { label: "inches (in)", value: "in" },
                              { label: "feets (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
                              { label: "miles (mi)", value: "mi" },
                              { label: "nmi", value: "nmi" },
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

              {formData.tech_type == "2" && (
                <>
                  <div
                    className="col-span-12 md:col-span-4 lg:col-span-4 "
                    id="scale_factor_input"
                  >
                    <label htmlFor="tech_scale_factor" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_scale_factor"
                        id="tech_scale_factor"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_scale_factor}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_type == "1" && (
                <>
                  <p className="col-span-12 text-[18px] DEF_inputs">
                    <strong>△DEF</strong>
                  </p>
                </>
              )}

              {((formData.tech_type == "1" &&
                formData.tech_similarity == "SSS") ||
                (formData.tech_type == "1" &&
                  formData.tech_similarity == "SAS")) && (
                <>
                  <div className="col-span-12 md:col-span-4 lg:col-span-4 DEF_f_input">
                    <label htmlFor="tech_DEF_f" className="label">
                      DE (d):{" "}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_DEF_f"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_DEF_f}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown7}
                      >
                        {formData.tech_DEF_f_unit} ▾
                      </label>
                      {dropdownVisible7 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "millimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nmi", value: "nmi" },
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
              {formData.tech_type == "1" &&
                formData.tech_similarity == "ASA" && (
                  <>
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 DEF_f_input">
                      <label htmlFor="tech_DEF_f" className="label">
                        {" "}
                        DE (d):{" "}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_DEF_f"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_DEF_f}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown8}
                        >
                          {formData.tech_DEF_f_deg_rad} ▾
                        </label>
                        {dropdownVisible8 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "degrees (deg)", value: "deg" },
                              { label: "radians (rad)", value: "rad" },
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

              {((formData.tech_type == "1" &&
                formData.tech_similarity == "SSS") ||
                (formData.tech_type == "1" &&
                  formData.tech_similarity == "SAS")) && (
                <>
                  <div className="col-span-12 md:col-span-4 lg:col-span-4 DEF_s_input">
                    <label htmlFor="tech_DEF_s" className="label">
                      EF (e):{" "}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_DEF_s"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_DEF_s}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown9}
                      >
                        {formData.tech_DEF_s_unit} ▾
                      </label>
                      {dropdownVisible9 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "millimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "inches (in)", value: "in" },
                            { label: "feets (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nmi", value: "nmi" },
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

              {formData.tech_type == "1" &&
                formData.tech_similarity == "ASA" && (
                  <>
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 DEF_s_input">
                      <label htmlFor="tech_DEF_s" className="label">
                        {" "}
                        EF (e):{" "}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_DEF_s"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_DEF_s}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown10}
                        >
                          {formData.tech_DEF_s_deg_rad} ▾
                        </label>
                        {dropdownVisible10 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "degrees (deg)", value: "deg" },
                              { label: "radians (rad)", value: "rad" },
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

              {formData.tech_type == "1" &&
                formData.tech_similarity == "SSS" && (
                  <>
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 DEF_inputs">
                      <label htmlFor="tech_DEF_t" className="label">
                        DF (f):{" "}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_DEF_t"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_DEF_t}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown11}
                        >
                          {formData.tech_DEF_t_unit} ▾
                        </label>
                        {dropdownVisible11 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimeters (mm)", value: "mm" },
                              { label: "centimeters (cm)", value: "cm" },
                              { label: "meters (m)", value: "m" },
                              { label: "kilometers (km)", value: "km" },
                              { label: "inches (in)", value: "in" },
                              { label: "feets (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
                              { label: "miles (mi)", value: "mi" },
                              { label: "nmi", value: "nmi" },
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

              {formData.tech_type == "1" &&
                formData.tech_similarity == "SAS" && (
                  <>
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 DEF_inputs">
                      <label htmlFor="tech_DEF_t" className="label">
                        {" "}
                        ∠EDF (α₂){" "}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_DEF_t"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_DEF_t}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown12}
                        >
                          {formData.tech_DEF_t_deg_rad} ▾
                        </label>
                        {dropdownVisible12 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "degrees (deg)", value: "deg" },
                              { label: "radians (rad)", value: "rad" },
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

              {formData.tech_type == "1" &&
                formData.tech_similarity == "ASA" && (
                  <>
                    <div className="col-span-12  DEF_inputs">
                      <label htmlFor="tech_DEF_corresponding" className="label">
                        {data?.payload?.tech_lang_keys["8"]} △DEF:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_DEF_corresponding"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_DEF_corresponding}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown13}
                        >
                          {formData.tech_DEF_corresponding_unit} ▾
                        </label>
                        {dropdownVisible13 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimeters (mm)", value: "mm" },
                              { label: "centimeters (cm)", value: "cm" },
                              { label: "meters (m)", value: "m" },
                              { label: "kilometers (km)", value: "km" },
                              { label: "inches (in)", value: "in" },
                              { label: "feets (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
                              { label: "miles (mi)", value: "mi" },
                              { label: "nmi", value: "nmi" },
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[90%] lg:w-[60%] overfow-auto mt-2">
                          <table className="w-full text-[]16px">
                            <tbody>
                              {formData?.tech_type === "2" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[13]} △ABC
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      △ABC {result?.tech_ABC_area_ans} (cm²)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[14]} △ABC
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      △ABC {result?.tech_ABC_perimeter_ans} (cm)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>DE (d)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      △ABC {result?.tech_DEF_f_ans} (cm)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>EF (e)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      △ABC {result?.tech_DEF_s_ans} (cm)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>DF (f)</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      △ABC {result?.tech_DEF_t_ans} (cm)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[13]} △DEF
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      △ABC {result?.tech_DEF_area_ans} (cm²)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="50%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[14]} △DEF
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      △ABC {result?.tech_DEF_perimeter_ans} (cm)
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys[10]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      △ABC {result?.tech_symbol} △DEF
                                    </td>
                                  </tr>
                                  {formData?.tech_similarity == "ASA" &&
                                    result?.tech_jawab == "equal" && (
                                      <>
                                        <tr>
                                          <td
                                            className="py-2 border-b"
                                            width="60%"
                                          >
                                            <strong>
                                              {data?.payload?.tech_lang_keys[9]}{" "}
                                              (k)
                                            </strong>
                                          </td>
                                          <td className="py-2 border-b">
                                            {result?.tech_scale_ans}
                                          </td>
                                        </tr>
                                      </>
                                    )}
                                  {formData?.tech_similarity == "ASA" && (
                                    <>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>∠ACB (γ₁)</strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_ACB_jawab} (deg)
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="py-2 border-b"
                                          width="60%"
                                        >
                                          <strong>∠DFE (γ₂)</strong>
                                        </td>
                                        <td className="py-2 border-b">
                                          {result?.tech_DEF_jawab} (deg)
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                        {formData?.tech_type == "1" && (
                          <p className="mt-2">
                            {result?.tech_jawab == "equal"
                              ? data?.payload?.tech_lang_keys[11]
                              : data?.payload?.tech_lang_keys[12]}
                          </p>
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

export default SimilarTrianglesCalculator;
