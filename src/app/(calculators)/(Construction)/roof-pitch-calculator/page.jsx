"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRoofPitchCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RoofPitchCalculator = () => {
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
    tech_from: "9",
    tech_x: "7",
    tech_unit: "m",
    tech_y: "9",
    tech_unit_r: "m",
    tech_unit_a: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRoofPitchCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_from ||
      !formData.tech_x ||
      !formData.tech_unit ||
      !formData.tech_y ||
      !formData.tech_unit_r ||
      !formData.tech_unit_a
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_from: formData.tech_from,
        tech_x: formData.tech_x,
        tech_unit: formData.tech_unit,
        tech_y: formData.tech_y,
        tech_unit_r: formData.tech_unit_r,
        tech_unit_a: formData.tech_unit_a,
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
      tech_from: "9",
      tech_x: "7",
      tech_unit: "m",
      tech_y: "9",
      tech_unit_r: "m",
      tech_unit_a: "deg",
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
    setFormData((prev) => ({ ...prev, tech_unit_r: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_a: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12 relative">
                <label htmlFor="tech_from" className="label">
                  {data?.payload?.tech_lang_keys["enter"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_from"
                    id="tech_from"
                    value={formData.tech_from}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["rise"]} &{" "}
                      {data?.payload?.tech_lang_keys["run"]}
                    </option>
                    <option value="2">
                      {" "}
                      {data?.payload?.tech_lang_keys["rise"]} &{" "}
                      {data?.payload?.tech_lang_keys["rafter"]}
                    </option>
                    <option value="3">
                      {" "}
                      {data?.payload?.tech_lang_keys["run"]} &{" "}
                      {data?.payload?.tech_lang_keys["rafter"]}
                    </option>
                    <option value="4">
                      {" "}
                      {data?.payload?.tech_lang_keys["rise"]} &{" "}
                      {data?.payload?.tech_lang_keys["pit"]} (%)
                    </option>
                    <option value="5">
                      {" "}
                      {data?.payload?.tech_lang_keys["rise"]} &{" "}
                      {data?.payload?.tech_lang_keys["roof"]}
                    </option>
                    <option value="6">
                      {" "}
                      {data?.payload?.tech_lang_keys["rise"]} &{" "}
                      {data?.payload?.tech_lang_keys["pit"]} (x:12)
                    </option>
                    <option value="7">
                      {" "}
                      {data?.payload?.tech_lang_keys["run"]} &{" "}
                      {data?.payload?.tech_lang_keys["pit"]} (%)
                    </option>
                    <option value="8">
                      {" "}
                      {data?.payload?.tech_lang_keys["run"]} &{" "}
                      {data?.payload?.tech_lang_keys["roof"]}
                    </option>
                    <option value="9">
                      {" "}
                      {data?.payload?.tech_lang_keys["run"]} &{" "}
                      {data?.payload?.tech_lang_keys["pit"]} (x:12)
                    </option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_x" className="label">
                  {["3", "7", "8", "9"].includes(formData.from)
                    ? data?.payload?.tech_lang_keys["run"]
                    : data?.payload?.tech_lang_keys["rise"]}
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
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "meter (m)", value: "m" },
                        { label: "inch (in)", value: "in" },
                        { label: "yard (yd)", value: "yd" },
                        { label: "foot (ft)", value: "ft" },
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
              {(formData.tech_from == "1" ||
                formData.tech_from == "2" ||
                formData.tech_from == "3") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_y" className="label">
                      {formData?.tech_from === "2" ||
                      formData?.tech_from === "3"
                        ? data?.payload?.tech_lang_keys.rafter
                        : formData?.tech_from === "4" ||
                          formData?.tech_from === "6" ||
                          formData?.tech_from === "7" ||
                          formData?.tech_from === "9"
                        ? data?.payload?.tech_lang_keys.pit
                        : formData?.tech_from === "5" ||
                          formData?.tech_from === "8"
                        ? data?.payload?.tech_lang_keys.roof
                        : data?.payload?.tech_lang_keys.run}
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
                        {formData.tech_unit_r} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "meter (m)", value: "m" },
                            { label: "inch (in)", value: "in" },
                            { label: "yard (yd)", value: "yd" },
                            { label: "foot (ft)", value: "ft" },
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
              {(formData.tech_from == "5" ||
                formData.tech_from == "5" ||
                formData.tech_from == "8") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_y" className="label">
                      {formData?.tech_from === "2" ||
                      formData?.tech_from === "3"
                        ? data?.payload?.tech_lang_keys.rafter
                        : formData?.tech_from === "4" ||
                          formData?.tech_from === "6" ||
                          formData?.tech_from === "7" ||
                          formData?.tech_from === "9"
                        ? data?.payload?.tech_lang_keys.pit
                        : formData?.tech_from === "5" ||
                          formData?.tech_from === "8"
                        ? data?.payload?.tech_lang_keys.roof
                        : data?.payload?.tech_lang_keys.run}
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
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_a} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "deg", value: "deg" },
                            { label: "red", value: "red" },
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
              {(formData.tech_from == "4" ||
                formData.tech_from == "4" ||
                formData.tech_from == "6" ||
                formData.tech_from == "7" ||
                formData.tech_from == "9") && (
                <>
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    {(formData?.tech_from == "7" ||
                      formData?.tech_from == "4") && (
                      <>
                        <label htmlFor="tech_y" className="label">
                          {data?.payload?.tech_lang_keys["pit"]} (%)
                        </label>
                      </>
                    )}
                    {(formData?.tech_from == "6" ||
                      formData?.tech_from == "9") && (
                      <>
                        <label htmlFor="tech_y" className="label">
                          {data?.payload?.tech_lang_keys["roof"]} (x:12)
                        </label>
                      </>
                    )}
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
                    </div>
                  </div>
                </>
              )}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 rounded-lg result_calculator space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg   items-center justify-center">
                    <div className="col-12 bg-light-blue result p-3 rounded mt-3">
                      <div className="w-full my-4">
                        <div className="w-full md:w-[80%] lg:w-[70%] overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["run"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_run !== ""
                                    ? `${result.tech_run} m`
                                    : "0.0 m"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["rise"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_rise !== ""
                                    ? `${result.tech_rise} m`
                                    : "0.0 m"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["rafter"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_rafter !== ""
                                    ? `${result.tech_rafter} m`
                                    : "0.0 m"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["roof"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_angle !== ""
                                    ? `${result.tech_angle} deg`
                                    : "0.0 deg"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["roof"]} (%)
                                    ({data?.payload?.tech_lang_keys["slope"]}) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_pitch !== ""
                                    ? `${result.tech_pitch}%`
                                    : "0.0%"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["roof"]}{" "}
                                    (x:12) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_x !== "" ? (
                                    <>
                                      {result.tech_x}
                                      <span className="text-[12px]">
                                        {" "}
                                        :12
                                      </span>{" "}
                                      in
                                    </>
                                  ) : (
                                    <>
                                      0.0{" "}
                                      <span className="text-[12px]"> :12</span>{" "}
                                      in
                                    </>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["p"]} (
                                    {data?.payload?.tech_lang_keys["rise"]}/
                                    {data?.payload?.tech_lang_keys["span"]}) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_P !== ""
                                    ? `${result.tech_P} ft`
                                    : "0.0 ft"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["rad"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_angle !== ""
                                    ? (
                                        parseFloat(result.tech_angle) *
                                        0.0174533
                                      ).toFixed(4)
                                    : "0.0"}
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

export default RoofPitchCalculator;
