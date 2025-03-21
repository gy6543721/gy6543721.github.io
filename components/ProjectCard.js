import Link from 'next/link'

export default function ProjectCard({ repo }) {
  return (
    <div className="project-card">
      <h3>
        <Link href={repo.html_url} target="_blank">
          {repo.name}
        </Link>
      </h3>
      <p>{repo.description}</p>
      <div className="meta-info">
        <span>⭐ {repo.stargazers_count}</span>
        <br></br>
        <span>📅 {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
      <style jsx>{`
        .project-card {
          padding: 1.5rem;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: transform 0.2s;
        }
        .project-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  )
}