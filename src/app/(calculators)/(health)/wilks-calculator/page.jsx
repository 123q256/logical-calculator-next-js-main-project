"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useWilksCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const WilksCalculator = () => {
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
    tech_sex: "female", // male
    tech_bw: 80,
    tech_unit: "lbs",
    tech_method: "au", // au  sep
    tech_bp: 20,
    tech_unit1: "kg",
    tech_bp_reps: 15,
    tech_bs: 15,
    tech_unit2: "kg",
    tech_bs_reps: 10,
    tech_dl: 15,
    tech_unit3: "kg",
    tech_dl_reps: 5,
    tech_wl: 100,
    tech_unit4: "lbs",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useWilksCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_method == "au") {
      if (
        !formData.tech_method ||
        !formData.tech_sex ||
        !formData.tech_bw ||
        !formData.tech_unit ||
        !formData.tech_wl ||
        !formData.tech_unit4
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_method ||
        !formData.tech_sex ||
        !formData.tech_bw ||
        !formData.tech_unit ||
        !formData.tech_bp ||
        !formData.tech_unit1 ||
        !formData.tech_bs ||
        !formData.tech_unit2 ||
        !formData.tech_dl ||
        !formData.tech_unit3 ||
        !formData.tech_bp_reps ||
        !formData.tech_bs_reps ||
        !formData.tech_dl_reps
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_sex: formData.tech_sex,
        tech_bw: formData.tech_bw,
        tech_unit: formData.tech_unit,
        tech_method: formData.tech_method,
        tech_bp: formData.tech_bp,
        tech_unit1: formData.tech_unit1,
        tech_bp_reps: formData.tech_bp_reps,
        tech_bs: formData.tech_bs,
        tech_unit2: formData.tech_unit2,
        tech_bs_reps: formData.tech_bs_reps,
        tech_dl: formData.tech_dl,
        tech_unit3: formData.tech_unit3,
        tech_dl_reps: formData.tech_dl_reps,
        tech_wl: formData.tech_wl,
        tech_unit4: formData.tech_unit4,
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
      tech_sex: "female", // male
      tech_bw: 80,
      tech_unit: "lbs",
      tech_method: "au", // au  sep
      tech_bp: 20,
      tech_unit1: "kg",
      tech_bp_reps: 15,
      tech_bs: 15,
      tech_unit2: "kg",
      tech_bs_reps: 10,
      tech_dl: 15,
      tech_unit3: "kg",
      tech_dl_reps: 5,
      tech_wl: 100,
      tech_unit4: "lbs",
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
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit1: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit2: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit3: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit4: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  // result?

  const fw = result?.tech_fw || "";
  const lb = result?.tech_lb || "";
  const wl = formData?.tech_wl;
  const bw = formData?.tech_bw;

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
              <div className="col-span-12 md:col-span-6 lg:col-span-6 sex">
                <label htmlFor="tech_sex" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_sex"
                    id="tech_sex"
                    value={formData.tech_sex}
                    onChange={handleChange}
                  >
                    <option value="male">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="female">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 bw">
                <label htmlFor="tech_bw" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_bw"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_bw}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "pounds (lbs)", value: "lbs" },
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

              <div className="col-span-12">
                <label className="pe-2" htmlFor="au">
                  <input
                    type="radio"
                    name="tech_method"
                    value="au"
                    id="au"
                    className="mr-2 border"
                    onChange={handleChange}
                    checked={formData.tech_method === "au"}
                  />
                  <span>{data?.payload?.tech_lang_keys["5"]}</span>
                </label>

                <label htmlFor="sep">
                  <input
                    type="radio"
                    name="tech_method"
                    className="mr-2 border"
                    value="sep"
                    id="sep"
                    onChange={handleChange}
                    checked={formData.tech_method === "sep"}
                  />
                  <span>{data?.payload?.tech_lang_keys["7"]}</span>
                </label>
              </div>
              <div className="col-span-12">
                {formData.tech_method == "au" ? (
                  <p id="p1" className="p_set">
                    {data?.payload?.tech_lang_keys["8"]}
                  </p>
                ) : (
                  <p id="p2" className="p_set ">
                    {data?.payload?.tech_lang_keys["9"]}
                  </p>
                )}
              </div>
              {formData.tech_method == "sep" && (
                <>
                  <div className="col-span-12  " id="sep1">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-6 bp">
                        <label htmlFor="tech_bp" className="label">
                          {data?.payload?.tech_lang_keys["10"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_bp"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_bp}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_unit1} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "kilograms (kg)", value: "kg" },
                                { label: "pounds (lbs)", value: "lbs" },
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
                      <div className="col-span-6 bp">
                        <label htmlFor="tech_bp_reps" className="label">
                          {data?.payload?.tech_lang_keys["11"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bp_reps"
                            id="tech_bp_reps"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bp_reps}
                            onChange={handleChange}
                          />
                          <span className="input_unit">{currency.symbol}</span>
                        </div>
                      </div>
                      <div className="col-span-6 bp">
                        <label htmlFor="tech_bs" className="label">
                          {data?.payload?.tech_lang_keys["12"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_bs"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_bs}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_unit2} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "kilograms (kg)", value: "kg" },
                                { label: "pounds (lbs)", value: "lbs" },
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
                      <div className="col-span-6 bs">
                        <label htmlFor="tech_bs_reps" className="label">
                          {data?.payload?.tech_lang_keys["11"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bs_reps"
                            id="tech_bs_reps"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bs_reps}
                            onChange={handleChange}
                          />
                          <span className="input_unit">{currency.symbol}</span>
                        </div>
                      </div>
                      <div className="col-span-6 dl">
                        <label htmlFor="tech_dl" className="label">
                          {data?.payload?.tech_lang_keys["13"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_dl"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_dl}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_unit3} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "kilograms (kg)", value: "kg" },
                                { label: "pounds (lbs)", value: "lbs" },
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
                      <div className="col-span-6 dl">
                        <label htmlFor="tech_dl_reps" className="label">
                          {data?.payload?.tech_lang_keys["11"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_dl_reps"
                            id="tech_dl_reps"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_dl_reps}
                            onChange={handleChange}
                          />
                          <span className="input_unit">{currency.symbol}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method == "au" && (
                <>
                  <div className="col-span-6 dl">
                    <label htmlFor="tech_wl" className="label">
                      {data?.payload?.tech_lang_keys["14"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_wl"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_wl}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown4}
                      >
                        {formData.tech_unit4} ▾
                      </label>
                      {dropdownVisible4 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "kilograms (kg)", value: "kg" },
                            { label: "pounds (lbs)", value: "lbs" },
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="bg-sky bordered rounded-lg px-3 py-2">
                          <strong>
                            {data?.payload?.tech_lang_keys[15]}{" "}
                            <span className="text-[#119154] text-[28px] ms-2">
                              {result?.tech_ws}
                            </span>
                          </strong>
                        </div>
                        {/* <p className="my-2">
                                <span>{data?.payload?.tech_lang_keys[16]}</span>{" "}
                                <strong>
                                  {(result?.tech_fw != '') ? result?.tech_fw : formData?.tech_wl}
                                  {result?.tech_lb != '' ? ' lbs' : ' kg'}
                                </strong>{" "}
                                <span>{data?.payload?.tech_lang_keys[17]}</span>{" "}
                                <strong>
                                  {formData?.tech_bw}
                                  {result?.tech_lb != '' ? ' lbs' : ' kg'}
                                </strong>
                              </p> */}

                        <p className="my-2">
                          <span>{data?.payload?.tech_lang_keys[16]}</span>{" "}
                          <strong>
                            {fw !== "" ? fw : wl} {formData?.tech_unit}
                          </strong>{" "}
                          <span>{data?.payload?.tech_lang_keys[17]}</span>{" "}
                          <strong>
                            {bw} {formData?.tech_unit}
                          </strong>
                        </p>

                        <div className="w-full overflow-auto">
                          <table
                            className="w-full md:w-[80%] lg:w-[60%]"
                            cellSpacing="0"
                          >
                            <tbody>
                              <tr>
                                <th className="text-start text-blue-700 border-b py-2">
                                  {data?.payload?.tech_lang_keys[18]}
                                </th>
                                <th className="text-start text-blue-700 border-b py-2">
                                  {data?.payload?.tech_lang_keys[19]}
                                </th>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[20]}
                                </td>
                                <td className="border-b py-2">120</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[21]}
                                </td>
                                <td className="border-b py-2">200</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[22]}
                                </td>
                                <td className="border-b py-2">238</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[23]}
                                </td>
                                <td className="border-b py-2">326</td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  {data?.payload?.tech_lang_keys[24]}
                                </td>
                                <td className="py-2">414</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[20px] mt-3">
                          <strong className="text-blue-700">
                            {data?.payload?.tech_lang_keys[25]}:
                          </strong>
                        </p>
                        <p>
                          <strong className="text-blue-700">
                            {data?.payload?.tech_lang_keys[26]}
                          </strong>
                        </p>
                        <p className="text-[15px]">
                          {data?.payload?.tech_lang_keys[27]} = TWL * 500 / (a +
                          b * BWT + c * BWT<sup>2</sup> + d * BWT<sup>3</sup> +
                          e * BWT<sup>4</sup> + f * BWT<sup>5</sup>)
                        </p>
                        <p className="mt-3">
                          <strong className="text-blue-700">
                            {data?.payload?.tech_lang_keys[28]}
                          </strong>
                        </p>
                        <p className="text-[15px]">
                          {data?.payload?.tech_lang_keys[27]} = TWL * 500 / (a +
                          b * BWT + c * BWT<sup>2</sup> + d * BWT<sup>3</sup> +
                          e * BWT<sup>4</sup> + f * BWT<sup>5</sup>)
                        </p>
                        <p className="mt-2 text-[15px]">
                          {data?.payload?.tech_lang_keys[27]} =
                          {formData?.tech_sex === "male" ? (
                            <>
                              {result?.tech_fw !== ""
                                ? result?.tech_lb !== ""
                                  ? result?.tech_lb1
                                  : result?.tech_fw
                                : result?.tech_lb !== ""
                                ? result?.tech_lb1
                                : formData?.tech}
                              * 500 / ( -216.0475144 + 16.2606339 *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}{" "}
                              + (-0.002388645) *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}
                              <sup>2</sup> + (-0.00113732) *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}
                              <sup>3</sup> + 0.00000701863 *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}
                              <sup>4</sup> + (-1.291e-8) *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}
                              <sup>5</sup>)
                            </>
                          ) : formData?.tech_sex === "female" ? (
                            <>
                              {result?.tech_fw !== ""
                                ? result?.tech_lb !== ""
                                  ? result?.tech_lb1
                                  : result?.tech_fw
                                : result?.tech_lb !== ""
                                ? result?.tech_lb1
                                : formData?.tech}
                              * 500 / ( 594.31747775582 + (-27.23842536447) *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}{" "}
                              + 0.82112226871 *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}
                              <sup>2</sup> + (-0.00930733913) *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}
                              <sup>3</sup> + 0.00004731582 *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}
                              <sup>4</sup> + (-9.054e-8) *{" "}
                              {result?.tech_lb
                                ? result?.tech_lb
                                : formData?.tech_bw}
                              <sup>5</sup>)
                            </>
                          ) : null}
                        </p>
                        <p className="mt-2 text-[15px]">
                          {data?.payload?.tech_lang_keys[27]} =
                          {result?.tech_fw !== ""
                            ? result?.tech_lb !== ""
                              ? result?.tech_lb1
                              : result?.tech_fw
                            : result?.tech_lb !== ""
                            ? result?.tech_lb1
                            : formData?.tech}
                          * {result?.tech_ws_cal} ={" "}
                          <strong className="font-s-16">
                            {result?.tech_ws}
                          </strong>
                        </p>
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

export default WilksCalculator;
