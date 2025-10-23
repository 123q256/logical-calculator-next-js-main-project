"use client";

import CategoryCard from "../../../../components/Home/CategoryCard";

const CategorySection = () => {
  const categories = [
    {
      href: "/health",
      imageSrc: "/category-images/1health.svg",
      altText: "Health",
      title1: "Health",
      title2: "Calculator",
    },
    {
      href: "/math",
      imageSrc: "/category-images/2mathematics.svg",
      altText: "Math",
      title1: "Math",
      title2: "Calculator",
    },
    {
      href: "/everyday-Life",
      imageSrc: "/category-images/3dailylife.svg",
      altText: "Everyday-Life",
      title1: "Everyday-Life",
      title2: "Calculator",
    },
    {
      href: "/finance",
      imageSrc: "/category-images/4finance.svg",
      altText: "Finance",
      title1: "Finance",
      title2: "Calculator",
    },
    {
      href: "/physics",
      imageSrc: "/category-images/5physics.svg",
      altText: "Physics",
      title1: "Physics",
      title2: "Calculator",
    },
    {
      href: "/chemistry",
      imageSrc: "/category-images/6chemistry.svg",
      altText: "Chemistry",
      title1: "Chemistry",
      title2: "Calculator",
    },
    {
      href: "/statistics",
      imageSrc: "/category-images/7statistics.svg",
      altText: "Statistics",
      title1: "Statistics",
      title2: "Calculator",
    },
    {
      href: "/construction",
      imageSrc: "/category-images/8construction.svg",
      altText: "Construction",
      title1: "Construction",
      title2: "Calculator",
    },
    {
      href: "/pets",
      imageSrc: "/category-images/9pets.svg",
      altText: "Pets",
      title1: "Pets",
      title2: "Calculator",
    },
    {
      href: "/timedate",
      imageSrc: "/category-images/10datetime.svg",
      altText: "Timedate",
      title1: "Timedate",
      title2: "Calculator",
    },
  ];

  return (
    <div
      className="max-w-[960px] mx-auto px-5 mt-[15px] mb-[60px]"
      id="targetDiv"
    >
      <div className="py-5">
        <h2 className="text-center lg:text-[36px] md:text-[36px] text-[25px] font-[700] leading-[46.87px]">
          About Categories
        </h2>
        <p className="lg:text-[15px] md:text-[15px] text-[13px] text-opacity-60 lg:mt-5 mt-3 leading-[20.83px] text-center font-[500]">
          Explore a variety of calculators tailored to fit your unique needs.
          From mathematics to health and finance,
          <br className="lg:block hidden" />
          each category is designed to provide quick solutions and help simplify
          your tasks.
        </p>
      </div>

      <div className="grid self-center lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-x-5 gap-y-5">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            href={category.href}
            imageSrc={category.imageSrc}
            altText={`${category.title1} ${category.title2}`}
            title1={category.title1}
            title2={category.title2}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
