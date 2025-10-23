"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePolygonCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PolygonCalculator = () => {
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
    tech_npolygon: "",
    tech_calculation: "05",
    tech_labl: "12",
    tech_pie: "3.1415926535898",
    tech_units: "mm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePolygonCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_npolygon: formData.tech_npolygon,
        tech_calculation: formData.tech_calculation,
        tech_labl: formData.tech_labl,
        tech_pie: formData.tech_pie,
        tech_units: formData.tech_units,
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
      tech_operations: "3",
      tech_npolygon: "",
      tech_calculation: "05",
      tech_labl: "12",
      tech_pie: "3.1415926535898",
      tech_units: "mm",
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
    setFormData((prev) => ({ ...prev, tech_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="col-12">
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
                        {data?.payload?.tech_lang_keys["2"]} (n=3){" "}
                      </option>
                      <option value="4">
                        {data?.payload?.tech_lang_keys["3"]} (n=4)
                      </option>
                      <option value="5">
                        {data?.payload?.tech_lang_keys["4"]} (n=5)
                      </option>
                      <option value="6">
                        {data?.payload?.tech_lang_keys["5"]} (n=6)
                      </option>
                      <option value="7">
                        {data?.payload?.tech_lang_keys["6"]} (n=7)
                      </option>
                      <option value="8">
                        {data?.payload?.tech_lang_keys["7"]} (n=8)
                      </option>
                      <option value="9">
                        {data?.payload?.tech_lang_keys["8"]} (n=9){" "}
                      </option>
                      <option value="10">
                        {data?.payload?.tech_lang_keys["9"]} (n=10)
                      </option>
                      <option value="11">
                        {data?.payload?.tech_lang_keys["10"]} (n=11)
                      </option>
                      <option value="12">
                        {data?.payload?.tech_lang_keys["11"]} (n=12)
                      </option>
                      <option value="13">
                        {data?.payload?.tech_lang_keys["12"]} (n=13)
                      </option>
                      <option value="14">
                        {data?.payload?.tech_lang_keys["13"]} (n=14)
                      </option>
                      <option value="15">
                        {data?.payload?.tech_lang_keys["14"]} (n {">"} 14)
                      </option>
                    </select>
                  </div>
                </div>
                {formData.tech_operations == "15" && (
                  <>
                    <div className="col-12 " id="ep">
                      <label htmlFor="tech_npolygon" className="label">
                        {data?.payload?.tech_lang_keys["15"]} n:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_npolygon"
                          id="tech_npolygon"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_npolygon}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="col-12">
                  <label htmlFor="tech_calculation" className="label">
                    {data?.payload?.tech_lang_keys["16"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_calculation"
                      id="tech_calculation"
                      value={formData.tech_calculation}
                      onChange={handleChange}
                    >
                      <option value="01">
                        {data?.payload?.tech_lang_keys["17"]} a:{" "}
                      </option>
                      <option value="02">
                        {data?.payload?.tech_lang_keys["18"]} r:
                      </option>
                      <option value="03">
                        {data?.payload?.tech_lang_keys["19"]} R:
                      </option>
                      <option value="04">
                        {data?.payload?.tech_lang_keys["20"]} A:
                      </option>
                      <option value="05">
                        {data?.payload?.tech_lang_keys["21"]} P:
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  {formData.tech_calculation == "01" && (
                    <>
                      <label htmlFor="tech_labl" className="label">
                        Side Length a:{" "}
                      </label>
                    </>
                  )}
                  {formData.tech_calculation == "02" && (
                    <>
                      <label htmlFor="tech_labl" className="label">
                        Inradius r:{" "}
                      </label>
                    </>
                  )}
                  {formData.tech_calculation == "03" && (
                    <>
                      <label htmlFor="tech_labl" className="label">
                        Circumradius R:{" "}
                      </label>
                    </>
                  )}
                  {formData.tech_calculation == "04" && (
                    <>
                      <label htmlFor="tech_labl" className="label">
                        Area A:{" "}
                      </label>
                    </>
                  )}
                  {formData.tech_calculation == "05" && (
                    <>
                      <label htmlFor="tech_labl" className="label">
                        Perimeter P:{" "}
                      </label>
                    </>
                  )}

                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_labl"
                      step="any"
                      className="mt-1 input"
                      value={formData.tech_labl}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-4"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_units} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "centimeters (cm)", value: "cm" },
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
                <div className="col-12">
                  <label htmlFor="tech_pie" className="label">
                    Pi π:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_pie"
                      id="tech_pie"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_pie}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 flex items-center ps-lg-3 justify-center">
                {formData.tech_operations == "3" && (
                  <>
                    <img
                      src="/images/trigon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "4" && (
                  <>
                    <img
                      src="/images/tetragon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "5" && (
                  <>
                    <img
                      src="/images/pentagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "6" && (
                  <>
                    <img
                      src="/images/hexagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "7" && (
                  <>
                    <img
                      src="/images/heptagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "8" && (
                  <>
                    <img
                      src="/images/octagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "9" && (
                  <>
                    <img
                      src="/images/nonagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "10" && (
                  <>
                    <img
                      src="/images/decagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "11" && (
                  <>
                    <img
                      src="/images/undecagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "12" && (
                  <>
                    <img
                      src="/images/dodecagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "13" && (
                  <>
                    <img
                      src="/images/tridecagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "14" && (
                  <>
                    <img
                      src="/images/tetradecagon.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
                    />
                  </>
                )}
                {formData.tech_operations == "15" && (
                  <>
                    <img
                      src="/images/polygonn.svg?v=0"
                      id="im"
                      alt="Polygon Calculator"
                      width="100"
                      height="100"
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2">
                        <div className="w-full md:w-[80%] lg:w-[80%] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[22]} (n) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_nvalue}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[17]} (a) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_side_a} {result?.tech_unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[18]} (r) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_inradius} {result?.tech_unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[19]} (R) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_circumradius}{" "}
                                  {result?.tech_unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[20]} (A) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_area} {result?.tech_unit}
                                  <sup>2</sup>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[21]} (P) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_perimeter} {result?.tech_unit}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[23]} (x) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_interior}°
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[24]} (y) :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_extrior}°
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

export default PolygonCalculator;
