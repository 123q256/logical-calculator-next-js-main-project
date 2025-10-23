"use client";
import Link from "next/link";

const Breadcrumbs = ({ links }) => {
  return (
    <div className="my-4 text-[12px] lg:text-[18px] md:text-[18px]">
      {links.map((link, index) => (
        <span key={index}>
          {index > 0 && <span className="mx-1">&gt;</span>}
          <Link href={link.path} className="underline">
            {link.name}
          </Link>
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
