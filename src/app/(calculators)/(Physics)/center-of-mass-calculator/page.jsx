"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCenterOfMassCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CenterOfMassCalculator = () => {
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
    tech_dem: "1", //  1 2 3
    tech_how: "2",
    tech_m1: "12",
    tech_m1_unit: "g",
    tech_x1: "5",
    tech_x1_unit: "cm",
    tech_y1: "5",
    tech_y1_unit: "cm",
    tech_z1: "5",
    tech_z1_unit: "cm",
    tech_m2: "5",
    tech_m2_unit: "g",
    tech_x2: "5",
    tech_x2_unit: "cm",
    tech_y2: "5",
    tech_y2_unit: "cm",
    tech_z2: "5",
    tech_z2_unit: "cm",
    tech_m3: "5",
    tech_m3_unit: "g",
    tech_x3: "5",
    tech_x3_unit: "cm",
    tech_y3: "5",
    tech_y3_unit: "cm",
    tech_z3: "5",
    tech_z3_unit: "cm",
    tech_m4: "5",
    tech_m4_unit: "g",
    tech_x4: "5",
    tech_x4_unit: "cm",
    tech_y4: "5",
    tech_y4_unit: "cm",
    tech_z4: "5",
    tech_z4_unit: "cm",
    tech_m5: "5",
    tech_m5_unit: "g",
    tech_x5: "5",
    tech_x5_unit: "g",
    tech_y5: "5",
    tech_y5_unit: "g",
    tech_z5: "5",
    tech_z5_unit: "g",
    tech_m6: "5",
    tech_m6_unit: "g",
    tech_x6: "5",
    tech_x6_unit: "g",
    tech_y6: "5",
    tech_y6_unit: "g",
    tech_z6: "5",
    tech_z6_unit: "g",
    tech_m7: "5",
    tech_m7_unit: "g",
    tech_x7: "5",
    tech_x7_unit: "g",
    tech_y7: "5",
    tech_y7_unit: "g",
    tech_z7: "5",
    tech_z7_unit: "g",
    tech_m8: "5",
    tech_m8_unit: "g",
    tech_x8: "5",
    tech_x8_unit: "g",
    tech_y8: "5",
    tech_y8_unit: "g",
    tech_z8: "5",
    tech_z8_unit: "g",
    tech_m9: "5",
    tech_m9_unit: "g",
    tech_x9: "5",
    tech_x9_unit: "g",
    tech_y9: "5",
    tech_y9_unit: "g",
    tech_z9: "5",
    tech_z9_unit: "g",
    tech_m10: "5",
    tech_m10_unit: "g",
    tech_x10: "5",
    tech_x10_unit: "g",
    tech_y10: "5",
    tech_y10_unit: "g",
    tech_z10: "5",
    tech_z10_unit: "g",
    tech_res_unit: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCenterOfMassCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_dem) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_dem: formData.tech_dem,
        tech_how: formData.tech_how,
        tech_m1: formData.tech_m1,
        tech_m1_unit: formData.tech_m1_unit,
        tech_x1: formData.tech_x1,
        tech_x1_unit: formData.tech_x1_unit,
        tech_y1: formData.tech_y1,
        tech_y1_unit: formData.tech_y1_unit,
        tech_z1: formData.tech_z1,
        tech_z1_unit: formData.tech_z1_unit,
        tech_m2: formData.tech_m2,
        tech_m2_unit: formData.tech_m2_unit,
        tech_x2: formData.tech_x2,
        tech_x2_unit: formData.tech_x2_unit,
        tech_y2: formData.tech_y2,
        tech_y2_unit: formData.tech_y2_unit,
        tech_z2: formData.tech_z2,
        tech_z2_unit: formData.tech_z2_unit,
        tech_m3: formData.tech_m3,
        tech_m3_unit: formData.tech_m3_unit,
        tech_x3: formData.tech_x3,
        tech_x3_unit: formData.tech_x3_unit,
        tech_y3: formData.tech_y3,
        tech_y3_unit: formData.tech_y3_unit,
        tech_z3: formData.tech_z3,
        tech_z3_unit: formData.tech_z3_unit,
        tech_m4: formData.tech_m4,
        tech_m4_unit: formData.tech_m4_unit,
        tech_x4: formData.tech_x4,
        tech_x4_unit: formData.tech_x4_unit,
        tech_y4: formData.tech_y4,
        tech_y4_unit: formData.tech_y4_unit,
        tech_z4: formData.tech_z4,
        tech_z4_unit: formData.tech_z4_unit,
        tech_m5: formData.tech_m5,
        tech_m5_unit: formData.tech_m5_unit,
        tech_x5: formData.tech_x5,
        tech_x5_unit: formData.tech_x5_unit,
        tech_y5: formData.tech_y5,
        tech_y5_unit: formData.tech_y5_unit,
        tech_z5: formData.tech_z5,
        tech_z5_unit: formData.tech_z5_unit,
        tech_m6: formData.tech_m6,
        tech_m6_unit: formData.tech_m6_unit,
        tech_x6: formData.tech_x6,
        tech_x6_unit: formData.tech_x6_unit,
        tech_y6: formData.tech_y6,
        tech_y6_unit: formData.tech_y6_unit,
        tech_z6: formData.tech_z6,
        tech_z6_unit: formData.tech_z6_unit,
        tech_m7: formData.tech_m7,
        tech_m7_unit: formData.tech_m7_unit,
        tech_x7: formData.tech_x7,
        tech_x7_unit: formData.tech_x7_unit,
        tech_y7: formData.tech_y7,
        tech_y7_unit: formData.tech_y7_unit,
        tech_z7: formData.tech_z7,
        tech_z7_unit: formData.tech_z7_unit,
        tech_m8: formData.tech_m8,
        tech_m8_unit: formData.tech_m8_unit,
        tech_x8: formData.tech_x8,
        tech_x8_unit: formData.tech_x8_unit,
        tech_y8: formData.tech_y8,
        tech_y8_unit: formData.tech_y8_unit,
        tech_z8: formData.tech_z8,
        tech_z8_unit: formData.tech_z8_unit,
        tech_m9: formData.tech_m9,
        tech_m9_unit: formData.tech_m9_unit,
        tech_x9: formData.tech_x9,
        tech_x9_unit: formData.tech_x9_unit,
        tech_y9: formData.tech_y9,
        tech_y9_unit: formData.tech_y9_unit,
        tech_z9: formData.tech_z9,
        tech_z9_unit: formData.tech_z9_unit,
        tech_m10: formData.tech_m10,
        tech_m10_unit: formData.tech_m10_unit,
        tech_x10: formData.tech_x10,
        tech_x10_unit: formData.tech_x10_unit,
        tech_y10: formData.tech_y10,
        tech_y10_unit: formData.tech_y10_unit,
        tech_z10: formData.tech_z10,
        tech_z10_unit: formData.tech_z10_unit,
        tech_res_unit: formData.tech_res_unit,
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
      tech_dem: "1", //  1 2 3
      tech_how: "2",
      tech_m1: "12",
      tech_m1_unit: "g",
      tech_x1: "5",
      tech_x1_unit: "cm",
      tech_y1: "5",
      tech_y1_unit: "cm",
      tech_z1: "5",
      tech_z1_unit: "cm",
      tech_m2: "5",
      tech_m2_unit: "g",
      tech_x2: "5",
      tech_x2_unit: "cm",
      tech_y2: "5",
      tech_y2_unit: "cm",
      tech_z2: "5",
      tech_z2_unit: "cm",
      tech_m3: "5",
      tech_m3_unit: "g",
      tech_x3: "5",
      tech_x3_unit: "cm",
      tech_y3: "5",
      tech_y3_unit: "cm",
      tech_z3: "5",
      tech_z3_unit: "cm",
      tech_m4: "5",
      tech_m4_unit: "g",
      tech_x4: "5",
      tech_x4_unit: "cm",
      tech_y4: "5",
      tech_y4_unit: "cm",
      tech_z4: "5",
      tech_z4_unit: "cm",
      tech_m5: "5",
      tech_m5_unit: "g",
      tech_x5: "5",
      tech_x5_unit: "g",
      tech_y5: "5",
      tech_y5_unit: "g",
      tech_z5: "5",
      tech_z5_unit: "g",
      tech_m6: "5",
      tech_m6_unit: "g",
      tech_x6: "5",
      tech_x6_unit: "g",
      tech_y6: "5",
      tech_y6_unit: "g",
      tech_z6: "5",
      tech_z6_unit: "g",
      tech_m7: "5",
      tech_m7_unit: "g",
      tech_x7: "5",
      tech_x7_unit: "g",
      tech_y7: "5",
      tech_y7_unit: "g",
      tech_z7: "5",
      tech_z7_unit: "g",
      tech_m8: "5",
      tech_m8_unit: "g",
      tech_x8: "5",
      tech_x8_unit: "g",
      tech_y8: "5",
      tech_y8_unit: "g",
      tech_z8: "5",
      tech_z8_unit: "g",
      tech_m9: "5",
      tech_m9_unit: "g",
      tech_x9: "5",
      tech_x9_unit: "g",
      tech_y9: "5",
      tech_y9_unit: "g",
      tech_z9: "5",
      tech_z9_unit: "g",
      tech_m10: "5",
      tech_m10_unit: "g",
      tech_x10: "5",
      tech_x10_unit: "g",
      tech_y10: "5",
      tech_y10_unit: "g",
      tech_z10: "5",
      tech_z10_unit: "g",
      tech_res_unit: "cm",
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
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1111111
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m1_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x1_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y1_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z1_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states 22222
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m2_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x2_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y2_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z2_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states 33333
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m3_unit: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };

  //dropdown states
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x3_unit: unit }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };

  //dropdown states
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y3_unit: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };

  //dropdown states
  const [dropdownVisible12, setDropdownVisible12] = useState(false);

  const setUnitHandler12 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z3_unit: unit }));
    setDropdownVisible12(false);
  };

  const toggleDropdown12 = () => {
    setDropdownVisible12(!dropdownVisible12);
  };

  //dropdown states 4444
  const [dropdownVisible13, setDropdownVisible13] = useState(false);

  const setUnitHandler13 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m4_unit: unit }));
    setDropdownVisible13(false);
  };

  const toggleDropdown13 = () => {
    setDropdownVisible13(!dropdownVisible13);
  };

  //dropdown states
  const [dropdownVisible14, setDropdownVisible14] = useState(false);

  const setUnitHandler14 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x4_unit: unit }));
    setDropdownVisible14(false);
  };

  const toggleDropdown14 = () => {
    setDropdownVisible14(!dropdownVisible14);
  };

  //dropdown states
  const [dropdownVisible15, setDropdownVisible15] = useState(false);

  const setUnitHandler15 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y4_unit: unit }));
    setDropdownVisible15(false);
  };

  const toggleDropdown15 = () => {
    setDropdownVisible15(!dropdownVisible15);
  };

  //dropdown states
  const [dropdownVisible16, setDropdownVisible16] = useState(false);

  const setUnitHandler16 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z4_unit: unit }));
    setDropdownVisible16(false);
  };

  const toggleDropdown16 = () => {
    setDropdownVisible16(!dropdownVisible16);
  };

  //dropdown states 5555
  const [dropdownVisible17, setDropdownVisible17] = useState(false);

  const setUnitHandler17 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m5_unit: unit }));
    setDropdownVisible17(false);
  };

  const toggleDropdown17 = () => {
    setDropdownVisible17(!dropdownVisible17);
  };

  //dropdown states
  const [dropdownVisible18, setDropdownVisible18] = useState(false);

  const setUnitHandler18 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x5_unit: unit }));
    setDropdownVisible18(false);
  };

  const toggleDropdown18 = () => {
    setDropdownVisible18(!dropdownVisible18);
  };

  //dropdown states
  const [dropdownVisible19, setDropdownVisible19] = useState(false);

  const setUnitHandler19 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y5_unit: unit }));
    setDropdownVisible19(false);
  };

  const toggleDropdown19 = () => {
    setDropdownVisible19(!dropdownVisible19);
  };

  //dropdown states
  const [dropdownVisible20, setDropdownVisible20] = useState(false);

  const setUnitHandler20 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z5_unit: unit }));
    setDropdownVisible20(false);
  };

  const toggleDropdown20 = () => {
    setDropdownVisible20(!dropdownVisible20);
  };

  //dropdown states 666
  const [dropdownVisible21, setDropdownVisible21] = useState(false);

  const setUnitHandler21 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m6_unit: unit }));
    setDropdownVisible21(false);
  };

  const toggleDropdown21 = () => {
    setDropdownVisible21(!dropdownVisible21);
  };

  //dropdown states
  const [dropdownVisible22, setDropdownVisible22] = useState(false);

  const setUnitHandler22 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x6_unit: unit }));
    setDropdownVisible22(false);
  };

  const toggleDropdown22 = () => {
    setDropdownVisible22(!dropdownVisible22);
  };

  //dropdown states
  const [dropdownVisible23, setDropdownVisible23] = useState(false);

  const setUnitHandler23 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y6_unit: unit }));
    setDropdownVisible23(false);
  };

  const toggleDropdown23 = () => {
    setDropdownVisible23(!dropdownVisible23);
  };

  //dropdown states
  const [dropdownVisible24, setDropdownVisible24] = useState(false);

  const setUnitHandler24 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z6_unit: unit }));
    setDropdownVisible24(false);
  };

  const toggleDropdown24 = () => {
    setDropdownVisible24(!dropdownVisible24);
  };

  //dropdown states 777
  const [dropdownVisible25, setDropdownVisible25] = useState(false);

  const setUnitHandler25 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m7_unit: unit }));
    setDropdownVisible25(false);
  };

  const toggleDropdown25 = () => {
    setDropdownVisible25(!dropdownVisible25);
  };

  //dropdown states
  const [dropdownVisible26, setDropdownVisible26] = useState(false);

  const setUnitHandler26 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x7_unit: unit }));
    setDropdownVisible26(false);
  };

  const toggleDropdown26 = () => {
    setDropdownVisible26(!dropdownVisible26);
  };

  //dropdown states
  const [dropdownVisible27, setDropdownVisible27] = useState(false);

  const setUnitHandler27 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y7_unit: unit }));
    setDropdownVisible27(false);
  };

  const toggleDropdown27 = () => {
    setDropdownVisible27(!dropdownVisible27);
  };

  //dropdown states
  const [dropdownVisible28, setDropdownVisible28] = useState(false);

  const setUnitHandler28 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z7_unit: unit }));
    setDropdownVisible28(false);
  };

  const toggleDropdown28 = () => {
    setDropdownVisible28(!dropdownVisible28);
  };

  //dropdown states 8888
  const [dropdownVisible29, setDropdownVisible29] = useState(false);

  const setUnitHandler29 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m8_unit: unit }));
    setDropdownVisible29(false);
  };

  const toggleDropdown29 = () => {
    setDropdownVisible29(!dropdownVisible29);
  };

  //dropdown states
  const [dropdownVisible30, setDropdownVisible30] = useState(false);

  const setUnitHandler30 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x8_unit: unit }));
    setDropdownVisible30(false);
  };

  const toggleDropdown30 = () => {
    setDropdownVisible30(!dropdownVisible30);
  };

  //dropdown states
  const [dropdownVisible31, setDropdownVisible31] = useState(false);

  const setUnitHandler31 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y8_unit: unit }));
    setDropdownVisible31(false);
  };

  const toggleDropdown31 = () => {
    setDropdownVisible31(!dropdownVisible31);
  };

  //dropdown states
  const [dropdownVisible32, setDropdownVisible32] = useState(false);

  const setUnitHandler32 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z8_unit: unit }));
    setDropdownVisible32(false);
  };

  const toggleDropdown32 = () => {
    setDropdownVisible32(!dropdownVisible32);
  };

  //dropdown states 9999
  const [dropdownVisible33, setDropdownVisible33] = useState(false);

  const setUnitHandler33 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m9_unit: unit }));
    setDropdownVisible33(false);
  };

  const toggleDropdown33 = () => {
    setDropdownVisible33(!dropdownVisible33);
  };

  //dropdown states
  const [dropdownVisible34, setDropdownVisible34] = useState(false);

  const setUnitHandler34 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x9_unit: unit }));
    setDropdownVisible34(false);
  };

  const toggleDropdown34 = () => {
    setDropdownVisible34(!dropdownVisible34);
  };

  //dropdown states
  const [dropdownVisible35, setDropdownVisible35] = useState(false);

  const setUnitHandler35 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y9_unit: unit }));
    setDropdownVisible35(false);
  };

  const toggleDropdown35 = () => {
    setDropdownVisible35(!dropdownVisible35);
  };

  //dropdown states
  const [dropdownVisible36, setDropdownVisible36] = useState(false);

  const setUnitHandler36 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z9_unit: unit }));
    setDropdownVisible36(false);
  };

  const toggleDropdown36 = () => {
    setDropdownVisible36(!dropdownVisible36);
  };

  //dropdown states 10
  const [dropdownVisible37, setDropdownVisible37] = useState(false);

  const setUnitHandler37 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m10_unit: unit }));
    setDropdownVisible37(false);
  };

  const toggleDropdown37 = () => {
    setDropdownVisible37(!dropdownVisible37);
  };

  //dropdown states
  const [dropdownVisible38, setDropdownVisible38] = useState(false);

  const setUnitHandler38 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_x10_unit: unit }));
    setDropdownVisible38(false);
  };

  const toggleDropdown38 = () => {
    setDropdownVisible38(!dropdownVisible38);
  };

  //dropdown states
  const [dropdownVisible39, setDropdownVisible39] = useState(false);

  const setUnitHandler39 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_y10_unit: unit }));
    setDropdownVisible39(false);
  };

  const toggleDropdown39 = () => {
    setDropdownVisible39(!dropdownVisible39);
  };

  //dropdown states
  const [dropdownVisible40, setDropdownVisible40] = useState(false);

  const setUnitHandler40 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_z10_unit: unit }));
    setDropdownVisible40(false);
  };

  const toggleDropdown40 = () => {
    setDropdownVisible40(!dropdownVisible40);
  };

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

          <div className="lg::w-[80%]  w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-6">
                <label htmlFor="tech_dem" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_dem"
                    id="tech_dem"
                    value={formData.tech_dem}
                    onChange={handleChange}
                  >
                    <option value="1">1D</option>
                    <option value="2">2D</option>
                    <option value="3">3D</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_how" className="label">
                  {data?.payload?.tech_lang_keys["2"]} ?
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_how"
                    id="tech_how"
                    value={formData.tech_how}
                    onChange={handleChange}
                  >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6  three">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-12  ">
                    <p className="my-2 p-2 tagsUnit radius-5">
                      <strong className="text-sky">
                        {data?.payload?.tech_lang_keys["3"]} 1
                      </strong>
                    </p>
                  </div>
                  <div className="col-span-6 mt-0 mt-lg-2 ">
                    <label htmlFor="tech_m1" className="label">
                      m1
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_m1"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_m1}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_m1_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "g", value: "g" },
                            { label: "kg", value: "kg" },
                            { label: "lbs", value: "lbs" },
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
                  <div className="col-span-6 mt-0 mt-lg-2 ">
                    <label htmlFor="tech_x1" className="label">
                      x1
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_x1"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_x1}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_x1_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
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

                  {(formData.tech_dem == "2" || formData.tech_dem == "3") && (
                    <>
                      <div className="col-span-6 mt-0 mt-lg-2  twod">
                        <label htmlFor="tech_y1" className="label">
                          y1
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_y1"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_y1}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_y1_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler3(unit.value)}
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
                  {formData.tech_dem == "3" && (
                    <>
                      <div className="col-span-6 mt-0 mt-lg-2  threed">
                        <label htmlFor="tech_z1" className="label">
                          z1
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_z1"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_z1}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_z1_unit} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler4(unit.value)}
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
              <div className="col-span-12 md:col-span-6  three">
                <div className="grid grid-cols-12 mt-3  gap-4">
                  <div className="col-span-12">
                    <p className="my-2 p-2 tagsUnit radius-5">
                      <strong className="text-sky">
                        {data?.payload?.tech_lang_keys["3"]} 2
                      </strong>
                    </p>
                  </div>

                  <div className="col-span-6 mt-0 mt-lg-2 ">
                    <label htmlFor="tech_m2" className="label">
                      m2
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_m2"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_m2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown5}
                      >
                        {formData.tech_m2_unit} ▾
                      </label>
                      {dropdownVisible5 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "g", value: "g" },
                            { label: "kg", value: "kg" },
                            { label: "lbs", value: "lbs" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler5(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-6 mt-0 mt-lg-2 ">
                    <label htmlFor="tech_x2" className="label">
                      x2
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_x2"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_x2}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown6}
                      >
                        {formData.tech_x2_unit} ▾
                      </label>
                      {dropdownVisible6 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler6(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {(formData.tech_dem == "2" || formData.tech_dem == "3") && (
                    <>
                      <div className="col-span-6 mt-0 mt-lg-2  twod">
                        <label htmlFor="tech_y2" className="label">
                          y2
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_y2"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_y2}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown7}
                          >
                            {formData.tech_y2_unit} ▾
                          </label>
                          {dropdownVisible7 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler7(unit.value)}
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
                  {formData.tech_dem == "3" && (
                    <>
                      <div className="col-span-6 mt-0 mt-lg-2  threed">
                        <label htmlFor="tech_z2" className="label">
                          z2
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_z2"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_z2}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown8}
                          >
                            {formData.tech_z2_unit} ▾
                          </label>
                          {dropdownVisible8 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler8(unit.value)}
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

              {(formData.tech_how == "3" ||
                formData.tech_how == "4" ||
                formData.tech_how == "5" ||
                formData.tech_how == "6" ||
                formData.tech_how == "7" ||
                formData.tech_how == "8" ||
                formData.tech_how == "9" ||
                formData.tech_how == "10") && (
                <>
                  <div className="col-span-12 md:col-span-6  three">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12  ">
                        <p className="my-2 p-2 tagsUnit radius-5">
                          <strong className="">
                            {data?.payload?.tech_lang_keys["3"]} 3
                          </strong>
                        </p>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_m3" className="label">
                          m3
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m3"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_m3}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown9}
                          >
                            {formData.tech_m3_unit} ▾
                          </label>
                          {dropdownVisible9 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "g", value: "g" },
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler9(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_x3" className="label">
                          x3
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_x3"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_x3}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown10}
                          >
                            {formData.tech_x3_unit} ▾
                          </label>
                          {dropdownVisible10 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler10(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3") && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  twod">
                            <label htmlFor="tech_y3" className="label">
                              y3
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_y3"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_y3}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown11}
                              >
                                {formData.tech_y3_unit} ▾
                              </label>
                              {dropdownVisible11 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler11(unit.value)
                                      }
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
                      {formData.tech_dem == "3" && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  threed">
                            <label htmlFor="tech_z3" className="label">
                              z3
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_z3"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_z3}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown12}
                              >
                                {formData.tech_z3_unit} ▾
                              </label>
                              {dropdownVisible12 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler12(unit.value)
                                      }
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
                </>
              )}

              {(formData.tech_how == "4" ||
                formData.tech_how == "5" ||
                formData.tech_how == "6" ||
                formData.tech_how == "7" ||
                formData.tech_how == "8" ||
                formData.tech_how == "9" ||
                formData.tech_how == "10") && (
                <>
                  <div className="col-span-12 md:col-span-6 four">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12  ">
                        <p className="my-2 p-2 tagsUnit radius-5">
                          <strong className="">
                            {data?.payload?.tech_lang_keys["3"]} 4
                          </strong>
                        </p>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_m4" className="label">
                          m4
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m4"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_m4}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown13}
                          >
                            {formData.tech_m4_unit} ▾
                          </label>
                          {dropdownVisible13 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "g", value: "g" },
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler13(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_x4" className="label">
                          x4
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_x4"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_x4}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown14}
                          >
                            {formData.tech_x4_unit} ▾
                          </label>
                          {dropdownVisible14 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler14(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3") && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  twod">
                            <label htmlFor="tech_y4" className="label">
                              y4
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_y4"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_y4}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown15}
                              >
                                {formData.tech_y4_unit} ▾
                              </label>
                              {dropdownVisible15 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler15(unit.value)
                                      }
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
                      {formData.tech_dem == "3" && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  threed">
                            <label htmlFor="tech_z4" className="label">
                              z4
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_z4"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_z4}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown16}
                              >
                                {formData.tech_z4_unit} ▾
                              </label>
                              {dropdownVisible16 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler16(unit.value)
                                      }
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
                </>
              )}

              {(formData.tech_how == "5" ||
                formData.tech_how == "6" ||
                formData.tech_how == "7" ||
                formData.tech_how == "8" ||
                formData.tech_how == "9" ||
                formData.tech_how == "10") && (
                <>
                  <div className="col-span-12 md:col-span-6  five">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 ">
                        <p className="my-2 p-2 tagsUnit radius-5">
                          <strong className="">
                            {data?.payload?.tech_lang_keys["3"]} 5
                          </strong>
                        </p>
                      </div>

                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_m5" className="label">
                          m5
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m5"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_m5}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown17}
                          >
                            {formData.tech_m5_unit} ▾
                          </label>
                          {dropdownVisible17 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "g", value: "g" },
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler17(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_x5" className="label">
                          x5
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_x5"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_x5}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown18}
                          >
                            {formData.tech_x5_unit} ▾
                          </label>
                          {dropdownVisible18 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler18(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3") && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  twod">
                            <label htmlFor="tech_y5" className="label">
                              y5
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_y5"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_y5}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown19}
                              >
                                {formData.tech_y5_unit} ▾
                              </label>
                              {dropdownVisible19 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler19(unit.value)
                                      }
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
                      {formData.tech_dem == "3" && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  threed">
                            <label htmlFor="tech_z5" className="label">
                              z5
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_z5"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_z5}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown20}
                              >
                                {formData.tech_z5_unit} ▾
                              </label>
                              {dropdownVisible20 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler20(unit.value)
                                      }
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
                </>
              )}

              {(formData.tech_how == "6" ||
                formData.tech_how == "7" ||
                formData.tech_how == "8" ||
                formData.tech_how == "9" ||
                formData.tech_how == "10") && (
                <>
                  <div className="col-span-12 md:col-span-6  six">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 ">
                        <p className="my-2 p-2 tagsUnit radius-5">
                          <strong className="">
                            {data?.payload?.tech_lang_keys["3"]} 6
                          </strong>
                        </p>
                      </div>

                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_m6" className="label">
                          m6
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m6"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_m6}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown21}
                          >
                            {formData.tech_m6_unit} ▾
                          </label>
                          {dropdownVisible21 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "g", value: "g" },
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler21(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_x6" className="label">
                          x6
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_x6"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_x6}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown22}
                          >
                            {formData.tech_x6_unit} ▾
                          </label>
                          {dropdownVisible22 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler22(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3") && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  twod">
                            <label htmlFor="tech_y6" className="label">
                              y6
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_y6"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_y6}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown23}
                              >
                                {formData.tech_y6_unit} ▾
                              </label>
                              {dropdownVisible23 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler23(unit.value)
                                      }
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
                      {formData.tech_dem == "3" && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  threed">
                            <label htmlFor="tech_z6" className="label">
                              z6
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_z6"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_z6}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown24}
                              >
                                {formData.tech_z6_unit} ▾
                              </label>
                              {dropdownVisible24 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler24(unit.value)
                                      }
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
                </>
              )}
              {(formData.tech_how == "7" ||
                formData.tech_how == "8" ||
                formData.tech_how == "9" ||
                formData.tech_how == "10") && (
                <>
                  <div className="col-span-12 md:col-span-6  seven">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 ">
                        <p className="my-2 p-2 tagsUnit radius-5">
                          <strong className="">
                            {" "}
                            {data?.payload?.tech_lang_keys["3"]} 7
                          </strong>
                        </p>
                      </div>

                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_m7" className="label">
                          m7
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m7"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_m7}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown25}
                          >
                            {formData.tech_m7_unit} ▾
                          </label>
                          {dropdownVisible25 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "g", value: "g" },
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler25(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_x7" className="label">
                          x7
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_x7"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_x7}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown26}
                          >
                            {formData.tech_x7_unit} ▾
                          </label>
                          {dropdownVisible26 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler26(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3") && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  twod">
                            <label htmlFor="tech_y7" className="label">
                              y7
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_y7"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_y7}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown27}
                              >
                                {formData.tech_y7_unit} ▾
                              </label>
                              {dropdownVisible27 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler27(unit.value)
                                      }
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
                      {formData.tech_dem == "3" && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  threed">
                            <label htmlFor="tech_z7" className="label">
                              z7
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_z7"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_z7}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown28}
                              >
                                {formData.tech_z7_unit} ▾
                              </label>
                              {dropdownVisible28 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler28(unit.value)
                                      }
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
                </>
              )}
              {(formData.tech_how == "8" ||
                formData.tech_how == "9" ||
                formData.tech_how == "10") && (
                <>
                  <div className="col-span-12 md:col-span-6  eight">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 ">
                        <p className="my-2 p-2 tagsUnit radius-5">
                          <strong className="">
                            {data?.payload?.tech_lang_keys["3"]} 8
                          </strong>
                        </p>
                      </div>

                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_m8" className="label">
                          m8
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m8"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_m8}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown29}
                          >
                            {formData.tech_m8_unit} ▾
                          </label>
                          {dropdownVisible29 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "g", value: "g" },
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler29(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_x8" className="label">
                          x8
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_x8"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_x8}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown30}
                          >
                            {formData.tech_x8_unit} ▾
                          </label>
                          {dropdownVisible30 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler30(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3") && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  twod">
                            <label htmlFor="tech_y8" className="label">
                              y8
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_y8"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_y8}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown31}
                              >
                                {formData.tech_y8_unit} ▾
                              </label>
                              {dropdownVisible31 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler31(unit.value)
                                      }
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

                      {formData.tech_dem == "3" && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  threed">
                            <label htmlFor="tech_z8" className="label">
                              z8
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_z8"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_z8}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown32}
                              >
                                {formData.tech_z8_unit} ▾
                              </label>
                              {dropdownVisible32 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler32(unit.value)
                                      }
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
                </>
              )}
              {(formData.tech_how == "9" || formData.tech_how == "10") && (
                <>
                  <div className="col-span-12 md:col-span-6  nine">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 ">
                        <p className="my-2 p-2 tagsUnit radius-5">
                          <strong className="">
                            {data?.payload?.tech_lang_keys["3"]} 9
                          </strong>
                        </p>
                      </div>

                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_m9" className="label">
                          m9
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m9"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_m9}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown33}
                          >
                            {formData.tech_m9_unit} ▾
                          </label>
                          {dropdownVisible33 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "g", value: "g" },
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler33(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_x9" className="label">
                          x9
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_x9"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_x9}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown34}
                          >
                            {formData.tech_x9_unit} ▾
                          </label>
                          {dropdownVisible34 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler34(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3") && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  twod">
                            <label htmlFor="tech_y9" className="label">
                              y9
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_y9"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_y9}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown35}
                              >
                                {formData.tech_y9_unit} ▾
                              </label>
                              {dropdownVisible35 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler35(unit.value)
                                      }
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

                      {formData.tech_dem == "3" && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  threed">
                            <label htmlFor="tech_z9" className="label">
                              z9
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_z9"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_z9}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown36}
                              >
                                {formData.tech_z9_unit} ▾
                              </label>
                              {dropdownVisible36 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler36(unit.value)
                                      }
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
                </>
              )}

              {formData.tech_how == "10" && (
                <>
                  <div className="col-span-12 md:col-span-6  ten">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-12 ">
                        <p className="my-2 p-2 tagsUnit radius-5">
                          <strong className="">
                            {data?.payload?.tech_lang_keys["3"]} 10
                          </strong>
                        </p>
                      </div>

                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_m10" className="label">
                          m10
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m10"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_m10}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown37}
                          >
                            {formData.tech_m10_unit} ▾
                          </label>
                          {dropdownVisible37 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "g", value: "g" },
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler37(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-6 mt-0 mt-lg-2 ">
                        <label htmlFor="tech_x10" className="label">
                          x10
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_x10"
                            step="any"
                            min="1"
                            className="mt-1 input"
                            value={formData.tech_x10}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown38}
                          >
                            {formData.tech_x10_unit} ▾
                          </label>
                          {dropdownVisible38 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler38(unit.value)}
                                >
                                  {unit.label}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(formData.tech_dem == "2" ||
                        formData.tech_dem == "3") && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  twod">
                            <label htmlFor="tech_y10" className="label">
                              y10
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_y10"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_y10}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown39}
                              >
                                {formData.tech_y10_unit} ▾
                              </label>
                              {dropdownVisible39 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler39(unit.value)
                                      }
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
                      {formData.tech_dem == "3" && (
                        <>
                          <div className="col-span-6 mt-0 mt-lg-2  threed">
                            <label htmlFor="tech_z10" className="label">
                              z10
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_z10"
                                step="any"
                                min="1"
                                className="mt-1 input"
                                value={formData.tech_z10}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown40}
                              >
                                {formData.tech_z10_unit} ▾
                              </label>
                              {dropdownVisible40 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "m", value: "m" },
                                    { label: "in", value: "in" },
                                    { label: "ft", value: "ft" },
                                    { label: "yd", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler40(unit.value)
                                      }
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
                </>
              )}

              <div className="col-span-12">
                <label htmlFor="tech_res_unit" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_res_unit"
                    id="tech_res_unit"
                    value={formData.tech_res_unit}
                    onChange={handleChange}
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="in">in</option>
                    <option value="ft">ft</option>
                    <option value="yd">yd</option>
                  </select>
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
                      <div className="w-full text-center text-[20px]">
                        <p>{data?.payload?.tech_lang_keys[5]}</p>
                        <p className="my-3">
                          <strong className="bg-[#2845F5] px-3 py-2 md:text-[32px] text-[20px] rounded-lg text-white">
                            ({Number(result?.tech_ansx).toFixed(3)}{" "}
                            {result?.tech_unit}
                            {(formData.dem === 2 || formData.dem === 3) &&
                              result?.tech_ansy !== undefined && (
                                <>
                                  , {Number(result.tech_ansy).toFixed(3)}{" "}
                                  {result.tech_unit}
                                </>
                              )}
                            {formData.dem === 3 &&
                              result?.tech_ansz !== undefined && (
                                <>
                                  , {Number(result.tech_ansz).toFixed(3)}{" "}
                                  {result.tech_unit}
                                </>
                              )}
                            )
                          </strong>
                        </p>
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

export default CenterOfMassCalculator;
