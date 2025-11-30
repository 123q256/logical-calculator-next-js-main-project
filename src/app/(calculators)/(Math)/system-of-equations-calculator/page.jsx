"use client";
import React, { useEffect, useState, useRef } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useSystemOfEquationsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import "../../../../components/styles/CssOrderOfOperationsCalculator.css";
const SystemOfEquationCalculator = () => {
 
      const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean); // remove empty strings
  
    let url = "";
  
    if (parts.length === 1) {
      // sirf ek part
      url = parts[0];  // "age-calculator"
    } else {
      // do ya zyada parts
      url = parts[0] + "/" + parts[1];  // "de/age-calculator"
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
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    // Browser-only: set currentPath
    setCurrentPath(window.location.pathname);
  }, []);
  const [formData, setFormData] = useState({
      tech_operations : "1", // 1 2
      tech_a1_f : "1",
      tech_b1_f : "3",
      tech_k1_f : "5",
      tech_a2_f : "7",
      tech_b2_f : "9",
      tech_k2_f : "11",
      tech_a1_s : "1",
      tech_b1_s : "2",
      tech_c1_s : "3",
      tech_k1_s : "4",
      tech_a2_s : "5",
      tech_b2_s : "6",
      tech_c2_s : "7",
      tech_k2_s : "12",
      tech_a3_s : "15",
      tech_b3_s : "17",
      tech_c3_s : "25",
      tech_k3_s : "2",
      tech_method : "1", // 1 2 3
      tech_submit : "calculate"
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useSystemOfEquationsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await CatAgeCalculator({
          tech_operations :formData.tech_operations, // 1 2
          tech_a1_f :formData.tech_a1_f,
          tech_b1_f :formData.tech_b1_f,
          tech_k1_f :formData.tech_k1_f,
          tech_a2_f :formData.tech_a2_f,
          tech_b2_f :formData.tech_b2_f,
          tech_k2_f :formData.tech_k2_f,
          tech_a1_s :formData.tech_a1_s,
          tech_b1_s :formData.tech_b1_s,
          tech_c1_s :formData.tech_c1_s,
          tech_k1_s :formData.tech_k1_s,
          tech_a2_s :formData.tech_a2_s,
          tech_b2_s :formData.tech_b2_s,
          tech_c2_s :formData.tech_c2_s,
          tech_k2_s :formData.tech_k2_s,
          tech_a3_s :formData.tech_a3_s,
          tech_b3_s :formData.tech_b3_s,
          tech_c3_s :formData.tech_c3_s,
          tech_k3_s :formData.tech_k3_s,
          tech_method :formData.tech_method, // 1 2 3
          tech_submit :formData.tech_submit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
      
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
       tech_operations : "1", // 1 2
      tech_a1_f : "1",
      tech_b1_f : "3",
      tech_k1_f : "5",
      tech_a2_f : "7",
      tech_b2_f : "9",
      tech_k2_f : "11",
      tech_a1_s : "1",
      tech_b1_s : "2",
      tech_c1_s : "3",
      tech_k1_s : "4",
      tech_a2_s : "5",
      tech_b2_s : "6",
      tech_c2_s : "7",
      tech_k2_s : "12",
      tech_a3_s : "15",
      tech_b3_s : "17",
      tech_c3_s : "25",
      tech_k3_s : "2",
      tech_method : "1", // 1 2 3
      tech_submit : "calculate"
    });
    setResult(null);
    setFormError(null);
  };


   const eq2 = String.raw`
    \begin{cases}
      a_1x + b_1y = k_1 \\
      a_2x + b_2y = k_2 \\
    \end{cases}
  `;

  const eq3 = String.raw`
    \begin{cases}
      a_1x + b_1y + c_1z = k_1 \\
      a_2x + b_2y + c_2z = k_2 \\
      a_3x + b_3y + c_3z = k_3 \\
    \end{cases}
  `;



  const round = (num, decimals = 4) => {
    return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
  };


   // Helper function to safely render matrix elements
  const val = (v) => v ?? 0;

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
              <div className="grid grid-cols-12 gap-2 md:gap-4">
                  <div className="col-span-12  ">
                      <label htmlFor="tech_operations" className="label">
                        {data?.payload?.tech_lang_keys["1"] ?? ""}:
                      </label>
                      <div className=" ">
                        <select
                          className="input my-2"
                          aria-label="select"
                          name="tech_operations"
                          id="tech_operations"
                          value={formData.tech_operations}
                          onChange={handleChange}
                        >
                          <option value="1">{data?.payload?.tech_lang_keys["2"] ?? ""}</option>
                          <option value="2">{data?.payload?.tech_lang_keys["3"] ?? ""}</option>
                        </select>
                      </div>
                  </div>
                   <div className="col-span-12  ">
                        {
                          formData.tech_operations == 1 ? (
                            <div className="col-span-12 text-center mt-2 text-[14px]">
                              <BlockMath math={eq2} />
                            </div>
                          ) : (
                            <div className="col-span-12 text-center mt-2 text-[14px]">
                              <BlockMath math={eq3} />
                            </div>
                          )
                        }
                    </div>
                        {
                        formData.tech_operations == 1 ? (
                          <div className="col-span-12 ">
                              <div className="grid grid-cols-12 gap-2 md:gap-4">
                                <div className="col-span-4 md:col-span-4">
                                  <label htmlFor="tech_a1_f" className="label"> a<sub className="font-s-12 text-blue">1</sub>: </label>
                                  <input  type="number"  name="tech_a1_f"  id="tech_a1_f"  className="input my-2" aria-label="input"value={formData.tech_a1_f} onChange={handleChange}/>
                                </div>
                                <div className="col-span-4 md:col-span-4">
                                  <label htmlFor="tech_b1_f" className="label"> b<sub className="font-s-12 text-blue">1</sub>: </label>
                                  <input  type="number"  name="tech_b1_f"  id="tech_b1_f"  className="input my-2" aria-label="input"value={formData.tech_b1_f} onChange={handleChange}/>
                                </div>
                                <div className="col-span-4 md:col-span-4">
                                  <label htmlFor="tech_k1_f" className="label"> k<sub className="font-s-12 text-blue">1</sub>: </label>
                                  <input  type="number"  name="tech_k1_f"  id="tech_k1_f"  className="input my-2" aria-label="input"value={formData.tech_k1_f} onChange={handleChange}/>
                                </div>
                                <div className="col-span-4 md:col-span-4">
                                  <label htmlFor="tech_a2_f" className="label"> a<sub className="font-s-12 text-blue">2</sub>: </label>
                                  <input  type="number"  name="tech_a2_f"  id="tech_a2_f"  className="input my-2" aria-label="input"value={formData.tech_a2_f} onChange={handleChange}/>
                                </div>
                                <div className="col-span-4 md:col-span-4">
                                  <label htmlFor="tech_b2_f" className="label"> b<sub className="font-s-12 text-blue">2</sub>:</label>
                                  <input  type="number"  name="tech_b2_f"  id="tech_b2_f"  className="input my-2" aria-label="input"value={formData.tech_b2_f} onChange={handleChange}/>
                                </div>
                                <div className="col-span-4 md:col-span-4">
                                  <label htmlFor="tech_k2_f" className="label"> k<sub className="font-s-12 text-blue">2</sub>: </label>
                                  <input  type="number"  name="tech_k2_f"  id="tech_k2_f"  className="input my-2" aria-label="input"value={formData.tech_k2_f} onChange={handleChange}/>
                                </div>

                              </div>
                          </div>
                              ) : (
                          <div className="col-span-12 ">
                              <div className="grid grid-cols-12 gap-2 md:gap-4">
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_a1_s" className="label"> a<sub className="font-s-12 text-blue">1</sub>: </label>
                                  <input  type="number"  name="tech_a1_s"  id="tech_a1_s"  className="input my-2" aria-label="input"value={formData.tech_a1_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_b1_s" className="label"> b<sub className="font-s-12 text-blue">1</sub>: </label>
                                  <input  type="number"  name="tech_b1_s"  id="tech_b1_s"  className="input my-2" aria-label="input"value={formData.tech_b1_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_c1_s" className="label"> c<sub className="font-s-12 text-blue">1</sub>: </label>
                                  <input  type="number"  name="tech_c1_s"  id="tech_c1_s"  className="input my-2" aria-label="input"value={formData.tech_c1_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_k1_s" className="label"> k<sub className="font-s-12 text-blue">1</sub>: </label>
                                  <input  type="number"  name="tech_k1_s"  id="tech_k1_s"  className="input my-2" aria-label="input"value={formData.tech_k1_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_a2_s" className="label"> a<sub className="font-s-12 text-blue">2</sub>:</label>
                                  <input  type="number"  name="tech_a2_s"  id="tech_a2_s"  className="input my-2" aria-label="input"value={formData.tech_a2_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_b2_s" className="label"> b<sub className="font-s-12 text-blue">2</sub>:</label>
                                  <input  type="number"  name="tech_b2_s"  id="tech_b2_s"  className="input my-2" aria-label="input"value={formData.tech_b2_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_c2_s" className="label"> c<sub className="font-s-12 text-blue">2</sub>:</label>
                                  <input  type="number"  name="tech_c2_s"  id="tech_c2_s"  className="input my-2" aria-label="input"value={formData.tech_c2_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_k2_s" className="label"> k<sub className="font-s-12 text-blue">2</sub>:</label>
                                  <input  type="number"  name="tech_k2_s"  id="tech_k2_s"  className="input my-2" aria-label="input"value={formData.tech_k2_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_a3_s" className="label"> a<sub className="font-s-12 text-blue">3</sub>:</label>
                                  <input  type="number"  name="tech_a3_s"  id="tech_a3_s"  className="input my-2" aria-label="input"value={formData.tech_a3_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_b3_s" className="label"> b<sub className="font-s-12 text-blue">3</sub>:</label>
                                  <input  type="number"  name="tech_b3_s"  id="tech_b3_s"  className="input my-2" aria-label="input"value={formData.tech_b3_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_c3_s" className="label"> c<sub className="font-s-12 text-blue">3</sub>:</label>
                                  <input  type="number"  name="tech_c3_s"  id="tech_c3_s"  className="input my-2" aria-label="input"value={formData.tech_c3_s} onChange={handleChange}/>
                                </div>
                                <div className="col-span-3 md:col-span-3">
                                  <label htmlFor="tech_k3_s" className="label"> k<sub className="font-s-12 text-blue">3</sub>:</label>
                                  <input  type="number"  name="tech_k3_s"  id="tech_k3_s"  className="input my-2" aria-label="input"value={formData.tech_k3_s} onChange={handleChange}/>
                                </div>

                              </div>
                          </div>
                          )
                        }
                   <div className="col-span-12  ">
                      <label htmlFor="tech_method" className="label">
                        {data?.payload?.tech_lang_keys["1"] ?? ""}:
                      </label>
                      <div className=" ">
                        <select
                          className="input my-2"
                          aria-label="select"
                          name="tech_method"
                          id="tech_method"
                          value={formData.tech_method}
                          onChange={handleChange}
                        >
                          <option value="1">Gauss-Jordan Elimination</option>
                          <option value="2">Inverse Matrix Method</option>
                          <option value="3">Cramer's Rule</option>
                        </select>
                      </div>
                  </div>
                 

                  
              </div>
            </div>


                <div className="mb-6 mt-10 text-center space-x-2">
                <Button type="submit" isLoading={calculateDogLoading}>
                    {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate"}
                  </Button>
                  {result && (
                    <ResetButton type="button" onClick={handleReset}>
                      {data?.payload?.tech_lang_keys["locale"] === "en"? "RESET" : data?.payload?.tech_lang_keys["reset"] || "RESET" }
                    </ResetButton>
                    )}
                  </div>
            </div>
            <div className="lg:w-[100%] w-full mx-auto ">
                <div className="col-span-12">
                  {isLoading && (
                    <div className="result_calculator rounded-lg p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  )}
                  {result !== null && !isLoading && (

                  <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6">
                    <ResultActions lang={data?.payload?.tech_lang_keys} />
                    
                  
                      <div className="rounded-lg  flex items-center justify-center">
                        <div className="w-full mt-3">
                            <div className="w-full overflow-auto">
                                {formData?.tech_operations==1 ? (
                                  <>

                                  <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                                      <table className="w-full text-[18px]">
                                        <tbody>
                                          <tr>
                                              <td className="py-2 border-b" width="30%"><strong>x =</strong></td>
                                              <td className="py-2 border-b">{result?.tech_x}</td>
                                          </tr>
                                          <tr>
                                              <td className="py-2 border-b" width="30%"><strong>y =</strong></td>
                                              <td className="py-2 border-b">{result?.tech_y}</td>
                                          </tr>
                                          </tbody>
                                      </table>
                                  </div>
                                  <p className="mt-3"><strong>{data?.payload?.tech_lang_keys[5]}</strong></p>

                                  {formData?.tech_method == 1 ? (
                                    <>
                                     <div className="space-y-4 ">
                                      {/* System of equations */}
                                      <BlockMath math={`
                                        ${data?.payload?.tech_lang_keys[6]}: 
                                        \\begin{cases} 
                                          ${formData?.tech_a1_f ? formData.tech_a1_f + 'x' : ''} ${formData?.tech_b1_f ? '+ (' + formData.tech_b1_f + ')y' : ''} = ${formData?.tech_k1_f ?? 0} \\\\
                                          ${formData?.tech_a2_f ? formData.tech_a2_f + 'x' : ''} ${formData?.tech_b2_f ? '+ (' + formData.tech_b2_f + ')y' : ''} = ${formData?.tech_k2_f ?? 0}
                                        \\end{cases}
                                      `} />

                                      {/* Augmented matrix */}
                                      <div>
                                        {/* Text outside KaTeX */}
                                        <span className="mb-2">
                                          {data?.payload?.tech_lang_keys[8] ?? 'Write your input in the form of matrix:'}
                                        </span>

                                        {/* KaTeX matrix */}
                                        <BlockMath
                                          math={`
                                            \\begin{bmatrix}
                                              ${formData?.tech_a1_f ?? 0} & ${formData?.tech_b1_f ?? 0} & ${formData?.tech_k1_f ?? 0} \\\\
                                              ${formData?.tech_a2_f ?? 0} & ${formData?.tech_b2_f ?? 0} & ${formData?.tech_k2_f ?? 0}
                                            \\end{bmatrix}
                                          `}
                                        />
                                      </div>

                                      {/* Link to Gaussian calculator */}
                                      <p>
                                        Apply Gauss-Jordan Elimination method: ({data?.payload?.tech_lang_keys[9]}{" "}
                                        <a 
                                          href="https://calculator-logical.com/gaussian-elimination-calculator/" 
                                          className="text-blue-500 underline" 
                                          target="_blank"
                                        >
                                          Gaussian Elimination Calculator
                                        </a>)
                                      </p>

                                      {/* Result matrix */}
                                      <BlockMath math={`
                                        \\left[
                                          \\begin{array}{cc|c}
                                            ${result?.tech_a1_f} & ${result?.tech_b1_f} & ${result?.tech_k1_f} \\\\
                                            ${result?.tech_n1} & ${result?.tech_n2?.toFixed(0)} & ${result?.tech_n3?.toFixed(0)}
                                          \\end{array}
                                        \\right]
                                      `} />

                                      {/* Substitution */}
                                      <BlockMath math={`y = \\dfrac{${result?.tech_n3?.toFixed(0)}}{${result?.tech_n2?.toFixed(0)}} = ${result?.tech_y}`} />
                                      <BlockMath math={`x = \\dfrac{${result?.tech_k1_f} - (${result?.tech_b1_f})(${result?.tech_y.toFixed(0)})}{${result?.tech_a1_f}} = ${result?.tech_x}`} />
                                    </div>
                                    </>
                                  ) : formData?.tech_method == 2 ? (
                                    <>
                                   <div className="space-y-4 ">
                                      {/* System of equations */}


                                    <div className="mb-4">
                                      {/* System of equations */}
                                      <p>{data?.payload?.tech_lang_keys[6] ?? 'Write your equations:'}</p>
                                      <BlockMath
                                        math={`
                                          \\begin{cases} 
                                            ${formData?.tech_a1_f ? formData.tech_a1_f + 'x' : ''} ${formData?.tech_b1_f ? '+ (' + formData.tech_b1_f + ')y' : ''} = ${formData?.tech_k1_f ?? 0} \\\\
                                            ${formData?.tech_a2_f ? formData.tech_a2_f + 'x' : ''} ${formData?.tech_b2_f ? '+ (' + formData.tech_b2_f + ')y' : ''} = ${formData?.tech_k2_f ?? 0}
                                          \\end{cases}
                                        `}
                                      />
                                    </div>

                                    <div className="mb-4">
                                      {/* Matrix equation */}
                                      <p>{data?.payload?.tech_lang_keys[8] ?? 'Matrix form:'}</p>
                                      <BlockMath
                                        math={`
                                          \\begin{bmatrix}
                                            ${val(formData?.tech_a1_f)} & ${val(formData?.tech_b1_f)} \\\\
                                            ${val(formData?.tech_a2_f)} & ${val(formData?.tech_b2_f)}
                                          \\end{bmatrix} 
                                          \\begin{bmatrix}x\\\\y\\end{bmatrix} = 
                                          \\begin{bmatrix}${val(formData?.tech_k1_f)}\\\\${val(formData?.tech_k2_f)}\\end{bmatrix}
                                        `}
                                      />
                                    </div>

                                    <div className="mb-4">
                                      {/* Matrix inverse steps */}
                                      <p>{data?.payload?.tech_lang_keys[11] ?? 'Matrix inverse steps:'}</p>
                                      <BlockMath
                                        math={`
                                          \\begin{bmatrix}
                                            ${val(formData?.tech_a1_f)} & ${val(formData?.tech_b1_f)} \\\\
                                            ${val(formData?.tech_a2_f)} & ${val(formData?.tech_b2_f)}
                                          \\end{bmatrix}^{-1} 
                                          \\begin{bmatrix}x\\\\y\\end{bmatrix} =
                                          \\begin{bmatrix}
                                            ${val(formData?.tech_a1_f)} & ${val(formData?.tech_b1_f)} \\\\
                                            ${val(formData?.tech_a2_f)} & ${val(formData?.tech_b2_f)}
                                          \\end{bmatrix}^{-1} 
                                          \\begin{bmatrix}${val(formData?.tech_k1_f)}\\\\${val(formData?.tech_k2_f)}\\end{bmatrix}
                                        `}
                                      />
                                    </div>


                                      {/* Rewrite equation */}
                                      <BlockMath math={`
                                        \\begin{bmatrix}x\\\\y\\end{bmatrix} =
                                        \\begin{bmatrix}
                                          ${val(formData?.tech_a1_f)} & ${val(formData?.tech_b1_f)} \\\\
                                          ${val(formData?.tech_a2_f)} & ${val(formData?.tech_b2_f)}
                                        \\end{bmatrix}^{-1} 
                                        \\begin{bmatrix}${val(formData?.tech_k1_f)}\\\\${val(formData?.tech_k2_f)}\\end{bmatrix}
                                      `} />

                                      {/* Inverse matrix result */}
                                      <BlockMath math={`
                                        ${data?.payload?.tech_lang_keys[13]}:
                                        \\begin{bmatrix}
                                          ${val(formData?.tech_a1_f)} & ${val(formData?.tech_b1_f)} \\\\
                                          ${val(formData?.tech_a2_f)} & ${val(formData?.tech_b2_f)}
                                        \\end{bmatrix}^{-1} =
                                        \\begin{bmatrix}
                                          ${result?.tech_inv[0][0]?.toFixed(0)} & ${result?.tech_inv[0][1]?.toFixed(0)} \\\\
                                          ${result?.tech_inv[1][0]?.toFixed(0)} & ${result?.tech_inv[1][1]?.toFixed(0)}
                                        \\end{bmatrix}
                                      `} />

                                      {/* Final solution */}
                                      <BlockMath math={`
                                        ${data?.payload?.tech_lang_keys[12]}:
                                        \\begin{bmatrix}x\\\\y\\end{bmatrix} =
                                        \\begin{bmatrix}
                                          ${result?.tech_inv[0][0]?.toFixed(0)} & ${result?.tech_inv[0][1]?.toFixed(0)} \\\\
                                          ${result?.tech_inv[1][0]?.toFixed(0)} & ${result?.tech_inv[1][1]?.toFixed(0)}
                                        \\end{bmatrix}
                                        \\begin{bmatrix}${val(formData?.tech_k1_f)}\\\\${val(formData?.tech_k2_f)}\\end{bmatrix} =
                                        \\begin{bmatrix}${result?.tech_x}\\\\${result?.tech_y}\\end{bmatrix}
                                      `} />

                                      {/* External links */}
                                      <p>
                                        ({data?.payload?.tech_lang_keys[9]}{" "}
                                        <a href="https://calculator-logical.com/inverse-matrix-calculator/" className="text-blue-500 underline" target="_blank">
                                          Inverse Matrix Calculator
                                        </a>)
                                      </p>
                                      <p>
                                        ({data?.payload?.tech_lang_keys[9]}{" "}
                                        <a href="https://calculator-logical.com/matrix-multiplication-calculator/" className="text-blue-500 underline" target="_blank">
                                          Matrix Multiplication Calculator
                                        </a>)
                                      </p>
                                    </div>
                                    </>
                                  ) : formData?.tech_method == 3 ? (
                                    <>
                                     <div className="space-y-4 ">
                                      {/* System of equations */}
                                     {/* System of equations */}
                                  <p>{data?.payload?.tech_lang_keys[6] ?? 'Write your equations:'}</p>
                                  <BlockMath
                                    math={`
                                      \\begin{cases} 
                                        ${val(formData?.tech_a1_f)} x + ${val(formData?.tech_b1_f)} y = ${val(formData?.tech_k1_f)} \\\\
                                        ${val(formData?.tech_a2_f)} x + ${val(formData?.tech_b2_f)} y = ${val(formData?.tech_k2_f)}
                                      \\end{cases}
                                    `}
                                  />
                                  <p>For x, y {data?.payload?.tech_lang_keys[7] ?? 'use Cramer\'s rule'}.</p>

                                  {/* Augmented matrix */}
                                  <p>{data?.payload?.tech_lang_keys[8] ?? 'Augmented matrix:'}</p>
                                  <BlockMath
                                    math={`
                                      \\left[
                                        \\begin{array}{cc|c}
                                          ${val(formData?.tech_a1_f)} & ${val(formData?.tech_b1_f)} & ${val(formData?.tech_k1_f)} \\\\
                                          ${val(formData?.tech_a2_f)} & ${val(formData?.tech_b2_f)} & ${val(formData?.tech_k2_f)}
                                        \\end{array}
                                      \\right]
                                    `}
                                  />

                                  {/* Determinant D */}
                                  <p>
                                    {data?.payload?.tech_lang_keys[10] ?? 'Determinant'} ({data?.payload?.tech_lang_keys[9] ?? 'Check'} 
                                    <a href="https://calculator-logical.com/determinant-calculator/" className="text-blue-500" target="_blank" rel="noopener noreferrer">
                                      {""} Determinant Calculator
                                    </a>)
                                  </p>
                                  <BlockMath
                                    math={`
                                      D = 
                                      \\begin{vmatrix}
                                        ${val(formData?.tech_a1_f)} & ${val(formData?.tech_b1_f)} \\\\
                                        ${val(formData?.tech_a2_f)} & ${val(formData?.tech_b2_f)}
                                      \\end{vmatrix} = ${val(result?.tech_det1)}
                                    `}
                                  />


                                      {/* D_x */}
                                      <BlockMath math={`
                                        D_x = 
                                        \\begin{vmatrix}
                                          ${val(formData?.tech_k1_f)} & ${val(formData?.tech_b1_f)} \\\\
                                          ${val(formData?.tech_k2_f)} & ${val(formData?.tech_b2_f)}
                                        \\end{vmatrix} = ${val(result?.tech_det2)}
                                      `} />

                                      {/* D_y */}
                                      <BlockMath math={`
                                        D_y = 
                                        \\begin{vmatrix}
                                          ${val(formData?.tech_a1_f)} & ${val(formData?.tech_k1_f)} \\\\
                                          ${val(formData?.tech_a2_f)} & ${val(formData?.tech_k2_f)}
                                        \\end{vmatrix} = ${val(result?.tech_det3)}
                                      `} />

                                      {/* Final results */}
                                      <p>{data?.payload?.tech_lang_keys[12]}:</p>
                                      <BlockMath math={`x = \\dfrac{D_x}{D} = \\dfrac{${val(result?.tech_det2)}}{${val(result?.tech_det1)}} = ${val(result?.tech_x)}`} />
                                      <BlockMath math={`y = \\dfrac{D_y}{D} = \\dfrac{${val(result?.tech_det3)}}{${val(result?.tech_det1)}} = ${val(result?.tech_y)}`} />
                                    </div>
                                    </>
                                  ):null}
                                
                                 <div className="space-y-3">
                                  <p className="mt-3">
                                    <InlineMath math={`x = ${result?.tech_x}`} />
                                  </p>
                                  <p className="mt-3">
                                    <InlineMath math={`y = ${result?.tech_y}`} />
                                  </p>
                                </div>
                                  </>
                                ):(
                                  <>
                                  
                                  <div className="w-full md:w-[60%] lg:w-[60%] mt-2">
                                      <table className="w-full font-s-18">
                                        <tbody>
                                          <tr>
                                              <td className="py-2 border-b" width="30%"><strong>x =</strong></td>
                                              <td className="py-2 border-b">{round(result?.tech_x, 3)}</td>
                                          </tr>
                                          <tr>
                                              <td className="py-2 border-b" width="30%"><strong>y =</strong></td>
                                              <td className="py-2 border-b">{round(result?.tech_y, 3)}</td>
                                          </tr>
                                          <tr>
                                              <td className="py-2 border-b" width="30%"><strong>z =</strong></td>
                                              <td className="py-2 border-b">{round(result?.tech_z, 3)}</td>
                                          </tr>
                                          </tbody>
                                      </table>
                                  </div>
                                  <p className="mt-3"><strong>{data?.payload?.tech_lang_keys[5]}</strong></p>

                                  {formData?.tech_method == 1 ? (
                                    <>
                                      <div className="space-y-4  ">
                                      {/* System of equations */}
                                        <p>{data?.payload?.tech_lang_keys[6] ?? 'Write your equations:'}</p>
                                        <BlockMath
                                          math={`
                                            \\begin{cases} 
                                              ${formData?.tech_a1_s ? val(formData.tech_a1_s) + 'x' : ''} ${formData?.tech_b1_s ? '+ (' + val(formData.tech_b1_s) + ')y' : ''} ${formData?.tech_c1_s ? '+ (' + val(formData.tech_c1_s) + ')z' : ''} = ${val(formData?.tech_k1_s)} \\\\
                                              ${formData?.tech_a2_s ? val(formData.tech_a2_s) + 'x' : ''} ${formData?.tech_b2_s ? '+ (' + val(formData.tech_b2_s) + ')y' : ''} ${formData?.tech_c2_s ? '+ (' + val(formData.tech_c2_s) + ')z' : ''} = ${val(formData?.tech_k2_s)} \\\\
                                              ${formData?.tech_a3_s ? val(formData.tech_a3_s) + 'x' : ''} ${formData?.tech_b3_s ? '+ (' + val(formData.tech_b3_s) + ')y' : ''} ${formData?.tech_c3_s ? '+ (' + val(formData.tech_c3_s) + ')z' : ''} = ${val(formData?.tech_k3_s)}
                                            \\end{cases}
                                          `}
                                        />
                                        <p>For x, y, z {data?.payload?.tech_lang_keys[7] ?? 'use Gauss-Jordan Elimination method'}.</p>

                                        {/* Augmented matrix */}
                                        <p>{data?.payload?.tech_lang_keys[8] ?? 'Augmented matrix:'}</p>
                                        <BlockMath
                                          math={`
                                            \\left[
                                              \\begin{array}{ccc|c}
                                                ${val(formData?.tech_a1_s)} & ${val(formData?.tech_b1_s)} & ${val(formData?.tech_c1_s)} & ${val(formData?.tech_k1_s)} \\\\
                                                ${val(formData?.tech_a2_s)} & ${val(formData?.tech_b2_s)} & ${val(formData?.tech_c2_s)} & ${val(formData?.tech_k2_s)} \\\\
                                                ${val(formData?.tech_a3_s)} & ${val(formData?.tech_b3_s)} & ${val(formData?.tech_c3_s)} & ${val(formData?.tech_k3_s)}
                                              \\end{array}
                                            \\right]
                                          `}
                                        />


                                        {/* Result after Gauss-Jordan elimination */}
                                        <p>
                                          Apply Gauss-Jordan Elimination method: ({data?.payload?.tech_lang_keys[9]}{" "}
                                          <a 
                                            href="https://calculator-logical.com/gaussian-elimination-calculator/" 
                                            className="text-blue-500 underline" 
                                            target="_blank"
                                          >
                                            Gaussian Elimination Calculator
                                          </a>)
                                        </p>
                                        <BlockMath math={`
                                          \\left[
                                            \\begin{array}{ccc|c}
                                              1 & 0 & 0 & ${result?.tech_x?.toFixed(5)} \\\\
                                              0 & 1 & 0 & ${result?.tech_y?.toFixed(5)} \\\\
                                              0 & 0 & 1 & ${result?.tech_z?.toFixed(5)}
                                            \\end{array}
                                          \\right]
                                        `} />
                                      </div>

                                    </>
                                  ) : formData?.tech_method == 2 ? (
                                      <>
                                       <div className="space-y-4 ">
                                        {/* System of equations */}
                                      <p>{data?.payload?.tech_lang_keys[6] ?? 'System of equations:'}</p>
                                      <BlockMath math={`
                                        \\begin{cases} 
                                          ${formData?.tech_a1_s ? val(formData.tech_a1_s) + 'x' : ''} ${formData?.tech_b1_s ? '+ (' + val(formData.tech_b1_s) + ')y' : ''} ${formData?.tech_c1_s ? '+ (' + val(formData.tech_c1_s) + ')z' : ''} = ${val(formData?.tech_k1_s)} \\\\
                                          ${formData?.tech_a2_s ? val(formData.tech_a2_s) + 'x' : ''} ${formData?.tech_b2_s ? '+ (' + val(formData.tech_b2_s) + ')y' : ''} ${formData?.tech_c2_s ? '+ (' + val(formData.tech_c2_s) + ')z' : ''} = ${val(formData?.tech_k2_s)} \\\\
                                          ${formData?.tech_a3_s ? val(formData.tech_a3_s) + 'x' : ''} ${formData?.tech_b3_s ? '+ (' + val(formData.tech_b3_s) + ')y' : ''} ${formData?.tech_c3_s ? '+ (' + val(formData.tech_c3_s) + ')z' : ''} = ${val(formData?.tech_k3_s)}
                                        \\end{cases}
                                      `} />
                                      <p>For x, y, z {data?.payload?.tech_lang_keys[7] ?? 'using inverse matrix method'}.</p>

                                      {/* Coefficient matrix and equation */}
                                      <p>{data?.payload?.tech_lang_keys[8] ?? 'Coefficient matrix:'}</p>
                                      <BlockMath math={`
                                        \\begin{bmatrix}
                                          ${val(formData?.tech_a1_s)} & ${val(formData?.tech_b1_s)} & ${val(formData?.tech_c1_s)} \\\\
                                          ${val(formData?.tech_a2_s)} & ${val(formData?.tech_b2_s)} & ${val(formData?.tech_c2_s)} \\\\
                                          ${val(formData?.tech_a3_s)} & ${val(formData?.tech_b3_s)} & ${val(formData?.tech_c3_s)}
                                        \\end{bmatrix} 
                                        \\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} =
                                        \\begin{bmatrix}
                                          ${val(formData?.tech_k1_s)} \\\\
                                          ${val(formData?.tech_k2_s)} \\\\
                                          ${val(formData?.tech_k3_s)}
                                        \\end{bmatrix}
                                      `} />

                                      {/* Inverse matrix calculation */}
                                      <p>{data?.payload?.tech_lang_keys[11] ?? 'Inverse matrix calculation:'}</p>
                                      <BlockMath math={`
                                        \\begin{bmatrix}
                                          ${val(formData?.tech_a1_s)} & ${val(formData?.tech_b1_s)} & ${val(formData?.tech_c1_s)} \\\\
                                          ${val(formData?.tech_a2_s)} & ${val(formData?.tech_b2_s)} & ${val(formData?.tech_c2_s)} \\\\
                                          ${val(formData?.tech_a3_s)} & ${val(formData?.tech_b3_s)} & ${val(formData?.tech_c3_s)}
                                        \\end{bmatrix}^{-1} 
                                        \\begin{bmatrix}
                                          ${val(formData?.tech_k1_s)} \\\\
                                          ${val(formData?.tech_k2_s)} \\\\
                                          ${val(formData?.tech_k3_s)}
                                        \\end{bmatrix}
                                      `} />

                                    {/* Resulting inverse matrix */}
                                    <p>{data?.payload?.tech_lang_keys[13] ?? 'Inverse Matrix:'} {" "}
                                      (<a href="https://calculator-logical.com/inverse-matrix-calculator/" target="_blank" rel="noopener noreferrer">
                                        {data?.payload?.tech_lang_keys[9] ?? 'Inverse Matrix Calculator'}
                                      </a>)
                                    </p>
                                    <BlockMath math={`
                                      \\begin{bmatrix}
                                        ${val(formData?.tech_a1_s)} & ${val(formData?.tech_b1_s)} & ${val(formData?.tech_c1_s)} \\\\
                                        ${val(formData?.tech_a2_s)} & ${val(formData?.tech_b2_s)} & ${val(formData?.tech_c2_s)} \\\\
                                        ${val(formData?.tech_a3_s)} & ${val(formData?.tech_b3_s)} & ${val(formData?.tech_c3_s)}
                                      \\end{bmatrix}^{-1} =
                                      \\begin{bmatrix}
                                        ${result?.tech_inv[0][0]?.toFixed(0)} & ${result?.tech_inv[0][1]?.toFixed(0)} & ${result?.tech_inv[0][2]?.toFixed(0)} \\\\
                                        ${result?.tech_inv[1][0]?.toFixed(0)} & ${result?.tech_inv[1][1]?.toFixed(0)} & ${result?.tech_inv[1][2]?.toFixed(0)} \\\\
                                        ${result?.tech_inv[2][0]?.toFixed(0)} & ${result?.tech_inv[2][1]?.toFixed(0)} & ${result?.tech_inv[2][2]?.toFixed(0)}
                                      \\end{bmatrix}
                                    `} />

                                    {/* Final solution */}
                                    <p>{data?.payload?.tech_lang_keys[12] ?? 'Final Solution:'}  {" "}
                                      (<a href="https://calculator-logical.com/matrix-multiplication-calculator/" target="_blank" rel="noopener noreferrer">
                                        {data?.payload?.tech_lang_keys[9] ?? 'Matrix Multiplication Calculator'}
                                      </a>)
                                    </p>
                                    <BlockMath math={`
                                      \\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} =
                                      \\begin{bmatrix}
                                        ${result?.tech_inv[0][0]?.toFixed(0)} & ${result?.tech_inv[0][1]?.toFixed(0)} & ${result?.tech_inv[0][2]?.toFixed(0)} \\\\
                                        ${result?.tech_inv[1][0]?.toFixed(0)} & ${result?.tech_inv[1][1]?.toFixed(0)} & ${result?.tech_inv[1][2]?.toFixed(0)} \\\\
                                        ${result?.tech_inv[2][0]?.toFixed(0)} & ${result?.tech_inv[2][1]?.toFixed(0)} & ${result?.tech_inv[2][2]?.toFixed(0)}
                                      \\end{bmatrix} 
                                      \\begin{bmatrix}
                                        ${val(formData?.tech_k1_s)} \\\\
                                        ${val(formData?.tech_k2_s)} \\\\
                                        ${val(formData?.tech_k3_s)}
                                      \\end{bmatrix} =
                                      \\begin{bmatrix}
                                        ${result?.tech_x} \\\\
                                        ${result?.tech_y} \\\\
                                        ${result?.tech_z}
                                      \\end{bmatrix}
                                    `} />

                                      </div>

                                      </>
                                  ) : formData?.tech_method == 3 ? (
                                    <>
                                    
                                    <div className="space-y-4 ">

                                  {/* System of equations */}
                                    <p>{data?.payload?.tech_lang_keys[6] ?? 'System of equations:'} (for x, y, z {data?.payload?.tech_lang_keys[7] ?? "Cramer's rule"})</p>
                                    <BlockMath math={`
                                      \\begin{cases} 
                                        ${formData?.tech_a1_s ? formData.tech_a1_s + 'x' : ''} ${formData?.tech_b1_s ? '+ (' + formData.tech_b1_s + ')y' : ''} ${formData?.tech_c1_s ? '+ (' + formData.tech_c1_s + ')z' : ''} = ${val(formData?.tech_k1_s)} \\\\
                                        ${formData?.tech_a2_s ? formData.tech_a2_s + 'x' : ''} ${formData?.tech_b2_s ? '+ (' + formData.tech_b2_s + ')y' : ''} ${formData?.tech_c2_s ? '+ (' + formData.tech_c2_s + ')z' : ''} = ${val(formData?.tech_k2_s)} \\\\
                                        ${formData?.tech_a3_s ? formData.tech_a3_s + 'x' : ''} ${formData?.tech_b3_s ? '+ (' + formData.tech_b3_s + ')y' : ''} ${formData?.tech_c3_s ? '+ (' + formData.tech_c3_s + ')z' : ''} = ${val(formData?.tech_k3_s)}
                                      \\end{cases}
                                    `} />

                                    {/* Augmented matrix */}
                                    <p>{data?.payload?.tech_lang_keys[8] ?? 'Augmented Matrix:'}</p>
                                    <BlockMath math={`
                                      \\left[
                                      \\begin{array}{ccc|c}
                                        ${val(formData?.tech_a1_s)} & ${val(formData?.tech_b1_s)} & ${val(formData?.tech_c1_s)} & ${val(formData?.tech_k1_s)} \\\\
                                        ${val(formData?.tech_a2_s)} & ${val(formData?.tech_b2_s)} & ${val(formData?.tech_c2_s)} & ${val(formData?.tech_k2_s)} \\\\
                                        ${val(formData?.tech_a3_s)} & ${val(formData?.tech_b3_s)} & ${val(formData?.tech_c3_s)} & ${val(formData?.tech_k3_s)}
                                      \\end{array}
                                      \\right]
                                    `} />

                                    {/* Determinants */}
                                    <p>{data?.payload?.tech_lang_keys[10] ?? 'Determinant D:'}</p>
                                    <BlockMath math={`
                                      D = 
                                      \\begin{vmatrix}
                                        ${val(formData?.tech_a1_s)} & ${val(formData?.tech_b1_s)} & ${val(formData?.tech_c1_s)} \\\\
                                        ${val(formData?.tech_a2_s)} & ${val(formData?.tech_b2_s)} & ${val(formData?.tech_c2_s)} \\\\
                                        ${val(formData?.tech_a3_s)} & ${val(formData?.tech_b3_s)} & ${val(formData?.tech_c3_s)}
                                      \\end{vmatrix} = ${val(result?.tech_det1)}
                                    `} />

                                    <BlockMath math={`
                                      D_x = 
                                      \\begin{vmatrix}
                                        ${val(formData?.tech_k1_s)} & ${val(formData?.tech_b1_s)} & ${val(formData?.tech_c1_s)} \\\\
                                        ${val(formData?.tech_k2_s)} & ${val(formData?.tech_b2_s)} & ${val(formData?.tech_c2_s)} \\\\
                                        ${val(formData?.tech_k3_s)} & ${val(formData?.tech_b3_s)} & ${val(formData?.tech_c3_s)}
                                      \\end{vmatrix} = ${result?.tech_det2}
                                    `} />

                                    <BlockMath math={`
                                      D_y = 
                                      \\begin{vmatrix}
                                        ${val(formData?.tech_a1_s)} & ${val(formData?.tech_k1_s)} & ${val(formData?.tech_c1_s)} \\\\
                                        ${val(formData?.tech_a2_s)} & ${val(formData?.tech_k2_s)} & ${val(formData?.tech_c2_s)} \\\\
                                        ${val(formData?.tech_a3_s)} & ${val(formData?.tech_k3_s)} & ${val(formData?.tech_c3_s)}
                                      \\end{vmatrix} = ${result?.tech_det3}
                                    `} />

                                    <BlockMath math={`
                                      D_z = 
                                      \\begin{vmatrix}
                                        ${val(formData?.tech_a1_s)} & ${val(formData?.tech_b1_s)} & ${val(formData?.tech_k1_s)} \\\\
                                        ${val(formData?.tech_a2_s)} & ${val(formData?.tech_b2_s)} & ${val(formData?.tech_k2_s)} \\\\
                                        ${val(formData?.tech_a3_s)} & ${val(formData?.tech_b3_s)} & ${val(formData?.tech_k3_s)}
                                      \\end{vmatrix} = ${result?.tech_det4}
                                    `} />

                                    {/* Solutions */}
                                    <BlockMath math={`
                                      x = \\frac{D_x}{D} = \\frac{${result?.tech_det2}}{${result?.tech_det1}} = ${result?.tech_x}, \\
                                      y = \\frac{D_y}{D} = \\frac{${result?.tech_det3}}{${result?.tech_det1}} = ${result?.tech_y}, \\
                                      z = \\frac{D_z}{D} = \\frac{${result?.tech_det4}}{${result?.tech_det1}} = ${result?.tech_z}
                                    `} />

                                  </div>
                                    </>
                                  ):null}
                                 <div className="space-y-3 ">
                                  <p className="mt-3">
                                    <InlineMath math={`x = ${result?.tech_x}`} />
                                  </p>
                                  <p className="mt-3">
                                    <InlineMath math={`y = ${result?.tech_y}`} />
                                  </p>
                                  <p className="mt-3">
                                    <InlineMath math={`z = ${result?.tech_z}`} />
                                  </p>
                                </div>
                                  </>
                                  
                                )}
                                


                            </div>
                        </div>
                    </div>












                    </div>
                  )}
                </div>
            </div>
          </form>
    <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default SystemOfEquationCalculator;
