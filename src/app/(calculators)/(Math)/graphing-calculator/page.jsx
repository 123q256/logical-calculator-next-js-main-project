"use client";
import React, { useState, useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import { evaluate } from "mathjs";

import {
  useGetSingleCalculatorDetailsMutation,
  useMidpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const evaluateExpression = (expr, x) => {
  try {
    // '^' ko '**' me convert karna (JS style)
    const safeExpr = expr.replace(/\^/g, "**");
    return evaluate(safeExpr, { x });
  } catch (error) {
    return NaN;
  }
};

const OnlineGraphingCalculator = () => {
  // data get

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
  // data get

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const canvasRef = useRef(null);
  const [equations, setEquations] = useState(["x^2"]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [showGrid, setShowGrid] = useState(true);
  const [colors] = useState([
    "#2563eb",
    "#dc2626",
    "#16a34a",
    "#ca8a04",
    "#9333ea",
  ]);
  const [isPlotting, setIsPlotting] = useState(false);

  // Mathematical expression evaluator
  const evaluateExpression = (expr, x) => {
    try {
      // Replace mathematical functions and operators
      let processedExpr = expr
        .replace(/\^/g, "**")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/abs/g, "Math.abs")
        .replace(/pi/g, "Math.PI")
        .replace(/e(?![a-zA-Z])/g, "Math.E")
        .replace(/x/g, `(${x})`);

      const result = eval(processedExpr);
      return isFinite(result) ? result : NaN;
    } catch (error) {
      return NaN;
    }
  };

  // Convert math coordinates to canvas coordinates
  const mathToCanvas = (x, y, canvas) => {
    const canvasX = ((x - xMin) / (xMax - xMin)) * canvas.width;
    const canvasY =
      canvas.height - ((y - yMin) / (yMax - yMin)) * canvas.height;
    return { x: canvasX, y: canvasY };
  };

  // Draw grid
  const drawGrid = (ctx, canvas) => {
    if (!showGrid) return;

    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1;

    // Vertical grid lines
    const xStep = (xMax - xMin) / 20;
    for (let x = xMin; x <= xMax; x += xStep) {
      const canvasPos = mathToCanvas(x, 0, canvas);
      ctx.beginPath();
      ctx.moveTo(canvasPos.x, 0);
      ctx.lineTo(canvasPos.x, canvas.height);
      ctx.stroke();
    }

    // Horizontal grid lines
    const yStep = (yMax - yMin) / 20;
    for (let y = yMin; y <= yMax; y += yStep) {
      const canvasPos = mathToCanvas(0, y, canvas);
      ctx.beginPath();
      ctx.moveTo(0, canvasPos.y);
      ctx.lineTo(canvas.width, canvasPos.y);
      ctx.stroke();
    }
  };

  // Draw axes
  const drawAxes = (ctx, canvas) => {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    // X-axis
    if (yMin <= 0 && yMax >= 0) {
      const yPos = mathToCanvas(0, 0, canvas).y;
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(canvas.width, yPos);
      ctx.stroke();

      // X-axis labels
      ctx.fillStyle = "#666666";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      const xStep = (xMax - xMin) / 10;
      for (let x = xMin; x <= xMax; x += xStep) {
        if (Math.abs(x) > 0.1) {
          const canvasPos = mathToCanvas(x, 0, canvas);
          ctx.fillText(x.toFixed(1), canvasPos.x, yPos + 20);
        }
      }
    }

    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
      const xPos = mathToCanvas(0, 0, canvas).x;
      ctx.beginPath();
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, canvas.height);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = "#666666";
      ctx.font = "12px Arial";
      ctx.textAlign = "right";
      const yStep = (yMax - yMin) / 10;
      for (let y = yMin; y <= yMax; y += yStep) {
        if (Math.abs(y) > 0.1) {
          const canvasPos = mathToCanvas(0, y, canvas);
          ctx.fillText(y.toFixed(1), xPos - 10, canvasPos.y + 4);
        }
      }
    }
  };

  // Plot function
  const plotFunction = (ctx, canvas, equation, color) => {
    if (!equation.trim()) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    let firstPoint = true;
    const step = (xMax - xMin) / canvas.width;

    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateExpression(equation, x);

      if (!isNaN(y) && isFinite(y) && y >= yMin && y <= yMax) {
        const canvasPos = mathToCanvas(x, y, canvas);

        if (firstPoint) {
          ctx.moveTo(canvasPos.x, canvasPos.y);
          firstPoint = false;
        } else {
          ctx.lineTo(canvasPos.x, canvasPos.y);
        }
      } else if (!firstPoint) {
        // Break the line for discontinuities
        ctx.stroke();
        ctx.beginPath();
        firstPoint = true;
      }
    }

    ctx.stroke();
  };

  // Main drawing function
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas);

    // Draw axes
    drawAxes(ctx, canvas);

    // Plot each equation
    equations.forEach((equation, index) => {
      if (equation.trim()) {
        plotFunction(ctx, canvas, equation, colors[index]);
      }
    });
  };

  // Redraw when dependencies change
  useEffect(() => {
    setIsPlotting(true);
    const timer = setTimeout(() => {
      drawGraph();
      setIsPlotting(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [equations, xMin, xMax, yMin, yMax, showGrid]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => drawGraph();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [equations, xMin, xMax, yMin, yMax, showGrid]);

  const handleEquationChange = (index, value) => {
    const newEquations = [...equations];
    newEquations[index] = value;
    setEquations(newEquations);
  };

  const addEquation = () => {
    if (equations.length < 5) {
      setEquations([...equations, ""]);
    }
  };

  const removeEquation = (index) => {
    if (equations.length > 1) {
      const newEquations = equations.filter((_, i) => i !== index);
      setEquations(newEquations);
    }
  };

  const resetGraph = () => {
    setEquations(["x^2"]);
    setXMin(-10);
    setXMax(10);
    setYMin(-10);
    setYMax(10);
  };

  const zoomIn = () => {
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;
    const rangeX = (xMax - xMin) * 0.3;
    const rangeY = (yMax - yMin) * 0.3;

    setXMin(centerX - rangeX);
    setXMax(centerX + rangeX);
    setYMin(centerY - rangeY);
    setYMax(centerY + rangeY);
  };

  const zoomOut = () => {
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;
    const rangeX = (xMax - xMin) * 0.8;
    const rangeY = (yMax - yMin) * 0.8;

    setXMin(centerX - rangeX);
    setXMax(centerX + rangeX);
    setYMin(centerY - rangeY);
    setYMax(centerY + rangeY);
  };

  return (
    <Calculator
      // isLoading={isLoading}
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
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
        <div className=" w-full mx-auto ">
          <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-6">
                {/* Left Panel - Controls */}
                <div className="col-span-12 md:col-span-5">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Function Input
                    </h3>

                    {/* Equations */}
                    {equations.map((eq, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: colors[index] }}
                          ></div>
                          <label className="text-sm font-medium text-gray-700">
                            f{index + 1}(x) =
                          </label>
                        </div>
                        <div className="flex mt-1">
                          <input
                            type="text"
                            value={eq}
                            onChange={(e) =>
                              handleEquationChange(index, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter function (e.g., x^2, sin(x), 2*x+1)"
                          />
                          {equations.length > 1 && (
                            <button
                              onClick={() => removeEquation(index)}
                              className="px-3 cursor-pointer py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {equations.length < 5 && (
                      <button
                        onClick={addEquation}
                        className="w-full py-2 cursor-pointer px-4 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
                      >
                        + Add Function
                      </button>
                    )}

                    {/* Graph Settings */}
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      Graph Settings
                    </h4>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          X Min
                        </label>
                        <input
                          type="number"
                          value={xMin}
                          onChange={(e) =>
                            setXMin(parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          X Max
                        </label>
                        <input
                          type="number"
                          value={xMax}
                          onChange={(e) =>
                            setXMax(parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Y Min
                        </label>
                        <input
                          type="number"
                          value={yMin}
                          onChange={(e) =>
                            setYMin(parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Y Max
                        </label>
                        <input
                          type="number"
                          value={yMax}
                          onChange={(e) =>
                            setYMax(parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={zoomIn}
                          className="flex-1 py-2 px-4 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Zoom In
                        </button>
                        <button
                          onClick={zoomOut}
                          className="flex-1 py-2 px-4 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Zoom Out
                        </button>
                      </div>

                      <button
                        onClick={resetGraph}
                        className="w-full py-2 px-4 cursor-pointer bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      >
                        Reset Graph
                      </button>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showGrid"
                          checked={showGrid}
                          onChange={(e) => setShowGrid(e.target.checked)}
                          className="mr-2"
                        />
                        <label
                          htmlFor="showGrid"
                          className="text-sm text-gray-700"
                        >
                          Show Grid
                        </label>
                      </div>
                    </div>

                    {/* Function Examples */}
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800">
                        Function Examples
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-gray-100 rounded">
                          <strong>Linear:</strong> 2*x + 3, -0.5*x + 1
                        </div>
                        <div className="p-2 bg-gray-100 rounded">
                          <strong>Quadratic:</strong> x^2, -x^2 + 4*x - 1
                        </div>
                        <div className="p-2 bg-gray-100 rounded">
                          <strong>Trigonometric:</strong> sin(x), cos(x), tan(x)
                        </div>
                        <div className="p-2 bg-gray-100 rounded">
                          <strong>Exponential:</strong> 2^x, Math.E^x
                        </div>
                        <div className="p-2 bg-gray-100 rounded">
                          <strong>Logarithmic:</strong> log(x), ln(x)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Panel - Graph */}
                <div className="col-span-12 md:col-span-7">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Graph Visualization
                    </h3>

                    {isPlotting && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                        <div className="text-blue-500 font-semibold">
                          Plotting...
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-96 border border-gray-300 rounded-lg bg-white"
                        style={{ maxWidth: "100%", height: "400px" }}
                      />
                    </div>

                    {/* Function Legend */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-gray-800">
                        Active Functions:
                      </h4>
                      <div className="space-y-1">
                        {equations.map(
                          (eq, index) =>
                            eq.trim() && (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: colors[index] }}
                                ></div>
                                <span className="text-sm">
                                  f{index + 1}(x) = {eq}
                                </span>
                              </div>
                            )
                        )}
                      </div>
                    </div>

                    {/* Graph Info */}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Domain:</strong> [{xMin}, {xMax}]
                      </div>
                      <div>
                        <strong>Range:</strong> [{yMin}, {yMax}]
                      </div>
                    </div>
                  </div>

                  {/* Quick Functions */}
                  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Quick Functions
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {[
                        "x^2",
                        "x^3",
                        "sin(x)",
                        "cos(x)",
                        "tan(x)",
                        "sqrt(x)",
                        "ln(x)",
                        "log(x)",
                        "1/x",
                        "abs(x)",
                        "2^x",
                        "x^2 - 4",
                        "sin(x)*cos(x)",
                      ].map((func, index, arr) => (
                        <button
                          key={index}
                          onClick={() => handleEquationChange(0, func)}
                          className={`py-2 px-3 cursor-pointer bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm font-medium 
                                          ${
                                            index === arr.length - 1
                                              ? "col-span-3"
                                              : ""
                                          }`}
                        >
                          {func}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mathematical Operations Help */}
                  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Supported Operations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-gray-800">
                          Basic Operations:
                        </strong>
                        <ul className="mt-1 text-gray-600">
                          <li>+ (addition)</li>
                          <li>- (subtraction)</li>
                          <li>* (multiplication)</li>
                          <li>/ (division)</li>
                          <li>^ (exponentiation)</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-gray-800">Functions:</strong>
                        <ul className="mt-1 text-gray-600">
                          <li>sin(x), cos(x), tan(x)</li>
                          <li>sqrt(x), abs(x)</li>
                          <li>ln(x), log(x)</li>
                          <li>pi, e (constants)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12">
              <div className="col-span-12 bg-white rounded-lg shadow-md p-6 mt-6 text-center">
                <p className="text-gray-600">
                  Enter mathematical functions using standard notation. Use 'x'
                  as the variable.
                  <br />
                  Examples: x^2, sin(x), 2*x+1, sqrt(x), ln(x)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default OnlineGraphingCalculator;
