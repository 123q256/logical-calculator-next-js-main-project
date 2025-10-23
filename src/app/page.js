// app/page.jsx

import SearchBar from "@/components/pages/Home/SearchBar/SearchBar";
import Calculator from "@/components/pages/Home/Calculator/Calculator";
import CategorySection from "@/components/pages/Home/category/CategorySection";
import AboutCalculator from "@/components/pages/Home/AboutCalculator/AboutCalculator";
import CalculatorCategory from "@/components/pages/Home/CalculatorCategory/CalculatorCategory";
import Celebration from "@/components/common/Celebration";
// Metadata for static home page
export const metadata = {
  title:
    "Calculators Logical Online - 100% Free, Reliable & Accurate Calculators Logical",
  description:
    "The 100% free and reliable online Calculators Logical that help you solve any calculation-related problems and provide you with precise measurements.",

  // ✅ Canonical URL fix
  alternates: {
    canonical: "https://calculator-logical.com",
  },

  openGraph: {
    title:
      "Calculators Logical Online - 100% Free, Reliable & Accurate Calculators Logical",
    description:
      "The 100% free and reliable online Calculators Logical that help you solve any calculation-related problems and provide you with precise measurements.",
    url: "https://calculator-logical.com",
    siteName: "Calculator Logical",
    type: "website",
    images: [
      {
        url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
        width: 1200,
        height: 630,
        alt: "Calculator Logical - Free Online Calculators",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@calculatorlogical", // ✅ missing tag fix
    title:
      "Calculators Logical Online - 100% Free, Reliable & Accurate Calculators Logical",
    description:
      "The 100% free and reliable online Calculators Logical that help you solve any calculation-related problems and provide you with precise measurements.",
    images: [
      "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
    ],
    creator: "@calculatorlogical",
  },
};

export default function HomePage() {
  return (
    <>
      <Celebration /> {/* 🎉 Show only on homepage */}
      <div className="pt-5 text-center font-[700]">
        <h1 className="flex justify-center items-center gap-2 lg:text-[35px] md:text-[35px] text-[30px]">
          <img
            src="/logo.png"
            className="h-8"
            alt="Header Logo"
            title="Header Logo"
            loading="lazy"
          />
          <span className="text-[#2845F5]">
            Calculator <span className="text-[#1A1A1A]">Logical</span>
          </span>
        </h1>
      </div>
      <SearchBar />
      <Calculator />
      <CategorySection />
      <CalculatorCategory />
      <AboutCalculator />
    </>
  );
}
