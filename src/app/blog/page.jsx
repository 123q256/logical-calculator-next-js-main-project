import BlogContent from "./BlogContent";

export const metadata = {
  title: "Logical-calculator.com Blog",
  description: "Logical-calculator.com Blog page",
  alternates: {
    canonical: "https://calculator-logical.com/blog",
  },
  openGraph: {
    title: "Logical-calculator.com Blog",
    description: "Logical-calculator.com Blog page",
    siteName: "Calculator Logical",
    type: "website",
    url: "https://calculator-logical.com/blog",
    images: [
      {
        url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@calculator-logical.com",
    title: "Logical-calculator.com Blog",
    description: "Logical-calculator.com Blog page",
    images: [
      "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
    ],
  },
};

export default function Blogs() {
  return <BlogContent />;
}
