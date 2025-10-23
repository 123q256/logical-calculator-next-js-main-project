"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useElectricPotentialCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ElectricPotentialCalculator = () => {
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
    tech_potential_type: "single-point", //  single-point  multi-point  difference
    tech_charge: "0.0000004",
    tech_charge_unit: "mC",
    tech_distance: "10",
    tech_distance_unit: "nm",
    tech_U: "10",
    tech_U_unit: "eV",
    tech_points: "2",
    tech_E: "1",
    tech_Q: ["1", "3"],
    tech_unit_Q: ["mC", "mC"],
    tech_R: ["2", "4"],
    tech_unit_R: ["mC", "mC"],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useElectricPotentialCalculatorMutation();

  const [dropdownVisible, setDropdownVisible] = useState(
    formData.tech_Q.map(() => ({ Q: false, R: false }))
  );

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFormData((prev) => {
      const updated = { ...prev };

      if (field !== null && index !== null) {
        // Array field handle karo
        updated[field][index] = value;
      } else if (name) {
        // Simple field handle karo
        updated[name] = value;
      }

      return updated;
    });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_potential_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_potential_type: formData.tech_potential_type,
        tech_charge: formData.tech_charge,
        tech_charge_unit: formData.tech_charge_unit,
        tech_distance: formData.tech_distance,
        tech_distance_unit: formData.tech_distance_unit,
        tech_U: formData.tech_U,
        tech_U_unit: formData.tech_U_unit,
        tech_points: formData.tech_points,
        tech_E: formData.tech_E,
        tech_Q: formData.tech_Q,
        tech_unit_Q: formData.tech_unit_Q,
        tech_R: formData.tech_R,
        tech_unit_R: formData.tech_unit_R,
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
      tech_potential_type: "single-point", //  single-point  multi-point  difference
      tech_charge: "0.0000004",
      tech_charge_unit: "mC",
      tech_distance: "10",
      tech_distance_unit: "nm",
      tech_U: "10",
      tech_U_unit: "eV",
      tech_points: "2",
      tech_E: "1",
      tech_Q: ["1", "3"],
      tech_unit_Q: ["mC", "mC"],
      tech_R: ["2", "4"],
      tech_unit_R: ["mC", "mC"],
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
    setFormData((prev) => ({ ...prev, tech_charge_unit: unit }));
    setDropdownVisible0(false);
  };

  const toggleDropdown0 = () => {
    setDropdownVisible0(!dropdownVisible0);
  };

  //dropdown states
  const [dropdownVisible01, setDropdownVisible01] = useState(false);

  const setUnitHandler01 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_distance_unit: unit }));
    setDropdownVisible01(false);
  };

  const toggleDropdown01 = () => {
    setDropdownVisible01(!dropdownVisible01);
  };

  //dropdown states
  const [dropdownVisible02, setDropdownVisible02] = useState(false);

  const setUnitHandler02 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_U_unit: unit }));
    setDropdownVisible02(false);
  };

  const toggleDropdown02 = () => {
    setDropdownVisible02(!dropdownVisible02);
  };

  const toggleDropdown = (index, type) => {
    setDropdownVisible((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [type]: !item[type] } : item
      )
    );
  };

  const setUnitHandler = (index, type, unit) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (type === "Q") {
        updated.tech_unit_Q[index] = unit;
      } else {
        updated.tech_unit_R[index] = unit;
      }
      return updated;
    });
    setDropdownVisible((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [type]: false } : item))
    );
  };

  const addPointCharge = () => {
    setFormData((prev) => ({
      ...prev,
      tech_Q: [...prev.tech_Q, ""],
      tech_unit_Q: [...prev.tech_unit_Q, "C"],
      tech_R: [...prev.tech_R, ""],
      tech_unit_R: [...prev.tech_unit_R, "C"],
    }));
    setDropdownVisible((prev) => [...prev, { Q: false, R: false }]);
  };

  const removePointCharge = (index) => {
    setFormData((prev) => ({
      ...prev, // baaki formData ka structure preserve karo
      tech_Q: prev.tech_Q.filter((_, i) => i !== index),
      tech_unit_Q: prev.tech_unit_Q.filter((_, i) => i !== index),
      tech_R: prev.tech_R.filter((_, i) => i !== index),
      tech_unit_R: prev.tech_unit_R.filter((_, i) => i !== index),
    }));

    // Agar dropdownVisible har charge ke liye alag state hai
    setDropdownVisible((prev) => prev.filter((_, i) => i !== index));
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
            <div className="grid grid-cols-12  mt-3  gap-2">
              <div className="col-span-12 mx-auto px-2">
                <label htmlFor="tech_potential_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_potential_type"
                    id="tech_potential_type"
                    value={formData.tech_potential_type}
                    onChange={handleChange}
                  >
                    <option value="single-point">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="multi-point">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="difference">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 text-center my-3">
                {formData.tech_potential_type == "multi-point" && (
                  <>
                    <img
                      className="set_img mx-auto"
                      src="/images/multi.png"
                      alt="Potential type image"
                      width="150px"
                      height="100%"
                    />
                  </>
                )}
                {formData.tech_potential_type == "single-point" && (
                  <>
                    <img
                      className="set_img mx-auto"
                      src="/images/oldsingle.png"
                      alt="Potential type image"
                      width="150px"
                      height="100%"
                    />
                  </>
                )}
              </div>
              {(formData.tech_potential_type == "single-point" ||
                formData.tech_potential_type == "difference") && (
                <>
                  <div className="col-span-6 charge">
                    <label htmlFor="tech_charge" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (q):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_charge"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_charge}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown0}
                      >
                        {formData.tech_charge_unit} ▾
                      </label>
                      {dropdownVisible0 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "PC", value: "PC" },
                            { label: "nC", value: "nC" },
                            { label: "gon", value: "gon" },
                            { label: "μC", value: "μC" },
                            { label: "mC", value: "mC" },
                            { label: "C", value: "C" },
                            { label: "e", value: "e" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler0(unit.value)}
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
              {formData.tech_potential_type == "single-point" && (
                <>
                  <div className="col-span-6 distance">
                    <label htmlFor="tech_distance" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (q):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_distance"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_distance}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown01}
                      >
                        {formData.tech_distance_unit} ▾
                      </label>
                      {dropdownVisible01 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nm", value: "nm" },
                            { label: "μm", value: "μm" },
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler01(unit.value)}
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
              {formData.tech_potential_type == "difference" && (
                <>
                  <div className="col-span-6 U">
                    <label htmlFor="tech_U" className="label">
                      {data?.payload?.tech_lang_keys["5"]} (q):
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_U"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_U}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown02}
                      >
                        {formData.tech_U_unit} ▾
                      </label>
                      {dropdownVisible02 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "j", value: "j" },
                            { label: "kJ", value: "kJ" },
                            { label: "MJ", value: "MJ" },
                            { label: "Wh", value: "Wh" },
                            { label: "kWh", value: "kWh" },
                            { label: "kWh", value: "kWh" },
                            { label: "kcal", value: "kcal" },
                            { label: "eV", value: "eV" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler02(unit.value)}
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
              {formData.tech_potential_type == "multi-point" && (
                <>
                  <div className="col-span-6 points">
                    <label htmlFor="tech_points" className="label">
                      {data?.payload?.tech_lang_keys["8"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_points"
                        id="tech_points"
                        min="1"
                        max="20"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_points}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_potential_type == "single-point" ||
                formData.tech_potential_type == "difference" ||
                formData.tech_potential_type == "multi-point") && (
                <>
                  <div className="col-span-6 E">
                    <label htmlFor="tech_E" className="label">
                      {data?.payload?.tech_lang_keys["9"]} (ϵᵣ):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_E"
                        id="tech_E"
                        min="1"
                        max="20"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_E}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_potential_type == "multi-point" && (
                <>
                  <div className="col-span-12 point_charge">
                    {formData.tech_Q.map((_, index) => (
                      <div key={index} className="grid grid-cols-12  gap-2">
                        <div className="col-span-6 ">
                          <label htmlFor={`tech_Q_${index}`} className="label">
                            q<sub className="text-blue">{index + 1}</sub>:
                          </label>
                          <div className="relative w-full">
                            <input
                              type="number"
                              name={`tech_Q_${index}`}
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_Q[index]}
                              placeholder="00"
                              onChange={(e) => handleChange(e, index, "tech_Q")}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={() => toggleDropdown(index, "Q")}
                            >
                              {formData.tech_unit_Q[index]} ▾
                            </label>
                            {dropdownVisible[index]?.Q && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {["PC", "nC", "mm", "μC", "mC", "C", "e"].map(
                                  (unit, i) => (
                                    <p
                                      key={i}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler(index, "Q", unit)
                                      }
                                    >
                                      {unit}
                                    </p>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-6 ">
                          <div className="flex justify-between">
                            <div>
                              <label
                                htmlFor={`tech_R_${index}`}
                                className="label"
                              >
                                r<sub className="text-blue">{index + 1}</sub>:
                              </label>
                            </div>
                            <div className="col-span-12 text-right px-2 cursor-pointer">
                              <img
                                src="/images/delete_btn.png"
                                alt="delete"
                                className="w-4 h-4"
                                onClick={() => removePointCharge(index)}
                              />
                            </div>
                          </div>

                          <div className="relative w-full">
                            <input
                              type="number"
                              name={`tech_R_${index}`}
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_R[index]}
                              placeholder="00"
                              onChange={(e) => handleChange(e, index, "tech_R")}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-4"
                              onClick={() => toggleDropdown(index, "R")}
                            >
                              {formData.tech_unit_R[index]} ▾
                            </label>
                            {dropdownVisible[index]?.R && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {["PC", "nC", "mm", "μC", "mC", "C", "e"].map(
                                  (unit, i) => (
                                    <p
                                      key={i}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler(index, "R", unit)
                                      }
                                    >
                                      {unit}
                                    </p>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 px-2">
                      <button
                        type="button"
                        className="px-4 py-2 font-semibold text-[#99EA48] bg-black text-[12px] rounded-[30px] focus:outline-none focus:ring-2 "
                        onClick={addPointCharge}
                      >
                        + Add Point Charge
                      </button>
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
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-[18px]">
                            <strong>
                              {formData?.tech_potential_type === "difference"
                                ? `${data?.payload?.tech_lang_keys["10"]} (∆V)`
                                : `${data?.payload?.tech_lang_keys["11"]} (V)`}
                            </strong>
                          </p>
                          <div className="flex justify-center">
                            <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                              <strong
                                dangerouslySetInnerHTML={{
                                  __html: result.tech_answer,
                                }}
                              />
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

export default ElectricPotentialCalculator;
