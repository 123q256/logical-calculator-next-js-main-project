import FeedbackForm from "./FeedbackForm";

export const metadata = {
  title: "Feedback - Logical-calculator.com",
  description: "Feedback - Logical-calculator.com",
  alternates: {
    canonical: "https://calculator-logical.com/feedback",
  },
  openGraph: {
    title: "Feedback - Logical-calculator.com",
    description: "Feedback - Logical-calculator.com",
    siteName: "Calculator Logical",
    type: "website",
    url: "https://calculator-logical.com/feedback",
    images: [
      {
        url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
        width: 1200,
        height: 630,
        alt: "Calculator Logical - Feedback",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calculator-logical.com",
    title: "Feedback - Logical-calculator.com",
    description: "Feedback - Logical-calculator.com",
    images: ["https://calculator-logical.com/images/ogview/pages/calculator-logical.png"],
  },
};

export default function FeedbackPage() {
  return <FeedbackForm />;
}
