"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useFIFOAndLIFOCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FIFOAndLIFOCalculator = () => {
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

  // FIFO LIFO specific state
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, date: "", quantity: "", unitCost: "" },
  ]);

  const [soldQuantity, setSoldQuantity] = useState("");
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateFIFOLIFO,
    { isLoading: calculationLoading, isError, error: calculateError },
  ] = useFIFOAndLIFOCalculatorMutation();

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

  // Add new inventory item
  const addInventoryItem = () => {
    const newItem = {
      id: Date.now(),
      date: "",
      quantity: "",
      unitCost: "",
    };
    setInventoryItems([...inventoryItems, newItem]);
  };

  // Remove inventory item
  const removeInventoryItem = (id) => {
    if (inventoryItems.length > 1) {
      setInventoryItems(inventoryItems.filter((item) => item.id !== id));
    }
  };

  // Update inventory item
  const updateInventoryItem = (id, field, value) => {
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calculate FIFO
  const calculateFIFO = (items, soldQty) => {
    const sortedItems = [...items].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let remainingToSell = soldQty;
    let totalCost = 0;
    const itemsUsed = [];

    for (const item of sortedItems) {
      if (remainingToSell <= 0) break;

      const availableQty = parseFloat(item.quantity);
      const usedQty = Math.min(remainingToSell, availableQty);
      const cost = usedQty * parseFloat(item.unitCost);

      totalCost += cost;
      remainingToSell -= usedQty;

      itemsUsed.push({
        date: item.date,
        quantity: usedQty,
        unitCost: parseFloat(item.unitCost),
        totalCost: cost,
      });
    }

    return { totalCost, itemsUsed, method: "FIFO" };
  };

  // Calculate LIFO
  const calculateLIFO = (items, soldQty) => {
    const sortedItems = [...items].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    let remainingToSell = soldQty;
    let totalCost = 0;
    const itemsUsed = [];

    for (const item of sortedItems) {
      if (remainingToSell <= 0) break;

      const availableQty = parseFloat(item.quantity);
      const usedQty = Math.min(remainingToSell, availableQty);
      const cost = usedQty * parseFloat(item.unitCost);

      totalCost += cost;
      remainingToSell -= usedQty;

      itemsUsed.push({
        date: item.date,
        quantity: usedQty,
        unitCost: parseFloat(item.unitCost),
        totalCost: cost,
      });
    }

    return { totalCost, itemsUsed, method: "LIFO" };
  };

  // Validate form
  const validateForm = () => {
    // Check if all inventory items are filled
    for (const item of inventoryItems) {
      if (!item.date || !item.quantity || !item.unitCost) {
        return false;
      }
      if (parseFloat(item.quantity) <= 0 || parseFloat(item.unitCost) <= 0) {
        return false;
      }
    }

    // Check sold quantity
    if (!soldQuantity || parseFloat(soldQuantity) <= 0) {
      return false;
    }

    // Check if sold quantity exceeds total inventory
    const totalInventory = inventoryItems.reduce(
      (sum, item) => sum + (parseFloat(item.quantity) || 0),
      0
    );

    if (parseFloat(soldQuantity) > totalInventory) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError(
        "Please fill in all fields correctly. Sold quantity cannot exceed total inventory."
      );
      return;
    }

    setFormError("");

    try {
      const soldQty = parseFloat(soldQuantity);

      // Calculate both methods locally
      const fifoResult = calculateFIFO(inventoryItems, soldQty);
      const lifoResult = calculateLIFO(inventoryItems, soldQty);

      const totalInventoryValue = inventoryItems.reduce(
        (sum, item) =>
          sum + parseFloat(item.quantity) * parseFloat(item.unitCost),
        0
      );

      const totalInventoryQuantity = inventoryItems.reduce(
        (sum, item) => sum + parseFloat(item.quantity),
        0
      );

      const calculationResult = {
        fifo: fifoResult,
        lifo: lifoResult,
        soldQuantity: soldQty,
        totalInventoryValue,
        totalInventoryQuantity,
        difference: Math.abs(fifoResult.totalCost - lifoResult.totalCost),
        recommendations: {
          lowerCost:
            fifoResult.totalCost < lifoResult.totalCost ? "FIFO" : "LIFO",
          higherCost:
            fifoResult.totalCost > lifoResult.totalCost ? "FIFO" : "LIFO",
        },
      };

      setResult(calculationResult);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setInventoryItems([{ id: 1, date: "", quantity: "", unitCost: "" }]);
    setSoldQuantity("");
    setResult(null);
    setFormError(null);
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
      <div className="row">
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          {/* Inventory Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                {data?.payload?.tech_lang_keys["inventory_purchases"] ||
                  "Inventory Purchases"}
              </h3>
              <button
                type="button"
                onClick={addInventoryItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
              >
                + {data?.payload?.tech_lang_keys["add_item"] || "Add Item"}
              </button>
            </div>

            {inventoryItems.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    {data?.payload?.tech_lang_keys["purchase"] || "Purchase"} #
                    {index + 1}
                  </h4>
                  {inventoryItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInventoryItem(item.id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 text-sm cursor-pointer"
                    >
                      ✕ {data?.payload?.tech_lang_keys["remove"] || "Remove"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {data?.payload?.tech_lang_keys["purchase_date"] ||
                        "Purchase Date"}
                    </label>
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) =>
                        updateInventoryItem(item.id, "date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {data?.payload?.tech_lang_keys["quantity"] || "Quantity"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Enter quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        updateInventoryItem(item.id, "quantity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {data?.payload?.tech_lang_keys["unit_cost"] ||
                        "Unit Cost"}{" "}
                      ({currency.symbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter unit cost"
                      value={item.unitCost}
                      onChange={(e) =>
                        updateInventoryItem(item.id, "unitCost", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sold Quantity Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {data?.payload?.tech_lang_keys["sale_information"] ||
                "Sale Information"}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {data?.payload?.tech_lang_keys["quantity_sold"] ||
                  "Quantity Sold"}
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter quantity sold"
                value={soldQuantity}
                onChange={(e) => setSoldQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button
              type="submit"
              isLoading={calculationLoading}
              onClick={handleSubmit}
            >
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

        {/* Results Section */}
        {calculationLoading ? (
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  {/* FIFO & LIFO Results */}
                  <div className="mt-6 space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {data?.payload?.tech_lang_keys["calculation_results"] ||
                        "Calculation Results"}
                    </h3>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 text-lg mb-2">
                          FIFO {data?.payload?.tech_lang_keys["cost"] || "Cost"}
                        </h4>
                        <p className="text-3xl font-bold text-green-700 mb-2">
                          {currency.symbol}
                          {result.fifo.totalCost.toFixed(2)}
                        </p>
                        <p className="text-sm text-green-600">
                          {data?.payload?.tech_lang_keys[
                            "first_in_first_out"
                          ] || "First In, First Out"}
                        </p>
                      </div>

                      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 text-lg mb-2">
                          LIFO {data?.payload?.tech_lang_keys["cost"] || "Cost"}
                        </h4>
                        <p className="text-3xl font-bold text-blue-700 mb-2">
                          {currency.symbol}
                          {result.lifo.totalCost.toFixed(2)}
                        </p>
                        <p className="text-sm text-blue-600">
                          {data?.payload?.tech_lang_keys["last_in_first_out"] ||
                            "Last In, First Out"}
                        </p>
                      </div>
                    </div>

                    {/* Comparison */}
                    <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
                      <h4 className="font-semibold text-yellow-800 text-lg mb-2">
                        {data?.payload?.tech_lang_keys["cost_difference"] ||
                          "Cost Difference"}
                      </h4>
                      <p className="text-2xl font-bold text-yellow-700 mb-2">
                        {currency.symbol}
                        {result.difference.toFixed(2)}
                      </p>
                      <p className="text-sm text-yellow-600">
                        {result.recommendations.lowerCost} method results in
                        lower cost of goods sold
                      </p>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-gray-800">
                        {data?.payload?.tech_lang_keys["detailed_breakdown"] ||
                          "Detailed Breakdown"}
                      </h4>

                      {/* FIFO Breakdown */}
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-3 text-lg">
                          FIFO Items Used:
                        </h5>
                        <div className="space-y-2">
                          {result.fifo.itemsUsed.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white p-3 rounded border border-green-100"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-green-700 font-medium">
                                  {item.date}: {item.quantity} units @{" "}
                                  {currency.symbol}
                                  {item.unitCost}
                                </span>
                                <span className="text-green-800 font-bold">
                                  {currency.symbol}
                                  {item.totalCost.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex justify-between items-center">
                            <span className="text-green-800 font-bold text-lg">
                              Total FIFO Cost:
                            </span>
                            <span className="text-green-800 font-bold text-xl">
                              {currency.symbol}
                              {result.fifo.totalCost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* LIFO Breakdown */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-3 text-lg">
                          LIFO Items Used:
                        </h5>
                        <div className="space-y-2">
                          {result.lifo.itemsUsed.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white p-3 rounded border border-blue-100"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-blue-700 font-medium">
                                  {item.date}: {item.quantity} units @{" "}
                                  {currency.symbol}
                                  {item.unitCost}
                                </span>
                                <span className="text-blue-800 font-bold">
                                  {currency.symbol}
                                  {item.totalCost.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-800 font-bold text-lg">
                              Total LIFO Cost:
                            </span>
                            <span className="text-blue-800 font-bold text-xl">
                              {currency.symbol}
                              {result.lifo.totalCost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Statistics */}
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">
                        {data?.payload?.tech_lang_keys["inventory_summary"] ||
                          "Inventory Summary"}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-gray-600 text-sm mb-1">
                            Total Inventory
                          </p>
                          <p className="font-bold text-lg text-gray-800">
                            {result.totalInventoryQuantity} units
                          </p>
                        </div>
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-gray-600 text-sm mb-1">
                            Total Value
                          </p>
                          <p className="font-bold text-lg text-gray-800">
                            {currency.symbol}
                            {result.totalInventoryValue.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-gray-600 text-sm mb-1">
                            Quantity Sold
                          </p>
                          <p className="font-bold text-lg text-gray-800">
                            {result.soldQuantity} units
                          </p>
                        </div>
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-gray-600 text-sm mb-1">
                            Remaining
                          </p>
                          <p className="font-bold text-lg text-gray-800">
                            {result.totalInventoryQuantity -
                              result.soldQuantity}{" "}
                            units
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Method Explanation */}
                    <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">
                        {data?.payload?.tech_lang_keys["about_methods"] ||
                          "About FIFO & LIFO Methods"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h5 className="font-semibold text-green-800 mb-2">
                            {" "}
                            FIFO Method
                          </h5>
                          <p className="text-green-700 text-sm leading-relaxed">
                            First In, First Out assumes that the oldest
                            inventory items are sold first. This method is ideal
                            for businesses with perishable goods and typically
                            shows higher profits during inflationary periods.
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h5 className="font-semibold text-blue-800 mb-2">
                            {" "}
                            LIFO Method
                          </h5>
                          <p className="text-blue-700 text-sm leading-relaxed">
                            Last In, First Out assumes that the newest inventory
                            items are sold first. This method can provide tax
                            advantages during inflationary periods by showing
                            lower profits and reducing tax liability.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h5 className="font-semibold text-yellow-800 mb-2">
                          {" "}
                          Recommendation
                        </h5>
                        <p className="text-yellow-700 text-sm">
                          <strong>{result.recommendations.lowerCost}</strong>{" "}
                          method provides lower cost of goods sold in this
                          scenario. In periods of rising prices, FIFO typically
                          shows higher profits but also higher taxes, while LIFO
                          shows lower profits and potential tax savings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default FIFOAndLIFOCalculator;
