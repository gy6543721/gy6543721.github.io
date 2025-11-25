"use client";
import { useEffect, useState } from "react";

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
  useEffect(() => {
    setActive(initialTab);
  }, [initialTab]);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("tab");
      if (t === "writing" || t === "coding") setActive(t as "writing" | "coding");
    } catch {}
  }, []);
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        {active === "writing" ? writingHeader : codingHeader}
      </div>
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg bg-gray-200 p-1">
          <button
            className={`px-4 py-2 rounded-md ${active === "writing" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
            onClick={() => {
              setActive("writing");
              const url = new URL(window.location.href);
              url.searchParams.set("tab", "writing");
              url.searchParams.delete("work");
              url.searchParams.delete("volume");
              window.history.pushState(null, "", url);
            }}
          >
            Writing
          </button>
          <button
            className={`px-4 py-2 rounded-md ${active === "coding" ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
            onClick={() => {
              setActive("coding");
              const url = new URL(window.location.href);
              url.searchParams.set("tab", "coding");
              url.searchParams.delete("work");
              url.searchParams.delete("volume");
              window.history.pushState(null, "", url);
            }}
          >
            Coding
          </button>
        </div>
      </div>
      <div>{active === "writing" ? writing : coding}</div>
    </div>
  );
}
