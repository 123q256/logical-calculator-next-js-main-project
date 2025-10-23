// app/privacy-policy/page.js
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy And Cookies - Logical-calculator.com",
  description:
    "You need to agree with our privacy policy statement. If there are any questions and queries regarding this statement, feel free to contact us.",
  alternates: {
    canonical: "https://calculator-logical.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy And Cookies - Logical-calculator.com",
    description:
      "You need to agree with our privacy policy statement. If there are any questions and queries regarding this statement, feel free to contact us.",
    siteName: "Calculator Logical",
    type: "website",
    url: "https://calculator-logical.com/privacy-policy",
    images: [
      {
        url: "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
        width: 1200,
        height: 630,
        alt: "Calculator Logical - Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calculator-logical.com",
    title: "Privacy Policy And Cookies - Logical-calculator.com",
    description:
      "You need to agree with our privacy policy statement. If there are any questions and queries regarding this statement, feel free to contact us.",
    images: [
      "https://calculator-logical.com/images/ogview/pages/calculator-logical.png",
    ],
  },
};

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 px-5 mb-[60px]">
      <h1 className="text-center my-10 lg:text-[35px] md:text-[35px] text-[30px] font-[700] leading-[46.87px]">
        Privacy Policy
      </h1>

      <p className="my-4 text-[16px] leading-[28.71px]">
        This Data Policy details how we gather, utilize, reveals, and protects
        your information upon visiting our site. By using this channel, you
        agree to the gathering and utilization of data in line with the current
        Data Privacy Rules. Please take the time to read this document to
        understand our methods.
      </p>

      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        1. Information We Collect
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        We have a lot of data about those who use our site.
      </p>
      <ul className="list-disc list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Personal Information:</strong>
          <span className="pl-1">
            We might need your name or email if you need help or join our email
            list.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Non-Personal Information:</strong>
          <span className="pl-1">
            This includes details that don't directly identify a person. Your IP
            address, Internet browser, operating system, specific device, and
            usage information.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Cookies and Tracking Technologies:</strong>
          <span className="pl-1">
            Cookies and Tracking Technologies: We employ cookies, pixel
            trackers, and akin monitoring tools to enhance your experience,
            analyze user behavior, and optimize our calculator's features.
            Cookies are minuscule data repositories stored on your device to
            determine your preferences and enhance your engagement with our
            website.
          </span>
        </li>
      </ul>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        2. How We Use Your Information
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        The information we collect serves several purposes.
      </p>
      <ul className="list-disc list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>To Provide and Personalize Services:</strong>
          <span className="pl-1">
            We employ your statistics to function, maintain, and refine the
            calculators on our platform.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>To Enhance User Experience:</strong>
          <span className="pl-1">
            To improve user experience, we analyze usage trends to refine our
            calculator.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>To Communicate with You:</strong>
          <span className="pl-1">
            If you choose to get them, we will reply to your questions, deliver
            updates, or dispatch announcements.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>To Conduct Analytics and Research: </strong>
          <span className="pl-1">
            Impersonal figures allow us to understand how individuals interact
            with our devices.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>To Ensure Compliance and Security:</strong>
          <span className="pl-1">
            We might use your information to safeguard the platform, maintain
            regulations and fulfill legal responsibilities.
          </span>
        </li>
      </ul>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        3. Legal Bases for Processing Your Information
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        Our legal bases for processing your information include.
      </p>
      <ul className="list-disc list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Consent: </strong>
          <span className="pl-1">
            Where applicable, we may seek your endorsement for certain sorts of
            processing, such as for analytics and promotional cookie tracking.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Legitimate Interests</strong>
          <span className="pl-1">
            We process your data based on our authentic interests to operate and
            enhance our Site, provided it does not infringe upon your rights.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Legal Compliance:</strong>
          <span className="pl-1">
            We process your data to align with relevant legal statutes,
            regulatory stipulations, and obligatory legal requests.
          </span>
        </li>
      </ul>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        4. How We Share Your Information
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        We do not sell or rent your information.However, we may share your
        information as follows.
      </p>
      <ul className="list-disc list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Service Providers:</strong>
          <span className="pl-1">
            Independent outsourcing firms may have access to your data to
            execute website-related tasks, like website hosting, web traffic
            analysis, and data management.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Legal Requirements:</strong>
          <span className="pl-1">
            We may disclose the data if it is imperative to fulfill our legal
            duties or due to legitimate requests from official jurisdictions.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Business Transfers:</strong>
          <span className="pl-1">
            In the event of a merger, acquisition, or sale of our assets, your
            information may be transferred to the new ownership, and you will be
            notified of any change in data management.
          </span>
        </li>
      </ul>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        5. Cookies and Tracking Technologies
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        Our Site employs cookies and analogous advancements to augment your
        experience.These include:
      </p>
      <ul className="list-disc list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Essential Cookies:</strong>
          <span className="pl-1">
            Imperative for the operation of our Website and calculators.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Analytics Cookies:</strong>
          <span className="pl-1">
            Utilized to amass data on how users interact with our platform,
            enabling us to refine our offerings.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Marketing Cookies:</strong>
          <span className="pl-1">
            Employed to display relevant promotions and material pertinent to
            your preferences.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Managing Cookies: </strong>
          <span className="pl-1">
            You can control your cookie preferences within your browser
            settings. Please note that disabling specific cookies may impede
            your engagement with our Website.
          </span>
        </li>
      </ul>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        6. Data Security
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        We retain your information for a duration no longer than necessary to
        fulfill the goals outlined in this Privacy Policy, or as required by
        law.Nonspecific details utilized for analysis might be conserved.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        7. Data Retention
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        We conserve your data solely for the duration essential to meet the
        goals stated in this Privacy Policy, or as obligated by legislation.
        Unrevealed details utilized for analytical purposes may be held for an
        extended period to aid us in enduring enhancements to our Platform.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        8. Your Privacy Rights
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        Depending on your area, you may hold the subsequent entitlements
        pertaining to your private data.
      </p>
      <ul className="list-disc list-inside">
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Access:</strong>
          <span className="pl-1">
            You are authorized to acquire the confidential data we maintain
            concerning you.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Correction:</strong>
          <span className="pl-1">
            You may petition alteration for any erroneous or insufficient
            individual data.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Deletion:</strong>
          <span className="pl-1">
            You may request the removal of your personal particulars, except in
            specific cases.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Objecting to Processing: </strong>
          <span className="pl-1">
            You may express opposition to specific types of processing, such as
            personalized advertising.
          </span>
        </li>
        <li className=" my-4 text-[16px] leading-[28.71px]">
          <strong>Data Accessibility: </strong>
          <span className="pl-1">
            You may solicitatively call for your information in a structured,
            commonly employed structure.
          </span>
        </li>
      </ul>
      <p className="my-4 text-[16px] leading-[28.71px]">
        To engage any of these entitlements, please contact us using the details
        supplied below.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        9. Third-Party Websites
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        Our Platform may associate with third-party internet sites or services
        not administered by us. This Privacy Agreement omits outside sites, and
        we promote you to examine their data privacy policies before engaging
        with them.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        10. Do-Not-Track Signals
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        You can alter your tracking options via the browser configurations.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        11. Children’s Privacy
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        Our platform We consciously abstain from gathering details from minors
        under the age of thirteen, and we swiftly eliminate any such information
        once discovered.
      </p>
      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        12. Privacy Policy Updates
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        We might alter this Privacy Policy from time to time to conform with
        changes in our procedures, legal obligations, or business needs. We urge
        you to routinely visit this page to remain informed about any
        modifications.
      </p>

      <h2 className="lg:text-[26px] md:text-[26px] text-[20px] leading-[31.25px] font-[700]">
        13. Contact Us
      </h2>
      <p className="my-4 text-[16px] leading-[28.71px]">
        If you have inquiries, issues, or wish to assert your rights regarding
        this Privacy Policy, please reach out to us at the &nbsp;
        <Link className="hover:underline text-[#2845F5]" href="/contact">
          Contact page
        </Link>
        .
      </p>

      <p className="my-4 text-[16px] leading-[28.71px]">
        Our Privacy Disclosure aims to outline our method for managing and
        protecting your information during our online computational tools'
        interaction. By continuously employing our system, you agree to the
        conditions outlined in this contract.
      </p>

      <p className="my-4 text-[16px] leading-[28.71px]">
        Thank you for choosing calculator-logical.com for your calculation
        needs.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
