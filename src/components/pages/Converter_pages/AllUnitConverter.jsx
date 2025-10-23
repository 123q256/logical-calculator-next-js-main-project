import React from "react";

const AllUnitConverter = () => {
  return (
    <div className="container-fluid mx-auto  container-fluid mt-[20px]">
      <div className="w-full max-w-6xl mx-auto py-1 rounded-lg text-center">
        <h1 className="text-2xl lg:text-3xl md:text-3xl px-5 font-semibold ">
          <strong>All Converters</strong>
        </h1>
      </div>
      <div className="flex flex-col items-center py-1 mb-5">
        <div className="mt-2 w-full max-w-6xl bg-right bg-cover bg-white rounded-lg px-[12px] ">
          <div className="flex flex-col lg:flex-row">
            <div className=" w-full  order-1 lg:order-2  px-[5px]   rounded-lg md:mb-6 lg:mb-6 ">
              <p className="text-gray-600  text-center ">1754 Converters</p>
            </div>
          </div>
          <div className="grid grid-cols-12 items-center py-1 mb-5">
            <div className="mt-2 col-span-12 md:col-span-4 lg w-full max-w-1xl bg-right bg-cover bg-white rounded-lg">
              <label htmlFor="myInput" className="py-5">
                Filter Searching
              </label>
              <input
                id="myInput"
                type="text"
                placeholder="Search.."
                className="mt-2 input"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div
              className="lg:w-[100%]  md:w-[100%] w-full  order-2 lg:order-1 p-[20px] lg:p-[10px] md:p-[10px]   rounded-lg inset-0  bg-center bg-no-repeat filter"
              style={{ backgroundImage: 'url("/new_page/finance_bg.svg")' }}
            >
              <div
                className="grid grid-cols-12 gap-4   Everyday-Life"
                id="myTable"
              >
                <h2 className="mb-3 mt-1 text-[25px] col-span-12">
                  <strong>
                    <a
                      href="length-converter/"
                      className="text-decoration-none"
                    >
                      Length Converter
                    </a>
                  </strong>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/cm-to-inches"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Centimeter to Inches (cm to in)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/inches-to-cm"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Inches to Centimeter (in to cm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/km-to-m"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kilometer to Meter (km to m)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/m-to-km"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Meter to Kilometre (m to km)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/meter-to-decimeter"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Meter to Decimeter (m to dm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/m-to-cm"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Meter to Centimeter (m to cm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-millimeter"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Millimeter (kpc to mm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-micrometer"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Micrometer (kpc to µm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-nanometer"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Nanometer (kpc to nm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-mile"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Mile
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-yard"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Yard (kpc to yd)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-foot"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Foot (kpc to ft)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-inch"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Inch (kpc to in)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-light-year"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Light Year (kpc to ly)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-exameter"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Exameter (kpc to Em)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-petameter"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Petameter (kpc to Pm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-terameter"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Terameter (kpc to Tm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-gigameter"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Gigameter (kpc to Gm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-megameter"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Megameter (kpc to Mm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-hectometer"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Hectometer (kpc to hm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-dekameter"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Dekameter (kpc to dam)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-micron"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Micron (kpc to µ)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-picometer"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Picometer (kpc to pm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-femtometer"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Femtometer (kpc to fm)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-attometer"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Attometer (kpc to am)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-megaparsec"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Megaparsec (kpc to Mpc)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-parsec"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Parsec (kpc to pc)
                      </a>
                    </li>
                  </ul>
                </h2>
                <h2 className="text-20px col-span-12 md:col-span-6">
                  <ul className="list-disc pl-4 marker:text-black marker:text-[22px]">
                    <li className="">
                      <a
                        href="/length/kiloparsec-to-astronomical-unit"
                        className="bg-white py-1 text-[18px] font-medium rounded-[12px] block hover:underline hover:text-black"
                      >
                        Convert Kiloparsec to Astronomical Unit (kpc to AU, UA)
                      </a>
                    </li>
                  </ul>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUnitConverter;
