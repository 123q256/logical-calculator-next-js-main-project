// app/editorial-policies/page.jsx
import EditorialPoliciesContent from "./EditorialPoliciesContent";

export const metadata = {
  title: "Editorial Policies - Logical-calculator.com",
  description:
    "You need to agree with our Editorial Policies statement. If there are any questions or queries regarding this statement, feel free to contact us.",
  alternates: {
    canonical: "https://calculator-logical.com/editorial-policies",
  },
  openGraph: {
    title: "Editorial Policies - Logical-calculator.com",
    description:
      "You need to agree with our Editorial Policies statement. If there are any questions or queries regarding this statement, feel free to contact us.",
    siteName: "Calculator Logical",
    type: "website",
    url: "https://calculator-logical.com/editorial-policies",
    images: [
      {
        url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
        width: 1200,
        height: 630,
        alt: "Calculator Logical - Editorial Policies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calculator-logical.com",
    title: "Editorial Policies - Logical-calculator.com",
    description:
      "You need to agree with our Editorial Policies statement. If there are any questions or queries regarding this statement, feel free to contact us.",
    images: [
      "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
    ],
  },
};

export default function EditorialPoliciesPage() {
  return <EditorialPoliciesContent />;
}
