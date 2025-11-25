"use client";
import { useState } from "react";

export default function Tabs({
  initialTab,
  writing,
  coding,
  writingHeader,
  codingHeader,
}: {
  initialTab: "writing" | "coding";
  writing: React.ReactNode;
  coding: React.ReactNode;
  writingHeader: React.ReactNode;
  codingHeader: React.ReactNode;
}) {
  const [active, setActive] = useState<"writing" | "coding">(initialTab);
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        {active === "writing" ? writingHeader : codingHeader}
      </div>
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg bg-gray-200 p-1">
          <button
            className={`px-4 py-2 rounded-md ${active === "writing" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
            onClick={() => setActive("writing")}
          >
            Writing
          </button>
          <button
            className={`px-4 py-2 rounded-md ${active === "coding" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
            onClick={() => setActive("coding")}
          >
            Coding
          </button>
        </div>
      </div>
      <div>{active === "writing" ? writing : coding}</div>
    </div>
  );
}
