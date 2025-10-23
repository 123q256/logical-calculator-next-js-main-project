"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { useGetSingleConverterDataMutation } from "../../../../redux/services/converter/converterApi";
import ConverterWrap from "../../../../components/pages/Converter/component/ConverterWrap";
import { toast, ToastContainer } from "react-toastify";
import { evaluate } from "mathjs";
import "react-toastify/dist/ReactToastify.css";

const SubConverter = ({ unit1 = "", unit2 = "" }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract the correct parameters from the URL
  const categoryName = params?.category_name;
  const slug = params?.slug;

  const searchValue = searchParams?.get("search");

  const [getSingleConverterDetails, { data, error, isLoading }] =
    useGetSingleConverterDataMutation();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  // Debug: Log the API response structure
  useEffect(() => {
    console.log("API Response:", data);
    console.log("Error:", error);
    console.log("Loading state:", isLoading);
  }, [data, error, isLoading]);

  const handleFetchDetails = useCallback(async () => {
    if (!categoryName || !slug) {
      console.log("Missing categoryName or slug parameters");
      console.log("Available params:", params);
      return;
    }

    try {
      console.log("Fetching data for:", `${categoryName}/${slug}`);
      const result = await getSingleConverterDetails({
        tech_calculator_link: `${categoryName}/${slug}`,
      }).unwrap();

      console.log("API result:", result);

      // Check if we have the expected data structure
      if (result && result.payload && result.payload.calculator) {
        console.log("Data structure is valid");
        setNotFound(false);
      } else {
        console.log("Unexpected data structure:", result);
        setNotFound(true);
      }
    } catch (err) {
      console.error("Error fetching calculator details:", err);
      toast.error("Failed to load converter data. Please try again.");
      setNotFound(true);
    }
  }, [getSingleConverterDetails, categoryName, slug, params]);

  useEffect(() => {
    handleFetchDetails();
  }, [handleFetchDetails]);

  // Update loading state based on Redux mutation state
  useEffect(() => {
    if (data || error) {
      setLoading(false);
    }
  }, [data, error]);

  // Redirect to 404 page if data not found
  useEffect(() => {
    if (notFound) {
      console.log("Data not found, redirecting to 404");
      router.push("/404");
    }
  }, [notFound, router]);

  // Helper function to format a raw link string into a human-readable title
  const formatLinkTitle = (link) => {
    if (!link) return "";

    const cal_title_parts = link.split("/");
    const relevantPart =
      cal_title_parts.length > 1 ? cal_title_parts[1] : cal_title_parts[0];
    const cal_title_words = relevantPart.split("-");

    const formattedTitle = cal_title_words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedTitle;
  };

  // Parse the tech_lang_keys string with better error handling
  const langKeysString = data?.payload?.calculator?.tech_lang_keys;
  let langObject = {};

  try {
    langObject = langKeysString ? JSON.parse(langKeysString) : {};
    console.log("Parsed langObject:", langObject);
  } catch (error) {
    console.error(
      "Error parsing tech_lang_keys:",
      error,
      "String was:",
      langKeysString
    );
    // Set default values to prevent crashes
    langObject = {
      from: "From",
      to: "To",
      clear: "Clear",
      unit1: unit1 || "",
      unit2: unit2 || "",
      1: "Volume",
      2: "Converters",
    };
  }

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const results = (final_res) => {
    if (final_res === "Error" || isNaN(final_res) || !isFinite(final_res))
      return "Error";

    var gniTotalDigits = 12;
    var valStr = "" + final_res;

    if (valStr.indexOf("N") >= 0) return "Error";

    var i = valStr.indexOf("e");
    if (i >= 0) {
      var expStr = valStr.substring(i + 1, valStr.length);
      if (i > 11) i = 11;
      valStr = valStr.substring(0, i);
      if (valStr.indexOf(".") < 0) {
        valStr += ".";
      } else {
        let j = valStr.length - 1;
        while (j >= 0 && valStr.charAt(j) == "0") --j;
        valStr = valStr.substring(0, j + 1);
      }
      valStr += "E" + expStr;
    } else {
      var valNeg = false;
      if (final_res < 0) {
        final_res = -final_res;
        valNeg = true;
      }
      var valInt = Math.floor(final_res);
      var valFrac = final_res - valInt;
      var prec = gniTotalDigits - ("" + valInt).length - 1;

      var mult = "1000000000000000000".substring(0, prec + 1);
      mult = mult == "" ? 1 : parseInt(mult);

      var frac = Math.floor(valFrac * mult + 0.5);
      valInt = Math.floor(Math.floor(final_res * mult + 0.5) / mult);
      valStr = valNeg ? "-" + valInt : "" + valInt;

      var fracStr = "00000000000000" + frac;
      fracStr = fracStr.substring(fracStr.length - prec, fracStr.length);
      i = fracStr.length - 1;
      while (i >= 0 && fracStr.charAt(i) == "0") --i;
      fracStr = fracStr.substring(0, i + 1);
      if (i >= 0) valStr += "." + fracStr;
    }
    return valStr;
  };

  const handleFromChange = (val) => {
    setFrom(val);
    const parsed = parseFloat(val);

    if (!isNaN(parsed)) {
      // Check if we have the formula before trying to use it
      if (!langObject.formula1) {
        console.error("Formula1 is missing in langObject:", langObject);
        toast.error("Conversion formula not available");
        return;
      }

      const ans = evalFormula(parsed, langObject.formula1);
      const formatted = results(ans);
      setTo(ans);
      setResult(`${formatted} ${langObject.unit2 || ""}`);
      setShowResult(true);
    } else {
      reset();
    }
  };

  const handleToChange = (val) => {
    setTo(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      // Check if we have the reverse formula before trying to use it
      const reverseFormula = langObject.formula1Reverse || langObject.formula2;
      if (!reverseFormula) {
        console.error("Reverse formula is missing in langObject:", langObject);
        toast.error("Reverse conversion formula not available");
        return;
      }

      const ans = evalFormula(parsed, reverseFormula);
      const formatted = results(ans);
      setFrom(formatted);
      setResult(`${formatted} ${langObject.unit1 || ""}`);
      setShowResult(true);
    } else {
      reset();
    }
  };

  const evalFormula = (value, rawFormula) => {
    if (!rawFormula || typeof rawFormula !== "string") {
      console.error("Formula missing or invalid:", rawFormula);
      return "Error";
    }

    let formula = rawFormula.trim();
    console.log("Original formula:", formula);

    if (!formula.includes("from")) {
      if (/^[\/*+-]/.test(formula)) {
        formula = "from " + formula;
      } else if (/^\d/.test(formula)) {
        formula = "from * " + formula;
      }
    }

    if (!formula.startsWith("(")) {
      formula = "(" + formula;
    }
    if (!formula.endsWith(")")) {
      formula = formula + ")";
    }

    try {
      const expression = formula.replace(/from/g, value.toString());
      console.log("Evaluating expression:", expression);

      const result = evaluate(expression);
      console.log("Evaluation result:", result);

      if (isNaN(result) || result === undefined || result === null) {
        console.error("Invalid result:", result);
        return "Error";
      }

      return result;
    } catch (e) {
      console.error("Evaluation failed:", e.message);
      return "Error";
    }
  };

  const reset = () => {
    setFrom("");
    setTo("");
    setResult("");
    setShowResult(false);
  };

  const copyResult = () => {
    if (!result) return;

    navigator.clipboard
      .writeText(result)
      .then(() => {
        toast.success("Result copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy result");
      });
  };
  // SEO metadata
  const metaTitle =
    data?.payload?.calculator?.tech_meta_title || "Unit Converter";
  const metaDescription =
    data?.payload?.calculator?.tech_meta_des ||
    "Convert between different units";
  const ogImage = `https://calculator-logical.com/images/ogview/pages/calculator-logical.png`;

  // ✅ SSR safe window usage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Dynamic Meta Tags Update (Client-side)
  useEffect(() => {
    if (data?.payload?.calculator && typeof window !== "undefined") {
      const pageUrl = window.location.href;

      // Update page title
      document.title = metaTitle;

      // Update meta description
      updateMetaTag("name", "description", metaDescription);

      // Update canonical URL
      let linkCanonical = document.querySelector("link[rel='canonical']");
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute("href", pageUrl);

      // Update Open Graph tags
      updateMetaTag("property", "og:title", metaTitle);
      updateMetaTag("property", "og:description", metaDescription);
      updateMetaTag("property", "og:type", "website");
      updateMetaTag("property", "og:url", pageUrl);
      updateMetaTag("property", "og:image:width", "1200");
      updateMetaTag("property", "og:image:height", "630");
      updateMetaTag("property", "og:image", ogImage);
      updateMetaTag("property", "og:site_name", "Calculator Logical");

      // Update Twitter tags
      updateMetaTag("name", "twitter:card", "summary");
      updateMetaTag("name", "twitter:site", "@calculator-logical.com");
      updateMetaTag("name", "twitter:title", metaTitle);
      updateMetaTag("name", "twitter:description", metaDescription);
      updateMetaTag("name", "twitter:image", ogImage);
    }
  }, [data, metaTitle, metaDescription, ogImage]);

  const updateMetaTag = (attribute, value, content) => {
    if (typeof document === "undefined") return;

    let meta = document.querySelector(`meta[${attribute}="${value}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, value);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  // If not found, don't render the component (will redirect)
  if (notFound) {
    return null;
  }

  return (
    <>
      {/* <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:site_name" content="Calculator Logical" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        {currentUrl && <meta property="og:url" content={currentUrl} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@calculator-logical.com" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        {currentUrl && <link rel="canonical" href={currentUrl} />}
      </Head> */}

      {/* Add ToastContainer to render toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <ConverterWrap
        isLoading={loading || isLoading}
        data={data || {}}
        links={[
          { name: "Home", path: "/" },
          {
            name: data?.payload?.calculator?.tech_cal_cat || "Converters",
            path:
              "/" + (data?.payload?.calculator?.tech_cal_cat || "converters"),
          },
          {
            name:
              data?.payload?.calculator?.tech_calculator_title ||
              "Unit Converter",
            path: typeof window !== "undefined" ? window.location.pathname : "",
          },
        ]}
      >
        {!(loading || isLoading) && data && (
          <div className="grid grid-cols-12 ">
            <div className="col-span-2 hidden md:block"></div>
            <div className="col-span-12 md:col-span-12 ">
              <div className="calculator-box w-full bg-[#F4F4F4] rounded-lg shadow-md">
                <div className="grid grid-cols-12 gap-4 p-4 rounded-lg mx-auto">
                  {/* From input */}
                  <div className="col-span-1 hidden md:block"></div>
                  <div className="col-span-12 md:col-span-5 px-2">
                    <label htmlFor="from" className="label font-semibold">
                      {langObject.from}:
                    </label>
                    <div className="w-full pt-2 relative converter_input">
                      <input
                        type="number"
                        id="from"
                        value={from}
                        onChange={(e) => handleFromChange(e.target.value)}
                        placeholder="00"
                        className="input border rounded px-3 py-2 w-full"
                      />
                      <span className="input_unit top-7 absolute right-3 text-gray-600">
                        {langObject.unit1}
                      </span>
                    </div>
                  </div>
                  {/* To input */}
                  <div className="col-span-12 md:col-span-5 px-2">
                    <label htmlFor="to" className="label font-semibold">
                      {langObject.to}:
                    </label>
                    <div className="w-full pt-2 relative converter_input">
                      <input
                        type="number"
                        id="to"
                        value={to}
                        onChange={(e) => handleToChange(e.target.value)}
                        placeholder="00"
                        className="input border rounded px-3 py-2 w-full"
                      />
                      <span className="input_unit top-8 absolute right-3 text-gray-600">
                        {langObject.unit2}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 hidden md:block"></div>

                  {/* Clear Button */}
                  <div className="col-span-1 hidden md:block"></div>
                  <div className="col-span-6 px-2 flex">
                    <button
                      onClick={reset}
                      className="bg-[#2845F5] text-white px-4 py-2 rounded-lg cursor-pointer font-semibold"
                    >
                      {langObject.clear}
                    </button>
                  </div>

                  {/* Result */}
                  {showResult && (
                    <div className="col-span-12 mt-4 mx-auto res_ans">
                      <div className="flex items-center ">
                        <strong className="text-blue-600 col-span-12 text-[14px] md:text-[20px] font-bold me-2">
                          Result:
                        </strong>
                        <div className="flex items-center bg-white text-[14px] md:text-[20px] border border-gray-300 rounded-lg px-3 py-2 w-fit">
                          <div className="result font-bold text-[14px] md:text-[20px] text-gray-900">
                            <strong>{result}</strong>
                          </div>
                          <button
                            onClick={copyResult}
                            className="ml-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            <img
                              src="/images/copy.png"
                              alt="Copy Result"
                              title="Copy Result"
                              width="20"
                              height="20"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 ">
                <div className="grid grid-cols-12 gap-2 bg-white shadow-md my-2 p-2 content">
                  <p className="p-2 text-[18px] mt-5 col-span-12">
                    <strong>
                      {langObject["1"] || "Volume"}{" "}
                      {langObject["2"] || "Converters"}
                    </strong>
                  </p>

                  {Array.isArray(data?.payload?.all_sub) &&
                    data.payload.all_sub.map((value, index) => {
                      const calLink = value.tech_calculator_link;

                      if (!calLink) {
                        return null;
                      }

                      const formattedDisplayTitle = formatLinkTitle(calLink);

                      return (
                        <div
                          key={index}
                          className="col-span-12 md:col-span-6 px-2 text-[14px]"
                        >
                          <a
                            href={`/${calLink}/`}
                            className="p-1 text-black hover:text-blue-600 transition-colors"
                            title={formattedDisplayTitle}
                          >
                            {formattedDisplayTitle}
                          </a>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </ConverterWrap>
    </>
  );
};

export default SubConverter;
