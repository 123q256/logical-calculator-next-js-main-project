import Link from "next/link";
export const metadata = {
  title: "About Us - Logical-calculator.com",
  description: "About Us - Logical-calculator.com",
  alternates: {
    canonical: "https://calculator-logical.com/about",
  },
  openGraph: {
    title: "About Us - Logical-calculator.com",
    description: "About Us - Logical-calculator.com",
    siteName: "Calculator Logical",
    type: "website",
    url: "https://calculator-logical.com/about",
    images: [
      {
        url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
        width: 1200,
        height: 630,
        alt: "About Us - Calculator Logical",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calculator-logical.com",
    title: "About Us - Logical-calculator.com",
    description: "About Us - Logical-calculator.com",
    images: [
      "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
    ],
  },
};
const About = () => {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 px-5 mb-[60px]">
      <h1 className="text-center my-10 lg:text-[35px] md:text-[35px] text-[30px] font-[700] leading-[46.87px]">
        About
      </h1>
      <p className=" my-4 text-[16px] leading-[28.71px]">
        Welcome to calculator-logical.com, your reliable web portal providing
        various calculators to ease complicated calculations. Our system
        provides powerful tools for various tasks, ranging from algebraic
        equations and statistical evaluations to financial forecasts and health
        metrics. Regardless of your status student, worker, or health/finance
        novice our calculators produce precise and easy-to-understand results
        quickly.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        Our Mission
      </h2>
      <p className=" my-4 text-[16px] leading-[28.71px]">
        At calculator-logical.com, our objective is to provide users with
        reliable, accurate, and accessible calculators that aid in knowledgeable
        decision-making in diverse fields. We trust in facilitating complex
        calculations and transformations for everyone, regardless of the field
        or industry.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        Categories We Cover.
      </h2>
      <p className=" my-4 text-[16px] leading-[18.71px]">
        Our calculators span an extensive variety to suit diverse customer
        needs.
      </p>
      <ul className="list-disc list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Mathematics and Statistical Analysis:</strong>
          <span className="pl-1">
            Algebra, Geometry, Calculus, and Statistical Techniques for
            Learners, Teachers, and Experts..
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Finance:</strong>
          <span className="pl-1">
            Loan predictors, interest calculators, savings tools, and economic
            counsel for financial clarity and strategic planning.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Physics: </strong>
          <span className="pl-1">
            Instruments for solving physical equations, metric transformations,
            and engineering applications.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Health: </strong>
          <span className="pl-1">
            Body Mass Index, Basal Metabolic Rate, adiposity gauges, and
            additional vitality metrics.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Informational: </strong>
          <span className="pl-1">
            Fundamental implements for daily activities, including timepieces,
            agendas, and proportion calculators.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Others: </strong>
          <span className="pl-1">
            Unique tools assist in tasks spanning from cooking volume
            assessments to power usage enhancement.
          </span>
        </li>
      </ul>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        Why Choose calculator-logical.com?
      </h2>
      <ul className="list-decimal list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Accuracy:</strong>
          <span className="pl-1">
            Every calculator is subjected to thorough review and validation by
            experts in the relevant fields.
          </span>
        </li>
        <li className="my-4 text-[16px] leading-[28.71px]">
          <strong>User-Friendly:</strong>
          <span className="pl-1">
            We highlight user-friendliness, guaranteeing that anyone, regardless
            of their skill level, can effortlessly handle our devices.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Constant Updates: </strong>
          <span className="pl-1">
            Our team regularly adjusts their tools to ensure accuracy,
            incorporate enhancements, and reflect any changes in standards.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Data Security: </strong>
          <span className="pl-1">
            We are committed to protecting your privacy and will not retain any
            personally-provided information.
          </span>
        </li>
      </ul>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        Commitment to Quality
      </h2>
      <p className=" my-4 text-[16px] leading-[28.71px]">
        At calculator-logical.com, we hold ourselves to high editorial
        standards. Our platform's calculators and content are developed and
        scrutinized by specialists to ensure they're current, precise, and
        beneficial for users.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        Editorial Policies
      </h2>
      <p className=" my-4 text-[16px] leading-[28.71px]">
        Our Editorial Guidelines guide our promise of offering trustworthy,
        superior information.
      </p>
      <ul className="list-disc list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Accuracy and Reliability:</strong>
          <span className="pl-1">
            Every computator is scrupulously inspected and confirmed for
            exactness by expert assessors. We strive to ensure the highest
            reliability in all equipment and affirm they reflect current
            professional standards and industry norms.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Content Integrity:</strong>
          <span className="pl-1">
            Our calculators are designed to be impartial and educational. We
            circumvent possible biases or promotional material that may
            undermine the impartiality or reliability of the provided data.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Timeliness: </strong>
          <span className="pl-1">
            We consistently evaluate our instruments Users can depend on our
            calculators to furnish the most recent and relevant results.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>User Feedback:</strong>
          <span className="pl-1">
            Your feedback is invaluable. Motivate users to express their
            concepts or issues with us to help us consistently enhance our
            offerings manners to more precisely satisfy user specifications
          </span>
        </li>
      </ul>
      <p className="my-4 text-[16px] leading-[28.71px]">
        For additional details regarding our upkeep of these benchmarks, consult
        the &nbsp;
        <Link href="/editorial" className="hover:underline text-[#2845F5]">
          Editorial
        </Link>
        &nbsp; Guidelines section.
      </p>

      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        Get in Touch
      </h2>

      <p className="my-4 text-[16px] leading-[28.71px]">
        Your experience matters to us. Should you have inquiries, remarks, or
        suggestions, feel free to &nbsp;
        <Link href="/contact" className="hover:underline text-[#2845F5]">
          Contact us
        </Link>
        &nbsp; through our web page. Collaboratively, we can convert
        calculator-logical.com into a more potent and user-friendly tool for
        every user.
      </p>

      <p className="my-4 text-[16px] leading-[28.71px]">
        Thank you for choosing calculator-logical.com as your calculator
        companion. We aim to support you in cultivating well-informed and
        assured decisions with every calculation.
      </p>
    </div>
  );
};

export default About;
