"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVolumeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VolumeCalculator = () => {
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
    tech_volume_select: "Rectangular", // Rectangular  Cube  Cylinder  Cone Sphere Triangular Pyramid Capsule  Hemisphere  Hollow  Conical  Truncated  Ellipsoid  Square  Column
    tech_rec_width: "12",
    tech_rec_width_units: "cm",
    tech_rec_length: "3",
    tech_rec_length_units: "cm",
    tech_rec_height: "3",
    tech_rec_height_units: "cm",
    tech_cub_side: "3",
    tech_cub_side_units: "cm",
    tech_cyl_height: "5",
    tech_cyl_height_units: "cm",
    tech_cyl_diameter: "5",
    tech_cyl_diameter_units: "cm",
    tech_con_height: "5",
    tech_con_height_units: "cm",
    tech_con_diameter: "5",
    tech_con_diameter_units: "cm",
    tech_tri_base: "5",
    tech_tri_base_units: "cm",
    tech_tri_length: "5",
    tech_tri_length_units: "cm",
    tech_tri_height: "5",
    tech_tri_height_units: "cm",
    tech_tri_h: "5",
    tech_tri_h_units: "cm",
    tech_sph_diameter: "5",
    tech_sph_diameter_units: "cm",
    tech_pyr_height: "5",
    tech_pyr_height_units: "cm",
    tech_pyr_side: "5",
    tech_pyr_side_units: "cm",
    tech_cap_height: "5",
    tech_cap_height_units: "cm",
    tech_cap_radius: "5",
    tech_cap_radius_units: "cm",
    tech_hem_radius: "5",
    tech_hem_radius_units: "cm",
    tech_hol_inner_dia: "5",
    tech_hol_inner_dia_units: "cm",
    tech_hol_outer_dia: "5",
    tech_hol_outer_dia_units: "cm",
    tech_hol_height: "5",
    tech_hol_height_units: "cm",
    tech_coni_top_r: "5",
    tech_coni_top_r_units: "cm",
    tech_coni_bottom_r: "5",
    tech_coni_bottom_r_units: "cm",
    tech_coni_height: "5",
    tech_coni_height_units: "cm",
    tech_tru_base_side: "5",
    tech_tru_base_side_units: "cm",
    tech_tru_top_side: "5",
    tech_tru_top_side_units: "cm",
    tech_tru_height: "5",
    tech_tru_height_units: "cm",
    tech_ell_sem_a: "5",
    tech_ell_sem_a_units: "cm",
    tech_ell_sem_b: "5",
    tech_ell_sem_b_units: "cm",
    tech_ell_sem_c: "5",
    tech_ell_sem_c_units: "cm",
    tech_col_radi: "5",
    tech_col_radi_units: "cm",
    tech_col_height: "5",
    tech_col_height_units: "cm",
    tech_square: "5",
    tech_square_units: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVolumeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_volume_select) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_volume_select: formData.tech_volume_select,
        tech_rec_width: formData.tech_rec_width,
        tech_rec_width_units: formData.tech_rec_width_units,
        tech_rec_length: formData.tech_rec_length,
        tech_rec_length_units: formData.tech_rec_length_units,
        tech_rec_height: formData.tech_rec_height,
        tech_rec_height_units: formData.tech_rec_height_units,
        tech_cub_side: formData.tech_cub_side,
        tech_cub_side_units: formData.tech_cub_side_units,
        tech_cyl_height: formData.tech_cyl_height,
        tech_cyl_height_units: formData.tech_cyl_height_units,
        tech_cyl_diameter: formData.tech_cyl_diameter,
        tech_cyl_diameter_units: formData.tech_cyl_diameter_units,
        tech_con_height: formData.tech_con_height,
        tech_con_height_units: formData.tech_con_height_units,
        tech_con_diameter: formData.tech_con_diameter,
        tech_con_diameter_units: formData.tech_con_diameter_units,
        tech_tri_base: formData.tech_tri_base,
        tech_tri_base_units: formData.tech_tri_base_units,
        tech_tri_length: formData.tech_tri_length,
        tech_tri_length_units: formData.tech_tri_length_units,
        tech_tri_height: formData.tech_tri_height,
        tech_tri_height_units: formData.tech_tri_height_units,
        tech_tri_h: formData.tech_tri_h,
        tech_tri_h_units: formData.tech_tri_h_units,
        tech_sph_diameter: formData.tech_sph_diameter,
        tech_sph_diameter_units: formData.tech_sph_diameter_units,
        tech_pyr_height: formData.tech_pyr_height,
        tech_pyr_height_units: formData.tech_pyr_height_units,
        tech_pyr_side: formData.tech_pyr_side,
        tech_pyr_side_units: formData.tech_pyr_side_units,
        tech_cap_height: formData.tech_cap_height,
        tech_cap_height_units: formData.tech_cap_height_units,
        tech_cap_radius: formData.tech_cap_radius,
        tech_cap_radius_units: formData.tech_cap_radius_units,
        tech_hem_radius: formData.tech_hem_radius,
        tech_hem_radius_units: formData.tech_hem_radius_units,
        tech_hol_inner_dia: formData.tech_hol_inner_dia,
        tech_hol_inner_dia_units: formData.tech_hol_inner_dia_units,
        tech_hol_outer_dia: formData.tech_hol_outer_dia,
        tech_hol_outer_dia_units: formData.tech_hol_outer_dia_units,
        tech_hol_height: formData.tech_hol_height,
        tech_hol_height_units: formData.tech_hol_height_units,
        tech_coni_top_r: formData.tech_coni_top_r,
        tech_coni_top_r_units: formData.tech_coni_top_r_units,
        tech_coni_bottom_r: formData.tech_coni_bottom_r,
        tech_coni_bottom_r_units: formData.tech_coni_bottom_r_units,
        tech_coni_height: formData.tech_coni_height,
        tech_coni_height_units: formData.tech_coni_height_units,
        tech_tru_base_side: formData.tech_tru_base_side,
        tech_tru_base_side_units: formData.tech_tru_base_side_units,
        tech_tru_top_side: formData.tech_tru_top_side,
        tech_tru_top_side_units: formData.tech_tru_top_side_units,
        tech_tru_height: formData.tech_tru_height,
        tech_tru_height_units: formData.tech_tru_height_units,
        tech_ell_sem_a: formData.tech_ell_sem_a,
        tech_ell_sem_a_units: formData.tech_ell_sem_a_units,
        tech_ell_sem_b: formData.tech_ell_sem_b,
        tech_ell_sem_b_units: formData.tech_ell_sem_b_units,
        tech_ell_sem_c: formData.tech_ell_sem_c,
        tech_ell_sem_c_units: formData.tech_ell_sem_c_units,
        tech_col_radi: formData.tech_col_radi,
        tech_col_radi_units: formData.tech_col_radi_units,
        tech_col_height: formData.tech_col_height,
        tech_col_height_units: formData.tech_col_height_units,
        tech_square: formData.tech_square,
        tech_square_units: formData.tech_square_units,
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
      tech_volume_select: "Rectangular", // Rectangular  Cube  Cylinder  Cone Sphere Triangular Pyramid Capsule  Hemisphere  Hollow  Conical  Truncated  Ellipsoid  Square  Column
      tech_rec_width: "12",
      tech_rec_width_units: "cm",
      tech_rec_length: "3",
      tech_rec_length_units: "cm",
      tech_rec_height: "3",
      tech_rec_height_units: "cm",
      tech_cub_side: "3",
      tech_cub_side_units: "cm",
      tech_cyl_height: "5",
      tech_cyl_height_units: "cm",
      tech_cyl_diameter: "5",
      tech_cyl_diameter_units: "cm",
      tech_con_height: "5",
      tech_con_height_units: "cm",
      tech_con_diameter: "5",
      tech_con_diameter_units: "cm",
      tech_tri_base: "5",
      tech_tri_base_units: "cm",
      tech_tri_length: "5",
      tech_tri_length_units: "cm",
      tech_tri_height: "5",
      tech_tri_height_units: "cm",
      tech_tri_h: "5",
      tech_tri_h_units: "cm",
      tech_sph_diameter: "5",
      tech_sph_diameter_units: "cm",
      tech_pyr_height: "5",
      tech_pyr_height_units: "cm",
      tech_pyr_side: "5",
      tech_pyr_side_units: "cm",
      tech_cap_height: "5",
      tech_cap_height_units: "cm",
      tech_cap_radius: "5",
      tech_cap_radius_units: "cm",
      tech_hem_radius: "5",
      tech_hem_radius_units: "cm",
      tech_hol_inner_dia: "5",
      tech_hol_inner_dia_units: "cm",
      tech_hol_outer_dia: "5",
      tech_hol_outer_dia_units: "cm",
      tech_hol_height: "5",
      tech_hol_height_units: "cm",
      tech_coni_top_r: "5",
      tech_coni_top_r_units: "cm",
      tech_coni_bottom_r: "5",
      tech_coni_bottom_r_units: "cm",
      tech_coni_height: "5",
      tech_coni_height_units: "cm",
      tech_tru_base_side: "5",
      tech_tru_base_side_units: "cm",
      tech_tru_top_side: "5",
      tech_tru_top_side_units: "cm",
      tech_tru_height: "5",
      tech_tru_height_units: "cm",
      tech_ell_sem_a: "5",
      tech_ell_sem_a_units: "cm",
      tech_ell_sem_b: "5",
      tech_ell_sem_b_units: "cm",
      tech_ell_sem_c: "5",
      tech_ell_sem_c_units: "cm",
      tech_col_radi: "5",
      tech_col_radi_units: "cm",
      tech_col_height: "5",
      tech_col_height_units: "cm",
      tech_square: "5",
      tech_square_units: "cm",
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

  //dropdown states 0
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rec_width_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1

  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rec_length_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };
  //dropdown states 2

  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rec_height_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };
  //dropdown states 3

  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cub_side_units: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states 4

  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cyl_height_units: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states 5

  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cyl_diameter_units: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states 6

  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_con_height_units: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states 7

  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_con_diameter_units: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states 8

  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tri_base_units: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states 9

  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tri_length_units: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };

  //dropdown states 10

  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tri_height_units: unit }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };

  //dropdown states 11

  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tri_h_units: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };

  //dropdown states 12

  const [dropdownVisible12, setDropdownVisible12] = useState(false);

  const setUnitHandler12 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sph_diameter_units: unit }));
    setDropdownVisible12(false);
  };

  const toggleDropdown12 = () => {
    setDropdownVisible12(!dropdownVisible12);
  };

  //dropdown states 13

  const [dropdownVisible13, setDropdownVisible13] = useState(false);

  const setUnitHandler13 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pyr_height_units: unit }));
    setDropdownVisible13(false);
  };

  const toggleDropdown13 = () => {
    setDropdownVisible13(!dropdownVisible13);
  };

  //dropdown states 14

  const [dropdownVisible14, setDropdownVisible14] = useState(false);

  const setUnitHandler14 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pyr_side_units: unit }));
    setDropdownVisible14(false);
  };

  const toggleDropdown14 = () => {
    setDropdownVisible14(!dropdownVisible14);
  };

  //dropdown states 15

  const [dropdownVisible15, setDropdownVisible15] = useState(false);

  const setUnitHandler15 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cap_height_units: unit }));
    setDropdownVisible15(false);
  };

  const toggleDropdown15 = () => {
    setDropdownVisible15(!dropdownVisible15);
  };

  //dropdown states 16

  const [dropdownVisible16, setDropdownVisible16] = useState(false);

  const setUnitHandler16 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_cap_radius_units: unit }));
    setDropdownVisible16(false);
  };

  const toggleDropdown16 = () => {
    setDropdownVisible16(!dropdownVisible16);
  };

  //dropdown states 17

  const [dropdownVisible17, setDropdownVisible17] = useState(false);

  const setUnitHandler17 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hem_radius_units: unit }));
    setDropdownVisible17(false);
  };

  const toggleDropdown17 = () => {
    setDropdownVisible17(!dropdownVisible17);
  };

  //dropdown states 18

  const [dropdownVisible18, setDropdownVisible18] = useState(false);

  const setUnitHandler18 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hol_inner_dia_units: unit }));
    setDropdownVisible18(false);
  };

  const toggleDropdown18 = () => {
    setDropdownVisible18(!dropdownVisible18);
  };

  //dropdown states 19

  const [dropdownVisible19, setDropdownVisible19] = useState(false);

  const setUnitHandler19 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hol_outer_dia_units: unit }));
    setDropdownVisible19(false);
  };

  const toggleDropdown19 = () => {
    setDropdownVisible19(!dropdownVisible19);
  };

  //dropdown states 20

  const [dropdownVisible20, setDropdownVisible20] = useState(false);

  const setUnitHandler20 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_hol_height_units: unit }));
    setDropdownVisible20(false);
  };

  const toggleDropdown20 = () => {
    setDropdownVisible20(!dropdownVisible20);
  };

  //dropdown states 21

  const [dropdownVisible21, setDropdownVisible21] = useState(false);

  const setUnitHandler21 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_coni_top_r_units: unit }));
    setDropdownVisible21(false);
  };

  const toggleDropdown21 = () => {
    setDropdownVisible21(!dropdownVisible21);
  };

  //dropdown states 22

  const [dropdownVisible22, setDropdownVisible22] = useState(false);

  const setUnitHandler22 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_coni_bottom_r_units: unit }));
    setDropdownVisible22(false);
  };

  const toggleDropdown22 = () => {
    setDropdownVisible22(!dropdownVisible22);
  };

  //dropdown states 23

  const [dropdownVisible23, setDropdownVisible23] = useState(false);

  const setUnitHandler23 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_coni_height_units: unit }));
    setDropdownVisible23(false);
  };

  const toggleDropdown23 = () => {
    setDropdownVisible23(!dropdownVisible23);
  };

  //dropdown states 24

  const [dropdownVisible24, setDropdownVisible24] = useState(false);

  const setUnitHandler24 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tru_base_side_units: unit }));
    setDropdownVisible24(false);
  };

  const toggleDropdown24 = () => {
    setDropdownVisible24(!dropdownVisible24);
  };

  //dropdown states 25

  const [dropdownVisible25, setDropdownVisible25] = useState(false);

  const setUnitHandler25 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tru_top_side_units: unit }));
    setDropdownVisible25(false);
  };

  const toggleDropdown25 = () => {
    setDropdownVisible25(!dropdownVisible25);
  };

  //dropdown states 26

  const [dropdownVisible26, setDropdownVisible26] = useState(false);

  const setUnitHandler26 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_tru_height_units: unit }));
    setDropdownVisible26(false);
  };

  const toggleDropdown26 = () => {
    setDropdownVisible26(!dropdownVisible26);
  };

  //dropdown states 27

  const [dropdownVisible27, setDropdownVisible27] = useState(false);

  const setUnitHandler27 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ell_sem_a_units: unit }));
    setDropdownVisible27(false);
  };

  const toggleDropdown27 = () => {
    setDropdownVisible27(!dropdownVisible27);
  };

  //dropdown states 28

  const [dropdownVisible28, setDropdownVisible28] = useState(false);

  const setUnitHandler28 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ell_sem_b_units: unit }));
    setDropdownVisible28(false);
  };

  const toggleDropdown28 = () => {
    setDropdownVisible28(!dropdownVisible28);
  };

  //dropdown states 29

  const [dropdownVisible29, setDropdownVisible29] = useState(false);

  const setUnitHandler29 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_ell_sem_c_units: unit }));
    setDropdownVisible29(false);
  };

  const toggleDropdown29 = () => {
    setDropdownVisible29(!dropdownVisible29);
  };

  //dropdown states 30

  const [dropdownVisible30, setDropdownVisible30] = useState(false);

  const setUnitHandler30 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_col_radi_units: unit }));
    setDropdownVisible30(false);
  };

  const toggleDropdown30 = () => {
    setDropdownVisible30(!dropdownVisible30);
  };

  //dropdown states 31

  const [dropdownVisible31, setDropdownVisible31] = useState(false);

  const setUnitHandler31 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_col_height_units: unit }));
    setDropdownVisible31(false);
  };

  const toggleDropdown31 = () => {
    setDropdownVisible31(!dropdownVisible31);
  };

  //dropdown states 31

  const [dropdownVisible32, setDropdownVisible32] = useState(false);

  const setUnitHandler32 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_square_units: unit }));
    setDropdownVisible32(false);
  };

  const toggleDropdown32 = () => {
    setDropdownVisible32(!dropdownVisible32);
  };

  // result

  const [selectedUnit, setSelectedUnit] = useState("cm³");
  const [convertedResult, setConvertedResult] = useState(0);

  const conversionFactors = {
    "in³": 16.387064,
    "cm³": 1,
    "ft³": 28316.846592,
    "yd³": 764554.857984,
    "m³": 1000000,
  };

  // Get original volume value from the result
  const getVolumeValue = () => {
    const type = formData?.tech_volume_select;
    const volumes = {
      Rectangular: result?.tech_rectangular,
      Cube: result?.tech_cube,
      Cylinder: result?.tech_cylinder,
      Cone: result?.tech_cone,
      Sphere: result?.tech_sphere,
      Triangular: result?.tech_triangular,
      Pyramid: result?.tech_pyramid,
      Capsule: result?.tech_capsule,
      Hemisphere: result?.tech_hemisphere,
      Hollow: result?.tech_hollow,
      Conical: result?.tech_conical,
      Truncated: result?.tech_truncated,
      Ellipsoid: result?.tech_ellipsoid,
      Square: result?.tech_square,
      Column: result?.tech_column,
    };
    return parseFloat(volumes[type]) || 0;
  };

  // Convert result when unit changes
  useEffect(() => {
    const originalValue = getVolumeValue(); // cm³
    const factor = conversionFactors[selectedUnit] || 1;
    const newValue = originalValue / factor;
    setConvertedResult(newValue.toFixed(6));
  }, [selectedUnit, result]);

  //  const getVolumeValue = () => {
  //     const type = formData?.tech_volume_select;

  //     const volumes = {
  //       Rectangular: result?.tech_rectangular,
  //       Cube: result?.tech_cube,
  //       Cylinder: result?.tech_cylinder,
  //       Cone: result?.tech_cone,
  //       Sphere: result?.tech_sphere,
  //       Triangular: result?.tech_triangular,
  //       Pyramid: result?.tech_pyramid,
  //       Capsule: result?.tech_capsule,
  //       Hemisphere: result?.tech_hemisphere,
  //       Hollow: result?.tech_hollow,
  //       Conical: result?.tech_conical,
  //       Truncated: result?.tech_truncated,
  //       Ellipsoid: result?.tech_ellipsoid,
  //       Square: result?.tech_square,
  //       Column: result?.tech_column,
  //     };

  //     return Number(volumes[type] || 0).toFixed(2);
  //   };

  const volumeInAllUnits = () => {
    const baseValue = parseFloat(getVolumeValue());

    const multipliers = {
      "mm³": 1000,
      "dm³": 0.001,
      "m³": 0.000001,
      "cu in": 0.061,
      "cu ft": 0.0000353,
      "cu yd": 0.000001308,
    };

    return Object.entries(multipliers).map(([unit, multiplier]) => (
      <td key={unit} className="border-b py-2">
        {isNaN(baseValue) ? "-" : (baseValue * multiplier).toFixed(3)}
      </td>
    ));
  };

  const volumeUnits = ["in³", "cm³", "m³", "ft³", "yd³"];

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 ">
                <div className="row">
                  <div className="col-lg-12">
                    <label htmlFor="tech_volume_select" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_volume_select"
                        id="tech_volume_select"
                        value={formData.tech_volume_select}
                        onChange={handleChange}
                      >
                        <option value="Rectangular">Rectangular Box</option>
                        <option value="Cube">Cube </option>
                        <option value="Cylinder">Cylinder </option>
                        <option value="Cone">Cone </option>
                        <option value="Sphere">Sphere </option>
                        <option value="Triangular">Triangular Prism </option>
                        <option value="Pyramid">Pyramid </option>
                        <option value="Capsule">Capsule </option>
                        <option value="Hemisphere">Hemisphere </option>
                        <option value="Hollow">Hollow cylinder / tube </option>
                        <option value="Conical">Conical frustum </option>
                        <option value="Truncated">Truncated pyramid </option>
                        <option value="Ellipsoid">Ellipsoid </option>
                        <option value="Square">Square </option>
                        <option value="Column">Column </option>
                      </select>
                    </div>
                  </div>
                  {formData.tech_volume_select == "Rectangular" && (
                    <>
                      <div className="col-12 " id="Rectangular">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_rec_width" className="label">
                              {data?.payload?.tech_lang_keys["2"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_rec_width"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_rec_width}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown}
                              >
                                {formData.tech_rec_width_units} ▾
                              </label>
                              {dropdownVisible && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                          <div className="col-lg-12 col-6 ps-lg-0 ps-0">
                            <label htmlFor="tech_rec_length" className="label">
                              {data?.payload?.tech_lang_keys["3"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_rec_length"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_rec_length}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown1}
                              >
                                {formData.tech_rec_length_units} ▾
                              </label>
                              {dropdownVisible1 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler1(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_rec_height" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_rec_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_rec_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown2}
                              >
                                {formData.tech_rec_height_units} ▾
                              </label>
                              {dropdownVisible2 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler2(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Cube" && (
                    <>
                      <div className="col-lg-12 " id="Cube">
                        <label htmlFor="tech_cub_side" className="label">
                          {data?.payload?.tech_lang_keys["5"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_cub_side"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_cub_side}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_cub_side_units} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "inches (in)", value: "in" },
                                { label: "feet (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
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
                  {formData.tech_volume_select == "Cylinder" && (
                    <>
                      <div className="col-12 " id="Cylinder">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_cyl_height" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_cyl_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_cyl_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown4}
                              >
                                {formData.tech_cyl_height_units} ▾
                              </label>
                              {dropdownVisible4 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler4(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6">
                            <label
                              htmlFor="tech_cyl_diameter"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["6"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_cyl_diameter"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_cyl_diameter}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown5}
                              >
                                {formData.tech_cyl_diameter_units} ▾
                              </label>
                              {dropdownVisible5 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler5(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Cone" && (
                    <>
                      <div className="col-12 " id="Cone">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_con_height" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_con_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_con_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown6}
                              >
                                {formData.tech_con_height_units} ▾
                              </label>
                              {dropdownVisible6 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler6(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6">
                            <label
                              htmlFor="tech_con_diameter"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["6"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_con_diameter"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_con_diameter}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown7}
                              >
                                {formData.tech_con_diameter_units} ▾
                              </label>
                              {dropdownVisible7 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler7(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Triangular" && (
                    <>
                      <div className="" id="Triangular">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_tri_base" className="label">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["3"]} a
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_tri_base"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_tri_base}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown8}
                              >
                                {formData.tech_tri_base_units} ▾
                              </label>
                              {dropdownVisible8 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler8(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6">
                            <label htmlFor="tech_tri_length" className="label">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["3"]} b
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_tri_length"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_tri_length}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown9}
                              >
                                {formData.tech_tri_length_units} ▾
                              </label>
                              {dropdownVisible9 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler9(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_tri_height" className="label">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["3"]} c
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_tri_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_tri_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown10}
                              >
                                {formData.tech_tri_height_units} ▾
                              </label>
                              {dropdownVisible10 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler10(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6">
                            <label htmlFor="tech_tri_h" className="label">
                              {data?.payload?.tech_lang_keys["4"]} h
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_tri_h"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_tri_h}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown11}
                              >
                                {formData.tech_tri_h_units} ▾
                              </label>
                              {dropdownVisible11 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Sphere" && (
                    <>
                      <div className="col-12 " id="Sphere">
                        <label htmlFor="tech_sph_diameter" className="label">
                          {data?.payload?.tech_lang_keys["6"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_sph_diameter"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_sph_diameter}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown12}
                          >
                            {formData.tech_sph_diameter_units} ▾
                          </label>
                          {dropdownVisible12 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "inches (in)", value: "in" },
                                { label: "feet (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler12(unit.value)}
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
                  {formData.tech_volume_select == "Pyramid" && (
                    <>
                      <div className="" id="Pyramid">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_pyr_height" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_pyr_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_pyr_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown13}
                              >
                                {formData.tech_pyr_height_units} ▾
                              </label>
                              {dropdownVisible13 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler13(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6">
                            <label htmlFor="tech_pyr_side" className="label">
                              {data?.payload?.tech_lang_keys["5"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_pyr_side"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_pyr_side}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown14}
                              >
                                {formData.tech_pyr_side_units} ▾
                              </label>
                              {dropdownVisible14 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler14(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Capsule" && (
                    <>
                      <div className="" id="Capsule">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_cap_height" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_cap_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_cap_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown15}
                              >
                                {formData.tech_cap_height_units} ▾
                              </label>
                              {dropdownVisible15 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                          <div className="col-lg-12 col-6">
                            <label htmlFor="tech_cap_radius" className="label">
                              {data?.payload?.tech_lang_keys["19"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_cap_radius"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_cap_radius}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown16}
                              >
                                {formData.tech_cap_radius_units} ▾
                              </label>
                              {dropdownVisible16 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Hemisphere" && (
                    <>
                      <div className="col-12 " id="Hemisphere">
                        <label htmlFor="tech_hem_radius" className="label">
                          {data?.payload?.tech_lang_keys["19"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_hem_radius"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_hem_radius}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown17}
                          >
                            {formData.tech_hem_radius_units} ▾
                          </label>
                          {dropdownVisible17 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "inches (in)", value: "in" },
                                { label: "feet (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
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
                    </>
                  )}
                  {formData.tech_volume_select == "Hollow" && (
                    <>
                      <div className="" id="Hollow">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label
                              htmlFor="tech_hol_inner_dia"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["22"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_hol_inner_dia"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_hol_inner_dia}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown18}
                              >
                                {formData.tech_hol_inner_dia_units} ▾
                              </label>
                              {dropdownVisible18 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler18(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6">
                            <label
                              htmlFor="tech_hol_outer_dia"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["23"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_hol_outer_dia"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_hol_outer_dia}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown19}
                              >
                                {formData.tech_hol_outer_dia_units} ▾
                              </label>
                              {dropdownVisible19 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_hol_height" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_hol_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_hol_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown20}
                              >
                                {formData.tech_hol_height_units} ▾
                              </label>
                              {dropdownVisible20 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Conical" && (
                    <>
                      <div className="" id="Conical">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_coni_top_r" className="label">
                              {data?.payload?.tech_lang_keys["25"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_coni_top_r"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_coni_top_r}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown21}
                              >
                                {formData.tech_coni_top_r_units} ▾
                              </label>
                              {dropdownVisible21 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler21(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6">
                            <label
                              htmlFor="tech_coni_bottom_r"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["26"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_coni_bottom_r"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_coni_bottom_r}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown22}
                              >
                                {formData.tech_coni_bottom_r_units} ▾
                              </label>
                              {dropdownVisible22 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler22(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_coni_height" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_coni_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_coni_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown23}
                              >
                                {formData.tech_coni_height_units} ▾
                              </label>
                              {dropdownVisible23 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Truncated" && (
                    <>
                      <div className="" id="Truncated">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label
                              htmlFor="tech_tru_base_side"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["29"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_tru_base_side"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_tru_base_side}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown24}
                              >
                                {formData.tech_tru_base_side_units} ▾
                              </label>
                              {dropdownVisible24 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                          <div className="col-lg-12 col-6">
                            <label
                              htmlFor="tech_tru_top_side"
                              className="label"
                            >
                              {data?.payload?.tech_lang_keys["28"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_tru_top_side"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_tru_top_side}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown25}
                              >
                                {formData.tech_tru_top_side_units} ▾
                              </label>
                              {dropdownVisible25 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler25(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_tru_height" className="label">
                              {data?.payload?.tech_lang_keys["31"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_tru_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_tru_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown26}
                              >
                                {formData.tech_tru_height_units} ▾
                              </label>
                              {dropdownVisible26 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler26(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Ellipsoid" && (
                    <>
                      <div className="" id="Ellipsoid">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_ell_sem_a" className="label">
                              {data?.payload?.tech_lang_keys["31"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_ell_sem_a"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_ell_sem_a}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown27}
                              >
                                {formData.tech_ell_sem_a_units} ▾
                              </label>
                              {dropdownVisible27 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                          <div className="col-lg-12 col-6">
                            <label htmlFor="tech_ell_sem_b" className="label">
                              {data?.payload?.tech_lang_keys["32"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_ell_sem_b"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_ell_sem_b}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown28}
                              >
                                {formData.tech_ell_sem_b_units} ▾
                              </label>
                              {dropdownVisible28 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_ell_sem_c" className="label">
                              {data?.payload?.tech_lang_keys["33"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_ell_sem_c"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_ell_sem_c}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown29}
                              >
                                {formData.tech_ell_sem_c_units} ▾
                              </label>
                              {dropdownVisible29 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler29(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Column" && (
                    <>
                      <div className="" id="Column">
                        <div className="row">
                          <div className="col-lg-12 col-6 pe-lg-0 pe-2">
                            <label htmlFor="tech_col_radi" className="label">
                              {data?.payload?.tech_lang_keys["19"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_col_radi"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_col_radi}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown30}
                              >
                                {formData.tech_col_radi_units} ▾
                              </label>
                              {dropdownVisible30 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler30(unit.value)
                                      }
                                    >
                                      {unit.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-12 col-6">
                            <label htmlFor="tech_col_height" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_col_height"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_col_height}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown31}
                              >
                                {formData.tech_col_height_units} ▾
                              </label>
                              {dropdownVisible31 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "centimeters (cm)", value: "cm" },
                                    { label: "meters (m)", value: "m" },
                                    { label: "inches (in)", value: "in" },
                                    { label: "feet (ft)", value: "ft" },
                                    { label: "yards (yd)", value: "yd" },
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
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_volume_select == "Square" && (
                    <>
                      <div className="col-12 " id="Square">
                        <label htmlFor="tech_square" className="label">
                          {data?.payload?.tech_lang_keys["35"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_square"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_square}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown32}
                          >
                            {formData.tech_square_units} ▾
                          </label>
                          {dropdownVisible32 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "centimeters (cm)", value: "cm" },
                                { label: "meters (m)", value: "m" },
                                { label: "inches (in)", value: "in" },
                                { label: "feet (ft)", value: "ft" },
                                { label: "yards (yd)", value: "yd" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler32(unit.value)}
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
              <div className="col-span-12 md:col-span-6  flex items-center ps-lg-3 justify-center">
                {formData.tech_volume_select == "Rectangular" && (
                  <>
                    <img
                      src="/images/rectangular_v_new.png"
                      loading="lazy"
                      alt="Rectangular"
                      className="ms-5 max-rec_length "
                      width="250px"
                      height="180px"
                      id="Rectangular_img"
                    />
                  </>
                )}
                {formData.tech_volume_select == "Cube" && (
                  <>
                    <img
                      src="/images/cube_v.png"
                      loading="lazy"
                      alt="Cube"
                      width="177px"
                      id="Cube_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Cylinder" && (
                  <>
                    <img
                      src="/images/cylinder_v.png"
                      loading="lazy"
                      alt="Cylinder"
                      width="143px"
                      id="Cylinder_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Cone" && (
                  <>
                    <img
                      src="/images/cone_v.png"
                      loading="lazy"
                      alt="Cone"
                      width="107px"
                      id="Cone_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Sphere" && (
                  <>
                    <img
                      src="/images/sphere_v.png"
                      loading="lazy"
                      alt="Sphere"
                      height="150px"
                      width="151px"
                      id="Sphere_img"
                      className="mt-3 "
                    />
                  </>
                )}
                {formData.tech_volume_select == "Triangular" && (
                  <>
                    <img
                      src="/images/triangular_v1.webp"
                      loading="lazy"
                      alt="Triangular"
                      width="185px"
                      id="Triangular_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Pyramid" && (
                  <>
                    <img
                      src="/images/pyramid_v.png"
                      loading="lazy"
                      alt="Pyramid"
                      width="205px"
                      id="Pyramid_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Capsule" && (
                  <>
                    <img
                      src="/images/capsule_v.png"
                      loading="lazy"
                      alt="Capsule"
                      width="126px"
                      id="Capsule_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Hemisphere" && (
                  <>
                    <img
                      src="/images/hemisphere_v.png"
                      loading="lazy"
                      alt="Hemisphere"
                      width="200px"
                      id="Hemisphere_img"
                      className="ms-4 mt-3 "
                    />
                  </>
                )}
                {formData.tech_volume_select == "Hollow" && (
                  <>
                    <img
                      src="/images/hollow_v.png"
                      loading="lazy"
                      alt="Hollow"
                      width="144px"
                      id="Hollow_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Conical" && (
                  <>
                    <img
                      src="/images/conical_v.png"
                      loading="lazy"
                      alt="Conical"
                      width="209px"
                      id="Conical_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Truncated" && (
                  <>
                    <img
                      src="/images/truncated_v.png"
                      loading="lazy"
                      alt="Truncated"
                      width="270px"
                      id="Truncated_img"
                      className="ms-5 "
                    />
                  </>
                )}
                {formData.tech_volume_select == "Ellipsoid" && (
                  <>
                    <img
                      src="/images/ellipsoid_v.png"
                      loading="lazy"
                      alt="Ellipsoid"
                      width="145px"
                      id="Ellipsoid_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Column" && (
                  <>
                    <img
                      src="/images/column_v.png"
                      loading="lazy"
                      alt="column"
                      width="143px"
                      id="Column_img"
                      className=""
                    />
                  </>
                )}
                {formData.tech_volume_select == "Square" && (
                  <>
                    <img
                      src="/images/square_v.png"
                      loading="lazy"
                      alt="square"
                      height="150px"
                      width="260px"
                      id="Square_img"
                      className="ms-5 mt-3 "
                    />
                  </>
                )}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mt-3">
                        <div className="w-full md:w-[100%] lg:w-[80%] overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="border-b w-[60%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["8"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2 flex justify-end items-center">
                                  <div className="flex">
                                    <div id="circle_result">
                                      {convertedResult}
                                    </div>
                                    <select
                                      id="onetw"
                                      className="ms-2"
                                      style={{ width: "100px" }}
                                      value={selectedUnit}
                                      onChange={(e) =>
                                        setSelectedUnit(e.target.value)
                                      }
                                    >
                                      {Object.keys(conversionFactors).map(
                                        (unit) => (
                                          <option key={unit} value={unit}>
                                            {unit}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* <p className="text-[20px] text-center mt-2">
                                        {data?.payload?.tech_lang_keys["9"]}
                                      </p> */}

                          {/* <table className="text-[16px] w-full">
                                        <thead>
                                          <tr>
                                            {["mm³", "dm³", "m³", "cu in", "cu ft", "cu yd"].map((unit) => (
                                              <td key={unit} className="border-b py-2 font-bold">
                                                {unit}
                                              </td>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>{volumeInAllUnits()}</tr>
                                        </tbody>
                                      </table> */}
                        </div>

                        <div className="w-full">
                          {formData?.tech_volume_select == "Rectangular" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}:
                              </p>

                              {/* Formula: V = l × w × h */}
                              <BlockMath
                                math={`V = \\text{length} \\times \\text{width} \\times \\text{height}`}
                              />

                              {/* Substituted values */}
                              <BlockMath
                                math={`V = ${
                                  formData?.tech_rec_length || 0
                                } \\times ${
                                  formData?.tech_rec_width || 0
                                } \\times ${formData?.tech_rec_height || 0}`}
                              />

                              {/* Final calculated volume */}
                              <BlockMath
                                math={`V = ${(
                                  parseFloat(result?.tech_rectangular) || 0
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Cube" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["13"]}:
                              </p>

                              <BlockMath
                                math={`V = \\text{Side} \\times \\text{Side} \\times \\text{Side}`}
                              />
                              <BlockMath
                                math={`V = ${formData?.tech_cub_side} \\times ${formData?.tech_cub_side} \\times ${formData?.tech_cub_side}`}
                              />
                              <BlockMath
                                math={`V = ${(
                                  parseFloat(result?.tech_cube) || 0
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Cylinder" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["14"]}:
                              </p>

                              <BlockMath math={`V = \\pi r^2 h`} />
                              <BlockMath math={`r = d / 2`} />
                              <BlockMath
                                math={`r = ${formData?.tech_cyl_diameter} / 2`}
                              />
                              <BlockMath math={`r = ${result?.tech_radius}`} />
                              <BlockMath
                                math={`V = \\pi \\times ${result?.tech_radius}^2 \\times ${formData?.tech_cyl_height}`}
                              />
                              <BlockMath
                                math={`V = ${(
                                  parseFloat(result?.tech_cylinder) || 0
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Cone" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["15"]}:
                              </p>

                              <BlockMath math={`V = \\frac{1}{3} \\pi r^2 h`} />
                              <BlockMath math={`r = d / 2`} />
                              <BlockMath
                                math={`r = ${formData?.tech_con_diameter} / 2`}
                              />
                              <BlockMath math={`r = ${result?.tech_radius}`} />
                              <BlockMath
                                math={`V = \\frac{1}{3} \\times 3.14 \\times ${result?.tech_radius}^2 \\times ${formData?.tech_con_height}`}
                              />
                              <BlockMath
                                math={`V = ${(
                                  parseFloat(result?.tech_cone) || 0
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Sphere" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["16"]}:
                              </p>

                              <BlockMath math={`V = \\frac{4}{3} \\pi r^3`} />
                              <BlockMath math={`r = d / 2`} />
                              <BlockMath
                                math={`r = ${formData?.tech_sph_diameter} / 2`}
                              />
                              <BlockMath math={`r = ${result?.tech_radius}`} />
                              <BlockMath
                                math={`V = \\frac{4}{3} \\times 3.14 \\times ${result?.tech_radius}^3`}
                              />
                              <BlockMath
                                math={`V = ${(
                                  parseFloat(result?.tech_sphere) || 0
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Triangular" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["17"]}:
                              </p>

                              <BlockMath
                                math={`V = \\frac{1}{4}h \\sqrt{(a + b + c)(b + c - a)(c + a - b)(a + b - c)}`}
                              />

                              <BlockMath
                                math={
                                  `V = \\frac{1}{4}(${formData?.tech_tri_h}) \\sqrt{(${formData?.tech_tri_base} + ${formData?.tech_tri_length} + ${formData?.tech_tri_height})` +
                                  `(${formData?.tech_tri_length} + ${formData?.tech_tri_height} - ${formData?.tech_tri_base})` +
                                  `(${formData?.tech_tri_height} + ${formData?.tech_tri_base} - ${formData?.tech_tri_length})` +
                                  `(${formData?.tech_tri_base} + ${formData?.tech_tri_length} - ${formData?.tech_tri_height})}`
                                }
                              />

                              <BlockMath
                                math={`V = \\frac{1}{4}(${formData?.tech_tri_h}) \\sqrt{${result?.tech_baseArea}}`}
                              />

                              <BlockMath
                                math={`V = ${(
                                  parseFloat(result?.tech_triangular) || 0
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Pyramid" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["18"]}:
                              </p>

                              <BlockMath
                                math={`V = \\frac{1}{3} \\times \\text{base area} \\times \\text{height}`}
                              />

                              <BlockMath
                                math={`\\text{Base Area} = 0.33 \\times \\text{side} \\times \\text{side}`}
                              />

                              <BlockMath
                                math={`\\text{Base Area} = 0.33 \\times ${formData?.tech_pyr_side} \\times ${formData?.tech_pyr_side}`}
                              />

                              <BlockMath
                                math={`\\text{Base Area} = ${result?.tech_baseArea}`}
                              />

                              <BlockMath
                                math={`V = \\frac{1}{3} \\times ${result?.tech_baseArea} \\times ${formData?.tech_pyr_height}`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_pyramid
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Capsule" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["20"]}:
                              </p>

                              <BlockMath
                                math={`V = \\pi r^2 \\left( \\frac{4}{3} r + h \\right)`}
                              />

                              <BlockMath
                                math={`V = 3.14 \\times ${formData?.tech_cap_radius}^2 \\left( \\frac{4}{3} \\times ${formData?.tech_cap_radius} + ${formData?.tech_cap_height} \\right)`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_capsule
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Hemisphere" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["21"]}:
                              </p>

                              <BlockMath math={`V = \\frac{2}{3} \\pi r^3`} />

                              <BlockMath
                                math={`V = \\frac{2}{3} \\times 3.14 \\times ${formData?.tech_hem_radius}^3`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_hemisphere
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Hollow" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["24"]}:
                              </p>

                              <BlockMath
                                math={`V = \\pi \\cdot h \\cdot \\frac{(R_{\\text{outer}}^2 - R_{\\text{inner}}^2)}{4}`}
                              />

                              <BlockMath
                                math={`V = 3.14 \\times ${formData?.tech_hol_height} \\times \\frac{(${formData?.tech_hol_outer_dia}^2 - ${formData?.tech_hol_inner_dia}^2)}{4}`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_hollow
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Conical" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["27"]}:
                              </p>

                              <BlockMath
                                math={`V = \\frac{h}{3} \\left( A_t + A_b + \\sqrt{A_t \\cdot A_b} \\right)`}
                              />

                              <BlockMath
                                math={`V = \\frac{${formData?.tech_coni_height}}{3} \\left( ${formData?.tech_coni_top_r} + ${formData?.tech_coni_bottom_r} + \\sqrt{${formData?.tech_coni_top_r} \\times ${formData?.tech_coni_bottom_r}} \\right)`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_conical
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Truncated" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["30"]}:
                              </p>

                              <BlockMath
                                math={`V = \\frac{1}{3} \\times h \\left(A_1 + A_2 + \\sqrt{A_1 \\cdot A_2}\\right)`}
                              />

                              <BlockMath
                                math={`V = \\frac{1}{3} \\times ${formData?.tech_tru_height} \\left(${formData?.tech_tru_top_side} + ${formData?.tech_tru_base_side} + \\sqrt{${formData?.tech_tru_top_side} \\times ${formData?.tech_tru_base_side}}\\right)`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_truncated
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Ellipsoid" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["34"]}:
                              </p>

                              <BlockMath math={`V = \\frac{4}{3} \\pi abc`} />

                              <BlockMath
                                math={`V = \\frac{4}{3} \\times 3.14 \\times ${formData?.tech_ell_sem_a} \\times ${formData?.tech_ell_sem_b} \\times ${formData?.tech_ell_sem_c}`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_ellipsoid
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Square" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["36"]}:
                              </p>

                              <BlockMath
                                math={`V = \\text{Side} \\times \\text{Side} \\times \\text{Side}`}
                              />

                              <BlockMath
                                math={`V = ${formData?.tech_square} \\times ${formData?.tech_square} \\times ${formData?.tech_square}`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_square
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : formData?.tech_volume_select == "Column" ? (
                            <>
                              <p className="mt-2 font-bold">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["37"]}:
                              </p>

                              <BlockMath
                                math={`V = \\pi \\cdot r^2 \\cdot h`}
                              />

                              <BlockMath
                                math={`V = \\pi \\cdot ${formData?.tech_col_radi}^2 \\cdot ${formData?.tech_col_height}`}
                              />

                              <BlockMath
                                math={`V = ${Number(
                                  result?.tech_column
                                ).toFixed(2)}\\ \\text{cm}^3`}
                              />
                            </>
                          ) : null}
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

export default VolumeCalculator;
