export default async function Home() {
  const repos: Repo[] = await fetch('https://api.github.com/users/gy6543721/repos').then(res => res.json())
  .then(repos => {
    const filtered = repos.filter((repo: Repo & { fork?: boolean }) => !repo.fork);
    return filtered.sort((a: Repo, b: Repo) =>
      b.stargazers_count - a.stargazers_count || 
      b.forks_count - a.forks_count
    );
  });

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Lin&apos;s GitHub</h1>
      <p className="text-gray-600 text-center text-sm mb-4">Android｜iOS｜Web｜AI｜ 🇹🇼-🇺🇸-🇯🇵-🇫🇷</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo: Repo) => (
          <div key={repo.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              <a 
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {repo.name}
              </a>
            </h2>
            <p className="text-gray-600 mb-4">{repo.description || 'No description'}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">⭐ {repo.stargazers_count}</span>
              <span>{repo.language}</span>
            </div>
          </div>
        ))}
      </div>
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
