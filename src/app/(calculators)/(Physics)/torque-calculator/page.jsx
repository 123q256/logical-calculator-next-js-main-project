"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTorqueCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TorqueCalculator = () => {
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
    tech_to: "2",
    tech_distance: "5",
    tech_dis_u: "m",
    tech_force: "6",
    tech_for_u: "N",
    tech_angle: "",
    tech_ang_u: "deg",
    tech_torque: "",
    tech_tor_u: "Nm",
    tech_loop: "1",
    tech_angle_c: "2",
    tech_angc_u: "deg",
    tech_current: "3",
    tech_cur_u: "A",
    tech_area: "4",
    tech_area_u: "m²",
    tech_mag: "5",
    tech_mag_u: "T",
    tech_tor: "",
    tech_torc_u: "Nm",
    tech_ax: "00",
    tech_ay: "00",
    tech_az: "00",
    tech_bx: "00",
    tech_by: "00",
    tech_bz: "00",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTorqueCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_to) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_to: formData.tech_to,
        tech_distance: formData.tech_distance,
        tech_dis_u: formData.tech_dis_u,
        tech_force: formData.tech_force,
        tech_for_u: formData.tech_for_u,
        tech_angle: formData.tech_angle,
        tech_ang_u: formData.tech_ang_u,
        tech_torque: formData.tech_torque,
        tech_tor_u: formData.tech_tor_u,
        tech_loop: formData.tech_loop,
        tech_angle_c: formData.tech_angle_c,
        tech_angc_u: formData.tech_angc_u,
        tech_current: formData.tech_current,
        tech_cur_u: formData.tech_cur_u,
        tech_area: formData.tech_area,
        tech_area_u: formData.tech_area_u,
        tech_mag: formData.tech_mag,
        tech_mag_u: formData.tech_mag_u,
        tech_tor: formData.tech_tor,
        tech_torc_u: formData.tech_torc_u,
        tech_ax: formData.tech_ax,
        tech_ay: formData.tech_ay,
        tech_az: formData.tech_az,
        tech_bx: formData.tech_bx,
        tech_by: formData.tech_by,
        tech_bz: formData.tech_bz,
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
      tech_to: "2",
      tech_distance: "5",
      tech_dis_u: "m",
      tech_force: "6",
      tech_for_u: "N",
      tech_angle: "",
      tech_ang_u: "deg",
      tech_torque: "",
      tech_tor_u: "Nm",
      tech_loop: "1",
      tech_angle_c: "2",
      tech_angc_u: "deg",
      tech_current: "3",
      tech_cur_u: "A",
      tech_area: "4",
      tech_area_u: "m²",
      tech_mag: "5",
      tech_mag_u: "T",
      tech_tor: "",
      tech_torc_u: "Nm",
      tech_ax: "00",
      tech_ay: "00",
      tech_az: "00",
      tech_bx: "00",
      tech_by: "00",
      tech_bz: "00",
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
    setFormData((prev) => ({ ...prev, tech_dis_u: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_for_u: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ang_u: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tor_u: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };
  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angc_u: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };
  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cur_u: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };
  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_u: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mag_u: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };
  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_torc_u: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_to" className="label">
                  To Calculate:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_to"
                    id="tech_to"
                    value={formData.tech_to}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["tor"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["coil"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["vector"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {formData.tech_to == "1" && (
              <>
                <div className="grid grid-cols-12 mt-2  gap-4 my-3">
                  <p className="col-span-12  px-2">
                    <strong>Note:</strong> Please! enter any three values to
                    know the fourth one.
                  </p>
                </div>
                <div className="grid grid-cols-12  gap-4 torque">
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_distance" className="label">
                      {data?.payload?.tech_lang_keys["dis"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_distance"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_distance}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_dis_u} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m", value: "m" },
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
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
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_force" className="label">
                      {data?.payload?.tech_lang_keys["for"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_force"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_force}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_for_u} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "N", value: "N" },
                            { label: "kN", value: "kN" },
                            { label: "MN", value: "MN" },
                            { label: "GN", value: "GN" },
                            { label: "TN", value: "TN" },
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
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_angle" className="label">
                      {data?.payload?.tech_lang_keys["ang"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_angle"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_angle}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_ang_u} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "deg", value: "deg" },
                            { label: "rad", value: "rad" },
                            { label: "gon", value: "gon" },
                            { label: "tr", value: "tr" },
                            { label: "arcmin", value: "arcmin" },
                            { label: "arcsec", value: "arcsec" },
                            { label: "mrad", value: "mrad" },
                            { label: "μrad", value: "μrad" },
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
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_torque" className="label">
                      {data?.payload?.tech_lang_keys["tor"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_torque"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_torque}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_tor_u} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Nm", value: "Nm" },
                            { label: "kg-cm", value: "kg-cm" },
                            { label: "J/rad", value: "J/rad" },
                            { label: "ft-lb", value: "ft-lb" },
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
            {formData.tech_to == "2" && (
              <>
                <div className="grid grid-cols-12 gap-4 mt-3">
                  <p className="col-span-12 px-2">
                    <strong>Note:</strong> Please! enter any five values to know
                    the sixth one.
                  </p>
                </div>
                <div className="grid grid-cols-12 gap-4  mt-1">
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_loop" className="label">
                      {data?.payload?.tech_lang_keys["loop"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_loop"
                        id="tech_loop"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_loop}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_angle_c" className="label">
                      {data?.payload?.tech_lang_keys["ang"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_angle_c"
                        step="any"
                        className="mt-1 input"
                        min="1"
                        value={formData.tech_angle_c}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_angc_u} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "deg", value: "deg" },
                            { label: "rad", value: "rad" },
                            { label: "gon", value: "gon" },
                            { label: "tr", value: "tr" },
                            { label: "arcmin", value: "arcmin" },
                            { label: "arcsec", value: "arcsec" },
                            { label: "mrad", value: "mrad" },
                            { label: "μrad", value: "μrad" },
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
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_current" className="label">
                      {data?.payload?.tech_lang_keys["cur"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_current"
                        step="any"
                        className="mt-1 input"
                        min="1"
                        value={formData.tech_current}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_cur_u} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "A", value: "A" },
                            { label: "mA", value: "mA" },
                            { label: "kA", value: "kA" },
                            { label: "μA", value: "μA" },
                            { label: "boit", value: "boit" },
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
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_area" className="label">
                      {data?.payload?.tech_lang_keys["area"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_area"
                        step="any"
                        className="mt-1 input"
                        min="1"
                        value={formData.tech_area}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_area_u} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m²", value: "m²" },
                            { label: "km²", value: "km²" },
                            { label: "Mile²", value: "Mile²" },
                            { label: "ac", value: "ac" },
                            { label: "yd²", value: "yd²" },
                            { label: "ft²", value: "ft²" },
                            { label: "in²", value: "in²" },
                            { label: "cm²", value: "cm²" },
                            { label: "mm²", value: "mm²" },
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
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_mag" className="label">
                      {data?.payload?.tech_lang_keys["mag"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mag"
                        step="any"
                        className="mt-1 input"
                        min="1"
                        value={formData.tech_mag}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown7}
                      >
                        {formData.tech_mag_u} ▾
                      </label>
                      {dropdownVisible7 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "T", value: "T" },
                            { label: "mT", value: "mT" },
                            { label: "μT", value: "μT" },
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
                  <div className="col-span-12 md:col-span-6">
                    <label htmlFor="tech_tor" className="label">
                      {data?.payload?.tech_lang_keys["tor"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_tor"
                        step="any"
                        className="mt-1 input"
                        min="1"
                        value={formData.tech_tor}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown8}
                      >
                        {formData.tech_torc_u} ▾
                      </label>
                      {dropdownVisible8 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "Nm", value: "Nm" },
                            { label: "kg-cm", value: "kg-cm" },
                            { label: "J/rad", value: "J/rad" },
                            { label: "ft-lb", value: "ft-lb" },
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
                </div>
              </>
            )}

            {formData.tech_to == "3" && (
              <>
                <div className="grid grid-cols-12  gap-4 my-3">
                  <p className="col-span-12 px-2">
                    <strong>{data?.payload?.tech_lang_keys["av"]}, r:</strong>
                  </p>
                </div>
                <div className="grid grid-cols-12  gap-4 ">
                  <div className="col-span-4 ">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_ax"
                        id="tech_ax"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_ax}
                        onChange={handleChange}
                      />
                      <span className="input_unit">i</span>
                    </div>
                  </div>
                  <div className="col-span-4 ">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_ay"
                        id="tech_ay"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_ay}
                        onChange={handleChange}
                      />
                      <span className="input_unit">i</span>
                    </div>
                  </div>
                  <div className="col-span-4 ">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_az"
                        id="tech_az"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_az}
                        onChange={handleChange}
                      />
                      <span className="input_unit">i</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 mt-3  gap-4 ">
                  <div className="space-y-2">
                    <p className="col-12">
                      <strong>{data?.payload?.tech_lang_keys["bv"]}, F:</strong>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-12  gap-4 ">
                  <div className="col-span-4 ">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bx"
                        id="tech_bx"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_bx}
                        onChange={handleChange}
                      />
                      <span className="input_unit">i</span>
                    </div>
                  </div>
                  <div className="col-span-4 ">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_by"
                        id="tech_by"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_by}
                        onChange={handleChange}
                      />
                      <span className="input_unit">j</span>
                    </div>
                  </div>
                  <div className="col-span-4 ">
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_bz"
                        id="tech_bz"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_bz}
                        onChange={handleChange}
                      />
                      <span className="input_unit">k</span>
                    </div>
                  </div>
                </div>
              </>
            )}
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
                    <div className="w-full bg-light-blue p-3 rounded-lg mt-3">
                      <div className="lg:w-7/12 mt-2">
                        {formData?.tech_to == 1 && (
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["dis"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_dis}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["for"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_force}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["ang"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_angle}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["tor"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_tor}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                        {formData?.tech_to == 2 && (
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["loop"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_loop}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["ang"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_angle}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["cur"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_current}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["area"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_area}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["mag"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_mag}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b border-[#99EA48] w-7/10">
                                  {data?.payload?.tech_lang_keys["tor"]}
                                </td>
                                <td className="py-2 border-b border-[#99EA48]">
                                  <strong>{result?.tech_tor}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                        {formData?.tech_to == 3 && (
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["vector"]} ={" "}
                            <strong className="text-black">
                              {result?.tech_ans}
                            </strong>
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

export default TorqueCalculator;
