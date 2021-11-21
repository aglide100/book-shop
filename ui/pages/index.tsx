import React, { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "tailwindcss/tailwind.css";

const BookListSection = dynamic(
  () =>
    import("../components/BookList").catch((err) => {
      return () => <>err. .{err}</>;
    }),
  {
    loading: () => <>loading....</>,
    ssr: false,
  }
);

const IndexPage: React.FC<{}> = ({}) => {
  return (
    <div className="h-screen">
      <h1 className="text-red-500">Hello👋</h1>
      <BookListSection></BookListSection>
    </div>
  );
};

export default IndexPage;
