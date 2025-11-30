"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useHeightComparisonMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const HeightComparison = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let url = "";

  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
  }

  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();

  const handleFetchDetails = async () => {
    try {
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  // Persons array for multiple person inputs
  const [persons, setPersons] = useState([
    { id: 1, name: "", gender: "male", height: "", height_unit: "cm" },
  ]);

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [calculateHeightComparison, { isLoading: calculationLoading }] =
    useHeightComparisonMutation();

  // Add new person
  const addPerson = () => {
    setPersons([
      ...persons,
      {
        id: Date.now(),
        name: "",
        gender: "male",
        height: "",
        height_unit: "cm",
      },
    ]);
  };

  // Remove person
  const removePerson = (id) => {
    if (persons.length > 1) {
      setPersons(persons.filter((p) => p.id !== id));
    }
    setResult(null);
    setFormError(null);
  };

  // Update person field
  const updatePerson = (id, field, value) => {
    setPersons(
      persons.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    for (let i = 0; i < persons.length; i++) {
      const person = persons[i];
      if (!person.name || !person.height || !person.height_unit) {
        setFormError(`Please fill all fields for Person ${i + 1}`);
        return;
      }
    }

    if (persons.length < 2) {
      setFormError("Please add at least 2 persons to compare");
      return;
    }

    setFormError("");
    try {
      const response = await calculateHeightComparison({
        persons: persons.map((p) => ({
          name: p.name,
          gender: p.gender,
          height: p.height,
          height_unit: p.height_unit,
        })),
      }).unwrap();

      // Response has nested payload structure
      const resultData = response?.payload?.payload || response?.payload;
      setResult(resultData);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  const handleReset = () => {
    setPersons([
      { id: 1, name: "", gender: "male", height: "", height_unit: "cm" },
    ]);
    setResult(null);
    setFormError(null);
  };

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

  const getPersonColor = (index) => {
    const colors = [
      "bg-purple-500",
      "bg-violet-500",
      "bg-teal-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-orange-500",
      "bg-indigo-500",
    ];
    return colors[index % colors.length];
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
          path: pathname,
        },
      ]}
    >
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="w-full ">
            {/* Add Person Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold ">
                {data?.payload?.tech_lang_keys?.["add_people"] ||
                  "Add People to Compare"}
              </h3>
              <button
                type="button"
                onClick={addPerson}
                className="px-4 py-2 cursor-pointer bg-[#2845F5] text-[#fff] hover:bg-[#1A1A1A] hover:text-white  rounded-lg  transition text-sm"
              >
                +{" "}
                {data?.payload?.tech_lang_keys?.["add_person"] || "Add Person"}
              </button>
            </div>

            {/* Persons List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {persons.map((person, index) => (
                <div
                  key={person.id}
                  className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold ">
                      {data?.payload?.tech_lang_keys?.["person"] || "Person"}{" "}
                      {index + 1}
                    </span>

                    {persons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePerson(person.id)}
                        className="text-red-500 cursor-pointer hover:text-red-700 text-sm font-medium"
                      >
                        {data?.payload?.tech_lang_keys?.["remove"] || "Remove"}
                      </button>
                    )}
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-12 gap-2">
                    {/* Name */}
                    <div className="col-span-12">
                      <label className="label text-sm">
                        {data?.payload?.tech_lang_keys?.["name"] || "Name"}:
                      </label>
                      <input
                        type="text"
                        className="input w-full"
                        placeholder={
                          data?.payload?.tech_lang_keys?.["enter_name"] ||
                          "Enter name"
                        }
                        value={person.name}
                        onChange={(e) =>
                          updatePerson(person.id, "name", e.target.value)
                        }
                      />
                    </div>

                    {/* Gender */}
                    <div className="col-span-12 ">
                      <label className="label text-sm">
                        {data?.payload?.tech_lang_keys?.["gender"] || "Gender"}:
                      </label>
                      <select
                        className="input w-full"
                        value={person.gender}
                        onChange={(e) =>
                          updatePerson(person.id, "gender", e.target.value)
                        }
                      >
                        <option value="male">
                          {data?.payload?.tech_lang_keys?.["male"] || "Male"}
                        </option>
                        <option value="female">
                          {data?.payload?.tech_lang_keys?.["female"] ||
                            "Female"}
                        </option>
                        <option value="other">
                          {data?.payload?.tech_lang_keys?.["other"] || "Other"}
                        </option>
                      </select>
                    </div>

                    {/* Height */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className="label text-sm">
                        {data?.payload?.tech_lang_keys?.["height"] || "Height"}:
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="input w-full"
                        placeholder="0"
                        value={person.height}
                        onChange={(e) =>
                          updatePerson(person.id, "height", e.target.value)
                        }
                      />
                    </div>

                    {/* Unit */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className="label text-sm">
                        {data?.payload?.tech_lang_keys?.["unit"] || "Unit"}:
                      </label>
                      <select
                        className="input w-full"
                        value={person.height_unit}
                        onChange={(e) =>
                          updatePerson(person.id, "height_unit", e.target.value)
                        }
                      >
                        <option value="ft">
                          {data?.payload?.tech_lang_keys?.["feet"] || "Feet"}
                        </option>
                        <option value="inch">
                          {data?.payload?.tech_lang_keys?.["inches"] ||
                            "Inches"}
                        </option>
                        <option value="cm">
                          {data?.payload?.tech_lang_keys?.["cm"] ||
                            "Centimeters"}
                        </option>
                        <option value="m">
                          {data?.payload?.tech_lang_keys?.["meters"] ||
                            "Meters"}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculationLoading}>
              {data?.payload?.tech_lang_keys?.["calculate"] || "Calculate"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        {calculationLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  {/* Summary Statistics */}
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {data?.payload?.tech_lang_keys?.["summary"] ||
                        "Summary Statistics"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                      {/* Total Persons */}
                      <div className=" rounded-lg p-4 bordered bg-white ">
                        <p className="text-sm  font-medium mb-1">
                          {data?.payload?.tech_lang_keys?.["total_persons"] ||
                            "Total Persons"}
                        </p>
                        <p className="text-2xl font-bold text-[#2845F5]">
                          {result?.summary?.total_persons}
                        </p>
                      </div>

                      {/* Average Height */}
                      <div className=" rounded-lg p-4 bordered bg-white ">
                        <p className="text-sm  font-medium mb-1">
                          {data?.payload?.tech_lang_keys?.["average_height"] ||
                            "Average Height"}
                        </p>
                        <p className="text-2xl font-bold text-[#2845F5]">
                          {result?.summary?.average_height?.height}
                        </p>
                      </div>

                      {/* Tallest */}
                      <div className=" rounded-lg p-4 bordered bg-white ">
                        <p className="text-sm  font-medium mb-1">
                          {data?.payload?.tech_lang_keys?.["tallest"] ||
                            "Tallest"}
                        </p>
                        <p className="text-2xl font-bold text-[#2845F5]">
                          {result?.summary?.tallest?.name}
                        </p>
                        <p className="text-lg ">
                          {result?.summary?.tallest?.height}
                        </p>
                      </div>

                      {/* Shortest */}
                      <div className=" rounded-lg p-4 bordered bg-white ">
                        <p className="text-sm  font-medium mb-1">
                          {data?.payload?.tech_lang_keys?.["shortest"] ||
                            "Shortest"}
                        </p>
                        <p className="text-2xl font-bold text-[#2845F5]">
                          {result?.summary?.shortest?.name}
                        </p>
                        <p className="text-lg ">
                          {result?.summary?.shortest?.height}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Comparison Chart */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {data?.payload?.tech_lang_keys?.["visual_comparison"] ||
                        "Visual Comparison"}
                    </h3>

                    <div className="relative bg-gray-100 rounded-lg p-4 bordered ">
                      <div className="flex flex-wrap items-end justify-start gap-4">
                        {result?.persons?.map((person, index) => {
                          const maxHeight = result?.summary?.tallest?.cm;
                          const heightPercentage =
                            (person?.height?.cm / maxHeight) * 100;

                          return (
                            <div
                              key={index}
                              className="flex flex-col items-center "
                            >
                              <div className="text-lg text-center font-medium  mb-1 truncate w-full">
                                {person?.name}
                              </div>

                              <div
                                className="w-full bg-[#2845F5] rounded-t-lg flex items-end justify-center pb-2"
                                style={{
                                  height: `${heightPercentage}%`,
                                  minHeight: "40px",
                                }}
                              >
                                <span className="text-[16px] font-bold text-white whitespace-nowrap">
                                  {person?.height?.display}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Rankings */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold  mb-4">
                      {data?.payload?.tech_lang_keys?.["rankings"] ||
                        "Detailed Rankings"}
                    </h3>

                    <div className="space-y-3">
                      {result?.persons?.map((person, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-300 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-[#2845F5]">
                                #{person?.rank}
                              </span>
                              <div>
                                <div className="font-semibold ">
                                  {person?.name}
                                </div>
                                <div className="text-lg text-gray-500">
                                  {person?.gender}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2lg font-bold ">
                                {person?.height?.display}
                              </div>
                              <div className="text-lg text-gray-500">
                                {data?.payload?.tech_lang_keys?.["input"] ||
                                  "Input"}
                                : {person?.original_input}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-lg mt-2">
                            <div className="bg-[#2845F5] text-white rounded px-2 py-1 bordered ">
                              <span className="text-white">
                                {data?.payload?.tech_lang_keys?.[
                                  "from_tallest"
                                ] || "From tallest"}
                                :
                              </span>
                              <span className="font-semibold ml-1">
                                {person?.difference_from_tallest?.cm} cm
                              </span>
                            </div>

                            <div className="bg-[#2845F5] text-white rounded px-2 py-1 border border-gray-200">
                              <span className="text-white">
                                {data?.payload?.tech_lang_keys?.[
                                  "from_average"
                                ] || "From avg"}
                                :
                              </span>
                              <span className="font-semibold ml-1">
                                {person?.difference_from_average?.cm > 0
                                  ? "+"
                                  : ""}
                                {person?.difference_from_average?.cm} cm
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default HeightComparison;
