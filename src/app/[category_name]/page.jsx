// app/category/[category_name]/page.js
import { notFound } from "next/navigation";
import CategoryDetailClient from "./CategoryDetailClient";

const allowedCategories = [
  "health",
  "math",
  "everyday-life",
  "finance",
  "physics",
  "chemistry",
  "statistics",
  "construction",
  "pets",
  "timedate",
];

// Mock data (replace with API if needed)

const mockCategoryData = {
  health: {
    category_name: "Health Calculators",
    meta_title: "Health Calculators - Calculate Your Health Metrics",
    meta_des:
      "Comprehensive health calculators for BMI, calorie needs, medication dosage, and more health-related calculations.",
    des: "Explore our wide range of health calculators to monitor and improve your wellbeing.",
  },
};

export async function generateMetadata({ params }) {
  const { category_name } = params;

  if (!allowedCategories.includes(category_name.toLowerCase())) {
    return {
      title: "Category Not Found - Calculator Logical",
      description: "The requested category was not found.",
    };
  }

  const category = mockCategoryData[category_name] || {
    category_name: `${category_name} Calculators`,
    meta_title: `${
      category_name.charAt(0).toUpperCase() + category_name.slice(1)
    } Calculators - Calculator Logical`,
    meta_des: `Explore our ${category_name} calculators for accurate results.`,
    des: `Various calculators for ${category_name} related calculations.`,
  };

  return {
    title: category.meta_title,
    description: category.meta_des,
    openGraph: {
      title: category.meta_title,
      description: category.meta_des,
      url: `https://calculator-logical.com/category/${category_name}`,
      siteName: "Calculator Logical",
      images: [
        {
          url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
          width: 1200,
          height: 630,
          alt: "Calculator Logical",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: category.meta_title,
      description: category.meta_des,
      images: [
        "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
      ],
    },
    alternates: {
      canonical: `https://calculator-logical.com/category/${category_name}`,
    },
  };
}

export default function CategoryPage({ params }) {
  const { category_name } = params;

  if (!allowedCategories.includes(category_name.toLowerCase())) {
    notFound();
  }

  return <CategoryDetailClient categoryName={category_name} />;
}
