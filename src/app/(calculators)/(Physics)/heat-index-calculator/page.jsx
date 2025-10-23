"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHeatIndexCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HeatIndexCalculator = () => {
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
    tech_find: "1", // 1 2 3
    tech_temp: "32",
    tech_temp_unit: "°C",
    tech_hum: "32",
    tech_hum_unit: "‱",
    tech_dew_point: "32",
    tech_dew_point_unit: "°K",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHeatIndexCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_temp: formData.tech_temp,
        tech_temp_unit: formData.tech_temp_unit,
        tech_hum: formData.tech_hum,
        tech_hum_unit: formData.tech_hum_unit,
        tech_dew_point: formData.tech_dew_point,
        tech_dew_point_unit: formData.tech_dew_point_unit,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_find: "1", // 1 2 3
      tech_temp: "32",
      tech_temp_unit: "°C",
      tech_hum: "32",
      tech_hum_unit: "‱",
      tech_dew_point: "32",
      tech_dew_point_unit: "°K",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_temp_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hum_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dew_point_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  // result

  const styles = {};
  for (let i = 0; i <= 208; i++) {
    styles["d" + i] = null;
  }

  // Variables for comparison (example names)
  const techHumm = Number(result?.tech_humm); // convert to number for proper comparison
  const ansNum = Number(result?.tech_ans); // assuming ans is available similarly

  if (techHumm <= 40 && ansNum < 81) {
    styles.d1 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 81 && ansNum < 83) {
    styles.d2 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 83 && ansNum < 85) {
    styles.d3 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 85 && ansNum < 88) {
    styles.d4 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 88 && ansNum < 90) {
    styles.d5 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 90 && ansNum < 92) {
    styles.d6 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 92 && ansNum < 94) {
    styles.d7 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 94 && ansNum < 96) {
    styles.d8 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 96 && ansNum < 98) {
    styles.d9 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 98 && ansNum < 100) {
    styles.d10 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 100 && ansNum < 102) {
    styles.d11 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 102 && ansNum < 104) {
    styles.d12 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 104 && ansNum < 106) {
    styles.d13 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 106 && ansNum < 108) {
    styles.d14 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 108 && ansNum < 110) {
    styles.d15 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm <= 40 && techHumm < 43 && ansNum >= 110) {
    styles.d16 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum < 81) {
    styles.d17 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 81 && ansNum < 83) {
    styles.d18 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 83 && ansNum < 85) {
    styles.d19 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 85 && ansNum < 88) {
    styles.d20 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 88 && ansNum < 90) {
    styles.d21 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 90 && ansNum < 92) {
    styles.d22 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 92 && ansNum < 94) {
    styles.d23 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 94 && ansNum < 96) {
    styles.d24 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 96 && ansNum < 98) {
    styles.d25 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 98 && ansNum < 100) {
    styles.d26 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 100 && ansNum < 102) {
    styles.d27 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 102 && ansNum < 104) {
    styles.d28 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 104 && ansNum < 106) {
    styles.d29 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 106 && ansNum < 108) {
    styles.d30 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 108 && ansNum < 110) {
    styles.d31 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 43 && techHumm < 48 && ansNum >= 110) {
    styles.d32 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum < 81) {
    styles.d33 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 81 && ansNum < 83) {
    styles.d34 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 83 && ansNum < 85) {
    styles.d35 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 85 && ansNum < 88) {
    styles.d36 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 88 && ansNum < 90) {
    styles.d37 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 90 && ansNum < 92) {
    styles.d38 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 92 && ansNum < 94) {
    styles.d39 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 94 && ansNum < 96) {
    styles.d40 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 96 && ansNum < 98) {
    styles.d41 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 98 && ansNum < 100) {
    styles.d42 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 100 && ansNum < 102) {
    styles.d43 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 102 && ansNum < 104) {
    styles.d44 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 104 && ansNum < 106) {
    styles.d45 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 106 && ansNum < 108) {
    styles.d46 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 108 && ansNum < 110) {
    styles.d47 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 48 && techHumm < 53 && ansNum >= 110) {
    styles.d48 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum <= 81) {
    styles.d49 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 81 && ansNum < 83) {
    styles.d50 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 83 && ansNum < 85) {
    styles.d51 = { border: "3px dashed #000", fontWeight: 600 };
  }

  if (techHumm >= 53 && techHumm < 58 && ansNum >= 85 && ansNum < 88) {
    styles.d52 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 88 && ansNum < 90) {
    styles.d53 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 90 && ansNum < 92) {
    styles.d54 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 92 && ansNum < 94) {
    styles.d55 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 94 && ansNum < 96) {
    styles.d56 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 96 && ansNum < 98) {
    styles.d57 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 98 && ansNum < 100) {
    styles.d58 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 100 && ansNum < 102) {
    styles.d59 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 102 && ansNum < 104) {
    styles.d60 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 104 && ansNum < 106) {
    styles.d61 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 106 && ansNum < 108) {
    styles.d62 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 108 && ansNum < 110) {
    styles.d63 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 53 && techHumm < 58 && ansNum >= 110) {
    styles.d64 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum < 81) {
    styles.d65 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 81 && ansNum < 83) {
    styles.d66 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 83 && ansNum < 85) {
    styles.d67 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 85 && ansNum < 88) {
    styles.d68 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 88 && ansNum < 90) {
    styles.d69 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 90 && ansNum < 92) {
    styles.d70 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 92 && ansNum < 94) {
    styles.d71 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 94 && ansNum < 96) {
    styles.d72 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 96 && ansNum < 98) {
    styles.d73 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 98 && ansNum < 100) {
    styles.d74 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 100 && ansNum < 102) {
    styles.d75 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 102 && ansNum < 104) {
    styles.d76 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 104 && ansNum < 106) {
    styles.d77 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 106 && ansNum < 108) {
    styles.d78 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 108 && ansNum < 110) {
    styles.d79 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 58 && techHumm < 63 && ansNum >= 110) {
    styles.d80 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum <= 81) {
    styles.d81 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 81 && ansNum < 83) {
    styles.d82 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 83 && ansNum < 85) {
    styles.d83 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 85 && ansNum < 88) {
    styles.d84 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 88 && ansNum < 90) {
    styles.d85 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 90 && ansNum < 92) {
    styles.d86 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 92 && ansNum < 94) {
    styles.d87 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 94 && ansNum < 96) {
    styles.d88 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 96 && ansNum < 98) {
    styles.d89 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 98 && ansNum < 100) {
    styles.d90 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 100 && ansNum < 102) {
    styles.d91 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 102 && ansNum < 104) {
    styles.d92 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 104 && ansNum < 106) {
    styles.d93 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 106 && ansNum < 108) {
    styles.d94 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 108 && ansNum < 110) {
    styles.d95 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 63 && techHumm < 68 && ansNum >= 110) {
    styles.d96 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum <= 81) {
    styles.d97 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 81 && ansNum < 83) {
    styles.d98 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 83 && ansNum < 85) {
    styles.d99 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 85 && ansNum < 88) {
    styles.d100 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 88 && ansNum < 90) {
    styles.d101 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 90 && ansNum < 92) {
    styles.d102 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 92 && ansNum < 94) {
    styles.d103 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 94 && ansNum < 96) {
    styles.d104 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 96 && ansNum < 98) {
    styles.d105 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 98 && ansNum < 100) {
    styles.d106 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 100 && ansNum < 102) {
    styles.d107 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 102 && ansNum < 104) {
    styles.d108 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 104 && ansNum < 106) {
    styles.d109 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 106 && ansNum < 108) {
    styles.d110 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 108 && ansNum < 110) {
    styles.d111 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 68 && techHumm < 73 && ansNum >= 110) {
    styles.d112 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum < 81) {
    styles.d113 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 81 && ansNum < 83) {
    styles.d114 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 83 && ansNum < 85) {
    styles.d115 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 85 && ansNum < 88) {
    styles.d116 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 88 && ansNum < 90) {
    styles.d117 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 90 && ansNum < 92) {
    styles.d118 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 92 && ansNum < 94) {
    styles.d119 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 94 && ansNum < 96) {
    styles.d120 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 96 && ansNum < 98) {
    styles.d121 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 98 && ansNum < 100) {
    styles.d122 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 100 && ansNum < 102) {
    styles.d123 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 102 && ansNum < 104) {
    styles.d124 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 104 && ansNum < 106) {
    styles.d125 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 106 && ansNum < 108) {
    styles.d126 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 108 && ansNum < 110) {
    styles.d127 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 73 && techHumm < 78 && ansNum >= 110) {
    styles.d128 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum < 81) {
    styles.d129 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 81 && ansNum < 83) {
    styles.d130 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 83 && ansNum < 85) {
    styles.d131 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 85 && ansNum < 88) {
    styles.d132 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 88 && ansNum < 90) {
    styles.d133 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 90 && ansNum < 92) {
    styles.d134 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 92 && ansNum < 94) {
    styles.d135 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 94 && ansNum < 96) {
    styles.d136 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 96 && ansNum < 98) {
    styles.d137 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 98 && ansNum < 100) {
    styles.d138 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 100 && ansNum < 102) {
    styles.d139 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 102 && ansNum < 104) {
    styles.d140 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 104 && ansNum < 106) {
    styles.d141 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 106 && ansNum < 108) {
    styles.d142 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 108 && ansNum < 110) {
    styles.d143 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum >= 110) {
    styles.d144 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 78 && techHumm < 83 && ansNum < 81) {
    styles.d145 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 81 && ansNum < 83) {
    styles.d146 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 83 && ansNum < 85) {
    styles.d147 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 85 && ansNum < 88) {
    styles.d148 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 88 && ansNum < 90) {
    styles.d149 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 90 && ansNum < 92) {
    styles.d150 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 92 && ansNum < 94) {
    styles.d151 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 94 && ansNum < 96) {
    styles.d152 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 96 && ansNum < 98) {
    styles.d153 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 98 && ansNum < 100) {
    styles.d154 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 100 && ansNum < 102) {
    styles.d155 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 102 && ansNum < 104) {
    styles.d156 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 104 && ansNum < 106) {
    styles.d157 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 106 && ansNum < 108) {
    styles.d158 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 108 && ansNum < 110) {
    styles.d159 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 83 && techHumm < 88 && ansNum >= 110) {
    styles.d160 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum < 81) {
    styles.d161 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 81 && ansNum < 83) {
    styles.d162 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 83 && ansNum < 85) {
    styles.d163 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 85 && ansNum < 88) {
    styles.d164 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 88 && ansNum < 90) {
    styles.d165 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 90 && ansNum < 92) {
    styles.d166 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 92 && ansNum <= 94) {
    styles.d167 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 94 && ansNum < 96) {
    styles.d168 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 96 && ansNum < 98) {
    styles.d169 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 98 && ansNum < 100) {
    styles.d170 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 100 && ansNum < 102) {
    styles.d171 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 102 && ansNum < 104) {
    styles.d172 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 104 && ansNum < 106) {
    styles.d173 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 106 && ansNum < 108) {
    styles.d174 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 108 && ansNum < 110) {
    styles.d175 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 88 && techHumm < 93 && ansNum >= 110) {
    styles.d176 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum <= 81) {
    styles.d177 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 81 && ansNum < 83) {
    styles.d178 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 83 && ansNum < 85) {
    styles.d179 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 85 && ansNum < 88) {
    styles.d180 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 88 && ansNum < 90) {
    styles.d181 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 90 && ansNum < 92) {
    styles.d182 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 92 && ansNum < 94) {
    styles.d183 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 94 && ansNum < 96) {
    styles.d184 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 96 && ansNum < 98) {
    styles.d185 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 98 && ansNum < 100) {
    styles.d186 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 100 && ansNum < 102) {
    styles.d187 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 102 && ansNum < 104) {
    styles.d188 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 104 && ansNum < 106) {
    styles.d189 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 106 && ansNum < 108) {
    styles.d190 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 108 && ansNum < 110) {
    styles.d191 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 93 && techHumm < 98 && ansNum >= 110) {
    styles.d192 = { border: "3px dashed #000", fontWeight: 600 };
  }

  // techHumm >= 98
  if (techHumm >= 98 && ansNum < 81) {
    styles.d193 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 81 && ansNum < 83) {
    styles.d194 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 83 && ansNum < 85) {
    styles.d195 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 85 && ansNum < 88) {
    styles.d196 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 88 && ansNum < 90) {
    styles.d197 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 90 && ansNum < 92) {
    styles.d198 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 92 && ansNum < 94) {
    styles.d199 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 94 && ansNum < 96) {
    styles.d200 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 96 && ansNum < 98) {
    styles.d201 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 98 && ansNum < 100) {
    styles.d202 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 100 && ansNum < 102) {
    styles.d203 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 102 && ansNum < 104) {
    styles.d204 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 104 && ansNum < 106) {
    styles.d205 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 106 && ansNum < 108) {
    styles.d206 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 108 && ansNum < 110) {
    styles.d207 = { border: "3px dashed #000", fontWeight: 600 };
  }
  if (techHumm >= 98 && ansNum >= 110) {
    styles.d208 = { border: "3px dashed #000", fontWeight: 600 };
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
            <div className="grid grid-cols-12  gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_find" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_find"
                    id="tech_find"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]} &{" "}
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["4"]} &{" "}
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["6"]} &{" "}
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_find == "1" || formData.tech_find == "2") && (
                <>
                  <div className="md:col-span-6 col-span-12 at">
                    <label htmlFor="tech_temp" className="label">
                      {data?.payload?.tech_lang_keys["4"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_temp"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_temp}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_temp_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "°K", value: "°K" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_find == "1" || formData.tech_find == "3") && (
                <>
                  <div className="md:col-span-6 col-span-12 rh">
                    <label htmlFor="tech_hum" className="label">
                      {data?.payload?.tech_lang_keys["3"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_hum"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_hum}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_hum_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "%", value: "%" },
                            { label: "‰", value: "‰" },
                            { label: "‱", value: "‱" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler1(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_find == "2" || formData.tech_find == "3") && (
                <>
                  <div className="md:col-span-6 col-span-12  dp">
                    <label htmlFor="tech_dew_point" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_dew_point"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_dew_point}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_dew_point_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "°C", value: "°C" },
                            { label: "°F", value: "°F" },
                            { label: "°K", value: "°K" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler2(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full p-3 radius-10 mt-3 ">
                      <div className="w-full overfow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(
                                  (result?.tech_hi - 32) * (5 / 9)
                                ).toFixed(2)}{" "}
                                (<sup>o</sup>C)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(result?.tech_hi).toFixed(2)} (
                                <sup>o</sup>F)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {Number(
                                  (result?.tech_hi - 32) * (5 / 9) + 273
                                ).toFixed(2)}{" "}
                                (<sup>o</sup>K)
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full  mt-2 my-3 overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            {result?.tech_dp !== undefined &&
                              result?.tech_dp !== null &&
                              !isNaN(result?.tech_dp) && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[5]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result.tech_dp).toFixed(2)}{" "}
                                    <sup>o</sup> (C)
                                  </td>
                                </tr>
                              )}

                            {result?.tech_hum !== undefined &&
                              result?.tech_hum !== null &&
                              !isNaN(result?.tech_hum) && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[3]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result.tech_hum).toFixed(2)} (%)
                                  </td>
                                </tr>
                              )}

                            {result?.tech_temp !== undefined &&
                              result?.tech_temp !== null &&
                              !isNaN(result?.tech_temp) && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[8]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(
                                      (result.tech_temp * 9) / 5 + 32
                                    ).toFixed(2)}{" "}
                                    (<sup>o</sup>F) /{" "}
                                    {Number(result.tech_temp).toFixed(2)} (
                                    <sup>o</sup>C)
                                  </td>
                                </tr>
                              )}

                            {result?.tech_ans !== undefined &&
                              result?.tech_ans !== null &&
                              !isNaN(result?.tech_ans) && (
                                <tr>
                                  <td className="py-2 border-b" width="50%">
                                    <strong>α(T,RH)</strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {Number(result.tech_ans).toFixed(2)}
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full overflow-auto">
                        <p className="center  ">
                          Heat Index Chart (Apparent Temperature)
                        </p>
                        <div className="dk o overflow-auto">
                          <table className="table tablesx w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td rowSpan="2" className="p nela">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]} (°F)
                                  </strong>
                                </td>
                                <td colspan="13" className="p nela">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["6"]} (%)
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="nela">40</td>
                                <td className="nela">45</td>
                                <td className="nela">50</td>
                                <td className="nela">55</td>
                                <td className="nela">60</td>
                                <td className="nela">65</td>
                                <td className="nela">70</td>
                                <td className="nela">75</td>
                                <td className="nela">80</td>
                                <td className="nela">85</td>
                                <td className="nela">90</td>
                                <td className="nela">95</td>
                                <td className="nela">100</td>
                              </tr>
                              <tr>
                                <td className="p nela">110</td>
                                <td
                                  className="rc white-text"
                                  style={styles.d16}
                                >
                                  136
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d32}
                                >
                                  143
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d48}
                                >
                                  152
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d64}
                                >
                                  161
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d80}
                                >
                                  171
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d96}
                                >
                                  182
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d112}
                                >
                                  194
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d128}
                                >
                                  206
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d144}
                                >
                                  219
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d160}
                                >
                                  233
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d176}
                                >
                                  247
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d192}
                                >
                                  262
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d208}
                                >
                                  278
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">108</td>
                                <td
                                  className="rc white-text"
                                  style={styles.d15}
                                >
                                  130
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d31}
                                >
                                  137
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d47}
                                >
                                  144
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d63}
                                >
                                  153
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d79}
                                >
                                  162
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d95}
                                >
                                  172
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d111}
                                >
                                  182
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d127}
                                >
                                  193
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d143}
                                >
                                  205
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d159}
                                >
                                  218
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d175}
                                >
                                  231
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d191}
                                >
                                  245
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d207}
                                >
                                  260
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">106</td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d14}
                                >
                                  124
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d30}
                                >
                                  130
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d46}
                                >
                                  137
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d62}
                                >
                                  145
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d78}
                                >
                                  153
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d94}
                                >
                                  162
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d110}
                                >
                                  172
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d126}
                                >
                                  182
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d142}
                                >
                                  193
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d158}
                                >
                                  204
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d174}
                                >
                                  216
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d190}
                                >
                                  229
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d206}
                                >
                                  243
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">104</td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d13}
                                >
                                  119
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d29}
                                >
                                  124
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d45}
                                >
                                  131
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d61}
                                >
                                  137
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d77}
                                >
                                  145
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d93}
                                >
                                  153
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d109}
                                >
                                  161
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d125}
                                >
                                  171
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d141}
                                >
                                  181
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d157}
                                >
                                  191
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d173}
                                >
                                  202
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d189}
                                >
                                  214
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d205}
                                >
                                  226
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">102</td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d12}
                                >
                                  114
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d28}
                                >
                                  119
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d44}
                                >
                                  124
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d60}
                                >
                                  130
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d76}
                                >
                                  137
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d92}
                                >
                                  144
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d108}
                                >
                                  152
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d124}
                                >
                                  160
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d140}
                                >
                                  169
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d156}
                                >
                                  179
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d172}
                                >
                                  189
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d188}
                                >
                                  199
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d204}
                                >
                                  210
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">100</td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d11}
                                >
                                  109
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d27}
                                >
                                  114
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d43}
                                >
                                  118
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d59}
                                >
                                  124
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d75}
                                >
                                  129
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d91}
                                >
                                  136
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d107}
                                >
                                  143
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d123}
                                >
                                  150
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d139}
                                >
                                  158
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d155}
                                >
                                  167
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d171}
                                >
                                  176
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d187}
                                >
                                  185
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d203}
                                >
                                  195
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">98</td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d10}
                                >
                                  105
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d26}
                                >
                                  109
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d42}
                                >
                                  113
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d58}
                                >
                                  117
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d74}
                                >
                                  123
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d90}
                                >
                                  128
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d106}
                                >
                                  134
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d122}
                                >
                                  141
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d138}
                                >
                                  148
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d154}
                                >
                                  156
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d170}
                                >
                                  164
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d186}
                                >
                                  172
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d202}
                                >
                                  181
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">96</td>
                                <td className="kc" style={styles.d9}>
                                  101
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d25}
                                >
                                  104
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d41}
                                >
                                  108
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d57}
                                >
                                  112
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d73}
                                >
                                  116
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d89}
                                >
                                  121
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d105}
                                >
                                  126
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d121}
                                >
                                  132
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d137}
                                >
                                  138
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d153}
                                >
                                  145
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d169}
                                >
                                  152
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d185}
                                >
                                  160
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d191}
                                >
                                  168
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">94</td>
                                <td className="kc" style={styles.d8}>
                                  97
                                </td>
                                <td className="kc" style={styles.d24}>
                                  100
                                </td>
                                <td className="kc" style={styles.d40}>
                                  102
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d56}
                                >
                                  106
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d72}
                                >
                                  110
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d88}
                                >
                                  114
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d104}
                                >
                                  119
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d120}
                                >
                                  124
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d136}
                                >
                                  129
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d152}
                                >
                                  135
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d168}
                                >
                                  141
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d184}
                                >
                                  148
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d200}
                                >
                                  155
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">92</td>
                                <td className="kc" style={styles.d7}>
                                  94
                                </td>
                                <td className="kc" style={styles.d23}>
                                  96
                                </td>
                                <td className="kc" style={styles.d39}>
                                  99
                                </td>
                                <td className="kc" style={styles.d55}>
                                  101
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d71}
                                >
                                  105
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d87}
                                >
                                  108
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d103}
                                >
                                  112
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d119}
                                >
                                  116
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d135}
                                >
                                  121
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d151}
                                >
                                  126
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d167}
                                >
                                  131
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d183}
                                >
                                  137
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d199}
                                >
                                  143
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">90</td>
                                <td className="kc" style={styles.d6}>
                                  91
                                </td>
                                <td className="kc" style={styles.d22}>
                                  93
                                </td>
                                <td className="kc" style={styles.d38}>
                                  95
                                </td>
                                <td className="kc" style={styles.d54}>
                                  97
                                </td>
                                <td className="kc" style={styles.d70}>
                                  100
                                </td>
                                <td className="kc" style={styles.d86}>
                                  103
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d102}
                                >
                                  106
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d118}
                                >
                                  109
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d134}
                                >
                                  113
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d150}
                                >
                                  117
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d166}
                                >
                                  122
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d182}
                                >
                                  127
                                </td>
                                <td
                                  className="rc white-text"
                                  style={styles.d198}
                                >
                                  132
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">88</td>
                                <td className="kkc" style={styles.d5}>
                                  88
                                </td>
                                <td className="kkc" style={styles.d21}>
                                  89
                                </td>
                                <td className="kc" style={styles.d37}>
                                  91
                                </td>
                                <td className="kc" style={styles.d53}>
                                  93
                                </td>
                                <td className="kc" style={styles.d69}>
                                  95
                                </td>
                                <td className="kc" style={styles.d85}>
                                  98
                                </td>
                                <td className="kc" style={styles.d101}>
                                  100
                                </td>
                                <td className="kc" style={styles.d117}>
                                  103
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d133}
                                >
                                  106
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d149}
                                >
                                  110
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d165}
                                >
                                  113
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d181}
                                >
                                  117
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d197}
                                >
                                  121
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">86</td>
                                <td className="kkc" style={styles.d4}>
                                  85
                                </td>
                                <td className="kkc" style={styles.d20}>
                                  87
                                </td>
                                <td className="kkc" style={styles.d36}>
                                  88
                                </td>
                                <td className="kkc" style={styles.d52}>
                                  89
                                </td>
                                <td className="kc" style={styles.d68}>
                                  91
                                </td>
                                <td className="kc" style={styles.d84}>
                                  93
                                </td>
                                <td className="kc" style={styles.d100}>
                                  95
                                </td>
                                <td className="kc" style={styles.d116}>
                                  97
                                </td>
                                <td className="kc" style={styles.d132}>
                                  100
                                </td>
                                <td className="kc" style={styles.d148}>
                                  102
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d164}
                                >
                                  105
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d180}
                                >
                                  108
                                </td>
                                <td
                                  className="oc text-[#FF0000]"
                                  style={styles.d196}
                                >
                                  112
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">84</td>
                                <td className="kkc" style={styles.d3}>
                                  83
                                </td>
                                <td className="kkc" style={styles.d19}>
                                  84
                                </td>
                                <td className="kkc" style={styles.d35}>
                                  85
                                </td>
                                <td className="kkc" style={styles.d51}>
                                  86
                                </td>
                                <td className="kkc" style={styles.d67}>
                                  88
                                </td>
                                <td className="kkc" style={styles.d83}>
                                  89
                                </td>
                                <td className="kkc" style={styles.d99}>
                                  90
                                </td>
                                <td className="kkc" style={styles.d115}>
                                  92
                                </td>
                                <td className="kc" style={styles.d131}>
                                  94
                                </td>
                                <td className="kc" style={styles.d147}>
                                  96
                                </td>
                                <td className="kc" style={styles.d163}>
                                  98
                                </td>
                                <td className="kc" style={styles.d179}>
                                  100
                                </td>
                                <td className="kc" style={styles.d195}>
                                  103
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">82</td>
                                <td className="kkc" style={styles.d2}>
                                  81
                                </td>
                                <td className="kkc" style={styles.d18}>
                                  82
                                </td>
                                <td className="kkc" style={styles.d34}>
                                  83
                                </td>
                                <td className="kkc" style={styles.d50}>
                                  84
                                </td>
                                <td className="kkc" style={styles.d66}>
                                  84
                                </td>
                                <td className="kkc" style={styles.d82}>
                                  85
                                </td>
                                <td className="kkc" style={styles.d98}>
                                  86
                                </td>
                                <td className="kkc" style={styles.d114}>
                                  88
                                </td>
                                <td className="kkc" style={styles.d130}>
                                  89
                                </td>
                                <td className="kkc" style={styles.d146}>
                                  90
                                </td>
                                <td className="kkc" style={styles.d162}>
                                  91
                                </td>
                                <td className="kkc" style={styles.d178}>
                                  93
                                </td>
                                <td className="kkc" style={styles.d194}>
                                  95
                                </td>
                              </tr>
                              <tr>
                                <td className="p nela">80</td>
                                <td className="kkc" style={styles.d1}>
                                  80
                                </td>
                                <td className="kkc" style={styles.d17}>
                                  80
                                </td>
                                <td className="kkc" style={styles.d33}>
                                  81
                                </td>
                                <td className="kkc" style={styles.d49}>
                                  81
                                </td>
                                <td className="kkc" style={styles.d65}>
                                  82
                                </td>
                                <td className="kkc" style={styles.d81}>
                                  82
                                </td>
                                <td className="kkc" style={styles.d97}>
                                  83
                                </td>
                                <td className="kkc" style={styles.d113}>
                                  84
                                </td>
                                <td className="kkc" style={styles.d129}>
                                  84
                                </td>
                                <td className="kkc" style={styles.d145}>
                                  85
                                </td>
                                <td className="kkc" style={styles.d161}>
                                  86
                                </td>
                                <td className="kkc" style={styles.d177}>
                                  86
                                </td>
                                <td className="kkc" style={styles.d193}>
                                  87
                                </td>
                              </tr>
                              <tr>
                                <td className="p gr" colspan="2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]}:
                                  </strong>
                                </td>
                                <td className="p kkc font_size16" colspan="3">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </td>
                                <td className="p kc  font_size16" colspan="3">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </td>
                                <td className="p oc  font_size16" colspan="3">
                                  {data?.payload?.tech_lang_keys["12"]}
                                </td>
                                <td className="p rc  font_size16" colspan="3">
                                  {data?.payload?.tech_lang_keys["13"]}
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default HeatIndexCalculator;
