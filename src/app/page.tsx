import { promises as fs } from "fs";
import path from "path";
import Tabs from "./tabs";

export default async function Home({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const repos: Repo[] = await fetch("https://api.github.com/users/gy6543721/repos")
    .then((res) => res.json())
    .then((repos) => {
      const filtered = repos.filter((repo: Repo & { fork?: boolean }) => !repo.fork);
      return filtered.sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count);
    });

  const novelsRoot = path.join(process.cwd(), "src", "app", "novels");
  let works: string[] = [];
  const volumesByWork: Record<string, string[]> = {};
  let selectedWork: string | undefined;
  let selectedVolume: string | undefined;
  let chapterContent = "";

  try {
    await fs.access(novelsRoot);
    const workDirs = await fs.readdir(novelsRoot, { withFileTypes: true });
    works = workDirs.filter((d) => d.isDirectory()).map((d) => d.name);
    for (const w of works) {
      const workDir = path.join(novelsRoot, w);
      const entries = await fs.readdir(workDir, { withFileTypes: true });
      const volumes = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
      volumesByWork[w] = volumes;
    }
    const qWork = typeof searchParams?.work === "string" ? searchParams?.work : undefined;
    const qVolume = typeof searchParams?.volume === "string" ? searchParams?.volume : undefined;
    selectedWork = qWork && works.includes(qWork) ? qWork : works[0];
    const availableVolumes = selectedWork ? volumesByWork[selectedWork] ?? [] : [];
    selectedVolume = qVolume && availableVolumes.includes(qVolume) ? qVolume : availableVolumes[0];
    if (selectedWork && selectedVolume) {
      const filePath = path.join(novelsRoot, selectedWork, selectedVolume, `001.md`);
      try {
        chapterContent = await fs.readFile(filePath, "utf8");
      } catch {}
    }
  } catch {}

  const initialTab = (typeof searchParams?.tab === "string" ? searchParams?.tab : undefined) === "writing" ? "writing" : "coding";

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
              <div className="text-center text-gray-600">No novels found in src/app/novels</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Works</h3>
                  <div className="flex flex-wrap gap-2">
                    {works.map((w) => (
                      <a key={w} href={`?tab=writing&work=${encodeURIComponent(w)}`} className={`px-3 py-1 rounded border ${selectedWork === w ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                        {w}
                      </a>
                    ))}
                  </div>
                </div>
                {selectedWork ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Volumes</h3>
                    <div className="flex flex-wrap gap-2">
                      {(volumesByWork[selectedWork] ?? []).map((v) => (
                        <a key={v} href={`?tab=writing&work=${encodeURIComponent(selectedWork)}&volume=${encodeURIComponent(v)}`} className={`px-3 py-1 rounded border ${selectedVolume === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                          {v}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
                <article className="bg-white p-6 rounded-lg shadow whitespace-pre-wrap leading-7 text-gray-800">
                  {chapterContent || ""}
                </article>
              </div>
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
