import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ProjectCard from '../components/ProjectCard'

export default function Home({ repos }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lin's Portfolio</title>
        <meta name="description" content="Lin's Portfolio" />
      </Head>

      <main className={styles.main}>
        {/* Self Introduction */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Hi, I'm <span className={styles.highlight}>Levi Lin</span>
          </h1>
          <p className={styles.description}>
          Android｜iOS｜Web｜AI｜🇹🇼🇺🇸🇯🇵🇫🇷
          </p>
        </section>

        {/* Repositories */}
        <section className={styles.projects}>
          <h2>Featured Projects</h2>
          <div className={styles.grid}>
            {repos.map(repo => (
              <ProjectCard key={repo.id} repo={repo} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  // GitHub Repositories API
  const res = await fetch('https://api.github.com/users/gy6543721/repos')
  const repos = await res.json()
  
  return {
    props: {
      repos: repos.filter(repo => !repo.fork)
    },
    revalidate: 3600 // Hourly Update
  }
}