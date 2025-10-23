"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useZakatCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ZakatCalculator = () => {
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
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    cash: "",
    bankBalance: "",
    gold: "",
    silver: "",
    investments: "",
    businessAssets: "",
    debts: "",
    expenses: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateZakatCalculator,
    { isLoading: zakatCalculationLoading, isError, error: calculateZakatError },
  ] = useZakatCalculatorMutation();

  // Currency state
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const calculateZakat = () => {
    const cash = parseFloat(formData.cash) || 0;
    const bankBalance = parseFloat(formData.bankBalance) || 0;
    const gold = parseFloat(formData.gold) || 0;
    const silver = parseFloat(formData.silver) || 0;
    const investments = parseFloat(formData.investments) || 0;
    const businessAssets = parseFloat(formData.businessAssets) || 0;
    const debts = parseFloat(formData.debts) || 0;
    const expenses = parseFloat(formData.expenses) || 0;

    // Calculate total assets
    const totalAssets =
      cash + bankBalance + gold + silver + investments + businessAssets;

    // Calculate net assets (after debts and expenses)
    const netAssets = totalAssets - debts - expenses;

    // Nisab threshold (approximately $3,000 USD or equivalent)
    const nisabThreshold = 3000;

    // Zakat rate is 2.5%
    const zakatRate = 0.025;

    let zakatAmount = 0;
    let isZakatDue = false;

    if (netAssets >= nisabThreshold) {
      zakatAmount = netAssets * zakatRate;
      isZakatDue = true;
    }

    return {
      totalAssets,
      netAssets,
      zakatAmount,
      isZakatDue,
      nisabThreshold,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one asset field is filled
    const hasAssets = Object.entries(formData).some(
      ([key, value]) =>
        [
          "cash",
          "bankBalance",
          "gold",
          "silver",
          "investments",
          "businessAssets",
        ].includes(key) &&
        value &&
        parseFloat(value) > 0
    );

    if (!hasAssets) {
      setFormError("Please enter at least one asset value to calculate Zakat.");
      return;
    }

    setFormError("");

    try {
      // Calculate Zakat locally
      const calculationResult = calculateZakat();

      // You can also send to API if needed
      // const response = await calculateZakatCalculator(formData).unwrap();

      setResult(calculationResult);
      toast.success("Zakat calculated successfully!");
    } catch (err) {
      setFormError("Error calculating Zakat. Please try again.");
      toast.error("Error calculating Zakat. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      cash: "",
      bankBalance: "",
      gold: "",
      silver: "",
      investments: "",
      businessAssets: "",
      debts: "",
      expenses: "",
    });
    setResult(null);
    setFormError("");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Calculator
      isLoading={isLoading}
      data={data}
      links={[
        { name: "Home", path: "/" },
        {
          name: data?.payload?.tech_cal_cat,
          path: "/category/Finance",
        },
        {
          name: data?.payload?.tech_calculator_title,
          path: pathname,
        },
      ]}
    >
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          {/* Assets Section */}
          <div className="grid grid-cols-12 gap-4">
            <h3 className="col-span-12 text-xl font-semibold text-gray-800 ">
              Assets ({currency.symbol})
            </h3>

            {/* Cash */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cash in Hand
              </label>
              <input
                type="text"
                name="cash"
                value={formData.cash}
                onChange={handleChange}
                placeholder="Enter cash amount"
                className="input my-2"
              />
            </div>

            {/* Bank Balance */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Balance
              </label>
              <input
                type="text"
                name="bankBalance"
                value={formData.bankBalance}
                onChange={handleChange}
                placeholder="Enter bank balance"
                className="input my-2"
              />
            </div>

            {/* Gold */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gold Value
              </label>
              <input
                type="text"
                name="gold"
                value={formData.gold}
                onChange={handleChange}
                placeholder="Enter gold value"
                className="input my-2"
              />
            </div>

            {/* Silver */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Silver Value
              </label>
              <input
                type="text"
                name="silver"
                value={formData.silver}
                onChange={handleChange}
                placeholder="Enter silver value"
                className="input my-2"
              />
            </div>

            {/* Investments */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investments & Shares
              </label>
              <input
                type="text"
                name="investments"
                value={formData.investments}
                onChange={handleChange}
                placeholder="Enter investments value"
                className="input my-2"
              />
            </div>

            {/* Business Assets */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Assets
              </label>
              <input
                type="text"
                name="businessAssets"
                value={formData.businessAssets}
                onChange={handleChange}
                placeholder="Enter business assets value"
                className="input my-2"
              />
            </div>
          </div>

          {/* Liabilities Section */}
          <div className="grid grid-cols-12 gap-4">
            <h3 className="col-span-12 text-xl font-semibold text-gray-800 ">
              Liabilities ({currency.symbol})
            </h3>
            {/* Debts */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outstanding Debts
              </label>
              <input
                type="text"
                name="debts"
                value={formData.debts}
                onChange={handleChange}
                placeholder="Enter total debts"
                className="input my-2"
              />
            </div>
            {/* Living Expenses */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Living Expenses
              </label>
              <input
                type="text"
                name="expenses"
                value={formData.expenses}
                onChange={handleChange}
                placeholder="Enter annual expenses"
                className="input my-2"
              />
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={zakatCalculationLoading}>
              {data?.payload?.tech_lang_keys["calculate"] || "Calculate Zakat"}
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

        {/* Results Section */}
        {zakatCalculationLoading ? (
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
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                {/* Zakat Calculation Results */}
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700">
                        Total Assets
                      </h4>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(result.totalAssets)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700">
                        Net Assets
                      </h4>
                      <p className="text-xl font-bold text-gray-600">
                        {formatCurrency(result.netAssets)}
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700">
                        Nisab Threshold
                      </h4>
                      <p className="text-xl font-bold text-yellow-600">
                        {formatCurrency(result.nisabThreshold)}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${
                        result.isZakatDue ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <h4 className="font-semibold text-gray-700">
                        {result.isZakatDue ? "Zakat Due" : "No Zakat Due"}
                      </h4>
                      <p
                        className={`text-xl font-bold ${
                          result.isZakatDue ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(result.zakatAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Explanation */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Calculation Details
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        • Total Assets: {formatCurrency(result.totalAssets)}
                      </p>
                      <p>
                        • Less Debts & Expenses:{" "}
                        {formatCurrency(
                          parseFloat(formData.debts || 0) +
                            parseFloat(formData.expenses || 0)
                        )}
                      </p>
                      <p>
                        • Net Zakatable Assets:{" "}
                        {formatCurrency(result.netAssets)}
                      </p>
                      <p>
                        • Nisab Threshold:{" "}
                        {formatCurrency(result.nisabThreshold)}
                      </p>
                      {result.isZakatDue ? (
                        <>
                          <p>• Zakat Rate: 2.5%</p>
                          <p className="font-semibold text-green-600">
                            • Zakat Payable:{" "}
                            {formatCurrency(result.zakatAmount)}
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-red-600">
                          • Your assets are below the Nisab threshold, so no
                          Zakat is due.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">
                      Important Notes
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>
                        • Zakat is calculated at 2.5% of your net zakatable
                        assets
                      </li>
                      <li>
                        • Assets must be held for a full lunar year (Hawl)
                      </li>
                      <li>
                        • This calculator provides an estimate - consult with a
                        scholar for specific situations
                      </li>
                      <li>
                        • Personal use items (home, car, clothing) are not
                        included in Zakat calculation
                      </li>
                      <li>
                        • Gold and silver values should be current market value
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default ZakatCalculator;
