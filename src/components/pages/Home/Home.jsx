import React, { useEffect, lazy, Suspense } from "react";
import SearchBar from "./SearchBar/SearchBar";
import Calculator from "./Calculator/Calculator";
import CategorySection from "./category/CategorySection";
// import FAQs from "./Fqs/FAQs";
// import AboutCalculation from "./Calculation/AboutCalculation";
// import FreeCalculators from "./Calculation/FreeCalculators";
// import BlogSection from "./BlogSection/BlogSection";

import { Helmet } from "react-helmet";
// 👇 Lazy Loaded Components
const AboutCalculator = lazy(() => import("./AboutCalculator/AboutCalculator"));
const CalculatorCategory = lazy(() =>
  import("./CalculatorCategory/CalculatorCategory")
);
const Home = () => {
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
  const currentUrl = window?.location?.href;
  const ogImage = `https://calculator-logical.com/images/ogview/pages/calculator-logical.png`;
  const metaTitle =
    "Calculators Logical Online - 100% Free, Reliable & Accurate Calculators Logical";
  const metaDescription =
    "The 100% free and reliable online Calculators Logical that help you solve any calculation-related problems and provide you with precise measurements.";

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:site_name" content="Calculator Logical" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@calculator-logical.com" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link
          rel="canonical"
          href={`https://calculator-logical.com${window.location.pathname}`}
        />
      </Helmet>

      <div className="lg:text-[35px] md:text-[35px] text-[30px] pt-5 font-[700]  text-center">
        <h1 className="text-[#2845F5]">
          Calculator <span className="text-[#1A1A1A]">Logical</span>{" "}
        </h1>
      </div>
      <SearchBar />
      <Calculator />
      <CategorySection />

      <Suspense fallback={<div className="text-center font-bold mb-4">Loading More Sections...</div>}>
        <CalculatorCategory />
        <AboutCalculator />
      </Suspense>
    </>
  );
};

export default Home;
