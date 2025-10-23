"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRegisterNewUserMutation } from "../../../redux/services/auth/authApi";
import { toast } from "react-toastify";

const Signup = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerNewUser, { isLoading }] = useRegisterNewUserMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const result = await registerNewUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      if (typeof window !== "undefined") {
        sessionStorage.setItem("otp_id", result?.payload?.otp_id);
        sessionStorage.setItem("email", result?.payload?.email);
      }

      toast.success("User Register Successfully");
      // Navigate to OTP page on success
      router.push("/otp");
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  const metaTitle = "Signup Page - Calculators Logical";
  const metaDescription = "Signup Page - Calculators Logical";
  const ogImage =
    "https://calculator-logical.com/images/ogview/pages/calculator-logical.png";

  // ✅ SSR safe window usage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  return (
    <div className="flex justify-center items-center   relative">
      <Head>
        <title>{metaTitle || "My App"}</title>
        <meta name="description" content={metaDescription || "Description."} />
        <meta property="og:site_name" content="Calculator Logical" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        {currentUrl && <meta property="og:url" content={currentUrl} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@calculator-logical.com" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        {currentUrl && <link rel="canonical" href={currentUrl} />}
      </Head>
      {/* The backdrop overlay */}
      <div className="absolute inset-0" />
      {/* Your content here */}
      <div className="z-10 flex 2xl:w-[65%] xl:w-[70%] lg:w-[75%] w-[90%]  my-10 bg-white rounded-[25px]  shadow-lg bordered">
        <div
          className="lg:w-[50%] lg:rounded-[0px] rounded-[25px] w-[100%] 2xl:my-8 xl:my-4 lg:my-2 my-3 2xl:px-[50px] xl:px-[40px] lg:px-[35px] px-6"
          style={{
            backgroundImage: `url('/logo/login-bg-img.png')`,
            backgroundSize: "cover",
          }}
        >
          <a
            href="/"
            className="flex my-5 items-center text-left  space-x-3 rtl:space-x-reverse mr-auto"
          >
            <img
              src="/logo/logo.png"
              className="h-8"
              alt="Header-Logo"
              title="Header-Logo"
              loading="lazy"
            />
            <div className="lg:pl-1 md:pl-1 text-center">
              <span className="self-center lg:text-[19px] text-[14px] font-semibold whitespace-nowrap">
                Calculator
              </span>
              <p className="self-center lg:text-[15px] text-[12px] font-semibold whitespace-nowrap ">
                Logical
              </p>
            </div>
          </a>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block my-2 pl-5 xl:text-[14px] lg:text-[12px] text-[14px] font-medium text-[#A3A3A3]"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your Name"
                {...register("name", { required: "Name is required" })}
                className="bg-white border-[#F0F0F0] rounded-[36.5px] border-2 text-gray-900 text-sm block w-full 2xl:p-5 xl:p-4 lg:p-3 p-3 input_border"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 pl-5">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block my-2 pl-5 xl:text-[14px] lg:text-[12px] text-[14px] font-medium text-[#A3A3A3]"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email address",
                  },
                })}
                className="bg-white border-[#F0F0F0] rounded-[36.5px] border-2 text-gray-900 text-sm block w-full 2xl:p-5 xl:p-4 lg:p-3 p-3 input_border"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 pl-5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block my-2 pl-5 xl:text-[14px] lg:text-[12px] text-[14px] font-medium text-[#A3A3A3]"
              >
                Enter Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="bg-white border-[#F0F0F0] rounded-[36.5px] border-2 text-gray-900 text-sm block w-full 2xl:p-5 xl:p-4 lg:p-3 p-3 pr-[50px] input_border"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pr-4">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        width={25}
                        height={19}
                        viewBox="0 0 25 19"
                        id="showIcon"
                        className={`col-span-5 `}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.1795 7.64063C12.9351 7.64062 13.6738 7.41656 14.3021 6.99676C14.9303 6.57696 15.42 5.98028 15.7092 5.28217C15.9983 4.58407 16.074 3.8159 15.9266 3.07479C15.7792 2.33369 15.4153 1.65294 14.881 1.11864C14.3467 0.584333 13.666 0.220467 12.9248 0.0730524C12.1837 -0.0743618 11.4156 0.00129652 10.7175 0.290461C10.0194 0.579624 9.42269 1.06931 9.00288 1.69758C8.58308 2.32586 8.35902 3.06451 8.35902 3.82013C8.36022 4.83302 8.76313 5.80408 9.47935 6.5203C10.1956 7.23652 11.1666 7.63942 12.1795 7.64063ZM12.1795 1.69777C12.5993 1.69777 13.0096 1.82224 13.3586 2.05545C13.7077 2.28866 13.9797 2.62013 14.1403 3.00794C14.301 3.39575 14.343 3.82249 14.2611 4.23419C14.1792 4.64589 13.9771 5.02406 13.6802 5.32087C13.3834 5.61769 13.0053 5.81983 12.5936 5.90172C12.1819 5.98361 11.7551 5.94158 11.3673 5.78095C10.9795 5.62031 10.648 5.34828 10.4148 4.99926C10.1816 4.65024 10.0571 4.2399 10.0571 3.82013C10.0577 3.25743 10.2815 2.71795 10.6794 2.32006C11.0773 1.92217 11.6168 1.69837 12.1795 1.69777Z"
                          fill="#2845F5"
                        />
                        <path
                          d="M0.103756 6.03603C1.17448 8.22177 2.84229 10.0596 4.91415 11.3368L2.33903 14.0169C2.15992 14.206 2.0601 14.4566 2.0601 14.7171C2.0601 14.9776 2.15992 15.2282 2.33903 15.4173C2.42558 15.5089 2.52989 15.5818 2.64558 15.6316C2.76128 15.6814 2.88592 15.7071 3.01189 15.7071C3.13786 15.7071 3.2625 15.6814 3.3782 15.6316C3.49389 15.5818 3.59821 15.5089 3.68475 15.4173L6.70579 12.2731C8.1407 12.8907 9.67017 13.2597 11.2288 13.3645V17.8488C11.2244 17.9765 11.2457 18.1038 11.2916 18.2232C11.3374 18.3425 11.4068 18.4514 11.4956 18.5433C11.5844 18.6353 11.6908 18.7084 11.8085 18.7583C11.9262 18.8082 12.0527 18.834 12.1805 18.834C12.3083 18.834 12.4348 18.8082 12.5525 18.7583C12.6702 18.7084 12.7766 18.6353 12.8654 18.5433C12.9542 18.4514 13.0236 18.3425 13.0694 18.2232C13.1153 18.1038 13.1366 17.9765 13.1322 17.8488V13.3645C14.6906 13.2608 16.2201 12.8929 17.6552 12.2765L20.6762 15.4173C20.7627 15.509 20.867 15.5821 20.9827 15.632C21.0984 15.6819 21.2231 15.7076 21.3491 15.7076C21.4751 15.7076 21.5998 15.6819 21.7155 15.632C21.8312 15.5821 21.9355 15.509 22.022 15.4173C22.2011 15.2282 22.3009 14.9776 22.3009 14.7171C22.3009 14.4566 22.2011 14.206 22.022 14.0169L19.4468 11.3368C21.5183 10.0594 23.1857 8.22162 24.2561 6.03603C24.3706 5.80282 24.3907 5.53445 24.3123 5.28677C24.234 5.03908 24.0631 4.83116 23.8353 4.70627C23.7232 4.64808 23.6004 4.61324 23.4744 4.60386C23.3484 4.59448 23.2219 4.61075 23.1024 4.65169C22.9828 4.69262 22.8729 4.75738 22.7791 4.84203C22.6854 4.92669 22.6097 5.02948 22.5568 5.1442C21.5869 7.05583 20.1002 8.65704 18.2656 9.76585C16.431 10.8747 14.3222 11.4466 12.1788 11.4167C10.0354 11.4466 7.92655 10.8747 6.09198 9.76585C4.25741 8.65704 2.77067 7.05583 1.80074 5.1442C1.74784 5.02948 1.67222 4.92669 1.57846 4.84203C1.4847 4.75738 1.37473 4.69262 1.25522 4.65169C1.13572 4.61075 1.00914 4.59448 0.883167 4.60386C0.757191 4.61324 0.634426 4.64808 0.522299 4.70627C0.294895 4.83154 0.12451 5.03963 0.0465622 5.28728C-0.0313854 5.53493 -0.0109024 5.80309 0.103756 6.03603Z"
                          fill="#2845F5"
                        />
                      </svg>
                    ) : (
                      <svg
                        id="hideIcon"
                        xmlns="http://www.w3.org/2000/svg"
                        width={25}
                        height={15}
                        className={`col-span-5}`}
                        viewBox="0 0 25 15"
                        fill="none"
                      >
                        <path
                          d="M0.103756 2.03603C1.17448 4.22177 2.84229 6.0596 4.91415 7.33682L2.33903 10.0169C2.15992 10.206 2.0601 10.4566 2.0601 10.7171C2.0601 10.9776 2.15992 11.2282 2.33903 11.4173C2.42558 11.5089 2.52989 11.5818 2.64558 11.6316C2.76128 11.6814 2.88592 11.7071 3.01189 11.7071C3.13786 11.7071 3.2625 11.6814 3.3782 11.6316C3.49389 11.5818 3.59821 11.5089 3.68475 11.4173L6.70579 8.27313C8.1407 8.89067 9.67017 9.25973 11.2288 9.36453V13.8488C11.2244 13.9765 11.2457 14.1038 11.2916 14.2232C11.3374 14.3425 11.4068 14.4514 11.4956 14.5433C11.5844 14.6353 11.6908 14.7084 11.8085 14.7583C11.9262 14.8082 12.0527 14.834 12.1805 14.834C12.3083 14.834 12.4348 14.8082 12.5525 14.7583C12.6702 14.7084 12.7766 14.6353 12.8654 14.5433C12.9542 14.4514 13.0236 14.3425 13.0694 14.2232C13.1153 14.1038 13.1366 13.9765 13.1322 13.8488V9.36453C14.6906 9.26082 16.2201 8.89292 17.6552 8.27655L20.6762 11.4173C20.7627 11.509 20.867 11.5821 20.9827 11.632C21.0984 11.6819 21.2231 11.7076 21.3491 11.7076C21.4751 11.7076 21.5998 11.6819 21.7155 11.632C21.8312 11.5821 21.9355 11.509 22.022 11.4173C22.2011 11.2282 22.3009 10.9776 22.3009 10.7171C22.3009 10.4566 22.2011 10.206 22.022 10.0169L19.4468 7.33682C21.5183 6.05943 23.1857 4.22162 24.2561 2.03603C24.3706 1.80282 24.3907 1.53445 24.3123 1.28677C24.234 1.03908 24.0631 0.831162 23.8353 0.706272C23.7232 0.648083 23.6004 0.613243 23.4744 0.603861C23.3484 0.594478 23.2219 0.610748 23.1024 0.651686C22.9828 0.692624 22.8729 0.757379 22.7791 0.842033C22.6854 0.926689 22.6097 1.02948 22.5568 1.1442C21.5869 3.05583 20.1002 4.65704 18.2656 5.76585C16.431 6.87465 14.3222 7.44659 12.1788 7.41665C10.0354 7.44659 7.92655 6.87465 6.09198 5.76585C4.25741 4.65704 2.77067 3.05583 1.80074 1.1442C1.74784 1.02948 1.67222 0.926689 1.57846 0.842033C1.4847 0.757379 1.37473 0.692624 1.25522 0.651686C1.13572 0.610748 1.00914 0.594478 0.883167 0.603861C0.757191 0.613243 0.634426 0.648083 0.522299 0.706272C0.294895 0.831545 0.12451 1.03963 0.0465622 1.28728C-0.0313854 1.53493 -0.0109024 1.80309 0.103756 2.03603Z"
                          fill="#1A1A1A"
                        />
                      </svg>
                    )}
                    {/* yahan aap apni SVG bhi use kar sakte ho */}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 pl-5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="password_confirmation"
                className="block my-2 pl-5 xl:text-[14px] lg:text-[12px] text-[14px] font-medium text-[#A3A3A3]"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirmation"
                  placeholder="Enter your Confirm Password"
                  {...register("password_confirmation", {
                    required: "Confirm Password is required",
                  })}
                  className="bg-white border-[#F0F0F0] rounded-[36.5px] border-2 text-gray-900 text-sm block w-full 2xl:p-5 xl:p-4 lg:p-3 p-3 pr-[50px] input_border"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pr-4">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        width={25}
                        height={19}
                        viewBox="0 0 25 19"
                        id="showIcon"
                        className={`col-span-5 `}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.1795 7.64063C12.9351 7.64062 13.6738 7.41656 14.3021 6.99676C14.9303 6.57696 15.42 5.98028 15.7092 5.28217C15.9983 4.58407 16.074 3.8159 15.9266 3.07479C15.7792 2.33369 15.4153 1.65294 14.881 1.11864C14.3467 0.584333 13.666 0.220467 12.9248 0.0730524C12.1837 -0.0743618 11.4156 0.00129652 10.7175 0.290461C10.0194 0.579624 9.42269 1.06931 9.00288 1.69758C8.58308 2.32586 8.35902 3.06451 8.35902 3.82013C8.36022 4.83302 8.76313 5.80408 9.47935 6.5203C10.1956 7.23652 11.1666 7.63942 12.1795 7.64063ZM12.1795 1.69777C12.5993 1.69777 13.0096 1.82224 13.3586 2.05545C13.7077 2.28866 13.9797 2.62013 14.1403 3.00794C14.301 3.39575 14.343 3.82249 14.2611 4.23419C14.1792 4.64589 13.9771 5.02406 13.6802 5.32087C13.3834 5.61769 13.0053 5.81983 12.5936 5.90172C12.1819 5.98361 11.7551 5.94158 11.3673 5.78095C10.9795 5.62031 10.648 5.34828 10.4148 4.99926C10.1816 4.65024 10.0571 4.2399 10.0571 3.82013C10.0577 3.25743 10.2815 2.71795 10.6794 2.32006C11.0773 1.92217 11.6168 1.69837 12.1795 1.69777Z"
                          fill="#2845F5"
                        />
                        <path
                          d="M0.103756 6.03603C1.17448 8.22177 2.84229 10.0596 4.91415 11.3368L2.33903 14.0169C2.15992 14.206 2.0601 14.4566 2.0601 14.7171C2.0601 14.9776 2.15992 15.2282 2.33903 15.4173C2.42558 15.5089 2.52989 15.5818 2.64558 15.6316C2.76128 15.6814 2.88592 15.7071 3.01189 15.7071C3.13786 15.7071 3.2625 15.6814 3.3782 15.6316C3.49389 15.5818 3.59821 15.5089 3.68475 15.4173L6.70579 12.2731C8.1407 12.8907 9.67017 13.2597 11.2288 13.3645V17.8488C11.2244 17.9765 11.2457 18.1038 11.2916 18.2232C11.3374 18.3425 11.4068 18.4514 11.4956 18.5433C11.5844 18.6353 11.6908 18.7084 11.8085 18.7583C11.9262 18.8082 12.0527 18.834 12.1805 18.834C12.3083 18.834 12.4348 18.8082 12.5525 18.7583C12.6702 18.7084 12.7766 18.6353 12.8654 18.5433C12.9542 18.4514 13.0236 18.3425 13.0694 18.2232C13.1153 18.1038 13.1366 17.9765 13.1322 17.8488V13.3645C14.6906 13.2608 16.2201 12.8929 17.6552 12.2765L20.6762 15.4173C20.7627 15.509 20.867 15.5821 20.9827 15.632C21.0984 15.6819 21.2231 15.7076 21.3491 15.7076C21.4751 15.7076 21.5998 15.6819 21.7155 15.632C21.8312 15.5821 21.9355 15.509 22.022 15.4173C22.2011 15.2282 22.3009 14.9776 22.3009 14.7171C22.3009 14.4566 22.2011 14.206 22.022 14.0169L19.4468 11.3368C21.5183 10.0594 23.1857 8.22162 24.2561 6.03603C24.3706 5.80282 24.3907 5.53445 24.3123 5.28677C24.234 5.03908 24.0631 4.83116 23.8353 4.70627C23.7232 4.64808 23.6004 4.61324 23.4744 4.60386C23.3484 4.59448 23.2219 4.61075 23.1024 4.65169C22.9828 4.69262 22.8729 4.75738 22.7791 4.84203C22.6854 4.92669 22.6097 5.02948 22.5568 5.1442C21.5869 7.05583 20.1002 8.65704 18.2656 9.76585C16.431 10.8747 14.3222 11.4466 12.1788 11.4167C10.0354 11.4466 7.92655 10.8747 6.09198 9.76585C4.25741 8.65704 2.77067 7.05583 1.80074 5.1442C1.74784 5.02948 1.67222 4.92669 1.57846 4.84203C1.4847 4.75738 1.37473 4.69262 1.25522 4.65169C1.13572 4.61075 1.00914 4.59448 0.883167 4.60386C0.757191 4.61324 0.634426 4.64808 0.522299 4.70627C0.294895 4.83154 0.12451 5.03963 0.0465622 5.28728C-0.0313854 5.53493 -0.0109024 5.80309 0.103756 6.03603Z"
                          fill="#2845F5"
                        />
                      </svg>
                    ) : (
                      <svg
                        id="hideIcon"
                        xmlns="http://www.w3.org/2000/svg"
                        width={25}
                        height={15}
                        className={`col-span-5}`}
                        viewBox="0 0 25 15"
                        fill="none"
                      >
                        <path
                          d="M0.103756 2.03603C1.17448 4.22177 2.84229 6.0596 4.91415 7.33682L2.33903 10.0169C2.15992 10.206 2.0601 10.4566 2.0601 10.7171C2.0601 10.9776 2.15992 11.2282 2.33903 11.4173C2.42558 11.5089 2.52989 11.5818 2.64558 11.6316C2.76128 11.6814 2.88592 11.7071 3.01189 11.7071C3.13786 11.7071 3.2625 11.6814 3.3782 11.6316C3.49389 11.5818 3.59821 11.5089 3.68475 11.4173L6.70579 8.27313C8.1407 8.89067 9.67017 9.25973 11.2288 9.36453V13.8488C11.2244 13.9765 11.2457 14.1038 11.2916 14.2232C11.3374 14.3425 11.4068 14.4514 11.4956 14.5433C11.5844 14.6353 11.6908 14.7084 11.8085 14.7583C11.9262 14.8082 12.0527 14.834 12.1805 14.834C12.3083 14.834 12.4348 14.8082 12.5525 14.7583C12.6702 14.7084 12.7766 14.6353 12.8654 14.5433C12.9542 14.4514 13.0236 14.3425 13.0694 14.2232C13.1153 14.1038 13.1366 13.9765 13.1322 13.8488V9.36453C14.6906 9.26082 16.2201 8.89292 17.6552 8.27655L20.6762 11.4173C20.7627 11.509 20.867 11.5821 20.9827 11.632C21.0984 11.6819 21.2231 11.7076 21.3491 11.7076C21.4751 11.7076 21.5998 11.6819 21.7155 11.632C21.8312 11.5821 21.9355 11.509 22.022 11.4173C22.2011 11.2282 22.3009 10.9776 22.3009 10.7171C22.3009 10.4566 22.2011 10.206 22.022 10.0169L19.4468 7.33682C21.5183 6.05943 23.1857 4.22162 24.2561 2.03603C24.3706 1.80282 24.3907 1.53445 24.3123 1.28677C24.234 1.03908 24.0631 0.831162 23.8353 0.706272C23.7232 0.648083 23.6004 0.613243 23.4744 0.603861C23.3484 0.594478 23.2219 0.610748 23.1024 0.651686C22.9828 0.692624 22.8729 0.757379 22.7791 0.842033C22.6854 0.926689 22.6097 1.02948 22.5568 1.1442C21.5869 3.05583 20.1002 4.65704 18.2656 5.76585C16.431 6.87465 14.3222 7.44659 12.1788 7.41665C10.0354 7.44659 7.92655 6.87465 6.09198 5.76585C4.25741 4.65704 2.77067 3.05583 1.80074 1.1442C1.74784 1.02948 1.67222 0.926689 1.57846 0.842033C1.4847 0.757379 1.37473 0.692624 1.25522 0.651686C1.13572 0.610748 1.00914 0.594478 0.883167 0.603861C0.757191 0.613243 0.634426 0.648083 0.522299 0.706272C0.294895 0.831545 0.12451 1.03963 0.0465622 1.28728C-0.0313854 1.53493 -0.0109024 1.80309 0.103756 2.03603Z"
                          fill="#1A1A1A"
                        />
                      </svg>
                    )}
                    {/* yahan aap apni SVG bhi use kar sakte ho */}
                  </button>
                </div>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1 pl-5">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#000] mt-4 text-white 2xl:text-[18px] xl:text-[16px] text-[14px] rounded-[36.69px] w-full 2xl:py-5 xl:py-4 lg:py-3 py-3 font-[600] cursor-pointer"
            >
              Submit
            </button>
          </form>

          <div className="w-full flex justify-center h-[15px] my-3">
            <img
              src="/logo/auth-continous-with-other.png"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="flex justify-center xl:my-5 my-3">
            <a
              href="#"
              className="bg-white relative border-2 border-black text-black 2xl:text-[18px] xl:text-[16px] text-[14px] rounded-[36.69px] w-full 2xl:py-5 xl:py-4 lg:py-3 py-3 font-[600] flex items-center justify-center"
            >
              <div className="absolute left-5 flex items-center h-full">
                <svg
                  width={25}
                  height={26}
                  viewBox="0 0 25 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.2626 10.1631H12.5088V14.9827L19.2781 14.9842C19.0036 16.5877 18.1199 17.9547 16.7661 18.8661V18.867C16.7665 18.8667 16.7671 18.8664 16.7676 18.8661L16.6457 21.7467L20.7971 21.9915C20.7965 21.992 20.7959 21.9926 20.7954 21.993C23.1482 19.8155 24.4964 16.5965 24.4964 12.7935C24.4963 11.8792 24.4145 11.0043 24.2626 10.1631Z"
                    fill="#0085F7"
                  />
                  <path
                    d="M16.7675 18.8661C16.7671 18.8664 16.7665 18.8667 16.7661 18.867C15.6446 19.6229 14.2007 20.0651 12.5117 20.0651C9.24757 20.0651 6.47854 17.8656 5.48691 14.9009H5.48646C5.48661 14.9013 5.48676 14.9019 5.48691 14.9024L2.02119 14.3535L1.33105 18.1266C3.39056 22.2124 7.62264 25.0161 12.5119 25.0161C15.8905 25.0161 18.729 23.9053 20.7956 21.9928C20.7961 21.9924 20.7967 21.992 20.7972 21.9914L16.7675 18.8661Z"
                    fill="#00A94B"
                  />
                  <path
                    d="M5.09557 12.5091C5.09557 11.6766 5.23431 10.8719 5.48703 10.1154L4.40484 6.89062H1.33043C0.479034 8.58045 0 10.4878 0 12.5091C0 14.5304 0.480526 16.4377 1.33043 18.1276L1.33103 18.1271L5.48703 14.9028C5.48688 14.9023 5.48674 14.9019 5.48659 14.9013C5.23416 14.1454 5.09557 13.3411 5.09557 12.5091Z"
                    fill="#FFBB00"
                  />
                  <path
                    d="M12.512 0C7.6238 0 3.38992 2.80409 1.33057 6.89057L5.48702 10.1154C6.47865 7.1506 9.24768 4.95116 12.5119 4.95116C14.3564 4.95116 16.0083 5.58654 17.3125 6.82791L20.8834 3.26C18.7147 1.23988 15.8872 0 12.512 0Z"
                    fill="#FF4031"
                  />
                </svg>
              </div>
              Continue with Google
            </a>
          </div>
        </div>
        <div className="w-[50%] lg:block hidden bg-black rounded-[25px] 2xl:py-[63px] xl:py-[40px] lg:py-[35px] 2xl:px-[50px] xl:px-[40px] lg:px-[35px]">
          <div className="flex justify-center">
            <div className="flex gap-x-4 items-center">
              <div className="w-[13px] h-[13px] bg-[#21EE00] rounded-full" />
              <div className="">
                <h1 className="2xl:text-[30px] lg:text-[24px] font-[600] leading-[15.17px] text-white">
                  Sign In
                </h1>
              </div>
            </div>
          </div>
          <div className="flex justify-center 2xl:mt-[50px] xl:mt-[30px] lg:mt-[15px] 2xl:mb-10 xl:mb-7 lg:mb-5">
            <img src="{{ asset('assets/images/auth-laptop.png') }}" alt="" />
            <img src="/logo/auth-laptop.png" alt="" loading="lazy" />
          </div>
          <div className="flex justify-center">
            <p className="2xl:text-[30px] lg:text-[24px] font-[600] leading-[15.17px] text-white">
              Calculate Live
            </p>
          </div>
          <div className="flex justify-center 2xl:my-4 xl:my-3 my-3">
            <p className="2xl:text-[16px] xl:text-[14px] lg:text-[12px] text-center text-opacity-80 text-white xl:leading-[20.83px] lg:leading-[16.83px]">
              Join our community and start calculating with ease!
            </p>
          </div>
          <div className="flex justify-center my-10">
            <a
              href="/login"
              className="bg-[#F7BB0D] text-center 2xl:text-[18px] xl:text-[16px] text-[14px] rounded-[36.69px] w-full 2xl:py-5 xl:py-4 lg:py-3 py-3 font-[600]"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
