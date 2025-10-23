"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBowlingCcoreCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BowlingScoreCalculator = () => {
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

  const [calculateEbitCalculator, { isLoading: roundToTheNearestLoading }] =
    useBowlingCcoreCalculatorMutation();

  // Bowling Game State
  const [frames, setFrames] = useState(() =>
    Array(10)
      .fill()
      .map(() => ({ rolls: [], score: 0, isComplete: false, totalScore: 0 }))
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentRoll, setCurrentRoll] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // Currency state
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  // Fetch calculator details
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

  // Currency fetch
  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    };
    fetchCurrency();
  }, []);

  // Calculate scores
  const calculateScores = (updatedFrames) => {
    const newFrames = [...updatedFrames];
    let runningTotal = 0;

    for (let i = 0; i < 10; i++) {
      const frame = newFrames[i];
      let frameScore = 0;

      if (i === 9) {
        // 10th frame
        frameScore = frame.rolls.reduce((sum, roll) => sum + roll, 0);
      } else {
        const [first, second] = frame.rolls;
        frameScore = (first || 0) + (second || 0);

        // Strike bonus
        if (first === 10) {
          if (i === 8) {
            // 9th frame strike, look at 10th frame
            const tenthFrame = newFrames[9];
            frameScore +=
              (tenthFrame.rolls[0] || 0) + (tenthFrame.rolls[1] || 0);
          } else if (newFrames[i + 1].rolls.length > 0) {
            frameScore += newFrames[i + 1].rolls[0] || 0;
            if (
              newFrames[i + 1].rolls[0] === 10 &&
              i < 8 &&
              newFrames[i + 2].rolls.length > 0
            ) {
              frameScore += newFrames[i + 2].rolls[0] || 0;
            } else if (newFrames[i + 1].rolls.length > 1) {
              frameScore += newFrames[i + 1].rolls[1] || 0;
            }
          }
        }
        // Spare bonus
        else if (
          (first || 0) + (second || 0) === 10 &&
          frame.rolls.length === 2
        ) {
          if (i === 8) {
            // 9th frame spare, look at 10th frame
            const tenthFrame = newFrames[9];
            frameScore += tenthFrame.rolls[0] || 0;
          } else if (newFrames[i + 1].rolls.length > 0) {
            frameScore += newFrames[i + 1].rolls[0] || 0;
          }
        }
      }

      newFrames[i].score = frameScore;
      runningTotal += frameScore;
      newFrames[i].totalScore = runningTotal;
    }

    setFrames(newFrames);
    setTotalScore(runningTotal);
    return runningTotal;
  };

  // Calculate available pins for current roll
  const getAvailablePins = () => {
    if (currentFrame === 9) {
      // 10th frame special rules
      const frame = frames[9];
      if (frame.rolls.length === 0) return 10;
      if (frame.rolls.length === 1) {
        return frame.rolls[0] === 10 ? 10 : 10 - frame.rolls[0];
      }
      if (frame.rolls.length === 2) {
        if (frame.rolls[0] === 10 || frame.rolls[0] + frame.rolls[1] === 10) {
          return 10;
        }
        return 0;
      }
      return 0;
    } else {
      const frame = frames[currentFrame];
      if (frame.rolls.length === 0) return 10;
      if (frame.rolls.length === 1) {
        return frame.rolls[0] === 10 ? 0 : 10 - frame.rolls[0];
      }
      return 0;
    }
  };

  // Handle pin selection
  const handlePinSelect = (pins) => {
    if (gameComplete) return;

    const newFrames = [...frames];
    const frame = newFrames[currentFrame];
    frame.rolls.push(pins);

    // Calculate scores immediately after updating rolls
    const newTotalScore = calculateScores(newFrames);

    // Move to next roll/frame
    if (currentFrame === 9) {
      // 10th frame
      if (
        frame.rolls.length === 3 ||
        (frame.rolls.length === 2 &&
          frame.rolls[0] !== 10 &&
          frame.rolls[0] + frame.rolls[1] !== 10)
      ) {
        setGameComplete(true);
        setResult({ totalScore: newTotalScore });
      }
    } else {
      if (pins === 10 || frame.rolls.length === 2) {
        frame.isComplete = true;
        setCurrentFrame((prev) => prev + 1);
        setCurrentRoll(0);
      } else {
        setCurrentRoll(1);
      }
    }
  };

  // Reset game
  const handleReset = () => {
    setFrames(
      Array(10)
        .fill()
        .map(() => ({ rolls: [], score: 0, isComplete: false, totalScore: 0 }))
    );
    setCurrentFrame(0);
    setCurrentRoll(0);
    setTotalScore(0);
    setGameComplete(false);
    setResult(null);
    setFormError("");
  };

  // Render frame display
  const renderFrame = (frame, index) => {
    const isActive = index === currentFrame && !gameComplete;
    const isLastFrame = index === 9;

    const getRollDisplay = (rollIndex) => {
      const roll = frame.rolls[rollIndex];
      if (roll === undefined) return "";

      if (isLastFrame) {
        if (rollIndex === 0) return roll === 10 ? "X" : roll.toString();
        if (rollIndex === 1) {
          if (frame.rolls[0] === 10) return roll === 10 ? "X" : roll.toString();
          return frame.rolls[0] + roll === 10 ? "/" : roll.toString();
        }
        if (rollIndex === 2) {
          if (frame.rolls[1] === 10 || frame.rolls[0] === 10) {
            return roll === 10 ? "X" : roll.toString();
          }
          return frame.rolls[0] + frame.rolls[1] + roll === 10
            ? "/"
            : roll.toString();
        }
      } else {
        if (rollIndex === 0) return roll === 10 ? "X" : roll.toString();
        if (rollIndex === 1)
          return frame.rolls[0] + roll === 10 ? "/" : roll.toString();
      }
      return roll.toString();
    };

    return (
      <div
        key={index}
        className={`border-2 p-2 bg-white ${
          isActive ? "border-blue-500 bg-blue-50" : "bordered"
        }`}
      >
        <div className="text-xs font-bold mb-1 text-center">
          Frame {index + 1}
        </div>

        <div className="grid grid-cols-2 gap-1 mb-2 h-8">
          {isLastFrame ? (
            <div className="col-span-2 grid grid-cols-3 gap-1">
              <div className="bg-gray-100 flex items-center justify-center text-sm font-bold">
                {getRollDisplay(0)}
              </div>
              <div className="bg-gray-100 flex items-center justify-center text-sm font-bold">
                {getRollDisplay(1)}
              </div>
              <div className="bg-gray-100 flex items-center justify-center text-sm font-bold">
                {getRollDisplay(2)}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gray-100 flex items-center justify-center text-sm font-bold">
                {getRollDisplay(0)}
              </div>
              <div className="bg-gray-100 flex items-center justify-center text-sm font-bold">
                {frame.rolls[0] === 10 ? "" : getRollDisplay(1)}
              </div>
            </>
          )}
        </div>

        <div className="bg-yellow-100 p-1 text-center font-bold text-lg">
          {frame.totalScore || 0}
        </div>
      </div>
    );
  };

  const availablePins = getAvailablePins();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
      {/* Form for API submission */}
      <div className="w-full mx-auto p-4 lg:p-4 md:p-8 input_form rounded-lg space-y-6 mb-3">
        {formError && (
          <p className="text-red-500 text-lg font-semibold w-full">
            {formError}
          </p>
        )}
        <div className="r from-blue-50 to-green-50 ">
          {/* Score Display */}
          <div className=" rounded-xl  mb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Scorecard</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-green-600">
                  Total Score: {totalScore}
                </div>
                {gameComplete && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="font-bold">Game Complete!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Frames Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2 mb-4">
              {frames.map((frame, index) => renderFrame(frame, index))}
            </div>

            {/* Game Status */}
            {!gameComplete && (
              <div className="text-center text-sm text-gray-600">
                Current: Frame {currentFrame + 1}, Roll {currentRoll + 1}
              </div>
            )}
          </div>
          {/* Pin Selection */}
          {!gameComplete && (
            <div className="bg-white p-4 rounded-xl  mb-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Select Pins Knocked Down</h3>
              </div>

              <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
                {Array.from({ length: availablePins + 1 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePinSelect(i)}
                    className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-lg transition-colors transform hover:scale-105 active:scale-95"
                  >
                    {i}
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-3 text-center">
                Available pins to knock down: {availablePins}
              </p>
            </div>
          )}

          <div className="mb-6 mt-10 text-center space-x-2">
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
      </div>
      {/* Loading State */}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold text-green-600">
                  Final Score: {totalScore}
                </h3>
                <p className="text-gray-600">
                  Strikes: {frames.filter((f) => f.rolls[0] === 10).length}
                </p>
                <p className="text-gray-600">
                  Spares:{" "}
                  {
                    frames.filter(
                      (f, i) =>
                        i < 9 &&
                        f.rolls[0] !== 10 &&
                        f.rolls[0] + f.rolls[1] === 10
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        )
      )}

      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default BowlingScoreCalculator;
