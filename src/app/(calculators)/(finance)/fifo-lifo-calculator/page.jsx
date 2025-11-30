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
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const FIFOAndLIFOCalculator = () => {
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

  //----------------------------------------------------------
  // 🔥 FORM DATA (Dynamic Rows)
  //----------------------------------------------------------
  const [formData, setFormData] = useState({
    method: "lifo",
    purchases: [
      { unit: "10", price: "150" },
      { unit: "15", price: "100" },
      { unit: "25", price: "200" },
    ],
    total_units_sold: 35,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [CatAgeCalculator, { isLoading: calculationLoading }] =
    useFIFOAndLIFOCalculatorMutation();

  //----------------------------------------------------------
  // 🔥 Handle Purchase Row Change
  //----------------------------------------------------------
  const handlePurchaseChange = (index, field, value) => {
    const updated = [...formData.purchases];
    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      purchases: updated,
    }));

    setResult(null);
  };

  //----------------------------------------------------------
  // 🔥 ADD ROW
  //----------------------------------------------------------
  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      purchases: [...prev.purchases, { unit: "", price: "" }],
    }));
  };

  //----------------------------------------------------------
  // 🔥 REMOVE ROW (Minimum 1 required)
  //----------------------------------------------------------
  const removeRow = (index) => {
    if (formData.purchases.length === 1) {
      toast.error("At least one row is required.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      purchases: prev.purchases.filter((_, i) => i !== index),
    }));
  };

  //----------------------------------------------------------
  // 🔥 SUBMIT FORM → API
  //----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const units = formData.purchases.map((p) => p.unit);
    const prices = formData.purchases.map((p) => p.price);

    try {
      const response = await CatAgeCalculator({
        method: formData.method,
        no_of_purchases_unit: units,
        no_of_purchases_unit_price: prices,
        total_units_sold: formData.total_units_sold,
      }).unwrap();

      setResult(response?.payload);
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err?.data?.payload?.error || "Error occurred");
      toast.error(err?.data?.payload?.error || "Error occurred");
    }
  };

  //----------------------------------------------------------
  // 🔥 RESET FORM
  //----------------------------------------------------------
  const handleReset = () => {
    setFormData({
      method: "fifo",
      purchases: [{ unit: "", price: "" }],
      total_units_sold: "",
    });

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
          path: "/" + data?.payload?.tech_cal_cat,
        },
        {
          name: data?.payload?.tech_calculator_title,
          path: pathname,
        },
      ]}
    >
      <div className="row">
        <div className="w-full mx-auto p-4 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          {/* MAIN FORM */}
          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-4 mt-5">
              {/* Method */}
              <div className="col-span-6">
                <label className="label">Method</label>
                <select
                  className="input my-2"
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  <option value="fifo">FIFO</option>
                  <option value="lifo">LIFO</option>
                </select>
              </div>

              {/* Total Units Sold */}
              <div className="col-span-6">
                <label className="label">Total Units Sold</label>
                <input
                  type="number"
                  className="input my-2"
                  value={formData.total_units_sold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_units_sold: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* 🔥 Dynamic Rows */}
            <div className="mt-6 grid grid-cols-12 gap-4">
              <p className="col-span-12">
                {data?.payload?.tech_lang_keys["nbr_of"]}
              </p>
              {formData.purchases.map((item, index) => (
                <div
                  key={index}
                  className="col-span-12 grid grid-cols-12 gap-3 items-end"
                >
                  {/* Units */}
                  <div className="col-span-6">
                    <label className="label">Units</label>
                    <input
                      type="number"
                      className="input my-2"
                      value={item.unit}
                      onChange={(e) =>
                        handlePurchaseChange(index, "unit", e.target.value)
                      }
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-6">
                    <div className="flex justify-between">
                      <div>
                        {" "}
                        <label className="label">Price</label>
                      </div>
                      <div>
                        {" "}
                        <img
                          onClick={() => removeRow(index)}
                          src="/belete_btn.png"
                          alt="Ending Inventory Value"
                          className="w-4"
                        />
                      </div>
                    </div>
                    <input
                      type="number"
                      className="input my-2"
                      value={item.price}
                      onChange={(e) =>
                        handlePurchaseChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              {/* Add Row Button */}
              <div className="col-span-12 mt-3">
                <button
                  type="button"
                  className="px-4 py-2 cursor-pointer bg-[#2845F5] text-[#fff] hover:bg-[#2f45da] rounded-lg hover:text-white  transition text-sm"
                  onClick={addRow}
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button
              type="submit"
              isLoading={calculationLoading}
              onClick={handleSubmit}
            >
              Calculate
            </Button>

            {result && (
              <ResetButton type="button" onClick={handleReset}>
                RESET
              </ResetButton>
            )}
          </div>
        </div>

        {/* RESULTS */}
        {result && (
          <div className="w-full result_calculator md:px-6 px-4 py-6 rounded-lg ">
            <ResultActions lang={data?.payload?.tech_lang_keys} />

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 my-4">
              {/* Cost of Goods Purchased */}
              <div className="bg-white md:p-4 p-1 rounded-xl shadow flex items-center gap-4">
                <img
                  src="/images/purch.webp"
                  alt="Cost of Goods Purchased"
                  className="w-20 h-20"
                />
                <div>
                  <p className="font-semibold text-lg">
                    Cost of Goods Purchased
                  </p>
                  <p className="font-bold text-[#2845F5] text-2xl">
                    {result.summary?.cost_of_goods_purchased}
                  </p>
                </div>
              </div>

              {/* Cost of Goods Sold */}
              <div className="bg-white md:p-4 p-1 rounded-xl shadow flex items-center gap-4">
                <img
                  src="/images/sold.webp"
                  alt="Cost of Goods Sold"
                  className="w-20 h-20"
                />
                <div>
                  <p className="font-semibold text-lg">
                    Cost of Goods Sold (COGS)
                  </p>
                  <p className="font-bold text-[#2845F5] text-2xl">
                    {result.summary?.cost_of_goods_sold}
                  </p>
                </div>
              </div>

              {/* Ending Inventory */}
              <div className="bg-white md:p-4 p-1 rounded-xl shadow flex items-center gap-4">
                <img
                  src="/images/inventory.webp"
                  alt="Ending Inventory Value"
                  className="w-20 h-20"
                />
                <div>
                  <p className="font-semibold text-lg">
                    Ending Inventory Value
                  </p>
                  <p className="font-bold text-[#2845F5] text-2xl">
                    {result.summary?.ending_inventory_value}
                  </p>
                </div>
              </div>
            </div>

            {/* METHOD TITLE */}
            <p className="text-xl font-bold my-4">
              Method Used:{" "}
              <span className="uppercase text-blue-600">{result.method}</span>
            </p>

            {/* DATA TABLE */}
            <div className="overflow-auto bordered  shadow mt-3">
              <table className="w-full text-left text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-2">SR. No.</th>
                    <th className="p-2">Units Purchased</th>
                    <th className="p-2">Price per Unit</th>
                    <th className="p-2">Cost of Goods Purchased</th>
                    <th className="p-2">Units Sold</th>
                    <th className="p-2">Units Remaining</th>
                    <th className="p-2">COGS</th>
                    <th className="p-2">Inventory Value</th>
                  </tr>
                </thead>

                <tbody>
                  {result.details?.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{row.sr_no}</td>
                      <td className="p-2">{row.units_purchased}</td>
                      <td className="p-2">{row.price_per_unit}</td>
                      <td className="p-2">{row.cost_of_goods_purchased}</td>
                      <td className="p-2">{row.units_sold}</td>
                      <td className="p-2">{row.units_remaining}</td>
                      <td className="p-2">{row.cogs}</td>
                      <td className="p-2">{row.inventory_value}</td>
                    </tr>
                  ))}

                  {/* TOTAL ROW */}
                  <tr className="bg-gray-300 font-semibold">
                    <td className="p-2">Total</td>
                    <td className="p-2">
                      {result.totals?.total_units_purchased}
                    </td>
                    <td className="p-2">—</td>
                    <td className="p-2">
                      {result.totals?.total_cost_of_goods_purchased}
                    </td>
                    <td className="p-2">{result.totals?.total_units_sold}</td>
                    <td className="p-2">
                      {result.totals?.total_units_remaining}
                    </td>
                    <td className="p-2">{result.totals?.total_cogs}</td>
                    <td className="p-2">
                      {result.totals?.total_inventory_value}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default FIFOAndLIFOCalculator;
