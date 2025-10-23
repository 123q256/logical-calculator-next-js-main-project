import React, { useEffect, useState, useRef } from "react";

import "katex/dist/katex.min.css";
import renderMathInElement from "katex/contrib/auto-render";

import {
  Breadcrumbs,
  CalculatorTitle,
  CalculatorWrap,
  FormWrap,
  LeftSideCalculator,
  RelatedLinks,
  RightSideCalculator,
} from "../../../../components/Calculator";
import ConverterSearch from "./ConverterSearch";
import ConverterList from "./ConverterList";

const ConverterWrap = ({ isLoading, data, links, children }) => {
  const metaTitle = data?.payload?.tech_meta_title;
  const metaDescription = data?.payload?.tech_meta_des;
  // const ogImage = `${window.location.origin}/images/ogview/ogy/${data?.tech_calculator_link}'.png'`;

  const [ogImage, setOgImage] = useState(
    `/images/ogview/pages/technical-calculator.png`
  );

  useEffect(() => {
    if (!data?.payload?.tech_calculator_link) return;

    const imagePath = `/images/ogview/ogy/${data?.payload?.tech_calculator_link}.png`;

    const img = new Image();
    img.src = imagePath;

    img.onload = () => {
      setOgImage(imagePath); // Image exists
    };

    img.onerror = () => {
      setOgImage(`/images/ogview/pages/technical-calculator.png`); // Fallback
    };
  }, [data?.payload?.tech_calculator_link]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
      });
    }
  }, [data]);

  // 1. Access the tech_lang_keys string
  const langKeysString = data?.payload?.calculator?.tech_lang_keys;
  const tech_calculator_title =
    data?.payload?.calculator?.tech_calculator_title;
  const after_title = data?.payload?.calculator?.after_title;
  // 2. Parse the JSON string into a JavaScript object
  let langObject = {};
  try {
    langObject = langKeysString ? JSON.parse(langKeysString) : {};
  } catch (error) {
    console.error("Error parsing tech_lang_keys:", error);
    langObject = {};
  }

  return (
    <>
      <CalculatorWrap>
        <LeftSideCalculator showRight={true}>
          {isLoading ? (
            <div className="p-4">
              <div className="mt-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <CalculatorTitle
              name={tech_calculator_title}
              description={after_title}
            />
          )}
          {isLoading ? (
            <div className="">
              <div className="mt-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <Breadcrumbs links={links} />
          )}

          {isLoading ? (
            <div className="p-4">
              <div className="mt-4 space-y-3">
                <div className="w-full h-[450px] bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ) : (
            <FormWrap>{children}</FormWrap>
          )}
          {isLoading ? (
            <div className="p-4">
              <div className="mt-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <div
                className="w-full pt-4 px-4 mb-[20px] content"
                dangerouslySetInnerHTML={{
                  __html: data?.payload?.tech_content,
                }}
              ></div>
            </>
          )}
        </LeftSideCalculator>

        <RightSideCalculator showRight={true}>
          <ConverterSearch />
          <ConverterList />
        </RightSideCalculator>
      </CalculatorWrap>
    </>
  );
};

export default ConverterWrap;
