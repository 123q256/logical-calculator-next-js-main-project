"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useImplantationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ImplantationCalculator = () => {
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
    tech_know: "yes",
    tech_ovd: "2021-06-01",
    tech_lp: "2021-05-18",
    tech_mcl: "28",
    tech_ivf: "2025-05-15",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useImplantationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_know == "yes") {
      if (!formData.tech_know || !formData.tech_ovd) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (!formData.tech_know || !formData.tech_lp || !formData.tech_mcl) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_know: formData.tech_know,
        tech_ovd: formData.tech_ovd,
        tech_lp: formData.tech_lp,
        tech_mcl: formData.tech_mcl,
        tech_ivf: formData.tech_ivf,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_know: "yes",
      tech_ovd: "2021-06-01",
      tech_lp: "2021-05-18",
      tech_mcl: "28",
      tech_ivf: "",
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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6 pe-lg-4">
                <label htmlFor="tech_know" className="label">
                  Do you know your ovulation date?:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_know"
                    id="tech_know"
                    value={formData.tech_know}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              {formData.tech_know == "yes" && (
                <div className="col-span-12 md:col-span-6 lg:col-span-6 ovd">
                  <label htmlFor="tech_ovd" className="label">
                    Ovulation Date:
                  </label>
                  <div className=" relative">
                    <input
                      type="date"
                      step="any"
                      name="tech_ovd"
                      id="tech_ovd"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_ovd}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              {formData.tech_know == "no" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6  lp">
                    <label htmlFor="tech_lp" className="label">
                      Your Last Period:
                    </label>
                    <div className=" relative">
                      <input
                        type="date"
                        step="any"
                        name="tech_lp"
                        id="tech_lp"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_lp}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 pe-lg-4  mcl">
                    <label htmlFor="tech_mcl" className="label">
                      Menstrual Cycle Length:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_mcl"
                        id="tech_mcl"
                        value={formData.tech_mcl}
                        onChange={handleChange}
                      >
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                        <option value="32">32</option>
                        <option value="33">33</option>
                        <option value="34">34</option>
                        <option value="35">35</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12 ">
                <p className="font-s-20 ps-2">
                  <strong className="text-blue">Fertility Treatment</strong>
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6 ivf">
                <label htmlFor="tech_ivf" className="label">
                  IVF Transfer Day (Optional):
                </label>
                <div className=" relative">
                  <input
                    type="date"
                    step="any"
                    name="tech_ivf"
                    id="tech_ivf"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_ivf}
                    onChange={handleChange}
                  />
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
                      <div className="w-full mt-2">
                        <div className="w-full overflow-auto my-4">
                          <div
                            className="bggreen_implantation_calculator"
                            dangerouslySetInnerHTML={{
                              __html: result.tech_table,
                            }}
                          />
                        </div>
                        {result?.tech_ivf && (
                          <>
                            <p className="text-center text-[18px]">
                              <strong>According to IVF Transfer Date</strong>
                            </p>
                            <p className="text-center text-[18px]">
                              <strong className="text-blue-700">
                                Implantation Date
                              </strong>
                            </p>
                            <p className="text-center text-[28px]">
                              <strong className="text-[#119154]">
                                {result?.tech_ivf}
                              </strong>
                            </p>
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

export default ImplantationCalculator;
