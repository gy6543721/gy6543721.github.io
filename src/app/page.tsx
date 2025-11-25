import { promises as fs } from "fs";
import path from "path";
import Tabs from "./tabs";
import WritingViewer from "./viewer";

export default async function Home() {
  const repos: Repo[] = await fetch("https://api.github.com/users/gy6543721/repos")
    .then((res) => res.json())
    .then((repos) => {
      const filtered = repos.filter((repo: Repo & { fork?: boolean }) => !repo.fork);
      return filtered.sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count);
    });

  const novelsRoot = path.join(process.cwd(), "public", "novels");
  let works: string[] = [];
  const volumesByWork: Record<string, string[]> = {};
  const chaptersByWorkVolume: Record<string, Record<string, string[]>> = {};
  const contentByWorkVolumeChapter: Record<string, Record<string, Record<string, string>>> = {};
  let selectedWork: string | undefined;
  let selectedVolume: string | undefined;
  let selectedChapter: string | undefined;
  let initialContent = "";

  try {
    await fs.access(novelsRoot);
    const workDirs = await fs.readdir(novelsRoot, { withFileTypes: true });
    works = workDirs.filter((d) => d.isDirectory()).map((d) => d.name);
    for (const w of works) {
      const workDir = path.join(novelsRoot, w);
      const entries = await fs.readdir(workDir, { withFileTypes: true });
      const volumes = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
      volumesByWork[w] = volumes;
      chaptersByWorkVolume[w] = {};
      contentByWorkVolumeChapter[w] = {};
      for (const v of volumes) {
        const volDir = path.join(novelsRoot, w, v);
        const files = await fs.readdir(volDir, { withFileTypes: true });
        const chapters = files
          .filter((f) => f.isFile() && f.name.endsWith(".md"))
          .map((f) => f.name.replace(/\.md$/, ""))
          .sort();
        chaptersByWorkVolume[w][v] = chapters;
        contentByWorkVolumeChapter[w][v] = {};
        for (const c of chapters) {
          const filePath = path.join(volDir, `${c}.md`);
          try {
            const txt = await fs.readFile(filePath, "utf8");
            contentByWorkVolumeChapter[w][v][c] = txt;
          } catch {
            contentByWorkVolumeChapter[w][v][c] = "";
          }
        }
      }
    }
    selectedWork = works[0];
    const availableVolumes = selectedWork ? volumesByWork[selectedWork] ?? [] : [];
    selectedVolume = availableVolumes[0];
    const availableChapters = selectedWork && selectedVolume ? chaptersByWorkVolume[selectedWork]?.[selectedVolume] ?? [] : [];
    selectedChapter = availableChapters[0];
    if (selectedWork && selectedVolume && selectedChapter) {
      const filePath = path.join(novelsRoot, selectedWork, selectedVolume, `${selectedChapter}.md`);
      try {
        initialContent = await fs.readFile(filePath, "utf8");
      } catch {}
    }
  } catch {}

  const initialTab = "coding";

  return (
        <main className="min-h-screen p-8 bg-gray-50">
      <Tabs
        initialTab={initialTab as "writing" | "coding"}
        writingHeader={
          <div>
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Lin&apos;s World</h2>
            <p className="text-gray-600 text-center text-sm mb-4">A world of best stories</p>
          </div>
        }
        codingHeader={
          <div>
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Lin&apos;s GitHub</h2>
            <p className="text-gray-600 text-center text-sm mb-4">Android｜iOS｜Web｜AI｜ 🇹🇼-🇺🇸-🇯🇵-🇫🇷</p>
          </div>
        }
        writing={
          <div className="max-w-4xl mx-auto">
            {works.length === 0 ? (
              <div className="text-center text-gray-600">No novels found in public/novels</div>
            ) : (
              <WritingViewer
                works={works}
                volumesByWork={volumesByWork}
                chaptersByWorkVolume={chaptersByWorkVolume}
                initialWork={selectedWork}
                initialVolume={selectedVolume}
                initialChapter={selectedChapter}
                initialContent={initialContent}
              />
            )}
          </div>
        }
        coding={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo: Repo) => (
              <div key={repo.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    {repo.name}
                  </a>
                </h2>
                <p className="text-gray-600 mb-4">{repo.description || "No description"}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">⭐ {repo.stargazers_count}</span>
                  <span>{repo.language}</span>
                </div>
              </div>
            ))}
          </div>
        }
      />
    </main>
  );
}

interface Repo {
  id: string;
  html_url: string;
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  forks_count: number;
}
