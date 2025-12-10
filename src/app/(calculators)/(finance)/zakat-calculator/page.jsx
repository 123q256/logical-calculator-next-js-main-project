"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useZakatCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const ZakatCalculator = () => {
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

  // Currency values based on currency selection
  const currencyValues = {
    PKR: { gold: 2250000, silver: 175000, symbol: 'Rs' },
    GBP: { gold: 6364.04, silver: 494.98, symbol: '£' },
    USD: { gold: 8084.00, silver: 628.76, symbol: '$' },
    CAD: { gold: 11418.98, silver: 888.14, symbol: '$' }
  };

  // COMPLETE FORM DATA STATE
  const [formData, setFormData] = useState({
    nisab: "GoldValue",
    currency: "PKR",
    bankAccounts: "",
    Hajj: "",
    out_loan: "",
    receivables: "",
    inverstment: "",
    gold: "",
    silver: "",
    stock: "",
    addingValues: [],
    loans: "",
    wages: "",
    tax: "",
    zaka_ad: "",
    minusValues: []
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [messageForUser, setMessageForUser] = useState("");
  
  // Current nisab values
  const [goldValue, setGoldValue] = useState(currencyValues.PKR.gold);
  const [silverValue, setSilverValue] = useState(currencyValues.PKR.silver);
  const [currencySymbol, setCurrencySymbol] = useState('Rs');

  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useZakatCalculatorMutation();

  // Handle currency change - PHP logic ka conversion
  const handleCurrencyChange = (selectedCurrency) => {
    const values = currencyValues[selectedCurrency];
    
    if (values) {
      setGoldValue(values.gold);
      setSilverValue(values.silver);
      setCurrencySymbol(values.symbol);
      setMessageForUser('');
      
      // Update form data
      setFormData(prev => ({ ...prev, currency: selectedCurrency }));
      
      // Recalculate if needed
      calculateNisabCheck(values.gold, values.silver);
    }
  };

  // Handle nisab selection change
  const handleNisabChange = (nisabType) => {
    setFormData(prev => ({ ...prev, nisab: nisabType }));
    setMessageForUser('');
    calculateNisabCheck(goldValue, silverValue, nisabType);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'currency') {
      handleCurrencyChange(value);
    } else if (name === 'nisab') {
      handleNisabChange(value);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    
    setResult(null);
  };

  // Calculate nisab check
  const calculateNisabCheck = (gold, silver, nisabType = formData.nisab) => {
    const nisabValue = nisabType === 'GoldValue' ? gold : silver;
    const totalAssets = calculateTotalAssets();
    const totalLiabilities = calculateTotalLiabilities();
    const netWorth = totalAssets - totalLiabilities;
    
    if (netWorth >= nisabValue) {
      setMessageForUser(`Your wealth exceeds Nisab (${currencySymbol} ${nisabValue.toLocaleString()})`);
    } else {
      setMessageForUser(`Your wealth is below Nisab threshold`);
    }
  };

  // Helper functions for calculations
  const calculateTotalAssets = () => {
    const numFields = [
      'bankAccounts', 'Hajj', 'out_loan', 'receivables', 
      'inverstment', 'gold', 'silver', 'stock'
    ];
    
    let total = numFields.reduce((sum, field) => {
      return sum + (parseFloat(formData[field]) || 0);
    }, 0);

    formData.addingValues.forEach(val => {
      total += parseFloat(val) || 0;
    });

    return total;
  };

  const calculateTotalLiabilities = () => {
    const numFields = ['loans', 'wages', 'tax', 'zaka_ad'];
    
    let total = numFields.reduce((sum, field) => {
      return sum + (parseFloat(formData[field]) || 0);
    }, 0);

    formData.minusValues.forEach(val => {
      total += parseFloat(val) || 0;
    });

    return total;
  };

  const calculateNetWorth = () => {
    return calculateTotalAssets() - calculateTotalLiabilities();
  };

  const calculateZakat = () => {
    const netWorth = calculateNetWorth();
    const nisabValue = formData.nisab === 'GoldValue' ? goldValue : silverValue;
    
    if (netWorth >= nisabValue) {
      return netWorth * 0.025; // 2.5% zakat
    }
    return 0;
  };

  // Dynamic field handlers
  const handleAddValue = () => {
    setFormData(prev => ({
      ...prev,
      addingValues: [...prev.addingValues, ""]
    }));
  };

  const handleAddMinusValue = () => {
    setFormData(prev => ({
      ...prev,
      minusValues: [...prev.minusValues, ""]
    }));
  };

  const handleDynamicChange = (index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleRemoveField = (index, field) => {
    setFormData(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const netWorth = calculateNetWorth();
    const nisabValue = formData.nisab === 'GoldValue' ? goldValue : silverValue;

    if (netWorth < nisabValue) {
      setFormError(`Your net worth is below Nisab threshold. Zakat is not obligatory.`);
      toast.warning("Net worth below Nisab threshold");
      return;
    }

    setFormError("");
    
    try {
      const zakatAmount = calculateZakat();
      
      // COMPLETE DATA API KO BHEJO
      const payload = {
        ...formData,
        goldValue,
        silverValue,
        currencySymbol,
        nisabValue,
        totalAssets: calculateTotalAssets(),
        totalLiabilities: calculateTotalLiabilities(),
        netWorth,
        zakatAmount,
        zakatPercentage: 2.5
      };

      const response = await CatAgeCalculator(payload).unwrap();
      
      setResult(response?.payload || {
        zakatAmount,
        netWorth,
        nisabValue,
        currency: formData.currency
      });
      
      toast.success("Zakat Calculated Successfully");
      

      
    } catch (err) {
      setFormError(err?.data?.payload?.error || "Calculation failed");
      toast.error(err?.data?.payload?.error || "Calculation failed");
      console.error("Error:", err);
    }
  };

  const handleReset = () => {
    setFormData({
      nisab: "GoldValue",
      currency: "PKR",
      bankAccounts: "",
      Hajj: "",
      out_loan: "",
      receivables: "",
      inverstment: "",
      gold: "",
      silver: "",
      stock: "",
      addingValues: [],
      loans: "",
      wages: "",
      tax: "",
      zaka_ad: "",
      minusValues: []
    });
    setResult(null);
    setFormError("");
    setMessageForUser("");
    setGoldValue(currencyValues.PKR.gold);
    setSilverValue(currencyValues.PKR.silver);
    setCurrencySymbol('Rs');
  };

  // Format currency display
  const formatCurrency = (value) => {
    return `${currencySymbol} ${value.toLocaleString()}`;
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          {messageForUser && (
            <p className="MessageForUser text-blue-600 text-lg font-semibold w-full">
              {messageForUser}
            </p>
          )}

          <div className="lg:w-[80%] md:w-[90%] w-full mx-auto">
            <div className="grid grid-cols-12 gap-2 md:gap-4">
              {/* Nisab Selection */}
              <div className="col-span-12 md:col-span-9 mt-0">
                <p className="fw-bold">
                  {data?.payload?.tech_lang_keys['2'] ?? 'Nisab threshold'}
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <p>
                    <label className="pe-2 flex items-center gap-2" htmlFor="GoldValue">
                      <input
                        type="radio"
                        name="nisab"
                        value="GoldValue"
                        id="GoldValue"
                        className="border"
                        onChange={handleChange}
                        checked={formData.nisab === 'GoldValue'}
                      />
                      <span>
                        {data?.payload?.tech_lang_keys['3'] ?? 'Value of Gold'} 
                        ({data?.payload?.tech_lang_keys['21'] ?? 'approximately'}{' '}
                        <span className="GOLD font-bold">{formatCurrency(goldValue)}</span>)
                      </span>
                    </label>
                  </p>

                  <p>
                    <label className="flex items-center gap-2" htmlFor="SilvarValue">
                      <input
                        type="radio"
                        name="nisab"
                        className="border"
                        value="SilvarValue"
                        id="SilvarValue"
                        onChange={handleChange}
                        checked={formData.nisab === 'SilvarValue'}
                      />
                      <span>
                        {data?.payload?.tech_lang_keys['4'] ?? 'Value of Silver'} 
                        ({data?.payload?.tech_lang_keys['21'] ?? 'approximately'}{' '}
                        <span className="SILVER font-bold">{formatCurrency(silverValue)}</span>)
                      </span>
                    </label>
                  </p>
                </div>
              </div>

              {/* Currency Selection */}
              <div className="col-span-12 md:col-span-3">
                <label htmlFor="currency" className="label font-bold">
                  {data?.payload?.tech_lang_keys['1'] ?? 'Select currency'}:
                </label>
                <div className="mt-2">
                  <select
                    className="input w-full border rounded p-2"
                    name="currency"
                    id="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="PKR">PKR (Rs)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </div>

              {/* Assets Section */}
              <div className="col-span-12 md:col-span-6">
                <p className="fw-bold text-lg mb-3">
                  {data?.payload?.tech_lang_keys['5'] ?? 'Cash & Assets'}
                </p>

                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['6'] ?? 'Bank Accounts'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="bankAccounts"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.bankAccounts}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['7'] ?? 'Hajj Savings'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="Hajj"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.Hajj}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['8'] ?? 'Loans Given Out'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="out_loan"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.out_loan}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['27'] ?? 'Other Receivables'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="receivables"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.receivables}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['9'] ?? 'Investments'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="inverstment"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.inverstment}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['18'] ?? 'Gold'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="gold"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.gold}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['19'] ?? 'Silver'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="silver"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.silver}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['11'] ?? 'Stock Value'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="stock"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.stock}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Dynamic Adding Values */}
                  {formData.addingValues.map((val, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        className="input flex-1 border rounded p-2"
                        placeholder="Additional Value"
                        value={val}
                        onChange={(e) => handleDynamicChange(idx, 'addingValues', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx, 'addingValues')}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddValue}
                    className="w-full p-2 text-white rounded bg-[#2845F5] cursor-pointer hover:bg-blue-500 font-bold"
                  >
                    + {data?.payload?.tech_lang_keys['adrow'] ?? 'Add Row'}
                  </button>
                </div>
              </div>

              {/* Liabilities Section */}
              <div className="col-span-12 md:col-span-6">
                <p className="fw-bold text-lg mb-3">
                  {data?.payload?.tech_lang_keys['12'] ?? 'Liabilities'}
                </p>

                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['13'] ?? 'Loans/Debts'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="loans"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.loans}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['14'] ?? 'Wages Due'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="wages"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.wages}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['15'] ?? 'Taxes/Bills Due'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="tax"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.tax}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      {data?.payload?.tech_lang_keys['31'] ?? 'Zakat Paid in Advance'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="zaka_ad"
                      className="input w-full border rounded p-2"
                      placeholder="0.00"
                      value={formData.zaka_ad}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Dynamic Minus Values */}
                  {formData.minusValues.map((val, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        className="input flex-1 border rounded p-2"
                        placeholder="Additional Liability"
                        value={val}
                        onChange={(e) => handleDynamicChange(idx, 'minusValues', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx, 'minusValues')}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddMinusValue}
                    className="w-full p-2 border rounded bg-[#2845F5] text-white cursor-pointer hover:bg-blue-500 font-bold"
                  >
                    + {data?.payload?.tech_lang_keys['adrow'] ?? 'Add Row'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Display */}
          <div className="w-full bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-3 text-lg">Summary:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Assets:</p>
                <p className="font-bold">{formatCurrency(calculateTotalAssets())}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Liabilities:</p>
                <p className="font-bold">{formatCurrency(calculateTotalLiabilities())}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Worth:</p>
                <p className="font-bold text-blue-600">{formatCurrency(calculateNetWorth())}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nisab Threshold:</p>
                <p className="font-bold text-green-600">
                  {formatCurrency(formData.nisab === 'GoldValue' ? goldValue : silverValue)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Estimated Zakat (2.5%):</p>
                <p className="font-bold text-lg text-green-700">{formatCurrency(calculateZakat())}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculateDogLoading}>
              {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate Zakat"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["reset"] ?? "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        {/* Result Display */}
        {result !== null && !isLoading && (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md">
            <ResultActions lang={data?.payload?.tech_lang_keys} />
           <div className="mt-6 flex justify-center">
              <div className="p-4 text-center">
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-semibold">
                      Your Zakat Amount. {data?.payload?.tech_lang_keys[25]} :
                    </span>{' '}
                    <span className="text-green-600 font-bold text-2xl">
                      {formatCurrency(result.zakatAmount || calculateZakat())}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold">
                      Net Worth {data?.payload?.tech_lang_keys[26]} :
                    </span>{' '}
                    {formatCurrency(result.netWorth || calculateNetWorth())}
                  </p>

                  <p>
                    <span className="font-semibold">Currency:</span>{' '}
                    {result.currency || formData.currency}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default ZakatCalculator;