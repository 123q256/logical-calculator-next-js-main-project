"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const isNum = (val) => val !== undefined && val !== null && !isNaN(Number(val));

const KinAnsTbl = ({
  result,
  ans1,
  ans11,
  ans2,
  ans22,
  knw1,
  knw11,
  knw2,
  knw22,
  knw3,
  knw33,
  frm1,
  frm2,
  inpKey,
}) => (
  <>
    <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
      <table className="w-full text-[18px]">
        <tbody>
          <tr>
            <td className="py-2 border-b" width="50%">
              <strong>{ans1}</strong>
            </td>
            <td className="py-2 border-b">{result?.[ans11]}</td>
          </tr>
          <tr>
            <td className="py-2 border-b" width="50%">
              <strong>{ans2}</strong>
            </td>
            <td className="py-2 border-b">{result?.[ans22]}</td>
          </tr>
          <tr>
            <td className="py-2 border-b" width="50%">
              <BlockMath math={frm1} />
            </td>
            <td className="py-2 border-b">
              <BlockMath math={frm2} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
      <p className="col">
        <strong>{inpKey}</strong>
      </p>
      <table className="w-full text-[18px]">
        <tbody>
          <tr>
            <td className="py-2 border-b" width="50%">
              {knw1}
            </td>
            <td className="py-2 border-b">
              <strong>{result?.[knw11]}</strong>
            </td>
          </tr>
          <tr>
            <td className="py-2 border-b" width="50%">
              {knw2}
            </td>
            <td className="py-2 border-b">
              <strong>{result?.[knw22]}</strong>
            </td>
          </tr>
          <tr>
            <td className="py-2 border-b" width="50%">
              {knw3}
            </td>
            <td className="py-2 border-b">
              <strong>{result?.[knw33]}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useKinematicsCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const KinematicsCalculator = () => {
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
    tech_known: "1",
    tech_cdis: "",
    tech_cdisU: "cm",
    tech_iv: "",
    tech_ivU: "m/s",
    tech_fv: "",
    tech_fvU: "m/s",
    tech_ct: "",
    tech_ctU: "sec",
    tech_cac: "",
    tech_cacU: "m/s²",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useKinematicsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // agar tech_known change ho raha hai to reset specific fields
    if (name === "tech_known") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        tech_cdis: "",
        tech_cdisU: "cm",
        tech_iv: "",
        tech_ivU: "m/s",
        tech_fv: "",
        tech_fvU: "m/s",
        tech_ct: "",
        tech_ctU: "sec",
        tech_cac: "",
        tech_cacU: "m/s²",
      }));
    } else {
      // otherwise normal update
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_known) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_known: formData.tech_known,
        tech_cdis: Number(formData.tech_cdis),
        tech_cdisU: formData.tech_cdisU,
        tech_iv: Number(formData.tech_iv),
        tech_ivU: formData.tech_ivU,
        tech_fv: Number(formData.tech_fv),
        tech_fvU: formData.tech_fvU,
        tech_ct: Number(formData.tech_ct),
        tech_ctU: formData.tech_ctU,
        tech_cac: Number(formData.tech_cac),
        tech_cacU: formData.tech_cacU,
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
      tech_known: "1",
      tech_cdis: "",
      tech_cdisU: "cm",
      tech_iv: "",
      tech_ivU: "m/s",
      tech_fv: "",
      tech_fvU: "m/s",
      tech_ct: "",
      tech_ctU: "m/s",
      tech_cac: "",
      tech_cacU: "m/s²",
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
    setFormData((prev) => ({ ...prev, tech_cdisU: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ivU: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fvU: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ctU: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cacU: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  const keys = data?.payload?.tech_lang_keys;

  const show = (props) => <KinAnsTbl {...props} />;

  const equations = {
    eq1: ["s = \\frac{1}{2}(v + u)t", "a = \\frac{(v-u)}{t}"],
    eq2: ["t = \\frac{(v-u)}{a}", "s = \\frac{1}{2}(v + u)t"],
    eq3: ["u = v-at", "s = \\frac{1}{2}(v + u)t"],
    eq4: ["v = u+at", "s = \\frac{1}{2}(v + u)t"],
    eq5: ["v = \\frac{2s}{t}-u", "a = \\frac{v-u}{t}"],
    eq6: ["u = \\frac{2s}{t}-v", "a = \\frac{v-u}{t}"],
    eq7: ["v = \\sqrt{u^2 + 2as}", "t = \\frac{v-u}{a}"],
    eq8: ["u = \\sqrt{v^2 - 2as}", "t = \\frac{v-u}{a}"],
    eq9: ["t = \\frac{2s}{v+u}", "a = \\frac{v-u}{t}"],
    eq10: ["u = \\frac{s}{t} - \\frac{1}{2}at", "v = u+at"],
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
            <div className="grid grid-cols-12 mt-3 gap-1  md:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_known" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_known"
                    id="tech_known"
                    value={formData.tech_known}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {" "}
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {" "}
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {" "}
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="4">
                      {" "}
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="5">
                      {" "}
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="6">
                      {" "}
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="7">
                      {" "}
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                    <option value="8">
                      {" "}
                      {data?.payload?.tech_lang_keys["9"]}{" "}
                    </option>
                    <option value="9">
                      {" "}
                      {data?.payload?.tech_lang_keys["10"]}{" "}
                    </option>
                    <option value="10">
                      {" "}
                      {data?.payload?.tech_lang_keys["11"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {(formData.tech_known == "5" ||
                formData.tech_known == "6" ||
                formData.tech_known == "7" ||
                formData.tech_known == "8" ||
                formData.tech_known == "9" ||
                formData.tech_known == "10") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="kin_inp_dis"
                  >
                    <label htmlFor="tech_cdis" className="label">
                      {data?.payload?.tech_lang_keys["12"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_cdis"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_cdis}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_cdisU} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m", value: "m" },
                            { label: "cm", value: "cm" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "km", value: "km" },
                            { label: "mi", value: "mi" },
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
                </>
              )}
              {(formData.tech_known == "1" ||
                formData.tech_known == "2" ||
                formData.tech_known == "4" ||
                formData.tech_known == "5" ||
                formData.tech_known == "7" ||
                formData.tech_known == "9") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="kin_inp_vli"
                  >
                    <label htmlFor="tech_iv" className="label">
                      {data?.payload?.tech_lang_keys["13"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_iv"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_iv}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_ivU} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "km/s", value: "km/s" },
                            { label: "mi/s", value: "mi/s" },
                            { label: "mph", value: "mph" },
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
              {(formData.tech_known == "1" ||
                formData.tech_known == "2" ||
                formData.tech_known == "3" ||
                formData.tech_known == "6" ||
                formData.tech_known == "8" ||
                formData.tech_known == "9") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="kin_inp_vlf"
                  >
                    <label htmlFor="tech_fv" className="label">
                      {data?.payload?.tech_lang_keys["14"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_fv"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_fv}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_fvU} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s", value: "m/s" },
                            { label: "ft/s", value: "ft/s" },
                            { label: "km/h", value: "km/h" },
                            { label: "km/s", value: "km/s" },
                            { label: "mi/s", value: "mi/s" },
                            { label: "mph", value: "mph" },
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
              {(formData.tech_known == "1" ||
                formData.tech_known == "3" ||
                formData.tech_known == "4" ||
                formData.tech_known == "5" ||
                formData.tech_known == "6" ||
                formData.tech_known == "10") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6"
                    id="kin_inp_tim"
                  >
                    <label htmlFor="tech_ct" className="label">
                      {data?.payload?.tech_lang_keys["15"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_ct"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_ct}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_ctU} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "sec", value: "sec" },
                            { label: "min", value: "min" },
                            { label: "h", value: "h" },
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
              {(formData.tech_known == "2" ||
                formData.tech_known == "3" ||
                formData.tech_known == "4" ||
                formData.tech_known == "7" ||
                formData.tech_known == "8" ||
                formData.tech_known == "10") && (
                <>
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-6 "
                    id="kin_inp_acc"
                  >
                    <label htmlFor="tech_cac" className="label">
                      {data?.payload?.tech_lang_keys["16"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_cac"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_cac}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-3"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_cacU} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "m/s²", value: "m/s²" },
                            { label: "ft/s²", value: "ft/s²" },
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
                      <div className="w-full font-s-20">
                        <div className="col m10 s12">
                          {isNum(formData?.tech_iv) &&
                            isNum(formData?.tech_fv) &&
                            isNum(formData?.tech_ct) &&
                            show({
                              result,
                              ans1: keys["12"],
                              ans11: "tech_dis",
                              ans2: keys["16"],
                              ans22: "tech_a",
                              knw1: keys["13"],
                              knw11: "tech_iv",
                              knw2: keys["14"],
                              knw22: "tech_fv",
                              knw3: keys["15"],
                              knw33: "tech_time",
                              frm1: equations.eq1[0],
                              frm2: equations.eq1[1],
                              inpKey: keys["17"],
                            })}
                          {/* Add more conditions similar to above using other equations */}
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

export default KinematicsCalculator;
