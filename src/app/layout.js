import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import Image from "next/image";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.js or wherever you define metadata
export const metadata = {
  // title: "Calculator Logical",
  // description: "Free Online Calculators for Accurate Results",
  robots: {
    index: process.env.NEXT_PUBLIC_ROBOTS === "index" ? true : false,
    follow: process.env.NEXT_PUBLIC_ROBOTS === "index" ? true : false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta
        name="google-site-verification"
        content="wmrTfJuwXwOchkde4vcvsZfxgDE-G7wSl9-N0fWTIBQ"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <button
          id="scrollToTopmove"
          className="scroll-to-tops cursor-pointer fixed right-6 bottom-[12px] hidden z-50"
        >
          <Image
            src="/top_btn.svg"
            alt="scroll-to-top"
            width={40}
            height={40}
          />
        </button>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>

        <Script id="scroll-to-top" strategy="afterInteractive">
          {`
            const scrollBtn = document.getElementById("scrollToTopmove");
            window.addEventListener("scroll", () => {
              if (window.scrollY > 700) {
                scrollBtn.classList.remove("hidden");
              } else {
                scrollBtn.classList.add("hidden");
              }
            });
            scrollBtn.addEventListener("click", () => {
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            });
          `}
        </Script>
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
