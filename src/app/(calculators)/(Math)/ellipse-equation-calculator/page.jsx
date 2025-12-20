"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useEllipseEquationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

// Mathematical helper functions
const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const lcm = (a, b) => {
  return (a * b) / gcd(a, b);
};

const simplifyExpression = (number) => {
  if (!number || isNaN(number)) return [1, 1];

  let num = Math.abs(parseInt(number));
  if (num === 0 || num === 1) return [1, 1];

  // Simple approach: find the largest perfect square divisor
  let perfectSquare = 1;
  let remainder = num;

  for (let i = Math.floor(Math.sqrt(num)); i > 1; i--) {
    if (num % (i * i) === 0) {
      perfectSquare = i;
      remainder = num / (i * i);
      break;
    }
  }

  return [perfectSquare, remainder];
};

const EllipseCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const url = parts.length === 1 ? parts[0] : parts[0] + "/" + parts[1];

  // API hooks
  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const [
    calculateEllipseCalculator,
    {
      isLoading: roundToTheNearestLoading,
      isError,
      error: calculateEllipseError,
    },
  ] = useEllipseEquationCalculatorMutation();

  // State
  const [formData, setFormData] = useState({
    tech_selection: "1",
    tech_d1: "3",
    tech_second_value: "6",
    tech_n2: "8",
    tech_c1: "4",
    tech_c2: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  // Refs for dynamic content
  const resultRefs = useRef({});

  const getRef = (name) => {
    if (!resultRefs.current[name]) {
      resultRefs.current[name] = React.createRef();
    }
    return resultRefs.current[name];
  };

  const [method1Results, setMethod1Results] = useState(null);
  const [method2Results, setMethod2Results] = useState(null);

  // Effects
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        await getSingleCalculatorDetails({ tech_calculator_link: url });
      } catch (err) {
        console.error("Error fetching calculator details:", err);
      }
    };
    fetchDetails();
  }, [url]);

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    };
    fetchCurrency();
  }, []);

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError("");
    setMethod1Results(null);
    setMethod2Results(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEllipseCalculator({
        tech_selection: formData.tech_selection,
        tech_d1: formData.tech_d1,
        tech_second_value: formData.tech_second_value,
        tech_n2: formData.tech_n2,
        tech_c1: formData.tech_c1,
        tech_c2: formData.tech_c2,
      }).unwrap();
      //   setResult(response);

      //   // Calculate results immediately based on method
      //   if (response.tech_method === "1") {
      //     calculateMethod1Results(response);
      //   } else if (response.tech_method === "2") {
      //     calculateMethod2Results(response);
      //   }

      //   toast.success("Successfully Calculated");
      // } catch (err) {
      //   const errorMsg = err.data?.error || "Calculation failed";
      //   setFormError(errorMsg);
      //   toast.error(errorMsg);
      // }

      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_selection: "1",
      tech_d1: "3",
      tech_second_value: "6",
      tech_n2: "8",
      tech_c1: "4",
      tech_c2: "4",
    });
    setResult(null);
    setFormError("");
    setMethod1Results(null);
    setMethod2Results(null);
  };

  // Method 1 calculation functions
  const calculateMethod1Results = (response = result) => {
    if (!response || response.tech_method !== "1") return;

    const tech_upr = response.tech_upr || 1;
    const tech_btm = response.tech_btm || 1;
    const tech_upr1 = response.tech_upr1 || 1;
    const tech_btm1 = response.tech_btm1 || 1;

    // Calculate a and b values
    const value_a = Math.sqrt(tech_upr / tech_btm);
    const value_b = Math.sqrt(tech_upr1 / tech_btm1);

    // Determine major and minor axes
    const first_value = tech_upr / tech_btm;
    const second_value = tech_upr1 / tech_btm1;
    const isHorizontalMajor = first_value > second_value;
    const major_axis = isHorizontalMajor ? value_a : value_b;
    const minor_axis = isHorizontalMajor ? value_b : value_a;

    // Calculate linear eccentricity
    const linearEccentricity = Math.sqrt(
      Math.abs(major_axis * major_axis - minor_axis * minor_axis)
    );
    const eccentricity = linearEccentricity / major_axis;

    // Calculate area
    const area = Math.PI * value_a * value_b;

    // Calculate LCM for general form
    let x = Number(tech_upr);
    let y = Number(tech_upr1);
    if (x > y) [x, y] = [y, x];
    const _gcd = gcd(x, y);
    const _lcm = lcm(x, y);
    const calculate_lcm1 = _lcm / tech_upr;
    const calculate_lcm2 = _lcm / tech_upr1;

    // Calculate all required properties
    const results = {
      // Basic values
      value_a,
      value_b,
      major_axis,
      minor_axis,
      linearEccentricity,
      eccentricity,
      area,

      // Vertices and co-vertices
      first_vertex: isHorizontalMajor
        ? `\\left(-${value_a.toFixed(4)}, 0\\right)`
        : `\\left(0, -${value_a.toFixed(4)}\\right)`,
      second_vertex: isHorizontalMajor
        ? `\\left(${value_a.toFixed(4)}, 0\\right)`
        : `\\left(0, ${value_a.toFixed(4)}\\right)`,
      first_co_vertex: isHorizontalMajor
        ? `\\left(0, -${value_b.toFixed(4)}\\right)`
        : `\\left(-${value_b.toFixed(4)}, 0\\right)`,
      second_co_vertex: isHorizontalMajor
        ? `\\left(0, ${value_b.toFixed(4)}\\right)`
        : `\\left(${value_b.toFixed(4)}, 0\\right)`,

      // Foci
      first_focus: isHorizontalMajor
        ? `\\left(-${linearEccentricity.toFixed(4)}, 0\\right)`
        : `\\left(0, -${linearEccentricity.toFixed(4)}\\right)`,
      second_focus: isHorizontalMajor
        ? `\\left(${linearEccentricity.toFixed(4)}, 0\\right)`
        : `\\left(0, ${linearEccentricity.toFixed(4)}\\right)`,

      // Domain and range
      domain: isHorizontalMajor
        ? `\\left[-${value_a.toFixed(4)}, ${value_a.toFixed(4)}\\right]`
        : `\\left[-${value_b.toFixed(4)}, ${value_b.toFixed(4)}\\right]`,
      range: isHorizontalMajor
        ? `\\left[-${value_b.toFixed(4)}, ${value_b.toFixed(4)}\\right]`
        : `\\left[-${value_a.toFixed(4)}, ${value_a.toFixed(4)}\\right]`,

      // Axes lengths
      major_axis_length: (2 * major_axis).toFixed(4),
      semi_major_axis_length: major_axis.toFixed(4),
      minor_axis_length: (2 * minor_axis).toFixed(4),
      semi_minor_axis_length: minor_axis.toFixed(4),

      // Additional properties
      first_latus_rectum: `\\approx ${linearEccentricity.toFixed(4)}`,
      second_latus_rectum: `\\approx ${linearEccentricity.toFixed(4)}`,
      x_intercepts: isHorizontalMajor
        ? `\\left(-${value_a.toFixed(
            4
          )}, 0\\right) \\quad \\left(${value_a.toFixed(4)}, 0\\right)`
        : `\\left(-${value_b.toFixed(
            4
          )}, 0\\right) \\quad \\left(${value_b.toFixed(4)}, 0\\right)`,
      y_intercepts: isHorizontalMajor
        ? `\\left(0, -${value_b.toFixed(
            4
          )}\\right) \\quad \\left(0, ${value_b.toFixed(4)}\\right)`
        : `\\left(0, -${value_a.toFixed(
            4
          )}\\right) \\quad \\left(0, ${value_a.toFixed(4)}\\right)`,
      circumference: (
        Math.PI *
        (3 * (value_a + value_b) -
          Math.sqrt((3 * value_a + value_b) * (value_a + 3 * value_b)))
      ).toFixed(4),
      focal_parameter: ((minor_axis * minor_axis) / linearEccentricity).toFixed(
        4
      ),
      latera_recta: ((2 * minor_axis * minor_axis) / major_axis).toFixed(4),

      // LCM calculations
      calculate_lcm1,
      calculate_lcm2,
      _lcm,

      // Original values
      tech_upr,
      tech_btm,
      tech_upr1,
      tech_btm1,
    };

    setMethod1Results(results);
  };

  // Method 2 calculation functions
  const calculateMethod2Results = (response = result) => {
    if (!response || response.tech_method !== "2") return;

    const a = parseFloat(response.tech_d1) || 0;
    const b = parseFloat(response.tech_c2) || 0;
    const c1 = parseFloat(response.tech_center1) || 0;
    const c2 = parseFloat(response.tech_center2) || 0;

    // Determine which axis is major
    const isHorizontalMajor = a >= b;

    let method2ResultsHTML = "";

    if (isHorizontalMajor) {
      // Horizontal major axis
      method2ResultsHTML = `
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["32"] || "Latus Rectum"
        }</strong></p>
        <p>$$=\\dfrac{2b^2}{a}$$</p>
        <p>$$=\\dfrac{2\\cdot ${b}^2}{${a}}$$</p>
        <p>$$=\\dfrac{${2 * b * b}}{${a}}$$</p>
        <p>$$=${((2 * b * b) / a).toFixed(4)}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["7"] || "Linear Eccentricity"
        }</strong></p>
        <p>$$=\\sqrt{a^2 - b^2}$$</p>
        <p>$$=\\sqrt{${a}^2 - ${b}^2}$$</p>
        <p>$$=\\sqrt{${a * a} - ${b * b}}$$</p>
        <p>$$=\\sqrt{${a * a - b * b}}$$</p>
        <p>$$=${Math.sqrt(a * a - b * b).toFixed(4)}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["8"] || "Eccentricity"
        }</strong></p>
        <p>$$=\\dfrac{\\sqrt{a^2 - b^2}}{a}$$</p>
        <p>$$=\\dfrac{${Math.sqrt(a * a - b * b).toFixed(4)}}{${a}}$$</p>
        <p>$$=${(Math.sqrt(a * a - b * b) / a).toFixed(4)}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["19"] || "Major Axis Length"
        }</strong></p>
        <p>$$=${2 * a}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["20"] || "Semi-Major Axis Length"
        }</strong></p>
        <p>$$=${a}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["21"] || "Minor Axis Length"
        }</strong></p>
        <p>$$=${2 * b}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["22"] || "Semi-Minor Axis Length"
        }</strong></p>
        <p>$$=${b}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["16"] || "Domain"
        }</strong></p>
        <p>$$\\left[${c1 - a}, ${c1 + a}\\right]$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["17"] || "Range"
        }</strong></p>
        <p>$$\\left[${c2 - b}, ${c2 + b}\\right]$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>x-${
          data?.payload?.tech_lang_keys["25"] || "Intercepts"
        }</strong></p>
        <p>$$(${c1 - a}, 0) \\quad (${c1 + a}, 0)$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>y-${
          data?.payload?.tech_lang_keys["25"] || "Intercepts"
        }</strong></p>
        <p>$$(0, ${c2 - b}) \\quad (0, ${c2 + b})$$</p>
      `;

      // Foci calculations for horizontal major axis
      const focalDistance = Math.sqrt(a * a - b * b);
      method2ResultsHTML += `
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["13"] || "First Focus"
        } F1</strong></p>
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
          data?.payload?.tech_lang_keys["33"] || "Coordinate"
        }</strong></p>
        <p>$$=${(c1 - focalDistance).toFixed(4)}$$</p>
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
          data?.payload?.tech_lang_keys["33"] || "Coordinate"
        }</strong></p>
        <p>$$=${c2}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["14"] || "Second Focus"
        } F2</strong></p>
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
          data?.payload?.tech_lang_keys["33"] || "Coordinate"
        }</strong></p>
        <p>$$=${(c1 + focalDistance).toFixed(4)}$$</p>
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
          data?.payload?.tech_lang_keys["33"] || "Coordinate"
        }</strong></p>
        <p>$$=${c2}$$</p>
      `;
    } else {
      // Vertical major axis
      method2ResultsHTML = `
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["34"] || "Latus Rectum"
        }</strong></p>
        <p>$$=\\dfrac{2a^2}{b}$$</p>
        <p>$$=\\dfrac{2\\cdot ${a}^2}{${b}}$$</p>
        <p>$$=\\dfrac{${2 * a * a}}{${b}}$$</p>
        <p>$$=${((2 * a * a) / b).toFixed(4)}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["7"] || "Linear Eccentricity"
        }</strong></p>
        <p>$$=\\sqrt{b^2 - a^2}$$</p>
        <p>$$=\\sqrt{${b}^2 - ${a}^2}$$</p>
        <p>$$=\\sqrt{${b * b} - ${a * a}}$$</p>
        <p>$$=\\sqrt{${b * b - a * a}}$$</p>
        <p>$$=${Math.sqrt(b * b - a * a).toFixed(4)}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["8"] || "Eccentricity"
        }</strong></p>
        <p>$$=\\dfrac{\\sqrt{b^2 - a^2}}{b}$$</p>
        <p>$$=\\dfrac{${Math.sqrt(b * b - a * a).toFixed(4)}}{${b}}$$</p>
        <p>$$=${(Math.sqrt(b * b - a * a) / b).toFixed(4)}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["19"] || "Major Axis Length"
        }</strong></p>
        <p>$$=${2 * b}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["20"] || "Semi-Major Axis Length"
        }</strong></p>
        <p>$$=${b}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["21"] || "Minor Axis Length"
        }</strong></p>
        <p>$$=${2 * a}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["22"] || "Semi-Minor Axis Length"
        }</strong></p>
        <p>$$=${a}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["16"] || "Domain"
        }</strong></p>
        <p>$$\\left[${c1 - a}, ${c1 + a}\\right]$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["17"] || "Range"
        }</strong></p>
        <p>$$\\left[${c2 - b}, ${c2 + b}\\right]$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>x-${
          data?.payload?.tech_lang_keys["25"] || "Intercepts"
        }</strong></p>
        <p>$$(${c1 - a}, 0) \\quad (${c1 + a}, 0)$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>y-${
          data?.payload?.tech_lang_keys["25"] || "Intercepts"
        }</strong></p>
        <p>$$(0, ${c2 - b}) \\quad (0, ${c2 + b})$$</p>
      `;

      // Foci calculations for vertical major axis
      const focalDistance = Math.sqrt(b * b - a * a);
      method2ResultsHTML += `
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["13"] || "First Focus"
        } F1</strong></p>
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
          data?.payload?.tech_lang_keys["33"] || "Coordinate"
        }</strong></p>
        <p>$$=${c1}$$</p>
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
          data?.payload?.tech_lang_keys["33"] || "Coordinate"
        }</strong></p>
        <p>$$=${(c2 - focalDistance).toFixed(4)}$$</p>

        <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
          data?.payload?.tech_lang_keys["14"] || "Second Focus"
        } F2</strong></p>
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
          data?.payload?.tech_lang_keys["33"] || "Coordinate"
        }</strong></p>
        <p>$$=${c1}$$</p>
        <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
          data?.payload?.tech_lang_keys["33"] || "Coordinate"
        }</strong></p>
        <p>$$=${(c2 + focalDistance).toFixed(4)}$$</p>
      `;
    }

    // Common calculations for both cases
    const area = Math.PI * a * b;
    const perimeter =
      Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b))); // Ramanujan's approximation

    method2ResultsHTML += `
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
        data?.payload?.tech_lang_keys["15"] || "Area"
      }</strong></p>
      <p>$$=\\pi ab$$</p>
      <p>$$=\\pi \\cdot ${a} \\cdot ${b}$$</p>
      <p>$$=${area.toFixed(4)}$$</p>

      <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
        data?.payload?.tech_lang_keys["35"] || "Circumference"
      }</strong></p>
      <p>$$\\approx \\pi [3(a + b) - \\sqrt{(3a + b)(a + 3b)}]$$</p>
      <p>$$\\approx ${perimeter.toFixed(4)}$$</p>

      <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
        data?.payload?.tech_lang_keys["18"] || "Center"
      }</strong></p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${c1}$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${c2}$$</p>

      <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
        data?.payload?.tech_lang_keys["36"] || "Vertex"
      } V1 (${data?.payload?.tech_lang_keys["37"] || "Horizontal"})</strong></p>
      <p>$$=(-a + c_1, c_2)$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${-a + c1}$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${c2}$$</p>

      <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
        data?.payload?.tech_lang_keys["36"] || "Vertex"
      } V2 (${data?.payload?.tech_lang_keys["37"] || "Horizontal"})</strong></p>
      <p>$$=(a + c_1, c_2)$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${a + c1}$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${c2}$$</p>

      <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
        data?.payload?.tech_lang_keys["36"] || "Vertex"
      } V3 (${data?.payload?.tech_lang_keys["38"] || "Vertical"})</strong></p>
      <p>$$=(c_1, -b + c_2)$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${c1}$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${-b + c2}$$</p>

      <p class="mt-3 text-[16px] md:text-[18px]"><strong>${
        data?.payload?.tech_lang_keys["36"] || "Vertex"
      } V4 (${data?.payload?.tech_lang_keys["38"] || "Vertical"})</strong></p>
      <p>$$=(c_1, b + c_2)$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>X-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${c1}$$</p>
      <p class="mt-3 text-[16px] md:text-[18px]"><strong>Y-${
        data?.payload?.tech_lang_keys["33"] || "Coordinate"
      }</strong></p>
      <p>$$=${b + c2}$$</p>
    `;

    setMethod2Results(method2ResultsHTML);
  };

  // Recalculate results when result changes
  useEffect(() => {
    if (result) {
      if (result.tech_method === "1") {
        calculateMethod1Results(result);
      } else if (result.tech_method === "2") {
        calculateMethod2Results(result);
      }
    }
  }, [result]);
  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"] || "Method"}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"] || "General Form"}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"] || "Standard Form"}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 text-[16px] md:text-[18px] text-center">
                {formData.tech_selection == "1" && (
                  <div className="equation">
                    <BlockMath math="Ax^2 + By^2 = C" />
                  </div>
                )}
                {formData.tech_selection == "2" && (
                  <div className="equation1">
                    <BlockMath math="\frac{(x - c1)^2}{a^2} + \frac{(y - c2)^2}{b^2} = 1" />
                  </div>
                )}
              </div>

              {(formData.tech_selection == "1" ||
                formData.tech_selection == "2") && (
                <>
                  <div
                    className={`${
                      formData.tech_selection === "2"
                        ? "col-span-6"
                        : "col-span-6"
                    } aValue`}
                  >
                    {formData.tech_selection == "1" ? (
                      <label htmlFor="tech_d1" className="label">
                        A:{" "}
                      </label>
                    ) : (
                      <label htmlFor="tech_d1" className="label">
                        a:{" "}
                      </label>
                    )}
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_d1"
                        id="tech_d1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_d1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div
                    className={`${
                      formData.tech_selection === "2"
                        ? "col-span-6"
                        : "col-span-6"
                    } bValue`}
                  >
                    {formData.tech_selection == "1" ? (
                      <label htmlFor="tech_second_value" className="label">
                        B:{" "}
                      </label>
                    ) : (
                      <label htmlFor="tech_second_value" className="label">
                        b:{" "}
                      </label>
                    )}
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second_value"
                        id="tech_second_value"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_second_value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_selection == "1" && (
                <div className="col-span-4 cValue">
                  <label htmlFor="tech_n2" className="label">
                    C:{" "}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_n2"
                      id="tech_n2"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_n2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {formData.tech_selection == "2" && (
                <>
                  <div className="col-span-6 c1">
                    <label htmlFor="tech_c1" className="label">
                      c1:{" "}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c1"
                        id="tech_c1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 c2">
                    <label htmlFor="tech_c2" className="label">
                      c2:{" "}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c2"
                        id="tech_c2"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"] || "Calculate"}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full overflow-auto">
                      {result?.tech_method === "1" && method1Results ? (
                        <div className="w-full text-[16px]">
                          {/* Our Ellipse is in the form of */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"] ||
                                "Our Ellipse is in the form of"}
                            </strong>
                          </p>

                          <p className="mt-3">
                            <InlineMath
                              math={`\\dfrac{(x-0)^2}{\\dfrac{${method1Results.tech_upr}}{${method1Results.tech_btm}}} + \\dfrac{(y-0)^2}{\\dfrac{${method1Results.tech_upr1}}{${method1Results.tech_btm1}}} = 1`}
                            />
                          </p>

                          {/* After simplify the value of a and b */}
                          <div className="print">
                            <p className="mt-3 text-[16px] md:text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["5"] ||
                                  "After simplify the value of a and b"}
                              </strong>
                            </p>
                            <p>
                              <InlineMath
                                math={`a = ${method1Results.value_a.toFixed(
                                  4
                                )}, b = ${method1Results.value_b.toFixed(4)}`}
                              />
                            </p>
                          </div>

                          {/* Standard Form */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["3"] ||
                                "Standard Form"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 standard_form">
                            <p>
                              <InlineMath
                                math={`\\dfrac{x^2}{${method1Results.value_a.toFixed(
                                  4
                                )}^2} + \\dfrac{y^2}{${method1Results.value_b.toFixed(
                                  4
                                )}^2} = 1`}
                              />
                            </p>
                          </div>

                          {/* Vertex form */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["6"] ||
                                "Vertex Form"}
                              :
                            </strong>
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`\\dfrac{${method1Results.tech_btm} x^{2}}{${method1Results.tech_upr}} + \\dfrac{${method1Results.tech_btm1} y^{2}}{${method1Results.tech_upr1}} = 1`}
                            />
                          </p>

                          {/* General Form */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["2"] ||
                                "General Form"}
                              :
                            </strong>
                          </p>
                          <p className="mt-3">
                            <InlineMath
                              math={`${
                                method1Results.calculate_lcm1 *
                                method1Results.tech_btm
                              } x^{2} + ${
                                method1Results.calculate_lcm2 *
                                method1Results.tech_btm1
                              } y^{2} - ${method1Results._lcm} = 0`}
                            />
                          </p>

                          {/* Linear Eccentricity */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"] ||
                                "Linear Eccentricity"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 linear_eccentricity">
                            <p>
                              <InlineMath
                                math={`c = \\sqrt{a^2 - b^2} = \\sqrt{${method1Results.value_a.toFixed(
                                  4
                                )}^2 - ${method1Results.value_b.toFixed(
                                  4
                                )}^2} \\approx ${method1Results.linearEccentricity.toFixed(
                                  4
                                )}`}
                              />
                            </p>
                          </div>

                          {/* Eccentricity */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["8"] ||
                                "Eccentricity"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 eccentricity">
                            <p>
                              <InlineMath
                                math={`e = \\frac{c}{a} = \\frac{${method1Results.linearEccentricity.toFixed(
                                  4
                                )}}{${method1Results.major_axis.toFixed(
                                  4
                                )}} \\approx ${method1Results.eccentricity.toFixed(
                                  4
                                )}`}
                              />
                            </p>
                          </div>

                          {/* First Vertex */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["9"] ||
                                "First Vertex"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 first_vertex">
                            <p>
                              <InlineMath math={method1Results.first_vertex} />
                            </p>
                          </div>

                          {/* Second Vertex */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["10"] ||
                                "Second Vertex"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 second_vertex">
                            <p>
                              <InlineMath math={method1Results.second_vertex} />
                            </p>
                          </div>

                          {/* First Co-Vertex */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["11"] ||
                                "First Co-Vertex"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 first_co_vertex">
                            <p>
                              <InlineMath
                                math={method1Results.first_co_vertex}
                              />
                            </p>
                          </div>

                          {/* Second Co-Vertex */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"] ||
                                "Second Co-Vertex"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 second_co_vertex">
                            <p>
                              <InlineMath
                                math={method1Results.second_co_vertex}
                              />
                            </p>
                          </div>

                          {/* First Focus */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["13"] ||
                                "First Focus"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 first_focus">
                            <p>
                              <InlineMath math={method1Results.first_focus} />
                            </p>
                          </div>

                          {/* Second Focus */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["14"] ||
                                "Second Focus"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 second_focus">
                            <p>
                              <InlineMath math={method1Results.second_focus} />
                            </p>
                          </div>

                          {/* Area */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["15"] || "Area"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 area">
                            <p>
                              <InlineMath
                                math={`A = \\pi ab = \\pi \\times ${method1Results.value_a.toFixed(
                                  4
                                )} \\times ${method1Results.value_b.toFixed(
                                  4
                                )} \\approx ${method1Results.area.toFixed(4)}`}
                              />
                            </p>
                          </div>

                          {/* Domain */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["16"] || "Domain"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 domain">
                            <p>
                              <InlineMath math={method1Results.domain} />
                            </p>
                          </div>

                          {/* Range */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["17"] || "Range"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 range">
                            <p>
                              <InlineMath math={method1Results.range} />
                            </p>
                          </div>

                          {/* Center */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["18"] || "Center"}
                            </strong>
                          </p>
                          <p className="mt-3">(0,0)</p>

                          {/* Major axis length */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["19"] ||
                                "Major Axis Length"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 major_axis">
                            <p>
                              <InlineMath
                                math={`2a = ${method1Results.major_axis_length}`}
                              />
                            </p>
                          </div>

                          {/* Semi-major axis length */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["20"] ||
                                "Semi-Major Axis Length"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 semi_major_axis">
                            <p>
                              <InlineMath
                                math={`a = ${method1Results.semi_major_axis_length}`}
                              />
                            </p>
                          </div>

                          {/* Minor axis length */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["21"] ||
                                "Minor Axis Length"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 minor_axis">
                            <p>
                              <InlineMath
                                math={`2b = ${method1Results.minor_axis_length}`}
                              />
                            </p>
                          </div>

                          {/* Semi-minor axis length */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["22"] ||
                                "Semi-Minor Axis Length"}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 semi_minor_axis">
                            <p>
                              <InlineMath
                                math={`b = ${method1Results.semi_minor_axis_length}`}
                              />
                            </p>
                          </div>

                          {/* First latus rectum */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["23"] ||
                                "First Latus Rectum"}
                              :{" "}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 first_latus_rectum">
                            <p>
                              <InlineMath
                                math={method1Results.first_latus_rectum}
                              />
                            </p>
                          </div>

                          {/* Second latus rectum */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["24"] ||
                                "Second Latus Rectum"}
                              :{" "}
                            </strong>
                          </p>
                          <div className="col-12 mt-3 second_latus_rectum">
                            <p>
                              <InlineMath
                                math={method1Results.second_latus_rectum}
                              />
                            </p>
                          </div>

                          {/* x-intercepts */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              x-
                              {data?.payload?.tech_lang_keys["25"] ||
                                "Intercepts"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 x-intercepts">
                            <p>
                              <InlineMath math={method1Results.x_intercepts} />
                            </p>
                          </div>

                          {/* y-intercepts */}
                          <p className="mt-3 text-[16px] md:text-[18px]">
                            <strong>
                              y-
                              {data?.payload?.tech_lang_keys["25"] ||
                                "Intercepts"}
                              :
                            </strong>
                          </p>
                          <div className="col-12 mt-3 y-intercepts">
                            <p>
                              <InlineMath math={method1Results.y_intercepts} />
                            </p>
                          </div>
                        </div>
                      ) : result?.tech_method === "2" && method2Results ? (
                        // Method 2 results
                        <div
                          className="w-full text-[16px] method2-results"
                          dangerouslySetInnerHTML={{ __html: method2Results }}
                        />
                      ) : null}
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

export default EllipseCalculator;
