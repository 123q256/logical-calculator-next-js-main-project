"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useForgetPasswordMutation } from "../../../redux/services/auth/authApi";
import { useForm } from "react-hook-form";

const metaTitle = "Signup Page - Calculators Logical";
const metaDescription = "Signup Page - Calculators Logical";
const ogImage =
  "https://calculator-logical.com/images/ogview/pages/calculator-logical.png";

const ForgetPassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const [sendOtp, { isLoading }] = useForgetPasswordMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await sendOtp(data).unwrap();

      // Suppose response is: { otp_id: '123456' }

      // Save otp_id & email to sessionStorage
      sessionStorage.setItem("otp_id", response?.payload?.otp_id);
      sessionStorage.setItem("email", data.email);

      // Redirect to OTP page
      router.push("/otp-forgot");
    } catch (error) {
      console.error("Error sending OTP:", error);
      // Optionally show toast message here
    } finally {
      reset();
    }
  };

  return (
    <div className="flex justify-center items-center relative">
      <Head>
        <title>{metaTitle || "My App"}</title>
        <meta name="description" content={metaDescription || "Description."} />
        <meta property="og:site_name" content="Calculator Logical" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@calculator-logical.com" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
      </Head>
      {/* The backdrop overlay */}
      <div className="absolute inset-0 " />
      {/* Your content here */}
      <div className="z-10 flex 2xl:w-[65%] xl:w-[70%] lg:w-[75%] my-10 w-[90%] bg-white rounded-[25px]  shadow-lg bordered">
        <div
          className="lg:w-[50%] flex  lg:rounded-[0px] rounded-[25px] w-[100%] 2xl:my-10 xl:my-7 lg:my-4 2xl:py-[20px] xl:py-[15px] lg:py-[8px] py-7 2xl:px-[50px] xl:px-[40px] lg:px-[35px] px-6"
          style={{
            backgroundImage: `url('/logo/login-bg-img.png')`,
            backgroundSize: "cover",
          }}
        >
          <div className="w-full">
            <a
              href="/"
              className="flex my-3 items-center text-left  space-x-3 rtl:space-x-reverse mr-auto"
            >
              <img
                src="/logo/logo.png"
                className="h-8"
                alt="Header-Logo"
                title="Header-Logo"
              />
              <div className="lg:pl-1 md:pl-1 text-center">
                <span className="self-center lg:text-[19px] text-[14px] font-semibold whitespace-nowrap">
                  Calculator
                </span>
                <p className="self-center lg:text-[15px] text-[12px] font-semibold whitespace-nowrap ">
                  Online
                </p>
              </div>
            </a>
            <h1 className="2xl:text-[30px] text-center lg:text-[24px] lg:pt-10 md:pt-10 pt-3 text-[21px] font-[700] leading-[15.17px] text-black">
              Forgotten Password
            </h1>
            <div className="flex justify-center 2xl:my-8 xl:my-6 my-6">
              <p className="2xl:text-[16px] xl:text-[14px] font-[600] lg:text-[12px] text-center text-opacity-80 text-black xl:leading-[20.83px] lg:leading-[16.83px]">
                Enter your registered email address below to receive a
                verification link for resetting your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email_address"
                  className="block my-2 pl-5 xl:text-[14px] lg:text-[12px] text-[14px] font-medium text-[#A3A3A3] dark:text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email_address"
                  {...register("email", { required: true })}
                  className="bg-white border-[#F0F0F0] rounded-[36.5px] border-2 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-5 xl:p-4 lg:p-3 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 input_border"
                  placeholder="Enter your Email"
                  autoFocus
                />
              </div>
              <div className="flex justify-center xl:my-6 my-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#000] text-white 2xl:text-[18px] xl:text-[16px] text-[14px] rounded-[36.69px] w-full 2xl:py-5 xl:py-4 lg:py-3 py-3 font-[600] cursor-pointer"
                >
                  {isLoading ? "Sending..." : "Get Verification Link"}
                </button>
              </div>
            </form>
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
            <img src="/logo/auth-laptop.png" alt="" />
          </div>
          <div className="flex justify-center">
            <h1 className="2xl:text-[30px] lg:text-[24px] font-[600] leading-[15.17px] text-white">
              Calculate Live
            </h1>
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
              Back to Sign In Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;