"use client";

import React, { useEffect, useState } from "react";
import { FormWrap } from "../../../../components/Calculator";
import { usePathname } from "next/navigation";

import {
  usePuppyweightCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PuppyWeightCalculator = () => {
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
    dogWeight: "4",
    weightChoice: "kg",
    dogAge: "5",
    ageChoice: "wks",
    dogType: "first",
    breedSelection: "Affenpinscher",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    PuppyWeightCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = usePuppyweightCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.dogWeight ||
      !formData.weightChoice ||
      !formData.dogAge ||
      !formData.ageChoice
    ) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await PuppyWeightCalculator({
        dogWeight: formData.dogWeight,
        weightChoice: formData.weightChoice,
        dogAge: formData.dogAge,
        ageChoice: formData.ageChoice,
        dogType: formData.dogType,
        breedSelection: formData.breedSelection,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has '
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      dogWeight: "4",
      weightChoice: "kg",
      dogAge: "5",
      ageChoice: "wks",
      dogType: "first",
      breedSelection: "Affenpinscher",
    });
    setResult(null);
    setFormError(null);
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, ageChoice: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, weightChoice: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  const toggleTechType = () => {
    setFormData((prevState) => ({
      ...prevState,
      dogType: prevState.dogType === "first" ? "second" : "first",
    }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="dogAge" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="dogAge"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.dogAge}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.ageChoice} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: data?.payload?.tech_lang_keys["2"],
                          value: "days",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["3"],
                          value: "wks",
                        },
                        {
                          label: data?.payload?.tech_lang_keys["4"],
                          value: "mon",
                        },
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
              <div className="space-y-2">
                <label htmlFor="dogWeight" className="label" id="textChanged">
                  {data?.payload?.tech_lang_keys["5"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="dogWeight"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.dogWeight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown1}
                  >
                    {formData.weightChoice} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "g", value: "g" },
                        { label: "dag", value: "dag" },
                        { label: "kg", value: "kg" },
                        { label: "oz", value: "oz" },
                        { label: "lb", value: "lb" },
                        { label: "stone", value: "stone" },
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
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div
                className=" cursor-pointer current_gpa flex items-center my-3"
                onClick={toggleTechType}
              >
                <input
                  type="hidden"
                  name="dogType"
                  id="dogType"
                  value={formData.dogType}
                />
                <strong className="pr-3">Advance Option</strong>
                <p className="ml-auto transition-transform transform button">
                  {formData.dogType === "first" ? "▼" : "▲"}
                </p>
              </div>
            </div>
            {formData.dogType === "second" && (
              <div className="col-span-12">
                <label htmlFor="breedSelection" className="label">
                  {data?.payload?.tech_lang_keys["17"]}:
                </label>
                <div className="w-full py-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="breedSelection"
                    id="breedSelection"
                    value={formData.breedSelection}
                    onChange={handleChange}
                  >
                    <option value="Affenpinscher">Affenpinscher</option>
                    <option value="Afghan Hound">Afghan Hound</option>
                    <option value="Airedale Terrier">Airedale Terrier</option>
                    <option value="Akita">Akita</option>
                    <option value="Alaskan Malamute">Alaskan Malamute</option>
                    <option value="American Cocker Spaniel">
                      American Cocker Spaniel
                    </option>
                    <option value="American Eskimo Dog (toy)">
                      American Eskimo Dog (toy)
                    </option>
                    <option value="American Esmiko Dog (miniature)">
                      American Eskimo Dog (miniature)
                    </option>
                    <option value="American Esmiko Dog">
                      American Eskimo Dog
                    </option>
                    <option value="American Foxhound">American Foxhound</option>
                    <option value="American Hairless Terrier">
                      American Hairless Terrier
                    </option>
                    <option value="American Staffordshire Terrier">
                      American Staffordshire Terrier
                    </option>
                    <option value="Anatolian Shepherd Dog">
                      Anatolian Shepherd Dog
                    </option>
                    <option value="Australian Cattle Dog">
                      Australian Cattle Dog
                    </option>
                    <option value="Australian Shepherd">
                      Australian Shepherd
                    </option>
                    <option value="Basenji">Basenji</option>
                    <option value="Basset Hound">Basset Hound</option>
                    <option value="Beagle">Beagle</option>
                    <option value="Bearded Collie">Bearded Collie</option>
                    <option value="Beauceron">Beauceron</option>
                    <option value="Belgian Shepherd">Belgian Shepherd</option>
                    <option value="Bedlington Terrier">
                      Bedlington Terrier
                    </option>
                    <option value="Belgian Shepherd Malinois">
                      Belgian Shepherd Malinois
                    </option>
                    <option value="Bernese Mountain Dog">
                      Bernese Mountain Dog
                    </option>
                    <option value="Bichon Frise">Bichon Frise</option>
                    <option value="Black and Tan Coonhound">
                      Black and Tan Coonhound
                    </option>
                    <option value="Black Russian Terrier">
                      Black Russian Terrier
                    </option>
                    <option value="Bloodhound">Bloodhound</option>
                    <option value="Bluetick Coonhound">
                      Bluetick Coonhound
                    </option>
                    <option value="Border Collie">Border Collie</option>
                    <option value="Border Terrier">Border Terrier</option>
                    <option value="Borzoi">Borzoi</option>
                    <option value="Boston Terrier">Boston Terrier</option>
                    <option value="Briard">Briard</option>
                    <option value="Bouvier des Flandres">
                      Bouvier des Flandres
                    </option>
                    <option value="Boxer">Boxer</option>
                    <option value="Boykin Spaniel">Boykin Spaniel</option>
                    <option value="Brittany">Brittany</option>
                    <option value="Bull Terrier">Bull Terrier</option>
                    <option value="Bulldog">Bulldog</option>
                    <option value="Bullmastiff">Bullmastiff</option>
                    <option value="Cairn Terrier">Cairn Terrier</option>
                    <option value="Canaan Dog">Canaan Dog</option>
                    <option value="Cane Corso">Cane Corso</option>
                    <option value="Cavalier King Charles Spaniel">
                      Cavalier King Charles Spaniel
                    </option>
                    <option value="Cesky Terrier">Cesky Terrier</option>
                    <option value="Chesapeake Bay Retriever">
                      Chesapeake Bay Retriever
                    </option>
                    <option value="Chihuahua">Chihuahua</option>
                    <option value="Chinese Crested Dog">
                      Chinese Crested Dog
                    </option>
                    <option value="Chinese Shar-Pei">Chinese Shar-Pei</option>
                    <option value="Chinook">Chinook</option>
                    <option value="Chow Chow">Chow Chow</option>
                    <option value="Cirnechi dell'Etna">
                      Cirnechi dell'Etna
                    </option>
                    <option value="Collie">Collie</option>
                    <option value="Coton de Tulear">Coton de Tulear</option>
                    <option value="Dachshund (miniature)">
                      Dachshund (miniature)
                    </option>
                    <option value="Dachshund">Dachshund</option>
                    <option value="Dalmatian">Dalmatian</option>
                    <option value="Dandie Dinmont Terrier">
                      Dandie Dinmont Terrier
                    </option>
                    <option value="Doberman Pinscher">Doberman Pinscher</option>
                    <option value="Dogue de Bordeaux">Dogue de Bordeaux</option>
                    <option value="English Foxhound">English Foxhound</option>
                    <option value="English Toy Spaniel">
                      English Toy Spaniel
                    </option>
                    <option value="Entlebucher Mountain Dog">
                      Entlebucher Mountain Dog
                    </option>
                    <option value="Finnish Lapphund">Finnish Lapphund</option>
                    <option value="Finnish Spitz">Finnish Spitz</option>
                    <option value="French Bulldog">French Bulldog</option>
                    <option value="German Pinscher">German Pinscher</option>
                    <option value="German Shepherd">German Shepherd</option>
                    <option value="Giant Schnauzer">Giant Schnauzer</option>
                    <option value="Glen of Imaal Terrier">
                      Glen of Imaal Terrier
                    </option>
                    <option value="Great Dane">Great Dane</option>
                    <option value="Great Pyrenees">Great Pyrenees</option>
                    <option value="Greater Swiss Mountain Dog">
                      Greater Swiss Mountain Dog
                    </option>
                    <option value="Greyhound">Greyhound</option>
                    <option value="Harrier">Harrier</option>
                    <option value="Havanese">Havanese</option>
                    <option value="Ibizan Hound">Ibizan Hound</option>
                    <option value="Icelandic Sheepdog">
                      Icelandic Sheepdog
                    </option>
                    <option value="Irish Red and White Setter">
                      Irish Red and White Setter
                    </option>
                    <option value="Irish Setter">Irish Setter</option>
                    <option value="Irish Soft-coated Wheaten Terrier">
                      Irish Soft-coated Wheaten Terrier
                    </option>
                    <option value="Irish Terrier">Irish Terrier</option>
                    <option value="Irish Wolfhound">Irish Wolfhound</option>
                    <option value="Italian Greyhound">Italian Greyhound</option>
                    <option value="Japanese Chin">Japanese Chin</option>
                    <option value="Keeshonden">Keeshonden</option>
                    <option value="Kerry Blue Terrier">
                      Kerry Blue Terrier
                    </option>
                    <option value="Komondor">Komondorok</option>
                    <option value="Kuvasz">Kuvaszok</option>
                    <option value="Kuvasz">Kuvaszok</option>
                    <option value="Lagottto Romagnoli">
                      Lagottto Romagnoli
                    </option>
                    <option value="Lakeland Terrier">Lakeland Terrier</option>
                    <option value="Leonberger">Leonberger</option>
                    <option value="Lhasa Apso">Lhasa Apso</option>
                    <option value="Lowchen">Lowchen</option>
                    <option value="Maltese">Maltese</option>
                    <option value="Manchester Terrier (Toy)">
                      Manchester Terrier (Toy)
                    </option>
                    <option value="Manchester Terrier">
                      Manchester Terrier
                    </option>
                    <option value="Neapolitan Mastiff">Mastiff</option>
                    <option value="Neapolitan Mastiff">Mastiff</option>
                    <option value="Miniature Pinscher">
                      Miniature Pinscher
                    </option>
                    <option value="Miniature Schnauzer">
                      Miniature Schnauzer
                    </option>
                    <option value="Neapolitan Mastiff">Mastiff</option>
                    <option value="Newfoundland">Newfoundland</option>
                    <option value="Norfolk Terrier">Norfolk Terrier</option>
                    <option value="Norwegian Buhund">Norwegian Buhund</option>
                    <option value="Norwegian Elkhound">
                      Norwegian Elkhound
                    </option>
                    <option value="Norwegian Lundehund">
                      Norwegian Lundehund
                    </option>
                    <option value="Norwich Terrier">Norwich Terrier</option>
                    <option value="Old English Sheepdog">
                      Old English Sheepdog
                    </option>
                    <option value="Otterhound">Otterhound</option>
                    <option value="Papillon">Papillon</option>
                    <option value="Parson Russell Terrier">
                      Parson Russell Terrier
                    </option>
                    <option value="Pekingese">Pekingese</option>
                    <option value="Pembroke Welsh Corgi">
                      Pembroke Welsh Corgi
                    </option>
                    <option value="Petit Basset Griffon Vendeen">
                      Petit Basset Griffon Vendeen
                    </option>
                    <option value="Pharaoh Hound">Pharaoh Hound</option>
                    <option value="Plott">Plott</option>
                    <option value="Polish Lowland Sheepdog">
                      Polish Lowland Sheepdog
                    </option>
                    <option value="Pomeranian">Pomeranian</option>
                    <option value="Poodle">Poodle</option>
                    <option value="Portuguese Water Dog">
                      Portuguese Water Dog
                    </option>
                    <option value="Pug">Pug</option>
                    <option value="Pulik">Pulik</option>
                    <option value="Redbone Coonhound">Redbone Coonhound</option>
                    <option value="Retreiver (Chesapeake Bay)">
                      Retreiver (Chesapeake Bay)
                    </option>
                    <option value="Retreiver (Curly Coated)">
                      Retreiver (Curly Coated)
                    </option>
                    <option value="Retreiver (Flat Coated)">
                      Retreiver (Flat Coated)
                    </option>
                    <option value="Retreiver (Golden)">
                      Retreiver (Golden)
                    </option>
                    <option value="Retreiver (Labrador)">
                      Retreiver (Labrador)
                    </option>
                    <option value="Rhodesian Ridgeback">
                      Rhodesian Ridgeback
                    </option>
                    <option value="Rottweiler">Rottweiler</option>
                    <option value="Russel Terrier">Russel Terrier</option>
                    <option value="Saluki">Saluki</option>
                    <option value="Samoyed">Samoyed</option>
                    <option value="Schipperke">Schipperke</option>
                    <option value="Scottish Deerhound">
                      Scottish Deerhound
                    </option>
                    <option value="Scottish Terrier">Scottish Terrier</option>
                    <option value="Sealyham Terrier">Sealyham Terrier</option>
                    <option value="Setter (English)">Setter (English)</option>
                    <option value="Setter (Gordon)">Setter (Gordon)</option>
                    <option value="Setter (Irish Red and White)">
                      Sealyham Terrier
                    </option>
                    <option value="Setter (Irish)">Setter (Irish)</option>
                    <option value="Shetland Sheepdog">Shetland Sheepdog</option>
                    <option value="Shiba Inu">Shiba Inu</option>
                    <option value="Shih Tzu">Shih Tzu</option>
                    <option value="Siberian Huskie">Siberian Huskie</option>
                    <option value="Silky Terrier">Silky Terrier</option>
                    <option value="Syke Terrier">Syke Terrier</option>
                    <option value="Sloughi">Sloughi</option>
                    <option value="Soft Coated Wheaten Terrier">
                      Soft Coated Wheaten Terrier
                    </option>
                    <option value="Spaniel (American Water)">
                      Spaniel (American Water)
                    </option>
                    <option value="Spaniel (Boykin)">Spaniel (Boykin)</option>
                    <option value="Spaniel (Clumber)">Spaniel (Clumber)</option>
                    <option value="Spaniel (Boykin)">Spaniel (Boykin)</option>
                    <option value="Spaniel (English Cocker)">
                      Spaniel (English Cocker)
                    </option>
                    <option value="Spaniel (English Springer)">
                      Spaniel (English Springer)
                    </option>
                    <option value="Spaniel (Field)">Spaniel (Field)</option>
                    <option value="Spaniel (Irish Water)">
                      Spaniel (Irish Water)
                    </option>
                    <option value="Spaniel (Sussex)">Spaniel (Sussex)</option>
                    <option value="Spaniel (Welsh Springer)">
                      Spaniel (Welsh Springer)
                    </option>
                    <option value="Spaniel Water Dog">Spaniel Water Dog</option>
                    <option value="Spinoni Italiani">Spinoni Italiani</option>
                    <option value="St. Bernard">St. Bernard</option>
                    <option value="Staffordshire Bull Terrier">
                      Staffordshire Bull Terrier
                    </option>
                    <option value="Spinoni Italiani">Spinoni Italiani</option>
                    <option value="Standard Schnauzer">
                      Standard Schnauzer
                    </option>
                    <option value="Swedish Vallhund">Swedish Vallhund</option>
                    <option value="Tibetan Mastiff">Tibetan Mastiff</option>
                    <option value="Tibetan Spaniel">Tibetan Spaniel</option>
                    <option value="Tibetan Terrier">Tibetan Terrier</option>
                    <option value="Toy Fox Terrier">Toy Fox Terrier</option>
                    <option value="Treeing Walker Coonhound">
                      Treeing Walker Coonhound
                    </option>
                    <option value="Vizsla">Vizsla</option>
                    <option value="Weimaraner">Weimaraner</option>
                    <option value="Welsh Terrier">Welsh Terrier</option>
                    <option value="West Highland White Terrier">
                      West Highland White Terrier
                    </option>
                    <option value="Whippet">Whippet</option>
                    <option value="Wirehaired Pointing Griffon">
                      Wirehaired Pointing Griffon
                    </option>
                    <option value="Wirehaired Vizsla">Wirehaired Vizsla</option>
                    <option value="Xoloitzcuintli">Xoloitzcuintli </option>
                    <option value="Yorkshire Terrier">Yorkshire Terrier</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDogLoading}>
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
        {calculateDogLoading ? (
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue p-1 rounded-lg">
                      <div className="my-2">
                        <div className="w-full">
                          <p className="text-lg font-semibold my-2">
                            {data?.payload?.tech_lang_keys["6"]}
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-r-2 pr-4">
                                  <strong className="text-[#119154] text-[32px]">
                                    {result?.tech_puppy1?.toFixed(2)}
                                  </strong>
                                  <span className="text-lg text-blue-500">
                                    (Kg)
                                  </span>
                                </td>
                                <td className="pl-4">
                                  <strong className="text-[#119154] text-[32px]">
                                    {result?.tech_puppy2?.toFixed(2)}
                                  </strong>
                                  <span className="text-lg text-blue-500">
                                    (lb)
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="my-3">
                            {data?.payload?.tech_lang_keys["7"]}:{" "}
                            <strong>{result?.tech_cal4?.toFixed(3)}</strong> -{" "}
                            <strong>{result?.tech_cal3?.toFixed(3)} kg</strong>
                          </p>
                        </div>
                        {result?.tech_type === "first" ? (
                          <div className="text-lg w-full lg:w-8/12">
                            <table className="w-full text-[13px] md:text-[16px]">
                              <tbody>
                                <tr className={result?.tech_h1}>
                                  <td className="border-b p-1 md:p-2 rounded-l-lg">
                                    {data?.payload?.tech_lang_keys["8"]}
                                  </td>
                                  <td className="border-b p-1 md:p-2 rounded-r-lg">
                                    {"< 12 lb / < 5.4 kg"}
                                  </td>
                                </tr>
                                <tr className={result?.tech_h2}>
                                  <td className="border-b p-1 md:p-2 rounded-l-lg">
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </td>
                                  <td className="border-b p-1 md:p-2 rounded-r-lg">
                                    {"12 - 22 lb / 5.4 - 10 kg"}
                                  </td>
                                </tr>
                                <tr className={result?.tech_h3}>
                                  <td className="border-b p-1 md:p-2 rounded-l-lg">
                                    {data?.payload?.tech_lang_keys["10"]}
                                  </td>
                                  <td className="border-b p-1 md:p-2 rounded-r-lg">
                                    {"22 - 57 lb / 10 - 25.9 kg"}
                                  </td>
                                </tr>
                                <tr className={result?.tech_h4}>
                                  <td className="border-b p-1 md:p-2 rounded-l-lg">
                                    {data?.payload?.tech_lang_keys["11"]}
                                  </td>
                                  <td className="border-b p-1 md:p-2 rounded-r-lg">
                                    {"57 - 99 lb / 25.9 - 44.9 kg"}
                                  </td>
                                </tr>
                                <tr className={result?.tech_h5}>
                                  <td className="border-b p-1 md:p-2 rounded-l-lg">
                                    {data?.payload?.tech_lang_keys["12"]}
                                  </td>
                                  <td className="border-b p-1 md:p-2 rounded-r-lg">
                                    {"> 99 lb / > 44.9 kg"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="mt-4 lg:mt-2">
                            <p className="text-lg font-semibold">
                              {data?.payload?.tech_lang_keys["13"]}{" "}
                              {result?.tech_select_breed}{" "}
                              {data?.payload?.tech_lang_keys["14"]}
                            </p>
                            {result?.names_one === "1" ? (
                              <p className="text-xl my-2 font-semibold text-blue-500">
                                {result?.tech_names_zero}
                              </p>
                            ) : (
                              <>
                                <p className="text-xl my-2 font-semibold text-blue-500">
                                  {data?.payload?.tech_lang_keys["15"]}:{" "}
                                  {result?.tech_names_zero}
                                </p>
                                <p className="text-xl my-2 font-semibold text-blue-500">
                                  {data?.payload?.tech_lang_keys["16"]}:{" "}
                                  {result?.tech_names_one}
                                </p>
                              </>
                            )}
                          </div>
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
      )}{" "}
    </Calculator>
  );
};

export default PuppyWeightCalculator;
