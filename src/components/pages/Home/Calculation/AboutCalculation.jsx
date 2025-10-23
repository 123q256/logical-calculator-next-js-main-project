import React from "react";
import {
  allbasicbg,
  allcalcalutor,
  footerbgimg,
  healthmaintance,
  heart,
  importantcalculator,
  purpose_1,
  purpose_2,
  purpose_3,
  purpose_4,
  unlock_img,
} from "../../../assets/images";

const AboutCalculation = () => {
  return (
    <div className="max-w-[1140px] mx-auto px-5 lg:my-10 md:my-10 my-5">
      <div className="py-5">
        <h2 className="text-center text-[36px] font-[700] leading-[46.87px]">
          About Calculation
        </h2>
        <p className="text-[15px] text-opacity-60 lg:mt-5 mt-3 leading-[25.83px] text-center">
          Calculator Logical offers quick, precise solutions for all your daily
          calculations, from health to finance
          <br className="lg:block hidden" />
          to scientific equations. Simplify your tasks with tools designed for
          accuracy and ease.
        </p>
      </div>

      <div className="lg:flex md:flex w-full gap-x-4 mt-5">
        <div
          className="lg:w-[60%] md:w-[50%] w-full lg:mb-0 md:mb-0 mb-5 rounded-[15px]"
          style={{
            backgroundImage: `url(${allbasicbg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h3 className="lg:text-[28px] md:text-[20px] text-[17px] lg:pt-1 md:pt-1 pt-5 mt-4 mb-1 font-[600] text-center lg:leading-[39.06px] md:leading-[30.06px] leading-[28.06px]">
            All Basic, Advance, Scientific and <br />
            Business Level Calculation
          </h3>
          <img src={allcalcalutor} alt="Group graphic" loading="lazy"/>
        </div>

        <div className="lg:w-[40%] md:w-[50%] w-full gap-y-4 flex flex-col">
          <div
            className="rounded-[15px] bg-[#DFFFE0] h-[256px]"
            style={{
              backgroundImage: `url(${importantcalculator})`,
              backgroundSize: "cover",
            }}
          >
            <h3 className="lg:text-[28px] md:text-[20px] text-[17px] pt-4 pb-1 font-[600] text-center leading-[30.06px]">
              Important Calculation
            </h3>
          </div>

          <div className="rounded-[15px] bg-[#FFF6DB] h-[256px]">
            <h3 className="lg:text-[28px] md:text-[20px] text-[17px] pt-4 pb-1 font-[600] text-center leading-[30.06px]">
              Health Maintenance
            </h3>
            <div className="w-full relative mt-3">
              <img
                className="w-full"
                src={healthmaintance}
                alt="health-maintance"
                title="health-maintance"
                loading="lazy"
              />
              <div
                className="flex justify-center absolute bottom-5 left-[59%] transform -translate-x-1/2 items-center bg-white p-4 rounded-[8px]"
                style={{ boxShadow: "0px 30px 60px -12px #32325d1a" }}
              >
                <img src={heart} alt="heart" title="heart" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#EEE1FF] flex rounded-[18px] px-10 py-8 my-4 items-center lg:flex-row md:flex-row flex-col">
        <div className="lg:w-[80%] md:w-[80%] w-full">
          <h2 className="lg:text-[32px] md:text-[32px] text-[28px] font-[600] lg:leading-[41.66px] md:leading-[41.66px] leading-[36.66px]">
            Your Mathematical Logics are Here
          </h2>
          <p className="text-[15px] leading-[20.83px] mt-5 text-[#1A1A1A]">
            Explore a world where calculations meet clarity. From financial
            forecasts to scientific formulas, every tool on Calculator Logical
            is crafted to simplify complex math and enhance understanding. We’ve
            carefully designed each calculator to be intuitive and efficient,
            ensuring you get precise answers effortlessly. Let Calculator
            Logical support you on your journey to mastering mathematical
            challenges.
          </p>
        </div>
        <div className="flex lg:justify-center md:justify-center justify-end items-center lg:w-[20%] md:w-[20%] w-full text-end mt-5">
          <a
            to="/math"
            className="bg-[#1A1A1A] text-[#fff] hover:bg-[#2845F5] hover:text-white duration-200 font-[600] text-[16px] rounded-[44px] px-5 py-3"
          >
            View Here
          </a>
        </div>
      </div>

      <div className="lg:my-10 md:my-10 my-5">
        <h2 className="lg:text-[36px] md:text-[36px] text-[26px] font-[700] text-center">
          Purpose Of Calculator
        </h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:mt-10 md:mt-10 mt-4">
          {[
            {
              title: "Education",
              desc: "Boost your academic potential with tools that simplify equations and calculations.",
              img: purpose_1,
            },
            {
              title: "Health",
              desc: "Get quick insights into your fitness and nutrition with our health calculators. Manage your well-being with ease.",
              img: purpose_2,
            },
            {
              title: "Finance",
              desc: "Easily manage finances and make informed decisions with our reliable financial tools.",
              img: purpose_3,
            },
            {
              title: "Business",
              desc: "Maximize business operations with calculators for profit margins and taxes. Drive success with dependable tools.",
              img: purpose_4,
            },
          ].map((item, i) => (
            <div className="p-4" key={i}>
              <div className="flex justify-center">
                <img src={item.img} alt={item.title} title={item.title} loading="lazy" />
              </div>
              <h3 className="text-[20px] leading-[26.04px] text-center font-[600] my-5">
                {item.title}
              </h3>
              <p className="text-[16px] text-center leading-[20.83px] text-[#1A1A1A]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    
);
};

export default AboutCalculation;
