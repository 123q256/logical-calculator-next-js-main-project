"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import {
  useGetSingleCalculatorDetailsMutation,
  useInvnormCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const InvNormCalculator = () => {
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
    tech_p: 0.13,
    tech_mean: 2,
    tech_sd: 4,
    tech_which: 1,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useInvnormCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_sd || !formData.tech_mean || !formData.tech_p) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_sd: formData.tech_sd,
        tech_mean: formData.tech_mean,
        tech_p: formData.tech_p,
        tech_which: formData.tech_which,
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
      tech_p: 0.13,
      tech_mean: 2,
      tech_sd: 4,
      tech_which: 1,
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

  const canvasRef = useRef(null);
  const [selected, setSelected] = useState("1");

  const inset = 20;

  // Helper rect class
  class Rect {
    constructor(x1, y1, x2, y2) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
    }
  }

  // Linear transform function
  function linTran(x0, xf, y0, yf) {
    const r = [];
    r[1] = (yf - y0) / (xf - x0);
    r[0] = (yf + y0) / 2 - (r[1] * (xf + x0)) / 2;
    return r;
  }

  // ZeePro function from your code (CDF approx)
  function ZeePro(z) {
    if (z < -7) return 0.0;
    if (z > 7) return 1.0;

    let flag = false;
    if (z < 0.0) flag = true;

    z = Math.abs(z);
    let b = 0.0;
    let s = (Math.sqrt(2) / 3) * z;
    let HH = 0.5;

    for (let i = 0; i < 12; i++) {
      let a = (Math.exp((-HH * HH) / 9) * Math.sin(HH * s)) / HH;
      b += a;
      HH += 1.0;
    }
    let p = 0.5 - b / Math.PI;
    if (!flag) p = 1.0 - p;
    return p;
  }

  // Main drawing function
  function finalDraw(ctx, box, M, sd, lFill, hFill, tail) {
    ctx.beginPath();

    const w = box.x2 - box.x1;
    const h = box.y2 - box.y1;
    const v = sd * sd;
    const constant = 1 / Math.sqrt(2 * Math.PI * v);

    const maxDensity = constant;
    let r = linTran(0, 1.1 * maxDensity, h, box.y1);
    const Ay = r[0];
    const by = r[1];

    r = linTran(M - 3.5 * sd, M + 3.5 * sd, box.x1, box.x2);
    const Ax = r[0];
    const bx = r[1];

    const lowX = M - 3.5 * sd;
    const highX = M + 3.5 * sd;

    const x0 = lowX * bx + Ax;
    const xf = highX * bx + Ax;

    ctx.moveTo(xf, Ay);
    ctx.lineTo(x0, Ay);

    const inc = 1 / bx;

    for (let i = lowX; i <= highX; i += inc * 0.5) {
      const xp = bx * i + Ax;
      const d = constant * Math.exp(-Math.pow(i - M, 2) / (2 * v));
      const dp = by * d + Ay;
      ctx.lineTo(xp, dp);
      if (tail) {
        if (i >= hFill || i <= lFill) {
          ctx.moveTo(xp, Ay);
          ctx.lineTo(xp, dp + 1);
        }
      } else {
        if (i <= hFill && i >= lFill) {
          ctx.moveTo(xp, Ay);
          ctx.lineTo(xp, dp + 1);
        }
      }
    }

    ctx.textAlign = "center";
    ctx.font = "14px Roboto, sans-serif";
    ctx.strokeStyle = "#2845F5";
    ctx.stroke();

    ctx.fillStyle = "black";
    const y = Ay + 15;
    for (let i = M - 3 * sd; i <= M + 3 * sd; i += sd) {
      const x = bx * i + Ax;
      ctx.moveTo(x, Ay);
      ctx.lineTo(x, Ay + 4);
      let xlab = Math.round(1000 * i) / 1000;
      ctx.fillText(xlab, x, y + 2);
    }

    ctx.stroke();
  }

  function drawChart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const h = canvas.height;
    const w = canvas.width;
    const box = new Rect(inset, inset, w - inset, h - inset);

    let pVal = parseFloat(formData?.tech_p);
    const M = parseFloat(formData?.tech_mean);
    const sdVal = parseFloat(formData?.tech_sd);

    if (sdVal <= 0) return;

    let ll,
      ul,
      tail = false;

    if (selected === "1") {
      ll = parseFloat(result?.tech_above);
      ul = 999999;
      const z = (M - ll) / sdVal;
      pVal = Math.round(ZeePro(z) * 10000) / 10000;
    } else if (selected === "2") {
      ul = parseFloat(result?.tech_blow);
      ll = -999999;
      const z = (M - ul) / sdVal;
      pVal = 1 - ZeePro(z);
      pVal = Math.round(pVal * 10000) / 10000;
    } else if (selected === "3") {
      tail = true;
      ll = parseFloat(result?.tech_blow);
      ul = parseFloat(result?.tech_above);
      const z1 = (ll - M) / sdVal;
      const z2 = (ul - M) / sdVal;
      pVal = ZeePro(z1) + (1 - ZeePro(z2));
      pVal = Math.round(pVal * 10000) / 10000;
    } else {
      ll = parseFloat(result?.tech_ll);
      ul = parseFloat(result?.tech_ul);
      const z1 = (ll - M) / sdVal;
      const z2 = (ul - M) / sdVal;
      pVal = ZeePro(z2) - ZeePro(z1);
      pVal = Math.round(pVal * 10000) / 10000;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#eeeeee2e";
    ctx.fillRect(0, 0, w, h);

    finalDraw(ctx, box, M, sdVal, ll, ul, tail);
  }

  // Redraw chart when selected, p, mean, sd or detail changes
  useEffect(() => {
    drawChart();
  }, [
    selected,
    formData?.tech_p,
    formData?.tech_mean,
    formData?.tech_sd,
    result,
  ]);

  function handleSelectChange(e) {
    setSelected(e.target.value);
  }

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
            <div className="grid grid-cols-12 mt-3 gap-1  md:gap-1">
              <div className="col-span-12">
                <label htmlFor="tech_p" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (
                  {data?.payload?.tech_lang_keys["9"]})
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_p"
                    id="tech_p"
                    className="input my-2"
                    aria-label="input"
                    min="0"
                    max="1"
                    placeholder="00"
                    value={formData.tech_p}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_mean" className="label">
                  {data?.payload?.tech_lang_keys["2"]} :
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_mean"
                    id="tech_mean"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_mean}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_sd" className="label">
                  {data?.payload?.tech_lang_keys["3"]} :
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_sd"
                    id="tech_sd"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_sd}
                    onChange={handleChange}
                  />
                </div>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[100%] lg:w-[60%] mt-2 overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    P(z {"<"} {result?.tech_blow})
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    P(z {">"} {result?.tech_above})
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {data?.payload?.tech_lang_keys["6"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    P(z {"<"} {result?.tech_ll1} & z {">"}{" "}
                                    {result?.tech_ul1})
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <strong className="text-blue">
                                    {data?.payload?.tech_lang_keys["7"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  <strong>
                                    P(z {"<"} {result?.tech_ll} & z {">"}{" "}
                                    {result?.tech_ul})
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full md:w-[60%] lg:w-[60%] mt-3">
                          <label htmlFor="tech_which">
                            <strong className="text-blue">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </strong>
                          </label>
                          <div className="w-full py-2">
                            <select
                              value={selected}
                              name="tech_which"
                              onChange={handleSelectChange}
                            >
                              <option value="1">
                                {data?.payload?.tech_lang_keys["4"]}
                              </option>
                              <option value="2">
                                {data?.payload?.tech_lang_keys["5"]}
                              </option>
                              <option value="3">
                                {data?.payload?.tech_lang_keys["6"]}
                              </option>
                              <option value="4">
                                {data?.payload?.tech_lang_keys["7"]}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="w-full overflow-auto">
                          <canvas
                            id="normal"
                            ref={canvasRef}
                            width={400}
                            height={400}
                            className="border mt-4"
                          />
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

export default InvNormCalculator;
