"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTvSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TvSizeCalculator = () => {
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
    tech_selection: "distance", //  size distance
    tech_resolution: "1080p",
    tech_size: "24",
    tech_size_unit: "in",
    tech_distance: "24",
    tech_distance_unit: "in",
    tech_angle: "",
    tech_angle_unit: "red",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTvSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_selection == 1) {
      if (
        !formData.tech_selection ||
        !formData.tech_resolution ||
        !formData.tech_size ||
        !formData.tech_size_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_selection ||
        !formData.tech_resolution ||
        !formData.tech_distance ||
        !formData.tech_distance_unit
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_resolution: formData.tech_resolution,
        tech_size: formData.tech_size,
        tech_size_unit: formData.tech_size_unit,
        tech_distance: formData.tech_distance,
        tech_distance_unit: formData.tech_distance_unit,
        tech_angle: formData.tech_angle,
        tech_angle_unit: formData.tech_angle_unit,
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
      tech_selection: "distance", //  size distance
      tech_resolution: "1080p",
      tech_size: "24",
      tech_size_unit: "in",
      tech_distance: "24",
      tech_distance_unit: "in",
      tech_angle: "",
      tech_angle_unit: "red",
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
    setFormData((prev) => ({ ...prev, tech_size_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_distance_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_unit: unit }));
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

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[50%] w-full">
              <input
                type="hidden"
                name="tech_selection"
                id="calculator_time"
                value={formData.tech_selection}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_selection === "size" ? "tagsUnit" : ""
                    }`}
                    id="size"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "size" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["by_size"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_selection === "distance" ? "tagsUnit" : ""
                    }`}
                    id="distance"
                    onClick={() => {
                      setFormData({ ...formData, tech_selection: "distance" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["by_distance"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 mt-5  gap-4"></div>
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_resolution" className="label">
                  {data?.payload?.tech_lang_keys["resolution"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_resolution"
                    id="tech_resolution"
                    value={formData.tech_resolution}
                    onChange={handleChange}
                  >
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="Ultra HD">Ultra HD</option>
                    <option value="4k">4k</option>
                    <option value="8k">8k</option>
                  </select>
                </div>
              </div>
              {formData.tech_selection == "size" && (
                <>
                  <div className="space-y-2 size">
                    <label htmlFor="tech_size" className="label">
                      {data?.payload?.tech_lang_keys["screen_size"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_size"
                        step="any"
                        className=" input"
                        value={formData.tech_size}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_size_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
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
              {formData.tech_selection == "distance" && (
                <>
                  <div className="space-y-2 distance  ">
                    <label htmlFor="tech_distance" className="label">
                      {data?.payload?.tech_lang_keys["v_distance"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_distance"
                        step="any"
                        className=" input"
                        value={formData.tech_distance}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_distance_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
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
              <div className="space-y-2">
                <label htmlFor="tech_angle" className="label">
                  {data?.payload?.tech_lang_keys["v_angle"]}
                </label>
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
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_angle_unit} ▾
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
                    <div className="w-full bg-light-blue p-3 rounded-lg">
                      <div className="flex flex-wrap">
                        <div className="lg:w-2/3 w-full lg:text-[18px] md:text-[18px] text-[16px] overflow-auto">
                          {result?.tech_units_cm?.map((unit, key) => {
                            const names = [
                              data?.payload?.tech_lang_keys["s_size"],
                              data?.payload?.tech_lang_keys["s_width"],
                              data?.payload?.tech_lang_keys["s_height"],
                              data?.payload?.tech_lang_keys["od"],
                              data?.payload?.tech_lang_keys["md"],
                            ];

                            const ans = result?.tech_ans?.[key];
                            if (!ans) return null;

                            const ans_unit =
                              key === 3 || key === 4 ? "ft" : "in";

                            return (
                              <table key={key} className="w-full mb-4">
                                <tbody>
                                  <tr>
                                    <td className="w-7/10 border-b py-2 font-semibold">
                                      {names[key]}:
                                    </td>
                                    <td className="border-b py-2">
                                      {ans} {ans_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      centimeter:
                                    </td>
                                    <td className="border-b py-2">{unit}</td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">meter:</td>
                                    <td className="border-b py-2">
                                      {result?.tech_units_m?.[key]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">inches:</td>
                                    <td className="border-b py-2">
                                      {result?.tech_units_in?.[key]}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">feet:</td>
                                    <td className="border-b py-2">
                                      {result?.tech_units_ft?.[key]}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            );
                          })}
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

export default TvSizeCalculator;
