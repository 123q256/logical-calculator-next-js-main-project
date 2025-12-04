"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useMoleRatioCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import "../../../../components/styles/CssOrderOfOperationsCalculator.css";

const MoleRatioCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  let url = parts.length === 1 ? parts[0] : parts[0] + "/" + parts[1];

  // RTK Query mutations
  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const [
    moleRatioCalculator,
    { isLoading: calculateLoading, isError: calculateError },
  ] = useMoleRatioCalculatorMutation();

  const [currentPath, setCurrentPath] = useState("");
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    tech_find: "1",
    tech_first_coefficient: ["4", "8"],
    tech_moles: ["", "8"],
    tech_first_product: ["2", "5"],
    tech_moles_products: ["2", ""],
  });

  // Dynamic field counters
  const [additionalReactants, setAdditionalReactants] = useState([]);
  const [additionalProducts, setAdditionalProducts] = useState([]);

  // Atomic mass options
  const atomicMassOptions = [
    { value: "1", label: "Atomic mass amu" },
    { value: "1.00784", label: "H (Hydrogen)" },
    { value: "4.002602", label: "He (Helium)" },
    { value: "6.941", label: "Li (Lithium)" },
    { value: "9.0122", label: "Be (Beryllium)" },
    { value: "10.811", label: "B (Boron)" },
    { value: "12.011", label: "C (Carbon)" },
    { value: "14.0067", label: "N (Nitrogen)" },
    { value: "15.9994", label: "O (Oxygen)" },
    { value: "18.998403", label: "F (Fluorine)" },
    { value: "20.179", label: "Ne (Neon)" },
    { value: "22.98977", label: "Na (Sodium)" },
    { value: "24.305", label: "Mg (Magnesium)" },
    { value: "26.98154", label: "Al (Aluminium)" },
    { value: "28.0855", label: "Si (Silicon)" },
    { value: "30.97376", label: "P (Phosphorus)" },
    { value: "32.06", label: "S (Sulfur)" },
    { value: "35.453", label: "Cl (Chlorine)" },
    { value: "39.948", label: "Ar (Argon)" },
    { value: "39.0983", label: "K (Potassium)" },
    { value: "40.08", label: "Ca (Calcium)" },
    { value: "44.9559", label: "Sc (Scandium)" },
    { value: "47.90", label: "Ti (Titanium)" },
    { value: "50.9415", label: "V (Vanadium)" },
    { value: "51.996", label: "Cr (Chromium)" },
    { value: "54.9380", label: "Mn (Manganese)" },
    { value: "55.847", label: "Fe (Iron)" },
    { value: "58.9332", label: "Co (Cobalt)" },
    { value: "58.70", label: "Ni (Nickel)" },
    { value: "63.546", label: "Cu (Copper)" },
    { value: "65.38", label: "Zn (Zinc)" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSingleCalculatorDetails({ tech_calculator_link: url });
        setCurrentPath(window.location.pathname);

        // Fetch currency
        const currencyResult = await getUserCurrency();
        if (currencyResult) {
          setCurrency(currencyResult);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
    setResult(null);
  };

  const handleAddReactant = () => {
    if (additionalReactants.length < 3) {
      const newReactant = {
        id: Date.now(),
        coefficient: "",
        moles: "",
      };
      setAdditionalReactants((prev) => [...prev, newReactant]);
    } else {
      toast.error("Only five fields are allowed");
    }
  };

  const handleRemoveReactant = (id) => {
    setAdditionalReactants((prev) =>
      prev.filter((reactant) => reactant.id !== id)
    );
  };

  const handleReactantChange = (id, field, value) => {
    setAdditionalReactants((prev) =>
      prev.map((reactant) =>
        reactant.id === id ? { ...reactant, [field]: value } : reactant
      )
    );
    setResult(null);
  };

  const handleAddProduct = () => {
    if (additionalProducts.length < 3) {
      const newProduct = {
        id: Date.now(),
        coefficient: "",
        moles: "",
      };
      setAdditionalProducts((prev) => [...prev, newProduct]);
    } else {
      toast.error("Only five fields are allowed");
    }
  };

  const handleRemoveProduct = (id) => {
    setAdditionalProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );
  };

  const handleProductChange = (id, field, value) => {
    setAdditionalProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.tech_first_coefficient[0] ||
      !formData.tech_first_coefficient[1]
    ) {
      setFormError("Please fill in required fields");
      return;
    }

    setFormError("");
    try {
      // Combine main reactants with additional reactants
      const allReactants = [
        ...formData.tech_first_coefficient,
        ...additionalReactants.map((r) => r.coefficient),
      ]
        .filter((val) => val !== "")
        .map(Number);

      const allProducts = [
        ...formData.tech_first_product,
        ...additionalProducts.map((p) => p.coefficient),
      ]
        .filter((val) => val !== "")
        .map(Number);

      const allMoles = [
        ...formData.tech_moles,
        ...additionalReactants.map((r) => r.moles),
      ]
        .filter((val) => val !== "")
        .map(Number);

      const payload = {
        tech_find: formData.tech_find,
        tech_first_coefficient: allReactants,
        tech_first_product: allProducts,
        tech_moles: allMoles,
        ...(formData.tech_find === "3" && {
          tech_molecular_weight: formData.molecular_weight,
          tech_first_value_unit: formData.first_value_unit,
          tech_mass_first_reactant: formData.mass_first_reactant,
        }),
      };

      const response = await moleRatioCalculator(payload).unwrap();
      setResult(response?.payload);
      toast.success("Calculated Successfully");
    } catch (err) {
      const errorMsg = err.data?.payload?.error || "Calculation failed";
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_find: "1",
      tech_first_coefficient: ["4", "8"],
      tech_moles: ["", "8"],
      tech_first_product: ["2", "5"],
      tech_moles_products: ["2", ""],
    });
    setAdditionalReactants([]);
    setAdditionalProducts([]);
    setResult(null);
    setFormError("");
  };

  // Helper function to get reactant name
  const getReactantName = (index) => {
    const names = ["First", "Second", "Third", "Fourth", "Fifth"];
    return `${names[index]} Reactant`;
  };

  // Helper function to get product name
  const getProductName = (index) => {
    const names = ["First", "Second", "Third", "Fourth", "Fifth"];
    return `${names[index]} Product`;
  };

  // Calculate GCD for ratio simplification
  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    if (a < b) [b, a] = [a, b];
    if (b === 0) return a;
    let r = a % b;
    while (r > 0) {
      a = b;
      b = r;
      r = a % b;
    }
    return b;
  };

  const simplify = (num, den) => {
    const g = gcd(num, den);
    return [num / g, den / g];
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-2 md:gap-4">
              {/* Find Selector */}
              <div className="col-span-12  input-field px-2 finch">
                <label htmlFor="tech_find" className="label text-blue">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="w-full py-2 position-relative">
                  <select
                    name="tech_find"
                    id="tech_find"
                    className="input"
                    value={formData.tech_find}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>

              {/* First Reactant */}
              <div className="col-span-6  px-2">
                <p>
                  <strong className="label text-blue">First Reactant</strong>
                </p>
                <label
                  htmlFor="first_coefficient_0"
                  className="label text-blue"
                >
                  Coefficient in balanced reaction:
                </label>
                <div className="w-full py-2 position-relative">
                  <input
                    type="number"
                    step="any"
                    name="first_coefficient_0"
                    id="first_reactant"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_first_coefficient[0]}
                    onChange={(e) =>
                      handleArrayChange(
                        "tech_first_coefficient",
                        0,
                        e.target.value
                      )
                    }
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </div>

              <div
                className={`col-span-6  px-2 moles_one ${
                  formData.tech_find !== "1" ? "" : "hidden"
                }`}
              >
                <p>
                  <strong className="label text-blue">&nbsp;</strong>
                </p>
                <label htmlFor="moles_0" className="label text-blue">
                  Number of moles or molecules:
                </label>
                <div className="w-full py-2 position-relative">
                  <input
                    type="number"
                    step="any"
                    name="moles_0"
                    id="mole_one"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_moles[0]}
                    onChange={(e) =>
                      handleArrayChange("tech_moles", 0, e.target.value)
                    }
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </div>

              {/* Molecular Weight Section - Only shown when tech_find is "3" */}
              {formData.tech_find === "3" && (
                <div className="col-span-12  input-field whole">
                  <div className="grid grid-cols-12 gap-2 md:gap-4">
                    <div className="col-span-6  px-2">
                      <label
                        htmlFor="molecular_weight"
                        className="label text-blue"
                      >
                        Molecular Weight:
                      </label>
                      <div className="w-full py-2 position-relative">
                        <input
                          type="number"
                          step="any"
                          name="molecular_weight"
                          id="molecular_weight"
                          className="input"
                          aria-label="input"
                          placeholder="00"
                          value={formData.molecular_weight}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-6  px-2">
                      <label
                        htmlFor="mass_first_reactant"
                        className="label text-blue"
                      >
                        Mass of First Reactant:
                      </label>
                      <div className="w-full py-2 position-relative">
                        <input
                          type="number"
                          step="any"
                          name="mass_first_reactant"
                          id="mass_one"
                          className="input"
                          aria-label="input"
                          placeholder="00"
                          value={formData.mass_first_reactant}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Second Reactant */}
              <div className="col-span-6  px-2">
                <p>
                  <strong className="label text-blue">Second Reactant</strong>
                </p>
                <label
                  htmlFor="first_coefficient_1"
                  className="label text-blue"
                >
                  Coefficient in balanced reaction:
                </label>
                <div className="w-full py-2 position-relative">
                  <input
                    type="number"
                    step="any"
                    name="first_coefficient_1"
                    id="second_reactant"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_first_coefficient[1]}
                    onChange={(e) =>
                      handleArrayChange(
                        "tech_first_coefficient",
                        1,
                        e.target.value
                      )
                    }
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </div>

              <div
                className={`col-span-6  px-2 moles_two ${
                  formData.tech_find !== "1" ? "" : "hidden"
                }`}
              >
                <p>
                  <strong className="label text-blue">&nbsp;</strong>
                </p>
                <label htmlFor="moles_1" className="label text-blue">
                  Number of moles or molecules:
                </label>
                <div className="w-full py-2 position-relative">
                  <input
                    type="number"
                    step="any"
                    name="moles_1"
                    id="mole_two"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_moles[1]}
                    onChange={(e) =>
                      handleArrayChange("tech_moles", 1, e.target.value)
                    }
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </div>

              {/* Additional Reactants */}
              {additionalReactants.map((reactant, index) => (
                <div key={reactant.id} className="col-span-6  ">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 items-end">
                    <div className="col-span-12 px-2">
                      <p>
                        <strong className="label text-blue">
                          {getReactantName(index + 2)}
                        </strong>
                      </p>
                      <div className="flex justify-between">
                        <div className="">
                          <label className="label text-blue">
                            Coefficient in balanced reaction:
                          </label>
                        </div>
                        <div className="cursor-pointer">
                          <button
                            type="button"
                            className="bg-red-500  cursor-pointer text-white rounded-lg px-2 py-1 hover:bg-red-600 transition-colors duration-200"
                            onClick={() => handleRemoveReactant(reactant.id)}
                          >
                            x
                          </button>
                        </div>
                      </div>

                      <div className="w-full py-2 position-relative">
                        <input
                          type="number"
                          step="any"
                          className="input"
                          placeholder="00"
                          value={reactant.coefficient}
                          onChange={(e) =>
                            handleReactantChange(
                              reactant.id,
                              "coefficient",
                              e.target.value
                            )
                          }
                          onKeyPress={(e) =>
                            !/[0-9]/.test(e.key) && e.preventDefault()
                          }
                        />
                      </div>
                    </div>
                    {formData.tech_find !== "1" && (
                      <div className="col-span-12 px-2">
                        <p>
                          <strong className="label text-blue">&nbsp;</strong>
                        </p>
                        <label className="label text-blue">
                          Number of moles or molecules:
                        </label>
                        <div className="w-full py-2 position-relative">
                          <input
                            type="number"
                            step="any"
                            className="input"
                            placeholder="00"
                            value={reactant.moles}
                            onChange={(e) =>
                              handleReactantChange(
                                reactant.id,
                                "moles",
                                e.target.value
                              )
                            }
                            onKeyPress={(e) =>
                              !/[0-9]/.test(e.key) && e.preventDefault()
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Reactant Button */}
              <div className="col-span-12  my-2">
                <button
                  type="button"
                  className="bg-[#2845F5] border cursor-pointer text-[#fff] rounded-lg px-4 py-2 transition-colors duration-200"
                  onClick={handleAddReactant}
                >
                  <strong className="text-blue">+ Add Reactants</strong>
                </button>
              </div>

              {/* Products Section */}
              <div className="col-span-6  px-2">
                <p>
                  <strong className="label text-blue">First Product</strong>
                </p>
                <label htmlFor="first_product_0" className="label text-blue">
                  Coefficient in balanced reaction:
                </label>
                <div className="w-full py-2 position-relative">
                  <input
                    type="number"
                    step="any"
                    name="first_product_0"
                    id="first_product"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_first_product[0]}
                    onChange={(e) =>
                      handleArrayChange("tech_first_product", 0, e.target.value)
                    }
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </div>

              <div
                className={`col-span-6  px-2 moles_one ${
                  formData.tech_find !== "1" ? "" : "hidden"
                }`}
              >
                <p>
                  <strong className="label text-blue">&nbsp;</strong>
                </p>
                <label htmlFor="moles_products_0" className="label text-blue">
                  Number of moles or molecules:
                </label>
                <div className="w-full py-2 position-relative">
                  <input
                    type="number"
                    step="any"
                    name="moles_products_0"
                    id="baristow"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_moles_products[0]}
                    onChange={(e) =>
                      handleArrayChange(
                        "tech_moles_products",
                        0,
                        e.target.value
                      )
                    }
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </div>

              {/* Second Product */}
              <div className="col-span-6  px-2">
                <p>
                  <strong className="label text-blue">Second Product</strong>
                </p>
                <label htmlFor="first_product_1" className="label text-blue">
                  Coefficient in balanced reaction:
                </label>
                <div className="w-full py-2 position-relative">
                  <input
                    type="number"
                    step="any"
                    name="first_product_1"
                    id="second_product"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_first_product[1]}
                    onChange={(e) =>
                      handleArrayChange("tech_first_product", 1, e.target.value)
                    }
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </div>

              <div
                className={`col-span-6  px-2 moles_two ${
                  formData.tech_find !== "1" ? "" : "hidden"
                }`}
              >
                <p>
                  <strong className="label text-blue">&nbsp;</strong>
                </p>
                <label htmlFor="moles_products_1" className="label text-blue">
                  Number of moles or molecules:
                </label>
                <div className="w-full py-2 position-relative">
                  <input
                    type="number"
                    step="any"
                    name="moles_products_1"
                    id="baristow2"
                    className="input"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_moles_products[1]}
                    onChange={(e) =>
                      handleArrayChange(
                        "tech_moles_products",
                        1,
                        e.target.value
                      )
                    }
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </div>

              {/* Additional Products */}
              {additionalProducts.map((product, index) => (
                <div key={product.id} className="col-span-6 pt-4">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 items-end">
                    <div className="col-span-12 px-2">
                      <p>
                        <strong className="label text-blue">
                          {getProductName(index + 2)}
                        </strong>
                      </p>
                      <div className="flex justify-between">
                        <div className="">
                          <label className="label text-blue">
                            Coefficient in balanced reaction:
                          </label>
                        </div>
                        <div className="cursor-pointer">
                          <button
                            type="button"
                            className="bg-red-500  cursor-pointer text-white rounded-lg px-2 py-1 hover:bg-red-600 transition-colors duration-200"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            x
                          </button>
                        </div>
                      </div>

                      <div className="w-full py-2 position-relative">
                        <input
                          type="number"
                          step="any"
                          className="input"
                          placeholder="00"
                          value={product.coefficient}
                          onChange={(e) =>
                            handleProductChange(
                              product.id,
                              "coefficient",
                              e.target.value
                            )
                          }
                          onKeyPress={(e) =>
                            !/[0-9]/.test(e.key) && e.preventDefault()
                          }
                        />
                      </div>
                    </div>

                    {formData.tech_find !== "1" && (
                      <div className="col-span-12 px-2">
                        <p>
                          <strong className="label text-blue">&nbsp;</strong>
                        </p>
                        <label className="label text-blue">
                          Number of moles or molecules:
                        </label>
                        <div className="w-full py-2 position-relative">
                          <input
                            type="number"
                            step="any"
                            className="input"
                            placeholder="00"
                            value={product.moles}
                            onChange={(e) =>
                              handleProductChange(
                                product.id,
                                "moles",
                                e.target.value
                              )
                            }
                            onKeyPress={(e) =>
                              !/[0-9]/.test(e.key) && e.preventDefault()
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Product Button */}
              <div className="col-span-12  my-2">
                <button
                  type="button"
                  className="bg-[#2845F5] border cursor-pointer text-[#fff] rounded-lg px-4 py-2  transition-colors duration-200"
                  onClick={handleAddProduct}
                >
                  <strong className="text-blue">+ Add Products</strong>
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculateLoading}>
              {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate"}
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
        <div className="lg:w-[100%] w-full mx-auto">
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  overflow-auto">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 result_table overflow-auto">
                          <table className="table w-full" cellSpacing="0">
                            <thead>
                              <tr>
                                <th className="text-start text-blue border-b p-2">
                                  Description
                                </th>
                                <th className="text-start text-blue border-b p-2">
                                  Molar Ratio
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Reactant to Reactant Ratios */}
                              {result.tch_coefficient?.map((coeff1, i) => {
                                const reactantName1 = getReactantName(i);
                                return result.tch_coefficient
                                  .slice(i + 1)
                                  .map((coeff2, j) => {
                                    const reactantName2 = getReactantName(
                                      i + j + 1
                                    );
                                    const simplified = simplify(coeff1, coeff2);
                                    return (
                                      <tr key={`reactant-${i}-${i + j + 1}`}>
                                        <td className="border-b p-2">
                                          {reactantName1} : {reactantName2}
                                        </td>
                                        <td className="border-b p-2">
                                          {simplified[0]} : {simplified[1]}
                                        </td>
                                      </tr>
                                    );
                                  });
                              })}

                              {/* Reactant to Product Ratios */}
                              {result.tch_coefficient?.map((coeff1, i) => {
                                const reactantName = getReactantName(i);
                                return result.tch_first_product?.map(
                                  (coeff2, j) => {
                                    const productName = getProductName(j);
                                    const simplified = simplify(coeff1, coeff2);
                                    return (
                                      <tr key={`reactant-product-${i}-${j}`}>
                                        <td className="border-b p-2">
                                          {reactantName} : {productName}
                                        </td>
                                        <td className="border-b p-2">
                                          {simplified[0]} : {simplified[1]}
                                        </td>
                                      </tr>
                                    );
                                  }
                                );
                              })}

                              {/* Product to Product Ratios */}
                              {result.tch_first_product?.map((coeff1, i) => {
                                const productName1 = getProductName(i);
                                return result.tch_first_product
                                  .slice(i + 1)
                                  .map((coeff2, j) => {
                                    const productName2 = getProductName(
                                      i + j + 1
                                    );
                                    const simplified = simplify(coeff1, coeff2);
                                    return (
                                      <tr key={`product-${i}-${i + j + 1}`}>
                                        <td className="border-b p-2">
                                          {productName1} : {productName2}
                                        </td>
                                        <td className="border-b p-2">
                                          {simplified[0]} : {simplified[1]}
                                        </td>
                                      </tr>
                                    );
                                  });
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default MoleRatioCalculator;
