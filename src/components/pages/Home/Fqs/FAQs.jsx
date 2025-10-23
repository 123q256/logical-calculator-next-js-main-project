import React, { useState } from "react";

const FAQs = () => {
  const faqList = [
    {
      question: "What types of calculators are available on Calculator Logical?",
      answer:
        "Calculator Logical offers a wide range of calculators across categories like Health, Math, Everyday Life, Finance, Physics, Chemistry, Statistics, Construction, Pets, and Time & Date. You can find tools to solve everyday problems and academic calculations easily."
    },
    {
      question: "Do I need to sign up or log in to use these calculators?",
      answer:
        "No, all calculators on Calculator Logical are completely free and can be used without signing up or logging in. Just visit the page and start calculating."
    },
    {
      question: "Can I use the calculators on mobile devices?",
      answer:
        "Yes, all calculators are fully responsive and optimized for mobile devices, tablets, and desktops. You can access them anytime, anywhere."
    },
    {
      question: "How accurate are the calculators?",
      answer:
        "Our calculators are built using verified formulas and logic to provide accurate results. However, for critical use cases (like medical or legal decisions), it's always good to double-check or consult a professional."
    },
    {
      question: "Where can I find the most used calculators?",
      answer:
        "The 'Popular Calculators' section on the homepage highlights the most used tools, such as BMI Calculator, Weight Loss Calculator, Percentage Calculator, and more."
    },
    {
      question: "Are there any limitations to using the calculators?",
      answer:
        "No, you can use any calculator as many times as you want. There are no restrictions or hidden charges for using any feature on the site."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0); // First open by default

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-5 pb-10">
      <h2 className="md:text-2xl text-lg font-bold mb-6 text-center text-[#2845F5]">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqList.map((faq, index) => (
          <div
            key={index}
            className="border border-green-300 rounded-xl transition"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full flex justify-between items-center p-4 text-left rounded-xl transition-all duration-200 ${
                openIndex === index
                  ? "bg-green-100"
                  : "bg-green-50 hover:bg-green-100"
              }`}
            >
              <span className="text-base font-semibold text-[#000000]">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-green-600 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-4 py-4 text-sm text-black">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
