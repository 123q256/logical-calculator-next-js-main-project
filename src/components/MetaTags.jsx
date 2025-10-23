// components/MetaTags.jsx
import React from "react";
import Head from "next/head";

const MetaTags = ({ title, description, image }) => {
  const currentUrl = window.location.href;
  // console.log(title,description,image)

  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />

      {/* OG Tags */}
      <meta property="og:site_name" content="Calculator Logical" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@calculator-logical.com" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default MetaTags;
