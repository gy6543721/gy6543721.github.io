"use client";
import { useState } from "react";

export default function WritingViewer({
  works,
  volumesByWork,
  contentByWorkVolume,
  initialWork,
  initialVolume,
}: {
  works: string[];
  volumesByWork: Record<string, string[]>;
  contentByWorkVolume: Record<string, Record<string, string>>;
  initialWork?: string;
  initialVolume?: string;
}) {
  const defaultWork = initialWork ?? works[0];
  const defaultVolume = initialVolume ?? (defaultWork ? volumesByWork[defaultWork]?.[0] : undefined);
  const [work, setWork] = useState<string | undefined>(defaultWork);
  const [volume, setVolume] = useState<string | undefined>(defaultVolume);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Works</h3>
        <div className="flex flex-wrap gap-2">
          {works.map((w) => (
            <button
              key={w}
              onClick={() => {
                setWork(w);
                const vols = volumesByWork[w] ?? [];
                setVolume(vols[0]);
              }}
              className={`px-3 py-1 rounded border ${
                work === w
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      {work ? (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Volumes</h3>
          <div className="flex flex-wrap gap-2">
            {(volumesByWork[work] ?? []).map((v) => (
              <button
                key={v}
                onClick={() => setVolume(v)}
                className={`px-3 py-1 rounded border ${
                  volume === v
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <article className="bg-white p-6 rounded-lg shadow whitespace-pre-wrap leading-7 text-gray-800">
        {work && volume ? contentByWorkVolume[work]?.[volume] ?? "" : ""}
      </article>
    </div>
  );
}
