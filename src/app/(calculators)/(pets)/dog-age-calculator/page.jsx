"use client";

import React, { useEffect, useState } from "react";
import { FormWrap } from "../../../../components/Calculator";
import { usePathname } from "next/navigation";

import {
  useDogAgeCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DogAgeCalculatorbyBreed = () => {
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
    tech_operations: "2",
    tech_brd: "1",
    tech_age: "4",
    tech_size: "1",
    tech_dogAge: "9",
    tech_dogBreed: "10&&American Water Spaniel",
    tech_a: "4",
    tech_b: "6",
    tech_c: "3",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    DogAgeCalculatorbyBreed,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useDogAgeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_operations == 1) {
      if (
        !formData.tech_operations ||
        !formData.tech_dogBreed ||
        !formData.tech_age
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_operations ||
        !formData.tech_dogAge ||
        !formData.tech_dogBreed ||
        !formData.tech_a ||
        !formData.tech_b ||
        !formData.tech_c
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await DogAgeCalculatorbyBreed({
        tech_operations: formData.tech_operations,
        tech_brd: formData.tech_brd,
        tech_age: formData.tech_age,
        tech_size: formData.tech_size,
        tech_dogAge: formData.tech_dogAge,
        tech_dogBreed: formData.tech_dogBreed,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
      }).unwrap();

      if (response?.error?.data?.error) {
        setFormError(response?.error?.data?.error);
        toast.error(response?.error?.data?.error);
        setResult(null);
      }
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err?.data?.payload?.error);
      toast.error(err?.data?.payload?.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_operations: "2",
      tech_brd: "1",
      tech_age: "4",
      tech_size: "1",
      tech_dogAge: "9",
      tech_dogBreed: "10&&American Water Spaniel",
      tech_a: "4",
      tech_b: "6",
      tech_c: "3",
    });
    setResult(null);
    setFormError(null);
  };

  useEffect(() => {
    if (formData.tech_operations) {
      setResult(null);
      setFormError(null);
    }
  }, [formData.tech_operations]);

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <strong className="text-blue pe-lg-3">
                  {data?.payload?.tech_lang_keys["1"]} :
                </strong>
                <label className="pe-2" htmlFor="bedtime">
                  <input
                    type="radio"
                    name="tech_operations"
                    value="1"
                    id="bedtime"
                    className="ml-2 border"
                    onChange={handleChange}
                    checked={formData.tech_operations === "1"}
                  />
                  <span>{data?.payload?.tech_lang_keys["2"]}</span>{" "}
                  <br className="lg:hidden md:hidden flex " />
                </label>

                <label
                  className="lg:ml-auto md:ml-auto ml-[70px]"
                  htmlFor="wkup"
                >
                  <input
                    type="radio"
                    name="tech_operations"
                    className="ml-2 border"
                    value="2"
                    id="wkup"
                    onChange={handleChange}
                    checked={formData.tech_operations === "2"}
                  />
                  <span>{data?.payload?.tech_lang_keys["3"]}</span>
                </label>
              </div>

              {formData.tech_operations === "1" ? (
                <>
                  {/* Simple Version */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 simple_vr ">
                    <label htmlFor="tech_brd" className="label ml-5">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className=" py-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_brd"
                        id="tech_brd"
                        value={formData.tech_brd}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["6"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 simple_vr   ">
                    <label htmlFor="tech_age" className="label ml-5">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <input
                      type="number"
                      name="tech_age"
                      id="tech_age"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_age}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : formData.tech_operations === "2" ? (
                <>
                  {/* Advanced Version */}

                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ad_vr ">
                    <label htmlFor="tech_dogAge" className="label">
                      {data?.payload?.tech_lang_keys["11"]}
                    </label>
                    <div className="w-full py-2">
                      <select
                        className="input"
                        id="tech_dogAge"
                        name="tech_dogAge"
                        value={formData.tech_dogAge}
                        onChange={handleChange}
                      >
                        <option value="0">
                          {data?.payload?.tech_lang_keys["12"]}
                        </option>
                        <option value="0.25">
                          3 {data?.payload?.tech_lang_keys["13"]}
                        </option>
                        <option value="0.5">
                          6 {data?.payload?.tech_lang_keys["13"]}
                        </option>
                        <option value="0.75">
                          9 {data?.payload?.tech_lang_keys["13"]}
                        </option>
                        <option value="1">
                          12 {data?.payload?.tech_lang_keys["13"]}
                        </option>
                        <option value="1.5">
                          18 {data?.payload?.tech_lang_keys["13"]}
                        </option>
                        <option value="2">
                          2 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="3">
                          3 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="4">
                          4 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="5">
                          5 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="6">
                          6 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="7">
                          7 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="8">
                          8 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="9">
                          9 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="10">
                          10 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="11">
                          11 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="12">
                          12 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="13">
                          13 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="14">
                          14 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="15">
                          15 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="16">
                          16 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="17">
                          17 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="18">
                          18 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="19">
                          19 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                        <option value="20">
                          20 {data?.payload?.tech_lang_keys["14"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ad_vr ">
                    <label htmlFor="tech_dogBreed" className="label">
                      {data?.payload?.tech_lang_keys["15"]}
                    </label>
                    <div className="w-full py-2">
                      <select
                        className="input"
                        id="tech_dogBreed"
                        name="tech_dogBreed"
                        value={formData.tech_dogBreed}
                        onChange={handleChange}
                      >
                        <option value="0">
                          {data?.payload?.tech_lang_keys["16"]}
                        </option>
                        <option value="1&&Affenpinscher">Affenpinscher</option>
                        <option value="2&&Afghan Hound">Afghan Hound</option>
                        <option value="3&&Airedale Terrier">
                          Airedale Terrier
                        </option>
                        <option value="4&&Akita">Akita</option>
                        <option value="5&&Alaskan Malamute">
                          Alaskan Malamute
                        </option>
                        <option value="6&&American Cocker Spaniel">
                          American Cocker Spaniel
                        </option>
                        <option value="7&&American Eskimo Dog">
                          American Eskimo Dog
                        </option>
                        <option value="8&&American Foxhound">
                          American Foxhound
                        </option>
                        <option value="9&&American Staffordshire Terrier">
                          American Staffordshire Terrier
                        </option>
                        <option value="10&&American Water Spaniel">
                          American Water Spaniel
                        </option>
                        <option value="11&&Anatolian Shepherd Dog">
                          Anatolian Shepherd Dog
                        </option>
                        <option value="12&&Australian Cattle Dog">
                          Australian Cattle Dog
                        </option>
                        <option value="13&&Australian Shepherd">
                          Australian Shepherd
                        </option>
                        <option value="14&&Australian Silky Terrier">
                          Australian Silky Terrier
                        </option>
                        <option value="15&&Australian Terrier">
                          Australian Terrier
                        </option>
                        <option value="16&&Basenji">Basenji</option>
                        <option value="17&&Basset Hound">Basset Hound</option>
                        <option value="18&&Beagle">Beagle</option>
                        <option value="19&&Bearded Collie">
                          Bearded Collie
                        </option>
                        <option value="20&&Beauceron">Beauceron</option>
                        <option value="21&&Belgian Shepherd">
                          Belgian Shepherd
                        </option>
                        <option value="22&&Bedlington Terrier">
                          Bedlington Terrier
                        </option>
                        <option value="23&&Belgian Shepherd Malinois">
                          Belgian Shepherd Malinois
                        </option>
                        <option value="24&&Bernese Mountain Dog">
                          Bernese Mountain Dog
                        </option>
                        <option value="25&&Bichon Frise">Bichon Frise</option>
                        <option value="26&&Black and Tan Coonhound">
                          Black and Tan Coonhound
                        </option>
                        <option value="27&&Black Russian Terrier">
                          Black Russian Terrier
                        </option>
                        <option value="28&&Bloodhound">Bloodhound</option>
                        <option value="29&&Bluetick Coonhound">
                          Bluetick Coonhound
                        </option>
                        <option value="30&&Border Collie">Border Collie</option>
                        <option value="31&&Border Terrier">
                          Border Terrier
                        </option>
                        <option value="32&&Borzoi">Borzoi</option>
                        <option value="33&&Boston Terrier">
                          Boston Terrier
                        </option>
                        <option value="34&&Briard">Briard</option>
                        <option value="35&&Bouvier des Flandres">
                          Bouvier des Flandres
                        </option>
                        <option value="36&&Boxer">Boxer</option>
                        <option value="37&&Boykin Spaniel">
                          Boykin Spaniel
                        </option>
                        <option value="38&&Brittany">Brittany</option>
                        <option value="39&&Bull Terrier">Bull Terrier</option>
                        <option value="40&&Bulldog">Bulldog</option>
                        <option value="41&&Bullmastiff">Bullmastiff</option>
                        <option value="42&&Cairn Terrier">Cairn Terrier</option>
                        <option value="43&&Canaan Dog">Canaan Dog</option>
                        <option value="44&&Cane Corso">Cane Corso</option>
                        <option value="45&&Cavalier King Charles Spaniel">
                          Cavalier King Charles Spaniel
                        </option>
                        <option value="46&&Cesky Terrier">Cesky Terrier</option>
                        <option value="47&&Chesapeake Bay Retriever">
                          Chesapeake Bay Retriever
                        </option>
                        <option value="48&&Chihuahua">Chihuahua</option>
                        <option value="49&&Chinese Crested Dog">
                          Chinese Crested Dog
                        </option>
                        <option value="50&&Chow Chow">Chow Chow</option>
                        <option value="51&&Clumber Spaniel">
                          Clumber Spaniel
                        </option>
                        <option value="52&&Curly Coated Retriever">
                          Curly Coated Retriever
                        </option>
                        <option value="53&&Dachshund">Dachshund</option>
                        <option value="54&&Dalmatian">Dalmatian</option>
                        <option value="55&&Dandie Dinmont Terrier">
                          Dandie Dinmont Terrier
                        </option>
                        <option value="56&&Doberman Pinscher">
                          Doberman Pinscher
                        </option>
                        <option value="57&&Dogue de Bordeaux">
                          Dogue de Bordeaux
                        </option>
                        <option value="58&&English Bulldog">
                          English Bulldog
                        </option>
                        <option value="59&&English Cocker Spaniel">
                          English Cocker Spaniel
                        </option>
                        <option value="60&&English Coonhound">
                          English Coonhound
                        </option>
                        <option value="61&&English Foxhound">
                          English Foxhound
                        </option>
                        <option value="62&&English Mastiff">
                          English Mastiff
                        </option>
                        <option value="63&&English Setter">
                          English Setter
                        </option>
                        <option value="64&&English Springer Spaniel">
                          English Springer Spaniel
                        </option>
                        <option value="65&&Entlebucher Mountain Dog">
                          Entlebucher Mountain Dog
                        </option>
                        <option value="66&&Field Spaniel">Field Spaniel</option>
                        <option value="67&&Finnish Lapphund">
                          Finnish Lapphund
                        </option>
                        <option value="68&&Finnish Spitz">Finnish Spitz</option>
                        <option value="69&&Flat-Coated Retriever">
                          Flat-Coated Retriever
                        </option>
                        <option value="70&&French Bulldog">
                          French Bulldog
                        </option>
                        <option value="71&&German Pinscher">
                          German Pinscher
                        </option>
                        <option value="72&&German Shepherd">
                          German Shepherd
                        </option>
                        <option value="73&&German Shorthaired Pointer">
                          German Shorthaired Pointer
                        </option>
                        <option value="74&&German Wirehaired Pointer">
                          German Wirehaired Pointer
                        </option>
                        <option value="75&&Giant Schnauzer">
                          Giant Schnauzer
                        </option>
                        <option value="76&&Glen of Imaal Terrier">
                          Glen of Imaal Terrier
                        </option>
                        <option value="77&&Golden Retriever">
                          Golden Retriever
                        </option>
                        <option value="78&&Gordon Setter">Gordon Setter</option>
                        <option value="79&&Great Dane">Great Dane</option>
                        <option value="80&&Great Pyrenees">
                          Great Pyrenees
                        </option>
                        <option value="81&&Greater Swiss Mountain Dog">
                          Greater Swiss Mountain Dog
                        </option>
                        <option value="82&&Greyhound">Greyhound</option>
                        <option value="83&&Griffon Bruxellois">
                          Griffon Bruxellois
                        </option>
                        <option value="84&&Harrier">Harrier</option>
                        <option value="85&&Havanese">Havanese</option>
                        <option value="86&&Ibizan Hound">Ibizan Hound</option>
                        <option value="87&&Icelandic Sheepdog">
                          Icelandic Sheepdog
                        </option>
                        <option value="88&&Irish Red and White Setter">
                          Irish Red and White Setter
                        </option>
                        <option value="89&&Irish Setter">Irish Setter</option>
                        <option value="90&&Irish Soft-coated Wheaten Terrier">
                          Irish Soft-coated Wheaten Terrier
                        </option>
                        <option value="91&&Irish Terrier">Irish Terrier</option>
                        <option value="92&&Irish Water Spaniel">
                          Irish Water Spaniel
                        </option>
                        <option value="93&&Irish Wolfhound">
                          Irish Wolfhound
                        </option>
                        <option value="94&&Italian Greyhound">
                          Italian Greyhound
                        </option>
                        <option value="95&&Jack Russell Terrier">
                          Jack Russell Terrier
                        </option>
                        <option value="96&&Japanese Chin">Japanese Chin</option>
                        <option value="97&&Keeshond">Keeshond</option>
                        <option value="98&&Kerry Blue Terrier">
                          Kerry Blue Terrier
                        </option>
                        <option value="99&&King Charles Spaniel">
                          King Charles Spaniel
                        </option>
                        <option value="100&&Komondor">Komondor</option>
                        <option value="101&&Kuvasz">Kuvasz</option>
                        <option value="102&&Labrador Retriever">
                          Labrador Retriever
                        </option>
                        <option value="103&&Lakeland Terrier">
                          Lakeland Terrier
                        </option>
                        <option value="104&&Leonberger">Leonberger</option>
                        <option value="105&&Lhasa Apso">Lhasa Apso</option>
                        <option value="106&&Lowchen">Lowchen</option>
                        <option value="107&&Maltese">Maltese</option>
                        <option value="108&&Manchester Terrier">
                          Manchester Terrier
                        </option>
                        <option value="109&&Mexican Hairless Dog">
                          Mexican Hairless Dog
                        </option>
                        <option value="110&&Miniature Pinscher">
                          Miniature Pinscher
                        </option>
                        <option value="111&&Miniature Schnauzer">
                          Miniature Schnauzer
                        </option>
                        <option value="112&&Neapolitan Mastiff">
                          Neapolitan Mastiff
                        </option>
                        <option value="113&&Newfoundland">Newfoundland</option>
                        <option value="114&&Norfolk Terrier">
                          Norfolk Terrier
                        </option>
                        <option value="115&&Norwegian Buhund">
                          Norwegian Buhund
                        </option>
                        <option value="116&&Norwegian Elkhound">
                          Norwegian Elkhound
                        </option>
                        <option value="117&&Norwegian Lundehund">
                          Norwegian Lundehund
                        </option>
                        <option value="118&&Norwich Terrier">
                          Norwich Terrier
                        </option>
                        <option value="119&&Nova Scotia Duck Tolling Retriever">
                          Nova Scotia Duck Tolling Retriever' 12
                        </option>
                        <option value="120&&Old English Sheepdog">
                          Old English Sheepdog
                        </option>
                        <option value="121&&Otterhound">Otterhound</option>
                        <option value="122&&Papillon">Papillon</option>
                        <option value="123&&Parson Russell Terrier">
                          Parson Russell Terrier
                        </option>
                        <option value="124&&Pekingese">Pekingese</option>
                        <option value="125&&Pembroke Welsh Corgi">
                          Pembroke Welsh Corgi
                        </option>
                        <option value="126&&Petit Basset Griffon Vendeen">
                          Petit Basset Griffon Vendeen
                        </option>
                        <option value="127&&Pharaoh Hound">
                          Pharaoh Hound
                        </option>
                        <option value="128&&Plott Hound">Plott Hound</option>
                        <option value="129&&Pointer">Pointer</option>
                        <option value="130&&Polish Lowland Sheepdog">
                          Polish Lowland Sheepdog
                        </option>
                        <option value="131&&Pomeranian">Pomeranian</option>
                        <option value="132&&Poodle">Poodle</option>
                        <option value="133&&Portuguese Water Dog">
                          Portuguese Water Dog
                        </option>
                        <option value="134&&Pug">Pug</option>
                        <option value="135&&Puli">Puli</option>
                        <option value="136&&Pyrenean Shepherd">
                          Pyrenean Shepherd
                        </option>
                        <option value="137&&Redbone Coonhound">
                          Redbone Coonhound
                        </option>
                        <option value="138&&Rhodesian Ridgeback">
                          Rhodesian Ridgeback
                        </option>
                        <option value="139&&Rottweiler">Rottweiler</option>
                        <option value="140&&Rough Collie">Rough Collie</option>
                        <option value="141&&Saluki">Saluki</option>
                        <option value="142&&Samoyed">Samoyed</option>
                        <option value="143&&Schipperke">Schipperke</option>
                        <option value="144&&Scottish Deerhound">
                          Scottish Deerhound
                        </option>
                        <option value="145&&Scottish Terrier">
                          Scottish Terrier
                        </option>
                        <option value="146&&Sealyham Terrier">
                          Sealyham Terrier
                        </option>
                        <option value="147&&Shar Pei">Shar Pei</option>
                        <option value="148&&Shetland Sheepdog">
                          Shetland Sheepdog
                        </option>
                        <option value="149&&Shiba Inu">Shiba Inu</option>
                        <option value="150&&Shih Tzu">Shih Tzu</option>
                        <option value="151&&Siberian Huskie">
                          Siberian Huskie
                        </option>
                        <option value="152&&Skye Terrier">Skye Terrier</option>
                        <option value="153&&Smooth Fox Terrier">
                          Smooth Fox Terrier
                        </option>
                        <option value="154&&Spinone Italiano">
                          Spinone Italiano
                        </option>
                        <option value="155&&St. Bernard">St. Bernard</option>
                        <option value="156&&Staffordshire Bull Terrier">
                          Staffordshire Bull Terrier
                        </option>
                        <option value="157&&Standard Schnauzer">
                          Standard Schnauzer
                        </option>
                        <option value="158&&Sussex Spaniel">
                          Sussex Spaniel
                        </option>
                        <option value="159&&Swedish Vallhund">
                          Swedish Vallhund
                        </option>
                        <option value="160&&Tibetan Mastiff">
                          Tibetan Mastiff
                        </option>
                        <option value="161&&Tibetan Spaniel">
                          Tibetan Spaniel
                        </option>
                        <option value="162&&Tibetan Terrier">
                          Tibetan Terrier
                        </option>
                        <option value="163&&Toy Fox Terrier">
                          Toy Fox Terrier
                        </option>
                        <option value="164&&Treeing Walker Coonhound">
                          Treeing Walker Coonhound
                        </option>
                        <option value="165&&Tervuren">Tervuren</option>
                        <option value="166&&Vizsla">Vizsla</option>
                        <option value="167&&Weimaraner">Weimaraner</option>
                        <option value="168&&Welsh Springer Spaniel">
                          Welsh Springer Spaniel
                        </option>
                        <option value="169&&Welsh Terrier">
                          Welsh Terrier
                        </option>
                        <option value="170&&West Highland White Terrier">
                          West Highland White Terrier
                        </option>
                        <option value="171&&Whippet">Whippet</option>
                        <option value="172&&Wire Hair Fox Terrier">
                          Wire Hair Fox Terrier
                        </option>
                        <option value="173&&Wirehaired Pointing Griffon">
                          Wirehaired Pointing Griffon
                        </option>
                        <option value="174&&Xoloitzcuintle ">
                          Xoloitzcuintle{" "}
                        </option>
                        <option value="175&&Yorkshire Terrier">
                          Yorkshire Terrier
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ad_vr ">
                    <label htmlFor="tech_a" className="label">
                      {data?.payload?.tech_lang_keys["17"]}:
                    </label>
                    <input
                      type="number"
                      name="tech_a"
                      id="tech_a"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_a}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ad_vr ">
                    <label htmlFor="tech_b" className="label">
                      {data?.payload?.tech_lang_keys["18"]}:
                    </label>
                    <input
                      type="number"
                      name="tech_b"
                      id="tech_b"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_b}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ad_vr ">
                    <label htmlFor="tech_c" className="label">
                      {data?.payload?.tech_lang_keys["19"]}:
                    </label>
                    <input
                      type="number"
                      name="tech_c"
                      id="tech_c"
                      className="input my-2"
                      aria-label="input"
                      value={formData.tech_c}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
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
                    <div className="w-full mt-3">
                      <div className="row my-2">
                        {result.tech_operations === "1" ? (
                          <div className="text-center">
                            <p className="my-3 text-[14px] md:text-[18px]">
                              {data?.payload?.tech_lang_keys["33"]}{" "}
                              <strong className="text-[20px] md:text-[25px] px-3 py-2 text-blue-500">
                                {Math.round(result?.tech_answer)}
                              </strong>{" "}
                              {data?.payload?.tech_lang_keys["34"]}
                            </p>
                          </div>
                        ) : result.tech_operations === "2" ? (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%] flex justify-between">
                              <div>
                                <p className="pe-lg-5 lg:text-[16px] md:text-[16px] text-[14px]">
                                  In human years, your dog is
                                  <strong className="text-[#119154] text-[21px]">
                                    {Number(result?.tech_dogHumanAge).toFixed(
                                      1
                                    )}
                                  </strong>
                                  years old and
                                  <br /> is considered
                                  <strong className="text-[#119154] text-[21px]">
                                    {result.tech_type}
                                  </strong>
                                </p>
                              </div>
                              <div>
                                <img
                                  src={`/images/dogs/${result.tech_images}.png`}
                                  id="im"
                                  className="max-image"
                                  alt="Dog Images"
                                  width="100px"
                                  height="100px"
                                />
                              </div>
                            </div>

                            <div className="w-full md:w-[80%] lg:w-[80%] ">
                              <p className="lg:text-[16px] md:text-[16px] text-[14px] mt-2">
                                <strong>{result.tech_name} Details</strong>
                              </p>

                              <table className="w-full lg:text-[16px] md:text-[16px] text-[14px]">
                                <tbody>
                                  {Array.from({ length: 9 }, (_, i) => (
                                    <tr key={i}>
                                      <td width="60%" className="border-b py-2">
                                        {data?.payload?.tech_lang_keys[23 + i]}
                                      </td>
                                      <td className="border-b py-2">
                                        {result[`tech_f${i + 1}`]}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <></>
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

export default DogAgeCalculatorbyBreed;
