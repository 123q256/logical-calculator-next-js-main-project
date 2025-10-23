// src/app/disclaimer/page.jsx
import DisclaimerContent from "./DisclaimerForm";

export const metadata = {
  title: "Legal Content Disclaimer - Logical-calculator.com",
  description:
    "The use of this site is done at your own risk and even with your agreement that you will be only responsible for any conditions!",
  alternates: {
    canonical: "https://calculator-logical.com/disclaimer",
  },
  openGraph: {
    title: "Legal Content Disclaimer - Logical-calculator.com",
    description:
      "The use of this site is done at your own risk and even with your agreement that you will be only responsible for any conditions!",
    siteName: "Calculator Logical",
    type: "website",
    url: "https://calculator-logical.com/disclaimer",
    images: [
      {
        url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
        width: 1200,
        height: 630,
        alt: "Calculator Logical - Disclaimer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calculator-logical.com",
    title: "Legal Content Disclaimer - Logical-calculator.com",
    description:
      "The use of this site is done at your own risk and even with your agreement that you will be only responsible for any conditions!",
    images: [
      "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
    ],
  },
};

export default function DisclaimerPage() {
  return <DisclaimerContent />;
}
