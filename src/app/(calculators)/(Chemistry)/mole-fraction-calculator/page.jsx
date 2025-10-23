"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMoleFractionCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MoleFractionCalculator = () => {
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
    tech_x: "3.5482",
    tech_unit_x: "Mole",
    tech_divide_x: "",
    tech_y: "1",
    tech_unit_y: "Mole",
    tech_divide_y: "",
    tech_z: "",
    tech_unit_z: "Mole",
    tech_divide_z: "",
    tech_a: "",
    tech_unit_a: "Mole",
    tech_divide_a: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMoleFractionCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.tech_x || !formData.tech_y  || !formData.tech_z ) {
    //   setFormError("Please fill in input.");
    //   return;
    // }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_x: Number(formData.tech_x),
        tech_unit_x: formData.tech_unit_x,
        tech_divide_x: Number(formData.tech_divide_x),
        tech_y: Number(formData.tech_y),
        tech_unit_y: formData.tech_unit_y,
        tech_divide_y: Number(formData.tech_divide_y),
        tech_z: Number(formData.tech_z),
        tech_unit_z: formData.tech_unit_z,
        tech_divide_z: Number(formData.tech_divide_z),
        tech_tech_a: formData.tech_tech_a,
        tech_unit_a: formData.tech_unit_a,
        tech_divide_a: Number(formData.tech_divide_a),
      }).unwrap();
      setResult(response); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_x: "3.5482",
      tech_unit_x: "Mole",
      tech_divide_x: "",
      tech_y: "4",
      tech_unit_y: "Mole",
      tech_divide_y: "",
      tech_z: "",
      tech_unit_z: "Mole",
      tech_divide_z: "",
      tech_unit_a: "Mole",
      tech_divide_a: "",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_x: unit,
      tech_divide_x: unit === "Gram" ? prev.tech_divide_x : "", // clear if not Gram
    }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_y: unit,
      tech_divide_y: unit === "Gram" ? prev.tech_divide_y : "", // clear if not Gram
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_z: unit,
      tech_divide_z: unit === "Gram" ? prev.tech_divide_z : "", // clear if not Gram
    }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_a: unit,
      tech_divide_a: unit === "Gram" ? prev.tech_divide_a : "", // clear if not Gram
    }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  const formatNumberSmart = (num) => {
    const number = Number(num);
    if (isNaN(number)) return "0";
    return Math.abs(number) >= 1e6 || (Math.abs(number) < 1e-4 && number !== 0)
      ? number.toExponential(6)
      : number.toLocaleString(undefined, { maximumFractionDigits: 6 });
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="w-full px-2 mb-2">
              <p>
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["note"]}:
                </strong>{" "}
                {data?.payload?.tech_lang_keys["note_val"]}
              </p>
            </div>
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["sol"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_x"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_x}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit_x} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["m_u"],
                          value: "Mole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["Gram"],
                          value: "Gram",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["mili"],
                          value: "Millimole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["kilo"],
                          value: "Kilomole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["pound"],
                          value: "PoundMole",
                        },
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
              {formData.tech_unit_x === "Gram" && (
                <div className="space-y-2 divide_x ">
                  <label htmlFor="tech_divide_x" className="label">
                    {data?.payload?.tech_lang_keys["mass"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_divide_x"
                      id="tech_divide_x"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_divide_x}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 mt-2">
                <label htmlFor="tech_y" className="label">
                  {data?.payload?.tech_lang_keys["solv"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_y"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_y}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_unit_y} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["m_u"],
                          value: "Mole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["Gram"],
                          value: "Gram",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["mili"],
                          value: "Millimole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["kilo"],
                          value: "Kilomole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["pound"],
                          value: "PoundMole",
                        },
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
              {formData.tech_unit_y === "Gram" && (
                <div className="space-y-2 divide_y ">
                  <label htmlFor="tech_divide_y" className="label">
                    {data?.payload?.tech_lang_keys["mass"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_divide_y"
                      id="tech_divide_y"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_divide_y}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 mt-2">
                <label htmlFor="tech_z" className="label">
                  {data?.payload?.tech_lang_keys["solu"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_z"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_z}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_unit_z} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["m_u"],
                          value: "Mole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["Gram"],
                          value: "Gram",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["mili"],
                          value: "Millimole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["kilo"],
                          value: "Kilomole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["pound"],
                          value: "PoundMole",
                        },
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
              {formData.tech_unit_z === "Gram" && (
                <div className="space-y-2 divide_z ">
                  <label htmlFor="tech_divide_z" className="label">
                    {data?.payload?.tech_lang_keys["mass"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_divide_z"
                      id="tech_divide_z"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_divide_z}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 mt-2">
                <label htmlFor="tech_a" className="label">
                  {data?.payload?.tech_lang_keys["mole"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_a"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_a}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_unit_a} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["m_u"],
                          value: "Mole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["Gram"],
                          value: "Gram",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["mili"],
                          value: "Millimole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["kilo"],
                          value: "Kilomole",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["pound"],
                          value: "PoundMole",
                        },
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
              {formData.tech_unit_a === "Gram" && (
                <div className="space-y-2 divide_a">
                  <label htmlFor="tech_divide_a" className="label">
                    {data?.payload?.tech_lang_keys["mass"]}:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_divide_a"
                      id="tech_divide_a"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_divide_a}
                      onChange={handleChange}
                    />
                  </div>
                </div>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[50%] lg:w-[80%] overflow-auto">
                          <table className="w-full col-lg-7" cellspacing="0">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["solute"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {formatNumberSmart(result?.tech_Solute)}{" "}
                                    {data?.payload?.tech_lang_keys["m_u"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["solvent"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {formatNumberSmart(result?.tech_Solvent)}{" "}
                                    {data?.payload?.tech_lang_keys["m_u"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["solu"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {formatNumberSmart(result?.tech_sol)}{" "}
                                    {data?.payload?.tech_lang_keys["m_u"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  {data?.payload?.tech_lang_keys["mole"]}
                                </td>
                                <td className="py-2">
                                  <strong>
                                    {formatNumberSmart(result?.tech_mol)}{" "}
                                    {data?.payload?.tech_lang_keys["m_u"]}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default MoleFractionCalculator;
