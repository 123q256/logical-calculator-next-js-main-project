"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Chart.js components ko register karna zaroori hai
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePaceCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PaceCalculator = () => {
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
    tech_calculator_name: "calculator1",
    tech_time: "00:10:13",
    tech_type: "pace",
    tech_dis: "800",
    tech_dis_unit: "m",
    tech_event: "9",
    tech_pace: "00:07:33",
    tech_per: "1",
    tech_fdis: "1",
    tech_dis_unit1: "mi",
    tech_time1: "00:03:13",
    tech_dis2: "2",
    tech_dis_unit2: "mi",
    tech_time2: "00:06:26",
    tech_dis3: "3",
    tech_dis_unit3: "mi",
    tech_time3: "00:09:55",
    tech_dis4: "4",
    tech_dis_unit4: "mi",
    tech_time4: "00:12:13",
    tech_dis5: "",
    tech_dis_unit5: "mi",
    tech_time5: "",
    tech_dis6: "",
    tech_dis_unit6: "mi",
    tech_time6: "",
    tech_dis7: "",
    tech_dis_unit7: "mi",
    tech_time7: "",
    tech_dis8: "",
    tech_dis_unit8: "mi",
    tech_time8: "",
    tech_from: "00:07:33",
    tech_fromu: "1",
    tech_to: "2",
    tech_fdis_unit: "mi",
    tech_ftime: "00:05:13",
    tech_ffdis: "5",
    tech_ffdis_unit: "mi",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePaceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculator_name || !formData.tech_time) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculator_name: formData.tech_calculator_name,
        tech_time: formData.tech_time,
        tech_type: formData.tech_type,
        tech_dis: formData.tech_dis,
        tech_dis_unit: formData.tech_dis_unit,
        tech_event: formData.tech_event,
        tech_pace: formData.tech_pace,
        tech_per: formData.tech_per,
        tech_fdis: formData.tech_fdis,
        tech_dis_unit1: formData.tech_dis_unit1,
        tech_time1: formData.tech_time1,
        tech_dis2: formData.tech_dis2,
        tech_dis_unit2: formData.tech_dis_unit2,
        tech_time2: formData.tech_time2,
        tech_dis3: formData.tech_dis3,
        tech_dis_unit3: formData.tech_dis_unit3,
        tech_time3: formData.tech_time3,
        tech_dis4: formData.tech_dis4,
        tech_dis_unit4: formData.tech_dis_unit4,
        tech_time4: formData.tech_time4,
        tech_dis5: formData.tech_dis5,
        tech_dis_unit5: formData.tech_dis_unit5,
        tech_time5: formData.tech_time5,
        tech_dis6: formData.tech_dis6,
        tech_dis_unit6: formData.tech_dis_unit6,
        tech_time6: formData.tech_time6,
        tech_dis7: formData.tech_dis7,
        tech_dis_unit7: formData.tech_dis_unit7,
        tech_time7: formData.tech_time7,
        tech_dis8: formData.tech_dis8,
        tech_dis_unit8: formData.tech_dis_unit8,
        tech_time8: formData.tech_time8,
        tech_from: formData.tech_from,
        tech_fromu: formData.tech_fromu,
        tech_to: formData.tech_to,
        tech_fdis_unit: formData.tech_fdis_unit,
        tech_ftime: formData.tech_ftime,
        tech_ffdis: formData.tech_ffdis,
        tech_ffdis_unit: formData.tech_ffdis_unit,
        tech_submit: formData.tech_submit,
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
      tech_calculator_name: "calculator1",
      tech_time: "00:10:13",
      tech_type: "pace",
      tech_dis: "800",
      tech_dis_unit: "m",
      tech_event: "9",
      tech_pace: "00:07:33",
      tech_per: "1",
      tech_fdis: "12",
      tech_dis_unit1: "mi",
      tech_time1: "00:03:13",
      tech_dis2: "2",
      tech_dis_unit2: "mi",
      tech_time2: "00:06:26",
      tech_dis3: "3",
      tech_dis_unit3: "mi",
      tech_time3: "00:09:55",
      tech_dis4: "4",
      tech_dis_unit4: "mi",
      tech_time4: "00:12:13",
      tech_dis5: "",
      tech_dis_unit5: "mi",
      tech_time5: "",
      tech_dis6: "",
      tech_dis_unit6: "mi",
      tech_time6: "",
      tech_dis7: "",
      tech_dis_unit7: "mi",
      tech_time7: "",
      tech_dis8: "",
      tech_dis_unit8: "mi",
      tech_time8: "1",
      tech_from: "00:07:33",
      tech_fromu: "1",
      tech_to: "2",
      tech_fdis_unit: "mi",
      tech_ftime: "00:05:13",
      tech_ffdis: "5",
      tech_ffdis_unit: "mi",
      tech_submit: "calculate",
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
    setFormData((prev) => ({ ...prev, tech_fdis_unit: unit }));
    setDropdownVisible0(false);
  };

  const toggleDropdown0 = () => {
    setDropdownVisible0(!dropdownVisible0);
  };

  //dropdown states
  const [dropdownVisible00, setDropdownVisible00] = useState(false);

  const setUnitHandler00 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ffdis_unit: unit }));
    setDropdownVisible00(false);
  };

  const toggleDropdown00 = () => {
    setDropdownVisible00(!dropdownVisible00);
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit1: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit2: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };
  //dropdown states 3
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit3: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };
  //dropdown states 4
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit4: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };
  //dropdown states 5
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit5: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };
  //dropdown states 6
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit6: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states 7
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit7: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };
  //dropdown states 8
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit8: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  // 🧠 Helper functions in JavaScript
  const gethours = (total_sec = 0) =>
    String(Math.floor(total_sec / 3600)).padStart(2, "0");
  const getmins = (total_sec = 0) => {
    const mins = total_sec - gethours(total_sec) * 3600;
    return String(Math.floor(mins / 60)).padStart(2, "0");
  };
  const getsecs = (value = 0) => {
    return String(
      Math.round(value - gethours(value) * 3600 - getmins(value) * 60)
    ).padStart(2, "0");
  };
  const gettime = (seconds = 0) => {
    return `${gethours(seconds)} : ${getmins(seconds)} : ${getsecs(seconds)}`;
  };

  // 🧠 React JavaScript code
  const name = [
    data?.payload?.tech_lang_keys["6"],
    data?.payload?.tech_lang_keys["7"],
    data?.payload?.tech_lang_keys["8"],
    data?.payload?.tech_lang_keys["9"],
    data?.payload?.tech_lang_keys["10"],
    data?.payload?.tech_lang_keys["11"],
    data?.payload?.tech_lang_keys["12"],
    data?.payload?.tech_lang_keys["13"],
  ];

  const i = (result?.request?.fromu || 1) - 1;
  const j = (result?.request?.to || 1) - 1;

  // chart
  let chartdata = null;
  let options = null;

  if (formData.tech_calculator_name === "calculator2") {
    // Labels array: 1, 2, 3, ...
    const labels = result?.tech_mile_secs.map((_, i) => i + 1);

    chartdata = {
      labels,
      datasets: [
        {
          label: data?.payload?.tech_lang_keys["43"], // Series name
          data: result?.tech_mile_secs, // Data points
          backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
          borderColor: "rgba(75, 192, 192, 1)", // Border color
          borderWidth: 1,
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false, text: "" },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: data?.payload?.tech_lang_keys["41"], // X axis title
          },
        },
        y: {
          title: {
            display: true,
            text: data?.payload?.tech_lang_keys["42"], // Y axis title
          },
          beginAtZero: true,
        },
      },
    };
  }

  // Ab chartdata aur options variable scope mein hain
  // Aap inko apne Bar/Line component ko pass kar sakte hain

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

          <div className=" mx-auto mt-2  w-full">
            <input
              type="hidden"
              name="tech_calculator_name"
              id="calculator_time"
              value={formData.tech_calculator_name}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              {/* Date Cal Tab */}
              <div className="lg:w-1/4 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 text-[13px] cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                    formData.tech_calculator_name === "calculator1"
                      ? "tagsUnit"
                      : ""
                  }`}
                  id="calculator1"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      tech_calculator_name: "calculator1",
                    });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  Pace Calculator
                </div>
              </div>
              {/* Time Cal Tab */}
              <div className="lg:w-1/4 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 text-[13px] cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_calculator_name === "calculator2"
                      ? "tagsUnit"
                      : ""
                  }`}
                  id="calculator2"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      tech_calculator_name: "calculator2",
                    });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["21"]}
                </div>
              </div>
              <div className="lg:w-1/4 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 text-[13px] cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_calculator_name === "calculator3"
                      ? "tagsUnit"
                      : ""
                  }`}
                  id="calculator3"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      tech_calculator_name: "calculator3",
                    });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["20"]}
                </div>
              </div>
              <div className="lg:w-1/4 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 text-[13px] cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_calculator_name === "calculator4"
                      ? "tagsUnit"
                      : ""
                  }`}
                  id="calculator4"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      tech_calculator_name: "calculator4",
                    });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["16"]}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="row grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              {formData.tech_calculator_name == "calculator1" && (
                <>
                  <div className="col-span-12 calculator1">
                    <div className="row grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12">
                        <div className="row grid grid-cols-12 mt-3  my-5  gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-10 md:col-span-6 lg:col-span-6">
                            <input
                              type="hidden"
                              step="any"
                              name="tech_type"
                              id="tech_type"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_type}
                              onChange={handleChange}
                            />

                            <div className="w-full flex justify-between text-[14px] pace_border relative">
                              <p
                                id="pace_tab"
                                className={` px-3  cursor-pointer  ${
                                  formData.tech_type === "pace"
                                    ? "pace_tab active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    tech_type: "pace",
                                  });
                                  setResult(null);
                                  setFormError(null);
                                }}
                              >
                                <strong>
                                  {data?.payload?.tech_lang_keys["1"]}
                                </strong>
                              </p>

                              <p
                                id="time_tab"
                                className={` cursor-pointer ${
                                  formData.tech_type === "time"
                                    ? "pace_tab active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    tech_type: "time",
                                  });
                                  setResult(null);
                                  setFormError(null);
                                }}
                              >
                                <strong>
                                  {data?.payload?.tech_lang_keys["2"]}
                                </strong>
                              </p>

                              <p
                                id="distance_tab"
                                className={` cursor-pointer ${
                                  formData.tech_type === "distance"
                                    ? "pace_tab active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    tech_type: "distance",
                                  });
                                  setResult(null);
                                  setFormError(null);
                                }}
                              >
                                <strong>
                                  {data?.payload?.tech_lang_keys["3"]}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_time" className="label">
                          {data?.payload?.tech_lang_keys["2"]} (hh:mm:ss):
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_time"
                            id="tech_time"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {formData.tech_type != "distance" && (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 dis">
                            <label htmlFor="tech_dis" className="label">
                              {data?.payload?.tech_lang_keys["3"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_dis"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_dis}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown}
                              >
                                {formData.tech_dis_unit} ▾
                              </label>
                              {dropdownVisible && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "miles (mi)", value: "mi" },
                                    { label: "kilometers (km)", value: "km" },
                                    { label: "meters (m)", value: "m" },
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
                        </>
                      )}
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 event">
                        <label htmlFor="tech_event" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_event"
                            id="tech_event"
                            value={formData.tech_event}
                            onChange={handleChange}
                          >
                            <option value="">
                              {data?.payload?.tech_lang_keys["5"]}
                            </option>
                            <option value="1">Marathon </option>
                            <option value="2">Half-Marathon </option>
                            <option value="3">1K </option>
                            <option value="4">5K </option>
                            <option value="5">10K </option>
                            <option value="6">1 Miles </option>
                            <option value="7">5 Miles </option>
                            <option value="8">10 Miles </option>
                            <option value="9">800 meters </option>
                            <option value="10">1500 meters </option>
                          </select>
                        </div>
                      </div>
                      {(formData.tech_type == "time" ||
                        formData.tech_type == "distance") && (
                        <>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 pace">
                            <label htmlFor="tech_pace" className="label">
                              {data?.payload?.tech_lang_keys["1"]}{" "}
                              <span className="text-blue hh">(hh:mm:ss)</span>:
                            </label>
                            <div className=" relative">
                              <input
                                type="text"
                                step="any"
                                name="tech_pace"
                                id="tech_pace"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_pace}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 pace">
                            <label htmlFor="tech_per" className="label">
                              {data?.payload?.tech_lang_keys["6"]}:
                            </label>
                            <div className="mt-2">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_per"
                                id="tech_per"
                                value={formData.tech_per}
                                onChange={handleChange}
                              >
                                <option value="">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </option>
                                <option value="1">Marathon </option>
                                <option value="2">Half-Marathon </option>
                                <option value="3">1K </option>
                                <option value="4">5K </option>
                                <option value="5">10K </option>
                                <option value="6">1 Miles </option>
                                <option value="7">5 Miles </option>
                                <option value="8">10 Miles </option>
                                <option value="9">800 meters </option>
                                <option value="10">1500 meters </option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculator_name == "calculator2" && (
                <>
                  <div className="col-span-12 calculator2 ">
                    <div className="row grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-6">
                        <label htmlFor="tech_fdis" className="label">
                          {data?.payload?.tech_lang_keys["3"]}
                        </label>
                        <div className="flex items-center">
                          <span className="label">1:</span>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_fdis"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_fdis}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown1}
                            >
                              {formData.tech_dis_unit1} ▾
                            </label>
                            {dropdownVisible1 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "miles (mi)", value: "mi" },
                                  { label: "kilometers (km)", value: "km" },
                                  { label: "meters (m)", value: "m" },
                                  { label: "yards (yd)", value: "yd" },
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
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_time1" className="label">
                          {data?.payload?.tech_lang_keys["2"]} (hh:mm:ss):
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            name="tech_time1"
                            id="tech_time1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <span className="label">2:</span>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_dis2"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_dis2}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown2}
                            >
                              {formData.tech_dis_unit2} ▾
                            </label>
                            {dropdownVisible2 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "miles (mi)", value: "mi" },
                                  { label: "kilometers (km)", value: "km" },
                                  { label: "meters (m)", value: "m" },
                                  { label: "yards (yd)", value: "yd" },
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
                      <div className="col-span-6">
                        <div className=" relative">
                          <input
                            type="text"
                            name="tech_time2"
                            id="tech_time2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <span className="label">3:</span>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_dis3"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_dis3}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown3}
                            >
                              {formData.tech_dis_unit3} ▾
                            </label>
                            {dropdownVisible3 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "miles (mi)", value: "mi" },
                                  { label: "kilometers (km)", value: "km" },
                                  { label: "meters (m)", value: "m" },
                                  { label: "yards (yd)", value: "yd" },
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
                      <div className="col-span-6">
                        <div className=" relative">
                          <input
                            type="text"
                            name="tech_time3"
                            id="tech_time3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <span className="label">4:</span>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_dis4"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_dis4}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown4}
                            >
                              {formData.tech_dis_unit4} ▾
                            </label>
                            {dropdownVisible4 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "miles (mi)", value: "mi" },
                                  { label: "kilometers (km)", value: "km" },
                                  { label: "meters (m)", value: "m" },
                                  { label: "yards (yd)", value: "yd" },
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
                      </div>
                      <div className="col-span-6">
                        <div className=" relative">
                          <input
                            type="text"
                            name="tech_time4"
                            id="tech_time4"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time4}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <span className="label">5:</span>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_dis5"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_dis5}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown5}
                            >
                              {formData.tech_dis_unit5} ▾
                            </label>
                            {dropdownVisible5 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "miles (mi)", value: "mi" },
                                  { label: "kilometers (km)", value: "km" },
                                  { label: "meters (m)", value: "m" },
                                  { label: "yards (yd)", value: "yd" },
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
                      </div>
                      <div className="col-span-6">
                        <div className=" relative">
                          <input
                            type="text"
                            name="tech_time5"
                            id="tech_time5"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time5}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <span className="label">6:</span>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_dis6"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_dis6}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown6}
                            >
                              {formData.tech_dis_unit6} ▾
                            </label>
                            {dropdownVisible6 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "miles (mi)", value: "mi" },
                                  { label: "kilometers (km)", value: "km" },
                                  { label: "meters (m)", value: "m" },
                                  { label: "yards (yd)", value: "yd" },
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
                      </div>
                      <div className="col-span-6">
                        <div className=" relative">
                          <input
                            type="text"
                            name="tech_time6"
                            id="tech_time6"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time6}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <span className="label">7:</span>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_dis7"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_dis7}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown7}
                            >
                              {formData.tech_dis_unit7} ▾
                            </label>
                            {dropdownVisible7 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "miles (mi)", value: "mi" },
                                  { label: "kilometers (km)", value: "km" },
                                  { label: "meters (m)", value: "m" },
                                  { label: "yards (yd)", value: "yd" },
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
                      </div>
                      <div className="col-span-6">
                        <div className=" relative">
                          <input
                            type="text"
                            name="tech_time7"
                            id="tech_time7"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time7}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <span className="label">8:</span>
                          <div className="relative w-full ">
                            <input
                              type="number"
                              name="tech_dis8"
                              step="any"
                              className="mt-1 input"
                              value={formData.tech_dis8}
                              placeholder="00"
                              onChange={handleChange}
                            />
                            <label
                              className="absolute cursor-pointer text-sm underline right-6 top-3"
                              onClick={toggleDropdown8}
                            >
                              {formData.tech_dis_unit8} ▾
                            </label>
                            {dropdownVisible8 && (
                              <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                {[
                                  { label: "miles (mi)", value: "mi" },
                                  { label: "kilometers (km)", value: "km" },
                                  { label: "meters (m)", value: "m" },
                                  { label: "yards (yd)", value: "yd" },
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
                      <div className="col-span-6">
                        <div className=" relative">
                          <input
                            type="text"
                            name="tech_time8"
                            id="tech_time8"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_time8}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_calculator_name == "calculator3" && (
                <>
                  <div className="col-span-12 calculator3 ">
                    <div className="row grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                        <label htmlFor="tech_from" className="label">
                          {data?.payload?.tech_lang_keys["14"]}{" "}
                          <span className="text-blue hhm">(hh:mm:ss)</span>:
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_from"
                            id="tech_from"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_from}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_fromu" className="label">
                          &nbsp;
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_fromu"
                            id="tech_fromu"
                            value={formData.tech_fromu}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["6"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["7"]}{" "}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                            </option>
                            <option value="4">
                              {data?.payload?.tech_lang_keys["9"]}{" "}
                            </option>
                            <option value="5">
                              {data?.payload?.tech_lang_keys["10"]}{" "}
                            </option>
                            <option value="6">
                              {data?.payload?.tech_lang_keys["11"]}{" "}
                            </option>
                            <option value="7">
                              {data?.payload?.tech_lang_keys["12"]}{" "}
                            </option>
                            <option value="8">
                              {data?.payload?.tech_lang_keys["13"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_to" className="label">
                          {data?.payload?.tech_lang_keys["15"]}:
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
                              {data?.payload?.tech_lang_keys["6"]}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["7"]}{" "}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["8"]}{" "}
                            </option>
                            <option value="4">
                              {data?.payload?.tech_lang_keys["9"]}{" "}
                            </option>
                            <option value="5">
                              {data?.payload?.tech_lang_keys["10"]}{" "}
                            </option>
                            <option value="6">
                              {data?.payload?.tech_lang_keys["11"]}{" "}
                            </option>
                            <option value="7">
                              {data?.payload?.tech_lang_keys["12"]}{" "}
                            </option>
                            <option value="8">
                              {data?.payload?.tech_lang_keys["13"]}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calculator_name == "calculator4" && (
                <>
                  <div className="col-span-12 calculator4 ">
                    <div className="row grid grid-cols-12    gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                        <label htmlFor="tech_fdis" className="label">
                          {data?.payload?.tech_lang_keys["17"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_fdis"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_fdis}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-3"
                            onClick={toggleDropdown0}
                          >
                            {formData.tech_fdis_unit} ▾
                          </label>
                          {dropdownVisible0 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "miles (mi)", value: "mi" },
                                { label: "kilometers (km)", value: "km" },
                                { label: "meters (m)", value: "m" },
                                { label: "yards (yd)", value: "yd" },
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

                      <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                        <label htmlFor="tech_ftime" className="label">
                          {data?.payload?.tech_lang_keys["18"]} (hh:mm:ss):
                        </label>
                        <div className=" relative">
                          <input
                            type="text"
                            step="any"
                            name="tech_ftime"
                            id="tech_ftime"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ftime}
                            onChange={handleChange}
                          />
                          <span className="input_unit">{currency.symbol}</span>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                        <label htmlFor="tech_ffdis" className="label">
                          {data?.payload?.tech_lang_keys["19"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_ffdis"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_ffdis}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-3"
                            onClick={toggleDropdown00}
                          >
                            {formData.tech_ffdis_unit} ▾
                          </label>
                          {dropdownVisible00 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "miles (mi)", value: "mi" },
                                { label: "kilometers (km)", value: "km" },
                                { label: "meters (m)", value: "m" },
                                { label: "yards (yd)", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler00(unit.value)}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
                      {/* @php
                                $weight_unit = $detail['request']->weight_unit;
                            @endphp */}
                      <div className="w-full">
                        {formData?.tech_calculator_name === "calculator3" ? (
                          <>
                            <div className="w-full">
                              <div className="w-full py-2">
                                <div className="bg-sky bordered rounded-lg p-3">
                                  <strong>
                                    <span className="text-blue font-s-20 px">
                                      {formData?.tech_from}
                                    </span>{" "}
                                    {name[i]} ={" "}
                                    <span className="text-[#119154] text-[20px]">
                                      {result?.tech_res}
                                    </span>{" "}
                                    {name[j]}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : formData?.tech_calculator_name === "calculator4" ? (
                          <>
                            <div className="w-full">
                              <div className="w-full py-2">
                                <div className="bg-sky bordered rounded-lg p-3">
                                  {data?.payload?.tech_lang_keys["22"]}{" "}
                                  <strong className="text-[#119154] text-[20px]">
                                    {result?.tech_main}
                                  </strong>{" "}
                                  {data?.payload?.tech_lang_keys["23"]}{" "}
                                  {`${result?.tech_request?.ffdis} ${result?.tech_request?.ffdis_unit}`}
                                  .
                                </div>
                              </div>
                            </div>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["24"]}:
                              </strong>
                            </p>
                            <div className="w-full overflow-auto">
                              <table
                                className="w-full col-lg-6"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong className="text-blue">
                                        {gethours(result?.tech_pace)} Hours{" "}
                                        {getmins(result?.tech_pace)} Min{" "}
                                        {getsecs(result?.tech_pace)} Sec
                                      </strong>{" "}
                                      <span>
                                        {data?.payload?.tech_lang_keys["6"]}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong className="text-blue">
                                        {gethours(result?.tech_pacekm)} Hours{" "}
                                        {getmins(result?.tech_pacekm)} Min{" "}
                                        {getsecs(result?.tech_pacekm)} Sec
                                      </strong>{" "}
                                      <span>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong className="text-blue">
                                        {result?.tech_mi_h}
                                      </strong>{" "}
                                      <span>
                                        {data?.payload?.tech_lang_keys["25"]}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong className="text-blue">
                                        {result?.tech_km_h}
                                      </strong>{" "}
                                      <span>
                                        {data?.payload?.tech_lang_keys["26"]}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong className="text-blue">
                                        {result?.tech_m_m}
                                      </strong>{" "}
                                      <span>
                                        {data?.payload?.tech_lang_keys["27"]}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong className="text-blue">
                                        {result?.tech_m_s}
                                      </strong>{" "}
                                      <span>
                                        {data?.payload?.tech_lang_keys["28"]}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong className="text-blue">
                                        {result?.tech_yd_m}
                                      </strong>{" "}
                                      <span>
                                        {data?.payload?.tech_lang_keys["29"]}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">
                                      <strong className="text-blue">
                                        {result?.tech_yd_s}
                                      </strong>{" "}
                                      <span>
                                        {data?.payload?.tech_lang_keys["30"]}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : formData?.tech_calculator_name === "calculator2" ? (
                          <>
                            <div className="w-full px-lg-3 overflow-auto">
                              <table className="w-full" cellSpacing="0">
                                <thead>
                                  <tr>
                                    <th
                                      className="text-blue border-b p-2"
                                      colSpan={4}
                                    >
                                      {data?.payload?.tech_lang_keys["31"]}
                                    </th>
                                    <th
                                      className="text-start text-blue border-s border-b p-2"
                                      rowSpan={2}
                                    >
                                      {data?.payload?.tech_lang_keys["32"]}{" "}
                                      <br /> (hh:mm:ss{" "}
                                      {data?.payload?.tech_lang_keys["6"]})
                                    </th>
                                  </tr>
                                  <tr>
                                    <th className="text-start text-blue border-b p-2">
                                      #
                                    </th>
                                    <th className="text-start text-blue border-b p-2">
                                      {data?.payload?.tech_lang_keys["3"]}{" "}
                                      <br /> ({formData?.tech_dis_unit1})
                                    </th>
                                    <th className="text-start text-blue border-b p-2">
                                      {data?.payload?.tech_lang_keys["2"]}{" "}
                                      <br /> (hh:mm:ss)
                                    </th>
                                    <th className="text-start text-blue border-b p-2">
                                      {data?.payload?.tech_lang_keys["1"]}{" "}
                                      <br /> (hh:mm:ss{" "}
                                      {data?.payload?.tech_lang_keys["6"]})
                                    </th>
                                  </tr>
                                </thead>

                                <tbody
                                  dangerouslySetInnerHTML={{
                                    __html: result?.tech_table,
                                  }}
                                />
                              </table>

                              <p className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["33"]}{" "}
                                  (hh:mm:ss):{" "}
                                  <span className="text-[#119154] text-[20px]">
                                    {gettime(result?.tech_stime)}{" "}
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </span>
                                </strong>
                              </p>

                              <div id="ourchart" className="w-full mt-3">
                                <Bar
                                  style={{ height: "250px" }}
                                  data={chartdata}
                                  options={options}
                                />
                              </div>
                            </div>
                          </>
                        ) : formData?.tech_calculator_name === "calculator1" ? (
                          <>
                            {formData?.tech_type === "pace" && (
                              <>
                                <div className="w-full">
                                  <div className="w-full px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {gethours(result?.tech_pace)} Hours{" "}
                                        {getmins(result?.tech_pace)} Min{" "}
                                        {getsecs(result?.tech_pace)} Sec
                                      </strong>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]}
                                      </strong>
                                    </div>
                                  </div>
                                  <div className="w-full px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {gethours(result?.tech_pacekm)} Hours{" "}
                                        {getmins(result?.tech_pacekm)} Min{" "}
                                        {getsecs(result?.tech_pacekm)} Sec
                                      </strong>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </strong>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {result?.tech_mi_h}
                                      </strong>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}
                                      </strong>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {result?.tech_km_h}
                                      </strong>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["26"]}
                                      </strong>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {result?.tech_m_m}
                                      </strong>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["27"]}
                                      </strong>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {result?.tech_m_s}
                                      </strong>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["28"]}
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {formData?.tech_type === "time" && (
                              <>
                                <div className="w-full">
                                  <div className="w-full px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["34"]} =
                                      </strong>
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {gethours(result?.tech_timeres)} Hours{" "}
                                        {getmins(result?.tech_timeres)} Min{" "}
                                        {getsecs(result?.tech_timeres)} Sec
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {formData?.tech_type === "distance" && (
                              <>
                                <div className="w-full">
                                  <p className="px-lg-3">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["3"]}:
                                    </strong>
                                  </p>

                                  <div className="col-lg-6 px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {Number(result?.tech_dis_mi).toFixed(3)}
                                      </strong>
                                      <span>
                                        {data?.payload?.tech_lang_keys["35"]}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-lg-6 px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {Number(result?.tech_dis_km).toFixed(3)}
                                      </strong>
                                      <span>
                                        {data?.payload?.tech_lang_keys["36"]}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-lg-6 px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {Number(result?.tech_dis_m).toFixed(3)}
                                      </strong>
                                      <span>
                                        {data?.payload?.tech_lang_keys["37"]}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-lg-6 px-lg-3 py-2">
                                    <div className="bg-sky bordered rounded-lg p-3">
                                      <strong className="text-[#119154] text-[20px] px-1">
                                        {Number(result?.tech_dis_yd).toFixed(3)}
                                      </strong>
                                      <span>
                                        {data?.payload?.tech_lang_keys["38"]}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        ) : null}

                        {formData?.tech_calculator_name !== "calculator2" &&
                          formData?.tech_calculator_name !== "calculator3" &&
                          formData?.tech_calculator_name !== "calculator4" && (
                            <>
                              <p className="px-lg-3 mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["39"]}:
                                </strong>
                              </p>
                              <div className="w-full px-lg-3 overflow-auto">
                                <table
                                  className="w-full col-lg-11"
                                  cellSpacing="0"
                                >
                                  <thead>
                                    <tr>
                                      <th className="text-start text-blue border-b py-2">
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </th>
                                      <th className="text-start text-blue border-b py-2">
                                        {data?.payload?.tech_lang_keys["2"]}{" "}
                                        (hh:mm:ss)
                                      </th>
                                      <th className="text-start text-blue border-b py-2">
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </th>
                                      <th className="text-start text-blue border-b py-2">
                                        {data?.payload?.tech_lang_keys["2"]}{" "}
                                        (hh:mm:ss)
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border-b py-2">1 km</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pacekm * 1)}
                                      </td>
                                      <td className="border-b py-2">1 mi</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pace * 1)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">3 km</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pacekm * 3)}
                                      </td>
                                      <td className="border-b py-2">3 mi</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pace * 3)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">5 km</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pacekm * 5)}
                                      </td>
                                      <td className="border-b py-2">5 mi</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pace * 5)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">10 km</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pacekm * 10)}
                                      </td>
                                      <td className="border-b py-2">10 mi</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pace * 10)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">15 km</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pacekm * 15)}
                                      </td>
                                      <td className="border-b py-2">15 mi</td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pace * 15)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2">
                                        Marathon
                                      </td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pacekm * 42.195)}
                                      </td>
                                      <td className="border-b py-2">
                                        Half-Marathon
                                      </td>
                                      <td className="border-b py-2">
                                        {gettime(result?.tech_pacekm * 21.0975)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-2">400 m</td>
                                      <td className="py-2">
                                        {gettime(
                                          result?.tech_pacekm * (400 / 1000)
                                        )}
                                      </td>
                                      <td className="py-2">800 m</td>
                                      <td className="py-2">
                                        {gettime(
                                          result?.tech_pacekm * (800 / 1000)
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}

                        {result?.tech_dis_km >= 3 &&
                          formData?.tech_calculator_name !== "calculator2" && (
                            <>
                              <p className="px-lg-3 mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["40"]}:
                                </strong>
                              </p>
                              <div className="w-full flex flex-col md:flex-row">
                                {/* KM Table */}
                                <div className="w-full md:w-[60%] lg:w-[60%] px-lg-3 pe-md-3 overflow-auto">
                                  <table className="w-full" cellSpacing="0">
                                    <thead>
                                      <tr>
                                        <th className="text-start text-blue border-b py-2">
                                          {data?.payload?.tech_lang_keys["3"]}
                                        </th>
                                        <th className="text-start text-blue border-b py-2">
                                          {data?.payload?.tech_lang_keys["2"]}{" "}
                                          (hh:mm:ss)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.from(
                                        {
                                          length: Math.floor(
                                            result?.tech_dis_km
                                          ),
                                        },
                                        (_, i) => i + 1
                                      ).map((i) => (
                                        <tr key={`km-${i}`}>
                                          <td
                                            className={`${
                                              i !==
                                              Math.round(result?.tech_dis_km) -
                                                1
                                                ? "border-b"
                                                : ""
                                            } py-2`}
                                          >
                                            {i} km
                                          </td>
                                          <td
                                            className={`${
                                              i !==
                                              Math.round(result?.tech_dis_km) -
                                                1
                                                ? "border-b"
                                                : ""
                                            } py-2`}
                                          >
                                            {gettime(result?.tech_pacekm * i)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Miles Table */}
                                <div className="w-full md:w-[60%] lg:w-[60%] px-lg-3 ps-md-3 mt-3 mt-md-0 overflow-auto">
                                  <table className="w-full" cellSpacing="0">
                                    <thead>
                                      <tr>
                                        <th className="text-start text-blue border-b py-2">
                                          {data?.payload?.tech_lang_keys["3"]}
                                        </th>
                                        <th className="text-start text-blue border-b py-2">
                                          {data?.payload?.tech_lang_keys["2"]}{" "}
                                          (hh:mm:ss)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.from(
                                        {
                                          length: Math.floor(
                                            result?.tech_dis_mi
                                          ),
                                        },
                                        (_, i) => i + 1
                                      ).map((i) => (
                                        <tr key={`mi-${i}`}>
                                          <td
                                            className={`${
                                              i !==
                                              Math.round(result?.tech_dis_mi) -
                                                1
                                                ? "border-b"
                                                : ""
                                            } py-2`}
                                          >
                                            {i} mi
                                          </td>
                                          <td
                                            className={`${
                                              i !==
                                              Math.round(result?.tech_dis_mi) -
                                                1
                                                ? "border-b"
                                                : ""
                                            } py-2`}
                                          >
                                            {gettime(result?.tech_pace * i)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </>
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

export default PaceCalculator;
