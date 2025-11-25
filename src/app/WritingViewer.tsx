"use client";
import { useRef, useState } from "react";

export default function WritingViewer({
  works,
  volumesByWork,
  chaptersByWorkVolume,
  initialWork,
  initialVolume,
  initialChapter,
  initialContent,
}: {
  works: string[];
  volumesByWork: Record<string, string[]>;
  chaptersByWorkVolume: Record<string, Record<string, string[]>>;
  initialWork?: string;
  initialVolume?: string;
  initialChapter?: string;
  initialContent?: string;
}) {
  const defaultWork = initialWork ?? works[0];
  const defaultVolume = initialVolume ?? (defaultWork ? volumesByWork[defaultWork]?.[0] : undefined);
  const defaultChapter = initialChapter ?? (defaultWork && defaultVolume ? chaptersByWorkVolume[defaultWork]?.[defaultVolume]?.[0] : undefined);
  const [work, setWork] = useState<string | undefined>(defaultWork);
  const [volume, setVolume] = useState<string | undefined>(defaultVolume);
  const [chapter, setChapter] = useState<string | undefined>(defaultChapter);
  const [content, setContent] = useState<string>(initialContent ?? "");
  const chaptersRef = useRef<HTMLDivElement | null>(null);

  async function fetchChapter(w?: string, v?: string, c?: string) {
    if (!w || !v || !c) {
      setContent("");
      return;
    }
    try {
      const url = `/novels/${encodeURIComponent(w)}/${encodeURIComponent(v)}/${encodeURIComponent(c)}.md`;
      const res = await fetch(url);
      if (!res.ok) {
        setContent("");
        return;
      }
      const txt = await res.text();
      setContent(txt);
    } catch {
      setContent("");
    }
  }

  function prevPosition(w?: string, v?: string, c?: string): { volume: string; chapter: string } | undefined {
    if (!w || !v || !c) return undefined;
    const chapters = chaptersByWorkVolume[w]?.[v] ?? [];
    const idx = chapters.indexOf(c);
    if (idx > 0) return { volume: v, chapter: chapters[idx - 1] };
    const volumes = volumesByWork[w] ?? [];
    const vIdx = volumes.indexOf(v);
    if (vIdx > 0) {
      const pv = volumes[vIdx - 1];
      const pChs = chaptersByWorkVolume[w]?.[pv] ?? [];
      const last = pChs[pChs.length - 1];
      if (last) return { volume: pv, chapter: last };
    }
    return undefined;
  }

  function nextPosition(w?: string, v?: string, c?: string): { volume: string; chapter: string } | undefined {
    if (!w || !v || !c) return undefined;
    const chapters = chaptersByWorkVolume[w]?.[v] ?? [];
    const idx = chapters.indexOf(c);
    if (idx >= 0 && idx < chapters.length - 1) return { volume: v, chapter: chapters[idx + 1] };
    const volumes = volumesByWork[w] ?? [];
    const vIdx = volumes.indexOf(v);
    if (vIdx >= 0 && vIdx < volumes.length - 1) {
      const nv = volumes[vIdx + 1];
      const nChs = chaptersByWorkVolume[w]?.[nv] ?? [];
      const first = nChs[0];
      if (first) return { volume: nv, chapter: first };
    }
    return undefined;
  }

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
                const nextChapter = chs[0];
                setChapter(nextChapter);
                fetchChapter(w, nextVolume, nextChapter);
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
                  const nextChapter = chs[0];
                  setChapter(nextChapter);
                  fetchChapter(work, v, nextChapter);
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
        <div ref={chaptersRef}>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Chapters</h3>
          <div className="inline-flex rounded-lg bg-gray-200 p-1 flex-wrap gap-2">
            {(chaptersByWorkVolume[work]?.[volume] ?? []).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setChapter(c);
                  fetchChapter(work, volume, c);
                }}
                className={`px-4 py-2 rounded-md ${chapter === c ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {volume && chapter ? (
            <span>
              Volume {volume} · Chapter {chapter}
            </span>
          ) : null}
        </div>
        {(() => {
          const list = work && volume ? chaptersByWorkVolume[work]?.[volume] ?? [] : [];
          const idx = list.indexOf(chapter ?? "");
          const pct = list.length > 0 && idx >= 0 ? Math.round(((idx + 1) / list.length) * 100) : 0;
          return <span>{list.length > 0 && idx >= 0 ? `${idx + 1}/${list.length} · ${pct}%` : ""}</span>;
        })()}
      </div>
      <div className="h-2 w-full bg-gray-200 rounded">
        {(() => {
          const list = work && volume ? chaptersByWorkVolume[work]?.[volume] ?? [] : [];
          const idx = list.indexOf(chapter ?? "");
          const pct = list.length > 0 && idx >= 0 ? Math.round(((idx + 1) / list.length) * 100) : 0;
          return <div className="h-2 bg-gray-400 rounded" style={{ width: `${pct}%` }} />;
        })()}
      </div>
      <article className="bg-white p-6 rounded-lg shadow whitespace-pre-wrap leading-7 text-gray-800">
        {content}
      </article>
      <div className="flex items-center justify-between">
        {(() => {
          const prev = prevPosition(work, volume, chapter);
          const next = nextPosition(work, volume, chapter);
          return (
            <>
              <div className="inline-flex rounded-lg bg-gray-200 p-1">
                <button
                  disabled={!prev}
                  onClick={() => {
                    if (!prev) return;
                    setVolume(prev.volume);
                    setChapter(prev.chapter);
                    fetchChapter(work, prev.volume, prev.chapter);
                    chaptersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`px-4 py-2 rounded-md ${prev ? "bg-white shadow text-gray-900" : "text-gray-600 opacity-50 cursor-not-allowed"}`}
                >
                  ‹ Prev
                </button>
              </div>
              <div className="inline-flex rounded-lg bg-gray-200 p-1">
                <button
                  disabled={!next}
                  onClick={() => {
                    if (!next) return;
                    setVolume(next.volume);
                    setChapter(next.chapter);
                    fetchChapter(work, next.volume, next.chapter);
                    chaptersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`px-4 py-2 rounded-md ${next ? "bg-white shadow text-gray-900" : "text-gray-600 opacity-50 cursor-not-allowed"}`}
                >
                  Next ›
                </button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
