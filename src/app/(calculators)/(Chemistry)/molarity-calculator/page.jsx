"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMolarityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MolarityCalculator = () => {
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
    tech_cal: "mass", // mass   vol  mol  rv
    tech_mass: "2",
    tech_mass_unit: "mg",
    tech_conc: "2",
    tech_conc_unit: "M",
    tech_mw: "4",
    tech_vol: "5",
    tech_vol_unit: "nL",
    tech_sc: "5",
    tech_sc_unit: "M",
    tech_dc: "5",
    tech_dc_unit: "mM",
    tech_dv: "3",
    tech_dv_unit: "μL",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMolarityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_cal: formData.tech_cal,
        tech_mass: formData.tech_mass,
        tech_mass_unit: formData.tech_mass_unit,
        tech_conc: formData.tech_conc,
        tech_conc_unit: formData.tech_conc_unit,
        tech_mw: formData.tech_mw,
        tech_vol: formData.tech_vol,
        tech_vol_unit: formData.tech_vol_unit,
        tech_sc: formData.tech_sc,
        tech_sc_unit: formData.tech_sc_unit,
        tech_dc: formData.tech_dc,
        tech_dc_unit: formData.tech_dc_unit,
        tech_dv: formData.tech_dv,
        tech_dv_unit: formData.tech_dv_unit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_cal: "mass", // mass   vol  mol  rv
      tech_mass: "2",
      tech_mass_unit: "mg",
      tech_conc: "2",
      tech_conc_unit: "M",
      tech_mw: "4",
      tech_vol: "5",
      tech_vol_unit: "nL",
      tech_sc: "5",
      tech_sc_unit: "M",
      tech_dc: "5",
      tech_dc_unit: "mM",
      tech_dv: "3",
      tech_dv_unit: "μL",
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
    setFormData((prev) => ({ ...prev, tech_mass_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_conc_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_vol_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sc_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dc_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dv_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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
            <div className="grid grid-cols-12 gap-1  md:gap-3">
              <div className="col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_cal" className="label">
                  {data?.payload?.tech_lang_keys["15"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal"
                    id="tech_cal"
                    value={formData.tech_cal}
                    onChange={handleChange}
                  >
                    <option value="mass">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                    <option value="vol">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="mol">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="rv">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_cal == "vol" || formData.tech_cal == "mol") && (
                <>
                  <div className="col-span-12 md:col-span-6 mass">
                    <label htmlFor="tech_mass" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mass"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mass}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_mass_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "pg", value: "pg" },
                            { label: "ng", value: "ng" },
                            { label: "μg", value: "μg" },
                            { label: "mg", value: "mg" },
                            { label: "g", value: "g" },
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
              {(formData.tech_cal == "mass" || formData.tech_cal == "vol") && (
                <>
                  <div className="col-span-12 md:col-span-6 conc ">
                    <label htmlFor="tech_conc" className="label">
                      {data?.payload?.tech_lang_keys["6"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_conc"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_conc}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_conc_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "fM", value: "fM" },
                            { label: "pM", value: "pM" },
                            { label: "nM", value: "nM" },
                            { label: "μM", value: "μM" },
                            { label: "mM", value: "mM" },
                            { label: "M", value: "M" },
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
              {(formData.tech_cal == "mass" ||
                formData.tech_cal == "vol" ||
                formData.tech_cal == "mol") && (
                <>
                  <div className="col-span-12 md:col-span-6 mw">
                    <label htmlFor="tech_mw" className="label">
                      {data?.payload?.tech_lang_keys["7"]} (g/mol):
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_mw"
                        id="tech_mw"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_mw}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_cal == "mass" || formData.tech_cal == "mol") && (
                <>
                  <div className="col-span-12 md:col-span-6 vol">
                    <label htmlFor="tech_vol" className="label">
                      {data?.payload?.tech_lang_keys["8"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_vol"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_vol}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_vol_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nL", value: "nL" },
                            { label: "μL", value: "μL" },
                            { label: "mL", value: "mL" },
                            { label: "L", value: "L" },
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
              {formData.tech_cal == "rv" && (
                <>
                  <div className="col-span-12 md:col-span-6 sc ">
                    <label htmlFor="tech_sc" className="label">
                      {data?.payload?.tech_lang_keys["9"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_sc"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_sc}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_sc_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "fM", value: "fM" },
                            { label: "pM", value: "pM" },
                            { label: "nM", value: "nM" },
                            { label: "μM", value: "μM" },
                            { label: "mM", value: "mM" },
                            { label: "M", value: "M" },
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
              {formData.tech_cal == "rv" && (
                <>
                  <div className="col-span-12 md:col-span-6 dc ">
                    <label htmlFor="tech_dc" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_dc"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_dc}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_dc_unit} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "fM", value: "fM" },
                            { label: "pM", value: "pM" },
                            { label: "nM", value: "nM" },
                            { label: "μM", value: "μM" },
                            { label: "mM", value: "mM" },
                            { label: "M", value: "M" },
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
              {formData.tech_cal == "rv" && (
                <>
                  <div className="col-span-12 md:col-span-6 dv ">
                    <label htmlFor="tech_dv" className="label">
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_dv"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_dv}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_dv_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nL", value: "nL" },
                            { label: "μL", value: "μL" },
                            { label: "mL", value: "mL" },
                            { label: "L", value: "L" },
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
                    <div className="w-full result p-3 mt-3">
                      {(() => {
                        let head = "";
                        if (formData?.tech_cal === "mass") {
                          head = data?.payload?.tech_lang_keys["5"];
                        } else if (formData?.tech_cal === "vol") {
                          head = data?.payload?.tech_lang_keys["8"];
                        } else if (formData?.tech_cal === "mol") {
                          head = data?.payload?.tech_lang_keys["12"];
                        } else if (formData?.tech_cal === "rv") {
                          head = data?.payload?.tech_lang_keys["13"];
                        }

                        return (
                          <div className="w-full">
                            <p>
                              <strong>{head}</strong>
                            </p>
                            <p
                              className="text-[32px] font-bold text-[#119154]"
                              dangerouslySetInnerHTML={{
                                __html: result?.tech_ans,
                              }}
                            ></p>

                            <p className="my-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}
                              </strong>
                            </p>

                            <div className="lg:w-[50%] md:w-[70%] overflow-auto text-[16px]">
                              <table className="w-full" cellSpacing="0">
                                <tbody>
                                  {formData?.tech_cal === "mass" ? (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_pg}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_ng}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_ug}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_g}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="py-2">{head}</td>
                                        <td className="py-2">
                                          <strong>{result?.tech_ans_kg}</strong>
                                        </td>
                                      </tr>
                                    </>
                                  ) : formData?.tech_cal === "vol" ||
                                    formData?.tech_cal === "rv" ? (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_nl}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_ul}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="py-2">{head}</td>
                                        <td className="py-2">
                                          <strong>{result?.tech_ans_l}</strong>
                                        </td>
                                      </tr>
                                    </>
                                  ) : formData?.tech_cal === "mol" ? (
                                    <>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_fm}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_pm}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_nm}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2">
                                          {head}
                                        </td>
                                        <td className="border-b py-2">
                                          <strong>{result?.tech_ans_um}</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="py-2">{head}</td>
                                        <td className="py-2">
                                          <strong>{result?.tech_ans_m}</strong>
                                        </td>
                                      </tr>
                                    </>
                                  ) : null}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}
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

export default MolarityCalculator;
