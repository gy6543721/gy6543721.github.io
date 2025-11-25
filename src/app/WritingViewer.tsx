"use client";
import { useState } from "react";

export default function WritingViewer({
  works,
  volumesByWork,
  chaptersByWorkVolume,
  contentByWorkVolumeChapter,
  initialWork,
  initialVolume,
  initialChapter,
}: {
  works: string[];
  volumesByWork: Record<string, string[]>;
  chaptersByWorkVolume: Record<string, Record<string, string[]>>;
  contentByWorkVolumeChapter: Record<string, Record<string, Record<string, string>>>;
  initialWork?: string;
  initialVolume?: string;
  initialChapter?: string;
}) {
  const defaultWork = initialWork ?? works[0];
  const defaultVolume = initialVolume ?? (defaultWork ? volumesByWork[defaultWork]?.[0] : undefined);
  const defaultChapter = initialChapter ?? (defaultWork && defaultVolume ? chaptersByWorkVolume[defaultWork]?.[defaultVolume]?.[0] : undefined);
  const [work, setWork] = useState<string | undefined>(defaultWork);
  const [volume, setVolume] = useState<string | undefined>(defaultVolume);
  const [chapter, setChapter] = useState<string | undefined>(defaultChapter);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Works</h3>
        <div className="inline-flex rounded-lg bg-gray-200 p-1 flex-wrap gap-2">
          {works.map((w) => (
            <button
              key={w}
              onClick={() => {
                setWork(w);
                const vols = volumesByWork[w] ?? [];
                const nextVolume = vols[0];
                setVolume(nextVolume);
                const chs = nextVolume ? chaptersByWorkVolume[w]?.[nextVolume] ?? [] : [];
                setChapter(chs[0]);
              }}
              className={`px-4 py-2 rounded-md ${work === w ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      {work ? (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Volumes</h3>
          <div className="inline-flex rounded-lg bg-gray-200 p-1 flex-wrap gap-2">
            {(volumesByWork[work] ?? []).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setVolume(v);
                  const chs = chaptersByWorkVolume[work]?.[v] ?? [];
                  setChapter(chs[0]);
                }}
                className={`px-4 py-2 rounded-md ${volume === v ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {work && volume ? (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Chapters</h3>
          <div className="inline-flex rounded-lg bg-gray-200 p-1 flex-wrap gap-2">
            {(chaptersByWorkVolume[work]?.[volume] ?? []).map((c) => (
              <button
                key={c}
                onClick={() => setChapter(c)}
                className={`px-4 py-2 rounded-md ${chapter === c ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <article className="bg-white p-6 rounded-lg shadow whitespace-pre-wrap leading-7 text-gray-800">
        {work && volume && chapter ? contentByWorkVolumeChapter[work]?.[volume]?.[chapter] ?? "" : ""}
      </article>
    </div>
  );
}
