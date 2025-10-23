// src/app/contact/page.jsx
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us - Get in Touch with Us Anytime, Anywhere",
  description:
    "Have questions or need assistance? We're here to help! Please fill out the form below, and our team at Calculator-Online will get back to you as soon as possible. We look forward to hearing from you!",
  alternates: {
    canonical: "https://calculator-logical.com/contact", // canonical URL
  },
  openGraph: {
    title: "Contact Us - Get in Touch with Us Anytime, Anywhere",
    description:
      "Have questions or need assistance? We're here to help! Please fill out the form below, and our team at Calculator-Online will get back to you as soon as possible. We look forward to hearing from you!",
    siteName: "Calculator Logical",
    type: "website",
    url: "https://calculator-logical.com/contact", // <-- fixed missing og:url
    images: [
      {
        url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@calculator-logical.com",
    title: "Contact Us - Get in Touch with Us Anytime, Anywhere",
    description:
      "Have questions or need assistance? We're here to help! Please fill out the form below, and our team at Calculator-Online will get back to you as soon as possible. We look forward to hearing from you!",
    images: [
      "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
    ],
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
